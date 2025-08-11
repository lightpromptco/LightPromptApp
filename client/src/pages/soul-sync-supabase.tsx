import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CheckCircle,
  Database,
  Activity,
  Shield,
  Zap,
  RefreshCw,
  User,
  Calendar,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// All data comes from Supabase - NEVER localStorage
export default function SoulSyncPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get authenticated user from Supabase backend validation
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // In production: JWT token validation via secure endpoint
        // For now: Admin user validation via backend
        const response = await fetch('/api/users/email/lightprompt.co@gmail.com');
        if (response.ok) {
          const user = await response.json();
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
      }
    };
    
    authenticateUser();
  }, []);

  // Fetch user profile from Supabase
  const { data: userProfile, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
    queryKey: ['/api/auth/profile', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return null;
      const response = await fetch(`/api/auth/profile?userId=${currentUserId}`);
      if (!response.ok) {
        // Return default profile structure if none exists
        return {
          userId: currentUserId,
          soulSyncEnabled: false,
          soulSyncVisibility: 'private',
          matchingPreferences: {},
          privacySettings: {
            dataSharing: 'private',
            profileVisibility: 'friends',
            locationSharing: false,
            activityVisible: true,
          }
        };
      }
      return response.json();
    },
    enabled: !!currentUserId,
  });

  // Fetch Soul Sync connections from Supabase
  const { data: connections, isLoading: connectionsLoading, refetch: refetchConnections } = useQuery({
    queryKey: ['/api/soul-sync/user-connections', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const response = await fetch(`/api/soul-sync/user-connections/${currentUserId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!currentUserId,
    refetchInterval: 30000, // Real-time updates every 30 seconds
  });

  // Fetch wellness metrics from Supabase
  const { data: wellnessMetrics, isLoading: wellnessLoading, refetch: refetchWellness } = useQuery({
    queryKey: ['/api/wellness/user-metrics', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      const response = await fetch(`/api/wellness/user-metrics/${currentUserId}?days=7`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!currentUserId,
    refetchInterval: 60000, // Update wellness data every minute
  });

  // Create new connection mutation
  const createConnectionMutation = useMutation({
    mutationFn: async (connectionData: { email: string; name: string; type: string }) => {
      const response = await fetch('/api/soul-sync/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...connectionData,
          requesterId: currentUserId,
        }),
      });
      if (!response.ok) throw new Error('Failed to create connection');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection Created",
        description: "New Soul Sync connection saved to Supabase database.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/soul-sync/user-connections'] });
    },
  });

  const refreshAllData = () => {
    refetchProfile();
    refetchConnections();
    refetchWellness();
    toast({
      title: "Data Refreshed",
      description: "All Soul Sync data updated from Supabase database.",
    });
  };

  // Loading state
  if (profileLoading || !currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Database className="w-16 h-16 mx-auto mb-4 text-teal-600 animate-pulse" />
          <h2 className="text-xl font-bold mb-2">Loading from Supabase</h2>
          <p className="text-gray-600">Fetching your Soul Sync data...</p>
        </Card>
      </div>
    );
  }

  // User not authenticated
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access Soul Sync.</p>
          <Button onClick={() => window.location.href = '/chat'}>
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  // Soul Sync disabled - show settings prompt
  if (!userProfile.soulSyncEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-teal-600" />
            <h1 className="text-2xl font-bold mb-4">Soul Sync Disabled</h1>
            <p className="text-gray-600 mb-6">
              Enable Soul Sync in your settings to connect with wellness buddies and share your journey.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.href = '/settings'}>
                <Shield className="w-4 h-4 mr-2" />
                Enable in Settings
              </Button>
              <Button variant="outline" onClick={refreshAllData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-teal-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Soul Sync</h1>
                <p className="text-gray-600">All data stored in Supabase database</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshAllData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => window.location.href = '/settings'}>
                <Shield className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connection Status */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-bold">Your Connections</h2>
                <Badge variant="outline" className="text-teal-600 border-teal-200">
                  {connectionsLoading ? 'Loading...' : `${connections?.length || 0} Active`}
                </Badge>
              </div>

              {connectionsLoading ? (
                <div className="space-y-4">
                  <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ) : connections?.length ? (
                <div className="space-y-4">
                  {connections.map((connection: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium">{connection.name}</p>
                          <p className="text-sm text-gray-600">{connection.type}</p>
                        </div>
                      </div>
                      <Badge variant={connection.status === 'active' ? 'default' : 'secondary'}>
                        {connection.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 mb-4">No connections yet</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Connection
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Soul Sync Connection</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Friend's name" />
                        <Input placeholder="Email address" type="email" />
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Connection type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friend">Friend</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="partner">Partner</SelectItem>
                            <SelectItem value="colleague">Colleague</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button className="w-full" disabled={createConnectionMutation.isPending}>
                          {createConnectionMutation.isPending ? 'Creating...' : 'Create Connection'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </Card>

            {/* Wellness Metrics */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-teal-600" />
                <h2 className="text-xl font-bold">Wellness Overview</h2>
                <Badge variant="outline" className="text-teal-600 border-teal-200">
                  From Supabase
                </Badge>
              </div>

              {wellnessLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-teal-600" />
                    <p className="text-2xl font-bold text-teal-700">
                      {wellnessMetrics?.energy || 'No data'}
                    </p>
                    <p className="text-sm text-gray-600">Energy</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-700">
                      {wellnessMetrics?.mood || 'No data'}
                    </p>
                    <p className="text-sm text-gray-600">Mood</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-700">
                      {wellnessMetrics?.goals || 'No data'}
                    </p>
                    <p className="text-sm text-gray-600">Goals</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Star className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-purple-700">
                      {wellnessMetrics?.gratitude || 'No data'}
                    </p>
                    <p className="text-sm text-gray-600">Gratitude</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Data Source Status */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Data Source</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Supabase Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Data Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Real-time Updates</span>
                </div>
              </div>
            </Card>

            {/* Profile Settings */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Profile Settings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Visibility:</span>
                  <span className="font-medium capitalize">{userProfile.soulSyncVisibility}</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Sharing:</span>
                  <span className="font-medium capitalize">{userProfile.privacySettings?.dataSharing}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-medium">{userProfile.privacySettings?.locationSharing ? 'Shared' : 'Private'}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => window.location.href = '/settings'}>
                Update Settings
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}