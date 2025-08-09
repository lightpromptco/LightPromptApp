import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  Mountain, 
  Star, 
  Eye,
  Heart,
  Zap,
  Moon,
  Sun,
  Wind,
  Waves,
  Flame,
  TreePine,
  Sparkles,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const QUEST_STAGES = [
  {
    id: 'departure',
    name: 'The Departure',
    icon: Compass,
    description: 'Leaving the familiar to discover your truth',
    color: 'from-blue-500 to-cyan-500',
    practices: ['Intention Setting', 'Sacred Space Creation', 'Fear Release']
  },
  {
    id: 'initiation',
    name: 'The Initiation',
    icon: Mountain,
    description: 'Facing challenges that forge your spirit',
    color: 'from-orange-500 to-red-500',
    practices: ['Shadow Integration', 'Inner Dialogue', 'Courage Building']
  },
  {
    id: 'revelation',
    name: 'The Revelation',
    icon: Eye,
    description: 'Receiving insights about your purpose',
    color: 'from-purple-500 to-indigo-500',
    practices: ['Vision Seeking', 'Dream Work', 'Symbolic Understanding']
  },
  {
    id: 'integration',
    name: 'The Integration',
    icon: Star,
    description: 'Bringing wisdom back to daily life',
    color: 'from-green-500 to-emerald-500',
    practices: ['Life Planning', 'Community Sharing', 'Ongoing Practice']
  }
];

const SPIRIT_ANIMALS = [
  { name: 'Eagle', element: 'Air', gift: 'Vision & Perspective', emoji: '🦅' },
  { name: 'Bear', element: 'Earth', gift: 'Strength & Healing', emoji: '🐻' },
  { name: 'Wolf', element: 'Air', gift: 'Loyalty & Intuition', emoji: '🐺' },
  { name: 'Dolphin', element: 'Water', gift: 'Joy & Communication', emoji: '🐬' },
  { name: 'Owl', element: 'Air', gift: 'Wisdom & Mystery', emoji: '🦉' },
  { name: 'Lion', element: 'Fire', gift: 'Courage & Leadership', emoji: '🦁' }
];

