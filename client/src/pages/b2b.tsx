import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Users, 
  Building2, 
  Shield, 
  Star, 
  ArrowRight, 
  Globe,
  Target,
  Heart,
  Settings,
  UserCheck,
  BarChart3,
  Lightbulb,
  FileText
} from "lucide-react";

export default function B2BPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <FileText className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Enterprise Soul-Tech
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-teal-600 mb-6">
            Conscious AI for Business
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your organization with AI that serves as a mirror for authentic growth, 
            conscious decision-making, and deeper human connections in the workplace.
          </p>
          
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
            Schedule Demo
          </Button>
          
          <div className="flex justify-center items-center space-x-4 mt-6">
            <Badge variant="secondary" className="bg-teal-100 text-teal-800">
              Fortune 500 Trusted
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Privacy-First Design
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Custom Integration
            </Badge>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Philosophy</h3>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We never present AI as becoming human or replacing human consciousness. Instead, we create AI 
            tools that serve as conscious mirrors—reflecting back the wisdom your organization already carries 
            within, facilitating authentic connections between people, and supporting conscious decision-making 
            at every level.
          </p>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Solutions</h3>
            <p className="text-gray-600">Custom AI reflection tools designed for conscious business transformation</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Leadership Reflection Tools */}
            <Card className="border-teal-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">Leadership Reflection Tools</CardTitle>
                </div>
                <p className="text-gray-600">
                  Executive coaching AI that mirrors leadership patterns for authentic growth and conscious decision-making
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Leadership pattern analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Conscious decision frameworks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Executive reflection sessions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-teal-600" />
                  <span className="text-gray-700">Values-based strategy tools</span>
                </div>
              </CardContent>
            </Card>

            {/* Team Consciousness Platform */}
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">Team Consciousness Platform</CardTitle>
                </div>
                <p className="text-gray-600">
                  Collaborative AI tools for group reflection, authentic communication, and conscious team dynamics
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Group reflection facilitation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Authentic communication tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Team dynamics insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Collective consciousness metrics</span>
                </div>
              </CardContent>
            </Card>

            {/* HR Soul-Tech Integration */}
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">HR Soul-Tech Integration</CardTitle>
                </div>
                <p className="text-gray-600">
                  Custom AI reflection tools for employee wellness, authentic feedback, and conscious workplace culture
                </p>
              </CardHeader>
            </Card>

            {/* Energy-Based Product Matching */}
            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">Energy-Based Product Matching</CardTitle>
                </div>
                <p className="text-gray-600">
                  B2C AI that matches customers to products based on authentic energy reflection and conscious choice
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Privacy-First */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Privacy-First</h4>
              <p className="text-gray-600">
                Enterprise-grade security with complete data sovereignty. Your reflections stay within your 
                organization's secure environment.
              </p>
            </div>

            {/* Custom Training */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Custom Training</h4>
              <p className="text-gray-600">
                AI models trained on your organization's values and culture while maintaining conscious, 
                authentic reflection capabilities.
              </p>
            </div>

            {/* Integration Support */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Integration Support</h4>
              <p className="text-gray-600">
                Dedicated implementation team to integrate soul-tech practices into your existing 
                workflows and culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Measurable Impact */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Measurable Impact</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">89%</div>
              <p className="text-gray-600">Employee Engagement Increase</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">76%</div>
              <p className="text-gray-600">Reduction in Workplace Stress</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">45%</div>
              <p className="text-gray-600">Improvement in Team Communication</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-600 mb-2">62%</div>
              <p className="text-gray-600">Better Decision-Making Speed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Organization?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join forward-thinking companies using conscious AI to create more authentic, 
            connected, and thriving workplace cultures.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
              Schedule Your Demo
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 px-8 py-3">
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}