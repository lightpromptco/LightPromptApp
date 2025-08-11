import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Brain, 
  Heart, 
  Users, 
  MapPin, 
  Target, 
  Gem,
  ArrowRight,
  Play,
  ChevronRight,
  Terminal,
  Code
} from 'lucide-react';
import { Link } from 'wouter';

const FEATURES = [
  {
    title: 'Developer Tools',
    description: 'Discord-style powerful functionality with Apple\'s sleek design - API management, webhooks, analytics',
    icon: Terminal,
    href: '/dev-tools',
    status: 'new'
  },
  {
    title: 'Community Hub',
    description: 'Real-time community with channels, voice rooms, and soul connections - Discord meets wellness',
    icon: Users,
    href: '/community-hub',
    status: 'new'
  },
  {
    title: 'Reflective Conversations',
    description: 'AI that mirrors back your wisdom—like having Socrates as a reflection partner who never judges',
    icon: Brain,
    href: '/chat',
    status: 'active'
  },
  {
    title: 'Vision Quest',
    description: 'Interactive self-discovery journey with challenges and cosmic insights',
    icon: Target,
    href: '/vision-quest',
    status: 'active'
  },
  {
    title: 'Soul Map Navigator',
    description: 'Explore your astrological profile and cosmic patterns for deeper self-understanding',
    icon: Sparkles,
    href: '/soul-map-explorer',
    status: 'active'
  },
  {
    title: 'Wellness Dashboard',
    description: 'See patterns in your inner world—because self-awareness loves good data visualization',
    icon: Heart,
    href: '/dashboard',
    status: 'beta'
  },
  {
    title: 'Soul Sync Connections',
    description: 'Connect with fellow consciousness explorers in authentic, vulnerable spaces',
    icon: Users,
    href: '/soul-sync',
    status: 'beta'
  },
  {
    title: 'Vibe Matching',
    description: 'Find souls who resonate at your frequency—deep connection through conscious compatibility',
    icon: Sparkles,
    href: '/vibe-match',
    status: 'coming-soon'
  },
  {
    title: 'GeoPrompt',
    description: 'Let your location inspire reflection. Every place holds wisdom—even that corner coffee shop',
    icon: MapPin,
    href: '/geoprompt',
    status: 'beta'
  },
  {
    title: 'Prism Points',
    description: 'Track your growth journey with conscious gamification that honors genuine transformation',
    icon: Gem,
    href: '/prism-points',
    status: 'coming-soon'
  }
];

export function BeautifulLandingInterface() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section - Apple Style */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto bg-teal-500 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 dark:text-white tracking-tight">
              LightPrompt
            </h1>
          </div>

          {/* Main headline */}
          <h2 className="text-3xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
            What if technology could
            <br />
            <span className="text-teal-500">reflect your highest self?</span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-light">
            We use AI consciously—as a mirror to help you connect to yourself, nature, and each other. 
            Think of it as a digital reflection pool that shows you the wisdom you already carry within.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/chat">
              <Button 
                size="lg" 
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-200"
              >
                Get started
              </Button>
            </Link>
            <Link href="/help">
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-teal-500 hover:text-teal-600 px-8 py-4 text-lg font-medium"
              >
                Learn more <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4">
              The art of conscious reflection.
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light">
              Eight research-backed tools for deeper self-connection. We're building thoughtfully—some features are live, others in beta or coming soon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <div className="group bg-white dark:bg-gray-900 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-800">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-teal-500 group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h4>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-light text-teal-500 mb-2">24/7</div>
              <p className="text-gray-600 dark:text-gray-400 font-light">Always Available</p>
            </div>
            <div>
              <div className="text-4xl font-light text-teal-500 mb-2">✧</div>
              <p className="text-gray-600 dark:text-gray-400 font-light">Conscious Tools</p>
            </div>
            <div>
              <div className="text-4xl font-light text-teal-500 mb-2">∞</div>
              <p className="text-gray-600 dark:text-gray-400 font-light">Infinite Growth</p>
            </div>
            <div>
              <div className="text-4xl font-light text-teal-500 mb-2">🔒</div>
              <p className="text-gray-600 dark:text-gray-400 font-light">Privacy First</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-teal-50 dark:bg-teal-950/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
            The real question isn't whether machines can think, but whether humans can think clearly about machines.
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-light">
            We're here to help you think clearly—about yourself, your connections, and your place in this beautifully complex world.
          </p>
          <Link href="/chat">
            <Button 
              size="lg" 
              className="bg-teal-500 hover:bg-teal-600 text-white px-12 py-4 rounded-full text-lg font-medium"
            >
              Start now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}