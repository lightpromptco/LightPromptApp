import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [adminData, setAdminData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already in admin mode
    const isAdminMode = localStorage.getItem('lightprompt-admin-mode') === 'true';
    if (isAdminMode) {
      setIsLoggedIn(true);
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    try {
      const response = await fetch('/api/users/email/lightprompt.co@gmail.com');
      if (response.ok) {
        const admin = await response.json();
        setAdminData(admin);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleLogin = async () => {
    if (email === 'lightprompt.co@gmail.com') {
      try {
        const response = await fetch('/api/users/email/lightprompt.co@gmail.com');
        if (response.ok) {
          localStorage.setItem('lightprompt-admin-mode', 'true');
          setIsLoggedIn(true);
          loadAdminData();
          toast({
            title: "Admin Access Granted",
            description: "Welcome to LightPrompt Admin Portal",
          });
        } else {
          toast({
            title: "Admin Account Not Found",
            description: "Make sure you've run the Supabase SQL script to create the admin account.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Connection Error",
          description: "Could not connect to the database. Check if Supabase is configured properly.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Only the admin email can access this portal.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lightprompt-admin-mode');
    setIsLoggedIn(false);
    setAdminData(null);
    setEmail('');
    toast({
      title: "Logged Out",
      description: "Admin session ended.",
    });
  };

  const goToApp = () => {
    window.location.href = '/';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
              🔐 LightPrompt Admin Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email..."
                className="w-full"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            
            <Button 
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Access Admin Portal
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Use: <code className="bg-gray-100 px-2 py-1 rounded text-xs">lightprompt.co@gmail.com</code></p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800">
              <div className="font-semibold mb-1">⚠️ First Time Setup</div>
              <p>If login fails, make sure you've executed the Supabase SQL script to create database tables and the admin account.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                <i className="fas fa-crown mr-3"></i>
                Admin Dashboard
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={goToApp}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  <i className="fas fa-home mr-2"></i>
                  Go to App
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {adminData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Admin Account</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-800">
                      <div><strong>Email:</strong> {adminData?.email}</div>
                      <div><strong>Name:</strong> {adminData?.name}</div>
                      <div><strong>Tier:</strong> {adminData?.tier}</div>
                      <div><strong>Role:</strong> {adminData?.role}</div>
                      <div><strong>Token Limit:</strong> {adminData?.tokenLimit}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      onClick={() => window.location.href = '/plans'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <i className="fas fa-credit-card mr-2"></i>
                      View Plans & Pricing
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/dashboard'}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <i className="fas fa-chart-bar mr-2"></i>
                      View Dashboard
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/challenges'}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <i className="fas fa-trophy mr-2"></i>
                      View Challenges
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-600">Loading admin data...</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <div className="text-green-600 text-2xl mb-2">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="text-sm font-medium text-green-800">Admin Account Active</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <div className="text-blue-600 text-2xl mb-2">
                  <i className="fas fa-database"></i>
                </div>
                <div className="text-sm font-medium text-blue-800">Supabase Connected</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                <div className="text-purple-600 text-2xl mb-2">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="text-sm font-medium text-purple-800">All Bots Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}