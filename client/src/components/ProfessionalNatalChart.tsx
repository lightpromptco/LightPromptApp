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
  Crown
} from 'lucide-react';

interface BirthData {
  date: string;
  time?: string;
  location?: string;
  lat?: number;
  lng?: number;
}

interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  symbol: string;
  retrograde?: boolean;
}

interface HouseCusp {
  house: number;
  sign: string;
  degree: number;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  exact: boolean;
}

interface ChartData {
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: Aspect[];
  sun: { sign: string; degree: number; house: number };
  moon: { sign: string; degree: number; house: number };
  ascendant: { sign: string; degree: number };
}

const PLANET_SYMBOLS: Record<string, string> = {
  'Sun': '☉',
  'Moon': '☽',
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Uranus': '♅',
  'Neptune': '♆',
  'Pluto': '♇',
  'North Node': '☊',
  'South Node': '☋',
  'Chiron': '⚷'
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

const ASPECT_SYMBOLS: Record<string, string> = {
  'conjunction': '☌',
  'opposition': '☍',
  'trine': '△',
  'square': '□',
  'sextile': '⚹',
  'quincunx': '⚻'
};

interface ProfessionalNatalChartProps {
  birthData: BirthData;
}

export function ProfessionalNatalChart({ birthData }: ProfessionalNatalChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chart');

  useEffect(() => {
    if (birthData?.date) {
      loadChartData();
    }
  }, [birthData]);

  const loadChartData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/astrology/chart', {
        birthDate: birthData.date,
        birthTime: birthData.time || '12:00',
        birthLocation: birthData.location || 'Unknown',
        latitude: birthData.lat || 0,
        longitude: birthData.lng || 0
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform the data into our expected format
        const transformedData: ChartData = {
          planets: [
            { planet: 'Sun', sign: data.chart.sun.sign, degree: data.chart.sun.degree, house: data.chart.sun.house, symbol: '☉' },
            { planet: 'Moon', sign: data.chart.moon.sign, degree: data.chart.moon.degree, house: data.chart.moon.house, symbol: '☽' },
            { planet: 'Mercury', sign: data.chart.mercury.sign, degree: data.chart.mercury.degree, house: data.chart.mercury.house, symbol: '☿' },
            { planet: 'Venus', sign: data.chart.venus.sign, degree: data.chart.venus.degree, house: data.chart.venus.house, symbol: '♀' },
            { planet: 'Mars', sign: data.chart.mars.sign, degree: data.chart.mars.degree, house: data.chart.mars.house, symbol: '♂' },
            { planet: 'Jupiter', sign: data.chart.jupiter.sign, degree: data.chart.jupiter.degree, house: data.chart.jupiter.house, symbol: '♃' },
            { planet: 'Saturn', sign: data.chart.saturn.sign, degree: data.chart.saturn.degree, house: data.chart.saturn.house, symbol: '♄' },
          ],
          houses: Array.from({ length: 12 }, (_, i) => ({
            house: i + 1,
            sign: data.chart.houses?.[i]?.sign || 'aries',
            degree: data.chart.houses?.[i]?.degree || 0
          })),
          aspects: data.chart.aspects || [],
          sun: data.chart.sun,
          moon: data.chart.moon,
          ascendant: data.chart.ascendant || { sign: 'aries', degree: 0 }
        };

        setChartData(transformedData);
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDegree = (degree: number) => {
    const deg = Math.floor(degree);
    const min = Math.floor((degree - deg) * 60);
    return `${deg}°${min.toString().padStart(2, '0')}'`;
  };

  const getSignColor = (sign: string) => {
    const colors: Record<string, string> = {
      'aries': 'text-red-600',
      'taurus': 'text-green-600',
      'gemini': 'text-yellow-600',
      'cancer': 'text-blue-600',
      'leo': 'text-orange-600',
      'virgo': 'text-emerald-600',
      'libra': 'text-pink-600',
      'scorpio': 'text-purple-600',
      'sagittarius': 'text-indigo-600',
      'capricorn': 'text-gray-600',
      'aquarius': 'text-cyan-600',
      'pisces': 'text-teal-600'
    };
    return colors[sign] || 'text-gray-600';
  };

  if (!birthData?.date) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Your Natal Chart</h3>
          <p className="text-gray-600">Enter your birth details to see your complete astrological profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            Professional Natal Chart
          </CardTitle>
          <div className="text-sm text-gray-600">
            Born: {new Date(birthData.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            {birthData.time && ` at ${birthData.time}`}
            {birthData.location && ` in ${birthData.location}`}
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Calculating your cosmic blueprint...</p>
          </CardContent>
        </Card>
      ) : chartData ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chart">Chart Wheel</TabsTrigger>
            <TabsTrigger value="planets">Planets</TabsTrigger>
            <TabsTrigger value="houses">Houses</TabsTrigger>
            <TabsTrigger value="aspects">Aspects</TabsTrigger>
          </TabsList>

          {/* Chart Wheel */}
          <TabsContent value="chart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Circle className="w-5 h-5" />
                  Natal Wheel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full max-w-2xl mx-auto">
                  {/* Chart Wheel SVG */}
                  <svg viewBox="0 0 400 400" className="w-full h-auto border rounded-full">
                    {/* Outer circle */}
                    <circle cx="200" cy="200" r="190" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                    
                    {/* Inner circle */}
                    <circle cx="200" cy="200" r="120" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    
                    {/* House lines */}
                    {Array.from({ length: 12 }, (_, i) => {
                      const angle = (i * 30) - 90;
                      const radian = (angle * Math.PI) / 180;
                      const x1 = 200 + Math.cos(radian) * 120;
                      const y1 = 200 + Math.sin(radian) * 120;
                      const x2 = 200 + Math.cos(radian) * 190;
                      const y2 = 200 + Math.sin(radian) * 190;
                      
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#d1d5db"
                          strokeWidth="1"
                        />
                      );
                    })}
                    
                    {/* House numbers */}
                    {Array.from({ length: 12 }, (_, i) => {
                      const angle = (i * 30) + 15 - 90;
                      const radian = (angle * Math.PI) / 180;
                      const x = 200 + Math.cos(radian) * 155;
                      const y = 200 + Math.sin(radian) * 155;
                      
                      return (
                        <text
                          key={i}
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="text-xs font-semibold fill-gray-600"
                        >
                          {i + 1}
                        </text>
                      );
                    })}
                    
                    {/* Zodiac signs around the wheel */}
                    {Object.entries(ZODIAC_SYMBOLS).map(([sign, symbol], i) => {
                      const angle = (i * 30) + 15 - 90;
                      const radian = (angle * Math.PI) / 180;
                      const x = 200 + Math.cos(radian) * 205;
                      const y = 200 + Math.sin(radian) * 205;
                      
                      return (
                        <text
                          key={sign}
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={`text-lg font-bold ${getSignColor(sign)}`}
                        >
                          {symbol}
                        </text>
                      );
                    })}
                    
                    {/* Planets */}
                    {chartData.planets.map((planet, i) => {
                      // Calculate angle based on sign and degree
                      const signIndex = Object.keys(ZODIAC_SYMBOLS).indexOf(planet.sign);
                      const totalDegree = (signIndex * 30) + planet.degree;
                      const angle = totalDegree - 90;
                      const radian = (angle * Math.PI) / 180;
                      const radius = 140 - (i * 3); // Stagger planets slightly
                      const x = 200 + Math.cos(radian) * radius;
                      const y = 200 + Math.sin(radian) * radius;
                      
                      return (
                        <g key={planet.planet}>
                          <circle
                            cx={x}
                            cy={y}
                            r="12"
                            fill="white"
                            stroke="#4f46e5"
                            strokeWidth="2"
                          />
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-sm font-bold fill-indigo-600"
                          >
                            {planet.symbol}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                  Professional natal chart showing planetary positions, houses, and zodiac signs
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planets Table */}
          <TabsContent value="planets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Planetary Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chartData.planets.map((planet) => (
                    <div key={planet.planet} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center">
                          <span className="text-lg">{planet.symbol}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{planet.planet}</div>
                          <div className="text-sm text-gray-600">House {planet.house}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${getSignColor(planet.sign)}`}>
                          {ZODIAC_SYMBOLS[planet.sign]} {planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)}
                        </div>
                        <div className="text-sm text-gray-600">{formatDegree(planet.degree)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Houses */}
          <TabsContent value="houses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  House Cusps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chartData.houses.map((house) => (
                    <div key={house.house} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">
                          House {house.house}
                        </div>
                        <Badge variant="outline" className={getSignColor(house.sign)}>
                          {ZODIAC_SYMBOLS[house.sign]} {house.sign.charAt(0).toUpperCase() + house.sign.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDegree(house.degree)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aspects */}
          <TabsContent value="aspects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Planetary Aspects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.aspects && chartData.aspects.length > 0 ? (
                  <div className="space-y-3">
                    {chartData.aspects.map((aspect, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="text-lg">
                            {ASPECT_SYMBOLS[aspect.type] || '○'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {aspect.planet1} {aspect.type} {aspect.planet2}
                            </div>
                            <div className="text-sm text-gray-600">
                              Orb: {aspect.orb.toFixed(1)}°
                            </div>
                          </div>
                        </div>
                        {aspect.exact && (
                          <Badge className="bg-green-100 text-green-800">
                            Exact
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Aspect calculations will be available in the next update</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Unable to calculate chart data. Please check your birth information.</p>
            <Button onClick={loadChartData} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}