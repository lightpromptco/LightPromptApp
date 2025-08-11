import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Stars, 
  Sun, 
  Moon, 
  Sparkles, 
  Eye, 
  Heart, 
  Compass, 
  MapPin, 
  Calendar, 
  Clock,
  Zap,
  Target,
  Gem,
  ArrowRight,
  RotateCcw,
  Download,
  Share2,
  MessageCircle,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Bot,
  Wand2,
  CircleDot,
  Triangle,
  Square,
  Hexagon,
  ChevronRight,
  Maximize2,
  Play,
  Send,
  User,
  Mountain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Zodiac signs with rich data for interactive exploration
const ZODIAC_SIGNS = [
  { 
    id: 'aries', name: 'Aries', element: 'Fire', dates: 'Mar 21 - Apr 19', 
    emoji: '♈', symbol: '🐏', color: 'from-red-500 to-orange-500',
    traits: ['Bold', 'Pioneering', 'Energetic', 'Independent'],
    soulPurpose: 'To lead and initiate new beginnings',
    challenge: 'Learning patience and considering others'
  },
  { 
    id: 'taurus', name: 'Taurus', element: 'Earth', dates: 'Apr 20 - May 20', 
    emoji: '♉', symbol: '🐂', color: 'from-green-600 to-emerald-500',
    traits: ['Grounded', 'Sensual', 'Determined', 'Loyal'],
    soulPurpose: 'To build lasting beauty and security',
    challenge: 'Embracing change and flexibility'
  },
  { 
    id: 'gemini', name: 'Gemini', element: 'Air', dates: 'May 21 - Jun 20', 
    emoji: '♊', symbol: '👥', color: 'from-yellow-400 to-amber-400',
    traits: ['Curious', 'Communicative', 'Adaptable', 'Witty'],
    soulPurpose: 'To connect ideas and people through communication',
    challenge: 'Finding depth amid endless curiosity'
  },
  { 
    id: 'cancer', name: 'Cancer', element: 'Water', dates: 'Jun 21 - Jul 22', 
    emoji: '♋', symbol: '🦀', color: 'from-blue-400 to-cyan-400',
    traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional'],
    soulPurpose: 'To nurture and protect what matters most',
    challenge: 'Balancing care for others with self-care'
  },
  { 
    id: 'leo', name: 'Leo', element: 'Fire', dates: 'Jul 23 - Aug 22', 
    emoji: '♌', symbol: '🦁', color: 'from-orange-500 to-yellow-500',
    traits: ['Creative', 'Generous', 'Dramatic', 'Confident'],
    soulPurpose: 'To shine your unique light and inspire others',
    challenge: 'Sharing the spotlight and authentic humility'
  },
  { 
    id: 'virgo', name: 'Virgo', element: 'Earth', dates: 'Aug 23 - Sep 22', 
    emoji: '♍', symbol: '👼', color: 'from-green-500 to-teal-500',
    traits: ['Practical', 'Analytical', 'Helpful', 'Perfectionist'],
    soulPurpose: 'To serve and improve the world through attention to detail',
    challenge: 'Accepting imperfection as part of growth'
  },
  { 
    id: 'libra', name: 'Libra', element: 'Air', dates: 'Sep 23 - Oct 22', 
    emoji: '♎', symbol: '⚖️', color: 'from-pink-400 to-rose-400',
    traits: ['Harmonious', 'Diplomatic', 'Aesthetic', 'Fair'],
    soulPurpose: 'To create balance and beauty in relationships',
    challenge: 'Making decisions and standing in your truth'
  },
  { 
    id: 'scorpio', name: 'Scorpio', element: 'Water', dates: 'Oct 23 - Nov 21', 
    emoji: '♏', symbol: '🦂', color: 'from-purple-600 to-indigo-600',
    traits: ['Intense', 'Transformative', 'Mysterious', 'Passionate'],
    soulPurpose: 'To transform through deep truth and healing',
    challenge: 'Trusting others and releasing control'
  },
  { 
    id: 'sagittarius', name: 'Sagittarius', element: 'Fire', dates: 'Nov 22 - Dec 21', 
    emoji: '♐', symbol: '🏹', color: 'from-blue-500 to-purple-500',
    traits: ['Adventurous', 'Philosophical', 'Optimistic', 'Freedom-loving'],
    soulPurpose: 'To explore truth and expand consciousness',
    challenge: 'Committing to depth over endless seeking'
  },
  { 
    id: 'capricorn', name: 'Capricorn', element: 'Earth', dates: 'Dec 22 - Jan 19', 
    emoji: '♑', symbol: '🐐', color: 'from-gray-600 to-slate-600',
    traits: ['Ambitious', 'Disciplined', 'Responsible', 'Patient'],
    soulPurpose: 'To build lasting structures and achieve mastery',
    challenge: 'Balancing work with joy and spontaneity'
  },
  { 
    id: 'aquarius', name: 'Aquarius', element: 'Air', dates: 'Jan 20 - Feb 18', 
    emoji: '♒', symbol: '🏺', color: 'from-cyan-500 to-blue-500',
    traits: ['Innovative', 'Independent', 'Humanitarian', 'Eccentric'],
    soulPurpose: 'To bring innovation for collective evolution',
    challenge: 'Balancing detachment with emotional connection'
  },
  { 
    id: 'pisces', name: 'Pisces', element: 'Water', dates: 'Feb 19 - Mar 20', 
    emoji: '♓', symbol: '🐟', color: 'from-indigo-500 to-purple-500',
    traits: ['Compassionate', 'Intuitive', 'Artistic', 'Spiritual'],
    soulPurpose: 'To heal through compassion and spiritual connection',
    challenge: 'Setting boundaries and staying grounded'
  }
];

