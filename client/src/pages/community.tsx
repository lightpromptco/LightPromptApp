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
  ExternalLink,
  ArrowRight,
  Github,
  Coffee,
  Clock,
  Globe,
  Code,
  Lightbulb
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const COMMUNITY_TABS = [
  {
    title: 'General Discussion',
    description: 'Share ideas, ask questions, and connect with the community',
    icon: MessageCircle,
    posts: 24,
    lastActivity: '2 minutes ago',
    color: 'bg-blue-50 text-blue-700'
  },
  {
    title: 'Conscious AI',
    description: 'Explore ethical AI practices and mindful technology use',
    icon: Lightbulb,
    posts: 18,
    lastActivity: '15 minutes ago',
    color: 'bg-purple-50 text-purple-700'
  },
  {
    title: 'Show & Tell',
    description: 'Share your projects, insights, and discoveries',
    icon: Star,
    posts: 12,
    lastActivity: '1 hour ago',
    color: 'bg-yellow-50 text-yellow-700'
  },
  {
    title: 'Course Q&A',
    description: 'Get help with course content and exercises',
    icon: BookOpen,
    posts: 8,
    lastActivity: '3 hours ago',
    color: 'bg-green-50 text-green-700'
  },
  {
    title: 'Feature Requests',
    description: 'Suggest new features and improvements',
    icon: Code,
    posts: 15,
    lastActivity: '5 hours ago',
    color: 'bg-teal-50 text-teal-700'
  }
];

const RECENT_POSTS = [
  {
    title: 'How do you practice mindful AI interactions?',
    author: 'Sarah M.',
    replies: 12,
    time: '2 minutes ago',
    category: 'Conscious AI'
  },
  {
    title: 'Soul Map insights - birth chart accuracy',
    author: 'Alex K.',
    replies: 8,
    time: '15 minutes ago',
    category: 'Course Q&A'
  },
  {
    title: 'Built a meditation reminder using the platform',
    author: 'Jordan L.',
    replies: 6,
    time: '1 hour ago',
    category: 'Show & Tell'
  },
  {
    title: 'Request: Integration with Apple Health',
    author: 'Maya P.',
    replies: 4,
    time: '3 hours ago',
    category: 'Feature Requests'
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
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General Discussion');
  const { toast } = useToast();

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both title and content are required",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Post created!",
      description: "Your post has been shared with the community",
    });
    setNewPostTitle('');
    setNewPostContent('');
  };

  const joinDiscord = () => {
    window.open('https://discord.gg/lightprompt', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                LightPrompt Community
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Connect, share, and grow together in conscious AI exploration
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={joinDiscord} className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Discord
              </Button>
              <Link href="/store">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Join Course
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              247 members
            </span>
            <span className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              1,203 posts
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Active today
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Discussion Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {COMMUNITY_TABS.map((tab, index) => (
                    <div key={index} className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${tab.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <tab.icon className="w-5 h-5 mr-2" />
                          <h3 className="font-semibold">{tab.title}</h3>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {tab.posts} posts
                        </Badge>
                      </div>
                      <p className="text-sm opacity-80 mb-2">{tab.description}</p>
                      <p className="text-xs opacity-60">Last activity: {tab.lastActivity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RECENT_POSTS.map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>by {post.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                          <span>{post.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.replies}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Create Post */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Start a Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="What's on your mind?"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    placeholder="Share your thoughts, questions, or insights..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleCreatePost} className="w-full">
                  Create Post
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Join our Discord for real-time conversations!
                </p>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/20 dark:to-teal-950/20 rounded-lg">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold mb-1">Most Helpful</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sarah M. - 15 helpful answers this month
                  </p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                  <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <h3 className="font-semibold mb-1">Community Love</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    98% positive interaction rating
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <Heart className="w-4 h-4 mr-2 mt-0.5 text-red-500 flex-shrink-0" />
                    Be kind and respectful to all members
                  </li>
                  <li className="flex items-start">
                    <Lightbulb className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
                    Share insights and ask thoughtful questions
                  </li>
                  <li className="flex items-start">
                    <Star className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                    Celebrate others' achievements and growth
                  </li>
                </ul>
              </CardContent>
            </Card>
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
                <Link href="/store">
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