import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Sun, RefreshCw, Calendar, Star } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ModernDailyOracleProps {
  birthData?: {
    date: string;
    time?: string;
    location?: string;
    lat?: number;
    lng?: number;
  };
}

export function ModernDailyOracle({ birthData }: ModernDailyOracleProps) {
  const [dailyGuidance, setDailyGuidance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [todayDate, setTodayDate] = useState('');
  const [showFullOracle, setShowFullOracle] = useState(false);

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setTodayDate(today.toLocaleDateString('en-US', options));
    
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
      }
    } catch (error) {
      console.error('Failed to load daily guidance:', error);
      setDailyGuidance('The cosmic energies are flowing today. Trust your inner wisdom and stay open to the universe\'s guidance.');
    } finally {
      setLoading(false);
    }
  };

  if (!birthData) {
    return (
      <div className="max-w-md mx-auto">
        <div 
          className="rounded-2xl p-6 shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0'
          }}
        >
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Daily Oracle</h3>
            <p className="text-sm text-gray-600 mt-2">
              Connect your birth details to receive personalized cosmic guidance
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/soul-map-explorer'}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            Set Birth Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div 
        className="rounded-2xl p-6 shadow-lg"
        style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Oracle</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {todayDate}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadDailyGuidance}
            disabled={loading}
            className="text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Consulting the stars...</p>
          </div>
        ) : dailyGuidance ? (
          <div className="space-y-4">
            {/* Preview */}
            <div 
              className="p-4 rounded-xl"
              style={{ 
                background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
                border: '1px solid #f59e0b20'
              }}
            >
              <div className="flex items-start gap-3">
                <Sun className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {dailyGuidance.length > 150 
                      ? `${dailyGuidance.substring(0, 150)}...`
                      : dailyGuidance
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Dialog open={showFullOracle} onOpenChange={setShowFullOracle}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
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
                      className="flex items-center gap-2 text-xl"
                      style={{ color: '#1f2937' }}
                    >
                      <Sparkles className="w-6 h-6 text-amber-500" />
                      Your Daily Oracle - {todayDate}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-6">
                    <p 
                      className="text-base leading-relaxed whitespace-pre-wrap"
                      style={{ color: '#4b5563' }}
                    >
                      {dailyGuidance}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Button 
              onClick={loadDailyGuidance}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
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