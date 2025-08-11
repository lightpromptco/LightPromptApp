import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Code2, 
  Play, 
  Copy, 
  Download,
  Settings,
  Zap,
  Database,
  Globe,
  Terminal,
  FileJson,
  Key,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responseSchema?: any;
  example?: any;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    path: '/api/astrology/chart',
    method: 'POST',
    description: 'Calculate complete birth chart with planets, houses, and aspects',
    parameters: [
      { name: 'date', type: 'string', required: true, description: 'Birth date (YYYY-MM-DD)' },
      { name: 'time', type: 'string', required: false, description: 'Birth time (HH:MM)' },
      { name: 'location', type: 'string', required: true, description: 'Birth location' },
      { name: 'lat', type: 'number', required: true, description: 'Latitude coordinate' },
      { name: 'lng', type: 'number', required: true, description: 'Longitude coordinate' }
    ],
    example: {
      date: '1992-02-17',
      time: '12:00',
      location: 'Temple, TX, USA',
      lat: 31.0982,
      lng: -97.3428
    }
  },
  {
    path: '/api/astrology/transits',
    method: 'POST',
    description: 'Get current planetary transits for birth chart',
    parameters: [
      { name: 'birthData', type: 'object', required: true, description: 'Birth chart data' }
    ]
  },
  {
    path: '/api/astrology/vibe-match',
    method: 'POST',
    description: 'Calculate VibeMatch compatibility score',
    parameters: [
      { name: 'chartData', type: 'object', required: true, description: 'Birth chart data' },
      { name: 'currentTransits', type: 'object', required: false, description: 'Current planetary transits' }
    ]
  },
  {
    path: '/api/chat/completions',
    method: 'POST',
    description: 'AI chat completion with specialized astrological knowledge',
    parameters: [
      { name: 'messages', type: 'array', required: true, description: 'Chat message history' },
      { name: 'botType', type: 'string', required: false, description: 'AI bot personality' },
      { name: 'context', type: 'object', required: false, description: 'Additional context data' }
    ]
  },
  {
    path: '/api/users/profile',
    method: 'GET',
    description: 'Get user profile and birth chart data'
  },
  {
    path: '/api/users/profile',
    method: 'POST',
    description: 'Update user profile information',
    parameters: [
      { name: 'birthData', type: 'object', required: false, description: 'Birth information' },
      { name: 'preferences', type: 'object', required: false, description: 'User preferences' }
    ]
  }
];

export default function ApiExplorer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>('');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [headers, setHeaders] = useState<string>('{"Content-Type": "application/json"}');
  const { toast } = useToast();

  useEffect(() => {
    if (selectedEndpoint.example) {
      setRequestBody(JSON.stringify(selectedEndpoint.example, null, 2));
    } else {
      setRequestBody('{}');
    }
  }, [selectedEndpoint]);

  const executeRequest = async () => {
    try {
      setIsLoading(true);
      setResponse(null);

      const parsedHeaders = JSON.parse(headers);
      let body = undefined;

      if (selectedEndpoint.method !== 'GET') {
        body = requestBody;
      }

      const startTime = Date.now();
      const result = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
        headers: parsedHeaders,
        body: body
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const responseData = await result.json();
      
      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: Object.fromEntries(result.headers.entries()),
        data: responseData,
        responseTime,
        success: result.ok
      });

      if (result.ok) {
        toast({
          title: "Request Successful",
          description: `${selectedEndpoint.method} ${selectedEndpoint.path} - ${responseTime}ms`,
        });
      }
    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Network Error',
        error: error.message,
        success: false
      });
      
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const generateCurlCommand = () => {
    const parsedHeaders = JSON.parse(headers);
    let curl = `curl -X ${selectedEndpoint.method} "${window.location.origin}${selectedEndpoint.path}"`;
    
    Object.entries(parsedHeaders).forEach(([key, value]) => {
      curl += ` \\\n  -H "${key}: ${value}"`;
    });

    if (selectedEndpoint.method !== 'GET' && requestBody) {
      curl += ` \\\n  -d '${requestBody}'`;
    }

    return curl;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Code2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">LightPrompt API Explorer</h1>
              <p className="text-gray-600 dark:text-gray-400">Interactive API testing and documentation</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <Zap className="w-3 h-3 mr-1" />
            Live API
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Endpoint Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {API_ENDPOINTS.map((endpoint, index) => (
                  <Button
                    key={index}
                    variant={selectedEndpoint.path === endpoint.path ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedEndpoint(endpoint)}
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          className={`text-xs ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {endpoint.method}
                        </Badge>
                      </div>
                      <div className="font-mono text-sm">{endpoint.path}</div>
                      <div className="text-xs text-gray-500 mt-1">{endpoint.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard(generateCurlCommand())}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy as cURL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint, null, 2))}
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  Copy Schema
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const doc = {
                      endpoint: selectedEndpoint,
                      curl: generateCurlCommand(),
                      example: requestBody
                    };
                    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedEndpoint.path.replace(/\//g, '_')}.json`;
                    a.click();
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Request/Response */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="request" className="space-y-4">
              <TabsList>
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
              </TabsList>

              <TabsContent value="request" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Terminal className="w-5 h-5" />
                        {selectedEndpoint.method} {selectedEndpoint.path}
                      </CardTitle>
                      <Button onClick={executeRequest} disabled={isLoading}>
                        {isLoading ? (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        Execute
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Headers */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Headers</label>
                      <Textarea
                        value={headers}
                        onChange={(e) => setHeaders(e.target.value)}
                        className="font-mono text-sm"
                        rows={3}
                      />
                    </div>

                    {/* Request Body */}
                    {selectedEndpoint.method !== 'GET' && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Request Body</label>
                        <Textarea
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          className="font-mono text-sm"
                          rows={12}
                          placeholder="Enter JSON request body..."
                        />
                      </div>
                    )}

                    {/* cURL Preview */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">cURL Command</label>
                      <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                        {generateCurlCommand()}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="response" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileJson className="w-5 h-5" />
                      Response
                      {response && (
                        <div className="flex items-center gap-2 ml-auto">
                          <Badge className={response.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {response.status} {response.statusText}
                          </Badge>
                          {response.responseTime && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Clock className="w-3 h-3 mr-1" />
                              {response.responseTime}ms
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {response ? (
                      <div className="space-y-4">
                        {/* Response Headers */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Response Headers</label>
                          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                            {JSON.stringify(response.headers, null, 2)}
                          </pre>
                        </div>

                        {/* Response Body */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">Response Body</label>
                          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto max-h-96">
                            {JSON.stringify(response.data || response.error, null, 2)}
                          </pre>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(JSON.stringify(response.data || response.error, null, 2))}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Response
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'response.json';
                              a.click();
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Save Response
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FileJson className="w-12 h-12 mx-auto mb-4" />
                        <p>Execute a request to see the response</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="docs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedEndpoint.description}
                      </p>

                      {selectedEndpoint.parameters && (
                        <div>
                          <h3 className="font-semibold mb-2">Parameters</h3>
                          <div className="space-y-2">
                            {selectedEndpoint.parameters.map((param, index) => (
                              <div key={index} className="border rounded p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                    {param.name}
                                  </code>
                                  <Badge className={param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                                    {param.required ? 'required' : 'optional'}
                                  </Badge>
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {param.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {param.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedEndpoint.example && (
                        <div>
                          <h3 className="font-semibold mb-2">Example Request</h3>
                          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
                            {JSON.stringify(selectedEndpoint.example, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}