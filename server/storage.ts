import { 
  User, InsertUser, ChatSession, InsertChatSession, 
  Message, InsertMessage, UserProfile, InsertUserProfile,
  AccessCode, InsertAccessCode, WellnessMetric, InsertWellnessMetric,
  Habit, InsertHabit, HabitEntry, InsertHabitEntry,
  AppleHealthData, InsertAppleHealthData, HomeKitData, InsertHomeKitData,
  WellnessPattern, Recommendation, InsertRecommendation,
  FitnessData, InsertFitnessData, DeviceIntegration, InsertDeviceIntegration,
  Challenge, InsertChallenge, VibeProfile, InsertVibeProfile,
  MatchChat, InsertMatchChat, ChatSafetyLog, InsertChatSafetyLog,
  ReflectionPrompt, PrismPoint, GeoPromptCheckIn, InsertGeoPromptCheckIn,
  PartnerConnection, UserPreferences, InsertUserPreferences,
  RewardDefinition, UserReward, EasterEggUnlock
} from "@shared/schema";
import { randomUUID } from "crypto";
import { 
  createSupabaseUser, 
  getSupabaseUser, 
  updateSupabaseUser, 
  validateUserTier,
  createSupabaseSession,
  getSupabaseUserSessions,
  createSupabaseMessage,
  getSupabaseSessionMessages,
  createAdminUser
} from "./supabase";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";
import * as schema from "@shared/schema";

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
  // Wellness Metrics
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
  
  // Challenges
  getChallenges(): Promise<Challenge[]>;
  getActiveChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  getChallengeById(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  joinChallenge(userId: string, challengeId: string): Promise<any>;
  getUserChallenges(userId: string): Promise<any[]>;
  updateChallengeProgress(challengeId: string, userId: string, day: number, completed: boolean, notes?: string): Promise<void>;
  getUserStats(userId: string): Promise<any>;
  awardPoints(userId: string, points: number, source: string, sourceId?: string, description?: string): Promise<void>;
  awardReward(userId: string, rewardId: string, source: string, sourceId?: string): Promise<void>;
  getRewardDefinitions(): Promise<RewardDefinition[]>;
  getUserUnlocks(userId: string): Promise<UserReward[]>;
  discoverEasterEgg(userId: string, eggType: string, triggerType: string, triggerValue: number, title: string, description: string, content: any): Promise<EasterEggUnlock>;
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

  // VibeMatch System
  // Vibe Profiles
  getVibeProfile(userId: string): Promise<VibeProfile | undefined>;
  createOrUpdateVibeProfile(profile: any): Promise<VibeProfile>;
  
  // Matching
  getPotentialMatches(userId: string): Promise<any[]>;
  getCurrentMatches(userId: string): Promise<any[]>;
  processMatchAction(userId: string, matchId: string, action: string): Promise<any>;
  
  // Match Communication
  getMatchChatMessages(matchId: string): Promise<MatchChat[]>;
  createMatchChatMessage(message: InsertMatchChat): Promise<MatchChat>;
  updateMatchResonance(matchId: string, resonanceScore: number): Promise<void>;
  
  // Safety & Moderation
  createChatSafetyLog(log: InsertChatSafetyLog): Promise<ChatSafetyLog>;
  
  // Reflection System
  getReflectionPrompts(category?: string): Promise<ReflectionPrompt[]>;
  getPrismPoints(userId: string): Promise<PrismPoint[]>;
  setupVibeMatchTestData(): Promise<void>;
  
  // GeoPrompt
  createGeoPromptCheckIn(checkIn: InsertGeoPromptCheckIn): Promise<GeoPromptCheckIn>;
  getGeoPromptCheckInsByUser(userId: string): Promise<GeoPromptCheckIn[]>;
  updateCrossComponentData(userId: string, data: any): Promise<void>;
  getIntegratedUserData(userId: string): Promise<any>;
  
  // Partner Connections
  getPartnerConnections(userId: string): Promise<PartnerConnection[]>;
  invitePartner(userId: string, partnerEmail: string, relationshipType: string): Promise<PartnerConnection>;
  updatePartnerConnection(connectionId: string, updates: Partial<PartnerConnection>): Promise<PartnerConnection>;
  
  // User Preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Soul Map & Vision Quest
  getSoulMap(userId: string): Promise<any>;
  createSoulMap(userId: string, data: any): Promise<any>;
  getVisionQuest(userId: string): Promise<any>;
  createVisionQuest(userId: string, data: any): Promise<any>;
  getCurrentMatches(userId: string): Promise<VibeMatch[]>;
  processMatchAction(userId: string, matchUserId: string, action: string): Promise<any>;
  updateMatchResonance(matchId: string, resonanceContribution: number): Promise<void>;
  
  // Chat
  getMatchChatMessages(matchId: string, userId: string): Promise<any[]>;
  createMatchChatMessage(message: any): Promise<MatchChat>;
  
  // Safety
  createChatSafetyLog(log: any): Promise<ChatSafetyLog>;
  
  // Prompts
  getReflectionPrompts(): Promise<ReflectionPrompt[]>;
  
  // Prism Points
  getPrismPoints(userId: string): Promise<PrismPoint[]>;
  
  // Test Data
  setupVibeMatchTestData(userId: string): Promise<any>;
  
  // Partner Connections
  getPartnerConnections(userId: string): Promise<PartnerConnection[]>;
  createPartnerConnection(connection: InsertPartnerConnection): Promise<PartnerConnection>;
  updatePartnerConnection(id: string, updates: Partial<PartnerConnection>): Promise<PartnerConnection>;
  invitePartner(userId: string, email: string, relationshipType: string): Promise<any>;

  // Vision Quest
  getVisionQuest(userId: string): Promise<any | undefined>;
  createVisionQuest(questData: any): Promise<any>;
  
  // Challenge System
  getActiveChallenges(): Promise<Challenge[]>;
  createChallenge(data: InsertChallenge): Promise<Challenge>;
  getChallengeById(id: string): Promise<Challenge | null>;
  joinChallenge(challengeId: string, userId: string): Promise<ChallengeParticipant>;
  updateChallengeProgress(challengeId: string, userId: string, progressData: {
    day: number;
    completed: boolean;
    notes?: string;
    metadata?: any;
  }): Promise<ChallengeProgress>;
  getUserChallenges(userId: string): Promise<(ChallengeParticipant & { challenge: Challenge })[]>;
  
  // Reward System
  getUserStats(userId: string): Promise<UserStats & { rewards: UserReward[] }>;
  awardReward(userId: string, rewardId: string, source: string, sourceId?: string): Promise<UserReward>;
  getRewardDefinitions(): Promise<RewardDefinition[]>;
  updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats>;

  // User Preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createOrUpdateUserPreferences(preferences: Partial<UserPreferences & { userId: string }>): Promise<UserPreferences>;
  
  // Wellness Circles
  getWellnessCircles(): Promise<WellnessCircle[]>;
  getWellnessCircle(id: string): Promise<WellnessCircle | undefined>;
  createWellnessCircle(circle: InsertWellnessCircle): Promise<WellnessCircle>;
  updateWellnessCircle(id: string, updates: Partial<WellnessCircle>): Promise<WellnessCircle>;
  joinWellnessCircle(circleId: string, userId: string): Promise<CircleMember>;
  leaveWellnessCircle(circleId: string, userId: string): Promise<void>;
  getUserCircles(userId: string): Promise<(CircleMember & { circle: WellnessCircle })[]>;
  getCircleMembers(circleId: string): Promise<(CircleMember & { user: User })[]>;
  createCircleActivity(activity: InsertCircleActivity): Promise<CircleActivity>;
  getCircleActivities(circleId: string, limit?: number): Promise<(CircleActivity & { user: User })[]>;
  
  // 30-Day Habit Builder
  getHabitPrograms(): Promise<HabitProgram[]>;
  getHabitProgram(id: string): Promise<HabitProgram | undefined>;
  createHabitProgram(program: InsertHabitProgram): Promise<HabitProgram>;
  updateHabitProgram(id: string, updates: Partial<HabitProgram>): Promise<HabitProgram>;
  enrollInHabitProgram(programId: string, userId: string): Promise<HabitEnrollment>;
  getUserHabitEnrollments(userId: string): Promise<(HabitEnrollment & { program: HabitProgram })[]>;
  getHabitEnrollment(enrollmentId: string): Promise<HabitEnrollment | undefined>;
  updateHabitEnrollment(id: string, updates: Partial<HabitEnrollment>): Promise<HabitEnrollment>;
  createHabitCheckIn(checkIn: InsertHabitCheckIn): Promise<HabitCheckIn>;
  getHabitCheckIns(enrollmentId: string): Promise<HabitCheckIn[]>;
  getHabitCheckIn(enrollmentId: string, day: number): Promise<HabitCheckIn | undefined>;
  
  // Admin & Content Management
  getAdminSettings(category?: string): Promise<AdminSetting[]>;
  getAdminSetting(key: string): Promise<AdminSetting | undefined>;
  setAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting>;
  getContentBlocks(category?: string, published?: boolean): Promise<ContentBlock[]>;
  getContentBlock(slug: string): Promise<ContentBlock | undefined>;
  createContentBlock(block: InsertContentBlock): Promise<ContentBlock>;
  updateContentBlock(id: string, updates: Partial<ContentBlock>): Promise<ContentBlock>;
  deleteContentBlock(id: string): Promise<void>;

  // GeoPrompt Check-ins
  createGeoPromptCheckIn(checkIn: InsertGeoPromptCheckIn): Promise<GeoPromptCheckIn>;
  getGeoPromptCheckInsByUser(userId: string): Promise<GeoPromptCheckIn[]>;

  // Soul Map and Vision Quest
  getSoulMap(userId: string): Promise<any | undefined>;
  createSoulMap(soulMapData: any): Promise<any>;
  getVisionQuest(userId: string): Promise<any | undefined>;
  createVisionQuest(questData: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private messages: Map<string, Message> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private accessCodes: Map<string, AccessCode> = new Map();
  private wellnessMetrics: Map<string, WellnessMetric> = new Map();
  private challenges: Map<string, Challenge> = new Map();
  private challengeParticipants: Map<string, ChallengeParticipant> = new Map();
  private challengeProgress: Map<string, ChallengeProgress> = new Map();
  private rewardDefinitions: Map<string, RewardDefinition> = new Map();
  private userRewards: Map<string, UserReward> = new Map();
  private userStats: Map<string, UserStats> = new Map();
  private habits: Map<string, Habit> = new Map();
  private habitEntries: Map<string, HabitEntry> = new Map();
  private appleHealthData: Map<string, AppleHealthData> = new Map();
  private homeKitData: Map<string, HomeKitData> = new Map();
  private wellnessPatterns: Map<string, WellnessPattern> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  private fitnessData: Map<string, FitnessData> = new Map();
  private deviceIntegrations: Map<string, DeviceIntegration> = new Map();
  
  // VibeMatch data stores
  private vibeProfiles: Map<string, VibeProfile> = new Map();
  private vibeMatches: Map<string, VibeMatch> = new Map();
  private matchChats: Map<string, MatchChat> = new Map();
  private reflectionPrompts: Map<string, ReflectionPrompt> = new Map();
  private chatSafetyLogs: Map<string, ChatSafetyLog> = new Map();
  private prismPoints: Map<string, PrismPoint> = new Map();
  private partnerConnections: Map<string, PartnerConnection> = new Map();
  private userPreferences: Map<string, UserPreferences> = new Map();
  
  // New data stores for wellness circles, habit builder, and admin
  private wellnessCircles: Map<string, WellnessCircle> = new Map();
  private circleMembers: Map<string, CircleMember> = new Map();
  private circleActivities: Map<string, CircleActivity> = new Map();
  private habitPrograms: Map<string, HabitProgram> = new Map();
  private habitEnrollments: Map<string, HabitEnrollment> = new Map();
  private habitCheckIns: Map<string, HabitCheckIn> = new Map();
  private adminSettings: Map<string, AdminSetting> = new Map();
  private contentBlocks: Map<string, ContentBlock> = new Map();
  private geoPromptCheckIns: Map<string, GeoPromptCheckIn> = new Map();
  private soulMaps: Map<string, any> = new Map();
  private visionQuests: Map<string, any> = new Map();
  
  constructor() {
    this.initializeReflectionPrompts();
    this.initializeChallengesAndRewards();
    this.initializeWellnessCircles();
    this.initializeHabitPrograms();
    this.initializeAdminSettings();
    this.initializeContentBlocks();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      avatarUrl: insertUser.avatarUrl || null,
      tier: "free",
      role: "user",
      tokensUsed: 0,
      tokenLimit: 10,
      resetDate: now,
      courseAccess: false,
      courseAccessDate: null,
      createdAt: now
    };
    this.users.set(id, user);
    
    // Create default profile
    await this.createUserProfile({ userId: id });
    
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getBotChatSessions(userId: string, botId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.userId === userId && session.botId === botId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = { 
      ...insertSession, 
      id,
      title: insertSession.title || null,
      createdAt: now,
      updatedAt: now
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const session = this.chatSessions.get(id);
    if (!session) throw new Error("Chat session not found");
    
    const updatedSession = { ...session, ...updates, updatedAt: new Date() };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = { 
      ...insertMessage, 
      id,
      audioUrl: insertMessage.audioUrl || null,
      sentiment: insertMessage.sentiment || null,
      sentimentScore: insertMessage.sentimentScore || null,
      metadata: insertMessage.metadata || {},
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    return this.userProfiles.get(userId);
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const profile: UserProfile = {
      userId: insertProfile.userId,
      displayName: insertProfile.displayName || null,
      username: insertProfile.username || null,
      bio: insertProfile.bio || null,
      profileImageUrl: insertProfile.profileImageUrl || null,
      phone: insertProfile.phone || null,
      website: insertProfile.website || null,
      location: insertProfile.location || null,
      timezone: insertProfile.timezone || null,
      language: insertProfile.language || null,
      currentMood: insertProfile.currentMood || null,
      moodDescription: insertProfile.moodDescription || null,
      emotionalTone: insertProfile.emotionalTone || null,
      coreValues: insertProfile.coreValues || [],
      archetypes: insertProfile.archetypes || [],
      intentions: insertProfile.intentions || [],
      vibeMatchEnabled: insertProfile.vibeMatchEnabled || false,
      vibeMatchBio: insertProfile.vibeMatchBio || null,
      preferences: insertProfile.preferences || {},
      notificationSettings: insertProfile.notificationSettings || {},
      privacySettings: insertProfile.privacySettings || {},
      appearanceSettings: insertProfile.appearanceSettings || {},
      badges: insertProfile.badges || null,
      evolutionScore: insertProfile.evolutionScore || null,
      reflectionStreak: insertProfile.reflectionStreak || 0,
      updatedAt: new Date()
    };
    this.userProfiles.set(insertProfile.userId, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.userProfiles.get(userId);
    if (!profile) throw new Error("User profile not found");
    
    const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  async incrementTokenUsage(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    // Reset if it's a new day
    const now = new Date();
    const resetDate = new Date(user.resetDate);
    if (now.getDate() !== resetDate.getDate()) {
      await this.resetTokenUsage(userId);
      return;
    }
    
    const updatedUser = { ...user, tokensUsed: user.tokensUsed + 1 };
    this.users.set(userId, updatedUser);
  }

  async resetTokenUsage(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, tokensUsed: 0, resetDate: new Date() };
    this.users.set(userId, updatedUser);
  }

  async upgradeTier(userId: string, planId: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    // Plan configuration
    const planConfig = {
      "growth": { tier: "growth", tokenLimit: 1000 },
      "resonance": { tier: "resonance", tokenLimit: 2500 },
      "enterprise": { tier: "enterprise", tokenLimit: 10000 }
    };
    
    const config = planConfig[planId as keyof typeof planConfig];
    if (!config) {
      throw new Error("Invalid plan ID");
    }
    
    const updatedUser = {
      ...user,
      tier: config.tier,
      tokenLimit: config.tokenLimit,
      tokensUsed: 0, // Reset tokens when upgrading
      resetDate: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getAccessCode(code: string): Promise<AccessCode | undefined> {
    return this.accessCodes.get(code);
  }

  async createAccessCode(insertAccessCode: InsertAccessCode): Promise<AccessCode> {
    const id = randomUUID();
    const accessCode: AccessCode = {
      ...insertAccessCode,
      id,
      type: insertAccessCode.type || "course",
      isUsed: false,
      usedBy: null,
      usedAt: null,
      expiresAt: insertAccessCode.expiresAt || null,
      metadata: insertAccessCode.metadata || {},
      createdAt: new Date()
    };
    this.accessCodes.set(insertAccessCode.code, accessCode);
    return accessCode;
  }

  async redeemAccessCode(code: string, userId: string): Promise<AccessCode> {
    const accessCode = this.accessCodes.get(code);
    if (!accessCode) throw new Error("Access code not found");
    if (accessCode.isUsed) throw new Error("Access code already used");
    if (accessCode.expiresAt && accessCode.expiresAt < new Date()) {
      throw new Error("Access code expired");
    }

    const updatedAccessCode = {
      ...accessCode,
      isUsed: true,
      usedBy: userId,
      usedAt: new Date()
    };
    this.accessCodes.set(code, updatedAccessCode);

    // Grant course access to user
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = {
        ...user,
        courseAccess: true,
        courseAccessDate: new Date(),
        tokenLimit: user.tokenLimit < 50 ? 50 : user.tokenLimit // Increase token limit for course participants
      };
      this.users.set(userId, updatedUser);
    }

    return updatedAccessCode;
  }

  // Wellness Metrics
  async getWellnessMetrics(userId: string, days = 30): Promise<WellnessMetric[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.wellnessMetrics.values())
      .filter(metric => metric.userId === userId && metric.date >= cutoffDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createWellnessMetric(insertMetric: InsertWellnessMetric): Promise<WellnessMetric> {
    const id = randomUUID();
    const metric: WellnessMetric = {
      ...insertMetric,
      id,
      date: insertMetric.date || new Date(),
      mood: insertMetric.mood || null,
      energy: insertMetric.energy || null,
      stress: insertMetric.stress || null,
      gratitude: insertMetric.gratitude || null,
      reflection: insertMetric.reflection || null,
      goals: insertMetric.goals || [],
      achievements: insertMetric.achievements || [],
      metadata: insertMetric.metadata || {},
      createdAt: new Date()
    };
    this.wellnessMetrics.set(id, metric);
    return metric;
  }

  async updateWellnessMetric(id: string, updates: Partial<WellnessMetric>): Promise<WellnessMetric> {
    const metric = this.wellnessMetrics.get(id);
    if (!metric) throw new Error("Wellness metric not found");
    
    const updatedMetric = { ...metric, ...updates };
    this.wellnessMetrics.set(id, updatedMetric);
    return updatedMetric;
  }

  // Habits
  async getUserHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values())
      .filter(habit => habit.userId === userId && habit.isActive)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = randomUUID();
    const habit: Habit = {
      ...insertHabit,
      id,
      description: insertHabit.description || null,
      frequency: insertHabit.frequency || "daily",
      target: insertHabit.target || 1,
      icon: insertHabit.icon || "fas fa-star",
      color: insertHabit.color || "#10b981",
      isActive: true,
      createdAt: new Date()
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    const habit = this.habits.get(id);
    if (!habit) throw new Error("Habit not found");
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<void> {
    const habit = this.habits.get(id);
    if (!habit) throw new Error("Habit not found");
    
    // Soft delete by setting isActive to false
    const updatedHabit = { ...habit, isActive: false };
    this.habits.set(id, updatedHabit);
  }

  // Habit Entries
  async getHabitEntries(habitId: string, days = 30): Promise<HabitEntry[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.habitEntries.values())
      .filter(entry => entry.habitId === habitId && entry.date >= cutoffDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async createHabitEntry(insertEntry: InsertHabitEntry): Promise<HabitEntry> {
    const id = randomUUID();
    const entry: HabitEntry = {
      ...insertEntry,
      id,
      date: insertEntry.date || new Date(),
      completed: insertEntry.completed || false,
      count: insertEntry.count || 1,
      notes: insertEntry.notes || null,
      createdAt: new Date()
    };
    this.habitEntries.set(id, entry);
    return entry;
  }

  async updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry> {
    const entry = this.habitEntries.get(id);
    if (!entry) throw new Error("Habit entry not found");
    
    const updatedEntry = { ...entry, ...updates };
    this.habitEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  // Apple Health Data
  async getAppleHealthData(userId: string, days = 30): Promise<AppleHealthData[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.appleHealthData.values())
      .filter(data => data.userId === userId && data.date >= cutoffDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async syncAppleHealthData(insertData: InsertAppleHealthData): Promise<AppleHealthData> {
    const id = randomUUID();
    const data: AppleHealthData = {
      ...insertData,
      id,
      date: insertData.date || new Date(),
      steps: insertData.steps || null,
      heartRate: insertData.heartRate || null,
      activeCalories: insertData.activeCalories || null,
      exerciseMinutes: insertData.exerciseMinutes || null,
      standHours: insertData.standHours || null,
      sleepHours: insertData.sleepHours || null,
      mindfulMinutes: insertData.mindfulMinutes || null,
      workouts: insertData.workouts || [],
      syncedAt: new Date()
    };
    this.appleHealthData.set(id, data);
    return data;
  }

  // HomeKit Data
  async getHomeKitData(userId: string, days = 30): Promise<HomeKitData[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.homeKitData.values())
      .filter(data => data.userId === userId && data.date >= cutoffDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async syncHomeKitData(insertData: InsertHomeKitData): Promise<HomeKitData> {
    const id = randomUUID();
    const data: HomeKitData = {
      ...insertData,
      id,
      date: insertData.date || new Date(),
      temperature: insertData.temperature || null,
      humidity: insertData.humidity || null,
      airQuality: insertData.airQuality || null,
      lightLevel: insertData.lightLevel || null,
      noiseLevel: insertData.noiseLevel || null,
      devices: insertData.devices || {},
      syncedAt: new Date()
    };
    this.homeKitData.set(id, data);
    return data;
  }

  // Wellness Patterns
  async getWellnessPatterns(userId: string): Promise<WellnessPattern[]> {
    return Array.from(this.wellnessPatterns.values())
      .filter(pattern => pattern.userId === userId && pattern.isActive)
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  async detectPatterns(userId: string): Promise<WellnessPattern[]> {
    // Basic pattern detection logic - in production this would be more sophisticated
    const metrics = await this.getWellnessMetrics(userId, 30);
    const patterns: WellnessPattern[] = [];
    
    if (metrics.length >= 7) {
      // Detect mood trends
      const moods = metrics.filter(m => m.mood).map(m => m.mood);
      const moodCounts = moods.reduce((acc, mood) => {
        acc[mood!] = (acc[mood!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const dominantMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (dominantMood && dominantMood[1] >= 3) {
        const id = randomUUID();
        const pattern: WellnessPattern = {
          id,
          userId,
          patternType: 'mood_trend',
          description: `You've been feeling ${dominantMood[0]} frequently over the past week.`,
          confidence: Math.min(95, (dominantMood[1] / moods.length) * 100),
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endDate: null,
          data: { mood: dominantMood[0], frequency: dominantMood[1], total: moods.length },
          isActive: true,
          detectedAt: new Date()
        };
        patterns.push(pattern);
        this.wellnessPatterns.set(id, pattern);
      }
    }
    
    return patterns;
  }

  // Recommendations
  async getRecommendations(userId: string, limit = 10): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values())
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const id = randomUUID();
    const newRecommendation: Recommendation = {
      id,
      ...recommendation,
      metadata: recommendation.metadata || {},
      confidence: recommendation.confidence || 80,
      instructions: recommendation.instructions || null,
      duration: recommendation.duration || null,
      difficulty: recommendation.difficulty || 'beginner',
      tags: recommendation.tags || [],
      basedOnPatterns: recommendation.basedOnPatterns || [],
      isCompleted: false,
      completedAt: null,
      rating: null,
      feedback: null,
      createdAt: new Date(),
    };
    this.recommendations.set(id, newRecommendation);
    return newRecommendation;
  }

  async updateRecommendation(id: string, updates: Partial<Recommendation>): Promise<Recommendation> {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) throw new Error('Recommendation not found');
    
    const updated = { ...recommendation, ...updates };
    this.recommendations.set(id, updated);
    return updated;
  }

  async generateRecommendations(userId: string): Promise<Recommendation[]> {
    // Get recent wellness data
    const recentMetrics = await this.getWellnessMetrics(userId, 7);
    const patterns = await this.getWellnessPatterns(userId);
    const fitnessData = await this.getFitnessData(userId, 7);
    
    const recommendations: InsertRecommendation[] = [];
    
    // Generate recommendations based on patterns and data
    if (recentMetrics.length > 0) {
      const avgStress = recentMetrics.reduce((sum, m) => sum + (m.stress || 0), 0) / recentMetrics.length;
      const avgEnergy = recentMetrics.reduce((sum, m) => sum + (m.energy || 0), 0) / recentMetrics.length;
      
      // High stress recommendations
      if (avgStress > 7) {
        recommendations.push({
          userId,
          type: 'breathwork',
          title: 'Deep Breathing for Stress Relief',
          description: 'Your stress levels have been elevated. This breathing technique will help activate your parasympathetic nervous system.',
          reasoning: `Based on your recent stress levels (${avgStress.toFixed(1)}/10), your highest self recognizes you need grounding.`,
          instructions: '1. Sit comfortably with your spine straight\\n2. Inhale for 4 counts through your nose\\n3. Hold for 4 counts\\n4. Exhale for 6 counts through your mouth\\n5. Repeat for 5-10 minutes',
          duration: 10,
          difficulty: 'beginner',
          tags: ['stress-relief', 'breathwork', 'anxiety'],
          confidence: 85,
          basedOnPatterns: patterns.filter(p => p.patternType.includes('stress')).map(p => p.id),
          metadata: { category: 'mindfulness' }
        });
      }
      
      // Low energy recommendations
      if (avgEnergy < 4) {
        recommendations.push({
          userId,
          type: 'workout',
          title: 'Energizing Morning Flow',
          description: 'Your energy has been lower lately. This gentle movement practice will help awaken your body and spirit.',
          reasoning: `Your highest self sees that your energy levels (${avgEnergy.toFixed(1)}/10) need nurturing through mindful movement.`,
          instructions: '1. Start with gentle neck rolls\n2. Cat-cow stretches (5 reps)\n3. Sun salutation A (3 rounds)\n4. Warrior II sequence\n5. Childs pose to close',
          duration: 15,
          difficulty: 'beginner',
          tags: ['yoga', 'energy', 'morning'],
          confidence: 80,
          basedOnPatterns: patterns.filter(p => p.patternType.includes('energy')).map(p => p.id),
          metadata: { category: 'movement' }
        });
      }
      
      // Nutrition recommendations based on mood patterns
      const moodCounts = recentMetrics.reduce((acc, m) => {
        if (m.mood) acc[m.mood] = (acc[m.mood] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
      
      if (dominantMood?.[0] === 'tired' || avgEnergy < 5) {
        recommendations.push({
          userId,
          type: 'nutrition',
          title: 'Nourishing Energy Bowl',
          description: 'Your body is calling for sustained energy. This nutrient-dense meal will support your vitality.',
          reasoning: 'Your highest self recognizes that true energy comes from nourishing your temple with wholesome foods.',
          instructions: 'Combine: \\n• 1 cup quinoa or brown rice\\n• 1/2 avocado\\n• Handful of leafy greens\\n• 2 tbsp nuts/seeds\\n• Lemon-tahini dressing\\n• Optional: roasted vegetables',
          duration: 20,
          difficulty: 'beginner',
          tags: ['nutrition', 'energy', 'wholefood'],
          confidence: 75,
          basedOnPatterns: [],
          metadata: { category: 'nutrition', calories: '450-500' }
        });
      }
    }
    
    // Create recommendations
    const createdRecommendations = [];
    for (const rec of recommendations) {
      const created = await this.createRecommendation(rec);
      createdRecommendations.push(created);
    }
    
    return createdRecommendations;
  }

  // Fitness data
  async getFitnessData(userId: string, days = 30): Promise<FitnessData[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.fitnessData.values())
      .filter(f => f.userId === userId && new Date(f.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createFitnessData(fitnessData: InsertFitnessData): Promise<FitnessData> {
    const id = randomUUID();
    const newFitnessData: FitnessData = {
      id,
      userId: fitnessData.userId,
      date: fitnessData.date || new Date(),
      weight: fitnessData.weight ?? null,
      bodyFat: fitnessData.bodyFat ?? null,
      muscleMass: fitnessData.muscleMass ?? null,
      waterIntake: fitnessData.waterIntake ?? null,
      workoutDuration: fitnessData.workoutDuration ?? null,
      workoutType: fitnessData.workoutType ?? null,
      workoutIntensity: fitnessData.workoutIntensity ?? null,
      restingHeartRate: fitnessData.restingHeartRate ?? null,
      bloodPressure: fitnessData.bloodPressure ?? null,
      sleepQuality: fitnessData.sleepQuality ?? null,
      stressLevel: fitnessData.stressLevel ?? null,
      notes: fitnessData.notes ?? null,
      source: fitnessData.source || 'manual',
      createdAt: new Date(),
    };
    this.fitnessData.set(id, newFitnessData);
    return newFitnessData;
  }

  async getLatestFitnessData(userId: string): Promise<FitnessData | null> {
    const userFitness = Array.from(this.fitnessData.values())
      .filter(f => f.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return userFitness[0] || null;
  }

  // Device integrations
  async getDeviceIntegrations(userId: string): Promise<DeviceIntegration[]> {
    return Array.from(this.deviceIntegrations.values()).filter(d => d.userId === userId);
  }

  async createDeviceIntegration(integration: InsertDeviceIntegration): Promise<DeviceIntegration> {
    const id = randomUUID();
    const newIntegration: DeviceIntegration = {
      id,
      userId: integration.userId,
      deviceType: integration.deviceType,
      isConnected: integration.isConnected || false,
      settings: integration.settings || {},
      metadata: integration.metadata || {},
      lastSync: null,
      accessToken: null,
      refreshToken: null,
      connectedAt: integration.isConnected ? new Date() : null,
      createdAt: new Date(),
    };
    this.deviceIntegrations.set(id, newIntegration);
    return newIntegration;
  }

  async updateDeviceIntegration(userId: string, deviceType: string, updates: Partial<DeviceIntegration>): Promise<DeviceIntegration> {
    const existing = Array.from(this.deviceIntegrations.values())
      .find(d => d.userId === userId && d.deviceType === deviceType);
    
    if (!existing) {
      // Create new integration if doesn't exist
      return this.createDeviceIntegration({
        userId,
        deviceType,
        isConnected: updates.isConnected || false,
        settings: updates.settings || {},
        metadata: updates.metadata || {},
      });
    }
    
    const updated = { 
      ...existing, 
      ...updates,
      connectedAt: updates.isConnected ? new Date() : existing.connectedAt
    };
    this.deviceIntegrations.set(existing.id, updated);
    return updated;
  }

  async syncDeviceData(userId: string, deviceType: string): Promise<any> {
    // Mock sync - in real implementation this would call device APIs
    const integration = Array.from(this.deviceIntegrations.values())
      .find(d => d.userId === userId && d.deviceType === deviceType);
    
    if (!integration || !integration.isConnected) {
      throw new Error('Device not connected');
    }
    
    // Update last sync time
    await this.updateDeviceIntegration(userId, deviceType, { lastSync: new Date() });
    
    return { message: `Successfully synced ${deviceType} data`, timestamp: new Date() };
  }

  // VibeMatch System Implementations
  
  private initializeReflectionPrompts(): void {
    const prompts = [
      { category: 'self-discovery', difficulty: 'easy', prompt: 'What brings you the most joy in your daily life?', description: 'Share what genuinely lights you up' },
      { category: 'growth', difficulty: 'medium', prompt: 'What challenge are you currently working through?', description: 'Explore a current area of personal development' },
      { category: 'values', difficulty: 'easy', prompt: 'What does authentic living mean to you?', description: 'Express your core values and beliefs' },
      { category: 'relationships', difficulty: 'medium', prompt: 'How do you prefer to connect with others?', description: 'Discuss your relationship and communication style' },
      { category: 'spirituality', difficulty: 'hard', prompt: 'What practices help you feel most connected to yourself?', description: 'Share your spiritual or mindfulness practices' },
      { category: 'purpose', difficulty: 'hard', prompt: 'What legacy do you want to leave in this world?', description: 'Reflect on your deeper purpose and impact' }
    ];
    
    prompts.forEach((prompt, index) => {
      const id = randomUUID();
      const reflectionPrompt: ReflectionPrompt = {
        id,
        category: prompt.category,
        difficulty: prompt.difficulty as 'easy' | 'medium' | 'hard',
        prompt: prompt.prompt,
        description: prompt.description,
        isActive: true,
        createdAt: new Date()
      };
      this.reflectionPrompts.set(id, reflectionPrompt);
    });
  }

  async getVibeProfile(userId: string): Promise<VibeProfile | undefined> {
    return Array.from(this.vibeProfiles.values()).find(profile => profile.userId === userId);
  }

  async createOrUpdateVibeProfile(profileData: any): Promise<VibeProfile> {
    const existing = await this.getVibeProfile(profileData.userId);
    
    if (existing) {
      const updated = { ...existing, ...profileData, updatedAt: new Date() } as VibeProfile;
      this.vibeProfiles.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const profile = {
        id,
        userId: profileData.userId,
        bio: profileData.bio || '',
        location: profileData.location || '',
        interests: profileData.interests || [],
        vibeWords: profileData.vibeWords || [],
        seekingConnection: profileData.seekingConnection || '',
        ageRange: profileData.ageRange || '',
        profileComplete: profileData.profileComplete || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.vibeProfiles.set(id, profile);
      return profile;
    }
  }

  async getPotentialMatches(userId: string): Promise<any[]> {
    const userProfile = await this.getVibeProfile(userId);
    if (!userProfile) return [];
    
    // Get all other complete profiles
    const otherProfiles = Array.from(this.vibeProfiles.values())
      .filter(profile => profile.userId !== userId && profile.profileComplete);
    
    // Calculate match scores and create potential matches
    return otherProfiles.map(profile => {
      const userInterests = userProfile.interests || [];
      const profileInterests = profile.interests || [];
      const sharedInterests = userInterests.filter(interest => 
        profileInterests.includes(interest)
      );
      const matchScore = Math.min(90, 60 + (sharedInterests.length * 10));
      
      return {
        profile: {
          userId: profile.userId,
          bio: profile.bio,
          interests: profile.interests,
          vibeWords: profile.vibeWords,
          location: profile.location
        },
        matchScore,
        distance: '5-10 miles',
        sharedInterests
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  async getCurrentMatches(userId: string): Promise<VibeMatch[]> {
    return Array.from(this.vibeMatches.values())
      .filter(match => match.userId1 === userId || match.userId2 === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async processMatchAction(userId: string, matchUserId: string, action: string): Promise<any> {
    // Check if there's already a match between these users
    const existingMatch = Array.from(this.vibeMatches.values())
      .find(match => 
        (match.userId1 === userId && match.userId2 === matchUserId) ||
        (match.userId1 === matchUserId && match.userId2 === userId)
      );
    
    if (action === 'like') {
      // Check if the other user already liked this user
      const reverseMatch = Array.from(this.vibeMatches.values())
        .find(match => match.userId1 === matchUserId && match.userId2 === userId);
      
      if (reverseMatch) {
        // Mutual match! Update existing match to active
        const updatedMatch: VibeMatch = {
          ...reverseMatch,
          status: 'active',
          lastInteraction: new Date()
        };
        this.vibeMatches.set(reverseMatch.id, updatedMatch);
        return { matched: true, matchId: reverseMatch.id };
      } else {
        // Create new match (pending)
        const id = randomUUID();
        const match: VibeMatch = {
          id,
          userId1: userId,
          userId2: matchUserId,
          matchScore: 75,
          user1Action: 'like',
          user2Action: null,
          status: 'pending',
          resonanceCount: 0,
          lastInteraction: new Date(),
          createdAt: new Date()
        };
        this.vibeMatches.set(id, match);
        return { matched: false, matchId: id };
      }
    }
    
    return { matched: false };
  }

  async updateMatchResonance(matchId: string, resonanceContribution: number): Promise<void> {
    const match = this.vibeMatches.get(matchId);
    if (match) {
      const updated: VibeMatch = {
        ...match,
        resonanceCount: (match.resonanceCount || 0) + resonanceContribution
      };
      this.vibeMatches.set(matchId, updated);
    }
  }

  async getMatchChatMessages(matchId: string, userId: string): Promise<any[]> {
    const messages = Array.from(this.matchChats.values())
      .filter(chat => chat.matchId === matchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    // Add display information for the chat interface
    return messages.map(msg => ({
      ...msg,
      isOwn: msg.senderId === userId,
      partnerName: 'Anonymous Soul'
    }));
  }

  async createMatchChatMessage(messageData: any): Promise<MatchChat> {
    const id = randomUUID();
    const message: MatchChat = {
      id,
      matchId: messageData.matchId,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      message: messageData.message,
      messageType: messageData.messageType || 'text',
      isReflectionResponse: messageData.messageType === 'reflection_prompt',
      reflectionPromptId: messageData.reflectionPromptId || null,
      aiModerationScore: messageData.aiModerationScore || 100,
      aiModerationFlags: [],
      isHidden: false,
      resonanceContribution: messageData.resonanceContribution || 0,
      readAt: null,
      createdAt: new Date()
    };
    this.matchChats.set(id, message);
    return message;
  }

  async createChatSafetyLog(logData: any): Promise<ChatSafetyLog> {
    const id = randomUUID();
    const log: ChatSafetyLog = {
      id,
      chatId: logData.chatId,
      userId: logData.userId,
      actionType: logData.actionType,
      reason: logData.reason,
      aiAssistance: null,
      resolved: false,
      createdAt: new Date()
    };
    this.chatSafetyLogs.set(id, log);
    return log;
  }

  async getReflectionPrompts(): Promise<ReflectionPrompt[]> {
    return Array.from(this.reflectionPrompts.values())
      .filter(prompt => prompt.isActive)
      .sort(() => Math.random() - 0.5) // Randomize order
      .slice(0, 8); // Return max 8 prompts
  }

  async getPrismPoints(userId: string): Promise<PrismPoint[]> {
    return Array.from(this.prismPoints.values())
      .filter(point => point.userId1 === userId || point.userId2 === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async setupVibeMatchTestData(userId: string): Promise<any> {
    // Create test vibe profile if not exists
    const existingProfile = await this.getVibeProfile(userId);
    if (!existingProfile) {
      await this.createOrUpdateVibeProfile({
        userId,
        bio: "I'm on a journey of self-discovery and love connecting with like-minded souls who value authenticity and growth.",
        location: "San Francisco, CA",
        interests: ["meditation", "yoga", "personal growth", "nature", "wellness"],
        vibeWords: ["authentic", "empathetic", "curious", "grounded"],
        seekingConnection: "spiritual_companion",
        ageRange: "25-35",
        profileComplete: true
      });
    }

    // Create test match user
    const testMatchUserId = randomUUID();
    const testUser: User = {
      id: testMatchUserId,
      email: "testmatch@example.com",
      name: "Test Soul",
      avatarUrl: null,
      tier: "free",
      role: "user",
      tokensUsed: 0,
      tokenLimit: 10,
      resetDate: new Date(),
      courseAccess: false,
      courseAccessDate: null,
      createdAt: new Date()
    };
    this.users.set(testMatchUserId, testUser);

    // Create test match profile
    await this.createOrUpdateVibeProfile({
      userId: testMatchUserId,
      bio: "Soul seeking deeper connections through meaningful conversations and shared growth experiences.",
      location: "San Francisco, CA", 
      interests: ["meditation", "spirituality", "wellness", "mindfulness"],
      vibeWords: ["mindful", "compassionate", "seeking", "open"],
      seekingConnection: "growth_partner",
      ageRange: "25-35",
      profileComplete: true
    });

    // Create a mutual match
    const matchId = randomUUID();
    const match: VibeMatch = {
      id: matchId,
      userId1: userId,
      userId2: testMatchUserId,
      matchScore: 85,
      user1Action: 'like',
      user2Action: 'like',
      status: 'active',
      resonanceCount: 2, // Close to unlocking Prism Point
      lastInteraction: new Date(),
      createdAt: new Date()
    };
    this.vibeMatches.set(matchId, match);

    // Add some test chat messages
    await this.createMatchChatMessage({
      matchId,
      senderId: testMatchUserId,
      receiverId: userId,
      message: "Hi! I saw we both value meditation and personal growth. What drew you to mindfulness practices?",
      messageType: "text",
      aiModerationScore: 95,
      resonanceContribution: 1
    });

    return {
      testMatchUserId,
      matchId,
      message: "Test VibeMatch data created! You now have a mutual match ready to chat.",
      instructions: "Go to the VibeMatch tab to see your connection and start chatting!"
    };
  }

  // Partner Connections
  async getPartnerConnections(userId: string): Promise<PartnerConnection[]> {
    return Array.from(this.partnerConnections.values())
      .filter(conn => conn.userId1 === userId || conn.userId2 === userId);
  }

  async createPartnerConnection(connection: InsertPartnerConnection): Promise<PartnerConnection> {
    const id = randomUUID();
    const partnerConnection: PartnerConnection = {
      id,
      ...connection,
      connectionLevel: connection.connectionLevel || 1,
      dataSharing: connection.dataSharing || {},
      sharedGoals: connection.sharedGoals || [],
      isActive: connection.isActive !== undefined ? connection.isActive : true,
      establishedAt: new Date(),
      createdAt: new Date()
    };
    this.partnerConnections.set(id, partnerConnection);
    return partnerConnection;
  }

  async updatePartnerConnection(id: string, updates: Partial<PartnerConnection>): Promise<PartnerConnection> {
    const existing = this.partnerConnections.get(id);
    if (!existing) {
      throw new Error('Partner connection not found');
    }
    const updated = { ...existing, ...updates };
    this.partnerConnections.set(id, updated);
    return updated;
  }

  async invitePartner(userId: string, email: string, relationshipType: string): Promise<any> {
    // In a real implementation, this would send an email invitation
    // For now, we'll simulate creating a pending connection
    return {
      success: true,
      message: `Invitation sent to ${email} for ${relationshipType} partnership`,
      inviteCode: randomUUID()
    };
  }

  // User Preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values())
      .find(pref => pref.userId === userId);
  }

  async createOrUpdateUserPreferences(preferences: Partial<UserPreferences & { userId: string }>): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(preferences.userId!);
    
    if (existing) {
      const updated: UserPreferences = {
        ...existing,
        ...preferences,
        updatedAt: new Date()
      };
      this.userPreferences.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const userPrefs: UserPreferences = {
        id,
        userId: preferences.userId!,
        dataSharing: preferences.dataSharing || {
          wellness_metrics: 'private',
          habits: 'private',
          mood_patterns: 'private',
          growth_insights: 'private'
        },
        visibility: preferences.visibility || 'private',
        notifications: preferences.notifications || {
          daily_checkin_reminder: true,
          vibe_match_notifications: true,
          partner_updates: true,
          community_mentions: true,
          easter_egg_unlocks: true
        },
        trackingPreferences: preferences.trackingPreferences || {
          mood_tracking: true,
          energy_tracking: true,
          habit_reminders: true,
          pattern_insights: true
        },
        aiPersonality: preferences.aiPersonality || 'balanced',
        aiIntensity: preferences.aiIntensity || 5,
        aiGuidanceStyle: preferences.aiGuidanceStyle || 'supportive',
        communitySettings: preferences.communitySettings || {
          default_anonymous: true,
          auto_moderate: true,
          notification_level: 'mentions_only'
        },
        partnerSettings: preferences.partnerSettings || {
          auto_share_mood: false,
          auto_share_habits: false,
          share_insights: true,
          relationship_goals_visible: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.userPreferences.set(id, userPrefs);
      return userPrefs;
    }
  }

  // Initialize default challenges and rewards
  private initializeChallengesAndRewards() {
    // Initialize some default reward definitions
    const defaultRewards: RewardDefinition[] = [
      {
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Complete daily check-ins for 7 days in a row',
        type: 'badge',
        criteria: { streakDays: 7 },
        points: 100,
        icon: '🔥',
        rarity: 'common',
        createdAt: new Date()
      },
      {
        id: 'habits-complete',
        title: 'Habit Master',
        description: 'Complete all daily habits',
        type: 'badge',
        criteria: { habitsComplete: true },
        points: 50,
        icon: '⭐',
        rarity: 'common',
        createdAt: new Date()
      },
      {
        id: 'challenge-complete',
        title: 'Challenge Champion',
        description: 'Complete your first wellness challenge',
        type: 'badge',
        criteria: { challengeComplete: true },
        points: 200,
        icon: '🏆',
        rarity: 'rare',
        createdAt: new Date()
      }
    ];

    defaultRewards.forEach(reward => {
      this.rewardDefinitions.set(reward.id, reward);
    });

    // Initialize some default challenges
    const defaultChallenges: Challenge[] = [
      {
        id: 'mindful-week',
        title: '7 Days of Mindfulness',
        description: 'Practice mindfulness for 7 consecutive days with daily check-ins and meditation',
        type: 'daily',
        category: 'mindfulness',
        duration: 7,
        difficulty: 'beginner',
        isActive: true,
        participantCount: 42,
        dailyTasks: [
          'Complete morning meditation (5+ minutes)',
          'Log your mood and energy levels',
          'Practice one mindful moment during the day',
          'Reflect on your gratitude'
        ],
        rewards: {
          completion: { points: 200, badge: 'challenge-complete' },
          daily: { points: 20 }
        },
        createdAt: new Date(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        id: 'energy-boost',
        title: 'Energy & Vitality Challenge',
        description: 'Boost your natural energy through movement, nutrition, and sleep optimization',
        type: 'daily',
        category: 'fitness',
        duration: 14,
        difficulty: 'intermediate',
        isActive: true,
        participantCount: 28,
        dailyTasks: [
          'Get 20+ minutes of movement',
          'Drink 8 glasses of water',
          'Complete sleep tracking',
          'Eat 2+ servings of vegetables'
        ],
        rewards: {
          completion: { points: 400, badge: 'challenge-complete' },
          daily: { points: 30 }
        },
        createdAt: new Date(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'soul-growth',
        title: 'Soul Growth Journey',
        description: 'A 21-day transformative journey combining reflection, intention-setting, and spiritual practices',
        type: 'daily',
        category: 'growth',
        duration: 21,
        difficulty: 'advanced',
        isActive: true,
        participantCount: 15,
        dailyTasks: [
          'Complete guided soul reflection',
          'Journal your insights and patterns',
          'Set daily intention',
          'Practice gratitude or appreciation'
        ],
        rewards: {
          completion: { points: 600, badge: 'challenge-complete' },
          daily: { points: 40 }
        },
        createdAt: new Date(),
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];

    defaultChallenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
    });
  }

  // Challenge System Implementation
  async getActiveChallenges(): Promise<Challenge[]> {
    const now = new Date();
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.isActive && (!challenge.endDate || challenge.endDate > now))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createChallenge(data: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = {
      ...data,
      id,
      isActive: data.isActive !== undefined ? data.isActive : true,
      participantCount: 0,
      createdAt: new Date()
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async getChallengeById(id: string): Promise<Challenge | null> {
    return this.challenges.get(id) || null;
  }

  async joinChallenge(challengeId: string, userId: string): Promise<ChallengeParticipant> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Check if user already joined
    const existingParticipant = Array.from(this.challengeParticipants.values())
      .find(p => p.challengeId === challengeId && p.userId === userId);
    
    if (existingParticipant) {
      return existingParticipant;
    }

    const id = randomUUID();
    const participant: ChallengeParticipant = {
      id,
      challengeId,
      userId,
      status: 'active',
      progress: 0,
      completedDays: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivity: null,
      joinedAt: new Date()
    };

    this.challengeParticipants.set(id, participant);
    
    // Increment participant count
    const updatedChallenge = { ...challenge, participantCount: challenge.participantCount + 1 };
    this.challenges.set(challengeId, updatedChallenge);

    return participant;
  }

  async updateChallengeProgress(challengeId: string, userId: string, progressData: {
    day: number;
    completed: boolean;
    notes?: string;
    metadata?: any;
  }): Promise<ChallengeProgress> {
    const participant = Array.from(this.challengeParticipants.values())
      .find(p => p.challengeId === challengeId && p.userId === userId);
    
    if (!participant) {
      throw new Error('User not participating in this challenge');
    }

    const id = randomUUID();
    const progress: ChallengeProgress = {
      id,
      challengeId,
      userId,
      day: progressData.day,
      completed: progressData.completed,
      notes: progressData.notes || null,
      metadata: progressData.metadata || {},
      completedAt: progressData.completed ? new Date() : null,
      createdAt: new Date()
    };

    this.challengeProgress.set(id, progress);

    // Update participant stats
    if (progressData.completed) {
      const updatedParticipant = {
        ...participant,
        completedDays: participant.completedDays + 1,
        progress: Math.min(100, ((participant.completedDays + 1) / 21) * 100), // Assuming 21-day challenges
        currentStreak: participant.currentStreak + 1,
        longestStreak: Math.max(participant.longestStreak, participant.currentStreak + 1),
        lastActivity: new Date()
      };
      this.challengeParticipants.set(participant.id, updatedParticipant);

      // Award daily points
      await this.awardReward(userId, 'daily-progress', 'challenge', challengeId);
    }

    return progress;
  }

  async getUserChallenges(userId: string): Promise<(ChallengeParticipant & { challenge: Challenge })[]> {
    const participants = Array.from(this.challengeParticipants.values())
      .filter(p => p.userId === userId);
    
    const result = [];
    for (const participant of participants) {
      const challenge = this.challenges.get(participant.challengeId);
      if (challenge) {
        result.push({ ...participant, challenge });
      }
    }
    
    return result.sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());
  }

  // Reward System Implementation
  async getUserStats(userId: string): Promise<UserStats & { rewards: UserReward[] }> {
    let stats = this.userStats.get(userId);
    if (!stats) {
      // Create default stats for new user
      stats = {
        id: randomUUID(),
        userId,
        totalPoints: 0,
        level: 1,
        streakDays: 0,
        longestStreak: 0,
        challengesCompleted: 0,
        habitsCompleted: 0,
        reflectionsCount: 0,
        badgesEarned: 0,
        achievements: [],
        lastActivity: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.userStats.set(userId, stats);
    }

    const rewards = Array.from(this.userRewards.values())
      .filter(r => r.userId === userId);
    
    return { ...stats, rewards };
  }

  async awardReward(userId: string, rewardId: string, source: string, sourceId?: string): Promise<UserReward> {
    const id = randomUUID();
    const reward: UserReward = {
      id,
      userId,
      rewardId,
      source,
      sourceId: sourceId || null,
      points: 20, // Default points
      awardedAt: new Date()
    };

    // Check if it's a defined reward
    const rewardDef = this.rewardDefinitions.get(rewardId);
    if (rewardDef) {
      reward.points = rewardDef.points;
    }

    this.userRewards.set(id, reward);

    // Update user stats
    const stats = await this.getUserStats(userId);
    const updatedStats = {
      ...stats,
      totalPoints: stats.totalPoints + reward.points,
      level: Math.floor((stats.totalPoints + reward.points) / 1000) + 1, // Level up every 1000 points
      lastActivity: new Date(),
      updatedAt: new Date()
    };
    this.userStats.set(userId, updatedStats);

    return reward;
  }

  async getRewardDefinitions(): Promise<RewardDefinition[]> {
    return Array.from(this.rewardDefinitions.values())
      .sort((a, b) => a.points - b.points);
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    const stats = await this.getUserStats(userId);
    const updatedStats = {
      ...stats,
      ...updates,
      updatedAt: new Date()
    };
    this.userStats.set(userId, updatedStats);
    return updatedStats;
  }

  // ========================================
  // WELLNESS CIRCLES IMPLEMENTATION
  // ========================================
  async getWellnessCircles(): Promise<WellnessCircle[]> {
    return Array.from(this.wellnessCircles.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getWellnessCircle(id: string): Promise<WellnessCircle | undefined> {
    return this.wellnessCircles.get(id);
  }

  async createWellnessCircle(circle: InsertWellnessCircle): Promise<WellnessCircle> {
    const id = randomUUID();
    const now = new Date();
    const newCircle: WellnessCircle = {
      id,
      name: circle.name,
      description: circle.description,
      category: circle.category,
      facilitatorId: circle.facilitatorId || null,
      facilitatorName: circle.facilitatorName || null,
      maxMembers: circle.maxMembers || 12,
      currentMembers: 0,
      meetingFrequency: circle.meetingFrequency || 'weekly',
      meetingDay: circle.meetingDay || null,
      meetingTime: circle.meetingTime || null,
      timezone: circle.timezone || 'UTC',
      status: circle.status || 'active',
      isPublic: circle.isPublic !== false,
      guidelines: circle.guidelines || null,
      topics: circle.topics || [],
      createdAt: now,
      updatedAt: now
    };
    
    this.wellnessCircles.set(id, newCircle);
    return newCircle;
  }

  async updateWellnessCircle(id: string, updates: Partial<WellnessCircle>): Promise<WellnessCircle> {
    const circle = this.wellnessCircles.get(id);
    if (!circle) throw new Error('Circle not found');
    
    const updated = { ...circle, ...updates, updatedAt: new Date() };
    this.wellnessCircles.set(id, updated);
    return updated;
  }

  async joinWellnessCircle(circleId: string, userId: string): Promise<CircleMember> {
    const circle = this.wellnessCircles.get(circleId);
    if (!circle) throw new Error('Circle not found');
    
    // Check if already a member
    const existingMember = Array.from(this.circleMembers.values())
      .find(m => m.circleId === circleId && m.userId === userId);
    if (existingMember) return existingMember;
    
    const id = randomUUID();
    const now = new Date();
    const member: CircleMember = {
      id,
      circleId,
      userId,
      role: 'member',
      status: 'pending',
      joinedAt: now,
      lastActiveAt: now
    };
    
    this.circleMembers.set(id, member);
    
    // Update circle member count
    circle.currentMembers = (circle.currentMembers || 0) + 1;
    this.wellnessCircles.set(circleId, { ...circle, updatedAt: new Date() });
    
    return member;
  }

  async leaveWellnessCircle(circleId: string, userId: string): Promise<void> {
    const member = Array.from(this.circleMembers.values())
      .find(m => m.circleId === circleId && m.userId === userId);
    
    if (member) {
      this.circleMembers.delete(member.id);
      
      // Update circle member count
      const circle = this.wellnessCircles.get(circleId);
      if (circle && circle.currentMembers > 0) {
        circle.currentMembers--;
        this.wellnessCircles.set(circleId, { ...circle, updatedAt: new Date() });
      }
    }
  }

  async getUserCircles(userId: string): Promise<(CircleMember & { circle: WellnessCircle })[]> {
    const memberships = Array.from(this.circleMembers.values())
      .filter(m => m.userId === userId);
    
    return memberships.map(member => {
      const circle = this.wellnessCircles.get(member.circleId);
      return { ...member, circle: circle! };
    }).filter(item => item.circle);
  }

  async getCircleMembers(circleId: string): Promise<(CircleMember & { user: User })[]> {
    const members = Array.from(this.circleMembers.values())
      .filter(m => m.circleId === circleId);
    
    return members.map(member => {
      const user = this.users.get(member.userId);
      return { ...member, user: user! };
    }).filter(item => item.user);
  }

  async createCircleActivity(activity: InsertCircleActivity): Promise<CircleActivity> {
    const id = randomUUID();
    const newActivity: CircleActivity = {
      id,
      circleId: activity.circleId,
      userId: activity.userId,
      type: activity.type,
      title: activity.title || null,
      content: activity.content,
      isPrivate: activity.isPrivate || false,
      metadata: activity.metadata || {},
      createdAt: new Date()
    };
    
    this.circleActivities.set(id, newActivity);
    return newActivity;
  }

  async getCircleActivities(circleId: string, limit?: number): Promise<(CircleActivity & { user: User })[]> {
    let activities = Array.from(this.circleActivities.values())
      .filter(a => a.circleId === circleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (limit) {
      activities = activities.slice(0, limit);
    }
    
    return activities.map(activity => {
      const user = this.users.get(activity.userId);
      return { ...activity, user: user! };
    }).filter(item => item.user);
  }

  // ========================================
  // 30-DAY HABIT BUILDER IMPLEMENTATION
  // ========================================
  async getHabitPrograms(): Promise<HabitProgram[]> {
    return Array.from(this.habitPrograms.values())
      .filter(p => p.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getHabitProgram(id: string): Promise<HabitProgram | undefined> {
    return this.habitPrograms.get(id);
  }

  async createHabitProgram(program: InsertHabitProgram): Promise<HabitProgram> {
    const id = randomUUID();
    const newProgram: HabitProgram = {
      id,
      name: program.name,
      description: program.description,
      category: program.category,
      duration: program.duration || 30,
      difficulty: program.difficulty || 'beginner',
      dailyTasks: program.dailyTasks || [],
      rewards: program.rewards || {},
      icon: program.icon || 'fas fa-star',
      color: program.color || '#10b981',
      isActive: program.isActive !== false,
      createdBy: program.createdBy || null,
      participantCount: 0,
      createdAt: new Date()
    };
    
    this.habitPrograms.set(id, newProgram);
    return newProgram;
  }

  async updateHabitProgram(id: string, updates: Partial<HabitProgram>): Promise<HabitProgram> {
    const program = this.habitPrograms.get(id);
    if (!program) throw new Error('Habit program not found');
    
    const updated = { ...program, ...updates };
    this.habitPrograms.set(id, updated);
    return updated;
  }

  async enrollInHabitProgram(programId: string, userId: string): Promise<HabitEnrollment> {
    const program = this.habitPrograms.get(programId);
    if (!program) throw new Error('Habit program not found');
    
    // Check if already enrolled
    const existing = Array.from(this.habitEnrollments.values())
      .find(e => e.programId === programId && e.userId === userId);
    if (existing) return existing;
    
    const id = randomUUID();
    const now = new Date();
    const enrollment: HabitEnrollment = {
      id,
      programId,
      userId,
      status: 'active',
      currentDay: 1,
      completedDays: 0,
      streakDays: 0,
      longestStreak: 0,
      progress: 0,
      dailyGoals: program.dailyTasks || [],
      completedGoals: [],
      notes: null,
      startedAt: now,
      completedAt: null,
      lastCheckIn: null
    };
    
    this.habitEnrollments.set(id, enrollment);
    
    // Update program participant count
    program.participantCount++;
    this.habitPrograms.set(programId, program);
    
    return enrollment;
  }

  async getUserHabitEnrollments(userId: string): Promise<(HabitEnrollment & { program: HabitProgram })[]> {
    const enrollments = Array.from(this.habitEnrollments.values())
      .filter(e => e.userId === userId);
    
    return enrollments.map(enrollment => {
      const program = this.habitPrograms.get(enrollment.programId);
      return { ...enrollment, program: program! };
    }).filter(item => item.program);
  }

  async getHabitEnrollment(enrollmentId: string): Promise<HabitEnrollment | undefined> {
    return this.habitEnrollments.get(enrollmentId);
  }

  async updateHabitEnrollment(id: string, updates: Partial<HabitEnrollment>): Promise<HabitEnrollment> {
    const enrollment = this.habitEnrollments.get(id);
    if (!enrollment) throw new Error('Habit enrollment not found');
    
    const updated = { ...enrollment, ...updates };
    this.habitEnrollments.set(id, updated);
    return updated;
  }

  async createHabitCheckIn(checkIn: InsertHabitCheckIn): Promise<HabitCheckIn> {
    const id = randomUUID();
    const now = new Date();
    const newCheckIn: HabitCheckIn = {
      id,
      enrollmentId: checkIn.enrollmentId,
      day: checkIn.day,
      date: now,
      tasksCompleted: checkIn.tasksCompleted || [],
      mood: checkIn.mood || null,
      energy: checkIn.energy || null,
      motivation: checkIn.motivation || null,
      notes: checkIn.notes || null,
      challenges: checkIn.challenges || null,
      wins: checkIn.wins || null,
      isCompleted: checkIn.isCompleted || false,
      createdAt: now
    };
    
    this.habitCheckIns.set(id, newCheckIn);
    
    // Update enrollment progress
    const enrollment = this.habitEnrollments.get(checkIn.enrollmentId);
    if (enrollment && checkIn.isCompleted) {
      enrollment.completedDays++;
      enrollment.currentDay = Math.min(enrollment.currentDay + 1, 30);
      enrollment.progress = Math.round((enrollment.completedDays / 30) * 100);
      enrollment.lastCheckIn = now;
      
      // Update streak
      if (checkIn.isCompleted) {
        enrollment.streakDays++;
        enrollment.longestStreak = Math.max(enrollment.longestStreak, enrollment.streakDays);
      } else {
        enrollment.streakDays = 0;
      }
      
      this.habitEnrollments.set(checkIn.enrollmentId, enrollment);
    }
    
    return newCheckIn;
  }

  async getHabitCheckIns(enrollmentId: string): Promise<HabitCheckIn[]> {
    return Array.from(this.habitCheckIns.values())
      .filter(c => c.enrollmentId === enrollmentId)
      .sort((a, b) => a.day - b.day);
  }

  async getHabitCheckIn(enrollmentId: string, day: number): Promise<HabitCheckIn | undefined> {
    return Array.from(this.habitCheckIns.values())
      .find(c => c.enrollmentId === enrollmentId && c.day === day);
  }

  // ========================================
  // ADMIN & CONTENT MANAGEMENT IMPLEMENTATION
  // ========================================
  async getAdminSettings(category?: string): Promise<AdminSetting[]> {
    let settings = Array.from(this.adminSettings.values());
    if (category) {
      settings = settings.filter(s => s.category === category);
    }
    return settings.sort((a, b) => a.key.localeCompare(b.key));
  }

  async getAdminSetting(key: string): Promise<AdminSetting | undefined> {
    return Array.from(this.adminSettings.values()).find(s => s.key === key);
  }

  async setAdminSetting(setting: InsertAdminSetting): Promise<AdminSetting> {
    // Check if setting exists
    const existing = await this.getAdminSetting(setting.key);
    
    if (existing) {
      const updated = { ...existing, ...setting, updatedAt: new Date() };
      this.adminSettings.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newSetting: AdminSetting = {
        id,
        key: setting.key,
        value: setting.value,
        description: setting.description || null,
        category: setting.category || 'general',
        isPublic: setting.isPublic || false,
        updatedBy: setting.updatedBy || null,
        updatedAt: new Date()
      };
      
      this.adminSettings.set(id, newSetting);
      return newSetting;
    }
  }

  async getContentBlocks(category?: string, published?: boolean): Promise<ContentBlock[]> {
    let blocks = Array.from(this.contentBlocks.values());
    
    if (category) {
      blocks = blocks.filter(b => b.category === category);
    }
    
    if (published !== undefined) {
      blocks = blocks.filter(b => b.isPublished === published);
    }
    
    return blocks.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return a.title.localeCompare(b.title);
    });
  }

  async getContentBlock(slug: string): Promise<ContentBlock | undefined> {
    return Array.from(this.contentBlocks.values()).find(b => b.slug === slug);
  }

  async createContentBlock(block: InsertContentBlock): Promise<ContentBlock> {
    const id = randomUUID();
    const now = new Date();
    const newBlock: ContentBlock = {
      id,
      slug: block.slug,
      title: block.title,
      content: block.content,
      type: block.type || 'markdown',
      category: block.category,
      isPublished: block.isPublished || false,
      sortOrder: block.sortOrder || 0,
      metadata: block.metadata || {},
      createdBy: block.createdBy || null,
      updatedBy: block.updatedBy || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.contentBlocks.set(id, newBlock);
    return newBlock;
  }

  async updateContentBlock(id: string, updates: Partial<ContentBlock>): Promise<ContentBlock> {
    const block = this.contentBlocks.get(id);
    if (!block) throw new Error('Content block not found');
    
    const updated = { ...block, ...updates, updatedAt: new Date() };
    this.contentBlocks.set(id, updated);
    return updated;
  }

  async deleteContentBlock(id: string): Promise<void> {
    this.contentBlocks.delete(id);
  }

  // ========================================
  // INITIALIZATION METHODS FOR NEW SYSTEMS
  // ========================================
  private initializeWellnessCircles() {
    // Create sample wellness circles
    const circles = [
      {
        id: 'wc-anxiety-mindfulness',
        name: 'Anxiety & Mindfulness Circle',
        description: 'A supportive space for those working with anxiety through mindfulness practices.',
        category: 'anxiety',
        facilitatorId: null,
        facilitatorName: 'Sarah T.',
        maxMembers: 12,
        currentMembers: 8,
        meetingFrequency: 'weekly',
        meetingDay: 'wednesday',
        meetingTime: '19:00',
        timezone: 'UTC',
        status: 'active',
        isPublic: true,
        guidelines: 'This is a safe, supportive space. Share authentically and listen with compassion.',
        topics: ['breathing techniques', 'mindful awareness', 'anxiety management', 'group support']
      },
      {
        id: 'wc-sleep-recovery',
        name: 'Sleep & Recovery Circle',
        description: 'Focus on optimizing sleep patterns and recovery for better wellness.',
        category: 'sleep',
        facilitatorId: null,
        facilitatorName: 'Dr. Marcus L.',
        maxMembers: 15,
        currentMembers: 12,
        meetingFrequency: 'bi-weekly',
        meetingDay: 'tuesday',
        meetingTime: '20:00',
        timezone: 'UTC',
        status: 'active',
        isPublic: true,
        guidelines: 'Evidence-based approaches to sleep wellness. Share experiences and insights.',
        topics: ['sleep hygiene', 'recovery techniques', 'circadian rhythms', 'rest optimization']
      }
    ];

    circles.forEach(circle => {
      const wellnessCircle: WellnessCircle = {
        ...circle,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.wellnessCircles.set(circle.id, wellnessCircle);
    });
  }

  private initializeHabitPrograms() {
    // Create sample 30-day habit programs
    const programs = [
      {
        id: 'hp-mindful-mornings',
        name: '30-Day Mindful Morning Routine',
        description: 'Start each day with intention through mindful morning practices.',
        category: 'mindfulness',
        duration: 30,
        difficulty: 'beginner',
        dailyTasks: [
          '5-minute morning meditation',
          'Set 3 daily intentions',
          'Mindful first cup of coffee/tea',
          'Write one gratitude note'
        ],
        rewards: {
          weekly: { points: 100, badge: 'Morning Warrior' },
          completion: { points: 500, badge: 'Mindful Master' }
        },
        icon: 'fas fa-sun',
        color: '#f59e0b',
        isActive: true,
        createdBy: null,
        participantCount: 43
      },
      {
        id: 'hp-evening-reflection',
        name: '30-Day Evening Reflection Practice',
        description: 'End each day with gratitude and reflection for deeper self-awareness.',
        category: 'reflection',
        duration: 30,
        difficulty: 'intermediate',
        dailyTasks: [
          'Journal 3 things learned today',
          '10-minute reflection meditation',
          'Plan tomorrow with intention',
          'Practice loving-kindness'
        ],
        rewards: {
          weekly: { points: 120, badge: 'Reflection Champion' },
          completion: { points: 600, badge: 'Wisdom Keeper' }
        },
        icon: 'fas fa-moon',
        color: '#6366f1',
        isActive: true,
        createdBy: null,
        participantCount: 28
      },
      {
        id: 'hp-body-awareness',
        name: '30-Day Body Awareness Journey',
        description: 'Develop deeper connection with your body through mindful movement.',
        category: 'fitness',
        duration: 30,
        difficulty: 'beginner',
        dailyTasks: [
          '15-minute gentle movement',
          'Body scan meditation',
          'Mindful eating practice',
          'Notice physical sensations'
        ],
        rewards: {
          weekly: { points: 110, badge: 'Body Wise' },
          completion: { points: 550, badge: 'Embodied Soul' }
        },
        icon: 'fas fa-heart',
        color: '#ef4444',
        isActive: true,
        createdBy: null,
        participantCount: 35
      }
    ];

    programs.forEach(program => {
      const habitProgram: HabitProgram = {
        ...program,
        createdAt: new Date()
      };
      this.habitPrograms.set(program.id, habitProgram);
    });
  }

  private initializeAdminSettings() {
    const settings = [
      {
        key: 'app.name',
        value: 'LightPrompt',
        description: 'Application name displayed throughout the UI',
        category: 'ui',
        isPublic: true
      },
      {
        key: 'app.tagline',
        value: 'Soul-Tech Wellness',
        description: 'Main tagline for the application',
        category: 'ui',
        isPublic: true
      },
      {
        key: 'features.wellness_circles.enabled',
        value: true,
        description: 'Enable/disable wellness circles feature',
        category: 'features',
        isPublic: false
      },
      {
        key: 'features.habit_builder.enabled',
        value: true,
        description: 'Enable/disable 30-day habit builder feature',
        category: 'features',
        isPublic: false
      },
      {
        key: 'pricing.premium_bots.enabled',
        value: true,
        description: 'Require premium tier for advanced bots',
        category: 'pricing',
        isPublic: false
      },
      {
        key: 'mobile.optimization.enabled',
        value: true,
        description: 'Enable mobile optimization features',
        category: 'ui',
        isPublic: false
      }
    ];

    settings.forEach((setting, index) => {
      const adminSetting: AdminSetting = {
        id: `setting-${index + 1}`,
        key: setting.key,
        value: setting.value,
        description: setting.description,
        category: setting.category,
        isPublic: setting.isPublic,
        updatedBy: null,
        updatedAt: new Date()
      };
      this.adminSettings.set(adminSetting.id, adminSetting);
    });
  }

  private initializeContentBlocks() {
    const contentBlocks = [
      // Main Website Pages
      {
        slug: 'home',
        title: 'LightPrompt - Soul-Tech Wellness',
        content: '# Welcome to LightPrompt\n\n**Soul-Tech Wellness Platform**\n\nDiscover conscious AI tools for reflection, growth, and connection. AI serves as a mirror to help you connect to your highest self, nature, and others through honest reflection.\n\n## Features\n- Soul Sync - Connection & Goal Sharing\n- Soul Map Navigator - Birth Charts & Personality Analysis\n- Vision Quest - Spiritual Journey Guidance\n- Community - Connect with Others\n\n[Get Started](/dashboard) | [View Store](/store)',
        category: 'pages',
        sortOrder: 1,
        isPublished: true
      },
      {
        slug: 'store',
        title: 'Store - LightPrompt:ed Course & Ebook',
        content: '# LightPrompt Store\n\n## LightPrompt:ed Course\n**Price: $120**\n\nComprehensive course on conscious AI and soul-tech wellness. Transform your relationship with technology and consciousness.\n\n## LightPrompt:ed Ebook\n**Price: $11**\n\nThe essential guide to conscious AI and soul-tech practices.\n\n## Bundle Deal\n**Course + Ebook: $125** *(Save $99)*\n\nGet both the course and ebook together for maximum value.',
        category: 'pages',
        sortOrder: 2,
        isPublished: true
      },
      {
        slug: 'about',
        title: 'About LightPrompt',
        content: '# About LightPrompt\n\nLightPrompt is a privacy-first, soul-tech wellness platform that uses AI as a conscious tool for human reflection and self-connection.\n\n## Our Philosophy\n\nAI serves as a mirror to help humans connect to their highest selves, nature, and each other through honest reflection. We believe in AI as conscious tool for reflection, never AI becoming human.\n\n## Mission\n\nTo provide tools that enhance human consciousness and connection through responsible AI technology.',
        category: 'pages',
        sortOrder: 3,
        isPublished: true
      },
      {
        slug: 'course',
        title: 'LightPrompt:ed Course',
        content: '# LightPrompt:ed Course\n\n**Transform your relationship with AI and consciousness**\n\n**Price: $120**\n\nThis comprehensive course teaches you how to use AI as a conscious reflection tool for personal growth and spiritual development.\n\n## What You\'ll Learn\n- Conscious AI interaction principles\n- Soul-tech wellness practices\n- Personal reflection techniques\n- Community connection methods\n\n[Purchase Course](/checkout?product=course)',
        category: 'pages',
        sortOrder: 4,
        isPublished: true
      },
      {
        slug: 'book',
        title: 'LightPrompt:ed Ebook',
        content: '# LightPrompt:ed Ebook\n\n**The Human Guide to Conscious AI & Soul Tech**\n\n**Price: $11**\n\nEssential reading for anyone interested in the intersection of consciousness, technology, and personal growth.\n\n## Contents\n- Introduction to Soul-Tech\n- Conscious AI Principles\n- Practical Exercises\n- Community Building\n\n[Purchase Ebook](/checkout?product=ebook)',
        category: 'pages',
        sortOrder: 5,
        isPublished: true
      },
      {
        slug: 'products',
        title: 'Products Overview',
        content: '# Our Products\n\n## LightPrompt:ed Course - $120\nComprehensive training on conscious AI and soul-tech wellness.\n\n## LightPrompt:ed Ebook - $11\nEssential guide to conscious AI practices.\n\n## Bundle Deal - $125\nBoth course and ebook together (Save $99!).',
        category: 'pages',
        sortOrder: 6,
        isPublished: true
      },
      {
        slug: 'dashboard',
        title: 'Dashboard Overview',
        content: '# Your LightPrompt Dashboard\n\nWelcome to your personal wellness command center. Here you can track your progress, access AI companions, and manage your soul-tech journey.\n\n## Features\n- Chat with AI companions\n- Track wellness metrics\n- View your progress\n- Access premium features\n- Connect with community',
        category: 'pages',
        sortOrder: 7,
        isPublished: true
      },
      {
        slug: 'privacy',
        title: 'Privacy Policy',
        content: '# Privacy Policy\n\n**Last updated: August 2025**\n\n## Our Commitment\n\nLightPrompt is a privacy-first platform. We collect minimal data and prioritize your privacy and security.\n\n## Data Collection\n- Account information (email, name)\n- Usage analytics (anonymized)\n- Chat conversations (stored locally when possible)\n\n## Data Protection\n- End-to-end encryption for sensitive data\n- No selling of personal information\n- Regular security audits',
        category: 'pages',
        sortOrder: 8,
        isPublished: true
      },
      {
        slug: 'community',
        title: 'Community Guidelines',
        content: '# Community Guidelines\n\n## Welcome to LightPrompt Community\n\nOur community is built on respect, growth, and conscious connection.\n\n## Guidelines\n- Be respectful and kind\n- Share authentic experiences\n- Support others\' growth\n- Maintain privacy boundaries\n- Use AI tools responsibly\n\n## Features\n- Wellness Circles\n- Soul Sync connections\n- Shared experiences\n- Growth support',
        category: 'pages',
        sortOrder: 9,
        isPublished: true
      },
      {
        slug: 'soul-sync',
        title: 'Soul Sync - Connection & Goal Sharing',
        content: '# Soul Sync\n\n**Connection & Goal Sharing**\n\nConnect with others on your wellness journey. Share goals, provide mutual support, and grow together.\n\n## Features\n- Goal sharing and tracking\n- Mutual accountability\n- Progress celebrations\n- Private messaging\n- Group challenges\n\n## How It Works\n1. Set your wellness goals\n2. Connect with compatible souls\n3. Share progress and support each other\n4. Celebrate achievements together',
        category: 'pages',
        sortOrder: 10,
        isPublished: true
      },
      {
        slug: 'woo-woo',
        title: 'Soul Map Navigator - Birth Charts & Analysis',
        content: '# Soul Map Navigator\n\n**Birth Charts & Personality Analysis**\n\nExplore your cosmic blueprint with detailed birth chart analysis and astrological insights.\n\n## Features\n- Complete birth chart generation\n- Personality analysis\n- Current transit tracking\n- Moon phase insights\n- Schumann resonance data\n\n## What You\'ll Discover\n- Your sun, moon, and rising signs\n- Planetary positions and aspects\n- Life purpose and challenges\n- Optimal timing for decisions',
        category: 'pages',
        sortOrder: 11,
        isPublished: true
      },
      {
        slug: 'vision-quest',
        title: 'Vision Quest - Spiritual Journey Guidance',
        content: '# Vision Quest\n\n**Spiritual Journey Guidance**\n\nEmbark on a structured path of self-discovery using AI-guided reflections and modern wisdom practices.\n\n## Journey Stages\n1. **Departure** - Setting intentions\n2. **Initiation** - Deep exploration\n3. **Illumination** - Gaining insights\n4. **Integration** - Applying wisdom\n5. **Return** - Sharing gifts\n\n## Enhanced Features\n- Soul Map integration\n- Personalized practices\n- Progress tracking\n- Community support',
        category: 'pages',
        sortOrder: 12,
        isPublished: true
      },
      {
        slug: 'geoprompt',
        title: 'GeoPrompt - Location-Based Reflections',
        content: '# GeoPrompt\n\n**Location-Based Reflections**\n\nConnect with your environment through location-based mindfulness and reflection practices.\n\n## Features\n- GPS-triggered prompts\n- Location-based insights\n- Environmental awareness\n- Community check-ins\n- Sacred space mapping\n\n## How It Works\nAs you move through your day, receive prompts for reflection based on your location, time, and environmental factors.',
        category: 'pages',
        sortOrder: 13,
        isPublished: true
      },
      {
        slug: 'prism-points',
        title: 'Prism Points - Progress Tracking',
        content: '# Prism Points\n\n**Track Your Soul-Tech Journey**\n\nEarn points and unlock rewards as you progress through your wellness journey.\n\n## Point Categories\n- Daily reflections\n- Goal achievements\n- Community participation\n- Course completion\n- Milestone celebrations\n\n## Rewards System\n- Badges and achievements\n- Exclusive content access\n- Community recognition\n- Premium feature unlocks',
        category: 'pages',
        sortOrder: 14,
        isPublished: true
      },
      {
        slug: 'vibe-match',
        title: 'Vibe Match - Find Soul Connections',
        content: '# Vibe Match\n\n**Find Your Soul Connections**\n\nConnect with like-minded individuals based on compatibility, values, and wellness goals.\n\n## Matching Features\n- Personality compatibility\n- Goal alignment\n- Interest matching\n- Communication style\n- Spiritual orientation\n\n## Privacy & Safety\n- Anonymous browsing\n- Verified profiles\n- Safe communication\n- Report system\n- Block functionality',
        category: 'pages',
        sortOrder: 15,
        isPublished: true
      },
      {
        slug: 'help',
        title: 'Help & Support',
        content: '# Help & Support\n\n**Get the Help You Need**\n\nFind answers to common questions, access resources, and contact our support team.\n\n## Quick Links\n- Getting Started Guide\n- Feature Tutorials\n- Privacy & Security\n- Billing & Subscriptions\n- Technical Support\n\n## Contact Support\nEmail: lightprompt.co@gmail.com\n\nOur team typically responds within 24 hours.',
        category: 'pages',
        sortOrder: 16,
        isPublished: true
      },
      {
        slug: 'blog',
        title: 'LightPrompt Blog',
        content: '# LightPrompt Blog\n\n**Insights on Conscious AI & Wellness**\n\nExplore articles on consciousness, technology, spirituality, and personal growth.\n\n## Featured Topics\n- Conscious AI philosophy\n- Digital wellness practices\n- Astrology and technology\n- Sacred digital spaces\n- Community stories\n\n## Latest Posts\n[Blog posts are managed separately in the blog system]',
        category: 'pages',
        sortOrder: 17,
        isPublished: true
      },
      {
        slug: 'plans',
        title: 'Subscription Plans',
        content: '# Subscription Plans\n\n## Free Tier - $0/month\n- Access to LightPromptBot\n- Basic wellness tracking\n- 10 conversations per day\n- Community access\n\n## Premium Tier - $29/month\n- All free features\n- Unlimited conversations\n- All AI companions\n- Advanced analytics\n- Priority support\n\n## Pro Tier - $49/month\n- All Premium features\n- Partner mode & relationship tools\n- Advanced AI customization\n- Export & backup options\n- Health app integrations',
        category: 'pages',
        sortOrder: 18,
        isPublished: true
      },
      {
        slug: 'challenges',
        title: 'Wellness Challenges',
        content: '# Wellness Challenges\n\n**30-Day Transformation Programs**\n\nJoin structured programs designed to build lasting wellness habits.\n\n## Available Challenges\n- Morning Mindfulness (30 days)\n- Evening Reflection (30 days)\n- Body Awareness (30 days)\n- Gratitude Practice (30 days)\n- Digital Wellness (30 days)\n\n## Challenge Features\n- Daily tasks and prompts\n- Progress tracking\n- Community support\n- Rewards and badges\n- Expert guidance',
        category: 'pages',
        sortOrder: 19,
        isPublished: true
      },
      {
        slug: 'b2b',
        title: 'Business Solutions',
        content: '# LightPrompt for Business\n\n**Conscious AI Solutions for Organizations**\n\nBring soul-tech wellness to your workplace with our enterprise solutions.\n\n## Business Features\n- Team wellness tracking\n- Group challenges\n- Manager insights\n- Custom integrations\n- Training programs\n\n## Contact Us\nReady to transform your workplace wellness?\nEmail: lightprompt.co@gmail.com',
        category: 'pages',
        sortOrder: 20,
        isPublished: true
      },
      // FAQ Content
      {
        slug: 'faq-what-is-lightprompt',
        title: 'What is LightPrompt?',
        content: 'LightPrompt is a privacy-first, soul-tech wellness platform that combines AI-powered conversations with holistic wellness tracking. Our platform helps you develop deeper self-awareness through guided reflection, habit building, and community connection.',
        category: 'faq',
        sortOrder: 1,
        isPublished: true
      },
      {
        slug: 'faq-how-does-ai-work',
        title: 'How do the AI companions work?',
        content: 'Our AI companions are designed with different personalities and specialties to support various aspects of your wellness journey. Each bot uses advanced language models to provide personalized, empathetic responses while maintaining strict privacy standards.',
        category: 'faq',
        sortOrder: 2,
        isPublished: true
      },
      {
        slug: 'faq-data-privacy',
        title: 'How is my data protected?',
        content: 'We prioritize your privacy above all else. Your conversations and wellness data are encrypted, never sold to third parties, and you maintain complete control over what you share and with whom.',
        category: 'faq',
        sortOrder: 3,
        isPublished: true
      },
      
      // Plans & Features Content
      {
        slug: 'plan-free-tier',
        title: 'Free Tier',
        content: '**$0/month**\n\n- Access to LightPromptBot\n- Basic wellness tracking\n- 10 conversations per day\n- Community access\n- Mobile app access\n\n*Perfect for exploring soul-tech wellness*',
        category: 'plans',
        sortOrder: 1,
        isPublished: true
      },
      {
        slug: 'plan-premium-tier',
        title: 'Premium Tier',
        content: '**$29/month**\n\n- All Free features\n- Access to specialized bots (VisionQuest, WooWoo, BodyMirror)\n- Unlimited conversations\n- Advanced analytics\n- Wellness circles access\n- 30-day habit builder\n- Priority support\n\n*For dedicated wellness practitioners*',
        category: 'plans',
        sortOrder: 2,
        isPublished: true
      },
      {
        slug: 'plan-pro-tier',
        title: 'Pro Tier',
        content: '**$49/month**\n\n- All Premium features\n- Partner mode & relationship tools\n- Advanced AI personality customization\n- Export & backup options\n- Integration with health apps\n- Custom wellness programs\n\n*For wellness professionals & couples*',
        category: 'plans',
        sortOrder: 3,
        isPublished: true
      },
      
      // Feature descriptions
      {
        slug: 'feature-ai-companions',
        title: 'AI Wellness Companions',
        content: 'Our specialized AI bots each bring unique perspectives to your wellness journey:\n\n**LightPromptBot** - Your primary wellness guide\n**VisionQuest** - Deep spiritual exploration\n**WooWoo** - Mystical and intuitive insights\n**BodyMirror** - Somatic awareness and body wisdom',
        category: 'features',
        sortOrder: 1,
        isPublished: true
      },
      {
        slug: 'feature-wellness-circles',
        title: 'Wellness Circles',
        content: 'Join small, supportive groups focused on specific wellness topics. Share experiences, learn from others, and grow together in a safe, moderated environment.',
        category: 'features',
        sortOrder: 2,
        isPublished: true
      },
      {
        slug: 'feature-habit-builder',
        title: '30-Day Habit Builder',
        content: 'Structured programs to help you build lasting wellness habits. Each program includes daily tasks, progress tracking, community support, and rewards for consistency.',
        category: 'features',
        sortOrder: 3,
        isPublished: true
      }
    ];

    contentBlocks.forEach((block, index) => {
      const contentBlock: ContentBlock = {
        id: `content-${index + 1}`,
        slug: block.slug,
        title: block.title,
        content: block.content,
        type: 'markdown',
        category: block.category,
        isPublished: block.isPublished,
        sortOrder: block.sortOrder,
        metadata: {},
        createdBy: null,
        updatedBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.contentBlocks.set(contentBlock.id, contentBlock);
    });
  }

  // Soul Map methods
  async getSoulMap(userId: string): Promise<any | undefined> {
    return Array.from(this.soulMaps.values())
      .find(soulMap => soulMap.userId === userId);
  }

  async createSoulMap(soulMapData: any): Promise<any> {
    const id = randomUUID();
    const soulMap = {
      id,
      ...soulMapData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.soulMaps.set(id, soulMap);
    return soulMap;
  }

  // Vision Quest methods
  async getVisionQuest(userId: string): Promise<any | undefined> {
    return Array.from(this.visionQuests.values())
      .find(quest => quest.userId === userId);
  }

  async createVisionQuest(questData: any): Promise<any> {
    const id = randomUUID();
    const quest = {
      id,
      userId: questData.userId,
      status: 'active',
      currentStage: 'departure',
      startedAt: new Date(),
      practices: questData.practices || [],
      progress: questData.progress || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.visionQuests.set(id, quest);
    return quest;
  }
}

import { DatabaseStorage } from "./databaseStorage";
import { SupabaseStorage } from "./supabaseStorage";

// Use SupabaseStorage if Supabase credentials are available, otherwise fallback to DatabaseStorage
export const storage = (() => {
  try {
    // Check if Supabase is configured by testing the connection
    const supabaseUrl = process.env.SUPABASE_URL || "https://oupmelrulhnbaojpgugs.supabase.co";
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91cG1lbHJ1bGhuYmFvanBndWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3Nzc5MTEsImV4cCI6MjA2NjM1MzkxMX0.Zr3X1hhsgp2dKznyJd0R1rVfragHGZRnH3ZYHad_Lhs";
    
    if (supabaseUrl && supabaseKey) {
      console.log('🔄 Initializing Supabase storage...');
      return new SupabaseStorage();
    } else {
      console.log('🔄 Initializing Database storage...');
      return new DatabaseStorage();
    }
  } catch (error) {
    console.warn('⚠️ Failed to initialize Supabase storage, falling back to DatabaseStorage:', error);
    return new DatabaseStorage();
  }
})();
