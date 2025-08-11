import type { Express } from "express";
import { db } from "../db";
import { vibeMatchProfiles, vibeMatches, users, userProfiles } from "@shared/schema";
import { eq, and, desc, ne, sql, inArray } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

// Validation schemas
const createProfileSchema = z.object({
  displayName: z.string().min(1).max(50),
  bio: z.string().max(500).optional(),
  careerField: z.string().min(1),
  currentRole: z.string().min(1),
  experience: z.enum(["entry", "mid", "senior", "expert"]),
  workStyle: z.array(z.string()).min(1),
  values: z.array(z.string()).min(1),
  goals: z.array(z.string()).min(1),
  industryInterests: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  mentoringInterests: z.array(z.string()).default([]),
  collaborationStyle: z.enum(["independent", "collaborative", "mixed"]),
  communicationStyle: z.enum(["direct", "diplomatic", "casual", "formal"]),
  learningStyle: z.enum(["visual", "auditory", "kinesthetic", "reading", "mixed"]),
  isVisible: z.boolean().default(true)
});

const updateProfileSchema = createProfileSchema.partial();

const matchPreferencesSchema = z.object({
  careerFields: z.array(z.string()).optional(),
  experienceLevels: z.array(z.string()).optional(),
  workStyles: z.array(z.string()).optional(),
  values: z.array(z.string()).optional(),
  maxDistance: z.number().min(1).max(10000).optional(), // miles
  ageRange: z.object({
    min: z.number().min(18).max(100),
    max: z.number().min(18).max(100)
  }).optional()
});

