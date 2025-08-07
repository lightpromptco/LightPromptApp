import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserProfile, ChatSession } from '@shared/schema';
import { BOTS, Bot, getBotById } from '@/lib/bots';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ChatInterface } from '@/components/ChatInterface';
import { useCircadian } from '@/hooks/useCircadian';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeBot, setActiveBot] = useState<Bot>(BOTS[0]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Initialize circadian theming
  useCircadian();

  // Create or get user on mount
  useEffect(() => {
    initializeUser();
  }, []);

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
          }
        }
      }

      setCurrentUser(user);
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
          userProfile={userProfile}
          activeBot={activeBot}
          onBotChange={handleBotChange}
          onAvatarUpdate={handleAvatarUpdate}
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
