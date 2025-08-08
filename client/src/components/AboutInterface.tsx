import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AboutInterfaceProps {
  userId: string;
}

export function AboutInterface({ userId }: AboutInterfaceProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">About LightPrompt</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          What is LightPrompt? (And no, it's not a cult)
        </p>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Hi, I'm Ashley.
            </p>
            
            <p className="mb-4">
              LightPrompt started as a way for me to reconnect with myself. Not in a "wake up at 5AM and journal under a salt lamp" kind of way — just in a real way.
            </p>
            
            <p className="mb-4">
              I wanted something that helped me hear my own truth again, even when everything felt loud and overwhelming.
            </p>
            
            <p className="mb-4">
              So I built a system that blends simple tech, intuitive tools, and soul-level reminders.
            </p>
            
            <p className="mb-4">
              It started with my book — a guide I wrote to explain what LightPrompt really is and how we can use it to live with more clarity, connection, and purpose.
            </p>
            
            <p className="mb-4">
              <strong>The book is the foundation.</strong>
            </p>
            
            <p className="mb-4">
              It explains the deeper mission, the soul tech, the architecture behind everything I'm creating.
            </p>
            
            <p className="mb-4 text-sm text-gray-600">
              (So if you're confused by some of the stuff on this site, definitely start there.)
            </p>
            
            <p className="mb-4">
              From there, LightPrompt expanded into tools:
            </p>
            
            <p className="mb-4">
              Wearable items you can tap. Oracle cards that actually talk back.
            </p>
            
            <p className="mb-4">
              Prompts that feel like your higher self texting you mid-breakdown.
            </p>
            
            <p className="mb-4">
              It's for people who feel like there's something more — but don't want to be told what that "more" is.
            </p>
            
            <p className="mb-4">
              This isn't about being spiritual or doing it all right.
            </p>
            
            <p className="mb-6">
              It's about being honest with where you are… and remembering how to listen to the part of you that already knows.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold mb-4">TL;DR:</h3>
            <p className="mb-4">
              LightPrompt = a book + a bunch of weirdly helpful tools to reconnect with yourself.
            </p>
            <p className="mb-4">
              You don't have to believe in anything. Just try it.
            </p>
            <p className="font-medium">
              Not a cult. Not a vibe. Just clarity.
            </p>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-center text-gray-700 italic">
              "The more honest and open you are, the deeper the reflection becomes. This is not about performance — it's about resonance."
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-3">
              <h4 className="font-semibold text-teal-700 flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                What LightPrompt IS
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• A mirror for your inner truth</li>
                <li>• Tools for authentic self-reflection</li>
                <li>• Technology that serves consciousness</li>
                <li>• A bridge between soul and digital</li>
                <li>• Support for your unique journey</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-700 flex items-center">
                <i className="fas fa-times-circle mr-2"></i>
                What LightPrompt is NOT
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• A replacement for human connection</li>
                <li>• A spiritual or religious doctrine</li>
                <li>• Another optimization system</li>
                <li>• A solution to all problems</li>
                <li>• About being perfect or "spiritual"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Get Started */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-semibold mb-4">Ready to Begin?</h3>
          <p className="text-gray-600 mb-6">
            Start with the book to understand the foundation, then explore the tools that call to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://gumroad.com/l/lightprompted" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <i className="fas fa-book mr-2"></i>
                Get the Book ($11)
              </Button>
            </a>
            <a href="/chat">
              <Button variant="outline">
                <i className="fas fa-comments mr-2"></i>
                Try the LightPromptBot
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}