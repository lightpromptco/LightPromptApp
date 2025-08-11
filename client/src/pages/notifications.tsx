import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, MessageCircle, Calendar, Moon, Sun, Smartphone } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Notifications & Preferences
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Stay connected with your journey while maintaining the peace of mind you seek
        </p>
      </div>

      {/* Notification Channels */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-teal-600" />
            Notification Channels
          </CardTitle>
          <CardDescription>
            Choose how you'd like to receive updates from LightPrompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instant notifications on your device
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Email Updates</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Weekly insights and platform updates
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* In-App Messages */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">In-App Messages</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Messages from AI companions and system alerts
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Content Preferences */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Content Preferences</CardTitle>
          <CardDescription>
            Customize what types of insights and updates you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Astrological Insights */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Astrological Insights</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Daily cosmic guidance and planetary updates
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* VibeMatch Updates */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">VibeMatch Career Insights</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Professional alignment opportunities and career guidance
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Soul Sync Connections */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Soul Sync Updates</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New connections and shared wellness insights
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          {/* Course Content */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Course & Learning Updates</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New modules, progress reminders, and learning milestones
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Product Updates */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Platform Updates</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New features, improvements, and LightPrompt news
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Timing & Frequency */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Timing & Frequency
          </CardTitle>
          <CardDescription>
            Set when and how often you'd like to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Frequency */}
          <div>
            <label className="font-medium mb-2 block">Daily Insights Frequency</label>
            <Select defaultValue="daily">
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (as they happen)</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Quiet Hours */}
          <div>
            <label className="font-medium mb-3 block">Quiet Hours</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Start Time</label>
                <Select defaultValue="22:00">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                    <SelectItem value="22:00">10:00 PM</SelectItem>
                    <SelectItem value="23:00">11:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">End Time</label>
                <Select defaultValue="07:00">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">6:00 AM</SelectItem>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timezone */}
          <div>
            <label className="font-medium mb-2 block">Time Zone</label>
            <Select defaultValue="auto">
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="cst">Central Time</SelectItem>
                <SelectItem value="mst">Mountain Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Smart Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Notifications</CardTitle>
          <CardDescription>
            Intelligent features that adapt to your patterns and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Circadian Timing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="font-medium">Circadian-Aware Timing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimize notification timing based on your natural rhythms
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Activity-Based */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">Activity-Based Insights</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive insights when you're most active on the platform
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Mood-Sensitive */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mood-Sensitive Delivery</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Adjust notification tone based on your recent interactions
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}