import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LegalInterfaceProps {
  userId: string;
}

export function LegalInterface({ userId }: LegalInterfaceProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service & Legal</h2>
        <p className="text-gray-600">
          Last updated: January 2025
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Terms of Service */}
        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Acceptance of Terms</h4>
              <p className="text-gray-600 text-sm">
                By using LightPrompt, you agree to these terms. If you don't agree, please don't use our service.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">2. Description of Service</h4>
              <p className="text-gray-600 text-sm">
                LightPrompt provides AI-powered wellness tools for personal reflection, growth tracking, and authentic connection.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">3. User Responsibilities</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Use the service for personal growth and wellness</li>
                <li>• Don't share harmful, illegal, or inappropriate content</li>
                <li>• Respect other users in community features</li>
                <li>• Keep your account information secure</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">4. Intellectual Property</h4>
              <p className="text-gray-600 text-sm">
                LightPrompt's technology, content, and branding are protected by copyright and other laws. 
                Your wellness data remains yours.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">5. Limitation of Liability</h4>
              <p className="text-gray-600 text-sm">
                LightPrompt is a wellness tool, not medical advice. For serious mental health concerns, 
                please consult qualified professionals.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Copyright & Licensing */}
        <Card>
          <CardHeader>
            <CardTitle>Copyright & Licensing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Platform Copyright</h4>
              <p className="text-gray-600 text-sm">
                © 2025 LightPrompt. All rights reserved. The LightPrompt platform, AI models, and user interface 
                are proprietary technology protected by copyright law.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Content License</h4>
              <p className="text-gray-600 text-sm">
                Blog posts, courses, and educational content are licensed under Creative Commons 
                Attribution-NonCommercial 4.0. You may share with attribution for non-commercial use.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Your Content</h4>
              <p className="text-gray-600 text-sm">
                You retain ownership of your wellness data, conversations, and personal content. 
                We only use it to provide our services to you.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Third-Party Content</h4>
              <p className="text-gray-600 text-sm">
                Some content may include third-party materials used under fair use or with permission. 
                All trademarks belong to their respective owners.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">AI Training</h4>
              <p className="text-gray-600 text-sm">
                Our AI models are trained on publicly available text and proprietary datasets. 
                Individual user data is not used for training without explicit consent.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manifesto Copyright */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle>The LightPrompt Inventor's Manifesto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-lightbulb text-white"></i>
              </div>
              <div>
                <h4 className="font-medium">Special Licensing Terms</h4>
                <p className="text-gray-600 text-sm">© LightPrompt 2025. Sharing encouraged. Commercial copying discouraged.</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700 mb-3">
                <strong>The Manifesto</strong> contains 33 ideas for building the future. These ideas are:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <strong>Free to share</strong> for inspiration and non-commercial use</li>
                <li>• <strong>Protected by creator-origin time stamping</strong></li>
                <li>• <strong>Not for commercial reproduction</strong> without permission</li>
                <li>• <strong>Available for collaboration</strong> with aligned organizations</li>
              </ul>
              <p className="text-sm text-gray-700 mt-3">
                If you want to build something based on these ideas, we'd love to hear about it! 
                Contact us at <a href="mailto:lightprompt.co@gmail.com" className="text-purple-600 hover:underline">lightprompt.co@gmail.com</a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DMCA & Takedown */}
      <Card>
        <CardHeader>
          <CardTitle>DMCA & Content Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            We respect intellectual property rights and expect users to do the same.
          </p>
          
          <div>
            <h4 className="font-medium mb-2">Reporting Copyright Infringement</h4>
            <p className="text-gray-600 text-sm mb-2">
              If you believe content on LightPrompt infringes your copyright, please contact us with:
            </p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• Description of the copyrighted work</li>
              <li>• Location of the infringing content</li>
              <li>• Your contact information</li>
              <li>• Statement of good faith belief</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Contact for Legal Issues</h4>
            <p className="text-gray-600 text-sm">
              Email: <a href="mailto:lightprompt.co@gmail.com" className="text-teal-600 hover:underline">lightprompt.co@gmail.com</a>
              <br />
              Subject line: "DMCA Notice" or "Legal Issue"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}