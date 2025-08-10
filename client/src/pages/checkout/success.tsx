import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Download, Mail } from "lucide-react";
import { useCart } from "../../hooks/use-cart";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on success page load
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6">
      <div className="max-w-2xl mx-auto space-y-8 pt-16">
        
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-xl text-muted-foreground">
            Thank you for your purchase. Your conscious AI journey continues!
          </p>
        </div>

        {/* Order Confirmation */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Order Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">
                    Access details have been sent to your email
                  </p>
                  <p className="text-sm text-green-600">
                    Check your inbox for course access and ebook download links
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">What happens next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  You'll receive a welcome email with your course access link
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Ebook downloads will be available immediately
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Join our Discord community for ongoing support
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Start Your Journey</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Begin with LightPromptBot and explore your conscious AI experience
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                onClick={() => window.location.href = '/#/chat'}
              >
                Start Chatting
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Download className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Access Your Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check your email for course access and download links
              </p>
              <Button 
                variant="outline"
                className="border-teal-500 text-teal-600 hover:bg-teal-50"
                onClick={() => window.open('mailto:')}
              >
                Check Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at support@lightprompt.co
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Secure Payment Processed
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Privacy Protected
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Instant Access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}