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
import type { User, WellnessMetric, Habit, HabitEntry, WellnessPattern } from '@shared/schema';

interface DashboardData {
  metrics: WellnessMetric[];
  habits: Habit[];
  habitEntries: Record<string, HabitEntry[]>;
  patterns: WellnessPattern[];
  appleHealth?: any;
  homeKit?: any;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
              <h1 className="text-2xl font-bold text-gray-900">Wellness Dashboard</h1>
              <p className="text-sm text-gray-600">Track your patterns, habits, and wellness journey</p>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="capitalize">
                {user.tier === 'tier_29' ? 'Growth' : user.tier === 'tier_49' ? 'Resonance' : user.tier}
              </Badge>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="checkin">Daily Check-in</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
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

            {/* Recent Patterns */}
            {dashboardData?.patterns && dashboardData.patterns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-chart-line text-purple-500 mr-2"></i>
                    Recent Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dashboardData.patterns.slice(0, 3).map((pattern) => (
                    <div key={pattern.id} className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
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

          {/* Daily Check-in Tab */}
          <TabsContent value="checkin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Wellness Check-in</CardTitle>
                <p className="text-sm text-gray-600">
                  Take a moment to reflect on how you're feeling today
                </p>
              </CardHeader>
              <CardContent>
                <DailyCheckInForm 
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
                  <Button size="sm">
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
                    <Button>Create Your First Habit</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Patterns & Insights</CardTitle>
                <p className="text-sm text-gray-600">
                  AI-detected patterns in your wellness journey
                </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fab fa-apple text-black mr-2"></i>
                    Apple Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="apple-health">Sync Apple Health data</Label>
                    <Switch id="apple-health" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Connect your Apple Health data to get insights from steps, heart rate, sleep, and more.
                  </p>
                  <Button variant="outline" className="w-full">
                    <i className="fas fa-link mr-2"></i>
                    Connect Apple Health
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <i className="fas fa-home text-blue-500 mr-2"></i>
                    HomeKit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="homekit">Sync HomeKit sensors</Label>
                    <Switch id="homekit" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Track environmental factors like temperature, humidity, and air quality.
                  </p>
                  <Button variant="outline" className="w-full">
                    <i className="fas fa-link mr-2"></i>
                    Connect HomeKit
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Future integrations preview */}
            <Card className="opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-rocket text-purple-500 mr-2"></i>
                  Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-map-marker-alt text-green-500"></i>
                  <span>GeoPrompt - Location-based wellness insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-users text-pink-500"></i>
                  <span>Vibe Match - Connect with resonant souls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="fas fa-brain text-indigo-500"></i>
                  <span>Advanced pattern recognition with AI</span>
                </div>
              </CardContent>
            </Card>
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