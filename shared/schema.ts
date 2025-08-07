import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  tier: text("tier").notNull().default("free"), // free, tier_29, tier_49, admin
  role: text("role").notNull().default("user"), // user, admin
  tokensUsed: integer("tokens_used").notNull().default(0),
  tokenLimit: integer("token_limit").notNull().default(10),
  resetDate: timestamp("reset_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  botId: text("bot_id").notNull(), // lightpromptbot, bodymirror, soulmap, visionquest
  title: text("title"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // user, assistant
  content: text("content").notNull(),
  audioUrl: text("audio_url"),
  sentiment: text("sentiment"), // positive, negative, neutral
  sentimentScore: integer("sentiment_score"), // -100 to 100
  metadata: jsonb("metadata"), // for additional bot-specific data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  currentMood: text("current_mood").default("neutral"),
  moodDescription: text("mood_description"),
  preferences: jsonb("preferences"), // circadian settings, bot preferences, etc.
  badges: text("badges").array().default([]),
  evolutionScore: integer("evolution_score").default(0),
  privacySettings: jsonb("privacy_settings").default({}), // privacy and consent settings
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  avatarUrl: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  userId: true,
  botId: true,
  title: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  role: true,
  content: true,
  audioUrl: true,
  sentiment: true,
  sentimentScore: true,
  metadata: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  currentMood: true,
  moodDescription: true,
  preferences: true,
  badges: true,
  evolutionScore: true,
  privacySettings: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
