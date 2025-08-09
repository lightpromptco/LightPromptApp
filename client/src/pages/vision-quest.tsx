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
  Sparkles
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
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Compass className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
            Vision Quest
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A guided spiritual journey to discover your authentic purpose, 
            connect with your inner wisdom, and integrate your gifts into the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-orange-500" />
                The Hero's Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Follow the ancient pattern of departure, initiation, revelation, and return. 
                Each stage offers guided practices, reflections, and AI support to help you 
                navigate your inner landscape.
              </p>
              <div className="space-y-2">
                {QUEST_STAGES.map((stage, index) => (
                  <div key={stage.id} className="flex items-center gap-2 text-sm">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stage.color}`}></div>
                    <span>{stage.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Integration with Soul Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              {soulMap ? (
                <div>
                  <p className="text-green-600 dark:text-green-400 font-medium mb-2">
                    Your Soul Map is ready for integration!
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Your Vision Quest will be personalized based on your birth chart analysis 
                    and personality insights, creating a deeply customized spiritual journey.
                  </p>
                  <Badge variant="outline" className="mb-2">Soul Map Available</Badge>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-4">
                    Consider creating your Soul Map first for a more personalized Vision Quest experience. 
                    The cosmic insights will enhance your journey with astrological guidance and 
                    birth chart wisdom.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/woo-woo'}
                  >
                    Create Soul Map First
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-blue-500" />
              What to Expect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Gentle Guidance</h4>
                <p className="text-sm text-muted-foreground">
                  No forcing or pushing. We honor your readiness and pace, 
                  offering wisdom only when you're open to receive it.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">AI Companions</h4>
                <p className="text-sm text-muted-foreground">
                  Specialized AI guides for each stage, offering reflections, 
                  practices, and insights tailored to your journey.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Shadow Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Safely explore your shadows with compassionate guidance, 
                  discovering the gifts hidden in your challenges.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Practical Application</h4>
                <p className="text-sm text-muted-foreground">
                  Bring your insights into daily life with actionable practices 
                  and community support for lasting transformation.
                </p>
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