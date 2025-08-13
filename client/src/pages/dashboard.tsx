import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import type { User, WellnessMetric, Habit, HabitEntry, WellnessPattern, Recommendation, FitnessData, DeviceIntegration } from '@shared/schema';
import { VibeMatchInterface } from '@/components/VibeMatchInterface';
import { EnhancedCheckInForm } from '@/components/EnhancedCheckInForm';
import { SettingsInterface } from '@/components/SettingsInterface';
import { PartnerModeInterface } from '@/components/PartnerModeInterface';
import { BlogInterface } from '@/components/BlogInterface';
import { PricingInterface } from '@/components/PricingInterface';
import { HomeInterface } from '@/components/HomeInterface';
import { LightPromptEdInterface } from '@/components/LightPromptEdInterface';
import { AboutInterface } from '@/components/AboutInterface';
import { ContactInterface } from '@/components/ContactInterface';
import { PrivacyInterface } from '@/components/PrivacyInterface';
import { LegalInterface } from '@/components/LegalInterface';
import { GeoPromptCheckInInterface } from '@/components/GeoPromptCheckInInterface';
import { WooWooInterface } from '@/components/WooWooInterface';
import { CommunityInterface } from '@/components/CommunityInterface';
import { AIHelpInterface } from '@/components/AIHelpInterface';
import { AdminToggle } from '@/components/AdminToggle';
import { ExternalLinksCodeSection } from '@/components/ExternalLinksCodeSection';
import { DashboardWidgets } from '@/components/DashboardWidgets';
import { BodyMirrorDashboard } from '@/components/BodyMirrorDashboard';

interface DashboardData {
  metrics: WellnessMetric[];
  habits: Habit[];
  habitEntries: Record<string, HabitEntry[]>;
  patterns: WellnessPattern[];
  recommendations?: Recommendation[];
  fitnessData?: FitnessData[];
  deviceIntegrations?: DeviceIntegration[];
  appleHealth?: any;
  homeKit?: any;
}

interface HabitCardProps {
  habit: Habit;
  streak: number;
  onToggle: (completed: boolean) => void;
  isLoading: boolean;
}

