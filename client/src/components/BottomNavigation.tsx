import { User, UserProfile } from '@shared/schema';
import { BOTS, Bot } from '@/lib/bots';
import { ObjectUploader } from '@/components/ObjectUploader';
import { UserSettings } from '@/components/UserSettings';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface BottomNavigationProps {
  user: User | null;
  userProfile: UserProfile | null;
  activeBot: Bot;
  onBotChange: (bot: Bot) => void;
  onAvatarUpdate: (url: string) => void;
  onLogout: () => void;
}

export function BottomNavigation({ 
  user, 
  userProfile, 
  activeBot, 
  onBotChange,
  onAvatarUpdate,
  onLogout 
}: BottomNavigationProps) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<Bot | null>(null);

  const canAccessBot = (bot: Bot) => {
    if (!user) return false;
    if (bot.tier === 'Free') return true;
    if (bot.tier === '$29+' && ['tier_29', 'tier_49', 'admin'].includes(user.tier)) return true;
    if (bot.tier === '$49+' && ['tier_49', 'admin'].includes(user.tier)) return true;
    if (bot.tier === 'Quest' && ['admin'].includes(user.tier)) return true;
    if (bot.tier === 'Course' && (user.courseAccess || ['admin'].includes(user.tier))) return true;
    return false;
  };

  const handleBotSelect = (bot: Bot) => {
    if (canAccessBot(bot)) {
      onBotChange(bot);
    } else {
      setShowUpgradeModal(bot);
    }
  };

  const handleUpgrade = () => {
    if (showUpgradeModal?.tier === 'Course') {
      // For course tier, redirect to access code page
      window.location.href = '/course-access';
    } else {
      // For other tiers, send upgrade email
      window.open('mailto:lightprompt.co@gmail.com?subject=Upgrade%20Request&body=Hi!%20I%27d%20like%20to%20upgrade%20to%20access%20premium%20wellness%20bots.', '_blank');
    }
    setShowUpgradeModal(null);
  };

  const handleGetUploadParameters = async () => {
    const response = await fetch('/api/objects/upload', { method: 'POST' });
    const data = await response.json();
    return {
      method: 'PUT' as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: any) => {
    if (result.successful?.length > 0 && user) {
      setUploadingAvatar(true);
      try {
        const uploadURL = result.successful[0].uploadURL;
        const response = await fetch(`/api/users/${user.id}/avatar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarURL: uploadURL }),
        });
        
        if (response.ok) {
          const { objectPath } = await response.json();
          onAvatarUpdate(objectPath);
        }
      } catch (error) {
        console.error('Failed to update avatar:', error);
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Bot Navigation */}
            <div className="flex items-center space-x-1">
              {BOTS.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => handleBotSelect(bot)}
                  className={`group relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 min-w-[70px] ${
                    activeBot.id === bot.id 
                      ? 'bg-teal-500 text-white shadow-lg scale-105' 
                      : canAccessBot(bot) 
                        ? 'hover:bg-teal-50 text-gray-600 hover:text-teal-600' 
                        : 'hover:bg-amber-50 text-gray-600 hover:text-amber-600 cursor-pointer'
                  }`}
                  title={bot.description}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                    activeBot.id === bot.id 
                      ? 'bg-white/20' 
                      : 'bg-transparent'
                  }`}>
                    <i className={`${bot.icon} text-lg`}></i>
                  </div>
                  
                  <span className="text-xs font-medium truncate max-w-[60px]">
                    {bot.name.replace('Bot', '')}
                  </span>
                  
                  {!canAccessBot(bot) && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs flex items-center justify-center font-bold shadow-lg border-2 border-white hover:scale-110 transition-transform">
                      <i className="fas fa-plus"></i>
                    </div>
                  )}
                  
                  {activeBot.id === bot.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-teal-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* User Profile & Controls */}
            <div className="flex items-center space-x-4">
              
              {/* Settings Button */}
              <Button
                onClick={() => setShowSettings(true)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 p-0"
                title="Settings"
              >
                <i className="fas fa-cog text-sm"></i>
              </Button>
              
              {/* Mood Indicator */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-50">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/80"></div>
                </div>
                <div className="text-xs">
                  <div className="font-medium text-gray-700">{userProfile?.currentMood || 'Calm'}</div>
                </div>
              </div>

              {/* User Avatar */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                        <i className="fas fa-user text-white text-sm"></i>
                      </div>
                    )}
                    
                    <ObjectUploader
                      maxNumberOfFiles={1}
                      maxFileSize={5242880} // 5MB
                      onGetUploadParameters={handleGetUploadParameters}
                      onComplete={handleUploadComplete}
                      buttonClassName="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-teal-500 hover:bg-teal-600 text-xs border-2 border-white"
                    >
                      <i className={`fas ${uploadingAvatar ? 'fa-spinner fa-spin' : 'fa-camera'} text-white text-xs`}></i>
                    </ObjectUploader>
                  </div>
                  
                  <div className="hidden sm:block text-right">
                    <div className="flex items-center space-x-1 justify-end mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <div className="text-xs font-medium text-gray-700">{user.name}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.tokensUsed}/{user.tokenLimit} daily • Session saved
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <UserSettings
          user={user}
          userProfile={userProfile}
          onClose={() => setShowSettings(false)}
          onLogout={onLogout}
        />
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="text-center">
              {/* Bot Icon */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <i className={`${showUpgradeModal.icon} text-white text-2xl`}></i>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{showUpgradeModal.name}</h3>
              <p className="text-gray-600 mb-4">{showUpgradeModal.tagline}</p>
              
              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">{showUpgradeModal.description}</p>
              </div>
              
              {/* Tier Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                  <i className="fas fa-crown mr-1"></i>
                  {showUpgradeModal.tier} Tier Required
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                >
                  {showUpgradeModal.tier === 'Course' ? (
                    <>
                      <i className="fas fa-unlock mr-2"></i>
                      Enter Access Code
                    </>
                  ) : (
                    <>
                      <i className="fas fa-rocket mr-2"></i>
                      Upgrade to Access
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpgradeModal(null)}
                  className="w-full"
                >
                  Maybe Later
                </Button>
              </div>
              
              {/* Footer */}
              <p className="text-xs text-gray-500 mt-4">
                {showUpgradeModal.tier === 'Course' 
                  ? 'Access this bot with your LightPrompt:Ed course purchase'
                  : 'Unlock advanced wellness features with a premium subscription'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}