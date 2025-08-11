import type { Express } from "express";
import { db } from "../db";
import { geoPromptLocations, geoPromptVisits, users } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth, optionalAuth } from "../middleware/auth";

// Validation schemas
const createLocationSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  promptType: z.enum(["reflection", "mindfulness", "gratitude", "intention", "nature"]),
  prompt: z.string().min(1),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner")
});

const visitLocationSchema = z.object({
  locationId: z.string(),
  response: z.string().optional(),
  mood: z.enum(["grateful", "peaceful", "inspired", "reflective", "energized", "calm"]).optional(),
  rating: z.number().min(1).max(5).optional()
});

const nearbyLocationsSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0.1).max(50).default(5) // miles
});

export function registerGeoPromptRoutes(app: Express) {
  // Get all public GeoPrompt locations
  app.get("/api/geoprompt/locations", async (req, res) => {
    try {
      const locations = await db
        .select({
          id: geoPromptLocations.id,
          title: geoPromptLocations.title,
          description: geoPromptLocations.description,
          latitude: geoPromptLocations.latitude,
          longitude: geoPromptLocations.longitude,
          promptType: geoPromptLocations.promptType,
          tags: geoPromptLocations.tags,
          visitCount: geoPromptLocations.visitCount,
          averageRating: geoPromptLocations.averageRating,
          createdAt: geoPromptLocations.createdAt
        })
        .from(geoPromptLocations)
        .where(eq(geoPromptLocations.isActive, true))
        .orderBy(desc(geoPromptLocations.createdAt));

      res.json(locations);
    } catch (error) {
      console.error("Error fetching GeoPrompt locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // Get nearby GeoPrompt locations
  app.post("/api/geoprompt/locations/nearby", async (req, res) => {
    try {
      const { latitude, longitude, radius } = nearbyLocationsSchema.parse(req.body);
      
      // Using the Haversine formula for distance calculation
      const nearbyLocations = await db
        .select({
          id: geoPromptLocations.id,
          title: geoPromptLocations.title,
          description: geoPromptLocations.description,
          latitude: geoPromptLocations.latitude,
          longitude: geoPromptLocations.longitude,
          promptType: geoPromptLocations.promptType,
          prompt: geoPromptLocations.prompt,
          tags: geoPromptLocations.tags,
          difficulty: geoPromptLocations.difficulty,
          visitCount: geoPromptLocations.visitCount,
          averageRating: geoPromptLocations.averageRating,
          distance: sql<number>`
            3959 * acos(
              cos(radians(${latitude})) * cos(radians(latitude)) * 
              cos(radians(longitude) - radians(${longitude})) + 
              sin(radians(${latitude})) * sin(radians(latitude))
            )
          `
        })
        .from(geoPromptLocations)
        .where(eq(geoPromptLocations.isPublic, true))
        .having(sql`
          3959 * acos(
            cos(radians(${latitude})) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * sin(radians(latitude))
          ) <= ${radius}
        `)
        .orderBy(sql`distance`);

      res.json(nearbyLocations);
    } catch (error) {
      console.error("Error fetching nearby locations:", error);
      res.status(500).json({ error: "Failed to fetch nearby locations" });
    }
  });

  // Create a new GeoPrompt location (requires authentication)
  app.post("/api/geoprompt/locations", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const locationData = createLocationSchema.parse(req.body);
      
      const [newLocation] = await db
        .insert(geoPromptLocations)
        .values({
          ...locationData,
          createdBy: userId,
          qrCode: `https://lightprompt.co/geoprompt/${Math.random().toString(36).substring(2, 15)}`
        })
        .returning();

      res.status(201).json(newLocation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid location data", details: error.errors });
      }
      console.error("Error creating GeoPrompt location:", error);
      res.status(500).json({ error: "Failed to create location" });
    }
  });

  // Visit a GeoPrompt location (check-in)
  app.post("/api/geoprompt/visits", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const visitData = visitLocationSchema.parse(req.body);
      
      // Create the visit record
      const [visit] = await db
        .insert(geoPromptVisits)
        .values({
          ...visitData,
          userId
        })
        .returning();

      // Update location statistics
      await db
        .update(geoPromptLocations)
        .set({
          visitCount: sql`visit_count + 1`,
          averageRating: visitData.rating ? 
            sql`CASE 
              WHEN average_rating IS NULL THEN ${visitData.rating}
              ELSE (average_rating * (visit_count - 1) + ${visitData.rating}) / visit_count
            END` : 
            geoPromptLocations.averageRating
        })
        .where(eq(geoPromptLocations.id, visitData.locationId));

      res.status(201).json(visit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid visit data", details: error.errors });
      }
      console.error("Error creating GeoPrompt visit:", error);
      res.status(500).json({ error: "Failed to record visit" });
    }
  });

  // Get user's GeoPrompt visit history
  app.get("/api/geoprompt/visits/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const visits = await db
        .select({
          id: geoPromptVisits.id,
          response: geoPromptVisits.response,
          mood: geoPromptVisits.mood,
          rating: geoPromptVisits.rating,
          visitedAt: geoPromptVisits.visitedAt,
          location: {
            id: geoPromptLocations.id,
            name: geoPromptLocations.name,
            promptType: geoPromptLocations.promptType,
            prompt: geoPromptLocations.prompt
          }
        })
        .from(geoPromptVisits)
        .innerJoin(geoPromptLocations, eq(geoPromptVisits.locationId, geoPromptLocations.id))
        .where(eq(geoPromptVisits.userId, userId))
        .orderBy(desc(geoPromptVisits.visitedAt));

      res.json(visits);
    } catch (error) {
      console.error("Error fetching user visits:", error);
      res.status(500).json({ error: "Failed to fetch visit history" });
    }
  });

  // Get GeoPrompt analytics for a user
  app.get("/api/geoprompt/analytics/me", requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get visit statistics
      const [visitStats] = await db
        .select({
          totalVisits: sql<number>`count(*)`,
          uniqueLocations: sql<number>`count(distinct location_id)`,
          averageRating: sql<number>`avg(rating)`,
          favoritePromptType: sql<string>`
            mode() within group (order by ${geoPromptLocations.promptType})
          `,
          totalReflections: sql<number>`count(case when response is not null then 1 end)`
        })
        .from(geoPromptVisits)
        .innerJoin(geoPromptLocations, eq(geoPromptVisits.locationId, geoPromptLocations.id))
        .where(eq(geoPromptVisits.userId, userId));

      // Get mood trends
      const moodTrends = await db
        .select({
          mood: geoPromptVisits.mood,
          count: sql<number>`count(*)`
        })
        .from(geoPromptVisits)
        .where(and(
          eq(geoPromptVisits.userId, userId),
          sql`mood is not null`
        ))
        .groupBy(geoPromptVisits.mood)
        .orderBy(sql`count desc`);

      res.json({
        visitStats,
        moodTrends
      });
    } catch (error) {
      console.error("Error fetching GeoPrompt analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
}