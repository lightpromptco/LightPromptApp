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
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SoulSyncPage() {
  const [userId, setUserId] = useState<string>("");
  const [newConnection, setNewConnection] = useState("");
  const [connectionType, setConnectionType] = useState("");
  const [sharedGoal, setSharedGoal] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const { toast } = useToast();

  // Connection types with fun options
  const connectionTypes = [
    { value: "romantic_partner", label: "💕 Romantic Partner", description: "Deep intimacy & shared dreams" },
    { value: "best_friend", label: "👫 Best Friend", description: "Adventures & inside jokes" },
    { value: "family", label: "👨‍👩‍👧‍👦 Family", description: "Generational wisdom & love" },
    { value: "workout_buddy", label: "💪 Workout Buddy", description: "Fitness goals & motivation" },
    { value: "study_group", label: "📚 Study Group", description: "Learning & growth together" },
    { value: "travel_crew", label: "✈️ Travel Crew", description: "Wanderlust & exploration" },
    { value: "creative_collaborator", label: "🎨 Creative Partner", description: "Art, music & innovation" },
    { value: "mindfulness_circle", label: "🧘 Mindfulness Circle", description: "Meditation & inner peace" },
    { value: "accountability_partner", label: "🎯 Accountability Partner", description: "Goals & commitments" },
    { value: "soul_tribe", label: "✨ Soul Tribe", description: "Spiritual connection & growth" }
  ];

  // Fun activities for different connection types
  const connectionActivities = {
    romantic_partner: [
      { icon: Heart, name: "Love Notes", description: "Daily affirmations for each other" },
      { icon: Calendar, name: "Date Planning", description: "Plan surprise dates together" },
      { icon: Camera, name: "Memory Jar", description: "Collect special moments" }
    ],
    best_friend: [
      { icon: Gamepad2, name: "Challenge Mode", description: "Fun dares & challenges" },
      { icon: Music, name: "Playlist Swap", description: "Share your current vibes" },
      { icon: Trophy, name: "Achievement Hunt", description: "Unlock life milestones" }
    ],
    family: [
      { icon: Book, name: "Story Sharing", description: "Family memories & wisdom" },
      { icon: Calendar, name: "Tradition Tracker", description: "Keep family traditions alive" },
      { icon: Heart, name: "Gratitude Circle", description: "Daily family appreciation" }
    ],
    workout_buddy: [
      { icon: Zap, name: "Workout Streaks", description: "Track exercise together" },
      { icon: Trophy, name: "Fitness Challenges", description: "Compete & celebrate" },
      { icon: Target, name: "Goal Crushing", description: "Achieve fitness milestones" }
    ],
    default: [
      { icon: Star, name: "Daily Check-ins", description: "Share your highlights" },
      { icon: Target, name: "Goal Support", description: "Encourage each other" },
      { icon: Heart, name: "Appreciation", description: "Express gratitude" }
    ]
  };

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      setUserId(currentUser.id);
    }
  }, []);

  // Free tier demo data for Soul Sync
  const demoConnections = [
    {
      id: 'demo-1',
      name: 'Alex & Jordan',
      type: 'best_friend',
      typeLabel: '👫 Best Friend',
      sharedGoals: ['Weekly adventure planning', 'Support each other\'s dreams', 'Daily motivation text'],
      lastSync: '2 hours ago',
      resonance: 92,
      streakDays: 28,
      totalActivities: 156,
      isDemo: true,
      activities: ['Challenge completed: Try a new coffee shop', 'Shared playlist: "Good Vibes Only"', 'Milestone: 4 weeks of daily check-ins!']
    },
    {
      id: 'demo-2',
      name: 'Morning Mindfulness Circle',
      type: 'mindfulness_circle',
      typeLabel: '🧘 Mindfulness Circle',
      sharedGoals: ['7am meditation', 'Gratitude sharing', 'Weekend nature walks'],
      lastSync: '1 day ago',
      resonance: 78,
      streakDays: 12,
      totalActivities: 89,
      isDemo: true,
      activities: ['Group meditation: 20 minutes', 'Shared insight: "Presence over productivity"', 'Nature photo exchange']
    }
  ];

  // Generate invite link
  const generateInviteLink = (connectionId: string) => {
    const baseUrl = window.location.origin;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${baseUrl}/soul-sync/join/${inviteCode}`;
  };

  const copyInviteLink = (connectionId: string) => {
    const inviteLink = generateInviteLink(connectionId);
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Invite link copied! 🔗",
      description: "Share this link with your connection to join your Soul Sync",
    });
  };

  const handleCreateConnection = () => {
    if (!newConnection.trim()) {
      toast({
        title: "Enter a connection name",
        description: "Give your Soul Sync connection a meaningful name",
        variant: "destructive"
      });
      return;
    }

    if (!connectionType) {
      toast({
        title: "Choose connection type",
        description: "Select what kind of connection this will be",
        variant: "destructive"
      });
      return;
    }

    const selectedTypeData = connectionTypes.find(t => t.value === connectionType);
    toast({
      title: "Soul Sync created! ✨",
      description: `Your ${selectedTypeData?.label} connection "${newConnection}" is ready for shared growth`,
    });
    setNewConnection("");
    setConnectionType("");
  };

  const handleAddGoal = () => {
    if (!sharedGoal.trim()) {
      toast({
        title: "Enter a shared goal",
        description: "Add a meaningful goal to work on together",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Shared goal added! 🎯",
      description: `"${sharedGoal}" added to your Soul Sync goals`,
    });
    setSharedGoal("");
  };

  // Soul Sync works without login - just show demo for now
  const showDemo = !userId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Soul Sync
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect authentically with friends, family, and growth partners. Share wellness insights and support each other's journey. 
            <span className="text-purple-600 font-medium">Free for all users.</span>
          </p>
        </div>

        {/* Free Tier Features Banner */}
        <div className="mb-8">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Badge className="bg-purple-600 text-white">Free Feature</Badge>
              </div>
              <h2 className="text-xl font-bold text-center mb-2">Soul Sync for Everyone</h2>
              <p className="text-center text-muted-foreground mb-4">
                Create meaningful connections, share simple goals, and track your wellness journey together - completely free.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">5 Connections</span>
                </div>
                <div className="flex flex-col items-center">
                  <Target className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Shared Goals</span>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="h-6 w-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Basic Wellness Sync</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Create New Connection */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-purple-600" />
                  Create Soul Sync Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Connection Type</label>
                  <Select value={connectionType} onValueChange={setConnectionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your connection type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {connectionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Connection Name</label>
                  <Input
                    placeholder="e.g., Alex & Jordan, The Dream Team, Family Circle..."
                    value={newConnection}
                    onChange={(e) => setNewConnection(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateConnection} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Soul Sync
                </Button>
              </CardContent>
            </Card>

            {/* Add Shared Goal */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Add Shared Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Goal Description</label>
                  <Textarea
                    placeholder="e.g., Practice gratitude together, Take daily walks, Share three good things..."
                    value={sharedGoal}
                    onChange={(e) => setSharedGoal(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Add Shared Goal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Current Connections */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-purple-600" />
                    Your Soul Sync Connections
                  </div>
                  <Badge variant="secondary">{demoConnections.length} Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {demoConnections.map((connection) => (
                    <div key={connection.id} className="border rounded-xl p-6 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-800 dark:to-purple-900/20">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg">{connection.name}</h4>
                            <Badge variant="secondary" className="text-xs">{connection.typeLabel}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Last sync: {connection.lastSync}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end">
                            <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-lg font-bold">{connection.resonance}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Sync Score</p>
                        </div>
                      </div>

                      {/* Stats Bar */}
                      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-center">
                          <div className="font-bold text-purple-600">{connection.streakDays}</div>
                          <div className="text-xs text-muted-foreground">Day Streak</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-green-600">{connection.totalActivities}</div>
                          <div className="text-xs text-muted-foreground">Activities</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{connection.sharedGoals.length}</div>
                          <div className="text-xs text-muted-foreground">Goals</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Progress value={connection.resonance} className="h-3" />
                      </div>

                      {/* Recent Activities */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Recent Activities:</h5>
                        <div className="space-y-1">
                          {connection.activities?.map((activity, index) => (
                            <div key={index} className="flex items-center text-sm text-muted-foreground">
                              <Star className="h-3 w-3 mr-2 text-yellow-500" />
                              {activity}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <h5 className="text-sm font-medium">Shared Goals:</h5>
                        {connection.sharedGoals.map((goal, index) => (
                          <div key={index} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                            {goal}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button size="sm" variant="outline" className="h-auto p-3">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          <div className="text-left">
                            <div className="font-medium">Quick Check-in</div>
                            <div className="text-xs text-muted-foreground">Share your day</div>
                          </div>
                        </Button>
                        <Button size="sm" variant="outline" className="h-auto p-3">
                          <Gamepad2 className="h-4 w-4 mr-2" />
                          <div className="text-left">
                            <div className="font-medium">Start Challenge</div>
                            <div className="text-xs text-muted-foreground">Fun activity</div>
                          </div>
                        </Button>
                      </div>

                      {/* Invite & Share */}
                      <div className="flex gap-2">
                        <Dialog open={inviteDialogOpen && selectedConnection?.id === connection.id} onOpenChange={(open) => {
                          setInviteDialogOpen(open);
                          if (open) setSelectedConnection(connection);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Link className="h-3 w-3 mr-1" />
                              Invite Link
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Invite to {connection.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Share this link with someone to join your Soul Sync connection.
                              </p>
                              <div className="flex gap-2">
                                <Input 
                                  value={generateInviteLink(connection.id)} 
                                  readOnly 
                                  className="flex-1"
                                />
                                <Button onClick={() => copyInviteLink(connection.id)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="w-full">
                                  <QrCode className="h-4 w-4 mr-2" />
                                  QR Code
                                </Button>
                                <Button variant="outline" className="w-full">
                                  <Send className="h-4 w-4 mr-2" />
                                  Send via Text
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share Update
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {demoConnections.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No Soul Sync connections yet.</p>
                      <p className="text-sm">Create your first connection to get started!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Connection Type Activities */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Fun Activities by Connection Type</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectionTypes.slice(0, 6).map((type) => {
              const activities = connectionActivities[type.value as keyof typeof connectionActivities] || connectionActivities.default;
              return (
                <Card key={type.value} className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{type.label}</CardTitle>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50/50 dark:bg-purple-900/20">
                          <activity.icon className="h-5 w-5 text-purple-600" />
                          <div>
                            <div className="font-medium text-sm">{activity.name}</div>
                            <div className="text-xs text-muted-foreground">{activity.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How Soul Sync Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold mb-2">Choose Connection Type</h3>
                <p className="text-sm text-muted-foreground">
                  Select from 10 unique connection types, each with customized activities and goals.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Link className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold mb-2">Share Invite Links</h3>
                <p className="text-sm text-muted-foreground">
                  Send invite links, QR codes, or text invitations to connect with your people.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold mb-2">Fun Activities</h3>
                <p className="text-sm text-muted-foreground">
                  Enjoy challenges, games, and activities designed for your specific connection type.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold mb-2">Track Together</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor streaks, achievements, and sync scores as you grow together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
            <CardContent className="py-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-2xl font-bold mb-4">Want Premium Soul Sync Features?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Upgrade for unlimited connections, detailed wellness data sharing, custom relationship types, 
                and advanced privacy controls.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Get Premium Features
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}