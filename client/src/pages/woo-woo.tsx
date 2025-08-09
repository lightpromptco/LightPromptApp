import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Stars, 
  Moon, 
  Sun, 
  Compass, 
  Sparkles,
  Eye,
  Heart,
  Brain,
  Zap,
  Mountain,
  Waves,
  Flame,
  Wind
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const ZODIAC_SIGNS = [
  { id: 'aries', name: 'Aries', element: 'Fire', dates: 'Mar 21 - Apr 19', emoji: '♈', color: 'from-red-500 to-orange-500' },
  { id: 'taurus', name: 'Taurus', element: 'Earth', dates: 'Apr 20 - May 20', emoji: '♉', color: 'from-green-600 to-emerald-500' },
  { id: 'gemini', name: 'Gemini', element: 'Air', dates: 'May 21 - Jun 20', emoji: '♊', color: 'from-yellow-400 to-amber-400' },
  { id: 'cancer', name: 'Cancer', element: 'Water', dates: 'Jun 21 - Jul 22', emoji: '♋', color: 'from-blue-400 to-cyan-400' },
  { id: 'leo', name: 'Leo', element: 'Fire', dates: 'Jul 23 - Aug 22', emoji: '♌', color: 'from-orange-500 to-yellow-500' },
  { id: 'virgo', name: 'Virgo', element: 'Earth', dates: 'Aug 23 - Sep 22', emoji: '♍', color: 'from-green-500 to-teal-500' },
  { id: 'libra', name: 'Libra', element: 'Air', dates: 'Sep 23 - Oct 22', emoji: '♎', color: 'from-pink-400 to-rose-400' },
  { id: 'scorpio', name: 'Scorpio', element: 'Water', dates: 'Oct 23 - Nov 21', emoji: '♏', color: 'from-purple-600 to-indigo-600' },
  { id: 'sagittarius', name: 'Sagittarius', element: 'Fire', dates: 'Nov 22 - Dec 21', emoji: '♐', color: 'from-blue-500 to-purple-500' },
  { id: 'capricorn', name: 'Capricorn', element: 'Earth', dates: 'Dec 22 - Jan 19', emoji: '♑', color: 'from-gray-600 to-slate-600' },
  { id: 'aquarius', name: 'Aquarius', element: 'Air', dates: 'Jan 20 - Feb 18', emoji: '♒', color: 'from-cyan-500 to-blue-500' },
  { id: 'pisces', name: 'Pisces', element: 'Water', dates: 'Feb 19 - Mar 20', emoji: '♓', color: 'from-indigo-500 to-purple-500' }
];

const BIRTH_TIME_OPTIONS = [
  'Dawn (5-7 AM)', 'Morning (7-11 AM)', 'Midday (11 AM-1 PM)', 
  'Afternoon (1-5 PM)', 'Evening (5-8 PM)', 'Night (8-11 PM)', 
  'Late Night (11 PM-2 AM)', 'Deep Night (2-5 AM)', 'Unknown'
];

const PERSONALITY_ASPECTS = [
  { id: 'core_essence', name: 'Core Essence', icon: Heart, description: 'Your soul\'s fundamental nature' },
  { id: 'mind_patterns', name: 'Mind Patterns', icon: Brain, description: 'How you process and think' },
  { id: 'emotional_landscape', name: 'Emotional Landscape', icon: Waves, description: 'Your feeling world and intuition' },
  { id: 'energy_signature', name: 'Energy Signature', icon: Zap, description: 'Your vital force and presence' },
  { id: 'shadow_gifts', name: 'Shadow Gifts', icon: Moon, description: 'Hidden potentials and blind spots' },
  { id: 'life_purpose', name: 'Life Purpose', icon: Mountain, description: 'Your soul\'s mission and direction' }
];

