import { 
  User, InsertUser, ChatSession, InsertChatSession, 
  Message, InsertMessage, UserProfile, InsertUserProfile,
  AccessCode, InsertAccessCode, WellnessMetric, InsertWellnessMetric,
  Habit, InsertHabit, HabitEntry, InsertHabitEntry,
  AppleHealthData, InsertAppleHealthData, HomeKitData, InsertHomeKitData,
  WellnessPattern, Recommendation, InsertRecommendation,
  FitnessData, InsertFitnessData, DeviceIntegration, InsertDeviceIntegration,
  VibeProfile, InsertVibeProfile, VibeMatch, InsertVibeMatch,
  MatchChat, InsertMatchChat, ReflectionPrompt, InsertReflectionPrompt,
  ChatSafetyLog, InsertChatSafetyLog, PrismPoint, InsertPrismPoint,
  PartnerConnection, InsertPartnerConnection, UserPreferences, InsertUserPreferences,
  Challenge, InsertChallenge, ChallengeParticipant, InsertChallengeParticipant,
  ChallengeProgress, InsertChallengeProgress, RewardDefinition, InsertRewardDefinition,
  UserReward, InsertUserReward, UserStats, InsertUserStats,
  WellnessCircle, InsertWellnessCircle, CircleMember, InsertCircleMember,
  CircleActivity, InsertCircleActivity, HabitProgram, InsertHabitProgram,
  HabitEnrollment, InsertHabitEnrollment, HabitCheckIn, InsertHabitCheckIn,
  AdminSetting, InsertAdminSetting, ContentBlock, InsertContentBlock
} from "@shared/schema";
import { IStorage } from "./storage";
import {
  createSupabaseUser,
  getSupabaseUser,
  updateSupabaseUser,
  validateUserTier,
  createSupabaseSession,
  getSupabaseUserSessions,
  createSupabaseMessage,
  getSupabaseSessionMessages,
  createAdminUser,
  supabase
} from "./supabase";

export class SupabaseStorage implements IStorage {
  
