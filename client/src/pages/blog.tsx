import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Calendar, User, ArrowRight, Search, Filter } from "lucide-react";
import { Link } from "wouter";

const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Philosophy of Conscious AI: Beyond Human vs Machine',
    excerpt: 'Exploring how AI can serve as a mirror for human consciousness rather than a replacement for human connection.',
    author: 'LightPrompt Team',
    publishedAt: '2025-01-15',
    readTime: '8 min read',
    category: 'Philosophy',
    slug: 'conscious-ai-philosophy',
    featured: true,
    tags: ['AI Ethics', 'Consciousness', 'Philosophy']
  },
  {
    id: '2',
    title: 'Creating Sacred Digital Spaces for Reflection',
    excerpt: 'How to design and maintain digital environments that support deep self-reflection and spiritual growth.',
    author: 'LightPrompt Team',
    publishedAt: '2025-01-10',
    readTime: '6 min read',
    category: 'Practice',
    slug: 'sacred-digital-spaces',
    featured: false,
    tags: ['Digital Wellness', 'Spirituality', 'Design']
  },
  {
    id: '3',
    title: 'The Science of Schumann Resonance and Human Consciousness',
    excerpt: 'Understanding Earth\'s electromagnetic heartbeat and its potential connection to human awareness and well-being.',
    author: 'LightPrompt Team',
    publishedAt: '2025-01-05',
    readTime: '12 min read',
    category: 'Science',
    slug: 'schumann-resonance-consciousness',
    featured: true,
    tags: ['Science', 'Consciousness', 'Earth Energy']
  },
  {
    id: '4',
    title: 'Astrology Meets Technology: Modern Birth Chart Analysis',
    excerpt: 'How ancient wisdom traditions can be enhanced through modern technology for deeper self-understanding.',
    author: 'LightPrompt Team',
    publishedAt: '2024-12-28',
    readTime: '10 min read',
    category: 'Astrology',
    slug: 'astrology-technology-birth-charts',
    featured: false,
    tags: ['Astrology', 'Birth Charts', 'Technology']
  }
];

const CATEGORIES = ['All', 'Philosophy', 'Practice', 'Science', 'Astrology'];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState(BLOG_POSTS);

  useEffect(() => {
    let filtered = BLOG_POSTS;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-teal-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            LightPrompt Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights on conscious AI, digital wellness, and the intersection of technology and spirituality
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-teal-600" />
              Featured Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-teal-200">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <CardTitle className="group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                        <Calendar className="h-4 w-4 ml-3 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button size="sm" variant="ghost" className="group-hover:text-teal-600">
                          Read More <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-lg group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button size="sm" variant="ghost" className="group-hover:text-teal-600">
                          Read <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or category filters
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20 border-teal-200">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Begin Your Journey?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Dive deeper into conscious AI practices with our comprehensive course and guide
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/products">
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    Explore Products
                  </Button>
                </Link>
                <Link href="/woo-woo">
                  <Button variant="outline">
                    Create Soul Map
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