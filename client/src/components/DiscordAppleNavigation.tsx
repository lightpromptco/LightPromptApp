import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Users, 
  Code, 
  Database, 
  Zap, 
  Brain,
  Heart,
  Sparkles,
  Settings,
  Crown
} from "lucide-react";

export default function DiscordAppleNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/community-hub", icon: Users, label: "Community", badge: "1.2k", premium: false },
    { path: "/dev-tools", icon: Terminal, label: "Dev Tools", badge: "API", premium: true },
    { path: "/soul-map-explorer", icon: Brain, label: "Soul Map", badge: "New", premium: false },
    { path: "/vibe-match", icon: Heart, label: "VibeMatch", badge: "847", premium: false },
    { path: "/cosmic-debug", icon: Code, label: "Debug", badge: null, premium: true },
    { path: "/data-viewer", icon: Database, label: "Data", badge: null, premium: true },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LightPrompt
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`
                      relative h-10 px-3 gap-2 transition-all duration-200
                      ${isActive 
                        ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm" 
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      ${item.premium ? "border border-amber-200 dark:border-amber-800" : ""}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                    
                    {item.premium && (
                      <Crown className="w-3 h-3 text-amber-500" />
                    )}
                    
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "secondary" : "outline"}
                        className={`
                          text-xs px-1.5 py-0.5 h-5
                          ${isActive 
                            ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200" 
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }
                        `}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Zap className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1">
                Live
              </Badge>
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-semibold">LP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}