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
  ChevronRight,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home, description: "Welcome & Overview", glyph: "⟐" },
  { path: "/chat", label: "Chat", icon: MessageCircle, description: "AI Conversations", glyph: "◈" },
  { path: "/dashboard", label: "BodyMirror", icon: Activity, description: "Your Wellness Overview", glyph: "⟡" },
  { path: "/store", label: "Store", icon: BookOpen, description: "Course & Ebook", glyph: "♦" },
  { 
    path: "/wellness-tools", 
    label: "Wellness Tools", 
    icon: Compass, 
    description: "Self-Discovery & Growth", 
    glyph: "✦",
    subItems: [
      { path: "/soul-map-explorer", label: "Soul Map Navigator", icon: Compass, description: "Interactive Birth Chart Explorer" },
      { path: "/vision-quest", label: "Vision Quest", icon: Map, description: "Self-Discovery Journey" },
      { path: "/geoprompt", label: "GeoPrompt", icon: Map, description: "Location-Based Mindfulness" }
    ]
  },
  { 
    path: "/connect", 
    label: "Connect", 
    icon: Users, 
    description: "Community & Relationships", 
    glyph: "◇",
    subItems: [
      { path: "/soul-sync", label: "Soul Sync", icon: Heart, description: "Find Your Connection" },
      { path: "/community", label: "Community", icon: Users, description: "Join Our Discord" },
      { path: "/vibe-match", label: "VibeMatch", icon: Heart, description: "Soul-level Compatibility" }
    ]
  },
  { 
    path: "/features", 
    label: "Features", 
    icon: Sparkles, 
    description: "Platform Features", 
    glyph: "✧",
    subItems: [
      { path: "/blog", label: "Blog", icon: BookOpen, description: "Articles & Insights" },
      { path: "/integrations", label: "Integrations", icon: Settings, description: "Third-party Connections" }
    ]
  },
  { path: "/help", label: "Help & Support", icon: User, description: "Support & Resources", glyph: "⟢" },
  { path: "/settings", label: "Settings", icon: Settings, description: "User Settings", glyph: "⟣" },
  { path: "/privacy", label: "Privacy", icon: Shield, description: "Privacy Policy", glyph: "⟨" }
];

const PRODUCTS_SECTION = [
  { path: "/business", label: "For Business", icon: Users, description: "Enterprise Solutions", glyph: "⟫" }
];

export function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [location] = useLocation();

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
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
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
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  LightPrompt
                </h1>
                <p className="text-xs text-muted-foreground">Soul-Tech Wellness</p>
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

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <div key={item.path}>
                {item.subItems ? (
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => toggleExpanded(item.path)}
                      className={`w-full justify-between h-auto p-3 ${
                        isActive(item.path) ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                      {expandedItems.includes(item.path) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {expandedItems.includes(item.path) && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link 
                            key={subItem.path} 
                            href={subItem.path}
                            onClick={() => setIsOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className={`w-full justify-start h-auto p-2 ${
                                isActive(subItem.path) ? 'bg-accent text-accent-foreground' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <subItem.icon className="h-4 w-4 text-muted-foreground" />
                                <div className="text-left">
                                  <div className="text-sm font-medium">{subItem.label}</div>
                                  <div className="text-xs text-muted-foreground">{subItem.description}</div>
                                </div>
                              </div>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={item.path} onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start h-auto p-3 ${
                        isActive(item.path) ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                      {item.glyph && (
                        <span className="text-lg text-muted-foreground">{item.glyph}</span>
                      )}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
            
            {/* Products Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
                Products
              </div>
              {PRODUCTS_SECTION.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start h-auto p-3 ${
                        isActive(item.path) ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                        <div className="text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                      {item.glyph && (
                        <span className="text-lg text-muted-foreground">{item.glyph}</span>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}