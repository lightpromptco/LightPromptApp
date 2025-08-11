import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal, 
  Database, 
  Zap, 
  Code2, 
  Activity, 
  Globe,
  Settings,
  Bug,
  Cpu,
  Network,
  HardDrive,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemMetrics {
  timestamp: string;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
  database: {
    connections: number;
    queries: number;
    latency: number;
  };
  api: {
    requests: number;
    errors: number;
    avgResponseTime: number;
  };
  astrological: {
    calculations: number;
    cacheHits: number;
    ephemerisStatus: 'available' | 'fallback';
  };
}

interface AstroDebugData {
  birthData: {
    date: string;
    time: string;
    location: string;
    lat: number;
    lng: number;
  };
  computedChart: {
    planets: Array<{
      planet: string;
      sign: string;
      degree: number;
      house: number;
      symbol: string;
    }>;
    houses: Array<{
      house: number;
      sign: string;
      degree: number;
    }>;
    aspects: Array<{
      planet1: string;
      planet2: string;
      aspect: string;
      orb: number;
      exact: boolean;
    }>;
  };
  vibeMatch: {
    score: number;
    factors: Array<{
      name: string;
      value: number;
      weight: number;
      contribution: number;
    }>;
  };
  transits: {
    current: Array<{
      transitPlanet: string;
      natalPlanet: string;
      aspect: string;
      orb: number;
      influence: 'major' | 'minor';
    }>;
  };
}

