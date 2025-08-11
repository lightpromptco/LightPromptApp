import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Hash,
  Crown,
  Star,
  Heart,
  Globe,
  Lock,
  Sparkles
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  role: 'member' | 'moderator' | 'admin';
  soulMapVisible: boolean;
}

interface CommunityChannel {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'soul-sync';
  description: string;
  memberCount: number;
  isPrivate: boolean;
}

export default function CommunityPage() {
  const [discordConnected, setDiscordConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<string>('general');
  const [isVoiceConnected, setIsVoiceConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Mock data - replace with real Discord integration
  const channels: CommunityChannel[] = [
    {
      id: 'general',
      name: 'general',
      type: 'text',
      description: 'General soul-tech discussions',
      memberCount: 247,
      isPrivate: false
    },
    {
      id: 'soul-map-sharing',
      name: 'soul-map-sharing',
      type: 'text',
      description: 'Share your astrological insights',
      memberCount: 156,
      isPrivate: false
    },
    {
      id: 'vision-quest',
      name: 'vision-quest',
      type: 'text',
      description: 'Support for your personal journey',
      memberCount: 89,
      isPrivate: false
    },
    {
      id: 'conscious-lounge',
      name: 'conscious-lounge',
      type: 'voice',
      description: 'Voice chat for deeper connections',
      memberCount: 12,
      isPrivate: false
    },
    {
      id: 'soul-sync-circle',
      name: 'soul-sync-circle',
      type: 'soul-sync',
      description: 'Private authentic sharing space',
      memberCount: 23,
      isPrivate: true
    }
  ];

  const members: CommunityMember[] = [
    {
      id: '1',
      name: 'Luna Starweaver',
      avatar: '🌙',
      status: 'online',
      role: 'moderator',
      soulMapVisible: true
    },
    {
      id: '2',
      name: 'Cosmic Sage',
      avatar: '⭐',
      status: 'online',
      role: 'member',
      soulMapVisible: true
    },
    {
      id: '3',
      name: 'River of Light',
      avatar: '🌊',
      status: 'away',
      role: 'member',
      soulMapVisible: false
    }
  ];

  const connectDiscord = async () => {
    // Discord OAuth flow
    const discordClientId = 'YOUR_DISCORD_CLIENT_ID';
    const redirectUri = encodeURIComponent(`${window.location.origin}/community/discord-callback`);
    const scope = encodeURIComponent('identify guilds');
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${discordClientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    window.location.href = discordAuthUrl;
  };

  const getChannelIcon = (channel: CommunityChannel) => {
    switch (channel.type) {
      case 'voice':
        return <Mic className="w-4 h-4" />;
      case 'soul-sync':
        return <Heart className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            LightPrompt Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Connect with fellow consciousness explorers in authentic, vulnerable spaces
          </p>
        </div>

        {!discordConnected ? (
          /* Discord Connection */
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <CardTitle>Connect with Discord</CardTitle>
                <CardDescription>
                  Join our soul-tech community powered by Discord for real-time conversations and connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={connectDiscord}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  size="lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Connect Discord Account
                </Button>
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>Safe • Private • Soul-tech focused community</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Community Interface */
          <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
            {/* Channels Sidebar */}
            <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-teal-500" />
                  Soul-Tech Channels
                </h3>
              </div>
              
              <div className="p-2 space-y-1">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setCurrentChannel(channel.id)}
                    className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                      currentChannel === channel.id
                        ? 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {getChannelIcon(channel)}
                    <span className="text-sm">{channel.name}</span>
                    {channel.isPrivate && <Lock className="w-3 h-3 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="col-span-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
              {/* Channel Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getChannelIcon(channels.find(c => c.id === currentChannel)!)}
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {channels.find(c => c.id === currentChannel)?.name}
                    </h2>
                    <Badge variant="secondary">
                      {channels.find(c => c.id === currentChannel)?.memberCount} members
                    </Badge>
                  </div>
                  
                  {channels.find(c => c.id === currentChannel)?.type === 'voice' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isMuted ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant={isVoiceConnected ? "destructive" : "default"}
                        size="sm"
                        onClick={() => setIsVoiceConnected(!isVoiceConnected)}
                      >
                        {isVoiceConnected ? 'Disconnect' : 'Join Voice'}
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {channels.find(c => c.id === currentChannel)?.description}
                </p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                      🌙
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">Luna Starweaver</span>
                        <Badge className="bg-purple-100 text-purple-700">Moderator</Badge>
                        <span className="text-xs text-gray-500">Today at 2:30 PM</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        Welcome to our conscious community! 🌟 This is a space for authentic sharing and soul-level connections.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      ⭐
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">Cosmic Sage</span>
                        <span className="text-xs text-gray-500">Today at 2:45 PM</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        Just completed my Soul Map reading and I'm amazed! The career insights were spot on 🎯
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Message #${channels.find(c => c.id === currentChannel)?.name}`}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <Button>Send</Button>
                </div>
              </div>
            </div>

            {/* Members Sidebar */}
            <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Online Members ({members.filter(m => m.status === 'online').length})
                </h3>
              </div>
              
              <div className="p-2 space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white dark:border-gray-800`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.name}
                        </span>
                        {member.role === 'moderator' && <Crown className="w-3 h-3 text-purple-500" />}
                        {member.role === 'admin' && <Crown className="w-3 h-3 text-yellow-500" />}
                      </div>
                      {member.soulMapVisible && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-teal-500" />
                          <span className="text-xs text-teal-600 dark:text-teal-400">Soul Map visible</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}