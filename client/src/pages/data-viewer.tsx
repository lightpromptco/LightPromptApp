import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Search, 
  Filter,
  Download,
  RotateCcw,
  Eye,
  EyeOff,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TableData {
  name: string;
  count: number;
  columns: string[];
  sampleData: any[];
}

export default function DataViewer() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDatabaseSchema();
  }, []);

  const fetchDatabaseSchema = async () => {
    try {
      setIsLoading(true);
      // Mock data - in production, this would fetch from your actual database
      const mockTables: TableData[] = [
        {
          name: 'users',
          count: 1247,
          columns: ['id', 'email', 'username', 'created_at', 'is_admin', 'subscription_tier'],
          sampleData: [
            { id: '1', email: 'user@example.com', username: 'cosmic_user', created_at: '2024-01-15T10:30:00Z', is_admin: false, subscription_tier: 'free' },
            { id: '2', email: 'premium@example.com', username: 'soul_seeker', created_at: '2024-01-16T14:20:00Z', is_admin: false, subscription_tier: 'premium' },
            { id: '3', email: 'admin@lightprompt.co', username: 'cosmic_admin', created_at: '2024-01-10T09:00:00Z', is_admin: true, subscription_tier: 'admin' }
          ]
        },
        {
          name: 'chat_sessions',
          count: 5832,
          columns: ['id', 'user_id', 'bot_type', 'created_at', 'message_count', 'last_activity'],
          sampleData: [
            { id: '1', user_id: '1', bot_type: 'lightpromptbot', created_at: '2024-02-01T12:00:00Z', message_count: 25, last_activity: '2024-02-01T15:30:00Z' },
            { id: '2', user_id: '1', bot_type: 'soulmapexplorer', created_at: '2024-02-02T09:15:00Z', message_count: 12, last_activity: '2024-02-02T10:45:00Z' },
            { id: '3', user_id: '2', bot_type: 'lightpromptbot', created_at: '2024-02-03T16:20:00Z', message_count: 8, last_activity: '2024-02-03T17:00:00Z' }
          ]
        },
        {
          name: 'messages',
          count: 28947,
          columns: ['id', 'session_id', 'role', 'content', 'tokens', 'created_at', 'sentiment_score'],
          sampleData: [
            { id: '1', session_id: '1', role: 'user', content: 'What does my Aquarius sun mean?', tokens: 8, created_at: '2024-02-01T12:05:00Z', sentiment_score: 0.7 },
            { id: '2', session_id: '1', role: 'assistant', content: 'Your Aquarius sun represents innovation and humanitarian spirit...', tokens: 45, created_at: '2024-02-01T12:05:15Z', sentiment_score: 0.9 },
            { id: '3', session_id: '2', role: 'user', content: 'Show me my birth chart', tokens: 6, created_at: '2024-02-02T09:20:00Z', sentiment_score: 0.8 }
          ]
        },
        {
          name: 'birth_charts',
          count: 892,
          columns: ['id', 'user_id', 'birth_date', 'birth_time', 'location', 'chart_data', 'created_at'],
          sampleData: [
            { id: '1', user_id: '1', birth_date: '1992-02-17', birth_time: '12:00:00', location: 'Temple, TX, USA', chart_data: '[Chart Data JSON]', created_at: '2024-01-20T11:00:00Z' },
            { id: '2', user_id: '2', birth_date: '1985-08-23', birth_time: '18:30:00', location: 'Los Angeles, CA, USA', chart_data: '[Chart Data JSON]', created_at: '2024-01-25T16:45:00Z' }
          ]
        },
        {
          name: 'vibe_match_scores',
          count: 1156,
          columns: ['id', 'user_id', 'score', 'factors', 'calculated_at', 'chart_version'],
          sampleData: [
            { id: '1', user_id: '1', score: 78, factors: '{"sun_mars": 0.85, "moon_venus": 0.72}', calculated_at: '2024-02-01T14:00:00Z', chart_version: '1.2' },
            { id: '2', user_id: '2', score: 84, factors: '{"sun_mars": 0.91, "moon_venus": 0.68}', calculated_at: '2024-02-02T10:30:00Z', chart_version: '1.2' }
          ]
        },
        {
          name: 'api_usage',
          count: 45623,
          columns: ['id', 'user_id', 'endpoint', 'method', 'status_code', 'response_time', 'created_at'],
          sampleData: [
            { id: '1', user_id: '1', endpoint: '/api/astrology/chart', method: 'POST', status_code: 200, response_time: 245, created_at: '2024-02-03T10:15:00Z' },
            { id: '2', user_id: '2', endpoint: '/api/chat/completions', method: 'POST', status_code: 200, response_time: 1532, created_at: '2024-02-03T10:16:00Z' },
            { id: '3', user_id: '1', endpoint: '/api/users/profile', method: 'GET', status_code: 200, response_time: 87, created_at: '2024-02-03T10:17:00Z' }
          ]
        }
      ];
      
      setTables(mockTables);
      setSelectedTable(mockTables[0]);
    } catch (error) {
      console.error('Error fetching database schema:', error);
      toast({
        title: "Error",
        description: "Failed to load database schema",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportTableData = (table: TableData) => {
    const csvContent = [
      table.columns.join(','),
      ...table.sampleData.map(row => 
        table.columns.map(col => JSON.stringify(row[col] || '')).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${table.name}.csv`;
    a.click();
    
    toast({
      title: "Export Successful",
      description: `${table.name} data exported as CSV`,
    });
  };

  const getTableIcon = (tableName: string) => {
    switch (tableName) {
      case 'users': return <Users className="w-4 h-4" />;
      case 'chat_sessions': 
      case 'messages': return <MessageSquare className="w-4 h-4" />;
      case 'birth_charts': 
      case 'vibe_match_scores': return <BarChart3 className="w-4 h-4" />;
      case 'api_usage': return <Database className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const maskSensitiveData = (value: any, column: string): string => {
    if (!showSensitiveData) {
      const sensitiveColumns = ['email', 'content', 'chart_data'];
      if (sensitiveColumns.some(col => column.toLowerCase().includes(col))) {
        if (typeof value === 'string') {
          if (column.toLowerCase().includes('email')) {
            return value.replace(/(.{2}).*(@.*)/, '$1***$2');
          }
          return value.length > 20 ? `${value.substring(0, 20)}...` : value;
        }
      }
    }
    return typeof value === 'object' ? JSON.stringify(value) : String(value || '');
  };

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.columns.some(col => col.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Database className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold">Database Viewer</h1>
              <p className="text-gray-600 dark:text-gray-400">Explore your data structure and content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSensitiveData(!showSensitiveData)}
            >
              {showSensitiveData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showSensitiveData ? 'Hide' : 'Show'} Sensitive Data
            </Button>
            <Button onClick={fetchDatabaseSchema} disabled={isLoading}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Tables List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tables</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {filteredTables.map((table) => (
                  <Button
                    key={table.name}
                    variant={selectedTable?.name === table.name ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedTable(table)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {getTableIcon(table.name)}
                      <div className="text-left flex-1">
                        <div className="font-medium">{table.name}</div>
                        <div className="text-xs text-gray-500">{table.count.toLocaleString()} rows</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Table Stats */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Database Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Tables:</span>
                    <Badge>{tables.length}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Records:</span>
                    <Badge>{tables.reduce((acc, table) => acc + table.count, 0).toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Largest Table:</span>
                    <Badge>{tables.reduce((prev, current) => prev.count > current.count ? prev : current, tables[0])?.name || 'N/A'}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table Content */}
          <div className="lg:col-span-3">
            {selectedTable ? (
              <Tabs defaultValue="data" className="space-y-4">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="data">Data</TabsTrigger>
                    <TabsTrigger value="schema">Schema</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>
                  <Button
                    variant="outline"
                    onClick={() => exportTableData(selectedTable)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                <TabsContent value="data">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {getTableIcon(selectedTable.name)}
                        {selectedTable.name}
                        <Badge className="ml-auto">{selectedTable.count.toLocaleString()} rows</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b bg-gray-50 dark:bg-gray-800">
                              {selectedTable.columns.map((column) => (
                                <th key={column} className="text-left p-3 font-medium">
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedTable.sampleData.map((row, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                {selectedTable.columns.map((column) => (
                                  <td key={column} className="p-3 text-sm font-mono">
                                    {maskSensitiveData(row[column], column)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-4 text-sm text-gray-500">
                        Showing first {selectedTable.sampleData.length} rows of {selectedTable.count.toLocaleString()} total records.
                        {!showSensitiveData && (
                          <span className="ml-2">
                            Sensitive data is masked. Click "Show Sensitive Data" to reveal.
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schema">
                  <Card>
                    <CardHeader>
                      <CardTitle>Table Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Table Info</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Name:</span>
                                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {selectedTable.name}
                                </code>
                              </div>
                              <div className="flex justify-between">
                                <span>Columns:</span>
                                <Badge>{selectedTable.columns.length}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Estimated Size:</span>
                                <Badge>{(selectedTable.count * selectedTable.columns.length * 50 / 1024 / 1024).toFixed(2)} MB</Badge>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Growth Stats</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Records/Day:</span>
                                <Badge>~{Math.floor(selectedTable.count / 30)}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Data Type:</span>
                                <Badge>
                                  {selectedTable.name.includes('user') ? 'User Data' :
                                   selectedTable.name.includes('message') ? 'Content' :
                                   selectedTable.name.includes('api') ? 'Analytics' : 'System'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Columns</h4>
                          <div className="grid gap-2">
                            {selectedTable.columns.map((column) => (
                              <div key={column} className="flex items-center justify-between p-3 border rounded">
                                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {column}
                                </code>
                                <div className="flex items-center gap-2">
                                  <Badge className={
                                    column.includes('id') ? 'bg-blue-100 text-blue-800' :
                                    column.includes('created_at') || column.includes('date') ? 'bg-green-100 text-green-800' :
                                    column.includes('email') || column.includes('content') ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }>
                                    {column.includes('id') ? 'ID' :
                                     column.includes('created_at') || column.includes('date') ? 'TIMESTAMP' :
                                     column.includes('email') ? 'EMAIL' :
                                     column.includes('content') ? 'TEXT' :
                                     column.includes('count') || column.includes('score') ? 'NUMBER' : 'STRING'}
                                  </Badge>
                                  {['email', 'content', 'chart_data'].some(sensitive => column.toLowerCase().includes(sensitive)) && (
                                    <Badge className="bg-orange-100 text-orange-800">
                                      SENSITIVE
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedTable.columns.slice(0, 5).map((column) => (
                            <div key={column}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{column}</span>
                                <span>{Math.floor(Math.random() * 100)}% filled</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full" 
                                  style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Table Relationships</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedTable.columns
                            .filter(col => col.includes('_id') || col === 'id')
                            .map((column) => (
                              <div key={column} className="flex items-center gap-3 p-2 border rounded">
                                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                                  {column}
                                </code>
                                <span className="text-sm text-gray-600">
                                  {column === 'id' ? 'Primary Key' :
                                   column === 'user_id' ? '→ users.id' :
                                   column === 'session_id' ? '→ chat_sessions.id' :
                                   'Foreign Key'}
                                </span>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Database className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Table</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Choose a table from the sidebar to view its structure and data
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}