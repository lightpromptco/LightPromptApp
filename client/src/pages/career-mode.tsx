import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Target, Lightbulb, AlertTriangle, Star, Briefcase, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CareerGuidance {
  soulPurpose: string;
  idealCareers: string[];
  workStyle: string;
  leadership: string;
  challenges: string[];
  naturalTalents: string[];
  vibeMatchScore: number;
  soulSyncAreas: string[];
}

interface BirthData {
  date: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  name?: string;
}

export default function CareerModePage() {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [currentRole, setCurrentRole] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const { toast } = useToast();

  // Load birth data from localStorage
  useEffect(() => {
    const storedBirthData = localStorage.getItem('birthData');
    if (storedBirthData) {
      const parsed = JSON.parse(storedBirthData);
      setBirthData(parsed);
      console.log('Loaded birth data for career analysis:', parsed);
    }
  }, []);

  // Fetch career analysis data
  const { data: careerData, isLoading: careerLoading, error: careerError } = useQuery({
    queryKey: ['/api/birth-chart', birthData],
    enabled: !!birthData,
    queryFn: async () => {
      if (!birthData) return null;
      
      const birthDate = new Date(birthData.date);
      const response = await fetch('/api/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: birthDate.getDate(),
          month: birthDate.getMonth() + 1,
          year: birthDate.getFullYear(),
          hour: birthData.time ? parseInt(birthData.time.split(':')[0]) : 12,
          min: birthData.time ? parseInt(birthData.time.split(':')[1]) : 0,
          lat: birthData.lat,
          lng: birthData.lng
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch career analysis');
      }
      
      const data = await response.json();
      return data.careerGuidance as CareerGuidance;
    }
  });

  // Get current astronomical data for timing insights
  const { data: astroData } = useQuery({
    queryKey: ['/api/astro/now'],
    queryFn: async () => {
      const response = await fetch('/api/astro/now');
      return response.json();
    },
    refetchInterval: 300000 // Update every 5 minutes
  });

  const handleSetBirthData = () => {
    window.location.href = '/soul-map-explorer';
  };

  const getVibeMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getVibeMatchText = (score: number) => {
    if (score >= 90) return "Excellent Alignment";
    if (score >= 80) return "Strong Match";
    if (score >= 70) return "Good Potential";
    return "Growth Opportunity";
  };

  if (!birthData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Briefcase className="mx-auto h-16 w-16 text-teal-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Mode</h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover your cosmic career blueprint through astrological insights. 
              Get personalized guidance on your ideal career path, natural talents, and professional timing.
            </p>
          </div>
          
          <Card className="p-8">
            <CardHeader>
              <CardTitle>Get Started with Your Career Analysis</CardTitle>
              <CardDescription>
                To provide accurate career guidance, we need your birth information for astrological calculations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSetBirthData} className="w-full">
                Set Birth Information
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (careerLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Career Mode</h1>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (careerError || !careerData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-yellow-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Unavailable</h2>
          <p className="text-gray-600 mb-8">
            Unable to generate your career analysis. Please try refreshing the page or check your birth data.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Career Cosmic Blueprint</h1>
          <p className="text-lg text-gray-600 mb-6">
            Astrological insights for your professional journey
          </p>
          
          {/* VibeMatch Score */}
          <div className="inline-flex items-center space-x-4 bg-white rounded-lg border p-4 shadow-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{careerData.vibeMatchScore}%</div>
              <div className="text-sm text-gray-500">VibeMatch Score</div>
            </div>
            <div className="border-l pl-4">
              <Badge className={getVibeMatchColor(careerData.vibeMatchScore)}>
                {getVibeMatchText(careerData.vibeMatchScore)}
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="careers">Ideal Careers</TabsTrigger>
            <TabsTrigger value="talents">Talents & Style</TabsTrigger>
            <TabsTrigger value="timing">Cosmic Timing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Soul Purpose */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Soul Purpose
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{careerData.soulPurpose}</p>
                </CardContent>
              </Card>

              {/* Work Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                    Work Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{careerData.workStyle}</p>
                </CardContent>
              </Card>

              {/* Leadership Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                    Leadership Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{careerData.leadership}</p>
                </CardContent>
              </Card>

              {/* SoulSync Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 h-5 w-5 text-red-500" />
                    SoulSync Areas
                  </CardTitle>
                  <CardDescription>
                    Areas for deep soul alignment in your professional life
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {careerData.soulSyncAreas.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-red-600 border-red-200">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="careers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-teal-500" />
                  Ideal Career Paths
                </CardTitle>
                <CardDescription>
                  Careers that align with your astrological blueprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {careerData.idealCareers.map((career, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900">{career}</h4>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                  Growth Areas & Challenges
                </CardTitle>
                <CardDescription>
                  Areas to be mindful of in your professional development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {careerData.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700">{challenge}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="talents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                  Natural Talents
                </CardTitle>
                <CardDescription>
                  Your innate strengths and abilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {careerData.naturalTalents.map((talent, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{talent}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* VibeMatch Progress */}
            <Card>
              <CardHeader>
                <CardTitle>VibeMatch Analysis</CardTitle>
                <CardDescription>
                  How well your current path aligns with your cosmic blueprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Career Alignment</span>
                    <span className="text-sm text-gray-500">{careerData.vibeMatchScore}%</span>
                  </div>
                  <Progress value={careerData.vibeMatchScore} className="h-3" />
                  <p className="text-sm text-gray-600">
                    Your current career path shows {getVibeMatchText(careerData.vibeMatchScore).toLowerCase()} 
                    with your astrological potential. 
                    {careerData.vibeMatchScore < 80 && " Consider exploring roles that better align with your soul purpose."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timing" className="space-y-6">
            {astroData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-purple-500" />
                    Cosmic Timing Insights
                  </CardTitle>
                  <CardDescription>
                    Current planetary influences for career decisions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border">
                      <h4 className="font-semibold text-purple-900 mb-2">Current Moon Phase</h4>
                      <p className="text-purple-700">
                        {astroData.moon.emoji} {astroData.moon.phaseName} in {astroData.moon.signName}
                      </p>
                      <p className="text-sm text-purple-600 mt-1">
                        {astroData.moon.phaseName === 'New Moon' && "Ideal time for new career beginnings and setting intentions."}
                        {astroData.moon.phaseName === 'Waxing Crescent' && "Focus on building momentum in current projects."}
                        {astroData.moon.phaseName === 'First Quarter' && "Time to push through challenges and make decisive moves."}
                        {astroData.moon.phaseName === 'Waxing Gibbous' && "Refine your approach and prepare for completion."}
                        {astroData.moon.phaseName === 'Full Moon' && "Peak energy for major career announcements or completions."}
                        {astroData.moon.phaseName === 'Waning Gibbous' && "Time to share knowledge and mentor others."}
                        {astroData.moon.phaseName === 'Last Quarter' && "Release what no longer serves your career growth."}
                        {astroData.moon.phaseName === 'Waning Crescent' && "Rest and reflect on lessons learned. Plan for the next cycle."}
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 bg-blue-50 rounded-lg border">
                        <h4 className="font-semibold text-blue-900 mb-2">Mercury Position</h4>
                        <p className="text-blue-700">In {astroData.planets.mercury.signName}</p>
                        <p className="text-sm text-blue-600">
                          Good time for communication, contracts, and networking.
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border">
                        <h4 className="font-semibold text-green-900 mb-2">Jupiter Position</h4>
                        <p className="text-green-700">In {astroData.planets.jupiter.signName}</p>
                        <p className="text-sm text-green-600">
                          Opportunities for growth and expansion in this area.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Career Action Steps</CardTitle>
                <CardDescription>
                  Recommended next steps based on your cosmic blueprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Align with Your Soul Purpose</h4>
                      <p className="text-gray-600 text-sm">Reflect on how your current role connects to your deeper mission</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Develop Natural Talents</h4>
                      <p className="text-gray-600 text-sm">Focus on strengthening your innate abilities and skills</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Address Growth Areas</h4>
                      <p className="text-gray-600 text-sm">Work on the challenges identified in your analysis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Explore Ideal Career Paths</h4>
                      <p className="text-gray-600 text-sm">Research opportunities in your recommended career areas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}