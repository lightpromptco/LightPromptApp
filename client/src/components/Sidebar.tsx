import { useState } from 'react';
import { User, UserProfile } from '@shared/schema';
import { BOTS, Bot } from '@/lib/bots';
import { ObjectUploader } from '@/components/ObjectUploader';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  user: User | null;
  userProfile: UserProfile | null;
  activeBot: Bot;
  onBotChange: (bot: Bot) => void;
  onAvatarUpdate: (url: string) => void;
}

export function Sidebar({ 
  user, 
  userProfile, 
  activeBot, 
  onBotChange,
  onAvatarUpdate 
}: SidebarProps) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
    <div className="w-80 min-h-screen p-6 floating-ui border-r border-white/20">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 rounded-xl bot-gradient flex items-center justify-center">
          <i className="fas fa-lightbulb text-white text-lg"></i>
        </div>
        <div>
          <h1 className="text-white text-xl font-semibold">LightPrompt</h1>
          <p className="text-white/70 text-sm">Soul-Tech Wellness</p>
        </div>
      </div>

      {/* Bot Selector */}
      <div className="space-y-3 mb-8">
        <h2 className="text-white/80 text-sm font-medium uppercase tracking-wider">AI Companions</h2>
        
        {BOTS.map((bot) => (
          <div
            key={bot.id}
            className={`group cursor-pointer p-4 rounded-2xl transition-all duration-300 border border-white/10 ${
              activeBot.id === bot.id 
                ? 'bg-white/20' 
                : bot.available 
                  ? 'bg-white/10 hover:bg-white/20' 
                  : 'bg-white/5 opacity-60 cursor-not-allowed'
            }`}
            onClick={() => handleBotSelect(bot)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                bot.id === 'lightpromptbot' ? 'bot-gradient' : bot.gradient
              }`}>
                <i className={`${bot.icon} text-white text-lg`}></i>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{bot.name}</h3>
                <p className="text-white/60 text-sm">{bot.tagline}</p>
              </div>
              {bot.available ? (
                <div className={`w-2 h-2 rounded-full transition-transform duration-300 ${
                  activeBot.id === bot.id ? 'bg-soul-mint scale-150' : 'bg-soul-mint group-hover:scale-150'
                }`}></div>
              ) : (
                <div className="px-2 py-1 text-xs rounded-full" style={{
                  backgroundColor: bot.tier === '$29+' ? 'rgba(245, 158, 11, 0.2)' : 
                                  bot.tier === '$49+' ? 'rgba(168, 85, 247, 0.2)' : 
                                  'rgba(99, 102, 241, 0.2)',
                  color: bot.tier === '$29+' ? '#fbbf24' : 
                         bot.tier === '$49+' ? '#a855f7' : 
                         '#6366f1'
                }}>
                  {bot.tier}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mood Visualization */}
      <div className="mb-8">
        <h3 className="text-white/80 text-sm font-medium mb-4">Current Mood</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="mood-ring opacity-30"></div>
            <div className="absolute inset-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-sm font-medium">
                {userProfile?.currentMood || 'Calm'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-white/60 text-sm">
            {userProfile?.moodDescription || 'Feeling centered and peaceful'}
          </p>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt="User Avatar" 
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-soul-blue to-soul-purple flex items-center justify-center">
                  <i className="fas fa-user text-white text-lg"></i>
                </div>
              )}
              
              <ObjectUploader
                maxNumberOfFiles={1}
                maxFileSize={5242880} // 5MB
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="absolute -bottom-2 -right-2 w-6 h-6 rounded-lg bg-soul-blue hover:bg-soul-purple text-xs"
              >
                <i className={`fas ${uploadingAvatar ? 'fa-spinner fa-spin' : 'fa-camera'} text-white`}></i>
              </ObjectUploader>
            </div>
            
            <div className="flex-1">
              <h4 className="text-white font-medium">{user.name}</h4>
              <p className="text-white/60 text-sm">
                {user.tier === 'free' ? 'Free Plan' : `${user.tier} Plan`} • {user.tokensUsed}/{user.tokenLimit} daily
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white p-2"
            >
              <i className="fas fa-cog"></i>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
