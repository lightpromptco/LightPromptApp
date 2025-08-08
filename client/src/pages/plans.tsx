import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  tier: string;
  tokensUsed: number;
  tokenLimit: number;
}

export default function PlansPage() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
            LightPrompt Plans & Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soul-tech wellness AI companions - completely free within your daily token allowance. 
            No subscriptions, no paywalls, just mindful usage limits.
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

        {/* Multiple Plan Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic/Free Tier */}
          <Card className="relative bg-gradient-to-br from-gray-50 to-slate-50 border-slate-200">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-t-lg">
              <div className="text-center">
                <CardTitle className="text-xl">Basic</CardTitle>
                <p className="text-gray-200 text-sm mt-1">Start your wellness journey</p>
                <div className="text-3xl font-bold mt-2">$0</div>
                <div className="text-gray-300 text-xs">Forever Free</div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="text-center text-green-800 font-medium mb-2">
                    <i className="fas fa-coins mr-2"></i>10 Daily Tokens
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>All 5 AI wellness bots</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Basic wellness dashboard</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Join wellness challenges</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Voice features</span>
                  </div>
                </div>

                <Button className="w-full bg-gray-600 hover:bg-gray-700" onClick={() => window.location.href = '/'}>
                  <i className="fas fa-rocket mr-2"></i>
                  Start Free
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Growth Tier */}
          <Card className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 border-2 shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white px-4 py-1">
                <i className="fas fa-star mr-1"></i>Most Popular
              </Badge>
            </div>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg pt-8">
              <div className="text-center">
                <CardTitle className="text-xl">Growth</CardTitle>
                <p className="text-blue-200 text-sm mt-1">Accelerate your wellness</p>
                <div className="text-3xl font-bold mt-2">$0</div>
                <div className="text-blue-300 text-xs">Free via Challenges</div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <div className="text-center text-blue-800 font-medium mb-2">
                    <i className="fas fa-coins mr-2"></i>25 Daily Tokens
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Everything in Basic</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Advanced wellness insights</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Priority challenge access</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Habit tracking widgets</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={() => window.location.href = '/challenges'}
                >
                  <i className="fas fa-trophy mr-2"></i>
                  Join Challenges
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="relative bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <div className="text-center">
                <CardTitle className="text-xl">Premium</CardTitle>
                <p className="text-purple-200 text-sm mt-1">Master your wellness</p>
                <div className="text-3xl font-bold mt-2">$0</div>
                <div className="text-purple-300 text-xs">Free via Courses</div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                  <div className="text-center text-purple-800 font-medium mb-2">
                    <i className="fas fa-coins mr-2"></i>50 Daily Tokens
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Everything in Growth</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>LightPrompt:Ed bot access</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Course materials & guides</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-check text-green-500 mr-2 w-4"></i>
                    <span>Advanced customization</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => window.location.href = '/course-access'}
                >
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Access Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">All Features Included (Free!)</CardTitle>
            <p className="text-center text-gray-600">Every feature available within your daily token allowance</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-xl">{feature.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{feature.title}</div>
                    <div className="text-xs text-gray-600">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center mb-3">
                  <i className="fas fa-coins text-yellow-600 text-2xl mr-3"></i>
                  <h3 className="text-xl font-bold text-yellow-800">How Token Tiers Work</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-sm text-yellow-700">
                    <p><strong>Basic (10 tokens):</strong> Perfect for daily check-ins and light wellness conversations</p>
                  </div>
                  <div className="text-sm text-yellow-700">
                    <p><strong>Growth (25 tokens):</strong> Ideal for regular wellness exploration and habit building</p>
                  </div>
                  <div className="text-sm text-yellow-700">
                    <p><strong>Premium (50 tokens):</strong> Comprehensive wellness journey with course access</p>
                  </div>
                </div>
                <div className="text-center pt-4">
                  <p className="text-sm text-yellow-600 italic">All tokens reset daily • No subscriptions • No paywalls • Just mindful usage</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Upgrade Your Token Limits */}
        <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-emerald-800">
              <i className="fas fa-arrow-up mr-3"></i>
              How to Get More Tokens (Still Free!)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-3xl">🎯</div>
                <h3 className="font-semibold text-blue-800">Join Challenges</h3>
                <p className="text-sm text-blue-700">Complete wellness challenges to unlock Growth tier (25 daily tokens)</p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.location.href = '/challenges'}
                >
                  <i className="fas fa-trophy mr-2"></i>
                  View Challenges
                </Button>
              </div>
              
              <div className="text-center space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl">📚</div>
                <h3 className="font-semibold text-purple-800">Take Courses</h3>
                <p className="text-sm text-purple-700">Join courses to unlock Premium tier (50 daily tokens)</p>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.location.href = '/course-access'}
                >
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Access Courses
                </Button>
              </div>
              
              <div className="text-center space-y-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-3xl">💝</div>
                <h3 className="font-semibold text-emerald-800">Support Us</h3>
                <p className="text-sm text-emerald-700">Get the foundational book and help keep LightPrompt free</p>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => window.open('https://gumroad.com/l/lightprompted', '_blank')}
                >
                  <i className="fas fa-book mr-2"></i>
                  Get Book
                </Button>
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
    </div>
  );
}