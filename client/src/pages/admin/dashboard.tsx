import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  Activity, 
  Database,
  TrendingUp,
  Clock,
  Globe,
  Shield,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  User,
  BarChart3,
  Calendar,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // REAL DATA ONLY - Admin authentication check
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Only allow admin users to access this dashboard
        if (parsedUser.email !== 'lightprompt.co@gmail.com') {
          window.location.href = '/';
          return;
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []);

  // Fetch REAL platform metrics from authenticated database
  const { data: platformStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['/api/admin/platform-stats', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/admin/platform-stats');
      if (!response.ok) throw new Error('Failed to fetch platform stats');
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 30000
  });

  // Fetch REAL user activity data from database
  const { data: userActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['/api/admin/user-activity', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/admin/user-activity');
      if (!response.ok) throw new Error('Failed to fetch user activity');
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 60000
  });

  // Fetch REAL soul sync connections data from database
  const { data: connectionsStats, isLoading: connectionsLoading } = useQuery({
    queryKey: ['/api/admin/connections-stats', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/admin/connections-stats');
      if (!response.ok) throw new Error('Failed to fetch connections stats');
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 45000
  });

  // Fetch REAL system health data from database
  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/admin/system-health', refreshKey],
    queryFn: async () => {
      const response = await fetch('/api/admin/system-health');
      if (!response.ok) throw new Error('Failed to fetch system health');
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 15000
  });

  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetchStats();
    toast({
      title: "Data Refreshed",
      description: "All metrics updated from live database"
    });
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900">Access Denied</h1>
        <p className="text-gray-600">Admin access required</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LightPrompt Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time platform metrics and user insights</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Database className="w-3 h-3 mr-1" />
                Live Database
              </Badge>
              <Button
                onClick={forceRefresh}
                variant="outline"
                size="sm"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Users ({platformStats?.totalUsers || 0})
            </TabsTrigger>
            <TabsTrigger value="connections">
              <Activity className="w-4 h-4 mr-2" />
              Soul Sync ({connectionsStats?.totalConnections || 0})
            </TabsTrigger>
            <TabsTrigger value="health">
              <Shield className="w-4 h-4 mr-2" />
              System Health
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="text-2xl font-bold">{platformStats?.totalUsers || 0}</div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {statsLoading ? '...' : `+${platformStats?.newUsersToday || 0} today`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="text-2xl font-bold">{platformStats?.activeSessions || 0}</div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {statsLoading ? '...' : `${platformStats?.avgSessionLength || 0} min avg`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Soul Sync Connections</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {connectionsLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="text-2xl font-bold">{connectionsStats?.totalConnections || 0}</div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {connectionsLoading ? '...' : `${connectionsStats?.activeConnections || 0} active`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="text-2xl font-bold flex items-center">
                      {systemHealth?.status === 'healthy' ? (
                        <><CheckCircle className="w-6 h-6 text-green-500 mr-2" />Healthy</>
                      ) : (
                        <><AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />Warning</>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {healthLoading ? '...' : `${systemHealth?.uptime || 0}% uptime`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Activity - Real Database Data</CardTitle>
              </CardHeader>
              <CardContent>
                {activityLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading real user activity from database...</p>
                  </div>
                ) : userActivity?.users?.length > 0 ? (
                  <div className="space-y-4">
                    {userActivity.users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name || 'Anonymous User'}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{user.tier}</p>
                          <p className="text-xs text-gray-500">Last active: {user.lastActive}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No user activity data available</p>
                    <p className="text-sm text-gray-500 mt-2">Data only shows when users are actively using the platform</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Soul Sync Connections - Live Data</CardTitle>
              </CardHeader>
              <CardContent>
                {connectionsLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading real connection data from database...</p>
                  </div>
                ) : connectionsStats?.connections?.length > 0 ? (
                  <div className="space-y-4">
                    {connectionsStats.connections.map((connection: any) => (
                      <div key={connection.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{connection.type} Connection</p>
                            <p className="text-sm text-gray-600">{connection.participants} participants</p>
                          </div>
                        </div>
                        <Badge variant={connection.status === 'active' ? 'default' : 'secondary'}>
                          {connection.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active connections yet</p>
                    <p className="text-sm text-gray-500 mt-2">Data appears when users create Soul Sync connections</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Health</CardTitle>
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Connection Status</span>
                        <Badge variant={systemHealth?.database?.connected ? 'default' : 'destructive'}>
                          {systemHealth?.database?.connected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Query Performance</span>
                        <span>{systemHealth?.database?.avgQueryTime || 0}ms avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Connections</span>
                        <span>{systemHealth?.database?.activeConnections || 0}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Response Time</span>
                        <span>{systemHealth?.api?.responseTime || 0}ms avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate</span>
                        <span>{systemHealth?.api?.successRate || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Requests/Hour</span>
                        <span>{systemHealth?.api?.requestsPerHour || 0}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}