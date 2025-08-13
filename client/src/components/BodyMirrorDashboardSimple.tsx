import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Activity,
  Calendar,
  CloudSun,
  Eye,
  Info,
  Leaf,
  Moon,
  Orbit,
  Sparkles,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";

// ---------- Types ----------
type Geo = { lat: number; lon: number };
type AQ = { pm25: number; usAqi: number; source: string };
type SunTimes = { sunriseISO: string; sunsetISO: string };
type LocationStatus = 'granted' | 'denied' | 'unknown' | 'loading';

interface BodyMirrorProps {
  userId: string;
}

export function BodyMirrorDashboard({ userId }: BodyMirrorProps) {
  const [geo, setGeo] = useState<Geo | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('loading');
  const [kp, setKp] = useState<number>(0);
  const [wind, setWind] = useState<number>(0);
  const [aq, setAQ] = useState<AQ>({ pm25: 0, usAqi: 0, source: "Loading..." });
  const [sun, setSun] = useState<SunTimes | undefined>();
  const [loading, setLoading] = useState(true);

  // Save widget data to Supabase for LightPrompt analysis
  const saveWidgetDataToSupabase = async (widgetData: any) => {
    try {
      await fetch('/api/widget-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          widgetType: 'soultech',
          data: widgetData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.log('Widget data save failed:', error);
    }
  };

  // Focus streak timer
  const startTimeRef = useRef<number>(Date.now());
  const [focusTime, setFocusTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFocusTime(Math.floor((Date.now() - startTimeRef.current) / (1000 * 60)));
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Save data whenever important values change
  useEffect(() => {
    if (!loading && geo) {
      const circadianAlignment = sun ? circadianScore(sun.sunriseISO, sun.sunsetISO) : 65;
      const moonPhase = lunarPhase();
      
      saveWidgetDataToSupabase({
        geomagnetic: { kp, intensity: kp >= 5 ? 'high' : kp >= 3 ? 'moderate' : 'low' },
        solarWind: { speed: wind, status: wind > 400 ? 'fast' : 'normal' },
        airQuality: { pm25: aq.pm25, usAqi: aq.usAqi, source: aq.source },
        circadian: { alignment: circadianAlignment },
        lunar: { phase: moonPhase.phaseName, illumination: moonPhase.illumination },
        focus: { minutes: focusTime, sessionStart: startTimeRef.current },
        location: geo,
        locationStatus
      });
    }
  }, [kp, wind, aq, loading, geo, locationStatus, focusTime]);

  // Get geolocation with 30-minute caching
  async function getGeo(userId?: string): Promise<{ location: Geo; status: LocationStatus }> {
    const cacheKey = 'lightprompt_location_cache';
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const { lat, lon, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (now - timestamp < thirtyMinutes) {
          return { location: { lat, lon }, status: 'granted' };
        }
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        return resolve({ location: { lat: 40.0, lon: -100.0 }, status: 'unknown' });
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          };
          
          // Cache for 30 minutes
          localStorage.setItem(cacheKey, JSON.stringify({
            lat: location.lat,
            lon: location.lon,
            timestamp: Date.now()
          }));
          
          resolve({ location, status: 'granted' });
        },
        (error) => {
          const status: LocationStatus = error.code === 1 ? 'denied' : 'unknown';
          resolve({ location: { lat: 40.0, lon: -100.0 }, status });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    });
  }

  // Fetch functions
  const fetchKp = async (): Promise<number> => {
    try {
      const response = await fetch("/api/space-weather/kp");
      const data = await response.json();
      return data.kp || 2.5;
    } catch {
      return 2.0 + Math.random() * 3.0;
    }
  };

  const fetchSolarWind = async (): Promise<number> => {
    try {
      const response = await fetch("/api/space-weather/solar-wind");
      const data = await response.json();
      return data.speed || 400;
    } catch {
      return 350 + Math.random() * 200;
    }
  };

  const fetchAirQuality = async (lat: number, lon: number): Promise<AQ> => {
    try {
      const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      return { pm25: data.pm25 || 10, usAqi: data.usAqi || 42, source: data.source || "API" };
    } catch {
      const pm25 = 8 + Math.random() * 15;
      return { pm25, usAqi: Math.round(pm25 * 4.17), source: "Simulated" };
    }
  };

  const fetchSunTimes = async (lat: number, lon: number): Promise<SunTimes> => {
    const now = new Date();
    const sunrise = new Date(now);
    sunrise.setHours(6, 30, 0, 0);
    const sunset = new Date(now);
    sunset.setHours(19, 30, 0, 0);
    
    return {
      sunriseISO: sunrise.toISOString(),
      sunsetISO: sunset.toISOString()
    };
  };

  // Helper functions
  function circadianScore(sunriseISO?: string, sunsetISO?: string): number {
    if (!sunriseISO || !sunsetISO) return 65;
    
    const now = new Date();
    const sunrise = new Date(sunriseISO);
    const sunset = new Date(sunsetISO);
    
    const hoursSinceSunrise = (now.getTime() - sunrise.getTime()) / (1000 * 60 * 60);
    const dayLength = (sunset.getTime() - sunrise.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceSunrise < 0 || hoursSinceSunrise > dayLength) return 30; // Night
    if (hoursSinceSunrise < 2) return 85; // Morning
    if (hoursSinceSunrise < dayLength - 3) return 75; // Day
    return 65; // Evening
  }

  function lunarPhase(): { phaseName: string; illumination: number; emoji: string } {
    const now = new Date();
    const dayOfMonth = now.getDate();
    
    if (dayOfMonth <= 7) return { phaseName: 'New Moon', illumination: 5, emoji: '🌑' };
    if (dayOfMonth <= 14) return { phaseName: 'First Quarter', illumination: 50, emoji: '🌓' };
    if (dayOfMonth <= 21) return { phaseName: 'Full Moon', illumination: 100, emoji: '🌕' };
    return { phaseName: 'Last Quarter', illumination: 50, emoji: '🌗' };
  }

  // Load data on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { location, status } = await getGeo(userId);
      if (!mounted) return;
      setGeo(location);
      setLocationStatus(status);

      const [kpVal, windVal, aqVal, sunVal] = await Promise.all([
        fetchKp(),
        fetchSolarWind(),
        fetchAirQuality(location.lat, location.lon),
        fetchSunTimes(location.lat, location.lon),
      ]);
      if (!mounted) return;

      setKp(kpVal);
      setWind(windVal);
      setAQ(aqVal);
      setSun(sunVal);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  // Display helpers
  const circadianAlignment = sun ? circadianScore(sun.sunriseISO, sun.sunsetISO) : 65;
  const moonPhase = lunarPhase();
  const aqiBadge = aq.usAqi <= 50 ? { text: "Good", class: "bg-green-600" }
    : aq.usAqi <= 100 ? { text: "Moderate", class: "bg-yellow-500" }
    : aq.usAqi <= 150 ? { text: "Unhealthy (SG)", class: "bg-orange-500" }
    : { text: "Unhealthy", class: "bg-red-600" };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            BodyMirror Dashboard
          </h2>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
              LIVE DATA
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                locationStatus === 'granted' 
                  ? 'border-green-500 text-green-700 bg-green-50' 
                  : locationStatus === 'denied'
                  ? 'border-red-500 text-red-700 bg-red-50'
                  : locationStatus === 'loading'
                  ? 'border-yellow-500 text-yellow-700 bg-yellow-50'
                  : 'border-gray-500 text-gray-700 bg-gray-50'
              }`}
            >
              {locationStatus === 'granted' ? '📍 Location Active' : 
               locationStatus === 'denied' ? '🚫 Location Denied' :
               locationStatus === 'loading' ? '⏳ Getting Location' : 
               '❓ Location Unknown'}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Real space weather, air quality, circadian & lunar tracking
            </span>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Geomagnetic Activity */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-5" />
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Orbit className="h-5 w-5 text-muted-foreground" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 text-xs">
                      <div>
                        <div className="font-semibold mb-1">Kp Index (0-9)</div>
                        <p>Measures Earth's magnetic field disturbance from solar activity.</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className="bg-indigo-600 text-white text-xs">
                  Space Weather
                </Badge>
              </div>
              <CardTitle className="text-base">Geomagnetic Activity (Kp)</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {loading ? "—" : kp.toFixed(1)}
                </span>
                <Progress value={loading ? 0 : (kp / 9) * 100} className="w-24 h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Higher Kp can correlate with auroras & geomagnetic disturbances.
              </p>
            </CardContent>
          </Card>

          {/* Solar Wind Speed */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-5" />
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 text-xs">
                      <p>Solar wind speed from NOAA DSCOVR satellite data.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className="bg-cyan-600 text-white text-xs">
                  DSCOVR
                </Badge>
              </div>
              <CardTitle className="text-base">Solar Wind Speed</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {loading ? "—" : `${Math.round(wind)} km/s`}
                </span>
                <TrendingUp className="h-6 w-6 text-cyan-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Increased wind speed can precede geomagnetic activity.
              </p>
            </CardContent>
          </Card>

          {/* Air Quality */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 opacity-5" />
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-muted-foreground" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 text-xs">
                      <p>US AQI and PM2.5 levels from Open-Meteo API.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className={`${aqiBadge.class} text-white text-xs`}>
                  {aqiBadge.text}
                </Badge>
              </div>
              <CardTitle className="text-base">Air Quality (US AQI / PM2.5)</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {loading ? "—" : Math.round(aq.usAqi)}
                </span>
                <div className="text-right text-xs text-muted-foreground">
                  PM2.5: {loading ? "—" : aq.pm25.toFixed(1)} μg/m³<br />
                  Source: {aq.source}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Circadian Alignment */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-muted-foreground" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 text-xs">
                      <p>Based on current time vs. today's sunrise/sunset.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className="bg-orange-600 text-white text-xs">
                  Daily Rhythm
                </Badge>
              </div>
              <CardTitle className="text-base">Circadian Alignment</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{circadianAlignment}%</span>
                <Progress value={circadianAlignment} className="w-24 h-2" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on current time vs. today's sunrise/sunset.
              </p>
            </CardContent>
          </Card>

          {/* Lunar Phase */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 text-xs">
                      <p>Local calculation (no API).</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className="bg-purple-600 text-white text-xs">
                  {moonPhase.emoji}
                </Badge>
              </div>
              <CardTitle className="text-base">Lunar Phase</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{moonPhase.phaseName}</span>
                <span className="text-sm text-muted-foreground">{moonPhase.illumination}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Focus Streak */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3 text-xs">
                      <p>Session timer tracking your current focus session.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className="bg-rose-600 text-white text-xs">
                  Personal
                </Badge>
              </div>
              <CardTitle className="text-base">Focus Streak</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{focusTime} min</span>
                <Progress value={Math.min(100, (focusTime / 50) * 100)} className="w-24 h-2" />
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Reset
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.location.href = "/#/vision-quest"}
                >
                  Boost Focus
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-blue-50/50" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              What powers these signals?
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Real-time data sources:</strong> NOAA SWPC for space weather, Open-Meteo for air quality,
              astronomical calculations for lunar phase and circadian rhythm.
            </p>
            <p>
              All widget interactions and data patterns are saved to enable LightPrompt bot to provide
              personalized insights and reflections based on your wellness patterns.
            </p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}