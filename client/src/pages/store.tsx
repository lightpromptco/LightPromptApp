import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  stripePriceId?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    price: 0,
    description: 'Perfect for discovering your wellness journey',
    features: [
      '5 free SoulSync connections',
      'All LightPrompt bots access',
      'Basic astrology wisdom',
      'Community group access',
      '2 wellness patterns per month',
      'Partner mode preview (1 connection)'
    ],
    stripePriceId: 'price_explorer_free'
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 29,
    description: 'For those committed to personal transformation',
    features: [
      'All Explorer features',
      'Access to all specialized bots',
      'Unlimited habit tracking',
      'Advanced wellness patterns',
      'VibeMatch community features',
      'Voice conversations',
      'Export wellness data',
      'Full birth chart & resources',
      'Unlimited partner mode connections'
    ],
    popular: true,
    stripePriceId: 'price_growth_29'
  },
  {
    id: 'resonance',
    name: 'Resonance',
    price: 49,
    description: 'Deep connection and partnership features',
    features: [
      'All Growth features',
      'Partner Mode (share with loved ones)',
      'Couples wellness tracking',
      'Advanced AI personality customization',
      'Priority support',
      'Early access to new features',
      'Custom wellness goal setting'
    ],
    stripePriceId: 'price_resonance_49'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    description: 'For organizations and wellness professionals',
    features: [
      'All Resonance features',
      'Team & organization management',
      'Custom AI training',
      'Advanced analytics dashboard',
      'API access',
      'White-label options',
      'Dedicated account manager'
    ],
    stripePriceId: 'price_enterprise_199'
  }
];

export default function Store() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = async (plan: PricingPlan) => {
    if (plan.price === 0) {
      // Handle free tier signup
      toast({
        title: 'Welcome to Explorer!',
        description: 'You now have access to all Explorer features.',
      });
      return;
    }

    setLoading(plan.id);
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          planName: plan.name
        }),
      });

      if (!response.ok) {
        throw new Error('Subscription setup failed');
      }

      const { clientSecret } = await response.json();
      
      // Redirect to checkout with Stripe
      window.location.href = `/checkout?client_secret=${clientSecret}&product=${plan.id}`;
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Store & Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your career through conscious AI and soul-tech astrology. 
            Choose the path that resonates with your cosmic blueprint.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative h-full transition-all duration-300 hover:shadow-2xl ${
                plan.popular
                  ? 'ring-2 ring-teal-500 shadow-xl scale-105 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20'
                  : 'hover:scale-105 bg-white dark:bg-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-2 text-sm font-semibold">
                    <Star className="w-4 h-4 mr-1" />
                    BEST VALUE
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <div className="flex items-center justify-center gap-2 my-4">
                  <span className="text-4xl font-bold text-teal-600">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-lg text-gray-500">/mo</span>
                  )}
                  {plan.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      ${plan.originalPrice}
                    </span>
                  )}
                </div>
                {plan.originalPrice && (
                  <div className="text-sm text-green-600 font-semibold">
                    Save ${plan.originalPrice - plan.price}
                  </div>
                )}
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePurchase(plan)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Get Started
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose LightPrompt Soul-Tech?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
              Our platform combines ancient astrological wisdom with modern AI to provide 
              precise career guidance. Unlike generic astrology, we focus specifically on 
              professional alignment and life purpose discovery.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-teal-500 mb-2" />
                <span className="font-semibold">Real Astronomical Data</span>
                <span className="text-gray-500">Live planetary positions</span>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-teal-500 mb-2" />
                <span className="font-semibold">AI-Powered Analysis</span>
                <span className="text-gray-500">GPT-4o Oracle insights</span>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-teal-500 mb-2" />
                <span className="font-semibold">Privacy-First</span>
                <span className="text-gray-500">Your data stays secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}