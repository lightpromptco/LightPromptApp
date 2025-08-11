import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Circle, 
  Star, 
  Moon, 
  Sun, 
  Globe,
  Eye,
  Zap,
  Heart,
  Brain,
  Target,
  Crown,
  Calendar
} from 'lucide-react';

interface BirthData {
  date: string;
  time?: string;
  location?: string;
  lat?: number;
  lng?: number;
  name?: string;
}

interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
  retrograde?: boolean;
}

interface ChartData {
  planets: PlanetPosition[];
  houses: any[];
  sun: { sign: string; degree: number; house: number };
  moon: { sign: string; degree: number; house: number };
  mercury: { sign: string; degree: number; house: number };
  venus: { sign: string; degree: number; house: number };
  mars: { sign: string; degree: number; house: number };
  jupiter: { sign: string; degree: number; house: number };
  saturn: { sign: string; degree: number; house: number };
}

const PLANET_SYMBOLS: Record<string, string> = {
  'Sun': '☉',
  'Moon': '☽',
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄'
};

const ZODIAC_SYMBOLS: Record<string, string> = {
  'aries': '♈',
  'taurus': '♉',
  'gemini': '♊',
  'cancer': '♋',
  'leo': '♌',
  'virgo': '♍',
  'libra': '♎',
  'scorpio': '♏',
  'sagittarius': '♐',
  'capricorn': '♑',
  'aquarius': '♒',
  'pisces': '♓'
};

const SIGN_COLORS: Record<string, string> = {
  'aries': '#FF6B6B',
  'taurus': '#4ECDC4',
  'gemini': '#45B7D1',
  'cancer': '#96CEB4',
  'leo': '#FFEAA7',
  'virgo': '#DDA0DD',
  'libra': '#98D8C8',
  'scorpio': '#F7DC6F',
  'sagittarius': '#BB8FCE',
  'capricorn': '#85C1E9',
  'aquarius': '#76D7C4',
  'pisces': '#F8C471'
};

interface InteractiveNatalChartProps {
  birthData: BirthData;
  onPlanetClick?: (planet: string, sign: string) => void;
}

