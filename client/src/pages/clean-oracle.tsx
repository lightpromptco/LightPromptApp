import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sparkles, Sun, RefreshCw, Calendar, Star, MapPin, Clock, Wand2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface BirthData {
  date: string;
  time?: string;
  location?: string;
  lat?: number;
  lng?: number;
}

export default function CleanOraclePage() {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: ''
  });
  const [dailyGuidance, setDailyGuidance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [todayDate, setTodayDate] = useState('');
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

    // Load birth data from localStorage
    const saved = localStorage.getItem('lightprompt-birth-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBirthData(parsed);
        setFormData({
          date: parsed.date || '',
          time: parsed.time || '',
          location: parsed.location || ''
        });
        // Auto-load oracle if we have birth data
        if (parsed.date) {
          loadDailyGuidance(parsed);
        }
      } catch (error) {
        console.error('Error loading birth data:', error);
      }
    }
  }, []);

  const loadDailyGuidance = async (data = birthData) => {
    if (!data) return;
    
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
        birthData: data,
        selectedPlanet: null
      });

      if (response.ok) {
        const responseData = await response.json();
        setDailyGuidance(responseData.response);
      }
    } catch (error) {
      console.error('Failed to load daily guidance:', error);
      setDailyGuidance('The cosmic energies are flowing beautifully today. Trust your inner wisdom and stay open to the universe\'s guidance.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBirthData = () => {
    if (!formData.date) return;
    
    const newBirthData = {
      ...formData,
      lat: 0, // We'll geocode this later if needed
      lng: 0
    };
    
    setBirthData(newBirthData);
    localStorage.setItem('lightprompt-birth-data', JSON.stringify(newBirthData));
    
    // Load oracle immediately after saving
    loadDailyGuidance(newBirthData);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
    }}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center shadow-xl">
            <Wand2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Daily Oracle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover your personalized cosmic guidance based on today's planetary alignments and your unique birth chart.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            
            {/* Birth Data Form - Left Side */}
            <div className="lg:col-span-2">
              <div 
                className="rounded-3xl p-8 shadow-xl border"
                style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  borderColor: '#e2e8f0'
                }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Birth Information</h2>
                  <p className="text-gray-600 mt-2">Enter your birth details to unlock your cosmic guidance</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Birth Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full h-12 text-base border-2"
                      style={{ borderColor: '#e2e8f0' }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Birth Time (optional)
                    </label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full h-12 text-base border-2"
                      style={{ borderColor: '#e2e8f0' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Birth Location (optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="City, State/Country"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full h-12 text-base border-2"
                      style={{ borderColor: '#e2e8f0' }}
                    />
                  </div>

                  <Button 
                    onClick={handleSaveBirthData}
                    disabled={!formData.date}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Save & Get Oracle
                  </Button>
                </div>
              </div>
            </div>

            {/* Oracle Display - Right Side */}
            <div className="lg:col-span-3">
              <div 
                className="rounded-3xl p-8 shadow-xl border min-h-96"
                style={{ 
                  background: 'linear-gradient(135deg, #ffffff 0%, #fefbf3 100%)',
                  borderColor: '#f59e0b20'
                }}
              >
                {!birthData?.date ? (
                  <div className="flex items-center justify-center h-full text-center py-16">
                    <div>
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-200 to-orange-200 flex items-center justify-center">
                        <Sun className="w-12 h-12 text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for Your Oracle?</h3>
                      <p className="text-gray-600 text-lg">
                        Enter your birth date to receive personalized cosmic guidance for today.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Oracle Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">Your Daily Oracle</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {todayDate}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadDailyGuidance()}
                        disabled={loading}
                        className="text-gray-600 hover:text-gray-900 p-3"
                      >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>

                    {/* Oracle Content */}
                    {loading ? (
                      <div className="text-center py-16">
                        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Consulting the stars...</p>
                        <p className="text-sm text-gray-500 mt-2">The universe is preparing your guidance</p>
                      </div>
                    ) : dailyGuidance ? (
                      <div className="space-y-6">
                        {/* Oracle Text */}
                        <div 
                          className="p-6 rounded-2xl border"
                          style={{ 
                            background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
                            borderColor: '#f59e0b20'
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <Sun className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-base text-amber-900 leading-relaxed">
                                {dailyGuidance.length > 300 
                                  ? `${dailyGuidance.substring(0, 300)}...`
                                  : dailyGuidance
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center">
                          <Dialog open={showFullOracle} onOpenChange={setShowFullOracle}>
                            <DialogTrigger asChild>
                              <Button 
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl text-base"
                              >
                                <Wand2 className="w-5 h-5 mr-2" />
                                Read Full Oracle
                              </Button>
                            </DialogTrigger>
                            <DialogContent 
                              className="max-w-4xl max-h-[85vh] overflow-y-auto"
                              style={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}
                            >
                              <DialogHeader>
                                <DialogTitle 
                                  className="flex items-center gap-3 text-2xl mb-4"
                                  style={{ color: '#1f2937' }}
                                >
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                  </div>
                                  Your Daily Oracle - {todayDate}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="mt-6">
                                <div 
                                  className="p-6 rounded-xl mb-6"
                                  style={{ 
                                    background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
                                    border: '1px solid #f59e0b20'
                                  }}
                                >
                                  <p 
                                    className="text-lg leading-relaxed whitespace-pre-wrap"
                                    style={{ color: '#92400e' }}
                                  >
                                    {dailyGuidance}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-200 to-orange-200 flex items-center justify-center">
                          <Wand2 className="w-8 h-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Get Your Daily Guidance</h3>
                        <Button 
                          onClick={() => loadDailyGuidance()}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl"
                          disabled={loading}
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Consult Oracle
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}