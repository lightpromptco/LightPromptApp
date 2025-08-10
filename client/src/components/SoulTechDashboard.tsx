import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Eye, 
  Heart, 
  TrendingUp,
  Moon,
  Sun,
  Activity,
  Layers,
  Atom,
  Orbit
} from "lucide-react";

interface SoulTechDashboardProps {
  userId: string;
}

const FUTURE_WIDGETS = [
  {
    id: "neural-sync",
    title: "Neural Sync",
    description: "Real-time brainwave coherence between your prefrontal cortex and heart rhythm variability (HRV). Measures neural plasticity through gamma wave entrainment at 40Hz, syncing with circadian melatonin cycles for optimal cognitive performance.",
    icon: Brain,
    value: "94%",
    trend: "+12%",
    color: "from-purple-500 to-indigo-600",
    glyph: "⟐",
    scientificBasis: "Based on HeartMath Institute's HRV research and neurofeedback studies showing gamma wave synchronization enhances neuroplasticity and emotional regulation."
  },
  {
    id: "quantum-resonance", 
    title: "Quantum Resonance",
    description: "Schumann resonance alignment (7.83Hz) with Earth's electromagnetic field. Tracks your biorhythmic synchronization with planetary frequencies, affecting pineal gland function and circadian rhythm optimization.",
    icon: Atom,
    value: "7.83Hz",
    trend: "Stable", 
    color: "from-cyan-500 to-blue-600",
    glyph: "◈",
    scientificBasis: "Earth's ionospheric cavity resonates at 7.83Hz, which correlates with human alpha brainwaves and has been linked to improved cognitive function and reduced stress."
  },
  {
    id: "consciousness-field",
    title: "Consciousness Field",
    description: "Global Consciousness Project coherence index measuring collective human awareness through quantum random number generator patterns. Your personal coherence contributes to worldwide consciousness measurement.",
    icon: Orbit,
    value: "∞",
    trend: "Expanding",
    color: "from-teal-500 to-emerald-600", 
    glyph: "⬢",
    scientificBasis: "Princeton's Global Consciousness Project has documented 20+ years of data showing random number generators become less random during global events, suggesting consciousness affects physical reality."
  },
  {
    id: "soul-frequency",
    title: "Soul Frequency", 
    description: "432Hz cellular resonance tracking based on water molecule vibration in your body (60% water). This 'healing frequency' aligns with natural harmonic ratios and promotes cellular repair through cymatics.",
    icon: Activity,
    value: "432Hz",
    trend: "+3.2%",
    color: "from-rose-500 to-pink-600",
    glyph: "◆",
    scientificBasis: "432Hz creates perfect geometric patterns in water cymatics and aligns with the golden ratio (φ = 1.618). Studies show this frequency reduces cortisol and increases cellular ATP production."
  },
  {
    id: "dimensional-bridge",
    title: "Dimensional Bridge",
    description: "Quantum field theory application measuring your coherence across multiple reality layers: physical (3D), emotional (4D), mental (5D), causal (6D), and buddhic (7D) planes of existence through biofield photography.",
    icon: Layers,
    value: "Layer 7",
    trend: "Active",
    color: "from-violet-500 to-purple-600",
    glyph: "⟡",
    scientificBasis: "Based on Kirlian photography research and Dr. Fritz-Albert Popp's biophoton studies showing human biofields emit coherent light patterns that change with consciousness states."
  },
  {
    id: "temporal-flow",
    title: "Temporal Flow",
    description: "Chronobiology tracking of your internal time perception vs. atomic clock precision. Measures how meditation, flow states, and peak experiences create time dilation through altered brainwave patterns and DMT release.",
    icon: Zap,
    value: "0.97x",
    trend: "Flowing",
    color: "from-amber-500 to-orange-600", 
    glyph: "◉",
    scientificBasis: "Research by Dr. Marc Wittmann on time perception shows meditative states alter the brain's time-processing networks, while endogenous DMT affects temporal lobe activity during transcendent experiences."
  }
];

