import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WooWooInterfaceProps {
  userId: string;
}

export function WooWooInterface({ userId }: WooWooInterfaceProps) {
  const [birthData, setBirthData] = useState({
    date: '',
    time: '',
    location: ''
  });
  const [showChart, setShowChart] = useState(false);

  const handleGenerateChart = () => {
    if (birthData.date && birthData.time && birthData.location) {
      setShowChart(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-star text-white text-xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">WooWoo & Cosmos</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore your cosmic blueprint, astrology insights, and celestial guidance for your wellness journey.
        </p>
      </div>

      <Tabs defaultValue="birth-chart" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="birth-chart">Birth Chart</TabsTrigger>
          <TabsTrigger value="daily">Daily Cosmic</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="tools">Wellness Tools</TabsTrigger>
        </TabsList>

        {/* Birth Chart Tab */}
        <TabsContent value="birth-chart" className="space-y-6">
          {!showChart ? (
            <Card>
              <CardHeader>
                <CardTitle>Generate Your Birth Chart</CardTitle>
                <p className="text-sm text-gray-600">
                  Enter your birth details to create your personalized cosmic blueprint
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Birth Date</label>
                    <Input
                      type="date"
                      value={birthData.date}
                      onChange={(e) => setBirthData({...birthData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Birth Time</label>
                    <Input
                      type="time"
                      value={birthData.time}
                      onChange={(e) => setBirthData({...birthData, time: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Birth Location</label>
                    <Input
                      placeholder="City, Country"
                      value={birthData.location}
                      onChange={(e) => setBirthData({...birthData, location: e.target.value})}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleGenerateChart}
                  disabled={!birthData.date || !birthData.time || !birthData.location}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <i className="fas fa-star mr-2"></i>
                  Generate Birth Chart
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Birth Chart Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Birth Chart</CardTitle>
                  <p className="text-sm text-gray-600">
                    Born {birthData.date} at {birthData.time} in {birthData.location}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="relative w-80 h-80 mx-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-full flex items-center justify-center">
                    {/* Mock Birth Chart Circle */}
                    <div className="relative w-72 h-72 border-2 border-white/30 rounded-full">
                      {/* Zodiac Signs */}
                      {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((sign, index) => {
                        const angle = (index * 30) - 90; // Distribute evenly
                        const radian = (angle * Math.PI) / 180;
                        const x = Math.cos(radian) * 130;
                        const y = Math.sin(radian) * 130;
                        return (
                          <div
                            key={index}
                            className="absolute text-white text-xl"
                            style={{
                              left: `calc(50% + ${x}px - 12px)`,
                              top: `calc(50% + ${y}px - 12px)`,
                            }}
                          >
                            {sign}
                          </div>
                        );
                      })}
                      
                      {/* Planets */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border border-white/20 rounded-full relative">
                          {/* Mock planet positions */}
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-yellow-300">☉</div>
                          <div className="absolute top-6 right-4 text-blue-300">☽</div>
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-300">♂</div>
                          <div className="absolute bottom-6 right-6 text-green-300">♀</div>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-orange-300">☿</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl">☉</div>
                      <div className="text-sm font-medium">Sun in Leo</div>
                      <div className="text-xs text-gray-600">Core Self</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">☽</div>
                      <div className="text-sm font-medium">Moon in Pisces</div>
                      <div className="text-xs text-gray-600">Emotions</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">↗</div>
                      <div className="text-sm font-medium">Rising Gemini</div>
                      <div className="text-xs text-gray-600">First Impression</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl">♀</div>
                      <div className="text-sm font-medium">Venus in Cancer</div>
                      <div className="text-xs text-gray-600">Love Style</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chart Interpretation */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle>AI Wellness Interpretation</CardTitle>
                  <p className="text-sm text-gray-600">
                    How your cosmic blueprint influences your wellness journey
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-purple-100">
                      <h4 className="font-medium mb-1 flex items-center">
                        <span className="text-lg mr-2">☉</span>
                        Solar Wellness Path
                      </h4>
                      <p className="text-sm text-gray-700">
                        With your Sun in Leo, you thrive on creative expression and recognition. 
                        Your wellness routine benefits from playful, heart-centered activities that make you feel radiant.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border border-purple-100">
                      <h4 className="font-medium mb-1 flex items-center">
                        <span className="text-lg mr-2">☽</span>
                        Emotional Wellness Style
                      </h4>
                      <p className="text-sm text-gray-700">
                        Your Pisces Moon suggests deep emotional sensitivity. Water-based activities, 
                        meditation, and artistic expression help you process feelings and find inner peace.
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <i className="fas fa-download mr-2"></i>
                    Download Full Chart Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Daily Cosmic Tab */}
        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Cosmic Weather</CardTitle>
              <p className="text-sm text-gray-600">
                Current planetary influences on your wellness and energy
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="text-xl mr-2">☉</span>
                      Solar Energy
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      The Sun in Aquarius encourages innovation in your wellness routine. 
                      Try something new today!
                    </p>
                    <Badge variant="outline" className="text-xs">High Energy</Badge>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="text-xl mr-2">☽</span>
                      Lunar Influence
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Waning moon in Virgo supports gentle detox and organization. 
                      Perfect for meal prep and decluttering.
                    </p>
                    <Badge variant="outline" className="text-xs">Cleansing Phase</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border border-green-200">
                    <h4 className="font-medium mb-2">Wellness Recommendation</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      With Mercury in retrograde, focus on gentle, familiar practices. 
                      Revisit old routines that served you well.
                    </p>
                    <Button size="sm" variant="outline">
                      <i className="fas fa-leaf mr-1"></i>
                      Start Gentle Yoga
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium mb-2">Manifestation Timing</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Venus trine Jupiter brings abundance energy. 
                      Set intentions around self-love and nourishment.
                    </p>
                    <Button size="sm" variant="outline">
                      <i className="fas fa-heart mr-1"></i>
                      Create Intention
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>YouTube Workouts & Movement</CardTitle>
                <p className="text-sm text-gray-600">
                  Cosmic-aligned fitness and movement practices
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">Moon Salutation Yoga Flow</h4>
                  <p className="text-xs text-gray-600">Yoga with Adriene • 20 min</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="text-xs mr-2">☽ Lunar</Badge>
                    <i className="fas fa-external-link-alt text-gray-400 text-xs"></i>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">Fire Sign HIIT Workout</h4>
                  <p className="text-xs text-gray-600">Fitness Blender • 15 min</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="text-xs mr-2">🔥 Solar</Badge>
                    <i className="fas fa-external-link-alt text-gray-400 text-xs"></i>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">Earth Sign Grounding Pilates</h4>
                  <p className="text-xs text-gray-600">Move with Nicole • 30 min</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="text-xs mr-2">🌍 Earth</Badge>
                    <i className="fas fa-external-link-alt text-gray-400 text-xs"></i>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <i className="fab fa-youtube mr-2"></i>
                  Browse All Workouts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breathwork & Meditation</CardTitle>
                <p className="text-sm text-gray-600">
                  Pranayama and meditation aligned with cosmic cycles
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">New Moon Intention Breathing</h4>
                  <p className="text-xs text-gray-600">Guided • 10 min</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="text-xs mr-2">🌑 New Moon</Badge>
                    <i className="fas fa-play text-green-500 text-xs"></i>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">4-7-8 Mercury Retrograde Calm</h4>
                  <p className="text-xs text-gray-600">Breathwork • 5 min</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="text-xs mr-2">☿ Mercury Rx</Badge>
                    <i className="fas fa-play text-blue-500 text-xs"></i>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">Solar Plexus Activation</h4>
                  <p className="text-xs text-gray-600">Chakra work • 15 min</p>
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="text-xs mr-2">💛 Solar Plexus</Badge>
                    <i className="fas fa-play text-yellow-500 text-xs"></i>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <i className="fas fa-wind mr-2"></i>
                  Explore Breathwork Library
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wellness Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">Breathwork Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-circle-notch mr-2"></i>
                  4-7-8 Timer
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-wind mr-2"></i>
                  Box Breathing
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-spa mr-2"></i>
                  Wim Hof Method
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-sm">Meditation Timers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-bell mr-2"></i>
                  Singing Bowl Timer
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-moon mr-2"></i>
                  Lunar Meditation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-om mr-2"></i>
                  Chakra Journey
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-sm">Energy Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-gem mr-2"></i>
                  Crystal Guide
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-seedling mr-2"></i>
                  Essential Oils
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <i className="fas fa-music mr-2"></i>
                  Sound Bath
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}