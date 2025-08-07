import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';
import { z } from 'zod';

const redeemSchema = z.object({
  code: z.string().min(1, "Access code is required"),
  email: z.string().email("Valid email is required"),
});

export default function CourseAccessPage() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({ code: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const redeemMutation = useMutation({
    mutationFn: async (data: { code: string; email: string }) => {
      const response = await fetch('/api/redeem-access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to redeem access code');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Store user ID and navigate to chat
      localStorage.setItem('lightprompt_user_id', data.user.id);
      
      toast({
        title: "Welcome to LightPrompt:Ed!",
        description: "Your course access has been activated. Enjoy your learning journey!",
      });

      navigate('/');
    },
    onError: (error: any) => {
      toast({
        title: "Redemption failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = redeemSchema.parse(formData);
      redeemMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <i className="fas fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LightPrompt:Ed</h1>
          <p className="text-gray-600">Activate your course access</p>
        </div>

        {/* Redemption Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-gray-900">
              Redeem Your Access Code
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Enter the access code from your course purchase email to unlock your LightPrompt:Ed experience.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                  Access Code
                </Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter your access code"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className={`mt-1 ${errors.code ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={redeemMutation.isPending}
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`mt-1 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={redeemMutation.isPending}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Use the same email address you used for course purchase
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium py-3"
                disabled={redeemMutation.isPending}
              >
                {redeemMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Activating Access...
                  </>
                ) : (
                  <>
                    <i className="fas fa-unlock mr-2"></i>
                    Activate Course Access
                  </>
                )}
              </Button>
            </form>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Need Help?</h4>
                <div className="space-y-2 text-xs text-gray-600">
                  <p>• Check your email for the access code from your course purchase</p>
                  <p>• Make sure you're using the same email address from your purchase</p>
                  <p>• Access codes are case-sensitive</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.open('mailto:support@lightprompt.com?subject=Course%20Access%20Help', '_blank')}
                >
                  <i className="fas fa-envelope mr-1"></i>
                  Contact Support
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <i className="fas fa-arrow-left mr-1"></i>
                  Back to Chat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Course Benefits */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Access Includes:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <i className="fas fa-check-circle text-green-500"></i>
              <span>Exclusive access to LightPrompt:Ed reflection bot</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <i className="fas fa-check-circle text-green-500"></i>
              <span>Enhanced daily token limit (50+ tokens)</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <i className="fas fa-check-circle text-green-500"></i>
              <span>Guided module reflection prompts</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <i className="fas fa-check-circle text-green-500"></i>
              <span>Progress tracking and insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}