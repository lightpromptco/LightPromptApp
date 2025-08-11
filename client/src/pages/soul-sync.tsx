import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Users, 
  Share2, 
  MessageCircle, 
  Target, 
  Sparkles,
  Plus,
  Clock,
  TrendingUp,
  UserPlus,
  Send,
  CheckCircle,
  Link,
  Copy,
  QrCode,
  Gamepad2,
  Trophy,
  Calendar,
  Camera,
  Music,
  Book,
  Zap,
  Star,
  Moon,
  Sun,
  Stars,
  Compass,
  Lightbulb,
  MessageSquare,
  Activity,
  Mail,
  Shield,
  Database,
  BarChart3,
  Wifi,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SoulSyncPage() {
  const [soulMapData, setSoulMapData] = useState<any>(null);
  const [sharedConnections, setSharedConnections] = useState<any[]>([]);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [connectionName, setConnectionName] = useState("");
  const [connectionType, setConnectionType] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', name: '' });
  const { toast } = useToast();

  // Load soulmap data from localStorage (like Apple Health operates off device data)
  useEffect(() => {
    const birthData = localStorage.getItem('birthData');
    const userProfile = localStorage.getItem('userProfile');
    const wellnessMetrics = localStorage.getItem('wellnessMetrics');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (birthData || userProfile || wellnessMetrics) {
      const parsedBirthData = birthData ? JSON.parse(birthData) : {};
      const parsedProfile = userProfile ? JSON.parse(userProfile) : {};
      const parsedMetrics = wellnessMetrics ? JSON.parse(wellnessMetrics) : {};
      
      setSoulMapData({
        birthChart: parsedBirthData,
        profile: parsedProfile,
        metrics: parsedMetrics,
        user: currentUser,
        hasData: Object.keys(parsedBirthData).length > 0 || Object.keys(parsedProfile).length > 0
      });
    }

    // Check for invite codes in URL
    const urlParams = new URLSearchParams(window.location.search);
    const inviteFromUrl = urlParams.get('invite');
    if (inviteFromUrl) {
      handleIncomingInvite(inviteFromUrl);
    }
  }, []);

  const handleIncomingInvite = (inviteCode: string) => {
    // Show invite acceptance dialog - this is where Spotify-style auth happens
    toast({
      title: "Soul Sync Invitation! ✨",
      description: "Someone wants to sync their wellness journey with you",
    });
    setInviteCode(inviteCode);
    setShowAuthDialog(true);
  };

  const handleJoinLightPrompt = async () => {
    if (!authForm.email || !authForm.name) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and name to join LightPrompt",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create LightPrompt account
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email, name: authForm.name }),
      });
      
      if (userResponse.ok) {
        const user = await userResponse.json();
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Accept the invite
        if (inviteCode) {
          const inviteResponse = await fetch('/api/soul-sync/accept-invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inviteCode, userId: user.id }),
          });
          
          if (inviteResponse.ok) {
            toast({
              title: "Welcome to Soul Sync! 🌟",
              description: "Account created and invitation accepted. Start creating your soulmap to share data!",
            });
            setShowAuthDialog(false);
            // Redirect to soul map creation
            setTimeout(() => window.location.href = '/soul-map', 2000);
          }
        } else {
          toast({
            title: "Welcome to LightPrompt! 🌟", 
            description: "Your account is ready. Create your soulmap to start sharing wellness data!",
          });
          setShowAuthDialog(false);
        }
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to join. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateShareLink = () => {
    const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const shareUrl = `${window.location.origin}/soul-sync?invite=${shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    
    toast({
      title: "Invite Link Generated! 📧",
      description: "Link copied to clipboard. Share it to invite someone to join your Soul Sync",
    });
    setInviteDialogOpen(false);
  };

  const dataTypes = [
    { id: 'birth_chart', name: 'Birth Chart & Astrology', icon: Stars, description: 'Sun, moon, rising signs and planetary positions' },
    { id: 'wellness_metrics', name: 'Wellness Metrics', icon: BarChart3, description: 'Mood, energy, stress levels and daily reflections' },
    { id: 'goals', name: 'Personal Goals', icon: Target, description: 'Life goals, challenges, and achievements' },
    { id: 'habits', name: 'Daily Habits', icon: CheckCircle, description: 'Tracked habits and routines' },
    { id: 'insights', name: 'AI Insights', icon: Lightbulb, description: 'Personalized recommendations and guidance' },
    { id: 'activities', name: 'Activities & Check-ins', icon: Activity, description: 'Location-based mindfulness and activities' }
  ];

  const connectionTypes = [
    { value: 'romantic_partner', label: 'Romantic Partner', icon: Heart },
    { value: 'best_friend', label: 'Best Friend', icon: Users },
    { value: 'family', label: 'Family Member', icon: Heart },
    { value: 'workout_buddy', label: 'Workout Buddy', icon: Zap },
    { value: 'study_group', label: 'Study/Growth Partner', icon: Book },
    { value: 'colleague', label: 'Colleague/Employee', icon: Briefcase },
    { value: 'other', label: 'Other', icon: Users }
  ];

  if (!soulMapData?.hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Soul Sync
            </h1>
            <p className="text-xl text-purple-200 mb-6">
              Share Your Wellness Journey Like Apple Health
            </p>
          </div>

          <Card className="border-purple-500/20 bg-slate-800/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <Wifi className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-4">
                Create Your Soul Map First
              </h2>
              <p className="text-slate-300 mb-6">
                Soul Sync works like Apple Health - it shares your existing wellness data with friends, 
                family, and colleagues. Create your soul map to unlock data sharing.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-purple-900/30 rounded-lg">
                  <Stars className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Birth Chart</h3>
                  <p className="text-sm text-purple-200">Astrological insights</p>
                </div>
                <div className="p-4 bg-purple-900/30 rounded-lg">
                  <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Wellness Data</h3>
                  <p className="text-sm text-purple-200">Mood, goals, habits</p>
                </div>
                <div className="p-4 bg-purple-900/30 rounded-lg">
                  <Share2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-white">Share Safely</h3>
                  <p className="text-sm text-purple-200">Control what you share</p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/soul-map'} 
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Stars className="w-5 h-5 mr-2" />
                Create Your Soul Map
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Soul Sync
            <Wifi className="w-8 h-8 text-purple-400 inline ml-2" />
          </h1>
          <p className="text-xl text-purple-200 mb-2">
            Share Your Wellness Journey Like Apple Health
          </p>
          <p className="text-sm text-slate-400">
            Connect with friends, family, and colleagues through your soul map data
          </p>
        </div>

        {/* Your Soul Map Data Overview */}
        <Card className="border-purple-500/20 bg-slate-800/50 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-400" />
              Your Shareable Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dataTypes.map((dataType) => {
                const hasData = 
                  (dataType.id === 'birth_chart' && soulMapData.birthChart?.birthDate) ||
                  (dataType.id === 'wellness_metrics' && soulMapData.metrics?.mood) ||
                  (dataType.id === 'goals' && soulMapData.profile?.goals) ||
                  (dataType.id === 'habits' && soulMapData.profile?.habits) ||
                  (dataType.id === 'insights' && soulMapData.profile?.insights) ||
                  (dataType.id === 'activities' && soulMapData.profile?.activities);
                
                return (
                  <div key={dataType.id} className={`p-4 rounded-lg ${hasData ? 'bg-green-900/20 border border-green-500/30' : 'bg-slate-700/50 border border-slate-600/30'}`}>
                    <dataType.icon className={`w-6 h-6 mb-2 ${hasData ? 'text-green-400' : 'text-slate-400'}`} />
                    <h3 className="font-semibold text-white text-sm">{dataType.name}</h3>
                    <p className="text-xs text-slate-400 mb-2">{dataType.description}</p>
                    <Badge variant={hasData ? "default" : "secondary"} className="text-xs">
                      {hasData ? "Available" : "No data"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Share Invite */}
          <Card className="border-purple-500/20 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Share2 className="w-5 h-5 mr-2 text-purple-400" />
                Invite Someone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Share a link to invite friends, family, or colleagues to join LightPrompt and sync with your wellness journey.
              </p>
              <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Generate Invite Link
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-purple-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create Soul Sync Invite</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-white">Connection Name</label>
                      <Input 
                        value={connectionName}
                        onChange={(e) => setConnectionName(e.target.value)}
                        placeholder="e.g., Best Friend Connection"
                        className="mt-1 bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white">Relationship Type</label>
                      <Select value={connectionType} onValueChange={setConnectionType}>
                        <SelectTrigger className="mt-1 bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Select relationship type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800">
                          {connectionTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={generateShareLink} className="w-full bg-purple-600 hover:bg-purple-700">
                      <Link className="w-4 h-4 mr-2" />
                      Generate & Copy Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Current Connections */}
          <Card className="border-purple-500/20 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-400" />
                Active Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sharedConnections.length === 0 ? (
                <div className="text-center py-4">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No active connections yet</p>
                  <p className="text-slate-500 text-xs">Invite someone to start sharing!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sharedConnections.map((connection, idx) => (
                    <div key={idx} className="p-3 bg-slate-700/50 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{connection.name}</p>
                        <p className="text-slate-400 text-sm">{connection.type}</p>
                      </div>
                      <Badge className="bg-green-600 text-white">Active</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Authentication Dialog for Invite Recipients */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="bg-slate-800 border-purple-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">Join LightPrompt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-slate-300">
                You've been invited to sync wellness data! Create your LightPrompt account to accept the invitation.
              </p>
              <div>
                <label className="text-sm font-medium text-white">Email</label>
                <Input 
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                  placeholder="your@email.com"
                  className="mt-1 bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">Name</label>
                <Input 
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  placeholder="Your name"
                  className="mt-1 bg-slate-700 border-slate-600"
                />
              </div>
              <Button onClick={handleJoinLightPrompt} className="w-full bg-purple-600 hover:bg-purple-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Join LightPrompt & Accept Invite
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}