import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  ArrowRight,
  Compass, 
  Mountain, 
  Eye,
  Star,
  Play,
  CheckCircle,
  BookOpen,
  Target,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const QUEST_STAGES = {
  departure: {
    id: 'departure',
    name: 'The Departure',
    icon: Compass,
    description: 'Leaving the familiar to discover your truth',
    color: 'from-blue-500 to-cyan-500',
    practices: [
      {
        title: 'Intention Setting',
        description: 'Define your quest purpose and personal intentions',
        duration: '15 minutes',
        type: 'reflection'
      },
      {
        title: 'Sacred Space Creation', 
        description: 'Establish a physical and mental space for your journey',
        duration: '20 minutes',
        type: 'action'
      },
      {
        title: 'Fear Release Meditation',
        description: 'Acknowledge and release fears about stepping into the unknown',
        duration: '25 minutes', 
        type: 'meditation'
      }
    ]
  },
  initiation: {
    id: 'initiation',
    name: 'The Initiation',
    icon: Mountain,
    description: 'Facing challenges that forge your spirit',
    color: 'from-orange-500 to-red-500',
    practices: [
      {
        title: 'Shadow Integration',
        description: 'Explore and integrate rejected aspects of yourself',
        duration: '30 minutes',
        type: 'introspection'
      },
      {
        title: 'Inner Dialogue Practice',
        description: 'Develop conversation with your inner wisdom',
        duration: '20 minutes',
        type: 'dialogue'
      },
      {
        title: 'Courage Building Exercises',
        description: 'Strengthen your capacity to face difficult truths',
        duration: '25 minutes',
        type: 'exercise'
      }
    ]
  },
  revelation: {
    id: 'revelation',
    name: 'The Revelation',
    icon: Eye,
    description: 'Receiving insights about your purpose',
    color: 'from-purple-500 to-indigo-500',
    practices: [
      {
        title: 'Vision Seeking',
        description: 'Open to receiving guidance about your life direction',
        duration: '40 minutes',
        type: 'vision'
      },
      {
        title: 'Dream Work',
        description: 'Explore insights from your unconscious through dreams',
        duration: '45 minutes',
        type: 'dream'
      },
      {
        title: 'Symbolic Understanding',
        description: 'Interpret the deeper meanings in your experiences',
        duration: '35 minutes',
        type: 'interpretation'
      }
    ]
  },
  integration: {
    id: 'integration',
    name: 'The Integration',
    icon: Star,
    description: 'Bringing wisdom back to daily life',
    color: 'from-green-500 to-emerald-500',
    practices: [
      {
        title: 'Wisdom Anchoring',
        description: 'Create practical ways to remember your insights',
        duration: '30 minutes',
        type: 'integration'
      },
      {
        title: 'Life Design Planning',
        description: 'Plan how to implement your revelations practically',
        duration: '45 minutes',
        type: 'planning'
      },
      {
        title: 'Community Sharing',
        description: 'Share your journey with others for mutual support',
        duration: '25 minutes',
        type: 'sharing'
      }
    ]
  }
};