export default function WooWooPage() {
  const [currentView, setCurrentView] = useState<'intro' | 'input' | 'analysis' | 'report'>('intro');
  const [birthData, setBirthData] = useState({
    birthDate: '',
    birthTime: '',
    birthLocation: '',
    name: '',
    questions: {
      intuition: '',
      challenges: '',
      gifts: '',
      purpose: ''
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/users/email/lightprompt.co@gmail.com'],
  });

  // Get existing soul map if available
  const { data: soulMap } = useQuery({
    queryKey: ['/api/soul-map', user?.id],
    enabled: !!user?.id,
  });

  // Generate soul map mutation
  const generateSoulMapMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsGenerating(true);
      return apiRequest("POST", "/api/soul-map/generate", {
        ...data,
        userId: user?.id
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/soul-map'] });
      setCurrentView('report');
      toast({
        title: "Soul Map Generated",
        description: "Your cosmic blueprint is ready for exploration",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Error",
        description: "Unable to generate your soul map. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsGenerating(false);
    }
  });

  const handleGenerateAnalysis = () => {
    generateSoulMapMutation.mutate(birthData);
  };

  // Determine zodiac sign from birth date
  const getZodiacSign = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Simplified zodiac calculation
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return ZODIAC_SIGNS.find(s => s.id === 'aries');
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return ZODIAC_SIGNS.find(s => s.id === 'taurus');
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return ZODIAC_SIGNS.find(s => s.id === 'gemini');
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return ZODIAC_SIGNS.find(s => s.id === 'cancer');
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return ZODIAC_SIGNS.find(s => s.id === 'leo');
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return ZODIAC_SIGNS.find(s => s.id === 'virgo');
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return ZODIAC_SIGNS.find(s => s.id === 'libra');
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return ZODIAC_SIGNS.find(s => s.id === 'scorpio');
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return ZODIAC_SIGNS.find(s => s.id === 'sagittarius');
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return ZODIAC_SIGNS.find(s => s.id === 'capricorn');
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return ZODIAC_SIGNS.find(s => s.id === 'aquarius');
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return ZODIAC_SIGNS.find(s => s.id === 'pisces');
    
    return null;
  };

  const zodiacSign = getZodiacSign(birthData.birthDate);

  // Intro View
  if (currentView === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <Stars className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Soul Map
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your cosmic blueprint through birth chart analysis and deep personality insights. 
            Understand your shadows, gifts, and potentials when you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-purple-500" />
                Birth Chart Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Your birth chart reveals the cosmic energies present at your moment of arrival. 
                We'll analyze planetary positions, house placements, and aspect patterns to 
                uncover your soul's blueprint.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Sun, Moon & Rising sign influences</li>
                <li>• Planetary house positions</li>
                <li>• Major aspect patterns</li>
                <li>• Elemental balance analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                Personality Deep Dive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Beyond the stars, we explore your unique psychological patterns, 
                emotional landscape, and the beautiful shadows that hold your greatest gifts.
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Core essence & motivations</li>
                <li>• Emotional processing patterns</li>
                <li>• Shadow work opportunities</li>
                <li>• Life purpose indicators</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground italic">
            "The privilege of a lifetime is to become who you truly are." - Carl Jung
          </p>
          
          {soulMap ? (
            <div className="space-y-3">
              <p className="text-green-600 dark:text-green-400 font-medium">
                You have an existing Soul Map ready to explore
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setCurrentView('report')} size="lg">
                  View Your Soul Map
                </Button>
                <Button variant="outline" onClick={() => setCurrentView('input')} size="lg">
                  Create New Analysis
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setCurrentView('input')} size="lg">
              Begin Your Soul Map Journey
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Input View
  if (currentView === 'input') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Create Your Soul Map</h2>
          <p className="text-muted-foreground">
            Share your birth details and inner reflections for a personalized cosmic analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Birth Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={birthData.name}
                onChange={(e) => setBirthData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="What should we call you?"
              />
            </div>

            <div>
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthData.birthDate}
                onChange={(e) => setBirthData(prev => ({ ...prev, birthDate: e.target.value }))}
              />
              {zodiacSign && (
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-8 h-8 bg-gradient-to-r ${zodiacSign.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                    {zodiacSign.emoji}
                  </div>
                  <span className="text-sm font-medium">{zodiacSign.name}</span>
                  <Badge variant="outline">{zodiacSign.element}</Badge>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="birthTime">Birth Time (approximate is fine)</Label>
              <Select
                value={birthData.birthTime}
                onValueChange={(value) => setBirthData(prev => ({ ...prev, birthTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select approximate time" />
                </SelectTrigger>
                <SelectContent>
                  {BIRTH_TIME_OPTIONS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="birthLocation">Birth Location (City, Country)</Label>
              <Input
                id="birthLocation"
                value={birthData.birthLocation}
                onChange={(e) => setBirthData(prev => ({ ...prev, birthLocation: e.target.value }))}
                placeholder="Where were you born?"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Soul Reflection Questions</CardTitle>
            <p className="text-sm text-muted-foreground">
              These help create a more personalized analysis
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="intuition">What does your intuition tell you about your life purpose?</Label>
              <Textarea
                id="intuition"
                value={birthData.questions.intuition}
                onChange={(e) => setBirthData(prev => ({ 
                  ...prev, 
                  questions: { ...prev.questions, intuition: e.target.value }
                }))}
                placeholder="Share your inner knowing..."
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="challenges">What patterns or challenges do you notice repeating in your life?</Label>
              <Textarea
                id="challenges"
                value={birthData.questions.challenges}
                onChange={(e) => setBirthData(prev => ({ 
                  ...prev, 
                  questions: { ...prev.questions, challenges: e.target.value }
                }))}
                placeholder="What keeps showing up for you to learn?"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="gifts">What do others say are your natural gifts or strengths?</Label>
              <Textarea
                id="gifts"
                value={birthData.questions.gifts}
                onChange={(e) => setBirthData(prev => ({ 
                  ...prev, 
                  questions: { ...prev.questions, gifts: e.target.value }
                }))}
                placeholder="What comes naturally to you?"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="purpose">If you could contribute one thing to the world, what would it be?</Label>
              <Textarea
                id="purpose"
                value={birthData.questions.purpose}
                onChange={(e) => setBirthData(prev => ({ 
                  ...prev, 
                  questions: { ...prev.questions, purpose: e.target.value }
                }))}
                placeholder="What feels most meaningful to you?"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setCurrentView('intro')}>
            Back
          </Button>
          <Button 
            onClick={handleGenerateAnalysis}
            disabled={!birthData.birthDate || !birthData.name || isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Generating Your Soul Map...
              </>
            ) : (
              <>
                <Stars className="h-4 w-4 mr-2" />
                Generate Soul Map
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                    <Stars className="h-8 w-8 text-white animate-pulse" />
                  </div>
                  <h3 className="font-medium">Consulting the Cosmic Archives</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Our AI is analyzing your birth chart, personality patterns, and soul reflections...
                  </p>
                </div>
                <Progress value={33} className="w-full" />
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div>Planetary Positions</div>
                  <div>Aspect Analysis</div>
                  <div>Soul Integration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Report View (placeholder for now - will be populated with generated analysis)
  if (currentView === 'report') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center">
            <Stars className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Your Soul Map</h1>
          <p className="text-muted-foreground">
            A cosmic blueprint for understanding your authentic self
          </p>
        </div>

        {/* Zodiac Sign Display */}
        {zodiacSign && (
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${zodiacSign.color} rounded-full flex items-center justify-center text-white text-2xl`}>
                  {zodiacSign.emoji}
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">{zodiacSign.name}</h2>
                  <p className="text-muted-foreground">{zodiacSign.dates}</p>
                  <Badge variant="outline" className="mt-1">{zodiacSign.element} Sign</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personality Aspects */}
        <div className="grid md:grid-cols-2 gap-6">
          {PERSONALITY_ASPECTS.map((aspect) => {
            const IconComponent = aspect.icon;
            return (
              <Card key={aspect.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-purple-500" />
                    {aspect.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{aspect.description}</p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm italic">
                      "Analysis will appear here when your Soul Map is generated..."
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Ready to dive deeper into your cosmic blueprint? Consider pairing this with a Vision Quest for complete self-understanding.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setCurrentView('input')}>
              Create New Analysis
            </Button>
            <Button onClick={() => window.location.href = '/vision-quest'}>
              Begin Vision Quest
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}