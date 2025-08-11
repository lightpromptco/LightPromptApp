import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Building, Zap, Shield, Star, ArrowRight, Globe, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team & Organization Management",
    description: "Manage multiple users, departments, and wellness programs across your organization"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Custom AI Training",
    description: "Train specialized AI models on your company's wellness philosophy and values"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Advanced Analytics Dashboard",
    description: "Track wellness metrics, engagement, and ROI across your entire organization"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "HIPAA-compliant data handling with advanced encryption and access controls"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "API Access",
    description: "Integrate LightPrompt's wellness technology with your existing HR and wellness platforms"
  },
  {
    icon: <Building className="w-6 h-6" />,
    title: "White-Label Options",
    description: "Customize the platform with your branding for a seamless user experience"
  }
];

const useCases = [
  {
    title: "Healthcare Organizations",
    description: "Enhance patient wellness programs with personalized AI-guided astrological insights",
    benefits: ["Improved patient engagement", "Holistic wellness approach", "Reduced burnout"]
  },
  {
    title: "Corporate Wellness",
    description: "Transform workplace culture with conscious AI tools for employee wellbeing",
    benefits: ["Increased employee satisfaction", "Better work-life balance", "Enhanced productivity"]
  },
  {
    title: "Educational Institutions",
    description: "Support student and faculty wellness with personalized guidance systems",
    benefits: ["Student retention improvement", "Stress management", "Academic performance"]
  },
  {
    title: "Wellness Professionals",
    description: "Scale your practice with AI-powered astrological insights and client management",
    benefits: ["Client base expansion", "Automated insights", "Professional credibility"]
  }
];

export default function B2BPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="bg-gradient-to-r from-teal-500 to-blue-500 text-white mb-6">
            <Building className="w-4 h-4 mr-2" />
            Enterprise Solutions
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Transform Your Organization with Conscious AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Empower your team with LightPrompt's enterprise-grade wellness platform. 
            Combine cutting-edge AI technology with astrological wisdom to create 
            unprecedented employee engagement and organizational wellbeing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white px-8 py-4"
            >
              <Star className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-teal-500 text-teal-600 hover:bg-teal-50 px-8 py-4"
            >
              <Users className="w-5 h-5 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white dark:bg-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Enterprise Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to scale conscious wellness across your organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg text-white">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Industry Applications
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how organizations across industries are transforming with LightPrompt
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-teal-600">{useCase.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join leading organizations already using LightPrompt to enhance employee wellbeing 
            and create more conscious, connected workplaces.
          </p>
          
          <Card className="max-w-md mx-auto mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Enterprise Plan</CardTitle>
              <div className="text-4xl font-bold text-teal-600">$199<span className="text-lg font-normal text-gray-500">/month</span></div>
              <p className="text-gray-600 dark:text-gray-300">For organizations and wellness professionals</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>All Resonance features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>Team & organization management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>Custom AI training</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-500" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white">
                Contact Sales
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          
          <p className="text-sm text-gray-500">
            Custom pricing available for larger organizations. Contact us for a personalized quote.
          </p>
        </div>
      </section>
    </div>
  );
}