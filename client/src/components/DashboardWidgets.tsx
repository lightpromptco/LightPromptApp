import { useEffect, useMemo, useRef, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// ----------------------- Types -----------------------
interface Widget {
  id: string;
  title: string;
  type: 'metric' | 'progress' | 'activity' | 'chart' | 'quick-action' | 'weather' | 'quotes' | 'calendar' | 'book-store' | 'uv' | 'pollen' | 'breathing' | 'gratitude' | 'dream';
  content: any;
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
  description?: string;
}
interface DashboardWidgetsProps {
  userId: string;
  dashboardData: any;
  user: any; // can include calendarUrl?: string
}

// ----------------------- Defaults -----------------------
const DEFAULT_WIDGETS: Widget[] = [
  { id: 'wellness-overview', title: 'Wellness Overview', type: 'metric', content: { metric: 'wellness' }, size: 'large', enabled: true },
  { id: 'daily-checkin',     title: 'Daily Check-in',     type: 'quick-action', content: { action: 'checkin' }, size: 'medium', enabled: true },
  { id: 'habit-progress',    title: 'Habit Progress',     type: 'progress', content: { metric: 'habits' }, size: 'medium', enabled: true },
  { id: 'recent-activity',   title: 'Recent Activity',    type: 'activity', content: { type: 'recent' }, size: 'large', enabled: true },
  { id: 'ai-insights',       title: 'AI Insights',        type: 'chart', content: { type: 'insights' }, size: 'medium', enabled: true },
  { id: 'quick-chat',        title: 'Quick Chat',         type: 'quick-action', content: { action: 'chat' }, size: 'small', enabled: true },
  { id: 'book-store',        title: 'LightPrompt:ed Book', type: 'book-store', content: { type: 'store' }, size: 'large', enabled: true },
  { id: 'weather-now',       title: 'Local Weather',      type: 'weather', content: {}, size: 'small', enabled: true },
  { id: 'quote-today',       title: 'Quote of the Moment', type: 'quotes', content: {}, size: 'medium', enabled: true },
  { id: 'calendar-today',    title: 'Today’s Calendar',   type: 'calendar', content: {}, size: 'medium', enabled: true },
  { id: 'uv-index',          title: 'UV Index',           type: 'uv', content: {}, size: 'small', enabled: true },
  { id: 'pollen',            title: 'Pollen Count',       type: 'pollen', content: {}, size: 'medium', enabled: true },
  { id: 'breathing',         title: 'Breathing Exercise (4-7-8)', type: 'breathing', content: {}, size: 'medium', enabled: true },
  { id: 'gratitude',         title: 'Daily Gratitude',    type: 'gratitude', content: {}, size: 'medium', enabled: true },
  { id: 'dream',             title: 'Dream Journal',      type: 'dream', content: {}, size: 'medium', enabled: true },
];

// ----------------------- Helpers: data & utils -----------------------
type Geo = { lat: number; lon: number };
type Weather = { tempF: number; code: number; label: string; emoji: string } | null;
type Quote = { text: string; author: string } | null;
type CalEvent = { dt: Date; title: string };
type UV = { index: number; risk: string; color: string } | null;
type Pollen = { total: number; grass: number; tree: number; weed: number } | null;

/** Get geolocation with fallback (USA center) */
// Enhanced location system with caching and privacy-first approach
async function getGeo(userId?: string): Promise<Geo & { cached?: boolean; permission?: string }> {
  // Check localStorage cache first (30 minute TTL)
  const cacheKey = 'lightprompt_location_cache';
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    try {
      const { lat, lon, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (now - timestamp < thirtyMinutes) {
        return { lat, lon, cached: true, permission: 'granted' };
      }
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      return resolve({ lat: 40.0, lon: -100.0, permission: 'unavailable' });
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          permission: 'granted' as const
        };
        
        // Cache location for 30 minutes
        localStorage.setItem(cacheKey, JSON.stringify({
          lat: location.lat,
          lon: location.lon,
          timestamp: Date.now()
        }));
        
        // Optionally save to user profile (if userId provided)
        if (userId) {
          fetch(`/api/users/${userId}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: location.lat,
              longitude: location.lon,
              locationPermission: 'granted',
              locationLastUpdated: Date.now()
            })
          }).catch(err => console.log('Profile location update failed:', err));
        }
        
        resolve(location);
      },
      (error) => {
        const permission = error.code === 1 ? 'denied' : 'unknown';
        resolve({ lat: 40.0, lon: -100.0, permission });
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  });
}

function weatherCodeToLabel(code: number) {
  // Open-Meteo weathercode mapping (simplified)
  const map: Record<string, { label: string; emoji: string }> = {
    '0': { label: 'Clear', emoji: '☀️' },
    '1': { label: 'Mainly Clear', emoji: '🌤️' },
    '2': { label: 'Partly Cloudy', emoji: '⛅' },
    '3': { label: 'Overcast', emoji: '☁️' },
    '45': { label: 'Fog', emoji: '🌫️' },
    '48': { label: 'Depositing Rime Fog', emoji: '🌫️' },
    '51': { label: 'Drizzle', emoji: '🌦️' },
    '53': { label: 'Drizzle', emoji: '🌦️' },
    '55': { label: 'Drizzle', emoji: '🌦️' },
    '61': { label: 'Rain', emoji: '🌧️' },
    '63': { label: 'Rain', emoji: '🌧️' },
    '65': { label: 'Rain', emoji: '🌧️' },
    '71': { label: 'Snow', emoji: '❄️' },
    '73': { label: 'Snow', emoji: '❄️' },
    '75': { label: 'Snow', emoji: '❄️' },
    '80': { label: 'Rain Showers', emoji: '🌧️' },
    '81': { label: 'Rain Showers', emoji: '🌧️' },
    '82': { label: 'Rain Showers', emoji: '🌧️' },
    '95': { label: 'Thunderstorm', emoji: '⛈️' },
    '96': { label: 'Thunderstorm', emoji: '⛈️' },
    '99': { label: 'Thunderstorm', emoji: '⛈️' },
  };
  return map[String(code)] || { label: 'Weather', emoji: '🌤️' };
}

async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    const t = data?.current?.temperature_2m;
    const code = data?.current?.weather_code;
    if (t == null || code == null) return null;
    const { label, emoji } = weatherCodeToLabel(code);
    return { tempF: Math.round(Number(t)), code, label, emoji };
  } catch {
    return null;
  }
}

async function fetchUV(lat: number, lon: number): Promise<UV> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max&timezone=auto&forecast_days=1`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    const uvIndex = data?.daily?.uv_index_max?.[0];
    if (uvIndex == null) return null;
    
    const index = Math.round(Number(uvIndex));
    let risk = 'Low';
    let color = 'green';
    
    if (index >= 11) { risk = 'Extreme'; color = 'purple'; }
    else if (index >= 8) { risk = 'Very High'; color = 'red'; }
    else if (index >= 6) { risk = 'High'; color = 'orange'; }
    else if (index >= 3) { risk = 'Moderate'; color = 'yellow'; }
    
    return { index, risk, color };
  } catch {
    return null;
  }
}

async function fetchPollen(lat: number, lon: number): Promise<Pollen> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=grass_pollen_max,tree_pollen_max,weed_pollen_max&timezone=auto&forecast_days=1`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    const grass = data?.daily?.grass_pollen_max?.[0] || 0;
    const tree = data?.daily?.tree_pollen_max?.[0] || 0;
    const weed = data?.daily?.weed_pollen_max?.[0] || 0;
    const total = Math.round((grass + tree + weed) / 3);
    
    return { total, grass: Math.round(grass), tree: Math.round(tree), weed: Math.round(weed) };
  } catch {
    return null;
  }
}

// Local inspirational quotes for soul-tech wellness
const SOUL_TECH_QUOTES = [
  { text: "Your inner wisdom is your greatest technology.", author: "LightPrompt" },
  { text: "The universe conspires to help those who align with their highest self.", author: "Paulo Coelho" },
  { text: "We are not human beings having a spiritual experience; we are spiritual beings having a human experience.", author: "Pierre Teilhard de Chardin" },
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell" },
  { text: "Everything you need is inside you – you just need to access it.", author: "Buddha" },
  { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi" },
  { text: "The privilege of a lifetime is being who you are.", author: "Joseph Campbell" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.", author: "Marcel Proust" },
  { text: "You are not a drop in the ocean, but the entire ocean in each drop.", author: "Rumi" },
  { text: "The wound is the place where the Light enters you.", author: "Rumi" },
  { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
  { text: "The way is not in the sky. The way is in the heart.", author: "Buddha" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" }
];

function fetchQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * SOUL_TECH_QUOTES.length);
  return SOUL_TECH_QUOTES[randomIndex];
}

/** Super-light ICS parser: DTSTART + SUMMARY lines only (next 5) */
async function fetchCalendar(icsUrl?: string): Promise<CalEvent[]> {
  if (!icsUrl) return [];
  try {
    const res = await fetch(icsUrl, { cache: 'no-store' });
    const text = await res.text();
    const lines = text.split(/\r?\n/);
    const events: CalEvent[] = [];
    let current: Partial<CalEvent> = {};
    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) current = {};
      if (line.startsWith('DTSTART')) {
        const match = line.match(/DTSTART.*:(\d{8}T?\d{6}Z?)/);
        if (match) {
          const raw = match[1];
          // Basic ISO conversion
          const iso =
            raw.endsWith('Z')
              ? raw.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/, '$1-$2-$3T$4:$5:$6Z')
              : raw.replace(/^(\d{4})(\d{2})(\d{2})T?(\d{2})(\d{2})(\d{2})$/, '$1-$2-$3T$4:$5:$6');
          current.dt = new Date(iso);
        }
      }
      if (line.startsWith('SUMMARY:')) {
        current.title = line.replace('SUMMARY:', '').trim();
      }
      if (line.startsWith('END:VEVENT')) {
        if (current.dt && current.title) events.push(current as CalEvent);
      }
    }
    // upcoming only + sort + take 5
    const now = new Date();
    return events
      .filter(e => e.dt > now)
      .sort((a, b) => a.dt.getTime() - b.dt.getTime())
      .slice(0, 5);
  } catch {
    return [];
  }
}

// ----------------------- Component -----------------------
export function DashboardWidgets({ userId, dashboardData, user }: DashboardWidgetsProps) {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = sessionStorage.getItem(`dashboard-layout-${userId}`);
    return saved ? JSON.parse(saved) : DEFAULT_WIDGETS;
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Live data state with location status
  const [geo, setGeo] = useState<(Geo & { cached?: boolean; permission?: string }) | null>(null);
  const [weather, setWeather] = useState<Weather>(null);
  const [quote, setQuote] = useState<Quote>(null);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [uv, setUV] = useState<UV>(null);
  const [pollen, setPollen] = useState<Pollen>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'denied' | 'unavailable'>('loading');

  // Persist layout
  useEffect(() => {
    sessionStorage.setItem(`dashboard-layout-${userId}`, JSON.stringify(widgets));
  }, [widgets, userId]);

  // Fetch live data with enhanced location handling
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLocationStatus('loading');
      const g = await getGeo(userId);
      if (!mounted) return;
      setGeo(g);
      setLocationStatus((g.permission as 'granted' | 'denied' | 'unavailable') || 'loading');
      
      const [w, ev, uvData, pollenData] = await Promise.all([
        fetchWeather(g.lat, g.lon),
        fetchCalendar(user?.calendarUrl),
        fetchUV(g.lat, g.lon),
        fetchPollen(g.lat, g.lon),
      ]);
      const q = fetchQuote();
      if (!mounted) return;
      setWeather(w);
      setQuote(q);
      setEvents(ev);
      setUV(uvData);
      setPollen(pollenData);
    })();
    return () => { mounted = false; };
  }, [user?.calendarUrl, userId]);

  // --------------- DnD ---------------
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setWidgets(items);
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(widgets.map(w => w.id === widgetId ? { ...w, enabled: !w.enabled } : w));
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_WIDGETS);
    sessionStorage.removeItem(`dashboard-layout-${userId}`);
  };

  const addWidget = (widget: Widget) => setWidgets([...widgets, widget]);

  const enabledWidgets = widgets.filter(w => w.enabled);

  // --------------- Render helpers ---------------
  const getWidgetSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-1 md:col-span-2';
      case 'large': return 'col-span-1 md:col-span-2 lg:col-span-3';
      default: return 'col-span-1';
    }
  };

  const getWidgetIcon = (type: string) => {
    const map: Record<string, JSX.Element> = {
      metric:      <i className="fas fa-chart-bar text-blue-500" />,
      progress:    <i className="fas fa-tasks text-green-500" />,
      activity:    <i className="fas fa-clock text-purple-500" />,
      chart:       <i className="fas fa-chart-line text-orange-500" />,
      'quick-action': <i className="fas fa-bolt text-yellow-500" />,
      quotes:      <i className="fas fa-quote-left text-pink-500" />,
      weather:     <i className="fas fa-cloud-sun text-cyan-500" />,
      calendar:    <i className="fas fa-calendar text-indigo-500" />,
      'book-store':<i className="fas fa-book text-emerald-500" />,
      uv:          <i className="fas fa-sun text-yellow-600" />,
      pollen:      <i className="fas fa-leaf text-green-600" />,
      breathing:   <i className="fas fa-lungs text-blue-600" />,
      gratitude:   <i className="fas fa-heart text-red-500" />,
      dream:       <i className="fas fa-moon text-purple-600" />,
    };
    return map[type] ?? <i className="fas fa-square text-gray-500" />;
  };

  const renderWidget = (widget: Widget, index: number) => (
    <Draggable key={widget.id} draggableId={widget.id} index={index} isDragDisabled={!isEditMode}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`transition-all duration-200 ${snapshot.isDragging ? 'rotate-2 scale-105 z-50' : ''}`}
        >
          <Card
            className={`
              ${getWidgetSizeClass(widget.size)}
              ${isEditMode ? 'border-blue-300 border-2 border-dashed bg-blue-50' : ''}
              ${snapshot.isDragging ? 'shadow-2xl border-blue-500' : ''}
              hover:shadow-lg transition-all duration-200 relative
            `}
          >
            {isEditMode && (
              <div className="absolute top-2 right-2 z-50">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleWidget(widget.id); }}
                  onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                  onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                  className="h-6 w-6 p-0 bg-white/90 hover:bg-red-100 shadow-sm border border-gray-200 pointer-events-auto"
                  style={{ pointerEvents: 'auto' }}
                >
                  <i className="fas fa-times text-red-500 text-xs"></i>
                </Button>
              </div>
            )}

            <CardHeader {...provided.dragHandleProps} className={`${isEditMode ? 'pb-2 cursor-grab active:cursor-grabbing' : ''}`}>
              <CardTitle className="flex items-center text-lg">
                {isEditMode && <i className="fas fa-grip-vertical mr-2 text-gray-400"></i>}
                {getWidgetIcon(widget.type)}
                <span className="ml-2">{widget.title}</span>
              </CardTitle>
            </CardHeader>

            <CardContent>{renderWidgetContent(widget)}</CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  // ----------------------- Widget bodies -----------------------
  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case 'metric':      return renderMetricWidget(widget);
      case 'progress':    return renderProgressWidget(widget);
      case 'activity':    return renderActivityWidget(widget);
      case 'chart':       return renderChartWidget(widget);
      case 'quick-action':return renderQuickActionWidget(widget);
      case 'quotes':      return renderQuotesWidget(widget);
      case 'weather':     return renderWeatherWidget(widget);
      case 'calendar':    return renderCalendarWidget(widget);
      case 'book-store':  return renderBookStoreWidget(widget);
      case 'uv':          return renderUVWidget(widget);
      case 'pollen':      return renderPollenWidget(widget);
      case 'breathing':   return renderBreathingWidget(widget);
      case 'gratitude':   return renderGratitudeWidget(widget);
      case 'dream':       return renderDreamWidget(widget);
      default:            return <div className="text-gray-500">Widget content</div>;
    }
  };

  // ------- Metric (Wellness Overview) -------
  const renderMetricWidget = (widget: Widget) => {
    // Prefer server-fed data; fall back to localStorage
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem('lp-checkins') || '[]'); } catch { return []; }
    })() as Array<{ mood?: number; energy?: number; ts?: string }>;

    const metrics = dashboardData?.wellnessMetrics ?? {};
    const mood = metrics.mood ?? Math.round((stored.reduce((a, c) => a + (c.mood ?? 5), 0) / Math.max(1, stored.length)));
    const energy = metrics.energy ?? Math.round((stored.reduce((a, c) => a + (c.energy ?? 5), 0) / Math.max(1, stored.length)));
    const streakDays = dashboardData?.streakDays ?? Number(localStorage.getItem('lp-streak') || 0);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{mood >= 7 ? '😊' : mood >= 5 ? '😐' : '😔'}</div>
            <div className="text-sm text-gray-600">Mood</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{energy ?? 0}/10</div>
            <div className="text-sm text-gray-600">Energy</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-600">{streakDays} day streak</div>
          <div className="text-xs text-gray-500">Keep it up!</div>
        </div>
      </div>
    );
  };

  // ------- Progress (Habits) -------
  const renderProgressWidget = (widget: Widget) => {
    const habits = dashboardData?.habits ?? (() => {
      try { return JSON.parse(localStorage.getItem('lp-habits') || '[]'); } catch { return []; }
    })();
    const completedToday = habits.filter((h: any) => h.completedToday).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Today's Habits</span>
          <Badge variant="outline">{completedToday}/{totalHabits}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-xs text-gray-500 text-center">{Math.round(progress)}% complete</div>
      </div>
    );
  };

  // ------- Activity -------
  const renderActivityWidget = (widget: Widget) => {
    const items = dashboardData?.activities ?? (() => {
      try { return JSON.parse(localStorage.getItem('lp-activity') || '[]'); } catch { return []; }
    })();
    const list = (items as any[]).slice(0, 4);

    if (!list.length) {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
            No recent activity. Try a daily check-in or start a chat to see activity appear here.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {list.map((a, i) => (
          <div key={i} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <i className="fas fa-star text-white text-xs"></i>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{a.title ?? 'Activity'}</div>
              <div className="text-xs text-gray-500">{a.when ?? 'Just now'}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ------- AI Insights (lightweight demo) -------
  const renderChartWidget = (widget: Widget) => {
    const insights = [
      '💡 You focus better within 2 hours after sunrise.',
      '🌙 Wind down improves when screens go off 60 min before bed.',
      '🏃 Morning movement boosts mood by ~30%.',
      '🌿 Air quality impacts your afternoon energy.',
    ];
    const tip = insights[Math.floor(Math.random() * insights.length)];
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-center">AI Insights</div>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded border border-blue-100">
          <div className="text-sm text-gray-700 mb-2">{tip}</div>
          <div className="text-xs text-gray-500">Auto-generated from your patterns</div>
        </div>
        <div className="flex justify-center">
          <Button size="sm" variant="outline" onClick={() => (window.location.href = '/dashboard?view=growth')}>
            <i className="fas fa-chart-line mr-1"></i> View Details
          </Button>
        </div>
      </div>
    );
  };

  // ------- Quick Actions -------
  const renderQuickActionWidget = (widget: Widget) => {
    if (widget.content?.action === 'checkin') {
      const save = (mood: number) => {
        const now = new Date();
        const key = 'lp-checkins';
        const arr = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } })();
        arr.push({ mood, energy: mood, ts: now.toISOString() });
        localStorage.setItem(key, JSON.stringify(arr));
        // naive streak update
        const streak = Number(localStorage.getItem('lp-streak') || '0') + 1;
        localStorage.setItem('lp-streak', String(streak));
      };
      return (
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-3">How are you feeling today?</div>
            <div className="flex justify-center space-x-2">
              {[9, 6, 3].map((score, i) => (
                <Button key={i} variant="ghost" size="sm" className="text-xl hover:bg-blue-50" onClick={() => save(score)}>
                  {score >= 8 ? '😊' : score >= 5 ? '😐' : '😔'}
                </Button>
              ))}
            </div>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="sm"
            onClick={() => (window.location.href = '/dashboard?view=checkin')}
          >
            <i className="fas fa-heart mr-2"></i> Complete Check-in
          </Button>
        </div>
      );
    }

    if (widget.content?.action === 'chat') {
      return (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 text-center">Start a conversation with your AI companion</div>
          <Button className="w-full" size="sm" variant="outline" onClick={() => (window.location.href = '/chat')}>
            <i className="fas fa-comments mr-2"></i> Open Chat
          </Button>
        </div>
      );
    }

    return <div className="text-gray-500 text-center">Quick action</div>;
  };

  // ------- Quotes (live) -------
  const renderQuotesWidget = (widget: Widget) => {
    return (
      <div className="space-y-3">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
          <div className="text-sm text-gray-700 mb-2 italic">"{quote?.text ?? 'Loading…'}"</div>
          <div className="text-xs text-gray-500 text-right">— {quote?.author ?? '...'}</div>
        </div>
        <div className="text-center">
          <Button size="sm" variant="ghost" onClick={() => setQuote(fetchQuote())}>
            <i className="fas fa-refresh mr-1"></i> New Quote
          </Button>
        </div>
      </div>
    );
  };

  // ------- Weather (live) -------
  const renderWeatherWidget = (widget: Widget) => {
    const getLocationStatusBadge = () => {
      const badgeStyles = {
        loading: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
        granted: { bg: 'bg-green-100', text: 'text-green-800', icon: '📍' },
        denied: { bg: 'bg-red-100', text: 'text-red-800', icon: '🚫' },
        unavailable: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '❓' }
      };
      
      const style = badgeStyles[locationStatus] || badgeStyles.unavailable;
      const labels = {
        loading: 'Getting Location',
        granted: geo?.cached ? 'Location Cached' : 'Location Active',
        denied: 'Location Denied',
        unavailable: 'Location Unavailable'
      };
      
      return (
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text} mb-2`}>
          <span className="mr-1">{style.icon}</span>
          {labels[locationStatus]}
        </div>
      );
    };

    return (
      <div className="space-y-3 text-center">
        {getLocationStatusBadge()}
        <div className="text-2xl mb-1">{weather?.emoji ?? '🌤️'}</div>
        <div className="text-lg font-semibold">{weather ? `${weather.tempF}°F` : '—'}</div>
        <div className="text-xs text-gray-600">{weather?.label ?? 'Locating…'}</div>
        {geo && (
          <div className="bg-cyan-50 p-2 rounded text-center text-xs text-cyan-700 mt-2">
            {(Math.abs(geo.lat).toFixed(2))}°{geo.lat >= 0 ? 'N' : 'S'}, {(Math.abs(geo.lon).toFixed(2))}°{geo.lon >= 0 ? 'E' : 'W'}
          </div>
        )}
      </div>
    );
  };

  // ------- Calendar (optional ICS) -------
  const renderCalendarWidget = (widget: Widget) => {
    const fmt = (d: Date) =>
      d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    if (!user?.calendarUrl && events.length === 0) {
      return (
        <div className="space-y-3">
          <div className="text-sm font-medium text-center">Connect a calendar</div>
          <div className="p-3 bg-indigo-50 rounded text-xs text-indigo-700">
            Add a public ICS link to <code>user.calendarUrl</code> to show upcoming events here.
          </div>
        </div>
      );
    }
    if (events.length === 0) {
      return <div className="text-sm text-gray-500">No upcoming events found.</div>;
    }
    return (
      <div className="space-y-2">
        {events.map((e, i) => (
          <div key={i} className="flex items-center space-x-2 p-2 bg-indigo-50 rounded">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium">{e.title}</div>
              <div className="text-xs text-gray-500">{fmt(e.dt)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ------- Book Store (kept working) -------
  const renderBookStoreWidget = (widget: Widget) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-16 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded shadow-lg flex items-center justify-center">
              <i className="fas fa-eye text-white text-xl"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">✓</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-bold text-lg text-gray-900">LightPrompt:ed</h3>
          <p className="text-sm text-gray-600">The foundational guide to soul-tech wellness</p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl font-bold text-emerald-600">$11</span>
            <span className="text-sm text-gray-500 line-through">$19</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            onClick={() => window.open('https://lightprompt.gumroad.com/l/xrpvr', '_blank')}
          >
            <i className="fas fa-shopping-cart mr-1"></i> Buy Now
          </Button>
          <Button size="sm" variant="outline" onClick={() => (window.location.href = '/dashboard?view=about')}>
            <i className="fas fa-info-circle mr-1"></i> Learn More
          </Button>
        </div>

        <div className="text-xs text-center text-gray-500 bg-emerald-50 p-2 rounded">
          💫 <strong>Foundation first:</strong> Start with the book, then explore the tools that call to you.
        </div>
      </div>
    );
  };

  // UV Widget
  const renderUVWidget = (widget: Widget) => {
    if (!uv) {
      return (
        <div className="text-center text-gray-500">
          <i className="fas fa-sun text-yellow-600 text-2xl mb-2"></i>
          <div className="text-sm">UV data loading...</div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="text-3xl font-bold mb-2" style={{ color: uv.color }}>
          {uv.index}
        </div>
        <div className="text-sm text-gray-600 mb-2">{uv.risk} Risk</div>
        <div className="text-xs text-gray-500">UV Index</div>
      </div>
    );
  };

  // Pollen Widget
  const renderPollenWidget = (widget: Widget) => {
    if (!pollen) {
      return (
        <div className="text-center text-gray-500">
          <i className="fas fa-leaf text-green-600 text-2xl mb-2"></i>
          <div className="text-sm">Pollen data loading...</div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{pollen.total}</div>
          <div className="text-xs text-gray-500">Total Pollen</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold">{pollen.grass}</div>
            <div className="text-gray-500">Grass</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{pollen.tree}</div>
            <div className="text-gray-500">Tree</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">{pollen.weed}</div>
            <div className="text-gray-500">Weed</div>
          </div>
        </div>
      </div>
    );
  };

  // Breathing Exercise Widget
  const renderBreathingWidget = (widget: Widget) => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
    const [count, setCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startBreathing = () => {
      setIsActive(true);
      setPhase('inhale');
      setCount(4);
      
      const breathingCycle = () => {
        setCount(prev => {
          if (prev > 1) return prev - 1;
          
          setPhase(current => {
            if (current === 'inhale') { setCount(7); return 'hold'; }
            if (current === 'hold') { setCount(8); return 'exhale'; }
            if (current === 'exhale') { setCount(4); return 'inhale'; }
            return 'inhale';
          });
          return prev;
        });
      };
      
      intervalRef.current = setInterval(breathingCycle, 1000);
    };

    const stopBreathing = () => {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    useEffect(() => {
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    return (
      <div className="text-center space-y-4">
        <div className="text-lg font-semibold capitalize text-blue-600">{phase}</div>
        <div className="text-3xl font-bold">{count}</div>
        <Button
          onClick={isActive ? stopBreathing : startBreathing}
          variant={isActive ? "destructive" : "default"}
          className="w-full"
        >
          {isActive ? 'Stop' : 'Start'} Breathing
        </Button>
      </div>
    );
  };

  // Gratitude Widget
  const renderGratitudeWidget = (widget: Widget) => {
    const [gratitude, setGratitude] = useState('');
    const [saved, setSaved] = useState(false);

    const saveGratitude = () => {
      if (gratitude.trim()) {
        const gratitudes = JSON.parse(localStorage.getItem('lp-gratitude') || '[]');
        gratitudes.push({ text: gratitude, date: new Date().toISOString() });
        localStorage.setItem('lp-gratitude', JSON.stringify(gratitudes));
        setGratitude('');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    };

    return (
      <div className="space-y-3">
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="What are you grateful for today?"
          className="w-full p-2 border rounded text-sm resize-none"
          rows={3}
        />
        <Button 
          onClick={saveGratitude} 
          disabled={!gratitude.trim() || saved}
          className="w-full"
          variant={saved ? "default" : "outline"}
        >
          {saved ? 'Saved! 💚' : 'Save Gratitude'}
        </Button>
      </div>
    );
  };

  // Dream Journal Widget
  const renderDreamWidget = (widget: Widget) => {
    const [dream, setDream] = useState('');
    const [saved, setSaved] = useState(false);

    const saveDream = () => {
      if (dream.trim()) {
        const dreams = JSON.parse(localStorage.getItem('lp-dreams') || '[]');
        dreams.push({ text: dream, date: new Date().toISOString() });
        localStorage.setItem('lp-dreams', JSON.stringify(dreams));
        setDream('');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    };

    return (
      <div className="space-y-3">
        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Describe your dream..."
          className="w-full p-2 border rounded text-sm resize-none"
          rows={3}
        />
        <Button 
          onClick={saveDream} 
          disabled={!dream.trim() || saved}
          className="w-full"
          variant={saved ? "default" : "outline"}
        >
          {saved ? 'Saved! 🌙' : 'Save Dream'}
        </Button>
      </div>
    );
  };

  // ----------------------- Render -----------------------
  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">Dashboard Widgets</h3>
          <Badge variant="outline" className="text-xs">{enabledWidgets.length} active</Badge>
        </div>
        <div className="flex items-center space-x-2">
          {/* <WidgetLibrary onAddWidget={addWidget} currentWidgets={widgets} /> */}
          <Button size="sm" variant={isEditMode ? 'default' : 'outline'} onClick={() => setIsEditMode(!isEditMode)}>
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

      {isEditMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center text-blue-800">
            <i className="fas fa-info-circle mr-2"></i>
            <span className="text-sm">Drag widgets to reorder them. Click the × to hide widgets.</span>
          </div>
        </div>
      )}

      {/* Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard-widgets">
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
              {enabledWidgets.map((widget, index) => renderWidget(widget, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Hidden */}
      {isEditMode && widgets.some(w => !w.enabled) && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3">Hidden Widgets</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {widgets.filter(w => !w.enabled).map(widget => (
              <Card key={widget.id} className="opacity-50 border-dashed hover:opacity-75 transition-opacity">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getWidgetIcon(widget.type)}
                      <span className="text-sm font-medium">{widget.title}</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toggleWidget(widget.id)} className="h-6 w-6 p-0 hover:bg-green-100">
                      <i className="fas fa-plus text-green-500 text-xs"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
