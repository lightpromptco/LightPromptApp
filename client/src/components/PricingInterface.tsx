import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { User } from '@shared/schema';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  popular?: boolean;
  features: string[];
  limits: {
    tokens: number;
    bots: number;
    sessions: number;
    checkIns?: number;
    habits?: number;
    patterns?: number;
    partnerConnections?: number;
    astrology?: number;
    geoPrompts?: number;
  };
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Explorer',
    description: 'Perfect for discovering your wellness journey',
    price: { monthly: 0, yearly: 0 },
    features: [
      'LightPromptBot & GeoPrompt access',
      '5 daily check-ins per month',
      '3 custom habits tracking',
      'Basic WooWoo (astrology) readings',
      'Community group access',
      '2 wellness patterns per month',
      'Partner mode preview (1 connection)'
    ],
    limits: {
      tokens: 50,
      bots: 2,
      sessions: 5,
      checkIns: 5,
      habits: 3,
      patterns: 2,
      partnerConnections: 1,
      astrology: 2,
      geoPrompts: 10
    }
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For those committed to personal transformation',
    price: { monthly: 29, yearly: 290 },
    popular: true,
    features: [
      'All Explorer features',
      'Access to all specialized bots',
      'Unlimited habit tracking',
      'Advanced wellness patterns',
      'VibeMatch community features',
      'Voice conversations',
      'Export wellness data',
      'Full WooWoo birth chart & resources',
      'Unlimited partner mode connections'
    ],
    limits: {
      tokens: 1000,
      bots: 99,
      sessions: 99,
      checkIns: 999,
      habits: 999,
      patterns: 999,
      partnerConnections: 10,
      astrology: 999,
      geoPrompts: 999
    }
  },
  {
    id: 'resonance',
    name: 'Resonance',
    description: 'Deep connection and partnership features',
    price: { monthly: 49, yearly: 490 },
    features: [
      'All Growth features',
      'Partner Mode (share with loved ones)',
      'Couples wellness tracking',
      'Advanced AI personality customization',
      'Priority support',
      'Early access to new features',
      'Custom wellness goal setting'
    ],
    limits: {
      tokens: 2500,
      bots: 99,
      sessions: 99
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations and wellness professionals',
    price: { monthly: 199, yearly: 1990 },
    features: [
      'All Resonance features',
      'Team & organization management',
      'Custom AI training',
      'Advanced analytics dashboard',
      'API access',
      'White-label options',
      'Dedicated account manager'
    ],
    limits: {
      tokens: 10000,
      bots: 99,
      sessions: 999
    }
  }
];

interface PricingInterfaceProps {
  user: User;
}

