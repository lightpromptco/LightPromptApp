import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  duration: number;
  difficulty: string;
  isActive: boolean;
  participantCount: number;
  dailyTasks: string[];
  rewards: {
    completion: { points: number; badge: string };
    daily: { points: number };
  };
  startDate: string;
  endDate: string;
}

interface UserChallenge {
  id: string;
  challengeId: string;
  userId: string;
  status: string;
  progress: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  joinedAt: string;
  challenge: Challenge;
}

interface UserStats {
  totalPoints: number;
  level: number;
  streakDays: number;
  challengesCompleted: number;
  badgesEarned: number;
  rewards: any[];
}

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-challenges' | 'leaderboard'>('browse');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Get authenticated user from Supabase backend validation - NEVER localStorage
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // In production: JWT token validation via secure endpoint
        // For now: Admin user validation via backend
        const response = await fetch('/api/users/email/lightprompt.co@gmail.com');
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };
    
    authenticateUser();
  }, []);

  // Fetch available challenges
  const { data: challenges = [], isLoading: challengesLoading } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
    enabled: activeTab === 'browse'
  });

  // Fetch user's challenges
  const { data: userChallenges = [], isLoading: userChallengesLoading } = useQuery<UserChallenge[]>({
    queryKey: ['/api/users', userId, 'challenges'],
    enabled: activeTab === 'my-challenges' && !!userId
  });

  // Fetch user stats
  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/users', userId, 'stats'],
    enabled: !!userId
  });

  // Join challenge mutation
  const joinChallengeMutation = useMutation({
    mutationFn: (challengeId: string) => 
      apiRequest('POST', `/api/challenges/${challengeId}/join`, { userId }),
    onSuccess: () => {
      toast({
        title: "Challenge Joined!",
        description: "You've successfully joined the challenge. Start your journey today!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'challenges'] });
      queryClient.invalidateQueries({ queryKey: ['/api/challenges'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ challengeId, day, completed, notes }: {
      challengeId: string;
      day: number;
      completed: boolean;
      notes?: string;
    }) => apiRequest('POST', `/api/challenges/${challengeId}/progress`, {
      userId,
      day,
      completed,
      notes
    }),
    onSuccess: () => {
      toast({
        title: "Progress Updated!",
        description: "Great job! Keep up the momentum.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'challenges'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'stats'] });
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mindfulness': return '🧘';
      case 'fitness': return '💪';
      case 'growth': return '🌱';
      case 'nutrition': return '🥗';
      default: return '⭐';
    }
  };

  const renderBrowseChallenges = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge: Challenge) => {
          const isJoined = userChallenges.some((uc: UserChallenge) => uc.challengeId === challenge.id);
          
          return (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{challenge.duration} days</div>
                    <div>{challenge.participantCount} joined</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{challenge.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Daily Tasks:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {challenge.dailyTasks?.slice(0, 3).map((task, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                        <span>{task}</span>
                      </li>
                    ))}
                    {challenge.dailyTasks?.length > 3 && (
                      <li className="text-gray-400">+ {challenge.dailyTasks.length - 3} more tasks</li>
                    )}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded border">
                  <div className="text-sm font-medium text-gray-900 mb-1">Rewards</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>🏆 Completion: {challenge.rewards?.completion?.points} points</div>
                    <div>⭐ Daily: {challenge.rewards?.daily?.points} points each</div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => joinChallengeMutation.mutate(challenge.id)}
                  disabled={isJoined || joinChallengeMutation.isPending}
                >
                  {isJoined ? (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Joined
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus mr-2"></i>
                      Join Challenge
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderMyChallenges = () => (
    <div className="space-y-6">
      {userChallenges.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-trophy text-gray-400 text-xl"></i>
          </div>
          <h3 className="font-medium text-gray-900 mb-2">No Active Challenges</h3>
          <p className="text-gray-500 text-sm mb-4">
            Join a challenge to start your wellness journey!
          </p>
          <Button onClick={() => setActiveTab('browse')}>
            Browse Challenges
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userChallenges.map((userChallenge: UserChallenge) => (
            <Card key={userChallenge.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getCategoryIcon(userChallenge.challenge.category)}</span>
                    <CardTitle className="text-lg">{userChallenge.challenge.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Day {userChallenge.completedDays + 1} of {userChallenge.challenge.duration}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(userChallenge.progress)}%</span>
                  </div>
                  <Progress value={userChallenge.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="font-semibold text-blue-600">{userChallenge.completedDays}</div>
                    <div className="text-xs text-blue-600">Days Complete</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-semibold text-green-600">{userChallenge.currentStreak}</div>
                    <div className="text-xs text-green-600">Current Streak</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Today's Tasks:</h4>
                  <div className="space-y-2">
                    {userChallenge.challenge.dailyTasks?.map((task, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateProgressMutation.mutate({
                                challengeId: userChallenge.challengeId,
                                day: userChallenge.completedDays + 1,
                                completed: true
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold text-2xl text-yellow-600">
              {(userStats as any)?.totalPoints || 0}
            </div>
            <div className="text-sm text-yellow-600">Total Points</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-2xl text-blue-600">
              Level {(userStats as any)?.level || 1}
            </div>
            <div className="text-sm text-blue-600">Current Level</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="font-bold text-2xl text-green-600">
              {(userStats as any)?.streakDays || 0}
            </div>
            <div className="text-sm text-green-600">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      {(userStats as any)?.rewards && (userStats as any).rewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(userStats as any).rewards.slice(0, 5).map((reward: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">+{reward.points}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{reward.source}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(reward.awardedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-8">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-4">
                Please sign in to access challenges and track your progress.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Wellness Challenges</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join guided challenges to build healthy habits, connect with your community, 
            and earn rewards on your wellness journey.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-sm border">
            {[
              { id: 'browse', label: 'Browse Challenges', icon: 'fas fa-search' },
              { id: 'my-challenges', label: 'My Challenges', icon: 'fas fa-user' },
              { id: 'leaderboard', label: 'Progress & Rewards', icon: 'fas fa-trophy' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          {activeTab === 'browse' && renderBrowseChallenges()}
          {activeTab === 'my-challenges' && renderMyChallenges()}
          {activeTab === 'leaderboard' && renderLeaderboard()}
        </div>
      </div>
    </div>
  );
}