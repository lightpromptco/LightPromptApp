import type { Express } from "express";
import { eq } from "drizzle-orm";
import { 
  userSettings, 
  type UserSettings, 
  type InsertUserSettings,
  type UpdateUserSettings,
  insertUserSettingsSchema,
  updateUserSettingsSchema
} from "@shared/schema";
import { storage } from "../storage";

export function registerSettingsRoutes(app: Express) {
  // Get user settings
  app.get("/api/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const settings = await storage.getUserSettings(userId);
      
      if (!settings) {
        // Return default settings if none exist
        const defaultSettings: Partial<UserSettings> = {
          userId,
          soulMapEnabled: true,
          soulMapAutoInsights: true,
          soulMapNotifications: true,
          soulMapPrivacy: "private",
          vibeMatchEnabled: true,
          vibeMatchCareerAlerts: true,
          vibeMatchFrequency: "weekly",
          geoPromptEnabled: false,
          geoPromptLocationSharing: false,
          geoPromptNotifications: true,
          geoPromptRadius: 5,
          visionQuestEnabled: true,
          visionQuestReminders: true,
          visionQuestDifficulty: "intermediate",
          courseNotifications: true,
          courseAutoProgress: false,
          courseEmailUpdates: true,
          coursePreferredLearningStyle: "mixed",
          aiCompanionsEnabled: true,
          preferredCompanion: "lightpromptbot",
          companionPersonality: "balanced",
          companionResponseLength: "medium",
          companionProactivity: true,
          pushNotifications: true,
          emailNotifications: true,
          smsNotifications: false,
          notificationFrequency: "daily",
          quietHoursStart: "22:00",
          quietHoursEnd: "07:00",
          timezone: "auto",
          dataCollection: true,
          conversationHistory: true,
          usageAnalytics: true,
          marketingEmails: false,
          profileVisibility: "private",
          theme: "system",
          circadianMode: true,
          fontSize: "medium",
          language: "en",
          animationsEnabled: true,
          developerMode: false,
          betaFeatures: false,
          apiAccess: false,
          dataExportFormat: "json"
        };
        
        return res.json(defaultSettings);
      }

      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Create or update user settings
  app.post("/api/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Validate the request body
      const validatedData = insertUserSettingsSchema.parse({
        userId,
        ...req.body
      });

      const settings = await storage.createOrUpdateUserSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error creating/updating user settings:", error);
      res.status(500).json({ error: "Failed to save settings" });
    }
  });

  // Update specific settings
  app.patch("/api/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Validate the request body
      const validatedData = updateUserSettingsSchema.parse(req.body);

      const settings = await storage.updateUserSettings(userId, validatedData);
      
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }

      res.json(settings);
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Reset settings to defaults
  app.delete("/api/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      await storage.deleteUserSettings(userId);
      res.json({ message: "Settings reset to defaults" });
    } catch (error) {
      console.error("Error resetting user settings:", error);
      res.status(500).json({ error: "Failed to reset settings" });
    }
  });
}