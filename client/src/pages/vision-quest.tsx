import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  CheckCircle, 
  Play, 
  Star, 
  Trophy, 
  Compass, 
  Mountain,
  Sparkles,
  BookOpen,
  Lightbulb,
  Heart,
  Eye,
  Sunrise,
  Moon,
  TreePine,
  Waves,
  Send,
  Clock,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VisionQuest {
  id: string;
  title: string;
  description: string;
  phase: 'preparation' | 'journey' | 'integration' | 'mastery';
  category: 'soul-mapping' | 'authentic-expression' | 'conscious-connection' | 'life-purpose';
  duration: string;
  steps: QuestStep[];
  isActive: boolean;
  isCompleted: boolean;
  prismPoints: number;
  icon: any;
}

interface QuestStep {
  id: string;
  title: string;
  description: string;
  type: 'reflection' | 'meditation' | 'journaling' | 'action';
  isCompleted: boolean;
  guidance: string;
  prompts?: string[];
}

export default function VisionQuestPage() {
  const [selectedQuest, setSelectedQuest] = useState<VisionQuest | null>(null);
  const [activeTab, setActiveTab] = useState('journey');
  const [questResponse, setQuestResponse] = useState('');
  const { toast } = useToast();

  const visionQuests: VisionQuest[] = [
    {
      id: 'inner-compass',
      title: 'Discovering Your Inner Compass',
      description: 'Connect with your authentic values and inner guidance system',
      phase: 'preparation',
      category: 'soul-mapping',
      duration: '45 minutes',
      icon: Compass,
      isActive: true,
      isCompleted: false,
      prismPoints: 150,
      steps: [
        {
          id: 'step1',
          title: 'Centering Meditation',
          description: 'Ground yourself in the present moment',
          type: 'meditation',
          isCompleted: false,
          guidance: 'Find a quiet space and take 10 deep breaths',
          prompts: ['What does inner peace feel like in your body?']
        },
        {
          id: 'step2',
          title: 'Values Reflection',
          description: 'Identify your core values and principles',
          type: 'reflection',
          isCompleted: false,
          guidance: 'Consider what truly matters to you beyond external expectations',
          prompts: [
            'What principles would you never compromise?',
            'When do you feel most aligned with yourself?',
            'What legacy do you want to leave?'
          ]
        }
      ]
    },
    {
      id: 'authentic-voice',
      title: 'Finding Your Authentic Voice',
      description: 'Explore and express your unique perspective and truth',
      phase: 'journey',
      category: 'authentic-expression',
      duration: '60 minutes',
      icon: Heart,
      isActive: false,
      isCompleted: false,
      prismPoints: 200,
      steps: [
        {
          id: 'step1',
          title: 'Truth Inventory',
          description: 'Identify where you hold back your authentic self',
          type: 'reflection',
          isCompleted: false,
          guidance: 'Explore areas where you feel you cannot be fully yourself',
          prompts: ['Where do you feel most authentic?', 'What truths are you afraid to speak?']
        }
      ]
    },
    {
      id: 'conscious-connection',
      title: 'Building Conscious Connections',
      description: 'Learn to form deeper, more meaningful relationships',
      phase: 'integration',
      category: 'conscious-connection',
      duration: '90 minutes',
      icon: Users,
      isActive: false,
      isCompleted: true,
      prismPoints: 250,
      steps: []
    },
    {
      id: 'life-purpose',
      title: 'Clarifying Your Life Purpose',
      description: 'Discover your unique contribution to the world',
      phase: 'mastery',
      category: 'life-purpose',
      duration: '120 minutes',
      icon: Star,
      isActive: false,
      isCompleted: false,
      prismPoints: 300,
      steps: []
    }
  ];

  const totalQuests = visionQuests.length;
  const completedQuests = visionQuests.filter(q => q.isCompleted).length;
  const progressPercentage = (completedQuests / totalQuests) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'soul-mapping': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'authentic-expression': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'conscious-connection': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'life-purpose': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleQuestStart = (quest: VisionQuest) => {
    setSelectedQuest(quest);
    toast({
      title: "Quest Started",
      description: `Beginning ${quest.title}`,
    });
  };

  const handleStepComplete = (stepId: string) => {
    if (selectedQuest) {
      const updatedSteps = selectedQuest.steps.map(step =>
        step.id === stepId ? { ...step, isCompleted: true } : step
      );
      setSelectedQuest({ ...selectedQuest, steps: updatedSteps });
      
      toast({
        title: "Step Complete",
        description: "Great progress on your vision quest!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
            Vision Quest
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Interactive self-discovery journey with challenges and personal growth tracking
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-teal-500" />
              Your Journey Progress
            </CardTitle>
            <CardDescription>
              Track your progress through the vision quest challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-500">{completedQuests}/{totalQuests} completed</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {visionQuests.reduce((total, quest) => total + (quest.isCompleted ? quest.prismPoints : 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Prism Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="journey">Quest Journey</TabsTrigger>
            <TabsTrigger value="active">Active Quest</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Quest Journey Tab */}
          <TabsContent value="journey" className="space-y-6">
            <div className="grid gap-6">
              {visionQuests.map((quest) => {
                const IconComponent = quest.icon;
                return (
                  <Card key={quest.id} className={`transition-all duration-200 ${quest.isActive ? 'ring-2 ring-teal-500' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-teal-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{quest.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {quest.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {quest.isCompleted && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                          {quest.isActive && (
                            <Badge className="bg-teal-100 text-teal-700 border-teal-200">
                              <Play className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <Badge variant="outline" className={getCategoryColor(quest.category)}>
                            {quest.category.replace('-', ' ')}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {quest.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {quest.prismPoints} points
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          {quest.isCompleted ? (
                            <Button variant="outline" disabled>
                              <Trophy className="w-4 h-4 mr-2" />
                              Completed
                            </Button>
                          ) : quest.isActive ? (
                            <Button onClick={() => setActiveTab('active')}>
                              Continue Quest
                            </Button>
                          ) : (
                            <Button onClick={() => handleQuestStart(quest)}>
                              <Play className="w-4 h-4 mr-2" />
                              Start Quest
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Active Quest Tab */}
          <TabsContent value="active" className="space-y-6">
            {selectedQuest ? (
              <div className="space-y-6">
                {/* Quest Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                        <selectedQuest.icon className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <CardTitle>{selectedQuest.title}</CardTitle>
                        <CardDescription>{selectedQuest.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Quest Steps */}
                <div className="space-y-4">
                  {selectedQuest.steps.map((step, index) => (
                    <Card key={step.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              step.isCompleted 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {step.isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{step.title}</CardTitle>
                              <CardDescription>{step.description}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {step.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <Lightbulb className="w-4 h-4 inline mr-2" />
                            {step.guidance}
                          </p>
                        </div>

                        {step.prompts && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">Reflection Prompts:</h4>
                            {step.prompts.map((prompt, promptIndex) => (
                              <div key={promptIndex} className="space-y-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">{prompt}</p>
                                <Textarea
                                  placeholder="Your reflection..."
                                  className="min-h-24"
                                  value={questResponse}
                                  onChange={(e) => setQuestResponse(e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {!step.isCompleted && (
                          <Button onClick={() => handleStepComplete(step.id)} className="w-full">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete Step
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Mountain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Active Quest
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start a vision quest to begin your self-discovery journey
                  </p>
                  <Button onClick={() => setActiveTab('journey')}>
                    Explore Quests
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-500" />
                    Journey Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your vision quest journey reveals patterns of growth and self-discovery
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Self-awareness</span>
                        <span className="text-sm font-medium">Growing</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Authentic expression</span>
                        <span className="text-sm font-medium">Developing</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Life clarity</span>
                        <span className="text-sm font-medium">Emerging</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-500" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Continue your journey with these recommended paths
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Heart className="w-4 h-4 mr-2" />
                        Explore Soul Map
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Connect with Community
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}