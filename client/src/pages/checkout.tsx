import { useLocation } from 'wouter';
import { CheckoutInterface } from '@/components/CheckoutInterface';

export default function CheckoutPage() {
  const [location] = useLocation();
  
  // Parse URL parameters
  const params = new URLSearchParams(location.split('?')[1] || '');
  const planId = params.get('plan') || '';
  const planName = params.get('planName') || '';
  const price = parseFloat(params.get('price') || '0');
  const isYearly = params.get('isYearly') === 'true';
  const userId = params.get('userId') || '';

  if (!planId || !planName || !price || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Checkout Link</h2>
          <p className="text-gray-600 mb-6">
            The checkout link appears to be invalid or incomplete.
          </p>
          <a href="/dashboard?view=settings" className="text-teal-600 hover:underline">
            Return to Plans & Features
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <CheckoutInterface 
          userId={userId}
          planId={planId}
          planName={planName}
          price={price}
          isYearly={isYearly}
        />
      </div>
    </div>
  );
}