export function PricingInterface({ user }: PricingInterfaceProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const getCurrentTierName = () => {
    switch (user.tier) {
      case 'free': return 'Explorer';
      case 'tier_29': return 'Growth';
      case 'tier_49': return 'Resonance';
      case 'enterprise': return 'Enterprise';
      case 'admin': return 'Admin';
      default: return 'Explorer';
    }
  };

  const getCurrentUsage = () => {
    const percentage = (user.tokensUsed / user.tokenLimit) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <div className="space-y-8">
      {/* Current Plan Status */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-user-circle text-teal-600 mr-2"></i>
            Your Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{getCurrentTierName()}</h3>
              <p className="text-gray-600">
                {user.tier === 'admin' ? 'Full access to all features' : 'Active subscription'}
              </p>
            </div>
            <Badge 
              variant={user.tier === 'free' ? 'secondary' : 'default'} 
              className="text-sm"
            >
              {user.tier === 'admin' ? 'Admin' : getCurrentTierName()}
            </Badge>
          </div>
          
          {user.tier !== 'admin' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Token Usage</span>
                <span>{user.tokensUsed} / {user.tokenLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCurrentUsage()}%` }}
                ></div>
              </div>
              {getCurrentUsage() > 80 && (
                <p className="text-amber-600 text-sm">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  You're approaching your token limit. Consider upgrading for unlimited access.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-toggle" className={!isYearly ? 'font-semibold' : ''}>
          Monthly
        </Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-toggle" className={isYearly ? 'font-semibold' : ''}>
          Yearly
          <Badge variant="secondary" className="ml-2 text-xs">
            Save 20%
          </Badge>
        </Label>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_TIERS.map(tier => {
          const price = isYearly ? tier.price.yearly : tier.price.monthly;
          const monthlyPrice = isYearly ? tier.price.yearly / 12 : tier.price.monthly;
          const isCurrentTier = 
            (user.tier === 'free' && tier.id === 'free') ||
            (user.tier === 'tier_29' && tier.id === 'growth') ||
            (user.tier === 'tier_49' && tier.id === 'resonance') ||
            (user.tier === 'enterprise' && tier.id === 'enterprise');

          return (
            <Card 
              key={tier.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                tier.popular ? 'border-teal-500 shadow-md' : ''
              } ${isCurrentTier ? 'ring-2 ring-teal-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-teal-600 to-cyan-600">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <p className="text-sm text-gray-600">{tier.description}</p>
                
                <div className="py-4">
                  <div className="text-3xl font-bold">
                    ${Math.round(monthlyPrice)}
                    <span className="text-lg font-normal text-gray-600">/mo</span>
                  </div>
                  {isYearly && price > 0 && (
                    <p className="text-sm text-gray-500">
                      ${price}/year (save ${tier.price.monthly * 12 - price})
                    </p>
                  )}
                  {price === 0 && (
                    <p className="text-sm text-gray-500">Forever free</p>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <i className="fas fa-check text-teal-600 mt-0.5 flex-shrink-0"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Monthly tokens:</span>
                    <span>{tier.limits.tokens === 99999 ? 'Unlimited' : tier.limits.tokens.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Bots:</span>
                    <span>{tier.limits.bots === 99 ? 'All' : tier.limits.bots}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily check-ins:</span>
                    <span>{tier.limits.checkIns === 999 ? 'Unlimited' : tier.limits.checkIns || 0}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Habits tracking:</span>
                    <span>{tier.limits.habits === 999 ? 'Unlimited' : tier.limits.habits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WooWoo readings:</span>
                    <span>{tier.limits.astrology === 999 ? 'Unlimited' : tier.limits.astrology || 0}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GeoPrompts:</span>
                    <span>{tier.limits.geoPrompts === 999 ? 'Unlimited' : tier.limits.geoPrompts || 0}/month</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    if (tier.id === 'free') {
                      // Handle free tier signup/downgrade
                      window.location.href = '/#signup';
                    } else if (tier.id === 'enterprise') {
                      // Handle enterprise contact
                      window.location.href = 'mailto:enterprise@lightprompt.com?subject=Enterprise Plan Inquiry';
                    } else {
                      // Handle Stripe payment for growth/resonance
                      const price = isYearly ? tier.price.yearly : tier.price.monthly;
                      const queryParams = new URLSearchParams({
                        plan: tier.id,
                        planName: tier.name,
                        price: price.toString(),
                        isYearly: isYearly.toString(),
                        userId: user.id
                      });
                      window.location.href = `/checkout?${queryParams}`;
                    }
                  }}
                  className={`w-full ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700' 
                      : ''
                  }`}
                  variant={isCurrentTier ? 'outline' : 'default'}
                  disabled={isCurrentTier || user.tier === 'admin'}
                >
                  {isCurrentTier ? 'Current Plan' : 
                   user.tier === 'admin' ? 'Admin Access' :
                   tier.id === 'free' ? 'Get Started' :
                   tier.id === 'enterprise' ? 'Contact Sales' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <p className="text-sm text-gray-600">
            Compare what's included in each plan
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-center py-2">Explorer</th>
                  <th className="text-center py-2">Growth</th>
                  <th className="text-center py-2">Resonance</th>
                  <th className="text-center py-2">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr className="border-b">
                  <td className="py-2">AI Conversations</td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Wellness Tracking</td>
                  <td className="text-center">Basic</td>
                  <td className="text-center">Advanced</td>
                  <td className="text-center">Advanced</td>
                  <td className="text-center">Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">All AI Bots</td>
                  <td className="text-center"><i className="fas fa-times text-gray-400"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Partner Mode</td>
                  <td className="text-center"><i className="fas fa-times text-gray-400"></i></td>
                  <td className="text-center"><i className="fas fa-times text-gray-400"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">API Access</td>
                  <td className="text-center"><i className="fas fa-times text-gray-400"></i></td>
                  <td className="text-center"><i className="fas fa-times text-gray-400"></i></td>
                  <td className="text-center"><i className="fas fa-times text-gray-400"></i></td>
                  <td className="text-center"><i className="fas fa-check text-teal-600"></i></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Integration Info */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-credit-card text-blue-600 mr-2"></i>
            Payment & Billing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <i className="fas fa-shield-alt text-2xl text-blue-600"></i>
              <h4 className="font-semibold">Secure Payments</h4>
              <p className="text-sm text-gray-600">Powered by Stripe with bank-level security</p>
            </div>
            <div className="space-y-2">
              <i className="fas fa-sync-alt text-2xl text-green-600"></i>
              <h4 className="font-semibold">Flexible Billing</h4>
              <p className="text-sm text-gray-600">Monthly or yearly, cancel anytime</p>
            </div>
            <div className="space-y-2">
              <i className="fas fa-globe text-2xl text-purple-600"></i>
              <h4 className="font-semibold">Global Support</h4>
              <p className="text-sm text-gray-600">All major currencies and payment methods</p>
            </div>
          </div>
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              All plans include a 14-day free trial. No commitment, no hidden fees.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What are tokens?</h4>
            <p className="text-sm text-gray-600">
              Tokens represent your usage of AI features. Each conversation, analysis, or AI-generated insight consumes tokens. Higher plans include more tokens for unlimited exploration.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
            <p className="text-sm text-gray-600">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Is my data secure?</h4>
            <p className="text-sm text-gray-600">
              Absolutely. We use enterprise-grade encryption and never share your personal wellness data. You maintain complete control over your information.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What's included in Partner Mode?</h4>
            <p className="text-sm text-gray-600">
              Partner Mode allows you to share wellness insights with trusted individuals, set mutual goals, and track progress together while maintaining privacy controls.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}