// Interactive chart exploration areas with rich astrological data
const CHART_AREAS = [
  {
    id: 'sun',
    name: 'Sun ☉',
    icon: Sun,
    color: 'text-yellow-500',
    description: 'Your core essence, life force, and soul purpose',
    deepDescription: 'The Sun represents your fundamental identity, the core of who you are. It shows your life purpose, creative power, and how you express your authentic self. This is your conscious ego, your will to live, and the hero\'s journey of your soul.',
    questions: [
      'What is my soul purpose and life mission?', 
      'How do I shine my authentic light?', 
      'What does healthy ego expression look like for me?',
      'How can I step into my personal power?'
    ],
    coordinates: { x: 50, y: 50 },
    keywords: ['Identity', 'Purpose', 'Vitality', 'Leadership', 'Creative Power', 'Consciousness'],
    house: 'The house your Sun is in shows WHERE you shine brightest in life'
  },
  {
    id: 'moon',
    name: 'Moon ☽', 
    icon: Moon,
    color: 'text-blue-400',
    description: 'Your emotional world, inner needs, and subconscious patterns',
    deepDescription: 'The Moon represents your inner emotional landscape, your instinctive reactions, and what you need to feel secure and nurtured. It shows your subconscious patterns, your relationship with the feminine/receptive principle, and your intuitive wisdom.',
    questions: [
      'What do I need to feel emotionally secure?', 
      'How do I process and express emotions?', 
      'What are my deep subconscious patterns?',
      'How do I connect with my intuition?'
    ],
    coordinates: { x: 25, y: 25 },
    keywords: ['Emotions', 'Intuition', 'Security', 'Nurturing', 'Subconscious', 'Memory'],
    house: 'Your Moon\'s house shows WHERE you seek emotional fulfillment'
  },
  {
    id: 'rising',
    name: 'Rising ↗',
    icon: Eye,
    color: 'text-purple-500', 
    description: 'Your outer personality and first impressions',
    deepDescription: 'Your Rising sign (Ascendant) is the mask you wear in the world, your immediate reaction to new situations, and how others first perceive you. It\'s your approach to life, your physical appearance tendencies, and the lens through which you view the world.',
    questions: [
      'How do others see me when we first meet?', 
      'What persona do I naturally project?', 
      'How do I approach new situations?',
      'What is my instinctive survival strategy?'
    ],
    coordinates: { x: 85, y: 50 },
    keywords: ['First Impressions', 'Appearance', 'Approach', 'Mask', 'Physical Body', 'New Beginnings'],
    house: 'Rising sign determines your entire house system and life path'
  },
  {
    id: 'venus',
    name: 'Venus ♀',
    icon: Heart,
    color: 'text-pink-500',
    description: 'How you love, attract, and what you value',
    deepDescription: 'Venus governs love, beauty, values, and attraction. It shows how you express affection, what you find beautiful, your aesthetic sense, and how you attract abundance. This planet reveals your feminine principle and relationship to pleasure.',
    questions: [
      'How do I express and receive love?', 
      'What do I find truly beautiful?', 
      'How do I attract what I desire?',
      'What are my core values around relationships?'
    ],
    coordinates: { x: 35, y: 65 },
    keywords: ['Love', 'Beauty', 'Values', 'Attraction', 'Harmony', 'Pleasure'],
    house: 'Venus\' house shows WHERE you find beauty and seek harmonious relationships'
  },
  {
    id: 'mars',
    name: 'Mars ♂',
    icon: Zap,
    color: 'text-red-500',
    description: 'Your drive, passion, and how you take action',
    deepDescription: 'Mars represents your warrior energy, how you assert yourself, pursue goals, and express anger. It shows your sexual energy, competitive nature, and the masculine principle within you. This is your inner fire and how you fight for what you want.',
    questions: [
      'How do I pursue my goals and desires?', 
      'What ignites my passion and anger?', 
      'How do I assert myself in the world?',
      'Where do I need to be more courageous?'
    ],
    coordinates: { x: 65, y: 35 },
    keywords: ['Action', 'Passion', 'Anger', 'Courage', 'Competition', 'Sexuality'],
    house: 'Mars\' house shows WHERE you direct your energy and take action'
  },
  {
    id: 'mercury',
    name: 'Mercury ☿',
    icon: MessageCircle,
    color: 'text-green-500',
    description: 'How you think, communicate, and process information',
    deepDescription: 'Mercury governs communication, thinking patterns, learning style, and how you process information. It shows your intellectual approach, writing abilities, and how you connect ideas. This planet rules your nervous system and daily interactions.',
    questions: [
      'How do I learn and process information best?', 
      'What is my natural communication style?', 
      'How do I connect with others mentally?',
      'What topics fascinate my mind?'
    ],
    coordinates: { x: 42, y: 28 },
    keywords: ['Communication', 'Learning', 'Logic', 'Curiosity', 'Adaptability', 'Information'],
    house: 'Mercury\'s house shows WHERE you focus your mental energy and communication'
  },
  {
    id: 'jupiter',
    name: 'Jupiter ♃',
    icon: Target,
    color: 'text-blue-600',
    description: 'Your wisdom, expansion, and areas of abundance',
    deepDescription: 'Jupiter represents expansion, wisdom, higher learning, and where you experience good fortune. It shows your philosophical beliefs, teaching abilities, and areas where you naturally grow and prosper. This is your inner sage and optimistic vision.',
    questions: [
      'Where do I experience natural abundance?',
      'What wisdom do I have to share?',
      'How do I expand my consciousness?',
      'What are my philosophical beliefs?'
    ],
    coordinates: { x: 75, y: 65 },
    keywords: ['Wisdom', 'Expansion', 'Teaching', 'Philosophy', 'Abundance', 'Optimism'],
    house: 'Jupiter\'s house shows WHERE you experience growth and good fortune'
  },
  {
    id: 'saturn',
    name: 'Saturn ♄',
    icon: Mountain,
    color: 'text-gray-600',
    description: 'Your lessons, discipline, and where you build mastery',
    deepDescription: 'Saturn represents structure, discipline, karma, and the lessons you came here to learn. It shows where you face challenges that ultimately lead to mastery, your relationship with authority, and how you build lasting foundations in life.',
    questions: [
      'What life lessons am I here to master?',
      'Where do I need more discipline?',
      'How do I build lasting foundations?',
      'What fears must I transform into wisdom?'
    ],
    coordinates: { x: 20, y: 75 },
    keywords: ['Discipline', 'Mastery', 'Responsibility', 'Structure', 'Karma', 'Authority'],
    house: 'Saturn\'s house shows WHERE you face challenges that lead to mastery'
  }
];

