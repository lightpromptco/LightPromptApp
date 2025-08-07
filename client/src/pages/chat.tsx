import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserProfile, ChatSession } from '@shared/schema';
import { BOTS, Bot, getBotById } from '@/lib/bots';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ChatInterface } from '@/components/ChatInterface';
import { UsageWarning } from '@/components/UsageWarning';
import { useCircadian } from '@/hooks/useCircadian';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeBot, setActiveBot] = useState<Bot>(BOTS[0]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [sessionValidated, setSessionValidated] = useState(false);
  const [lastUsageCheck, setLastUsageCheck] = useState(0);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Initialize circadian theming
  useCircadian();

  // Create or get user on mount and validate session
  useEffect(() => {
    initializeUser();
    
    // Set up session validation interval
    const sessionInterval = setInterval(() => {
      validateSession();
    }, 60000); // Check every minute

    // Set up usage monitoring
    const usageInterval = setInterval(() => {
      if (currentUser) {
        checkUsageUpdates();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(sessionInterval);
      clearInterval(usageInterval);
    };
  }, []);

  // Monitor user changes for session validation
  useEffect(() => {
    if (currentUser && !sessionValidated) {
      validateSession();
    }
  }, [currentUser]);

  // Load session when bot changes
  useEffect(() => {
    if (currentUser && activeBot) {
      loadOrCreateSession();
    }
  }, [currentUser, activeBot]);

  const initializeUser = async () => {
    try {
      // Try to get user from localStorage first
      const storedUserId = localStorage.getItem('lightprompt_user_id');
      let user: User | null = null;

      if (storedUserId) {
        const response = await fetch(`/api/users/${storedUserId}`);
        if (response.ok) {
          user = await response.json();
          console.log('✅ Session restored for user:', user?.name);
        } else {
          console.log('❌ Stored user session invalid, clearing...');
          localStorage.removeItem('lightprompt_user_id');
        }
      }

      // Create new user if none exists
      if (!user) {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `user_${Date.now()}@lightprompt.com`,
            name: `User ${Math.floor(Math.random() * 1000)}`,
          }),
        });

        if (response.ok) {
          user = await response.json();
          if (user) {
            localStorage.setItem('lightprompt_user_id', user.id);
            console.log('✅ New user session created:', user?.name);
            toast({
              title: "Welcome to LightPrompt!",
              description: "Your session has been created. Chat data will persist across visits.",
            });
          }
        }
      }

      setCurrentUser(user);
      setLastUsageCheck(user?.tokensUsed || 0);
    } catch (error) {
      console.error('Failed to initialize user:', error);
      toast({
        title: "Initialization failed",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      });
    }
  };

  const loadOrCreateSession = async () => {
    if (!currentUser) return;

    try {
      // Get existing sessions for this bot
      const response = await fetch(`/api/users/${currentUser.id}/sessions/${activeBot.id}`);
      if (response.ok) {
        const sessions = await response.json();
        if (sessions.length > 0) {
          setCurrentSession(sessions[0]); // Use most recent session
          return;
        }
      }

      // No session exists yet
      setCurrentSession(null);
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const createSessionMutation = useMutation({
    mutationFn: async (botId: string): Promise<ChatSession> => {
      if (!currentUser) throw new Error('No user');

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          botId,
          title: `Chat with ${getBotById(botId)?.name}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');
      return response.json();
    },
    onSuccess: (session) => {
      setCurrentSession(session);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });

  // User profile query
  const { data: userProfile } = useQuery<UserProfile | null>({
    queryKey: ['/api/users', currentUser?.id, 'profile'],
    enabled: !!currentUser,
  });

  const handleBotChange = (bot: Bot) => {
    setActiveBot(bot);
    setCurrentSession(null); // Reset session when changing bots
  };

  const handleAvatarUpdate = (url: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, avatarUrl: url });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUser.id] });
    }
  };

  // Session validation to ensure user data is fresh
  const validateSession = useCallback(async () => {
    const storedUserId = localStorage.getItem('lightprompt_user_id');
    if (!storedUserId || !currentUser) return;

    try {
      const response = await fetch(`/api/users/${storedUserId}`);
      if (response.ok) {
        const freshUser = await response.json();
        // Update user data if it has changed
        if (JSON.stringify(currentUser) !== JSON.stringify(freshUser)) {
          setCurrentUser(freshUser);
          console.log('🔄 Session refreshed with updated user data');
        }
        setSessionValidated(true);
      } else {
        console.log('❌ Session validation failed, re-initializing...');
        localStorage.removeItem('lightprompt_user_id');
        setCurrentUser(null);
        initializeUser();
      }
    } catch (error) {
      console.error('Session validation error:', error);
    }
  }, [currentUser]);

  // Check for usage updates and show warnings
  const checkUsageUpdates = useCallback(async () => {
    if (!currentUser) return;

    // If usage has increased since last check, refresh user data
    if (currentUser.tokensUsed > lastUsageCheck) {
      validateSession();
      setLastUsageCheck(currentUser.tokensUsed);
    }
  }, [currentUser, lastUsageCheck, validateSession]);

  const handleLogout = () => {
    console.log('👋 User logging out, but will auto-create new session');
    setCurrentUser(null);
    setCurrentSession(null);
    setSessionValidated(false);
    localStorage.removeItem('lightprompt_user_id');
    
    toast({
      title: "Logged out",
      description: "A new anonymous session will be created automatically.",
    });

    // The app will reinitialize a new user automatically
    setTimeout(() => {
      initializeUser();
    }, 100);
  };

  const handleCreateSession = async (botId: string): Promise<ChatSession> => {
    return createSessionMutation.mutateAsync(botId);
  };

  const toggleEmbedMode = () => {
    setIsEmbedMode(!isEmbedMode);
  };

  return (
    <>
      {/* Circadian Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white to-gray-50 -z-10" />

      {/* Usage Warning */}
      {currentUser && <UsageWarning user={currentUser} />}

      {/* Main Container */}
      <div className={`${isEmbedMode ? 'embed-mode' : 'standalone-mode'}`}>
        <ChatInterface
          user={currentUser}
          activeBot={activeBot}
          currentSession={currentSession}
          onSessionCreate={handleCreateSession}
        />
        
        <BottomNavigation
          user={currentUser}
          userProfile={userProfile || null}
          activeBot={activeBot}
          onBotChange={handleBotChange}
          onAvatarUpdate={handleAvatarUpdate}
          onLogout={handleLogout}
        />
      </div>

      {/* Embed Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          onClick={toggleEmbedMode}
          className="w-10 h-10 rounded-xl bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 border border-gray-200 shadow-sm transition-all duration-300"
          title="Toggle embed mode"
        >
          <i className={`fas ${isEmbedMode ? 'fa-expand-arrows-alt' : 'fa-compress-arrows-alt'} text-sm`}></i>
        </Button>
      </div>
    </>
  );
}
