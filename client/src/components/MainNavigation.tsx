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
  { path: "/", label: "Home", icon: Home, description: "Welcome & Overview", glyph: "◊" },
  { path: "/chat", label: "LightPromptBot", icon: MessageCircle, description: "Conscious AI Mirror", glyph: "⟐" },
  { path: "/dashboard", label: "BodyMirror", icon: BarChart3, description: "Your Wellness Overview", glyph: "◈" },
  { path: "/store", label: "Store", icon: ShoppingBag, description: "Course & Ebook", glyph: "⬡" },
  { path: "/checkout", label: "Cart", icon: ShoppingBag, description: "Shopping Cart", glyph: "◉" },
  { path: "/woo-woo", label: "Cosmos", icon: Stars, description: "Birth Chart & Personality Analysis", glyph: "✧" },
  { path: "/vision-quest", label: "Vision Quest", icon: Compass, description: "Spiritual Journey Guidance", glyph: "⟡" },
  { path: "/community", label: "Community", icon: Users, description: "Connect with Others", glyph: "◎" },
  { path: "/soul-sync", label: "Soul Sync", icon: Heart, description: "Connection & Goal Sharing", glyph: "♦" },
  { path: "/vibe-match", label: "Vibe Match", icon: Sparkles, description: "Find Soul Connections", glyph: "✦" },
  { path: "/geoprompt-new", label: "GeoPrompt", icon: MapPin, description: "QR Code Locations & Guardians", glyph: "⬢" },
  { path: "/prism-points", label: "Prism Points", icon: Gem, description: "Track Your Progress", glyph: "◆" },
  { path: "/challenges", label: "Challenges", icon: Target, description: "Wellness Goals", glyph: "⬟" },
  { path: "/help", label: "Help", icon: HelpCircle, description: "Support & Resources", glyph: "◐" },
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
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">LightPrompt</h1>
              <p className="text-xs text-gray-500">Soul-Tech</p>
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 w-10 p-0"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
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
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground">Soul-Tech Wellness</p>
                <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[10px] font-medium rounded-full">
                  BETA
                </span>
              </div>
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

      {/* Mobile Bottom Sheet Menu */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Bottom Sheet */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            <div className="px-4 pb-6 overflow-y-auto max-h-[65vh]">
              {/* Mobile Header */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg">LightPrompt</h1>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">Soul-Tech</p>
                      <span className="px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded">
                        BETA
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Main Navigation Grid */}
              <div className="grid grid-cols-3 gap-3 py-4">
                {NAV_ITEMS.slice(0, 9).map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                      <div
                        className={`p-3 rounded-xl text-center transition-all ${
                          active 
                            ? "bg-teal-500 text-white" 
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        <item.icon className="h-6 w-6 mx-auto mb-1" />
                        <div className="text-xs font-medium truncate">{item.label}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              {/* Admin Toggle */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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
      )}

      {/* Responsive main content padding */}
      <style>{`
        .main-content {
          padding-top: 1rem;
        }
        
        @media (max-width: 767px) {
          .main-content {
            padding-top: 5rem;
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