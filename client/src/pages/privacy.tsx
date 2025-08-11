import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Eye, 
  Lock, 
  UserCheck, 
  Database,
  Globe,
  Mail,
  Settings
} from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your privacy and data security are fundamental to our mission
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last updated: January 11, 2025
          </p>
        </div>

        <div className="space-y-8">
          {/* Core Principles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Our Core Privacy Principles
              </CardTitle>
              <CardDescription>
                The foundation of how we handle your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Transparency</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We clearly explain what data we collect and how we use it
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Security</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your data is encrypted and protected with industry-standard security
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Control</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You have full control over your data and privacy settings
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Respect</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We respect your privacy choices and never sell your personal data
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                What Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Information You Provide</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Account information (email, name, profile details)</li>
                  <li>• Birth data for astrological calculations (date, time, location)</li>
                  <li>• Chat conversations with our AI systems</li>
                  <li>• Community posts and interactions</li>
                  <li>• Wellness tracking data and preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Automatically Collected Information</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Usage analytics and feature interactions</li>
                  <li>• Device information and browser type</li>
                  <li>• IP address and general location (for timezone/local features)</li>
                  <li>• Session data and performance metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Data */}
          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Personalized Experience:</strong> We use your birth data and preferences to provide accurate astrological insights and personalized wellness recommendations.</p>
                <p><strong>AI Conversations:</strong> Your chat history helps our AI provide more contextual and helpful responses while maintaining conversation continuity.</p>
                <p><strong>Community Features:</strong> Profile information enables meaningful connections with other users in our community spaces.</p>
                <p><strong>Platform Improvement:</strong> Anonymized usage data helps us improve features and user experience.</p>
                <p><strong>Communication:</strong> We may send you important updates about your account or new features you've expressed interest in.</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Data Sharing & Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>We Never Sell Your Data:</strong> Your personal information is never sold to advertisers or data brokers.</p>
                <p><strong>Service Providers:</strong> We work with trusted partners for essential services like hosting, analytics, and payment processing. They're bound by strict privacy agreements.</p>
                <p><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our users' safety.</p>
                <p><strong>Community Sharing:</strong> Information you choose to share in community spaces is visible to other community members as indicated in our community guidelines.</p>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Access & Control</h3>
                  <ul className="space-y-1">
                    <li>• View all data we have about you</li>
                    <li>• Update or correct your information</li>
                    <li>• Download your data</li>
                    <li>• Delete your account and data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Privacy Preferences</h3>
                  <ul className="space-y-1">
                    <li>• Control what data is collected</li>
                    <li>• Manage communication preferences</li>
                    <li>• Adjust community visibility settings</li>
                    <li>• Opt out of analytics tracking</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Questions About Privacy?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                If you have questions about this privacy policy or how we handle your data, we're here to help.
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@lightprompt.co</p>
                <p><strong>Response Time:</strong> We typically respond within 24 hours</p>
                <p><strong>Data Protection Officer:</strong> Available for GDPR-related inquiries</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}