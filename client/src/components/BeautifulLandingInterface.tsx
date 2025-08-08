import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Zap, 
  Users, 
  MapPin, 
  Target, 
  Gem,
  ArrowRight,
  Play,
  Star,
  Moon,
  Sun,
  Waves,
  TreePine
} from 'lucide-react';
import { Link } from 'wouter';

const FEATURE_CARDS = [
  {
    title: 'AI Conversations',
    description: 'Deep reflections with specialized soul-tech bots',
    icon: Brain,
    gradient: 'from-purple-500 to-pink-500',
    href: '/chat',
    features: ['LightPromptBot', 'BodyBot', 'SpiritBot', 'WooWoo']
  },
  {
    title: 'Wellness Dashboard',
    description: 'Track your spiritual journey and growth patterns',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-500',
    href: '/dashboard',
    features: ['Mood Tracking', 'Habit Building', 'Progress Insights']
  },
  {
    title: 'Vibe Matching',
    description: 'Connect with kindred spirits and soul family',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    href: '/vibe-match',
    features: ['Energy Matching', 'Soul Connections', 'Private Messaging']
  },
  {
    title: 'GeoPrompt',
    description: 'Location-based reflections and check-ins',
    icon: MapPin,
    gradient: 'from-green-500 to-emerald-500',
    href: '/geoprompt',
    features: ['Sacred Spaces', 'Travel Reflections', 'Energy Mapping']
  },
  {
    title: 'Prism Points',
    description: 'Gamified wellness with achievements and rewards',
    icon: Gem,
    gradient: 'from-yellow-500 to-orange-500',
    href: '/prism-points',
    features: ['Point System', 'Achievements', 'Leaderboards']
  },
  {
    title: 'Wellness Challenges',
    description: 'Structured programs for spiritual growth',
    icon: Target,
    gradient: 'from-indigo-500 to-purple-500',
    href: '/challenges',
    features: ['21-Day Programs', 'Community Goals', 'Progress Tracking']
  }
];

const FLOATING_ELEMENTS = [
  { icon: Sparkles, top: '10%', left: '15%', delay: 0 },
  { icon: Heart, top: '25%', right: '20%', delay: 1000 },
  { icon: Star, top: '60%', left: '10%', delay: 2000 },
  { icon: Moon, top: '45%', right: '15%', delay: 1500 },
  { icon: Waves, top: '75%', left: '25%', delay: 3000 },
  { icon: TreePine, top: '15%', right: '35%', delay: 2500 }
];

export function BeautifulLandingInterface() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const isEvening = hour >= 18 || hour < 6;
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-violet-900/20 dark:to-purple-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_ELEMENTS.map((element, index) => (
          <div
            key={index}
            className="absolute opacity-10 animate-float"
            style={{
              top: element.top,
              left: element.left,
              right: element.right,
              animationDelay: `${element.delay}ms`,
              animationDuration: '6s'
            }}
          >
            <element.icon className="h-12 w-12 text-purple-500" />
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-violet-400 to-pink-400 rounded-3xl opacity-30 animate-pulse"></div>
            </div>
          </div>

          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              LightPrompt
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">
            Soul-Tech Wellness Platform
          </p>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            {greeting}! Welcome to your personal AI wellness companion. Experience deep reflection, 
            track your spiritual journey, and connect with like-minded souls through 
            cutting-edge consciousness technology.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-violet-100 text-violet-700">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Reflection
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-purple-100 text-purple-700">
              <Heart className="h-4 w-4 mr-2" />
              Emotional Intelligence
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-pink-100 text-pink-700">
              <Zap className="h-4 w-4 mr-2" />
              Real-time Insights
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/chat">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Play className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 border-purple-200 hover:border-purple-300 transition-all duration-300">
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {FEATURE_CARDS.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <Link href={feature.href}>
                <CardContent className="p-8">
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="space-y-2">
                      {feature.features.map((feat, featIndex) => (
                        <div key={featIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Hover Glow Effect */}
                  {activeCard === index && (
                    <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-20 blur animate-pulse`}></div>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-100 dark:border-purple-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">∞</div>
              <p className="text-gray-600 dark:text-gray-300">Infinite Possibilities</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-300">Always Available</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">🔒</div>
              <p className="text-gray-600 dark:text-gray-300">Privacy First</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">✨</div>
              <p className="text-gray-600 dark:text-gray-300">Soul-Tech Magic</p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(2deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}