function HabitCard({ habit, streak, onToggle, isLoading }: HabitCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleToggle = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    onToggle(newCompleted);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-3">
        <Button
          onClick={handleToggle}
          disabled={isLoading}
          variant={isCompleted ? "default" : "outline"}
          size="sm"
          className={isCompleted ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {isCompleted ? (
            <i className="fas fa-check text-white"></i>
          ) : (
            <i className="fas fa-circle text-gray-400"></i>
          )}
        </Button>
        <div>
          <h4 className="font-medium">{habit.name}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="capitalize">{habit.category}</span>
            <span>•</span>
            <span>{habit.frequency}</span>
            {streak > 0 && (
              <>
                <span>•</span>
                <span className="text-orange-600">
                  <i className="fas fa-fire mr-1"></i>
                  {streak} day streak
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <Badge variant="outline" className="text-xs">
        Target: {habit.target}
      </Badge>
    </div>
  );
}

export default function DashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [activeView, setActiveView] = useState(() => {
    // Parse URL parameters to set initial view
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    // Force home view to show the widget dashboard by default
    return viewParam || 'home';
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('lightprompt-admin-mode') === 'true';
  });
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'mindfulness',
    frequency: 'daily',
    target: 1
  });
  // Get userId from sessionStorage (for regular users) or admin mode
  const isAdminMode = localStorage.getItem('lightprompt-admin-mode') === 'true';
  const regularUserId = sessionStorage.getItem('lightprompt_session_id');
  const userId = isAdminMode ? '4208c9e4-2a5d-451b-9a54-44f0ab6d7313' : regularUserId;

  // Get user data - use email endpoint for admin
  const { data: user } = useQuery<User>({
    queryKey: isAdminMode ? ['/api/users/email', 'lightprompt.co@gmail.com'] : ['/api/users', userId],
    queryFn: isAdminMode ? 
      () => fetch('/api/users/email/lightprompt.co@gmail.com').then(res => res.json()) :
      undefined,
    enabled: !!userId,
  });

  // Get dashboard data
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard', userId],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json();
    },
    enabled: !!userId,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Daily check-in mutation
  const checkInMutation = useMutation({
    mutationFn: async (data: {
      mood?: string;
      energy?: number;
      stress?: number;
      gratitude?: string;
      reflection?: string;
    }) => {
      const response = await fetch('/api/wellness-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date: new Date(),
          ...data,
        }),
      });
      if (!response.ok) throw new Error('Failed to save check-in');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Check-in saved!",
        description: "Your wellness data has been recorded.",
      });
    },
  });

  // Habit tracking mutation
  const habitMutation = useMutation({
    mutationFn: async (data: { habitId: string; completed: boolean; count?: number }) => {
      const response = await fetch('/api/habit-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          date: new Date(),
        }),
      });
      if (!response.ok) throw new Error('Failed to update habit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
  });

  // Create habit mutation
  const createHabitMutation = useMutation({
    mutationFn: async (habitData: typeof newHabit) => {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...habitData,
        }),
      });
      if (!response.ok) throw new Error('Failed to create habit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      setShowHabitForm(false);
      setNewHabit({
        name: '',
        description: '',
        category: 'mindfulness',
        frequency: 'daily',
        target: 1
      });
      toast({
        title: "Habit created! 🌟",
        description: "Your new wellness habit is ready to track.",
      });
    },
  });

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">Please log in to access your wellness dashboard.</p>
            <Link href="/">
              <Button>Go to Chat</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg text-gray-600">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  const getTodayMetric = () => {
    const today = new Date().toDateString();
    return dashboardData?.metrics.find(m => new Date(m.date).toDateString() === today);
  };

  const getHabitStreaks = () => {
    if (!dashboardData?.habits || !dashboardData?.habitEntries) return {};
    
    const streaks: Record<string, number> = {};
    dashboardData.habits.forEach(habit => {
      const entries = dashboardData.habitEntries[habit.id] || [];
      let streak = 0;
      let currentDate = new Date();
      
      // Count consecutive days from today backwards
      while (streak < 30) { // Max look-back of 30 days
        const dateStr = currentDate.toDateString();
        const dayEntry = entries.find(e => new Date(e.date).toDateString() === dateStr);
        
        if (dayEntry?.completed) {
          streak++;
        } else {
          break;
        }
        
        currentDate.setDate(currentDate.getDate() - 1);
      }
      
      streaks[habit.id] = streak;
    });
    
    return streaks;
  };

  const todayMetric = getTodayMetric();
  const habitStreaks = getHabitStreaks();

  const getViewName = () => {
    switch (activeView) {
      case 'home': return 'Home';
      case 'checkin': return 'Check-in & Overview';
      case 'growth': return 'Growth Tracking';
      case 'lightprompted': return 'LightPrompt:ed Course';
      case 'astrology': return 'Soul Map & Cosmos';
      case 'geoprompt': return 'GeoPrompt Check-In';
      case 'vibematch': return 'VibeMatch';
      case 'partner': return 'Partner Mode';
      case 'community': return 'Community';
      case 'blog': return 'Blog & Insights';
      case 'about': return 'About';
      case 'contact': return 'Contact';
      case 'help': return 'AI Help & Support';
      case 'integrations': return 'Device Integrations';
      case 'settings': return 'Settings';
      default: return 'Home';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Chat
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="w-8 h-8 mr-3 flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full">
                  <i className="fas fa-heart text-white text-sm"></i>
                </div>
                BodyMirror
              </h1>
              <p className="text-sm text-gray-600">Your AI-powered wellness guide using your personal data</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-3">
              <AdminToggle isAdmin={isAdmin} onAdminChange={setIsAdmin} />
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-teal-600"
                onClick={() => setActiveView('help')}
              >
                <i className="fas fa-question-circle mr-2"></i>
                Help
              </Button>
              <Badge variant="outline" className="capitalize">
                {user.tier === 'tier_29' ? 'Growth' : user.tier === 'tier_49' ? 'Resonance' : user.tier}
              </Badge>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          {/* Use the main navigation instead of dropdown - it's redundant */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{getViewName()}</h2>
            <p className="text-gray-600">Current view: {activeView}</p>
            {activeView !== 'home' && (
              <Button onClick={() => setActiveView('home')} variant="outline" className="mt-2">
                Go to Dashboard Home
              </Button>
            )}
          </div>



          {/* Content Rendering */}
          {activeView === 'home' && (
            <div className="space-y-6">
              {/* Soul-Tech Dashboard - Featured at Top */}
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-purple-500 text-xl">◈</span>
                    Soul-Tech Dashboard
                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                      BETA
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <BodyMirrorDashboard userId={userId!} />
                </CardContent>
              </Card>

              {/* Original Dashboard Widgets */}
              <DashboardWidgets 
                userId={userId!} 
                dashboardData={dashboardData} 
                user={user} 
              />
            </div>
          )}

          {activeView === 'checkin' && (
            <div className="space-y-6">
              {/* Overview Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Overview</CardTitle>
                  <p className="text-sm text-gray-600">
                    Your wellness snapshot for today
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <i className="fas fa-smile text-blue-500 mr-2"></i>
                          Today's Mood
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {todayMetric?.mood ? (
                            <span className="capitalize">{todayMetric.mood}</span>
                          ) : (
                            <span className="text-gray-400">Not set</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {todayMetric?.mood ? 'Feeling good today!' : 'Take a moment to check in'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <i className="fas fa-bolt text-yellow-500 mr-2"></i>
                          Energy Level
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {todayMetric?.energy ? `${todayMetric.energy}/10` : 'Not set'}
                        </div>
                        {todayMetric?.energy && (
                          <Progress value={todayMetric.energy * 10} className="mt-2" />
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <i className="fas fa-heart text-red-500 mr-2"></i>
                          Stress Level
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {todayMetric?.stress ? `${todayMetric.stress}/10` : 'Not set'}
                        </div>
                        {todayMetric?.stress && (
                          <Progress value={todayMetric.stress * 10} className="mt-2" />
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <i className="fas fa-fire text-orange-500 mr-2"></i>
                          Active Habits
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {dashboardData?.habits?.length || 0}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Building consistency
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Recommendations */}
                  {dashboardData?.recommendations && dashboardData.recommendations.length > 0 && (
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <i className="fas fa-lightbulb text-amber-500 mr-2"></i>
                          Recommendations from Your Highest Self
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          AI-powered insights based on your wellness patterns and data
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dashboardData.recommendations.slice(0, 2).map((rec) => (
                          <div key={rec.id} className="p-4 bg-white rounded-lg border border-amber-100 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <i className={`fas ${
                                  rec.type === 'breathwork' ? 'fa-wind text-blue-500' :
                                  rec.type === 'workout' ? 'fa-dumbbell text-green-500' :
                                  rec.type === 'nutrition' ? 'fa-apple-alt text-red-500' :
                                  'fa-heart text-teal-500'
                                }`}></i>
                                <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {rec.duration}min
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                            <p className="text-xs text-amber-700 italic mb-3">{rec.reasoning}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {rec.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {rec.confidence}% confidence
                                </Badge>
                              </div>
                              <Button size="sm" variant="outline" className="text-xs">
                                Start Now
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Recent Patterns */}
                  {dashboardData?.patterns && dashboardData.patterns.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <i className="fas fa-chart-line text-teal-500 mr-2"></i>
                          Recent Insights
                        </CardTitle>
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                          💡 <strong>How it works:</strong> Our AI analyzes your daily check-ins to detect patterns in your mood, energy, and stress levels over time.
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {dashboardData.patterns.slice(0, 3).map((pattern) => (
                          <div key={pattern.id} className="flex items-start space-x-3 p-3 bg-teal-50 rounded-lg">
                            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{pattern.description}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {pattern.confidence}% confidence
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(pattern.detectedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
              
              {/* Daily Check-in */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Wellness Check-in</CardTitle>
                  <p className="text-sm text-gray-600">
                    Track your emotional wellbeing and physical health
                  </p>
                </CardHeader>
                <CardContent>
                  <EnhancedCheckInForm 
                    onSubmit={(data) => checkInMutation.mutate(data)}
                    isLoading={checkInMutation.isPending}
                    existingData={todayMetric}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* LightPrompt:ed Course Tab */}
          {activeView === 'lightprompted' && (
            <div className="space-y-6">
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-6">
                💡 <strong>How it works:</strong> LightPrompt:ed is our comprehensive soul-tech wellness course designed to guide you through personal transformation using AI-enhanced learning.
              </div>
              <LightPromptEdInterface userId={userId!} />
            </div>
          )}

          {/* Growth Tracking Tab (Combined Habits & Patterns) */}
          {activeView === 'growth' && (
            <div className="space-y-6">
              <Tabs defaultValue="habits" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="habits">
                    <i className="fas fa-star mr-2"></i>
                    Habits
                  </TabsTrigger>
                  <TabsTrigger value="patterns">
                    <i className="fas fa-chart-line mr-2"></i>
                    Patterns
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="habits">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Habit Tracker
                        <Button size="sm" onClick={() => setShowHabitForm(true)}>
                          <i className="fas fa-plus mr-2"></i>
                          Add Habit
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardData?.habits && dashboardData.habits.length > 0 ? (
                        <div className="space-y-4">
                          {dashboardData.habits.map((habit) => (
                            <HabitCard
                              key={habit.id}
                              habit={habit}
                              streak={habitStreaks[habit.id] || 0}
                              onToggle={(completed) => 
                                habitMutation.mutate({ habitId: habit.id, completed })
                              }
                              isLoading={habitMutation.isPending}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <i className="fas fa-star text-4xl text-gray-300 mb-4"></i>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
                          <p className="text-gray-600 mb-4">Start building positive habits to track your progress</p>
                          <Button onClick={() => setShowHabitForm(true)}>Create Your First Habit</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="patterns">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <i className="fas fa-chart-line text-teal-500 mr-2"></i>
                        Wellness Pattern Analysis
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        AI-detected patterns in your wellness data help identify trends and optimize your routine
                      </p>
                    </CardHeader>
                    <CardContent>
                      {dashboardData?.patterns && dashboardData.patterns.length > 0 ? (
                        <div className="space-y-4">
                          {dashboardData.patterns.map((pattern) => (
                            <div key={pattern.id} className="border rounded-lg p-4 bg-gradient-to-r from-teal-50 to-cyan-50">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{pattern.description}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {pattern.confidence}% confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                Detected on {new Date(pattern.detectedAt).toLocaleDateString()}
                              </p>
                              <div className="text-xs text-gray-500 bg-white/50 p-2 rounded">
                                💡 This pattern was identified through analysis of your mood, energy, and stress data over time.
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <i className="fas fa-chart-line text-4xl text-gray-300 mb-4"></i>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No patterns detected yet</h3>
                          <p className="text-gray-600 mb-4">
                            Keep tracking your daily wellness metrics for AI-powered insights
                          </p>
                          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                            💡 <strong>Tip:</strong> Patterns typically emerge after 7-14 days of consistent check-ins
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* VibeMatch Tab */}
          {activeView === 'vibematch' && (
            <div className="space-y-6">
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-6">
                💡 <strong>How it works:</strong> VibeMatch uses AI to analyze your wellness patterns and values to connect you with like-minded souls who share similar growth journeys and authentic connection desires.
              </div>
              <VibeMatchInterface userId={userId!} />
            </div>
          )}

          {/* Partner Mode Tab */}
          {activeView === 'partner' && (
            <div className="space-y-6">
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-6">
                💡 <strong>How it works:</strong> Partner Mode allows you to securely share wellness insights with trusted individuals, set mutual growth goals, and support each other's journey while maintaining full privacy control.
              </div>
              <PartnerModeInterface userId={userId!} />
            </div>
          )}

          {/* Blog Tab */}
          {activeView === 'blog' && (
            <div className="space-y-6">
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-6">
                💡 <strong>How it works:</strong> Our blog features curated insights on AI wellness, soul-tech practices, and human connection. Articles are written by experts and informed by the latest research in technology and wellness.
              </div>
              <BlogInterface userId={userId!} />
            </div>
          )}

          {/* Settings Tab */}
          {activeView === 'settings' && (
            <div className="space-y-6">
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-6">
                💡 <strong>How it works:</strong> Customize your LightPrompt experience and choose the plan that best fits your wellness journey. Each tier offers different levels of AI interaction and features.
              </div>
              <SettingsInterface userId={userId!} />
              
              {/* Admin External Links Section */}
              {isAdmin && (
                <ExternalLinksCodeSection isAdmin={isAdmin} />
              )}
              
              {/* Manage Subscriptions Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-credit-card text-blue-600 mr-2"></i>
                    Manage Subscriptions
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    View and manage your active subscriptions and billing
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <i className="fas fa-receipt text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No active subscriptions</h3>
                    <p className="text-gray-600 mb-4">You're currently on the free Explorer plan</p>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/plans'}
                    >
                      <i className="fas fa-arrow-down mr-2"></i>
                      View Plans Below
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Plans & Features Section */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg p-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <i className="fas fa-star text-teal-600 mr-2"></i>
                    Plans & Features
                  </h3>
                  {user && <PricingInterface user={user} />}
                </div>
              </div>
            </div>
          )}

          {/* Community Tab */}
          {activeView === 'community' && (
            <div className="space-y-6">
              <CommunityInterface userId={userId!} />
            </div>
          )}
          
          {/* Soul Map & Cosmos Tab */}
          {activeView === 'astrology' && (
            <div className="space-y-6">
              <WooWooInterface userId={userId!} />
            </div>
          )}
          
          {/* GeoPrompt Tab */}
          {activeView === 'geoprompt' && (
            <div className="space-y-6">
              <GeoPromptCheckInInterface userId={userId!} />
            </div>
          )}
          
          {/* Device Integrations Tab */}
          {activeView === 'integrations' && (
            <div className="space-y-6">
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mb-6">
                💡 <strong>How it works:</strong> Device integrations sync your health data from wearables and apps to provide comprehensive wellness insights. All data is encrypted and you control what gets shared.
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Device Integrations</CardTitle>
                  <p className="text-sm text-gray-600">
                    Connect your health and wellness devices for comprehensive tracking
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <i className="fas fa-mobile-alt text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Device integrations coming soon</h3>
                    <p className="text-gray-600">Apple Health, Google Fit, and more</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add Habit Modal */}
          {showHabitForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Create New Habit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="habit-name">Habit Name</Label>
                    <Input
                      id="habit-name"
                      value={newHabit.name}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Morning meditation"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="habit-description">Description (optional)</Label>
                    <Textarea
                      id="habit-description"
                      value={newHabit.description}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Why is this habit important to you?"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="habit-category">Category</Label>
                    <Select value={newHabit.category} onValueChange={(value) => setNewHabit(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="sleep">Sleep</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="creativity">Creativity</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="habit-frequency">Frequency</Label>
                    <Select value={newHabit.frequency} onValueChange={(value) => setNewHabit(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="habit-target">Target (times per day)</Label>
                    <Input
                      id="habit-target"
                      type="number"
                      min="1"
                      value={newHabit.target}
                      onChange={(e) => setNewHabit(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={() => setShowHabitForm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => createHabitMutation.mutate(newHabit)}
                      disabled={!newHabit.name || createHabitMutation.isPending}
                      className="flex-1"
                    >
                      {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeView === 'about' && user && (
            <AboutInterface userId={user.id} />
          )}
          
          {activeView === 'contact' && user && (
            <ContactInterface userId={user.id} />
          )}
          
          
          {activeView === 'help' && user && (
            <AIHelpInterface userId={user.id} />
          )}
        </div>
      </div>
    </div>
  );
}