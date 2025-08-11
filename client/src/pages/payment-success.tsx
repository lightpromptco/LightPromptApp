import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const paymentIntentClientSecret = urlParams.get('payment_intent_client_secret');
    const redirectStatus = urlParams.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      setPaymentStatus('success');
    } else if (redirectStatus === 'failed') {
      setPaymentStatus('error');
    } else {
      // Fallback check
      setTimeout(() => setPaymentStatus('success'), 1000);
    }
  }, []);

  if (paymentStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <Card className="max-w-lg mx-4">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Payment Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <Button onClick={() => setLocation('/store')} variant="outline">
              Return to Store
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-teal-500" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Successful!
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Welcome to LightPrompt Soul-Tech! Your cosmic journey begins now.
              </p>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  What happens next:
                </h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>Your purchase has been confirmed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>You now have full access to your purchased content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>Explore the Soul Map Explorer with premium features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <span>Access your personalized Oracle consultations</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setLocation('/soul-map-explorer')}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explore Your Soul Map
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  onClick={() => setLocation('/chat')}
                  variant="outline"
                  className="border-teal-500 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Chat with Oracle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <div className="mt-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Your LightPrompt Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-teal-500" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Real Astronomical Data
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Experience live planetary positions and current cosmic weather for authentic readings
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-teal-500" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Career-Focused Guidance
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Discover your ideal career path through VibeMatch scoring and SoulSync alignment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}