  // Users
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await getSupabaseUser(id);
      return user ? this.formatUser(user) : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? this.formatUser(data) : undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const supabaseUser = await createSupabaseUser({
        email: user.email,
        name: user.name,
        tier: user.tier || 'free',
        role: user.role || 'user'
      });
      return this.formatUser(supabaseUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const supabaseUpdates = this.formatUserForSupabase(updates);
      const updatedUser = await updateSupabaseUser(id, supabaseUpdates);
      return this.formatUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Chat Sessions
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? this.formatChatSession(data) : undefined;
    } catch (error) {
      console.error('Error getting chat session:', error);
      return undefined;
    }
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const sessions = await getSupabaseUserSessions(userId);
      return sessions.map(session => this.formatChatSession(session));
    } catch (error) {
      console.error('Error getting user chat sessions:', error);
      return [];
    }
  }

  async getBotChatSessions(userId: string, botId: string): Promise<ChatSession[]> {
    try {
      const sessions = await getSupabaseUserSessions(userId, botId);
      return sessions.map(session => this.formatChatSession(session));
    } catch (error) {
      console.error('Error getting bot chat sessions:', error);
      return [];
    }
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    try {
      const supabaseSession = await createSupabaseSession({
        userId: session.userId,
        botId: session.botId,
        title: session.title
      });
      return this.formatChatSession(supabaseSession);
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    try {
      const supabaseUpdates = this.formatChatSessionForSupabase(updates);
      const { data, error } = await supabase
        .from('chat_sessions')
        .update(supabaseUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return this.formatChatSession(data);
    } catch (error) {
      console.error('Error updating chat session:', error);
      throw error;
    }
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? this.formatMessage(data) : undefined;
    } catch (error) {
      console.error('Error getting message:', error);
      return undefined;
    }
  }

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    try {
      const messages = await getSupabaseSessionMessages(sessionId);
      return messages.map(message => this.formatMessage(message));
    } catch (error) {
      console.error('Error getting session messages:', error);
      return [];
    }
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    try {
      const supabaseMessage = await createSupabaseMessage({
        sessionId: message.sessionId,
        role: message.role,
        content: message.content,
        sentiment: message.sentiment,
        sentimentScore: message.sentimentScore,
        audioUrl: message.audioUrl,
        metadata: message.metadata
      });
      return this.formatMessage(supabaseMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  // User Profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? this.formatUserProfile(data) : undefined;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return undefined;
    }
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([this.formatUserProfileForSupabase(profile)])
        .select()
        .single();

      if (error) throw error;
      return this.formatUserProfile(data);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const supabaseUpdates = this.formatUserProfileForSupabase(updates);
      const { data, error } = await supabase
        .from('user_profiles')
        .update(supabaseUpdates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return this.formatUserProfile(data);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Token usage
  async incrementTokenUsage(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          tokens_used: supabase.rpc('increment_tokens', { user_id: userId })
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing token usage:', error);
      throw error;
    }
  }

  async resetTokenUsage(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          tokens_used: 0,
          reset_date: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error resetting token usage:', error);
      throw error;
    }
  }

  async upgradeTier(userId: string, planId: string): Promise<User> {
    try {
      const tierMap: Record<string, { tier: string; tokenLimit: number }> = {
        'growth': { tier: 'growth', tokenLimit: 1000 },
        'resonance': { tier: 'resonance', tokenLimit: 2500 },
        'enterprise': { tier: 'enterprise', tokenLimit: 10000 }
      };

      const plan = tierMap[planId];
      if (!plan) throw new Error(`Invalid plan ID: ${planId}`);

      const updatedUser = await updateSupabaseUser(userId, {
        tier: plan.tier,
        token_limit: plan.tokenLimit
      });

      return this.formatUser(updatedUser);
    } catch (error) {
      console.error('Error upgrading tier:', error);
      throw error;
    }
  }

  // Helper methods to format data between Supabase and app schemas
  private formatUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.name,
      avatarUrl: supabaseUser.avatar_url,
      tier: supabaseUser.tier,
      role: supabaseUser.role,
      tokensUsed: supabaseUser.tokens_used,
      tokenLimit: supabaseUser.token_limit,
      resetDate: new Date(supabaseUser.reset_date),
      courseAccess: supabaseUser.course_access,
      courseAccessDate: supabaseUser.course_access_date ? new Date(supabaseUser.course_access_date) : undefined,
      createdAt: new Date(supabaseUser.created_at)
    };
  }

  private formatUserForSupabase(user: Partial<User>): any {
    return {
      email: user.email,
      name: user.name,
      avatar_url: user.avatarUrl,
      tier: user.tier,
      role: user.role,
      tokens_used: user.tokensUsed,
      token_limit: user.tokenLimit,
      reset_date: user.resetDate?.toISOString(),
      course_access: user.courseAccess,
      course_access_date: user.courseAccessDate?.toISOString()
    };
  }

  private formatChatSession(supabaseSession: any): ChatSession {
    return {
      id: supabaseSession.id,
      userId: supabaseSession.user_id,
      botId: supabaseSession.bot_id,
      title: supabaseSession.title,
      createdAt: new Date(supabaseSession.created_at),
      updatedAt: new Date(supabaseSession.updated_at)
    };
  }

  private formatChatSessionForSupabase(session: Partial<ChatSession>): any {
    return {
      user_id: session.userId,
      bot_id: session.botId,
      title: session.title,
      updated_at: new Date().toISOString()
    };
  }

  private formatMessage(supabaseMessage: any): Message {
    return {
      id: supabaseMessage.id,
      sessionId: supabaseMessage.session_id,
      role: supabaseMessage.role,
      content: supabaseMessage.content,
      audioUrl: supabaseMessage.audio_url,
      sentiment: supabaseMessage.sentiment,
      sentimentScore: supabaseMessage.sentiment_score,
      metadata: supabaseMessage.metadata,
      createdAt: new Date(supabaseMessage.created_at)
    };
  }

  private formatUserProfile(supabaseProfile: any): UserProfile {
    return {
      userId: supabaseProfile.user_id,
      currentMood: supabaseProfile.current_mood,
      moodDescription: supabaseProfile.mood_description,
      preferences: supabaseProfile.preferences,
      badges: supabaseProfile.badges,
      evolutionScore: supabaseProfile.evolution_score,
      privacySettings: supabaseProfile.privacy_settings,
      updatedAt: new Date(supabaseProfile.updated_at)
    };
  }

  private formatUserProfileForSupabase(profile: Partial<UserProfile>): any {
    return {
      user_id: profile.userId,
      current_mood: profile.currentMood,
      mood_description: profile.moodDescription,
      preferences: profile.preferences,
      badges: profile.badges,
      evolution_score: profile.evolutionScore,
      privacy_settings: profile.privacySettings,
      updated_at: new Date().toISOString()
    };
  }

  // Stub implementations for other methods (these would be implemented similarly)
  async getAccessCode(code: string): Promise<AccessCode | undefined> {
    // TODO: Implement with Supabase
    return undefined;
  }

  async createAccessCode(accessCode: InsertAccessCode): Promise<AccessCode> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async redeemAccessCode(code: string, userId: string): Promise<AccessCode> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getWellnessMetrics(userId: string, days?: number): Promise<WellnessMetric[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createWellnessMetric(metric: InsertWellnessMetric): Promise<WellnessMetric> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateWellnessMetric(id: string, updates: Partial<WellnessMetric>): Promise<WellnessMetric> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getUserHabits(userId: string): Promise<Habit[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async deleteHabit(id: string): Promise<void> {
    // TODO: Implement with Supabase
  }

  async getHabitEntries(habitId: string, days?: number): Promise<HabitEntry[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateHabitEntry(id: string, updates: Partial<HabitEntry>): Promise<HabitEntry> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getAppleHealthData(userId: string, days?: number): Promise<AppleHealthData[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async syncAppleHealthData(data: InsertAppleHealthData): Promise<AppleHealthData> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getHomeKitData(userId: string, days?: number): Promise<HomeKitData[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async syncHomeKitData(data: InsertHomeKitData): Promise<HomeKitData> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getWellnessPatterns(userId: string): Promise<WellnessPattern[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async detectPatterns(userId: string): Promise<WellnessPattern[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async getRecommendations(userId: string, limit?: number): Promise<Recommendation[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateRecommendation(id: string, updates: Partial<Recommendation>): Promise<Recommendation> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async generateRecommendations(userId: string): Promise<Recommendation[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async getFitnessData(userId: string, days?: number): Promise<FitnessData[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createFitnessData(fitnessData: InsertFitnessData): Promise<FitnessData> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getLatestFitnessData(userId: string): Promise<FitnessData | null> {
    // TODO: Implement with Supabase
    return null;
  }

  async getDeviceIntegrations(userId: string): Promise<DeviceIntegration[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createDeviceIntegration(integration: InsertDeviceIntegration): Promise<DeviceIntegration> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateDeviceIntegration(id: string, updates: Partial<DeviceIntegration>): Promise<DeviceIntegration> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getVibeProfiles(userId: string): Promise<VibeProfile[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createVibeProfile(profile: InsertVibeProfile): Promise<VibeProfile> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateVibeProfile(id: string, updates: Partial<VibeProfile>): Promise<VibeProfile> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async findVibeMatches(userId: string): Promise<VibeMatch[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createVibeMatch(match: InsertVibeMatch): Promise<VibeMatch> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getMatchChats(userId: string): Promise<MatchChat[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createMatchChat(chat: InsertMatchChat): Promise<MatchChat> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getReflectionPrompts(category?: string): Promise<ReflectionPrompt[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createReflectionPrompt(prompt: InsertReflectionPrompt): Promise<ReflectionPrompt> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async logChatSafety(log: InsertChatSafetyLog): Promise<ChatSafetyLog> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getPrismPoints(userId: string): Promise<PrismPoint[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createPrismPoint(point: InsertPrismPoint): Promise<PrismPoint> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getPartnerConnections(userId: string): Promise<PartnerConnection[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createPartnerConnection(connection: InsertPartnerConnection): Promise<PartnerConnection> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    // TODO: Implement with Supabase
    return undefined;
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  // Challenge system
  async getChallenges(): Promise<Challenge[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async getUserChallenges(userId: string): Promise<any[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async joinChallenge(userId: string, challengeId: string): Promise<ChallengeParticipant> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateChallengeProgress(participantId: string, progress: InsertChallengeProgress): Promise<ChallengeProgress> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    // TODO: Implement with Supabase
    return undefined;
  }

  // Wellness Circles
  async getWellnessCircles(userId: string): Promise<WellnessCircle[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createWellnessCircle(circle: InsertWellnessCircle): Promise<WellnessCircle> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async joinWellnessCircle(circleId: string, userId: string): Promise<CircleMember> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getCircleMembers(circleId: string): Promise<CircleMember[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async logCircleActivity(activity: InsertCircleActivity): Promise<CircleActivity> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  // Habit Programs
  async getHabitPrograms(): Promise<HabitProgram[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async enrollInHabitProgram(enrollment: InsertHabitEnrollment): Promise<HabitEnrollment> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getUserHabitEnrollments(userId: string): Promise<HabitEnrollment[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createHabitCheckIn(checkIn: InsertHabitCheckIn): Promise<HabitCheckIn> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  // Admin
  async getAdminSettings(): Promise<AdminSetting[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async updateAdminSetting(key: string, value: any): Promise<AdminSetting> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async getContentBlocks(section?: string): Promise<ContentBlock[]> {
    // TODO: Implement with Supabase
    return [];
  }

  async createContentBlock(content: InsertContentBlock): Promise<ContentBlock> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  async updateContentBlock(id: string, updates: Partial<ContentBlock>): Promise<ContentBlock> {
    // TODO: Implement with Supabase
    throw new Error('Not implemented');
  }

  // Create admin account
  async createAdminAccount(email: string, name: string): Promise<User> {
    try {
      const adminUser = await createAdminUser({ email, name });
      return this.formatUser(adminUser);
    } catch (error) {
      console.error('Error creating admin account:', error);
      throw error;
    }
  }
}