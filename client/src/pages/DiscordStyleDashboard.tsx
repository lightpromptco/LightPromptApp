import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Hash, 
  Users, 
  Settings, 
  Mic, 
  Headphones, 
  Phone, 
  UserPlus,
  MoreHorizontal,
  Bell,
  Search,
  Crown,
  Zap,
  Brain,
  Heart,
  Sparkles
} from "lucide-react";

export default function DiscordStyleDashboard() {
  const [selectedChannel, setSelectedChannel] = useState("soul-sync");

  const channels = [
    { id: "soul-sync", name: "soul-sync", type: "text", members: 847 },
    { id: "vibe-match", name: "vibe-match", type: "text", members: 632 },
    { id: "astro-insights", name: "astro-insights", type: "text", members: 1205 },
    { id: "dev-tools", name: "dev-tools", type: "text", members: 156 },
    { id: "wellness-circle", name: "wellness-circle", type: "voice", members: 23 },
    { id: "meditation-room", name: "meditation-room", type: "voice", members: 8 },
  ];

  const onlineUsers = [
    { id: 1, name: "CosmicSoul", avatar: "/api/placeholder/32/32", status: "online", activity: "Exploring birth chart" },
    { id: 2, name: "MindfulDev", avatar: "/api/placeholder/32/32", status: "dnd", activity: "Building integrations" },
    { id: 3, name: "StarGazer", avatar: "/api/placeholder/32/32", status: "idle", activity: "Reading Tarot" },
    { id: 4, name: "TechMystic", avatar: "/api/placeholder/32/32", status: "online", activity: "Voice channel" },
  ];

  const messages = [
    { id: 1, user: "CosmicSoul", time: "Today at 2:15 PM", content: "Just discovered my North Node is in Gemini - makes so much sense for my career path! 🌟", avatar: "/api/placeholder/32/32" },
    { id: 2, user: "MindfulDev", time: "Today at 2:10 PM", content: "The new API endpoints are live! Check out the webhook integration docs.", avatar: "/api/placeholder/32/32" },
    { id: 3, user: "StarGazer", time: "Today at 2:05 PM", content: "Mercury retrograde hitting different when you track it with LightPrompt's transit alerts", avatar: "/api/placeholder/32/32" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Server Sidebar (Apple-style minimal) */}
      <div className="w-18 bg-gray-950 flex flex-col items-center py-3 space-y-2">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-2">
          <Sparkles className="w-6 h-6" />
        </div>
        <Separator className="w-8 bg-gray-700" />
        <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-2xl flex items-center justify-center cursor-pointer transition-colors">
          <Brain className="w-6 h-6" />
        </div>
        <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-2xl flex items-center justify-center cursor-pointer transition-colors">
          <Heart className="w-6 h-6" />
        </div>
        <div className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center cursor-pointer transition-colors">
          <UserPlus className="w-6 h-6" />
        </div>
      </div>

      {/* Channels Sidebar */}
      <div className="w-60 bg-gray-800 flex flex-col">
        {/* Server Header */}
        <div className="h-12 border-b border-gray-700 flex items-center justify-between px-4 hover:bg-gray-750 cursor-pointer">
          <h2 className="font-semibold">LightPrompt Community</h2>
          <MoreHorizontal className="w-4 h-4" />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {/* Text Channels */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <span>Text Channels</span>
                <UserPlus className="w-4 h-4 hover:text-white cursor-pointer" />
              </div>
              {channels.filter(c => c.type === "text").map((channel) => (
                <div
                  key={channel.id}
                  className={`flex items-center px-2 py-1 rounded cursor-pointer group ${
                    selectedChannel === channel.id ? "bg-gray-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  <Hash className="w-4 h-4 mr-2" />
                  <span className="flex-1 truncate">{channel.name}</span>
                  <Badge variant="secondary" className="bg-gray-600 text-xs">
                    {channel.members}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Voice Channels */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <span>Voice Channels</span>
              </div>
              {channels.filter(c => c.type === "voice").map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center px-2 py-1 rounded cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white group"
                >
                  <div className="w-4 h-4 mr-2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="flex-1 truncate">{channel.name}</span>
                  <Badge variant="secondary" className="bg-green-600 text-xs">
                    {channel.members}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* User Panel */}
        <div className="h-14 bg-gray-900 flex items-center px-2 space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/api/placeholder/32/32" />
            <AvatarFallback>LP</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">LightPrompt User</div>
            <div className="text-xs text-gray-400">#1234</div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-gray-700">
              <Mic className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-gray-700">
              <Headphones className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-gray-700">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-12 border-b border-gray-700 flex items-center justify-between px-4 bg-gray-800">
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-gray-400" />
            <span className="font-semibold">{selectedChannel}</span>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm text-gray-400">
              {channels.find(c => c.id === selectedChannel)?.name === "soul-sync" ? 
                "Connect with your soul tribe" : 
                "Channel description"
              }
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <Users className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search" 
                className="w-36 h-7 bg-gray-900 border-gray-600 pl-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex space-x-3 hover:bg-gray-800/50 p-2 rounded group">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>{message.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-medium text-white">{message.user}</span>
                    <span className="text-xs text-gray-400">{message.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm mt-1">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4">
          <div className="relative">
            <Input 
              placeholder={`Message #${selectedChannel}`}
              className="bg-gray-700 border-gray-600 text-white pr-12"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                <Zap className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      <div className="w-60 bg-gray-800">
        <div className="p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Online — {onlineUsers.length}
          </div>
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3 px-2 py-1 rounded hover:bg-gray-700 cursor-pointer group">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    user.status === "online" ? "bg-green-500" :
                    user.status === "idle" ? "bg-yellow-500" :
                    user.status === "dnd" ? "bg-red-500" : "bg-gray-500"
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-white truncate">{user.name}</span>
                    {user.name === "CosmicSoul" && <Crown className="w-3 h-3 text-yellow-500" />}
                  </div>
                  <div className="text-xs text-gray-400 truncate">{user.activity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}