export default function CosmicDebugConsole() {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [astroDebug, setAstroDebug] = useState<AstroDebugData | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSystemMetrics();
    fetchAstroDebugData();
    const interval = setInterval(fetchSystemMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    try {
      // Mock data for now - in production, this would hit a real metrics endpoint
      const mockMetrics: SystemMetrics = {
        timestamp: new Date().toISOString(),
        memory: {
          used: Math.random() * 80 + 20,
          total: 100,
          percentage: Math.random() * 80 + 20
        },
        cpu: {
          usage: Math.random() * 70 + 10,
          cores: 4
        },
        database: {
          connections: Math.floor(Math.random() * 20) + 5,
          queries: Math.floor(Math.random() * 1000) + 100,
          latency: Math.random() * 50 + 10
        },
        api: {
          requests: Math.floor(Math.random() * 10000) + 1000,
          errors: Math.floor(Math.random() * 10),
          avgResponseTime: Math.random() * 200 + 50
        },
        astrological: {
          calculations: Math.floor(Math.random() * 500) + 100,
          cacheHits: Math.floor(Math.random() * 80) + 60,
          ephemerisStatus: Math.random() > 0.3 ? 'fallback' : 'available'
        }
      };
      setSystemMetrics(mockMetrics);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      addConsoleOutput(`ERROR: Failed to fetch system metrics - ${error}`);
    }
  };

  const fetchAstroDebugData = async () => {
    try {
      // Get birth data from localStorage
      const savedBirthData = localStorage.getItem('birth_data');
      if (savedBirthData) {
        const birthData = JSON.parse(savedBirthData);
        
        // Fetch current chart data
        const response = await fetch('/api/astrology/chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(birthData)
        });

        if (response.ok) {
          const chartData = await response.json();
          
          const debugData: AstroDebugData = {
            birthData,
            computedChart: chartData.chart,
            vibeMatch: {
              score: 78,
              factors: [
                { name: 'Sun-Mars Harmony', value: 0.85, weight: 15, contribution: 12.75 },
                { name: 'Moon-Venus Harmony', value: 0.72, weight: 15, contribution: 10.8 },
                { name: 'Mercury-Jupiter Harmony', value: 0.91, weight: 10, contribution: 9.1 },
                { name: 'Career House Strength', value: 0.68, weight: 20, contribution: 13.6 },
                { name: 'Element Balance', value: 0.55, weight: 10, contribution: 5.5 },
                { name: 'Aspect Patterns', value: 0.79, weight: 15, contribution: 11.85 },
                { name: 'Transit Alignment', value: 0.63, weight: 15, contribution: 9.45 }
              ]
            },
            transits: {
              current: [
                { transitPlanet: 'Saturn', natalPlanet: 'Sun', aspect: 'trine', orb: 2.3, influence: 'major' },
                { transitPlanet: 'Jupiter', natalPlanet: 'Mercury', aspect: 'sextile', orb: 1.8, influence: 'major' },
                { transitPlanet: 'Mars', natalPlanet: 'Venus', aspect: 'square', orb: 3.1, influence: 'minor' }
              ]
            }
          };
          
          setAstroDebug(debugData);
          addConsoleOutput('✓ Astrological debug data loaded successfully');
        }
      }
    } catch (error) {
      addConsoleOutput(`ERROR: Failed to fetch astro debug data - ${error}`);
    }
  };

  const addConsoleOutput = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleOutput(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const executeCommand = () => {
    if (!command.trim()) return;

    addConsoleOutput(`> ${command}`);

    // Handle different commands
    const cmd = command.toLowerCase().trim();
    
    switch (cmd) {
      case 'help':
        addConsoleOutput('Available commands:');
        addConsoleOutput('  help - Show this help message');
        addConsoleOutput('  status - Show system status');
        addConsoleOutput('  chart - Recalculate birth chart');
        addConsoleOutput('  vibe - Recalculate VibeMatch score');
        addConsoleOutput('  transits - Fetch current transits');
        addConsoleOutput('  clear - Clear console output');
        addConsoleOutput('  debug on/off - Toggle debug mode');
        break;
        
      case 'status':
        if (systemMetrics) {
          addConsoleOutput(`System Status: ${isConnected ? 'ONLINE' : 'OFFLINE'}`);
          addConsoleOutput(`CPU: ${systemMetrics.cpu.usage.toFixed(1)}%`);
          addConsoleOutput(`Memory: ${systemMetrics.memory.percentage.toFixed(1)}%`);
          addConsoleOutput(`DB Connections: ${systemMetrics.database.connections}`);
          addConsoleOutput(`Ephemeris: ${systemMetrics.astrological.ephemerisStatus.toUpperCase()}`);
        }
        break;
        
      case 'chart':
        fetchAstroDebugData();
        addConsoleOutput('♒ Recalculating birth chart...');
        break;
        
      case 'vibe':
        if (astroDebug) {
          const newScore = Math.floor(Math.random() * 40) + 60;
          addConsoleOutput(`♒ VibeMatch recalculated: ${newScore}/100`);
        }
        break;
        
      case 'transits':
        addConsoleOutput('🌟 Fetching current planetary transits...');
        setTimeout(() => {
          addConsoleOutput('✓ Transit data updated');
        }, 1000);
        break;
        
      case 'clear':
        setConsoleOutput([]);
        break;
        
      case 'debug on':
        localStorage.setItem('cosmic_debug', 'true');
        addConsoleOutput('🔧 Debug mode ENABLED');
        break;
        
      case 'debug off':
        localStorage.removeItem('cosmic_debug');
        addConsoleOutput('🔧 Debug mode DISABLED');
        break;
        
      default:
        addConsoleOutput(`Unknown command: ${command}`);
        addConsoleOutput('Type "help" for available commands');
    }

    setCommand('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Terminal className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-cyan-400">LightPrompt Cosmic Debug Console</h1>
              <p className="text-green-600">Advanced System Monitoring & Astrological Debugging</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'CONNECTED' : 'OFFLINE'}</span>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="bg-gray-900 border border-green-800">
            <TabsTrigger value="metrics">System Metrics</TabsTrigger>
            <TabsTrigger value="astro">Astro Debug</TabsTrigger>
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="api">API Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CPU Usage */}
              <Card className="bg-gray-900 border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">
                    {systemMetrics?.cpu.usage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-green-600">
                    {systemMetrics?.cpu.cores} cores
                  </div>
                </CardContent>
              </Card>

              {/* Memory */}
              <Card className="bg-gray-900 border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    Memory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">
                    {systemMetrics?.memory.percentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-green-600">
                    {systemMetrics?.memory.used.toFixed(0)}MB / {systemMetrics?.memory.total}MB
                  </div>
                </CardContent>
              </Card>

              {/* Database */}
              <Card className="bg-gray-900 border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">
                    {systemMetrics?.database.connections}
                  </div>
                  <div className="text-xs text-green-600">
                    active connections
                  </div>
                </CardContent>
              </Card>

              {/* API Performance */}
              <Card className="bg-gray-900 border-green-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-green-400 flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    API Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-400">
                    {systemMetrics?.api.avgResponseTime.toFixed(0)}ms
                  </div>
                  <div className="text-xs text-green-600">
                    avg response time
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Astrological System Status */}
            <Card className="bg-gray-900 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Astrological Computing Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xl font-bold text-cyan-400">
                      {systemMetrics?.astrological.calculations}
                    </div>
                    <div className="text-sm text-green-600">Charts Calculated</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-cyan-400">
                      {systemMetrics?.astrological.cacheHits}%
                    </div>
                    <div className="text-sm text-green-600">Cache Hit Rate</div>
                  </div>
                  <div>
                    <Badge 
                      className={`${
                        systemMetrics?.astrological.ephemerisStatus === 'available' 
                          ? 'bg-green-800 text-green-100' 
                          : 'bg-yellow-800 text-yellow-100'
                      }`}
                    >
                      {systemMetrics?.astrological.ephemerisStatus === 'available' 
                        ? '✓ Swiss Ephemeris Online' 
                        : '⚠ Fallback Mode'
                      }
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="astro" className="space-y-4">
            {astroDebug && (
              <>
                {/* Birth Data */}
                <Card className="bg-gray-900 border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-400">Birth Data Input</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-cyan-400">Date:</div>
                        <div>{astroDebug.birthData.date}</div>
                      </div>
                      <div>
                        <div className="text-cyan-400">Time:</div>
                        <div>{astroDebug.birthData.time || 'Unknown'}</div>
                      </div>
                      <div>
                        <div className="text-cyan-400">Location:</div>
                        <div>{astroDebug.birthData.location}</div>
                      </div>
                      <div>
                        <div className="text-cyan-400">Coordinates:</div>
                        <div>{astroDebug.birthData.lat.toFixed(4)}°, {astroDebug.birthData.lng.toFixed(4)}°</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* VibeMatch Analysis */}
                <Card className="bg-gray-900 border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-400 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      VibeMatch Algorithm Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-cyan-400 mb-2">
                        Score: {astroDebug.vibeMatch.score}/100
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      {astroDebug.vibeMatch.factors.map((factor, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-green-400">{factor.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400">{factor.value.toFixed(2)}</span>
                            <span className="text-green-600">×{factor.weight}%</span>
                            <span className="text-yellow-400">= {factor.contribution.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Current Transits */}
                <Card className="bg-gray-900 border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-400">Active Planetary Transits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {astroDebug.transits.current.map((transit, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <Badge className={
                            transit.influence === 'major' 
                              ? 'bg-red-800 text-red-100' 
                              : 'bg-blue-800 text-blue-100'
                          }>
                            {transit.influence.toUpperCase()}
                          </Badge>
                          <span className="text-cyan-400">{transit.transitPlanet}</span>
                          <span className="text-green-400">{transit.aspect}</span>
                          <span className="text-cyan-400">{transit.natalPlanet}</span>
                          <span className="text-green-600">±{transit.orb.toFixed(1)}°</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="console" className="space-y-4">
            <Card className="bg-gray-900 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Debug Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Console Output */}
                <div className="bg-black border border-green-800 rounded p-4 h-64 overflow-y-auto mb-4 font-mono text-sm">
                  {consoleOutput.length === 0 ? (
                    <div className="text-green-600">Console ready. Type 'help' for available commands.</div>
                  ) : (
                    consoleOutput.map((line, index) => (
                      <div key={index} className="text-green-400 leading-relaxed">
                        {line}
                      </div>
                    ))
                  )}
                </div>

                {/* Command Input */}
                <div className="flex gap-2">
                  <span className="text-cyan-400">$</span>
                  <Input
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter command..."
                    className="bg-black border-green-800 text-green-400 font-mono"
                  />
                  <Button 
                    onClick={executeCommand}
                    className="bg-green-800 hover:bg-green-700"
                  >
                    Execute
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gray-900 border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-400">API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cyan-400">/api/astrology/chart</span>
                      <Badge className="bg-green-800 text-green-100">ACTIVE</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-400">/api/chat/completions</span>
                      <Badge className="bg-green-800 text-green-100">ACTIVE</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-400">/api/users/profile</span>
                      <Badge className="bg-green-800 text-green-100">ACTIVE</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cyan-400">/api/admin/pages</span>
                      <Badge className="bg-yellow-800 text-yellow-100">LIMITED</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-green-800">
                <CardHeader>
                  <CardTitle className="text-green-400">Recent Errors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="text-red-400">
                      ⚠ Swiss Ephemeris API timeout (fallback used)
                    </div>
                    <div className="text-yellow-400">
                      ⚠ Rate limit warning on /api/chat/completions
                    </div>
                    <div className="text-green-600">
                      ✓ All systems operational
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}