export default function VisionQuestPage() {
  const [currentView, setCurrentView] = useState<'intro' | 'quest' | 'journey' | 'completion'>('intro');
  const [currentStage, setCurrentStage] = useState(0);
  const [questProgress, setQuestProgress] = useState(0);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/users/email/lightprompt.co@gmail.com'],
  });

  // Get user's quest progress
  const { data: userQuest } = useQuery({
    queryKey: ['/api/vision-quest', user?.id],
    enabled: !!user?.id,
  });

  // Get user's soul map for integration
  const { data: soulMap } = useQuery({
    queryKey: ['/api/soul-map', user?.id],
    enabled: !!user?.id,
  });

  const beginQuestMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/vision-quest/begin", {
        userId: user?.id
      });
    },
    onSuccess: () => {
      setCurrentView('journey');
      toast({
        title: "Vision Quest Begun",
        description: "Your spiritual journey has started",
      });
    }
  });

  const completeStage = () => {
    const newProgress = Math.min(questProgress + 25, 100);
    setQuestProgress(newProgress);
    
    if (newProgress === 100) {
      setCurrentView('completion');
      toast({
        title: "Quest Complete!",
        description: "You have completed your Vision Quest journey",
      });
    } else {
      setCurrentStage(currentStage + 1);
      toast({
        title: "Stage Complete",
        description: `You've completed ${QUEST_STAGES[currentStage].name}`,
      });
    }
  };

  // Intro View
  if (currentView === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Compass className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vision Quest
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              A modern approach to self-discovery through conscious AI reflection and personalized guidance
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Mountain className="h-6 w-6 text-teal-600" />
                Four-Stage Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                A structured path of self-discovery using AI-guided reflections and modern wisdom practices.
              </p>
              <div className="space-y-4">
                {QUEST_STAGES.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stage.color} flex items-center justify-center flex-shrink-0`}>
                      <stage.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{stage.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Sparkles className="h-6 w-6 text-purple-600" />
                Enhanced with Soul Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              {soulMap ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-700 dark:text-green-400">Soul Map Connected</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Your journey will be personalized with astrological insights and birth chart guidance
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Personalized Features:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Birth chart-aligned reflections</li>
                      <li>• Current planetary transit insights</li>
                      <li>• Personalized affirmations</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Connect your Soul Map for a personalized experience with astrological insights and birth chart wisdom.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/woo-woo'}
                    className="w-full"
                  >
                    Create Soul Map
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-gray-50 to-teal-50 dark:from-gray-800 dark:to-teal-900/20 border-teal-200">
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Modern Self-Discovery</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                This isn't about ancient mysticism or outdated practices. It's a structured approach to understanding yourself using AI-guided reflection and evidence-based insights.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                  <h4 className="font-medium">AI Guidance</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Thoughtful prompts and reflections</p>
                </div>
                <div className="text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium">Personal Insights</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discover patterns and strengths</p>
                </div>
                <div className="text-center">
                  <Mountain className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-medium">Practical Actions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apply insights to daily life</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground italic">
            "The cave you fear to enter holds the treasure you seek." - Joseph Campbell
          </p>
          
          {userQuest ? (
            <div className="space-y-3">
              <p className="text-green-600 dark:text-green-400 font-medium">
                You have an active Vision Quest in progress
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setCurrentView('journey')} size="lg">
                  Continue Quest
                </Button>
                <Button variant="outline" onClick={() => beginQuestMutation.mutate()} size="lg">
                  Begin New Quest
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => beginQuestMutation.mutate()} size="lg">
              Begin Your Vision Quest
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Journey View
  if (currentView === 'journey') {
    const currentStageData = QUEST_STAGES[currentStage];
    const IconComponent = currentStageData.icon;

    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${currentStageData.color} rounded-full flex items-center justify-center`}>
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">{currentStageData.name}</h2>
          <p className="text-muted-foreground">{currentStageData.description}</p>
          <Progress value={questProgress} className="w-full max-w-md mx-auto" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {currentStageData.practices.map((practice, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="font-medium">{practice}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2">AI Guide Reflection</h4>
              <p className="text-sm text-muted-foreground italic">
                "Take a moment to breathe deeply and connect with your inner landscape. 
                What is calling for your attention in this moment? What part of yourself 
                is ready to be witnessed and honored?"
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentView('intro')}>
                Pause Quest
              </Button>
              <Button onClick={completeStage} className="flex-1">
                Complete Stage
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Spirit Animal Oracle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-500" />
              Spirit Animal Guidance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SPIRIT_ANIMALS.map((animal, index) => (
                <div key={index} className="text-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="text-2xl mb-1">{animal.emoji}</div>
                  <div className="font-medium text-sm">{animal.name}</div>
                  <div className="text-xs text-muted-foreground">{animal.gift}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Completion View
  if (currentView === 'completion') {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-500 to-yellow-500 rounded-full flex items-center justify-center">
            <Star className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Quest Complete!</h1>
          <p className="text-xl text-muted-foreground">
            You have successfully completed your Vision Quest journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Journey Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {QUEST_STAGES.map((stage, index) => {
                const IconComponent = stage.icon;
                return (
                  <div key={stage.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`w-8 h-8 bg-gradient-to-r ${stage.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{stage.name}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your vision quest insights are now part of your ongoing journey. 
            Consider revisiting your Soul Map or beginning a new quest when you feel called.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.location.href = '/woo-woo'}>
              View Soul Map
            </Button>
            <Button onClick={() => {
              setCurrentView('intro');
              setCurrentStage(0);
              setQuestProgress(0);
            }}>
              Begin New Quest
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}