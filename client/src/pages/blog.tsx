import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, ExternalLink, ArrowRight } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  url?: string;
  isExternal?: boolean;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of Conscious AI',
      excerpt: 'Exploring how AI can serve as a mirror for human consciousness and spiritual growth, rather than replacing human connection.',
      date: '2025-08-10',
      category: 'Philosophy',
      url: '/blog/future-conscious-ai'
    },
    {
      id: '2',
      title: 'Building Ethical AI Relationships',
      excerpt: 'How to maintain healthy boundaries while using AI as a tool for self-reflection and personal development.',
      date: '2025-08-08',
      category: 'AI Ethics',
      url: '/blog/ethical-ai-relationships'
    },
    {
      id: '3',
      title: 'Privacy-First Wellness Technology',
      excerpt: 'Why data sovereignty matters in wellness apps and how LightPrompt protects your personal journey.',
      date: '2025-08-05',
      category: 'Privacy',
      url: '/blog/privacy-first-wellness'
    },
    {
      id: '4',
      title: 'The Science of Digital Mindfulness',
      excerpt: 'Research-backed approaches to using technology mindfully for emotional and spiritual well-being.',
      date: '2025-08-02',
      category: 'Science',
      url: '/blog/digital-mindfulness'
    }
  ];

  const filteredPosts = blogPosts.filter(post =>
    searchQuery === "" ||
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Philosophy': 'bg-purple-100 text-purple-800',
      'AI Ethics': 'bg-blue-100 text-blue-800',
      'Privacy': 'bg-green-100 text-green-800',
      'Science': 'bg-orange-100 text-orange-800',
      'Wellness': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            LightPrompt Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights on conscious AI, ethical technology, and soul-tech wellness
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      if (post.url) {
                        if (post.isExternal) {
                          window.open(post.url, '_blank');
                        } else {
                          window.location.href = post.url;
                        }
                      }
                    }}
                    className="group-hover:text-purple-600 transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  {post.isExternal && (
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No articles found matching your search.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-12 max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get notified when we publish new insights on conscious AI and wellness technology.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" />
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}