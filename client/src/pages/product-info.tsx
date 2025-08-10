import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, ArrowRight, BookOpen, GraduationCap, Package } from "lucide-react";

const PRODUCTS = [
  {
    id: "lightprompt-course",
    name: "LightPrompt:ed Course",
    price: 120,
    description: "The Human Guide to Conscious AI & Soul Tech - 12 comprehensive modules teaching you to use AI as a mirror for self-discovery while maintaining your sovereignty.",
    longDescription: "Transform your relationship with AI and yourself through this comprehensive course. Learn to use AI as a conscious mirror and reflection tool, not as a replacement for human wisdom. Master the art of prompt crafting, self-reflection, and maintaining sovereignty while exploring with AI technology.",
    features: [
      "12 Core Modules with video content and practical exercises",
      "Learn to use AI as mirror, not master - maintain your sovereignty",
      "Trauma-informed approach to AI-assisted inner work",
      "Creative expression and idea expansion with AI tools",
      "Healing work and shadow prompts for emotional terrain",
      "Soul dialogue and higher self integration practices",
      "Real-life application for parenting, business, relationships",
      "Building healthy AI practices with boundaries and rituals",
      "Ethical collaboration and consent frameworks",
      "Understanding AI's role in society and staying conscious",
      "Future of conscious tech and ethical systems design",
      "Final integration and claiming your role in the new era",
      "Community access with conscious AI practitioners",
      "Lifetime access and updates"
    ],
    benefits: [
      "Understand what AI really is - pattern prediction, not consciousness",
      "Use AI to enhance creativity without losing your unique voice",
      "Navigate AI relationships with clarity and discernment",
      "Build sustainable practices that amplify human wisdom",
      "Develop critical thinking about AI's role in culture",
      "Access your inner wisdom through conscious AI dialogue",
      "Stay grounded in your sovereignty while using powerful tools"
    ],
    icon: GraduationCap,
    category: "course",
    testimonial: {
      quote: "LightPrompt:ed taught me to use AI as a mirror for self-discovery rather than outsourcing my wisdom to a machine. The sovereignty-focused approach is exactly what we need in this AI era.",
      author: "Dr. Sarah Chen, Therapist & Conscious Tech Advocate"
    }
  },
  {
    id: "lightprompt-ed-novel",
    name: "LightPrompt:Ed",
    price: 11,
    description: "A novel by Ashley Daniel - The Human Guide to AI, Soul, and the Future. A visionary sci-fi story exploring consciousness, technology, and human potential.",
    longDescription: "Join this captivating journey through the intersection of consciousness and technology. Ashley Daniel's LightPrompt:Ed is a thought-provoking novel that explores what it means to be human in an age of artificial intelligence, weaving together themes of soul-tech, consciousness expansion, and the future of human-AI collaboration.",
    features: [
      "Visionary sci-fi novel exploring AI and consciousness",
      "Themes of soul-tech and human potential",
      "Professional digital format with stunning cover art",
      "Instant download - start reading immediately",
      "Mobile-friendly format for reading anywhere",
      "Engaging story that bridges technology and spirituality",
      "Perfect companion to the LightPrompt:ed course",
      "Explores the future of human-AI relationships"
    ],
    benefits: [
      "Expand your imagination about AI and consciousness",
      "Explore soul-tech concepts through engaging storytelling", 
      "Gain new perspectives on human potential",
      "Experience the future through visionary fiction",
      "Perfect blend of entertainment and consciousness expansion"
    ],
    badge: "Popular",
    icon: BookOpen,
    category: "ebook",
    testimonial: {
      quote: "LightPrompt:Ed beautifully captures the essence of conscious AI and human potential. Ashley Daniel has created a story that's both entertaining and deeply thought-provoking about our technological future.",
      author: "Alex Rivera, Conscious Tech Reader"
    }
  },
  {
    id: "complete-bundle",
    name: "Complete Bundle",
    price: 125,
    originalPrice: 131,
    description: "The complete conscious AI + soul-tech experience - everything you need for sovereignty in the age of artificial intelligence.",
    longDescription: "The complete LightPrompt experience combining conscious AI mastery with cosmic soul-tech wisdom. Perfect for anyone serious about maintaining their sovereignty while leveraging cutting-edge technology for personal growth and spiritual development.",
    features: [
      "LightPrompt:ed Course - The Human Guide to Conscious AI & Soul Tech",
      "All 12 comprehensive modules with video content",
      "LightPrompt:Ed Novel by Ashley Daniel - visionary sci-fi story",
      "Exclusive bonus content: Advanced AI prompting templates",
      "Priority support and early access to new features",
      "Save $6 compared to purchasing separately",
      "Comprehensive onboarding for conscious AI practice",
      "VIP community access with exclusive live sessions",
      "Lifetime access to all future updates and content",
      "Visionary fiction exploring consciousness and AI",
      "Ethical framework guides for AI use in spiritual practice"
    ],
    benefits: [
      "Complete sovereignty toolkit for the AI age",
      "Bridge technology and spirituality consciously",
      "Maximum value - everything needed for conscious AI mastery",
      "Holistic approach: practical tech skills + visionary storytelling",
      "Learn to use AI as a mirror, not a master",
      "Develop discernment and maintain your inner authority",
      "Access both cutting-edge AI tools and visionary storytelling about our technological future"
    ],
    badge: "Best Value",
    icon: Package,
    category: "bundle",
    testimonial: {
      quote: "The Complete Bundle combines practical AI mastery with visionary storytelling perfectly. The course teaches conscious AI use while the novel expands your imagination about what's possible.",
      author: "Dr. Michael Thompson, Conscious Leadership Coach"
    }
  }
];

