import { createClient } from '@supabase/supabase-js';

// Check if we have Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabaseClient;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase URL and key not found in environment variables.');
  
  // Try to extract Supabase URL from DATABASE_URL if it's a Supabase connection
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase')) {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const extractedUrl = `https://${dbUrl.hostname.split('.')[0]}.supabase.co`;
    const extractedKey = process.env.SUPABASE_ANON_KEY || '';
    
    if (!extractedKey) {
      throw new Error('SUPABASE_ANON_KEY is required when using Supabase DATABASE_URL');
    }
    
    supabaseClient = createClient(extractedUrl, extractedKey, {
      auth: { persistSession: false }
    });
    console.log('✅ Using Supabase connection extracted from DATABASE_URL');
  } else {
    // For development, we'll create a mock client that throws helpful errors
    console.warn('⚠️ No Supabase configuration found. Please provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    supabaseClient = {
      from: () => {
        throw new Error('Supabase not configured. Please provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
      }
    } as any;
  }
} else {
  supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  });
  console.log('✅ Using Supabase connection from environment variables');
}

export const supabase = supabaseClient;

// Helper functions for user management
export async function createSupabaseUser(userData: {
  email: string;
  name: string;
  tier?: string;
  role?: string;
}) {
  // First, test what columns exist in the users table
  try {
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('*')
      .limit(0); // Just get schema, no data
    
    if (testError) {
      console.error('❌ Database connection test failed:', testError);
      throw new Error(`Database not accessible: ${testError.message}`);
    }
    
    console.log('✅ Database connection successful');
  } catch (error: any) {
    console.error('❌ Database connection error:', error);
    throw error;
  }

  // Try creating user with minimal required fields first
  const insertData: any = {
    email: userData.email,
    name: userData.name,
    tier: userData.tier || 'free',
    role: userData.role || 'user',
    tokens_used: 0,
    token_limit: userData.role === 'admin' ? 999999 : 10
  };

  // Only add optional fields if they exist in schema
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('First insert attempt failed:', error);
      
      // Try with course_access if the first attempt failed
      insertData.course_access = userData.role === 'admin';
      
      const { data: retryData, error: retryError } = await supabase
        .from('users')
        .insert([insertData])
        .select()
        .single();
        
      if (retryError) {
        throw retryError;
      }
      
      console.log('✅ User created successfully on retry:', retryData.email);
      return retryData;
    }

    console.log('✅ User created successfully:', data.email);
    return data;
  } catch (finalError: any) {
    console.error('All insert attempts failed. Final error:', finalError);
    throw finalError;
  }

  if (error) {
    console.error('Supabase user creation error:', error);
    throw new Error(`Failed to create user: ${error.message}`);
  }

  console.log('✅ User created successfully:', data.email);
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
  // Filter out any potentially problematic columns
  const safeUpdates = { ...updates };
  
  // Try update with all fields first
  let { data, error } = await supabase
    .from('users')
    .update(safeUpdates)
    .eq('id', userId)
    .select()
    .single();

  // If course_access field fails, try without it
  if (error && error.message.includes('course_access')) {
    console.log('⚠️ Retrying update without course_access field');
    delete safeUpdates.course_access;
    
    const { data: retryData, error: retryError } = await supabase
      .from('users')
      .update(safeUpdates)
      .eq('id', userId)
      .select()
      .single();
      
    if (retryError) {
      console.error('Supabase user update error:', retryError);
      throw new Error(`Failed to update user: ${retryError.message}`);
    }
    
    console.log('✅ User updated successfully (without course_access)');
    return retryData;
  }

  if (error) {
    console.error('Supabase user update error:', error);
    throw new Error(`Failed to update user: ${error.message}`);
  }

  console.log('✅ User updated successfully');
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
  // Start with minimal required fields only
  const insertData: any = {
    session_id: messageData.sessionId,
    role: messageData.role,
    content: messageData.content
  };

  console.log('Creating message with data:', insertData);

  const { data, error } = await supabase
    .from('messages')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('Supabase message creation error:', error);
    throw new Error(`Failed to create message: ${error.message}`);
  }

  console.log('Message created successfully:', data.id);
  return data;
}

export async function getSupabaseSessionMessages(sessionId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('id', { ascending: true }); // Use id instead of created_at for ordering

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