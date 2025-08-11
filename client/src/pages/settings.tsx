import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  Lock
} from "lucide-react";

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    reflection: true,
    community: true,
    challenges: false,
    marketing: false
  });
  const [profile, setProfile] = useState({
    name: "LightPrompt User",
    email: "lightprompt.co@gmail.com",
    bio: "Exploring consciousness through soul-tech",
    timezone: "UTC-8"
  });
  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

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
            <Avatar className="w-20 h-20">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl">LP</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                Change Photo
              </Button>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF (max 2MB)
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

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your journey..."
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={profile.timezone}
              onChange={(e) => setProfile({...profile, timezone: e.target.value})}
            />
          </div>

          <Button onClick={handleSaveProfile}>
            Save Profile
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
              onCheckedChange={setIsDarkMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Circadian Rhythm Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust colors based on time of day
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Who can see your profile in the community
              </p>
            </div>
            <Badge variant="secondary">Community Members</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Data Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Share anonymized reflection patterns for research
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Download My Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base">Delete Account</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete your account and all associated data
            </p>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}