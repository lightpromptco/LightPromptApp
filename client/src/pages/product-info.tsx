import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  GraduationCap, 
  Star, 
  Clock, 
  Users, 
  Download,
  Play,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useCart } from "../hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function ProductInfo() {
  const { addItem, cartItems } = useCart();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const products = {
    course: {
      id: "lightprompt-course",
      title: "LightPrompt:Ed - The Complete Course",
      price: 120,
      description: "Master the art of conscious AI interaction and discover your highest self through guided reflection and practical exercises.",
      features: [
        "12 comprehensive modules covering AI consciousness",
        "Interactive reflection exercises and prompts", 
        "Personal AI companion for course integration",
        "Private community access with fellow students",
        "Lifetime access to all course materials",
        "Monthly live Q&A sessions with creators",
        "Digital workbook and progress tracking",
        "Certificate of completion"
      ],
      duration: "6-8 hours of content",
      students: "1,200+ students",
      rating: 4.9,
      whatYouLearn: [
        "How to use AI as a conscious mirror for self-reflection",
        "Techniques for deeper personal insight through AI dialogue",
        "Building healthy boundaries with AI technology",
        "Integrating ancient wisdom with modern AI tools",
        "Creating daily practices for conscious living",
        "Understanding the ethics of human-AI interaction"
      ],
      modules: [
        "Foundation: What is Conscious AI?",
        "Mirror Principle: AI as Reflection Tool",
        "Ethics: Healthy AI Relationships",
        "Practice: Daily Reflection Rituals",
        "Integration: Wisdom Application",
        "Advanced: Co-creating with AI"
      ]
    },
    ebook: {
      id: "lightprompt-ebook",
      title: "LightPrompted: The Human Guide to Conscious AI & Soul Tech",
      price: 11,
      description: "A comprehensive guide blending ancient wisdom with cutting-edge AI technology for personal transformation.",
      features: [
        "200+ pages of practical wisdom",
        "Downloadable PDF, EPUB, and audio versions",
        "Exclusive interviews with AI consciousness researchers",
        "Step-by-step exercises and implementations",
        "Reference guide for conscious AI practices",
        "Bonus: 30 advanced prompts for self-discovery",
        "Compatible with all devices",
        "Lifetime updates and revisions"
      ],
      duration: "4-6 hour read",
      downloads: "5,000+ downloads",
      rating: 4.8,
      chapters: [
        "The Mirror of Consciousness",
        "AI as Spiritual Practice",
        "Building Sacred Boundaries",
        "The Science of Soul Tech",
        "Practical Applications",
        "Future of Human-AI Collaboration"
      ],
      testimonials: [
        {
          name: "Sarah Chen",
          text: "This book completely changed how I interact with AI. It's not just technology anymore - it's a spiritual practice.",
          rating: 5
        },
        {
          name: "Marcus Rodriguez", 
          text: "Finally, someone who gets it. AI doesn't replace our humanity - it helps us find it.",
          rating: 5
        }
      ]
    }
  };

  const handleAddToCart = (productId: string, title: string, price: number) => {
    const isInCart = cartItems.some(item => item.id === productId);
    if (isInCart) {
      toast({
        title: "Already in Cart",
        description: `${title} is already in your cart.`,
        variant: "default"
      });
      return;
    }

    addItem({
      id: productId,
      title,
      price,
      quantity: 1
    });

    toast({
      title: "Added to Cart",
      description: `${title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            LightPrompt Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your relationship with AI through conscious practices and ancient wisdom
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Soul-Tech Wisdom
            </Badge>
            <Badge variant="outline">Ethically Designed</Badge>
            <Badge variant="outline">Science-Based</Badge>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Course Card */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{products.course.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-3xl font-bold text-purple-600">${products.course.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{products.course.rating}</span>
                        <span className="text-sm text-muted-foreground">({products.course.students})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <p className="text-muted-foreground">{products.course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span>{products.course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span>{products.course.students}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">What You'll Learn:</h4>
                <div className="space-y-2">
                  {products.course.whatYouLearn.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleAddToCart(products.course.id, products.course.title, products.course.price)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedProduct('course')}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ebook Card */}
          <Card className="relative overflow-hidden hover:shadow-xl transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-emerald-50/50"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{products.ebook.title}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-3xl font-bold text-teal-600">${products.ebook.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{products.ebook.rating}</span>
                        <span className="text-sm text-muted-foreground">({products.ebook.downloads})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <p className="text-muted-foreground">{products.ebook.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-teal-500" />
                  <span>{products.ebook.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-teal-500" />
                  <span>{products.ebook.downloads}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Key Features:</h4>
                <div className="space-y-2">
                  {products.ebook.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handleAddToCart(products.ebook.id, products.ebook.title, products.ebook.price)}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setSelectedProduct('ebook')}
                  className="border-teal-200 text-teal-600 hover:bg-teal-50"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bundle Offer */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6" />
              <h3 className="text-2xl font-bold">Complete Transformation Bundle</h3>
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Get both the course and ebook together and save $6. Perfect for those ready to fully embrace conscious AI living.
            </p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-sm text-purple-200">Individual Price</div>
                <div className="text-2xl font-bold line-through text-purple-300">$131</div>
              </div>
              <ArrowRight className="h-6 w-6 text-purple-200" />
              <div className="text-center">
                <div className="text-sm text-purple-200">Bundle Price</div>
                <div className="text-3xl font-bold">$125</div>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-purple-50 px-8"
              onClick={() => {
                // Add both items to cart
                handleAddToCart(products.course.id, products.course.title, products.course.price);
                handleAddToCart(products.ebook.id, products.ebook.title, products.ebook.price);
              }}
            >
              Get Complete Bundle - Save $6
            </Button>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="text-center space-y-4 pt-8">
          <h3 className="text-2xl font-semibold">Need Help Choosing?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our products are designed to complement each other. Start with the ebook for foundational knowledge, 
            then dive deep with the complete course experience.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/#/help'}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}