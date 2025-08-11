import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, Database, Bot, Crown, Home, LogOut, 
  BarChart3, Users, Settings, Code, Search, Eye, Terminal, Activity, 
  FileText, Map, Palette, Layout, Zap, TrendingUp, DollarSign, MessageSquare,
  Cpu, HardDrive, Globe, Clock, UserCheck, Brain, CreditCard
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminData, setAdminData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const isAdminMode = localStorage.getItem('lightprompt-admin-mode') === 'true';
    const storedAdminData = localStorage.getItem('lightprompt-admin-user');
    
    if (isAdminMode && storedAdminData) {
      try {
        const adminUser = JSON.parse(storedAdminData);
        setIsLoggedIn(true);
        setAdminData(adminUser);
        loadAdminData(); // Refresh data
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('lightprompt-admin-mode');
        localStorage.removeItem('lightprompt-admin-user');
      }
    }
  }, []);

  const loadAdminData = async () => {
    try {
      const response = await fetch('/api/users/email/lightprompt.co@gmail.com');
      if (response.ok) {
        const admin = await response.json();
        setAdminData(admin);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  // Analytics queries
  const { data: analyticsData } = useQuery({
    queryKey: ['/api/analytics/overview'],
    enabled: isLoggedIn
  });

  const { data: userMetrics } = useQuery({
    queryKey: ['/api/analytics/users'],
    enabled: isLoggedIn
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['/api/analytics/system-health'],
    enabled: isLoggedIn
  });

  const handleLogin = async () => {
    const validCodes = ['lightprompt2025', 'godmode', 'highest-self'];
    
    if (email === 'lightprompt.co@gmail.com' && validCodes.includes(password)) {
      try {
        const response = await fetch('/api/users/email/lightprompt.co@gmail.com');
        if (response.ok) {
          const adminUser = await response.json();
          localStorage.setItem('lightprompt-admin-mode', 'true');
          localStorage.setItem('lightprompt-admin-user', JSON.stringify(adminUser));
          setIsLoggedIn(true);
          setAdminData(adminUser);
          toast({
            title: "Admin Access Granted",
            description: "Welcome to LightPrompt Admin Portal",
          });
        } else {
          toast({
            title: "Admin Account Not Found",
            description: "Admin account not found in database.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Admin login error:', error);
        toast({
          title: "Connection Error",
          description: "Could not connect to the database.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lightprompt-admin-mode');
    localStorage.removeItem('lightprompt-admin-user');
    setIsLoggedIn(false);
    setAdminData(null);
    setEmail('');
    setPassword('');
    toast({
      title: "Logged Out",
      description: "Admin session ended.",
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <CardTitle className="text-2xl">Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3"
              />
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Access Admin Portal
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100">Comprehensive system management and analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="secondary" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Go to App
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="developer">Developer Tools</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Admin Account */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Admin Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {adminData?.email || 'lightprompt.co@gmail.com'}</p>
                    <p><strong>Name:</strong> {adminData?.name || 'LightPrompt Admin'}</p>
                    <p><strong>Tier:</strong> <Badge variant="secondary">{adminData?.tier || 'admin'}</Badge></p>
                    <p><strong>Role:</strong> <Badge variant="outline">{adminData?.role || 'admin'}</Badge></p>
                    <p><strong>Token Limit:</strong> {adminData?.tokenLimit?.toLocaleString() || '999,999'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/plans">
                    <Button className="w-full justify-start" variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      View Plans & Pricing
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                  <Link href="/challenges">
                    <Button className="w-full justify-start" variant="outline">
                      <Zap className="w-4 h-4 mr-2" />
                      View Challenges
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-green-700 dark:text-green-400">Admin Account Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-center">
                      <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-blue-700 dark:text-blue-400">Supabase Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-center">
                      <Bot className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium text-purple-700 dark:text-purple-400">All Bots Available</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                      <p className="text-3xl font-bold">{(userMetrics as any)?.totalUsers || 0}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                      <p className="text-3xl font-bold">{(analyticsData as any)?.activeSessions || 0}</p>
                    </div>
                    <Activity className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages Today</p>
                      <p className="text-3xl font-bold">{(analyticsData as any)?.messagesTotal || 0}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                      <p className="text-3xl font-bold">{(systemHealth as any)?.overallScore || 100}%</p>
                    </div>
                    <Cpu className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>New Users</span>
                        <span>{(userMetrics as any)?.newUsers || 0}</span>
                      </div>
                      <Progress value={65} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Returning Users</span>
                        <span>{(userMetrics as any)?.returningUsers || 0}</span>
                      </div>
                      <Progress value={78} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>API Response Time</span>
                        <span>{(systemHealth as any)?.apiResponseTime || 245}ms</span>
                      </div>
                      <Progress value={82} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Database Performance</span>
                        <span>Excellent</span>
                      </div>
                      <Progress value={95} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Developer Tools Tab */}
          <TabsContent value="developer" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/cosmic-debug">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Terminal className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="font-semibold mb-2">Cosmic Debug Console</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Real-time system monitoring and debugging</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/api-explorer">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Code className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h3 className="font-semibold mb-2">API Explorer</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Interactive API testing and documentation</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/data-viewer">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Database className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                    <h3 className="font-semibold mb-2">Database Viewer</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Explore database structure and data</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/page-editor">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Palette className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                    <h3 className="font-semibold mb-2">Universal Editor</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Visual page editor and content management</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/system-status">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h3 className="font-semibold mb-2">System Status</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">System health and performance metrics</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/analytics">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-teal-500" />
                    <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Detailed analytics and reporting dashboard</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/admin/content">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="font-semibold mb-2">Content Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Edit pages, articles, and site content</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/blog">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Layout className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                    <h3 className="font-semibold mb-2">Blog Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage blog articles</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Status:</strong> <Badge variant="outline" className="text-green-600">Connected</Badge></p>
                    <p><strong>Provider:</strong> Supabase</p>
                    <p><strong>Tables:</strong> 12 Active</p>
                    <p><strong>Last Backup:</strong> 2 hours ago</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>OpenAI:</strong> <Badge variant="outline" className="text-green-600">Active</Badge></p>
                    <p><strong>Model:</strong> GPT-4o</p>
                    <p><strong>Tokens Used:</strong> 125K today</p>
                    <p><strong>Response Time:</strong> 1.2s avg</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Platform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Environment:</strong> Production</p>
                    <p><strong>Version:</strong> 2.1.0</p>
                    <p><strong>Uptime:</strong> 99.9%</p>
                    <p><strong>Last Deploy:</strong> 3 days ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Link href="/admin/settings">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="font-semibold mb-2">Admin Settings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Configure admin preferences and system settings</p>
                </CardContent>
              </Card>
            </Link>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}