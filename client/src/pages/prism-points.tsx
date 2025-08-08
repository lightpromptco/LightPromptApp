import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Gem, Star, Trophy, Target, Calendar, Users, 
  Zap, Heart, Brain, Sparkles, Crown, Gift 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const POINT_CATEGORIES = [
  { id: 'reflection', name: 'Reflection', icon: Brain, color: 'text-blue-500', points: 10 },
  { id: 'checkin', name: 'Check-in', icon: Calendar, color: 'text-green-500', points: 15 },
  { id: 'challenge', name: 'Challenge', icon: Target, color: 'text-orange-500', points: 25 },
  { id: 'community', name: 'Community', icon: Users, color: 'text-purple-500', points: 20 },
  { id: 'milestone', name: 'Milestone', icon: Trophy, color: 'text-yellow-500', points: 50 },
  { id: 'easter_egg', name: 'Easter Egg', icon: Gem, color: 'text-pink-500', points: 30 }
];

const TIER_THRESHOLDS = [
  { name: 'Seeker', min: 0, max: 99, icon: Star, color: 'text-gray-500', badge: 'bg-gray-100' },
  { name: 'Explorer', min: 100, max: 299, icon: Zap, color: 'text-blue-500', badge: 'bg-blue-100' },
  { name: 'Mystic', min: 300, max: 699, icon: Sparkles, color: 'text-purple-500', badge: 'bg-purple-100' },
  { name: 'Sage', min: 700, max: 1499, icon: Crown, color: 'text-yellow-500', badge: 'bg-yellow-100' },
  { name: 'Luminary', min: 1500, max: Infinity, icon: Gem, color: 'text-pink-500', badge: 'bg-pink-100' }
];

const ACHIEVEMENTS = [
  { id: 'first_reflection', name: 'First Light', description: 'Complete your first reflection', points: 10, icon: Brain },
  { id: 'week_streak', name: 'Weekly Warrior', description: '7-day reflection streak', points: 50, icon: Calendar },
  { id: 'month_streak', name: 'Monthly Master', description: '30-day reflection streak', points: 100, icon: Trophy },
  { id: 'community_helper', name: 'Community Soul', description: 'Help 10 community members', points: 75, icon: Heart },
  { id: 'easter_hunter', name: 'Mystery Hunter', description: 'Find 5 easter eggs', points: 150, icon: Gem },
  { id: 'location_explorer', name: 'World Wanderer', description: 'Check-in from 10 locations', points: 80, icon: Target },
  { id: 'vibe_matcher', name: 'Soul Connector', description: 'Make 5 vibe matches', points: 60, icon: Users },
  { id: 'wisdom_seeker', name: 'Wisdom Seeker', description: 'Complete 50 reflections', points: 200, icon: Sparkles }
];

