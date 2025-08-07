import { createClient } from '@supabase/supabase-js';
import { 
  User, InsertUser, ChatSession, InsertChatSession, 
  Message, InsertMessage, UserProfile, InsertUserProfile 
} from "@shared/schema";
import { IStorage } from "./storage";

const supabaseUrl = 'https://oupmelrulhnbaojpgugs.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorage implements IStorage {
  
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = {
      ...user,
      tier: 'free',
      tokens_used: 0,
      token_limit: 10,
      reset_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create user: ${error?.message}`);
    }

    // Create default profile
    await this.createUserProfile({ userId: data.id });
    
    return data as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update user: ${error?.message}`);
    }

    return data as User;
  }

  // Chat Sessions
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as ChatSession;
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) return [];
    return data as ChatSession[];
  }

  async getBotChatSessions(userId: string, botId: string): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('bot_id', botId)
      .order('updated_at', { ascending: false });

    if (error) return [];
    return data as ChatSession[];
  }

  async createChatSession(session: InsertChatSession): Promise<ChatSession> {
    const newSession = {
      ...session,
      user_id: session.userId,
      bot_id: session.botId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(newSession)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create session: ${error?.message}`);
    }

    return data as ChatSession;
  }

  async updateChatSession(id: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update session: ${error?.message}`);
    }

    return data as ChatSession;
  }

  // Messages
  async getMessage(id: string): Promise<Message | undefined> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Message;
  }

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) return [];
    return data as Message[];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage = {
      ...message,
      session_id: message.sessionId,
      audio_url: message.audioUrl,
      sentiment_score: message.sentimentScore,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(newMessage)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create message: ${error?.message}`);
    }

    return data as Message;
  }

  // User Profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as UserProfile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const newProfile = {
      user_id: profile.userId,
      current_mood: profile.currentMood || 'neutral',
      mood_description: profile.moodDescription || null,
      preferences: profile.preferences || {},
      badges: profile.badges || [],
      evolution_score: profile.evolutionScore || 0,
      privacy_settings: profile.privacySettings || {},
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .insert(newProfile)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create profile: ${error?.message}`);
    }

    return data as UserProfile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const updateData: any = { ...updates, updated_at: new Date().toISOString() };
    
    // Handle privacy settings mapping
    if (updates.privacySettings) {
      updateData.privacy_settings = updates.privacySettings;
      delete updateData.privacySettings;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update profile: ${error?.message}`);
    }

    return data as UserProfile;
  }

  // Usage tracking
  async incrementTokenUsage(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('User not found');

    // Reset if it's a new day
    const now = new Date();
    const resetDate = new Date(user.resetDate);
    if (now.getDate() !== resetDate.getDate()) {
      await this.resetTokenUsage(userId);
      return;
    }

    await this.updateUser(userId, { tokensUsed: user.tokensUsed + 1 });
  }

  async resetTokenUsage(userId: string): Promise<void> {
    await this.updateUser(userId, { 
      tokensUsed: 0, 
      resetDate: new Date() 
    });
  }
}

export const storage = new SupabaseStorage();