import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PrivacyInterfaceProps {
  userId: string;
}

export function PrivacyInterface({ userId }: PrivacyInterfaceProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
        <p className="text-gray-600">
          Last updated: January 2025
        </p>
      </div>

      {/* Privacy Policy Content */}
      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold mb-4">Our Commitment to Your Privacy</h3>
            <p className="mb-4">
              At LightPrompt, we believe that privacy is fundamental to authentic self-reflection and growth. 
              Your wellness journey is deeply personal, and we are committed to protecting your data with the highest standards of care and security.
            </p>

            <h3 className="text-xl font-semibold mb-4 mt-8">What Information We Collect</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Account Information</h4>
                <p className="text-gray-600 text-sm">Email address, name, and account preferences you provide when creating your account.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Wellness Data</h4>
                <p className="text-gray-600 text-sm">Mood tracking, habit entries, check-ins, and AI conversation data you choose to share with our platform.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Usage Information</h4>
                <p className="text-gray-600 text-sm">How you interact with our platform to improve your experience and our services.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 mt-8">How We Use Your Information</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Provide personalized AI responses and wellness insights</li>
              <li>• Track your progress and patterns over time</li>
              <li>• Improve our AI models and platform features</li>
              <li>• Send you important updates about your account</li>
              <li>• Provide customer support when you need it</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 mt-8">What We DON'T Do</h3>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>We never sell your personal data</strong></li>
                <li>• <strong>We don't share your wellness data with third parties</strong></li>
                <li>• <strong>We don't use your data for advertising</strong></li>
                <li>• <strong>We don't track you across other websites</strong></li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-4 mt-8">Data Security</h3>
            <p className="mb-4">
              We use enterprise-grade encryption and security measures to protect your data. All conversations and wellness data are encrypted both in transit and at rest.
            </p>

            <h3 className="text-xl font-semibold mb-4 mt-8">Your Rights</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Access:</strong> Request a copy of your data at any time</li>
              <li>• <strong>Deletion:</strong> Delete your account and all associated data</li>
              <li>• <strong>Portability:</strong> Export your wellness data in a readable format</li>
              <li>• <strong>Correction:</strong> Update or correct any inaccurate information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 mt-8">AI and Machine Learning</h3>
            <p className="mb-4">
              Our AI systems learn from aggregate, anonymized patterns to improve responses for all users. 
              Your individual conversations remain private and are not shared with other users or used for training without your explicit consent.
            </p>

            <h3 className="text-xl font-semibold mb-4 mt-8">Contact Us</h3>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <p className="mb-4">
              Email: <a href="mailto:lightprompt.co@gmail.com" className="text-teal-600 hover:underline">lightprompt.co@gmail.com</a>
            </p>

            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Philosophy:</strong> We believe that true wellness requires trust. That's why we're committed to transparency 
                about how we collect, use, and protect your data. Your growth journey is yours alone.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}