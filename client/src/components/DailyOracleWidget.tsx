import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Sun, Moon, Calendar } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface DailyOracleProps {
  birthData?: {
    date: string;
    time?: string;
    location?: string;
    lat?: number;
    lng?: number;
  };
}

export function DailyOracleWidget({ birthData }: DailyOracleProps) {
  const [dailyGuidance, setDailyGuidance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [todayDate, setTodayDate] = useState('');
  const [cosmicHighlight, setCosmicHighlight] = useState('');

  useEffect(() => {
    // Set today's date
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setTodayDate(today.toLocaleDateString('en-US', options));
    
    // Auto-load daily guidance if birth data is available
    if (birthData) {
      loadDailyGuidance();
    }
  }, [birthData]);

  const loadDailyGuidance = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const message = `As my daily oracle, what cosmic guidance do you have for me today, ${today.toLocaleDateString()}? Please provide insights about how today's planetary transits and cosmic energies align with my birth chart, along with practical spiritual guidance for navigating this day with cosmic awareness.`;

      const response = await apiRequest('POST', '/api/chat/oracle', {
        message,
        birthData,
        selectedPlanet: null
      });

      if (response.ok) {
        const data = await response.json();
        setDailyGuidance(data.response);
        
        // Extract a short highlight for the cosmic energy of the day
        const highlight = extractCosmicHighlight(data.response);
        setCosmicHighlight(highlight);
      }
    } catch (error) {
      console.error('Failed to load daily guidance:', error);
      setDailyGuidance('The cosmic energies are swirling today. Take a moment to center yourself and trust your inner wisdom.');
    } finally {
      setLoading(false);
    }
  };

  const extractCosmicHighlight = (fullResponse: string): string => {
    // Extract the first meaningful sentence as a highlight
    const sentences = fullResponse.split(/[.!?]+/);
    const highlight = sentences.find(s => s.length > 20 && s.length < 120);
    return highlight ? highlight.trim() + '...' : 'Trust the cosmic flow of today\'s energies.';
  };

  if (!birthData) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
            <Sparkles className="w-5 h-5" />
            Daily Oracle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-600 dark:text-purple-300 mb-3">
            Connect your birth chart to receive personalized daily cosmic guidance
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300"
            onClick={() => window.location.href = '/soul-map-explorer'}
          >
            Set Birth Data
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200 text-base">
          <Sparkles className="w-5 h-5" />
          Daily Oracle
        </CardTitle>
        <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-300">
          <Calendar className="w-3 h-3" />
          {todayDate}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {cosmicHighlight && (
          <div className="flex items-start gap-2 p-3 bg-white/50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
            <Sun className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-purple-700 dark:text-purple-200 font-medium leading-relaxed">
              {cosmicHighlight}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full"></div>
            <span className="ml-2 text-sm text-purple-600 dark:text-purple-300">
              Consulting the stars...
            </span>
          </div>
        ) : dailyGuidance ? (
          <div className="space-y-3">
            <div className="bg-white/70 dark:bg-purple-900/40 rounded-lg p-3 border border-purple-100 dark:border-purple-700">
              <div className="text-sm text-purple-700 dark:text-purple-200 leading-relaxed">
                {dailyGuidance.length > 200 ? (
                  <>
                    {dailyGuidance.substring(0, 200)}...
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-purple-600 dark:text-purple-400 ml-1"
                      onClick={() => window.location.href = '/soul-map-explorer'}
                    >
                      Read Full Oracle
                    </Button>
                  </>
                ) : (
                  dailyGuidance
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300"
                onClick={loadDailyGuidance}
                disabled={loading}
              >
                <Moon className="w-3 h-3 mr-1" />
                Refresh Oracle
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300"
                onClick={() => window.location.href = '/soul-map-explorer'}
              >
                Full Chart
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Button 
              onClick={loadDailyGuidance}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={loading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get Daily Guidance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}