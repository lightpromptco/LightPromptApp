import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, ArrowRight, BookOpen, GraduationCap, Package } from "lucide-react";

const PRODUCTS = [
  {
    id: "lightprompt-course",
    name: "LightPrompt:ed Course",
    price: 120,
    description: "Complete conscious AI wellness course with 7 specialized AI companions, guided practices, and transformational insights.",
    longDescription: "Transform your relationship with AI and yourself through this comprehensive course designed for the modern conscious individual. Learn to use AI as a mirror for self-discovery while developing practical wellness habits that stick.",
    features: [
      "Access to all 7 AI companions with unique personalities",
      "Guided wellness practices and daily check-ins",
      "Personal growth tracking and analytics",
      "Private community access with like-minded individuals", 
      "Lifetime updates and new content releases",
      "Mobile app access for on-the-go insights",
      "Weekly live Q&A sessions with experts",
      "Downloadable resources and worksheets"
    ],
    benefits: [
      "Develop deeper self-awareness through AI reflection",
      "Build sustainable wellness habits",
      "Connect with a supportive community",
      "Gain practical tools for emotional regulation",
      "Learn to navigate AI relationships consciously"
    ],
    icon: GraduationCap,
    category: "course",
    testimonial: {
      quote: "This course completely changed how I think about AI and personal growth. The AI companions feel like wise friends who actually help me understand myself better.",
      author: "Sarah M., Beta User"
    }
  },
  {
    id: "soul-map-ebook",
    name: "Soul Map & Cosmos",
    price: 11,
    description: "Digital guide to self-discovery through astrology, consciousness, and cosmic alignment.",
    longDescription: "A comprehensive digital guide that bridges ancient wisdom with modern self-discovery. Learn to read your cosmic blueprint and align your daily life with universal patterns for greater fulfillment.",
    features: [
      "Comprehensive astrology guide for beginners and advanced",
      "Interactive self-reflection exercises and prompts",
      "Cosmic alignment practices for daily life",
      "Professional PDF format with beautiful illustrations",
      "Instant download - start reading immediately",
      "Mobile-friendly format for reading anywhere",
      "Bonus meditation audio tracks",
      "Printable journal pages and worksheets"
    ],
    benefits: [
      "Understand your astrological blueprint",
      "Align decisions with cosmic timing",
      "Develop intuitive self-awareness",
      "Create personalized spiritual practices",
      "Connect with universal rhythms"
    ],
    badge: "Popular",
    icon: BookOpen,
    category: "ebook",
    testimonial: {
      quote: "Finally, an astrology guide that's practical and grounded. I use the cosmic timing insights for everything from business decisions to self-care planning.",
      author: "Marcus L., Entrepreneur"
    }
  },
  {
    id: "complete-bundle",
    name: "Complete Bundle",
    price: 125,
    originalPrice: 131,
    description: "Everything you need for conscious living - course + ebook at a special price.",
    longDescription: "The complete LightPrompt experience combining AI-powered wellness coaching with cosmic wisdom. Perfect for anyone serious about conscious personal development using cutting-edge tools.",
    features: [
      "LightPrompt:ed Course (full access)",
      "Soul Map & Cosmos Ebook (digital download)",
      "Exclusive bonus content not available separately",
      "Priority support and early access to new features",
      "Save $6 compared to purchasing separately",
      "Comprehensive onboarding and setup support",
      "Advanced AI companion personality options",
      "VIP community access with exclusive events"
    ],
    benefits: [
      "Complete conscious AI toolkit",
      "Maximum value for money",
      "Holistic approach to personal growth",
      "Both practical and spiritual perspectives",
      "Everything needed to start your journey"
    ],
    badge: "Best Value",
    icon: Package,
    category: "bundle",
    testimonial: {
      quote: "The bundle is incredible value. Having both the AI course and astrology guide creates this perfect balance of high-tech and spiritual wisdom.",
      author: "Dr. Jennifer K., Therapist"
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