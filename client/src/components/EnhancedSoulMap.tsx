import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Moon, 
  Sun, 
  Stars, 
  Globe,
  Zap,
  Calendar,
  MapPin,
  Clock,
  Waves
} from "lucide-react";

interface SoulMapData {
  birthChart: any;
  planetaryPositions: any;
  moonPhase: string;
  schumannResonance: any;
  personalityProfile: any;
  insights: any;
}

interface EnhancedSoulMapProps {
  soulMapData: SoulMapData;
  onUpdate: (updates: Partial<SoulMapData>) => void;
}

const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', description: 'Time for new beginnings and setting intentions' },
  { name: 'Waxing Crescent', emoji: '🌒', description: 'Building energy and taking action' },
  { name: 'First Quarter', emoji: '🌓', description: 'Making decisions and overcoming challenges' },
  { name: 'Waxing Gibbous', emoji: '🌔', description: 'Refining and perfecting your path' },
  { name: 'Full Moon', emoji: '🌕', description: 'Peak energy and manifestation' },
  { name: 'Waning Gibbous', emoji: '🌖', description: 'Gratitude and sharing wisdom' },
  { name: 'Last Quarter', emoji: '🌗', description: 'Releasing and letting go' },
  { name: 'Waning Crescent', emoji: '🌘', description: 'Rest and reflection' }
];

const SCHUMANN_FREQUENCIES = [
  { freq: 7.83, name: 'Base Resonance', description: 'Earth\'s fundamental frequency' },
  { freq: 14.3, name: 'Alpha States', description: 'Relaxed awareness and creativity' },
  { freq: 20.8, name: 'Beta States', description: 'Active thinking and focus' },
  { freq: 27.3, name: 'Gamma States', description: 'Higher consciousness and insight' }
];

export default function EnhancedSoulMap({ soulMapData, onUpdate }: EnhancedSoulMapProps) {
  const [currentMoonPhase, setCurrentMoonPhase] = useState('');
  const [schumannActivity, setSchumannActivity] = useState(7.83);

  useEffect(() => {
    // Simulate current moon phase calculation
    const moonPhaseIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 3.75)) % 8;
    setCurrentMoonPhase(MOON_PHASES[moonPhaseIndex].name);

    // Simulate Schumann resonance reading (normally would come from real data)
    const baseFreq = 7.83;
    const variation = (Math.sin(Date.now() / 100000) * 0.5) + Math.random() * 0.2;
    setSchumannActivity(baseFreq + variation);
  }, []);

  const getCurrentMoonPhaseData = () => {
    return MOON_PHASES.find(phase => phase.name === currentMoonPhase) || MOON_PHASES[0];
  };

  const getSchumannInterpretation = () => {
    if (schumannActivity < 8) return "Grounding and stability";
    if (schumannActivity < 15) return "Creative flow and inspiration";
    if (schumannActivity < 22) return "Mental clarity and focus";
    return "Heightened awareness and insight";
  };

  return (
    <div className="space-y-6">
      {/* Comprehensive Birth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stars className="h-5 w-5 text-purple-600" />
            Birth Chart Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Planetary Positions</h4>
              <div className="space-y-2">
                {soulMapData.planetaryPositions && Object.entries(soulMapData.planetaryPositions).map(([planet, data]: [string, any]) => (
                  <div key={planet} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="font-medium capitalize">{planet}</span>
                    <Badge variant="outline">{data.sign} {data.degree}°</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Houses & Aspects</h4>
              <div className="space-y-2">
                {soulMapData.houses && Object.entries(soulMapData.houses).slice(0, 6).map(([house, data]: [string, any]) => (
                  <div key={house} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm">House {house}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{data.sign}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {soulMapData.insights?.birthChart && (
            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold mb-2">Personal Insights</h4>
              <p className="text-gray-700 dark:text-gray-300">{soulMapData.insights.birthChart}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Moon Cycle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-blue-600" />
            Current Moon Cycle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{getCurrentMoonPhaseData().emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{currentMoonPhase}</h3>
              <p className="text-gray-600 dark:text-gray-400">{getCurrentMoonPhaseData().description}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Moon Guidance</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h5 className="font-medium">Focus Area</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentMoonPhase.includes('New') ? 'Setting intentions and new beginnings' :
                     currentMoonPhase.includes('Full') ? 'Manifestation and completion' :
                     currentMoonPhase.includes('Waxing') ? 'Growth and building energy' :
                     'Release and reflection'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h5 className="font-medium">Best Practices</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Align your activities with the moon's energy for optimal flow and results
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schumann Resonance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            Earth's Electromagnetic Field
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Current Resonance</h4>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{schumannActivity.toFixed(2)} Hz</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Schumann Frequency</p>
              </div>
              
              <div className="mt-4">
                <h5 className="font-medium mb-2">Interpretation</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">{getSchumannInterpretation()}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Frequency Bands</h4>
              <div className="space-y-2">
                {SCHUMANN_FREQUENCIES.map((freq, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <div>
                      <span className="font-medium">{freq.freq} Hz</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{freq.name}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      Math.abs(schumannActivity - freq.freq) < 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Star Placements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-600" />
            Star Placements & Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <h4 className="font-semibold">Sun Sign</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Core identity and ego</p>
              <Badge className="mt-2">{soulMapData.personalityProfile?.sunSign || 'Unknown'}</Badge>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Moon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold">Moon Sign</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Emotional nature and intuition</p>
              <Badge className="mt-2">{soulMapData.personalityProfile?.moonSign || 'Unknown'}</Badge>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Stars className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold">Rising Sign</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Outer personality and appearance</p>
              <Badge className="mt-2">{soulMapData.personalityProfile?.risingSign || 'Unknown'}</Badge>
            </div>
          </div>

          {soulMapData.report && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-3">Comprehensive Report</h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{soulMapData.report}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Life Path Guidance */}
      {soulMapData.lifePathGuidance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Life Path Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{soulMapData.lifePathGuidance}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}