import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface HomeInterfaceProps {
  userId: string;
}

export function HomeInterface({ userId }: HomeInterfaceProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full flex items-center justify-center">
          <i className="fas fa-brain text-white text-2xl"></i>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          LightPrompt
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The world's first AI-powered soul-tech wellness platform. Connect with yourself, 
          your partner, and your community through meaningful conversations that evolve with your growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
            <i className="fas fa-play mr-2"></i>
            Start Your Journey
          </Button>
          <Button size="lg" variant="outline">
            <i className="fas fa-video mr-2"></i>
            Watch Demo
          </Button>
        </div>
      </div>

      {/* What is LightPrompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">What is LightPrompt?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-teal-100 rounded-full flex items-center justify-center">
                <i className="fas fa-comments text-teal-600 text-xl"></i>
              </div>
              <h3 className="font-semibold">AI-Powered Conversations</h3>
              <p className="text-gray-600 text-sm">
                Multiple specialized AI companions that understand your emotional patterns and provide personalized guidance for your wellness journey.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-cyan-100 rounded-full flex items-center justify-center">
                <i className="fas fa-chart-line text-cyan-600 text-xl"></i>
              </div>
              <h3 className="font-semibold">Holistic Wellness Tracking</h3>
              <p className="text-gray-600 text-sm">
                Track mood, energy, habits, and patterns with AI-generated insights that help you understand your unique wellness fingerprint.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-teal-100 rounded-full flex items-center justify-center">
                <i className="fas fa-heart text-teal-600 text-xl"></i>
              </div>
              <h3 className="font-semibold">Authentic Connection</h3>
              <p className="text-gray-600 text-sm">
                Connect with like-minded souls through VibeMatch, or deepen partnerships through shared wellness journeys in Partner Mode.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* B2B Opportunities */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Enterprise & B2B Solutions</CardTitle>
          <p className="text-center text-gray-600">
            Transform your organization's wellness culture with LightPrompt Enterprise
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fas fa-building text-teal-600 mr-2"></i>
                Corporate Wellness
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-teal-600 mt-1 flex-shrink-0"></i>
                  <span>Employee mental health and wellness programs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-teal-600 mt-1 flex-shrink-0"></i>
                  <span>Stress management and burnout prevention</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-teal-600 mt-1 flex-shrink-0"></i>
                  <span>Team building and authentic communication</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-teal-600 mt-1 flex-shrink-0"></i>
                  <span>Leadership development through self-awareness</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fas fa-user-md text-cyan-600 mr-2"></i>
                Healthcare & Therapy
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-cyan-600 mt-1 flex-shrink-0"></i>
                  <span>Therapist and counselor support tools</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-cyan-600 mt-1 flex-shrink-0"></i>
                  <span>Patient engagement between sessions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-cyan-600 mt-1 flex-shrink-0"></i>
                  <span>Mental health tracking and insights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-cyan-600 mt-1 flex-shrink-0"></i>
                  <span>White-label solutions for practices</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fas fa-graduation-cap text-teal-600 mr-2"></i>
                Educational Institutions
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-teal-600 mt-1 flex-shrink-0"></i>
                  <span>Student mental health and wellness support</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-teal-600 mt-1 flex-shrink-0"></i>
                  <span>Campus-wide wellness programs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-teal-600 mt-1 flex-shrink-0"></i>
                  <span>Peer support and connection platforms</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <i className="fas fa-users text-cyan-600 mr-2"></i>
                Wellness Professionals
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-cyan-600 mt-1 flex-shrink-0"></i>
                  <span>Coaches and wellness practitioners</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-cyan-600 mt-1 flex-shrink-0"></i>
                  <span>Client tracking and progress monitoring</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="fas fa-check text-cyan-600 mt-1 flex-shrink-0"></i>
                  <span>Automated insights and recommendations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-6">
            <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600">
              <i className="fas fa-calendar mr-2"></i>
              Schedule Enterprise Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Get in Touch</CardTitle>
          <p className="text-center text-gray-600">
            Ready to transform your wellness journey or bring LightPrompt to your organization?
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company/Organization</label>
              <Input
                value={contactForm.company}
                onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                placeholder="Your company or organization"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                placeholder="Tell us about your needs, questions, or how we can help..."
                rows={4}
                required
              />
            </div>
            
            <div className="text-center">
              <Button type="submit" size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600">
                <i className="fas fa-paper-plane mr-2"></i>
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-teal-700">What makes LightPrompt different?</h4>
                <p className="text-gray-600 text-sm">
                  Unlike traditional wellness apps, LightPrompt uses advanced AI to understand your unique emotional patterns and provide truly personalized guidance that evolves with your growth journey.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-teal-700">Is my data private and secure?</h4>
                <p className="text-gray-600 text-sm">
                  Absolutely. We use enterprise-grade encryption, never sell your data, and you maintain complete control over what you share. Your wellness journey is personal and private.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-teal-700">How does the AI understand my emotions?</h4>
                <p className="text-gray-600 text-sm">
                  Our AI analyzes patterns in your language, emotional expressions, and wellness data to understand your unique communication style and emotional needs, adapting its responses accordingly.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-cyan-700">Can I use LightPrompt with my partner?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! Partner Mode allows you to share wellness insights, set mutual goals, and support each other's growth while maintaining individual privacy controls.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-cyan-700">What if I need human support?</h4>
                <p className="text-gray-600 text-sm">
                  LightPrompt complements but doesn't replace human connection. We provide resources for finding therapists and encourage meaningful human relationships alongside AI support.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-cyan-700">How do I get started?</h4>
                <p className="text-gray-600 text-sm">
                  Simply start chatting! Our AI will guide you through understanding your wellness patterns and goals. You can upgrade to access more features as your journey deepens.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-envelope-open-text text-white text-xl"></i>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Stay Connected with LightPrompt</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get weekly insights on AI wellness, authentic connection, and personal growth. 
            Plus, be the first to know about new features and exclusive content.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <Input 
              placeholder="your.email@example.com" 
              className="flex-1"
            />
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
              <i className="fas fa-arrow-right mr-1"></i>
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            No spam, ever. Unsubscribe anytime. Powered by ConvertKit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}