export default function ProductInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Conscious AI Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your relationship with technology and yourself. Each option is designed to meet you where you are on your conscious living journey.
          </p>
        </div>

        {/* Products */}
        <div className="space-y-16">
          {PRODUCTS.map((product) => {
            const Icon = product.icon;
            
            return (
              <Card key={product.id} className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
                <div className="grid md:grid-cols-2 gap-8 p-8">
                  
                  {/* Left Side - Product Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full">
                        <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{product.name}</h2>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-purple-600">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                          {product.badge && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
                              {product.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-lg text-muted-foreground">
                      {product.longDescription}
                    </p>

                    {/* Features */}
                    <div>
                      <h3 className="font-semibold mb-3">What's Included:</h3>
                      <div className="grid gap-2">
                        {product.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        {product.features.length > 4 && (
                          <div className="text-sm text-muted-foreground mt-2">
                            + {product.features.length - 4} more features...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                      <p className="italic text-muted-foreground mb-2">"{product.testimonial.quote}"</p>
                      <p className="text-sm font-medium">— {product.testimonial.author}</p>
                    </div>
                  </div>

                  {/* Right Side - Benefits & Action */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">Key Benefits:</h3>
                      <div className="space-y-2">
                        {product.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All Features Expanded */}
                    <div>
                      <h3 className="font-semibold mb-3">Complete Feature List:</h3>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {product.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
                        onClick={() => {
                          // Add to cart and redirect to checkout
                          const event = new CustomEvent('addToCart', { detail: product });
                          window.dispatchEvent(event);
                          window.location.href = '/store';
                        }}
                      >
                        Get {product.name}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                      
                      <p className="text-xs text-center text-muted-foreground">
                        30-day money-back guarantee • Secure checkout • No subscription
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 space-y-4">
          <h2 className="text-2xl font-bold">Ready to Begin Your Journey?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of conscious individuals using AI as a tool for genuine self-discovery and personal growth.
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
            onClick={() => window.location.href = '/store'}
          >
            Browse All Options
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Secure Checkout
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Privacy-First
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              No Data Selling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}