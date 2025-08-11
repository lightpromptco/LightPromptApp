import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, Shield, Users, Bell, User, RefreshCw, HelpCircle, Mail, ChevronRight } from "lucide-react";

interface UserProfile {
  userId: string;
  soulSyncEnabled: boolean;
  soulSyncVisibility: 'private' | 'friends' | 'public';
  matchingPreferences: {
    ageRange?: [number, number];
    location?: string;
    interests?: string[];
    wellnessGoals?: string[];
  };
  privacySettings: {
    dataSharing: 'private' | 'friends' | 'public';
    profileVisibility: 'private' | 'friends' | 'public';
    locationSharing: boolean;
    activityVisible: boolean;
  };
  preferences: {
    notifications?: {
      email: boolean;
      push: boolean;
      soulSyncUpdates: boolean;
      weeklyReports: boolean;
    };
    theme?: 'light' | 'dark' | 'auto';
  };
}

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Load current user from Supabase backend validation - NEVER localStorage
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

  // Fetch user profile from Supabase
  const { data: profile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ['/api/auth/profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;
      try {
        const response = await fetch(`/api/auth/profile?userId=${currentUser.id}`);
        if (!response.ok) {
          // Create default profile if doesn't exist
          const createResponse = await fetch('/api/auth/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser.id,
              soulSyncEnabled: false,
              soulSyncVisibility: 'private',
              matchingPreferences: {},
              privacySettings: {
                dataSharing: 'private',
                profileVisibility: 'friends',
                locationSharing: false,
                activityVisible: false
              },
              preferences: {
                notifications: {
                  email: true,
                  push: true,
                  soulSyncUpdates: true,
                  weeklyReports: false
                },
                theme: 'auto'
              }
            })
          });
          if (createResponse.ok) {
            return await createResponse.json();
          }
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Return default profile structure
        return {
          userId: currentUser.id,
          soulSyncEnabled: false,
          soulSyncVisibility: 'private',
          matchingPreferences: {},
          privacySettings: {
            dataSharing: 'private',
            profileVisibility: 'friends',
            locationSharing: false,
            activityVisible: true,
          },
          preferences: {
            notifications: {
              email: true,
              push: true,
              soulSyncUpdates: true,
              weeklyReports: false,
            },
            theme: 'light',
          },
        };
      }
      return response.json();
    },
    enabled: !!currentUser?.id,
  });

  // Update Soul Sync settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<UserProfile>) => {
      const response = await fetch('/api/auth/soul-sync-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          settings,
        }),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your Soul Sync preferences have been saved to Supabase database.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      console.error('Settings update error:', error);
    },
  });

  const handleSoulSyncToggle = (enabled: boolean) => {
    updateSettingsMutation.mutate({
      soulSyncEnabled: enabled,
      privacySettings: profile?.privacySettings || {
        dataSharing: 'private',
        profileVisibility: 'friends',
        locationSharing: false,
        activityVisible: true,
      },
    });
  };

  const handleVisibilityChange = (visibility: 'private' | 'friends' | 'public') => {
    updateSettingsMutation.mutate({
      soulSyncVisibility: visibility,
      privacySettings: {
        ...profile?.privacySettings,
        profileVisibility: visibility,
      },
    });
  };

  const handlePrivacyChange = (key: string, value: any) => {
    const newPrivacySettings = {
      ...profile?.privacySettings,
      [key]: value,
    };
    
    updateSettingsMutation.mutate({
      privacySettings: newPrivacySettings,
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to access settings.</p>
          <Button onClick={() => window.location.href = '/chat'}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple-style header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              {currentUser?.email && (
                <p className="text-sm text-gray-500 mt-1">
                  {currentUser.name || currentUser.email}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={profileLoading}
              className="text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${profileLoading ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Apple-style content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          
          {/* Soul Sync - Apple-style card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Soul Sync</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">Connect and share wellness data with trusted friends</p>
            </div>
            
            {profileLoading ? (
              <div className="px-6 py-8 space-y-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* Master Toggle */}
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-base font-medium text-gray-900">Enable Soul Sync</div>
                    <div className="text-sm text-gray-500">Share your wellness journey with others</div>
                  </div>
                  <Switch
                    checked={profile?.soulSyncEnabled || false}
                    onCheckedChange={handleSoulSyncToggle}
                    disabled={updateSettingsMutation.isPending}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                {profile?.soulSyncEnabled && (
                  <>
                    {/* Visibility Setting */}
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-base font-medium text-gray-900">Who can find you</div>
                          <div className="text-sm text-gray-500">Control your profile visibility</div>
                        </div>
                        <div className="w-32">
                          <Select
                            value={profile?.soulSyncVisibility || 'private'}
                            onValueChange={handleVisibilityChange}
                            disabled={updateSettingsMutation.isPending}
                          >
                            <SelectTrigger className="h-9 border-gray-300 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Just me</SelectItem>
                              <SelectItem value="friends">Friends</SelectItem>
                              <SelectItem value="public">Everyone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Data Sharing Controls */}
                    <div className="px-6 py-4">
                      <div className="text-base font-medium text-gray-900 mb-4">Share Data</div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">Wellness Metrics</div>
                            <div className="text-xs text-gray-500">Mood, energy, and progress data</div>
                          </div>
                          <Switch
                            checked={profile?.privacySettings?.activityVisible !== false}
                            onCheckedChange={(checked) => handlePrivacyChange('activityVisible', checked)}
                            disabled={updateSettingsMutation.isPending}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">Location Data</div>
                            <div className="text-xs text-gray-500">Mindfulness spots and check-ins</div>
                          </div>
                          <Switch
                            checked={profile?.privacySettings?.locationSharing || false}
                            onCheckedChange={(checked) => handlePrivacyChange('locationSharing', checked)}
                            disabled={updateSettingsMutation.isPending}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Privacy & Data - Apple style */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gray-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Privacy & Data</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">Your data is encrypted and secure</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="px-6 py-4">
                <div className="text-base font-medium text-gray-900 mb-2">Data Storage</div>
                <div className="text-sm text-gray-500 leading-relaxed">
                  Your personal data is securely stored in Supabase with enterprise-grade encryption. 
                  Astrological calculations happen locally using Swiss Ephemeris for maximum accuracy and privacy.
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-base font-medium text-gray-900">Data Export</div>
                    <div className="text-sm text-gray-500">Download all your data anytime</div>
                  </div>
                  <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-base font-medium text-red-600">Delete Account</div>
                    <div className="text-sm text-gray-500">Permanently remove all your data</div>
                  </div>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications - Apple style */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">Choose what updates you want to receive</p>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-base font-medium text-gray-900">Soul Sync Updates</div>
                  <div className="text-sm text-gray-500">When friends share new insights</div>
                </div>
                <Switch
                  checked={profile?.preferences?.notifications?.soulSyncUpdates !== false}
                  onCheckedChange={(checked) => handlePrivacyChange('notifications', { 
                    ...profile?.preferences?.notifications, 
                    soulSyncUpdates: checked 
                  })}
                  disabled={updateSettingsMutation.isPending}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
              
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-base font-medium text-gray-900">Weekly Reports</div>
                  <div className="text-sm text-gray-500">Your wellness progress summary</div>
                </div>
                <Switch
                  checked={profile?.preferences?.notifications?.weeklyReports !== false}
                  onCheckedChange={(checked) => handlePrivacyChange('notifications', { 
                    ...profile?.preferences?.notifications, 
                    weeklyReports: checked 
                  })}
                  disabled={updateSettingsMutation.isPending}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions - Apple style */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-base font-medium text-gray-900">Soul Sync Dashboard</div>
                    <div className="text-sm text-gray-500">View your connections and shared data</div>
                  </div>
                </div>
              </button>
              
              <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-base font-medium text-gray-900">Send Feedback</div>
                    <div className="text-sm text-gray-500">Help us improve LightPrompt</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}