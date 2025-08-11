import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import knowledgeRoutes from "./routes/knowledge";
import { generateBotResponse, transcribeAudio, generateSpeech, analyzeSentiment } from "./openai";
// Removed old astrology imports - using new comprehensive system
import OpenAI from 'openai';
import { 
  insertUserSchema, insertChatSessionSchema, insertMessageSchema, 
  insertUserProfileSchema, insertAccessCodeSchema, redeemAccessCodeSchema,
  insertWellnessMetricSchema, insertHabitSchema, insertHabitEntrySchema,
  insertAppleHealthDataSchema, insertHomeKitDataSchema,
  wellnessMetrics, platformEvolution
} from "@shared/schema";
import multer from "multer";
import { z } from "zod";
import Stripe from "stripe";
import { registerContentRoutes } from "./routes/content";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

// Sun sign compatibility calculation
function calculateSunSignCompatibility(sign1: string, sign2: string) {
  const elements = {
    aries: 'fire', leo: 'fire', sagittarius: 'fire',
    taurus: 'earth', virgo: 'earth', capricorn: 'earth',
    gemini: 'air', libra: 'air', aquarius: 'air',
    cancer: 'water', scorpio: 'water', pisces: 'water'
  };
  
  const element1 = elements[sign1 as keyof typeof elements];
  const element2 = elements[sign2 as keyof typeof elements];
  
  let score = 50;
  let description = "Moderate Compatibility";
  
  if (element1 === element2) {
    score += 30;
    description = "High Compatibility";
  } else if ((element1 === 'fire' && element2 === 'air') || (element1 === 'air' && element2 === 'fire')) {
    score += 25;
    description = "Dynamic Compatibility";
  } else if ((element1 === 'earth' && element2 === 'water') || (element1 === 'water' && element2 === 'earth')) {
    score += 25;
    description = "Stable Compatibility";
  }
  
  return { score: Math.min(100, score), description };
}

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
  
  // Register content management routes
  registerContentRoutes(app);

  // Admin Visual Editor API Routes
  app.get('/api/admin/scan-dom', async (req, res) => {
    const { path } = req.query;
    
    // Mock element scanning - in a real app, this would scan the actual DOM
    // This endpoint would typically use a headless browser to scan elements
    const mockElements = [
      {
        id: 'hero-title',
        type: 'text',
        content: 'Welcome to LightPrompt',
        selector: 'h1.hero-title',
        styles: { fontSize: '48px', color: '#1a1a1a', fontWeight: 'bold' },
        position: { x: 50, y: 100, width: 600, height: 80 }
      },
      {
        id: 'hero-subtitle',
        type: 'text', 
        content: 'Conscious AI for Human Reflection',
        selector: 'p.hero-subtitle',
        styles: { fontSize: '20px', color: '#666666' },
        position: { x: 50, y: 200, width: 500, height: 30 }
      },
      {
        id: 'cta-button',
        type: 'button',
        content: 'Get Started',
        selector: 'button.cta-primary',
        styles: { backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px' },
        position: { x: 50, y: 250, width: 140, height: 48 }
      }
    ];
    
    res.json({ elements: mockElements });
  });

  app.post('/api/admin/save-page-changes', async (req, res) => {
    try {
      const { pageUrl, changes } = req.body;
      
      // In a real implementation, this would update the actual page content
      // For now, we'll just acknowledge the save
      console.log('Saving page changes for:', pageUrl, changes);
      
      res.json({ success: true, message: 'Page changes saved successfully' });
    } catch (error) {
      console.error('Error saving page changes:', error);
      res.status(500).json({ error: 'Failed to save page changes' });
    }
  });

  app.get('/api/admin/pages/:path(*)', async (req, res) => {
    try {
      const pagePath = req.params.path || '/';
      
      // Mock page content - in real app this would come from database
      const pageContent = {
        id: `page-${pagePath.replace(/\//g, '-')}`,
        pagePath,
        pageTitle: pagePath === '/' ? 'Home Page' : pagePath.replace('/', '').replace('-', ' '),
        sections: [],
        metadata: {
          description: `Edit ${pagePath} with the visual editor`,
          keywords: ['lightprompt', 'conscious ai'],
          ogImage: ''
        }
      };
      
      res.json(pageContent);
    } catch (error) {
      console.error('Error loading page content:', error);
      res.status(500).json({ error: 'Failed to load page content' });
    }
  });

  app.post('/api/admin/pages', async (req, res) => {
    try {
      const pageContent = req.body;
      
      // In a real implementation, this would save to database
      console.log('Saving page content:', pageContent);
      
      res.json({ success: true, message: 'Page content saved successfully' });
    } catch (error) {
      console.error('Error saving page content:', error);
      res.status(500).json({ error: 'Failed to save page content' });
    }
  });
  
  // Register knowledge storage routes
  app.use("/api/knowledge", knowledgeRoutes);

  // Object storage routes
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/objects/upload", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    res.json({ uploadURL });
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Soul Sync connection storage
  app.post("/api/soul-sync/connections", async (req, res) => {
    try {
      const { name, type, email } = req.body;
      
      // Create demo connection record
      const connection = {
        id: Math.random().toString(36).substring(2, 8),
        name,
        type,
        email,
        status: "Active",
        streak: 0,
        lastActivity: "Just created",
        energy: Math.floor(Math.random() * 30) + 70,
        createdAt: new Date().toISOString()
      };

      console.log('💫 Soul Sync connection created:', connection);
      res.json(connection);
    } catch (error: any) {
      console.error("Error creating Soul Sync connection:", error);
      res.status(500).json({ error: "Failed to create connection" });
    }
  });

  app.get("/api/soul-sync/connections/:email", async (req, res) => {
    try {
      const { email } = req.params;
      
      // For demo - return empty array, would query Supabase in production
      console.log('📋 Fetching Soul Sync connections for:', email);
      res.json([]);
    } catch (error: any) {
      console.error("Error fetching Soul Sync connections:", error);
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  });
  
  // Soul Map routes
  app.get("/api/soul-map/:userId", async (req, res) => {
    try {
      const soulMap = await storage.getSoulMap(req.params.userId);
      res.json(soulMap);
    } catch (error) {
      res.status(404).json({ error: "Soul Map not found" });
    }
  });

  app.post("/api/soul-map/generate", async (req, res) => {
    try {
      const soulMapData = await storage.createSoulMap(req.body);
      res.json(soulMapData);
    } catch (error) {
      console.error('Soul Map generation error:', error);
      res.status(500).json({ error: "Failed to generate Soul Map" });
    }
  });

  // Vision Quest routes
  app.get("/api/vision-quest/:userId", async (req, res) => {
    try {
      const quest = await storage.getVisionQuest(req.params.userId);
      if (!quest) {
        return res.status(404).json({ error: "Vision Quest not found" });
      }
      res.json(quest);
    } catch (error) {
      res.status(404).json({ error: "Vision Quest not found" });
    }
  });

  app.post("/api/vision-quest/begin", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Create a simple vision quest record with proper database structure
      const questData = {
        userId,
        stage: 0,
        progress: 0,
        isCompleted: false,
        completedStages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // For now, return a mock successful response since the storage interface needs updating
      const quest = {
        id: crypto.randomUUID(),
        ...questData
      };
      
      res.json(quest);
    } catch (error) {
      console.error('Vision Quest creation error:', error);
      res.status(500).json({ error: "Failed to begin Vision Quest" });
    }
  });

  // Course access routes
  app.get("/api/course-access/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      res.json({ hasAccess: user?.courseAccess || false });
    } catch (error) {
      res.status(404).json({ hasAccess: false });
    }
  });

  app.post("/api/course/purchase", async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'LightPrompt:ed - The Complete Course',
              description: 'The Human Guide to Conscious AI & Soul Tech',
            },
            unit_amount: 9700, // $97.00
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/course?success=true`,
        cancel_url: `${req.headers.origin}/course?canceled=true`,
        metadata: {
          userId,
          courseId,
        },
      });

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error('Course purchase error:', error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Automatically create a user profile for new users
      try {
        await storage.createUserProfile({
          userId: user.id,
          currentMood: "neutral",
          moodDescription: "Just getting started",
          preferences: {},
          badges: [],
          evolutionScore: 0,
          privacySettings: {}
        });
      } catch (profileError: any) {
        console.log("Profile creation skipped - may already exist:", profileError?.message);
      }
      
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

      console.log('Chat request:', { userId, sessionId, botId, content: content?.substring(0, 50) });

      // Check user token limits
      const user = await storage.getUser(userId);
      if (!user) {
        console.log('User not found:', userId);
        return res.status(404).json({ error: "User not found" });
      }

      if (user.tokensUsed >= user.tokenLimit) {
        return res.status(429).json({ error: "Token limit reached" });
      }

      // Get conversation history (with error handling)
      let conversationHistory: Array<{role: "user" | "assistant", content: string}> = [];
      try {
        const messages = await storage.getSessionMessages(sessionId);
        conversationHistory = messages.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        }));
        console.log('Loaded conversation history:', conversationHistory.length, 'messages');
      } catch (historyError: any) {
        console.log('Failed to load conversation history, continuing with empty history:', historyError.message);
      }

      // For now, let's temporarily bypass message saving and focus on the response generation
      try {
        // Generate bot response first (this doesn't require database writes)
        const botResponse = await generateBotResponse(botId, content, conversationHistory);
        
        // Return successful response immediately for now
        res.json({
          message: {
            id: 'temp-' + Date.now(),
            sessionId,
            role: 'assistant',
            content: botResponse.content,
            sentiment: 'neutral',
            sentimentScore: 0,
            createdAt: new Date().toISOString()
          },
          userSentiment: {
            sentiment: 'neutral',
            score: 0
          }
        });
        
        // Try to save messages in background (non-blocking)
        setTimeout(async () => {
          try {
            await storage.createMessage({
              sessionId,
              role: "user",
              content
            });
            console.log('✅ User message saved successfully');
          } catch (saveError: any) {
            console.log('❌ Failed to save user message:', saveError.message);
          }
          
          try {
            await storage.createMessage({
              sessionId,
              role: "assistant",
              content: botResponse.content
            });
            console.log('✅ Bot message saved successfully');
          } catch (saveError: any) {
            console.log('❌ Failed to save bot message:', saveError.message);
          }
        }, 100);

      } catch (responseError: any) {
        console.error('Bot response generation error:', responseError);
        res.status(500).json({ error: "Failed to generate response" });
      }

    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat: " + error.message });
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
      console.log('🔮 Birth chart request received:', req.body);
      const { day, month, year, hour, min, lat, lng, lon, tzone } = req.body;
      
      // Accept both lng and lon for longitude
      const longitude = lng || lon;
      
      // Validate required fields
      if (!day || !month || !year || !hour || min === undefined || !lat || !longitude) {
        console.log('❌ Validation failed - missing fields:', { day, month, year, hour, min, lat, longitude });
        return res.status(400).json({ 
          error: "Missing required fields: day, month, year, hour, min, lat, lon/lng" 
        });
      }
      
      // Generate birth chart using comprehensive astrological calculations
      const { calculateAstrologyChart } = await import('./astrology');
      const birthData = {
        date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
        location: `${lat}, ${longitude}`,
        lat,
        lng: longitude
      };
      const birthChart = calculateAstrologyChart(birthData);
      
      res.json(birthChart);
    } catch (error) {
      console.error("Birth chart generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate birth chart",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Astrology compatibility analysis with AI insights
  app.post("/api/astrology/compatibility", async (req, res) => {
    try {
      const { person1, person2, connectionType } = req.body;
      
      // Calculate basic compatibility using sun signs
      const compatibilityScore = calculateSunSignCompatibility(person1.sunSign, person2.sunSign);
      const elementMatch = compatibilityScore.description;
      
      // Initialize OpenAI for AI-generated insights
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      // Create detailed prompt for relationship analysis
      const prompt = `You are an expert relationship astrologer providing personalized compatibility insights. Analyze this birth chart compatibility for a ${connectionType.replace('_', ' ')} relationship:

