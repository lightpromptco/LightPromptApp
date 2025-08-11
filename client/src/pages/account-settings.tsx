import { useState, useEffect } from 'react';
import { User, UserProfile, InsertUser } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ObjectUploader } from '@/components/ObjectUploader';
import { apiRequest } from '@/lib/queryClient';
import { 
  User as UserIcon, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Camera, 
  Save, 
  ArrowLeft,
  Moon,
  Sun,
  Loader2,
  MapPin,
  Heart,
  Zap,
  Users
} from 'lucide-react';
import { Link } from 'wouter';

interface AccountSettingsProps {
  user: User;
  userProfile?: UserProfile | null;
  onUserUpdate: (user: User) => void;
}

export function AccountSettings({ user, userProfile, onUserUpdate }: AccountSettingsProps) {
  const { toast } = useToast();
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    birthDate: '',
    occupation: '',
    interests: [] as string[]
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    dailyReflection: true,
    weeklyInsights: true,
    astrologyUpdates: true,
    communityActivity: false,
    soulSyncUpdates: true,
    geoPromptReminders: false,
    emailMarketing: false,
    pushNotifications: true
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    darkMode: false,
    circadianSync: true,
    compactMode: false,
    animationsEnabled: true,
    colorTheme: 'teal',
    fontSize: 'medium'
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'friends',
    shareAstrologyData: true,
    shareLocation: false,
    shareActivity: true,
    allowSoulSyncInvites: true,
    showOnlineStatus: true,
    dataSharing: 'limited'
  });

  // Platform preferences
  const [platform, setPlatform] = useState({
    vibematchEnabled: true,
    soulSyncAutoConnect: false,
    geopromptRadius: '5',
    communityParticipation: 'active',
    aiInteractionStyle: 'conversational',
    astrologyAccuracy: 'professional'
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Avatar upload functions
  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload");
    const data = await response.json();
    return {
      method: "PUT" as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: any) => {
    if (result.successful && result.successful.length > 0) {
      setUploading(true);
      try {
        const uploadURL = result.successful[0].uploadURL;
        const response = await apiRequest("PUT", `/api/users/${user.id}/avatar`, {
          avatarURL: uploadURL,
        });
        
        if (response.ok) {
          const { objectPath } = await response.json();
          const updatedUser = { ...user, avatarUrl: objectPath };
          onUserUpdate(updatedUser);
          toast({ title: "Profile photo updated successfully!" });
        }
      } catch (error) {
        console.error('Failed to update avatar:', error);
        toast({ 
          title: "Failed to update profile photo", 
          description: "Please try again",
          variant: "destructive" 
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      // Update user profile
      const userUpdates = {
        name: profile.name,
        email: profile.email
      };
      
      // Update user profile data
      const profileUpdates = {
        bio: profile.bio,
        location: profile.location,
        timezone: profile.timezone,
        birthDate: profile.birthDate,
        occupation: profile.occupation,
        interests: profile.interests,
        // Include all preferences
        preferences: {
          notifications,
          appearance,
          privacy,
          platform
        }
      };

      // Save user updates
      if (userUpdates.name !== user.name || userUpdates.email !== user.email) {
        const userResponse = await apiRequest("PUT", `/api/users/${user.id}`, userUpdates);
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          onUserUpdate(updatedUser);
        }
      }

      // Save profile updates
      const profileResponse = await apiRequest("PUT", `/api/users/${user.id}/profile`, profileUpdates);
      
      if (profileResponse.ok) {
        toast({ 
          title: "Settings saved successfully!", 
          description: "All your preferences have been updated."
        });
      }
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({ 
        title: "Failed to save settings", 
        description: "Please try again",
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'tier_29': return 'bg-amber-100 text-amber-800';
      case 'tier_49': return 'bg-indigo-100 text-indigo-800';
      case 'admin': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'tier_29': return '$29+ Tier';
      case 'tier_49': return '$49+ Tier';
      case 'admin': return 'Admin';
      default: return tier;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
              <p className="text-gray-600 dark:text-gray-400">Customize your LightPrompt experience</p>
            </div>
          </div>
          <Button 
            onClick={saveAllSettings}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="platform" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Platform</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt="Profile Photo" 
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-white" />
                      </div>
                    )}
                    
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={5242880} // 5MB
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                      buttonClassName="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-teal-600 hover:bg-teal-700 text-xs p-2"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </ObjectUploader>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Photo</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Upload a photo to help others recognize you in Soul Sync
                    </p>
                    <Badge className={getTierColor(user.tier)}>
                      {getTierName(user.tier)}
                    </Badge>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      placeholder="Your display name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    placeholder="Tell others a bit about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={profile.occupation}
                      onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                      placeholder="Your job title or profession"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'dailyReflection', label: 'Daily Reflection Reminders', desc: 'Get gentle nudges for your daily practice' },
                  { key: 'weeklyInsights', label: 'Weekly Astrological Insights', desc: 'Receive your personalized weekly readings' },
                  { key: 'astrologyUpdates', label: 'Transit Notifications', desc: 'Important planetary movements affecting you' },
                  { key: 'soulSyncUpdates', label: 'Soul Sync Activity', desc: 'When friends update their wellness data' },
                  { key: 'communityActivity', label: 'Community Highlights', desc: 'Popular discussions and shared insights' },
                  { key: 'geoPromptReminders', label: 'Location-Based Prompts', desc: 'Mindfulness reminders based on your location' },
                  { key: 'emailMarketing', label: 'Product Updates', desc: 'News about new features and courses' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Enable browser notifications' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">{label}</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                    </div>
                    <Switch
                      checked={notifications[key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, [key]: checked})
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Appearance Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center space-x-2">
                      <Moon className="w-4 h-4" />
                      <span>Dark Mode</span>
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Use dark theme for better night viewing</p>
                  </div>
                  <Switch
                    checked={appearance.darkMode}
                    onCheckedChange={(checked) => setAppearance({...appearance, darkMode: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium flex items-center space-x-2">
                      <Sun className="w-4 h-4" />
                      <span>Circadian Sync</span>
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically adjust colors based on time of day</p>
                  </div>
                  <Switch
                    checked={appearance.circadianSync}
                    onCheckedChange={(checked) => setAppearance({...appearance, circadianSync: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <Select value={appearance.colorTheme} onValueChange={(value) => setAppearance({...appearance, colorTheme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teal">Teal (Default)</SelectItem>
                      <SelectItem value="blue">Ocean Blue</SelectItem>
                      <SelectItem value="purple">Cosmic Purple</SelectItem>
                      <SelectItem value="amber">Warm Amber</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select value={appearance.fontSize} onValueChange={(value) => setAppearance({...appearance, fontSize: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy & Data Sharing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can see</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private - Only you</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {[
                  { key: 'shareAstrologyData', label: 'Share Astrological Data', desc: 'Allow friends to see your birth chart and readings' },
                  { key: 'shareLocation', label: 'Share Location Data', desc: 'Enable location-based features and sharing' },
                  { key: 'shareActivity', label: 'Share Activity Status', desc: 'Show when you\'re active or last seen' },
                  { key: 'allowSoulSyncInvites', label: 'Allow Soul Sync Invites', desc: 'Others can invite you to connect via Soul Sync' },
                  { key: 'showOnlineStatus', label: 'Show Online Status', desc: 'Display when you\'re currently active' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">{label}</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                    </div>
                    <Switch
                      checked={Boolean(privacy[key as keyof typeof privacy])}
                      onCheckedChange={(checked) => 
                        setPrivacy({...privacy, [key]: checked})
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Tab */}
          <TabsContent value="platform" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Platform Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'vibematchEnabled', label: 'VibeMatch Scoring', desc: 'Calculate compatibility scores with other users' },
                  { key: 'soulSyncAutoConnect', label: 'Auto-Connect Soul Sync', desc: 'Automatically accept certain connection requests' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">{label}</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                    </div>
                    <Switch
                      checked={Boolean(platform[key as keyof typeof platform])}
                      onCheckedChange={(checked) => 
                        setPlatform({...platform, [key]: checked})
                      }
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <Label>GeoPrompt Radius</Label>
                  <Select value={platform.geopromptRadius} onValueChange={(value) => setPlatform({...platform, geopromptRadius: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 mile</SelectItem>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="25">25 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>AI Interaction Style</Label>
                  <Select value={platform.aiInteractionStyle} onValueChange={(value) => setPlatform({...platform, aiInteractionStyle: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="mystical">Mystical</SelectItem>
                      <SelectItem value="scientific">Scientific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Astrology Accuracy</Label>
                  <Select value={platform.astrologyAccuracy} onValueChange={(value) => setPlatform({...platform, astrologyAccuracy: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic - Sun sign only</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Major aspects</SelectItem>
                      <SelectItem value="professional">Professional - Full chart analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button - Mobile */}
        <div className="md:hidden mt-8">
          <Button 
            onClick={saveAllSettings}
            disabled={saving}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}