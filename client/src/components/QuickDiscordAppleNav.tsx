import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Terminal, Users, Crown, Sparkles } from "lucide-react";

export default function QuickDiscordAppleNav() {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Discord + Apple Mode</span>
        </div>
        
        <div className="space-y-2">
          <Link href="/dev-tools">
            <Button size="sm" className="w-full justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white">
              <Terminal className="w-4 h-4" />
              Developer Tools
              <Crown className="w-3 h-3 text-yellow-300" />
            </Button>
          </Link>
          
          <Link href="/community-hub">
            <Button size="sm" variant="outline" className="w-full justify-start gap-2">
              <Users className="w-4 h-4" />
              Community Hub
            </Button>
          </Link>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Discord functionality + Apple design
        </div>
      </div>
    </div>
  );
}