import { useState, useEffect } from 'react';
import { ModernDailyOracle } from '@/components/ModernDailyOracle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, Clock } from 'lucide-react';

interface BirthData {
  date: string;
  time: string;
  location: string;
  lat?: number;
  lng?: number;
}

export function SimpleOraclePage() {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    // Load birth data from localStorage
    const saved = localStorage.getItem('lightprompt-birth-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setBirthData(parsed);
      setFormData({
        date: parsed.date || '',
        time: parsed.time || '',
        location: parsed.location || ''
      });
    }
  }, []);

  const handleSaveBirthData = () => {
    const newBirthData = {
      ...formData,
      lat: 0, // We'll geocode this later if needed
      lng: 0
    };
    
    setBirthData(newBirthData);
    localStorage.setItem('lightprompt-birth-data', JSON.stringify(newBirthData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Daily Oracle
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your personalized cosmic guidance based on today's planetary alignments and your unique birth chart.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Birth Data Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Your Birth Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Birth Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Birth Time (optional)
                </label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Birth Location
                </label>
                <Input
                  type="text"
                  placeholder="City, State/Country"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full"
                />
              </div>

              <Button 
                onClick={handleSaveBirthData}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!formData.date}
              >
                Save Birth Data
              </Button>
            </CardContent>
          </Card>

          {/* Oracle Display */}
          <div className="flex items-center">
            <ModernDailyOracle birthData={birthData} />
          </div>
        </div>
      </div>
    </div>
  );
}