import { replitDb } from "./replitDatabase";
import { eq, desc, and, gte, like } from "drizzle-orm";
import * as schema from "@shared/schema";

// Knowledge Storage for LightPrompt's core memory and foundation
export class KnowledgeStorage {
  
  // Core knowledge methods for building LightPrompt's foundation
  async storeFoundationMemory(data: {
    category: string;
    key: string;
    value: any;
    description?: string;
    importance?: number;
  }) {
    const memory = await replitDb
      .insert(schema.foundationMemory)
      .values({
        category: data.category,
        key: data.key,
        value: data.value,
        description: data.description,
        importance: data.importance || 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    console.log(`🧠 Foundation memory stored: ${data.category}/${data.key}`);
    return memory[0];
  }

  async getFoundationMemory(category?: string, key?: string) {
    let query = replitDb.select().from(schema.foundationMemory);
    
    if (category && key) {
      query = query.where(and(
        eq(schema.foundationMemory.category, category),
        eq(schema.foundationMemory.key, key)
      ));
    } else if (category) {
      query = query.where(eq(schema.foundationMemory.category, category));
    }
    
    return await query.orderBy(desc(schema.foundationMemory.importance), desc(schema.foundationMemory.updatedAt));
  }

  async updateFoundationMemory(id: string, updates: any) {
    const updated = await replitDb
      .update(schema.foundationMemory)
      .set({ 
        ...updates, 
        updatedAt: new Date() 
      })
      .where(eq(schema.foundationMemory.id, id))
      .returning();
    
    console.log(`🧠 Foundation memory updated: ${id}`);
    return updated[0];
  }

  // Store user insights and patterns for platform improvement
  async storeUserInsight(insight: {
    userId: string;
    type: string;
    pattern: string;
    data: any;
    confidence: number;
  }) {
    const stored = await replitDb
      .insert(schema.userInsights)
      .values({
        userId: insight.userId,
        type: insight.type,
        pattern: insight.pattern,
        data: insight.data,
        confidence: insight.confidence,
        createdAt: new Date()
      })
      .returning();
    
    console.log(`🧠 User insight stored: ${insight.type} for ${insight.userId}`);
    return stored[0];
  }

  async getAggregatedInsights(type?: string, minConfidence = 0.7) {
    let query = replitDb
      .select()
      .from(schema.userInsights)
      .where(gte(schema.userInsights.confidence, minConfidence));
    
    if (type) {
      query = query.where(eq(schema.userInsights.type, type));
    }
    
    return await query.orderBy(desc(schema.userInsights.confidence));
  }

  // Store platform evolution data
  async recordPlatformEvolution(evolution: {
    version: string;
    feature: string;
    impact: string;
    userFeedback: any;
    metrics: any;
  }) {
    const recorded = await replitDb
      .insert(schema.platformEvolution)
      .values({
        version: evolution.version,
        feature: evolution.feature,
        impact: evolution.impact,
        userFeedback: evolution.userFeedback,
        metrics: evolution.metrics,
        timestamp: new Date()
      })
      .returning();
    
    console.log(`🧠 Platform evolution recorded: ${evolution.feature} v${evolution.version}`);
    return recorded[0];
  }

  async getPlatformEvolution(feature?: string) {
    let query = replitDb.select().from(schema.platformEvolution);
    
    if (feature) {
      query = query.where(eq(schema.platformEvolution.feature, feature));
    }
    
    return await query.orderBy(desc(schema.platformEvolution.timestamp));
  }

  // Store AI bot learning and improvements
  async storeBotLearning(learning: {
    botId: string;
    conversationId: string;
    userFeedback: string;
    improvement: string;
    effectiveness: number;
  }) {
    const stored = await replitDb
      .insert(schema.botLearning)
      .values({
        botId: learning.botId,
        conversationId: learning.conversationId,
        userFeedback: learning.userFeedback,
        improvement: learning.improvement,
        effectiveness: learning.effectiveness,
        learnedAt: new Date()
      })
      .returning();
    
    console.log(`🧠 Bot learning stored: ${learning.botId} improvement`);
    return stored[0];
  }

  async getBotLearning(botId: string, minEffectiveness = 0.6) {
    return await replitDb
      .select()
      .from(schema.botLearning)
      .where(and(
        eq(schema.botLearning.botId, botId),
        gte(schema.botLearning.effectiveness, minEffectiveness)
      ))
      .orderBy(desc(schema.botLearning.effectiveness));
  }

  // Store content evolution and user preferences
  async storeContentEvolution(content: {
    type: string;
    originalContent: string;
    improvedContent: string;
    reason: string;
    userEngagement: number;
  }) {
    const stored = await replitDb
      .insert(schema.contentEvolution)
      .values({
        type: content.type,
        originalContent: content.originalContent,
        improvedContent: content.improvedContent,
        reason: content.reason,
        userEngagement: content.userEngagement,
        evolvedAt: new Date()
      })
      .returning();
    
    console.log(`🧠 Content evolution stored: ${content.type}`);
    return stored[0];
  }

  async getContentEvolution(type?: string) {
    let query = replitDb.select().from(schema.contentEvolution);
    
    if (type) {
      query = query.where(eq(schema.contentEvolution.type, type));
    }
    
    return await query.orderBy(desc(schema.contentEvolution.userEngagement));
  }

  // Search knowledge base
  async searchKnowledge(searchTerm: string, limit = 10) {
    const results = await replitDb
      .select()
      .from(schema.foundationMemory)
      .where(like(schema.foundationMemory.description, `%${searchTerm}%`))
      .limit(limit)
      .orderBy(desc(schema.foundationMemory.importance));
    
    console.log(`🧠 Knowledge search: "${searchTerm}" returned ${results.length} results`);
    return results;
  }

  // Get platform summary for AI context
  async getPlatformSummary() {
    const [memories, insights, evolution, botLearning] = await Promise.all([
      this.getFoundationMemory(),
      this.getAggregatedInsights(),
      this.getPlatformEvolution(),
      replitDb.select().from(schema.botLearning).limit(20).orderBy(desc(schema.botLearning.effectiveness))
    ]);

    return {
      foundationMemories: memories.slice(0, 10),
      topInsights: insights.slice(0, 5),
      recentEvolution: evolution.slice(0, 5),
      bestBotLearning: botLearning.slice(0, 5),
      generatedAt: new Date()
    };
  }
}

export const knowledgeStorage = new KnowledgeStorage();