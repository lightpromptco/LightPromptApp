import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, TrendingUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

interface EmotionData {
  dominantMood: string;
  calmPercentage: number;
  totalEntries: number;
  recentMood: string;
  moodDistribution: Record<string, number>;
}

interface EmotionCalmImageProps {
  userId: string;
  className?: string;
}

const MOOD_COLORS = {
  calm: "from-blue-400 to-cyan-300",
  happy: "from-yellow-400 to-orange-300", 
  energetic: "from-green-400 to-teal-300",
  peaceful: "from-purple-400 to-indigo-300",
  grateful: "from-pink-400 to-rose-300",
  focused: "from-indigo-400 to-blue-300",
  content: "from-emerald-400 to-green-300",
  neutral: "from-gray-400 to-slate-300",
  anxious: "from-red-400 to-orange-400",
  sad: "from-blue-500 to-gray-500",
  stressed: "from-red-500 to-pink-500"
};

const CALM_MESSAGES = {
  high: "Your inner calm shines bright 🌟",
  medium: "Finding balance on your journey ⚖️", 
  low: "Every breath is a new beginning 🌱",
  none: "Start your mindfulness journey today 💫"
};

export function EmotionCalmImage({ userId, className }: EmotionCalmImageProps) {
  const [showDetail, setShowDetail] = useState(false);

  const { data: emotionData, isLoading } = useQuery<EmotionData>({
    queryKey: ['/api/wellness/emotions', userId],
    enabled: !!userId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse mb-4" />
          <p className="text-sm text-muted-foreground">Loading your calm insights...</p>
        </CardContent>
      </Card>
    );
  }

  if (!emotionData || emotionData.totalEntries === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-800 dark:to-blue-800 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-purple-600 dark:text-purple-300" />
          </div>
          <h3 className="font-semibold mb-2">Begin Your Wellness Journey</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start tracking your emotions to see your calm insights here
          </p>
          <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500">
            <Sparkles className="w-4 h-4 mr-2" />
            First Check-in
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { dominantMood, calmPercentage, totalEntries, recentMood } = emotionData;
  
  const calmLevel = calmPercentage >= 75 ? 'high' : 
                   calmPercentage >= 50 ? 'medium' : 
                   calmPercentage > 0 ? 'low' : 'none';

  const gradientClass = MOOD_COLORS[dominantMood as keyof typeof MOOD_COLORS] || MOOD_COLORS.neutral;
  const message = CALM_MESSAGES[calmLevel];

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="text-center">
          {/* Calm Visualization Circle */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div 
              className={`w-full h-full rounded-full bg-gradient-to-br ${gradientClass} shadow-lg relative overflow-hidden`}
            >
              {/* Calm percentage overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold">
                    {calmPercentage}%
                  </div>
                  <div className="text-xs opacity-90">
                    calm
                  </div>
                </div>
              </div>
              
              {/* Sparkle effect for high calm */}
              {calmLevel === 'high' && (
                <div className="absolute inset-0">
                  <Sparkles className="absolute top-2 left-2 w-3 h-3 text-white opacity-70 animate-pulse" />
                  <Sparkles className="absolute bottom-2 right-2 w-3 h-3 text-white opacity-70 animate-pulse delay-500" />
                </div>
              )}
            </div>
          </div>

          {/* Status Message */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {message}
            </h3>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="capitalize">
                {dominantMood}
              </Badge>
              <span>•</span>
              <span>{totalEntries} check-ins</span>
            </div>
          </div>

          {/* Toggle Detail View */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetail(!showDetail)}
            className="mt-4"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {showDetail ? 'Hide' : 'Show'} Details
          </Button>

          {/* Detailed Breakdown */}
          {showDetail && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Recent Mood</div>
                  <div className="font-medium capitalize">{recentMood}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Dominant Mood</div>
                  <div className="font-medium capitalize">{dominantMood}</div>
                </div>
              </div>
              
              {emotionData.moodDistribution && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Mood Distribution</div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(emotionData.moodDistribution)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([mood, count]) => (
                        <Badge key={mood} variant="outline" className="text-xs">
                          {mood}: {count}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}