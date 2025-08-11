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

  // Mock connected users for now - this would come from real database connections
  const mockConnections = [
    {
      id: '1',
      name: 'Sarah Johnson',
      type: 'Best Friend',
      avatar: '/api/avatar/sarah',
      connectionLevel: 8,
      streakDays: 21,
      lastActive: '2 hours ago',
      sharedData: ['birth_chart', 'wellness_metrics', 'goals'],
      currentMood: 'Energized',
      recentActivity: 'Completed morning meditation',
      vibeMatch: 87
    },
    {
      id: '2', 
      name: 'Mike Chen',
      type: 'Workout Buddy',
      avatar: '/api/avatar/mike',
      connectionLevel: 6,
      streakDays: 12,
      lastActive: '1 day ago',
      sharedData: ['habits', 'wellness_metrics'],
      currentMood: 'Focused',
      recentActivity: 'Hit new PR at gym!',
      vibeMatch: 92
    },
    {
      id: '3',
      name: 'Mom',
      type: 'Family',
      avatar: '/api/avatar/mom',
      connectionLevel: 10,
      streakDays: 45,
      lastActive: '30 minutes ago',
      sharedData: ['wellness_metrics', 'goals', 'insights'],
      currentMood: 'Peaceful',
      recentActivity: 'Morning gratitude practice',
      vibeMatch: 95
    }
  ];

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

        {/* Connected Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {mockConnections.map((connection) => (
            <Card key={connection.id} className="border-purple-500/20 bg-slate-800/50 backdrop-blur hover:bg-slate-800/70 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {connection.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{connection.name}</CardTitle>
                    <p className="text-purple-200 text-sm">{connection.type}</p>
                  </div>
                  <Badge className="bg-green-600 text-white text-xs">
                    {connection.vibeMatch}% Match
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Connection Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-purple-900/30 p-2 rounded-lg">
                      <div className="text-purple-300 text-xs">Streak</div>
                      <div className="text-white font-semibold">{connection.streakDays} days</div>
                    </div>
                    <div className="bg-purple-900/30 p-2 rounded-lg">
                      <div className="text-purple-300 text-xs">Connection</div>
                      <div className="text-white font-semibold">Level {connection.connectionLevel}</div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <span className="text-white text-sm font-medium">Current Vibe</span>
                    </div>
                    <p className="text-purple-200 text-sm">{connection.currentMood}</p>
                    <p className="text-slate-400 text-xs mt-1">{connection.recentActivity}</p>
                  </div>

                  {/* Shared Data Types */}
                  <div>
                    <div className="text-white text-sm font-medium mb-2">Shared Data</div>
                    <div className="flex flex-wrap gap-1">
                      {connection.sharedData.map((dataType) => {
                        const type = dataTypes.find(t => t.id === dataType);
                        return (
                          <Badge key={dataType} variant="outline" className="text-xs border-purple-400 text-purple-200">
                            {type?.name || dataType}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Last Active */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Last active: {connection.lastActive}</span>
                    <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Connection */}
        <Card className="border-purple-500/20 bg-slate-800/50 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-purple-400" />
              Invite Someone to Soul Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Share your wellness journey! Generate an invite link to connect with friends, family, or colleagues on LightPrompt.
            </p>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Share2 className="w-4 h-4 mr-2" />
                  Create Invite Link
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-purple-500/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Soul Sync Invitation</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white">Connection Name</label>
                    <Input 
                      value={connectionName}
                      onChange={(e) => setConnectionName(e.target.value)}
                      placeholder="e.g., My Best Friend, Mom, Workout Partner"
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
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <h4 className="text-white text-sm font-medium mb-2">What happens next:</h4>
                    <ol className="text-slate-300 text-sm space-y-1">
                      <li>1. Link is copied to your clipboard</li>
                      <li>2. Share with your connection via text, email, etc.</li>
                      <li>3. They join LightPrompt and create their soul map</li>
                      <li>4. You both start sharing wellness data!</li>
                    </ol>
                  </div>
                  <Button onClick={generateShareLink} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Copy className="w-4 h-4 mr-2" />
                    Generate & Copy Link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

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