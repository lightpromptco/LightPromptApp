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

  const handlePurchase = () => {
    // TODO: Integrate with Stripe for course purchase
    toast({
      title: "Redirecting to checkout...",
      description: "You'll be taken to our secure payment portal.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-eye text-white text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">LightPrompt:ed</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A comprehensive course in soul-tech wellness, designed to help you integrate technology 
          mindfully into your personal growth journey.
        </p>
      </div>

      {/* Course Description */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">What You'll Learn</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <i className="fas fa-check text-teal-600 mt-1"></i>
                  <span>Foundations of soul-tech wellness and conscious technology use</span>
                </li>
                <li className="flex items-start space-x-3">
                  <i className="fas fa-check text-teal-600 mt-1"></i>
                  <span>Emotional intelligence in the digital age with AI-enhanced introspection</span>
                </li>
                <li className="flex items-start space-x-3">
                  <i className="fas fa-check text-teal-600 mt-1"></i>
                  <span>Building authentic connections and meaningful relationships</span>
                </li>
                <li className="flex items-start space-x-3">
                  <i className="fas fa-check text-teal-600 mt-1"></i>
                  <span>Purpose discovery and life design with AI insights</span>
                </li>
                <li className="flex items-start space-x-3">
                  <i className="fas fa-check text-teal-600 mt-1"></i>
                  <span>Integration practices for sustainable wellness transformation</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Course Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <i className="fas fa-clock text-2xl text-teal-600 mb-2"></i>
                  <div className="text-lg font-semibold">280+ minutes</div>
                  <div className="text-sm text-gray-600">of content</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <i className="fas fa-list text-2xl text-cyan-600 mb-2"></i>
                  <div className="text-lg font-semibold">12 modules</div>
                  <div className="text-sm text-gray-600">structured learning</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <i className="fas fa-video text-2xl text-purple-600 mb-2"></i>
                  <div className="text-lg font-semibold">Mixed format</div>
                  <div className="text-sm text-gray-600">text, exercises, AI bot</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <i className="fas fa-infinity text-2xl text-indigo-600 mb-2"></i>
                  <div className="text-lg font-semibold">Lifetime access</div>
                  <div className="text-sm text-gray-600">learn at your pace</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing and Purchase */}
      <Card className="border-2 border-teal-500">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Transform Your Wellness Journey</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of students who have discovered the power of soul-tech wellness. 
            This comprehensive course will guide you through every step of your transformation.
          </p>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              $120
              <span className="text-lg font-normal text-gray-600 ml-2">one-time payment</span>
            </div>
            <p className="text-sm text-gray-600">30-day money-back guarantee</p>
          </div>
          
          <Button 
            onClick={handlePurchase}
            size="lg" 
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-lg px-8 py-4"
          >
            <i className="fas fa-graduation-cap mr-2"></i>
            Enroll in LightPrompt:ed
          </Button>
          
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-green-500 mr-2"></i>
              Secure checkout
            </div>
            <div className="flex items-center">
              <i className="fas fa-mobile-alt text-blue-500 mr-2"></i>
              Access anywhere
            </div>
            <div className="flex items-center">
              <i className="fas fa-file-pdf text-purple-500 mr-2"></i>
              Downloadable PDF
            </div>
          </div>
        </CardContent>
      </Card>

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