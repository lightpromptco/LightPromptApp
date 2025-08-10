import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, BookOpen, GraduationCap, Package } from "lucide-react";
import { useCart } from "../hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  badge?: string;
  icon: any;
  category: "course" | "ebook" | "bundle";
}

const PRODUCTS: Product[] = [
  {
    id: "lightprompt-course",
    name: "LightPrompt:ed Course",
    price: 120,
    description: "Complete conscious AI wellness course with 7 specialized AI companions, guided practices, and transformational insights.",
    features: [
      "Access to all 7 AI companions",
      "Guided wellness practices",
      "Personal growth tracking",
      "Community access",
      "Lifetime updates"
    ],
    icon: GraduationCap,
    category: "course"
  },
  {
    id: "soul-map-ebook",
    name: "Soul Map & Cosmos",
    price: 11,
    description: "Digital guide to self-discovery through astrology, consciousness, and cosmic alignment.",
    features: [
      "Comprehensive astrology guide",
      "Self-reflection exercises",
      "Cosmic alignment practices",
      "Digital format (PDF)",
      "Instant download"
    ],
    badge: "Popular",
    icon: BookOpen,
    category: "ebook"
  },
  {
    id: "complete-bundle",
    name: "Complete Bundle",
    price: 125,
    originalPrice: 131,
    description: "Everything you need for conscious living - course + ebook at a special price.",
    features: [
      "LightPrompt:ed Course",
      "Soul Map & Cosmos Ebook", 
      "Exclusive bonus content",
      "Priority support",
      "Save $6!"
    ],
    badge: "Best Value",
    icon: Package,
    category: "bundle"
  }
];

export default function Store() {
  const { addToCart, cartItems, getCartTotal } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = async (product: Product) => {
    try {
      let endpoint = '/api/create-course-payment';
      
      if (product.id === 'soul-map-ebook') {
        endpoint = '/api/create-ebook-payment';
      } else if (product.id === 'complete-bundle') {
        endpoint = '/api/create-bundle-payment';
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price * 100, // Convert to cents for Stripe
        }),
      });
      
      const data = await response.json();
      
      if (data && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Error",
        description: "Unable to process purchase. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCartItemCount = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    return item?.quantity || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            LightPrompt Store
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conscious AI tools for your wellness journey. Start with what feels right for you.
          </p>
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950 dark:to-blue-950 border-teal-200 dark:border-teal-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-teal-600" />
                  <span className="font-medium">
                    {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in cart
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${getCartTotal()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {PRODUCTS.map((product) => {
            const Icon = product.icon;
            const cartCount = getCartItemCount(product.id);
            
            return (
              <Card key={product.id} className="relative hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 flex flex-col h-full">
                {product.badge && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500">
                    {product.badge}
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4 flex-shrink-0">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <CardDescription className="text-center mb-4">
                    {product.description}
                  </CardDescription>
                  
                  <ul className="space-y-2 text-sm">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-2 mt-auto">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                    {cartCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => window.location.href = '/product-info'}
                    variant="outline"
                    className="w-full border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
                    size="lg"
                  >
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 px-8 py-3"
              onClick={() => {
                console.log('Checkout clicked, cart:', cartItems);
                if (cartItems.length === 0) {
                  toast({
                    title: "Cart is Empty",
                    description: "Please add items to your cart before checkout.",
                    variant: "destructive"
                  });
                  return;
                }
                // Use proper navigation with wouter
                window.location.pathname = '/checkout';
              }}
            >
              Proceed to Checkout • ${getCartTotal()}
            </Button>
          </div>
        )}

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