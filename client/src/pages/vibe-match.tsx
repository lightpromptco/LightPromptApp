import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Users, 
  Sparkles, 
  Target, 
  TrendingUp,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
  Zap,
  Brain,
  Sun,
  Moon,
  Camera,
  Music,
  Book,
  Coffee,
  Smile,
  CheckCircle
} from 'lucide-react';

interface VibeProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  vibeScore: number;
  soulTraits: string[];
  interests: string[];
  lastActive: string;
  bioSnippet: string;
  astrologySign: string;
}

export default function VibeMatchPage() {
  const [currentVibeScore, setCurrentVibeScore] = useState(0);
  const [activeTab, setActiveTab] = useState('discover');
  
  // Mock data for vibe matches
  const vibeMatches: VibeProfile[] = [
    {
      id: '1',
      name: 'Luna Mystic',
      age: 28,
      location: 'Portland, OR',
      avatar: '🌙',
      vibeScore: 94,
      soulTraits: ['Intuitive', 'Creative', 'Empathetic'],
      interests: ['Meditation', 'Art', 'Nature'],
      lastActive: '2 hours ago',
      bioSnippet: 'Soul seeking authentic connections through mindful living...',
      astrologySign: 'Pisces'
    },
    {
      id: '2',
      name: 'River Sage',
      age: 32,
      location: 'Austin, TX',
      avatar: '🌊',
      vibeScore: 89,
      soulTraits: ['Wise', 'Compassionate', 'Grounded'],
      interests: ['Philosophy', 'Yoga', 'Music'],
      lastActive: '1 day ago',
      bioSnippet: 'Finding flow in conscious community and sacred connection...',
      astrologySign: 'Virgo'
    },
    {
      id: '3',
      name: 'Solar Beam',
      age: 26,
      location: 'San Francisco, CA',
      avatar: '☀️',
      vibeScore: 86,
      soulTraits: ['Optimistic', 'Adventurous', 'Inspiring'],
      interests: ['Travel', 'Sustainability', 'Dance'],
      lastActive: '5 hours ago',
      bioSnippet: 'Radiating positive energy while exploring inner landscapes...',
      astrologySign: 'Leo'
    }
  ];

  const vibeMetrics = [
    { label: 'Soul Alignment', score: 92, color: 'bg-purple-500' },
    { label: 'Energy Frequency', score: 88, color: 'bg-blue-500' },
    { label: 'Growth Trajectory', score: 95, color: 'bg-green-500' },
    { label: 'Authentic Expression', score: 91, color: 'bg-orange-500' }
  ];

  useEffect(() => {
    // Animate vibe score on load
    const timer = setTimeout(() => {
      setCurrentVibeScore(89);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            VibeMatch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find souls who resonate at your frequency—deep connection through conscious compatibility
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="profile">Your Vibe</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            {/* Your Vibe Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-500" />
                  Your Current Vibe Score
                </CardTitle>
                <CardDescription>
                  Based on your soul map data and authentic expression
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentVibeScore / 100)}`}
                        className="text-teal-500 transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentVibeScore}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      High Vibrational Energy
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Your authentic expression and soul alignment create a magnetic presence
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {vibeMetrics.map((metric) => (
                        <div key={metric.label} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {metric.label}
                            </span>
                            <span className="text-sm font-medium">
                              {metric.score}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div 
                              className={`h-2 ${metric.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${metric.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Potential Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Souls in Your Frequency Range
                </CardTitle>
                <CardDescription>
                  High-vibrational connections waiting to be discovered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {vibeMatches.map((profile) => (
                    <div key={profile.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                        {profile.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {profile.name}
                          </h3>
                          <Badge variant="secondary">
                            {profile.astrologySign}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {profile.age} • {profile.location}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {profile.bioSnippet}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {profile.soulTraits.map((trait) => (
                            <Badge key={trait} variant="outline" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {profile.interests.join(', ')}
                          </span>
                          <span>Active {profile.lastActive}</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                          {profile.vibeScore}%
                        </div>
                        <div className="text-xs text-gray-500">
                          Vibe Match
                        </div>
                        <Button size="sm" className="mt-2">
                          Connect
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Soul Connections</CardTitle>
                <CardDescription>
                  Mutual high-vibe matches and ongoing conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Mutual Matches Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Keep exploring and connecting with souls in your frequency range
                  </p>
                  <Button onClick={() => setActiveTab('discover')}>
                    Discover More Souls
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Vibe Profile</CardTitle>
                <CardDescription>
                  How your soul essence appears to other conscious beings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Soul Bio
                      </label>
                      <Textarea 
                        placeholder="Share your authentic essence..."
                        className="min-h-24"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Current Life Phase
                      </label>
                      <Input placeholder="e.g., Deep introspection, Creative expansion..." />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Seeking
                      </label>
                      <Input placeholder="e.g., Authentic connections, Growth partners..." />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Soul Interests
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Meditation', 'Art', 'Nature', 'Music', 'Philosophy', 'Travel', 'Yoga', 'Writing', 'Healing'].map((interest) => (
                          <label key={interest} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Communication Style
                      </label>
                      <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                        <option>Deep & reflective</option>
                        <option>Light & playful</option>
                        <option>Balanced & adaptive</option>
                        <option>Direct & honest</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update Vibe Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Vibe Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This week</span>
                      <span className="text-sm font-medium text-green-600">+5 points</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This month</span>
                      <span className="text-sm font-medium text-green-600">+12 points</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Connection rate</span>
                      <span className="text-sm font-medium">73%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    Compatibility Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You resonate most with souls who value authenticity and growth
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your empathetic nature attracts fellow healers and creators
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consider connecting with earth and water signs for balance
                    </p>
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