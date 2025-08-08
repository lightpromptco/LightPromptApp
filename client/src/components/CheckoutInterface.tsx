import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CheckoutInterfaceProps {
  userId: string;
  planId?: string;
  planName?: string;
  price?: number;
  isYearly?: boolean;
}

export function CheckoutInterface({ userId, planId, planName, price, isYearly }: CheckoutInterfaceProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    try {
      // TODO: Implement actual Stripe integration
      const stripeUrl = `https://buy.stripe.com/test_checkout_url?price_id=${planId}&client_reference_id=${userId}`;
      console.log('Redirecting to Stripe:', stripeUrl);
      
      // For now, show placeholder
      alert(`Stripe integration needed for ${planName} plan. Price: $${price}${isYearly ? '/year' : '/month'}`);
      
      // TODO: Replace with actual Stripe redirect
      // window.location.href = stripeUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Purchase</h2>
        <p className="text-gray-600">
          You're upgrading to {planName} - {isYearly ? 'yearly' : 'monthly'} billing
        </p>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{planName} Plan</h3>
              <p className="text-sm text-gray-600">
                {isYearly ? 'Annual subscription' : 'Monthly subscription'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${price}</div>
              <div className="text-sm text-gray-600">
                {isYearly ? '/year' : '/month'}
              </div>
            </div>
          </div>
          
          {isYearly && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-2"></i>
                <span className="text-sm text-green-700">
                  You're saving 20% with annual billing!
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <i className="fas fa-credit-card text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Secure Payment with Stripe</h3>
            <p className="text-gray-600 mb-6">
              Your payment information is secured with bank-level encryption
            </p>
            
            <Button 
              onClick={handleStripeCheckout}
              disabled={isProcessing}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock mr-2"></i>
                  Complete Purchase - ${price}
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-green-500 mr-2"></i>
              SSL Secured
            </div>
            <div className="flex items-center">
              <i className="fas fa-undo text-blue-500 mr-2"></i>
              30-day refund
            </div>
            <div className="flex items-center">
              <i className="fas fa-times-circle text-purple-500 mr-2"></i>
              Cancel anytime
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Included */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <CardTitle>What's Included in {planName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {planId === 'growth' && (
              <>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-teal-600"></i>
                  <span className="text-sm">Access to all specialized bots</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-teal-600"></i>
                  <span className="text-sm">Unlimited habit tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-teal-600"></i>
                  <span className="text-sm">Advanced wellness patterns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-teal-600"></i>
                  <span className="text-sm">Voice conversations</span>
                </div>
              </>
            )}
            {planId === 'resonance' && (
              <>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-teal-600"></i>
                  <span className="text-sm">All Growth features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-teal-600"></i>
                  <span className="text-sm">Partner Mode sharing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-teal-600"></i>
                  <span className="text-sm">Couples wellness tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-teal-600"></i>
                  <span className="text-sm">Priority support</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Back to Plans */}
      <div className="text-center">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Plans
        </Button>
      </div>
    </div>
  );
}