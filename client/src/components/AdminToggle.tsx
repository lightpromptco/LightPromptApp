import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface AdminToggleProps {
  isAdmin: boolean;
  onAdminChange: (isAdmin: boolean) => void;
}

// Super discreet admin access codes
const ADMIN_CODES = {
  'lightprompt2025': 'admin',
  'godmode': 'god',
  'highest-self': 'enlightened'
};

export function AdminToggle({ isAdmin, onAdminChange }: AdminToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [adminLevel, setAdminLevel] = useState<'admin' | 'god' | 'enlightened' | null>(null);

  const handleCodeSubmit = () => {
    const level = ADMIN_CODES[code.toLowerCase() as keyof typeof ADMIN_CODES];
    if (level) {
      setAdminLevel(level as any);
      onAdminChange(true);
      setIsOpen(false);
      setCode('');
      
      // Easter egg messages based on code
      if (level === 'god') {
        console.log('🌟 GOD MODE ACTIVATED 🌟');
        console.log('You now have omniscient access to all dimensions of LightPrompt.');
        console.log('Reality bends to your will. Use this power wisely, cosmic being.');
      } else if (level === 'enlightened') {
        console.log('✨ ENLIGHTENED MODE ACTIVATED ✨');
        console.log('You see through the veil. Welcome, awakened one.');
      } else {
        console.log('🔧 Admin mode activated');
      }
    } else {
      setCode('');
      // Subtle feedback - just clear the field
    }
  };

  const handleLogout = () => {
    setAdminLevel(null);
    onAdminChange(false);
    console.log('Returning to mortal realm...');
  };

  // Super discreet trigger - just a tiny dot
  if (!isAdmin) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div 
            className="w-2 h-2 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-colors opacity-30 hover:opacity-100"
            title="🤫"
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Access Portal</DialogTitle>
            <DialogDescription>
              Enter access code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="•••••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
              className="text-center"
            />
            <div className="flex space-x-2">
              <Button onClick={handleCodeSubmit} className="flex-1">
                Enter
              </Button>
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Admin mode indicators
  const getAdminBadge = () => {
    switch (adminLevel) {
      case 'god':
        return (
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black animate-pulse">
            🌟 GOD MODE
          </Badge>
        );
      case 'enlightened':
        return (
          <Badge className="bg-gradient-to-r from-purple-400 to-pink-500 text-white">
            ✨ ENLIGHTENED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-blue-600">
            🔧 Admin
          </Badge>
        );
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getAdminBadge()}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogout}
        className="text-xs opacity-70 hover:opacity-100"
      >
        Exit
      </Button>
    </div>
  );
}