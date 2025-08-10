import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserProfile } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface PrivacySettings {
  dataCollection: boolean;
  analyticsTracking: boolean;
  voiceDataStorage: boolean;
  sentimentAnalysis: boolean;
  conversationHistory: boolean;
  avatarImageStorage: boolean;
  thirdPartySharing: boolean;
  marketingEmails: boolean;
  consentTimestamp: string;
  lastUpdated: string;
}

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  dataCollection: true,
  analyticsTracking: false,
  voiceDataStorage: true,
  sentimentAnalysis: true,
  conversationHistory: true,
  avatarImageStorage: true,
  thirdPartySharing: false,
  marketingEmails: false,
  consentTimestamp: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

export default function PrivacyPage() {
  const [hasGivenConsent, setHasGivenConsent] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Privacy page is accessible without login - show static policy
  const currentUserData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const currentUserId = currentUserData.id;
  
  // Only fetch user data if logged in
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/users', currentUserId],
    enabled: !!currentUserId,
  });

  // Only fetch user profile if logged in
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['/api/users', currentUserId, 'profile'],
    enabled: !!currentUserId,
  });

  const privacySettings = (userProfile?.privacySettings as PrivacySettings) || DEFAULT_PRIVACY_SETTINGS;

  // Update privacy settings mutation
  const updatePrivacyMutation = useMutation({
    mutationFn: async (updates: Partial<PrivacySettings>) => {
      if (!currentUserId) throw new Error('No user ID');
      
      const newSettings = {
        ...privacySettings,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };

      const response = await fetch(`/api/users/${currentUserId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacySettings: newSettings,
        }),
      });

      if (!response.ok) throw new Error('Failed to update privacy settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'profile'] });
      toast({
        title: "Privacy settings updated",
        description: "Your changes have been saved successfully.",
      });
    },
  });

  const handleToggle = (setting: keyof PrivacySettings, value: boolean) => {
    updatePrivacyMutation.mutate({ [setting]: value });
  };

  const handleGiveConsent = () => {
    const consentData = {
      ...DEFAULT_PRIVACY_SETTINGS,
      consentTimestamp: new Date().toISOString(),
    };
    updatePrivacyMutation.mutate(consentData);
    setHasGivenConsent(true);
  };

  const handleRevokeConsent = () => {
    const revokedSettings = Object.keys(privacySettings).reduce((acc, key) => {
      if (key !== 'consentTimestamp' && key !== 'lastUpdated') {
        acc[key] = false;
      }
      return acc;
    }, {} as any);
    
    updatePrivacyMutation.mutate({
      ...revokedSettings,
      consentTimestamp: '',
    });
  };

  // Check if user has given initial consent
  useEffect(() => {
    if (privacySettings.consentTimestamp) {
      setHasGivenConsent(true);
    }
  }, [privacySettings]);

  // Show simplified privacy policy for non-logged-in users
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600 mt-2">Your privacy and data protection</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-semibold mb-4">LightPrompt Privacy Policy</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">Data We Collect</h3>
                <p className="mb-4">
                  LightPrompt collects minimal data necessary to provide our AI wellness services:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Account information (email, username)</li>
                  <li>Chat conversations for service continuity</li>
                  <li>Wellness preferences and settings</li>
                  <li>Voice recordings (temporarily, for transcription only)</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">How We Use Your Data</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Provide personalized AI wellness guidance</li>
                  <li>Improve our services and user experience</li>
                  <li>Maintain conversation history for continuity</li>
                  <li>Send important service updates</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">Data Protection</h3>
                <p className="mb-4">
                  Your data is encrypted in transit and at rest. We never sell your personal information
                  to third parties. All data processing follows GDPR and privacy best practices.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Your Rights</h3>
                <p className="mb-4">
                  You have the right to access, modify, or delete your data at any time.
                  Contact us at privacy@lightprompt.co for any privacy-related requests.
                </p>

                <div className="mt-8 p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm text-teal-800">
                    <strong>Note:</strong> This is a simplified privacy policy. 
                    Log in to access detailed privacy settings and data controls.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Dashboard</h1>
            <p className="text-gray-600">Manage your data privacy and consent preferences</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Chat
            </Button>
          </Link>
        </div>

        {/* Consent Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Consent Status</span>
              {hasGivenConsent ? (
                <Badge className="bg-green-100 text-green-800">
                  <i className="fas fa-check mr-1"></i>
                  Consent Given
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-800">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  Consent Required
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!hasGivenConsent ? (
              <div className="text-center py-8">
                <i className="fas fa-shield-alt text-6xl text-teal-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  LightPrompt respects your privacy and puts you in control of your data. 
                  Please review and provide consent for data processing to begin using our AI wellness platform.
                </p>
                <Button 
                  onClick={handleGiveConsent}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  <i className="fas fa-check mr-2"></i>
                  Give Consent & Continue
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Consent given on: {new Date(privacySettings.consentTimestamp).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last updated: {new Date(privacySettings.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleRevokeConsent}
                >
                  Revoke All Consent
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Settings Grid */}
        {hasGivenConsent && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Data Collection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Collection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Basic Data Collection</h4>
                    <p className="text-sm text-gray-600">Store user profile, preferences, and account information</p>
                  </div>
                  <Switch
                    checked={privacySettings.dataCollection}
                    onCheckedChange={(checked) => handleToggle('dataCollection', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Conversation History</h4>
                    <p className="text-sm text-gray-600">Save your chat messages for continuity and improvement</p>
                  </div>
                  <Switch
                    checked={privacySettings.conversationHistory}
                    onCheckedChange={(checked) => handleToggle('conversationHistory', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Avatar Image Storage</h4>
                    <p className="text-sm text-gray-600">Store uploaded profile pictures securely</p>
                  </div>
                  <Switch
                    checked={privacySettings.avatarImageStorage}
                    onCheckedChange={(checked) => handleToggle('avatarImageStorage', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Voice & Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voice & Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Voice Data Storage</h4>
                    <p className="text-sm text-gray-600">Temporarily store voice recordings for transcription</p>
                  </div>
                  <Switch
                    checked={privacySettings.voiceDataStorage}
                    onCheckedChange={(checked) => handleToggle('voiceDataStorage', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Sentiment Analysis</h4>
                    <p className="text-sm text-gray-600">Analyze emotional tone to provide better responses</p>
                  </div>
                  <Switch
                    checked={privacySettings.sentimentAnalysis}
                    onCheckedChange={(checked) => handleToggle('sentimentAnalysis', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Analytics Tracking</h4>
                    <p className="text-sm text-gray-600">Collect usage analytics to improve the platform</p>
                  </div>
                  <Switch
                    checked={privacySettings.analyticsTracking}
                    onCheckedChange={(checked) => handleToggle('analyticsTracking', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sharing & Marketing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sharing & Marketing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Third-Party Sharing</h4>
                    <p className="text-sm text-gray-600">Share anonymized data with research partners</p>
                  </div>
                  <Switch
                    checked={privacySettings.thirdPartySharing}
                    onCheckedChange={(checked) => handleToggle('thirdPartySharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                    <p className="text-sm text-gray-600">Receive updates about new features and wellness tips</p>
                  </div>
                  <Switch
                    checked={privacySettings.marketingEmails}
                    onCheckedChange={(checked) => handleToggle('marketingEmails', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Data Encryption:</strong> All data is encrypted in transit and at rest using industry-standard encryption.</p>
                  <p><strong>Data Retention:</strong> Personal data is retained only as long as necessary for service provision.</p>
                  <p><strong>Your Rights:</strong> You can request data access, correction, deletion, or portability at any time.</p>
                  <p><strong>Security:</strong> We implement comprehensive security measures to protect your information.</p>
                </div>
                <div className="flex space-x-2 pt-3">
                  <Button variant="outline" size="sm">
                    <i className="fas fa-download mr-1"></i>
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-trash mr-1"></i>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Policy Details */}
        {hasGivenConsent && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How We Use Your Data</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Essential Features</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      We use your data to provide core AI wellness services, maintain your conversation history, 
                      and personalize your experience with our wellness bots.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Voice Processing</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Voice recordings are processed through OpenAI's Whisper API for transcription and immediately deleted. 
                      No voice data is stored permanently unless explicitly consented to.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Sentiment Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      We analyze the emotional tone of your messages to provide better-tailored responses and track your 
                      wellness journey. This data helps our AI understand your needs better.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Data Security</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your data is stored securely in encrypted databases with access controls. We follow GDPR and CCPA 
                      compliance standards and conduct regular security audits.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Third-Party Services</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      We use trusted third-party services (OpenAI for AI, Supabase for data storage) that meet our 
                      security standards. Data shared is minimal and necessary for service functionality.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}