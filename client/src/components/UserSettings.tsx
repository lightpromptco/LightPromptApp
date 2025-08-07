import { useState } from 'react';
import { User, UserProfile } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface UserSettingsProps {
  user: User | null;
  userProfile: UserProfile | null;
  onClose: () => void;
  onLogout: () => void;
}

export function UserSettings({ user, userProfile, onClose, onLogout }: UserSettingsProps) {
  const { toast } = useToast();

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('lightprompt_user_id');
    onLogout();
    toast({ title: "Logged out successfully" });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'tier_29': return 'bg-amber-100 text-amber-800';
      case 'tier_49': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'tier_29': return '$29+ Tier';
      case 'tier_49': return '$49+ Tier';
      case 'admin': return 'Admin';
      default: return tier;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Settings</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <i className="fas fa-times"></i>
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt="User Avatar" 
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <i className="fas fa-user text-white text-xl"></i>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <Badge className={`mt-1 text-xs ${getTierColor(user.tier)}`}>
                {getTierName(user.tier)}
              </Badge>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Daily Usage</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tokens Used</span>
                <span className="font-medium">{user.tokensUsed}/{user.tokenLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((user.tokensUsed / user.tokenLimit) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Resets daily</span>
                <span>Last reset: {new Date(user.resetDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Current Mood */}
          {userProfile && (
            <div className="bg-teal-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Current Mood</h4>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/80"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {userProfile.currentMood || 'Neutral'}
                </span>
              </div>
              {userProfile.moodDescription && (
                <p className="text-sm text-gray-600 mt-2">{userProfile.moodDescription}</p>
              )}
            </div>
          )}

          {/* Admin Access */}
          {user.role === 'admin' && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Admin</h4>
              <Link href="/admin">
                <Button className="w-full" variant="outline" onClick={onClose}>
                  <i className="fas fa-cog mr-2"></i>
                  Admin Portal
                </Button>
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="border-t pt-4 space-y-3">
            <Link href="/privacy">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onClose}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Privacy Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => {
                window.location.reload();
                onClose();
              }}
            >
              <i className="fas fa-refresh mr-2"></i>
              Refresh Session
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </Button>
          </div>

          {/* App Info */}
          <div className="border-t pt-4 text-center text-xs text-gray-500">
            <p>LightPrompt AI Wellness Platform</p>
            <p>Stay logged in for seamless conversations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}