export default function PrismPointsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'overview' | 'history' | 'leaderboard'>('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/users/email/lightprompt.co@gmail.com'],
  });

  // Get user stats and points
  const { data: userStats } = useQuery({
    queryKey: ['/api/user-stats', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Get point history
  const { data: pointHistory = [] } = useQuery({
    queryKey: ['/api/prism-points/history', user?.id, selectedCategory],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Get leaderboard
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['/api/prism-points/leaderboard'],
    refetchInterval: 30000,
  });

  // Get achievements
  const { data: userAchievements = [] } = useQuery({
    queryKey: ['/api/achievements', user?.id],
    enabled: !!user?.id,
  });

  const currentPoints = userStats?.totalPoints || 0;
  const currentTier = TIER_THRESHOLDS.find(tier => currentPoints >= tier.min && currentPoints <= tier.max) || TIER_THRESHOLDS[0];
  const nextTier = TIER_THRESHOLDS.find(tier => tier.min > currentPoints);
  const progressToNext = nextTier ? ((currentPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100;

  const earnedAchievements = ACHIEVEMENTS.filter(achievement => 
    userAchievements.some((ua: any) => ua.achievementId === achievement.id)
  );
  const availableAchievements = ACHIEVEMENTS.filter(achievement => 
    !userAchievements.some((ua: any) => ua.achievementId === achievement.id)
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Gem className="h-12 w-12 mx-auto text-purple-500" />
        <h1 className="text-3xl font-bold">Prism Points</h1>
        <p className="text-muted-foreground">Track your soul-tech journey and unlock rewards</p>
      </div>

      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Tier */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentTier.badge}`}>
                <currentTier.icon className={`h-8 w-8 ${currentTier.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{currentTier.name}</h3>
                <p className="text-2xl font-bold text-purple-600">{currentPoints}</p>
                <p className="text-sm text-muted-foreground">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress to Next Tier */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Next Tier Progress</h3>
              {nextTier ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{currentTier.name}</span>
                    <span className="text-sm">{nextTier.name}</span>
                  </div>
                  <Progress value={progressToNext} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    {nextTier.min - currentPoints} points to {nextTier.name}
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <Crown className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                  <p className="font-medium">Maximum Tier Reached!</p>
                  <p className="text-sm text-muted-foreground">You've achieved Luminary status</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Streak Days</span>
                  <span className="font-medium">{userStats?.streakDays || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Reflections</span>
                  <span className="font-medium">{userStats?.reflectionsCompleted || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Achievements</span>
                  <span className="font-medium">{earnedAchievements.length}/{ACHIEVEMENTS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Easter Eggs</span>
                  <span className="font-medium">{userStats?.easterEggsFound || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Tabs */}
      <div className="flex justify-center space-x-2">
        {[
          { mode: 'overview', label: 'Overview', icon: Sparkles },
          { mode: 'history', label: 'Point History', icon: Calendar },
          { mode: 'leaderboard', label: 'Leaderboard', icon: Trophy }
        ].map(({ mode, label, icon: Icon }) => (
          <Button
            key={mode}
            variant={viewMode === mode ? "default" : "outline"}
            onClick={() => setViewMode(mode as any)}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {viewMode === 'overview' && (
        <div className="space-y-6">
          {/* Point Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Point Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {POINT_CATEGORIES.map((category) => (
                  <div key={category.id} className="p-4 border rounded-lg text-center">
                    <category.icon className={`h-8 w-8 mx-auto mb-2 ${category.color}`} />
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-muted-foreground">+{category.points} points</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earned Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Earned Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {earnedAchievements.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No achievements yet. Start your journey!
                    </p>
                  ) : (
                    earnedAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                          <achievement.icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="secondary">+{achievement.points}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Available Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Available Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableAchievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 border rounded-lg opacity-60">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <achievement.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <Badge variant="outline">+{achievement.points}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {viewMode === 'history' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Point History</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={selectedCategory === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Button>
                {POINT_CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {pointHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No point history found. Start earning points by engaging with the platform!
              </div>
            ) : (
              <div className="space-y-3">
                {pointHistory.map((entry: any) => {
                  const category = POINT_CATEGORIES.find(c => c.id === entry.category);
                  return (
                    <div key={entry.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      {category && (
                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center`}>
                          <category.icon className={`h-4 w-4 ${category.color}`} />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{entry.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">+{entry.points}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === 'leaderboard' && (
        <Card>
          <CardHeader>
            <CardTitle>Community Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Leaderboard loading...
                </div>
              ) : (
                leaderboard.map((entry: any, index: number) => {
                  const tier = TIER_THRESHOLDS.find(t => entry.totalPoints >= t.min && entry.totalPoints <= t.max) || TIER_THRESHOLDS[0];
                  const isCurrentUser = entry.userId === user?.id;
                  return (
                    <div key={entry.userId} className={`flex items-center space-x-3 p-3 border rounded-lg ${isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <Avatar>
                          <AvatarImage src={entry.user?.avatarUrl} />
                          <AvatarFallback>{entry.user?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{entry.user?.name || 'Anonymous'}</p>
                          <Badge className={tier.badge}>
                            <tier.icon className={`h-3 w-3 mr-1 ${tier.color}`} />
                            {tier.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.reflectionsCompleted || 0} reflections • {entry.streakDays || 0} day streak
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{entry.totalPoints}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}