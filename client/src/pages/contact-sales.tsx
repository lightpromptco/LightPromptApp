import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Building } from "lucide-react";
import { Link } from "wouter";

export default function ContactSales() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    plan: "Enterprise"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Inquiry Sent Successfully!",
          description: "We'll get back to you within 24 hours with Enterprise pricing and implementation details.",
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          message: "",
          plan: "Enterprise"
        });
      } else {
        throw new Error('Failed to send inquiry');
      }
    } catch (error) {
      toast({
        title: "Error Sending Inquiry",
        description: "Please try again or email us directly at lightprompt.co@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Back Button */}
        <Link href="/store">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pricing
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
            <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Enterprise Sales Inquiry</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tell us about your organization's needs and we'll create a custom solution
          </p>
        </div>

        {/* Enterprise Features Reminder */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-lg">Enterprise Plan - $199/month</CardTitle>
            <CardDescription>
              Advanced features for organizations and wellness professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                <span>Team & organization management</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                <span>Custom AI training</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                <span>Advanced analytics dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                <span>API access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                <span>White-label options</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500">✓</span>
                <span>Dedicated account manager</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Fill out the form below and our team will contact you within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Company Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Tell us about your needs *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your organization's size, wellness goals, and specific requirements for the LightPrompt Enterprise solution..."
                  className="min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending Inquiry..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Enterprise Inquiry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>Need immediate assistance? Email us directly at <strong>lightprompt.co@gmail.com</strong></p>
        </div>
      </div>
    </div>
  );
}