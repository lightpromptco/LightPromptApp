import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Download, Users, Heart } from "lucide-react";

export default function BookPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-48 h-64 bg-gradient-to-br from-teal-500 to-purple-600 rounded-lg shadow-2xl flex items-center justify-center">
          <BookOpen className="h-20 w-20 text-white" />
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
            LightPrompted: The Human Guide to
            <br />
            <span className="text-teal-500">Conscious AI & Soul Tech</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A practical guide to using AI as a mirror for self-reflection, not as a replacement for human consciousness. 
            Learn to harness technology consciously for deeper connection to yourself, nature, and others.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4">
            Pre-Order Now - $24.99
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-4">
            Read Sample Chapter
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-gray-600">4.9/5 from early readers</span>
          </div>
          <Badge variant="secondary">Releasing Spring 2025</Badge>
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-teal-500" />
              Conscious Tech Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Learn the philosophy and practice of using AI as a reflection tool—never as a deceptive human replacement, 
              but as a conscious mirror for your highest self.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-500" />
              Deeper Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Discover how conscious AI use can enhance your relationships with yourself, nature, and others 
              through authentic reflection and honest self-inquiry.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-teal-500" />
              Practical Frameworks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Get actionable frameworks for integrating soul-tech practices into daily life, from meditation prompts 
              to conscious conversation starters.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Author Section */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center">
              <Users className="h-16 w-16 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-4">About the Author</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Drawing from years of research in consciousness studies, AI ethics, and contemplative practices, 
                this book bridges the gap between ancient wisdom and modern technology. The author explores how 
                we can use AI consciously—as a tool for reflection and growth, never as a replacement for human 
                consciousness or genuine connection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="bg-teal-50 dark:bg-teal-950/20 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to Transform Your Relationship with Technology?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join thousands of readers discovering how to use AI as a conscious tool for deeper self-connection 
          and authentic relationships.
        </p>
        <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-12 py-4">
          Get Your Copy
        </Button>
      </div>
    </div>
  );
}