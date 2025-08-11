import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Terminal, 
  Code2, 
  Database,
  Zap,
  Bug,
  Settings,
  Globe,
  Activity,
  FileJson,
  Eye
} from 'lucide-react';
import { Link } from 'wouter';

export function DevToolsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const devTools = [
    {
      name: 'Cosmic Debug Console',
      description: 'System monitoring & astrological debugging',
      href: '/cosmic-debug',
      icon: Terminal,
      badge: 'LIVE',
      color: 'text-cyan-400'
    },
    {
      name: 'API Explorer',
      description: 'Interactive API testing & documentation',
      href: '/api-explorer',
      icon: Code2,
      badge: 'TOOLS',
      color: 'text-blue-400'
    },
    {
      name: 'Database Viewer',
      description: 'Explore data structure & content',
      href: '/data-viewer',
      icon: Database,
      badge: 'DATA',
      color: 'text-purple-400'
    },
    {
      name: 'Soul Map Explorer',
      description: 'Advanced astrological analysis',
      href: '/soul-map-explorer',
      icon: Zap,
      badge: 'ASTRO',
      color: 'text-amber-400'
    },
    {
      name: 'Admin Content',
      description: 'Visual page editor & CMS',
      href: '/admin/content',
      icon: Settings,
      badge: 'ADMIN',
      color: 'text-green-400'
    }
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="bg-black/90 text-green-400 border border-green-800 hover:bg-green-900/20 font-mono"
        >
          <Terminal className="w-4 h-4 mr-2" />
          Dev Tools
          <Badge className="ml-2 bg-green-800 text-green-100 text-xs">
            {devTools.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 bg-black/95 border-green-800 text-green-400 backdrop-blur"
        align="end"
      >
        <DropdownMenuLabel className="text-cyan-400 font-mono">
          🔧 Developer Console
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-green-800" />
        
        {devTools.map((tool) => (
          <DropdownMenuItem key={tool.href} className="p-0 hover:bg-green-900/20">
            <Link 
              href={tool.href} 
              className="w-full p-3 flex items-start gap-3 hover:no-underline"
              onClick={() => setIsOpen(false)}
            >
              <tool.icon className={`w-5 h-5 mt-0.5 ${tool.color}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white">{tool.name}</span>
                  <Badge className={`text-xs px-1.5 py-0.5 ${
                    tool.badge === 'LIVE' ? 'bg-red-800 text-red-100' :
                    tool.badge === 'TOOLS' ? 'bg-blue-800 text-blue-100' :
                    tool.badge === 'DATA' ? 'bg-purple-800 text-purple-100' :
                    tool.badge === 'ASTRO' ? 'bg-amber-800 text-amber-100' :
                    'bg-green-800 text-green-100'
                  }`}>
                    {tool.badge}
                  </Badge>
                </div>
                <p className="text-xs text-green-600 leading-tight">
                  {tool.description}
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="bg-green-800" />
        
        <DropdownMenuItem className="p-3 hover:bg-green-900/20">
          <div className="w-full">
            <div className="flex items-center justify-between text-xs text-green-600">
              <span>System Status:</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>ONLINE</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-green-600 mt-1">
              <span>API Endpoints:</span>
              <span>6 Active</span>
            </div>
            <div className="flex items-center justify-between text-xs text-green-600 mt-1">
              <span>Debug Mode:</span>
              <span className="text-cyan-400">ENABLED</span>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}