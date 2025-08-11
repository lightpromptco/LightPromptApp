import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  Loader2
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    reflection: true,
    community: true,
    challenges: false,
    marketing: false
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    avatarUrl: ""
  });
  const { toast } = useToast();

  // Load user data on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setProfile({
            name: parsedUser.name || "",
            email: parsedUser.email || "",
            bio: parsedUser.bio || "",
            location: parsedUser.location || "",
            timezone: parsedUser.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            avatarUrl: parsedUser.avatarUrl || ""
          });
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('lightprompt-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const response = await apiRequest('PUT', `/api/users/${user.id}/profile`, profile);
      
      // Update local storage and user state
      const updatedUser = { ...user, ...profile };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    
    try {
      await apiRequest('PUT', `/api/users/${user.id}/notifications`, notifications);
      
      toast({
        title: "Notification Settings Updated",
        description: "Your preferences have been saved.",
      });
    } catch (error) {
      console.error('Failed to save notifications:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive"
      });
    }
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest('POST', '/api/objects/upload');
    return {
      method: 'PUT' as const,
      url: response.uploadURL,
    };
  };

  const handleAvatarUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (!user || result.successful.length === 0) return;
    
    setUploading(true);
    try {
      const uploadURL = result.successful[0].uploadURL;
      
      // Update user avatar
      const updatedProfile = { ...profile, avatarUrl: uploadURL };
      setProfile(updatedProfile);
      
      // Save to backend
      await apiRequest('PUT', `/api/users/${user.id}/avatar`, { avatarUrl: uploadURL });
      
      // Update local storage
      const updatedUser = { ...user, avatarUrl: uploadURL };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast({
        title: "Avatar Updated",
        description: "Your profile photo has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Failed to save avatar:', error);
      toast({
        title: "Error",
        description: "Failed to save profile photo.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access your settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your LightPrompt experience</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="text-xl">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'LP'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={5242880} // 5MB
                  onGetUploadParameters={handleGetUploadParameters}
                  onComplete={handleAvatarUploadComplete}
                  buttonClassName="w-8 h-8 p-0 bg-teal-600 hover:bg-teal-700 rounded-full"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Camera className="w-4 h-4 text-white" />
                  )}
                </ObjectUploader>
              </div>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="text-xs">
                {user.tier === 'admin' ? 'Admin' : user.tier === 'free' ? 'Free Tier' : 'Premium'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Click camera icon to upload photo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your journey..."
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Where are you based?"
                value={profile.location}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={profile.timezone}
              onChange={(e) => setProfile({...profile, timezone: e.target.value})}
              placeholder="e.g., America/Los_Angeles"
            />
          </div>

          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Daily Reflection Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get gentle nudges for your reflection practice
                </p>
              </div>
              <Switch
                checked={notifications.reflection}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, reflection: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Community Updates</Label>
                <p className="text-sm text-muted-foreground">
                  New posts, comments, and connections
                </p>
              </div>
              <Switch
                checked={notifications.community}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, community: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Challenge Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Updates on your wellness challenges
                </p>
              </div>
              <Switch
                checked={notifications.challenges}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, challenges: checked})
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Newsletter & Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Product updates and conscious tech insights
                </p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, marketing: checked})
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications}>
            <Save className="w-4 h-4 mr-2" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch to dark theme for better evening reflection
              </p>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={(checked) => {
                setIsDarkMode(checked);
                // Apply theme immediately
                if (checked) {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('lightprompt-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('lightprompt-theme', 'light');
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-6">
        <p className="text-sm text-muted-foreground">
          Changes are saved automatically to your LightPrompt account.
        </p>
      </div>
    </div>
  );
}