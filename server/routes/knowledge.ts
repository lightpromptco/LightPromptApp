import express from "express";
import { knowledgeStorage } from "../knowledgeStorage";

const router = express.Router();

// Foundation Memory Routes
router.get("/foundation", async (req, res) => {
  try {
    const { category, key } = req.query;
    const memories = await knowledgeStorage.getFoundationMemory(
      category as string, 
      key as string
    );
    res.json(memories);
  } catch (error) {
    console.error("Error fetching foundation memory:", error);
    res.status(500).json({ error: "Failed to fetch foundation memory" });
  }
});

router.post("/foundation", async (req, res) => {
  try {
    const memory = await knowledgeStorage.storeFoundationMemory(req.body);
    res.json(memory);
  } catch (error) {
    console.error("Error storing foundation memory:", error);
    res.status(500).json({ error: "Failed to store foundation memory" });
  }
});

router.put("/foundation/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const memory = await knowledgeStorage.updateFoundationMemory(id, req.body);
    res.json(memory);
  } catch (error) {
    console.error("Error updating foundation memory:", error);
    res.status(500).json({ error: "Failed to update foundation memory" });
  }
});

// User Insights Routes
router.post("/insights", async (req, res) => {
  try {
    const insight = await knowledgeStorage.storeUserInsight(req.body);
    res.json(insight);
  } catch (error) {
    console.error("Error storing user insight:", error);
    res.status(500).json({ error: "Failed to store user insight" });
  }
});

router.get("/insights", async (req, res) => {
  try {
    const { type, minConfidence } = req.query;
    const insights = await knowledgeStorage.getAggregatedInsights(
      type as string,
      minConfidence ? Number(minConfidence) : 0.7
    );
    res.json(insights);
  } catch (error) {
    console.error("Error fetching insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

// Platform Evolution Routes
router.post("/evolution", async (req, res) => {
  try {
    const evolution = await knowledgeStorage.recordPlatformEvolution(req.body);
    res.json(evolution);
  } catch (error) {
    console.error("Error recording platform evolution:", error);
    res.status(500).json({ error: "Failed to record platform evolution" });
  }
});

router.get("/evolution", async (req, res) => {
  try {
    const { feature } = req.query;
    const evolution = await knowledgeStorage.getPlatformEvolution(feature as string);
    res.json(evolution);
  } catch (error) {
    console.error("Error fetching platform evolution:", error);
    res.status(500).json({ error: "Failed to fetch platform evolution" });
  }
});

// Bot Learning Routes
router.post("/bot-learning", async (req, res) => {
  try {
    const learning = await knowledgeStorage.storeBotLearning(req.body);
    res.json(learning);
  } catch (error) {
    console.error("Error storing bot learning:", error);
    res.status(500).json({ error: "Failed to store bot learning" });
  }
});

router.get("/bot-learning/:botId", async (req, res) => {
  try {
    const { botId } = req.params;
    const { minEffectiveness } = req.query;
    const learning = await knowledgeStorage.getBotLearning(
      botId,
      minEffectiveness ? Number(minEffectiveness) : 0.6
    );
    res.json(learning);
  } catch (error) {
    console.error("Error fetching bot learning:", error);
    res.status(500).json({ error: "Failed to fetch bot learning" });
  }
});

// Content Evolution Routes
router.post("/content-evolution", async (req, res) => {
  try {
    const evolution = await knowledgeStorage.storeContentEvolution(req.body);
    res.json(evolution);
  } catch (error) {
    console.error("Error storing content evolution:", error);
    res.status(500).json({ error: "Failed to store content evolution" });
  }
});

router.get("/content-evolution", async (req, res) => {
  try {
    const { type } = req.query;
    const evolution = await knowledgeStorage.getContentEvolution(type as string);
    res.json(evolution);
  } catch (error) {
    console.error("Error fetching content evolution:", error);
    res.status(500).json({ error: "Failed to fetch content evolution" });
  }
});

// Search Knowledge Base
router.get("/search", async (req, res) => {
  try {
    const { q, limit } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const results = await knowledgeStorage.searchKnowledge(
      q as string,
      limit ? Number(limit) : 10
    );
    res.json(results);
  } catch (error) {
    console.error("Error searching knowledge:", error);
    res.status(500).json({ error: "Failed to search knowledge" });
  }
});

// Platform Summary for AI Context
router.get("/summary", async (req, res) => {
  try {
    const summary = await knowledgeStorage.getPlatformSummary();
    res.json(summary);
  } catch (error) {
    console.error("Error fetching platform summary:", error);
    res.status(500).json({ error: "Failed to fetch platform summary" });
  }
});

export default router;