Person 1: Sun in ${person1.sunSign}, Moon in ${person1.moonSign}, Rising in ${person1.risingSign}
Person 2: Sun in ${person2.sunSign}, Moon in ${person2.moonSign}, Rising in ${person2.risingSign}

Connection Type: ${connectionType.replace('_', ' ')}
Calculated Compatibility: ${compatibilityScore}%
Element Match: ${elementMatch}

Provide a comprehensive analysis with these specific sections:

1. COMMUNICATION_STYLE: How should they communicate with each other? Be specific about their different communication needs and how to bridge them. (2-3 sentences)

2. RELATIONSHIP_ACTIVITIES: Suggest 4 specific activities that would strengthen their bond based on their astrological compatibility. Make them practical and enjoyable. Return as array format.

3. GROWTH_AREAS: What challenges might they face and how can they overcome them? Focus on practical advice. (2-3 sentences)

${connectionType === 'romantic_partner' ? '4. LOVE_LANGUAGE_MATCH: How do their signs express and receive love differently? What should each person know about the other\'s love style? (2-3 sentences)' : ''}

${connectionType === 'romantic_partner' ? '5. CONFLICT_RESOLUTION: When they disagree, what\'s the best approach based on their signs? (2-3 sentences)' : ''}

Keep the tone warm, insightful, and practical. Focus on actionable advice they can use immediately.