export function registerVibeMatchRoutes(app: Express) {
  // Get or create user's VibeMatch profile
  app.get("/api/vibematch/profile/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const [profile] = await db
        .select()
        .from(vibeMatchProfiles)
        .where(eq(vibeMatchProfiles.userId, userId));

      if (!profile) {
        // Create a default profile
        const [newProfile] = await db
          .insert(vibeMatchProfiles)
          .values({
            userId,
            displayName: "New Professional",
            careerField: "Technology",
            currentRole: "Professional",
            experience: "mid",
            workStyle: ["collaborative"],
            values: ["growth"],
            goals: ["networking"]
          })
          .returning();
        
        return res.json(newProfile);
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching VibeMatch profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Update user's VibeMatch profile
  app.put("/api/vibematch/profile/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const profileData = updateProfileSchema.parse(req.body);
      
      const [updatedProfile] = await db
        .update(vibeMatchProfiles)
        .set({
          ...profileData,
          updatedAt: new Date()
        })
        .where(eq(vibeMatchProfiles.userId, userId))
        .returning();

      if (!updatedProfile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid profile data", details: error.errors });
      }
      console.error("Error updating VibeMatch profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Get potential matches for user
  app.get("/api/vibematch/matches", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get user's profile to understand their preferences
      const [userProfile] = await db
        .select()
        .from(vibeMatchProfiles)
        .where(eq(vibeMatchProfiles.userId, userId));

      if (!userProfile) {
        return res.status(404).json({ error: "Please complete your profile first" });
      }

      // Get existing matches to exclude them
      const existingMatches = await db
        .select({ profileId: vibeMatches.matchedUserId })
        .from(vibeMatches)
        .where(eq(vibeMatches.userId, userId));

      const excludeIds = [userId, ...existingMatches.map(m => m.profileId)];

      // Find potential matches based on compatibility
      const potentialMatches = await db
        .select({
          id: vibeMatchProfiles.id,
          userId: vibeMatchProfiles.userId,
          displayName: vibeMatchProfiles.displayName,
          bio: vibeMatchProfiles.bio,
          careerField: vibeMatchProfiles.careerField,
          currentRole: vibeMatchProfiles.currentRole,
          experience: vibeMatchProfiles.experience,
          workStyle: vibeMatchProfiles.workStyle,
          values: vibeMatchProfiles.values,
          goals: vibeMatchProfiles.goals,
          skills: vibeMatchProfiles.skills,
          compatibilityScore: sql<number>`
            (
              CASE WHEN ${vibeMatchProfiles.careerField} = ${userProfile.careerField} THEN 20 ELSE 0 END +
              CASE WHEN ${vibeMatchProfiles.experience} = ${userProfile.experience} THEN 15 ELSE 0 END +
              (array_length(array(select unnest(${vibeMatchProfiles.workStyle}) intersect select unnest(${userProfile.workStyle})), 1) * 10) +
              (array_length(array(select unnest(${vibeMatchProfiles.values}) intersect select unnest(${userProfile.values})), 1) * 15) +
              (array_length(array(select unnest(${vibeMatchProfiles.goals}) intersect select unnest(${userProfile.goals})), 1) * 10)
            )
          `
        })
        .from(vibeMatchProfiles)
        .where(and(
          eq(vibeMatchProfiles.isVisible, true),
          ne(vibeMatchProfiles.userId, userId),
          sql`${vibeMatchProfiles.userId} != ALL(${excludeIds})`
        ))
        .orderBy(sql`compatibility_score desc`)
        .limit(20);

      res.json(potentialMatches);
    } catch (error) {
      console.error("Error fetching VibeMatch matches:", error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // Express interest in a match
  app.post("/api/vibematch/matches", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { matchedUserId, message } = z.object({
        matchedUserId: z.string(),
        message: z.string().max(500).optional()
      }).parse(req.body);

      // Check if match already exists
      const [existingMatch] = await db
        .select()
        .from(vibeMatches)
        .where(and(
          eq(vibeMatches.userId, userId),
          eq(vibeMatches.matchedUserId, matchedUserId)
        ));

      if (existingMatch) {
        return res.status(409).json({ error: "Match already exists" });
      }

      // Check if the other user has also expressed interest (mutual match)
      const [reverseMatch] = await db
        .select()
        .from(vibeMatches)
        .where(and(
          eq(vibeMatches.userId, matchedUserId),
          eq(vibeMatches.matchedUserId, userId)
        ));

      const isMutual = !!reverseMatch;

      // Create the match
      const [newMatch] = await db
        .insert(vibeMatches)
        .values({
          userId,
          matchedUserId,
          message,
          isMutual,
          status: isMutual ? "active" : "pending"
        })
        .returning();

      // If it's mutual, update the reverse match too
      if (isMutual) {
        await db
          .update(vibeMatches)
          .set({ 
            isMutual: true, 
            status: "active" 
          })
          .where(and(
            eq(vibeMatches.userId, matchedUserId),
            eq(vibeMatches.matchedUserId, userId)
          ));
      }

      res.status(201).json(newMatch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid match data", details: error.errors });
      }
      console.error("Error creating VibeMatch:", error);
      res.status(500).json({ error: "Failed to create match" });
    }
  });

  // Get user's matches
  app.get("/api/vibematch/matches/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { status } = z.object({
        status: z.enum(["pending", "active", "inactive"]).optional()
      }).parse(req.query);

      let whereCondition = eq(vibeMatches.userId, userId);
      if (status) {
        whereCondition = and(whereCondition, eq(vibeMatches.status, status));
      }

      const matches = await db
        .select({
          id: vibeMatches.id,
          message: vibeMatches.message,
          isMutual: vibeMatches.isMutual,
          status: vibeMatches.status,
          matchedAt: vibeMatches.matchedAt,
          match: {
            userId: vibeMatchProfiles.userId,
            displayName: vibeMatchProfiles.displayName,
            bio: vibeMatchProfiles.bio,
            careerField: vibeMatchProfiles.careerField,
            currentRole: vibeMatchProfiles.currentRole,
            experience: vibeMatchProfiles.experience,
            values: vibeMatchProfiles.values,
            goals: vibeMatchProfiles.goals
          }
        })
        .from(vibeMatches)
        .innerJoin(vibeMatchProfiles, eq(vibeMatches.matchedUserId, vibeMatchProfiles.userId))
        .where(whereCondition)
        .orderBy(desc(vibeMatches.matchedAt));

      res.json(matches);
    } catch (error) {
      console.error("Error fetching user matches:", error);
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  // Get VibeMatch analytics
  app.get("/api/vibematch/analytics/me", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get match statistics
      const [matchStats] = await db
        .select({
          totalMatches: sql<number>`count(*)`,
          mutualMatches: sql<number>`count(case when is_mutual = true then 1 end)`,
          activeMatches: sql<number>`count(case when status = 'active' then 1 end)`,
          pendingMatches: sql<number>`count(case when status = 'pending' then 1 end)`
        })
        .from(vibeMatches)
        .where(eq(vibeMatches.userId, userId));

      // Get career field distribution of matches
      const careerDistribution = await db
        .select({
          careerField: vibeMatchProfiles.careerField,
          count: sql<number>`count(*)`
        })
        .from(vibeMatches)
        .innerJoin(vibeMatchProfiles, eq(vibeMatches.matchedUserId, vibeMatchProfiles.userId))
        .where(eq(vibeMatches.userId, userId))
        .groupBy(vibeMatchProfiles.careerField)
        .orderBy(sql`count desc`);

      // Get experience level distribution
      const experienceDistribution = await db
        .select({
          experience: vibeMatchProfiles.experience,
          count: sql<number>`count(*)`
        })
        .from(vibeMatches)
        .innerJoin(vibeMatchProfiles, eq(vibeMatches.matchedUserId, vibeMatchProfiles.userId))
        .where(eq(vibeMatches.userId, userId))
        .groupBy(vibeMatchProfiles.experience)
        .orderBy(sql`count desc`);

      res.json({
        matchStats,
        careerDistribution,
        experienceDistribution
      });
    } catch (error) {
      console.error("Error fetching VibeMatch analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Update match status
  app.put("/api/vibematch/matches/:matchId", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { matchId } = req.params;
      const { status } = z.object({
        status: z.enum(["active", "inactive"])
      }).parse(req.body);

      const [updatedMatch] = await db
        .update(vibeMatches)
        .set({ status })
        .where(and(
          eq(vibeMatches.id, matchId),
          eq(vibeMatches.userId, userId)
        ))
        .returning();

      if (!updatedMatch) {
        return res.status(404).json({ error: "Match not found" });
      }

      res.json(updatedMatch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid status", details: error.errors });
      }
      console.error("Error updating match status:", error);
      res.status(500).json({ error: "Failed to update match" });
    }
  });
}