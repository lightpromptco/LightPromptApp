import { 
  User, InsertUser, ChatSession, InsertChatSession, 
  Message, InsertMessage, UserProfile, InsertUserProfile,
  AccessCode, InsertAccessCode, WellnessMetric, InsertWellnessMetric,
  Habit, InsertHabit, HabitEntry, InsertHabitEntry,
  AppleHealthData, InsertAppleHealthData, HomeKitData, InsertHomeKitData,
  WellnessPattern, Recommendation, InsertRecommendation,
  FitnessData, InsertFitnessData, DeviceIntegration, InsertDeviceIntegration
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();
  private messages: Map<string, Message> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private accessCodes: Map<string, AccessCode> = new Map();
  private wellnessMetrics: Map<string, WellnessMetric> = new Map();
  private habits: Map<string, Habit> = new Map();
  private habitEntries: Map<string, HabitEntry> = new Map();
  private appleHealthData: Map<string, AppleHealthData> = new Map();
  private homeKitData: Map<string, HomeKitData> = new Map();
  private wellnessPatterns: Map<string, WellnessPattern> = new Map();
  private recommendations: Map<string, Recommendation> = new Map();
  private fitnessData: Map<string, FitnessData> = new Map();
  private deviceIntegrations: Map<string, DeviceIntegration> = new Map();

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
      currentMood: insertProfile.currentMood || null,
      moodDescription: insertProfile.moodDescription || null,
      preferences: insertProfile.preferences || {},
      badges: insertProfile.badges || null,
      evolutionScore: insertProfile.evolutionScore || null,
      privacySettings: insertProfile.privacySettings || {},
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
}

export const storage = new MemStorage();
