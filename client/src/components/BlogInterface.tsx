import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Science Behind AI-Powered Wellness Coaching',
    excerpt: 'How modern AI systems can understand and respond to your emotional patterns to provide personalized wellness guidance that evolves with your growth journey.',
    content: `The intersection of artificial intelligence and personal wellness represents one of the most promising frontiers in mental health technology. Unlike traditional wellness apps that provide static content, AI-powered systems can adapt to your unique emotional patterns, learning from your interactions to provide increasingly personalized guidance.

## Understanding Emotional Intelligence in AI

Modern language models can detect subtle emotional cues in text, analyzing not just what you say but how you say it. This allows for nuanced responses that meet you where you are emotionally, whether you're seeking comfort, challenge, or simple validation.

## The Power of Adaptive Learning

What makes AI wellness coaching particularly powerful is its ability to remember and learn from your patterns over time. If you consistently struggle with motivation on Monday mornings, the AI can proactively offer targeted support. If you respond well to metaphorical language over direct instruction, it adapts accordingly.

## Privacy and Safety Considerations

Of course, with great power comes great responsibility. Any AI system handling personal wellness data must prioritize privacy and emotional safety. This means transparent data practices, robust security measures, and careful design to avoid harmful responses.

## The Future of Personalized Wellness

As these systems continue to evolve, we're moving toward truly personalized wellness experiences that feel less like using an app and more like having a wise friend who knows you deeply and cares about your growth.`,
    category: 'AI & Technology',
    publishedAt: '2024-08-01',
    readTime: 6,
    tags: ['AI', 'Wellness', 'Mental Health', 'Technology']
  },
  {
    id: '2',
    title: 'Building Authentic Connections in the Digital Age',
    excerpt: 'Exploring how technology can facilitate genuine human connection rather than replace it, and why soul-deep relationships matter more than ever.',
    content: `In our hyper-connected yet often lonely world, the question isn't whether technology brings us together or drives us apart—it's how we can design digital experiences that foster authentic connection.

## The Paradox of Digital Connection

We have more ways to connect than ever before, yet loneliness rates continue to climb. This paradox reveals something crucial: not all connection is created equal. Surface-level interactions, no matter how frequent, cannot substitute for meaningful relationship.

## What Makes Connection Authentic?

Authentic connection requires vulnerability, presence, and mutual understanding. It happens when we feel seen and heard for who we truly are, not just the curated versions of ourselves we present online.

## Technology as a Bridge, Not a Destination

The most powerful applications of technology in human connection use digital tools as bridges to deeper understanding rather than destinations in themselves. Features like guided reflection prompts, thoughtful matching based on values rather than superficial traits, and AI-moderated conversations can create safe spaces for vulnerability.

## The Role of Intentional Design

Creating technology that supports authentic connection requires intentional design choices: prioritizing quality over quantity, depth over speed, and safety over engagement metrics. It means building systems that encourage users to be their authentic selves rather than idealized versions.

## Moving Forward Together

The future of digital connection lies not in replacing human intimacy with artificial alternatives, but in using technology to help us be more present, more vulnerable, and more genuinely ourselves with one another.`,
    category: 'Relationships',
    publishedAt: '2024-07-28',
    readTime: 5,
    tags: ['Connection', 'Relationships', 'Digital Wellness', 'Authenticity']
  },
  {
    id: '3',
    title: 'The Neuroscience of Habit Formation and Wellness',
    excerpt: 'Understanding how your brain builds habits can revolutionize your approach to sustainable wellness practices and long-term behavior change.',
    content: `Habit formation isn't just about willpower—it's about working with your brain's natural learning mechanisms to create lasting change.

## The Habit Loop

Every habit follows a simple neurological loop: cue, routine, reward. Understanding this loop is the first step to both building positive habits and breaking negative ones.

## The Role of Dopamine

Contrary to popular belief, dopamine isn't about pleasure—it's about anticipation. Learning to work with your brain's reward prediction system can make habit formation feel effortless rather than forced.

## Small Changes, Big Impact

The most sustainable habits start tiny. Your brain is more likely to adopt a new pattern if it requires minimal cognitive effort initially. Once the neural pathway is established, you can gradually increase the intensity.

## Environmental Design

Your environment shapes your behavior more than you realize. Small changes to your physical and digital spaces can make positive habits feel automatic and negative habits more difficult.

## The Compound Effect

Like compound interest, small habits accumulate over time into transformative life changes. The key is consistency over intensity, showing up even when motivation wanes.`,
    category: 'Neuroscience',
    publishedAt: '2024-07-25',
    readTime: 4,
    tags: ['Habits', 'Neuroscience', 'Behavior Change', 'Wellness']
  },
  {
    id: '4',
    title: 'The LightPrompt Inventor\'s Manifesto',
    excerpt: '33 Ideas to Help You Build the Future. Build wisely. Reflect deeply. Leave beauty behind you.',
    content: `You're not here to scroll. You're here because you feel it — that pull to do more than complain, more than cope, more than optimize your damn morning routine.

You're here to build something better.

## A New Kind of Manifesto

This isn't a course. It's not a startup pitch. It's not a "thought leadership" thread.

This is a living manifesto for inventors, engineers, dreamers, hackers, and misfits — anyone who feels like the tools we've been given aren't working. Because they're not.

LightPrompt started as an experiment in soul technology — a new kind of system where digital tools actually help people reflect, connect, and grow. Not sell. Not distract. Not dominate.

This Manifesto is a continuation of that mission.

## Why This Exists

It's a sparkbook. A blueprint. A reminder.

These aren't just "cool ideas." They are seeds for a livable future.

Take what lights you up. Remix it. Elevate it. But build with integrity.

The world doesn't need another smart tool. It needs wise ones.

## Key Principles for Future Builders

**Build wisely.** Consider the long-term impact of what you create. Technology should serve consciousness, not dominate it.

**Reflect deeply.** Every invention should emerge from genuine need and authentic understanding of human experience.

**Leave beauty behind you.** Create things that make the world more beautiful, more connected, more alive.

## The Vision Forward

We can't fix the world with the same energy that broke it. We need new approaches, new tools, new ways of thinking about the relationship between technology and human flourishing.

From emotional resonance grids to mycelium roads, from modular empathy rooms to post-capitalist trust vaults — the future is ours to invent.

But it requires builders who understand that true innovation serves not just efficiency or profit, but the deepest needs of the human soul.

## Join the Movement

This manifesto contains 33 specific ideas for building the future. Each one is a seed waiting for the right person to nurture it into reality.

If one of these ideas sparks something in you, don't just admire it. Build it. The world needs your unique perspective on what's possible.

*The future is collaborative. The future is conscious. The future is now.*`,
    category: 'Innovation',
    publishedAt: '2025-01-08',
    readTime: 8,
    tags: ['Manifesto', 'Innovation', 'Future', 'Technology', 'Consciousness']
  }
];