export default function SoulMapExplorerPage() {
  const [currentView, setCurrentView] = useState<'welcome' | 'chart' | 'chat'>('welcome');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [birthData, setBirthData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('lightprompt-birth-data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.log('Failed to parse saved birth data');
      }
    }
    return {
      date: '',
      time: '',
      location: '',
      name: '',
      lat: null as number | null,
      lng: null as number | null
    };
  });
  
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{
    name: string;
    lat: number;
    lng: number;
    country: string;
  }>>([]);
  
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to your Soul Map Oracle! I'm here to help you explore your cosmic blueprint. What would you like to discover about yourself today?"
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Save birth data to localStorage whenever it changes
  useEffect(() => {
    if (birthData.date || birthData.time || birthData.location || birthData.name) {
      localStorage.setItem('lightprompt-birth-data', JSON.stringify(birthData));
    }
  }, [birthData]);

  // Location search function
  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    try {
      // Using a free geocoding service
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=demo&limit=5&pretty=1&no_annotations=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        const suggestions = data.results.map((result: any) => ({
          name: result.formatted,
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          country: result.components.country || ''
        }));
        setLocationSuggestions(suggestions);
        setShowLocationDropdown(true);
      }
    } catch (error) {
      console.log('Location search failed, using fallback');
      // Fallback to some common locations
      const commonLocations = [
        { name: 'New York, NY, USA', lat: 40.7128, lng: -74.0060, country: 'USA' },
        { name: 'Los Angeles, CA, USA', lat: 34.0522, lng: -118.2437, country: 'USA' },
        { name: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'UK' },
        { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'Japan' },
        { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, country: 'Australia' }
      ].filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
      
      setLocationSuggestions(commonLocations);
      setShowLocationDropdown(commonLocations.length > 0);
    }
  };

  // Handle location input change
  const handleLocationChange = (value: string) => {
    setBirthData((prev: typeof birthData) => ({ ...prev, location: value }));
    searchLocations(value);
  };

  // Handle location selection
  const selectLocation = (location: typeof locationSuggestions[0]) => {
    setBirthData((prev: typeof birthData) => ({
      ...prev,
      location: location.name,
      lat: location.lat,
      lng: location.lng
    }));
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
  };

  // Interactive chart component
  const InteractiveChart = () => (
    <div className="relative w-96 h-96 mx-auto">
      {/* Outer circle - chart wheel */}
      <div className="absolute inset-0 border-4 border-purple-300 rounded-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        
        {/* Zodiac wheel segments with enhanced interaction */}
        {ZODIAC_SIGNS.map((sign, index) => {
          const angle = (index * 30) - 90; // 30 degrees per sign, starting at top
          const x = 50 + 40 * Math.cos(angle * Math.PI / 180);
          const y = 50 + 40 * Math.sin(angle * Math.PI / 180);
          
          return (
            <div
              key={sign.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group hover:scale-125 transition-all duration-300"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedPlanet(sign.id)}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${sign.color} shadow-lg flex items-center justify-center text-white text-lg hover:shadow-xl transition-all duration-300 border-2 border-white ${selectedPlanet === sign.id ? 'ring-4 ring-purple-400 scale-125' : ''}`}>
                {sign.emoji}
              </div>
              
              {/* Sign name tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/80 text-white px-2 py-1 rounded-md">
                {sign.name}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
              </div>

              {/* Selected indicator */}
              {selectedPlanet === sign.id && (
                <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-pulse"></div>
              )}
            </div>
          );
        })}

        {/* Planet positions with enhanced styling */}
        {CHART_AREAS.map((planet) => (
          <div
            key={planet.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${planet.coordinates.x}%`, top: `${planet.coordinates.y}%` }}
            onClick={() => setSelectedPlanet(planet.id)}
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-xl flex items-center justify-center hover:scale-125 transition-all duration-300 group-hover:shadow-2xl border-2 border-gray-100 ${selectedPlanet === planet.id ? 'ring-4 ring-purple-400 scale-125 shadow-purple-200' : ''}`}>
              <planet.icon className={`w-6 h-6 ${planet.color} drop-shadow-sm`} />
            </div>
            
            {/* Planet name tooltip */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/80 text-white px-2 py-1 rounded-md">
              {planet.name}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
            </div>

            {/* Pulsing animation for selected planet */}
            {selectedPlanet === planet.id && (
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping"></div>
            )}
          </div>
        ))}

        {/* Center - soul essence with interactive core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-all duration-300 border-4 border-white/30"
            onClick={() => {
              setCurrentMessage("Tell me about my soul essence and core purpose based on my complete birth chart");
              setCurrentView('chat');
            }}
          >
            <Sparkles className="w-10 w-10 text-white animate-pulse" />
          </div>
          {/* Subtle rotating ring around center */}
          <div className="absolute w-32 h-32 border-2 border-purple-300/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
      </div>
    </div>
  );

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage = currentMessage;
    setCurrentMessage('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/chat/oracle', {
        message: userMessage,
        context: 'soul_map_exploration',
        birthData,
        selectedPlanet
      });
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      toast({
        title: "Oracle Unavailable",
        description: "The cosmic oracle is temporarily offline. Try again soon.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (currentView === 'welcome') {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
            <Compass className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white">
            Soul Map Navigator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover your cosmic blueprint without needing a psychic. Let AI be your mirror oracle for deep self-knowledge.
          </p>
          <Badge className="bg-gradient-to-r from-purple-500 to-teal-500 text-white">
            Interactive Astrology Explorer
          </Badge>
        </div>

        {/* Quick birth data input */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Stars className="w-5 h-5" />
              Enter Your Cosmic Coordinates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="date"
                placeholder="Birth Date"
                value={birthData.date}
                onChange={(e) => setBirthData((prev: typeof birthData) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Input
                type="time"
                placeholder="Birth Time (if known)"
                value={birthData.time}
                onChange={(e) => setBirthData((prev: typeof birthData) => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div className="relative">
              <Input
                placeholder="Birth Location (City, Country)"
                value={birthData.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                onFocus={() => {
                  if (birthData.location.length >= 3) {
                    searchLocations(birthData.location);
                  }
                }}
                onBlur={() => {
                  // Delay hiding dropdown to allow clicks
                  setTimeout(() => setShowLocationDropdown(false), 200);
                }}
              />
              
              {/* Location dropdown */}
              {showLocationDropdown && locationSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {locationSuggestions.map((location, index) => (
                    <button
                      key={index}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none text-sm"
                      onClick={() => selectLocation(location)}
                    >
                      <div className="font-medium">{location.name}</div>
                      {location.country && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{location.country}</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button 
              onClick={() => setCurrentView('chart')} 
              className="w-full bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600"
              disabled={!birthData.date}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Explore My Soul Map
            </Button>
          </CardContent>
        </Card>

        {/* Features preview */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="text-center p-6">
            <CircleDot className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="font-semibold mb-2">Interactive Chart</h3>
            <p className="text-sm text-muted-foreground">Click and explore every part of your birth chart</p>
          </Card>
          <Card className="text-center p-6">
            <Bot className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="font-semibold mb-2">AI Oracle</h3>
            <p className="text-sm text-muted-foreground">Ask questions and get personalized insights</p>
          </Card>
          <Card className="text-center p-6">
            <Target className="w-12 h-12 mx-auto mb-4 text-teal-500" />
            <h3 className="font-semibold mb-2">Soul Purpose</h3>
            <p className="text-sm text-muted-foreground">Discover your cosmic mission and gifts</p>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === 'chart') {
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Soul Map</h1>
            <p className="text-muted-foreground">Click any planet or sign to explore deeper</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentView('chat')}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Oracle
            </Button>
            <Button variant="outline" onClick={() => setCurrentView('welcome')}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Edit Birth Data
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interactive Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Your Cosmic Blueprint</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Born {birthData.date} {birthData.time && `at ${birthData.time}`} {birthData.location && `in ${birthData.location}`}
                </p>
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <InteractiveChart />
              </CardContent>
            </Card>
          </div>

          {/* Planet/Sign Details */}
          <div className="space-y-6">
            {selectedPlanet ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {CHART_AREAS.find(p => p.id === selectedPlanet)?.icon && (
                      <div className={CHART_AREAS.find(p => p.id === selectedPlanet)?.color}>
                        {(() => {
                          const Planet = CHART_AREAS.find(p => p.id === selectedPlanet)?.icon;
                          return Planet ? <Planet className="w-5 h-5" /> : null;
                        })()}
                      </div>
                    )}
                    {CHART_AREAS.find(p => p.id === selectedPlanet)?.name || 
                     ZODIAC_SIGNS.find(s => s.id === selectedPlanet)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(() => {
                    const planet = CHART_AREAS.find(p => p.id === selectedPlanet);
                    const sign = ZODIAC_SIGNS.find(s => s.id === selectedPlanet);
                    
                    if (planet) {
                      return (
                        <>
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">{planet.description}</p>
                            <details className="group">
                              <summary className="cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-800">
                                Deep Dive ↓
                              </summary>
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed border-l-2 border-purple-200 pl-3">
                                {planet.deepDescription}
                              </p>
                            </details>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Gem className="w-4 h-4 text-purple-500" />
                              Key Themes
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {planet.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-500" />
                              House Wisdom
                            </h4>
                            <p className="text-sm text-muted-foreground italic">{planet.house}</p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Bot className="w-4 h-4 text-purple-500" />
                              Ask the Oracle
                            </h4>
                            <div className="space-y-2">
                              {planet.questions.map((question, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-left h-auto p-3 justify-start hover:bg-purple-50 hover:border-purple-200"
                                  onClick={() => {
                                    setCurrentMessage(question);
                                    setCurrentView('chat');
                                  }}
                                >
                                  <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0 text-purple-500" />
                                  <span className="text-xs">{question}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    }
                    
                    if (sign) {
                      return (
                        <>
                          <div className="text-center space-y-3">
                            <div className="text-6xl mb-2">{sign.symbol}</div>
                            <div>
                              <h3 className="text-xl font-bold">{sign.name}</h3>
                              <p className="text-sm text-muted-foreground">{sign.dates}</p>
                            </div>
                            <Badge className={`bg-gradient-to-r ${sign.color} text-white text-sm px-3 py-1`}>
                              {sign.element} Sign
                            </Badge>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                Core Traits
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {sign.traits.map((trait, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4 text-blue-500" />
                                Soul Purpose
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{sign.soulPurpose}</p>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                Growth Challenge
                              </h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{sign.challenge}</p>
                            </div>

                            <Button
                              onClick={() => {
                                setCurrentMessage(`Tell me more about ${sign.name} energy and how it shows up in my life. I'd like to understand this sign's influence on my personality and soul purpose.`);
                                setCurrentView('chat');
                              }}
                              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                              size="sm"
                            >
                              <Bot className="w-3 h-3 mr-2" />
                              Ask Oracle About {sign.name}
                            </Button>
                          </div>
                        </>
                      );
                    }
                    
                    return null;
                  })()}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center p-8">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">Explore Your Chart</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any planet or zodiac sign in your chart to discover its meaning in your life.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Oracle Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-500" />
                  Quick Oracle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setCurrentMessage("What is my soul purpose based on my chart?");
                      setCurrentView('chat');
                    }}
                  >
                    <Target className="w-3 h-3 mr-2" />
                    My Soul Purpose
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setCurrentMessage("What are my greatest gifts and how can I use them?");
                      setCurrentView('chat');
                    }}
                  >
                    <Gem className="w-3 h-3 mr-2" />
                    My Gifts & Talents
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setCurrentMessage("What challenges am I here to overcome?");
                      setCurrentView('chat');
                    }}
                  >
                    <TrendingUp className="w-3 h-3 mr-2" />
                    Growth Challenges
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'chat') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bot className="w-8 h-8 text-purple-500" />
              Soul Map Oracle
            </h1>
            <p className="text-muted-foreground">Ask anything about your cosmic blueprint</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('chart')}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Back to Chart
          </Button>
        </div>

        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 p-6 overflow-auto space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-purple-500 text-white ml-4'
                      : 'bg-gray-100 dark:bg-gray-800 mr-4'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <Bot className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <User className="w-4 h-4 text-purple-100 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mr-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500 animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask the oracle anything about your soul purpose, gifts, challenges..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isGenerating}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}