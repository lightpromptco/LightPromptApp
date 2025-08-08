import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '@shared/schema';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // First try to find existing user
      const response = await fetch(`/api/users/email/${encodeURIComponent(email)}`);
      
      if (response.ok) {
        const user = await response.json();
        toast({
          title: "Welcome back!",
          description: `Logged in as ${user.name}`,
        });
        onLogin(user);
        onClose();
      } else if (response.status === 404) {
        // User doesn't exist, show signup form
        if (!isSignup) {
          setIsSignup(true);
          toast({
            title: "New User",
            description: "Please enter your name to create an account",
          });
        } else {
          // Create new user
          if (!name.trim()) {
            toast({
              title: "Name Required", 
              description: "Please enter your name",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          const createResponse = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email.trim(),
              name: name.trim(),
            }),
          });

          if (createResponse.ok) {
            const newUser = await createResponse.json();
            toast({
              title: "Account Created!",
              description: `Welcome to LightPrompt, ${name}!`,
            });
            onLogin(newUser);
            onClose();
          } else {
            throw new Error('Failed to create account');
          }
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || 'Please try again',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSignup(false);
    setName('');
    setEmail('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <i className="fas fa-user-circle mr-2 text-purple-600"></i>
            {isSignup ? 'Create Account' : 'Sign In'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSignup ? 'Complete your account creation' : 'Enter your email to sign in or create an account'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isSignup}
              className="w-full"
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          )}

          <div className="flex space-x-3">
            {isSignup && (
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </Button>
            )}
            
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className={`${isSignup ? 'flex-1' : 'w-full'} bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <i className={`fas ${isSignup ? 'fa-user-plus' : 'fa-sign-in-alt'} mr-2`}></i>
                  {isSignup ? 'Create Account' : 'Sign In'}
                </>
              )}
            </Button>
          </div>

          {/* Discreet admin access - small gray dot that appears on hover */}
          <div className="text-center relative">
            <div 
              className="inline-block w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer opacity-30 hover:opacity-60 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/admin';
              }}
              title=""
            ></div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <div className="font-semibold mb-1">🔒 Privacy First</div>
            <p>Your data is stored securely and privately. Only you have access to your conversations and wellness insights.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}