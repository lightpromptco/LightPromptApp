import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SoulSyncPage() {
  const [userId, setUserId] = useState<string>("");
  const [newConnection, setNewConnection] = useState("");
  const [sharedGoal, setSharedGoal] = useState("");
  const { toast } = useToast();

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
      name: 'Your First Soul Sync',
      type: 'growth_partner',
      sharedGoals: ['Daily gratitude practice', 'Mindful breathing'],
      lastSync: '2 hours ago',
      resonance: 85,
      isDemo: true
    }
  ];

  const handleCreateConnection = () => {
    if (!newConnection.trim()) {
      toast({
        title: "Enter a connection name",
        description: "Give your Soul Sync connection a meaningful name",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Soul Sync created! ✨",
      description: `Your connection "${newConnection}" is ready for shared growth`,
    });
    setNewConnection("");
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

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Soul Sync</h1>
          <p className="text-muted-foreground">Please log in to access Soul Sync features.</p>
        </div>
      </div>
    );
  }

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
                  <label className="text-sm font-medium mb-2 block">Connection Name</label>
                  <Input
                    placeholder="e.g., Morning Mindfulness Buddies, Family Wellness Circle..."
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
                <div className="space-y-4">
                  {demoConnections.map((connection) => (
                    <div key={connection.id} className="border rounded-lg p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Last sync: {connection.lastSync}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                            <span className="text-sm font-medium">{connection.resonance}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Sync Score</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <Progress value={connection.resonance} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Shared Goals:</h5>
                        {connection.sharedGoals.map((goal, index) => (
                          <div key={index} className="flex items-center text-sm text-muted-foreground">
                            <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                            {goal}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Quick Check-in
                        </Button>
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

        {/* Features Overview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How Soul Sync Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold mb-2">Connect Authentically</h3>
                <p className="text-sm text-muted-foreground">
                  Create meaningful connections with friends, family, or growth partners based on shared wellness goals.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Target className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold mb-2">Share Goals</h3>
                <p className="text-sm text-muted-foreground">
                  Set simple wellness goals together and track your progress as you support each other's growth.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-bold mb-2">Grow Together</h3>
                <p className="text-sm text-muted-foreground">
                  Regular check-ins and shared insights help you stay motivated and connected on your wellness journey.
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
              <h3 className="text-2xl font-bold mb-4">Want Advanced Partner Features?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Upgrade to Partner Mode for unlimited connections, detailed wellness data sharing, custom relationship types, 
                and advanced privacy controls.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Upgrade to Partner Mode
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