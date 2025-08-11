import { Router } from "express";
import { storage } from "../storage.js";

const router = Router();

// Create a properly typed supabase instance
const supabase = (storage as any).supabase;

// Middleware to ensure admin access
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const userEmail = req.headers['user-email'];
    if (userEmail !== 'lightprompt.co@gmail.com') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Admin access required' });
  }
};

// Get admin statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // Get total users count
    const { data: usersData, count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: activeUsersData, count: activeUsers } = await supabase
      .from('sessions')
      .select('user_id', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    // Get course users
    const { data: courseUsersData, count: courseUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('course_access', true);

    // Get Soul Sync users
    const { data: soulSyncData, count: soulSyncUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('soul_sync_enabled', true);

    // Get messages from last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const { data: messagesData, count: messagesLastDay } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneDayAgo.toISOString());

    const stats = {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      courseUsers: courseUsers || 0,
      soulSyncUsers: soulSyncUsers || 0,
      messagesLastDay: messagesLastDay || 0,
      systemHealth: 'good' as const,
      uptime: '99.9%'
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all users for admin management
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        created_at,
        course_access,
        tier,
        user_profiles (
          soul_sync_enabled,
          updated_at
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    const formattedUsers = users?.map((user: any) => ({
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
      lastActive: user.user_profiles?.[0]?.updated_at || user.created_at,
      courseAccess: user.course_access || false,
      soulSyncEnabled: user.user_profiles?.[0]?.soul_sync_enabled || false,
      tier: user.course_access ? 'Premium' : 'Free'
    })) || [];

    res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get system health status
router.get('/health', requireAdmin, async (req, res) => {
  try {
    // Check database connection
    const { data: dbTest, error: dbError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    // Check OpenAI (if API key exists)
    const openaiHealthy = !!process.env.OPENAI_API_KEY;

    // Simple health checks
    const healthStatus = {
      status: dbError ? 'critical' : 'good',
      database: !dbError,
      api: true,
      openai: openaiHealthy,
      astrology: true, // Swiss Ephemeris is local
      timestamp: new Date().toISOString()
    };

    res.json(healthStatus);
  } catch (error) {
    console.error('Error checking system health:', error);
    res.json({
      status: 'critical',
      database: false,
      api: false,
      openai: false,
      astrology: true,
      timestamp: new Date().toISOString()
    });
  }
});

// Get recent activity
router.get('/activity', requireAdmin, async (req, res) => {
  try {
    // Get recent user registrations
    const { data: recentUsers } = await supabase
      .from('users')
      .select('email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent messages
    const { data: recentMessages } = await supabase
      .from('messages')
      .select('created_at, role')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent Soul Sync activities
    const { data: recentSoulSync } = await supabase
      .from('user_profiles')
      .select('updated_at, soul_sync_enabled')
      .eq('soul_sync_enabled', true)
      .order('updated_at', { ascending: false })
      .limit(5);

    const activities = [
      ...(recentUsers?.map((user: any) => ({
        type: 'user_registration',
        description: `New user: ${user.email}`,
        timestamp: user.created_at
      })) || []),
      ...(recentMessages?.map((msg: any) => ({
        type: 'chat_message',
        description: `New ${msg.role} message`,
        timestamp: msg.created_at
      })) || []),
      ...(recentSoulSync?.map((sync: any) => ({
        type: 'soul_sync',
        description: 'Soul Sync connection',
        timestamp: sync.updated_at
      })) || [])
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Update user permissions
router.patch('/users/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseAccess, tier } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({
        course_access: courseAccess,
        tier: tier
      })
      .eq('id', userId)
      .select();

    if (error) {
      throw error;
    }

    res.json({ success: true, user: data?.[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export { router as adminRoutes };