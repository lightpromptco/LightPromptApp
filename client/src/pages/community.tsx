import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Star, 
  Calendar, 
  MapPin, 
  Video, 
  BookOpen,
  HelpCircle,
  Send,
  ExternalLink
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const COMMUNITY_FEATURES = [
  {
    title: 'Private Discussion Groups',
    description: 'Connect with like-minded individuals exploring conscious AI and digital wellness',
    icon: MessageCircle,
    status: 'Available',
    color: 'text-green-600',
    link: '/products' // Links to course purchase
  },
  {
    title: 'Monthly Live Sessions',
    description: 'Join our founder for Q&A sessions and guided AI reflection practices',
    icon: Video,
    status: 'Course Members',
    color: 'text-blue-600',
    link: '/products'
  },
  {
    title: 'Local Meetups',
    description: 'Find and organize in-person gatherings in your area',
    icon: MapPin,
    status: 'Coming Soon',
    color: 'text-amber-600',
    link: null
  },
  {
    title: 'Resource Library',
    description: 'Access shared templates, guides, and community-created content',
    icon: BookOpen,
    status: 'Available',
    color: 'text-teal-600',
    link: '/blog'
  }
];

const SUPPORT_OPTIONS = [
  {
    title: 'Course Support',
    description: 'Get help with course content, exercises, and technical issues',
    icon: HelpCircle,
    type: 'immediate',
    action: 'Contact Support'
  },
  {
    title: 'Technical Help',
    description: 'Issues with platform access, billing, or account management',
    icon: Video,
    type: 'immediate',
    action: 'Technical Support'
  },
  {
    title: 'Community Guidelines',
    description: 'Learn about our community values and interaction principles',
    icon: Users,
    type: 'resource',
    action: 'Read Guidelines'
  }
];

export default function CommunityPage() {
  const [supportMessage, setSupportMessage] = useState('');
  const [selectedSupport, setSelectedSupport] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSupportSubmit = () => {
    if (!supportMessage.trim()) {
      toast({
        title: "Please enter a message",
        description: "Tell us how we can help you",
        variant: "destructive"
      });
      return;
    }

    // This would normally send to support system
    toast({
      title: "Support request sent",
      description: "We'll get back to you within 24 hours",
    });
    setSupportMessage('');
    setSelectedSupport(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
            LightPrompt Community
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with others exploring conscious AI, share insights, and grow together on your journey of self-discovery
          </p>
        </div>

        {/* Community Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <Users className="h-6 w-6 mr-2 text-purple-600" />
            Community Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {COMMUNITY_FEATURES.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <feature.icon className="h-6 w-6 mr-3 text-purple-600" />
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <Badge variant={feature.status === 'Available' ? 'default' : 'secondary'} className={feature.color}>
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                  {feature.link && (
                    <Link href={feature.link}>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                  {!feature.link && (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mb-16">
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/20 dark:to-teal-950/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Heart className="h-6 w-6 mr-2 text-purple-600" />
                Our Community Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Star className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
                  <h3 className="font-semibold mb-2">Conscious Connection</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We approach AI and each other with mindfulness and intention
                  </p>
                </div>
                <div className="text-center">
                  <Heart className="h-8 w-8 mx-auto mb-3 text-red-500" />
                  <h3 className="font-semibold mb-2">Authentic Sharing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We create safe spaces for honest reflection and growth
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-3 text-teal-500" />
                  <h3 className="font-semibold mb-2">Mutual Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We lift each other up on our individual journeys
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <HelpCircle className="h-6 w-6 mr-2 text-purple-600" />
            Get Support
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Support Options */}
            <div>
              <h3 className="text-lg font-semibold mb-4">How can we help?</h3>
              <div className="space-y-4">
                {SUPPORT_OPTIONS.map((option, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <option.icon className="h-5 w-5 mr-3 text-purple-600" />
                          <div>
                            <h4 className="font-medium">{option.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedSupport(option.title)}
                        >
                          {option.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedSupport && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <p className="text-sm font-medium">Support Type: {selectedSupport}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Your Message</label>
                    <Textarea
                      placeholder="Tell us how we can help you..."
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <Button onClick={handleSupportSubmit} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    We typically respond within 24 hours. For urgent technical issues, 
                    course members can access priority support through the course portal.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Join CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/20 dark:to-teal-950/20 border-purple-200">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Get access to our private community groups and live sessions when you join the LightPrompt:ed course
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Join Course + Community
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline">
                    Read Our Blog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}