export default function VisionQuestStagePage() {
  const [match, params] = useRoute("/vision-quest/stage/:stageId");
  const { toast } = useToast();
  const stageId = params?.stageId || 'departure';
  const stage = QUEST_STAGES[stageId] || QUEST_STAGES.departure;
  
  const [completedPractices, setCompletedPractices] = useState<string[]>([]);
  const [currentPractice, setCurrentPractice] = useState<number | null>(null);

  // Get user's quest progress
  const { data: questProgress } = useQuery({
    queryKey: ['/api/vision-quest/progress', stageId],
  });

  const completePracticeMutation = useMutation({
    mutationFn: async (practiceIndex: number) => {
      return apiRequest("POST", "/api/vision-quest/complete-practice", {
        stageId,
        practiceIndex,
        practiceTitle: stage.practices[practiceIndex].title
      });
    },
    onSuccess: (_, practiceIndex) => {
      setCompletedPractices(prev => [...prev, `${stageId}-${practiceIndex}`]);
      toast({
        title: "Practice Completed",
        description: "Your progress has been recorded on your journey.",
      });
    },
  });

  const beginPractice = (practiceIndex: number) => {
    setCurrentPractice(practiceIndex);
    toast({
      title: "Practice Begun",
      description: `Starting: ${stage.practices[practiceIndex].title}`,
    });
  };

  const completePractice = (practiceIndex: number) => {
    completePracticeMutation.mutate(practiceIndex);
    setCurrentPractice(null);
  };

  const getStageProgress = () => {
    const totalPractices = stage.practices.length;
    const completed = completedPractices.filter(p => p.startsWith(stageId)).length;
    return (completed / totalPractices) * 100;
  };

  const getNextStage = () => {
    const stageOrder = ['departure', 'initiation', 'revelation', 'integration'];
    const currentIndex = stageOrder.indexOf(stageId);
    return currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null;
  };

  const getPrevStage = () => {
    const stageOrder = ['departure', 'initiation', 'revelation', 'integration'];
    const currentIndex = stageOrder.indexOf(stageId);
    return currentIndex > 0 ? stageOrder[currentIndex - 1] : null;
  };

  const IconComponent = stage.icon;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center gap-4">
        <Link href="/vision-quest">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quest Overview
          </Button>
        </Link>
        <div className="flex-1" />
        <div className="flex gap-2">
          {getPrevStage() && (
            <Link href={`/vision-quest/stage/${getPrevStage()}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            </Link>
          )}
          {getNextStage() && (
            <Link href={`/vision-quest/stage/${getNextStage()}`}>
              <Button variant="outline" size="sm">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stage Header */}
      <div className={`relative rounded-2xl p-8 bg-gradient-to-br ${stage.color} text-white overflow-hidden`}>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <IconComponent className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{stage.name}</h1>
              <p className="text-white/80 text-lg">{stage.description}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Stage Progress</span>
              <span className="text-sm">{Math.round(getStageProgress())}%</span>
            </div>
            <Progress value={getStageProgress()} className="h-2 bg-white/20" />
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      </div>

      {/* Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Stage Practices</h2>
        
        {stage.practices.map((practice, index) => {
          const practiceKey = `${stageId}-${index}`;
          const isCompleted = completedPractices.includes(practiceKey);
          const isActive = currentPractice === index;
          
          return (
            <Card key={index} className={`transition-all duration-300 ${
              isActive ? 'ring-2 ring-blue-500 shadow-lg' : 
              isCompleted ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : isActive ? (
                        <Play className="h-6 w-6" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {practice.title}
                        <Badge variant="outline">{practice.type}</Badge>
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">{practice.description}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Duration: {practice.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isCompleted ? (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    ) : isActive ? (
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => completePractice(index)}
                          disabled={completePracticeMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCurrentPractice(null)}
                        >
                          Pause
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => beginPractice(index)}
                        size="sm"
                        variant="outline"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Begin
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {isActive && (
                <CardContent>
                  <Separator className="mb-4" />
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Practice Guidance
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Take your time with this practice. Find a quiet space where you won't be interrupted. 
                        Focus on being present and honest with yourself. Trust whatever insights arise.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Reflection Questions
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• What am I noticing in my body right now?</li>
                        <li>• What emotions or feelings are arising?</li>
                        <li>• What insights or messages am I receiving?</li>
                        <li>• How does this connect to my overall quest?</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Stage Navigation */}
      <div className="flex justify-between items-center pt-8 border-t">
        <div>
          {getPrevStage() && (
            <Link href={`/vision-quest/stage/${getPrevStage()}`}>
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Stage
              </Button>
            </Link>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Stage {Object.keys(QUEST_STAGES).indexOf(stageId) + 1} of {Object.keys(QUEST_STAGES).length}
          </p>
        </div>
        
        <div>
          {getNextStage() ? (
            <Link href={`/vision-quest/stage/${getNextStage()}`}>
              <Button>
                Next Stage
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link href="/vision-quest/completion">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-500">
                <Star className="h-4 w-4 mr-2" />
                Complete Quest
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}