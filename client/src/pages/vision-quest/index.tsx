import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  Mountain, 
  Eye,
  Star,
  Play,
  ArrowRight,
  BookOpen,
  Timer,
  Users,
  Trophy
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
    duration: '3-5 days',
    practiceCount: 3
  },
  {
    id: 'initiation',
    name: 'The Initiation', 
    icon: Mountain,
    description: 'Facing challenges that forge your spirit',
    color: 'from-orange-500 to-red-500',
    duration: '5-7 days',
    practiceCount: 3
  },
  {
    id: 'revelation',
    name: 'The Revelation',
    icon: Eye,
    description: 'Receiving insights about your purpose',
    color: 'from-purple-500 to-indigo-500',
    duration: '7-10 days',
    practiceCount: 3
  },
  {
    id: 'integration',
    name: 'The Integration',
    icon: Star,
    description: 'Bringing wisdom back to daily life',
    color: 'from-green-500 to-emerald-500',
    duration: '5-7 days',
    practiceCount: 3
  }
];

export default function VisionQuestIndexPage() {
  const { toast } = useToast();
  const [isBeginning, setIsBeginning] = useState(false);

  // Get current user from local storage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Get user's current quest
  const { data: currentQuest } = useQuery({
    queryKey: ['/api/vision-quest', currentUser.id],
    enabled: !!currentUser.id,
  });

  const beginQuestMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/vision-quest/begin", {
        userId: currentUser.id,
        practices: [],
        progress: { currentStage: 'departure', completedPractices: [] }
      });
    },
    onSuccess: () => {
      toast({
        title: "Vision Quest Begun",
        description: "Your journey of self-discovery has started. Begin with The Departure stage.",
      });
      setIsBeginning(false);
      // Refresh the quest data
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Failed to Begin Quest",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      setIsBeginning(false);
    }
  });

  const handleBeginQuest = () => {
    setIsBeginning(true);
    beginQuestMutation.mutate();
  };

  const getOverallProgress = () => {
    if (!currentQuest) return 0;
    // Calculate progress based on completed practices
    const totalPractices = QUEST_STAGES.reduce((sum, stage) => sum + stage.practiceCount, 0);
    const completedPractices = currentQuest.progress?.completedPractices?.length || 0;
    return (completedPractices / totalPractices) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
          <Eye className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Vision Quest</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A transformative journey of self-discovery through four sacred stages. 
          Train your perception, develop your intuition, and connect with your deeper truth.
        </p>
        
        {currentQuest ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Quest in Progress</span>
            </div>
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm">{Math.round(getOverallProgress())}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
          </div>
        ) : (
          <Button 
            size="lg" 
            onClick={handleBeginQuest}
            disabled={isBeginning || beginQuestMutation.isPending}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          >
            <Play className="h-5 w-5 mr-2" />
            {isBeginning ? "Beginning Quest..." : "Begin Your Vision Quest"}
          </Button>
        )}
      </div>

      {/* Quest Stages */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">The Four Sacred Stages</h2>
        
        <div className="grid gap-6">
          {QUEST_STAGES.map((stage, index) => {
            const IconComponent = stage.icon;
            const isUnlocked = currentQuest && (
              !currentQuest.progress?.currentStage || 
              QUEST_STAGES.findIndex(s => s.id === currentQuest.progress.currentStage) >= index
            );
            const isCompleted = currentQuest?.progress?.completedStages?.includes(stage.id);
            const isCurrent = currentQuest?.progress?.currentStage === stage.id;
            
            return (
              <Card key={stage.id} className={`relative overflow-hidden transition-all duration-300 ${
                isCurrent ? 'ring-2 ring-purple-500 shadow-lg' :
                isCompleted ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' :
                !isUnlocked ? 'opacity-60' : ''
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${stage.color} opacity-5`} />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isCurrent ? `bg-gradient-to-r ${stage.color} text-white` :
                        isUnlocked ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' :
                        'bg-gray-50 dark:bg-gray-900 text-gray-400'
                      }`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{stage.name}</CardTitle>
                          {isCompleted && <Badge variant="default" className="bg-green-500">Completed</Badge>}
                          {isCurrent && <Badge variant="default">Current Stage</Badge>}
                          {!isUnlocked && <Badge variant="secondary">Locked</Badge>}
                        </div>
                        <p className="text-muted-foreground">{stage.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            {stage.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {stage.practiceCount} practices
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {isUnlocked ? (
                        <Link href={`/vision-quest/stage/${stage.id}`}>
                          <Button variant={isCurrent ? "default" : "outline"}>
                            {isCompleted ? "Review" : isCurrent ? "Continue" : "Begin"}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" disabled>
                          Complete Previous Stage
                        </Button>
                      )}
                      
                      <span className="text-xs text-muted-foreground">
                        Stage {index + 1} of {QUEST_STAGES.length}
                      </span>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quest Information */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-blue-500" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">20-30 Days</p>
            <p className="text-sm text-muted-foreground">
              Complete the full journey at your own pace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12 Total</p>
            <p className="text-sm text-muted-foreground">
              Guided exercises for self-discovery
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Community
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Private</p>
            <p className="text-sm text-muted-foreground">
              Personal journey with optional sharing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What to Expect */}
      <Card>
        <CardHeader>
          <CardTitle>What to Expect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">This Quest Will Help You:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Develop deeper self-awareness and intuition</li>
                <li>• Navigate life transitions with clarity</li>
                <li>• Connect with your authentic purpose</li>
                <li>• Build trust in your inner guidance</li>
                <li>• Integrate insights into daily life</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Each Practice Includes:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Guided reflection questions</li>
                <li>• Practical exercises and meditations</li>
                <li>• Integration and journaling prompts</li>
                <li>• Progress tracking and insights</li>
                <li>• Flexible timing to fit your schedule</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}