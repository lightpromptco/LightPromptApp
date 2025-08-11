import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, BookOpen, Sparkles } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [product, setProduct] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product') || '';
    setProduct(productId);
  }, []);

  const getProductDetails = () => {
    switch (product) {
      case 'course':
        return {
          title: 'Soul Map & Cosmos Course',
          description: 'You now have lifetime access to the complete astrological career guidance course.',
          nextSteps: [
            'Access your course materials in the dashboard',
            'Complete your birth chart analysis',
            'Start your personalized career journey',
            'Join the exclusive course community'
          ],
          cta: 'Start Your Course'
        };
      case 'ebook':
        return {
          title: 'Digital Guidebook',
          description: 'Your comprehensive career astrology guide is ready for download.',
          nextSteps: [
            'Download your PDF guidebook',
            'Explore the quick reference charts',
            'Begin self-guided exercises',
            'Apply basic compatibility insights'
          ],
          cta: 'Download Guidebook'
        };
      case 'bundle':
        return {
          title: 'Complete Soul-Tech Bundle',
          description: 'You have access to everything needed for conscious career transformation.',
          nextSteps: [
            'Access your complete course curriculum',
            'Download your digital guidebook',
            'Unlock premium Oracle consultations',
            'Start advanced VibeMatch scoring'
          ],
          cta: 'Access Everything'
        };
      default:
        return {
          title: 'Payment Successful',
          description: 'Thank you for your purchase! Your access has been activated.',
          nextSteps: [
            'Check your email for confirmation',
            'Access your new features',
            'Explore your dashboard',
            'Contact support if needed'
          ],
          cta: 'Go to Dashboard'
        };
    }
  };

  const details = getProductDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {details.title}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            {details.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-purple-50 dark:from-teal-900/20 dark:to-purple-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              What's Next
            </h3>
            <div className="space-y-3">
              {details.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-600 dark:bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-semibold">{index + 1}</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Welcome to Your Conscious AI Journey
                </h4>
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  You've joined a community focused on authentic self-discovery through AI as a tool for reflection, not replacement of human wisdom.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => setLocation('/dashboard')}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white h-12"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {details.cta}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation('/soul-map-explorer')}
              className="flex-1 h-12"
            >
              Explore Soul Map
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Questions? Email us at{' '}
              <a href="mailto:support@lightprompt.co" className="text-teal-600 hover:underline">
                support@lightprompt.co
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}