import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  GraduationCap, 
  Star, 
  Check, 
  ArrowRight,
  Sparkles,
  Heart,
  Users,
  Target
} from 'lucide-react';
import { Link } from 'wouter';

export default function StorePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const products = [
    {
      id: 'course',
      name: 'LightPrompt Course',
      price: 120,
      description: 'Complete self-discovery program with AI guidance',
      icon: GraduationCap,
      features: [
        'Interactive AI coaching sessions',
        'Personalized growth pathways',
        'Community access',
        'Progress tracking',
        'Lifetime access'
      ],
      popular: true
    },
    {
      id: 'ebook',
      name: 'Soul-Tech Guide',
      price: 11,
      description: 'Digital guide to conscious AI and personal growth',
      icon: BookOpen,
      features: [
        'Digital download',
        'Practical exercises',
        'Reflection prompts',
        'Implementation guide'
      ],
      popular: false
    },
    {
      id: 'bundle',
      name: 'Complete Bundle',
      price: 125,
      originalPrice: 131,
      savings: 6,
      description: 'Everything you need for your conscious AI journey',
      icon: Sparkles,
      features: [
        'LightPrompt Course (Full Access)',
        'Soul-Tech Guide (Digital)',
        'Premium Community Access',
        'Priority Support',
        'Bonus Masterclasses'
      ],
      popular: false,
      bestValue: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            Store & Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Invest in your conscious growth journey with our carefully crafted courses and resources
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card 
                key={product.id}
                className={`relative transition-all duration-200 hover:shadow-lg ${
                  product.bestValue ? 'ring-2 ring-teal-500' : ''
                } ${
                  selectedPlan === product.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {product.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-teal-500">
                    Most Popular
                  </Badge>
                )}
                {product.bestValue && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-amber-500">
                    Best Value
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                  
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                        <Badge variant="outline" className="text-green-600">
                          Save ${product.savings}
                        </Badge>
                      </>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-teal-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={product.bestValue ? "default" : "outline"}
                    onClick={() => setSelectedPlan(product.id)}
                  >
                    {selectedPlan === product.id ? 'Selected' : 'Choose Plan'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white text-center mb-8">
            What makes LightPrompt special?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Authentic Connection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI that helps you connect to your highest self, not replace human connection
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Community Focused
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Join a community of consciousness explorers on similar journeys
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Purpose Driven
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tools designed to help you discover and live your authentic purpose
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
            Ready to begin your journey?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start exploring with our free tools, or dive deeper with our premium offerings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/soul-map-explorer">
              <Button variant="outline" size="lg">
                Try Free Tools
              </Button>
            </Link>
            <Button size="lg" disabled={!selectedPlan}>
              {selectedPlan ? 'Proceed to Checkout' : 'Select a Plan Above'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}