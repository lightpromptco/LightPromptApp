import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const quickHelp = [
    {
      question: "How do I start chatting with AI?",
      answer: "Go to Chat, pick any bot, and start typing! LightPromptBot is great for beginners."
    },
    {
      question: "What's the Store about?", 
      answer: "Buy our conscious AI course ($120) or ebook ($11) to unlock deeper wellness tools."
    },
    {
      question: "How do I use Soul Sync?",
      answer: "Connect with others by sharing goals and sending supportive messages."
    },
    {
      question: "What is Soul Map?",
      answer: "Your birth chart analysis combined with AI insights for self-discovery."
    },
    {
      question: "What is GeoPrompt?",
      answer: "Scan QR codes at special locations for unique AI conversations and community connections."
    }
  ];

  const handleContactSubmit = () => {
    toast({
      title: "Contact Support",
      description: "Opening email to lightprompt.co@gmail.com...",
    });
    window.location.href = "mailto:lightprompt.co@gmail.com";
  };

  const filteredHelp = quickHelp.filter(item => 
    searchQuery === "" || 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-xl text-muted-foreground">
            Quick answers to get you started
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4 mb-8">
          {filteredHelp.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  {item.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2" size={20} />
              Need More Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Can't find what you're looking for? We're here to help!
            </p>
            <Button onClick={handleContactSubmit} className="w-full sm:w-auto">
              <MessageCircle className="mr-2" size={16} />
              Contact Support
            </Button>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/chat'}>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New to LightPrompt? Start with our beginner guide.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/store'}>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Course Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn more about our conscious AI course.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = '/community'}>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with others on the wellness journey.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}