import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Send, 
  Users, 
  Settings, 
  TestTube,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart
} from "lucide-react";

export default function EmailMarketingAdmin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  const [testResults, setTestResults] = useState<any>(null);

  const [welcomeEmailData, setWelcomeEmailData] = useState({
    email: 'test@example.com',
    name: 'Test User'
  });

  const [newsletterData, setNewsletterData] = useState({
    subscribers: ['subscriber1@example.com', 'subscriber2@example.com'],
    theme: 'Mercury Retrograde Navigation',
    message: 'This week brings powerful energy for reflection and realignment. Use this time to review your goals and recalibrate your path.',
    astroInsight: 'Mercury retrograde in Virgo asks us to slow down and pay attention to details in our daily routines.',
    careerTip: 'Now is the perfect time to refine your professional processes and strengthen existing relationships rather than starting new projects.'
  });

  const testEmailConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/test-configuration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const result = await response.json();
      setTestResults(result);
      
      if (result.success) {
        setEmailStatus('working');
        toast({
          title: "Email Configuration Test Successful!",
          description: result.message,
        });
      } else {
        setEmailStatus('error');
        toast({
          title: "Email Configuration Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setEmailStatus('error');
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(welcomeEmailData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Welcome Email Sent!",
          description: `Successfully sent to ${welcomeEmailData.email}`,
        });
      } else {
        toast({
          title: "Failed to Send Welcome Email",
          description: "Check your SendGrid configuration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Email Error",
        description: "Unable to send welcome email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendNewsletter = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsletterData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Newsletter Sent!",
          description: `Successfully sent to ${newsletterData.subscribers.length} subscribers`,
        });
      } else {
        toast({
          title: "Failed to Send Newsletter",
          description: "Check your SendGrid configuration",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Newsletter Error", 
        description: "Unable to send newsletter",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg">
              <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold">Email Marketing System</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage email campaigns, test configurations, and monitor delivery for LightPrompt
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Email Status</p>
                  <div className="flex items-center gap-2 mt-2">
                    {emailStatus === 'working' && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-green-700 dark:text-green-400">Working</span>
                      </>
                    )}
                    {emailStatus === 'error' && (
                      <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-700 dark:text-red-400">Error</span>
                      </>
                    )}
                    {emailStatus === 'unknown' && (
                      <>
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-600 dark:text-gray-400">Unknown</span>
                      </>
                    )}
                  </div>
                </div>
                <Settings className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-2xl font-bold mt-1">3</p>
                </div>
                <BarChart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Subscribers</p>
                  <p className="text-2xl font-bold mt-1">1,247</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="test" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="test">Configuration Test</TabsTrigger>
            <TabsTrigger value="welcome">Welcome Emails</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Configuration Test Tab */}
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Email Configuration Test
                </CardTitle>
                <CardDescription>
                  Test your SendGrid configuration and verify email delivery capability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    SendGrid Setup Instructions:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-amber-700 dark:text-amber-300">
                    <li>Go to <code>https://app.sendgrid.com/settings/api_keys</code></li>
                    <li>Create a new API key with "Full Access" permissions</li>
                    <li>Copy the API key (starts with "SG.")</li>
                    <li>Add it to your Replit Secrets as <code>SENDGRID_API_KEY</code></li>
                    <li>Verify your sender domain in SendGrid</li>
                  </ol>
                </div>

                {testResults && (
                  <div className={`p-4 rounded-lg ${testResults.success 
                    ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${testResults.success 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                    }`}>
                      Test Results:
                    </h4>
                    <p className={`text-sm ${testResults.success 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                    }`}>
                      {testResults.success ? testResults.message : testResults.error}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={testEmailConfiguration}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Testing..." : "Test Email Configuration"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Welcome Emails Tab */}
          <TabsContent value="welcome">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Email Testing</CardTitle>
                <CardDescription>
                  Test welcome email sequences for new users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Test Email Address</Label>
                    <Input
                      id="test-email"
                      type="email"
                      value={welcomeEmailData.email}
                      onChange={(e) => setWelcomeEmailData(prev => 
                        ({ ...prev, email: e.target.value })
                      )}
                      placeholder="test@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-name">Test User Name</Label>
                    <Input
                      id="test-name"
                      value={welcomeEmailData.name}
                      onChange={(e) => setWelcomeEmailData(prev => 
                        ({ ...prev, name: e.target.value })
                      )}
                      placeholder="Test User"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Welcome Email Features:
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    <li>• Personalized greeting with user's name</li>
                    <li>• Introduction to Soul Map Explorer</li>
                    <li>• VibeMatch compatibility features</li>
                    <li>• GeoPrompt location-based mindfulness</li>
                    <li>• Professional branding and design</li>
                  </ul>
                </div>

                <Button 
                  onClick={sendWelcomeEmail}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Test Welcome Email"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Tab */}
          <TabsContent value="newsletter">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Campaign</CardTitle>
                <CardDescription>
                  Create and send weekly cosmic insights newsletter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Week Theme</Label>
                  <Input
                    id="theme"
                    value={newsletterData.theme}
                    onChange={(e) => setNewsletterData(prev => 
                      ({ ...prev, theme: e.target.value })
                    )}
                    placeholder="Mercury Retrograde Navigation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Weekly Message</Label>
                  <Textarea
                    id="message"
                    value={newsletterData.message}
                    onChange={(e) => setNewsletterData(prev => 
                      ({ ...prev, message: e.target.value })
                    )}
                    placeholder="This week brings powerful energy..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="astro-insight">Astrological Insight</Label>
                  <Textarea
                    id="astro-insight"
                    value={newsletterData.astroInsight}
                    onChange={(e) => setNewsletterData(prev => 
                      ({ ...prev, astroInsight: e.target.value })
                    )}
                    placeholder="Mercury retrograde in Virgo asks us to..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career-tip">Career Alignment Tip</Label>
                  <Textarea
                    id="career-tip"
                    value={newsletterData.careerTip}
                    onChange={(e) => setNewsletterData(prev => 
                      ({ ...prev, careerTip: e.target.value })
                    )}
                    placeholder="Now is the perfect time to refine..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                      Subscriber Preview:
                    </h4>
                    <Badge variant="secondary">
                      {newsletterData.subscribers.length} subscribers
                    </Badge>
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    {newsletterData.subscribers.slice(0, 3).map((email, i) => (
                      <div key={i}>• {email}</div>
                    ))}
                    {newsletterData.subscribers.length > 3 && (
                      <div>• ... and {newsletterData.subscribers.length - 3} more</div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={sendNewsletter}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Newsletter Campaign"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Email Templates</CardTitle>
                  <CardDescription>Professional email templates for all campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Welcome Sequence</h4>
                      <p className="text-sm text-muted-foreground">
                        Onboarding email with platform introduction and feature highlights
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Enterprise Response</h4>
                      <p className="text-sm text-muted-foreground">
                        Professional auto-response for enterprise sales inquiries
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Subscription Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        Payment confirmation with plan details and access instructions
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Weekly Newsletter</h4>
                      <p className="text-sm text-muted-foreground">
                        Cosmic insights newsletter with astrological guidance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Marketing Features</CardTitle>
                  <CardDescription>Comprehensive email system capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>SendGrid integration with professional templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Automated welcome sequences for new users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Enterprise sales inquiry auto-responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Subscription confirmation emails with plan details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Weekly newsletter campaigns with cosmic insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Professional HTML templates with responsive design</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Error handling and delivery tracking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}