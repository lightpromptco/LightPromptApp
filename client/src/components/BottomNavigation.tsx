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

  const handleBotSelect = (bot: Bot) => {
    if (bot.available) {
      onBotChange(bot);
    }
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
                  disabled={!bot.available}
                  className={`group relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 min-w-[70px] ${
                    activeBot.id === bot.id 
                      ? 'bg-teal-500 text-white shadow-lg scale-105' 
                      : bot.available 
                        ? 'hover:bg-teal-50 text-gray-600 hover:text-teal-600' 
                        : 'opacity-50 cursor-not-allowed text-gray-400'
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
                  
                  {!bot.available && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-white text-xs flex items-center justify-center font-bold">
                      {bot.tier === '$29+' ? '29' : bot.tier === '$49+' ? '49' : '✦'}
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
                    <div className="text-xs font-medium text-gray-700">{user.name}</div>
                    <div className="text-xs text-gray-500">
                      {user.tokensUsed}/{user.tokenLimit} daily
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
    </>
  );
}