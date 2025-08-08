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

        {/* Free Plan - Main Offering */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-full bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Free Soul-Tech Access</CardTitle>
                    <p className="text-purple-100 mt-2">Everything you need for your wellness journey</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">$0</div>
                    <div className="text-purple-200 text-sm">Forever</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center mb-3">
                      <i className="fas fa-gift text-green-600 text-xl mr-3"></i>
                      <h3 className="font-semibold text-green-800">What's Included (All Free!)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <span className="text-xl">{feature.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{feature.title}</div>
                            <div className="text-xs text-gray-600">{feature.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center mb-2">
                      <i className="fas fa-coins text-yellow-600 text-lg mr-3"></i>
                      <h4 className="font-semibold text-yellow-800">How Token Limits Work</h4>
                    </div>
                    <div className="text-sm text-yellow-700 space-y-1">
                      <p>• <strong>10 tokens daily</strong> for meaningful conversations</p>
                      <p>• <strong>Tokens reset</strong> every 24 hours automatically</p>
                      <p>• <strong>Quality over quantity</strong> - encourages mindful AI interaction</p>
                      <p>• <strong>No paywalls</strong> - just healthy usage boundaries</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
                      onClick={() => window.location.href = '/'}
                    >
                      <i className="fas fa-rocket mr-2"></i>
                      Start Your Journey (Free!)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Upgrades */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
              <CardHeader>
                <CardTitle className="text-center text-teal-800">
                  <i className="fas fa-arrow-up mr-2"></i>
                  Get More Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="text-2xl">🎯</div>
                  <h3 className="font-semibold">Join Wellness Challenges</h3>
                  <p className="text-sm text-gray-600">
                    Complete challenges to earn bonus tokens and wellness rewards
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-teal-300 text-teal-700 hover:bg-teal-50"
                    onClick={() => window.location.href = '/challenges'}
                  >
                    View Challenges
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-center text-indigo-800">
                  <i className="fas fa-graduation-cap mr-2"></i>
                  Course Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="text-2xl">📚</div>
                  <h3 className="font-semibold">LightPrompt:Ed Course</h3>
                  <p className="text-sm text-gray-600">
                    Course participants get 50 tokens daily plus access to LightPrompt:Ed bot
                  </p>
                  <Button 
                    variant="outline" 
                    className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => window.location.href = '/course-access'}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
              <CardContent className="p-4 text-center space-y-3">
                <div className="text-4xl">💝</div>
                <h3 className="font-semibold text-gray-800">Support LightPrompt</h3>
                <p className="text-sm text-gray-600">
                  Love the platform? Consider getting the foundational book to support development
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => window.open('https://gumroad.com/l/lightprompted', '_blank')}
                >
                  <i className="fas fa-book mr-2"></i>
                  LightPrompt:ed Book
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

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