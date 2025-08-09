import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, Book, Video, Mail, ExternalLink,
  ChevronDown, ChevronRight, Search, Star, Users,
  Zap, Heart, Brain, Sparkles, Map, Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Sparkles,
    items: [
      {
        question: 'What is LightPrompt and how does it work?',
        answer: 'LightPrompt is a soul-tech wellness platform that combines AI-powered conversations with gamified wellness tracking. You interact with specialized bots (LightPromptBot, BodyBot, SpiritBot) to explore emotional wellness, track your progress through GeoPrompt check-ins, earn Prism Points, and connect with like-minded individuals through Vibe Match.'
      },
      {
        question: 'How do I start my first reflection session?',
        answer: 'Simply navigate to the main chat interface and start typing. LightPromptBot will guide you through your first reflection. You can ask questions, share thoughts, or request specific guided meditations. The AI adapts to your communication style and wellness needs.'
      },
      {
        question: 'What are Prism Points and how do I earn them?',
        answer: 'Prism Points are our gamification currency that tracks your wellness journey. You earn points through daily reflections (10 pts), GeoPrompt check-ins (15 pts), community interactions (20 pts), completing challenges (25 pts), and discovering easter eggs (30 pts). Points unlock new features and track your spiritual growth.'
      }
    ]
  },
  {
    id: 'features',
    name: 'Core Features',
    icon: Star,
    items: [
      {
        question: 'What is GeoPrompt and how does location-based reflection work?',
        answer: 'GeoPrompt allows you to create reflections tied to specific locations. Whether you\'re at home, in nature, or traveling, you can capture the energy and insights of that moment and place. Your location data is kept private unless you choose to share general area information with the community.'
      },
      {
        question: 'How does Vibe Match work for finding soul connections?',
        answer: 'Vibe Match uses your energy levels, current mood, interests, and intentions to connect you with compatible souls. Create your vibe profile, browse potential matches, and send connection requests. All interactions are private and you control what information you share.'
      },
      {
        question: 'What are the different AI bots and their specialties?',
        answer: 'LightPromptBot focuses on general emotional wellness and reflection. BodyBot specializes in physical health, fitness tracking, and body awareness. SpiritBot guides spiritual practices, meditation, and higher consciousness exploration. CosmosBot handles mystical topics like astrology and energy work. Each bot has unique personality and expertise.'
      }
    ]
  },
  {
    id: 'community',
    name: 'Community & Privacy',
    icon: Users,
    items: [
      {
        question: 'How do privacy settings work for community features?',
        answer: 'You have granular control over what you share. For each post, check-in, or profile element, you can choose to keep it private, share with specific circles, or make it public. Your exact location is never shared - only general areas if you opt in. Real names are optional throughout the platform.'
      },
      {
        question: 'What are Wellness Circles and how do I join them?',
        answer: 'Wellness Circles are topic-focused communities within LightPrompt. Examples include "Mindful Mornings" for early risers or "Moon Cycle Sisters" for feminine energy work. Join circles that align with your interests to connect with like-minded souls and participate in group challenges.'
      },
      {
        question: 'Can I delete my data and content?',
        answer: 'Yes, you have full control over your data. You can delete individual posts, reflections, or check-ins at any time. You can also request complete account deletion, which removes all your data from our systems within 30 days. We believe your spiritual journey data belongs to you.'
      }
    ]
  },
  {
    id: 'technical',
    name: 'Technical Support',
    icon: Zap,
    items: [
      {
        question: 'The app seems slow or unresponsive. What should I do?',
        answer: 'Try refreshing your browser first. If issues persist, check your internet connection and clear your browser cache. Our data syncs every 30 seconds, so temporary connectivity issues usually resolve quickly. Contact support if problems continue.'
      },
      {
        question: 'Why isn\'t my GeoPrompt check-in saving?',
        answer: 'Ensure all required fields are filled: location, vibe, and reflection text. Check that you have a stable internet connection. If you\'re having location capture issues, you can still save check-ins by manually entering an address or location description.'
      },
      {
        question: 'How do I enable browser notifications for daily reminders?',
        answer: 'Go to your browser settings and allow notifications for the LightPrompt domain. You can also set up reflection reminders in your device settings. We recommend enabling notifications to maintain your wellness streak and receive community updates.'
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced Features',
    icon: Brain,
    items: [
      {
        question: 'How does the astrology integration work?',
        answer: 'CosmosBot can generate personalized birth charts and provide astrological insights. Enter your birth date, time, and location for accurate chart generation. The AI interprets planetary positions and aspects to offer guidance on your spiritual journey and optimal timing for various activities.'
      },
      {
        question: 'What are Easter Eggs and how do I find them?',
        answer: 'Easter Eggs are hidden features and rewards throughout the platform. They might be triggered by specific actions, visiting certain pages at particular times, or entering special phrases. Finding them awards Prism Points and unlocks unique content. Keep exploring with curiosity!'
      },
      {
        question: 'How can I export my reflection data?',
        answer: 'You can export your complete reflection history, check-ins, and wellness data from your profile settings. Data is available in JSON format for personal use or backup. This ensures you always have access to your spiritual journey record, even outside the platform.'
      }
    ]
  }
];

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Science of Soul-Tech: How AI Enhances Spiritual Practice',
    excerpt: 'Exploring how artificial intelligence can deepen our connection to inner wisdom without replacing human intuition.',
    author: 'Dr. Sarah Chen, Founder',
    readTime: '8 min read',
    category: 'Philosophy',
    publishedAt: '2025-08-05',
    tags: ['AI', 'Spirituality', 'Technology', 'Consciousness']
  },
  {
    id: 2,
    title: 'Building Sacred Spaces in Digital Environments',
    excerpt: 'How we designed LightPrompt to honor the depth and privacy required for authentic spiritual reflection.',
    author: 'Alex Rivera, Lead Designer',
    readTime: '6 min read',
    category: 'Design',
    publishedAt: '2025-08-01',
    tags: ['Design', 'Sacred Spaces', 'Privacy', 'User Experience']
  },
  {
    id: 3,
    title: 'The Neuroscience of Location-Based Memory and Reflection',
    excerpt: 'Why GeoPrompt works: the research behind place-based emotional processing and memory formation.',
    author: 'Dr. Michael Thompson, Research Director',
    readTime: '10 min read',
    category: 'Research',
    publishedAt: '2025-07-28',
    tags: ['Neuroscience', 'Memory', 'Location', 'Psychology']
  }
];

