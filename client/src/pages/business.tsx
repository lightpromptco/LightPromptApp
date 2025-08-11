import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Shield, 
  Zap, 
  Target,
  BarChart3,
  HeadphonesIcon,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Heart
} from 'lucide-react';

const ENTERPRISE_FEATURES = [
  {
    name: "Team Wellness Analytics",
    description: "Comprehensive insights into team mental health, stress patterns, and collective well-being",
    icon: BarChart3,
    benefits: ["Real-time wellness tracking", "Anonymous health metrics", "Trend analysis", "Actionable insights"]
  },
  {
    name: "Conscious Leadership Training",
    description: "AI-powered leadership development focused on empathy, awareness, and human-centered management",
    icon: Target,
    benefits: ["Personalized coaching", "360-degree feedback", "Growth tracking", "Leadership assessments"]
  },
  {
    name: "Team Soul Sync",
    description: "Enhanced team compatibility and communication insights based on psychological and astrological analysis",
    icon: Users,
    benefits: ["Team compatibility scores", "Communication optimization", "Conflict resolution", "Collaboration enhancement"]
  },
  {
    name: "Enterprise Security",
    description: "Advanced security features including SSO, audit logs, and enterprise-grade data protection",
    icon: Shield,
    benefits: ["Single Sign-On (SSO)", "Audit trails", "Data encryption", "Compliance reporting"]
  }
];

const PRICING_TIERS = [
  {
    name: "Startup",
    price: "$29",
    period: "per user/month",
    description: "Perfect for growing teams",
    features: [
      "Up to 25 team members",
      "Basic wellness analytics",
      "Team compatibility insights", 
      "Standard support",
      "Core AI conversations"
    ],
    popular: false
  },
  {
    name: "Business",
    price: "$59",
    period: "per user/month", 
    description: "Advanced features for established teams",
    features: [
      "Up to 100 team members",
      "Advanced wellness analytics",
      "Leadership development tools",
      "Priority support",
      "Custom integrations",
      "Detailed reporting"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "Full-scale solution for large organizations",
    features: [
      "Unlimited team members",
      "Full enterprise features",
      "Dedicated account manager",
      "24/7 support",
      "Custom development",
      "On-premise deployment"
    ],
    popular: false
  }
];

const SUCCESS_STORIES = [
  {
    company: "Mindful Tech Co.",
    size: "150 employees",
    result: "35% reduction in stress-related sick days",
    quote: "LightPrompt transformed how our team communicates and supports each other."
  },
  {
    company: "Conscious Capital",
    size: "80 employees", 
    result: "42% improvement in team satisfaction",
    quote: "The leadership insights helped us build a more empathetic management culture."
  },
  {
    company: "Wellness Innovations",
    size: "200+ employees",
    result: "50% increase in employee engagement", 
    quote: "Our teams are more aligned and productive than ever before."
  }
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-light text-gray-900 dark:text-white mb-6">
            LightPrompt for Business
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Transform your workplace culture with conscious technology. Build more empathetic teams, 
            improve wellness, and create a thriving organizational consciousness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Employee Satisfaction</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stress Reduction</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-3xl font-bold text-teal-600 mb-2">60%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Better Communication</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-3xl font-bold text-green-600 mb-2">25%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Productivity Increase</div>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white text-center mb-12">
            Enterprise Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ENTERPRISE_FEATURES.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.name} className="transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.name}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white text-center mb-12">
            Enterprise Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_TIERS.map((tier) => (
              <Card key={tier.name} className={`relative transition-all duration-200 hover:shadow-lg ${
                tier.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {tier.price}
                    <span className="text-sm font-normal text-gray-500">/{tier.period}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, index) => (
              <Card key={index} className="transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{story.company}</span>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {story.size}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 mb-3">
                    {story.result}
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-400 italic">
                    "{story.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation & Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Implementation
              </CardTitle>
              <CardDescription>
                Get your team up and running in days, not months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">1</div>
                  <span className="text-sm">Setup and configuration (24 hours)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">2</div>
                  <span className="text-sm">Team onboarding and training (2-3 days)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">3</div>
                  <span className="text-sm">Go live with full support (1 week)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5" />
                Dedicated Support
              </CardTitle>
              <CardDescription>
                Professional support every step of the way
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">24/7 technical support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Dedicated account manager</span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Wellness implementation guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Custom integrations support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-0">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Workplace?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join progressive companies building more conscious, empathetic, and thriving teams with LightPrompt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Schedule Your Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Start Free Trial
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              30-day free trial • No credit card required • Setup in 24 hours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}