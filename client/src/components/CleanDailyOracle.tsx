import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Sun, Moon, Calendar, BookOpen } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CleanDailyOracleProps {
  birthData?: {
    date: string;
    time?: string;
    location?: string;
    lat?: number;
    lng?: number;
  };
}

export function CleanDailyOracle({ birthData }: CleanDailyOracleProps) {
  const [dailyGuidance, setDailyGuidance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [todayDate, setTodayDate] = useState('');
  const [cosmicHighlight, setCosmicHighlight] = useState('');
  const [showFullOracle, setShowFullOracle] = useState(false);

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
      const todayString = today.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const message = `As my daily oracle, what cosmic guidance do you have for me today, ${todayString}? Please provide insights about how today's planetary transits and cosmic energies align with my birth chart, along with practical spiritual guidance for navigating this day with cosmic awareness. Make sure to reference today's actual date: ${todayString}.`;

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
      <div 
        className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4"
        style={{ background: 'white', borderColor: '#e5e7eb' }}
      >
        <div className="pb-3">
          <h3 className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-medium">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Daily Oracle
          </h3>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Connect your birth chart to receive personalized daily cosmic guidance
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => window.location.href = '/soul-map-explorer'}
          >
            Set Birth Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
      style={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}
    >
      <div className="p-4 pb-3">
        <h3 className="flex items-center gap-2 text-gray-800 dark:text-gray-200 text-base font-medium">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Daily Oracle ✨
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Calendar className="w-3 h-3" />
          {todayDate}
        </div>
      </div>
      
      <div className="px-4 pb-4 space-y-3">
        {cosmicHighlight && (
          <div 
            className="flex items-start gap-2 p-3 rounded-lg border"
            style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b20' }}
          >
            <Sun className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              {cosmicHighlight}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-amber-500 rounded-full"></div>
            <span className="ml-2 text-sm text-gray-600">
              Consulting the stars...
            </span>
          </div>
        ) : dailyGuidance ? (
          <div className="space-y-3">
            <div 
              className="rounded-lg p-3 border"
              style={{ backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }}
            >
              <div className="text-sm text-gray-700 leading-relaxed">
                {dailyGuidance.length > 200 ? (
                  <>
                    {dailyGuidance.substring(0, 200)}...
                    <Dialog open={showFullOracle} onOpenChange={setShowFullOracle}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 h-auto text-amber-600 ml-1"
                        >
                          Read Full Oracle
                        </Button>
                      </DialogTrigger>
                      <DialogContent 
                        className="max-w-2xl max-h-[80vh] overflow-y-auto"
                        style={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}
                      >
                        <DialogHeader>
                          <DialogTitle 
                            className="flex items-center gap-2"
                            style={{ color: '#1f2937' }}
                          >
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            Your Daily Oracle - {todayDate}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="prose prose-sm max-w-none">
                          <p 
                            className="text-sm leading-relaxed whitespace-pre-wrap"
                            style={{ color: '#4b5563' }}
                          >
                            {dailyGuidance}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
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
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={loadDailyGuidance}
                disabled={loading}
              >
                <Moon className="w-3 h-3 mr-1" />
                Refresh Oracle
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => window.location.href = '/soul-map-explorer'}
              >
                <BookOpen className="w-3 h-3 mr-1" />
                Full Chart
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Button 
              onClick={loadDailyGuidance}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={loading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Get Daily Guidance
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}