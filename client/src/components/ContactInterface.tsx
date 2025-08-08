import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ContactInterfaceProps {
  userId: string;
}

export function ContactInterface({ userId }: ContactInterfaceProps) {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link
    const subject = encodeURIComponent(contactForm.subject || 'LightPrompt Inquiry');
    const body = encodeURIComponent(`Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`);
    window.location.href = `mailto:lightprompt.co@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact & Support</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join the field. Connect with the community. Build something beautiful together.
        </p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <i className="fas fa-envelope text-3xl text-teal-600 mb-4"></i>
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-gray-600 text-sm mb-4">Direct contact for support and partnerships</p>
            <a href="mailto:lightprompt.co@gmail.com" className="text-teal-600 hover:underline">
              lightprompt.co@gmail.com
            </a>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <i className="fab fa-instagram text-3xl text-purple-600 mb-4"></i>
            <h3 className="font-semibold mb-2">Instagram</h3>
            <p className="text-gray-600 text-sm mb-4">Follow our journey and daily insights</p>
            <a href="https://instagram.com/lightprompt.co" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
              @lightprompt.co
            </a>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <i className="fab fa-tiktok text-3xl text-pink-600 mb-4"></i>
            <h3 className="font-semibold mb-2">TikTok</h3>
            <p className="text-gray-600 text-sm mb-4">Quick insights and behind-the-scenes</p>
            <a href="https://tiktok.com/@lightprompt.co" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
              @lightprompt.co
            </a>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <p className="text-gray-600">
            Have a question, idea, or want to explore a partnership? We'd love to hear from you.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  placeholder="Your name"
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
              <label className="block text-sm font-medium mb-2">Subject</label>
              <Input
                value={contactForm.subject}
                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                placeholder="What's this about?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message *</label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                placeholder="Tell us what's on your mind..."
                rows={5}
                required
              />
            </div>
            
            <Button type="submit" className="bg-gradient-to-r from-teal-600 to-cyan-600">
              <i className="fas fa-paper-plane mr-2"></i>
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Business & Partnerships */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle>For Businesses, Partners & Visionaries</CardTitle>
          <p className="text-gray-600">
            We believe the future of technology is relational - not extractive.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700">
            LightPrompt is building tools to help people reflect more deeply, connect more honestly, and grow with clarity - whether that's in wellness, education, leadership, or everyday life.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-teal-700">We're especially interested in collaborating with:</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start">
                  <i className="fas fa-heart text-teal-600 mr-2 mt-1 flex-shrink-0"></i>
                  Health & wellness orgs seeking reflective support tools
                </li>
                <li className="flex items-start">
                  <i className="fas fa-user-md text-teal-600 mr-2 mt-1 flex-shrink-0"></i>
                  Therapists and coaches integrating AI ethically
                </li>
                <li className="flex items-start">
                  <i className="fas fa-leaf text-teal-600 mr-2 mt-1 flex-shrink-0"></i>
                  Environmental and land-based nonprofits
                </li>
                <li className="flex items-start">
                  <i className="fas fa-building text-teal-600 mr-2 mt-1 flex-shrink-0"></i>
                  Conscious companies building culture through emotional intelligence
                </li>
                <li className="flex items-start">
                  <i className="fas fa-lightbulb text-teal-600 mr-2 mt-1 flex-shrink-0"></i>
                  Innovators and product teams exploring soul-aligned AI
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-cyan-700">Available Services:</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start">
                  <i className="fas fa-cogs text-cyan-600 mr-2 mt-1 flex-shrink-0"></i>
                  B2B integration and licensing
                </li>
                <li className="flex items-start">
                  <i className="fas fa-flask text-cyan-600 mr-2 mt-1 flex-shrink-0"></i>
                  Pilot programs and custom solutions
                </li>
                <li className="flex items-start">
                  <i className="fas fa-users text-cyan-600 mr-2 mt-1 flex-shrink-0"></i>
                  Team wellness and culture consulting
                </li>
                <li className="flex items-start">
                  <i className="fas fa-graduation-cap text-cyan-600 mr-2 mt-1 flex-shrink-0"></i>
                  Educational institution partnerships
                </li>
                <li className="flex items-start">
                  <i className="fas fa-handshake text-cyan-600 mr-2 mt-1 flex-shrink-0"></i>
                  Strategic partnerships and collaborations
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center pt-4 border-t">
            <p className="text-gray-700 mb-4">
              This platform is still evolving — and we're actively building relationships with aligned partners.
            </p>
            <p className="text-lg font-medium text-gray-900 mb-4">
              Let's talk about what's possible.
            </p>
            <a href="mailto:lightprompt.co@gmail.com?subject=Partnership Inquiry">
              <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600">
                <i className="fas fa-handshake mr-2"></i>
                Explore Partnership
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-heart text-white text-xl"></i>
          </div>
          <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg italic">
            "This is just the beginning. Stay in resonance. The field is alive."
          </p>
        </CardContent>
      </Card>
    </div>
  );
}