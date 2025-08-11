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

// Helper function for house meanings
const getHouseMeaning = (houseNum: number): string => {
  const meanings: Record<number, string> = {
    1: "Self and Identity",
    2: "Values and Resources", 
    3: "Communication and Siblings",
    4: "Home and Family",
    5: "Creativity and Romance",
    6: "Work and Health",
    7: "Partnerships and Marriage",
    8: "Transformation and Shared Resources",
    9: "Philosophy and Higher Learning",
    10: "Career and Public Image",
    11: "Friends and Aspirations",
    12: "Spirituality and Subconscious"
  };
  return meanings[houseNum] || "Unknown House";
};

// Helper function for planet meanings
const getPlanetMeaning = (planet: string, sign: string, house: number): string => {
  const planetMeanings: Record<string, string> = {
    'Mercury': `Your communication style and thinking patterns are influenced by ${sign} energy, particularly active in matters of ${getHouseMeaning(house).toLowerCase()}.`,
    'Venus': `Your approach to love, beauty, and values expresses through ${sign} qualities, most evident in your ${getHouseMeaning(house).toLowerCase()}.`,
    'Mars': `Your drive, ambition, and action-taking energy operates through ${sign} characteristics, directing focus toward ${getHouseMeaning(house).toLowerCase()}.`,
    'Jupiter': `Your growth, expansion, and opportunities manifest through ${sign} energy, bringing abundance to ${getHouseMeaning(house).toLowerCase()}.`,
    'Saturn': `Your discipline, structure, and life lessons are guided by ${sign} principles, creating foundations in ${getHouseMeaning(house).toLowerCase()}.`
  };
  return planetMeanings[planet] || `${planet} in ${sign} influences your ${getHouseMeaning(house).toLowerCase()}.`;
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
        birthData: {
          date: birthData.date,
          time: birthData.time || '12:00',
          location: birthData.location || 'Temple, TX, USA',
          lat: birthData.lat || 31.0982, // Default to Temple, TX
          lng: birthData.lng || -97.3428
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Chart API response:', data);
        
        // Transform the data into our expected format
        const chart = data.chart || data;
        console.log('Chart data to transform:', chart);
        const transformedData: ChartData = {
          planets: [
            { planet: 'Sun', sign: chart.sun?.sign || 'aquarius', degree: chart.sun?.degree || 0, house: chart.sun?.house || 1, symbol: '☉' },
            { planet: 'Moon', sign: chart.moon?.sign || 'leo', degree: chart.moon?.degree || 0, house: chart.moon?.house || 5, symbol: '☽' },
            { planet: 'Mercury', sign: chart.mercury?.sign || 'aries', degree: chart.mercury?.degree || 0, house: chart.mercury?.house || 3, symbol: '☿' },
            { planet: 'Venus', sign: chart.venus?.sign || 'sagittarius', degree: chart.venus?.degree || 0, house: chart.venus?.house || 9, symbol: '♀' },
            { planet: 'Mars', sign: chart.mars?.sign || 'scorpio', degree: chart.mars?.degree || 0, house: chart.mars?.house || 8, symbol: '♂' },
            { planet: 'Jupiter', sign: chart.jupiter?.sign || 'virgo', degree: chart.jupiter?.degree || 0, house: chart.jupiter?.house || 6, symbol: '♃' },
            { planet: 'Saturn', sign: chart.saturn?.sign || 'aquarius', degree: chart.saturn?.degree || 0, house: chart.saturn?.house || 11, symbol: '♄' },
          ],
          houses: Array.from({ length: 12 }, (_, i) => ({
            house: i + 1,
            sign: chart.houses?.[i]?.sign || Object.keys(ZODIAC_SYMBOLS)[i],
            degree: chart.houses?.[i]?.degree || (i * 30)
          })),
          aspects: chart.aspects || [],
          sun: chart.sun || { sign: 'aquarius', degree: 26.73, house: 1 },
          moon: chart.moon || { sign: 'leo', degree: 15, house: 5 },
          ascendant: chart.ascendant || { sign: 'aries', degree: 0 }
        };

        console.log('Transformed chart data:', transformedData);
        setChartData(transformedData);
      } else {
        console.error('Chart API request failed:', response.status, response.statusText);
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="chart">Chart Wheel</TabsTrigger>
            <TabsTrigger value="planets">Planets</TabsTrigger>
            <TabsTrigger value="houses">Houses</TabsTrigger>
            <TabsTrigger value="report">Birth Chart Report</TabsTrigger>
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
                      const signOrder = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
                      const signIndex = signOrder.indexOf(planet.sign);
                      const totalDegree = (signIndex * 30) + (planet.degree % 30);
                      const angle = totalDegree - 90;
                      const radian = (angle * Math.PI) / 180;
                      const radius = 150 - (i * 2); // Further adjusted to prevent cut-off
                      const x = 200 + Math.cos(radian) * radius;
                      const y = 200 + Math.sin(radian) * radius;
                      
                      return (
                        <g key={planet.planet}>
                          <circle
                            cx={x}
                            cy={y}
                            r="14"
                            fill="white"
                            stroke="#4f46e5"
                            strokeWidth="2"
                            className="drop-shadow-sm"
                          />
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-base font-bold fill-indigo-600 select-none"
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

          {/* Birth Chart Report */}
          <TabsContent value="report" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Complete Birth Chart Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-6">
                  {/* Core Identity */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Sun className="w-5 h-5 text-orange-500" />
                      Core Identity & Life Purpose
                    </h3>
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                      <p className="text-gray-700">
                        <strong>Sun in {chartData.sun.sign.charAt(0).toUpperCase() + chartData.sun.sign.slice(1)} (House {chartData.sun.house})</strong> at {formatDegree(chartData.sun.degree)}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Your core identity and life purpose are expressed through {chartData.sun.sign} energy, 
                        manifesting in the {getHouseMeaning(chartData.sun.house)} area of life.
                      </p>
                    </div>
                  </div>

                  {/* Emotional Nature */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Moon className="w-5 h-5 text-blue-500" />
                      Emotional Nature & Inner World
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-gray-700">
                        <strong>Moon in {chartData.moon.sign.charAt(0).toUpperCase() + chartData.moon.sign.slice(1)} (House {chartData.moon.house})</strong> at {formatDegree(chartData.moon.degree)}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        Your emotional responses and subconscious patterns operate through {chartData.moon.sign} energy, 
                        most active in matters related to {getHouseMeaning(chartData.moon.house).toLowerCase()}.
                      </p>
                    </div>
                  </div>

                  {/* Planetary Placements Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Key Planetary Influences
                    </h3>
                    <div className="grid gap-3">
                      {chartData.planets.filter(p => ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].includes(p.planet)).map((planet) => (
                        <div key={planet.planet} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{planet.symbol}</span>
                            <strong className="text-gray-900">{planet.planet}</strong>
                            <span className="text-sm text-gray-600">
                              in {planet.sign.charAt(0).toUpperCase() + planet.sign.slice(1)} (House {planet.house})
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {getPlanetMeaning(planet.planet, planet.sign, planet.house)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Houses Summary */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      Life Areas & Focus
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-gray-700 mb-2">
                        <strong>Ascendant (Rising Sign):</strong> {chartData.ascendant.sign.charAt(0).toUpperCase() + chartData.ascendant.sign.slice(1)} at {formatDegree(chartData.ascendant.degree)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Your outward personality and approach to life is colored by {chartData.ascendant.sign} energy. 
                        This influences how others perceive you and how you initiate new experiences.
                      </p>
                    </div>
                  </div>
                </div>
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