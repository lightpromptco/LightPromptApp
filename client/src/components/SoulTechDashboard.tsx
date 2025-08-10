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
    description: "AI consciousness alignment",
    icon: Brain,
    value: "94%",
    trend: "+12%",
    color: "from-purple-500 to-indigo-600",
    glyph: "⟐"
  },
  {
    id: "quantum-resonance", 
    title: "Quantum Resonance",
    description: "Multiverse probability waves",
    icon: Atom,
    value: "7.3Hz",
    trend: "Stable", 
    color: "from-cyan-500 to-blue-600",
    glyph: "◈"
  },
  {
    id: "consciousness-field",
    title: "Consciousness Field",
    description: "Collective awareness index",
    icon: Orbit,
    value: "∞",
    trend: "Expanding",
    color: "from-teal-500 to-emerald-600", 
    glyph: "⬢"
  },
  {
    id: "soul-frequency",
    title: "Soul Frequency", 
    description: "Personal vibration tracker",
    icon: Activity,
    value: "432Hz",
    trend: "+3.2%",
    color: "from-rose-500 to-pink-600",
    glyph: "◆"
  },
  {
    id: "dimensional-bridge",
    title: "Dimensional Bridge",
    description: "Reality layer synchronization", 
    icon: Layers,
    value: "Layer 7",
    trend: "Active",
    color: "from-violet-500 to-purple-600",
    glyph: "⟡"
  },
  {
    id: "temporal-flow",
    title: "Temporal Flow",
    description: "Time perception dynamics",
    icon: Zap,
    value: "0.97x",
    trend: "Flowing",
    color: "from-amber-500 to-orange-600", 
    glyph: "◉"
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
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        <div className="font-medium">{widget.title}</div>
                        <div className="text-gray-300">{widget.description}</div>
                        <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
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
              onClick={() => window.location.href = '/vision-quest'}
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
            >
              <div className="flex items-center gap-2 w-full">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Reality Scan</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Analyze dimensional probability matrices
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-teal-50"
            >
              <div className="flex items-center gap-2 w-full">
                <Heart className="h-4 w-4 text-teal-500" />
                <span className="font-medium">Soul Sync</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Harmonize with collective consciousness field
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}