import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  MessageCircle, 
  User, 
  Heart, 
  Activity, 
  BookOpen, 
  Map,
  Users,
  Sparkles,
  Compass,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home, description: "Welcome & Overview", glyph: "⟐" },
  { path: "/chat", label: "Chat", icon: MessageCircle, description: "AI Conversations", glyph: "◈" },
  { path: "/store", label: "Store & Pricing", icon: BookOpen, description: "Course & Ebook", glyph: "♦" },
  { 
    path: "/wellness-tools", 
    label: "Wellness Tools", 
    icon: Compass, 
    description: "Self-Discovery & Growth", 
    glyph: "✦",
    subItems: [
      { path: "/soul-map-explorer", label: "SoulMap", icon: Compass, description: "Interactive Birth Chart Explorer" },
      { path: "/vision-quest", label: "VisionQuest", icon: Map, description: "Self-Discovery Journey" },
      { path: "/geoprompt", label: "GeoPrompt (Beta)", icon: Map, description: "Location-Based Mindfulness" }
    ]
  },
  { 
    path: "/connect", 
    label: "Connect", 
    icon: Users, 
    description: "Community & Relationships", 
    glyph: "◇",
    subItems: [
      { path: "/soul-sync", label: "SoulSync (Beta)", icon: Heart, description: "Find Your Connection" },
      { path: "/vibe-match", label: "VibeMatch", icon: Sparkles, description: "AI-Powered Compatibility" },
      { path: "/community", label: "SeedCircle", icon: Users, description: "Join Our Discord" }
    ]
  },
  { path: "/help", label: "Help & Support", icon: User, description: "Support & Resources", glyph: "⟢" },
  { path: "/settings", label: "Settings", icon: Settings, description: "User Settings", glyph: "⟣" },
];

const PRODUCT_ITEMS = [
  { path: "/b2b", label: "For Business", icon: Users, description: "Enterprise Solutions" },
];

export function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [location] = useLocation();
  
  // Check if current user is admin (removed admin section per user request)
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = false; // Admin section removed per user request

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  return (
    <>
      {/* Navigation Menu Button - Top Right Corner */}
      <div className="fixed top-3 right-3 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background/95 backdrop-blur shadow-lg border-2 h-10 w-10 p-0 transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-background border-l shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  LightPrompt
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">SoulTech</p>
                  <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full">
                    BETA
                  </span>
                </div>
              </div>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-screen">
          {/* Main Navigation */}
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              const isExpanded = expandedItems.includes(item.path);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              
              return (
                <div key={item.path} className="space-y-1">
                  {hasSubItems ? (
                    <Button
                      onClick={() => toggleExpanded(item.path)}
                      variant={active ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${
                        active ? "bg-primary text-primary-foreground" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-purple-500 dark:text-purple-400 text-sm font-bold flex-shrink-0">
                          {item.glyph}
                        </span>
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                    </Button>
                  ) : (
                    <Link href={item.path}>
                      <Button
                        onClick={() => setIsOpen(false)}
                        variant={active ? "default" : "ghost"}
                        className={`w-full justify-start h-auto p-3 ${
                          active ? "bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-purple-500 dark:text-purple-400 text-sm font-bold flex-shrink-0">
                            {item.glyph}
                          </span>
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <div className="flex-1 text-left">
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  )}
                  
                  {/* Sub Items */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-6 space-y-1">
                      {item.subItems.map((subItem) => {
                        const subActive = isActive(subItem.path);
                        return (
                          <Link key={subItem.path} href={subItem.path}>
                            <Button
                              onClick={() => setIsOpen(false)}
                              variant={subActive ? "default" : "ghost"}
                              className={`w-full justify-start text-sm p-2 ${
                                subActive ? "bg-primary text-primary-foreground" : ""
                              }`}
                            >
                              <subItem.icon className="h-4 w-4 mr-2" />
                              <div className="text-left">
                                <div className="font-medium">{subItem.label}</div>
                                <div className="text-xs opacity-70">{subItem.description}</div>
                              </div>
                            </Button>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>



          {/* Solutions Section */}
          <div className="space-y-2 border-t pt-4">
            <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Solutions
            </div>
            {PRODUCT_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="w-full justify-start text-sm bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Styles for Full Width Layout */}
      <style>{`
        .main-content {
          padding-top: 1rem;
          margin-left: 0;
          padding-left: 1rem;
          padding-right: 1rem;
          width: 100%;
        }
        
        @media (min-width: 768px) {
          .main-content {
            padding-top: 2rem;
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
      `}</style>
    </>
  );
}