import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users, CheckCircle, Star, Target } from "lucide-react";

const modules = [
  {
    title: "Foundation: Understanding Conscious AI",
    duration: "45 min",
    lessons: 6,
    description: "Learn the philosophy behind using AI as a reflection tool"
  },
  {
    title: "Self-Reflection Practices",
    duration: "60 min", 
    lessons: 8,
    description: "Guided exercises for deeper self-connection through AI"
  },
  {
    title: "Nature & Technology Integration",
    duration: "40 min",
    lessons: 5,
    description: "Bridging digital consciousness with natural awareness"
  },
  {
    title: "Authentic Relationships", 
    duration: "55 min",
    lessons: 7,
    description: "Using soul-tech tools to enhance human connections"
  },
  {
    title: "Daily Practice & Integration",
    duration: "35 min",
    lessons: 4,
    description: "Building sustainable conscious tech habits"
  },
  {
    title: "Community & Shared Growth",
    duration: "30 min",
    lessons: 3,
    description: "Creating supportive soul-tech communities"
  }
];

export default function CoursePage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-teal-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
          <Play className="h-16 w-16 text-white" />
        </div>
        
        <div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4">
            LightPrompt:ed
            <br />
            <span className="text-teal-500">The Complete Course</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Master the art of conscious AI use through guided video lessons, interactive exercises, 
            and a supportive community of soul-tech practitioners.
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-teal-500" />
            <span>4.5 hours of content</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-teal-500" />
            <span>33 video lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-500" />
            <span>Community access</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4">
            Enroll Now - $197
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-4">
            Watch Free Preview
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-gray-600">4.9/5 student rating</span>
          </div>
          <Badge variant="secondary">600+ students enrolled</Badge>
        </div>
      </div>

      {/* Course Modules */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
            Course Curriculum
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Six comprehensive modules designed to transform your relationship with technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      Module {index + 1}: {module.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {module.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {module.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    {module.lessons} lessons
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">What's Included</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              <span>4.5 hours of HD video content</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              <span>Downloadable reflection guides</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              <span>Interactive exercises & prompts</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              <span>Private community access</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              <span>Lifetime access to all content</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              <span>Monthly Q&A sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              <span>Certificate of completion</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-teal-500" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="bg-teal-50 dark:bg-teal-950/20 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-semibold mb-4">Ready to Transform Your Tech Relationship?</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Join hundreds of students learning to use AI consciously for deeper self-connection 
          and authentic relationships.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white px-12 py-4">
            Enroll Today
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-4">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}