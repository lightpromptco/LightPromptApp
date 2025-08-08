import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeCheckoutProps {
  planId: string;
  planName: string;
  price: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

function CheckoutForm({ 
  planId, 
  planName, 
  price, 
  userId, 
  onClose, 
  onSuccess 
}: Omit<StripeCheckoutProps, 'isOpen'>) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/plans?success=true',
        },
        redirect: 'if_required'
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend and upgrade tier
        const response = await apiRequest('POST', '/api/confirm-payment', {
          paymentIntentId: paymentIntent.id
        });

        const result = await response.json();
        
        if (result.success) {
          toast({
            title: "Payment Successful!",
            description: `Welcome to ${planName}! Your account has been upgraded.`,
          });
          
          // Update local storage with new user data
          localStorage.setItem('currentUser', JSON.stringify(result.user));
          
          onSuccess(result.user);
          onClose();
        } else {
          throw new Error(result.error || 'Payment confirmation failed');
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || 'Something went wrong with your payment. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-center">
          <h3 className="font-semibold text-blue-900 mb-1">Upgrading to {planName}</h3>
          <div className="text-2xl font-bold text-blue-600">${price}/month</div>
        </div>
      </div>
      
      <PaymentElement />
      
      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <i className="fas fa-crown mr-2"></i>
              Complete Upgrade
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function StripeCheckout({
  planId,
  planName,
  price,
  userId,
  isOpen,
  onClose,
  onSuccess
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && planId && userId) {
      createPaymentIntent();
    }
  }, [isOpen, planId, userId]);

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        planId,
        userId
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setClientSecret(data.clientSecret);
    } catch (error: any) {
      console.error('Payment intent error:', error);
      toast({
        title: "Payment Setup Failed",
        description: error.message || 'Failed to initialize payment. Please try again.',
        variant: "destructive",
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <i className="fas fa-credit-card mr-2 text-blue-600"></i>
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription>
            Secure payment powered by Stripe
          </DialogDescription>
        </DialogHeader>

        {isLoading || !clientSecret ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Setting up secure payment...</p>
          </div>
        ) : (
          <Elements 
            stripe={stripePromise} 
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#3b82f6',
                }
              }
            }}
          >
            <CheckoutForm
              planId={planId}
              planName={planName}
              price={price}
              userId={userId}
              onClose={onClose}
              onSuccess={onSuccess}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}