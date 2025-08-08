import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface AIHelpInterfaceProps {
  userId: string;
}

export function AIHelpInterface({ userId }: AIHelpInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [supportTicket, setSupportTicket] = useState({
    category: 'general',
    subject: '',
    message: '',
    priority: 'normal'
  });

  const handleResourceSearch = () => {
    // Filter and display relevant resources based on search query
    if (searchQuery.trim()) {
      // In a real implementation, this would search through documentation
      alert(`Searching for "${searchQuery}" - Resource search functionality coming soon!`);
    }
  };

  const handleSubmitTicket = () => {
    // Create email with support ticket details
    const subject = encodeURIComponent(`[${supportTicket.priority.toUpperCase()}] ${supportTicket.subject}`);
    const body = encodeURIComponent(
      `Category: ${supportTicket.category}\n` +
      `Priority: ${supportTicket.priority}\n\n` +
      `Issue Description:\n${supportTicket.message}\n\n` +
      `User ID: ${userId}\n` +
      `Timestamp: ${new Date().toISOString()}`
    );
    window.location.href = `mailto:lightprompt.co@gmail.com?subject=${subject}&body=${body}`;
    
    // Reset form
    setSupportTicket({
      category: 'general',
      subject: '',
      message: '',
      priority: 'normal'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-robot text-white text-xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Help & Resources</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get instant help, browse resources, or connect with our support team for personalized assistance.
        </p>
      </div>

      <Tabs defaultValue="quick-help" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="quick-help">Quick Help</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="ai-chat">AI Assistant</TabsTrigger>
          <TabsTrigger value="contact">Support</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        {/* Quick Help Tab */}
        <TabsContent value="quick-help" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-comments text-blue-500 mr-2"></i>
                  How to Start Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Learn how to get the most meaningful responses from your AI companions.
                </p>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Be specific about your emotions and situation
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Ask follow-up questions to dive deeper
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Share context about your day or feelings
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-chart-line text-green-500 mr-2"></i>
                  Understanding Your Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Make sense of your wellness patterns and AI insights.
                </p>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    How AI analyzes your emotional patterns
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Reading your wellness dashboard insights
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Using recommendations effectively
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-users text-purple-500 mr-2"></i>
                  Partner Mode Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Connect with loved ones while maintaining privacy.
                </p>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Creating secure partner connections
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Setting sharing preferences
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Managing relationship wellness together
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-shield-alt text-red-500 mr-2"></i>
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Understanding how your data is protected.
                </p>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    End-to-end encryption details
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    Data export and deletion options
                  </div>
                  <div className="flex items-start">
                    <i className="fas fa-check text-green-500 mr-2 mt-0.5"></i>
                    AI training and your privacy
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Library Search</CardTitle>
              <p className="text-sm text-gray-600">
                Find guides, tutorials, and documentation
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-6">
                <Input
                  placeholder="Search guides, tutorials, FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleResourceSearch}>
                  <i className="fas fa-search mr-2"></i>
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => window.open('/dashboard?view=about', '_blank')}
                >
                  <i className="fas fa-play mr-2"></i>
                  Quick Start Guide
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => window.open('/dashboard?view=blog', '_blank')}
                >
                  <i className="fas fa-video mr-2"></i>
                  Video Tutorials
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <i className="fas fa-book mr-2"></i>
                  User Manual
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <i className="fas fa-question-circle mr-2"></i>
                  Common Questions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features & Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => window.open('/chat', '_blank')}
                >
                  <i className="fas fa-robot mr-2"></i>
                  AI Bot Guides
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-left"
                  onClick={() => window.open('/dashboard?view=growth', '_blank')}
                >
                  <i className="fas fa-chart-bar mr-2"></i>
                  Analytics Guide
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <i className="fas fa-mobile-alt mr-2"></i>
                  Mobile App Help
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <i className="fas fa-sync mr-2"></i>
                  Integrations
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <i className="fas fa-code mr-2"></i>
                  API Documentation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <i className="fas fa-cogs mr-2"></i>
                  Custom Settings
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <i className="fas fa-download mr-2"></i>
                  Data Export
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left">
                  <i className="fas fa-palette mr-2"></i>
                  Customization
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="ai-chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-robot text-blue-500 mr-2"></i>
                Chat with AI Support Assistant
              </CardTitle>
              <p className="text-sm text-gray-600">
                Get instant answers to your questions about LightPrompt
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-comments text-white text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Support Chat</h3>
                <p className="text-gray-600 mb-4">
                  Get instant answers about features, troubleshooting, and best practices.
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                  onClick={() => window.open('/chat/lightprompt', '_blank')}
                >
                  <i className="fas fa-robot mr-2"></i>
                  Start AI Chat
                </Button>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-medium">Popular Questions:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="justify-start text-left">
                    "How do I upgrade my plan?"
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-left">
                    "Why isn't my data syncing?"
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-left">
                    "How to delete my account?"
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start text-left">
                    "AI not responding properly?"
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Support Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit Support Ticket</CardTitle>
                <p className="text-sm text-gray-600">
                  Get personalized help from our support team
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={supportTicket.category}
                    onChange={(e) => setSupportTicket({...supportTicket, category: e.target.value})}
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="privacy">Privacy & Security</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    value={supportTicket.subject}
                    onChange={(e) => setSupportTicket({...supportTicket, subject: e.target.value})}
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={supportTicket.priority}
                    onChange={(e) => setSupportTicket({...supportTicket, priority: e.target.value})}
                  >
                    <option value="low">Low - General question</option>
                    <option value="normal">Normal - Standard issue</option>
                    <option value="high">High - Urgent problem</option>
                    <option value="critical">Critical - Service down</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Describe your issue</label>
                  <Textarea
                    value={supportTicket.message}
                    onChange={(e) => setSupportTicket({...supportTicket, message: e.target.value})}
                    placeholder="Please provide as much detail as possible..."
                    rows={5}
                  />
                </div>
                
                <Button 
                  onClick={handleSubmitTicket}
                  disabled={!supportTicket.subject || !supportTicket.message}
                  className="w-full"
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Get Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = 'mailto:lightprompt.co@gmail.com?subject=LightPrompt Support Request'}
                  >
                    <i className="fas fa-envelope mr-3 text-blue-500"></i>
                    <div className="text-left">
                      <div className="font-medium">Email Support</div>
                      <div className="text-xs text-gray-600">lightprompt.co@gmail.com</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/dashboard?view=community'}
                  >
                    <i className="fas fa-comments mr-3 text-green-500"></i>
                    <div className="text-left">
                      <div className="font-medium">Community Forum</div>
                      <div className="text-xs text-gray-600">Get help from other users</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('/dashboard?view=blog', '_blank')}
                  >
                    <i className="fas fa-book mr-3 text-purple-500"></i>
                    <div className="text-left">
                      <div className="font-medium">Knowledge Base</div>
                      <div className="text-xs text-gray-600">Browse self-help articles</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open('/dashboard?view=lightprompted', '_blank')}
                  >
                    <i className="fas fa-video mr-3 text-red-500"></i>
                    <div className="text-left">
                      <div className="font-medium">Video Tutorials</div>
                      <div className="text-xs text-gray-600">Watch step-by-step guides</div>
                    </div>
                  </Button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Response Times</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Critical issues:</span>
                      <Badge variant="outline">&lt; 2 hours</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>High priority:</span>
                      <Badge variant="outline">&lt; 4 hours</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Normal issues:</span>
                      <Badge variant="outline">&lt; 24 hours</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>General questions:</span>
                      <Badge variant="outline">&lt; 48 hours</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-shield-alt text-blue-500 mr-2"></i>
                Privacy Policy
              </CardTitle>
              <p className="text-sm text-gray-600">
                Last updated: January 2025
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-3">Our Commitment to Your Privacy</h3>
                <p className="mb-4 text-gray-700">
                  At LightPrompt, we believe that privacy is fundamental to authentic self-reflection and growth. 
                  Your wellness journey is deeply personal, and we are committed to protecting your data with the highest standards of care and security.
                </p>

                <h3 className="text-lg font-semibold mb-3">What Information We Collect</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">Account Information</h4>
                    <p className="text-gray-600 text-sm">Email address, name, and account preferences you provide when creating your account.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Wellness Data</h4>
                    <p className="text-gray-600 text-sm">Mood tracking, habit entries, check-ins, and AI conversation data you choose to share with our platform.</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Usage Information</h4>
                    <p className="text-gray-600 text-sm">How you interact with our platform to improve your experience and our services.</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">How We Use Your Information</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• Provide personalized AI responses and wellness insights</li>
                  <li>• Track your progress and patterns over time</li>
                  <li>• Improve our AI models and platform features</li>
                  <li>• Send you important updates about your account</li>
                  <li>• Provide customer support when you need it</li>
                </ul>

                <h3 className="text-lg font-semibold mb-3 mt-6">What We DON'T Do</h3>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• <strong>We never sell your personal data</strong></li>
                    <li>• <strong>We don't share your wellness data with third parties</strong></li>
                    <li>• <strong>We don't use your data for advertising</strong></li>
                    <li>• <strong>We don't track you across other websites</strong></li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold mb-3 mt-6">Your Rights</h3>
                <ul className="space-y-1 text-gray-700 text-sm">
                  <li>• <strong>Access:</strong> Request a copy of your data at any time</li>
                  <li>• <strong>Deletion:</strong> Delete your account and all associated data</li>
                  <li>• <strong>Portability:</strong> Export your wellness data in a readable format</li>
                  <li>• <strong>Correction:</strong> Update or correct any inaccurate information</li>
                </ul>

                <div className="bg-teal-50 p-3 rounded-lg border border-teal-200 mt-6">
                  <p className="text-sm text-gray-700">
                    <strong>Philosophy:</strong> We believe that true wellness requires trust. That's why we're committed to transparency 
                    about how we collect, use, and protect your data. Your growth journey is yours alone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Tab */}
        <TabsContent value="legal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-gavel text-purple-500 mr-2"></i>
                  Terms of Service
                </CardTitle>
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
                  <h4 className="font-medium mb-2">4. Limitation of Liability</h4>
                  <p className="text-gray-600 text-sm">
                    LightPrompt is a wellness tool, not medical advice. For serious mental health concerns, 
                    please consult qualified professionals.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-copyright text-indigo-500 mr-2"></i>
                  Copyright & Licensing
                </CardTitle>
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
                  <h4 className="font-medium mb-2">Your Content</h4>
                  <p className="text-gray-600 text-sm">
                    You retain ownership of your wellness data, conversations, and personal content. 
                    We only use it to provide our services to you.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">AI Training</h4>
                  <p className="text-gray-600 text-sm">
                    Our AI models are trained on publicly available text and proprietary datasets. 
                    Individual user data is not used for training without explicit consent.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Contact for Legal Issues</h4>
                  <p className="text-gray-600 text-sm">
                    Email: <a href="mailto:lightprompt.co@gmail.com" className="text-teal-600 hover:underline">lightprompt.co@gmail.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}