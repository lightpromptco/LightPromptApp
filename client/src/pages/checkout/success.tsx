import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";
import { Link } from "wouter";

export default function CheckoutSuccess() {
  useEffect(() => {
    // Clear cart on successful checkout
    localStorage.removeItem('lightprompt-cart');
    
    // Optional: Trigger cart context refresh
    window.dispatchEvent(new Event('storage'));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardContent className="text-center py-12 space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">
              Payment Successful!
            </h1>
            <p className="text-green-700 dark:text-green-300">
              Thank you for your purchase. Your spiritual journey begins now.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200 mb-2">
              <Mail className="h-4 w-4" />
              <span className="font-medium">What's Next?</span>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Access details and download links have been sent to your email. 
              Check your inbox (and spam folder) for your LightPrompt:ed materials.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Continue to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/chat">
              <Button variant="outline" className="w-full">
                Start Your First AI Conversation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}