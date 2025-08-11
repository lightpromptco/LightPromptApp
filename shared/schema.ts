import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean, real } from "drizzle-orm/pg-core";
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

export const recommendations = pgTable("recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // breathwork, workout, nutrition, mindfulness, sleep
  title: text("title").notNull(),
  description: text("description").notNull(),
  reasoning: text("reasoning").notNull(), // why this recommendation was made
  instructions: text("instructions"), // step-by-step instructions
  duration: integer("duration"), // in minutes
  difficulty: text("difficulty").default("beginner"), // beginner, intermediate, advanced
  tags: text("tags").array().default([]), // yoga, cardio, meditation, etc.
  confidence: integer("confidence").default(80), // 0-100 confidence in recommendation
  basedOnPatterns: text("based_on_patterns").array().default([]), // pattern IDs that influenced this
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  rating: integer("rating"), // user rating 1-5 after completion
  feedback: text("feedback"), // user feedback
  metadata: jsonb("metadata").default({}), // additional data like links, images, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const fitnessData = pgTable("fitness_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull().defaultNow(),
  weight: integer("weight"), // in pounds
  bodyFat: integer("body_fat"), // percentage
  muscleMass: integer("muscle_mass"), // percentage
  waterIntake: integer("water_intake"), // in ounces
  workoutDuration: integer("workout_duration"), // in minutes
  workoutType: text("workout_type"), // cardio, strength, yoga, etc.
  workoutIntensity: integer("workout_intensity"), // 1-10 scale
  restingHeartRate: integer("resting_heart_rate"), // BPM
  bloodPressure: text("blood_pressure"), // "120/80" format
  sleepQuality: integer("sleep_quality"), // 1-10 scale
  stressLevel: integer("stress_level"), // 1-10 scale
  notes: text("notes"),
  source: text("source").default("manual"), // manual, apple_health, fitbit, garmin, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deviceIntegrations = pgTable("device_integrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  deviceType: text("device_type").notNull(), // apple_health, fitbit, garmin, oura, whoop, alexa, google_assistant, etc.
  isConnected: boolean("is_connected").notNull().default(false),
  lastSync: timestamp("last_sync"),
  accessToken: text("access_token"), // encrypted token for device API
  refreshToken: text("refresh_token"),
  settings: jsonb("settings").default({}), // sync preferences, data types, etc.
  metadata: jsonb("metadata").default({}), // device-specific data
  connectedAt: timestamp("connected_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Community Features
export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // reflection, insight, gratitude, support, etc.
  tags: text("tags").array().default([]),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  likesCount: integer("likes_count").notNull().default(0),
  commentsCount: integer("comments_count").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  mood: text("mood"), // associated mood at time of posting
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const communityComments = pgTable("community_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => communityPosts.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  likesCount: integer("likes_count").notNull().default(0),
  parentCommentId: varchar("parent_comment_id"), // Self-reference without foreign key to avoid circular dependency
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const communityLikes = pgTable("community_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: varchar("post_id").references(() => communityPosts.id, { onDelete: "cascade" }),
  commentId: varchar("comment_id").references(() => communityComments.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Astrology & SoulMap Integration
export const astrologyProfiles = pgTable("astrology_profiles", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  birthDate: timestamp("birth_date").notNull(),
  birthTime: text("birth_time"), // "14:30" format
  birthLocation: text("birth_location").notNull(), // "New York, NY, USA"
  latitude: text("latitude"),
  longitude: text("longitude"),
  timezone: text("timezone"),
  sunSign: text("sun_sign").notNull(),
  moonSign: text("moon_sign"),
  risingSign: text("rising_sign"),
  birthChart: jsonb("birth_chart").default({}), // full astrological chart data
  planetaryPositions: jsonb("planetary_positions").default({}),
  houses: jsonb("houses").default({}),
  aspects: jsonb("aspects").default({}),
  report: text("report"),
  insights: jsonb("insights").default({}),
  moonPhase: text("moon_phase"),
  schumannResonance: jsonb("schumann_resonance").default({}),
  personalityProfile: jsonb("personality_profile").default({}),
  lifePathGuidance: text("life_path_guidance"),
  personalityTraits: jsonb("personality_traits").default({}), // AI-generated insights
  currentTransits: jsonb("current_transits").default({}), // active planetary influences
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dailyHoroscopes = pgTable("daily_horoscopes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  sunSignReading: text("sun_sign_reading").notNull(),
  moonPhaseReading: text("moon_phase_reading"),
  personalizedInsight: text("personalized_insight"), // based on birth chart + current patterns
  luckyNumbers: text("lucky_numbers").array().default([]),
  affirmation: text("affirmation").notNull(),
  focus: text("focus"), // love, career, health, spirituality
  energy: text("energy"), // high, medium, low
  planetaryInfluences: jsonb("planetary_influences").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// B2B/Enterprise Features
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  domain: text("domain").unique(), // company email domain
  industry: text("industry"),
  size: text("size"), // small, medium, large, enterprise
  subscriptionTier: text("subscription_tier").notNull().default("starter"), // starter, professional, enterprise
  settings: jsonb("settings").default({}), // privacy policies, data retention, etc.
  adminEmail: text("admin_email").notNull(),
  billingEmail: text("billing_email"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const organizationMembers = pgTable("organization_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"), // admin, hr_manager, team_lead, member
  department: text("department"),
  position: text("position"),
  managerId: varchar("manager_id").references(() => users.id),
  permissions: jsonb("permissions").default({}), // what data they can access
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const organizationInsights = pgTable("organization_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: varchar("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  period: text("period").notNull().default("daily"), // daily, weekly, monthly
  totalMembers: integer("total_members").notNull(),
  activeMembers: integer("active_members").notNull(), // members who used the platform
  avgMoodScore: integer("avg_mood_score"), // 1-10 scale
  avgStressLevel: integer("avg_stress_level"), // 1-10 scale
  avgEnergyLevel: integer("avg_energy_level"), // 1-10 scale
  reflectionsCount: integer("reflections_count").notNull().default(0),
  habitsCompleted: integer("habits_completed").notNull().default(0),
  recommendationsGenerated: integer("recommendations_generated").notNull().default(0),
  wellnessScore: integer("wellness_score"), // aggregated wellness metric
  topChallenges: text("top_challenges").array().default([]), // most common stress factors
  insights: jsonb("insights").default({}), // AI-generated insights for leadership
  recommendations: jsonb("recommendations").default({}), // organizational recommendations
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Multi-Factor Authentication
export const userAuth = pgTable("user_auth", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  phoneNumber: text("phone_number"),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  backupCodes: text("backup_codes").array().default([]),
  lastVerification: timestamp("last_verification"),
  verificationAttempts: integer("verification_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verificationCodes = pgTable("verification_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  type: text("type").notNull(), // email, sms, phone_call
  purpose: text("purpose").notNull(), // login, signup, password_reset, profile_change
  isUsed: boolean("is_used").notNull().default(false),
  attemptsCount: integer("attempts_count").notNull().default(0),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

export const insertRecommendationSchema = createInsertSchema(recommendations).pick({
  userId: true,
  type: true,
  title: true,
  description: true,
  reasoning: true,
  instructions: true,
  duration: true,
  difficulty: true,
  tags: true,
  confidence: true,
  basedOnPatterns: true,
  metadata: true,
});

export const insertFitnessDataSchema = createInsertSchema(fitnessData).pick({
  userId: true,
  date: true,
  weight: true,
  bodyFat: true,
  muscleMass: true,
  waterIntake: true,
  workoutDuration: true,
  workoutType: true,
  workoutIntensity: true,
  restingHeartRate: true,
  bloodPressure: true,
  sleepQuality: true,
  stressLevel: true,
  notes: true,
  source: true,
});

export const insertDeviceIntegrationSchema = createInsertSchema(deviceIntegrations).pick({
  userId: true,
  deviceType: true,
  isConnected: true,
  settings: true,
  metadata: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).pick({
  userId: true,
  title: true,
  content: true,
  category: true,
  tags: true,
  isAnonymous: true,
  mood: true,
});

export const insertCommunityCommentSchema = createInsertSchema(communityComments).pick({
  postId: true,
  userId: true,
  content: true,
  isAnonymous: true,
  parentCommentId: true,
});

export const insertAstrologyProfileSchema = createInsertSchema(astrologyProfiles).pick({
  userId: true,
  birthDate: true,
  birthTime: true,
  birthLocation: true,
  sunSign: true,
  moonSign: true,
  risingSign: true,
  birthChart: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).pick({
  name: true,
  domain: true,
  industry: true,
  size: true,
  adminEmail: true,
  billingEmail: true,
  settings: true,
});

export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers).pick({
  organizationId: true,
  userId: true,
  role: true,
  department: true,
  position: true,
  managerId: true,
  permissions: true,
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
export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type FitnessData = typeof fitnessData.$inferSelect;
export type InsertFitnessData = z.infer<typeof insertFitnessDataSchema>;
export type DeviceIntegration = typeof deviceIntegrations.$inferSelect;
export type InsertDeviceIntegration = z.infer<typeof insertDeviceIntegrationSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityComment = typeof communityComments.$inferSelect;
export type InsertCommunityComment = z.infer<typeof insertCommunityCommentSchema>;
export type CommunityLike = typeof communityLikes.$inferSelect;
export type AstrologyProfile = typeof astrologyProfiles.$inferSelect;
export type InsertAstrologyProfile = z.infer<typeof insertAstrologyProfileSchema>;
export type DailyHoroscope = typeof dailyHoroscopes.$inferSelect;
// VibeMatch tables for soul connection discovery
export const vibeProfiles = pgTable("vibe_profiles", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio").notNull(),
  location: text("location"), // city, state/region, country
  latitude: text("latitude"), // for location-based matching
  longitude: text("longitude"),
  interests: text("interests").array().default([]), // wellness, meditation, travel, etc.
  vibeWords: text("vibe_words").array().default([]), // energy descriptors
  seekingConnection: text("seeking_connection").notNull(), // friendship, growth_partner, mentor, etc.
  ageRange: text("age_range").notNull(), // "25-35", "30-40", etc.
  profileComplete: boolean("profile_complete").default(false),
  isVisible: boolean("is_visible").default(true), // can temporarily hide profile
  lastActive: timestamp("last_active").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const vibeMatches = pgTable("vibe_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId1: varchar("user_id_1").notNull().references(() => users.id, { onDelete: "cascade" }),
  userId2: varchar("user_id_2").notNull().references(() => users.id, { onDelete: "cascade" }),
  matchScore: integer("match_score").notNull(), // 0-100 compatibility score
  status: text("status").notNull().default("pending"), // pending, liked, passed, matched
  user1Action: text("user1_action"), // like, pass, null
  user2Action: text("user2_action"), // like, pass, null
  resonanceCount: integer("resonance_count").default(0), // tracks interaction quality
  lastInteraction: timestamp("last_interaction").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const prismPoints = pgTable("prism_points", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => vibeMatches.id, { onDelete: "cascade" }),
  userId1: varchar("user_id_1").notNull().references(() => users.id, { onDelete: "cascade" }),
  userId2: varchar("user_id_2").notNull().references(() => users.id, { onDelete: "cascade" }),
  unlocked: boolean("unlocked").default(false),
  user1Consent: boolean("user1_consent").default(false),
  user2Consent: boolean("user2_consent").default(false),
  sharedInfo: jsonb("shared_info"), // email, social media, contact info by mutual consent
  unlockedAt: timestamp("unlocked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resonanceInteractions = pgTable("resonance_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => vibeMatches.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  interactionType: text("interaction_type").notNull(), // conversation, shared_reflection, energy_exchange
  resonanceLevel: integer("resonance_level").notNull(), // 1-5 how deep the connection felt
  notes: text("notes"), // optional personal notes about the interaction
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Secure chat system for matched users
export const matchChats = pgTable("match_chats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => vibeMatches.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: varchar("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  messageType: text("message_type").notNull().default("text"), // text, reflection_prompt, energy_share
  isReflectionResponse: boolean("is_reflection_response").default(false),
  reflectionPromptId: varchar("reflection_prompt_id"), // links responses to prompts
  aiModerationScore: integer("ai_moderation_score").default(100), // 0-100, higher = safer
  aiModerationFlags: text("ai_moderation_flags").array().default([]), // inappropriate, spam, etc.
  isHidden: boolean("is_hidden").default(false), // if flagged by AI
  resonanceContribution: integer("resonance_contribution").default(0), // 0-1, counts toward prism unlock
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Wellness-focused conversation prompts for matched users
export const reflectionPrompts = pgTable("reflection_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // growth, values, dreams, gratitude, etc.
  prompt: text("prompt").notNull(),
  description: text("description"), // what this prompt helps discover
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, deep
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Chat safety and consent tracking
export const chatSafetyLogs = pgTable("chat_safety_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatId: varchar("chat_id").notNull().references(() => matchChats.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  actionType: text("action_type").notNull(), // report, block, consent_withdraw
  reason: text("reason"),
  aiAssistance: boolean("ai_assistance").default(false), // if AI helped detect issue
  resolved: boolean("resolved").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Partner Mode - Deep relationship sharing
export const partnerConnections = pgTable("partner_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId1: varchar("user_id_1").notNull().references(() => users.id, { onDelete: "cascade" }),
  userId2: varchar("user_id_2").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // connection display name
  relationshipType: text("relationship_type").notNull(), // romantic, friendship, family, growth_partner
  connectionLevel: integer("connection_level").default(1), // 1-10 depth level
  dataSharing: jsonb("data_sharing").default({}), // what wellness data they share
  sharedGoals: jsonb("shared_goals").default([]), // mutual growth goals
  inviteCode: varchar("invite_code").unique(), // for sharing invitations
  isActive: boolean("is_active").default(true),
  establishedAt: timestamp("established_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Soul Sync Invitations
export const soulSyncInvites = pgTable("soul_sync_invites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  inviteCode: varchar("invite_code").notNull().unique(),
  connectionId: varchar("connection_id").notNull().references(() => partnerConnections.id, { onDelete: "cascade" }),
  invitedBy: varchar("invited_by").notNull().references(() => users.id, { onDelete: "cascade" }),
  invitedEmail: text("invited_email"),
  status: text("status").notNull().default("pending"), // pending, accepted, expired
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Challenge System
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // daily, weekly, monthly, custom
  category: text("category").notNull(), // mindfulness, fitness, nutrition, growth, etc
  duration: integer("duration").notNull(), // days
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced
  requirements: jsonb("requirements").default({}), // what needs to be done
  rewards: jsonb("rewards").default({}), // points, badges, unlocks
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  maxParticipants: integer("max_participants"), // null = unlimited
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const challengeParticipants = pgTable("challenge_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  status: text("status").notNull().default("active"), // active, completed, dropped, failed
  progress: integer("progress").default(0), // percentage completed
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  completedDays: integer("completed_days").default(0),
  totalDays: integer("total_days").notNull(),
  lastActivityAt: timestamp("last_activity_at"),
  completedAt: timestamp("completed_at"),
});

export const challengeProgress = pgTable("challenge_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participantId: varchar("participant_id").notNull().references(() => challengeParticipants.id, { onDelete: "cascade" }),
  day: integer("day").notNull(), // day number in challenge
  date: timestamp("date").notNull(),
  completed: boolean("completed").default(false),
  notes: text("notes"),
  metadata: jsonb("metadata").default({}), // extra data like mood, energy, etc
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Reward System
export const rewardDefinitions = pgTable("reward_definitions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // badge, points, unlock, achievement
  category: text("category").notNull(), // streak, completion, milestone, special
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  rarity: text("rarity").notNull().default("common"), // common, rare, epic, legendary
  requirements: jsonb("requirements").notNull(), // what triggers this reward
  value: integer("value").default(0), // point value
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userRewards = pgTable("user_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rewardId: varchar("reward_id").notNull().references(() => rewardDefinitions.id),
  source: text("source").notNull(), // challenge, streak, milestone, manual
  sourceId: varchar("source_id"), // challenge_id, etc
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userStats = pgTable("user_stats", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  totalPoints: integer("total_points").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  challengesCompleted: integer("challenges_completed").default(0),
  challengesJoined: integer("challenges_joined").default(0),
  badgesEarned: integer("badges_earned").default(0),
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  lastActivityAt: timestamp("last_activity_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Easter Egg unlock system
export const easterEggUnlocks = pgTable("easter_egg_unlocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  eggType: text("egg_type").notNull(), // sacred_sexuality, advanced_growth, master_level, etc
  triggerType: text("trigger_type").notNull(), // connection_level, resonance_count, usage_days, etc
  triggerValue: integer("trigger_value").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: jsonb("content").default({}), // unlocked content/features
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Wellness Circles Tables
export const wellnessCircles = pgTable("wellness_circles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // anxiety, sleep, fitness, mindfulness, etc.
  facilitatorId: varchar("facilitator_id").references(() => users.id),
  facilitatorName: text("facilitator_name"),
  maxMembers: integer("max_members").default(12),
  currentMembers: integer("current_members").default(0),
  meetingFrequency: text("meeting_frequency").default("weekly"), // weekly, bi-weekly, monthly
  meetingDay: text("meeting_day"), // monday, tuesday, etc.
  meetingTime: text("meeting_time"), // "18:00" format
  timezone: text("timezone").default("UTC"),
  status: text("status").default("active"), // active, paused, completed
  isPublic: boolean("is_public").default(true),
  guidelines: text("guidelines"),
  topics: jsonb("topics").default([]), // focus areas/topics
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const circleMembers = pgTable("circle_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  circleId: varchar("circle_id").notNull().references(() => wellnessCircles.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").default("member"), // member, moderator, facilitator
  status: text("status").default("pending"), // pending, active, inactive
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
});

export const circleActivities = pgTable("circle_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  circleId: varchar("circle_id").notNull().references(() => wellnessCircles.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // check-in, goal-share, insight, celebration
  title: text("title"),
  content: text("content").notNull(),
  isPrivate: boolean("is_private").default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 30-Day Habit Builder Tables
export const habitPrograms = pgTable("habit_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // mindfulness, fitness, nutrition, sleep, productivity
  duration: integer("duration").default(30), // days
  difficulty: text("difficulty").default("beginner"), // beginner, intermediate, advanced
  dailyTasks: jsonb("daily_tasks").default([]), // structured daily activities
  rewards: jsonb("rewards").default({}), // milestone rewards
  icon: text("icon").default("fas fa-star"),
  color: text("color").default("#10b981"),
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  participantCount: integer("participant_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const habitEnrollments = pgTable("habit_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: varchar("program_id").notNull().references(() => habitPrograms.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").default("active"), // active, paused, completed, dropped
  currentDay: integer("current_day").default(1),
  completedDays: integer("completed_days").default(0),
  streakDays: integer("streak_days").default(0),
  longestStreak: integer("longest_streak").default(0),
  progress: integer("progress").default(0), // percentage
  dailyGoals: jsonb("daily_goals").default([]),
  completedGoals: jsonb("completed_goals").default([]),
  notes: text("notes"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  lastCheckIn: timestamp("last_check_in"),
});

export const habitCheckIns = pgTable("habit_check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  enrollmentId: varchar("enrollment_id").notNull().references(() => habitEnrollments.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  tasksCompleted: jsonb("tasks_completed").default([]),
  mood: text("mood"),
  energy: integer("energy"), // 1-10
  motivation: integer("motivation"), // 1-10
  notes: text("notes"),
  challenges: text("challenges"),
  wins: text("wins"),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// GeoPrompt Check-ins Table
export const geoPromptCheckIns = pgTable("geoprompt_check_ins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  location: text("location").notNull(),
  customLocation: text("custom_location"),
  mapAddress: text("map_address"),
  mapLat: real("map_lat"),
  mapLng: real("map_lng"),
  mapPlaceId: text("map_place_id"),
  vibe: text("vibe").notNull(),
  displayName: text("display_name").default('anonymous'),
  customName: text("custom_name"),
  customInitials: text("custom_initials"),
  reflection: text("reflection").notNull(),
  sharePublicly: boolean("share_publicly").default(false),
  logoPhotos: jsonb("logo_photos").default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Admin & Content Management Tables
export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  category: text("category").default("general"), // general, ui, features, pricing
  isPublic: boolean("is_public").default(false), // if users can see this setting
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contentBlocks = pgTable("content_blocks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(), // faq-general, plans-basic, etc.
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("markdown"), // markdown, html, json
  category: text("category").notNull(), // faq, plans, features, about
  isPublished: boolean("is_published").default(false),
  sortOrder: integer("sort_order").default(0),
  metadata: jsonb("metadata").default({}),
  createdBy: varchar("created_by").references(() => users.id),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User Preferences/Settings
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  // Privacy & Data Sharing
  dataSharing: jsonb("data_sharing").default({
    wellness_metrics: 'private',
    habits: 'private', 
    mood_patterns: 'private',
    growth_insights: 'private'
  }),
  visibility: text("visibility").default("private"), // private, connections, public
  // Notification preferences
  notifications: jsonb("notifications").default({
    daily_checkin_reminder: true,
    vibe_match_notifications: true,
    partner_updates: true,
    community_mentions: true,
    easter_egg_unlocks: true
  }),
  // Wellness tracking preferences
  trackingPreferences: jsonb("tracking_preferences").default({
    mood_tracking: true,
    energy_tracking: true,
    habit_reminders: true,
    pattern_insights: true
  }),
  // AI interaction settings
  aiPersonality: text("ai_personality").default("balanced"), // nurturing, direct, playful, wise, mystical
  aiIntensity: integer("ai_intensity").default(5), // 1-10 how deep AI conversations go
  aiGuidanceStyle: text("ai_guidance_style").default("supportive"), // supportive, challenging, exploratory
  // Community settings
  communitySettings: jsonb("community_settings").default({
    default_anonymous: true,
    auto_moderate: true,
    notification_level: 'mentions_only'
  }),
  // Partner mode settings
  partnerSettings: jsonb("partner_settings").default({
    auto_share_mood: false,
    auto_share_habits: false,
    share_insights: true,
    relationship_goals_visible: false
  }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertVibeProfileSchema = createInsertSchema(vibeProfiles);
export const insertVibeMatchSchema = createInsertSchema(vibeMatches);
export const insertPrismPointSchema = createInsertSchema(prismPoints);
export const insertResonanceInteractionSchema = createInsertSchema(resonanceInteractions);
export const insertMatchChatSchema = createInsertSchema(matchChats);
export const insertReflectionPromptSchema = createInsertSchema(reflectionPrompts);
export const insertChatSafetyLogSchema = createInsertSchema(chatSafetyLogs);
export const insertPartnerConnectionSchema = createInsertSchema(partnerConnections);
export const insertChallengeSchema = createInsertSchema(challenges);
export const insertChallengeParticipantSchema = createInsertSchema(challengeParticipants);
export const insertChallengeProgressSchema = createInsertSchema(challengeProgress);
export const insertRewardDefinitionSchema = createInsertSchema(rewardDefinitions);
export const insertUserRewardSchema = createInsertSchema(userRewards);
export const insertUserStatsSchema = createInsertSchema(userStats);
export const insertEasterEggUnlockSchema = createInsertSchema(easterEggUnlocks);
export const insertUserPreferencesSchema = createInsertSchema(userPreferences);

// Wellness Circles Schemas
export const insertWellnessCircleSchema = createInsertSchema(wellnessCircles);
export const insertCircleMemberSchema = createInsertSchema(circleMembers);
export const insertCircleActivitySchema = createInsertSchema(circleActivities);

// 30-Day Habit Builder Schemas
export const insertHabitProgramSchema = createInsertSchema(habitPrograms);
export const insertHabitEnrollmentSchema = createInsertSchema(habitEnrollments);
export const insertHabitCheckInSchema = createInsertSchema(habitCheckIns);

// GeoPrompt Check-ins Schema
export const insertGeoPromptCheckInSchema = createInsertSchema(geoPromptCheckIns);

// Admin & Content Schemas
export const insertAdminSettingSchema = createInsertSchema(adminSettings);
export const insertContentBlockSchema = createInsertSchema(contentBlocks);

// Type exports
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;


export type OrganizationInsight = typeof organizationInsights.$inferSelect;
export type UserAuth = typeof userAuth.$inferSelect;
export type VerificationCode = typeof verificationCodes.$inferSelect;
export type VibeProfile = typeof vibeProfiles.$inferSelect;
export type InsertVibeProfile = z.infer<typeof insertVibeProfileSchema>;
export type VibeMatch = typeof vibeMatches.$inferSelect;
export type InsertVibeMatch = z.infer<typeof insertVibeMatchSchema>;
export type PrismPoint = typeof prismPoints.$inferSelect;
export type InsertPrismPoint = z.infer<typeof insertPrismPointSchema>;
export type ResonanceInteraction = typeof resonanceInteractions.$inferSelect;
export type InsertResonanceInteraction = z.infer<typeof insertResonanceInteractionSchema>;
export type MatchChat = typeof matchChats.$inferSelect;
export type InsertMatchChat = z.infer<typeof insertMatchChatSchema>;
export type ReflectionPrompt = typeof reflectionPrompts.$inferSelect;
export type InsertReflectionPrompt = z.infer<typeof insertReflectionPromptSchema>;
export type ChatSafetyLog = typeof chatSafetyLogs.$inferSelect;
export type InsertChatSafetyLog = z.infer<typeof insertChatSafetyLogSchema>;
export type PartnerConnection = typeof partnerConnections.$inferSelect;
export type InsertPartnerConnection = z.infer<typeof insertPartnerConnectionSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant = z.infer<typeof insertChallengeParticipantSchema>;
export type ChallengeProgress = typeof challengeProgress.$inferSelect;
export type InsertChallengeProgress = z.infer<typeof insertChallengeProgressSchema>;
export type RewardDefinition = typeof rewardDefinitions.$inferSelect;
export type InsertRewardDefinition = z.infer<typeof insertRewardDefinitionSchema>;
export type UserReward = typeof userRewards.$inferSelect;
export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type EasterEggUnlock = typeof easterEggUnlocks.$inferSelect;
export type InsertEasterEggUnlock = z.infer<typeof insertEasterEggUnlockSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

// Wellness Circles Types
export type WellnessCircle = typeof wellnessCircles.$inferSelect;
export type InsertWellnessCircle = z.infer<typeof insertWellnessCircleSchema>;

export type CircleMember = typeof circleMembers.$inferSelect;
export type InsertCircleMember = z.infer<typeof insertCircleMemberSchema>;

export type CircleActivity = typeof circleActivities.$inferSelect;
export type InsertCircleActivity = z.infer<typeof insertCircleActivitySchema>;

// 30-Day Habit Builder Types
export type HabitProgram = typeof habitPrograms.$inferSelect;
export type InsertHabitProgram = z.infer<typeof insertHabitProgramSchema>;

export type HabitEnrollment = typeof habitEnrollments.$inferSelect;
export type InsertHabitEnrollment = z.infer<typeof insertHabitEnrollmentSchema>;

export type HabitCheckIn = typeof habitCheckIns.$inferSelect;
export type InsertHabitCheckIn = z.infer<typeof insertHabitCheckInSchema>;

// Admin & Content Types
export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = z.infer<typeof insertContentBlockSchema>;

// GeoPrompt Check-ins Types
export type GeoPromptCheckIn = typeof geoPromptCheckIns.$inferSelect;
export type InsertGeoPromptCheckIn = z.infer<typeof insertGeoPromptCheckInSchema>;

// Foundation Memory - Core knowledge and memory for LightPrompt
export const foundationMemory = pgTable("foundation_memory", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  description: text("description"),
  importance: integer("importance").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Insights - Patterns and insights from user interactions
export const userInsights = pgTable("user_insights", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  pattern: text("pattern").notNull(),
  data: jsonb("data"),
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Platform Evolution - Track how LightPrompt grows and improves
export const platformEvolution = pgTable("platform_evolution", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  version: text("version").notNull(),
  feature: text("feature").notNull(),
  impact: text("impact").notNull(),
  userFeedback: jsonb("user_feedback"),
  metrics: jsonb("metrics"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Bot Learning - AI bot improvements and learning
export const botLearning = pgTable("bot_learning", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  botId: text("bot_id").notNull(),
  conversationId: text("conversation_id"),
  userFeedback: text("user_feedback").notNull(),
  improvement: text("improvement").notNull(),
  effectiveness: real("effectiveness").notNull(),
  learnedAt: timestamp("learned_at").defaultNow(),
});

// Content Evolution - Track content improvements and user engagement
export const contentEvolution = pgTable("content_evolution", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  originalContent: text("original_content").notNull(),
  improvedContent: text("improved_content").notNull(),
  reason: text("reason").notNull(),
  userEngagement: real("user_engagement").notNull(),
  evolvedAt: timestamp("evolved_at").defaultNow(),
});

// Knowledge Storage Schemas
export const insertFoundationMemorySchema = createInsertSchema(foundationMemory);
export const insertUserInsightSchema = createInsertSchema(userInsights);
export const insertPlatformEvolutionSchema = createInsertSchema(platformEvolution);
export const insertBotLearningSchema = createInsertSchema(botLearning);
export const insertContentEvolutionSchema = createInsertSchema(contentEvolution);

// Knowledge Storage Types
export type FoundationMemory = typeof foundationMemory.$inferSelect;
export type InsertFoundationMemory = z.infer<typeof insertFoundationMemorySchema>;
export type UserInsight = typeof userInsights.$inferSelect;
export type InsertUserInsight = z.infer<typeof insertUserInsightSchema>;
export type PlatformEvolution = typeof platformEvolution.$inferSelect;
export type InsertPlatformEvolution = z.infer<typeof insertPlatformEvolutionSchema>;
export type BotLearning = typeof botLearning.$inferSelect;
export type InsertBotLearning = z.infer<typeof insertBotLearningSchema>;
export type ContentEvolution = typeof contentEvolution.$inferSelect;
export type InsertContentEvolution = z.infer<typeof insertContentEvolutionSchema>;
