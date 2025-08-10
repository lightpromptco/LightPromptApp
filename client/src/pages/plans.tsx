import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { StripeCheckout } from '@/components/StripeCheckout';
import { CheckCircle, Crown, Zap, Heart, Star, Users } from 'lucide-react';

interface User {
  id: string;
  email: string;
  tier: string;
  tokensUsed: number;
  tokenLimit: number;
}

export default function PlansPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkoutState, setCheckoutState] = useState<{
    isOpen: boolean;
    planId: string;
    planName: string;
    price: string;
  }>({ isOpen: false, planId: '', planName: '', price: '' });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
  }, []);

  // Fetch fresh user data
  const { data: freshUserData } = useQuery<User>({
    queryKey: ['/api/users', user?.id],
    enabled: !!user?.id
  });

  const currentUser = freshUserData || user;
  const tokensRemaining = currentUser ? currentUser.tokenLimit - currentUser.tokensUsed : 0;
  const usagePercentage = currentUser ? (currentUser.tokensUsed / currentUser.tokenLimit) * 100 : 0;

  const PRICING_PLANS = [
    {
      id: 'free',
      name: 'Free Explorer',
      price: '$0',
      period: '/forever',
      description: 'Start your conscious AI journey',
      features: [
        '5 AI conversations per day',
        'Basic Soul Map access',
        'Community features',
        'Vision Quest (limited)',
        'Basic dashboard'
      ],
      popular: false,
      buttonText: 'Current Plan',
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'premium',
      name: 'Soul Seeker',
      price: '$29',
      period: '/month',
      description: 'Unlock full conscious AI experience',
      features: [
        'Unlimited AI conversations',
        'Full Soul Map & Birth Charts',
        'Advanced Vision Quest',
        'Soul-Tech Dashboard',
        'Priority community access',
        'Personal growth tracking',
        'Export conversation insights'
      ],
      popular: true,
      buttonText: 'Upgrade Now',
      color: 'from-purple-500 to-blue-500'
    },
    {
      id: 'business',
      name: 'Organization',
      price: '$199',
      period: '/month',
      description: 'Conscious AI for teams & enterprises',
      features: [
        'Everything in Soul Seeker',
        'Team dashboards & analytics',
        'Custom AI bot configurations',
        'Admin management tools',
        'White-label options',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      color: 'from-teal-500 to-emerald-500'
    }
  ];

  const features = [
    {
      icon: '🤖',
      title: 'All AI Wellness Bots',
      description: 'Access to LightPromptBot, BodyMirror, SoulMap, VisionQuest, and LightPrompt:Ed',
      included: true
    },
    {
      icon: '💬',
      title: 'Unlimited Conversations',
      description: 'Chat as much as you want within your daily token allowance',
      included: true
    },
    {
      icon: '📊',
      title: 'Wellness Dashboard',
      description: 'Track habits, mood patterns, and progress over time',
      included: true
    },
    {
      icon: '🏆',
      title: 'Challenges & Rewards',
      description: 'Join wellness challenges and earn points for healthy habits',
      included: true
    },
    {
      icon: '🎯',
      title: 'Habit Tracking',
      description: 'Build and maintain healthy daily routines',
      included: true
    },
    {
      icon: '🎭',
      title: 'Sentiment Analysis',
      description: 'Real-time emotional tone tracking in conversations',
      included: true
    },
    {
      icon: '🔊',
      title: 'Voice Features',
      description: 'Voice recording and text-to-speech capabilities',
      included: true
    },
    {
      icon: '📱',
      title: 'Health Integration',
      description: 'Connect Apple Health and HomeKit data (coming soon)',
      included: true
    }
  ];

  const handleGetMoreTokens = () => {
    toast({
      title: "More Tokens Available",
      description: "Join a wellness challenge or course to increase your daily token limit!",
    });
  };

  const handleUpgrade = (planId: string, planName: string, price: string) => {
    if (!currentUser?.id) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }
    
    setCheckoutState({ 
      isOpen: true, 
      planId, 
      planName, 
      price 
    });
  };

  const handleCheckoutClose = () => {
    setCheckoutState({ 
      isOpen: false, 
      planId: '', 
      planName: '', 
      price: '' 
    });
  };

  const handleUpgradeSuccess = (updatedUser: any) => {
    setUser(updatedUser);
    queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    
    toast({
      title: "🎉 Welcome to your new plan!",
      description: `You now have ${updatedUser.tokenLimit} daily tokens and access to all premium features.`,
    });
  };

  const isCurrentPlan = (planTier: string) => {
    if (!currentUser) return false;
    return currentUser.tier === planTier;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
            LightPrompt Pricing Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your wellness journey. From free exploration to enterprise-level customization.
          </p>
        </div>

        {/* Current Usage Status */}
        {currentUser && (
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <i className="fas fa-user-circle mr-3 text-emerald-600"></i>
                  Your Current Status
                </span>
                <Badge className="bg-emerald-500 text-white">
                  {currentUser.tier.charAt(0).toUpperCase() + currentUser.tier.slice(1)} Access
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {tokensRemaining}
                  </div>
                  <div className="text-sm text-emerald-700">Tokens Remaining Today</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {currentUser.tokenLimit}
                  </div>
                  <div className="text-sm text-blue-700">Daily Token Limit</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    ∞
                  </div>
                  <div className="text-sm text-purple-700">Features Available</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Today's Usage</span>
                  <span>{currentUser.tokensUsed}/{currentUser.tokenLimit} tokens</span>
                </div>
                <Progress value={usagePercentage} className="h-3" />
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                <div className="text-sm text-blue-800">
                  <i className="fas fa-lightbulb mr-2"></i>
                  <strong>Token-based wellness:</strong> Each meaningful conversation uses one token. 
                  This encourages mindful interaction and prevents AI dependency while keeping everything completely free.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Navigation */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Explore LightPrompt Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto border-blue-200 hover:bg-blue-50"
                  onClick={() => window.location.href = '/challenges'}
                >
                  <i className="fas fa-trophy text-blue-600 text-xl mb-2"></i>
                  <span className="text-sm font-medium">Challenges</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto border-green-200 hover:bg-green-50"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <i className="fas fa-chart-line text-green-600 text-xl mb-2"></i>
                  <span className="text-sm font-medium">Dashboard</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto border-purple-200 hover:bg-purple-50"
                  onClick={() => window.location.href = '/'}
                >
                  <i className="fas fa-comments text-purple-600 text-xl mb-2"></i>
                  <span className="text-sm font-medium">Chat</span>
                </Button>
                <Button 
                  variant="outline"
                  className="flex flex-col items-center p-4 h-auto border-orange-200 hover:bg-orange-50"
                  onClick={() => window.location.href = '/course-access'}
                >
                  <i className="fas fa-graduation-cap text-orange-600 text-xl mb-2"></i>
                  <span className="text-sm font-medium">Courses</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader className={`text-center bg-gradient-to-r ${plan.color} text-white rounded-t-lg`}>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">{plan.price}</div>
                  <div className="text-sm opacity-90">{plan.period}</div>
                  <p className="text-sm opacity-80">{plan.description}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full mt-6 bg-gradient-to-r ${plan.color} hover:opacity-90`}
                  onClick={() => plan.id === 'business' ? 
                    window.open('mailto:support@lightprompt.co?subject=Enterprise%20Inquiry') : 
                    setCheckoutState({
                      isOpen: true,
                      planId: plan.id,
                      planName: plan.name,
                      price: plan.price.replace('$', '')
                    })
                  }
                  disabled={isCurrentPlan(plan.id)}
                >
                  {isCurrentPlan(plan.id) ? 'Current Plan' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Original Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Explorer Tier - Free */}
          <Card className="relative bg-gradient-to-br from-gray-50 to-slate-50 border-slate-200">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-t-lg">
              <div className="text-center">
                <CardTitle className="text-xl">Explorer</CardTitle>
                <p className="text-gray-200 text-sm mt-1">Perfect for discovering your wellness journey</p>
                <div className="text-3xl font-bold mt-2">$0</div>
                <div className="text-gray-300 text-xs">/mo</div>
                <div className="text-gray-300 text-xs">Forever free</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>All Bots: LightPrompt, BodyMirror, CosmosBot, GeoPrompt, VisionQuest (within token limits)</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>5 daily check-ins per month</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>3 custom habits tracking</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Basic CosmosBot (astrology, metaphysical wisdom)</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Community group access</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>2 wellness patterns per month</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Partner mode preview (1 connection)</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-2 rounded text-xs text-center">
                <div><strong>Monthly tokens:</strong> 50</div>
                <div><strong>AI Bots:</strong> 2</div>
                <div><strong>Daily check-ins:</strong> 5/month</div>
                <div><strong>Habits tracking:</strong> 3</div>
                <div><strong>CosmosBot readings:</strong> 2/month</div>
                <div><strong>GeoPrompts:</strong> 10/month</div>
              </div>

              <Button className="w-full bg-gray-600 hover:bg-gray-700" onClick={() => window.location.href = '/'}>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Growth Tier - $29 */}
          <Card className="relative bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 border-2 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-teal-500 text-white px-4 py-1">
                Popular
              </Badge>
            </div>
            <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg pt-8">
              <div className="text-center">
                <CardTitle className="text-xl">Growth</CardTitle>
                <p className="text-teal-200 text-sm mt-1">For those committed to personal transformation</p>
                <div className="text-3xl font-bold mt-2">$29</div>
                <div className="text-teal-300 text-xs">/mo</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>All Explorer features</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Access to all specialized bots</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Unlimited habit tracking</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Advanced wellness patterns</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>VibeMatch community features</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Voice conversations</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Export wellness data</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Full CosmosBot birth chart & resources</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Unlimited partner mode connections</span>
                </div>
              </div>

              <div className="bg-teal-50 p-2 rounded text-xs text-center">
                <div><strong>Monthly tokens:</strong> 1,000</div>
                <div><strong>AI Bots:</strong> All</div>
                <div><strong>Daily check-ins:</strong> Unlimited/month</div>
                <div><strong>Habits tracking:</strong> Unlimited</div>
                <div><strong>CosmosBot readings:</strong> Unlimited/month</div>
                <div><strong>GeoPrompts:</strong> Unlimited/month</div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
                onClick={() => handleUpgrade('growth', 'Growth', '29')}
                disabled={isCurrentPlan('growth')}
              >
                {isCurrentPlan('growth') ? (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Current Plan
                  </>
                ) : (
                  <>
                    <i className="fas fa-crown mr-2"></i>
                    Upgrade Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resonance Tier - $49 */}
          <Card className="relative bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <div className="text-center">
                <CardTitle className="text-xl">Resonance</CardTitle>
                <p className="text-purple-200 text-sm mt-1">Deep connection and partnership features</p>
                <div className="text-3xl font-bold mt-2">$49</div>
                <div className="text-purple-300 text-xs">/mo</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>All Growth features</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Partner Mode (share with loved ones)</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Couples wellness tracking</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Advanced AI personality customization</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Priority support</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Early access to new features</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Custom wellness goal setting</span>
                </div>
              </div>

              <div className="bg-purple-50 p-2 rounded text-xs text-center">
                <div><strong>Monthly tokens:</strong> 2,500</div>
                <div><strong>AI Bots:</strong> All</div>
                <div><strong>Daily check-ins:</strong> 0/month</div>
                <div><strong>Habits tracking:</strong> 0</div>
                <div><strong>CosmosBot readings:</strong> 0/month</div>
                <div><strong>GeoPrompts:</strong> 0/month</div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => handleUpgrade('resonance', 'Resonance', '49')}
                disabled={isCurrentPlan('resonance')}
              >
                {isCurrentPlan('resonance') ? (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Current Plan
                  </>
                ) : (
                  <>
                    <i className="fas fa-crown mr-2"></i>
                    Upgrade Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Tier - $199 */}
          <Card className="relative bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
              <div className="text-center">
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <p className="text-indigo-200 text-sm mt-1">For organizations and wellness professionals</p>
                <div className="text-3xl font-bold mt-2">$199</div>
                <div className="text-indigo-300 text-xs">/mo</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>All Resonance features</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Team & organization management</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Custom AI training</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Advanced analytics dashboard</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>API access</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>White-label options</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                  <span>Dedicated account manager</span>
                </div>
              </div>

              <div className="bg-indigo-50 p-2 rounded text-xs text-center">
                <div><strong>Monthly tokens:</strong> 10,000</div>
                <div><strong>AI Bots:</strong> All</div>
                <div><strong>Daily check-ins:</strong> 0/month</div>
                <div><strong>Habits tracking:</strong> 0</div>
                <div><strong>CosmosBot readings:</strong> 0/month</div>
                <div><strong>GeoPrompts:</strong> 0/month</div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                onClick={() => handleUpgrade('enterprise', 'Enterprise', '199')}
                disabled={isCurrentPlan('enterprise')}
              >
                {isCurrentPlan('enterprise') ? (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Current Plan
                  </>
                ) : (
                  <>
                    <i className="fas fa-crown mr-2"></i>
                    Upgrade Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison Table */}
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Feature Comparison</CardTitle>
            <p className="text-center text-gray-600">See what's included in each plan</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Feature</th>
                    <th className="text-center p-3">Explorer</th>
                    <th className="text-center p-3">Growth</th>
                    <th className="text-center p-3">Resonance</th>
                    <th className="text-center p-3">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Monthly Tokens</td>
                    <td className="text-center p-3">50</td>
                    <td className="text-center p-3">1,000</td>
                    <td className="text-center p-3">2,500</td>
                    <td className="text-center p-3">10,000</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">AI Wellness Bots</td>
                    <td className="text-center p-3">2</td>
                    <td className="text-center p-3">All</td>
                    <td className="text-center p-3">All</td>
                    <td className="text-center p-3">All</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Daily Check-ins</td>
                    <td className="text-center p-3">5/month</td>
                    <td className="text-center p-3">Unlimited</td>
                    <td className="text-center p-3">Unlimited</td>
                    <td className="text-center p-3">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Habit Tracking</td>
                    <td className="text-center p-3">3</td>
                    <td className="text-center p-3">Unlimited</td>
                    <td className="text-center p-3">Unlimited</td>
                    <td className="text-center p-3">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Partner Mode</td>
                    <td className="text-center p-3">Preview (1)</td>
                    <td className="text-center p-3">Unlimited</td>
                    <td className="text-center p-3">Advanced</td>
                    <td className="text-center p-3">Enterprise</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Voice Features</td>
                    <td className="text-center p-3">Basic</td>
                    <td className="text-center p-3">Full</td>
                    <td className="text-center p-3">Full</td>
                    <td className="text-center p-3">Full</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose LightPrompt */}
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-emerald-800">
              Why Choose LightPrompt?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl">🤖</div>
                <h3 className="font-semibold text-blue-800">Multiple AI Companions</h3>
                <p className="text-sm text-blue-700">Access specialized bots for different aspects of your wellness journey</p>
              </div>
              
              <div className="text-center space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl">📊</div>
                <h3 className="font-semibold text-purple-800">Advanced Analytics</h3>
                <p className="text-sm text-purple-700">Track your wellness patterns and progress with detailed insights</p>
              </div>
              
              <div className="text-center space-y-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-3xl">🔮</div>
                <h3 className="font-semibold text-emerald-800">Metaphysical Integration</h3>
                <p className="text-sm text-emerald-700">Unique CosmosBot features for astrology and spiritual wellness guidance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Philosophy Section */}
        <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Our Philosophy</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl">🧘</div>
                  <h3 className="font-semibold">Mindful Technology</h3>
                  <p className="text-sm text-gray-600">
                    Token limits encourage intentional, meaningful interactions instead of endless scrolling
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">🎁</div>
                  <h3 className="font-semibold">Free & Accessible</h3>
                  <p className="text-sm text-gray-600">
                    Wellness support shouldn't have a price tag. Everyone deserves access to AI wellness tools
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl">🌱</div>
                  <h3 className="font-semibold">Sustainable Growth</h3>
                  <p className="text-sm text-gray-600">
                    Quality conversations and progress tracking help build lasting wellness habits
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-lg border border-purple-200">
                <blockquote className="text-lg italic text-purple-800">
                  "True wellness technology should enhance your inner journey, not create dependency. 
                  LightPrompt provides the tools, you provide the intention."
                </blockquote>
                <div className="text-purple-600 text-sm mt-2">— LightPrompt Philosophy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Why token limits instead of unlimited access?</h4>
                  <p className="text-sm text-gray-600">
                    Token limits encourage mindful, intentional conversations rather than addictive usage patterns. 
                    Quality over quantity leads to better wellness outcomes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Can I increase my token limit?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! Join wellness challenges, participate in courses, or contribute to the community 
                    to earn additional daily tokens.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Is LightPrompt really completely free?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! All features are free within your daily token allowance. We believe wellness 
                    support should be accessible to everyone regardless of financial situation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How do you sustain the platform?</h4>
                  <p className="text-sm text-gray-600">
                    Through book sales, course offerings, and community support. We're committed 
                    to keeping the core platform free for all users.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Ready to Begin Your Wellness Journey?</h2>
            <p className="text-gray-600 text-lg">
              Start conversations with your AI wellness companions - completely free, forever.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                onClick={() => window.location.href = '/'}
              >
                <i className="fas fa-comments mr-2"></i>
                Start Chatting
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/dashboard'}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                View Dashboard
              </Button>
            </div>
          </div>
        </div>

      </div>
      
      {/* Stripe Checkout Modal */}
      {checkoutState.isOpen && currentUser && (
        <StripeCheckout
          planId={checkoutState.planId}
          planName={checkoutState.planName}
          price={checkoutState.price}
          userId={currentUser.id}
          isOpen={checkoutState.isOpen}
          onClose={handleCheckoutClose}
          onSuccess={handleUpgradeSuccess}
        />
      )}
    </div>
  );
}