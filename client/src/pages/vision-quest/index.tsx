import { useState } from "react";
import { Link, useLocation } from "wouter";
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
  CheckCircle,
  ArrowRight,
  Timer,
  Target,
  Heart
} from "lucide-react";

const QUEST_STAGES = [
  {
    id: 'departure',
    name: 'The Departure',
    icon: Compass,
    description: 'Leaving the familiar to discover your truth',
    color: 'from-blue-500 to-cyan-500',
    practices: [
      { name: 'Intention Setting', duration: '15 min', completed: false },
      { name: 'Sacred Space Creation', duration: '20 min', completed: false },
      { name: 'Fear Release Ceremony', duration: '25 min', completed: false }
    ]
  },
  {
    id: 'initiation',
    name: 'The Initiation',
    icon: Mountain,
    description: 'Facing challenges that forge your spirit',
    color: 'from-orange-500 to-red-500',
    practices: [
      { name: 'Shadow Integration', duration: '30 min', completed: false },
      { name: 'Inner Dialogue Practice', duration: '20 min', completed: false },
      { name: 'Courage Building Ritual', duration: '25 min', completed: false }
    ]
  },
  {
    id: 'revelation',
    name: 'The Revelation',
    icon: Eye,
    description: 'Receiving insights about your purpose',
    color: 'from-purple-500 to-indigo-500',
    practices: [
      { name: 'Vision Seeking Meditation', duration: '40 min', completed: false },
      { name: 'Dream Work Analysis', duration: '30 min', completed: false },
      { name: 'Symbolic Understanding', duration: '25 min', completed: false }
    ]
  },
  {
    id: 'integration',
    name: 'The Integration',
    icon: Star,
    description: 'Bringing wisdom back to daily life',
    color: 'from-green-500 to-emerald-500',
    practices: [
      { name: 'Wisdom Anchoring', duration: '20 min', completed: false },
      { name: 'Life Design Planning', duration: '35 min', completed: false },
      { name: 'Community Sharing', duration: '15 min', completed: false }
    ]
  }
];

export default function VisionQuestIndexPage() {
  const [currentStage, setCurrentStage] = useState(0);
  const [, setLocation] = useLocation();
  
  const overallProgress = QUEST_STAGES.reduce((total, stage) => {
    const stageProgress = stage.practices.filter(p => p.completed).length / stage.practices.length;
    return total + stageProgress;
  }, 0) / QUEST_STAGES.length * 100;

  const navigateToStage = (stageId: string) => {
    setLocation(`/vision-quest/stage/${stageId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-purple-950 dark:via-indigo-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Your Vision Quest Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A transformative 4-stage journey of self-discovery, inner work, and spiritual awakening.
            Each stage contains 3 powerful practices to guide your evolution.
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Quest Progress</h3>
              <Badge variant="outline" className="px-3 py-1">
                {Math.round(overallProgress)}% Complete
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Complete all 12 practices across 4 stages to finish your Vision Quest
            </p>
          </CardContent>
        </Card>

        {/* Quest Stages */}
        <div className="grid gap-6">
          {QUEST_STAGES.map((stage, index) => {
            const StageIcon = stage.icon;
            const stageProgress = stage.practices.filter(p => p.completed).length;
            const totalPractices = stage.practices.length;
            const isCurrentStage = index === currentStage;
            const isUnlocked = index <= currentStage;
            
            return (
              <Card 
                key={stage.id}
                className={`transition-all duration-300 ${
                  isCurrentStage 
                    ? 'ring-2 ring-purple-500 shadow-lg scale-[1.02]' 
                    : isUnlocked 
                      ? 'hover:shadow-md cursor-pointer' 
                      : 'opacity-60'
                }`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${stage.color}`}>
                        <StageIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{stage.name}</CardTitle>
                        <p className="text-muted-foreground">{stage.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {stageProgress}/{totalPractices} Practices
                      </div>
                      <Progress 
                        value={(stageProgress / totalPractices) * 100} 
                        className="w-20 h-2 mt-1" 
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {stage.practices.map((practice, practiceIndex) => (
                      <div 
                        key={practiceIndex}
                        className={`p-3 rounded-lg border ${
                          practice.completed 
                            ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {practice.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Timer className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="font-medium text-sm">{practice.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {practice.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      Stage {index + 1} of 4
                    </div>
                    
                    {isUnlocked ? (
                      <Button 
                        onClick={() => navigateToStage(stage.id)}
                        className={`bg-gradient-to-r ${stage.color} hover:opacity-90`}
                      >
                        {stageProgress === totalPractices ? 'Review Stage' : 'Continue Stage'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Locked
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quest Completion */}
        {overallProgress === 100 && (
          <Card className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                Quest Complete!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Congratulations on completing your Vision Quest. You have transformed through the four sacred stages 
                of departure, initiation, revelation, and integration.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                <Heart className="h-4 w-4 mr-2" />
                Share Your Journey
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}