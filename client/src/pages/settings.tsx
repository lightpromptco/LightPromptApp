import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Bell,
  Shield,
  Palette,
  Settings,
  Camera,
  Heart,
  Star,
  Sparkles,
  Wand2,
  Target,
  Users,
  MessageCircle,
  Home
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [currentUserId] = useState("4208c9e4-2a5d-451b-9a54-44f0ab6d7313"); // Admin user
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile from Supabase
  const { data: userProfile, isLoading } = useQuery({
    queryKey: [`/api/users/${currentUserId}/profile`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/users/${currentUserId}/profile`);
      if (response.ok) {
        return response.json();
      }
      // If no profile exists, return defaults
      return {
        displayName: "LightPrompt User",
        username: "lightprompt_explorer", 
        bio: "Exploring consciousness through soul-tech ✨",
        profileImageUrl: "",
        phone: "",
        website: "",
        location: "Temple, TX",
        timezone: "UTC-8",
        language: "en",
        emotionalTone: "warm",
        coreValues: ["authenticity", "growth", "compassion"],
        archetypes: ["seeker", "creator"],
        intentions: ["friendship", "growth"],
        vibeMatchEnabled: false,
        vibeMatchBio: "",
        notificationSettings: {
          reflection: true,
          community: true,
          challenges: false,
          marketing: false,
          email: true,
          push: true,
          sound: true
        },
        privacySettings: {
          profileVisibility: "public",
          showActivity: true,
          allowMessages: true,
          dataSharing: false
        },
        appearanceSettings: {
          darkMode: false,
          circadianSync: true,
          soundEffects: true
        }
      };
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest("PATCH", `/api/users/${currentUserId}/profile`, updates);
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/profile`] });
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Helper to update profile data
  const updateField = (field: string, value: any) => {
    queryClient.setQueryData([`/api/users/${currentUserId}/profile`], (old: any) => ({
      ...old,
      [field]: value
    }));
  };

  const updateNestedField = (section: string, field: string, value: any) => {
    queryClient.setQueryData([`/api/users/${currentUserId}/profile`], (old: any) => ({
      ...old,
      [section]: {
        ...old[section],
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleProfileImageUpload = async () => {
    try {
      const response = await apiRequest("POST", "/api/objects/upload");
      const data = await response.json();
      return {
        method: "PUT" as const,
        url: data.uploadURL,
      };
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to get upload URL. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUploadComplete = async (result: any) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      const imageUrl = uploadedFile.uploadURL;
      
      try {
        await apiRequest("PUT", "/api/profile/image", {
          imageURL: imageUrl,
        });
        
        updateField('profileImageUrl', imageUrl);
        toast({
          title: "Profile Photo Updated",
          description: "Your profile photo has been updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "Failed to update profile photo. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveProfile = () => {
    const updates = {
      displayName: userProfile?.displayName,
      username: userProfile?.username,
      bio: userProfile?.bio,
      phone: userProfile?.phone,
      website: userProfile?.website,
      location: userProfile?.location,
      timezone: userProfile?.timezone,
      language: userProfile?.language,
    };
    updateProfileMutation.mutate(updates);
  };

  const handleSaveNotifications = () => {
    const updates = {
      notificationSettings: userProfile?.notificationSettings
    };
    updateProfileMutation.mutate(updates);
  };

  const handleSavePrivacy = () => {
    const updates = {
      privacySettings: userProfile?.privacySettings
    };
    updateProfileMutation.mutate(updates);
  };

  const handleSaveAppearance = () => {
    const updates = {
      appearanceSettings: userProfile?.appearanceSettings
    };
    updateProfileMutation.mutate(updates);
  };

  const handleSaveVibeMatch = () => {
    const updates = {
      emotionalTone: userProfile?.emotionalTone,
      coreValues: userProfile?.coreValues,
      archetypes: userProfile?.archetypes,
      intentions: userProfile?.intentions,
      vibeMatchEnabled: userProfile?.vibeMatchEnabled,
      vibeMatchBio: userProfile?.vibeMatchBio,
    };
    updateProfileMutation.mutate(updates);
  };

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "vibematch", label: "VibeMatch", icon: Heart },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Home className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      data-testid={`tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-teal-600" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={userProfile?.profileImageUrl} alt="Profile" />
                      <AvatarFallback className="bg-teal-100 text-teal-700 text-lg font-semibold">
                        {userProfile?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <ObjectUploader
                        maxNumberOfFiles={1}
                        maxFileSize={5242880}
                        onGetUploadParameters={handleProfileImageUpload}
                        onComplete={handleUploadComplete}
                        buttonClassName="bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </ObjectUploader>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload a photo to personalize your profile
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Display Name</Label>
                      <Input
                        id="display-name"
                        data-testid="input-display-name"
                        value={userProfile?.displayName || ""}
                        onChange={(e) => updateField('displayName', e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        data-testid="input-username"
                        value={userProfile?.username || ""}
                        onChange={(e) => updateField('username', e.target.value)}
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      data-testid="input-bio"
                      value={userProfile?.bio || ""}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        data-testid="input-phone"
                        value={userProfile?.phone || ""}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        data-testid="input-website"
                        value={userProfile?.website || ""}
                        onChange={(e) => updateField('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        data-testid="input-location"
                        value={userProfile?.location || ""}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={userProfile?.timezone || "UTC-8"} onValueChange={(value) => updateField('timezone', value)}>
                        <SelectTrigger data-testid="select-timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                          <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={userProfile?.language || "en"} onValueChange={(value) => updateField('language', value)}>
                        <SelectTrigger data-testid="select-language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveProfile} className="bg-teal-600 hover:bg-teal-700" data-testid="button-save-profile">
                      Save Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "vibematch" && (
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span>VibeMatch Profile</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Connect through resonance - your emotional tone, values, and authentic self
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Enable VibeMatch */}
                  <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div>
                      <h3 className="font-medium text-pink-900">Enable VibeMatch</h3>
                      <p className="text-sm text-pink-700">Allow others to discover you through resonance matching</p>
                    </div>
                    <Switch
                      checked={userProfile?.vibeMatchEnabled || false}
                      onCheckedChange={(checked) => updateField('vibeMatchEnabled', checked)}
                      data-testid="switch-vibematch-enabled"
                    />
                  </div>

                  {userProfile?.vibeMatchEnabled && (
                    <>
                      {/* Emotional Tone */}
                      <div className="space-y-2">
                        <Label htmlFor="emotional-tone">Emotional Tone</Label>
                        <Select 
                          value={userProfile?.emotionalTone || "warm"} 
                          onValueChange={(value) => updateField('emotionalTone', value)}
                        >
                          <SelectTrigger data-testid="select-emotional-tone">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="warm">Warm & Nurturing</SelectItem>
                            <SelectItem value="cool">Cool & Analytical</SelectItem>
                            <SelectItem value="intense">Intense & Passionate</SelectItem>
                            <SelectItem value="gentle">Gentle & Peaceful</SelectItem>
                            <SelectItem value="playful">Playful & Lighthearted</SelectItem>
                            <SelectItem value="mysterious">Mysterious & Intuitive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Core Values */}
                      <div className="space-y-3">
                        <Label>Core Values</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {["authenticity", "growth", "compassion", "adventure", "wisdom", "creativity", "service", "freedom", "connection", "balance"].map((value) => (
                            <div key={value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`value-${value}`}
                                checked={userProfile?.coreValues?.includes(value) || false}
                                onCheckedChange={(checked) => {
                                  const values = userProfile?.coreValues || [];
                                  if (checked) {
                                    updateField('coreValues', [...values, value]);
                                  } else {
                                    updateField('coreValues', values.filter((v: string) => v !== value));
                                  }
                                }}
                                data-testid={`checkbox-value-${value}`}
                              />
                              <Label htmlFor={`value-${value}`} className="text-sm capitalize">
                                {value}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Archetypes */}
                      <div className="space-y-3">
                        <Label>Archetypes</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {["seeker", "creator", "healer", "warrior", "sage", "lover", "magician", "innocent", "explorer", "caregiver"].map((archetype) => (
                            <div key={archetype} className="flex items-center space-x-2">
                              <Checkbox
                                id={`archetype-${archetype}`}
                                checked={userProfile?.archetypes?.includes(archetype) || false}
                                onCheckedChange={(checked) => {
                                  const archetypes = userProfile?.archetypes || [];
                                  if (checked) {
                                    updateField('archetypes', [...archetypes, archetype]);
                                  } else {
                                    updateField('archetypes', archetypes.filter((a: string) => a !== archetype));
                                  }
                                }}
                                data-testid={`checkbox-archetype-${archetype}`}
                              />
                              <Label htmlFor={`archetype-${archetype}`} className="text-sm capitalize">
                                {archetype}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Intentions */}
                      <div className="space-y-3">
                        <Label>Connection Intentions</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {["friendship", "collaboration", "mentorship", "romance", "growth", "support", "creativity", "learning", "adventure", "healing"].map((intention) => (
                            <div key={intention} className="flex items-center space-x-2">
                              <Checkbox
                                id={`intention-${intention}`}
                                checked={userProfile?.intentions?.includes(intention) || false}
                                onCheckedChange={(checked) => {
                                  const intentions = userProfile?.intentions || [];
                                  if (checked) {
                                    updateField('intentions', [...intentions, intention]);
                                  } else {
                                    updateField('intentions', intentions.filter((i: string) => i !== intention));
                                  }
                                }}
                                data-testid={`checkbox-intention-${intention}`}
                              />
                              <Label htmlFor={`intention-${intention}`} className="text-sm capitalize">
                                {intention}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* VibeMatch Bio */}
                      <div className="space-y-2">
                        <Label htmlFor="vibematch-bio">VibeMatch Bio</Label>
                        <Textarea
                          id="vibematch-bio"
                          data-testid="input-vibematch-bio"
                          value={userProfile?.vibeMatchBio || ""}
                          onChange={(e) => updateField('vibeMatchBio', e.target.value)}
                          placeholder="Share what you're seeking in connection - this is shown to potential matches..."
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveVibeMatch} className="bg-pink-600 hover:bg-pink-700" data-testid="button-save-vibematch">
                      Save VibeMatch Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Reflection Reminders</p>
                          <p className="text-sm text-gray-500">Daily prompts and check-ins</p>
                        </div>
                        <Switch
                          checked={userProfile?.notificationSettings?.reflection || false}
                          onCheckedChange={(checked) => updateNestedField('notificationSettings', 'reflection', checked)}
                          data-testid="switch-notification-reflection"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Community Updates</p>
                          <p className="text-sm text-gray-500">New posts and interactions</p>
                        </div>
                        <Switch
                          checked={userProfile?.notificationSettings?.community || false}
                          onCheckedChange={(checked) => updateNestedField('notificationSettings', 'community', checked)}
                          data-testid="switch-notification-community"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Challenge Invites</p>
                          <p className="text-sm text-gray-500">New wellness challenges</p>
                        </div>
                        <Switch
                          checked={userProfile?.notificationSettings?.challenges || false}
                          onCheckedChange={(checked) => updateNestedField('notificationSettings', 'challenges', checked)}
                          data-testid="switch-notification-challenges"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Marketing & Updates</p>
                          <p className="text-sm text-gray-500">Product news and features</p>
                        </div>
                        <Switch
                          checked={userProfile?.notificationSettings?.marketing || false}
                          onCheckedChange={(checked) => updateNestedField('notificationSettings', 'marketing', checked)}
                          data-testid="switch-notification-marketing"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Push Notifications */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Enable Push Notifications</p>
                          <p className="text-sm text-gray-500">Receive notifications on your device</p>
                        </div>
                        <Switch
                          checked={userProfile?.notificationSettings?.push || false}
                          onCheckedChange={(checked) => updateNestedField('notificationSettings', 'push', checked)}
                          data-testid="switch-notification-push"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Sound Effects</p>
                          <p className="text-sm text-gray-500">Play sounds with notifications</p>
                        </div>
                        <Switch
                          checked={userProfile?.notificationSettings?.sound || false}
                          onCheckedChange={(checked) => updateNestedField('notificationSettings', 'sound', checked)}
                          data-testid="switch-notification-sound"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveNotifications} className="bg-blue-600 hover:bg-blue-700" data-testid="button-save-notifications">
                      Save Notifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Privacy & Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Profile Visibility</p>
                        <p className="text-sm text-gray-500">Who can see your profile</p>
                      </div>
                      <Select 
                        value={userProfile?.privacySettings?.profileVisibility || "public"} 
                        onValueChange={(value) => updateNestedField('privacySettings', 'profileVisibility', value)}
                      >
                        <SelectTrigger className="w-32" data-testid="select-privacy-visibility">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show Activity Status</p>
                        <p className="text-sm text-gray-500">Let others see when you're active</p>
                      </div>
                      <Switch
                        checked={userProfile?.privacySettings?.showActivity || false}
                        onCheckedChange={(checked) => updateNestedField('privacySettings', 'showActivity', checked)}
                        data-testid="switch-privacy-activity"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Allow Messages</p>
                        <p className="text-sm text-gray-500">Receive messages from other users</p>
                      </div>
                      <Switch
                        checked={userProfile?.privacySettings?.allowMessages || false}
                        onCheckedChange={(checked) => updateNestedField('privacySettings', 'allowMessages', checked)}
                        data-testid="switch-privacy-messages"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Data Sharing</p>
                        <p className="text-sm text-gray-500">Share anonymized data for research</p>
                      </div>
                      <Switch
                        checked={userProfile?.privacySettings?.dataSharing || false}
                        onCheckedChange={(checked) => updateNestedField('privacySettings', 'dataSharing', checked)}
                        data-testid="switch-privacy-data-sharing"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSavePrivacy} className="bg-green-600 hover:bg-green-700" data-testid="button-save-privacy">
                      Save Privacy Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "appearance" && (
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <span>Appearance & Interface</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-500">Use dark theme throughout the app</p>
                      </div>
                      <Switch
                        checked={userProfile?.appearanceSettings?.darkMode || false}
                        onCheckedChange={(checked) => updateNestedField('appearanceSettings', 'darkMode', checked)}
                        data-testid="switch-appearance-dark-mode"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Circadian Sync</p>
                        <p className="text-sm text-gray-500">Automatically adjust theme based on time</p>
                      </div>
                      <Switch
                        checked={userProfile?.appearanceSettings?.circadianSync || false}
                        onCheckedChange={(checked) => updateNestedField('appearanceSettings', 'circadianSync', checked)}
                        data-testid="switch-appearance-circadian"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Sound Effects</p>
                        <p className="text-sm text-gray-500">Play ambient sounds and feedback</p>
                      </div>
                      <Switch
                        checked={userProfile?.appearanceSettings?.soundEffects || false}
                        onCheckedChange={(checked) => updateNestedField('appearanceSettings', 'soundEffects', checked)}
                        data-testid="switch-appearance-sound"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveAppearance} className="bg-purple-600 hover:bg-purple-700" data-testid="button-save-appearance">
                      Save Appearance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "account" && (
              <Card className="border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span>Account Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h3 className="font-medium text-amber-900 mb-2">Current Plan</h3>
                      <p className="text-sm text-amber-800">LightPrompt Admin Access</p>
                      <Badge className="mt-2 bg-amber-100 text-amber-800">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">Account Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" data-testid="button-export-data">
                          <Target className="w-4 h-4 mr-2" />
                          Export My Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start" data-testid="button-delete-account">
                          <Wand2 className="w-4 h-4 mr-2" />
                          Reset All Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}