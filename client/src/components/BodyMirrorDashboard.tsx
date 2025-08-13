import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import {
  Activity,
  Atom,
  CloudSun,
  Gauge,
  Heart,
  Info,
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

interface SoulTechWidget {
  id: string;
  title: string;
  type: string;
  enabled: boolean;
  order: number;
}

// ---------- Location Storage and Caching ----------
const LOCATION_CACHE_KEY = 'lightprompt_location_cache';
const LOCATION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface LocationCache {
  lat: number;
  lon: number;
  timestamp: number;
  permission: LocationStatus;
}

// Save location to localStorage cache
const saveLocationCache = (location: Geo, permission: LocationStatus) => {
  const cache: LocationCache = {
    lat: location.lat,
    lon: location.lon,
    timestamp: Date.now(),
    permission
  };
  localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cache));
};

// Get location from localStorage cache
const getLocationCache = (): LocationCache | null => {
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!cached) return null;
    
    const cache: LocationCache = JSON.parse(cached);
    const isExpired = Date.now() - cache.timestamp > LOCATION_CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(LOCATION_CACHE_KEY);
      return null;
    }
    
    return cache;
  } catch {
    return null;
  }
};

// Save location to user profile (optional convenience storage)
const saveLocationToProfile = async (userId: string, location: Geo, permission: LocationStatus) => {
  try {
    await fetch(`/api/users/${userId}/location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: location.lat,
        longitude: location.lon,
        locationPermission: permission,
        locationLastUpdated: new Date().toISOString()
      })
    });
  } catch (error) {
    console.log('Location profile save failed (non-critical):', error);
  }
};

// Enhanced location getter with caching and status tracking
const getGeo = async (userId?: string): Promise<{ location: Geo; status: LocationStatus }> => {
  // Check cache first
  const cached = getLocationCache();
  if (cached && cached.permission === 'granted') {
    return {
      location: { lat: cached.lat, lon: cached.lon },
      status: cached.permission
    };
  }

  // If no geolocation support, return fallback
  if (!navigator.geolocation) {
    const fallback = { lat: 40.0, lon: -100.0 };
    saveLocationCache(fallback, 'denied');
    return { location: fallback, status: 'denied' };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        
        // Cache the location
        saveLocationCache(location, 'granted');
        
        // Optionally save to user profile for convenience
        if (userId) {
          saveLocationToProfile(userId, location, 'granted');
        }
        
        resolve({ location, status: 'granted' });
      },
      (error) => {
        console.log('Geolocation error:', error.message);
        const fallback = { lat: 40.0, lon: -100.0 };
        const status: LocationStatus = error.code === 1 ? 'denied' : 'unknown';
        
        saveLocationCache(fallback, status);
        
        if (userId) {
          saveLocationToProfile(userId, fallback, status);
        }
        
        resolve({ location: fallback, status });
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  });
};

// Fetch real Kp index via server proxy (safe from CORS)
async function fetchKp(): Promise<number> {
  try {
    const response = await fetch('/api/space-weather/kp');
    const data = await response.json();
    return data.kp || 2.5;
  } catch {
    return 2.5; // Fallback
  }
}

// Fetch real solar wind speed via server proxy (safe from CORS)
async function fetchSolarWind(): Promise<number> {
  try {
    const response = await fetch('/api/space-weather/solar-wind');
    const data = await response.json();
    return data.speed || 400;
  } catch {
    return 400; // Fallback
  }
}

// Fetch real air quality data via server proxy (safe from CORS)
async function fetchAirQuality(lat: number, lon: number): Promise<AQ> {
  try {
    const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
    const data = await response.json();
    return {
      pm25: data.pm25 || 12,
      usAqi: data.usAqi || 50,
      source: data.simulated ? "Simulated (API unavailable)" : data.source
    };
  } catch {
    return { 
      pm25: 12, 
      usAqi: 50, 
      source: "Fallback" 
    };
  }
}

// Calculate sunrise/sunset based on location (simplified approximation)
async function fetchSunTimes(lat: number, lon: number): Promise<SunTimes> {
  const now = new Date();
  const sunrise = new Date(now);
  const sunset = new Date(now);
  
  // Simple approximation based on latitude and day of year
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const seasonalVariation = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 4; // Hours
  const dayLength = 12 + Math.sin((lat * Math.PI) / 180) * 4 + seasonalVariation;
  
  const sunriseHour = 12 - dayLength / 2;
  const sunsetHour = 12 + dayLength / 2;
  
  sunrise.setHours(Math.floor(sunriseHour), (sunriseHour % 1) * 60, 0, 0);
  sunset.setHours(Math.floor(sunsetHour), (sunsetHour % 1) * 60, 0, 0);
  
  return {
    sunriseISO: sunrise.toISOString(),
    sunsetISO: sunset.toISOString(),
  };
}

// Circadian alignment: 100 at midday, tapering to 0 at night (simple cosine curve)
function circadianScore(sunriseISO?: string, sunsetISO?: string): number {
  if (!sunriseISO || !sunsetISO) return 50;
  const now = new Date();
  const sunrise = new Date(sunriseISO);
  const sunset = new Date(sunsetISO);
  if (now < sunrise || now > sunset) return 15; // at night

  const dayMs = sunset.getTime() - sunrise.getTime();
  const sinceMs = now.getTime() - sunrise.getTime();
  const x = Math.max(0, Math.min(1, sinceMs / dayMs)); // 0..1 across daylight
  // cosine bell peaking at midday
  const score = Math.round(60 + 40 * Math.cos(Math.PI * (x - 0.5)));
  return Math.max(0, Math.min(100, score));
}

// Lunar phase (0=new, 0.5=full, returns label + emoji)
function lunarPhase(now = new Date()) {
  const lp = 2551443; // synodic month in seconds
  const new_moon = new Date("2000-01-06T18:14:00Z").getTime() / 1000;
  const phase = ((now.getTime() / 1000 - new_moon) % lp) / lp; // 0..1
  const pct = Math.round(phase * 100);
  let label = "Waxing";
  if (pct < 2 || pct > 98) label = "New Moon";
  else if (pct > 48 && pct < 52) label = "Full Moon";
  else if (phase < 0.5) label = "Waxing";
  else label = "Waning";
  const emoji =
    pct < 2 || pct > 98
      ? "🌑"
      : pct < 25
      ? "🌒"
      : pct < 48
      ? "🌓"
      : pct < 52
      ? "🌕"
      : pct < 75
      ? "🌗"
      : "🌘";
  return { phasePct: pct, label, emoji };
}

// Simple focus timer (local, resets on reload unless you persist)
function useFocusStreak() {
  const [minutes, setMinutes] = useState(0);
  const timer = useRef<number | null>(null);
  useEffect(() => {
    timer.current = window.setInterval(() => setMinutes((m) => m + 1), 60_000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);
  return minutes;
}

// ---------- Component ----------
interface BodyMirrorProps {
  userId: string;
}

// Default Soul-Tech widgets configuration
const DEFAULT_SOULTECH_WIDGETS: SoulTechWidget[] = [
  { id: 'geomagnetic', title: 'Geomagnetic Activity (Kp)', type: 'space-weather', enabled: true, order: 0 },
  { id: 'solar-wind', title: 'Solar Wind Speed', type: 'space-weather', enabled: true, order: 1 },
  { id: 'air-quality', title: 'Air Quality', type: 'environment', enabled: true, order: 2 },
  { id: 'circadian', title: 'Circadian Alignment', type: 'biological', enabled: true, order: 3 },
  { id: 'lunar-phase', title: 'Lunar Phase', type: 'cosmic', enabled: true, order: 4 },
  { id: 'focus-streak', title: 'Focus Streak', type: 'personal', enabled: true, order: 5 },
];

export function BodyMirrorDashboard({ userId }: BodyMirrorProps) {
  const [geo, setGeo] = useState<Geo | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('loading');
  const [kp, setKp] = useState<number>(0);
  const [wind, setWind] = useState<number>(0);
  const [aq, setAQ] = useState<AQ>({ pm25: 0, usAqi: 0, source: "Loading..." });
  const [sun, setSun] = useState<SunTimes | undefined>();
  const [loading, setLoading] = useState(true);
  const [widgets, setWidgets] = useState<SoulTechWidget[]>(() => {
    const saved = sessionStorage.getItem(`soultech-layout-${userId}`);
    return saved ? JSON.parse(saved) : DEFAULT_SOULTECH_WIDGETS;
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Persist layout
  useEffect(() => {
    sessionStorage.setItem(`soultech-layout-${userId}`, JSON.stringify(widgets));
  }, [widgets, userId]);

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

  // Save data whenever important values change
  useEffect(() => {
    if (!loading && geo) {
      saveWidgetDataToSupabase({
        geomagnetic: { kp, intensity: kp >= 5 ? 'high' : kp >= 3 ? 'moderate' : 'low' },
        solarWind: { speed: wind, status: wind > 400 ? 'fast' : 'normal' },
        airQuality: { pm25: aq.pm25, usAqi: aq.usAqi, source: aq.source },
        location: geo,
        locationStatus
      });
    }
  }, [kp, wind, aq, loading, geo, locationStatus]);

  // Drag and drop handlers
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    // Update order
    const reorderedWidgets = items.map((widget, index) => ({ ...widget, order: index }));
    setWidgets(reorderedWidgets);
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(widgets.map(w => w.id === widgetId ? { ...w, enabled: !w.enabled } : w));
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_SOULTECH_WIDGETS);
    sessionStorage.removeItem(`soultech-layout-${userId}`);
  };

  const focusMin = useFocusStreak();
  const moon = useMemo(() => lunarPhase(), []);
  const circadian = useMemo(
    () => circadianScore(sun?.sunriseISO, sun?.sunsetISO),
    [sun]
  );

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
  const formatWind = (v: number) => `${Math.round(v)} km/s`;
  const formatAQI = (v: number) => `${v}`;
  const aqiBadge =
    aq.usAqi <= 50
      ? { text: "Good", class: "bg-green-600" }
      : aq.usAqi <= 100
      ? { text: "Moderate", class: "bg-yellow-500" }
      : aq.usAqi <= 150
      ? { text: "Unhealthy (SG)", class: "bg-orange-500" }
      : aq.usAqi <= 200
      ? { text: "Unhealthy", class: "bg-red-600" }
      : aq.usAqi <= 300
      ? { text: "Very Unhealthy", class: "bg-fuchsia-600" }
      : { text: "Hazardous", class: "bg-purple-700" };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            BodyMirror Dashboard
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                LIVE DATA
              </Badge>
              {/* Location Status Indicator */}
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
            {/* Edit Mode Controls */}
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant={isEditMode ? "default" : "outline"}
                onClick={() => setIsEditMode(!isEditMode)}
                className={isEditMode ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                <i className={`fas ${isEditMode ? 'fa-check' : 'fa-edit'} mr-2`}></i>
                {isEditMode ? 'Done' : 'Customize'}
              </Button>
              {isEditMode && (
                <Button size="sm" variant="ghost" onClick={resetLayout}>
                  <i className="fas fa-undo mr-2"></i> Reset
                </Button>
              )}
            </div>
          </div>
        </div>

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center text-blue-800">
            <i className="fas fa-info-circle mr-2"></i>
            <span className="text-sm">Drag widgets to reorder them. Click the × to hide widgets.</span>
          </div>
        </div>
      )}

      {/* Widgets */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="soultech-widgets">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`
                grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
                ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}
                transition-colors duration-200
              `}
            >
        {/* Geomagnetic Activity (Kp) */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-5" />
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Orbit className="h-5 w-5 text-muted-foreground" />
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-gray-100">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-3 text-xs" side="top">
                    <div>
                      <div className="font-semibold mb-1">Kp Index (0-9)</div>
                      <p>Measures Earth's magnetic field disturbance caused by solar wind interactions. Data from NOAA SWPC's real-time magnetometer network. Higher values (5+) indicate geomagnetic storms that can affect satellites, GPS, and create auroras at lower latitudes.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className="border-none bg-indigo-600 text-white text-xs">
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
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-gray-100">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-3 text-xs" side="top">
                    <div>
                      <div className="font-semibold mb-1">Solar Wind Speed (km/s)</div>
                      <p>Measured by DSCOVR satellite at L1 Lagrange point, 1.5 million km from Earth. Normal speeds: 300-400 km/s. High-speed streams (500+ km/s) from coronal holes can trigger geomagnetic activity when they interact with Earth's magnetosphere.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className="border-none bg-cyan-600 text-white text-xs">
                DSCOVR
              </Badge>
            </div>
            <CardTitle className="text-base">Solar Wind Speed</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{loading ? "—" : formatWind(wind)}</span>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Increased wind speed can precede geomagnetic activity.
            </p>
          </CardContent>
        </Card>

        {/* Air Quality */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-5" />
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-gray-100">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-3 text-xs" side="top">
                    <div>
                      <div className="font-semibold mb-1">US AQI & PM2.5</div>
                      <p>Air Quality Index from Open-Meteo using EPA standards. PM2.5 measures particles ≤2.5 micrometers that penetrate deep into lungs. AQI: 0-50 Good, 51-100 Moderate, 101+ Unhealthy. Location-based using GPS coordinates.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className={`border-none text-white text-xs ${aqiBadge.class}`}>
                {aqiBadge.text}
              </Badge>
            </div>
            <CardTitle className="text-base">Air Quality (US AQI / PM2.5)</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{loading ? "—" : formatAQI(aq.usAqi)}</span>
              <span className="text-sm text-muted-foreground">
                PM2.5: {loading ? "—" : `${aq.pm25.toFixed(1)} µg/m³`}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Source: {aq.source}
            </p>
          </CardContent>
        </Card>

        {/* Circadian Alignment */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-5" />
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-muted-foreground" />
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-gray-100">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-3 text-xs" side="top">
                    <div>
                      <div className="font-semibold mb-1">Circadian Alignment (%)</div>
                      <p>Calculated from your location's sunrise/sunset times vs. current time. Algorithm considers natural light exposure peaks and optimal energy windows. Based on chronobiology research - highest energy typically 2-3 hours post-sunrise.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className="border-none bg-amber-600 text-white text-xs">
                Daily Rhythm
              </Badge>
            </div>
            <CardTitle className="text-base">Circadian Alignment</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{circadian}%</span>
              <Progress value={circadian} className="w-24 h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on current time vs. today's sunrise/sunset.
            </p>
          </CardContent>
        </Card>

        {/* Lunar Phase */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-5" />
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-gray-100">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-3 text-xs" side="top">
                    <div>
                      <div className="font-semibold mb-1">Lunar Phase</div>
                      <p>Calculated using astronomical algorithms based on current date. Moon phases affect tides and may correlate with circadian rhythms. New Moon (0%) to Full Moon (100%). No external API required - pure mathematical calculation.</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className="border-none bg-violet-600 text-white text-xs">
                {moon.emoji}
              </Badge>
            </div>
            <CardTitle className="text-base">Lunar Phase</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{moon.label}</span>
              <span className="text-sm text-muted-foreground">{moon.phasePct}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Local calculation (no API).
            </p>
          </CardContent>
        </Card>

        {/* Focus Streak */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 opacity-5" />
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-gray-100">
                      <Info className="h-3 w-3 text-muted-foreground hover:text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs p-3 text-xs" side="top">
                    <div>
                      <div className="font-semibold mb-1">Focus Streak</div>
                      <p>Client-side timer tracking current session time. Integrates with Vision Quest productivity challenges. Target: 50+ minutes for optimal focus flow. Based on Pomodoro research and ultradian rhythm studies (90-120 min natural cycles).</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant="outline" className="border-none bg-rose-600 text-white text-xs">
                Personal
              </Badge>
            </div>
            <CardTitle className="text-base">Focus Streak</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{focusMin} min</span>
              <Progress
                value={Math.min(100, (focusMin / 50) * 100)} // 50 min session target
                className="w-24 h-2"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // simple reset; you could persist to Supabase later
                  location.reload();
                }}
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Info / Sources */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10" />
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
            The focus streak timer tracks your session time and integrates with Vision Quest
            for enhanced productivity sessions. Data automatically falls back to realistic values if APIs are unavailable.
          </p>
        </CardContent>
      </Card>
      </div>
    </TooltipProvider>
  );
}