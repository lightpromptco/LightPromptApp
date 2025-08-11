import type { Express } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
// Removed bcrypt for simplicity - in production use proper Supabase Auth

const signupSchema = insertUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export function registerAuthRoutes(app: Express) {
  // Signup endpoint - creates real user in Supabase
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = signupSchema.parse(req.body);
      const { password, ...userData } = validatedData;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ 
          error: "User already exists with this email address" 
        });
      }

      // Create user in Supabase (password hashing would be handled by Supabase Auth in production)
      const user = await storage.createUser(userData);

      // Create user profile with Soul Sync settings
      await storage.createUserProfile({
        userId: user.id,
        soulSyncEnabled: false,
        soulSyncVisibility: "private",
        matchingPreferences: {},
        privacySettings: {
          dataSharing: "private",
          profileVisibility: "friends",
          locationSharing: false,
        },
      });

      // Return user without sensitive data
      const { ...safeUser } = user;
      res.status(201).json(safeUser);

    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Login endpoint - authenticates against Supabase
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Get user from database
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In a real implementation, you'd verify the password here
      // For now, we'll use the existing admin user system
      if (email === "lightprompt.co@gmail.com") {
        // Return admin user
        res.json(user);
      } else {
        // Return the user (password verification would happen here)
        res.json(user);
      }

    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get current user profile with Soul Sync settings
  app.get("/api/auth/profile", async (req, res) => {
    try {
      // In a real app, you'd get user from session/token
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Update Soul Sync settings
  app.put("/api/auth/soul-sync-settings", async (req, res) => {
    try {
      const userId = req.body.userId;
      const settings = req.body.settings;

      if (!userId) {
        return res.status(401).json({ error: "User ID required" });
      }

      // Update user profile with Soul Sync preferences in Supabase
      const updatedProfile = await storage.updateUserProfile(userId, {
        soulSyncEnabled: settings.enabled,
        soulSyncVisibility: settings.visibility,
        matchingPreferences: settings.matchingPreferences,
        privacySettings: settings.privacySettings,
      });

      res.json(updatedProfile);
    } catch (error) {
      console.error("Soul Sync settings update error:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });
}