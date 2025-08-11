import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Create user account using REAL authentication system
      const response = await apiRequest('POST', '/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.ok) {
        const user = await response.json();
        
        // Store user in localStorage for session management
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        toast({
          title: "Welcome to LightPrompt!",
          description: "Your account has been created successfully.",
        });
        
        // Redirect to chat page after successful signup
        window.location.href = '/chat';
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/">
            <div className="inline-flex items-center mb-6">
              <div className="w-12 h-12 mr-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <i className="fas fa-eye text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">LightPrompt</h1>
            </div>
          </Link>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Your Wellness Journey</h2>
          <p className="text-gray-600 text-sm">
            Join thousands discovering the power of soul-tech wellness
          </p>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-600 hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-purple-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={loading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus mr-2"></i>
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/chat" className="text-purple-600 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-center">What you'll get:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <i className="fas fa-check text-purple-600"></i>
                <span>Free access to our AI wellness chatbot</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <i className="fas fa-check text-purple-600"></i>
                <span>Personal wellness tracking and insights</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <i className="fas fa-check text-purple-600"></i>
                <span>Access to our supportive community</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <i className="fas fa-check text-purple-600"></i>
                <span>Upgrade options for advanced features</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}