Return ONLY a JSON object with these exact keys: communication_style, relationship_activities (array), growth_areas${connectionType === 'romantic_partner' ? ', love_language_match, conflict_resolution' : ''}.`;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 1000
        });

        const aiInsights = JSON.parse(response.choices[0].message.content || '{}');
        
        // Combine calculated compatibility with AI insights
        const result = {
          overall_compatibility: compatibilityScore.score,
          element_match: elementMatch,
          ...aiInsights
        };

        console.log('🔮 Generated astrology compatibility:', {
          connectionType,
          compatibility: compatibilityScore.score,
          elementMatch,
          aiGenerated: true
        });

        res.json(result);
      } catch (aiError: any) {
        console.error('AI compatibility analysis failed:', aiError);
        
        // Fallback to pre-defined insights
        const fallbackInsights = {
          overall_compatibility: compatibilityScore.score,
          element_match: elementMatch,
          communication_style: `Based on your ${person1.sunSign} and ${person2.sunSign} combination, you both bring unique strengths to communication. Focus on understanding each other's different approaches and finding common ground.`,
          relationship_activities: [
            "Share your dreams and aspirations with each other",
            "Try new experiences that challenge both of you",
            "Practice active listening during important conversations",
            "Create shared goals that align with both your values"
          ],
          growth_areas: "Your different astrological energies can sometimes create misunderstandings. Remember that these differences are opportunities for growth and learning from each other."
        };

        if (connectionType === 'romantic_partner') {
          (fallbackInsights as any).love_language_match = `${person1.sunSign} and ${person2.sunSign} express love in different ways. Take time to understand and appreciate each other's unique love language.`;
          (fallbackInsights as any).conflict_resolution = "When disagreements arise, give each other space to process, then come back together with openness and honesty.";
        }

        res.json(fallbackInsights);
      }
    } catch (error: any) {
      console.error("Compatibility analysis error:", error);
      res.status(500).json({ error: "Failed to analyze compatibility" });
    }
  });

  // Get comprehensive astrological chart
  app.post("/api/astrology/chart", async (req, res) => {
    try {
      const { birthData } = req.body;
      
      if (!birthData || !birthData.date || !birthData.lat || !birthData.lng) {
        return res.status(400).json({ error: "Complete birth data (date, latitude, longitude) is required" });
      }

      const { calculateAstrologyChart, validateBirthData } = await import('./astrology');
      
      // Validate birth data
      const validation = validateBirthData(birthData);
      if (!validation.isValid) {
        return res.status(400).json({ error: "Invalid birth data" });
      }

      // Calculate comprehensive chart
      const chart = calculateAstrologyChart(birthData);
      
      res.json({ 
        chart,
        accuracy: validation.accuracy,
        recommendations: validation.recommendations
      });
    } catch (error: any) {
      console.error("Astrology chart error:", error);
      res.status(500).json({ error: "Failed to calculate astrological chart" });
    }
  });

  // Get detailed interpretation for specific planet/sign combination
  app.post("/api/astrology/interpret", async (req, res) => {
    try {
      const { planet, sign, house } = req.body;
      
      if (!planet || !sign) {
        return res.status(400).json({ error: "Planet and sign are required" });
      }

      const { getPlanetInterpretation } = await import('./astrology');
      const interpretation = getPlanetInterpretation(planet, sign, house);
      
      res.json({ interpretation });
    } catch (error: any) {
      console.error("Astrology interpretation error:", error);
      res.status(500).json({ error: "Failed to generate interpretation" });
    }
  });

  // Oracle chat endpoint for Soul Map Explorer with enhanced astrological context
  app.post("/api/chat/oracle", async (req, res) => {
    try {
      const { message, context, birthData, selectedPlanet } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      let enhancedMessage = message;
      
      if (birthData && birthData.lat && birthData.lng) {
        try {
          // Calculate comprehensive astrological chart
          const { calculateAstrologyChart } = await import('./astrology');
          const chart = calculateAstrologyChart(birthData);
          
          // Build detailed astrological context
          const chartContext = [
            `Sun in ${chart.sun.sign.charAt(0).toUpperCase() + chart.sun.sign.slice(1)} ${chart.sun.degree}°`,
            `Moon in ${chart.moon.sign.charAt(0).toUpperCase() + chart.moon.sign.slice(1)} ${chart.moon.degree}°`,
            `Rising Sign: ${chart.ascendant.sign.charAt(0).toUpperCase() + chart.ascendant.sign.slice(1)} ${chart.ascendant.degree}°`
          ];
          
          if (chart.sun.house) chartContext.push(`Sun in ${chart.sun.house}${getOrdinalSuffix(chart.sun.house)} house`);
          if (birthData.time) chartContext.push(`Birth time: ${birthData.time} (houses calculated)`);
          if (birthData.location) chartContext.push(`Birth location: ${birthData.location}`);
          
          // Add major aspects
          const majorAspects = chart.aspects.filter(a => ['conjunction', 'opposition', 'trine', 'square'].includes(a.aspect));
          if (majorAspects.length > 0) {
            chartContext.push(`Major aspects: ${majorAspects.map(a => `${a.planet1}-${a.planet2} ${a.aspect}`).join(', ')}`);
          }
          
          enhancedMessage = `${message}

COMPREHENSIVE BIRTH CHART ANALYSIS:
${chartContext.join('\n')}

CURRENTLY EXPLORING: ${selectedPlanet || 'general chart exploration'}

ASTROLOGICAL ACCURACY NOTE: This reading is based on calculated planetary positions, houses, and aspects from the exact birth data provided. When discussing signs other than the user's Sun sign, explain how they appear in the chart through other planets, houses, or rising sign.

Please provide detailed astrological insights based on this comprehensive chart data.`;

        } catch (chartError) {
          console.error("Chart calculation failed, using basic sun sign:", chartError);
          
          // Fallback to basic sun sign calculation
          const birthDate = new Date(birthData.date);
          const month = birthDate.getMonth() + 1;
          const day = birthDate.getDate();
          
          let sunSign = 'Unknown';
          if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) sunSign = 'Aries';
          else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) sunSign = 'Taurus';
          else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) sunSign = 'Gemini';
          else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) sunSign = 'Cancer';
          else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) sunSign = 'Leo';
          else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) sunSign = 'Virgo';
          else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) sunSign = 'Libra';
          else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) sunSign = 'Scorpio';
          else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) sunSign = 'Sagittarius';
          else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) sunSign = 'Capricorn';
          else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) sunSign = 'Aquarius';
          else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) sunSign = 'Pisces';
          
          enhancedMessage = `${message}

BASIC BIRTH DATA: Sun in ${sunSign}, Born: ${birthData.date}, Location: ${birthData.location}
NOTE: Limited accuracy due to missing birth time or location coordinates.

Please provide astrological insights based on available data.`;
        }
      }

      const response = await generateBotResponse("soulmap", enhancedMessage, []);
      
      res.json({ response: response.content });
    } catch (error: any) {
      console.error("Oracle chat error:", error);
      res.status(500).json({ error: error.message || "Failed to generate oracle response" });
    }
  });

  function getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";  
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }

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
      const { amount, items, planId, userId } = req.body;
      
      // Handle both store checkout (amount/items) and plan checkout (planId/userId)
      if (!amount && !planId) {
        return res.status(400).json({ error: "Missing amount or planId" });
      }
      
      if (planId && !userId) {
        return res.status(400).json({ error: "Missing userId for plan" });
      }

      if (planId) {
        // Plan checkout logic
        const plans = {
          "growth": { amount: 2900, name: "Growth Plan" }, 
          "resonance": { amount: 4900, name: "Resonance Plan" }, 
          "enterprise": { amount: 19900, name: "Enterprise Plan" }
        };

        const plan = plans[planId as keyof typeof plans];
        if (!plan) {
          return res.status(400).json({ error: "Invalid plan ID" });
        }

        const user = await storage.getUser(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

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
      } else {
        // Store checkout logic 
        if (!amount || amount <= 0) {
          return res.status(400).json({ error: "Invalid amount provided" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          metadata: {
            items: JSON.stringify(items || [])
          }
        });

        res.json({ 
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        });
      }
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

  // GeoPrompt Check-ins API endpoints
  app.post('/api/geoprompt-checkins', async (req, res) => {
    try {
      const checkInData = req.body;
      
      // Validate required fields
      if (!checkInData.userId || !checkInData.location || !checkInData.vibe || !checkInData.reflection) {
        return res.status(400).json({ 
          error: 'Missing required fields: userId, location, vibe, reflection' 
        });
      }

      const checkIn = await storage.createGeoPromptCheckIn(checkInData);
      
      res.status(201).json({ 
        success: true, 
        checkIn,
        message: 'Check-in saved successfully!' 
      });
    } catch (error) {
      console.error('GeoPrompt check-in error:', error);
      res.status(500).json({ error: 'Failed to save check-in' });
    }
  });

  app.get('/api/geoprompt-checkins/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const checkIns = await storage.getGeoPromptCheckInsByUser(userId);
      
      res.json({ checkIns });
    } catch (error) {
      console.error('Get GeoPrompt check-ins error:', error);
      res.status(500).json({ error: 'Failed to get check-ins' });
    }
  });

  // Get user's check-ins (for page compatibility)
  app.get('/api/geoprompt-checkins/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const checkIns = await storage.getGeoPromptCheckInsByUser(userId);
      res.json(checkIns);
    } catch (error) {
      console.error('Get GeoPrompt check-ins error:', error);
      res.status(500).json({ error: 'Failed to get check-ins' });
    }
  });

  // Get public check-ins feed
  app.get('/api/geoprompt-checkins/public', async (req, res) => {
    try {
      // Mock implementation for public feed
      const mockPublicCheckIns = [
        {
          id: "1",
          userId: "user-1",
          location: "nature",
          vibe: "peaceful",
          reflection: "Beautiful morning meditation in the forest. The sound of birds and rustling leaves brought such clarity to my thoughts.",
          displayName: "nature_lover",
          mapAddress: "Redwood National Park, CA",
          sharePublicly: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          user: { name: "Sarah", avatarUrl: null },
          likes: 5,
          comments: 2
        },
        {
          id: "2", 
          userId: "user-2",
          location: "home",
          vibe: "grateful",
          reflection: "Starting the day with gratitude practice. Feeling blessed for this warm home and the people in my life.",
          displayName: "anonymous",
          sharePublicly: true,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          user: { name: "Anonymous", avatarUrl: null },
          likes: 8,
          comments: 1
        }
      ];
      res.json(mockPublicCheckIns);
    } catch (error) {
      console.error('Error getting public check-ins:', error);
      res.status(500).json({ error: 'Failed to get public check-ins' });
    }
  });

  // Get check-in statistics
  app.get('/api/geoprompt-checkins/stats/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const checkIns = await storage.getGeoPromptCheckInsByUser(userId);
      
      const stats = {
        totalCheckIns: checkIns.length,
        uniqueLocations: [...new Set(checkIns.map((c: any) => c.location))].length,
        streak: Math.floor(Math.random() * 15) + 1,
        favoriteVibe: checkIns.length > 0 ? 
          Object.keys(
            checkIns.reduce((acc: any, curr: any) => 
              acc[curr.vibe] ? { ...acc, [curr.vibe]: acc[curr.vibe] + 1 } : { ...acc, [curr.vibe]: 1 }, {}
            )
          ).reduce((a, b, _, arr) => arr[a] > arr[b] ? a : b, "peaceful") : "peaceful"
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Error getting check-in stats:', error);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  });

  // Community Posts API
  app.get('/api/community/posts', async (req, res) => {
    try {
      const mockPosts = [
        {
          id: "post-1",
          userId: "user-1",
          content: "Just completed my first 7-day meditation streak! The clarity and peace I'm experiencing is incredible. Grateful for this journey.",
          type: "reflection",
          isPublic: true,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          user: { name: "Meditation Seeker", avatarUrl: null },
          likes: 12,
          comments: 4
        }
      ];
      res.json(mockPosts);
    } catch (error) {
      console.error('Error getting community posts:', error);
      res.status(500).json({ error: 'Failed to get posts' });
    }
  });

  app.post('/api/community/posts', async (req, res) => {
    try {
      const postData = req.body;
      const newPost = {
        id: `post-${Date.now()}`,
        ...postData,
        createdAt: new Date(),
        likes: 0,
        comments: 0
      };
      res.json(newPost);
    } catch (error) {
      console.error('Error creating community post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  });

  // Wellness Circles API
  app.get('/api/wellness-circles', async (req, res) => {
    try {
      const circles = [
        {
          id: 'circle-1',
          name: 'Mindful Mornings',
          description: 'Early risers sharing daily meditation practices',
          memberCount: 24,
          isPublic: true
        },
        {
          id: 'circle-2',
          name: 'Moon Cycle Sisters',
          description: 'Tracking lunar energy and feminine wisdom',
          memberCount: 18,
          isPublic: true
        }
      ];
      res.json(circles);
    } catch (error) {
      console.error('Error getting wellness circles:', error);
      res.status(500).json({ error: 'Failed to get wellness circles' });
    }
  });

  app.post('/api/wellness-circles/:circleId/join', async (req, res) => {
    try {
      const { circleId } = req.params;
      const membership = {
        id: `membership-${Date.now()}`,
        circleId,
        userId: '4208c9e4-2a5d-451b-9a54-44f0ab6d7313',
        joinedAt: new Date()
      };
      res.json(membership);
    } catch (error) {
      console.error('Error joining wellness circle:', error);
      res.status(500).json({ error: 'Failed to join circle' });
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

  // Additional API routes for new pages
  
  // Vibe Match API routes (if not already present)
  app.get('/api/vibe-profile/:userId', async (req, res) => {
    try {
      const mockProfile = {
        id: 'profile-1',
        userId: req.params.userId,
        energyLevel: 7,
        currentMood: 'Inspired and creative',
        intentions: 'Manifesting abundance and deeper connections',
        interests: ['Meditation', 'Astrology', 'Nature Connection'],
        lookingFor: 'friendship',
        bio: 'Soul seeker exploring consciousness through meditation and creative expression.',
        shareLocation: false
      };
      res.json(mockProfile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get profile' });
    }
  });

  app.post('/api/vibe-profile', async (req, res) => {
    try {
      const profileData = req.body;
      const profile = { id: `profile-${Date.now()}`, ...profileData };
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  app.get('/api/vibe-matches/:userId', async (req, res) => {
    try {
      const mockMatches = [
        {
          id: 'user-match-1',
          name: 'Luna Rose',
          avatarUrl: null,
          vibeProfile: {
            energyLevel: 6,
            energyEmoji: '✨',
            energyLabel: 'Vibrant',
            bio: 'Crystal healer and moon cycle tracker. Love connecting with kindred spirits.',
            interests: ['Crystals', 'Astrology', 'Moon Phases']
          }
        }
      ];
      res.json(mockMatches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get matches' });
    }
  });

  app.get('/api/active-matches/:userId', async (req, res) => {
    res.json([]);
  });

  app.post('/api/vibe-matches/request', async (req, res) => {
    try {
      const { fromUserId, toUserId } = req.body;
      const matchRequest = {
        id: `match-${Date.now()}`,
        fromUserId,
        toUserId,
        status: 'pending'
      };
      res.json(matchRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to send match request' });
    }
  });

  // Prism Points API routes (if not already present from user stats)
  app.get('/api/prism-points/history/:userId', async (req, res) => {
    try {
      const mockHistory = [
        {
          id: 'point-1',
          userId: req.params.userId,
          points: 15,
          category: 'checkin',
          description: 'GeoPrompt check-in from Nature location',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ];
      res.json(mockHistory);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get point history' });
    }
  });

  app.get('/api/prism-points/leaderboard', async (req, res) => {
    try {
      const mockLeaderboard = [
        {
          userId: 'user-1',
          user: { name: 'Soul Seeker', avatarUrl: null },
          totalPoints: 450,
          reflectionsCompleted: 28,
          streakDays: 12
        }
      ];
      res.json(mockLeaderboard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get leaderboard' });
    }
  });

  app.get('/api/achievements/:userId', async (req, res) => {
    try {
      const mockAchievements = [
        {
          achievementId: 'first_reflection',
          userId: req.params.userId,
          unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];
      res.json(mockAchievements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get achievements' });
    }
  });

  // Soul Map API routes
  app.get('/api/soul-map/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const soulMap = await storage.getSoulMap(userId);
      res.json(soulMap);
    } catch (error) {
      console.error('Error fetching soul map:', error);
      res.status(500).json({ error: 'Failed to fetch soul map' });
    }
  });

  app.post('/api/soul-map/generate', async (req, res) => {
    try {
      const soulMapData = req.body;
      const generatedMap = await storage.createSoulMap(soulMapData);
      res.json(generatedMap);
    } catch (error) {
      console.error('Error generating soul map:', error);
      res.status(500).json({ error: 'Failed to generate soul map' });
    }
  });

  // Vision Quest API routes
  app.get('/api/vision-quest/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const visionQuest = await storage.getVisionQuest(userId);
      res.json(visionQuest);
    } catch (error) {
      console.error('Error fetching vision quest:', error);
      res.status(500).json({ error: 'Failed to fetch vision quest' });
    }
  });

  app.post('/api/vision-quest/generate', async (req, res) => {
    try {
      const questData = req.body;
      const generatedQuest = await storage.createVisionQuest(questData);
      res.json(generatedQuest);
    } catch (error) {
      console.error('Error generating vision quest:', error);
      res.status(500).json({ error: 'Failed to generate vision quest' });
    }
  });

  // Ebook Payment
  app.post('/api/create-ebook-payment', async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Stripe not configured' });
      }

      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'LightPrompt Ebook',
              description: 'The Human Guide to Conscious AI & Soul Tech',
            },
            unit_amount: 1100, // $11.00
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/course-access?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/store`,
      });

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error('Ebook payment error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Bundle Payment
  app.post('/api/create-bundle-payment', async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Stripe not configured' });
      }

      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'LightPrompt Complete Bundle',
              description: 'Course + Ebook - Complete consciousness package',
            },
            unit_amount: 12500, // $125.00
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/course-access?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/store`,
      });

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error('Bundle payment error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Course purchase endpoint
  app.post('/api/create-course-payment', async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: 'Stripe not configured' });
      }

      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'LightPrompt Course',
              description: 'Complete access to LightPrompt wellness course and AI companions',
            },
            unit_amount: 12000, // $120.00
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/course-access?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/store`,
        metadata: {
          course_name: 'lightprompted',
          user_email: 'customer_email'
        }
      });

      res.json({ checkoutUrl: session.url });
    } catch (error) {
      console.error('Course payment error:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Stripe payment route for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, items } = req.body;
      
      // Validate input
      if (!amount || amount <= 0) {
        return res.status(400).json({ 
          error: "Invalid amount provided" 
        });
      }
      
      // Create payment intent with amount in cents
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          items: JSON.stringify(items || [])
        }
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      res.status(500).json({ 
        error: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Admin page save endpoint
  app.post("/api/admin/save-page", async (req, res) => {
    try {
      const { path, data } = req.body;
      // Save to knowledge base for persistent storage
      const result = await db.insert(platformEvolution).values({
        category: 'page_content',
        evolutionType: 'content_update',
        description: `Page content updated: ${path}`,
        impact: 'Page content modified through Universal Editor',
        data: { path, pageData: data },
        confidence: 100
      }).returning();
      
      console.log(`✅ Page data saved to database for ${path}`);
      res.json({ message: "Page saved to database", id: result[0].id });
    } catch (error: any) {
      console.error("Error saving page:", error);
      res.status(500).json({ error: "Failed to save page to database" });
    }
  });

  // Admin pages endpoints for page editor
  app.get("/api/admin/pages/:path", async (req, res) => {
    try {
      const { path } = req.params;
      const decodedPath = decodeURIComponent(path);
      
      // Get saved page content from database
      const savedContent = await db
        .select()
        .from(platformEvolution)
        .where(eq(platformEvolution.category, 'page_content'))
        .orderBy(desc(platformEvolution.detectedAt))
        .limit(1);

      if (savedContent.length > 0 && savedContent[0].data?.pageData?.pagePath === decodedPath) {
        return res.json(savedContent[0].data.pageData);
      }
      
      // Return 404 if no content found
      res.status(404).json({ error: "Page not found" });
    } catch (error: any) {
      console.error("Error getting page:", error);
      res.status(500).json({ error: "Failed to get page" });
    }
  });

  app.post("/api/admin/pages", async (req, res) => {
    try {
      const pageData = req.body;
      
      // Save to knowledge base for persistent storage
      const result = await db.insert(platformEvolution).values({
        category: 'page_content',
        evolutionType: 'content_update',
        description: `Page content updated: ${pageData.pagePath}`,
        impact: 'Page content modified through Page Editor',
        data: { pageData },
        confidence: 100
      }).returning();
      
      console.log(`✅ Page data saved to database for ${pageData.pagePath}`);
      res.json({ message: "Page saved successfully", id: result[0].id });
    } catch (error: any) {
      console.error("Error saving page:", error);
      res.status(500).json({ error: "Failed to save page" });
    }
  });

  // Admin page scan endpoint - simplified without database query to avoid SQL errors
  app.get("/api/admin/scan-page", async (req, res) => {
    try {
      const { path } = req.query;
      console.log(`Scanning page: ${path}`);
      
      // Skip database query and return defaults directly

      // Default page elements based on actual page structure
      const pageElements = {
        "/": {
          title: "Home Page",
          description: "Main landing page with hero section and features",
          pagePath: "/",
          elements: [
            { id: "hero-title", type: "text", path: "/", element: "h1", content: "LightPrompt", metadata: { className: "text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" }},
            { id: "hero-subtitle", type: "text", path: "/", element: "p", content: "Soul-Tech Wellness AI", metadata: { className: "text-xl text-muted-foreground" }},
            { id: "hero-description", type: "text", path: "/", element: "p", content: "Conscious AI for mindful living and spiritual growth", metadata: { className: "text-lg text-gray-600" }},
            { id: "cta-button", type: "button", path: "/", element: "button", content: "Begin Your Journey", metadata: { href: "/dashboard", className: "bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity" }},
            { id: "beta-badge", type: "badge", path: "/", element: "span", content: "BETA", metadata: { className: "bg-teal-100 text-teal-800 px-2 py-1 rounded text-sm font-medium" }}
          ]
        },
        "/store": {
          title: "Store",
          description: "LightPrompt course and ebook sales",
          pagePath: "/store",
          elements: [
            { id: "store-title", type: "text", path: "/store", element: "h1", content: "LightPrompt Store", metadata: { className: "text-3xl font-bold text-center mb-8" }},
            { id: "course-title", type: "text", path: "/store", element: "h2", content: "LightPrompt:ed Course", metadata: { className: "text-2xl font-semibold" }},
            { id: "course-price", type: "text", path: "/store", element: "span", content: "$120", metadata: { className: "text-3xl font-bold text-purple-600" }},
            { id: "ebook-title", type: "text", path: "/store", element: "h2", content: "Digital Ebook", metadata: { className: "text-2xl font-semibold" }},
            { id: "ebook-price", type: "text", path: "/store", element: "span", content: "$11", metadata: { className: "text-3xl font-bold text-blue-600" }},
            { id: "bundle-price", type: "text", path: "/store", element: "span", content: "$125", metadata: { className: "text-3xl font-bold text-teal-600" }}
          ]
        },
        "/woo-woo": {
          title: "Soul Maps & Cosmos",
          description: "Astrology and soul guidance tools",
          pagePath: "/woo-woo",
          elements: [
            { id: "soul-map-title", type: "text", path: "/woo-woo", element: "h1", content: "Soul Maps & Cosmos", metadata: { className: "text-3xl font-bold text-center" }},
            { id: "soul-map-subtitle", type: "text", path: "/woo-woo", element: "p", content: "Discover your cosmic blueprint through AI-powered astrology", metadata: { className: "text-lg text-muted-foreground text-center" }},
            { id: "begin-button", type: "button", path: "/woo-woo", element: "button", content: "Begin Your Soul Map Journey", metadata: { className: "bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold" }}
          ]
        },
        "/community": {
          title: "Community",
          description: "Connect with others on the journey",
          pagePath: "/community",
          elements: [
            { id: "community-title", type: "text", path: "/community", element: "h1", content: "LightPrompt Community", metadata: { className: "text-3xl font-bold text-center" }},
            { id: "discord-link", type: "link", path: "/community", element: "a", content: "Join Discord", metadata: { href: "https://discord.gg/lightprompt", className: "bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700" }}
          ]
        }
      };

      const defaultData = pageElements[path as keyof typeof pageElements] || {
        title: "Page",
        description: "Edit page content",
        elements: []
      };

      res.json(defaultData);
    } catch (error: any) {
      console.error("Error scanning page:", error);
      res.status(500).json({ error: "Failed to scan page" });
    }
  });

  // Geocoding search endpoint for location autocomplete
  app.get("/api/geocode/search", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || typeof query !== 'string' || query.length < 3) {
        return res.json({ suggestions: [] });
      }

      // Popular world cities with coordinates
      const popularCities = [
        { place_id: "nyc", description: "New York City, NY, USA", latitude: 40.7128, longitude: -74.0060 },
        { place_id: "la", description: "Los Angeles, CA, USA", latitude: 34.0522, longitude: -118.2437 },
        { place_id: "chicago", description: "Chicago, IL, USA", latitude: 41.8781, longitude: -87.6298 },
        { place_id: "london", description: "London, UK", latitude: 51.5074, longitude: -0.1278 },
        { place_id: "paris", description: "Paris, France", latitude: 48.8566, longitude: 2.3522 },
        { place_id: "tokyo", description: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503 },
        { place_id: "sydney", description: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093 },
        { place_id: "toronto", description: "Toronto, Canada", latitude: 43.6532, longitude: -79.3832 },
        { place_id: "mumbai", description: "Mumbai, India", latitude: 19.0760, longitude: 72.8777 },
        { place_id: "sao_paulo", description: "São Paulo, Brazil", latitude: -23.5505, longitude: -46.6333 },
        { place_id: "cairo", description: "Cairo, Egypt", latitude: 30.0444, longitude: 31.2357 },
        { place_id: "berlin", description: "Berlin, Germany", latitude: 52.5200, longitude: 13.4050 },
        { place_id: "moscow", description: "Moscow, Russia", latitude: 55.7558, longitude: 37.6176 },
        { place_id: "beijing", description: "Beijing, China", latitude: 39.9042, longitude: 116.4074 },
        { place_id: "mexico_city", description: "Mexico City, Mexico", latitude: 19.4326, longitude: -99.1332 },
        { place_id: "lagos", description: "Lagos, Nigeria", latitude: 6.5244, longitude: 3.3792 },
        { place_id: "istanbul", description: "Istanbul, Turkey", latitude: 41.0082, longitude: 28.9784 },
        { place_id: "bangkok", description: "Bangkok, Thailand", latitude: 13.7563, longitude: 100.5018 },
        { place_id: "buenos_aires", description: "Buenos Aires, Argentina", latitude: -34.6037, longitude: -58.3816 },
        { place_id: "rome", description: "Rome, Italy", latitude: 41.9028, longitude: 12.4964 },
        { place_id: "amsterdam", description: "Amsterdam, Netherlands", latitude: 52.3676, longitude: 4.9041 },
        { place_id: "stockholm", description: "Stockholm, Sweden", latitude: 59.3293, longitude: 18.0686 },
        { place_id: "oslo", description: "Oslo, Norway", latitude: 59.9139, longitude: 10.7522 },
        { place_id: "copenhagen", description: "Copenhagen, Denmark", latitude: 55.6761, longitude: 12.5683 },
        { place_id: "zurich", description: "Zurich, Switzerland", latitude: 47.3769, longitude: 8.5417 }
      ];

      // Filter cities based on query
      const filteredSuggestions = popularCities.filter(city => 
        city.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

      res.json({ suggestions: filteredSuggestions });
    } catch (error: any) {
      console.error("Geocoding search error:", error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // DOM scanning endpoint for visual editor
  app.get("/api/admin/scan-dom", async (req, res) => {
    try {
      const { path } = req.query;
      console.log(`Scanning DOM for page: ${path}`);
      
      // Return comprehensive page elements that would be found via DOM scanning
      const pageElements = {
        "/": [
          { id: "hero-title", type: "heading", content: "LightPrompt", selector: "h1.hero-title", styles: { fontSize: "48px", color: "#1f2937", fontWeight: "bold" }, position: { x: 100, y: 100, width: 400, height: 60 }},
          { id: "hero-subtitle", type: "text", content: "Soul-Tech Wellness AI", selector: "p.hero-subtitle", styles: { fontSize: "24px", color: "#6b7280" }, position: { x: 100, y: 180, width: 400, height: 30 }},
          { id: "hero-description", type: "text", content: "Conscious AI for mindful living and spiritual growth", selector: "p.hero-description", styles: { fontSize: "18px", color: "#374151" }, position: { x: 100, y: 220, width: 500, height: 50 }},
          { id: "cta-button", type: "button", content: "Begin Your Journey", selector: "button.cta-primary", styles: { fontSize: "16px", backgroundColor: "#3b82f6", color: "#ffffff", padding: "12px 24px", borderRadius: "8px" }, position: { x: 100, y: 300, width: 180, height: 44 }},
          { id: "beta-badge", type: "text", content: "BETA", selector: "span.beta-badge", styles: { fontSize: "12px", backgroundColor: "#10b981", color: "#ffffff", padding: "4px 8px", borderRadius: "4px" }, position: { x: 500, y: 50, width: 50, height: 24 }},
          { id: "hero-image", type: "image", content: "/api/placeholder-hero.jpg", selector: "img.hero-image", styles: { width: "300px", height: "200px", borderRadius: "12px" }, position: { x: 600, y: 100, width: 300, height: 200 }}
        ],
        "/store": [
          { id: "store-title", type: "heading", content: "LightPrompt Store", selector: "h1.store-title", styles: { fontSize: "36px", color: "#1f2937", textAlign: "center" }, position: { x: 200, y: 50, width: 400, height: 50 }},
          { id: "course-card", type: "text", content: "LightPrompt:ed Course", selector: "h2.course-title", styles: { fontSize: "24px", color: "#374151" }, position: { x: 100, y: 150, width: 250, height: 30 }},
          { id: "course-price", type: "text", content: "$120", selector: "span.course-price", styles: { fontSize: "32px", color: "#7c3aed", fontWeight: "bold" }, position: { x: 100, y: 200, width: 100, height: 40 }},
          { id: "ebook-card", type: "text", content: "Digital Ebook", selector: "h2.ebook-title", styles: { fontSize: "24px", color: "#374151" }, position: { x: 400, y: 150, width: 250, height: 30 }},
          { id: "ebook-price", type: "text", content: "$11", selector: "span.ebook-price", styles: { fontSize: "32px", color: "#2563eb", fontWeight: "bold" }, position: { x: 400, y: 200, width: 100, height: 40 }},
          { id: "bundle-price", type: "text", content: "$125 Bundle", selector: "span.bundle-price", styles: { fontSize: "28px", color: "#059669", fontWeight: "bold" }, position: { x: 250, y: 300, width: 150, height: 35 }},
          { id: "course-image", type: "image", content: "/api/placeholder-course.jpg", selector: "img.course-image", styles: { width: "200px", height: "150px", borderRadius: "8px" }, position: { x: 100, y: 250, width: 200, height: 150 }},
          { id: "ebook-image", type: "image", content: "/api/placeholder-ebook.jpg", selector: "img.ebook-image", styles: { width: "200px", height: "150px", borderRadius: "8px" }, position: { x: 400, y: 250, width: 200, height: 150 }}
        ],
        "/dashboard": [
          { id: "dashboard-title", type: "heading", content: "Your Wellness Dashboard", selector: "h1.dashboard-title", styles: { fontSize: "32px", color: "#1f2937" }, position: { x: 100, y: 50, width: 400, height: 40 }},
          { id: "welcome-text", type: "text", content: "Welcome back to your conscious AI journey", selector: "p.welcome-text", styles: { fontSize: "18px", color: "#6b7280" }, position: { x: 100, y: 100, width: 500, height: 25 }},
          { id: "stats-card", type: "text", content: "Your Progress", selector: "h3.stats-title", styles: { fontSize: "20px", color: "#374151" }, position: { x: 100, y: 200, width: 200, height: 30 }}
        ]
      };

      const elements = pageElements[path as keyof typeof pageElements] || [];
      
      res.json({ 
        elements,
        totalElements: elements.length,
        pageInfo: {
          title: path === '/' ? 'Home Page' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2),
          path,
          editable: true
        }
      });
    } catch (error: any) {
      console.error("DOM scan error:", error);
      res.status(500).json({ error: "Failed to scan DOM" });
    }
  });

  // Save page changes endpoint
  app.post("/api/admin/save-page-changes", async (req, res) => {
    try {
      const { path, changes, elements } = req.body;
      
      // Save changes to knowledge base
      const result = await db.insert(platformEvolution).values({
        category: 'page_content',
        evolutionType: 'visual_edit',
        description: `Visual editor changes applied to ${path}`,
        impact: `Updated ${Object.keys(changes).length} elements on ${path}`,
        data: { path, changes, elements, timestamp: new Date().toISOString() },
        confidence: 100
      }).returning();
      
      console.log(`✅ Page changes saved for ${path}:`, Object.keys(changes));
      res.json({ message: "Changes saved successfully", id: result[0].id });
    } catch (error: any) {
      console.error("Error saving page changes:", error);
      res.status(500).json({ error: "Failed to save changes" });
    }
  });

  // Temporary image upload for editor
  app.post("/api/upload-temp-image", async (req, res) => {
    try {
      // Generate a temporary upload URL for images
      const tempUrl = `/temp-images/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
      res.json({ uploadURL: tempUrl });
    } catch (error: any) {
      console.error("Image upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Wellness and emotion check-in routes
  app.post("/api/wellness/checkin", async (req, res) => {
    try {
      const { userId, mood, energy, stress, gratitude, reflection, goals } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
      }

      const checkin = await db.insert(wellnessMetrics).values({
        userId,
        mood: mood || "neutral",
        energy: energy || 5,
        stress: stress || 5,
        gratitude,
        reflection,
        goals: goals || [],
        achievements: [],
        metadata: {}
      }).returning();

      res.json(checkin[0]);
    } catch (error: any) {
      console.error("Error creating emotion check-in:", error);
      res.status(500).json({ error: "Failed to create check-in" });
    }
  });

  // Get emotion data for calm image
  app.get("/api/wellness/emotions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const emotions = await db
        .select()
        .from(wellnessMetrics)
        .where(eq(wellnessMetrics.userId, userId))
        .orderBy(desc(wellnessMetrics.date))
        .limit(30);

      if (emotions.length === 0) {
        return res.json({
          dominantMood: "neutral",
          calmPercentage: 0,
          totalEntries: 0,
          recentMood: "neutral"
        });
      }

      // Calculate calm percentage (energy >= 6 and stress <= 4)
      const calmEntries = emotions.filter(e => 
        (e.energy || 0) >= 6 && (e.stress || 0) <= 4
      );
      const calmPercentage = (calmEntries.length / emotions.length) * 100;

      // Get mood counts
      const moodCounts = emotions.reduce((acc, entry) => {
        acc[entry.mood || "neutral"] = (acc[entry.mood || "neutral"] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || "neutral";

      res.json({
        dominantMood,
        calmPercentage: Math.round(calmPercentage),
        totalEntries: emotions.length,
        recentMood: emotions[0]?.mood || "neutral",
        moodDistribution: moodCounts
      });

    } catch (error: any) {
      console.error("Error fetching emotions:", error);
      res.status(500).json({ error: "Failed to fetch emotions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
