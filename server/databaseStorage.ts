import { 
  User, InsertUser, ChatSession, InsertChatSession, 
  Message, InsertMessage, UserProfile, InsertUserProfile,
  AccessCode, InsertAccessCode, WellnessMetric, InsertWellnessMetric,
  Habit, InsertHabit, HabitEntry, InsertHabitEntry,
  AppleHealthData, InsertAppleHealthData, HomeKitData, InsertHomeKitData,
  WellnessPattern, Recommendation, InsertRecommendation,
  FitnessData, InsertFitnessData, DeviceIntegration, InsertDeviceIntegration
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import * as schema from "@shared/schema";

// Core interface with only the essential methods
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Chat Sessions
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getUserChatSessions(userId: string): Promise<ChatSession[]>;
  getBotChatSessions(userId: string, botId: string): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession>;
  
  // Messages
  getMessage(id: string): Promise<Message | undefined>;
  getSessionMessages(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  
  // Access Codes
  getAccessCode(code: string): Promise<AccessCode | undefined>;
  createAccessCode(accessCode: InsertAccessCode): Promise<AccessCode>;
  redeemAccessCode(code: string, userId: string): Promise<AccessCode>;
  
  // Usage tracking
  incrementTokenUsage(userId: string): Promise<void>;
  resetTokenUsage(userId: string): Promise<void>;
  
  // Tier management
  upgradeTier(userId: string, planId: string): Promise<User>;
  
  // Wellness Dashboard
  getWellnessMetrics(userId: string, days?: number): Promise<WellnessMetric[]>;
  createWellnessMetric(metric: InsertWellnessMetric): Promise<WellnessMetric>;
  updateWellnessMetric(id: string, updates: Partial<WellnessMetric>): Promise<WellnessMetric>;
  
  // Habits
  getUserHabits(userId: string): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: string): Promise<void>;
  
  // Habit Entries
  getHabitEntries(habitId: string, days?: number): Promise<HabitEntry[]>;
  createHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry>;
  updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry>;
  
  // Apple Health Data
  getAppleHealthData(userId: string, days?: number): Promise<AppleHealthData[]>;
  syncAppleHealthData(data: InsertAppleHealthData): Promise<AppleHealthData>;
  
  // HomeKit Data
  getHomeKitData(userId: string, days?: number): Promise<HomeKitData[]>;
  syncHomeKitData(data: InsertHomeKitData): Promise<HomeKitData>;
  
  // Wellness Patterns
  getWellnessPatterns(userId: string): Promise<WellnessPattern[]>;
  detectPatterns(userId: string): Promise<WellnessPattern[]>;

  // Recommendations
  getRecommendations(userId: string, limit?: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendation(id: string, updates: Partial<Recommendation>): Promise<Recommendation>;
  generateRecommendations(userId: string): Promise<Recommendation[]>;

  // Fitness data
  getFitnessData(userId: string, days?: number): Promise<FitnessData[]>;
  createFitnessData(fitnessData: InsertFitnessData): Promise<FitnessData>;
  getLatestFitnessData(userId: string): Promise<FitnessData | null>;

  // Device integrations
  getDeviceIntegrations(userId: string): Promise<DeviceIntegration[]>;
  createDeviceIntegration(integration: InsertDeviceIntegration): Promise<DeviceIntegration>;
  updateDeviceIntegration(userId: string, deviceType: string, updates: Partial<DeviceIntegration>): Promise<DeviceIntegration>;
  syncDeviceData(userId: string, deviceType: string): Promise<any>;

  // Simplified methods for non-core features
  getSoulMap(userId: string): Promise<any | undefined>;
  createSoulMap(soulMapData: any): Promise<any>;
  getVisionQuest(userId: string): Promise<any | undefined>;
  createVisionQuest(questData: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(schema.users)
      .values(insertUser)
      .returning();
    
    // Create default profile
    await this.createUserProfile({ userId: user.id });
    
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, id))
      .returning();
    return user;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(schema.chatSessions).where(eq(schema.chatSessions.id, id));
    return session || undefined;
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    return await db
      .select()
      .from(schema.chatSessions)
      .where(eq(schema.chatSessions.userId, userId))
      .orderBy(desc(schema.chatSessions.updatedAt));
  }

  async getBotChatSessions(userId: string, botId: string): Promise<ChatSession[]> {
    return await db
      .select()
      .from(schema.chatSessions)
      .where(and(
        eq(schema.chatSessions.userId, userId),
        eq(schema.chatSessions.botId, botId)
      ))
      .orderBy(desc(schema.chatSessions.updatedAt));
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(schema.chatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const [session] = await db
      .update(schema.chatSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.chatSessions.id, id))
      .returning();
    return session;
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const [message] = await db.select().from(schema.messages).where(eq(schema.messages.id, id));
    return message || undefined;
  }

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    return await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.sessionId, sessionId))
      .orderBy(schema.messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(schema.messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(schema.userProfiles).where(eq(schema.userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(schema.userProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const [profile] = await db
      .update(schema.userProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.userProfiles.userId, userId))
      .returning();
    return profile;
  }

  async getAccessCode(code: string): Promise<AccessCode | undefined> {
    const [accessCode] = await db.select().from(schema.accessCodes).where(eq(schema.accessCodes.code, code));
    return accessCode || undefined;
  }

  async createAccessCode(insertAccessCode: InsertAccessCode): Promise<AccessCode> {
    const [accessCode] = await db
      .insert(schema.accessCodes)
      .values(insertAccessCode)
      .returning();
    return accessCode;
  }

  async redeemAccessCode(code: string, userId: string): Promise<AccessCode> {
    const [accessCode] = await db
      .update(schema.accessCodes)
      .set({
        isUsed: true,
        usedBy: userId,
        usedAt: new Date()
      })
      .where(eq(schema.accessCodes.code, code))
      .returning();
    return accessCode;
  }

  async incrementTokenUsage(userId: string): Promise<void> {
    await db
      .update(schema.users)
      .set({
        tokensUsed: sql`${schema.users.tokensUsed} + 1`
      })
      .where(eq(schema.users.id, userId));
  }

  async resetTokenUsage(userId: string): Promise<void> {
    await db
      .update(schema.users)
      .set({
        tokensUsed: 0,
        resetDate: new Date()
      })
      .where(eq(schema.users.id, userId));
  }

  async upgradeTier(userId: string, planId: string): Promise<User> {
    const [user] = await db
      .update(schema.users)
      .set({ tier: planId })
      .where(eq(schema.users.id, userId))
      .returning();
    return user;
  }

  async getWellnessMetrics(userId: string, days?: number): Promise<WellnessMetric[]> {
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return await db
        .select()
        .from(schema.wellnessMetrics)
        .where(and(
          eq(schema.wellnessMetrics.userId, userId),
          gte(schema.wellnessMetrics.date, daysAgo)
        ))
        .orderBy(desc(schema.wellnessMetrics.date));
    }
    
    return await db
      .select()
      .from(schema.wellnessMetrics)
      .where(eq(schema.wellnessMetrics.userId, userId))
      .orderBy(desc(schema.wellnessMetrics.date));
  }

  async createWellnessMetric(insertMetric: InsertWellnessMetric): Promise<WellnessMetric> {
    const [metric] = await db
      .insert(schema.wellnessMetrics)
      .values(insertMetric)
      .returning();
    return metric;
  }

  async updateWellnessMetric(id: string, updates: Partial<WellnessMetric>): Promise<WellnessMetric> {
    const [metric] = await db
      .update(schema.wellnessMetrics)
      .set(updates)
      .where(eq(schema.wellnessMetrics.id, id))
      .returning();
    return metric;
  }

  async getUserHabits(userId: string): Promise<Habit[]> {
    return await db
      .select()
      .from(schema.habits)
      .where(and(
        eq(schema.habits.userId, userId),
        eq(schema.habits.isActive, true)
      ))
      .orderBy(schema.habits.createdAt);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db
      .insert(schema.habits)
      .values(insertHabit)
      .returning();
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    const [habit] = await db
      .update(schema.habits)
      .set(updates)
      .where(eq(schema.habits.id, id))
      .returning();
    return habit;
  }

  async deleteHabit(id: string): Promise<void> {
    await db
      .update(schema.habits)
      .set({ isActive: false })
      .where(eq(schema.habits.id, id));
  }

  async getHabitEntries(habitId: string, days?: number): Promise<HabitEntry[]> {
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return await db
        .select()
        .from(schema.habitEntries)
        .where(and(
          eq(schema.habitEntries.habitId, habitId),
          gte(schema.habitEntries.date, daysAgo)
        ))
        .orderBy(desc(schema.habitEntries.date));
    }
    
    return await db
      .select()
      .from(schema.habitEntries)
      .where(eq(schema.habitEntries.habitId, habitId))
      .orderBy(desc(schema.habitEntries.date));
  }

  async createHabitEntry(insertEntry: InsertHabitEntry): Promise<HabitEntry> {
    const [entry] = await db
      .insert(schema.habitEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry> {
    const [entry] = await db
      .update(schema.habitEntries)
      .set(updates)
      .where(eq(schema.habitEntries.id, id))
      .returning();
    return entry;
  }

  async getAppleHealthData(userId: string, days?: number): Promise<AppleHealthData[]> {
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return await db
        .select()
        .from(schema.appleHealthData)
        .where(and(
          eq(schema.appleHealthData.userId, userId),
          gte(schema.appleHealthData.date, daysAgo)
        ))
        .orderBy(desc(schema.appleHealthData.date));
    }
    
    return await db
      .select()
      .from(schema.appleHealthData)
      .where(eq(schema.appleHealthData.userId, userId))
      .orderBy(desc(schema.appleHealthData.date));
  }

  async syncAppleHealthData(insertData: InsertAppleHealthData): Promise<AppleHealthData> {
    const [data] = await db
      .insert(schema.appleHealthData)
      .values(insertData)
      .returning();
    return data;
  }

  async getHomeKitData(userId: string, days?: number): Promise<HomeKitData[]> {
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return await db
        .select()
        .from(schema.homeKitData)
        .where(and(
          eq(schema.homeKitData.userId, userId),
          gte(schema.homeKitData.date, daysAgo)
        ))
        .orderBy(desc(schema.homeKitData.date));
    }
    
    return await db
      .select()
      .from(schema.homeKitData)
      .where(eq(schema.homeKitData.userId, userId))
      .orderBy(desc(schema.homeKitData.date));
  }

  async syncHomeKitData(insertData: InsertHomeKitData): Promise<HomeKitData> {
    const [data] = await db
      .insert(schema.homeKitData)
      .values(insertData)
      .returning();
    return data;
  }

  async getWellnessPatterns(userId: string): Promise<WellnessPattern[]> {
    return await db
      .select()
      .from(schema.wellnessPatterns)
      .where(and(
        eq(schema.wellnessPatterns.userId, userId),
        eq(schema.wellnessPatterns.isActive, true)
      ))
      .orderBy(desc(schema.wellnessPatterns.detectedAt));
  }

  async detectPatterns(userId: string): Promise<WellnessPattern[]> {
    // Simplified pattern detection - in real implementation would analyze data
    return await this.getWellnessPatterns(userId);
  }

  async getRecommendations(userId: string, limit?: number): Promise<Recommendation[]> {
    if (limit) {
      return await db
        .select()
        .from(schema.recommendations)
        .where(eq(schema.recommendations.userId, userId))
        .orderBy(desc(schema.recommendations.createdAt))
        .limit(limit);
    }
    
    return await db
      .select()
      .from(schema.recommendations)
      .where(eq(schema.recommendations.userId, userId))
      .orderBy(desc(schema.recommendations.createdAt));
  }

  async createRecommendation(insertRecommendation: InsertRecommendation): Promise<Recommendation> {
    const [recommendation] = await db
      .insert(schema.recommendations)
      .values(insertRecommendation)
      .returning();
    return recommendation;
  }

  async updateRecommendation(id: string, updates: Partial<Recommendation>): Promise<Recommendation> {
    const [recommendation] = await db
      .update(schema.recommendations)
      .set(updates)
      .where(eq(schema.recommendations.id, id))
      .returning();
    return recommendation;
  }

  async generateRecommendations(userId: string): Promise<Recommendation[]> {
    // Simplified - in real implementation would analyze user data to generate recommendations
    return await this.getRecommendations(userId, 5);
  }

  async getFitnessData(userId: string, days?: number): Promise<FitnessData[]> {
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - days);
      return await db
        .select()
        .from(schema.fitnessData)
        .where(and(
          eq(schema.fitnessData.userId, userId),
          gte(schema.fitnessData.date, daysAgo)
        ))
        .orderBy(desc(schema.fitnessData.date));
    }
    
    return await db
      .select()
      .from(schema.fitnessData)
      .where(eq(schema.fitnessData.userId, userId))
      .orderBy(desc(schema.fitnessData.date));
  }

  async createFitnessData(insertFitnessData: InsertFitnessData): Promise<FitnessData> {
    const [data] = await db
      .insert(schema.fitnessData)
      .values(insertFitnessData)
      .returning();
    return data;
  }

  async getLatestFitnessData(userId: string): Promise<FitnessData | null> {
    const [data] = await db
      .select()
      .from(schema.fitnessData)
      .where(eq(schema.fitnessData.userId, userId))
      .orderBy(desc(schema.fitnessData.date))
      .limit(1);
    return data || null;
  }

  async getDeviceIntegrations(userId: string): Promise<DeviceIntegration[]> {
    return await db
      .select()
      .from(schema.deviceIntegrations)
      .where(eq(schema.deviceIntegrations.userId, userId))
      .orderBy(schema.deviceIntegrations.createdAt);
  }

  async createDeviceIntegration(insertIntegration: InsertDeviceIntegration): Promise<DeviceIntegration> {
    const [integration] = await db
      .insert(schema.deviceIntegrations)
      .values(insertIntegration)
      .returning();
    return integration;
  }

  async updateDeviceIntegration(userId: string, deviceType: string, updates: Partial<DeviceIntegration>): Promise<DeviceIntegration> {
    const [integration] = await db
      .update(schema.deviceIntegrations)
      .set(updates)
      .where(and(
        eq(schema.deviceIntegrations.userId, userId),
        eq(schema.deviceIntegrations.deviceType, deviceType)
      ))
      .returning();
    return integration;
  }

  async syncDeviceData(userId: string, deviceType: string): Promise<any> {
    // Simplified - would implement actual device sync logic
    return { synced: true, deviceType, userId };
  }

  // Simplified implementations for non-core features
  async getSoulMap(userId: string): Promise<any | undefined> {
    // Simple in-memory implementation for now
    return undefined;
  }

  async createSoulMap(soulMapData: any): Promise<any> {
    // Simple in-memory implementation for now
    return soulMapData;
  }

  async getVisionQuest(userId: string): Promise<any | undefined> {
    // Simple in-memory implementation for now
    return undefined;
  }

  async createVisionQuest(questData: any): Promise<any> {
    // Simple in-memory implementation for now
    return questData;
  }
}

export const storage = new DatabaseStorage();