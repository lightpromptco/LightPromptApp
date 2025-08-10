import { Router } from "express";
import { db } from "../db";
import { wellnessMetrics, users } from "@shared/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Emotion check-in schema
const emotionCheckInSchema = z.object({
  mood: z.string(),
  energy: z.number().min(1).max(10),
  stress: z.number().min(1).max(10),
  gratitude: z.string().optional(),
  reflection: z.string().optional(),
  goals: z.array(z.string()).optional()
});

// Create emotion check-in
router.post("/checkin", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const data = emotionCheckInSchema.parse(req.body);
    
    const checkin = await db.insert(wellnessMetrics).values({
      userId,
      ...data,
      goals: data.goals || [],
      achievements: [],
      metadata: {}
    }).returning();

    res.json(checkin[0]);
  } catch (error: any) {
    console.error("Error creating emotion check-in:", error);
    res.status(500).json({ error: "Failed to create check-in" });
  }
});

// Get recent emotion data for user
router.get("/emotions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const emotions = await db
      .select()
      .from(wellnessMetrics)
      .where(eq(wellnessMetrics.userId, userId))
      .orderBy(desc(wellnessMetrics.date))
      .limit(30);

    // Calculate emotion statistics
    const totalEntries = emotions.length;
    if (totalEntries === 0) {
      return res.json({
        emotions: [],
        dominantMood: "neutral",
        averageEnergy: 5,
        averageStress: 5,
        totalEntries: 0,
        calmPercentage: 0
      });
    }

    const moodCounts = emotions.reduce((acc, entry) => {
      acc[entry.mood || "neutral"] = (acc[entry.mood || "neutral"] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "neutral";

    const averageEnergy = emotions
      .filter(e => e.energy)
      .reduce((sum, e) => sum + (e.energy || 0), 0) / totalEntries;

    const averageStress = emotions
      .filter(e => e.stress) 
      .reduce((sum, e) => sum + (e.stress || 0), 0) / totalEntries;

    // Calculate calm percentage (energy >= 6 and stress <= 4)
    const calmEntries = emotions.filter(e => 
      (e.energy || 0) >= 6 && (e.stress || 0) <= 4
    );
    const calmPercentage = (calmEntries.length / totalEntries) * 100;

    res.json({
      emotions: emotions.slice(0, 10), // Return last 10 entries
      dominantMood,
      averageEnergy: Math.round(averageEnergy * 10) / 10,
      averageStress: Math.round(averageStress * 10) / 10,
      totalEntries,
      calmPercentage: Math.round(calmPercentage),
      moodDistribution: moodCounts
    });

  } catch (error: any) {
    console.error("Error fetching emotions:", error);
    res.status(500).json({ error: "Failed to fetch emotions" });
  }
});

// Get weekly emotion trends  
router.get("/trends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyData = await db
      .select()
      .from(wellnessMetrics)
      .where(
        and(
          eq(wellnessMetrics.userId, userId),
          gte(wellnessMetrics.date, sevenDaysAgo)
        )
      )
      .orderBy(desc(wellnessMetrics.date));

    // Group by day for trend analysis
    const dailyTrends = weeklyData.reduce((acc, entry) => {
      const day = entry.date.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = { moods: [], energy: [], stress: [], count: 0 };
      }
      acc[day].moods.push(entry.mood || "neutral");
      acc[day].energy.push(entry.energy || 5);
      acc[day].stress.push(entry.stress || 5);
      acc[day].count++;
      return acc;
    }, {} as Record<string, any>);

    res.json({
      weeklyData,
      dailyTrends,
      totalCheckins: weeklyData.length
    });

  } catch (error: any) {
    console.error("Error fetching trends:", error);
    res.status(500).json({ error: "Failed to fetch trends" });
  }
});

export default router;