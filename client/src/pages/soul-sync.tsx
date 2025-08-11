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
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SoulSyncPage() {
  const [userId, setUserId] = useState<string>("");
  const [newConnection, setNewConnection] = useState("");
  const [connectionType, setConnectionType] = useState("");
  const [sharedGoal, setSharedGoal] = useState("");
  const [inviteData, setInviteData] = useState<{
    shareUrl: string;
    emailSubject: string;
    emailBody: string;
    smsMessage: string;
  } | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [birthChartDialogOpen, setBirthChartDialogOpen] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', name: '' });
  const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(null);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const currentUserId = currentUser?.id;

  // Check authentication status and invite codes on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    
    if (inviteCode) {
      setPendingInviteCode(inviteCode);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check if user is authenticated
    if (currentUserId && currentUser.email) {
      setIsAuthenticated(true);
      // If we have a pending invite and user is authenticated, process it
      if (inviteCode) {
        handleInviteAccept(inviteCode);
      }
    } else if (inviteCode) {
      // User clicked an invite link but isn't authenticated
      setShowAuthDialog(true);
    }
  }, [currentUserId]);

  const handleInviteAccept = async (inviteCode: string) => {
    if (!currentUserId) {
      setShowAuthDialog(true);
      return;
    }
    
    try {
      const response = await fetch('/api/soul-sync/accept-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteCode,
          userId: currentUserId
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Soul Sync Connected!",
          description: "Your souls are now synchronized",
        });
        refetch(); // Refresh connections
        setPendingInviteCode(null);
      } else {
        throw new Error('Failed to accept invite');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect souls. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAuthentication = async () => {
    if (!authForm.email || !authForm.name) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and name",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create or get user
      const userResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: authForm.email,
          name: authForm.name
        }),
      });
      
      if (userResponse.ok) {
        const user = await userResponse.json();
        localStorage.setItem('currentUser', JSON.stringify(user));
        setIsAuthenticated(true);
        setShowAuthDialog(false);
        
        // Process pending invite if exists
        if (pendingInviteCode) {
          handleInviteAccept(pendingInviteCode);
        }
        
        toast({
          title: "Welcome to Soul Sync!",
          description: "Your account is ready",
        });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Unable to create account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { toast } = useToast();
  
  // Fetch real connections from database - only if authenticated
  const { data: connections, isLoading: connectionsLoading, error: connectionsError, refetch } = useQuery({
    queryKey: ['/api/partner-connections', currentUserId],
    enabled: isAuthenticated && !!currentUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show empty state when no real connections exist
  const realConnections = (connections as any[]) || [];
  
  // Error state for database connection issues  
  if (connectionsError) {
    console.error('Failed to load connections:', connectionsError);
  }

  // Handle creating new connections - requires authentication
  const handleCreateConnection = async () => {
    if (!isAuthenticated || !currentUserId) {
      setShowAuthDialog(true);
      return;
    }

    if (!newConnection || !connectionType) {
      toast({
        title: "Missing Information",
        description: "Please fill out connection name and type",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/partner-connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId1: currentUserId,
          name: newConnection,
          relationshipType: connectionType,
          sharedGoals: []
        }),
      });

      if (response.ok) {
        toast({
          title: "Soul Sync Connection Created! ✨",
          description: `Your ${connectionType} connection "${newConnection}" is ready`,
        });
        setNewConnection("");
        setConnectionType("");
        // Refresh connections list
        refetch();
        // Also update localStorage with the new user if it was temporary
        if (!currentUserId) {
          window.location.reload();
        }
      } else {
        throw new Error('Failed to create connection');
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to create connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddGoal = async (connectionId?: string) => {
    if (!sharedGoal.trim()) {
      toast({
        title: "Goal Required",
        description: "Please enter a shared goal description",
        variant: "destructive",
      });
      return;
    }

    // Use the first connection if no specific connection provided
    const targetConnectionId = connectionId || (connections as any[])?.[0]?.id;
    
    if (!targetConnectionId) {
      toast({
        title: "Connection Required",
        description: "Please create a connection first before adding goals",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/partner-connections/${targetConnectionId}/add-goal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: sharedGoal.trim(),
          userId: currentUserId,
        }),
      });

      if (response.ok) {
        toast({
          title: "Shared Goal Added! 🎯",
          description: `"${sharedGoal}" added to your soul sync goals`,
        });
        setSharedGoal("");
        // Refresh connections to show updated goals
        window.location.reload();
      } else {
        throw new Error('Failed to add goal');
      }
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Failed to Add Goal",
        description: "Unable to save your goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareConnection = (connection: any) => {
    // Use the existing invite code from the connection
    const inviteCode = connection.inviteCode;
    const inviteUrl = `${window.location.origin}/soul-sync?invite=${inviteCode}`;
    
    const inviteMessages = {
      shareUrl: inviteUrl,
      emailSubject: `Join me on Soul Sync - ${connection.name}`,
      emailBody: `Hey! I'd love to start our wellness journey together on Soul Sync. 

${connection.name} sounds perfect for us - we can set shared goals, track our progress, and support each other.

Join me here: ${inviteUrl}

Looking forward to growing together! 💙`,
      smsMessage: `Hey! Want to sync our wellness journeys? I created "${connection.name}" on Soul Sync. Join me: ${inviteUrl} 🌟`
    };

    setInviteData(inviteMessages);
    setSelectedConnection(connection);
    setInviteDialogOpen(true);
    
    toast({
      title: "Invite Link Ready! 🔗",
      description: "Share this link to invite someone to join your Soul Sync",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const shareViaEmail = (emailBody: string, subject: string) => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl);
  };

  const shareViaSMS = (message: string) => {
    const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    window.open(smsUrl);
  };

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
      { icon: Heart, name: "Love Notes (Beta)", description: "Daily affirmations for each other" },
      { icon: Stars, name: "Birth Chart Match (Coming Soon)", description: "Explore your astrological compatibility" },
      { icon: Calendar, name: "Date Planning (Beta)", description: "Plan surprise dates together" },
      { icon: Camera, name: "Memory Jar (Coming Soon)", description: "Collect special moments" }
    ],
    best_friend: [
      { icon: Gamepad2, name: "Challenge Mode (Beta)", description: "Fun dares & challenges" },
      { icon: Music, name: "Playlist Swap (Coming Soon)", description: "Share your current vibes" },
      { icon: Stars, name: "Friendship Compatibility (Coming Soon)", description: "Discover your cosmic connection" },
      { icon: Trophy, name: "Achievement Hunt (Coming Soon)", description: "Unlock life milestones" }
    ],
    family: [
      { icon: Book, name: "Story Sharing (Beta)", description: "Family memories & wisdom" },
      { icon: Calendar, name: "Tradition Tracker (Coming Soon)", description: "Keep family traditions alive" },
      { icon: Moon, name: "Family Astrology (Coming Soon)", description: "Understand family dynamics" },
      { icon: Heart, name: "Gratitude Circle (Beta)", description: "Daily family appreciation" }
    ],
    workout_buddy: [
      { icon: Zap, name: "Workout Streaks (Coming Soon)", description: "Track exercise together" },
      { icon: Trophy, name: "Fitness Challenges (Coming Soon)", description: "Compete & celebrate" },
      { icon: Target, name: "Goal Crushing (Coming Soon)", description: "Achieve fitness milestones" }
    ],
    study_group: [
      { icon: Star, name: "Daily Check-ins (Beta)", description: "Share your highlights" },
      { icon: Target, name: "Goal Support (Beta)", description: "Encourage each other" },
      { icon: Heart, name: "Appreciation (Beta)", description: "Express gratitude" }
    ],
    travel_crew: [
      { icon: Star, name: "Daily Check-ins (Beta)", description: "Share your highlights" },
      { icon: Target, name: "Goal Support (Beta)", description: "Encourage each other" },
      { icon: Heart, name: "Appreciation (Beta)", description: "Express gratitude" }
    ],
    default: [
      { icon: Star, name: "Daily Check-ins (Beta)", description: "Share your highlights" },
      { icon: Target, name: "Goal Support (Beta)", description: "Encourage each other" },
      { icon: Heart, name: "Appreciation (Beta)", description: "Express gratitude" }
    ]
  };

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      setUserId(currentUser.id);
    }
  }, []);

  // Real connections only - no demo data

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
                <Button onClick={() => handleAddGoal()} className="w-full">
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
                  <Badge variant="secondary">{realConnections.length} Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {realConnections.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium mb-2">No Soul Sync Connections Yet</h3>
                      <p className="text-sm">Create your first connection to start your journey of shared growth and mutual support.</p>
                    </div>
                  ) : (
                    realConnections.map((connection) => (
                    <div key={connection.id} className="border rounded-xl p-4 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-800 dark:to-purple-900/20">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-base truncate">{connection.name}</h4>
                            <Badge variant="secondary" className="text-xs whitespace-nowrap">{connectionTypes.find(t => t.value === connection.type)?.label.split(' ')[0] || connection.type}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Last sync: {connection.lastActivity || 'Recently'}</span>
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <div className="flex items-center justify-end">
                            <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-lg font-bold">{connection.energy}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Energy</p>
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
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1" 
                              onClick={() => handleShareConnection(connection.id)}
                            >
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
                                  value={inviteData?.shareUrl || "Click 'Invite Link' to generate"} 
                                  readOnly 
                                  className="flex-1"
                                />
                                <Button 
                                  onClick={() => inviteData?.shareUrl && copyToClipboard(inviteData.shareUrl)}
                                  disabled={!inviteData?.shareUrl}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => inviteData?.smsMessage && shareViaSMS(inviteData.smsMessage)}
                                  disabled={!inviteData?.smsMessage}
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  SMS
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => inviteData?.emailBody && shareViaEmail(inviteData.emailBody, inviteData.emailSubject)}
                                  disabled={!inviteData?.emailBody}
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Email
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
                  )))}
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
                            <div className="font-medium text-sm">
                              {activity.name}
                              {(activity.name.includes('Coming Soon') || activity.name.includes('Beta')) && 
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  {activity.name.includes('Coming Soon') ? 'Coming Soon' : 'Beta'}
                                </Badge>
                              }
                            </div>
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
              <div className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                <Badge variant="outline" className="mb-2">Beta Platform - Not Final</Badge>
                <p className="mt-2">
                  We're actively building these features! Many activities are in beta or coming soon. 
                  This honest preview shows our roadmap as we develop the full platform.
                </p>
              </div>
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

        {/* Authentication Dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-purple-600" />
                {pendingInviteCode ? "Join Soul Sync Connection" : "Create Your Account"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {pendingInviteCode && (
                <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    Someone invited you to join their Soul Sync connection! 
                    Create your account to connect.
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium mb-2 block">Your Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Your Name</label>
                <Input
                  placeholder="Your full name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <Button onClick={handleAuthentication} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                {pendingInviteCode ? "Join Connection" : "Create Account"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our terms and can start syncing souls with others.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}