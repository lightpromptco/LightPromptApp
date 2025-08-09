import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  User, 
  Code, 
  Eye, 
  EyeOff,
  Save,
  RefreshCw,
  Database,
  Palette,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AdminSettings {
  developerMode: boolean;
  adminAccess: boolean;
  contentEditing: boolean;
  databaseAccess: boolean;
  apiAccess: boolean;
  userManagement: boolean;
}

export default function AdminSettingsPage() {
  const [showApiKeys, setShowApiKeys] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user (lightprompt.co@gmail.com)
  const { data: user } = useQuery({
    queryKey: ['/api/users/email/lightprompt.co@gmail.com'],
  });

  // Get current admin settings
  const { data: adminSettings } = useQuery({
    queryKey: ['/api/admin/settings', user?.id],
    enabled: !!user?.id,
  });

  // Update admin settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<AdminSettings>) => {
      return apiRequest("PUT", "/api/admin/settings", {
        userId: user?.id,
        settings
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: "Settings Updated",
        description: "Your admin settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed", 
        description: "Unable to save settings. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSettingChange = (setting: keyof AdminSettings, value: boolean) => {
    updateSettingsMutation.mutate({ [setting]: value });
  };

  const toggleDeveloperMode = () => {
    const newMode = !adminSettings?.developerMode;
    handleSettingChange('developerMode', newMode);
    
    if (newMode) {
      toast({
        title: "Developer Mode Enabled",
        description: "You now have full editing access to the platform.",
      });
    } else {
      toast({
        title: "Developer Mode Disabled", 
        description: "Editing capabilities have been restricted.",
      });
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Loading user settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure your administrative access and developer tools
        </p>
      </div>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">User ID</Label>
              <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant="outline" className="ml-2">Admin User</Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Access Level</Label>
              <Badge variant={adminSettings?.developerMode ? "default" : "secondary"} className="ml-2">
                {adminSettings?.developerMode ? "Developer" : "Standard"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Developer Mode Toggle */}
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-orange-500" />
            Developer Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Enable Developer Access</Label>
                <p className="text-sm text-muted-foreground">
                  Unlock full platform editing capabilities similar to Wix.com - content management, 
                  page editing, styling, and component modification.
                </p>
              </div>
              <Switch
                checked={adminSettings?.developerMode || false}
                onCheckedChange={toggleDeveloperMode}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            
            {adminSettings?.developerMode && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                  Developer Features Enabled
                </h4>
                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                  <li>• Visual content editor for all pages</li>
                  <li>• Component drag-and-drop interface</li>
                  <li>• CSS styling and theme customization</li>
                  <li>• Database schema management</li>
                  <li>• API endpoint configuration</li>
                  <li>• User management and permissions</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Advanced Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Content Editing</Label>
                <p className="text-sm text-muted-foreground">Edit pages, images, and text content</p>
              </div>
              <Switch
                checked={adminSettings?.contentEditing || false}
                onCheckedChange={(value) => handleSettingChange('contentEditing', value)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Database Access</Label>
                <p className="text-sm text-muted-foreground">Direct database queries and management</p>
              </div>
              <Switch
                checked={adminSettings?.databaseAccess || false}
                onCheckedChange={(value) => handleSettingChange('databaseAccess', value)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">API Access</Label>
                <p className="text-sm text-muted-foreground">Configure API endpoints and integrations</p>
              </div>
              <Switch
                checked={adminSettings?.apiAccess || false}
                onCheckedChange={(value) => handleSettingChange('apiAccess', value)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">User Management</Label>
                <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
              </div>
              <Switch
                checked={adminSettings?.userManagement || false}
                onCheckedChange={(value) => handleSettingChange('userManagement', value)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys & Secrets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            API Keys & Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Show API Keys</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeys(!showApiKeys)}
              >
                {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showApiKeys ? 'Hide' : 'Show'}
              </Button>
            </div>

            {showApiKeys && (
              <div className="grid gap-4">
                <div>
                  <Label className="text-sm font-medium">OpenAI API Key</Label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    className="font-mono text-xs"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Stripe Secret Key</Label>
                  <Input
                    type="password"
                    placeholder="sk_..."
                    className="font-mono text-xs"
                    readOnly
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Google Maps API Key</Label>
                  <Input
                    type="password"
                    placeholder="AIza..."
                    className="font-mono text-xs"
                    readOnly
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={() => queryClient.invalidateQueries()}
          variant="outline"
          disabled={updateSettingsMutation.isPending}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Settings
        </Button>
        
        {adminSettings?.developerMode && (
          <Button 
            onClick={() => window.location.href = '/admin/content'}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Palette className="h-4 w-4 mr-2" />
            Open Content Editor
          </Button>
        )}
      </div>
    </div>
  );
}