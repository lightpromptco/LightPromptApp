import { useState } from "react";
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
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
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
  Settings,
  Heart,
  Globe,
  Eye,
  EyeOff,
  Smartphone,
  ChevronRight,
  LogOut,
  Download,
  Trash2,
  Star,
  Zap,
  Users,
  MessageCircle,
  Home
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [notifications, setNotifications] = useState({
    reflection: true,
    community: true,
    challenges: false,
    marketing: false,
    email: true,
    push: true,
    sound: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showActivity: true,
    allowMessages: true,
    dataSharing: false
  });
  const [profile, setProfile] = useState({
    name: "LightPrompt User",
    username: "lightprompt_explorer",
    email: "lightprompt.co@gmail.com",
    bio: "Exploring consciousness through soul-tech ✨",
    phone: "",
    website: "",
    location: "Temple, TX",
    timezone: "UTC-8",
    language: "en"
  });
  const { toast } = useToast();

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
        
        setProfileImage(imageUrl);
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

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "account", label: "Account", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 text-sm">Manage your LightPrompt experience</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-2 sticky top-24">
              <nav className="space-y-1">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-6 space-y-8">
                  {/* Profile Header */}
                  <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage src={profileImage} alt="Profile" />
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2">
                        <ObjectUploader
                          maxNumberOfFiles={1}
                          maxFileSize={5242880}
                          onGetUploadParameters={handleProfileImageUpload}
                          onComplete={handleUploadComplete}
                          buttonClassName="w-8 h-8 rounded-full bg-teal-500 hover:bg-teal-600 text-white p-0 shadow-md"
                        >
                          <Camera className="w-4 h-4" />
                        </ObjectUploader>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                      <p className="text-teal-600 font-medium">@{profile.username}</p>
                      <p className="text-gray-600 mt-1">{profile.bio}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {profile.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {profile.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Display Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="mt-1"
                          data-testid="input-name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                        <Input
                          id="username"
                          value={profile.username}
                          onChange={(e) => setProfile({...profile, username: e.target.value})}
                          className="mt-1"
                          data-testid="input-username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="mt-1"
                          data-testid="input-email"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                          className="mt-1"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({...profile, bio: e.target.value})}
                          placeholder="Tell us about your spiritual journey..."
                          className="mt-1 h-24"
                          data-testid="textarea-bio"
                        />
                      </div>

                      <div>
                        <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile({...profile, website: e.target.value})}
                          placeholder="https://yourwebsite.com"
                          className="mt-1"
                          data-testid="input-website"
                        />
                      </div>

                      <div>
                        <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          placeholder="City, State"
                          className="mt-1"
                          data-testid="input-location"
                        />
                      </div>

                      <div>
                        <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
                        <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                            <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                            <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                            <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveProfile} className="bg-teal-600 hover:bg-teal-700" data-testid="button-save-profile">
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="p-6 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                              <Heart className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                              <Label className="text-base font-medium">Daily Reflections</Label>
                              <p className="text-sm text-gray-600">Gentle reminders for your practice</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.reflection}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, reflection: checked})
                            }
                            data-testid="switch-reflection"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <Label className="text-base font-medium">Community Activity</Label>
                              <p className="text-sm text-gray-600">New connections and interactions</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.community}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, community: checked})
                            }
                            data-testid="switch-community"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Zap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <Label className="text-base font-medium">Challenge Updates</Label>
                              <p className="text-sm text-gray-600">Progress and new challenges</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.challenges}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, challenges: checked})
                            }
                            data-testid="switch-challenges"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Mail className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <Label className="text-base font-medium">Weekly Insights</Label>
                              <p className="text-sm text-gray-600">Personal growth summaries</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, email: checked})
                            }
                            data-testid="switch-email"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <Star className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <Label className="text-base font-medium">Product Updates</Label>
                              <p className="text-sm text-gray-600">New features and improvements</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.marketing}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, marketing: checked})
                            }
                            data-testid="switch-marketing"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                      <Button onClick={handleSaveNotifications} className="bg-teal-600 hover:bg-teal-700" data-testid="button-save-notifications">
                        Save Notification Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Eye className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Profile Visibility</Label>
                            <p className="text-sm text-gray-600">Who can see your profile</p>
                          </div>
                        </div>
                        <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="friends">Friends</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Allow Messages</Label>
                            <p className="text-sm text-gray-600">Let others send you messages</p>
                          </div>
                        </div>
                        <Switch
                          checked={privacy.allowMessages}
                          onCheckedChange={(checked) => 
                            setPrivacy({...privacy, allowMessages: checked})
                          }
                          data-testid="switch-messages"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Show Activity Status</Label>
                            <p className="text-sm text-gray-600">Let others see when you're active</p>
                          </div>
                        </div>
                        <Switch
                          checked={privacy.showActivity}
                          onCheckedChange={(checked) => 
                            setPrivacy({...privacy, showActivity: checked})
                          }
                          data-testid="switch-activity"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Data Sharing</Label>
                            <p className="text-sm text-gray-600">Share anonymized data for research</p>
                          </div>
                        </div>
                        <Switch
                          checked={privacy.dataSharing}
                          onCheckedChange={(checked) => 
                            setPrivacy({...privacy, dataSharing: checked})
                          }
                          data-testid="switch-data-sharing"
                        />
                      </div>

                      <div className="space-y-3 pt-4">
                        <Button variant="outline" className="w-full justify-start" data-testid="button-download-data">
                          <Download className="w-4 h-4 mr-2" />
                          Download My Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start" data-testid="button-change-password">
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme & Display</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Moon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Dark Mode</Label>
                            <p className="text-sm text-gray-600">Switch to dark theme</p>
                          </div>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                          data-testid="switch-dark-mode"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <Palette className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Circadian Rhythm Sync</Label>
                            <p className="text-sm text-gray-600">Auto-adjust colors based on time</p>
                          </div>
                        </div>
                        <Switch defaultChecked data-testid="switch-circadian" />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Volume2 className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <Label className="text-base font-medium">Sound Effects</Label>
                            <p className="text-sm text-gray-600">Play sounds for interactions</p>
                          </div>
                        </div>
                        <Switch defaultChecked data-testid="switch-sounds" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Language</Label>
                        <Select value={profile.language} onValueChange={(value) => setProfile({...profile, language: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="de">Deutsch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === "account" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Management</h3>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-base font-medium">Subscription Status</Label>
                          <Badge className="bg-teal-100 text-teal-800">Growth Plan</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Next billing date: January 15, 2025</p>
                        <Button variant="outline" size="sm">Manage Subscription</Button>
                      </div>

                      <div className="p-4 rounded-lg border border-gray-200">
                        <Label className="text-base font-medium">Account Security</Label>
                        <p className="text-sm text-gray-600 mb-3">Last password change: 3 months ago</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Lock className="w-4 h-4 mr-2" />
                            Change Password
                          </Button>
                          <Button variant="outline" size="sm">
                            <Smartphone className="w-4 h-4 mr-2" />
                            Two-Factor Auth
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
                    <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
                      <Label className="text-base font-medium text-red-800">Delete Account</Label>
                      <p className="text-sm text-red-600 mb-3">
                        Permanently delete your account and all data. This action cannot be undone.
                      </p>
                      <Button variant="destructive" size="sm" data-testid="button-delete-account">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}