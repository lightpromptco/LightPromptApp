import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,
  Zap,
  Sparkles,
  Star,
  Rocket,
  Cpu,
  Monitor,
  Heart,
  Eye,
  ArrowRight,
  PlayCircle,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const FUTURE_QUEST_PHASES = [
  {
    id: 'neural-init',
    name: 'Neural Initialization',
    icon: Brain,
    description: 'Booting up your consciousness matrix',
    color: 'from-cyan-400 to-blue-600',
    challenges: ['Digital Detox Challenge', 'Mindfulness Scan', 'Reality Check Protocol']
  },
  {
    id: 'quantum-dive',
    name: 'Quantum Dive',
    icon: Zap,
    description: 'Exploring infinite possibility states',
    color: 'from-purple-500 to-pink-500',
    challenges: ['Parallel Life Simulator', 'Decision Tree Explorer', 'What-If Generator']
  },
  {
    id: 'cosmic-sync',
    name: 'Cosmic Synchronization',
    icon: Sparkles,
    description: 'Aligning with universal frequencies',
    color: 'from-indigo-500 to-purple-600',
    challenges: ['Astro-Personality Merge', 'Energy Pattern Reading', 'Vibe Calibration']
  },
  {
    id: 'timeline-lock',
    name: 'Timeline Lock-In',
    icon: Star,
    description: 'Committing to your optimal reality branch',
    color: 'from-emerald-400 to-teal-600',
    challenges: ['Future Self Interview', 'Goal Crystallization', 'Reality Anchor Setup']
  }
];

const DIGITAL_TOTEMS = [
  { name: 'Cyber Phoenix', element: 'Code', gift: 'Infinite Renewal', emoji: '🔥', quirk: 'Restarts when confused' },
  { name: 'Quantum Cat', element: 'Logic', gift: 'Superposition Thinking', emoji: '🐱', quirk: 'Exists in multiple states' },
  { name: 'Neon Dragon', element: 'Energy', gift: 'Electric Creativity', emoji: '⚡', quirk: 'Glows when excited' },
  { name: 'Data Whale', element: 'Flow', gift: 'Deep Pattern Recognition', emoji: '🐋', quirk: 'Sings in binary' },
  { name: 'Pixel Butterfly', element: 'Change', gift: 'Beautiful Transformation', emoji: '🦋', quirk: 'Renders in 8-bit sometimes' },
  { name: 'Solar Octopus', element: 'Adapt', gift: 'Multi-Dimensional Problem Solving', emoji: '🐙', quirk: 'Each arm thinks differently' }
];

const FUNNY_LOADING_MESSAGES = [
  "Calibrating your reality perception...",
  "Downloading wisdom from the cosmic cloud...",
  "Optimizing your life's source code...",
  "Syncing with parallel universe you...",
  "Defragmenting your soul's hard drive...",
  "Installing consciousness upgrade 2.0...",
  "Buffering enlightenment... 47% complete",
  "Teaching AI to meditate (it's complicated)"
];

