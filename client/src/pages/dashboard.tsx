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
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import type { User, WellnessMetric, Habit, HabitEntry, WellnessPattern, Recommendation, FitnessData, DeviceIntegration } from '@shared/schema';
import { VibeMatchInterface } from '@/components/VibeMatchInterface';
import { EnhancedCheckInForm } from '@/components/EnhancedCheckInForm';
import { SettingsInterface } from '@/components/SettingsInterface';
import { PartnerModeInterface } from '@/components/PartnerModeInterface';
import { BlogInterface } from '@/components/BlogInterface';
import { PricingInterface } from '@/components/PricingInterface';

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

export default function DashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'mindfulness',
    frequency: 'daily',
    target: 1
  });
  const userId = localStorage.getItem('lightprompt_user_id');

  // Get user data
  const { data: user } = useQuery<User>({
    queryKey: ['/api/users', userId],
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
              <h1 className="text-2xl font-bold text-gray-900">LightPrompt Dashboard</h1>
              <p className="text-sm text-gray-600">Track your soul-tech wellness journey</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-3">
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-11 gap-1">
            <TabsTrigger value="overview" className="text-xs lg:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="checkin" className="text-xs lg:text-sm">Check-in</TabsTrigger>
            <TabsTrigger value="habits" className="text-xs lg:text-sm">Habits</TabsTrigger>
            <TabsTrigger value="patterns" className="text-xs lg:text-sm">Patterns</TabsTrigger>
            <TabsTrigger value="vibematch" className="text-xs lg:text-sm">VibeMatch</TabsTrigger>
            <TabsTrigger value="partner" className="text-xs lg:text-sm">Partner</TabsTrigger>
            <TabsTrigger value="community" className="text-xs lg:text-sm">Community</TabsTrigger>
            <TabsTrigger value="blog" className="text-xs lg:text-sm">Blog</TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs lg:text-sm">Devices</TabsTrigger>
            <TabsTrigger value="horoscope" className="text-xs lg:text-sm">Astrology</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs lg:text-sm">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
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
          </TabsContent>

          {/* Daily Check-in & Health Tab */}
          <TabsContent value="checkin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Wellness & Health Check-in</CardTitle>
                <p className="text-sm text-gray-600">
                  Track your emotional wellbeing and physical health in one place
                </p>
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-2">
                  💡 <strong>Holistic Tracking:</strong> Combined emotional and physical tracking gives our AI deeper insights for personalized recommendations. Track what feels important to you today.
                </div>
              </CardHeader>
              <CardContent>
                <EnhancedCheckInForm 
                  onSubmit={(data) => checkInMutation.mutate(data)}
                  isLoading={checkInMutation.isPending}
                  existingData={todayMetric}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Habits Tab */}
          <TabsContent value="habits" className="space-y-6">
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

            {/* Add Habit Modal */}
            {showHabitForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Create New Habit</h3>
                    <Button 
                      onClick={() => setShowHabitForm(false)}
                      variant="ghost"
                      size="sm"
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newHabit.name.trim()) {
                        createHabitMutation.mutate(newHabit);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="habit-name">Habit Name *</Label>
                      <Input
                        id="habit-name"
                        placeholder="e.g., Morning Meditation"
                        value={newHabit.name}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="habit-description">Description</Label>
                      <Input
                        id="habit-description"
                        placeholder="Brief description of your habit"
                        value={newHabit.description}
                        onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="habit-category">Category</Label>
                      <Select 
                        value={newHabit.category} 
                        onValueChange={(value) => setNewHabit(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mindfulness">🧘 Mindfulness</SelectItem>
                          <SelectItem value="fitness">💪 Fitness</SelectItem>
                          <SelectItem value="nutrition">🥗 Nutrition</SelectItem>
                          <SelectItem value="sleep">😴 Sleep</SelectItem>
                          <SelectItem value="social">👥 Social</SelectItem>
                          <SelectItem value="learning">📚 Learning</SelectItem>
                          <SelectItem value="creativity">🎨 Creativity</SelectItem>
                          <SelectItem value="productivity">⚡ Productivity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="habit-frequency">Frequency</Label>
                        <Select 
                          value={newHabit.frequency} 
                          onValueChange={(value) => setNewHabit(prev => ({ ...prev, frequency: value }))}
                        >
                          <SelectTrigger className="mt-1">
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
                        <Label htmlFor="habit-target">Target Count</Label>
                        <Input
                          id="habit-target"
                          type="number"
                          min="1"
                          value={newHabit.target}
                          onChange={(e) => setNewHabit(prev => ({ ...prev, target: parseInt(e.target.value) || 1 }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setShowHabitForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={!newHabit.name.trim() || createHabitMutation.isPending}
                        className="flex-1"
                      >
                        {createHabitMutation.isPending ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus mr-2"></i>
                            Create Habit
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </TabsContent>


          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Patterns & Insights</CardTitle>
                <p className="text-sm text-gray-600">
                  AI-detected patterns in your wellness journey
                </p>
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-2">
                  💡 <strong>Pattern Recognition:</strong> Our AI analyzes your check-ins, habits, and fitness data to identify trends. Patterns become visible after 7+ days of consistent tracking.
                </div>
              </CardHeader>
              <CardContent>
                {dashboardData?.patterns && dashboardData.patterns.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.patterns.map((pattern) => (
                      <div key={pattern.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium capitalize">
                            {pattern.patternType.replace('_', ' ')}
                          </h4>
                          <Badge variant="outline">
                            {pattern.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3">{pattern.description}</p>
                        <div className="text-sm text-gray-500">
                          Detected: {new Date(pattern.detectedAt).toLocaleDateString()}
                          {pattern.startDate && (
                            <span className="ml-4">
                              Period: {new Date(pattern.startDate).toLocaleDateString()}
                              {pattern.endDate && ` - ${new Date(pattern.endDate).toLocaleDateString()}`}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-chart-line text-4xl text-gray-300 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No patterns detected yet</h3>
                    <p className="text-gray-600">Keep logging your wellness data to discover insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="mb-6">
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                💡 <strong>Device Integrations:</strong> Connect your health devices to automatically sync data and get more accurate insights. Each integration enhances your AI recommendations.
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Apple Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fab fa-apple text-black mr-2"></i>
                    Apple Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="apple-health" className="text-sm">Auto-sync</Label>
                    <Switch id="apple-health" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Steps, heart rate, sleep, workouts, mindful minutes
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <i className="fas fa-link mr-1"></i>
                    Connect
                  </Button>
                </CardContent>
              </Card>

              {/* Fitbit */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fas fa-running text-green-500 mr-2"></i>
                    Fitbit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fitbit" className="text-sm">Auto-sync</Label>
                    <Switch id="fitbit" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Activity, sleep stages, heart rate variability
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <i className="fas fa-link mr-1"></i>
                    Connect
                  </Button>
                </CardContent>
              </Card>

              {/* Garmin */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fas fa-satellite text-blue-600 mr-2"></i>
                    Garmin
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="garmin" className="text-sm">Auto-sync</Label>
                    <Switch id="garmin" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Training load, recovery, stress tracking
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <i className="fas fa-link mr-1"></i>
                    Connect
                  </Button>
                </CardContent>
              </Card>

              {/* Oura Ring */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fas fa-ring text-teal-500 mr-2"></i>
                    Oura Ring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="oura" className="text-sm">Auto-sync</Label>
                    <Switch id="oura" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Sleep quality, readiness score, body temperature
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <i className="fas fa-link mr-1"></i>
                    Connect
                  </Button>
                </CardContent>
              </Card>

              {/* WHOOP */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fas fa-heartbeat text-red-500 mr-2"></i>
                    WHOOP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whoop" className="text-sm">Auto-sync</Label>
                    <Switch id="whoop" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Strain, recovery, sleep performance
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <i className="fas fa-link mr-1"></i>
                    Connect
                  </Button>
                </CardContent>
              </Card>

              {/* HomeKit */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fas fa-home text-blue-500 mr-2"></i>
                    HomeKit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="homekit" className="text-sm">Auto-sync</Label>
                    <Switch id="homekit" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Temperature, humidity, air quality, light levels
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <i className="fas fa-link mr-1"></i>
                    Connect
                  </Button>
                </CardContent>
              </Card>

              {/* Alexa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fas fa-volume-up text-blue-500 mr-2"></i>
                    Amazon Alexa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="alexa" className="text-sm">Voice control</Label>
                    <Switch id="alexa" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Voice check-ins, mood tracking, guided reflections
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    window.open('https://alexa.amazon.com/spa/index.html#skills', '_blank');
                  }}>
                    <i className="fas fa-microphone mr-1"></i>
                    Enable Skill
                  </Button>
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    💡 Say "Alexa, open LightPrompt" to start voice reflections
                  </div>
                </CardContent>
              </Card>

              {/* Google Assistant */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fab fa-google text-red-500 mr-2"></i>
                    Google Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="google-assistant" className="text-sm">Voice control</Label>
                    <Switch id="google-assistant" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Daily wellness prompts, habit reminders
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    window.open('https://assistant.google.com/services/a/uid/00000012b5b5b2b8', '_blank');
                  }}>
                    <i className="fas fa-microphone mr-1"></i>
                    Setup Action
                  </Button>
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    💡 Say "Hey Google, talk to LightPrompt" for guided wellness
                  </div>
                </CardContent>
              </Card>

              {/* Siri Shortcuts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <i className="fas fa-mobile-alt text-gray-700 mr-2"></i>
                    Siri Shortcuts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="siri" className="text-sm">Voice shortcuts</Label>
                    <Switch id="siri" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Quick mood check-ins, habit logging
                  </p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    window.open('shortcuts://gallery/search?query=wellness', '_blank');
                  }}>
                    <i className="fas fa-plus mr-1"></i>
                    Add Shortcuts
                  </Button>
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    💡 Say "Hey Siri, log my mood" for instant wellness tracking
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Future integrations preview */}
            <Card className="bg-gradient-to-br from-teal-50 to-indigo-50 border-teal-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-rocket text-teal-500 mr-2"></i>
                  Coming Soon
                </CardTitle>
                <div className="text-xs text-gray-500 bg-white/50 p-2 rounded mt-2">
                  💡 <strong>Roadmap:</strong> These features are in development and will be available in future updates.
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-2 bg-white/30 rounded">
                  <i className="fas fa-map-marker-alt text-green-500"></i>
                  <div>
                    <span className="font-medium">GeoPrompt</span>
                    <p className="text-xs text-gray-600">Location-based wellness insights and QR experiences</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white/30 rounded">
                  <i className="fas fa-mobile-alt text-blue-500"></i>
                  <div>
                    <span className="font-medium">Native Device APIs</span>
                    <p className="text-xs text-gray-600">Direct Apple Health, Fitbit, and Garmin API integrations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white/30 rounded">
                  <i className="fas fa-home text-teal-500"></i>
                  <div>
                    <span className="font-medium">Smart Home Integration</span>
                    <p className="text-xs text-gray-600">HomeKit, Philips Hue, and smart wellness device control</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white/30 rounded">
                  <i className="fas fa-rainbow text-teal-500"></i>
                  <div>
                    <span className="font-medium">Siri Rainbow Screen</span>
                    <p className="text-xs text-gray-600">Native iOS app needed for full Siri visual integration</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white/30 rounded">
                  <i className="fas fa-brain text-indigo-500"></i>
                  <div>
                    <span className="font-medium">Advanced AI</span>
                    <p className="text-xs text-gray-600">Deeper pattern recognition and predictive wellness insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Horoscope/Astrology Tab */}
          <TabsContent value="horoscope" className="space-y-6">
            <Card className="bg-gradient-to-br from-violet-50 to-teal-50 border-violet-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-moon text-teal-500 mr-2"></i>
                  SoulMap Astrology Insights
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Connect with cosmic rhythms and universal guidance for your wellness journey
                </p>
                <div className="text-xs text-gray-500 bg-white/50 p-3 rounded mt-2">
                  🌙 <strong>Cosmic Guidance:</strong> SoulMap analyzes planetary influences, moon phases, and your birth chart to provide personalized spiritual guidance and timing for wellness practices.
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Today's Cosmic Weather */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <i className="fas fa-star text-yellow-500 mr-2"></i>
                        Today's Cosmic Weather
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                        <h4 className="font-semibold text-indigo-900 mb-2">Moon Phase: Waxing Crescent</h4>
                        <p className="text-sm text-indigo-700 mb-3">
                          Perfect energy for setting intentions and beginning new wellness habits. Your highest self encourages gentle beginnings.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">New Moon Energy</Badge>
                          <Badge variant="outline" className="text-xs">Manifestation</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                        <h4 className="font-semibold text-amber-900 mb-2">Planetary Influence</h4>
                        <p className="text-sm text-amber-700 mb-3">
                          Mercury in harmony supports clear communication with your inner wisdom. Ideal time for journaling and reflection.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">Mercury Harmony</Badge>
                          <Badge variant="outline" className="text-xs">Communication</Badge>
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <Button className="bg-gradient-to-r from-teal-500 to-violet-600">
                          <i className="fas fa-crystal-ball mr-2"></i>
                          Get Full Reading
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Birth Chart Setup */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <i className="fas fa-chart-pie text-teal-500 mr-2"></i>
                        Your Birth Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-6">
                        <i className="fas fa-user-astronaut text-4xl text-teal-300 mb-4"></i>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Create Your Cosmic Profile</h3>
                        <p className="text-gray-600 mb-4">Enter your birth details for personalized astrological insights</p>
                        
                        <div className="space-y-3 max-w-sm mx-auto">
                          <Input placeholder="Birth date (MM/DD/YYYY)" />
                          <Input placeholder="Birth time (HH:MM AM/PM)" />
                          <Input placeholder="Birth location (City, State)" />
                        </div>
                        
                        <Button className="mt-4 bg-gradient-to-r from-teal-500 to-violet-600">
                          <i className="fas fa-star mr-2"></i>
                          Generate Birth Chart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily Affirmation */}
                <Card className="mt-6 bg-gradient-to-br from-rose-50 to-cyan-50 border-rose-200">
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-heart text-rose-500 text-2xl mb-3"></i>
                    <h3 className="text-lg font-semibold text-rose-900 mb-2">Today's Soul Affirmation</h3>
                    <p className="text-rose-700 italic text-lg mb-4">
                      "I trust the cosmic timing of my healing journey and honor the wisdom flowing through me."
                    </p>
                    <p className="text-xs text-rose-600">Channeled through SoulMap for your highest good ✨</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="fas fa-users text-blue-500 mr-2"></i>
                    Wellness Community
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Requires 3+ Reflections
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Connect with fellow souls on their wellness journey. Share insights, support each other, and grow together.
                </p>
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-2">
                  🌱 <strong>Sacred Space:</strong> Our community is built on respect, authenticity, and mutual growth. Complete 3 reflections to unlock access and contribute meaningfully to the collective wisdom.
                </div>
              </CardHeader>
              <CardContent>
                {/* Community Access Check */}
                <div className="text-center py-8">
                  <i className="fas fa-seedling text-4xl text-green-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Continue Your Reflection Journey</h3>
                  <p className="text-gray-600 mb-4">Complete 3 meaningful reflections to join our wellness community</p>
                  
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-600 ml-2">1 of 3 reflections complete</span>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-green-500 to-teal-600">
                    <i className="fas fa-comment mr-2"></i>
                    Start Your Next Reflection
                  </Button>
                </div>

                {/* Preview of Community Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg opacity-60">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <i className="fas fa-share-alt text-blue-500 mr-2"></i>
                      Share Insights
                    </h4>
                    <p className="text-xs text-gray-600">Post meaningful reflections and discoveries from your wellness journey</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg opacity-60">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <i className="fas fa-hands-helping text-teal-500 mr-2"></i>
                      Support Others
                    </h4>
                    <p className="text-xs text-gray-600">Offer encouragement and learn from the experiences of kindred spirits</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg opacity-60">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
                      Collective Wisdom
                    </h4>
                    <p className="text-xs text-gray-600">Access group insights and patterns discovered by our AI across the community</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VibeMatch Tab */}
          <TabsContent value="vibematch" className="space-y-6">
            <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-heart text-cyan-500 mr-2"></i>
                  VibeMatch - Soul Connection Discovery
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Connect with like-minded souls through interactive wellness matching. Find your tribe based on energy resonance and personal growth alignment.
                </p>
                <div className="text-xs text-gray-500 bg-white/70 p-3 rounded mt-2">
                  ✨ <strong>How it works:</strong> Complete 3 resonance matches to unlock Prism Point - your gateway to deeper connection and information exchange with matched souls.
                </div>
              </CardHeader>
              <CardContent>
                <VibeMatchInterface userId={userId!} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Partner Mode Tab */}
          <TabsContent value="partner" className="space-y-6">
            <PartnerModeInterface userId={userId!} />
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <BlogInterface userId={userId!} />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-8">
              <SettingsInterface userId={userId!} />
              
              {/* Pricing Section */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <i className="fas fa-credit-card text-teal-600 mr-2"></i>
                  Plans & Features
                </h3>
                {user && <PricingInterface user={user} />}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Daily Check-in Form Component
function DailyCheckInForm({ 
  onSubmit, 
  isLoading, 
  existingData 
}: { 
  onSubmit: (data: any) => void; 
  isLoading: boolean; 
  existingData?: WellnessMetric; 
}) {
  const [formData, setFormData] = useState({
    mood: existingData?.mood || '',
    energy: existingData?.energy || 5,
    stress: existingData?.stress || 5,
    gratitude: existingData?.gratitude || '',
    reflection: existingData?.reflection || '',
    // Health/fitness fields
    weight: '',
    workoutType: '',
    workoutDuration: '',
    waterIntake: '',
    sleepHours: '',
    sleepQuality: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="mood">How are you feeling today?</Label>
          <Select value={formData.mood} onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="happy">😊 Happy</SelectItem>
              <SelectItem value="calm">😌 Calm</SelectItem>
              <SelectItem value="energetic">⚡ Energetic</SelectItem>
              <SelectItem value="focused">🎯 Focused</SelectItem>
              <SelectItem value="anxious">😰 Anxious</SelectItem>
              <SelectItem value="sad">😔 Sad</SelectItem>
              <SelectItem value="tired">😴 Tired</SelectItem>
              <SelectItem value="stressed">😤 Stressed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="energy">Energy Level (1-10)</Label>
          <div className="mt-1 space-y-2">
            <Input
              type="range"
              min="1"
              max="10"
              value={formData.energy}
              onChange={(e) => setFormData(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              {formData.energy}/10
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="stress">Stress Level (1-10)</Label>
          <div className="mt-1 space-y-2">
            <Input
              type="range"
              min="1"
              max="10"
              value={formData.stress}
              onChange={(e) => setFormData(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              {formData.stress}/10
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="gratitude">What are you grateful for?</Label>
          <Input
            id="gratitude"
            value={formData.gratitude}
            onChange={(e) => setFormData(prev => ({ ...prev, gratitude: e.target.value }))}
            placeholder="Something you're grateful for today..."
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="reflection">Daily Reflection</Label>
        <Textarea
          id="reflection"
          value={formData.reflection}
          onChange={(e) => setFormData(prev => ({ ...prev, reflection: e.target.value }))}
          placeholder="How was your day? Any insights or thoughts to capture..."
          className="mt-1"
          rows={4}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Saving Check-in...
          </>
        ) : (
          <>
            <i className="fas fa-heart mr-2"></i>
            {existingData ? 'Update Check-in' : 'Save Check-in'}
          </>
        )}
      </Button>
    </form>
  );
}

// Habit Card Component
function HabitCard({ 
  habit, 
  streak, 
  onToggle, 
  isLoading 
}: { 
  habit: Habit; 
  streak: number; 
  onToggle: (completed: boolean) => void; 
  isLoading: boolean; 
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleToggle = () => {
    const newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    onToggle(newCompleted);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          isCompleted 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {isCompleted && <i className="fas fa-check text-xs"></i>}
      </button>
      
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <i className={`${habit.icon} text-sm`} style={{ color: habit.color || '#10b981' }}></i>
          <h4 className="font-medium">{habit.name}</h4>
          {streak > 0 && (
            <Badge variant="secondary" className="text-xs">
              {streak} day{streak !== 1 ? 's' : ''} 🔥
            </Badge>
          )}
        </div>
        {habit.description && (
          <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {habit.frequency} • Target: {habit.target}
        </div>
      </div>
    </div>
  );
}

// Fitness Input Form Component
function FitnessInputForm({ userId }: { userId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    waterIntake: '',
    workoutDuration: '',
    workoutType: '',
    workoutIntensity: 5,
    restingHeartRate: '',
    bloodPressure: '',
    sleepQuality: 5,
    stressLevel: 5,
    notes: '',
  });

  const fitnessMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/fitness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          date: new Date(),
          weight: data.weight ? parseInt(data.weight) : null,
          bodyFat: data.bodyFat ? parseInt(data.bodyFat) : null,
          waterIntake: data.waterIntake ? parseInt(data.waterIntake) : null,
          workoutDuration: data.workoutDuration ? parseInt(data.workoutDuration) : null,
          workoutType: data.workoutType || null,
          workoutIntensity: data.workoutIntensity,
          restingHeartRate: data.restingHeartRate ? parseInt(data.restingHeartRate) : null,
          bloodPressure: data.bloodPressure || null,
          sleepQuality: data.sleepQuality,
          stressLevel: data.stressLevel,
          notes: data.notes || null,
        }),
      });
      if (!response.ok) throw new Error('Failed to save fitness data');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Fitness data saved!",
        description: "Your health metrics have been recorded.",
      });
      // Reset form
      setFormData({
        weight: '',
        bodyFat: '',
        waterIntake: '',
        workoutDuration: '',
        workoutType: '',
        workoutIntensity: 5,
        restingHeartRate: '',
        bloodPressure: '',
        sleepQuality: 5,
        stressLevel: 5,
        notes: '',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fitnessMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (lbs)</Label>
          <Input
            id="weight"
            type="number"
            placeholder="150"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="bodyFat">Body Fat (%)</Label>
          <Input
            id="bodyFat"
            type="number"
            placeholder="15"
            value={formData.bodyFat}
            onChange={(e) => setFormData(prev => ({ ...prev, bodyFat: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="waterIntake">Water Intake (oz)</Label>
          <Input
            id="waterIntake"
            type="number"
            placeholder="64"
            value={formData.waterIntake}
            onChange={(e) => setFormData(prev => ({ ...prev, waterIntake: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="restingHeartRate">Resting Heart Rate (BPM)</Label>
          <Input
            id="restingHeartRate"
            type="number"
            placeholder="60"
            value={formData.restingHeartRate}
            onChange={(e) => setFormData(prev => ({ ...prev, restingHeartRate: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="workoutDuration">Workout Duration (min)</Label>
          <Input
            id="workoutDuration"
            type="number"
            placeholder="30"
            value={formData.workoutDuration}
            onChange={(e) => setFormData(prev => ({ ...prev, workoutDuration: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="workoutType">Workout Type</Label>
          <Select value={formData.workoutType} onValueChange={(value) => setFormData(prev => ({ ...prev, workoutType: value }))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select workout type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="strength">Strength Training</SelectItem>
              <SelectItem value="yoga">Yoga</SelectItem>
              <SelectItem value="pilates">Pilates</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="cycling">Cycling</SelectItem>
              <SelectItem value="swimming">Swimming</SelectItem>
              <SelectItem value="walking">Walking</SelectItem>
              <SelectItem value="hiit">HIIT</SelectItem>
              <SelectItem value="stretching">Stretching</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bloodPressure">Blood Pressure</Label>
          <Input
            id="bloodPressure"
            type="text"
            placeholder="120/80"
            value={formData.bloodPressure}
            onChange={(e) => setFormData(prev => ({ ...prev, bloodPressure: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="workoutIntensity">Workout Intensity (1-10)</Label>
          <div className="mt-1 space-y-2">
            <Input
              type="range"
              min="1"
              max="10"
              value={formData.workoutIntensity}
              onChange={(e) => setFormData(prev => ({ ...prev, workoutIntensity: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              {formData.workoutIntensity}/10
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="sleepQuality">Sleep Quality (1-10)</Label>
          <div className="mt-1 space-y-2">
            <Input
              type="range"
              min="1"
              max="10"
              value={formData.sleepQuality}
              onChange={(e) => setFormData(prev => ({ ...prev, sleepQuality: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              {formData.sleepQuality}/10
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
          <div className="mt-1 space-y-2">
            <Input
              type="range"
              min="1"
              max="10"
              value={formData.stressLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              {formData.stressLevel}/10
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="How are you feeling after your workout? Any observations..."
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="mt-1"
            rows={2}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={fitnessMutation.isPending}
      >
        {fitnessMutation.isPending ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Saving...
          </>
        ) : (
          <>
            <i className="fas fa-save mr-2"></i>
            Save Fitness Data
          </>
        )}
      </Button>
    </form>
  );
}