import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  locked: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  type: 'video' | 'audio' | 'text' | 'exercise' | 'reflection';
  completed: boolean;
}

const COURSE_MODULES: Module[] = [
  {
    id: 'foundations',
    title: 'Foundations of Soul-Tech Wellness',
    description: 'Understand the intersection of technology, consciousness, and personal growth',
    duration: 45,
    completed: false,
    locked: false,
    lessons: [
      { id: 'intro', title: 'Introduction to Soul-Tech', duration: 8, type: 'video', completed: false },
      { id: 'mindset', title: 'Developing a Growth Mindset', duration: 12, type: 'audio', completed: false },
      { id: 'awareness', title: 'Building Self-Awareness', duration: 15, type: 'exercise', completed: false },
      { id: 'integration', title: 'Technology as a Wellness Tool', duration: 10, type: 'text', completed: false }
    ]
  },
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence in the Digital Age',
    description: 'Master your emotional landscape with AI-enhanced introspection',
    duration: 60,
    completed: false,
    locked: true,
    lessons: [
      { id: 'emotions', title: 'Understanding Your Emotional Patterns', duration: 15, type: 'video', completed: false },
      { id: 'regulation', title: 'Emotional Regulation Techniques', duration: 20, type: 'exercise', completed: false },
      { id: 'empathy', title: 'Developing Digital Empathy', duration: 12, type: 'audio', completed: false },
      { id: 'boundaries', title: 'Healthy Digital Boundaries', duration: 13, type: 'reflection', completed: false }
    ]
  },
  {
    id: 'relationships',
    title: 'Authentic Connection & Relationships',
    description: 'Build deeper connections using soul-tech principles',
    duration: 55,
    completed: false,
    locked: true,
    lessons: [
      { id: 'connection', title: 'The Science of Human Connection', duration: 10, type: 'video', completed: false },
      { id: 'communication', title: 'Conscious Communication', duration: 18, type: 'exercise', completed: false },
      { id: 'intimacy', title: 'Digital Intimacy & Vulnerability', duration: 15, type: 'reflection', completed: false },
      { id: 'community', title: 'Building Supportive Communities', duration: 12, type: 'text', completed: false }
    ]
  },
  {
    id: 'purpose',
    title: 'Purpose & Life Design',
    description: 'Discover and align with your deeper purpose using AI insights',
    duration: 70,
    completed: false,
    locked: true,
    lessons: [
      { id: 'values', title: 'Identifying Core Values', duration: 15, type: 'exercise', completed: false },
      { id: 'vision', title: 'Crafting Your Life Vision', duration: 20, type: 'reflection', completed: false },
      { id: 'goals', title: 'Soul-Aligned Goal Setting', duration: 18, type: 'video', completed: false },
      { id: 'action', title: 'Taking Inspired Action', duration: 17, type: 'exercise', completed: false }
    ]
  },
  {
    id: 'integration',
    title: 'Integration & Mastery',
    description: 'Integrate all learnings into a sustainable wellness practice',
    duration: 50,
    completed: false,
    locked: true,
    lessons: [
      { id: 'practice', title: 'Creating Your Daily Practice', duration: 15, type: 'exercise', completed: false },
      { id: 'habits', title: 'Advanced Habit Design', duration: 12, type: 'video', completed: false },
      { id: 'mastery', title: 'The Path to Mastery', duration: 10, type: 'audio', completed: false },
      { id: 'graduation', title: 'Your Graduation Ceremony', duration: 13, type: 'reflection', completed: false }
    ]
  }
];

interface LightPromptEdInterfaceProps {
  userId: string;
}

