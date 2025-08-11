import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Smartphone, 
  Calendar, 
  Heart, 
  Brain,
  Zap,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  Globe,
  Webhook,
  Key,
  Code
} from 'lucide-react';

const INTEGRATIONS = [
  {
    name: "Apple Health",
    description: "Sync wellness metrics, heart rate variability, and sleep data for comprehensive health insights",
    icon: Heart,
    status: "available",
    category: "Health & Fitness",
    connected: false,
    features: ["Heart rate monitoring", "Sleep tracking", "Activity levels", "Mindfulness minutes"]
  },
  {
    name: "Google Calendar",
    description: "Automatically schedule reflection time and sync astrological events with your calendar",
    icon: Calendar,
    status: "available",
    category: "Productivity",
    connected: true,
    features: ["Event scheduling", "Reflection reminders", "Astrological events", "Goal tracking"]
  },
  {
    name: "Notion",
    description: "Export your insights, goals, and progress tracking to your personal knowledge management system",
    icon: Brain,
    status: "available",
    category: "Productivity",
    connected: false,
    features: ["Automatic journaling", "Goal templates", "Progress tracking", "Insight compilation"]
  },
  {
    name: "Slack",
    description: "Get daily wisdom prompts and team consciousness insights delivered to your workspace",
    icon: Zap,
    status: "coming_soon",
    category: "Team & Collaboration",
    connected: false,
    features: ["Daily prompts", "Team insights", "Conscious communication", "Wellness check-ins"]
  },
  {
    name: "Discord",
    description: "Enhanced community features with voice channels and real-time consciousness discussions",
    icon: Smartphone,
    status: "beta",
    category: "Community",
    connected: true,
    features: ["Voice channels", "Community events", "Real-time chat", "Moderated spaces"]
  },
  {
    name: "Zapier",
    description: "Connect LightPrompt to thousands of apps with automated workflows and triggers",
    icon: LinkIcon,
    status: "available",
    category: "Automation",
    connected: false,
    features: ["Custom workflows", "Trigger automation", "Data sync", "Multi-app connections"]
  }
];

const DEVELOPER_TOOLS = [
  {
    name: "REST API",
    description: "Full access to LightPrompt data and features through our comprehensive REST API",
    icon: Code,
    features: ["User data access", "Astrological calculations", "AI conversations", "Wellness metrics"]
  },
  {
    name: "Webhooks",
    description: "Real-time notifications for events and data changes in your LightPrompt account",
    icon: Webhook,
    features: ["Real-time events", "Custom endpoints", "Secure delivery", "Event filtering"]
  },
  {
    name: "API Keys",
    description: "Secure authentication and rate-limited access to protect your integrations",
    icon: Key,
    features: ["Secure authentication", "Rate limiting", "Usage analytics", "Access controls"]
  }
];

export default function IntegrationsPage() {
  const [connectedIntegrations, setConnectedIntegrations] = useState(
    INTEGRATIONS.filter(i => i.connected).map(i => i.name)
  );

  const toggleIntegration = (name: string) => {
    setConnectedIntegrations(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
          <CheckCircle className="w-3 h-3 mr-1" />
          Available
        </Badge>;
      case 'beta':
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
          <Clock className="w-3 h-3 mr-1" />
          Beta
        </Badge>;
      case 'coming_soon':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
          <Clock className="w-3 h-3 mr-1" />
          Coming Soon
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            Integrations
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect LightPrompt with your favorite tools and create a seamless conscious technology ecosystem
          </p>
        </div>

        {/* Integration Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {INTEGRATIONS.filter(i => i.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {connectedIntegrations.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Connected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {INTEGRATIONS.filter(i => i.status === 'beta').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Beta</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-amber-600 mb-1">
                {INTEGRATIONS.filter(i => i.status === 'coming_soon').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Coming Soon</div>
            </CardContent>
          </Card>
        </div>

        {/* Available Integrations */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">
            Available Integrations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INTEGRATIONS.map((integration) => {
              const IconComponent = integration.icon;
              const isConnected = connectedIntegrations.includes(integration.name);
              const isAvailable = integration.status === 'available' || integration.status === 'beta';
              
              return (
                <Card key={integration.name} className="transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {integration.category}
                          </Badge>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ul className="space-y-1">
                        {integration.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {isConnected ? 'Connected' : 'Connect'}
                        </span>
                        <Switch
                          checked={isConnected}
                          onCheckedChange={() => isAvailable && toggleIntegration(integration.name)}
                          disabled={!isAvailable}
                        />
                      </div>
                      
                      {!isAvailable && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {integration.status === 'coming_soon' ? 'Available soon!' : 'Currently in beta testing'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Developer Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">
            Developer Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEVELOPER_TOOLS.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.name} className="transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mb-3">
                      <IconComponent className="w-5 h-5 text-teal-600" />
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 mb-4">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" size="sm" className="w-full">
                      View Documentation
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Custom Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Need a Custom Integration?
            </CardTitle>
            <CardDescription>
              We're always expanding our integration ecosystem. Let us know what tools you'd like to connect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Whether it's a popular productivity tool, health device, or custom business system, 
                  we're here to help you create the perfect conscious technology workflow.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">
                    Request Integration
                  </Button>
                  <Button>
                    Contact Developer Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}