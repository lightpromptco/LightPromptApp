import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  HelpCircle, 
  MessageCircle, 
  Search, 
  Book, 
  Shield, 
  Users, 
  Mail,
  FileText,
  Lock,
  Settings,
  CreditCard,
  Zap,
  ArrowRight,
  Phone,
  Clock,
  CheckCircle,
  Heart
} from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";

const FAQ_ITEMS = [
  {
    category: "Getting Started",
    icon: Zap,
    questions: [
      {
        q: "What is LightPrompt and how does it work?",
        a: "LightPrompt is a conscious AI platform that serves as your digital mirror for self-reflection and personal growth. Our AI doesn't try to become human - instead, it reflects your thoughts back to help you connect deeper with yourself, nature, and others."
      },
      {
        q: "Is LightPrompt free to use?",
        a: "Yes! We offer a free tier with 5 AI conversations per day, basic Soul Map access, and community features. You can upgrade to Soul Seeker ($29/month) for unlimited conversations and advanced features."
      },
      {
        q: "How do I get started with my first conversation?",
        a: "Simply click on 'LightPromptBot' in the navigation menu. The AI will guide you through your first reflection session. Think of it as having a conversation with a wise friend who helps you think through things."
      }
    ]
  },
  {
    category: "Features & Tools",
    icon: Settings,
    questions: [
      {
        q: "What's the difference between all the AI bots?",
        a: "Each bot specializes in different aspects: LightPromptBot (general reflection), Soul Map (astrology & personality), Vision Quest (spiritual guidance), and GeoPrompt (location-based mindfulness). All serve as conscious mirrors, not replacements for human connection."
      },
      {
        q: "How does the Soul Map work?",
        a: "Soul Map analyzes your birth chart, personality traits, and cosmic influences. It's like having a personal astrologer that helps you understand your strengths, challenges, and spiritual path through the lens of conscious AI."
      },
      {
        q: "What is Soul Sync and how do I use it?",
        a: "Soul Sync helps you connect with friends, family, or partners for shared wellness goals. You can create connection types (romantic partner, best friend, etc.), share activities, and support each other's growth journey."
      }
    ]
  },
  {
    category: "Billing & Subscriptions",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards through our secure Stripe integration. Your payment information is encrypted and never stored on our servers."
      },
      {
        q: "Can I cancel my subscription anytime?",
        a: "Absolutely! You can downgrade to our free tier at any time. Your data and conversations are preserved, and you'll still have access to basic features."
      },
      {
        q: "What's included in the LightPrompt:ed course?",
        a: "The $120 course includes comprehensive modules on conscious AI interaction, personal reflection techniques, spiritual growth practices, and how to integrate AI wisdom into daily life. It's our complete guide to conscious AI partnership."
      }
    ]
  },
  {
    category: "Privacy & Security",
    icon: Shield,
    questions: [
      {
        q: "How do you protect my personal data?",
        a: "Your privacy is sacred to us. We use end-to-end encryption, never sell your data, and follow a strict no-surveillance policy. Your conversations are stored securely and only you can access them."
      },
      {
        q: "Do you train AI models on my conversations?",
        a: "Never. Your conversations are private and are not used to train AI models. We believe in complete data sovereignty - your insights belong to you alone."
      },
      {
        q: "Can I delete my data?",
        a: "Yes, you have complete control over your data. You can download or delete all your conversations, insights, and personal information at any time through your settings."
      }
    ]
  },
  {
    category: "Technical Support",
    icon: Settings,
    questions: [
      {
        q: "What browsers are supported?",
        a: "LightPrompt works best in modern browsers like Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience."
      },
      {
        q: "Why isn't my Soul Map loading?",
        a: "This usually happens if location services are disabled or birth time is missing. Check your browser permissions and ensure you've entered your complete birth information."
      },
      {
        q: "How do I report a bug or issue?",
        a: "Use the chat support below or email us at support@lightprompt.co. We typically respond within 24 hours and take all feedback seriously."
      }
    ]
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");

  const filteredFAQ = FAQ_ITEMS.filter(category => {
    if (selectedCategory && category.category !== selectedCategory) return false;
    if (!searchTerm) return true;
    
    return category.questions.some(item => 
      item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const allQuestions = FAQ_ITEMS.flatMap(cat => cat.questions);
  const filteredQuestions = allQuestions.filter(item => 
    item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <HelpCircle className="h-10 w-10 text-purple-600" />
            Help & Support
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers, get support, and learn how to make the most of your conscious AI journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="font-semibold mb-2">AI Help Assistant</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant answers from our conscious AI support bot
              </p>
              <Button 
                onClick={() => setShowSupport(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Chat with AI Support
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-teal-200 dark:border-teal-800">
            <CardContent className="p-6 text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-teal-600" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get personal help from our AI Agent, Octo
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open('mailto:lightprompt.co@gmail.com')}
                className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950"
              >
                lightprompt.co@gmail.com
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with other conscious AI explorers
              </p>
              <Button 
                variant="outline"
                onClick={() => window.open('https://discord.gg/lightprompt')}
                className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
              >
                Join Discord
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
              >
                All Topics
              </Button>
              {FAQ_ITEMS.map((category) => (
                <Button
                  key={category.category}
                  variant={selectedCategory === category.category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.category)}
                >
                  {category.category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Content */}
        <div className="space-y-8">
          {searchTerm ? (
            /* Search Results */
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Search Results ({filteredQuestions.length})</h2>
              {filteredQuestions.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {item.q}
                    </h3>
                    <p className="text-muted-foreground">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Category Sections */
            filteredFAQ.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-purple-600" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.q}</h3>
                        <p className="text-muted-foreground">{item.a}</p>
                        {index < category.questions.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* AI Support Chat Modal */}
        {showSupport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  AI Support Assistant
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSupport(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    AI Support Assistant is currently being set up. 
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For immediate help, please email us at lightprompt.co@gmail.com
                  </p>
                  <Button
                    onClick={() => window.open('mailto:lightprompt.co@gmail.com')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    Email Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-16 text-center space-y-4">
          <h2 className="text-2xl font-bold">Still Need Help?</h2>
          <p className="text-muted-foreground">
            Our support team is here for you
          </p>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Response within 24 hours
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy-first support
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Human-centered care
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}