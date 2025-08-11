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
  soulSyncEnabled: boolean("soul_sync_enabled").notNull().default(false),
  soulSyncVisibility: text("soul_sync_visibility").default("private"), // private, friends, public
  matchingPreferences: jsonb("matching_preferences").default({}), // Soul Sync matching criteria
  birthData: jsonb("birth_data").default({}), // astrological birth information
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Soul Sync Connection Requests and Management
export const soulSyncConnections = pgTable("soul_sync_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requesterId: varchar("requester_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetId: varchar("target_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, blocked
  connectionType: text("connection_type").default("wellness_buddy"), // wellness_buddy, accountability_partner, etc.
  sharedDataTypes: text("shared_data_types").array().default([]), // mood, habits, wellness_metrics, etc.
  privacyLevel: text("privacy_level").default("basic"), // basic, detailed, full
  approvedAt: timestamp("approved_at"),
  blockedAt: timestamp("blocked_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Soul Sync Data Sharing Permissions
export const soulSyncPermissions = pgTable("soul_sync_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  connectionId: varchar("connection_id").notNull().references(() => soulSyncConnections.id, { onDelete: "cascade" }),
  dataType: text("data_type").notNull(), // mood, habits, wellness_metrics, etc.
  permissionLevel: text("permission_level").notNull().default("none"), // none, basic, detailed, full
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// GeoPrompt locations and user visits
export const geoPromptLocations = pgTable("geo_prompt_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  address: text("address"),
  category: text("category"), // park, trail, sacred, urban, etc.
  difficulty: text("difficulty").default("easy"), // easy, moderate, challenging
  promptType: text("prompt_type").notNull().default("reflection"), // reflection, mindfulness, gratitude, intention, nature
  prompt: text("prompt").notNull(),
  context: text("context"), // historical, ecological, spiritual context
  tags: text("tags").array().default([]), // searchable tags
  isActive: boolean("is_active").notNull().default(true),
  isPublic: boolean("is_public").notNull().default(true),
  visitCount: integer("visit_count").notNull().default(0),
  averageRating: real("average_rating"),
  qrCode: text("qr_code"), // QR code identifier
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const geoPromptVisits = pgTable("geo_prompt_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  locationId: varchar("location_id").notNull().references(() => geoPromptLocations.id, { onDelete: "cascade" }),
  response: text("response"), // user's response to the prompt
  reflection: text("reflection"), // user's reflection at the location
  mood: text("mood"), // grateful, peaceful, inspired, reflective, energized, calm
  rating: integer("rating"), // 1-5 star rating
  emotionalState: text("emotional_state"), // how they felt during the visit
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  sharedReflection: text("shared_reflection"), // optional public reflection
  metadata: jsonb("metadata"), // weather, time of day, etc.
  visitedAt: timestamp("visited_at").notNull().defaultNow(),
});

// VibeMatch user profiles and matching data
export const vibeMatchProfiles = pgTable("vibe_match_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  careerField: text("career_field").notNull(),
  currentRole: text("current_role").notNull(),
  experience: text("experience").notNull(), // entry, mid, senior, expert
  workStyle: text("work_style").array().notNull().default([]),
  values: text("values").array().notNull().default([]),
  goals: text("goals").array().notNull().default([]),
  industryInterests: text("industry_interests").array().default([]),
  skills: text("skills").array().default([]),
  mentoringInterests: text("mentoring_interests").array().default([]),
  collaborationStyle: text("collaboration_style").notNull().default("mixed"), // independent, collaborative, mixed
  communicationStyle: text("communication_style").notNull().default("casual"), // direct, diplomatic, casual, formal
  learningStyle: text("learning_style").notNull().default("mixed"), // visual, auditory, kinesthetic, reading, mixed
  isVisible: boolean("is_visible").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  lookingFor: text("looking_for").array().default([]), // friendship, romance, collaboration, etc.
  ageRange: jsonb("age_range"), // min/max age preferences
  locationRadius: integer("location_radius").default(50), // miles
  intentionStatement: text("intention_statement"), // what they're seeking
  interests: text("interests").array().default([]), // interests and hobbies
  emotionalPattern: jsonb("emotional_pattern"), // derived from chat analysis
  archetypeProfile: jsonb("archetype_profile"), // astrological/personality archetype
  resonanceSignature: jsonb("resonance_signature"), // AI-generated compatibility signature
  showPhotosAfterMatch: boolean("show_photos_after_match").notNull().default(true),
  privacyLevel: text("privacy_level").default("private"), // private, selective, open
  lastActive: timestamp("last_active").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const vibeMatches = pgTable("vibe_matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  matchedUserId: varchar("matched_user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message"), // optional message when expressing interest
  isMutual: boolean("is_mutual").notNull().default(false),
  status: text("status").notNull().default("pending"), // pending, active, inactive
  resonanceScore: real("resonance_score"), // 0-100 compatibility score
  matchType: text("match_type"), // friendship, romance, collaboration
  commonValues: text("common_values").array().default([]),
  sharedInterests: text("shared_interests").array().default([]),
  emotionalAlignment: real("emotional_alignment"), // emotional pattern similarity
  prismPointUnlocked: boolean("prism_point_unlocked").notNull().default(false),
  conversationStarted: boolean("conversation_started").notNull().default(false),
  matchedAt: timestamp("matched_at").notNull().defaultNow(),
  revealedAt: timestamp("revealed_at"),
  declinedAt: timestamp("declined_at"),
});

// VisionQuest quests and user progress
export const visionQuestQuests = pgTable("vision_quest_quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // perception, archetype, intuition, pattern
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced
  questType: text("quest_type").notNull(), // intuition, empathy, pattern_recognition, synchronicity, creative_insight
  prompt: text("prompt").notNull(),
  instructions: text("instructions"), // detailed instructions for the quest
  successCriteria: text("success_criteria"), // what constitutes success
  estimatedTime: integer("estimated_time"), // estimated completion time in minutes
  tags: text("tags").array().default([]), // searchable tags
  order: integer("order").default(0), // quest ordering
  possibleAnswers: jsonb("possible_answers"), // for structured quests
  expectedResponse: text("expected_response"), // for validation
  hints: text("hints").array().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const visionQuestProgress = pgTable("vision_quest_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questId: varchar("quest_id").notNull().references(() => visionQuestQuests.id, { onDelete: "cascade" }),
  userResponse: text("user_response").notNull(),
  responseTime: integer("response_time"), // milliseconds
  intuitionScore: real("intuition_score"), // calculated accuracy/alignment score
  emotionalState: text("emotional_state"), // how they felt during the quest
  confidence: text("confidence"), // high, medium, low
  reflection: text("reflection"), // optional reflection on the experience
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const visionQuestBadges = pgTable("vision_quest_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  badgeType: text("badge_type").notNull(), // first_sight, pattern_breaker, echo_listener, mind_mirror, synchronicity_tracker
  badgeName: text("badge_name").notNull(),
  badgeDescription: text("badge_description"),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

// Enhanced user settings schema
export const userSettings = pgTable("user_settings", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  // Soul Map settings
  soulMapEnabled: boolean("soul_map_enabled").notNull().default(true),
  soulMapAutoInsights: boolean("soul_map_auto_insights").notNull().default(true),
  soulMapNotifications: boolean("soul_map_notifications").notNull().default(true),
  soulMapPrivacy: text("soul_map_privacy").notNull().default("private"), // private, friends, public
  
  // VibeMatch settings
  vibeMatchEnabled: boolean("vibe_match_enabled").notNull().default(true),
  vibeMatchCareerAlerts: boolean("vibe_match_career_alerts").notNull().default(true),
  vibeMatchFrequency: text("vibe_match_frequency").notNull().default("weekly"),
  
  // GeoPrompt settings
  geoPromptEnabled: boolean("geo_prompt_enabled").notNull().default(false),
  geoPromptLocationSharing: boolean("geo_prompt_location_sharing").notNull().default(false),
  geoPromptNotifications: boolean("geo_prompt_notifications").notNull().default(true),
  geoPromptRadius: integer("geo_prompt_radius").notNull().default(5), // miles
  
  // VisionQuest settings
  visionQuestEnabled: boolean("vision_quest_enabled").notNull().default(true),
  visionQuestReminders: boolean("vision_quest_reminders").notNull().default(true),
  visionQuestDifficulty: text("vision_quest_difficulty").notNull().default("intermediate"),
  
  // Course settings
  courseNotifications: boolean("course_notifications").notNull().default(true),
  courseAutoProgress: boolean("course_auto_progress").notNull().default(false),
  courseEmailUpdates: boolean("course_email_updates").notNull().default(true),
  coursePreferredLearningStyle: text("course_preferred_learning_style").notNull().default("mixed"),
  
  // AI Companions
  aiCompanionsEnabled: boolean("ai_companions_enabled").notNull().default(true),
  preferredCompanion: text("preferred_companion").notNull().default("lightpromptbot"),
  companionPersonality: text("companion_personality").notNull().default("balanced"),
  companionResponseLength: text("companion_response_length").notNull().default("medium"),
  companionProactivity: boolean("companion_proactivity").notNull().default(true),
  
  // Notifications
  pushNotifications: boolean("push_notifications").notNull().default(true),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  smsNotifications: boolean("sms_notifications").notNull().default(false),
  notificationFrequency: text("notification_frequency").notNull().default("daily"),
  quietHoursStart: text("quiet_hours_start").notNull().default("22:00"),
  quietHoursEnd: text("quiet_hours_end").notNull().default("07:00"),
  timezone: text("timezone").notNull().default("auto"),
  
  // Privacy
  dataCollection: boolean("data_collection").notNull().default(true),
  conversationHistory: boolean("conversation_history").notNull().default(true),
  usageAnalytics: boolean("usage_analytics").notNull().default(true),
  marketingEmails: boolean("marketing_emails").notNull().default(false),
  profileVisibility: text("profile_visibility").notNull().default("private"),
  
  // Interface
  theme: text("theme").notNull().default("system"),
  circadianMode: boolean("circadian_mode").notNull().default(true),
  fontSize: text("font_size").notNull().default("medium"),
  language: text("language").notNull().default("en"),
  animationsEnabled: boolean("animations_enabled").notNull().default(true),
  
  // Developer settings
  developerMode: boolean("developer_mode").notNull().default(false),
  betaFeatures: boolean("beta_features").notNull().default(false),
  apiAccess: boolean("api_access").notNull().default(false),
  dataExportFormat: text("data_export_format").notNull().default("json"),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
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

// TypeScript types for all schemas
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

export type SoulSyncConnection = typeof soulSyncConnections.$inferSelect;
export type InsertSoulSyncConnection = typeof soulSyncConnections.$inferInsert;

export type SoulSyncPermission = typeof soulSyncPermissions.$inferSelect;
export type InsertSoulSyncPermission = typeof soulSyncPermissions.$inferInsert;

export type GeoPromptLocation = typeof geoPromptLocations.$inferSelect;
export type InsertGeoPromptLocation = typeof geoPromptLocations.$inferInsert;

export type GeoPromptVisit = typeof geoPromptVisits.$inferSelect;
export type InsertGeoPromptVisit = typeof geoPromptVisits.$inferInsert;

export type VibeMatchProfile = typeof vibeMatchProfiles.$inferSelect;
export type InsertVibeMatchProfile = typeof vibeMatchProfiles.$inferInsert;

export type VibeMatch = typeof vibeMatches.$inferSelect;
export type InsertVibeMatch = typeof vibeMatches.$inferInsert;

export type VisionQuestQuest = typeof visionQuestQuests.$inferSelect;
export type InsertVisionQuestQuest = typeof visionQuestQuests.$inferInsert;

export type VisionQuestProgress = typeof visionQuestProgress.$inferSelect;
export type InsertVisionQuestProgress = typeof visionQuestProgress.$inferInsert;

export type VisionQuestBadge = typeof visionQuestBadges.$inferSelect;
export type InsertVisionQuestBadge = typeof visionQuestBadges.$inferInsert;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;

export type AccessCode = typeof accessCodes.$inferSelect;
export type InsertAccessCode = typeof accessCodes.$inferInsert;

// Zod schemas for form validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles);
export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertGeoPromptLocationSchema = createInsertSchema(geoPromptLocations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGeoPromptVisitSchema = createInsertSchema(geoPromptVisits).omit({ id: true, visitedAt: true });
export const insertVibeMatchProfileSchema = createInsertSchema(vibeMatchProfiles).omit({ createdAt: true, updatedAt: true, lastActive: true });
export const insertVibeMatchSchema = createInsertSchema(vibeMatches).omit({ id: true, matchedAt: true });
export const insertVisionQuestProgressSchema = createInsertSchema(visionQuestProgress).omit({ id: true, completedAt: true });
export const insertVisionQuestBadgeSchema = createInsertSchema(visionQuestBadges).omit({ id: true, unlockedAt: true });
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ createdAt: true, updatedAt: true });
export const updateUserSettingsSchema = createInsertSchema(userSettings).omit({ userId: true, createdAt: true, updatedAt: true });
export const insertAccessCodeSchema = createInsertSchema(accessCodes).omit({ id: true, createdAt: true });
export const redeemAccessCodeSchema = createInsertSchema(accessCodes).pick({ code: true });

// Type inferences for frontend forms
export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertUserProfileType = z.infer<typeof insertUserProfileSchema>;
export type InsertChatSessionType = z.infer<typeof insertChatSessionSchema>;
export type InsertMessageType = z.infer<typeof insertMessageSchema>;
export type InsertGeoPromptLocationType = z.infer<typeof insertGeoPromptLocationSchema>;
export type InsertGeoPromptVisitType = z.infer<typeof insertGeoPromptVisitSchema>;
export type InsertVibeMatchProfileType = z.infer<typeof insertVibeMatchProfileSchema>;
export type InsertVibeMatchType = z.infer<typeof insertVibeMatchSchema>;
export type InsertVisionQuestProgressType = z.infer<typeof insertVisionQuestProgressSchema>;
export type InsertVisionQuestBadgeType = z.infer<typeof insertVisionQuestBadgeSchema>;
export type InsertUserSettingsType = z.infer<typeof insertUserSettingsSchema>;
