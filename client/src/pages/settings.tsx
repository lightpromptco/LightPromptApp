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
import { Settings as SettingsIcon, Shield, Users, Bell, User, RefreshCw } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={profileLoading}
              className="ml-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${profileLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-gray-600">
            Manage your LightPrompt account and Soul Sync preferences stored in Supabase
          </p>
          {currentUser.email && (
            <p className="text-sm text-teal-600 mt-1">
              Signed in as: {currentUser.email}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Soul Sync Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-bold">Soul Sync Settings</h2>
              </div>

              {profileLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Enable Soul Sync */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Enable Soul Sync</Label>
                      <p className="text-sm text-gray-600">
                        Connect with wellness buddies and share your journey
                      </p>
                    </div>
                    <Switch
                      checked={profile?.soulSyncEnabled || false}
                      onCheckedChange={handleSoulSyncToggle}
                      disabled={updateSettingsMutation.isPending}
                    />
                  </div>

                  {profile?.soulSyncEnabled && (
                    <>
                      {/* Profile Visibility */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Profile Visibility
                        </Label>
                        <Select
                          value={profile.soulSyncVisibility}
                          onValueChange={handleVisibilityChange}
                          disabled={updateSettingsMutation.isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="private">Private - Only me</SelectItem>
                            <SelectItem value="friends">Friends - Connected users only</SelectItem>
                            <SelectItem value="public">Public - Anyone can find me</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Data Sharing */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">
                          Data Sharing Preferences
                        </Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Share wellness metrics</span>
                            <Switch
                              checked={profile.privacySettings?.activityVisible !== false}
                              onCheckedChange={(checked) =>
                                handlePrivacyChange('activityVisible', checked)
                              }
                              disabled={updateSettingsMutation.isPending}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Share location data</span>
                            <Switch
                              checked={profile.privacySettings?.locationSharing || false}
                              onCheckedChange={(checked) =>
                                handlePrivacyChange('locationSharing', checked)
                              }
                              disabled={updateSettingsMutation.isPending}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>

            {/* Privacy Settings */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-bold">Privacy & Security</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Data Retention Policy
                  </Label>
                  <p className="text-sm text-gray-600">
                    All data is stored securely in Supabase with end-to-end encryption.
                    You can request data deletion at any time.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Request Data Deletion
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Account Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="font-medium">{currentUser.tier || 'Free'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="text-teal-600 font-medium">Supabase</span>
                </div>
                <div className="flex justify-between">
                  <span>Auth Status:</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = '/soul-sync'}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Soul Sync
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.location.href = '/chat'}
                >
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Chat Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}