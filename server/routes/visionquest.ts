import type { Express } from "express";
import { db } from "../db";
import { visionQuestQuests, visionQuestProgress, visionQuestBadges, users } from "@shared/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

// Validation schemas
const submitResponseSchema = z.object({
  questId: z.string(),
  userResponse: z.string().min(1),
  responseTime: z.number().min(0).optional(),
  emotionalState: z.string().optional(),
  confidence: z.enum(["low", "medium", "high"]).optional(),
  reflection: z.string().optional()
});

const questFiltersSchema = z.object({
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  questType: z.enum(["intuition", "empathy", "pattern_recognition", "synchronicity", "creative_insight"]).optional(),
  completed: z.boolean().optional()
});

export function registerVisionQuestRoutes(app: Express) {
  // Get all available VisionQuest quests
  app.get("/api/visionquest/quests", async (req, res) => {
    try {
      const { difficulty, questType } = questFiltersSchema.parse(req.query);
      
      const whereConditions = [];
      whereConditions.push(eq(visionQuestQuests.isActive, true));
      
      if (difficulty) {
        whereConditions.push(eq(visionQuestQuests.difficulty, difficulty));
      }
      if (questType) {
        whereConditions.push(eq(visionQuestQuests.questType, questType));
      }

      const quests = await db
        .select({
          id: visionQuestQuests.id,
          title: visionQuestQuests.title,
          description: visionQuestQuests.description,
          questType: visionQuestQuests.questType,
          difficulty: visionQuestQuests.difficulty,
          estimatedTime: visionQuestQuests.estimatedTime,
          instructions: visionQuestQuests.instructions,
          successCriteria: visionQuestQuests.successCriteria,
          tags: visionQuestQuests.tags,
          completionCount: sql<number>`
            (SELECT COUNT(*) FROM ${visionQuestProgress} WHERE quest_id = ${visionQuestQuests.id})
          `,
          averageScore: sql<number>`
            (SELECT AVG(intuition_score) FROM ${visionQuestProgress} WHERE quest_id = ${visionQuestQuests.id} AND intuition_score IS NOT NULL)
          `
        })
        .from(visionQuestQuests)
        .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0])
        .orderBy(visionQuestQuests.order, visionQuestQuests.createdAt);

      res.json(quests);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid filters", details: error.errors });
      }
      console.error("Error fetching VisionQuest quests:", error);
      res.status(500).json({ error: "Failed to fetch quests" });
    }
  });

  // Get a specific quest by ID
  app.get("/api/visionquest/quests/:questId", async (req, res) => {
    try {
      const { questId } = req.params;
      
      const [quest] = await db
        .select()
        .from(visionQuestQuests)
        .where(and(
          eq(visionQuestQuests.id, questId),
          eq(visionQuestQuests.isActive, true)
        ));

      if (!quest) {
        return res.status(404).json({ error: "Quest not found" });
      }

      res.json(quest);
    } catch (error) {
      console.error("Error fetching quest:", error);
      res.status(500).json({ error: "Failed to fetch quest" });
    }
  });

  // Submit a quest response
  app.post("/api/visionquest/progress", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const responseData = submitResponseSchema.parse(req.body);
      
      // Calculate intuition score (simplified version)
      // In a real implementation, this would use AI/ML to evaluate the response
      const intuitionScore = Math.random() * 100; // Placeholder algorithm
      
      const [progress] = await db
        .insert(visionQuestProgress)
        .values({
          ...responseData,
          userId,
          intuitionScore
        })
        .returning();

      // Check for badge unlocks
      await checkAndUnlockBadges(userId);

      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid response data", details: error.errors });
      }
      console.error("Error submitting quest response:", error);
      res.status(500).json({ error: "Failed to submit response" });
    }
  });

  // Get user's VisionQuest progress
  app.get("/api/visionquest/progress/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const progress = await db
        .select({
          id: visionQuestProgress.id,
          userResponse: visionQuestProgress.userResponse,
          responseTime: visionQuestProgress.responseTime,
          intuitionScore: visionQuestProgress.intuitionScore,
          emotionalState: visionQuestProgress.emotionalState,
          confidence: visionQuestProgress.confidence,
          reflection: visionQuestProgress.reflection,
          completedAt: visionQuestProgress.completedAt,
          quest: {
            id: visionQuestQuests.id,
            title: visionQuestQuests.title,
            questType: visionQuestQuests.questType,
            difficulty: visionQuestQuests.difficulty
          }
        })
        .from(visionQuestProgress)
        .innerJoin(visionQuestQuests, eq(visionQuestProgress.questId, visionQuestQuests.id))
        .where(eq(visionQuestProgress.userId, userId))
        .orderBy(desc(visionQuestProgress.completedAt));

      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Get user's VisionQuest badges
  app.get("/api/visionquest/badges/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const badges = await db
        .select()
        .from(visionQuestBadges)
        .where(eq(visionQuestBadges.userId, userId))
        .orderBy(desc(visionQuestBadges.unlockedAt));

      res.json(badges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  });

  // Get VisionQuest analytics for a user
  app.get("/api/visionquest/analytics/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get overall statistics
      const [stats] = await db
        .select({
          totalQuests: sql<number>`count(*)`,
          averageScore: sql<number>`avg(intuition_score)`,
          highestScore: sql<number>`max(intuition_score)`,
          totalBadges: sql<number>`(SELECT count(*) FROM ${visionQuestBadges} WHERE user_id = ${userId})`
        })
        .from(visionQuestProgress)
        .where(eq(visionQuestProgress.userId, userId));

      // Get quest type distribution
      const questTypeDistribution = await db
        .select({
          questType: visionQuestQuests.questType,
          count: sql<number>`count(*)`,
          averageScore: sql<number>`avg(${visionQuestProgress.intuitionScore})`
        })
        .from(visionQuestProgress)
        .innerJoin(visionQuestQuests, eq(visionQuestProgress.questId, visionQuestQuests.id))
        .where(eq(visionQuestProgress.userId, userId))
        .groupBy(visionQuestQuests.questType)
        .orderBy(sql`count desc`);

      // Get confidence trends
      const confidenceTrends = await db
        .select({
          confidence: visionQuestProgress.confidence,
          count: sql<number>`count(*)`,
          averageScore: sql<number>`avg(intuition_score)`
        })
        .from(visionQuestProgress)
        .where(and(
          eq(visionQuestProgress.userId, userId),
          sql`confidence is not null`
        ))
        .groupBy(visionQuestProgress.confidence)
        .orderBy(sql`count desc`);

      // Get emotional state patterns
      const emotionalPatterns = await db
        .select({
          emotionalState: visionQuestProgress.emotionalState,
          count: sql<number>`count(*)`,
          averageScore: sql<number>`avg(intuition_score)`
        })
        .from(visionQuestProgress)
        .where(and(
          eq(visionQuestProgress.userId, userId),
          sql`emotional_state is not null`
        ))
        .groupBy(visionQuestProgress.emotionalState)
        .orderBy(sql`count desc`);

      res.json({
        stats,
        questTypeDistribution,
        confidenceTrends,
        emotionalPatterns
      });
    } catch (error) {
      console.error("Error fetching VisionQuest analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Get leaderboard (top scores)
  app.get("/api/visionquest/leaderboard", async (req, res) => {
    try {
      const { questType, timeframe } = z.object({
        questType: z.enum(["intuition", "empathy", "pattern_recognition", "synchronicity", "creative_insight"]).optional(),
        timeframe: z.enum(["week", "month", "all"]).default("month")
      }).parse(req.query);

      let timeFilter = sql`true`;
      if (timeframe === "week") {
        timeFilter = sql`completed_at >= now() - interval '7 days'`;
      } else if (timeframe === "month") {
        timeFilter = sql`completed_at >= now() - interval '30 days'`;
      }

      let questTypeFilter = sql`true`;
      if (questType) {
        questTypeFilter = eq(visionQuestQuests.questType, questType);
      }

      const leaderboard = await db
        .select({
          userId: visionQuestProgress.userId,
          userName: users.name,
          averageScore: sql<number>`avg(${visionQuestProgress.intuitionScore})`,
          totalQuests: sql<number>`count(*)`,
          highestScore: sql<number>`max(${visionQuestProgress.intuitionScore})`
        })
        .from(visionQuestProgress)
        .innerJoin(visionQuestQuests, eq(visionQuestProgress.questId, visionQuestQuests.id))
        .innerJoin(users, eq(visionQuestProgress.userId, users.id))
        .where(and(timeFilter, questTypeFilter))
        .groupBy(visionQuestProgress.userId, users.name)
        .orderBy(sql`avg(${visionQuestProgress.intuitionScore}) desc`)
        .limit(50);

      res.json(leaderboard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid parameters", details: error.errors });
      }
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });
}

// Helper function to check and unlock badges
async function checkAndUnlockBadges(userId: string) {
  try {
    // Get user's quest completion stats
    const [stats] = await db
      .select({
        totalQuests: sql<number>`count(*)`,
        averageScore: sql<number>`avg(intuition_score)`,
        highestScore: sql<number>`max(intuition_score)`,
        questTypes: sql<string[]>`array_agg(distinct ${visionQuestQuests.questType})`
      })
      .from(visionQuestProgress)
      .innerJoin(visionQuestQuests, eq(visionQuestProgress.questId, visionQuestQuests.id))
      .where(eq(visionQuestProgress.userId, userId));

    const badgesToUnlock = [];

    // Check for various badge criteria
    if (stats.totalQuests >= 1 && stats.totalQuests < 5) {
      badgesToUnlock.push({
        badgeType: "first_sight",
        badgeName: "First Sight",
        badgeDescription: "Completed your first VisionQuest challenge"
      });
    }

    if (stats.totalQuests >= 10) {
      badgesToUnlock.push({
        badgeType: "pattern_breaker",
        badgeName: "Pattern Breaker",
        badgeDescription: "Completed 10 VisionQuest challenges"
      });
    }

    if (stats.averageScore >= 80) {
      badgesToUnlock.push({
        badgeType: "mind_mirror",
        badgeName: "Mind Mirror",
        badgeDescription: "Achieved an average intuition score of 80+"
      });
    }

    if (stats.questTypes.length >= 3) {
      badgesToUnlock.push({
        badgeType: "synchronicity_tracker",
        badgeName: "Synchronicity Tracker",
        badgeDescription: "Completed quests in 3 different categories"
      });
    }

    // Insert new badges (avoiding duplicates)
    for (const badge of badgesToUnlock) {
      await db
        .insert(visionQuestBadges)
        .values({
          userId,
          ...badge
        })
        .onConflictDoNothing();
    }
  } catch (error) {
    console.error("Error checking for badge unlocks:", error);
    // Don't throw - badge checking is non-critical
  }
}