export function LightPromptEdInterface({ userId }: LightPromptEdInterfaceProps) {
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const getTotalProgress = () => {
    const totalLessons = COURSE_MODULES.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = COURSE_MODULES.reduce((total, module) => 
      total + module.lessons.filter(lesson => lesson.completed).length, 0
    );
    return (completedLessons / totalLessons) * 100;
  };

  const getModuleProgress = (module: Module) => {
    const completedLessons = module.lessons.filter(lesson => lesson.completed).length;
    return (completedLessons / module.lessons.length) * 100;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return 'fas fa-play-circle';
      case 'audio': return 'fas fa-headphones';
      case 'text': return 'fas fa-book-open';
      case 'exercise': return 'fas fa-dumbbell';
      case 'reflection': return 'fas fa-pen-fancy';
      default: return 'fas fa-circle';
    }
  };

  if (selectedLesson && selectedModule) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={() => setSelectedLesson(null)}
          variant="ghost" 
          className="mb-4"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to {selectedModule.title}
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="capitalize">
                {selectedLesson.type}
              </Badge>
              <span className="text-sm text-gray-600">
                <i className="fas fa-clock mr-1"></i>
                {selectedLesson.duration} minutes
              </span>
            </div>
            <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <i className={`${getLessonIcon(selectedLesson.type)} text-4xl text-teal-600 mb-4`}></i>
              <h3 className="text-lg font-medium mb-2">Lesson Content</h3>
              <p className="text-gray-600 mb-4">
                This {selectedLesson.type} lesson would contain the actual course content.
              </p>
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-600">
                <i className="fas fa-play mr-2"></i>
                Start Lesson
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline">
                <i className="fas fa-chevron-left mr-2"></i>
                Previous
              </Button>
              <Button 
                onClick={() => {
                  // Mark lesson as completed
                  toast({
                    title: "Lesson completed! ✨",
                    description: "Great progress on your wellness journey.",
                  });
                }}
                className="bg-gradient-to-r from-teal-600 to-cyan-600"
              >
                Complete Lesson
                <i className="fas fa-chevron-right ml-2"></i>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedModule) {
    return (
      <div className="space-y-6">
        <Button 
          onClick={() => setSelectedModule(null)}
          variant="ghost" 
          className="mb-4"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Course Overview
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{selectedModule.title}</CardTitle>
            <p className="text-gray-600">{selectedModule.description}</p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="outline">
                <i className="fas fa-clock mr-1"></i>
                {selectedModule.duration} minutes
              </Badge>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(getModuleProgress(selectedModule))}%</span>
                </div>
                <Progress value={getModuleProgress(selectedModule)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedModule.lessons.map((lesson, index) => (
                <div 
                  key={lesson.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${lesson.completed ? 'bg-teal-50 border-teal-200' : ''}`}
                  onClick={() => setSelectedLesson(lesson)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lesson.completed ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {lesson.completed ? (
                        <i className="fas fa-check text-sm"></i>
                      ) : (
                        <span className="text-sm">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{lesson.title}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="capitalize">
                          <i className={`${getLessonIcon(lesson.type)} mr-1`}></i>
                          {lesson.type}
                        </span>
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          {lesson.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-graduation-cap text-white text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">LightPrompt:ed</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive course in soul-tech wellness, designed to help you integrate technology 
          mindfully into your personal growth journey.
        </p>
      </div>

      {/* Course Progress */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Progress</h3>
            <Badge className="bg-gradient-to-r from-teal-600 to-cyan-600">
              {Math.round(getTotalProgress())}% Complete
            </Badge>
          </div>
          <Progress value={getTotalProgress()} className="mb-2" />
          <p className="text-sm text-gray-600">
            Keep going! You're on track to complete your soul-tech transformation.
          </p>
        </CardContent>
      </Card>

      {/* Course Modules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
        
        {COURSE_MODULES.map((module, index) => (
          <Card 
            key={module.id}
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
              module.locked ? 'opacity-75' : 'hover:-translate-y-1'
            } ${module.completed ? 'bg-green-50 border-green-200' : ''}`}
            onClick={() => !module.locked && setSelectedModule(module)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    module.completed ? 'bg-green-500 text-white' : 
                    module.locked ? 'bg-gray-300 text-gray-600' : 
                    'bg-teal-500 text-white'
                  }`}>
                    {module.completed ? (
                      <i className="fas fa-check"></i>
                    ) : module.locked ? (
                      <i className="fas fa-lock"></i>
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">{module.title}</h4>
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <Badge variant="outline">
                        <i className="fas fa-clock mr-1"></i>
                        {module.duration} minutes
                      </Badge>
                      <Badge variant="outline">
                        <i className="fas fa-list mr-1"></i>
                        {module.lessons.length} lessons
                      </Badge>
                      {module.locked && (
                        <Badge variant="secondary">
                          <i className="fas fa-lock mr-1"></i>
                          Locked
                        </Badge>
                      )}
                    </div>
                    
                    {!module.locked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(getModuleProgress(module))}%</span>
                        </div>
                        <Progress value={getModuleProgress(module)} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
                
                {!module.locked && (
                  <Button variant="outline" className="ml-4">
                    <i className="fas fa-play mr-2"></i>
                    {getModuleProgress(module) > 0 ? 'Continue' : 'Start'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon - VisionQuest */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-eye text-white"></i>
          </div>
          <h3 className="text-lg font-semibold mb-2">VisionQuest - Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            An advanced course in visionary practices, combining ancient wisdom with modern technology 
            for deep spiritual exploration and personal transformation.
          </p>
          <Badge variant="outline" className="bg-purple-100 border-purple-300">
            <i className="fas fa-calendar mr-1"></i>
            Launch: Q2 2025
          </Badge>
        </CardContent>
      </Card>

    </div>
  );
}