import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  tier: text("tier").notNull().default("free"), // free, tier_29, tier_49, admin, course
  role: text("role").notNull().default("user"), // user, admin
  tokensUsed: integer("tokens_used").notNull().default(0),
  tokenLimit: integer("token_limit").notNull().default(10),
  resetDate: timestamp("reset_date").notNull().defaultNow(),
  courseAccess: boolean("course_access").notNull().default(false),
  courseAccessDate: timestamp("course_access_date"),
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

export const accessCodes = pgTable("access_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  type: text("type").notNull().default("course"), // course, upgrade, etc.
  isUsed: boolean("is_used").notNull().default(false),
  usedBy: varchar("used_by").references(() => users.id),
  usedAt: timestamp("used_at"),
  expiresAt: timestamp("expires_at"),
  metadata: jsonb("metadata").default({}), // course info, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Wellness Dashboard Tables
export const wellnessMetrics = pgTable("wellness_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull().defaultNow(),
  mood: text("mood"), // happy, sad, anxious, calm, energetic, etc.
  energy: integer("energy"), // 1-10 scale
  stress: integer("stress"), // 1-10 scale
  gratitude: text("gratitude"),
  reflection: text("reflection"),
  goals: jsonb("goals").default([]), // daily goals
  achievements: jsonb("achievements").default([]), // completed goals/milestones
  metadata: jsonb("metadata").default({}), // additional tracking data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // mindfulness, fitness, nutrition, sleep, etc.
  frequency: text("frequency").notNull().default("daily"), // daily, weekly, monthly
  target: integer("target").default(1), // target count per frequency period
  icon: text("icon").default("fas fa-star"),
  color: text("color").default("#10b981"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const habitEntries = pgTable("habit_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  habitId: varchar("habit_id").notNull().references(() => habits.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull().defaultNow(),
  completed: boolean("completed").notNull().default(false),
  count: integer("count").default(1), // for quantifiable habits
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appleHealthData = pgTable("apple_health_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  steps: integer("steps"),
  heartRate: integer("heart_rate"), // average BPM
  activeCalories: integer("active_calories"),
  exerciseMinutes: integer("exercise_minutes"),
  standHours: integer("stand_hours"),
  sleepHours: integer("sleep_hours"), // in minutes
  mindfulMinutes: integer("mindful_minutes"),
  workouts: jsonb("workouts").default([]), // workout sessions
  syncedAt: timestamp("synced_at").notNull().defaultNow(),
});

export const homeKitData = pgTable("home_kit_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  temperature: integer("temperature"), // in Fahrenheit
  humidity: integer("humidity"), // percentage
  airQuality: text("air_quality"), // excellent, good, fair, poor
  lightLevel: integer("light_level"), // lux
  noiseLevel: integer("noise_level"), // decibels
  devices: jsonb("devices").default({}), // connected device states
  syncedAt: timestamp("synced_at").notNull().defaultNow(),
});

export const wellnessPatterns = pgTable("wellness_patterns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  patternType: text("pattern_type").notNull(), // mood_trend, energy_cycle, stress_trigger, etc.
  description: text("description").notNull(),
  confidence: integer("confidence").default(50), // 0-100 confidence in pattern
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  data: jsonb("data").default({}), // pattern-specific data and insights
  isActive: boolean("is_active").notNull().default(true),
  detectedAt: timestamp("detected_at").notNull().defaultNow(),
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

export const insertAccessCodeSchema = createInsertSchema(accessCodes).pick({
  code: true,
  type: true,
  expiresAt: true,
  metadata: true,
});

export const insertWellnessMetricSchema = createInsertSchema(wellnessMetrics).pick({
  userId: true,
  date: true,
  mood: true,
  energy: true,
  stress: true,
  gratitude: true,
  reflection: true,
  goals: true,
  achievements: true,
  metadata: true,
});

export const insertHabitSchema = createInsertSchema(habits).pick({
  userId: true,
  name: true,
  description: true,
  category: true,
  frequency: true,
  target: true,
  icon: true,
  color: true,
});

export const insertHabitEntrySchema = createInsertSchema(habitEntries).pick({
  habitId: true,
  date: true,
  completed: true,
  count: true,
  notes: true,
});

export const insertAppleHealthDataSchema = createInsertSchema(appleHealthData).pick({
  userId: true,
  date: true,
  steps: true,
  heartRate: true,
  activeCalories: true,
  exerciseMinutes: true,
  standHours: true,
  sleepHours: true,
  mindfulMinutes: true,
  workouts: true,
});

export const insertHomeKitDataSchema = createInsertSchema(homeKitData).pick({
  userId: true,
  date: true,
  temperature: true,
  humidity: true,
  airQuality: true,
  lightLevel: true,
  noiseLevel: true,
  devices: true,
});

export const redeemAccessCodeSchema = z.object({
  code: z.string().min(1, "Access code is required"),
  email: z.string().email("Valid email is required"),
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
export type AccessCode = typeof accessCodes.$inferSelect;
export type InsertAccessCode = z.infer<typeof insertAccessCodeSchema>;
export type RedeemAccessCode = z.infer<typeof redeemAccessCodeSchema>;
export type WellnessMetric = typeof wellnessMetrics.$inferSelect;
export type InsertWellnessMetric = z.infer<typeof insertWellnessMetricSchema>;
export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type HabitEntry = typeof habitEntries.$inferSelect;
export type InsertHabitEntry = z.infer<typeof insertHabitEntrySchema>;
export type AppleHealthData = typeof appleHealthData.$inferSelect;
export type InsertAppleHealthData = z.infer<typeof insertAppleHealthDataSchema>;
export type HomeKitData = typeof homeKitData.$inferSelect;
export type InsertHomeKitData = z.infer<typeof insertHomeKitDataSchema>;
export type WellnessPattern = typeof wellnessPatterns.$inferSelect;
