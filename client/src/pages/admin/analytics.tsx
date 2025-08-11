import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  MessageSquare, 
  Activity, 
  TrendingUp, 
  Calendar,
  Globe,
  Database,
  Zap,
  Brain,
  Heart,
  Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AnalyticsData {
  users: {
    total: number;
    activeThisWeek: number;
    newThisMonth: number;
    retention: number;
  };
  engagement: {
    chatSessions: number;
    averageSessionLength: number;
    dailyActiveUsers: number;
    topFeatures: { name: string; usage: number }[];
  };
  soulTech: {
    birthChartsGenerated: number;
    oracleReadings: number;
    vibeMatchScores: number;
    averageScore: number;
  };
  system: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    apiCalls: number;
  };
  insights: {
    topUserPathways: { pathway: string; count: number }[];
    popularTimes: { hour: number; activity: number }[];
    sentimentTrends: { date: string; sentiment: number }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/admin/analytics', selectedTimeRange],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const mockData: AnalyticsData = {
    users: {
      total: 0,
      activeThisWeek: 0,
      newThisMonth: 0,
      retention: 0,
    },
    engagement: {
      chatSessions: 0,
      averageSessionLength: 0,
      dailyActiveUsers: 0,
      topFeatures: [],
    },
    soulTech: {
      birthChartsGenerated: 0,
      oracleReadings: 0,
      vibeMatchScores: 0,
      averageScore: 0,
    },
    system: {
      uptime: 0,
      responseTime: 0,
      errorRate: 0,
      apiCalls: 0,
    },
    insights: {
      topUserPathways: [],
      popularTimes: [],
      sentimentTrends: [],
    }
  };

  const data = analytics || mockData;

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend, color = "text-blue-600" }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    trend?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
        {trend && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {trend}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">LightPrompt Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400">Platform insights and user engagement metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as typeof selectedTimeRange)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading analytics data...</p>
          </div>
        )}

        {/* No Data Message */}
        {!isLoading && (!analytics || Object.values(data.users).every(v => v === 0)) && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Analytics Data Loading</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect your database and user tracking to view comprehensive analytics. 
                Real user data will appear here once the analytics system is fully configured.
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="soultech">Soul-Tech</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Users"
                value={data.users.total}
                subtitle={`${data.users.newThisMonth} new this month`}
                icon={Users}
                trend={data.users.retention > 0 ? `${data.users.retention}% retention` : 'No data'}
                color="text-blue-600"
              />
              <MetricCard
                title="Chat Sessions"
                value={data.engagement.chatSessions}
                subtitle={`Avg. ${data.engagement.averageSessionLength}min length`}
                icon={MessageSquare}
                trend={data.engagement.dailyActiveUsers > 0 ? `${data.engagement.dailyActiveUsers} daily active` : 'No data'}
                color="text-green-600"
              />
              <MetricCard
                title="Birth Charts"
                value={data.soulTech.birthChartsGenerated}
                subtitle="Generated this period"
                icon={Star}
                trend={data.soulTech.averageScore > 0 ? `${data.soulTech.averageScore}% avg. score` : 'No data'}
                color="text-purple-600"
              />
              <MetricCard
                title="System Uptime"
                value={`${data.system.uptime}%`}
                subtitle={`${data.system.responseTime}ms response`}
                icon={Activity}
                trend={data.system.errorRate >= 0 ? `${data.system.errorRate}% error rate` : 'No data'}
                color="text-orange-600"
              />
            </div>

            {/* Feature Usage */}
            {data.engagement.topFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.engagement.topFeatures}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.insights.sentimentTrends.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data.insights.sentimentTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sentiment" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      User growth data will appear here once tracking is enabled
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* User Pathways */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular User Pathways</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.insights.topUserPathways.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={data.insights.topUserPathways}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label
                        >
                          {data.insights.topUserPathways.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      User pathway data will appear here once tracking is configured
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="soultech" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Birth Charts Generated"
                value={data.soulTech.birthChartsGenerated}
                subtitle="Astrological readings"
                icon={Star}
                color="text-purple-600"
              />
              <MetricCard
                title="Oracle Readings"
                value={data.soulTech.oracleReadings}
                subtitle="Guidance sessions"
                icon={Brain}
                color="text-blue-600"
              />
              <MetricCard
                title="VibeMatch Scores"
                value={data.soulTech.vibeMatchScores}
                subtitle={`${data.soulTech.averageScore}% average`}
                icon={Heart}
                color="text-pink-600"
              />
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            {data.insights.popularTimes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Usage by Hour</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.insights.popularTimes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="activity" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Uptime"
                value={`${data.system.uptime}%`}
                icon={Activity}
                color="text-green-600"
              />
              <MetricCard
                title="Response Time"
                value={`${data.system.responseTime}ms`}
                icon={Zap}
                color="text-yellow-600"
              />
              <MetricCard
                title="Error Rate"
                value={`${data.system.errorRate}%`}
                icon={Globe}
                color="text-red-600"
              />
              <MetricCard
                title="API Calls"
                value={data.system.apiCalls}
                subtitle="This period"
                icon={Database}
                color="text-blue-600"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}