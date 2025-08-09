import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Book, Video, ShoppingCart, Users, Clock, Download, Award } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const products = [
  {
    id: 'course',
    title: 'LightPrompt:ed Course',
    subtitle: 'The Human Guide to Conscious AI & Soul Tech',
    price: 120,
    originalPrice: 197,
    description: 'Transform your relationship with AI through conscious practices and authentic connection.',
    type: 'Digital Course',
    duration: '4.5 hours',
    students: '600+',
    rating: 4.9,
    features: [
      '4.5 hours of HD video content',
      'Downloadable reflection guides',
      'Interactive exercises & prompts',
      'Private community access',
      'Lifetime access to all content',
      'Monthly Q&A sessions',
      'Certificate of completion',
      '30-day money-back guarantee'
    ],
    highlights: [
      'Foundation: Understanding Conscious AI',
      'Self-Reflection Practices',
      'Nature & Technology Integration',
      'Authentic Relationships',
      'Shadow Work & Inner Training',
      'Soul-Tech Communities'
    ],
    icon: Video,
    color: 'from-teal-500 to-blue-500'
  },
  {
    id: 'book',
    title: 'LightPrompted Book',
    subtitle: 'The Human Guide to Conscious AI & Soul Tech',
    price: 11,
    originalPrice: 27,
    description: 'A comprehensive guide to using AI as a tool for self-reflection and spiritual growth.',
    type: 'Digital Book',
    duration: '250+ pages',
    students: '1,200+',
    rating: 4.8,
    features: [
      'PDF, EPUB, and Kindle formats',
      'Instant download after purchase',
      'Practical exercises throughout',
      'Case studies and examples',
      'Bonus meditation guides',
      'Lifetime updates included',
      'Mobile-friendly formats',
      'Print-friendly version'
    ],
    highlights: [
      'The Philosophy of Conscious AI',
      'Practical Reflection Techniques',
      'Technology & Spirituality Balance',
      'Building Authentic Connections',
      'Advanced AI Interaction Methods',
      'Creating Sacred Digital Spaces'
    ],
    icon: Book,
    color: 'from-purple-500 to-pink-500'
  }
];

export default function ProductsPage() {
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  const { toast } = useToast();

  const purchaseMutation = useMutation({
    mutationFn: async ({ productId, amount, title }: { productId: string, amount: number, title: string }) => {
      setLoadingProduct(productId);
      const response = await apiRequest("POST", "/api/create-course-payment", {
        courseTitle: title,
        amount: amount * 100 // Convert to cents
      });
      return response;
    },
    onSuccess: (data) => {
      window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setLoadingProduct(null);
    }
  });

  const handlePurchase = (product: typeof products[0]) => {
    purchaseMutation.mutate({
      productId: product.id,
      amount: product.price,
      title: product.title
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="outline" className="text-teal-600 border-teal-200">
            Soul-Tech Wellness Products
          </Badge>
          <h1 className="text-5xl font-light text-gray-900 dark:text-white">
            Transform Your Relationship with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover conscious practices for using AI as a tool for self-reflection, 
            spiritual growth, and authentic human connection.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {products.map((product) => {
            const IconComponent = product.icon;
            const isLoading = loadingProduct === product.id;
            
            return (
              <Card key={product.id} className="relative overflow-hidden border-0 shadow-xl bg-white dark:bg-slate-800">
                {/* Product Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    Save ${product.originalPrice - product.price}
                  </Badge>
                </div>

                <CardHeader className="space-y-4 pb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${product.color} flex items-center justify-center`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{product.type}</span>
                      <span>•</span>
                      <span>{product.duration}</span>
                    </div>
                    <CardTitle className="text-2xl font-semibold mb-2">
                      {product.title}
                    </CardTitle>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                      {product.subtitle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{product.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.rating} rating</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Highlights */}
                  <div>
                    <h4 className="font-semibold mb-3">What You'll Learn:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {product.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-teal-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold mb-3">What's Included:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {product.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="h-4 w-4 text-teal-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {product.features.length > 4 && (
                        <div className="text-sm text-gray-500 mt-1">
                          + {product.features.length - 4} more features
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    className={`w-full bg-gradient-to-r ${product.color} hover:opacity-90 text-white border-0 py-4`}
                    onClick={() => handlePurchase(product)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Get Instant Access - ${product.price}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    30-day money-back guarantee • Instant access after payment
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bundle Offer */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/20 dark:to-blue-950/20">
            <CardContent className="text-center py-12">
              <div className="space-y-6">
                <Badge className="bg-teal-500 text-white">
                  Limited Time Bundle
                </Badge>
                <h3 className="text-3xl font-bold">Complete LightPrompt Package</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Get both the course and book together for maximum transformation
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">$125</span>
                  <span className="text-xl text-gray-400 line-through">$224</span>
                  <Badge variant="secondary">Save $99</Badge>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90 text-white px-12 py-4"
                  onClick={() => handlePurchase({
                    id: 'bundle',
                    title: 'LightPrompt Complete Package - Course + Book',
                    price: 125,
                    originalPrice: 224
                  } as any)}
                  disabled={loadingProduct === 'bundle'}
                >
                  {loadingProduct === 'bundle' ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Get Complete Package
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}