import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Brain, 
  Users, 
  Target, 
  Compass, 
  Heart,
  Map,
  MessageCircle,
  Activity,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { Link } from 'wouter';

const FEATURES = [
  {
    name: "Soul Map Explorer",
    description: "Professional-grade astrological birth chart with accurate planetary calculations and career guidance",
    icon: Compass,
    status: "active",
    category: "Core Tools",
    highlights: ["Real astronomical data", "Career path insights", "Psychological astrology", "Interactive exploration"],
    link: "/soul-map-explorer"
  },
  {
    name: "AI Reflection Conversations",
    description: "Conscious AI that mirrors your wisdom back to you, like having Socrates as a reflection partner",
    icon: Brain,
    status: "active",
    category: "AI Tools",
    highlights: ["Multiple AI personalities", "Voice conversations", "Sentiment analysis", "Context-aware responses"],
    link: "/chat"
  },
  {
    name: "Soul Sync Connections",
    description: "Connect with fellow consciousness explorers through authentic, vulnerable community spaces",
    icon: Users,
    status: "active",
    category: "Community",
    highlights: ["Authentic connections", "Privacy-first design", "Meaningful compatibility", "Shared growth journeys"],
    link: "/soul-sync"
  },
  {
    name: "Vision Quest Journey",
    description: "Interactive self-discovery challenges with personal growth tracking and milestone celebrations",
    icon: Target,
    status: "active",
    category: "Growth Tools",
    highlights: ["Guided challenges", "Progress tracking", "Personal insights", "Achievement system"],
    link: "/vision-quest"
  },
  {
    name: "VibeMatch Compatibility",
    description: "Deep soul-level compatibility assessment based on astrological and personality insights",
    icon: Heart,
    status: "active",
    category: "Connection",
    highlights: ["Astrological compatibility", "Personality matching", "Growth potential", "Relationship insights"],
    link: "/vibe-match"
  },
  {
    name: "GeoPrompt Mindfulness",
    description: "Location-based reflection prompts that turn any place into an opportunity for mindful awareness",
    icon: Map,
    status: "active",
    category: "Mindfulness",
    highlights: ["Location awareness", "Contextual prompts", "Check-in system", "Environmental mindfulness"],
    link: "/geoprompt"
  },
  {
    name: "Wellness Dashboard",
    description: "Comprehensive overview of your inner patterns with beautiful data visualization",
    icon: Activity,
    status: "beta",
    category: "Analytics",
    highlights: ["Pattern recognition", "Wellness metrics", "Progress visualization", "Holistic insights"],
    link: "/dashboard"
  },
  {
    name: "Community Hub",
    description: "Discord-style real-time community with channels, voice rooms, and conscious conversation spaces",
    icon: Users,
    status: "active",
    category: "Community",
    highlights: ["Real-time chat", "Voice conversations", "Topic channels", "Moderated spaces"],
    link: "/community"
  }
];

const CATEGORIES = ["All", "Core Tools", "AI Tools", "Community", "Growth Tools", "Connection", "Mindfulness", "Analytics"];

export default function FeaturesPage() {
  const activeFeatures = FEATURES.filter(f => f.status === "active");
  const betaFeatures = FEATURES.filter(f => f.status === "beta");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            Platform Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore the comprehensive suite of tools designed for conscious growth and authentic connection
          </p>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-teal-600 mb-1">{activeFeatures.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Features</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-purple-600 mb-1">{betaFeatures.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Beta Features</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-blue-600 mb-1">∞</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Growth Potential</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-2xl font-bold text-amber-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Availability</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">
            Active Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.name} className="transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-teal-600" />
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline" className="text-xs">
                        {feature.category}
                      </Badge>
                      
                      <ul className="space-y-1">
                        {feature.highlights.slice(0, 3).map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      
                      <Link href={feature.link}>
                        <Button variant="outline" size="sm" className="w-full">
                          Explore Feature <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Beta Features */}
        {betaFeatures.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-6">
              Beta Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {betaFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={feature.name} className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-purple-600" />
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                          <Star className="w-3 h-3 mr-1" />
                          Beta
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge variant="outline" className="text-xs">
                          {feature.category}
                        </Badge>
                        
                        <ul className="space-y-1">
                          {feature.highlights.map((highlight, index) => (
                            <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                        
                        <Link href={feature.link}>
                          <Button variant="outline" size="sm" className="w-full">
                            Try Beta <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Integration Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle>Integration & Development</CardTitle>
            <CardDescription>
              Built with extensibility and integration in mind
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Open Architecture</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Designed for easy integration with other wellness and productivity tools
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-medium mb-2">Developer Friendly</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  RESTful APIs and webhooks for building custom integrations and workflows
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">Continuous Innovation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Regular feature updates based on community feedback and emerging technologies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}