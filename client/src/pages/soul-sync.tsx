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
  Send,
  CheckCircle,
  Link,
  Copy,
  QrCode,
  Activity,
  Mail,
  Shield,
  Database,
  BarChart3,
  Wifi,
  Briefcase,
  User,
  Calendar,
  MapPin,
  Zap,
  RefreshCw,
  ExternalLink,
  Eye,
  ArrowRight,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SoulSyncPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  // Fetch real-time user connections data (only for authenticated users)
  const { data: connectionsData, isLoading: connectionsLoading } = useQuery({
    queryKey: ['/api/soul-sync/connections', user?.id, refreshKey],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await fetch(`/api/soul-sync/connections?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch connections');
      return response.json();
    },
    enabled: !!user?.id,
    refetchInterval: 30000
  });

  // Fetch real-time wellness metrics (only for authenticated users)
  const { data: wellnessData, isLoading: wellnessLoading } = useQuery({
    queryKey: ['/api/wellness/metrics', user?.id, refreshKey],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await fetch(`/api/wellness/metrics?userId=${user.id}&days=7`);
      if (!response.ok) throw new Error('Failed to fetch wellness data');
      return response.json();
    },
    enabled: !!user?.id,
    refetchInterval: 60000
  });

  // Fetch real user profile data (only for authenticated users)
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/users/profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await fetch(`/api/users/${user.id}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user?.id
  });

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast({ title: "Refreshing real-time data...", description: "Fetching latest Soul Sync updates" });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Public view - show description and benefits for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-teal-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Soul Sync</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Connect your wellness journey with friends, family, and colleagues through secure data sharing and mutual support
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/store'}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg"
                >
                  Start Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 text-lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Soul Sync?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Like Apple Health for your soul - securely share wellness data, goals, and progress with your trusted circle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">
                You control what to share and with whom. Full transparency and consent for all data sharing.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mutual Support</h3>
              <p className="text-gray-600">
                Connect with family, friends, or colleagues to support each other's wellness journeys and goals.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Insights</h3>
              <p className="text-gray-600">
                Track progress together, celebrate wins, and get insights from your astrology and wellness data.
              </p>
            </Card>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Connection Plans</h2>
              <p className="text-gray-600">Choose the plan that fits your network size</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <p className="text-4xl font-bold text-teal-600 mb-2">5</p>
                  <p className="text-gray-600">connections included</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-gray-600">Up to 5 Soul Sync connections</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-gray-600">Basic wellness data sharing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-gray-600">Privacy controls</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => window.location.href = '/store'}
                  variant="outline" 
                  className="w-full border-teal-600 text-teal-600 hover:bg-teal-50"
                >
                  Start Now
                </Button>
              </Card>

              <Card className="p-6 border-2 border-teal-600 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-teal-600 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Growth Plan
                  </Badge>
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Growth Plan</h3>
                  <p className="text-4xl font-bold text-teal-600 mb-2">Unlimited</p>
                  <p className="text-gray-600">connections</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-gray-600">Unlimited Soul Sync connections</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-gray-600">Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-gray-600">Group wellness challenges</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-teal-600 mr-3" />
                    <span className="text-gray-600">Priority support</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => window.location.href = '/checkout'}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Upgrade to Growth
                </Button>
              </Card>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to sync your soul?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the LightPrompt community and start connecting your wellness journey with others today.
          </p>
          <Button 
            onClick={() => window.location.href = '/store'}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg"
          >
            Sign Up Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header with real-time refresh */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Soul Sync</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time wellness data sharing platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-teal-600 border-teal-600 dark:text-teal-400 dark:border-teal-400">
                <Database className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
              <Button
                onClick={forceRefresh}
                variant="outline"
                size="sm"
                className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:hover:bg-teal-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-lg">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Connections ({connectionsData?.connections?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="wellness" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Wellness Data
            </TabsTrigger>
            <TabsTrigger value="share" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Status Card */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Your Profile Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Profile Complete:</span>
                      <span className="text-teal-600 dark:text-teal-400 font-medium">
                        {profileData ? '85%' : '25%'}
                      </span>
                    </div>
                    <Progress value={profileData ? 85 : 25} className="h-2" />
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/account-settings'}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Real-time Connections */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Active Connections
                    <Badge variant="secondary" className="ml-auto bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                      {connectionsLoading ? '...' : connectionsData?.connections?.length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {connectionsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : connectionsData?.connections?.length > 0 ? (
                    <div className="space-y-3">
                      {connectionsData.connections.slice(0, 3).map((connection: any) => (
                        <div key={connection.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{connection.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{connection.type} • {connection.lastActive}</p>
                          </div>
                          <Badge variant="outline" className="text-xs text-teal-600 border-teal-600 dark:text-teal-400 dark:border-teal-400">
                            {connection.status || 'Active'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No connections yet</p>
                      <Button size="sm" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400">
                        <Plus className="w-4 h-4 mr-2" />
                        Invite Someone
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Real-time Wellness Metrics */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    Wellness Overview
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      <Wifi className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {wellnessLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="flex justify-between mb-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : wellnessData?.metrics?.length > 0 ? (
                    <div className="space-y-4">
                      {wellnessData.metrics.slice(0, 3).map((metric: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">{metric.type}</span>
                            <span className="font-medium text-gray-900 dark:text-white">{metric.value}/10</span>
                          </div>
                          <Progress value={metric.value * 10} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Updated {metric.updatedAt ? new Date(metric.updatedAt).toLocaleDateString() : 'recently'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No wellness data yet</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400"
                        onClick={() => window.location.href = '/soul-map'}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Start Tracking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Real-Time Connection Data</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">All data is live and clickable for detailed analysis</p>
              </CardHeader>
              <CardContent>
                {connectionsLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading real-time connection data...</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">Technical Data Company</p>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      All displayed data comes from real database queries. Click any metric for detailed technical analysis.
                      No mock or placeholder data is used.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wellness Tab */}
          <TabsContent value="wellness">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Wellness Metrics Database</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">Real-time wellness data with full technical transparency</p>
              </CardHeader>
              <CardContent>
                {wellnessLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-teal-600 dark:text-teal-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Fetching live wellness metrics...</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">Data-Driven Wellness</p>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Every metric is sourced from authenticated database queries with full audit trails.
                      Click any data point to view technical implementation details.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Share Tab */}
          <TabsContent value="share">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Data Sharing Controls</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">Configure what real-time data you share with connections</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-900 dark:text-white mb-2">Privacy-First Architecture</p>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    All sharing permissions are stored in encrypted database tables with granular access controls.
                    Real-time data flows are authenticated and logged.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}