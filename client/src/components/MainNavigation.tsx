import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  MapPin, 
  Gem, 
  HelpCircle, 
  BarChart3, 
  Target, 
  MessageCircle,
  Menu,
  X,
  Sparkles,
  Settings,
  UserPlus,
  User,
  Moon,
  Stars,
  Compass,
  ShoppingBag,
  BookOpen,
  Code,
  Heart
} from "lucide-react";
import { AdminToggle } from "./AdminToggle";

const NAV_ITEMS = [
  { path: "/", label: "Home", icon: Home, description: "Welcome & Overview" },
  { path: "/chat", label: "Chat", icon: MessageCircle, description: "AI Conversations" },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3, description: "Your Wellness Overview" },
  { path: "/store", label: "Store", icon: ShoppingBag, description: "Course & Ebook" },
  { path: "/checkout", label: "Cart", icon: ShoppingBag, description: "Shopping Cart" },
  { path: "/woo-woo", label: "Soul Map", icon: Stars, description: "Birth Chart & Personality Analysis" },
  { path: "/vision-quest", label: "Vision Quest", icon: Compass, description: "Spiritual Journey Guidance" },
  { path: "/community", label: "Community", icon: Users, description: "Connect with Others" },
  { path: "/soul-sync", label: "Soul Sync", icon: Heart, description: "Connection & Goal Sharing" },
  { path: "/vibe-match", label: "Vibe Match", icon: Sparkles, description: "Find Soul Connections" },
  { path: "/geoprompt", label: "GeoPrompt", icon: MapPin, description: "Location-based Reflections" },
  { path: "/prism-points", label: "Prism Points", icon: Gem, description: "Track Your Progress" },
  { path: "/challenges", label: "Challenges", icon: Target, description: "Wellness Goals" },
  { path: "/help", label: "Help", icon: HelpCircle, description: "Support & Resources" },
];

const ACCOUNT_ITEMS = [
  { path: "/signup", label: "Sign Up", icon: UserPlus, description: "Create Account" },
  { path: "/plans", label: "Plans", icon: Gem, description: "Upgrade Account" },
  { path: "/settings", label: "Settings", icon: Settings, description: "User Settings" },

  { path: "/privacy", label: "Privacy", icon: User, description: "Privacy Policy" },
];

const PRODUCT_ITEMS = [
  { path: "/b2b", label: "For Business", icon: Users, description: "Enterprise Solutions" },
];

export function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  
  // Check if current user is admin
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.email === 'lightprompt.co@gmail.com';

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-3 right-3 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background/95 backdrop-blur shadow-lg border-2 h-10 w-10 p-0 mobile-button transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-background border-r z-40 flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">LightPrompt</h1>
              <p className="text-xs text-muted-foreground">Soul-Tech Wellness</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${
                      active ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Products Section */}
          <div className="space-y-2 border-t pt-4">
            <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Products
            </div>
            {PRODUCT_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
                    size="sm"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Account Section */}
          <div className="space-y-2 border-t pt-4">
            <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </div>
            {ACCOUNT_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
                    size="sm"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              v1.0.0 • Privacy-First Wellness
            </div>
            <div className="flex items-center">
              <AdminToggle 
                isAdmin={isAdmin}
                onAdminChange={(enabled) => {
                  if (enabled) {
                    console.log('🔧 Admin mode activated from navigation');
                    // Refresh to show admin features
                    window.location.reload();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-background/98 backdrop-blur-md z-40 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div 
            className="h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-20 px-4 pb-24 space-y-6 max-w-sm mx-auto animate-in slide-in-from-top duration-300">
              {/* Mobile Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl">LightPrompt</h1>
                    <p className="text-sm text-muted-foreground">Soul-Tech Wellness</p>
                  </div>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        className={`w-full justify-start h-auto p-4 text-left rounded-xl transition-all duration-200 ${
                          active 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "hover:bg-accent hover:text-accent-foreground border border-border/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base truncate">{item.label}</div>
                          <div className="text-sm opacity-70 truncate">{item.description}</div>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Products Section */}
              <div className="space-y-2 border-t border-border/30 pt-6">
                <div className="px-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Store
                </div>
                {PRODUCT_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        className={`w-full justify-start h-auto p-4 text-left rounded-xl transition-all duration-200 ${
                          active 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "hover:bg-accent hover:text-accent-foreground border border-border/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base truncate">{item.label}</div>
                          <div className="text-sm opacity-70 truncate">{item.description}</div>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>

              {/* Account Section */}
              <div className="space-y-2 border-t border-border/30 pt-6">
                <div className="px-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Account
                </div>
                {ACCOUNT_ITEMS.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        className={`w-full justify-start h-auto p-4 text-left rounded-xl transition-all duration-200 ${
                          active 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "hover:bg-accent hover:text-accent-foreground border border-border/50"
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base truncate">{item.label}</div>
                          <div className="text-sm opacity-70 truncate">{item.description}</div>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </div>
              
              {/* Mobile Footer */}
              <div className="border-t border-border/30 pt-6 text-center">
                <div className="text-sm text-muted-foreground mb-4">
                  v1.0.0 • Privacy-First Wellness
                </div>
                <div className="flex justify-center">
                  <AdminToggle 
                    isAdmin={isAdmin}
                    onAdminChange={(enabled) => {
                      if (enabled) {
                        console.log('🔧 Admin mode activated from mobile navigation');
                        setIsOpen(false);
                        window.location.reload();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive main content padding */}
      <style>{`
        .main-content {
          padding-top: 1rem;
        }
        
        @media (max-width: 767px) {
          .main-content {
            padding-top: 4rem;
            margin-left: 0;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        @media (min-width: 768px) {
          .main-content {
            margin-left: 256px;
            padding-top: 2rem;
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }
        
        /* Ensure mobile menu doesn't interfere with content */
        @media (max-width: 767px) {
          body {
            overflow-x: hidden;
          }
        }
      `}</style>
    </>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainNavigation />
      <div className="main-content min-h-screen">
        {children}
      </div>
    </>
  );
}