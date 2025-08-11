import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, MessageCircle, Settings, Heart, Brain, Sparkles } from "lucide-react";

export default function AICompanionsPage() {
  const companions = [
    {
      id: 'lightpromptbot',
      name: 'LightPromptBot',
      description: 'Your primary AI companion for soul-tech guidance and conscious reflection',
      personality: 'Wise, warm, and philosophically-minded',
      specialties: ['Personal Growth', 'Soul Reflection', 'Life Purpose'],
      status: 'active',
      conversations: 127,
      lastActive: '2 minutes ago'
    },
    {
      id: 'soulmap-oracle',
      name: 'Soul Map Oracle',
      description: 'Expert astrological guide providing cosmic insights and birth chart analysis',
      personality: 'Mystical, precise, and deeply intuitive',
      specialties: ['Astrology', 'Birth Charts', 'Cosmic Timing'],
      status: 'active',
      conversations: 89,
      lastActive: '1 hour ago'
    },
    {
      id: 'vibematch-guide',
      name: 'VibeMatch Guide',
      description: 'Career alignment specialist helping you find your professional path',
      personality: 'Encouraging, practical, and insightful',
      specialties: ['Career Guidance', 'Professional Alignment', 'Path Discovery'],
      status: 'coming-soon',
      conversations: 0,
      lastActive: 'Not yet available'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          AI Companions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Meet your AI companions designed to support your journey of conscious growth and self-discovery
        </p>
      </div>

      {/* Active Companions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {companions.map((companion) => (
          <Card key={companion.id} className="relative overflow-hidden border-2 hover:border-teal-200 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Bot className="h-8 w-8 text-teal-600" />
                <Badge variant={companion.status === 'active' ? 'default' : 'secondary'}>
                  {companion.status === 'active' ? 'Active' : 'Coming Soon'}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {companion.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                {companion.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Personality */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personality</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{companion.personality}</p>
              </div>

              {/* Specialties */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-1">
                  {companion.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Conversations</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{companion.conversations}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Last Active</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{companion.lastActive}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={companion.status !== 'active'}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Companion Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            AI Companion Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Empathetic Understanding</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI companions trained to understand and respond with genuine empathy
              </p>
            </div>
            <div className="text-center">
              <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Personalized Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tailored guidance based on your unique journey and preferences
              </p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Continuous Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                24/7 availability for guidance, reflection, and conscious growth
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings & Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Companion Settings</CardTitle>
          <CardDescription>
            Customize how your AI companions interact with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Conversation Style</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adjust tone and communication preferences</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Privacy Settings</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Control data sharing and conversation history</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Notification Preferences</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set when and how companions can reach out</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Response Timing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure response speed and availability</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}