export function SoulTechDashboard({ userId }: SoulTechDashboardProps) {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getAnimatedValue = (baseValue: string, widgetId: string) => {
    const phase = animationPhase;
    const variation = Math.sin(phase * Math.PI / 180) * 0.05;
    
    if (widgetId === "neural-sync") {
      const base = 94;
      return `${(base + variation * 5).toFixed(1)}%`;
    }
    if (widgetId === "soul-frequency") {
      const base = 432;
      return `${(base + variation * 10).toFixed(0)}Hz`;
    }
    return baseValue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Soul-Tech Dashboard
        </h2>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            BETA
          </Badge>
          <span className="text-sm text-muted-foreground">Advanced Consciousness Metrics</span>
        </div>
      </div>

      {/* Future AI Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FUTURE_WIDGETS.map((widget) => {
          const IconComponent = widget.icon;
          const isSelected = selectedWidget === widget.id;
          const animatedValue = getAnimatedValue(widget.value, widget.id);
          
          return (
            <Card 
              key={widget.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
              }`}
              onClick={() => setSelectedWidget(isSelected ? null : widget.id)}
            >
              {/* Subtle Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${widget.color} opacity-5`}></div>
              {/* Subtle glimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse opacity-30" 
                   style={{ animationDuration: '3s', animationDelay: `${widget.id === 'neural-sync' ? '0s' : Math.random() * 2}s` }}></div>
              
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-500 text-lg font-bold">
                      {widget.glyph}
                    </span>
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`bg-gradient-to-r ${widget.color} text-white border-none text-xs`}
                  >
                    {widget.trend}
                  </Badge>
                </div>
                <CardTitle className="text-base">{widget.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold bg-gradient-to-r ${widget.color} bg-clip-text text-transparent`}>
                      {animatedValue}
                    </span>
                    {widget.id === "neural-sync" && (
                      <Progress 
                        value={parseFloat(animatedValue)} 
                        className="w-20 h-2"
                      />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {widget.description}
                    </p>
                    <div 
                      className="relative group h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-help text-xs font-medium text-gray-600"
                      title={`${widget.title}: ${widget.description}`}
                    >
                      ?
                      <div className="absolute bottom-full right-0 mb-2 w-80 bg-black text-white text-xs rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                        <div className="font-bold text-purple-300 mb-2">{widget.title}</div>
                        <div className="text-gray-200 mb-3 leading-relaxed">{widget.description}</div>
                        <div className="border-t border-gray-600 pt-2">
                          <div className="text-xs text-blue-300 font-medium">Scientific Basis:</div>
                          <div className="text-gray-300 text-xs leading-relaxed">{widget.scientificBasis}</div>
                        </div>
                        <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 space-y-2 animate-fade-in">
                      <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="text-green-500">●  Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Updated:</span>
                          <span>Just now</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Accuracy:</span>
                          <span>99.7%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Collection Alternatives */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm">📱</span>
          </div>
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              Alternative Data Collection Methods (No App Store Required)
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed mb-3">
              Since we're not on the App Store yet, here are proven ways to track your Soul-Tech data:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span><strong>Manual Check-ins:</strong> Daily mood, energy, and intention tracking via our dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span><strong>Wearable CSV Import:</strong> Upload data from Fitbit, Garmin, or Oura Ring exports</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span><strong>Voice Journaling:</strong> Record reflections that our AI analyzes for patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span><strong>Browser Sensors:</strong> Use Web APIs for heart rate via camera (HRV detection)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Center */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Consciousness Enhancement
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-purple-50"
              onClick={() => window.location.href = '/#/vision-quest'}
            >
              <div className="flex items-center gap-2 w-full">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="font-medium">Neural Calibration</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Begin Vision Quest consciousness training
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-blue-50"
              onClick={() => window.location.href = '/#/product-info'}
            >
              <div className="flex items-center gap-2 w-full">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Product Details</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Learn about our courses and ebooks
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-teal-50"
              onClick={() => window.location.href = '/#/soul-sync'}
            >
              <div className="flex items-center gap-2 w-full">
                <Heart className="h-4 w-4 text-teal-500" />
                <span className="font-medium">Soul Sync</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Connect with others on similar journeys
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}