interface BlogInterfaceProps {
  userId: string;
}

export function BlogInterface({ userId }: BlogInterfaceProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(BLOG_POSTS.map(post => post.category)))];
  
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedPost) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={() => setSelectedPost(null)}
          variant="ghost" 
          className="mb-4"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Blog
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">{selectedPost.category}</Badge>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span><i className="fas fa-clock mr-1"></i>{selectedPost.readTime} min read</span>
                <span><i className="fas fa-calendar mr-1"></i>{new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <CardTitle className="text-3xl">{selectedPost.title}</CardTitle>
            <p className="text-lg text-gray-600 mt-2">{selectedPost.excerpt}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedPost.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: selectedPost.content.replace(/\n\n## /g, '\n\n<h2 class="text-xl font-semibold mt-6 mb-3">').replace(/## /g, '<h2 class="text-xl font-semibold mt-6 mb-3">').replace(/\n\n/g, '</p>\n\n<p class="mb-4">').replace(/^([^<])/g, '<p class="mb-4">$1').replace(/([^>])$/g, '$1</p>') 
            }} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">LightPrompt Insights</h2>
        <p className="text-gray-600">
          Exploring the intersection of technology, wellness, and human connection
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map(post => (
          <Card 
            key={post.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            onClick={() => setSelectedPost(post)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-gray-500">
                  <i className="fas fa-clock mr-1"></i>
                  {post.readTime} min
                </span>
              </div>
              <CardTitle className="text-lg leading-tight">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{post.tags.length - 2}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-search text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No articles found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardContent className="text-center py-8">
          <i className="fas fa-envelope-open-text text-3xl text-teal-600 mb-4"></i>
          <h3 className="text-xl font-semibold mb-2">Stay Connected</h3>
          <p className="text-gray-600 mb-6">
            Get the latest insights on AI, wellness, and human connection delivered to your inbox
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <Input 
              placeholder="your.email@example.com" 
              className="flex-1"
            />
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600">
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}