export function InteractiveNatalChart({ birthData, onPlanetClick }: InteractiveNatalChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);

  useEffect(() => {
    if (birthData?.date) {
      loadChartData();
    }
  }, [birthData]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      console.log('Loading chart data for any user with birth data:', birthData);
      
      // Try Swiss Ephemeris Python API first (with timeout)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
        
        const pythonResponse = await fetch('http://localhost:8000/chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: birthData.date,
            time: birthData.time || '12:00',
            place_name: birthData.location || 'Temple, TX, USA',
            latitude: birthData.lat || 31.0982,
            longitude: birthData.lng || -97.3428
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (pythonResponse.ok) {
          const pythonData = await pythonResponse.json();
          console.log('✅ Using Swiss Ephemeris calculations:', pythonData);
          
          // Transform Python API response to match our interface
          const transformedData: ChartData = {
            planets: Object.entries(pythonData.chart).filter(([key]) => 
              ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(key)
            ).map(([key, planet]: [string, any]) => ({
              planet: key.charAt(0).toUpperCase() + key.slice(1),
              sign: planet.sign,
              degree: planet.degree,
              house: planet.house,
              symbol: PLANET_SYMBOLS[key.charAt(0).toUpperCase() + key.slice(1)] || '?'
            })),
            houses: pythonData.houses || Array.from({ length: 12 }, (_, i) => ({
              house: i + 1,
              sign: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'][i],
              degree: i * 30
            })),
            sun: pythonData.chart.sun,
            moon: pythonData.chart.moon,
            mercury: pythonData.chart.mercury,
            venus: pythonData.chart.venus,
            mars: pythonData.chart.mars,
            jupiter: pythonData.chart.jupiter,
            saturn: pythonData.chart.saturn
          };
          
          setChartData(transformedData);
          return;
        }
      } catch (pythonError) {
        // Silently fall back to Node.js calculations without logging error
      }
      
      // Fallback to Node.js API calculations
      const response = await apiRequest('POST', '/api/astrology/chart', {
        birthData: {
          date: birthData.date,
          time: birthData.time || '12:00',
          location: birthData.location || 'Temple, TX, USA',
          lat: birthData.lat || 31.0982,
          lng: birthData.lng || -97.3428
        }
      });
      const data = await response.json();
      
      // Transform the Node.js API response
      const transformedData: ChartData = {
        planets: Object.entries(data.chart).filter(([key]) => 
          ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(key)
        ).map(([key, planet]: [string, any]) => ({
          planet: key.charAt(0).toUpperCase() + key.slice(1),
          sign: planet.sign,
          degree: planet.degree,
          house: planet.house,
          symbol: PLANET_SYMBOLS[key.charAt(0).toUpperCase() + key.slice(1)] || '?'
        })),
        houses: data.houses || Array.from({ length: 12 }, (_, i) => ({
          house: i + 1,
          sign: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'][i],
          degree: i * 30
        })),
        sun: data.chart.sun,
        moon: data.chart.moon,
        mercury: data.chart.mercury,
        venus: data.chart.venus,
        mars: data.chart.mars,
        jupiter: data.chart.jupiter,
        saturn: data.chart.saturn
      };
      
      console.log('Using Node.js fallback chart data:', transformedData);
      setChartData(transformedData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBirthDate = (dateStr: string) => {
    try {
      console.log('Formatting birth date:', dateStr);
      const date = new Date(dateStr + 'T12:00:00'); // Add time to prevent timezone issues
      const formatted = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC' 
      });
      console.log('Formatted birth date:', formatted);
      return formatted;
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateStr;
    }
  };

  const handlePlanetClick = (planetKey: string, planetData: any) => {
    setSelectedPlanet(planetKey);
    if (onPlanetClick) {
      onPlanetClick(planetKey, planetData.sign);
    }
  };

  // Calculate planet positions on the wheel (simplified version)
  const getPlanetPosition = (degree: number, radius: number = 140) => {
    const angle = (degree - 90) * (Math.PI / 180); // Convert to radians, adjust for top start
    const x = 200 + radius * Math.cos(angle);
    const y = 200 + radius * Math.sin(angle);
    return { x, y };
  };

  if (loading) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm mb-8">
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Failed to load chart data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200 shadow-sm mb-8">
      <CardHeader className="border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Circle className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Natal Wheel</CardTitle>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatBirthDate(birthData.date)} • {birthData.location || 'Temple, TX, USA'}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-100">
          <TabsList className="grid w-full grid-cols-4 bg-transparent h-12">
            <TabsTrigger value="chart" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Chart Wheel
            </TabsTrigger>
            <TabsTrigger value="planets" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Planets
            </TabsTrigger>
            <TabsTrigger value="houses" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Houses
            </TabsTrigger>
            <TabsTrigger value="report" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Birth Chart Report
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chart" className="p-6">
          <div className="flex justify-center">
            <div className="relative">
              {/* Interactive SVG Chart Wheel */}
              <svg width="400" height="400" viewBox="0 0 400 400" className="border border-gray-200 rounded-full bg-gradient-to-br from-blue-50 to-purple-50">
                {/* Outer circle - zodiac signs */}
                <circle cx="200" cy="200" r="180" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                
                {/* Inner circle - houses */}
                <circle cx="200" cy="200" r="120" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                
                {/* House divisions */}
                {Array.from({ length: 12 }, (_, i) => {
                  const angle = (i * 30 - 90) * (Math.PI / 180);
                  const x1 = 200 + 120 * Math.cos(angle);
                  const y1 = 200 + 120 * Math.sin(angle);
                  const x2 = 200 + 180 * Math.cos(angle);
                  const y2 = 200 + 180 * Math.sin(angle);
                  
                  return (
                    <g key={i}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d1d5db" strokeWidth="1" />
                      {/* House numbers */}
                      <text
                        x={200 + 100 * Math.cos(angle + Math.PI/12)}
                        y={200 + 100 * Math.sin(angle + Math.PI/12)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs fill-gray-500 font-medium"
                      >
                        {i + 1}
                      </text>
                    </g>
                  );
                })}

                {/* Zodiac sign symbols */}
                {Object.entries(ZODIAC_SYMBOLS).map(([sign, symbol], i) => {
                  const angle = (i * 30 - 75) * (Math.PI / 180);
                  const x = 200 + 150 * Math.cos(angle);
                  const y = 200 + 150 * Math.sin(angle);
                  
                  return (
                    <text
                      key={sign}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-lg font-bold cursor-pointer hover:fill-blue-600 transition-colors"
                      fill={SIGN_COLORS[sign]}
                      onClick={() => onPlanetClick && onPlanetClick(sign, sign)}
                    >
                      {symbol}
                    </text>
                  );
                })}

                {/* Planet positions */}
                {chartData.planets.map((planet) => {
                  const position = getPlanetPosition(planet.degree + (Object.keys(ZODIAC_SYMBOLS).indexOf(planet.sign) * 30));
                  
                  return (
                    <g key={planet.planet}>
                      {/* Planet circle background */}
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="16"
                        fill="white"
                        stroke={selectedPlanet === planet.planet.toLowerCase() ? "#3b82f6" : "#6b7280"}
                        strokeWidth={selectedPlanet === planet.planet.toLowerCase() ? "3" : "2"}
                        className="cursor-pointer hover:stroke-blue-500 transition-all duration-200"
                        onClick={() => handlePlanetClick(planet.planet.toLowerCase(), planet)}
                        onMouseEnter={() => setHoveredPlanet(planet.planet)}
                        onMouseLeave={() => setHoveredPlanet(null)}
                      />
                      {/* Planet symbol */}
                      <text
                        x={position.x}
                        y={position.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-sm font-bold cursor-pointer"
                        fill={selectedPlanet === planet.planet.toLowerCase() ? "#3b82f6" : "#374151"}
                        onClick={() => handlePlanetClick(planet.planet.toLowerCase(), planet)}
                      >
                        {planet.symbol}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover tooltip */}
              {hoveredPlanet && (
                <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 rounded text-sm z-10">
                  {hoveredPlanet}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="planets" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartData.planets.map((planet) => (
              <Card 
                key={planet.planet}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedPlanet === planet.planet.toLowerCase() ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handlePlanetClick(planet.planet.toLowerCase(), planet)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{planet.symbol}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{planet.planet}</h3>
                      <p className="text-sm text-gray-600">
                        {ZODIAC_SYMBOLS[planet.sign]} {planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)} • House {planet.house}
                      </p>
                      <p className="text-xs text-gray-500">{planet.degree.toFixed(1)}°</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="houses" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <Card key={i + 1} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">House {i + 1}</h3>
                      <p className="text-xs text-gray-500">Life Area</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="report" className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Birth Chart Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Birth Date:</span>
                  <span className="text-sm text-gray-900">{formatBirthDate(birthData.date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Location:</span>
                  <span className="text-sm text-gray-900">{birthData.location || 'Temple, TX, USA'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Sun Sign:</span>
                  <span className="text-sm text-gray-900 flex items-center gap-1">
                    {ZODIAC_SYMBOLS[chartData.sun.sign]} {chartData.sun.sign.charAt(0).toUpperCase() + chartData.sun.sign.slice(1)} ({chartData.sun.degree.toFixed(1)}°)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Moon Sign:</span>
                  <span className="text-sm text-gray-900 flex items-center gap-1">
                    {ZODIAC_SYMBOLS[chartData.moon.sign]} {chartData.moon.sign.charAt(0).toUpperCase() + chartData.moon.sign.slice(1)} ({chartData.moon.degree.toFixed(1)}°)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Rising Sign:</span>
                  <span className="text-sm text-gray-900">Aries (1st House)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Circle className="w-5 h-5 text-blue-500" />
                Your Big Three
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">☉</div>
                    <h4 className="font-semibold text-yellow-800">Sun in Aquarius</h4>
                    <p className="text-xs text-yellow-600 mt-1">Your core identity</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">☽</div>
                    <h4 className="font-semibold text-blue-800">Moon in Leo</h4>
                    <p className="text-xs text-blue-600 mt-1">Your emotional nature</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">↗</div>
                    <h4 className="font-semibold text-red-800">Rising in Aries</h4>
                    <p className="text-xs text-red-600 mt-1">Your outer personality</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-500" />
                Planetary Aspects & Interpretations
              </h3>
              <div className="space-y-4">
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Sun in Aquarius (3rd House)</h4>
                    <p className="text-sm text-blue-700 mb-2">Your core identity is expressed through innovation, communication, and humanitarian ideals.</p>
                    <p className="text-xs text-blue-600">At 26.73°, you're in the latter degrees of Aquarius, suggesting mastery of Aquarian qualities and readiness to pioneer new frontiers.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Moon in Leo (4th House)</h4>
                    <p className="text-sm text-orange-700 mb-2">Your emotional nature craves creative expression and recognition within your home and family sphere.</p>
                    <p className="text-xs text-orange-600">At 16.18°, this placement suggests a natural performer who finds emotional security through creative self-expression and family drama.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Mercury in Aries (3rd House)</h4>
                    <p className="text-sm text-green-700 mb-2">Your communication style is direct, pioneering, and intellectually aggressive.</p>
                    <p className="text-xs text-green-600">At 6.78°, early degrees suggest raw, unfiltered mental energy that cuts straight to the point.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-pink-800 mb-2">Venus in Sagittarius (4th House)</h4>
                    <p className="text-sm text-pink-700 mb-2">You love through adventure, philosophy, and expanding horizons within your personal foundation.</p>
                    <p className="text-xs text-pink-600">This placement suggests attracting partners who share your love of learning and exploration.</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Privacy Notice</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Your birth data and conversations are completely private to your account. 
                  Chart calculations are processed server-side but not stored permanently. 
                  Only you can access your personal astrological information.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}