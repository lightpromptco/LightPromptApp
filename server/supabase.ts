import { createClient } from '@supabase/supabase-js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for Supabase connection');
}

// Parse the DATABASE_URL to get Supabase project details
const dbUrl = new URL(process.env.DATABASE_URL);
const supabaseUrl = `https://${dbUrl.hostname.split('.')[0]}.supabase.co`;
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

// Helper functions for user management
export async function createSupabaseUser(userData: {
  email: string;
  name: string;
  tier?: string;
  role?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      email: userData.email,
      name: userData.name,
      tier: userData.tier || 'free',
      role: userData.role || 'user',
      tokens_used: 0,
      token_limit: 10,
      reset_date: new Date().toISOString(),
      course_access: false,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase user creation error:', error);
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
}

export async function getSupabaseUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Supabase user fetch error:', error);
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
}

export async function updateSupabaseUser(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Supabase user update error:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
}

export async function validateUserTier(userId: string, requiredTier: string): Promise<boolean> {
  const user = await getSupabaseUser(userId);
  if (!user) return false;

  const tierHierarchy = ['free', 'growth', 'resonance', 'enterprise', 'admin'];
  const userTierIndex = tierHierarchy.indexOf(user.tier);
  const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

  return userTierIndex >= requiredTierIndex;
}

// Session management
export async function createSupabaseSession(sessionData: {
  userId: string;
  botId: string;
  title?: string;
}) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{
      user_id: sessionData.userId,
      bot_id: sessionData.botId,
      title: sessionData.title || `Chat with ${sessionData.botId}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase session creation error:', error);
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return data;
}

export async function getSupabaseUserSessions(userId: string, botId?: string) {
  let query = supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (botId) {
    query = query.eq('bot_id', botId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase sessions fetch error:', error);
    throw new Error(`Failed to fetch sessions: ${error.message}`);
  }

  return data || [];
}

// Message management
export async function createSupabaseMessage(messageData: {
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  sentiment?: string;
  sentimentScore?: number;
  audioUrl?: string;
  metadata?: any;
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      session_id: messageData.sessionId,
      role: messageData.role,
      content: messageData.content,
      sentiment: messageData.sentiment,
      sentiment_score: messageData.sentimentScore,
      audio_url: messageData.audioUrl,
      metadata: messageData.metadata,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase message creation error:', error);
    throw new Error(`Failed to create message: ${error.message}`);
  }

  return data;
}

export async function getSupabaseSessionMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase messages fetch error:', error);
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return data || [];
}

// Admin functions
export async function createAdminUser(adminData: {
  email: string;
  name: string;
}) {
  return await createSupabaseUser({
    ...adminData,
    tier: 'admin',
    role: 'admin'
  });
}