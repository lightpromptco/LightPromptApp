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
  User
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

// Interactive chart exploration areas
const CHART_AREAS = [
  {
    id: 'sun',
    name: 'Sun Sign',
    icon: Sun,
    color: 'text-yellow-500',
    description: 'Your core essence and life force',
    questions: ['What is my soul purpose?', 'How do I shine my light?', 'What drives my ego?'],
    coordinates: { x: 50, y: 50 }
  },
  {
    id: 'moon',
    name: 'Moon Sign', 
    icon: Moon,
    color: 'text-blue-400',
    description: 'Your emotional world and inner needs',
    questions: ['How do I process emotions?', 'What do I need to feel secure?', 'What are my hidden patterns?'],
    coordinates: { x: 30, y: 30 }
  },
  {
    id: 'rising',
    name: 'Rising Sign',
    icon: Eye,
    color: 'text-purple-500', 
    description: 'How you appear to the world',
    questions: ['How do others see me?', 'What mask do I wear?', 'How do I approach life?'],
    coordinates: { x: 70, y: 20 }
  },
  {
    id: 'venus',
    name: 'Venus',
    icon: Heart,
    color: 'text-pink-500',
    description: 'How you love and what you value',
    questions: ['How do I express love?', 'What do I find beautiful?', 'How do I attract abundance?'],
    coordinates: { x: 40, y: 60 }
  },
  {
    id: 'mars',
    name: 'Mars',
    icon: Zap,
    color: 'text-red-500',
    description: 'Your drive, passion and how you take action',
    questions: ['How do I pursue goals?', 'What makes me angry?', 'Where is my passion?'],
    coordinates: { x: 60, y: 40 }
  },
  {
    id: 'mercury',
    name: 'Mercury',
    icon: MessageCircle,
    color: 'text-green-500',
    description: 'How you think and communicate',
    questions: ['How do I learn best?', 'How do I communicate?', 'What is my mental style?'],
    coordinates: { x: 45, y: 35 }
  }
];

export default function SoulMapExplorerPage() {
  const [currentView, setCurrentView] = useState<'welcome' | 'chart' | 'chat'>('welcome');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [birthData, setBirthData] = useState({
    date: '',
    time: '',
    location: '',
    name: ''
  });
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to your Soul Map Oracle! I'm here to help you explore your cosmic blueprint. What would you like to discover about yourself today?"
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Interactive chart component
  const InteractiveChart = () => (
    <div className="relative w-96 h-96 mx-auto">
      {/* Outer circle - chart wheel */}
      <div className="absolute inset-0 border-4 border-purple-300 rounded-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        
        {/* Zodiac wheel segments */}
        {ZODIAC_SIGNS.map((sign, index) => {
          const angle = (index * 30) - 90; // 30 degrees per sign, starting at top
          const x = 50 + 40 * Math.cos(angle * Math.PI / 180);
          const y = 50 + 40 * Math.sin(angle * Math.PI / 180);
          
          return (
            <div
              key={sign.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedPlanet(sign.id)}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-lg hover:shadow-xl transition-shadow">
                {sign.emoji}
              </div>
            </div>
          );
        })}

        {/* Planet positions */}
        {CHART_AREAS.map((planet) => (
          <div
            key={planet.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${planet.coordinates.x}%`, top: `${planet.coordinates.y}%` }}
            onClick={() => setSelectedPlanet(planet.id)}
          >
            <div className={`w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-all group-hover:shadow-2xl ${selectedPlanet === planet.id ? 'ring-4 ring-purple-400 scale-110' : ''}`}>
              <planet.icon className={`w-5 h-5 ${planet.color}`} />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {planet.name}
            </div>
          </div>
        ))}

        {/* Center - soul essence */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
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
                onChange={(e) => setBirthData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <Input
                type="time"
                placeholder="Birth Time (if known)"
                value={birthData.time}
                onChange={(e) => setBirthData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div>
              <Input
                placeholder="Birth Location (City, Country)"
                value={birthData.location}
                onChange={(e) => setBirthData(prev => ({ ...prev, location: e.target.value }))}
              />
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
                <CardContent className="space-y-4">
                  {(() => {
                    const planet = CHART_AREAS.find(p => p.id === selectedPlanet);
                    const sign = ZODIAC_SIGNS.find(s => s.id === selectedPlanet);
                    
                    if (planet) {
                      return (
                        <>
                          <p className="text-sm text-muted-foreground">{planet.description}</p>
                          <div>
                            <h4 className="font-medium mb-2">Ask the Oracle:</h4>
                            <div className="space-y-2">
                              {planet.questions.map((question, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-left h-auto p-3 justify-start"
                                  onClick={() => {
                                    setCurrentMessage(question);
                                    setCurrentView('chat');
                                  }}
                                >
                                  <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0" />
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
                          <div className="text-center">
                            <div className="text-4xl mb-2">{sign.symbol}</div>
                            <Badge className={`bg-gradient-to-r ${sign.color} text-white`}>
                              {sign.element} Sign
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Core Traits</h4>
                            <div className="flex flex-wrap gap-1">
                              {sign.traits.map((trait, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Soul Purpose</h4>
                            <p className="text-sm text-muted-foreground">{sign.soulPurpose}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Growth Challenge</h4>
                            <p className="text-sm text-muted-foreground">{sign.challenge}</p>
                          </div>
                          <Button
                            onClick={() => {
                              setCurrentMessage(`Tell me more about ${sign.name} energy and how it shows up in my life`);
                              setCurrentView('chat');
                            }}
                            className="w-full"
                            size="sm"
                          >
                            <Bot className="w-3 h-3 mr-2" />
                            Ask Oracle About {sign.name}
                          </Button>
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