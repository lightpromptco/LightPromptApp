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
  RotateCcw,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const FUTURE_QUEST_PHASES = [
  {
    id: 'neural-init',
    name: 'Neural Initialization',
    icon: Brain,
    description: 'Booting up your consciousness matrix',
    color: 'from-teal-400 to-teal-600',
    challenges: [
      { 
        id: 'digital-detox', 
        name: 'Digital Detox Challenge',
        description: 'Disconnect to reconnect with yourself',
        duration: '24 hours',
        steps: [
          'Turn off non-essential notifications',
          'Set specific phone-free hours',
          'Practice mindful breathing when you reach for your device',
          'Replace scrolling with journaling'
        ]
      },
      { 
        id: 'mindfulness-scan', 
        name: 'Mindfulness Scan',
        description: 'Full-body awareness protocol',
        duration: '15 minutes',
        steps: [
          'Find a comfortable seated position',
          'Close your eyes and breathe naturally',
          'Scan from head to toe, noticing sensations',
          'Record insights in your quest journal'
        ]
      },
      { 
        id: 'reality-check', 
        name: 'Reality Check Protocol',
        description: 'Question your assumptions about life',
        duration: '30 minutes',
        steps: [
          'List 5 beliefs you never question',
          'Ask "Is this actually true?" for each',
          'Find evidence for and against each belief',
          'Notice what feels rigid vs. flexible in your thinking'
        ]
      }
    ]
  },
  {
    id: 'quantum-dive',
    name: 'Quantum Dive',
    icon: Zap,
    description: 'Exploring infinite possibility states',
    color: 'from-gray-600 to-black',
    challenges: [
      { 
        id: 'parallel-life', 
        name: 'Parallel Life Simulator',
        description: 'Explore alternate versions of yourself',
        duration: '45 minutes',
        steps: [
          'Imagine 3 different life paths you could have taken',
          'Write a day in the life for each version',
          'Identify what you admire about each path',
          'Notice patterns in what brings fulfillment'
        ]
      },
      { 
        id: 'decision-tree', 
        name: 'Decision Tree Explorer',
        description: 'Map your choices and their ripple effects',
        duration: '30 minutes',
        steps: [
          'Pick a major decision you made in the past year',
          'Draw out the decision tree of what could have happened',
          'Follow each branch to its logical conclusion',
          'Appreciate the path you actually chose'
        ]
      },
      { 
        id: 'what-if-generator', 
        name: 'What-If Generator',
        description: 'Challenge limiting beliefs with possibility',
        duration: '20 minutes',
        steps: [
          'Think of something you believe is impossible for you',
          'Ask: "What if it were possible?"',
          'Brainstorm the smallest possible first step',
          'Take that step (or plan to take it today)'
        ]
      }
    ]
  },
  {
    id: 'cosmic-sync',
    name: 'Cosmic Synchronization',
    icon: Sparkles,
    description: 'Aligning with universal frequencies',
    color: 'from-teal-500 to-teal-700',
    challenges: [
      { 
        id: 'astro-personality', 
        name: 'Astro-Personality Merge',
        description: 'Integrate your cosmic blueprint with daily life',
        duration: '40 minutes',
        steps: [
          'Review your astrological profile (or create one)',
          'Identify 3 traits that resonate deeply',
          'Plan how to express these traits more fully',
          'Set intentions aligned with your cosmic nature'
        ]
      },
      { 
        id: 'energy-pattern', 
        name: 'Energy Pattern Reading',
        description: 'Map your natural rhythms and cycles',
        duration: '1 week tracking',
        steps: [
          'Track your energy levels hourly for 3 days',
          'Note patterns in high/low energy times',
          'Align important tasks with your natural rhythms',
          'Design an ideal daily schedule based on your patterns'
        ]
      },
      { 
        id: 'vibe-calibration', 
        name: 'Vibe Calibration',
        description: 'Fine-tune your emotional frequency',
        duration: '25 minutes',
        steps: [
          'Rate your current emotional state (1-10)',
          'Identify what would move you up 1 point',
          'Take action to shift your vibe',
          'Practice holding higher frequencies for longer'
        ]
      }
    ]
  },
  {
    id: 'timeline-lock',
    name: 'Timeline Lock-In',
    icon: Star,
    description: 'Committing to your optimal reality branch',
    color: 'from-gray-700 to-teal-600',
    challenges: [
      { 
        id: 'future-self-interview', 
        name: 'Future Self Interview',
        description: 'Have a conversation with yourself from 5 years ahead',
        duration: '50 minutes',
        steps: [
          'Imagine yourself 5 years from now, living your ideal life',
          'Ask your future self: "What advice do you have for me now?"',
          'Write the conversation as a dialogue',
          'Identify the next 3 actions your future self would take'
        ]
      },
      { 
        id: 'goal-crystallization', 
        name: 'Goal Crystallization',
        description: 'Transform vague dreams into crystal-clear intentions',
        duration: '35 minutes',
        steps: [
          'Pick your most important but vague goal',
          'Define exactly what success looks like',
          'Break it into monthly milestones',
          'Create accountability measures and deadlines'
        ]
      },
      { 
        id: 'reality-anchor', 
        name: 'Reality Anchor Setup',
        description: 'Create systems to maintain your new awareness',
        duration: '30 minutes',
        steps: [
          'Choose 3 daily practices that keep you centered',
          'Set up environmental cues for your new habits',
          'Create a weekly review system for course-correction',
          'Share your commitments with a trusted friend'
        ]
      }
    ]
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
  const [currentView, setCurrentView] = useState<'intro' | 'totem-select' | 'quest' | 'challenge' | 'completion'>('intro');
  const [currentPhase, setCurrentPhase] = useState(0);
  const [questProgress, setQuestProgress] = useState(0);
  const [selectedTotem, setSelectedTotem] = useState<typeof DIGITAL_TOTEMS[0] | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
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

  // Challenge completion handler
  const completeChallenge = (challengeId: string) => {
    setCompletedChallenges([...completedChallenges, challengeId]);
    toast({
      title: "Challenge Complete! ✨",
      description: "Your awareness is expanding...",
    });
    setCurrentView('quest');
  };

  // Intro View - Clean white/black/teal design
  if (currentView === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black text-black dark:text-white">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="relative">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 via-gray-800 to-black dark:from-teal-400 dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                Vision Quest 3.0
              </h1>
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-teal-500 to-teal-700 animate-pulse text-white">
                BETA
              </Badge>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              A next-gen self-discovery experience that's like a video game for your soul, 
              but with actual useful insights (and way cooler graphics in your imagination)
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-teal-600 dark:text-teal-400">
                  <Brain className="h-6 w-6" />
                  AI-Powered Introspection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Like having a wise mentor, therapist, and slightly sarcastic friend all rolled into one. 
                  Our AI asks the right questions (and some weird ones too).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
                  <Sparkles className="h-6 w-6" />
                  Digital Spirit Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Choose your digital totem companion! Each one has unique personality quirks 
                  (yes, the Quantum Cat really does exist in multiple states).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-teal-600 dark:text-teal-400">
                  <Zap className="h-6 w-6" />
                  Interactive Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Actually talk to your future self (through AI simulation). 
                  Spoiler alert: they're probably still procrastinating, but with better excuses.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
                  <Rocket className="h-6 w-6" />
                  Practical Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  This isn't just philosophical navel-gazing. Get actual actionable insights 
                  you can use in real life (revolutionary concept, we know).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Phases */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-900 dark:text-white">Your Journey Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {FUTURE_QUEST_PHASES.map((phase, index) => (
                  <div key={phase.id} className="text-center space-y-3">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${phase.color} rounded-xl flex items-center justify-center`}>
                      <phase.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{phase.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{phase.description}</p>
                    </div>
                    {index < FUTURE_QUEST_PHASES.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 mx-auto hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Button */}
          <div className="text-center space-y-4">
            <p className="text-gray-500 dark:text-gray-400 italic">
              "The only way to make sense out of change is to plunge into it, move with it, and join the dance." 
              <br />- Alan Watts (but with more LEDs)
            </p>
            
            <Button 
              onClick={() => beginQuestMutation.mutate()}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-gray-800 hover:from-teal-700 hover:to-gray-900 text-white px-8 py-4 text-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black text-black dark:text-white">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-gray-800 dark:from-teal-400 dark:to-gray-200 bg-clip-text text-transparent">
              Choose Your Digital Totem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your AI companion for this journey. Each has unique quirks and superpowers!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIGITAL_TOTEMS.map((totem, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedTotem?.name === totem.name 
                    ? 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 border-teal-400 ring-2 ring-teal-400' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-400 dark:hover:border-teal-500'
                }`}
                onClick={() => setSelectedTotem(totem)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{totem.emoji}</span>
                    <div>
                      <div className="text-lg text-gray-900 dark:text-white">{totem.name}</div>
                      <Badge variant="outline" className="text-xs border-teal-500 text-teal-600">
                        {totem.element}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Gift:</strong> {totem.gift}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    <strong>Quirk:</strong> {totem.quirk}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center space-y-4">
            {selectedTotem && (
              <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-lg border border-teal-200 dark:border-teal-700">
                <p className="text-teal-700 dark:text-teal-300">
                  <strong>{selectedTotem.name}</strong> has joined your quest! 
                  They're ready to help you {selectedTotem.gift.toLowerCase()}.
                </p>
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('intro')}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button 
                onClick={() => setCurrentView('quest')}
                disabled={!selectedTotem}
                className="bg-gradient-to-r from-teal-600 to-gray-800 hover:from-teal-700 hover:to-gray-900 text-white"
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

  // Challenge Detail View
  if (currentView === 'challenge' && selectedChallenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black text-black dark:text-white">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          
          {/* Challenge Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
              <Star className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedChallenge.name}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{selectedChallenge.description}</p>
            <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
              Duration: {selectedChallenge.duration}
            </Badge>
          </div>

          {/* Totem Companion */}
          {selectedTotem && (
            <Card className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 border-teal-200 dark:border-teal-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedTotem.emoji}</span>
                  <div>
                    <p className="font-medium text-teal-700 dark:text-teal-300">{selectedTotem.name} says:</p>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "Ready to {selectedChallenge.name.toLowerCase()}? Let's make some digital magic happen!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Challenge Steps */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Challenge Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedChallenge.steps.map((step: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200 leading-relaxed">{step}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('quest')}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quest
            </Button>
            
            <Button 
              onClick={() => completeChallenge(selectedChallenge.id)}
              className="bg-gradient-to-r from-teal-600 to-gray-800 hover:from-teal-700 hover:to-gray-900 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
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
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black text-black dark:text-white">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          
          {/* Phase Header */}
          <div className="text-center space-y-4">
            <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${currentPhaseData.color} rounded-full flex items-center justify-center`}>
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{currentPhaseData.name}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{currentPhaseData.description}</p>
            <Progress value={(currentPhase + 1) * 25} className="w-full max-w-md mx-auto" />
          </div>

          {/* Totem Companion */}
          {selectedTotem && (
            <Card className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 border-teal-200 dark:border-teal-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedTotem.emoji}</span>
                  <div>
                    <p className="font-medium text-teal-700 dark:text-teal-300">{selectedTotem.name} says:</p>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "Ready to explore {currentPhaseData.name.toLowerCase()}? Let's dive into some consciousness-expanding challenges!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interactive Challenges */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Phase Challenges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentPhaseData.challenges.map((challenge, index) => (
                <div 
                  key={challenge.id} 
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all hover:scale-[1.02] ${
                    completedChallenges.includes(challenge.id) 
                      ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700' 
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    setCurrentView('challenge');
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      completedChallenges.includes(challenge.id) 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-gradient-to-r from-teal-500 to-teal-700 text-white'
                    }`}>
                      {completedChallenges.includes(challenge.id) ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{challenge.name}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('totem-select')}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Change Totem
            </Button>
            
            <Button 
              onClick={() => {
                const phaseCompletedChallenges = currentPhaseData.challenges.filter(c => 
                  completedChallenges.includes(c.id)
                ).length;
                
                if (phaseCompletedChallenges >= 2) { // Need at least 2 challenges to advance
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
                } else {
                  toast({
                    title: "Complete More Challenges",
                    description: "Complete at least 2 challenges to advance to the next phase.",
                    variant: "destructive"
                  });
                }
              }}
              className="bg-gradient-to-r from-teal-600 to-gray-800 hover:from-teal-700 hover:to-gray-900 text-white"
            >
              {currentPhase < FUTURE_QUEST_PHASES.length - 1 ? 'Next Phase' : 'Complete Quest'}
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
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black text-black dark:text-white">
        <div className="max-w-3xl mx-auto p-6 space-y-8 text-center">
          
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
              <Star className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-gray-800 dark:from-teal-400 dark:to-gray-200 bg-clip-text text-transparent">
              Quest Complete!
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Congratulations! You've successfully navigated the digital realms of self-discovery. 
              Your consciousness has been upgraded to version 2.0 (with better error handling).
            </p>
          </div>

          {selectedTotem && (
            <Card className="bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 border-teal-200 dark:border-teal-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl">{selectedTotem.emoji}</span>
                  <div>
                    <p className="font-medium text-teal-700 dark:text-teal-300">{selectedTotem.name}'s Final Message:</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic text-lg">
                  "You've mastered the art of {selectedTotem.gift.toLowerCase()}! 
                  Remember, the real treasure was the self-awareness we found along the way. 
                  Also, I'll be here if you need to restart anything."
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Quest Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2">
                  <li>• Unlocked new perspectives on life goals</li>
                  <li>• Discovered hidden personality patterns</li>
                  <li>• Calibrated future-self compatibility</li>
                  <li>• Achieved cosmic synchronization (mostly)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-left text-gray-700 dark:text-gray-300 space-y-2">
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
                setCompletedChallenges([]);
              }}
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Quest
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/woo-woo'}
              className="bg-gradient-to-r from-teal-600 to-gray-800 hover:from-teal-700 hover:to-gray-900 text-white"
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