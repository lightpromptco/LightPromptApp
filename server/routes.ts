import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./supabaseStorage";
import { ObjectStorageService } from "./objectStorage";
import { generateBotResponse, transcribeAudio, generateSpeech, analyzeSentiment } from "./openai";
import { 
  insertUserSchema, insertChatSessionSchema, insertMessageSchema, 
  insertUserProfileSchema 
} from "@shared/schema";
import multer from "multer";
import { z } from "zod";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: error?.message || 'Failed to create user' });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.get("/api/users/email/:email", async (req, res) => {
    try {
      const user = await storage.getUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // User profile routes
  app.get("/api/users/:userId/profile", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  app.patch("/api/users/:userId/profile", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateUserProfile(req.params.userId, updates);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Chat session routes
  app.get("/api/users/:userId/sessions", async (req, res) => {
    try {
      const sessions = await storage.getUserChatSessions(req.params.userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get sessions" });
    }
  });

  app.get("/api/users/:userId/sessions/:botId", async (req, res) => {
    try {
      const sessions = await storage.getBotChatSessions(req.params.userId, req.params.botId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get bot sessions" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || 'Failed to create session' });
    }
  });

  app.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to get session" });
    }
  });

  // Message routes
  app.get("/api/sessions/:sessionId/messages", async (req, res) => {
    try {
      const messages = await storage.getSessionMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || 'Failed to create message' });
    }
  });

  // Chat completion route
  app.post("/api/chat", async (req, res) => {
    try {
      const { userId, sessionId, botId, content } = req.body;

      // Check user token limits
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.tokensUsed >= user.tokenLimit) {
        return res.status(429).json({ error: "Token limit reached" });
      }

      // Get conversation history
      const messages = await storage.getSessionMessages(sessionId);
      const conversationHistory = messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));

      // Analyze user message sentiment
      const userSentiment = await analyzeSentiment(content);

      // Save user message
      await storage.createMessage({
        sessionId,
        role: "user",
        content,
        sentiment: userSentiment.sentiment,
        sentimentScore: userSentiment.score
      });

      // Generate bot response
      const botResponse = await generateBotResponse(botId, content, conversationHistory);

      // Save bot message
      const botMessage = await storage.createMessage({
        sessionId,
        role: "assistant",
        content: botResponse.content,
        sentiment: botResponse.sentiment || "neutral",
        sentimentScore: botResponse.sentimentScore || 0
      });

      // Increment token usage
      await storage.incrementTokenUsage(userId);

      // Update user profile mood based on sentiment
      if (userSentiment.sentiment !== "neutral") {
        await storage.updateUserProfile(userId, {
          currentMood: userSentiment.sentiment,
          moodDescription: userSentiment.score > 50 ? "Feeling uplifted and positive" :
                          userSentiment.score < -50 ? "Experiencing some challenges" :
                          "Feeling balanced and centered"
        });
      }

      res.json({
        message: botMessage,
        userSentiment: {
          sentiment: userSentiment.sentiment,
          score: userSentiment.score
        }
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
  });

  // Voice transcription route
  app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const transcription = await transcribeAudio(req.file.buffer);
      res.json({ text: transcription });
    } catch (error) {
      console.error("Transcription error:", error);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  // Text-to-speech route
  app.post("/api/tts", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "No text provided" });
      }

      const audioBuffer = await generateSpeech(text);
      
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      res.send(audioBuffer);
    } catch (error) {
      console.error("TTS error:", error);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  // Object storage routes for avatars
  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Upload URL error:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  app.put("/api/users/:userId/avatar", async (req, res) => {
    try {
      const { userId } = req.params;
      const { avatarURL } = req.body;

      if (!avatarURL) {
        return res.status(400).json({ error: "avatarURL is required" });
      }

      const objectStorageService = new ObjectStorageService();
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        avatarURL,
        {
          owner: userId,
          visibility: "public", // Profile images should be public
        }
      );

      // Update user avatar
      await storage.updateUser(userId, { avatarUrl: objectPath });

      res.json({ objectPath });
    } catch (error) {
      console.error("Error setting avatar:", error);
      res.status(500).json({ error: "Failed to update avatar" });
    }
  });

  // Admin middleware to check if user is admin
  const requireAdmin = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Authorization header required" });
      }

      const userId = authHeader.replace('Bearer ', '');
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: "Admin access required" });
      }

      req.adminUser = user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid authorization" });
    }
  };

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      // For now, allow any user to get all users for demo purposes
      // In production, you'd use requireAdmin middleware
      const { data, error } = await (storage as any).supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data || []);
    } catch (error: any) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      // For now, allow any user to update for demo purposes
      // In production, you'd use requireAdmin middleware
      const userId = req.params.id;
      const updates = req.body;
      
      const user = await storage.updateUser(userId, updates);
      res.json(user);
    } catch (error: any) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.post("/api/admin/users/:id/reset-tokens", async (req, res) => {
    try {
      // For now, allow any user to reset tokens for demo purposes  
      // In production, you'd use requireAdmin middleware
      const userId = req.params.id;
      
      await storage.resetTokenUsage(userId);
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error: any) {
      console.error("Error resetting tokens:", error);
      res.status(500).json({ error: "Failed to reset tokens" });
    }
  });

  // Serve private objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "Object not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
