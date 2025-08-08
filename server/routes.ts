import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService } from "./objectStorage";
import { generateBotResponse, transcribeAudio, generateSpeech, analyzeSentiment } from "./openai";
import { generateBirthChart } from "./astrology";
import { 
  insertUserSchema, insertChatSessionSchema, insertMessageSchema, 
  insertUserProfileSchema, insertAccessCodeSchema, redeemAccessCodeSchema,
  insertWellnessMetricSchema, insertHabitSchema, insertHabitEntrySchema,
  insertAppleHealthDataSchema, insertHomeKitDataSchema
} from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import Stripe from "stripe";

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create admin user on startup (only if doesn't exist)
  (async () => {
    try {
      const existingAdmin = await storage.getUserByEmail('lightprompt.co@gmail.com');
      if (!existingAdmin) {
        const admin = await storage.createUser({
          email: 'lightprompt.co@gmail.com',
          name: 'LightPrompt Admin'
        });
        
        // Update admin with special privileges
        await storage.updateUser(admin.id, {
          tier: 'admin',
          role: 'admin',
          tokensUsed: 0,
          tokenLimit: 999999,
          courseAccess: true
        });
        console.log('✅ Admin user created:', admin.email);
      } else {
        console.log('✅ Admin user already exists:', existingAdmin.email);
      }
    } catch (error) {
      console.error('❌ Failed to create admin user:', error);
    }
  })();
  
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

  // Birth Chart Generation
  app.post("/api/birth-chart", async (req, res) => {
    try {
      const { day, month, year, hour, min, lat, lon, tzone } = req.body;
      
      // Validate required fields
      if (!day || !month || !year || !hour || min === undefined || !lat || !lon) {
        return res.status(400).json({ 
          error: "Missing required fields: day, month, year, hour, min, lat, lon" 
        });
      }
      
      // Generate birth chart using astronomical calculations
      const birthChart = await generateBirthChart({
        day, month, year, hour, min, lat, lon, tzone: tzone || 0
      });
      
      res.json(birthChart);
    } catch (error) {
      console.error("Birth chart generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate birth chart",
        details: error instanceof Error ? error.message : "Unknown error"
      });
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
      // Simple list of all users from in-memory storage
      const users = Array.from((storage as any).users.values());
      res.json(users);
    } catch (error: any) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  // Admin override - set user to admin tier (for development)
  app.post("/api/admin/override/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await storage.updateUser(userId, { 
        tier: 'admin',
        role: 'admin',
        tokenLimit: 1000 // Give admin users high token limit
      });
      res.json({ message: 'User granted admin access', user });
    } catch (error: any) {
      console.error("Error setting admin:", error);
      res.status(500).json({ error: "Failed to set admin access" });
    }
  });

  // Get current user's admin status
  app.get("/api/admin/check/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ 
        isAdmin: user.tier === 'admin' || user.role === 'admin',
        tier: user.tier,
        role: user.role,
        tokenLimit: user.tokenLimit
      });
    } catch (error: any) {
      console.error("Error checking admin:", error);
      res.status(500).json({ error: "Failed to check admin status" });
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

  // Access code routes
  app.post("/api/access-codes", async (req, res) => {
    try {
      const accessCodeData = insertAccessCodeSchema.parse(req.body);
      const accessCode = await storage.createAccessCode(accessCodeData);
      res.json(accessCode);
    } catch (error: any) {
      console.error("Error creating access code:", error);
      res.status(400).json({ error: error?.message || 'Failed to create access code' });
    }
  });

  // Generate test access code (for development)
  app.post("/api/generate-test-code", async (req, res) => {
    try {
      // Generate a readable access code format: XXXX-XXXX-XXXX
      const generateReadableCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
          if (i > 0 && i % 4 === 0) result += '-';
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      let code = generateReadableCode();
      
      // Ensure code is unique
      while (await storage.getAccessCode(code)) {
        code = generateReadableCode();
      }

      // Set expiration date (1 year from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 365);

      // Create the access code
      const accessCode = await storage.createAccessCode({
        code,
        type: 'course',
        expiresAt,
        metadata: {
          courseTitle: 'LightPrompt:Ed',
          generatedAt: new Date().toISOString(),
          tokenLimit: 50
        }
      });

      res.json({ code, accessCode });
    } catch (error: any) {
      console.error("Error generating test code:", error);
      res.status(500).json({ error: error?.message || 'Failed to generate test code' });
    }
  });

  app.post("/api/redeem-access-code", async (req, res) => {
    try {
      const { code, email } = redeemAccessCodeSchema.parse(req.body);
      
      // Find or create user with this email
      let user = await storage.getUserByEmail(email);
      if (!user) {
        user = await storage.createUser({ 
          email, 
          name: email.split('@')[0] // Use part before @ as default name
        });
      }

      // Redeem the access code
      const redeemedCode = await storage.redeemAccessCode(code, user.id);
      
      // Return updated user
      const updatedUser = await storage.getUser(user.id);
      res.json({ user: updatedUser, accessCode: redeemedCode });
    } catch (error: any) {
      console.error("Error redeeming access code:", error);
      res.status(400).json({ error: error?.message || 'Failed to redeem access code' });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { planId, userId } = req.body;
      
      if (!planId || !userId) {
        return res.status(400).json({ error: "Missing planId or userId" });
      }

      // Plan pricing mapping
      const plans = {
        "growth": { amount: 2900, name: "Growth Plan" }, // $29.00
        "resonance": { amount: 4900, name: "Resonance Plan" }, // $49.00
        "enterprise": { amount: 19900, name: "Enterprise Plan" } // $199.00
      };

      const plan = plans[planId as keyof typeof plans];
      if (!plan) {
        return res.status(400).json({ error: "Invalid plan ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.amount,
        currency: "usd",
        metadata: {
          userId,
          planId,
          planName: plan.name,
          userEmail: user.email
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ 
        error: "Failed to create payment intent", 
        details: error.message 
      });
    }
  });

  // Confirm payment and upgrade user tier
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Missing paymentIntentId" });
      }

      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === "succeeded") {
        const { userId, planId } = paymentIntent.metadata;
        
        if (!userId || !planId) {
          return res.status(400).json({ error: "Missing user or plan data in payment" });
        }

        // Upgrade user tier
        const upgradedUser = await storage.upgradeTier(userId, planId);
        
        res.json({ 
          success: true, 
          user: upgradedUser,
          message: "Payment successful and tier upgraded!" 
        });
      } else {
        res.status(400).json({ 
          error: "Payment not completed", 
          status: paymentIntent.status 
        });
      }
    } catch (error: any) {
      console.error("Payment confirmation error:", error);
      res.status(500).json({ 
        error: "Failed to confirm payment", 
        details: error.message 
      });
    }
  });

  // Stripe webhook for payment confirmations
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const event = req.body;
      
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const { userId, planId } = paymentIntent.metadata;
          
          if (userId && planId) {
            // Upgrade user tier
            await storage.upgradeTier(userId, planId);
            console.log(`✅ User ${userId} upgraded to ${planId} tier`);
          }
          break;
        
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook error:", error);
      res.status(500).json({ error: "Webhook failed" });
    }
  });

  // Challenge API endpoints
  
  // Get all available challenges
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error getting challenges:", error);
      res.status(500).json({ error: "Failed to get challenges" });
    }
  });
  
  // Join a challenge
  app.post("/api/challenges/:challengeId/join", async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      const userChallenge = await storage.joinChallenge(userId, challengeId);
      res.json(userChallenge);
    } catch (error: any) {
      console.error("Error joining challenge:", error);
      res.status(500).json({ error: error.message || "Failed to join challenge" });
    }
  });
  
  // Update challenge progress
  app.post("/api/challenges/:challengeId/progress", async (req, res) => {
    try {
      const { challengeId } = req.params;
      const { userId, day, completed, notes } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      await storage.updateChallengeProgress(challengeId, userId, day, completed, notes);
      
      // Award points for completing daily tasks
      if (completed) {
        await storage.awardPoints(userId, 10, "daily_task", challengeId, `Completed day ${day}`);
      }
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating challenge progress:", error);
      res.status(500).json({ error: error.message || "Failed to update progress" });
    }
  });
  
  // Get user's challenges
  app.get("/api/users/:userId/challenges", async (req, res) => {
    try {
      const userChallenges = await storage.getUserChallenges(req.params.userId);
      res.json(userChallenges);
    } catch (error) {
      console.error("Error getting user challenges:", error);
      res.status(500).json({ error: "Failed to get user challenges" });
    }
  });
  
  // Get user stats (points, level, streaks)
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      console.error("Error getting user stats:", error);
      res.status(500).json({ error: "Failed to get user stats" });
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

  // VibeMatch API Routes
  
  // Vibe Profile routes
  app.get("/api/vibe-profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getVibeProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error getting vibe profile:", error);
      res.status(500).json({ error: "Failed to get vibe profile" });
    }
  });

  app.post("/api/vibe-profile", async (req, res) => {
    try {
      const profileData = req.body;
      const profile = await storage.createOrUpdateVibeProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating/updating vibe profile:", error);
      res.status(500).json({ error: "Failed to save vibe profile" });
    }
  });

  // Match discovery routes
  app.get("/api/vibe-matches/potential/:userId", async (req, res) => {
    try {
      const matches = await storage.getPotentialMatches(req.params.userId);
      res.json(matches);
    } catch (error) {
      console.error("Error getting potential matches:", error);
      res.status(500).json({ error: "Failed to get potential matches" });
    }
  });

  app.get("/api/vibe-matches/current/:userId", async (req, res) => {
    try {
      const matches = await storage.getCurrentMatches(req.params.userId);
      res.json(matches);
    } catch (error) {
      console.error("Error getting current matches:", error);
      res.status(500).json({ error: "Failed to get current matches" });
    }
  });

  app.post("/api/vibe-matches/action", async (req, res) => {
    try {
      const { userId, matchUserId, action } = req.body;
      const result = await storage.processMatchAction(userId, matchUserId, action);
      res.json(result);
    } catch (error) {
      console.error("Error processing match action:", error);
      res.status(500).json({ error: "Failed to process match action" });
    }
  });

  // Secure chat routes
  app.get("/api/match-chat/:matchId", async (req, res) => {
    try {
      const { matchId } = req.params;
      const { userId } = req.query;
      const messages = await storage.getMatchChatMessages(matchId, userId as string);
      res.json(messages);
    } catch (error) {
      console.error("Error getting chat messages:", error);
      res.status(500).json({ error: "Failed to get chat messages" });
    }
  });

  app.post("/api/match-chat", async (req, res) => {
    try {
      const { matchId, senderId, receiverId, message, messageType, reflectionPromptId } = req.body;
      
      // AI moderation simulation (replace with actual Anthropic call)
      const aiModerationScore = Math.floor(Math.random() * 20) + 80; // 80-100
      const resonanceContribution = message.length > 50 && messageType === 'reflection_prompt' ? 1 : 0;
      
      const chatMessage = await storage.createMatchChatMessage({
        matchId,
        senderId,
        receiverId,
        message,
        messageType: messageType || 'text',
        reflectionPromptId,
        aiModerationScore,
        resonanceContribution
      });
      
      // Update match resonance if contribution was made
      if (resonanceContribution > 0) {
        await storage.updateMatchResonance(matchId, resonanceContribution);
      }
      
      res.json({ 
        ...chatMessage, 
        aiModerationScore, 
        resonanceContribution 
      });
    } catch (error) {
      console.error("Error sending chat message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Safety reporting
  app.post("/api/chat-safety-report", async (req, res) => {
    try {
      const { chatId, userId, actionType, reason } = req.body;
      const report = await storage.createChatSafetyLog({
        chatId,
        userId,
        actionType,
        reason
      });
      res.json(report);
    } catch (error) {
      console.error("Error creating safety report:", error);
      res.status(500).json({ error: "Failed to create safety report" });
    }
  });

  // Reflection prompts
  app.get("/api/reflection-prompts", async (req, res) => {
    try {
      const prompts = await storage.getReflectionPrompts();
      res.json(prompts);
    } catch (error) {
      console.error("Error getting reflection prompts:", error);
      res.status(500).json({ error: "Failed to get reflection prompts" });
    }
  });

  // Prism Points
  app.get("/api/prism-points/:userId", async (req, res) => {
    try {
      const prismPoints = await storage.getPrismPoints(req.params.userId);
      res.json(prismPoints);
    } catch (error) {
      console.error("Error getting prism points:", error);
      res.status(500).json({ error: "Failed to get prism points" });
    }
  });

  // TEST BYPASS ROUTES - For development/demo purposes
  app.post("/api/vibe-match/test-setup/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const result = await storage.setupVibeMatchTestData(userId);
      res.json({ message: "Test data created successfully", ...result });
    } catch (error) {
      console.error("Error setting up test data:", error);
      res.status(500).json({ error: "Failed to setup test data" });
    }
  });

  // Partner Connection routes
  app.get("/api/partner-connections/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const connections = await storage.getPartnerConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching partner connections:", error);
      res.status(500).json({ error: "Failed to fetch partner connections" });
    }
  });

  app.post("/api/partner-connections/invite", async (req, res) => {
    try {
      const { userId, inviteEmail, relationshipType } = req.body;
      if (!userId || !inviteEmail || !relationshipType) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const result = await storage.invitePartner(userId, inviteEmail, relationshipType);
      res.json(result);
    } catch (error) {
      console.error("Error sending partner invitation:", error);
      res.status(500).json({ error: "Failed to send invitation" });
    }
  });

  app.post("/api/partner-connections/:connectionId/goals", async (req, res) => {
    try {
      const connectionId = req.params.connectionId;
      const { goal } = req.body;
      
      if (!goal) {
        return res.status(400).json({ error: "Goal is required" });
      }

      // Get existing connection and add goal to shared goals
      const connection = await storage.updatePartnerConnection(connectionId, {
        sharedGoals: [] // Will be properly implemented when we have the get method
      });
      
      res.json(connection);
    } catch (error) {
      console.error("Error updating partner goal:", error);
      res.status(500).json({ error: "Failed to update goal" });
    }
  });

  // User Preferences routes  
  app.get("/api/user-preferences/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const preferences = await storage.getUserPreferences(userId);
      
      if (!preferences) {
        return res.status(404).json({ error: "Preferences not found" });
      }
      
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.post("/api/user-preferences/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const updates = req.body;
      
      const preferences = await storage.createOrUpdateUserPreferences({
        userId,
        ...updates
      });
      
      res.json(preferences);
    } catch (error) {
      console.error("Error saving user preferences:", error);
      res.status(500).json({ error: "Failed to save preferences" });
    }
  });

  // Wellness Dashboard API Routes
  
  // Get comprehensive dashboard data
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      
      // Get all dashboard data in parallel
      const [metrics, habits, patterns, appleHealth, homeKit] = await Promise.all([
        storage.getWellnessMetrics(userId, days),
        storage.getUserHabits(userId),
        storage.getWellnessPatterns(userId),
        storage.getAppleHealthData(userId, days),
        storage.getHomeKitData(userId, days)
      ]);
      
      // Get habit entries for each habit
      const habitEntries: Record<string, any[]> = {};
      for (const habit of habits) {
        habitEntries[habit.id] = await storage.getHabitEntries(habit.id, days);
      }
      
      // Detect new patterns
      await storage.detectPatterns(userId);
      
      res.json({
        metrics,
        habits,
        habitEntries,
        patterns,
        appleHealth,
        homeKit
      });
    } catch (error) {
      console.error("Error getting dashboard data:", error);
      res.status(500).json({ error: "Failed to get dashboard data" });
    }
  });
  
  // Wellness Metrics
  app.post("/api/wellness-metrics", async (req, res) => {
    try {
      const metricData = insertWellnessMetricSchema.parse(req.body);
      const metric = await storage.createWellnessMetric(metricData);
      res.json(metric);
    } catch (error: any) {
      console.error("Error creating wellness metric:", error);
      res.status(400).json({ error: error?.message || 'Failed to create wellness metric' });
    }
  });
  
  app.get("/api/wellness-metrics/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const metrics = await storage.getWellnessMetrics(userId, days);
      res.json(metrics);
    } catch (error) {
      console.error("Error getting wellness metrics:", error);
      res.status(500).json({ error: "Failed to get wellness metrics" });
    }
  });

  // Habits
  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(habitData);
      res.json(habit);
    } catch (error: any) {
      console.error("Error creating habit:", error);
      res.status(400).json({ error: error?.message || 'Failed to create habit' });
    }
  });

  app.get("/api/habits/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const habits = await storage.getUserHabits(userId);
      res.json(habits);
    } catch (error) {
      console.error("Error getting habits:", error);
      res.status(500).json({ error: "Failed to get habits" });
    }
  });

  // Habit Entries
  app.post("/api/habit-entries", async (req, res) => {
    try {
      const entryData = insertHabitEntrySchema.parse(req.body);
      const entry = await storage.createHabitEntry(entryData);
      res.json(entry);
    } catch (error: any) {
      console.error("Error creating habit entry:", error);
      res.status(400).json({ error: error?.message || 'Failed to create habit entry' });
    }
  });
  
  // Apple Health Data
  app.post("/api/apple-health", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(habitData);
      res.json(habit);
    } catch (error: any) {
      console.error("Error creating habit:", error);
      res.status(400).json({ error: error?.message || 'Failed to create habit' });
    }
  });
  
  app.get("/api/habits/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const habits = await storage.getUserHabits(userId);
      res.json(habits);
    } catch (error) {
      console.error("Error getting habits:", error);
      res.status(500).json({ error: "Failed to get habits" });
    }
  });
  
  app.put("/api/habits/:habitId", async (req, res) => {
    try {
      const { habitId } = req.params;
      const updates = req.body;
      const habit = await storage.updateHabit(habitId, updates);
      res.json(habit);
    } catch (error: any) {
      console.error("Error updating habit:", error);
      res.status(400).json({ error: error?.message || 'Failed to update habit' });
    }
  });
  
  app.delete("/api/habits/:habitId", async (req, res) => {
    try {
      const { habitId } = req.params;
      await storage.deleteHabit(habitId);
      res.json({ message: "Habit deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting habit:", error);
      res.status(400).json({ error: error?.message || 'Failed to delete habit' });
    }
  });
  
  // Habit Entries
  app.post("/api/habit-entries", async (req, res) => {
    try {
      const entryData = insertHabitEntrySchema.parse(req.body);
      const entry = await storage.createHabitEntry(entryData);
      res.json(entry);
    } catch (error: any) {
      console.error("Error creating habit entry:", error);
      res.status(400).json({ error: error?.message || 'Failed to create habit entry' });
    }
  });
  
  app.get("/api/habit-entries/:habitId", async (req, res) => {
    try {
      const { habitId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const entries = await storage.getHabitEntries(habitId, days);
      res.json(entries);
    } catch (error) {
      console.error("Error getting habit entries:", error);
      res.status(500).json({ error: "Failed to get habit entries" });
    }
  });
  
  // Apple Health Integration
  app.post("/api/apple-health/sync", async (req, res) => {
    try {
      const healthData = insertAppleHealthDataSchema.parse(req.body);
      const data = await storage.syncAppleHealthData(healthData);
      res.json(data);
    } catch (error: any) {
      console.error("Error syncing Apple Health data:", error);
      res.status(400).json({ error: error?.message || 'Failed to sync Apple Health data' });
    }
  });
  
  app.get("/api/apple-health/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const data = await storage.getAppleHealthData(userId, days);
      res.json(data);
    } catch (error) {
      console.error("Error getting Apple Health data:", error);
      res.status(500).json({ error: "Failed to get Apple Health data" });
    }
  });
  
  // HomeKit Integration
  app.post("/api/homekit/sync", async (req, res) => {
    try {
      const homeKitData = insertHomeKitDataSchema.parse(req.body);
      const data = await storage.syncHomeKitData(homeKitData);
      res.json(data);
    } catch (error: any) {
      console.error("Error syncing HomeKit data:", error);
      res.status(400).json({ error: error?.message || 'Failed to sync HomeKit data' });
    }
  });
  
  app.get("/api/homekit/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const data = await storage.getHomeKitData(userId, days);
      res.json(data);
    } catch (error) {
      console.error("Error getting HomeKit data:", error);
      res.status(500).json({ error: "Failed to get HomeKit data" });
    }
  });
  
  // Wellness Patterns
  app.get("/api/patterns/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const patterns = await storage.getWellnessPatterns(userId);
      res.json(patterns);
    } catch (error) {
      console.error("Error getting wellness patterns:", error);
      res.status(500).json({ error: "Failed to get wellness patterns" });
    }
  });
  
  app.post("/api/patterns/detect/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const patterns = await storage.detectPatterns(userId);
      res.json(patterns);
    } catch (error) {
      console.error("Error detecting patterns:", error);
      res.status(500).json({ error: "Failed to detect patterns" });
    }
  });

  // Fitness data endpoints
  app.get("/api/fitness/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = parseInt(req.query.days as string) || 30;
      const fitnessData = await storage.getFitnessData(userId, days);
      res.json(fitnessData);
    } catch (error) {
      console.error("Error fetching fitness data:", error);
      res.status(500).json({ error: "Failed to fetch fitness data" });
    }
  });

  app.post("/api/fitness", async (req, res) => {
    try {
      const fitnessData = await storage.createFitnessData(req.body);
      res.json(fitnessData);
    } catch (error) {
      console.error("Error saving fitness data:", error);
      res.status(500).json({ error: "Failed to save fitness data" });
    }
  });

  // Recommendations endpoints
  app.get("/api/recommendations/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const recommendations = await storage.getRecommendations(userId, limit);
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ error: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/recommendations/generate/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const recommendations = await storage.generateRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  app.patch("/api/recommendations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateRecommendation(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating recommendation:", error);
      res.status(500).json({ error: "Failed to update recommendation" });
    }
  });

  // Development/Test endpoints
  app.post("/api/test/populate-dashboard/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Create sample wellness metrics for the past week
      const sampleMetrics = [
        { userId, mood: "happy", energy: 8, stress: 3, gratitude: "Morning coffee and sunshine", reflection: "Started the day with intention" },
        { userId, mood: "calm", energy: 7, stress: 4, gratitude: "Good conversation with friend", reflection: "Feeling more centered today" },
        { userId, mood: "energetic", energy: 9, stress: 2, gratitude: "Productive work session", reflection: "Flow state achieved" },
        { userId, mood: "tired", energy: 4, stress: 6, gratitude: "Cozy evening at home", reflection: "Need more rest" },
        { userId, mood: "focused", energy: 6, stress: 5, gratitude: "Learning new things", reflection: "Growth mindset active" }
      ];
      
      // Create sample habits
      const sampleHabits = [
        { userId, name: "Morning Meditation", category: "mindfulness", description: "10 minutes of quiet reflection", icon: "fas fa-om", color: "#8b5cf6" },
        { userId, name: "Daily Walk", category: "fitness", description: "30 minute walk outside", icon: "fas fa-walking", color: "#10b981" },
        { userId, name: "Gratitude Journal", category: "mindfulness", description: "Write 3 things I'm grateful for", icon: "fas fa-heart", color: "#f59e0b" },
        { userId, name: "Reading", category: "learning", description: "Read for 20 minutes", icon: "fas fa-book", color: "#3b82f6" }
      ];
      
      // Populate data
      const metrics = await Promise.all(
        sampleMetrics.map(metric => storage.createWellnessMetric(metric))
      );
      
      const habits = await Promise.all(
        sampleHabits.map(habit => storage.createHabit(habit))
      );
      
      // Add some habit entries
      const habitEntries = [];
      for (const habit of habits) {
        // Mark some as completed for the past few days
        for (let i = 0; i < 3; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          habitEntries.push(await storage.createHabitEntry({
            habitId: habit.id,
            date,
            completed: Math.random() > 0.3, // 70% completion rate
            count: 1
          }));
        }
      }
      
      res.json({
        message: "Dashboard populated with sample data",
        metrics: metrics.length,
        habits: habits.length,
        habitEntries: habitEntries.length
      });
    } catch (error) {
      console.error("Error populating dashboard:", error);
      res.status(500).json({ error: "Failed to populate dashboard" });
    }
  });

  // ===== CHALLENGE SYSTEM ENDPOINTS =====

  // Get all active challenges
  app.get('/api/challenges', async (req, res) => {
    try {
      const challenges = await storage.getActiveChallenges();
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Failed to fetch challenges' });
    }
  });

  // Create new challenge (admin only)
  app.post('/api/challenges', async (req, res) => {
    try {
      const challenge = await storage.createChallenge(req.body);
      res.status(201).json(challenge);
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(500).json({ error: 'Failed to create challenge' });
    }
  });

  // Get specific challenge details
  app.get('/api/challenges/:id', async (req, res) => {
    try {
      const challenge = await storage.getChallengeById(req.params.id);
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      res.json(challenge);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      res.status(500).json({ error: 'Failed to fetch challenge' });
    }
  });

  // Join a challenge
  app.post('/api/challenges/:id/join', async (req, res) => {
    try {
      const { userId } = req.body;
      const participant = await storage.joinChallenge(req.params.id, userId);
      res.status(201).json(participant);
    } catch (error) {
      console.error('Error joining challenge:', error);
      res.status(500).json({ error: 'Failed to join challenge' });
    }
  });

  // Update daily progress
  app.post('/api/challenges/:id/progress', async (req, res) => {
    try {
      const { userId, day, completed, notes, metadata } = req.body;
      const progress = await storage.updateChallengeProgress(req.params.id, userId, {
        day,
        completed,
        notes,
        metadata
      });
      res.json(progress);
    } catch (error) {
      console.error('Error updating progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  });

  // Get user's challenges
  app.get('/api/users/:userId/challenges', async (req, res) => {
    try {
      const challenges = await storage.getUserChallenges(req.params.userId);
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      res.status(500).json({ error: 'Failed to fetch user challenges' });
    }
  });

  // Get user stats and rewards
  app.get('/api/users/:userId/stats', async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user stats' });
    }
  });

  // Award manual reward (admin only)
  app.post('/api/rewards', async (req, res) => {
    try {
      const { userId, rewardId, source, sourceId } = req.body;
      const reward = await storage.awardReward(userId, rewardId, source, sourceId);
      res.status(201).json(reward);
    } catch (error) {
      console.error('Error awarding reward:', error);
      res.status(500).json({ error: 'Failed to award reward' });
    }
  });

  // Get available reward definitions
  app.get('/api/rewards/definitions', async (req, res) => {
    try {
      const rewards = await storage.getRewardDefinitions();
      res.json(rewards);
    } catch (error) {
      console.error('Error fetching reward definitions:', error);
      res.status(500).json({ error: 'Failed to fetch reward definitions' });
    }
  });

  // Get user unlocks
  app.get('/api/users/:userId/unlocks', async (req, res) => {
    try {
      const unlocks = await storage.getUserUnlocks(req.params.userId);
      res.json(unlocks);
    } catch (error) {
      console.error('Error fetching user unlocks:', error);
      res.status(500).json({ error: 'Failed to fetch user unlocks' });
    }
  });

  // Discover easter egg
  app.post('/api/easter-eggs/discover', async (req, res) => {
    try {
      const { userId, eggId, trigger } = req.body;
      if (!userId || !eggId) {
        return res.status(400).json({ error: 'userId and eggId are required' });
      }
      
      const discovery = await storage.discoverEasterEgg(userId, eggId);
      res.status(201).json(discovery);
    } catch (error) {
      console.error('Error discovering easter egg:', error);
      res.status(500).json({ error: error.message || 'Failed to discover easter egg' });
    }
  });

  // Get user's discovered easter eggs
  app.get('/api/users/:userId/easter-eggs', async (req, res) => {
    try {
      // For now, return mock discovered eggs
      const discoveredEggs = [
        {
          id: 'secret-finder-discovery',
          userId: req.params.userId,
          eggId: 'meditation-timer-clicks',
          name: 'Time Bender',
          description: 'Patience reveals hidden paths.',
          points: 25,
          discoveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      res.json(discoveredEggs);
    } catch (error) {
      console.error('Error fetching discovered easter eggs:', error);
      res.status(500).json({ error: 'Failed to fetch easter eggs' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
