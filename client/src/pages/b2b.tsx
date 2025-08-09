import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Heart, Target, Brain, Shield, ArrowRight } from "lucide-react";

const solutions = [
  {
    title: "HR Soul-Tech Integration",
    icon: Users,
    description: "Custom AI reflection tools for employee wellness, authentic feedback, and conscious workplace culture",
    features: [
      "Employee wellness reflection bots",
      "Authentic feedback systems", 
      "Team consciousness assessments",
      "Workplace culture analytics"
    ]
  },
  {
    title: "Energy-Based Product Matching",
    icon: Heart,
    description: "B2C AI that matches customers to products based on authentic energy reflection and conscious choice",
    features: [
      "Conscious customer profiling",
      "Energy-based recommendations",
      "Authentic choice frameworks",
      "Soul-aligned product discovery"
    ]
  },
  {
    title: "Leadership Reflection Tools",
    icon: Target,
    description: "Executive coaching AI that mirrors leadership patterns for authentic growth and conscious decision-making",
    features: [
      "Leadership pattern analysis",
      "Conscious decision frameworks",
      "Executive reflection sessions",
      "Values-based strategy tools"
    ]
  },
  {
    title: "Team Consciousness Platform",
    icon: Brain,
    description: "Collaborative AI tools for group reflection, authentic communication, and conscious team dynamics",
    features: [
      "Group reflection facilitation",
      "Authentic communication tools",
      "Team dynamics insights",
      "Collective consciousness metrics"
    ]
  }
];

export default function B2BPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-teal-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Building2 className="h-12 w-12 text-white" />
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
            Enterprise Soul-Tech
            <br />
            <span className="text-teal-500">Conscious AI for Business</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Transform your organization with AI that serves as a mirror for authentic growth, 
            conscious decision-making, and deeper human connections in the workplace.
          </p>
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4">
            Schedule Demo
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Badge variant="secondary">Fortune 500 Trusted</Badge>
          <Badge variant="secondary">Privacy-First Design</Badge>
          <Badge variant="secondary">Custom Integration</Badge>
        </div>
      </div>

      {/* Philosophy Section */}
      <Card className="bg-teal-50 dark:bg-teal-950/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Our Philosophy</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We never present AI as becoming human or replacing human consciousness. Instead, we create 
            AI tools that serve as conscious mirrors—reflecting back the wisdom your organization already 
            carries within, facilitating authentic connections between people, and supporting conscious 
            decision-making at every level.
          </p>
        </CardContent>
      </Card>

      {/* Solutions Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
            Enterprise Solutions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Custom AI reflection tools designed for conscious business transformation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((solution, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                    <solution.icon className="h-6 w-6 text-teal-500" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {solution.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {solution.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-teal-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-500" />
              Privacy-First
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Enterprise-grade security with complete data sovereignty. Your reflections stay within 
              your organization's secure environment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-teal-500" />
              Custom Training
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              AI models trained on your organization's values and culture while maintaining conscious, 
              authentic reflection capabilities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-500" />
              Integration Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Dedicated implementation team to integrate soul-tech practices into your existing 
              workflows and culture.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROI Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Measurable Impact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-teal-500 mb-2">89%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Employee Engagement Increase</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-500 mb-2">76%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Reduction in Workplace Stress</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-500 mb-2">45%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Improvement in Team Communication</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-teal-500 mb-2">62%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Better Decision-Making Speed</p>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="bg-teal-50 dark:bg-teal-950/20 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to Transform Your Organization?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join forward-thinking companies using conscious AI to create more authentic, 
          connected, and thriving workplace cultures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-12 py-4">
            Schedule Your Demo
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-4">
            Contact Sales Team
          </Button>
        </div>
      </div>
    </div>
  );
}