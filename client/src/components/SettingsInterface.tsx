import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { UserPreferences } from '@shared/schema';

interface SettingsInterfaceProps {
  userId: string;
}

export function SettingsInterface({ userId }: SettingsInterfaceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user preferences
  const { data: preferences, isLoading } = useQuery<UserPreferences>({
    queryKey: ['/api/user-preferences', userId],
    queryFn: async () => {
      const response = await fetch(`/api/user-preferences/${userId}`);
      if (!response.ok) {
        if (response.status === 404) {
          // Return default preferences if none exist
          return {
            id: '',
            userId,
            dataSharing: {
              wellness_metrics: 'private',
              habits: 'private',
              mood_patterns: 'private',
              growth_insights: 'private'
            },
            visibility: 'private',
            notifications: {
              daily_checkin_reminder: true,
              vibe_match_notifications: true,
              partner_updates: true,
              community_mentions: true,
              easter_egg_unlocks: true
            },
            trackingPreferences: {
              mood_tracking: true,
              energy_tracking: true,
              habit_reminders: true,
              pattern_insights: true
            },
            aiPersonality: 'balanced',
            aiIntensity: 5,
            aiGuidanceStyle: 'supportive',
            communitySettings: {
              default_anonymous: true,
              auto_moderate: true,
              notification_level: 'mentions_only'
            },
            partnerSettings: {
              auto_share_mood: false,
              auto_share_habits: false,
              share_insights: true,
              relationship_goals_visible: false
            },
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }
        throw new Error('Failed to fetch preferences');
      }
      return response.json();
    },
  });

  // Save preferences mutation
  const savePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<UserPreferences>) => {
      const response = await fetch(`/api/user-preferences/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to save preferences');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user-preferences'] });
      toast({
        title: "Settings saved!",
        description: "Your preferences have been updated.",
      });
    },
  });

  const updateSetting = (path: string, value: any) => {
    if (!preferences) return;
    
    const keys = path.split('.');
    const updatedPrefs = { ...preferences };
    let current: any = updatedPrefs;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    savePreferencesMutation.mutate(updatedPrefs);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  if (!preferences) return null;

  return (
    <div className="space-y-6">
      {/* Privacy & Data Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-shield-alt text-blue-500 mr-2"></i>
            Privacy & Data Sharing
          </CardTitle>
          <p className="text-sm text-gray-600">
            Control who can see your wellness data and insights
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Profile Visibility</Label>
            <Select 
              value={preferences.visibility} 
              onValueChange={(value) => updateSetting('visibility', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">🔒 Private - Only me</SelectItem>
                <SelectItem value="connections">👥 Connections - Partners & matches only</SelectItem>
                <SelectItem value="public">🌐 Public - Community visible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base font-medium">Data Sharing Settings</Label>
            {Object.entries(preferences.dataSharing as any).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="capitalize">
                  {key.replace('_', ' ')}
                </Label>
                <Select 
                  value={value as string} 
                  onValueChange={(newValue) => updateSetting(`dataSharing.${key}`, newValue)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="partners">Partners</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Personality Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-brain text-purple-500 mr-2"></i>
            AI Interaction Settings
          </CardTitle>
          <p className="text-sm text-gray-600">
            Customize how your AI companion communicates with you
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">AI Personality</Label>
            <Select 
              value={preferences.aiPersonality} 
              onValueChange={(value) => updateSetting('aiPersonality', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nurturing">🤗 Nurturing - Warm and supportive</SelectItem>
                <SelectItem value="wise">🧘 Wise - Thoughtful and philosophical</SelectItem>
                <SelectItem value="playful">😊 Playful - Light and encouraging</SelectItem>
                <SelectItem value="direct">💪 Direct - Straightforward and focused</SelectItem>
                <SelectItem value="mystical">✨ Mystical - Spiritual and intuitive</SelectItem>
                <SelectItem value="balanced">⚖️ Balanced - Adaptive to your needs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">
              Conversation Depth: {preferences.aiIntensity}/10
            </Label>
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="10"
                value={preferences.aiIntensity}
                onChange={(e) => updateSetting('aiIntensity', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Surface level</span>
                <span>Soul deep</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Guidance Style</Label>
            <Select 
              value={preferences.aiGuidanceStyle} 
              onValueChange={(value) => updateSetting('aiGuidanceStyle', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supportive">🫶 Supportive - Gentle encouragement</SelectItem>
                <SelectItem value="challenging">🎯 Challenging - Push your growth</SelectItem>
                <SelectItem value="exploratory">🔍 Exploratory - Question and discover</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-bell text-yellow-500 mr-2"></i>
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences.notifications as any).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="capitalize">
                {key.replace(/_/g, ' ')}
              </Label>
              <Switch
                checked={value as boolean}
                onCheckedChange={(checked) => updateSetting(`notifications.${key}`, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Partner Mode Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-heart text-pink-500 mr-2"></i>
            Partner Mode Settings
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configure what you share with connected partners
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences.partnerSettings as any).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <Label className="capitalize">
                  {key.replace(/_/g, ' ')}
                </Label>
                <p className="text-xs text-gray-500">
                  {key === 'auto_share_mood' && 'Automatically share daily mood check-ins'}
                  {key === 'auto_share_habits' && 'Share habit completions in real-time'}
                  {key === 'share_insights' && 'Share AI-generated growth insights'}
                  {key === 'relationship_goals_visible' && 'Show shared relationship goals'}
                </p>
              </div>
              <Switch
                checked={value as boolean}
                onCheckedChange={(checked) => updateSetting(`partnerSettings.${key}`, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Easter Egg Unlocks Section */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-gem text-purple-500 mr-2"></i>
            Unlocked Features
          </CardTitle>
          <p className="text-sm text-gray-600">
            Special features you've earned through your growth journey
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <i className="fas fa-magic text-4xl text-purple-300 mb-4"></i>
            <h4 className="font-medium text-gray-700 mb-2">No special features unlocked yet</h4>
            <p className="text-sm text-gray-600">
              Keep growing, connecting, and exploring to unlock hidden features!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}