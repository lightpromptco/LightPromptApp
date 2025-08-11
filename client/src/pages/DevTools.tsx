import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, Code, Database, Activity, Settings, Zap } from "lucide-react";

export default function DevTools() {
  const [apiKey, setApiKey] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Discord-style sidebar with Apple aesthetics */}
      <div className="flex">
        <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Developer Console</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Build with soul-tech</p>
          </div>
          
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Terminal className="w-4 h-4" />
              API Explorer
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Code className="w-4 h-4" />
              Webhooks
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Database className="w-4 h-4" />
              Database
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Activity className="w-4 h-4" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </nav>

          {/* Apple-style status indicator */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Apple-style header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Developer Tools</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">Build integrations, monitor performance, and customize your LightPrompt experience</p>
            </div>

            {/* Discord-style feature cards with Apple design */}
            <Tabs defaultValue="api" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="api">API Keys</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>

              <TabsContent value="api" className="space-y-6">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      API Keys
                    </CardTitle>
                    <CardDescription>
                      Generate and manage API keys for LightPrompt integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">Current API Key</Label>
                      <div className="flex gap-2">
                        <Input
                          id="api-key"
                          type="password"
                          value="lp_sk_••••••••••••••••••••••••••••••••"
                          readOnly
                          className="font-mono"
                        />
                        <Button variant="outline">Copy</Button>
                        <Button variant="outline">Regenerate</Button>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Quick Start</h4>
                      <pre className="text-sm text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900/40 p-3 rounded overflow-x-auto">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.lightprompt.co/v1/chat/completions`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Usage Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">API Calls Today</span>
                          <Badge variant="secondary">1,247</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Rate Limit</span>
                          <Badge variant="outline">10,000/hour</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                          <Badge className="bg-green-500">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Permissions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Chat API</span>
                          <Badge className="bg-green-500">Enabled</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Astrology API</span>
                          <Badge className="bg-green-500">Enabled</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">User Data</span>
                          <Badge variant="secondary">Read Only</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Webhooks</span>
                          <Badge className="bg-green-500">Enabled</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="webhooks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Webhook Endpoints</CardTitle>
                    <CardDescription>
                      Receive real-time events from LightPrompt in your applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="webhook-url"
                          placeholder="https://your-app.com/webhooks/lightprompt"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                        />
                        <Button>Add Endpoint</Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">Chat Events</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">User Events</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Payment Events</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">System Events</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">API Requests</p>
                          <p className="text-2xl font-bold">12,847</p>
                        </div>
                        <Activity className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="text-xs text-green-600 mt-2">+12% from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
                          <p className="text-2xl font-bold">1,234</p>
                        </div>
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-xs text-green-600 mt-2">+8% from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
                          <p className="text-2xl font-bold">99.9%</p>
                        </div>
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Last 30 days</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "Slack", status: "Connected", color: "green" },
                    { name: "Discord", status: "Available", color: "blue" },
                    { name: "Notion", status: "Available", color: "gray" },
                    { name: "Zapier", status: "Connected", color: "green" },
                    { name: "GitHub", status: "Available", color: "gray" },
                    { name: "Apple Health", status: "Connected", color: "green" },
                  ].map((integration) => (
                    <Card key={integration.name} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{integration.name}</h3>
                          <Badge 
                            variant={integration.status === "Connected" ? "default" : "secondary"}
                            className={integration.status === "Connected" ? "bg-green-500" : ""}
                          >
                            {integration.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Connect your {integration.name} workspace to LightPrompt
                        </p>
                        <Button 
                          variant={integration.status === "Connected" ? "outline" : "default"}
                          className="w-full"
                        >
                          {integration.status === "Connected" ? "Configure" : "Connect"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}