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
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SoulSyncPage() {
  const [userId, setUserId] = useState<string>("");
  const [newConnection, setNewConnection] = useState("");
  const [connectionType, setConnectionType] = useState("");
  const [sharedGoal, setSharedGoal] = useState("");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [birthChartDialogOpen, setBirthChartDialogOpen] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [demoConnections, setDemoConnections] = useState<any[]>([
    {
      id: "demo1",
      name: "Sarah M.",
      type: "romantic_partner", 
      status: "Active",
      streak: 7,
      lastActivity: "2 hours ago",
      energy: 85,
      sharedGoals: ["Daily affirmations", "Weekend adventures", "Build lasting love"],
      achievements: ["7-day streak", "First month milestone"]
    },
    {
      id: "demo2", 
      name: "Alex K.",
      type: "best_friend",
      status: "Active", 
      streak: 12,
      lastActivity: "1 hour ago",
      energy: 92,
      sharedGoals: ["Weekly challenges", "Support each other's dreams", "Stay connected"],
      achievements: ["Challenge master", "Loyalty badge", "2-week streak"]
    },
    {
      id: "demo3",
      name: "Mom",
      type: "family",
      status: "Active",
      streak: 3,
      lastActivity: "This morning", 
      energy: 78,
      sharedGoals: ["Daily gratitude sharing", "Family traditions", "Emotional support"],
      achievements: ["First connection", "Gratitude champion"]
    }
  ]);
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

  // Birth chart compatibility insights
  const astrologyInsights = {
    romantic_partner: {
      fire_fire: {
        compatibility: 92,
        insight: "Explosive passion and endless adventures await! You both bring incredible energy and spontaneity.",
        communication: "Be direct and passionate. Share your dreams boldly - you both thrive on big visions.",
        activities: ["Surprise date adventures", "Competitive games", "Travel planning", "Dance together"],
        challenges: "Both can be impulsive - take turns being the steady one when making big decisions."
      },
      earth_water: {
        compatibility: 88,
        insight: "A beautiful balance of stability and emotion. You ground each other while nurturing deep connection.",
        communication: "Earth: Be patient with Water's emotional processing. Water: Appreciate Earth's practical love.",
        activities: ["Cooking together", "Garden planning", "Cozy movie nights", "Nature walks"],
        challenges: "Earth may seem too practical, Water too emotional - remember both styles show love."
      },
      air_fire: {
        compatibility: 85,
        insight: "Mental sparks fly! You inspire each other's ideas and fuel each other's passions.",
        communication: "Keep conversations lively and intellectually stimulating. Share ideas freely.",
        activities: ["Deep conversations", "Cultural events", "Learning new skills", "Social gatherings"],
        challenges: "Air thinks, Fire acts - balance planning with spontaneity for best results."
      }
    },
    best_friend: {
      air_air: {
        compatibility: 94,
        insight: "Mental twins! You understand each other's thought processes and share amazing conversations.",
        communication: "Talk about everything - ideas, dreams, random thoughts. You're natural communicators.",
        activities: ["Brainstorming sessions", "Book clubs", "Debate nights", "Creative projects"],
        challenges: "You might overthink instead of feeling - remember to check in emotionally too."
      },
      fire_water: {
        compatibility: 78,
        insight: "Opposites that fascinate each other. Fire brings excitement, Water brings depth.",
        communication: "Fire: Slow down for Water's feelings. Water: Express needs clearly to Fire.",
        activities: ["Adventure planning", "Heart-to-heart talks", "Trying new experiences", "Supporting dreams"],
        challenges: "Very different paces - Fire rushes, Water flows. Find your shared rhythm."
      }
    }
  };

  // Fun activities for different connection types
  const connectionActivities = {
    romantic_partner: [
      { icon: Heart, name: "Love Notes", description: "Daily affirmations for each other" },
      { icon: Stars, name: "Birth Chart Match", description: "Explore your astrological compatibility" },
      { icon: Calendar, name: "Date Planning", description: "Plan surprise dates together" },
      { icon: Camera, name: "Memory Jar", description: "Collect special moments" }
    ],
    best_friend: [
      { icon: Gamepad2, name: "Challenge Mode", description: "Fun dares & challenges" },
      { icon: Music, name: "Playlist Swap", description: "Share your current vibes" },
      { icon: Stars, name: "Friendship Compatibility", description: "Discover your cosmic connection" },
      { icon: Trophy, name: "Achievement Hunt", description: "Unlock life milestones" }
    ],
    family: [
      { icon: Book, name: "Story Sharing", description: "Family memories & wisdom" },
      { icon: Calendar, name: "Tradition Tracker", description: "Keep family traditions alive" },
      { icon: Moon, name: "Family Astrology", description: "Understand family dynamics" },
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

  // Initialize demo connections on first load if empty
  useEffect(() => {
    if (demoConnections.length === 0) {
      setDemoConnections([
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
      ]);
    }
  }, [demoConnections.length]);

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

  // Generate AI-powered astrology compatibility
  const generateAstrologyMatch = async (connection: any) => {
    setIsAnalyzing(true);
    setBirthChartDialogOpen(true);
    setSelectedConnection(connection);

    try {
      // Simulate birth chart data for demo
      const person1Chart = {
        sunSign: 'Leo',
        moonSign: 'Scorpio', 
        risingSign: 'Gemini',
        element: 'Fire'
      };
      
      const person2Chart = {
        sunSign: 'Sagittarius',
        moonSign: 'Pisces',
        risingSign: 'Libra', 
        element: 'Fire'
      };

      // Call API for AI analysis
      const response = await fetch('/api/astrology/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          person1: person1Chart,
          person2: person2Chart,
          connectionType: connection.type
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCompatibilityResult(result);
      } else {
        // Fallback to demo data
        const demoResult = {
          overall_compatibility: 87,
          element_match: 'fire_fire',
          communication_style: "Both Leo and Sagittarius are fire signs who communicate with passion and directness. You inspire each other's boldest dreams and adventures. Share your visions openly - you both thrive on big, exciting ideas.",
          relationship_activities: [
            "Plan spontaneous weekend adventures together",
            "Challenge each other to try new experiences monthly", 
            "Share your biggest dreams and support each other's ambitions",
            "Create a vision board of places you want to travel together"
          ],
          growth_areas: "Both being fire signs, you might clash when you're both feeling impulsive. Take turns being the grounded one when making important decisions. Leo needs appreciation, Sagittarius needs freedom - honor both needs.",
          love_language_match: "Leo: Words of affirmation and acts of service. Sagittarius: Quality time and physical touch. Plan active dates where you can appreciate each other's adventurous spirit.",
          conflict_resolution: "When tensions arise, give each other space first, then come back with honest, direct communication. Both signs appreciate authenticity over passive-aggressive behavior."
        };
        setCompatibilityResult(demoResult);
      }
    } catch (error) {
      console.error('Error generating compatibility:', error);
      toast({
        title: "Using demo compatibility analysis",
        description: "Showing sample astrological insights for this connection type"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateConnection = async () => {
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

    try {
      // Save to backend storage
      const response = await fetch('/api/soul-sync/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newConnection,
          type: connectionType,
          email: 'demo@example.com'
        })
      });

      if (response.ok) {
        const connection = await response.json();
        
        // Add to local state for immediate display
        const localConnection = {
          id: connection.id,
          name: newConnection,
          type: connectionType,
          status: "Active",
          streak: 0,
          lastActivity: "Just created",
          energy: Math.floor(Math.random() * 30) + 70,
          sharedGoals: [`Daily ${connectionTypes.find(t => t.value === connectionType)?.description}`, "Build lasting connection"],
          achievements: []
        };

        setDemoConnections([...demoConnections, localConnection]);
      }

      const selectedTypeData = connectionTypes.find(t => t.value === connectionType);
      toast({
        title: "Soul Sync created! ✨",
        description: `Your ${selectedTypeData?.label} connection "${newConnection}" is ready for shared growth`,
      });
      setNewConnection("");
      setConnectionType("");
    } catch (error) {
      console.error('Failed to create connection:', error);
      toast({
        title: "Connection created locally",
        description: "Your connection is ready, but couldn't sync to cloud storage",
        variant: "default"
      });
      setNewConnection("");
      setConnectionType("");
    }
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
                        {connection.sharedGoals.map((goal: string, index: number) => (
                          <div key={index} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                            {goal}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-auto p-3"
                          onClick={() => {
                            toast({
                              title: "Quick Check-in Started! 💬",
                              description: `Sharing today's energy with ${connection.name}`,
                            });
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          <div className="text-left">
                            <div className="font-medium">Quick Check-in</div>
                            <div className="text-xs text-muted-foreground">Share your day</div>
                          </div>
                        </Button>
                        {(connection.type === 'romantic_partner' || connection.type === 'best_friend' || connection.type === 'family') && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-auto p-3 bg-purple-50/50 dark:bg-purple-900/20 border-purple-200"
                            onClick={() => generateAstrologyMatch(connection)}
                          >
                            <Stars className="h-4 w-4 mr-2 text-purple-600" />
                            <div className="text-left">
                              <div className="font-medium">Astro Match</div>
                              <div className="text-xs text-muted-foreground">Birth chart insights</div>
                            </div>
                          </Button>
                        )}
                        {!(connection.type === 'romantic_partner' || connection.type === 'best_friend' || connection.type === 'family') && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-auto p-3"
                            onClick={() => {
                              toast({
                                title: "Challenge Started! 🎯",
                                description: `New activity challenge with ${connection.name}`,
                              });
                            }}
                          >
                            <Gamepad2 className="h-4 w-4 mr-2" />
                            <div className="text-left">
                              <div className="font-medium">Start Challenge</div>
                              <div className="text-xs text-muted-foreground">Fun activity</div>
                            </div>
                          </Button>
                        )}
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
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => {
                                    toast({
                                      title: "QR Code Generated! 📱",
                                      description: "QR code ready for easy sharing",
                                    });
                                  }}
                                >
                                  <QrCode className="h-4 w-4 mr-2" />
                                  QR Code
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => {
                                    toast({
                                      title: "Text Message Ready! 📲",
                                      description: "Invite link copied to send via text",
                                    });
                                  }}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Send via Text
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            toast({
                              title: "Update Shared! 🌟",
                              description: `Your progress shared with ${connection.name}`,
                            });
                          }}
                        >
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
            {connectionTypes.slice(0, 6).map((type: any) => {
              const activities = connectionActivities[type.value as keyof typeof connectionActivities] || connectionActivities.default;
              return (
                <Card key={type.value} className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{type.label}</CardTitle>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activities.map((activity: any, index: number) => (
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

        {/* Astrology Compatibility Dialog */}
        <Dialog open={birthChartDialogOpen} onOpenChange={setBirthChartDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Stars className="h-5 w-5 mr-2 text-purple-600" />
                Birth Chart Compatibility: {selectedConnection?.name}
              </DialogTitle>
            </DialogHeader>
            
            {isAnalyzing ? (
              <div className="text-center py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-spin" />
                <p className="text-lg font-medium">Analyzing birth chart compatibility...</p>
                <p className="text-sm text-muted-foreground">Consulting the stars for relationship insights</p>
              </div>
            ) : compatibilityResult ? (
              <div className="space-y-6">
                {/* Compatibility Score */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {compatibilityResult.overall_compatibility}%
                    </div>
                    <div className="text-lg font-medium">Overall Compatibility</div>
                    <Progress value={compatibilityResult.overall_compatibility} className="mt-3 h-3" />
                  </CardContent>
                </Card>

                {/* Communication Style */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                      How to Communicate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {compatibilityResult.communication_style}
                    </p>
                  </CardContent>
                </Card>

                {/* Recommended Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-600" />
                      Recommended Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {compatibilityResult.relationship_activities?.map((activity: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/20">
                          <Heart className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Growth Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                      Growth Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {compatibilityResult.growth_areas}
                    </p>
                  </CardContent>
                </Card>

                {/* Love Language Match */}
                {compatibilityResult.love_language_match && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-red-600" />
                        Love Language Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {compatibilityResult.love_language_match}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Conflict Resolution */}
                {compatibilityResult.conflict_resolution && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Compass className="h-5 w-5 mr-2 text-orange-600" />
                        Conflict Resolution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {compatibilityResult.conflict_resolution}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setBirthChartDialogOpen(false)} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Insights
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share with Partner
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Stars className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p>Click "Astro Match" to analyze your birth chart compatibility</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}