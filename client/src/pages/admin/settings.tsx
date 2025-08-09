import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Code, 
  Database, 
  Palette, 
  Shield, 
  Globe,
  Zap,
  Eye,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [developerMode, setDeveloperMode] = useState(false);
  const [adminLevel, setAdminLevel] = useState<string>('admin');
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    previewMode: false,
    aiModelTemperature: 0.7,
    maxTokens: 1000,
    rateLimit: 100,
    analyticsEnabled: true,
    loggingLevel: 'info'
  });
  const { toast } = useToast();

  useEffect(() => {
    // Check admin mode and level from localStorage
    const isAdminMode = localStorage.getItem('lightprompt-admin-mode') === 'true';
    const level = localStorage.getItem('lightprompt-admin-level') || 'admin';
    setDeveloperMode(isAdminMode);
    setAdminLevel(level);
  }, []);

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

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('lightprompt-admin-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Admin settings have been updated successfully",
    });
  };

  const handleToggleDeveloperMode = () => {
    setDeveloperMode(!developerMode);
    localStorage.setItem('lightprompt-developer-mode', (!developerMode).toString());
    toast({
      title: developerMode ? "Developer Mode Disabled" : "Developer Mode Enabled",
      description: developerMode 
        ? "Live editing capabilities disabled" 
        : "Live editing capabilities enabled - you can now edit content directly on preview",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Settings</h1>
            <p className="text-muted-foreground">Configure platform settings and developer tools</p>
          </div>
          <div className="flex items-center space-x-3">
            {getAdminBadge()}
            <Button onClick={() => window.close()} variant="outline">
              Close
            </Button>
          </div>
        </div>

        {/* Developer Mode Toggle */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Developer Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Live Content Editing</h4>
                <p className="text-sm text-muted-foreground">
                  Enable Wix.com-style editing - click on text and elements to edit them directly on the preview
                </p>
              </div>
              <Switch 
                checked={developerMode} 
                onCheckedChange={handleToggleDeveloperMode}
              />
            </div>
            {developerMode && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Developer Mode Active
                  </span>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                  You can now click directly on text and elements in the preview to edit them
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Maintenance Mode</h4>
                <p className="text-sm text-muted-foreground">Put the platform in maintenance mode</p>
              </div>
              <Switch 
                checked={settings.maintenanceMode} 
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Debug Mode</h4>
                <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
              </div>
              <Switch 
                checked={settings.debugMode} 
                onCheckedChange={(checked) => setSettings({...settings, debugMode: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Preview Mode</h4>
                <p className="text-sm text-muted-foreground">Show preview features to all users</p>
              </div>
              <Switch 
                checked={settings.previewMode} 
                onCheckedChange={(checked) => setSettings({...settings, previewMode: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              AI Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">AI Model Temperature</label>
              <Input 
                type="number" 
                min="0" 
                max="2" 
                step="0.1"
                value={settings.aiModelTemperature}
                onChange={(e) => setSettings({...settings, aiModelTemperature: parseFloat(e.target.value)})}
              />
              <p className="text-xs text-muted-foreground mt-1">Controls creativity (0 = precise, 2 = creative)</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Max Tokens</label>
              <Input 
                type="number" 
                value={settings.maxTokens}
                onChange={(e) => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
              />
              <p className="text-xs text-muted-foreground mt-1">Maximum response length</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.open('/admin/content', '_blank')}
                className="flex items-center justify-center"
              >
                <Palette className="h-4 w-4 mr-2" />
                Content Editor
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.open('/', '_blank')}
                className="flex items-center justify-center"
              >
                <Globe className="h-4 w-4 mr-2" />
                View Site
              </Button>
              
              <Button 
                onClick={handleSaveSettings}
                className="flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          LightPrompt Admin Panel • v1.0.0 • {adminLevel.toUpperCase()} ACCESS
        </div>
      </div>
    </div>
  );
}