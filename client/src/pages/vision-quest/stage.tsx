import { useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Compass, 
  Mountain, 
  Eye,
  Star,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const QUEST_STAGES = [
  {
    id: 'departure',
    name: 'The Departure',
    icon: Compass,
    description: 'Leaving the familiar to discover your truth',
    color: 'from-blue-500 to-cyan-500',
    practices: [
      {
        id: 'intention-setting',
        name: 'Intention Setting',
        duration: 15,
        description: 'Create a sacred intention for your quest journey',
        instructions: [
          'Find a quiet space where you won\'t be disturbed',
          'Light a candle or create a simple altar',
          'Reflect on what you seek to discover about yourself',
          'Write down your intention in present tense',
          'Speak your intention aloud three times'
        ],
        reflection: 'What intention feels most authentic to your soul right now?'
      },
      {
        id: 'sacred-space',
        name: 'Sacred Space Creation',
        duration: 20,
        description: 'Establish a physical and energetic container for your work',
        instructions: [
          'Choose a space that feels special and private',
          'Cleanse the space with sage, sound, or intention',
          'Place meaningful objects that represent the four elements',
          'Create clear boundaries around your sacred time',
          'Invoke protection and guidance from your highest self'
        ],
        reflection: 'How does this sacred space support your inner journey?'
      },
      {
        id: 'fear-release',
        name: 'Fear Release Ceremony',
        duration: 25,
        description: 'Release the fears that hold you back from growth',
        instructions: [
          'Write down your fears about this journey on paper',
          'Acknowledge each fear with compassion',
          'Burn the paper safely or bury it in earth',
          'Visualize the fears transforming into courage',
          'Step forward symbolically into your quest'
        ],
        reflection: 'What fears are you ready to transform into wisdom?'
      }
    ]
  },
  {
    id: 'initiation',
    name: 'The Initiation',
    icon: Mountain,
    description: 'Facing challenges that forge your spirit',
    color: 'from-orange-500 to-red-500',
    practices: [
      {
        id: 'shadow-integration',
        name: 'Shadow Integration',
        duration: 30,
        description: 'Meet and integrate the rejected aspects of yourself',
        instructions: [
          'Identify a quality you judge in others',
          'Find where this quality exists within you',
          'Dialogue with this shadow aspect',
          'Discover the gift hidden in the shadow',
          'Practice loving acceptance of your wholeness'
        ],
        reflection: 'What shadow aspect is ready to become an ally?'
      },
      {
        id: 'inner-dialogue',
        name: 'Inner Dialogue Practice',
        duration: 20,
        description: 'Develop a conscious relationship with your inner voices',
        instructions: [
          'Identify the different voices in your head',
          'Give each voice a name and character',
          'Have a conversation between your wise self and critic',
          'Set boundaries with unhelpful internal voices',
          'Strengthen the voice of your authentic self'
        ],
        reflection: 'Which inner voice deserves more airtime in your life?'
      },
      {
        id: 'courage-building',
        name: 'Courage Building Ritual',
        duration: 25,
        description: 'Cultivate the courage to live authentically',
        instructions: [
          'Recall a time when you acted with great courage',
          'Feel that courage energy in your body',
          'Identify an area where you need courage now',
          'Create a power gesture or phrase',
          'Commit to one courageous action this week'
        ],
        reflection: 'How will you embody courage in your daily life?'
      }
    ]
  },
  {
    id: 'revelation',
    name: 'The Revelation',
    icon: Eye,
    description: 'Receiving insights about your purpose',
    color: 'from-purple-500 to-indigo-500',
    practices: [
      {
        id: 'vision-seeking',
        name: 'Vision Seeking Meditation',
        duration: 40,
        description: 'Open to receiving visions of your highest potential',
        instructions: [
          'Enter deep meditation or trance state',
          'Ask for a vision of your soul\'s purpose',
          'Remain open without forcing anything',
          'Receive whatever images, words, or feelings come',
          'Record your vision immediately after'
        ],
        reflection: 'What vision wants to be born through you?'
      },
      {
        id: 'dream-work',
        name: 'Dream Work Analysis',
        duration: 30,
        description: 'Decode the wisdom messages from your unconscious',
        instructions: [
          'Review recent dreams for patterns and symbols',
          'Choose one dream that feels significant',
          'Identify the key symbols and their personal meaning',
          'Dialogue with dream characters',
          'Extract the guidance for your waking life'
        ],
        reflection: 'What is your unconscious trying to tell you?'
      },
      {
        id: 'symbolic-understanding',
        name: 'Symbolic Understanding',
        duration: 25,
        description: 'Interpret the signs and synchronicities around you',
        instructions: [
          'Notice recent synchronicities in your life',
          'Identify recurring symbols or themes',
          'Research the archetypal meaning of key symbols',
          'Find the personal meaning for your journey',
          'Create a symbol or totem for your quest'
        ],
        reflection: 'What symbols are guiding your path forward?'
      }
    ]
  },
  {
    id: 'integration',
    name: 'The Integration',
    icon: Star,
    description: 'Bringing wisdom back to daily life',
    color: 'from-green-500 to-emerald-500',
    practices: [
      {
        id: 'wisdom-anchoring',
        name: 'Wisdom Anchoring',
        duration: 20,
        description: 'Anchor your insights into practical wisdom',
        instructions: [
          'Review all insights from your quest journey',
          'Identify the 3 most important realizations',
          'Create a daily practice to embody each insight',
          'Design reminders to keep wisdom active',
          'Share your wisdom with a trusted friend'
        ],
        reflection: 'How will you live differently because of this quest?'
      },
      {
        id: 'life-design',
        name: 'Life Design Planning',
        duration: 35,
        description: 'Redesign your life aligned with your authentic self',
        instructions: [
          'Envision your life 1 year from now',
          'Identify what needs to change to honor your authentic self',
          'Create a step-by-step action plan',
          'Set specific goals with timelines',
          'Commit to your first three action steps'
        ],
        reflection: 'What changes will you make to live more authentically?'
      },
      {
        id: 'community-sharing',
        name: 'Community Sharing',
        duration: 15,
        description: 'Share your journey to inspire others',
        instructions: [
          'Choose how you want to share your quest story',
          'Identify the key lessons that could help others',
          'Find your authentic voice for sharing wisdom',
          'Connect with others on similar journeys',
          'Commit to ongoing service and support'
        ],
        reflection: 'How will your journey serve the greater good?'
      }
    ]
  }
];

export default function VisionQuestStagePage() {
  const [, params] = useRoute('/vision-quest/stage/:stageId');
  const [, setLocation] = useLocation();
  const [currentPractice, setCurrentPractice] = useState(0);
  const [practiceTimer, setPracticeTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [reflection, setReflection] = useState('');
  const [completedPractices, setCompletedPractices] = useState<string[]>([]);

  const stageId = params?.stageId;
  const stage = QUEST_STAGES.find(s => s.id === stageId);
  
  const currentStageIndex = QUEST_STAGES.findIndex(s => s.id === stageId);
  const previousStage = currentStageIndex > 0 ? QUEST_STAGES[currentStageIndex - 1] : null;
  const nextStage = currentStageIndex < QUEST_STAGES.length - 1 ? QUEST_STAGES[currentStageIndex + 1] : null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && practiceTimer > 0) {
      interval = setInterval(() => {
        setPracticeTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, practiceTimer]);

  if (!stage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stage Not Found</h2>
            <Link href="/vision-quest/index">
              <Button>Return to Quest Overview</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StageIcon = stage.icon;
  const practice = stage.practices[currentPractice];

  const startPracticeTimer = () => {
    setPracticeTimer(practice.duration * 60); // Convert minutes to seconds
    setIsTimerRunning(true);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setPracticeTimer(practice.duration * 60);
    setIsTimerRunning(false);
  };

  const completePractice = () => {
    const practiceId = practice.id;
    if (!completedPractices.includes(practiceId)) {
      setCompletedPractices([...completedPractices, practiceId]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-purple-950 dark:via-indigo-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/vision-quest/index">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          
          <div className="flex gap-2">
            {previousStage && (
              <Link href={`/vision-quest/stage/${previousStage.id}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {previousStage.name}
                </Button>
              </Link>
            )}
            {nextStage && (
              <Link href={`/vision-quest/stage/${nextStage.id}`}>
                <Button variant="outline" size="sm">
                  {nextStage.name}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stage Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-full bg-gradient-to-r ${stage.color}`}>
                <StageIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">{stage.name}</CardTitle>
                <p className="text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Practice Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Stage Practices</h3>
              <Badge variant="outline">
                {currentPractice + 1} of {stage.practices.length}
              </Badge>
            </div>
            <div className="flex gap-2">
              {stage.practices.map((p, index) => (
                <Button
                  key={index}
                  variant={index === currentPractice ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPractice(index)}
                  className="flex-1"
                >
                  {completedPractices.includes(p.id) && (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  {p.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Practice */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Practice Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {completedPractices.includes(practice.id) ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
                {practice.name}
              </CardTitle>
              <p className="text-muted-foreground">{practice.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Timer */}
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-mono font-bold mb-2">
                    {practiceTimer > 0 ? formatTime(practiceTimer) : `${practice.duration}:00`}
                  </div>
                  <div className="flex justify-center gap-2">
                    {practiceTimer === 0 ? (
                      <Button onClick={startPracticeTimer} size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Start Timer
                      </Button>
                    ) : (
                      <>
                        <Button onClick={toggleTimer} size="sm" variant="outline">
                          {isTimerRunning ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button onClick={resetTimer} size="sm" variant="outline">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className="font-semibold mb-2">Practice Steps:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {practice.instructions.map((instruction, index) => (
                      <li key={index} className="text-sm">{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reflection */}
          <Card>
            <CardHeader>
              <CardTitle>Reflection</CardTitle>
              <p className="text-muted-foreground">{practice.reflection}</p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Write your reflections here..."
                className="min-h-[200px] mb-4"
              />
              
              <div className="space-y-2">
                <Button 
                  onClick={completePractice}
                  className="w-full"
                  disabled={completedPractices.includes(practice.id)}
                >
                  {completedPractices.includes(practice.id) ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Practice Completed
                    </>
                  ) : (
                    'Mark as Complete'
                  )}
                </Button>
                
                {currentPractice < stage.practices.length - 1 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setCurrentPractice(currentPractice + 1)}
                  >
                    Next Practice
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}