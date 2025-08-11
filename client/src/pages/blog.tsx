import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  Clock,
  Heart,
  Share
} from 'lucide-react';
import { Link } from 'wouter';

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Art of Conscious AI: How Technology Can Mirror Your Soul",
    excerpt: "Exploring how artificial intelligence can serve as a reflection tool for personal growth and self-discovery, rather than replacing human wisdom.",
    author: "LightPrompt Team",
    date: "2025-01-15",
    readTime: "8 min read",
    category: "Philosophy",
    tags: ["AI", "Consciousness", "Growth"],
    featured: true
  },
  {
    id: 2,
    title: "Understanding Your Birth Chart: Beyond Sun Signs",
    excerpt: "Dive deeper into astrological wisdom with a comprehensive guide to planetary positions, houses, and their psychological meanings.",
    author: "Soul Map Oracle",
    date: "2025-01-10",
    readTime: "12 min read",
    category: "Astrology",
    tags: ["Birth Chart", "Astrology", "Self-Discovery"]
  },
  {
    id: 3,
    title: "Building Authentic Community in the Digital Age",
    excerpt: "How online communities can foster genuine human connection and support spiritual growth in meaningful ways.",
    author: "Community Guide",
    date: "2025-01-05",
    readTime: "6 min read",
    category: "Community",
    tags: ["Community", "Connection", "Digital Wellness"]
  },
  {
    id: 4,
    title: "The Science of Reflection: Why AI Makes a Perfect Mirror",
    excerpt: "Examining the psychological principles behind using AI as a tool for self-reflection and personal insight.",
    author: "Dr. Conscious Tech",
    date: "2024-12-28",
    readTime: "10 min read",
    category: "Science",
    tags: ["Psychology", "AI", "Reflection"]
  }
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Philosophy', 'Astrology', 'Community', 'Science'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = BLOG_POSTS.find(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            Blog & Insights
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore the intersection of technology, consciousness, and personal growth
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <Card className="mb-12 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/3">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-teal-500">Featured</Badge>
                    <Badge variant="outline">{featuredPost.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">
                    {featuredPost.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {featuredPost.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Button>
                    Read Article <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
              <div className="md:w-1/3 bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-24 h-24 text-white opacity-50" />
              </div>
            </div>
          </Card>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.filter(post => !post.featured || selectedCategory !== 'All' || searchQuery).map((post) => (
            <Card key={post.id} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">
                    Read More
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or browse different categories
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-12">
          <CardHeader className="text-center">
            <CardTitle>Stay Updated</CardTitle>
            <CardDescription>
              Get the latest insights on conscious AI and personal growth delivered to your inbox
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="your@email.com" type="email" />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}