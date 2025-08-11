import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, Eye, Database, Download, Trash2, AlertCircle } from "lucide-react";

export default function DataPrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
          Data Privacy & Security
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your privacy is paramount. Control how your data is collected, used, and protected within LightPrompt.
        </p>
      </div>

      {/* Privacy Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Privacy-First Design
          </CardTitle>
          <CardDescription>
            LightPrompt is built with privacy as a fundamental principle, not an afterthought.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Lock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">End-to-End Encryption</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your conversations and personal data are encrypted at rest and in transit
              </p>
            </div>
            <div className="text-center">
              <Database className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Minimal Data Collection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We only collect what's necessary for your experience
              </p>
            </div>
            <div className="text-center">
              <Eye className="h-8 w-8 text-teal-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Full Transparency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete visibility into what data we collect and how it's used
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Data Controls</CardTitle>
          <CardDescription>
            Manage how your information is collected and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conversation Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Conversation History</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Save chat conversations for continuity and personalization
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Astrological Data */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Astrological Data Storage</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Store birth chart information for personalized insights
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Analytics & Usage */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Usage Analytics</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Anonymous usage data to improve the platform experience
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          {/* Marketing Communications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Communications</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive updates about new features and offerings
              </p>
            </div>
            <Switch />
          </div>

          <Separator />

          {/* Soul Sync Data Sharing */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Soul Sync Data Sharing</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Allow sharing of wellness metrics with connected users
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export, review, or delete your personal data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <Download className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Export My Data</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download all your personal information</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <Eye className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">View Data Profile</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">See what information we have stored</p>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <Lock className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Security Settings</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage passwords and authentication</p>
              </div>
            </Button>
            
            <Button variant="destructive" className="justify-start h-auto p-4">
              <Trash2 className="h-5 w-5 mr-3" />
              <div className="text-left">
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-gray-100">Permanently remove all your data</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance & Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Standards</CardTitle>
          <CardDescription>
            LightPrompt adheres to the highest privacy and security standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Badge variant="outline" className="mb-2">GDPR</Badge>
              <p className="text-xs text-gray-600 dark:text-gray-400">EU Compliance</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">CCPA</Badge>
              <p className="text-xs text-gray-600 dark:text-gray-400">California Privacy</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">SOC 2</Badge>
              <p className="text-xs text-gray-600 dark:text-gray-400">Security Standards</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">ISO 27001</Badge>
              <p className="text-xs text-gray-600 dark:text-gray-400">Information Security</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Your Rights</p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  You have the right to access, correct, delete, or port your data at any time. 
                  Contact us at privacy@lightprompt.co for any privacy-related requests.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}