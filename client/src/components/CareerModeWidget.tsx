import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, TrendingUp, Star, ChevronRight } from "lucide-react";

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

interface CareerModeWidgetProps {
  className?: string;
}

export function CareerModeWidget({ className = "" }: CareerModeWidgetProps) {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load birth data from localStorage
  useEffect(() => {
    const storedBirthData = localStorage.getItem('birthData');
    if (storedBirthData) {
      const parsed = JSON.parse(storedBirthData);
      setBirthData(parsed);
    }
  }, []);

  // Fetch career analysis data
  const { data: careerData, isLoading } = useQuery({
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
      
      if (!response.ok) return null;
      const data = await response.json();
      return data.careerGuidance as CareerGuidance;
    }
  });

  const getVibeMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getVibeMatchText = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Strong";
    if (score >= 70) return "Good";
    return "Growth";
  };

  if (!birthData) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Briefcase className="mr-2 h-5 w-5 text-teal-600" />
            Career Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Get astrological career guidance based on your birth chart.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/soul-map-explorer'}
            className="w-full"
          >
            Set Birth Info
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Briefcase className="mr-2 h-5 w-5 text-teal-600" />
            Career Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!careerData) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Briefcase className="mr-2 h-5 w-5 text-teal-600" />
            Career Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Career analysis unavailable. Please check your birth data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-teal-600" />
            Career Mode
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* VibeMatch Score */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-teal-600">{careerData.vibeMatchScore}%</div>
            <div className="text-xs text-gray-500">VibeMatch Score</div>
          </div>
          <Badge 
            variant="outline" 
            className={`${getVibeMatchColor(careerData.vibeMatchScore)} border-current`}
          >
            {getVibeMatchText(careerData.vibeMatchScore)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Career Alignment</span>
            <span>{careerData.vibeMatchScore}%</span>
          </div>
          <Progress value={careerData.vibeMatchScore} className="h-2" />
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-2 border-t">
            {/* Soul Purpose */}
            <div>
              <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                <Star className="mr-1 h-3 w-3 text-yellow-500" />
                Soul Purpose
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {careerData.soulPurpose}
              </p>
            </div>

            {/* Top 3 Ideal Careers */}
            <div>
              <div className="flex items-center text-sm font-medium text-gray-900 mb-2">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                Top Career Matches
              </div>
              <div className="space-y-1">
                {careerData.idealCareers.slice(0, 3).map((career, index) => (
                  <div key={index} className="text-xs text-gray-600 flex items-center">
                    <div className="w-1 h-1 bg-green-400 rounded-full mr-2 flex-shrink-0"></div>
                    {career}
                  </div>
                ))}
              </div>
            </div>

            {/* Natural Talents */}
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">Natural Talents</div>
              <div className="flex flex-wrap gap-1">
                {careerData.naturalTalents.slice(0, 3).map((talent, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                    {talent}
                  </Badge>
                ))}
              </div>
            </div>

            {/* SoulSync Areas */}
            <div>
              <div className="text-sm font-medium text-gray-900 mb-2">SoulSync Areas</div>
              <div className="flex flex-wrap gap-1">
                {careerData.soulSyncAreas.slice(0, 2).map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0 text-red-600 border-red-200">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}