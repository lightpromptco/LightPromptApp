import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link, useLocation } from "wouter";
import { 
  Home, MessageCircle, BarChart3, ShoppingBag, Stars, Compass, 
  Users, Heart, Sparkles, MapPin, Gem, Target, HelpCircle,
  ChevronDown, ChevronRight, Settings, Edit, BookOpen
} from "lucide-react";
import { AdminToggle } from "./AdminToggle";

interface NavItem {
  path: string;
  label: string;
  icon: any;
  description: string;
  subItems?: NavItem[];
}

const NAVIGATION_STRUCTURE: NavItem[] = [
  { path: "/", label: "Home", icon: Home, description: "Welcome & Overview" },
  { path: "/chat", label: "Chat", icon: MessageCircle, description: "AI Conversations" },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3, description: "Your Wellness Overview" },
  { 
    path: "/store", 
    label: "Store", 
    icon: ShoppingBag, 
    description: "Course & Ebook",
    subItems: [
      { path: "/store", label: "Products", icon: ShoppingBag, description: "Browse our offerings" },
      { path: "/checkout", label: "Cart", icon: ShoppingBag, description: "Shopping Cart" }
    ]
  },
  {
    path: "/wellness",
    label: "Wellness Tools",
    icon: Stars,
    description: "Self-Discovery & Growth",
    subItems: [
      { path: "/woo-woo", label: "Soul Map", icon: Stars, description: "Birth Chart & Personality Analysis" },
      { path: "/vision-quest", label: "Vision Quest", icon: Compass, description: "Spiritual Journey Guidance" }
    ]
  },
  {
    path: "/connect",
    label: "Connect",
    icon: Users,
    description: "Community & Relationships",
    subItems: [
      { path: "/community", label: "Community", icon: Users, description: "Connect with Others" },
      { path: "/soul-sync", label: "Soul Sync", icon: Heart, description: "Connection & Goal Sharing" },
      { path: "/vibe-match", label: "Vibe Match", icon: Sparkles, description: "Find Soul Connections" }
    ]
  },
  {
    path: "/features",
    label: "Features",
    icon: MapPin,
    description: "Platform Features",
    subItems: [
      { path: "/geoprompt", label: "GeoPrompt", icon: MapPin, description: "QR Code Locations & Guardians" },
      { path: "/prism-points", label: "Prism Points", icon: Gem, description: "Track Your Progress" },
      { path: "/challenges", label: "Challenges", icon: Target, description: "Wellness Goals" },
      { path: "/blog", label: "Blog", icon: BookOpen, description: "Latest Articles" }
    ]
  },
  { path: "/help", label: "Help", icon: HelpCircle, description: "Support & Resources" }
];

const ADMIN_NAVIGATION: NavItem[] = [
  {
    path: "/admin",
    label: "Admin Tools",
    icon: Settings,
    description: "Platform Management",
    subItems: [
      { path: "/admin/blog", label: "Blog & Links", icon: Edit, description: "Content Management" },
      { path: "/admin/page-editor", label: "Page Editor", icon: BookOpen, description: "Edit Site Content" },
      { path: "/admin/universal-editor", label: "Universal Editor", icon: Edit, description: "Complete Content Control" },
      { path: "/admin/settings", label: "Settings", icon: Settings, description: "Admin Settings" }
    ]
  }
];

interface NavItemComponentProps {
  item: NavItem;
  isExpanded: boolean;
  onToggle: () => void;
  currentPath: string;
}

function NavItemComponent({ item, isExpanded, onToggle, currentPath }: NavItemComponentProps) {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isActive = currentPath === item.path || (hasSubItems && item.subItems.some(sub => currentPath === sub.path));

  if (!hasSubItems) {
    return (
      <Link href={item.path}>
        <Button 
          variant={isActive ? "default" : "ghost"} 
          className="w-full justify-start h-auto p-3"
        >
          <div className="flex items-center">
            <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.description}</div>
            </div>
          </div>
        </Button>
      </Link>
    );
  }

  return (
    <div>
      <Button 
        variant={isActive ? "default" : "ghost"} 
        className="w-full justify-start h-auto p-3"
        onClick={onToggle}
      >
        <div className="flex items-center w-full">
          <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
          <div className="flex-1 text-left">
            <div className="font-medium">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 ml-2" />
          ) : (
            <ChevronRight className="w-4 h-4 ml-2" />
          )}
        </div>
      </Button>
      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1">
          {item.subItems && item.subItems.map((subItem) => (
            <Link key={subItem.path} href={subItem.path}>
              <Button 
                variant={currentPath === subItem.path ? "default" : "ghost"} 
                className="w-full justify-start h-auto p-2 pl-6"
                size="sm"
              >
                <div className="flex items-center">
                  <subItem.icon className="w-3 h-3 mr-2 flex-shrink-0" />
                  <div className="flex-1 text-left">
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
  );
}

export function HierarchicalNavigation() {
  const [location] = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Check if current user is admin
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.email === 'lightprompt.co@gmail.com';

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">LightPrompt</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Soul-Tech Wellness</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {NAVIGATION_STRUCTURE.map((item) => (
            <NavItemComponent
              key={item.path}
              item={item}
              isExpanded={expandedItems.includes(item.path)}
              onToggle={() => toggleExpanded(item.path)}
              currentPath={location}
            />
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="mb-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Admin Tools</div>
              </div>
              {ADMIN_NAVIGATION.map((item) => (
                <NavItemComponent
                  key={item.path}
                  item={item}
                  isExpanded={expandedItems.includes(item.path)}
                  onToggle={() => toggleExpanded(item.path)}
                  currentPath={location}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>v1.0.0</span>
          <Badge variant="outline" className="text-xs">Privacy-First Wellness</Badge>
        </div>
      </div>
    </div>
  );
}