const EXTERNAL_RESOURCES = [
  {
    title: 'Meditation Guide Library',
    description: 'Comprehensive collection of guided meditations and mindfulness practices',
    url: 'https://lightprompt.co/meditations',
    category: 'Practice'
  },
  {
    title: 'Community Forums',
    description: 'Connect with fellow travelers in our external discussion spaces',
    url: 'https://community.lightprompt.co',
    category: 'Community'
  },
  {
    title: 'Research Papers',
    description: 'Academic studies on digital wellness and AI-assisted consciousness work',
    url: 'https://research.lightprompt.co',
    category: 'Academic'
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('getting-started');
  const { toast } = useToast();

  const handleContactSubmit = () => {
    toast({
      title: 'Message Sent',
      description: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
    });
  };

  const filteredFAQs = FAQ_CATEGORIES.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Help & Resources</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to make the most of your soul-tech wellness journey
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="blog">Blog & Insights</TabsTrigger>
          <TabsTrigger value="resources">External Resources</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* FAQ Section */}
        <TabsContent value="faq" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category Sidebar */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Categories
              </h3>
              {FAQ_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>

            {/* FAQ Content */}
            <div className="md:col-span-3">
              {filteredFAQs.map((category) => {
                if (searchQuery || selectedCategory === category.id) {
                  return (
                    <div key={category.id} className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <category.icon className="h-5 w-5" />
                        <h2 className="text-2xl font-semibold">{category.name}</h2>
                      </div>
                      
                      <div className="space-y-3">
                        {category.items.map((item, index) => {
                          const itemId = `${category.id}-${index}`;
                          const isExpanded = expandedFAQ === itemId;
                          
                          return (
                            <Card key={itemId} className="cursor-pointer">
                              <CardHeader 
                                className="pb-3"
                                onClick={() => setExpandedFAQ(isExpanded ? null : itemId)}
                              >
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{item.question}</CardTitle>
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </div>
                              </CardHeader>
                              {isExpanded && (
                                <CardContent className="pt-0">
                                  <p className="text-muted-foreground leading-relaxed">
                                    {item.answer}
                                  </p>
                                </CardContent>
                              )}
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </TabsContent>

        {/* Blog Section */}
        <TabsContent value="blog" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Insights & Updates</h2>
            <p className="text-muted-foreground">
              Deep dives into soul-tech, wellness research, and platform updates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <h3 className="text-xl font-semibold leading-tight">{post.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Book className="h-4 w-4 mr-2" />
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold">Want to stay updated?</h3>
              <p className="text-muted-foreground">
                Subscribe to our newsletter for the latest insights on soul-tech wellness
              </p>
              <div className="flex max-w-md mx-auto space-x-2">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* External Resources */}
        <TabsContent value="resources" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">External Resources</h2>
            <p className="text-muted-foreground">
              Curated links to expand your wellness journey beyond the platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXTERNAL_RESOURCES.map((resource, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">{resource.category}</Badge>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">{resource.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {resource.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold">Suggest a Resource</h3>
              <p className="text-muted-foreground">
                Know of a great wellness resource we should feature? Let us know!
              </p>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Submit Suggestion
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="text-muted-foreground">
              We're here to support your wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="How can we help?" />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea 
                    className="w-full min-h-[120px] p-3 border rounded-md resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <Button onClick={handleContactSubmit} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Contact Options */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Live Chat Support</p>
                      <p className="text-sm text-muted-foreground">Available 9AM-6PM PST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@lightprompt.co</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Video className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Video Tutorials</p>
                      <p className="text-sm text-muted-foreground">Step-by-step guides</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Community Support</p>
                      <p className="text-sm text-muted-foreground">Get help from other users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}