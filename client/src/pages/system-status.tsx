import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Database,
  Globe,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Zap,
  Activity
} from 'lucide-react';

interface SystemCheck {
  name: string;
  status: 'online' | 'offline' | 'checking';
  description: string;
  lastChecked?: string;
  responseTime?: number;
  details?: any;
}

export default function SystemStatus() {
  const [checks, setChecks] = useState<SystemCheck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const runSystemChecks = async () => {
    setIsLoading(true);
    
    const systemChecks: SystemCheck[] = [
      {
        name: 'Frontend Application',
        status: 'checking',
        description: 'React application and Vite dev server'
      },
      {
        name: 'Backend API',
        status: 'checking', 
        description: 'Express server and API endpoints'
      },
      {
        name: 'Database Connection',
        status: 'checking',
        description: 'Supabase PostgreSQL connection'
      },
      {
        name: 'Environment Variables',
        status: 'checking',
        description: 'Required configuration and secrets'
      },
      {
        name: 'OpenAI API',
        status: 'checking',
        description: 'AI service integration'
      },
      {
        name: 'Google Maps API',
        status: 'checking',
        description: 'Location services for GeoPrompt'
      }
    ];

    setChecks(systemChecks);

    // Check each system component
    for (let i = 0; i < systemChecks.length; i++) {
      const check = systemChecks[i];
      const startTime = Date.now();
      
      try {
        let status: 'online' | 'offline' = 'offline';
        let details = {};
        
        switch (check.name) {
          case 'Frontend Application':
            // Frontend is running if we can execute this code
            status = 'online';
            details = {
              framework: 'React 18 + TypeScript',
              bundler: 'Vite',
              port: window.location.port || '80'
            };
            break;
            
          case 'Backend API':
            try {
              const response = await fetch('/api/health');
              status = response.ok ? 'online' : 'offline';
              if (response.ok) {
                details = await response.json();
              }
            } catch {
              status = 'offline';
            }
            break;
            
          case 'Database Connection':
            try {
              const response = await fetch('/api/db/health');
              status = response.ok ? 'online' : 'offline';
              if (response.ok) {
                details = await response.json();
              }
            } catch {
              status = 'offline';
            }
            break;
            
          case 'Environment Variables':
            try {
              const response = await fetch('/api/env/check');
              status = response.ok ? 'online' : 'offline';
              if (response.ok) {
                details = await response.json();
              }
            } catch {
              status = 'offline';
            }
            break;
            
          case 'OpenAI API':
            try {
              const response = await fetch('/api/ai/health');
              status = response.ok ? 'online' : 'offline';
              if (response.ok) {
                details = await response.json();
              }
            } catch {
              status = 'offline';
            }
            break;
            
          case 'Google Maps API':
            // Check if Google Maps is available
            status = (window as any).google && (window as any).google.maps ? 'online' : 'offline';
            if (status === 'online') {
              details = {
                version: (window as any).google.maps.version,
                loaded: true
              };
            }
            break;
        }
        
        const responseTime = Date.now() - startTime;
        
        setChecks(prev => prev.map(c => 
          c.name === check.name 
            ? { 
                ...c, 
                status, 
                responseTime,
                lastChecked: new Date().toISOString(),
                details
              }
            : c
        ));
      } catch (error) {
        setChecks(prev => prev.map(c => 
          c.name === check.name 
            ? { 
                ...c, 
                status: 'offline' as const,
                lastChecked: new Date().toISOString()
              }
            : c
        ));
      }
      
      // Add a small delay between checks for visual feedback
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    runSystemChecks();
  }, []);

  const getStatusIcon = (status: SystemCheck['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'checking':
        return <Clock className="w-5 h-5 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: SystemCheck['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800">ONLINE</Badge>;
      case 'offline':
        return <Badge className="bg-red-100 text-red-800">OFFLINE</Badge>;
      case 'checking':
        return <Badge className="bg-yellow-100 text-yellow-800">CHECKING</Badge>;
    }
  };

  const onlineCount = checks.filter(c => c.status === 'online').length;
  const totalChecks = checks.length;
  const healthPercentage = totalChecks > 0 ? Math.round((onlineCount / totalChecks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Activity className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold">System Status</h1>
              <p className="text-gray-600 dark:text-gray-400">Real-time system health monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{healthPercentage}%</div>
              <div className="text-sm text-gray-500">System Health</div>
            </div>
            <Button onClick={runSystemChecks} disabled={isLoading}>
              {isLoading ? <Clock className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
              {isLoading ? 'Checking...' : 'Recheck'}
            </Button>
          </div>
        </div>

        {/* System Checks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {checks.map((check) => (
            <Card key={check.name} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(check.status)}
                    {check.name}
                  </CardTitle>
                  {getStatusBadge(check.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {check.description}
                </p>
                
                {check.responseTime && (
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Response Time:</span>
                    <span>{check.responseTime}ms</span>
                  </div>
                )}
                
                {check.lastChecked && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Last Checked:</span>
                    <span>{new Date(check.lastChecked).toLocaleTimeString()}</span>
                  </div>
                )}
                
                {check.details && Object.keys(check.details).length > 0 && (
                  <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                    {Object.entries(check.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-mono">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              LightPrompt Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{onlineCount}</div>
                <div className="text-sm text-gray-500">Services Online</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{totalChecks}</div>
                <div className="text-sm text-gray-500">Total Services</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${healthPercentage >= 80 ? 'text-green-600' : healthPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {healthPercentage}%
                </div>
                <div className="text-sm text-gray-500">Health Score</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Health</span>
                <span>{healthPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    healthPercentage >= 80 ? 'bg-green-500' : 
                    healthPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${healthPercentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}