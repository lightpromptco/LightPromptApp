import type { Express } from "express";
import { z } from "zod";

// Simple in-memory content storage for now (replace with database when connection is fixed)
const contentPages = new Map();
const mediaAssets = new Map();

const contentPageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  content: z.object({
    body: z.string(),
    fontFamily: z.string().default("default"),
    customCss: z.string().optional(),
  }),
  template: z.string().default("standard"),
  isPublished: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoKeywords: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
});

export function registerContentRoutes(app: Express) {
  // Initialize some sample pages
  if (contentPages.size === 0) {
    contentPages.set("about", {
      id: "about",
      title: "About LightPrompt",
      slug: "about", 
      description: "Learn about LightPrompt's mission and approach to conscious AI",
      content: {
        body: `# About LightPrompt

LightPrompt is a privacy-first, soul-tech wellness platform that uses AI as a conscious tool for human reflection and self-connection.

## Our Philosophy

AI serves as a mirror to help humans connect to their highest selves, nature, and each other through honest reflection. We believe technology should enhance human consciousness, not replace it.

## Features

- **Conscious AI Conversations**: Chat with specialized bots designed for emotional reflection
- **GeoPrompt**: Location-based mindfulness check-ins
- **VibeMatch**: Connect with others through energetic resonance
- **Wellness Tracking**: Monitor your emotional and spiritual growth

Ready to begin your journey of self-discovery?`,
        fontFamily: "default",
        customCss: ""
      },
      template: "standard",
      isPublished: true,
      seoTitle: "About LightPrompt - Conscious AI for Self-Reflection",
      seoKeywords: ["conscious AI", "self-reflection", "wellness", "mindfulness"],
      featuredImage: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    contentPages.set("course", {
      id: "course",
      title: "LightPrompt:ed Course",
      slug: "course",
      description: "Transform your relationship with AI and consciousness through our comprehensive course",
      content: {
        body: `# LightPrompt:ed - The Human Guide to Conscious AI & Soul Tech

## Course Overview

This comprehensive course teaches you how to use AI as a conscious tool for self-reflection and personal growth.

### What You'll Learn

- **Module 1**: Understanding Conscious AI
- **Module 2**: Creating Sacred Digital Spaces
- **Module 3**: AI-Assisted Self-Reflection Techniques
- **Module 4**: Digital Wellness & Boundaries
- **Module 5**: Building Authentic Connection with Technology

### Course Features

- 5 comprehensive modules
- Interactive exercises and reflections
- Private community access
- Lifetime updates
- 30-day money-back guarantee

**Price**: $120 (Bundle with ebook: $125 - Save $99!)

[Get Started Today →](/products)`,
        fontFamily: "default",
        customCss: ""
      },
      template: "landing",
      isPublished: true,
      seoTitle: "LightPrompt:ed Course - Master Conscious AI",
      seoKeywords: ["AI course", "conscious technology", "digital wellness", "self-reflection"],
      featuredImage: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Get all content pages
  app.get("/api/content/pages", async (req, res) => {
    try {
      const pages = Array.from(contentPages.values());
      res.json(pages);
    } catch (error) {
      console.error("Error fetching content pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Get single page
  app.get("/api/content/pages/:id", async (req, res) => {
    try {
      const page = contentPages.get(req.params.id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Create page
  app.post("/api/content/pages", async (req, res) => {
    try {
      const validatedData = contentPageSchema.parse(req.body);
      const id = validatedData.slug || Date.now().toString();
      
      const page = {
        id,
        ...validatedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      contentPages.set(id, page);
      res.status(201).json(page);
    } catch (error) {
      console.error("Error creating page:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  // Update page
  app.put("/api/content/pages/:id", async (req, res) => {
    try {
      const page = contentPages.get(req.params.id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }

      const validatedData = contentPageSchema.parse(req.body);
      const updatedPage = {
        ...page,
        ...validatedData,
        updatedAt: new Date().toISOString(),
      };

      contentPages.set(req.params.id, updatedPage);
      res.json(updatedPage);
    } catch (error) {
      console.error("Error updating page:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  // Delete page
  app.delete("/api/content/pages/:id", async (req, res) => {
    try {
      const deleted = contentPages.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json({ message: "Page deleted successfully" });
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // Get media assets
  app.get("/api/content/media", async (req, res) => {
    try {
      const assets = Array.from(mediaAssets.values());
      res.json(assets);
    } catch (error) {
      console.error("Error fetching media:", error);
      res.status(500).json({ message: "Failed to fetch media" });
    }
  });
}