export default function VisionQuestPage() {
  const [currentView, setCurrentView] = useState<'intro' | 'totem-select' | 'quest' | 'journey' | 'completion'>('intro');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [questProgress, setQuestProgress] = useState(0);
  const [selectedTotem, setSelectedTotem] = useState<typeof DIGITAL_TOTEMS[0] | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(FUNNY_LOADING_MESSAGES[0]);
  const { toast } = useToast();

  // Get current user
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = currentUser?.id || 'demo-user';

  // Begin quest mutation
  const beginQuestMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/vision-quest/begin', {
        userId: userId,
        totem: selectedTotem
      });
      return response.json();
    },
    onSuccess: () => {
      setCurrentView('totem-select');
      toast({
        title: "Quest Initialized! 🚀",
        description: "Your consciousness matrix is now booting up...",
      });
    },
  });

  // Intro View - Futuristic landing
  if (currentView === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Vision Quest 3.0
              </h1>
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse">
                BETA
              </Badge>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A next-gen self-discovery experience that's like a video game for your soul, 
              but with actual useful insights (and way cooler graphics in your imagination)
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-cyan-500/30 hover:border-cyan-400/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-cyan-400">
                  <Brain className="h-6 w-6" />
                  AI-Powered Introspection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Like having a wise mentor, therapist, and slightly sarcastic friend all rolled into one. 
                  Our AI asks the right questions (and some weird ones too).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 hover:border-purple-400/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-400">
                  <Sparkles className="h-6 w-6" />
                  Digital Spirit Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Choose your digital totem companion! Each one has unique personality quirks 
                  (yes, the Quantum Cat really does exist in multiple states).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-500/30 hover:border-emerald-400/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-400">
                  <Zap className="h-6 w-6" />
                  Future-Self Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Actually talk to your future self (through AI simulation). 
                  Spoiler alert: they're probably still procrastinating, but with better excuses.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/30 hover:border-orange-400/50 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-400">
                  <Rocket className="h-6 w-6" />
                  Practical Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  This isn't just philosophical navel-gazing. Get actual actionable insights 
                  you can use in real life (revolutionary concept, we know).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Phases */}
          <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Your Journey Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {FUTURE_QUEST_PHASES.map((phase, index) => (
                  <div key={phase.id} className="text-center space-y-3">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${phase.color} rounded-xl flex items-center justify-center`}>
                      <phase.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-200">{phase.name}</h4>
                      <p className="text-sm text-gray-400">{phase.description}</p>
                    </div>
                    {index < FUTURE_QUEST_PHASES.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-500 mx-auto hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="text-center space-y-4">
            <p className="text-gray-400 italic">
              "The only way to make sense out of change is to plunge into it, move with it, and join the dance." 
              <br />- Alan Watts (but with more LEDs)
            </p>
            
            <Button 
              onClick={() => beginQuestMutation.mutate()}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
              disabled={beginQuestMutation.isPending}
            >
              {beginQuestMutation.isPending ? (
                <>
                  <Monitor className="h-5 w-5 mr-2 animate-spin" />
                  {loadingMessage}
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Initialize Vision Quest 3.0
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Totem Selection View
  if (currentView === 'totem-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Choose Your Digital Totem
            </h2>
            <p className="text-xl text-gray-300">
              Your AI companion for this journey. Each has unique quirks and superpowers!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIGITAL_TOTEMS.map((totem, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedTotem?.name === totem.name 
                    ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-purple-400 ring-2 ring-purple-400' 
                    : 'bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600/50 hover:border-purple-400/50'
                }`}
                onClick={() => setSelectedTotem(totem)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{totem.emoji}</span>
                    <div>
                      <div className="text-lg">{totem.name}</div>
                      <Badge variant="outline" className="text-xs">
                        {totem.element}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-300">
                    <strong>Gift:</strong> {totem.gift}
                  </p>
                  <p className="text-sm text-gray-400 italic">
                    <strong>Quirk:</strong> {totem.quirk}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center space-y-4">
            {selectedTotem && (
              <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
                <p className="text-purple-300">
                  <strong>{selectedTotem.name}</strong> has joined your quest! 
                  They're ready to help you {selectedTotem.gift.toLowerCase()}.
                </p>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('intro')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={() => setCurrentView('quest')}
                disabled={!selectedTotem}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Begin Quest with {selectedTotem?.name}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quest Phase View
  if (currentView === 'quest') {
    const currentPhaseData = FUTURE_QUEST_PHASES[currentPhase];
    const IconComponent = currentPhaseData.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          
          {/* Phase Header */}
          <div className="text-center space-y-4">
            <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${currentPhaseData.color} rounded-full flex items-center justify-center`}>
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold">{currentPhaseData.name}</h2>
            <p className="text-xl text-gray-300">{currentPhaseData.description}</p>
            <Progress value={(currentPhase + 1) * 25} className="w-full max-w-md mx-auto" />
          </div>

          {/* Totem Companion */}
          {selectedTotem && (
            <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedTotem.emoji}</span>
                  <div>
                    <p className="font-medium text-purple-300">{selectedTotem.name} says:</p>
                    <p className="text-gray-300 italic">
                      "Ready to {currentPhaseData.challenges[0].toLowerCase()}? Let's make some digital magic happen!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Challenges */}
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-gray-600/50">
            <CardHeader>
              <CardTitle>Phase Challenges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentPhaseData.challenges.map((challenge, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-200">{challenge}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('totem-select')}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Change Totem
            </Button>
            
            <Button 
              onClick={() => {
                if (currentPhase < FUTURE_QUEST_PHASES.length - 1) {
                  setCurrentPhase(currentPhase + 1);
                  setQuestProgress(questProgress + 25);
                } else {
                  setCurrentView('completion');
                }
                toast({
                  title: `${currentPhaseData.name} Complete! ✨`,
                  description: "Your consciousness matrix is upgrading...",
                });
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Complete Phase
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Completion View
  if (currentView === 'completion') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white">
        <div className="max-w-3xl mx-auto p-6 space-y-8 text-center">
          
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
              <Star className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Quest Complete!
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Congratulations! You've successfully navigated the digital realms of self-discovery. 
              Your consciousness has been upgraded to version 2.0 (with better error handling).
            </p>
          </div>

          {selectedTotem && (
            <Card className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-emerald-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl">{selectedTotem.emoji}</span>
                  <div>
                    <p className="font-medium text-emerald-300">{selectedTotem.name}'s Final Message:</p>
                  </div>
                </div>
                <p className="text-gray-300 italic text-lg">
                  "You've mastered the art of {selectedTotem.gift.toLowerCase()}! 
                  Remember, the real treasure was the self-awareness we found along the way. 
                  Also, I'll be here if you need to restart anything."
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-300">Quest Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-gray-300 space-y-2">
                  <li>• Unlocked new perspectives on life goals</li>
                  <li>• Discovered hidden personality patterns</li>
                  <li>• Calibrated future-self compatibility</li>
                  <li>• Achieved cosmic synchronization (mostly)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-300">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-gray-300 space-y-2">
                  <li>• Apply insights to daily decisions</li>
                  <li>• Share wisdom with other questers</li>
                  <li>• Continue the journey in other modes</li>
                  <li>• Remember to update your reality regularly</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => {
                setCurrentView('intro');
                setCurrentPhase(0);
                setQuestProgress(0);
                setSelectedTotem(null);
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Quest
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/woo-woo'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Explore Soul Map
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}