import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Settings, 
  Users, 
  BarChart3, 
  FileText, 
  Zap, 
  Heart, 
  Star,
  Globe,
  Edit3
} from "lucide-react";

interface QuickLinksProps {
  isAdmin?: boolean;
  variant?: "floating" | "sidebar" | "header";
}

export function QuickLinks({ isAdmin = false, variant = "floating" }: QuickLinksProps) {
  const adminLinks = [
    { href: "/admin/content", label: "Content", icon: Edit3, color: "bg-blue-500" },
    { href: "/admin/settings", label: "Settings", icon: Settings, color: "bg-gray-500" },
    { href: "/", label: "Live Site", icon: Globe, color: "bg-green-500" },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3, color: "bg-purple-500" },
  ];

  const userLinks = [
    { href: "/", label: "Home", icon: Home, color: "bg-blue-500" },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3, color: "bg-purple-500" },
    { href: "/soul-sync", label: "Soul Sync", icon: Heart, color: "bg-pink-500" },
    { href: "/woo-woo", label: "Soul Map", icon: Star, color: "bg-yellow-500" },
    { href: "/community", label: "Community", icon: Users, color: "bg-teal-500" },
    { href: "/course", label: "Course", icon: FileText, color: "bg-orange-500" },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  if (variant === "floating") {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {links.map(({ href, label, icon: Icon, color }) => (
                <Button
                  key={href}
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(href, '_blank')}
                  className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-gray-100"
                >
                  <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="w-16 bg-white border-r shadow-sm flex flex-col items-center py-4 space-y-3">
        {links.map(({ href, label, icon: Icon, color }) => (
          <Button
            key={href}
            variant="ghost"
            size="sm"
            onClick={() => window.open(href, '_blank')}
            className="flex flex-col items-center gap-1 h-auto py-2 px-2 hover:bg-gray-100"
            title={label}
          >
            <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
          </Button>
        ))}
      </div>
    );
  }

  // Header variant
  return (
    <div className="flex items-center space-x-2">
      {links.map(({ href, label, icon: Icon, color }) => (
        <Button
          key={href}
          variant="ghost"
          size="sm"
          onClick={() => window.open(href, '_blank')}
          className="flex items-center gap-2 text-xs"
        >
          <div className={`w-4 h-4 rounded ${color} flex items-center justify-center`}>
            <Icon className="h-2.5 w-2.5 text-white" />
          </div>
          {label}
        </Button>
      ))}
    </div>
  );
}