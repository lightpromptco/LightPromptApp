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
  Mountain,
  Minimize2,
  Briefcase,
  Palette,
  CloudRain,
  Sunset,
  Waves
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InteractiveNatalChart } from "@/components/InteractiveNatalChart";

// Soul-tech helper functions
const getCurrentMoonPhase = () => {
  const phases = ['🌑 New Moon', '🌒 Waxing Crescent', '🌓 First Quarter', '🌔 Waxing Gibbous', '🌕 Full Moon', '🌖 Waning Gibbous', '🌗 Last Quarter', '🌘 Waning Crescent'];
  const now = new Date();
  const dayOfMonth = now.getDate();
  const phaseIndex = Math.floor((dayOfMonth / 30) * 8) % 8;
  return phases[phaseIndex];
};

const getMayanDaySign = () => {
  const mayanSigns = ['Imix', 'Ik', 'Akbal', 'Kan', 'Chicchan', 'Cimi', 'Manik', 'Lamat', 'Muluc', 'Oc', 'Chuen', 'Eb', 'Ben', 'Ix', 'Men', 'Cib', 'Caban', 'Etznab', 'Cauac', 'Ahau'];
  const now = new Date();
  const dayIndex = Math.floor((now.getTime() / (1000 * 60 * 60 * 24)) % 20);
  return mayanSigns[dayIndex];
};

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
  const [currentView, setCurrentView] = useState<'welcome' | 'chart' | 'chat'>('chart');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [zenMode, setZenMode] = useState(false);
  const [zenBackground, setZenBackground] = useState<'sunset' | 'ocean' | 'forest' | 'cosmic'>('sunset');
  const [birthData, setBirthData] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('lightprompt-birth-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        console.log('Loaded birth data from localStorage:', data);
        return data;
      } catch (e) {
        console.log('Failed to parse saved birth data');
      }
    }
    // Use default test data for testing oracle functionality
    const defaultData = {
      date: '1992-02-17',
      time: '',
      location: 'Temple, TX, USA',
      name: '',
      lat: 31.0982 as number | null,
      lng: -97.3428 as number | null
    };
    console.log('Using default birth data for testing:', defaultData);
    return defaultData;
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

  // Calculate sun sign from birth date
  const calculateSunSign = (birthDate: string): string => {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'aries';
    else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'taurus';
    else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'gemini';
    else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'cancer';
    else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'leo';
    else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'virgo';
    else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'libra';
    else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'scorpio';
    else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'sagittarius';
    else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'capricorn';
    else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'aquarius';
    else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'pisces';
    return 'aquarius'; // default for edge cases
  };

  // State for comprehensive chart data
  const [chartData, setChartData] = useState<any>(null);
  const [chartAccuracy, setChartAccuracy] = useState<'high' | 'medium' | 'low'>('medium');
  const [chartRecommendations, setChartRecommendations] = useState<string[]>([]);

  // Calculate comprehensive astrological chart
  useEffect(() => {
    if (birthData.date && birthData.lat && birthData.lng) {
      const calculateChart = async () => {
        try {
          const response = await apiRequest('POST', '/api/astrology/chart', { birthData });
          const data = await response.json();
          
          setChartData(data.chart);
          setChartAccuracy(data.accuracy);
          setChartRecommendations(data.recommendations);
          
          // Auto-select user's sun sign from calculated chart
          if (data.chart.sun && !selectedPlanet) {
            setSelectedPlanet(data.chart.sun.sign);
            console.log(`Auto-selected sun sign from chart: ${data.chart.sun.sign} at ${data.chart.sun.degree}°`);
          }
        } catch (error) {
          console.error('Failed to calculate astrological chart:', error);
          
          // Fallback to basic sun sign calculation
          const sunSign = calculateSunSign(birthData.date);
          setSelectedPlanet(sunSign);
          console.log(`Fallback to basic sun sign: ${sunSign} for birth date: ${birthData.date}`);
        }
      };
      
      calculateChart();
    } else if (birthData.date && !selectedPlanet) {
      // Fallback to basic calculation if coordinates missing
      const sunSign = calculateSunSign(birthData.date);
      setSelectedPlanet(sunSign);
      console.log(`Basic sun sign calculation: ${sunSign} for birth date: ${birthData.date}`);
    }
  }, [birthData.date, birthData.lat, birthData.lng, selectedPlanet]);

  // Save birth data to Supabase whenever it changes - NEVER localStorage
  useEffect(() => {
    if (birthData.date || birthData.time || birthData.location || birthData.name) {
      const saveBirthDataToSupabase = async () => {
        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser?.id,
              birthData: birthData,
            }),
          });
          if (response.ok) {
            console.log('Birth data saved to Supabase database');
          }
        } catch (error) {
          console.error('Failed to save birth data to Supabase:', error);
        }
      };
      
      saveBirthDataToSupabase();
    }
  }, [birthData, currentUser?.id]);

  // Location search function
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      return;
    }

    // Extended list of common global locations for fallback
    const globalLocations = [
      // USA
      { name: 'New York, NY, USA', lat: 40.7128, lng: -74.0060, country: 'USA' },
      { name: 'Los Angeles, CA, USA', lat: 34.0522, lng: -118.2437, country: 'USA' },
      { name: 'Chicago, IL, USA', lat: 41.8781, lng: -87.6298, country: 'USA' },
      { name: 'Houston, TX, USA', lat: 29.7604, lng: -95.3698, country: 'USA' },
      { name: 'Phoenix, AZ, USA', lat: 33.4484, lng: -112.0740, country: 'USA' },
      { name: 'Philadelphia, PA, USA', lat: 39.9526, lng: -75.1652, country: 'USA' },
      { name: 'San Antonio, TX, USA', lat: 29.4241, lng: -98.4936, country: 'USA' },
      { name: 'San Diego, CA, USA', lat: 32.7157, lng: -117.1611, country: 'USA' },
      { name: 'Dallas, TX, USA', lat: 32.7767, lng: -96.7970, country: 'USA' },
      { name: 'San Jose, CA, USA', lat: 37.3382, lng: -121.8863, country: 'USA' },
      { name: 'Austin, TX, USA', lat: 30.2672, lng: -97.7431, country: 'USA' },
      { name: 'Jacksonville, FL, USA', lat: 30.3322, lng: -81.6557, country: 'USA' },
      { name: 'Fort Worth, TX, USA', lat: 32.7555, lng: -97.3308, country: 'USA' },
      { name: 'Columbus, OH, USA', lat: 39.9612, lng: -82.9988, country: 'USA' },
      { name: 'Charlotte, NC, USA', lat: 35.2271, lng: -80.8431, country: 'USA' },
      { name: 'San Francisco, CA, USA', lat: 37.7749, lng: -122.4194, country: 'USA' },
      { name: 'Indianapolis, IN, USA', lat: 39.7684, lng: -86.1581, country: 'USA' },
      { name: 'Seattle, WA, USA', lat: 47.6062, lng: -122.3321, country: 'USA' },
      { name: 'Denver, CO, USA', lat: 39.7392, lng: -104.9903, country: 'USA' },
      { name: 'Washington, DC, USA', lat: 38.9072, lng: -77.0369, country: 'USA' },
      { name: 'Boston, MA, USA', lat: 42.3601, lng: -71.0589, country: 'USA' },
      { name: 'Nashville, TN, USA', lat: 36.1627, lng: -86.7816, country: 'USA' },
      { name: 'Baltimore, MD, USA', lat: 39.2904, lng: -76.6122, country: 'USA' },
      { name: 'Oklahoma City, OK, USA', lat: 35.4676, lng: -97.5164, country: 'USA' },
      { name: 'Portland, OR, USA', lat: 45.5152, lng: -122.6784, country: 'USA' },
      { name: 'Las Vegas, NV, USA', lat: 36.1699, lng: -115.1398, country: 'USA' },
      { name: 'Louisville, KY, USA', lat: 38.2527, lng: -85.7585, country: 'USA' },
      { name: 'Milwaukee, WI, USA', lat: 43.0389, lng: -87.9065, country: 'USA' },
      { name: 'Albuquerque, NM, USA', lat: 35.0844, lng: -106.6504, country: 'USA' },
      { name: 'Tucson, AZ, USA', lat: 32.2226, lng: -110.9747, country: 'USA' },
      { name: 'Fresno, CA, USA', lat: 36.7378, lng: -119.7871, country: 'USA' },
      { name: 'Sacramento, CA, USA', lat: 38.5816, lng: -121.4944, country: 'USA' },
      { name: 'Kansas City, MO, USA', lat: 39.0997, lng: -94.5786, country: 'USA' },
      { name: 'Mesa, AZ, USA', lat: 33.4152, lng: -111.8315, country: 'USA' },
      { name: 'Atlanta, GA, USA', lat: 33.7490, lng: -84.3880, country: 'USA' },
      { name: 'Colorado Springs, CO, USA', lat: 38.8339, lng: -104.8214, country: 'USA' },
      { name: 'Virginia Beach, VA, USA', lat: 36.8529, lng: -75.9780, country: 'USA' },
      { name: 'Raleigh, NC, USA', lat: 35.7796, lng: -78.6382, country: 'USA' },
      { name: 'Omaha, NE, USA', lat: 41.2565, lng: -95.9345, country: 'USA' },
      { name: 'Miami, FL, USA', lat: 25.7617, lng: -80.1918, country: 'USA' },
      { name: 'Long Beach, CA, USA', lat: 33.7701, lng: -118.1937, country: 'USA' },
      { name: 'Virginia Beach, VA, USA', lat: 36.8529, lng: -75.9780, country: 'USA' },
      { name: 'Oakland, CA, USA', lat: 37.8044, lng: -122.2712, country: 'USA' },
      { name: 'Minneapolis, MN, USA', lat: 44.9778, lng: -93.2650, country: 'USA' },
      { name: 'Tulsa, OK, USA', lat: 36.1540, lng: -95.9928, country: 'USA' },
      { name: 'Arlington, TX, USA', lat: 32.7357, lng: -97.1081, country: 'USA' },
      { name: 'Tampa, FL, USA', lat: 27.9506, lng: -82.4572, country: 'USA' },
      { name: 'New Orleans, LA, USA', lat: 29.9511, lng: -90.0715, country: 'USA' },
      { name: 'Wichita, KS, USA', lat: 37.6872, lng: -97.3301, country: 'USA' },
      { name: 'Cleveland, OH, USA', lat: 41.4993, lng: -81.6944, country: 'USA' },
      { name: 'Bakersfield, CA, USA', lat: 35.3733, lng: -119.0187, country: 'USA' },
      { name: 'Aurora, CO, USA', lat: 39.7294, lng: -104.8319, country: 'USA' },
      { name: 'Anaheim, CA, USA', lat: 33.8366, lng: -117.9143, country: 'USA' },
      { name: 'Honolulu, HI, USA', lat: 21.3099, lng: -157.8581, country: 'USA' },
      { name: 'Santa Ana, CA, USA', lat: 33.7455, lng: -117.8677, country: 'USA' },
      { name: 'Riverside, CA, USA', lat: 33.9533, lng: -117.3962, country: 'USA' },
      { name: 'Corpus Christi, TX, USA', lat: 27.8006, lng: -97.3964, country: 'USA' },
      { name: 'Lexington, KY, USA', lat: 38.0406, lng: -84.5037, country: 'USA' },
      { name: 'Stockton, CA, USA', lat: 37.9577, lng: -121.2908, country: 'USA' },
      { name: 'Henderson, NV, USA', lat: 36.0395, lng: -114.9817, country: 'USA' },
      { name: 'Saint Paul, MN, USA', lat: 44.9537, lng: -93.0900, country: 'USA' },
      { name: 'St. Louis, MO, USA', lat: 38.6270, lng: -90.1994, country: 'USA' },
      { name: 'Cincinnati, OH, USA', lat: 39.1031, lng: -84.5120, country: 'USA' },
      { name: 'Pittsburgh, PA, USA', lat: 40.4406, lng: -79.9959, country: 'USA' },
      { name: 'Greensboro, NC, USA', lat: 36.0726, lng: -79.7920, country: 'USA' },
      { name: 'Lincoln, NE, USA', lat: 40.8136, lng: -96.7026, country: 'USA' },
      { name: 'Plano, TX, USA', lat: 33.0198, lng: -96.6989, country: 'USA' },
      { name: 'Anchorage, AK, USA', lat: 61.2181, lng: -149.9003, country: 'USA' },
      { name: 'Buffalo, NY, USA', lat: 42.8864, lng: -78.8784, country: 'USA' },
      { name: 'Fort Wayne, IN, USA', lat: 41.0793, lng: -85.1394, country: 'USA' },
      { name: 'Jersey City, NJ, USA', lat: 40.7178, lng: -74.0431, country: 'USA' },
      { name: 'Chula Vista, CA, USA', lat: 32.6401, lng: -117.0842, country: 'USA' },
      { name: 'Orlando, FL, USA', lat: 28.5383, lng: -81.3792, country: 'USA' },
      { name: 'Norfolk, VA, USA', lat: 36.8468, lng: -76.2852, country: 'USA' },
      { name: 'Chandler, AZ, USA', lat: 33.3062, lng: -111.8413, country: 'USA' },
      { name: 'Laredo, TX, USA', lat: 27.5306, lng: -99.4803, country: 'USA' },
      { name: 'Madison, WI, USA', lat: 43.0731, lng: -89.4012, country: 'USA' },
      { name: 'Durham, NC, USA', lat: 35.9940, lng: -78.8986, country: 'USA' },
      { name: 'Lubbock, TX, USA', lat: 33.5779, lng: -101.8552, country: 'USA' },
      { name: 'Winston-Salem, NC, USA', lat: 36.0999, lng: -80.2442, country: 'USA' },
      { name: 'Garland, TX, USA', lat: 32.9126, lng: -96.6389, country: 'USA' },
      { name: 'Glendale, AZ, USA', lat: 33.5387, lng: -112.1860, country: 'USA' },
      { name: 'Hialeah, FL, USA', lat: 25.8576, lng: -80.2781, country: 'USA' },
      { name: 'Reno, NV, USA', lat: 39.5296, lng: -119.8138, country: 'USA' },
      { name: 'Baton Rouge, LA, USA', lat: 30.4515, lng: -91.1871, country: 'USA' },
      { name: 'Irvine, CA, USA', lat: 33.6846, lng: -117.8265, country: 'USA' },
      { name: 'Chesapeake, VA, USA', lat: 36.7682, lng: -76.2875, country: 'USA' },
      { name: 'Irving, TX, USA', lat: 32.8140, lng: -96.9489, country: 'USA' },
      { name: 'Scottsdale, AZ, USA', lat: 33.4942, lng: -111.9261, country: 'USA' },
      { name: 'North Las Vegas, NV, USA', lat: 36.1989, lng: -115.1175, country: 'USA' },
      { name: 'Fremont, CA, USA', lat: 37.5485, lng: -121.9886, country: 'USA' },
      { name: 'Gilbert, AZ, USA', lat: 33.3528, lng: -111.7890, country: 'USA' },
      { name: 'San Bernardino, CA, USA', lat: 34.1083, lng: -117.2898, country: 'USA' },
      { name: 'Boise, ID, USA', lat: 43.6150, lng: -116.2023, country: 'USA' },
      { name: 'Birmingham, AL, USA', lat: 33.5207, lng: -86.8025, country: 'USA' },
      
      // International
      { name: 'London, UK', lat: 51.5074, lng: -0.1278, country: 'UK' },
      { name: 'Manchester, UK', lat: 53.4808, lng: -2.2426, country: 'UK' },
      { name: 'Edinburgh, UK', lat: 55.9533, lng: -3.1883, country: 'UK' },
      { name: 'Birmingham, UK', lat: 52.4862, lng: -1.8904, country: 'UK' },
      { name: 'Liverpool, UK', lat: 53.4084, lng: -2.9916, country: 'UK' },
      { name: 'Glasgow, UK', lat: 55.8642, lng: -4.2518, country: 'UK' },
      { name: 'Leeds, UK', lat: 53.8008, lng: -1.5491, country: 'UK' },
      { name: 'Sheffield, UK', lat: 53.3811, lng: -1.4701, country: 'UK' },
      { name: 'Bristol, UK', lat: 51.4545, lng: -2.5879, country: 'UK' },
      { name: 'Newcastle, UK', lat: 54.9783, lng: -1.6178, country: 'UK' },
      
      { name: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, country: 'Canada' },
      { name: 'Montreal, Canada', lat: 45.5017, lng: -73.5673, country: 'Canada' },
      { name: 'Vancouver, Canada', lat: 49.2827, lng: -123.1207, country: 'Canada' },
      { name: 'Calgary, Canada', lat: 51.0447, lng: -114.0719, country: 'Canada' },
      { name: 'Ottawa, Canada', lat: 45.4215, lng: -75.6972, country: 'Canada' },
      { name: 'Edmonton, Canada', lat: 53.5461, lng: -113.4938, country: 'Canada' },
      { name: 'Mississauga, Canada', lat: 43.5890, lng: -79.6441, country: 'Canada' },
      { name: 'Winnipeg, Canada', lat: 49.8951, lng: -97.1384, country: 'Canada' },
      { name: 'Quebec City, Canada', lat: 46.8139, lng: -71.2080, country: 'Canada' },
      { name: 'Hamilton, Canada', lat: 43.2557, lng: -79.8711, country: 'Canada' },
      
      { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, country: 'Japan' },
      { name: 'Osaka, Japan', lat: 34.6937, lng: 135.5023, country: 'Japan' },
      { name: 'Kyoto, Japan', lat: 35.0116, lng: 135.7681, country: 'Japan' },
      { name: 'Yokohama, Japan', lat: 35.4437, lng: 139.6380, country: 'Japan' },
      { name: 'Nagoya, Japan', lat: 35.1815, lng: 136.9066, country: 'Japan' },
      { name: 'Sapporo, Japan', lat: 43.0642, lng: 141.3469, country: 'Japan' },
      { name: 'Fukuoka, Japan', lat: 33.5904, lng: 130.4017, country: 'Japan' },
      { name: 'Kobe, Japan', lat: 34.6901, lng: 135.1956, country: 'Japan' },
      { name: 'Kawasaki, Japan', lat: 35.5206, lng: 139.7172, country: 'Japan' },
      { name: 'Hiroshima, Japan', lat: 34.3853, lng: 132.4553, country: 'Japan' },
      
      { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, country: 'Australia' },
      { name: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, country: 'Australia' },
      { name: 'Brisbane, Australia', lat: -27.4698, lng: 153.0251, country: 'Australia' },
      { name: 'Perth, Australia', lat: -31.9505, lng: 115.8605, country: 'Australia' },
      { name: 'Adelaide, Australia', lat: -34.9285, lng: 138.6007, country: 'Australia' },
      { name: 'Gold Coast, Australia', lat: -28.0167, lng: 153.4000, country: 'Australia' },
      { name: 'Newcastle, Australia', lat: -32.9283, lng: 151.7817, country: 'Australia' },
      { name: 'Canberra, Australia', lat: -35.2809, lng: 149.1300, country: 'Australia' },
      { name: 'Sunshine Coast, Australia', lat: -26.6500, lng: 153.0667, country: 'Australia' },
      { name: 'Wollongong, Australia', lat: -34.4278, lng: 150.8931, country: 'Australia' },
      
      { name: 'Paris, France', lat: 48.8566, lng: 2.3522, country: 'France' },
      { name: 'Lyon, France', lat: 45.7640, lng: 4.8357, country: 'France' },
      { name: 'Marseille, France', lat: 43.2965, lng: 5.3698, country: 'France' },
      { name: 'Toulouse, France', lat: 43.6047, lng: 1.4442, country: 'France' },
      { name: 'Nice, France', lat: 43.7102, lng: 7.2620, country: 'France' },
      { name: 'Nantes, France', lat: 47.2184, lng: -1.5536, country: 'France' },
      { name: 'Strasbourg, France', lat: 48.5734, lng: 7.7521, country: 'France' },
      { name: 'Montpellier, France', lat: 43.6110, lng: 3.8767, country: 'France' },
      { name: 'Bordeaux, France', lat: 44.8378, lng: -0.5792, country: 'France' },
      { name: 'Lille, France', lat: 50.6292, lng: 3.0573, country: 'France' },
      
      { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, country: 'Germany' },
      { name: 'Munich, Germany', lat: 48.1351, lng: 11.5820, country: 'Germany' },
      { name: 'Hamburg, Germany', lat: 53.5511, lng: 9.9937, country: 'Germany' },
      { name: 'Cologne, Germany', lat: 50.9375, lng: 6.9603, country: 'Germany' },
      { name: 'Frankfurt, Germany', lat: 50.1109, lng: 8.6821, country: 'Germany' },
      { name: 'Stuttgart, Germany', lat: 48.7758, lng: 9.1829, country: 'Germany' },
      { name: 'Düsseldorf, Germany', lat: 51.2277, lng: 6.7735, country: 'Germany' },
      { name: 'Dortmund, Germany', lat: 51.5136, lng: 7.4653, country: 'Germany' },
      { name: 'Essen, Germany', lat: 51.4556, lng: 7.0116, country: 'Germany' },
      { name: 'Leipzig, Germany', lat: 51.3397, lng: 12.3731, country: 'Germany' },
      
      { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, country: 'Spain' },
      { name: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734, country: 'Spain' },
      { name: 'Valencia, Spain', lat: 39.4699, lng: -0.3763, country: 'Spain' },
      { name: 'Seville, Spain', lat: 37.3891, lng: -5.9845, country: 'Spain' },
      { name: 'Zaragoza, Spain', lat: 41.6488, lng: -0.8891, country: 'Spain' },
      { name: 'Málaga, Spain', lat: 36.7213, lng: -4.4214, country: 'Spain' },
      { name: 'Murcia, Spain', lat: 37.9922, lng: -1.1307, country: 'Spain' },
      { name: 'Palma, Spain', lat: 39.5696, lng: 2.6502, country: 'Spain' },
      { name: 'Las Palmas, Spain', lat: 28.1248, lng: -15.4300, country: 'Spain' },
      { name: 'Bilbao, Spain', lat: 43.2627, lng: -2.9253, country: 'Spain' },
      
      { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, country: 'Italy' },
      { name: 'Milan, Italy', lat: 45.4642, lng: 9.1900, country: 'Italy' },
      { name: 'Naples, Italy', lat: 40.8518, lng: 14.2681, country: 'Italy' },
      { name: 'Turin, Italy', lat: 45.0703, lng: 7.6869, country: 'Italy' },
      { name: 'Palermo, Italy', lat: 38.1157, lng: 13.3615, country: 'Italy' },
      { name: 'Genoa, Italy', lat: 44.4056, lng: 8.9463, country: 'Italy' },
      { name: 'Bologna, Italy', lat: 44.4949, lng: 11.3426, country: 'Italy' },
      { name: 'Florence, Italy', lat: 43.7696, lng: 11.2558, country: 'Italy' },
      { name: 'Bari, Italy', lat: 41.1171, lng: 16.8719, country: 'Italy' },
      { name: 'Catania, Italy', lat: 37.5079, lng: 15.0830, country: 'Italy' },
      
      { name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
      { name: 'Rotterdam, Netherlands', lat: 51.9244, lng: 4.4777, country: 'Netherlands' },
      { name: 'The Hague, Netherlands', lat: 52.0705, lng: 4.3007, country: 'Netherlands' },
      { name: 'Utrecht, Netherlands', lat: 52.0907, lng: 5.1214, country: 'Netherlands' },
      { name: 'Eindhoven, Netherlands', lat: 51.4416, lng: 5.4697, country: 'Netherlands' },
      { name: 'Tilburg, Netherlands', lat: 51.5555, lng: 5.0913, country: 'Netherlands' },
      { name: 'Groningen, Netherlands', lat: 53.2194, lng: 6.5665, country: 'Netherlands' },
      { name: 'Almere, Netherlands', lat: 52.3508, lng: 5.2647, country: 'Netherlands' },
      { name: 'Breda, Netherlands', lat: 51.5719, lng: 4.7683, country: 'Netherlands' },
      { name: 'Nijmegen, Netherlands', lat: 51.8426, lng: 5.8518, country: 'Netherlands' },
      
      { name: 'Brussels, Belgium', lat: 50.8503, lng: 4.3517, country: 'Belgium' },
      { name: 'Antwerp, Belgium', lat: 51.2194, lng: 4.4025, country: 'Belgium' },
      { name: 'Ghent, Belgium', lat: 51.0543, lng: 3.7174, country: 'Belgium' },
      { name: 'Charleroi, Belgium', lat: 50.4108, lng: 4.4446, country: 'Belgium' },
      { name: 'Liège, Belgium', lat: 50.6326, lng: 5.5797, country: 'Belgium' },
      { name: 'Bruges, Belgium', lat: 51.2093, lng: 3.2247, country: 'Belgium' },
      { name: 'Namur, Belgium', lat: 50.4674, lng: 4.8720, country: 'Belgium' },
      { name: 'Leuven, Belgium', lat: 50.8798, lng: 4.7005, country: 'Belgium' },
      { name: 'Mons, Belgium', lat: 50.4542, lng: 3.9565, country: 'Belgium' },
      { name: 'Aalst, Belgium', lat: 50.9363, lng: 4.0435, country: 'Belgium' },
      
      { name: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686, country: 'Sweden' },
      { name: 'Gothenburg, Sweden', lat: 57.7089, lng: 11.9746, country: 'Sweden' },
      { name: 'Malmö, Sweden', lat: 55.6050, lng: 13.0038, country: 'Sweden' },
      { name: 'Uppsala, Sweden', lat: 59.8586, lng: 17.6389, country: 'Sweden' },
      { name: 'Västerås, Sweden', lat: 59.6162, lng: 16.5528, country: 'Sweden' },
      { name: 'Örebro, Sweden', lat: 59.2741, lng: 15.2066, country: 'Sweden' },
      { name: 'Linköping, Sweden', lat: 58.4108, lng: 15.6214, country: 'Sweden' },
      { name: 'Helsingborg, Sweden', lat: 56.0465, lng: 12.6945, country: 'Sweden' },
      { name: 'Jönköping, Sweden', lat: 57.7826, lng: 14.1618, country: 'Sweden' },
      { name: 'Norrköping, Sweden', lat: 58.5877, lng: 16.1924, country: 'Sweden' },
      
      { name: 'Oslo, Norway', lat: 59.9139, lng: 10.7522, country: 'Norway' },
      { name: 'Bergen, Norway', lat: 60.3913, lng: 5.3221, country: 'Norway' },
      { name: 'Stavanger, Norway', lat: 58.9700, lng: 5.7331, country: 'Norway' },
      { name: 'Trondheim, Norway', lat: 63.4305, lng: 10.3951, country: 'Norway' },
      { name: 'Drammen, Norway', lat: 59.7439, lng: 10.2045, country: 'Norway' },
      { name: 'Fredrikstad, Norway', lat: 59.2181, lng: 10.9298, country: 'Norway' },
      { name: 'Kristiansand, Norway', lat: 58.1599, lng: 7.9959, country: 'Norway' },
      { name: 'Sandnes, Norway', lat: 58.8516, lng: 5.7376, country: 'Norway' },
      { name: 'Tromsø, Norway', lat: 69.6492, lng: 18.9553, country: 'Norway' },
      { name: 'Sarpsborg, Norway', lat: 59.2839, lng: 11.1104, country: 'Norway' },
      
      { name: 'Copenhagen, Denmark', lat: 55.6761, lng: 12.5683, country: 'Denmark' },
      { name: 'Aarhus, Denmark', lat: 56.1629, lng: 10.2039, country: 'Denmark' },
      { name: 'Odense, Denmark', lat: 55.4038, lng: 10.4024, country: 'Denmark' },
      { name: 'Aalborg, Denmark', lat: 57.0488, lng: 9.9217, country: 'Denmark' },
      { name: 'Esbjerg, Denmark', lat: 55.4769, lng: 8.4579, country: 'Denmark' },
      { name: 'Randers, Denmark', lat: 56.4607, lng: 10.0369, country: 'Denmark' },
      { name: 'Kolding, Denmark', lat: 55.4904, lng: 9.4721, country: 'Denmark' },
      { name: 'Horsens, Denmark', lat: 55.8607, lng: 9.8501, country: 'Denmark' },
      { name: 'Vejle, Denmark', lat: 55.7090, lng: 9.5357, country: 'Denmark' },
      { name: 'Roskilde, Denmark', lat: 55.6415, lng: 12.0803, country: 'Denmark' },
      
      { name: 'Helsinki, Finland', lat: 60.1699, lng: 24.9384, country: 'Finland' },
      { name: 'Espoo, Finland', lat: 60.2055, lng: 24.6559, country: 'Finland' },
      { name: 'Tampere, Finland', lat: 61.4991, lng: 23.7871, country: 'Finland' },
      { name: 'Vantaa, Finland', lat: 60.2934, lng: 25.0378, country: 'Finland' },
      { name: 'Oulu, Finland', lat: 65.0121, lng: 25.4651, country: 'Finland' },
      { name: 'Turku, Finland', lat: 60.4518, lng: 22.2666, country: 'Finland' },
      { name: 'Jyväskylä, Finland', lat: 62.2426, lng: 25.7473, country: 'Finland' },
      { name: 'Lahti, Finland', lat: 60.9827, lng: 25.6612, country: 'Finland' },
      { name: 'Kuopio, Finland', lat: 62.8924, lng: 27.6769, country: 'Finland' },
      { name: 'Pori, Finland', lat: 61.4851, lng: 21.7974, country: 'Finland' },
      
      // Add some placeholder cities that match "templ"
      { name: 'Temple, TX, USA', lat: 31.0982, lng: -97.3428, country: 'USA' },
      { name: 'Tempe, AZ, USA', lat: 33.4255, lng: -111.9400, country: 'USA' },
      { name: 'Temple City, CA, USA', lat: 34.1006, lng: -118.0578, country: 'USA' }
    ];

    try {
      // First try the free API without authentication (should work for demo)
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?limit=5&access_token=pk.eyJ1IjoidGVzdCIsImEiOiJjbDBkZzBkZjgwMDBrM2tsaGFyMmpvZnFvIn0.invalid`
      );
      
      if (response.ok) {
        const data = await response.json();
        const suggestions = data.features?.map((feature: any) => ({
          name: feature.place_name,
          lat: feature.center[1],
          lng: feature.center[0],
          country: feature.context?.find((c: any) => c.id.startsWith('country'))?.text || ''
        })) || [];
        
        if (suggestions.length > 0) {
          setLocationSuggestions(suggestions);
          setShowLocationDropdown(true);
          return;
        }
      }
    } catch (error) {
      console.log('Primary location API failed');
    }

    // Fallback to local search
    const filteredLocations = globalLocations.filter(loc => 
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.country.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);
    
    setLocationSuggestions(filteredLocations);
    setShowLocationDropdown(filteredLocations.length > 0);
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

  // Simple chart component - removed purple cosmic design
  const InteractiveChart = () => null;

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage = currentMessage;
    setCurrentMessage('');
    console.log('Sending oracle message:', userMessage);
    console.log('Birth data:', birthData);
    console.log('Selected planet:', selectedPlanet);
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    setIsGenerating(true);
    try {
      const response = await apiRequest('POST', '/api/chat/oracle', {
        message: userMessage,
        context: 'soul_map_exploration',
        birthData,
        selectedPlanet
      });
      
      const data = await response.json();
      console.log('Oracle response:', data);
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Oracle error:', error);
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

  // Zen Mode background styles
  const getZenBackgroundStyle = () => {
    const baseStyle = "transition-all duration-1000 ease-in-out";
    const backgrounds = {
      sunset: "bg-gradient-to-br from-orange-300 via-pink-300 to-purple-400",
      ocean: "bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400", 
      forest: "bg-gradient-to-br from-green-400 via-emerald-300 to-teal-400",
      cosmic: "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600"
    };
    
    if (zenMode) {
      return `${baseStyle} ${backgrounds[zenBackground]} min-h-screen`;
    }
    return baseStyle;
  };

  if (currentView === 'chart') {
    return (
      <div className={getZenBackgroundStyle()}>
        <div className="max-w-7xl mx-auto p-6">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${zenMode ? 'text-white' : ''}`}>Your Soul Map</h1>
              <p className={`${zenMode ? 'text-white/80' : 'text-muted-foreground'}`}>
                Click any planet or sign to explore deeper
              </p>
            </div>
            <div className="flex gap-2">
              {/* Zen Mode Toggle */}
              <Button 
                variant={zenMode ? "secondary" : "outline"}
                size="sm"
                onClick={() => setZenMode(!zenMode)}
                className={zenMode ? "bg-white/20 text-white hover:bg-white/30 border-white/30" : ""}
              >
                {zenMode ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                {zenMode ? 'Exit Zen' : 'Zen Mode'}
              </Button>
              
              {/* Background Selector (only visible in Zen Mode) */}
              {zenMode && (
                <Select value={zenBackground} onValueChange={(value: any) => setZenBackground(value)}>
                  <SelectTrigger className="w-40 bg-white/20 text-white border-white/30">
                    <Palette className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunset">
                      <div className="flex items-center gap-2">
                        <Sunset className="w-4 h-4" />
                        Sunset
                      </div>
                    </SelectItem>
                    <SelectItem value="ocean">
                      <div className="flex items-center gap-2">
                        <Waves className="w-4 h-4" />
                        Ocean
                      </div>
                    </SelectItem>
                    <SelectItem value="forest">
                      <div className="flex items-center gap-2">
                        <Mountain className="w-4 h-4" />
                        Forest
                      </div>
                    </SelectItem>
                    <SelectItem value="cosmic">
                      <div className="flex items-center gap-2">
                        <Stars className="w-4 h-4" />
                        Cosmic
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Button variant="outline" onClick={() => setCurrentView('chat')}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Oracle
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('welcome')}
                className={zenMode ? "bg-white/20 text-white border-white/30 hover:bg-white/30" : ""}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Edit Birth Data
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedPlanet('aquarius');
                  setCurrentMessage(`Tell me about my Sun in Aquarius and how it influences my soul journey and personality. I was born on February 17th, 1992.`);
                  setCurrentView('chat');
                }}
                className={zenMode ? "bg-white/20 text-white border-white/30 hover:bg-white/30" : ""}
              >
                Ask About My Sun Sign
              </Button>
          </div>
        </div>

        {/* Interactive Natal Chart Widget */}
        <InteractiveNatalChart 
          birthData={birthData} 
          onPlanetClick={(planet, sign) => {
            setSelectedPlanet(sign);
            setCurrentMessage(`Tell me about ${planet} in ${sign} and how it influences my soul journey and personality.`);
            setCurrentView('chat');
          }}
        />

        {/* Career Path Insights Dashboard */}
        {chartData?.careerGuidance && (
          <div className={`mt-8 ${zenMode ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-gradient-to-br from-slate-50 to-gray-100 border-slate-200'} rounded-xl border p-6`}>
            <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${zenMode ? 'text-white' : 'text-gray-900'}`}>
              <Target className="h-5 w-5 text-teal-600" />
              Your Cosmic Career Blueprint
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* VibeMatch Score */}
              <div className={`p-4 rounded-lg ${zenMode ? 'bg-white/5' : 'bg-white'} border ${zenMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">VM</span>
                  </div>
                  <h4 className={`font-medium ${zenMode ? 'text-white' : 'text-gray-800'}`}>VibeMatch Score</h4>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex-1 ${zenMode ? 'bg-white/20' : 'bg-gray-200'} rounded-full h-3`}>
                    <div 
                      className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-blue-500"
                      style={{ width: `${chartData.careerGuidance.vibeMatchScore}%` }}
                    />
                  </div>
                  <span className={`text-lg font-bold ${zenMode ? 'text-white' : 'text-gray-700'}`}>{chartData.careerGuidance.vibeMatchScore}%</span>
                </div>
                <p className={`text-xs ${zenMode ? 'text-white/70' : 'text-gray-600'}`}>
                  Career-path compatibility with your cosmic blueprint
                </p>
              </div>

              {/* Soul Purpose */}
              <div className={`p-4 rounded-lg ${zenMode ? 'bg-white/5' : 'bg-white'} border ${zenMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h4 className={`font-medium ${zenMode ? 'text-white' : 'text-gray-800'}`}>Soul Purpose</h4>
                </div>
                <p className={`text-sm ${zenMode ? 'text-white/80' : 'text-gray-600'}`}>
                  {chartData.careerGuidance.soulPurpose}
                </p>
              </div>

              {/* Top Career Paths */}
              <div className={`p-4 rounded-lg ${zenMode ? 'bg-white/5' : 'bg-white'} border ${zenMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h4 className={`font-medium ${zenMode ? 'text-white' : 'text-gray-800'}`}>Ideal Careers</h4>
                </div>
                <div className="flex flex-wrap gap-1">
                  {chartData.careerGuidance.idealCareers.slice(0, 4).map((career, index) => (
                    <span key={index} className="px-2 py-1 bg-teal-100 text-teal-800 rounded-md text-xs">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Insights */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-medium mb-2 ${zenMode ? 'text-white' : 'text-gray-800'}`}>Natural Talents</h4>
                <div className="flex flex-wrap gap-2">
                  {chartData.careerGuidance.naturalTalents.map((talent, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                      {talent}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className={`font-medium mb-2 ${zenMode ? 'text-white' : 'text-gray-800'}`}>Work Style</h4>
                <p className={`text-sm ${zenMode ? 'text-white/80' : 'text-gray-600'}`}>
                  {chartData.careerGuidance.workStyle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Real-Time Transits Dashboard */}
        {chartData?.transits && (
          <div className={`mt-8 ${zenMode ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'} rounded-xl border p-6`}>
            <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${zenMode ? 'text-white' : 'text-gray-900'}`}>
              <Zap className="h-5 w-5 text-indigo-600" />
              Current Cosmic Weather
            </h3>
            
            {/* Moon Phase */}
            <div className={`mb-6 p-4 rounded-lg ${zenMode ? 'bg-white/5' : 'bg-white'} border ${zenMode ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{chartData.transits.moonPhase.phase.split(' ')[0]}</span>
                  <span className={`font-medium ${zenMode ? 'text-white' : 'text-gray-800'}`}>
                    {chartData.transits.moonPhase.phase.split(' ').slice(1).join(' ')}
                  </span>
                </div>
                <span className={`text-sm ${zenMode ? 'text-white/70' : 'text-gray-600'}`}>
                  {chartData.transits.moonPhase.illumination}% illuminated
                </span>
              </div>
              <div className={`w-full ${zenMode ? 'bg-white/20' : 'bg-gray-200'} rounded-full h-2`}>
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${chartData.transits.moonPhase.illumination}%` }}
                />
              </div>
            </div>

            {/* Active Transits */}
            {chartData.transits.activeTransits.length > 0 && (
              <div>
                <h4 className={`font-medium mb-3 ${zenMode ? 'text-white' : 'text-gray-800'}`}>
                  Active Planetary Influences
                </h4>
                <div className="space-y-3">
                  {chartData.transits.activeTransits.slice(0, 4).map((transit, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border ${
                        transit.influence === 'harmonious' 
                          ? zenMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'
                          : transit.influence === 'challenging'
                          ? zenMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-50 border-red-200'
                          : zenMode ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            transit.influence === 'harmonious' 
                              ? 'bg-green-100 text-green-800'
                              : transit.influence === 'challenging'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {transit.transitPlanet.charAt(0).toUpperCase() + transit.transitPlanet.slice(1)} {transit.aspect} {transit.natalPlanet.charAt(0).toUpperCase() + transit.natalPlanet.slice(1)}
                          </span>
                        </div>
                        <span className={`text-xs ${zenMode ? 'text-white/70' : 'text-gray-600'}`}>
                          {transit.duration}
                        </span>
                      </div>
                      <p className={`text-sm ${zenMode ? 'text-white/80' : 'text-gray-700'}`}>
                        {transit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Transit Summary */}
            <div className="mt-4 pt-4 border-t border-gray-200/50">
              <p className={`text-sm ${zenMode ? 'text-white/70' : 'text-gray-600'}`}>
                Updated in real-time • Next New Moon: {new Date(chartData.transits.moonPhase.nextNewMoon).toLocaleDateString()} • 
                Next Full Moon: {new Date(chartData.transits.moonPhase.nextFullMoon).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* Integrated Soul Summary - Moved from separate Aquarius card */}
        {chartData?.sun && (() => {
          const sunSign = ZODIAC_SIGNS.find(s => s.id === chartData.sun.sign);
          return sunSign ? (
            <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-sm mb-8">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{sunSign.symbol}</div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {sunSign.name} Soul Summary
                        <Badge className={`bg-gradient-to-r ${sunSign.color} text-white text-sm px-3 py-1`}>
                          {sunSign.element} Sign
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600">{sunSign.dates} • Your Cosmic Blueprint</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sunSign.traits.slice(0, 4).map((trait, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      Soul Purpose
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{sunSign.soulPurpose}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Growth Challenge
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{sunSign.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-500" />
                      Oracle Access
                    </h4>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          setCurrentMessage(`What does the current moon phase "${getCurrentMoonPhase()}" mean for my spiritual journey and how does it interact with my birth chart?`);
                          setCurrentView('chat');
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                      >
                        <Moon className="w-3 h-3 mr-2" />
                        Moon Wisdom
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentMessage("Based on my astrological chart, what career paths and professional opportunities align with my soul purpose? How can I find work that feels deeply fulfilling and matches my natural talents?");
                          setCurrentView('chat');
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                      >
                        <Target className="w-3 h-3 mr-2" />
                        Career Path
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null;
        })()}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Simplified layout without duplicate oracle section */}
          <div className="lg:col-span-2">
          </div>

          {/* Planet/Sign Details */}
          <div className="space-y-6">
            {(() => {
              // Check if it's a sign (zodiac sign) first, and don't render anything
              const isSign = ZODIAC_SIGNS.find(s => s.id === selectedPlanet);
              if (isSign) {
                return null; // Don't render anything for signs
              }

              // Only show planets
              if (selectedPlanet) {
                const planet = CHART_AREAS.find(p => p.id === selectedPlanet);
                if (planet) {
                  return (
                    <Card className={`${zenMode ? 'bg-white/10 backdrop-blur-md border-white/20' : ''}`}>
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${zenMode ? 'text-white' : ''}`}>
                          <div className={planet.color}>
                            {(() => {
                              const Planet = planet.icon;
                              return Planet ? <Planet className="w-5 h-5" /> : null;
                            })()}
                          </div>
                          {planet.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
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
                      </CardContent>
                    </Card>
                  );
                }
              }

              // Default "Explore Your Chart" card when nothing is selected
              return (
                <Card>
                  <CardContent className="text-center p-8">
                    <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold mb-2">Explore Your Chart</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on any planet in your chart to discover its meaning in your life.
                    </p>
                  </CardContent>
                </Card>
              );
            })()}

          </div>
        </div>
        </div>
      </div>
    );
  }

  if (currentView === 'chat') {
    console.log('Rendering chat view, messages:', chatMessages);
    console.log('Current message:', currentMessage);
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