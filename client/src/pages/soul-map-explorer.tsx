import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Stars, Sun, Moon, Sparkles, Eye, Heart, Compass, MessageCircle, BookOpen, Lightbulb,
  TrendingUp, Bot, Wand2, ChevronRight, Maximize2, Minimize2, Play, Send, User,
  Mountain, RotateCcw, Target, Sunset, Waves, Palette, ArrowRight, Zap, Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InteractiveNatalChart } from "@/components/InteractiveNatalChart";

/** ---------- config ---------- */
const SOULMAP_BOT_ID = "soulmap"; // <- your bot key in the multi-bot system

/** ---------- helpers ---------- */
const debounce = <T extends (...args: any[]) => void>(fn: T, ms = 300) => {
  let t: any; return (...args: Parameters<T>) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};
const getCurrentMoonPhase = () => {
  const phases = ["🌑 New Moon","🌒 Waxing Crescent","🌓 First Quarter","🌔 Waxing Gibbous","🌕 Full Moon","🌖 Waning Gibbous","🌗 Last Quarter","🌘 Waning Crescent"];
  const now = new Date(); return phases[Math.floor(((now.getDate()) / 30) * 8) % 8];
};

/** ---------- minimal sign data ---------- */
const ZODIAC_SIGNS = [
  { id:"aries", name:"Aries", element:"Fire", dates:"Mar 21 - Apr 19", emoji:"♈", symbol:"🐏", color:"from-red-500 to-orange-500",
    traits:["Bold","Pioneering","Energetic","Independent"], soulPurpose:"To lead and initiate new beginnings", challenge:"Learning patience and considering others" },
  { id:"taurus", name:"Taurus", element:"Earth", dates:"Apr 20 - May 20", emoji:"♉", symbol:"🐂", color:"from-green-600 to-emerald-500",
    traits:["Grounded","Sensual","Determined","Loyal"], soulPurpose:"To build lasting beauty and security", challenge:"Embracing change and flexibility" },
  { id:"gemini", name:"Gemini", element:"Air", dates:"May 21 - Jun 20", emoji:"♊", symbol:"👥", color:"from-yellow-400 to-amber-400",
    traits:["Curious","Communicative","Adaptable","Witty"], soulPurpose:"To connect ideas and people", challenge:"Finding depth amid endless curiosity" },
  { id:"cancer", name:"Cancer", element:"Water", dates:"Jun 21 - Jul 22", emoji:"♋", symbol:"🦀", color:"from-blue-400 to-cyan-400",
    traits:["Nurturing","Intuitive","Protective","Emotional"], soulPurpose:"To nurture and protect", challenge:"Balancing care for others with self-care" },
  { id:"leo", name:"Leo", element:"Fire", dates:"Jul 23 - Aug 22", emoji:"♌", symbol:"🦁", color:"from-orange-500 to-yellow-500",
    traits:["Creative","Generous","Dramatic","Confident"], soulPurpose:"To shine and inspire", challenge:"Sharing the spotlight with humility" },
  { id:"virgo", name:"Virgo", element:"Earth", dates:"Aug 23 - Sep 22", emoji:"♍", symbol:"👼", color:"from-green-500 to-teal-500",
    traits:["Practical","Analytical","Helpful","Precise"], soulPurpose:"To serve through mastery", challenge:"Accepting imperfection" },
  { id:"libra", name:"Libra", element:"Air", dates:"Sep 23 - Oct 22", emoji:"♎", symbol:"⚖️", color:"from-pink-400 to-rose-400",
    traits:["Harmonious","Diplomatic","Aesthetic","Fair"], soulPurpose:"To create balance", challenge:"Decisiveness & truth" },
  { id:"scorpio", name:"Scorpio", element:"Water", dates:"Oct 23 - Nov 21", emoji:"♏", symbol:"🦂", color:"from-purple-600 to-indigo-600",
    traits:["Intense","Transformative","Mysterious","Passionate"], soulPurpose:"To transform through truth", challenge:"Trust & control" },
  { id:"sagittarius", name:"Sagittarius", element:"Fire", dates:"Nov 22 - Dec 21", emoji:"♐", symbol:"🏹", color:"from-blue-500 to-purple-500",
    traits:["Adventurous","Philosophical","Optimistic","Free"], soulPurpose:"To explore & teach", challenge:"Depth over endless seeking" },
  { id:"capricorn", name:"Capricorn", element:"Earth", dates:"Dec 22 - Jan 19", emoji:"♑", symbol:"🐐", color:"from-gray-600 to-slate-600",
    traits:["Ambitious","Disciplined","Responsible","Patient"], soulPurpose:"To build & master", challenge:"Work–joy balance" },
  { id:"aquarius", name:"Aquarius", element:"Air", dates:"Jan 20 - Feb 18", emoji:"♒", symbol:"🏺", color:"from-cyan-500 to-blue-500",
    traits:["Innovative","Independent","Humanitarian","Eccentric"], soulPurpose:"To innovate for all", challenge:"Head–heart bridge" },
  { id:"pisces", name:"Pisces", element:"Water", dates:"Feb 19 - Mar 20", emoji:"♓", symbol:"🐟", color:"from-indigo-500 to-purple-500",
    traits:["Compassionate","Intuitive","Artistic","Spiritual"], soulPurpose:"To heal through spirit", challenge:"Boundaries & grounding" },
] as const;

type BirthData = { date: string; time?: string; location?: string; name?: string; lat: number|null; lng: number|null; };

/** ---------- component ---------- */
export default function SoulMapExplorerPage() {
  const { toast } = useToast();

  const [currentView, setCurrentView] = useState<"welcome" | "chart" | "chat">("chart");
  const [zenMode, setZenMode] = useState(false);
  const [zenBackground, setZenBackground] = useState<"sunset" | "ocean" | "forest" | "cosmic">("sunset");

  const [birthData, setBirthData] = useState<BirthData>(() => {
    try { return JSON.parse(localStorage.getItem("lightprompt-birth-data") || "null") ?? {
      date: "1992-02-17", time: "", location: "Temple, TX, USA", name: "", lat: 31.0982, lng: -97.3428
    }; } catch { return { date: "1992-02-17", time: "", location: "Temple, TX, USA", name: "", lat: 31.0982, lng: -97.3428 }; }
  });

  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ name: string; lat: number; lng: number; country?: string }>>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [astronomicalData, setAstronomicalData] = useState<any>(null);

  // chat state
  const CHAT_KEY = "soulmap-chat";
  const [chatMessages, setChatMessages] = useState<Array<{role:"user"|"assistant"; content:string}>>(() => {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY) || "null") ?? [
      { role: "assistant", content: "Welcome to your Soul Map. Ask about any planet, sign, or life theme and I’ll ground it in your chart." }
    ]; } catch { return [{ role: "assistant", content: "Welcome to your Soul Map. Ask about any planet, sign, or life theme and I’ll ground it in your chart." }]; }
  });
  const [currentMessage, setCurrentMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  /** ---------- effects ---------- */
  useEffect(() => { localStorage.setItem("lightprompt-birth-data", JSON.stringify(birthData)); }, [birthData]);
  useEffect(() => { localStorage.setItem(CHAT_KEY, JSON.stringify(chatMessages)); }, [chatMessages]);

  useEffect(() => {
    let ignore = false;
    if (!birthData.date || birthData.lat == null || birthData.lng == null) return;

    (async () => {
      try {
        const resp = await apiRequest("POST", "/api/astrology/chart", { birthData });
        const json = await resp.json();
        if (ignore) return;
        setChartData(json.chart ?? json);
        if (!selectedPlanet && json?.chart?.sun?.sign) setSelectedPlanet(json.chart.sun.sign);
      } catch {
        // soft-fail; we’ll still allow chat + sign basics
        if (!selectedPlanet) setSelectedPlanet(guessSun(birthData.date));
      }
    })();

    return () => { ignore = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthData.date, birthData.lat, birthData.lng]);

  useEffect(() => {
    let stop = false;
    const load = async () => {
      try {
        const resp = await apiRequest("GET", "/api/astro/now");
        const json = await resp.json();
        if (!stop) setAstronomicalData(json);
      } catch { /* ignore */ }
    };
    load();
    const id = setInterval(load, 30 * 60 * 1000);
    return () => { stop = true; clearInterval(id); };
  }, []);

  /** ---------- geocoding (Open-Meteo, no key) ---------- */
  const doSearch = useMemo(() => debounce(async (q: string) => {
    if (q.trim().length < 2) { setLocationSuggestions([]); setShowLocationDropdown(false); return; }
    try {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`);
      const j = await r.json();
      const items = (j?.results ?? []).map((it: any) => ({
        name: `${it.name}${it.admin1 ? ", " + it.admin1 : ""}${it.country ? ", " + it.country : ""}`,
        lat: it.latitude, lng: it.longitude, country: it.country
      }));
      setLocationSuggestions(items);
      setShowLocationDropdown(items.length > 0);
    } catch {
      setLocationSuggestions([]); setShowLocationDropdown(false);
    }
  }, 300), []);
  const handleLocationChange = (value: string) => {
    setBirthData((p) => ({ ...p, location: value }));
    doSearch(value);
  };
  const selectLocation = (loc: {name:string; lat:number; lng:number}) => {
    setBirthData((p) => ({ ...p, location: loc.name, lat: loc.lat, lng: loc.lng }));
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
  };

  /** ---------- helpers ---------- */
  function guessSun(birthDate: string): string {
    const d = new Date(birthDate), m = d.getMonth()+1, day = d.getDate();
    if ((m===3&&day>=21)||(m===4&&day<=19)) return "aries";
    if ((m===4&&day>=20)||(m===5&&day<=20)) return "taurus";
    if ((m===5&&day>=21)||(m===6&&day<=20)) return "gemini";
    if ((m===6&&day>=21)||(m===7&&day<=22)) return "cancer";
    if ((m===7&&day>=23)||(m===8&&day<=22)) return "leo";
    if ((m===8&&day>=23)||(m===9&&day<=22)) return "virgo";
    if ((m===9&&day>=23)||(m===10&&day<=22)) return "libra";
    if ((m===10&&day>=23)||(m===11&&day<=21)) return "scorpio";
    if ((m===11&&day>=22)||(m===12&&day<=21)) return "sagittarius";
    if ((m===12&&day>=22)||(m===1&&day<=19)) return "capricorn";
    if ((m===1&&day>=20)||(m===2&&day<=18)) return "aquarius";
    if ((m===2&&day>=19)||(m===3&&day<=20)) return "pisces";
    return "aquarius";
  }

  const chartContext = useMemo(() => {
    if (!chartData) return null;
    // keep it lightweight for chat
    const pick = (o: any, keys: string[]) => Object.fromEntries(keys.filter(k => o?.[k] != null).map(k => [k, o[k]]));
    return {
      sun: pick(chartData.sun || {}, ["sign","degree","house"]),
      moon: pick(chartData.moon || {}, ["sign","degree","house"]),
      rising: pick(chartData.rising || {}, ["sign","degree"]),
      aspects: (chartData.aspects || []).slice(0, 12),
    };
  }, [chartData]);

  /** ---------- chat ---------- */
  const sendToBot = async (text: string) => {
    if (!text.trim()) return;
    setChatMessages((prev) => [...prev, { role: "user", content: text }]);
    setCurrentMessage("");
    setIsGenerating(true);
    try {
      // prefer unified chat endpoint with botId; gracefully fall back to oracle route
      let resp = await apiRequest("POST", "/api/chat", {
        botId: SOULMAP_BOT_ID,
        messages: [{ role: "user", content: text }],
        context: {
          intent: "soul_map_exploration",
          birthData,
          selected: selectedPlanet,
          chart: chartContext,
          astroNow: astronomicalData
        }
      });
      if (!resp.ok) {
        resp = await apiRequest("POST", "/api/chat/oracle", {
          message: text,
          context: "soul_map_exploration",
          birthData,
          selectedPlanet,
          chart: chartContext,
          astroNow: astronomicalData
        });

      }
      const data = await resp.json();
      const reply = data?.response ?? data?.message ?? "I’m here. Could you try that once more?";
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      toast({ title: "Oracle unavailable", description: "Please try again soon.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  /** ---------- UI helpers ---------- */
  const getZenBackgroundStyle = () => {
    const base = "transition-all duration-1000 ease-in-out";
    const bg = {
      sunset: "bg-gradient-to-br from-orange-300 via-pink-300 to-purple-400",
      ocean: "bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400",
      forest: "bg-gradient-to-br from-green-400 via-emerald-300 to-teal-400",
      cosmic: "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600",
    }[zenBackground];
    return zenMode ? `${base} ${bg} min-h-screen` : base;
  };

  /** ---------- VIEWS ---------- */
  if (currentView === "chart") {
    const sunSignId = chartData?.sun?.sign ?? guessSun(birthData.date);
    const sunSign = ZODIAC_SIGNS.find(s => s.id === sunSignId);
    const quickIntents = [
      `What does the current ${getCurrentMoonPhase()} mean for my chart?`,
      `How does my Sun in ${sunSign?.name ?? "…"} shape purpose & personality?`,
      `Which careers align with my chart’s strengths?`,
      `What transits matter for the next 2 weeks?`,
    ];

    return (
      <div className={getZenBackgroundStyle()}>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`text-3xl font-bold ${zenMode ? "text-white" : ""}`}>Your Soul Map</h1>
              <p className={`${zenMode ? "text-white/80" : "text-muted-foreground"}`}>Click any planet/sign to explore deeper. Ask the Oracle anytime.</p>
            </div>
            <div className="flex gap-2">
              <Button variant={zenMode ? "secondary" : "outline"} size="sm" onClick={() => setZenMode(!zenMode)}
                className={zenMode ? "bg-white/20 text-white hover:bg-white/30 border-white/30" : ""}>
                {zenMode ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
                {zenMode ? "Exit Zen" : "Zen Mode"}
              </Button>
              {zenMode && (
                <Select value={zenBackground} onValueChange={(v: any) => setZenBackground(v)}>
                  <SelectTrigger className="w-40 bg-white/20 text-white border-white/30">
                    <Palette className="w-4 h-4 mr-2" /><SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunset"><div className="flex items-center gap-2"><Sunset className="w-4 h-4" />Sunset</div></SelectItem>
                    <SelectItem value="ocean"><div className="flex items-center gap-2"><Waves className="w-4 h-4" />Ocean</div></SelectItem>
                    <SelectItem value="forest"><div className="flex items-center gap-2"><Mountain className="w-4 h-4" />Forest</div></SelectItem>
                    <SelectItem value="cosmic"><div className="flex items-center gap-2"><Stars className="w-4 h-4" />Cosmic</div></SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button variant="outline" onClick={() => setCurrentView("chat")}><MessageCircle className="w-4 h-4 mr-2" />Ask Oracle</Button>
              <Button variant="outline" onClick={() => setCurrentView("welcome")}
                className={zenMode ? "bg-white/20 text-white border-white/30 hover:bg-white/30" : ""}>
                <RotateCcw className="w-4 h-4 mr-2" />Edit Birth Data
              </Button>
            </div>
          </div>

          {/* Interactive chart */}
          <InteractiveNatalChart
            birthData={birthData}
            onPlanetClick={(planet, sign) => {
              setSelectedPlanet(sign);
              setCurrentMessage(`Explain ${planet} in ${sign} in my chart. What strengths, blind spots, and timing cues should I know?`);
              setCurrentView("chat");
            }}
          />

          {/* Sun sign summary */}
          {sunSign && (
            <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-sm mt-8">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{sunSign.symbol}</div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {sunSign.name} Soul Summary
                        <Badge className={`bg-gradient-to-r ${sunSign.color} text-white text-sm px-3 py-1`}>{sunSign.element} Sign</Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600">{sunSign.dates} • Your Cosmic Blueprint</p>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-wrap gap-1">
                    {sunSign.traits.slice(0, 4).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2"><Target className="w-4 h-4 text-blue-500" />Soul Purpose</h4>
                    <p className="text-sm text-gray-600">{sunSign.soulPurpose}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" />Growth Challenge</h4>
                    <p className="text-sm text-gray-600">{sunSign.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2"><Bot className="w-4 h-4 text-purple-500" />Oracle Shortcuts</h4>
                    <div className="space-y-2">
                      {quickIntents.map((q) => (
                        <Button key={q} variant="outline" size="sm" className="w-full justify-start text-xs"
                          onClick={() => { setCurrentMessage(q); setCurrentView("chat"); }}>
                          <MessageCircle className="w-3 h-3 mr-2" />{q}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Real-time cosmic weather */}
          <div className={`mt-8 ${zenMode ? "bg-white/10 backdrop-blur-md border-white/20" : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"} rounded-xl border p-6`}>
            <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${zenMode ? "text-white" : "text-gray-900"}`}>
              <Zap className="h-5 w-5 text-indigo-600" />Current Cosmic Weather
            </h3>

            <div className={`mb-6 p-4 rounded-lg ${zenMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} border`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{astronomicalData?.moon?.emoji ?? "🌙"}</span>
                  <span className={`font-medium ${zenMode ? "text-white" : "text-gray-800"}`}>
                    {astronomicalData?.moon?.phaseName ?? "Loading…"}
                  </span>
                </div>
                <span className={`text-sm ${zenMode ? "text-white/70" : "text-gray-600"}`}>
                  {astronomicalData?.moon ? `${Math.round(astronomicalData.moon.illumination * 100)}% illuminated` : "—"}
                </span>
              </div>
              <div className={`${zenMode ? "bg-white/20" : "bg-gray-200"} rounded-full h-2`}>
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: astronomicalData?.moon ? `${Math.round(astronomicalData.moon.illumination * 100)}%` : "50%" }} />
              </div>
              {astronomicalData?.moon && (
                <div className={`mt-2 text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>
                  Moon in {astronomicalData.moon.signName} at {astronomicalData.moon.degree}°
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200/50">
              <p className={`text-sm ${zenMode ? "text-white/70" : "text-gray-600"}`}>
                {astronomicalData ? `Live astronomical data • Updated ${new Date().toLocaleTimeString()}` : "Loading real-time cosmic data…"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "welcome") {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
            <Compass className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light">Soul Map Navigator</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover your cosmic blueprint. The bot weaves live sky + your chart into practical guidance.
          </p>
          <Badge className="bg-gradient-to-r from-purple-500 to-teal-500 text-white">Interactive Astrology Explorer</Badge>
        </div>

        <Card className="max-w-md mx-auto text-left">
          <CardHeader><CardTitle className="flex items-center gap-2 justify-center"><Stars className="w-5 h-5" />Enter Your Cosmic Coordinates</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input type="date" value={birthData.date} onChange={(e)=>setBirthData(p=>({...p, date:e.target.value}))} />
            <Input type="time" value={birthData.time} onChange={(e)=>setBirthData(p=>({...p, time:e.target.value}))} />
            <div className="relative">
              <Input
                placeholder="Birth Location (City, Country)"
                value={birthData.location || ""}
                onChange={(e)=>handleLocationChange(e.target.value)}
                onFocus={()=>{ if ((birthData.location||"").length>=3) doSearch(birthData.location!); }}
                onBlur={()=>setTimeout(()=>setShowLocationDropdown(false), 200)}
              />
              {showLocationDropdown && locationSuggestions.length>0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {locationSuggestions.map((loc, i)=>(
                    <button key={i} className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                            onClick={()=>selectLocation(loc)}>
                      <div className="font-medium">{loc.name}</div>
                      {loc.country && <div className="text-xs text-gray-500">{loc.country}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={()=>setCurrentView("chart")}
              className="w-full bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600" disabled={!birthData.date}>
              <Wand2 className="w-4 h-4 mr-2" />Explore My Soul Map
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === "chat") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Bot className="w-8 h-8 text-purple-500" />Soul Map Oracle</h1>
            <p className="text-muted-foreground">Your questions → chart-aware replies from the SoulMap bot.</p>
          </div>
          <Button variant="outline" onClick={()=>setCurrentView("chart")}><ArrowRight className="w-4 h-4 mr-2" />Back to Chart</Button>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 p-6 overflow-auto space-y-4">
            {chatMessages.map((m, i)=>(
              <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${m.role==="user"?"bg-purple-500 text-white ml-4":"bg-gray-100 dark:bg-gray-800 mr-4"}`}>
                  <div className="flex items-start gap-2">
                    {m.role==="assistant"? <Bot className="w-4 h-4 text-purple-500 mt-0.5" /> : <User className="w-4 h-4 text-purple-100 mt-0.5" />}
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mr-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-500 animate-pulse" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0.1s"}} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0.2s"}} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about your Sun, Moon, Rising, relationships, career, timing…"
                value={currentMessage}
                onChange={(e)=>setCurrentMessage(e.target.value)}
                onKeyDown={(e)=>{ if (e.key==="Enter") sendToBot(currentMessage); }}
                className="flex-1"
              />
              <Button onClick={()=>sendToBot(currentMessage)} disabled={!currentMessage.trim()||isGenerating}><Send className="w-4 h-4" /></Button>
            </div>
            {/* quick chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "What are my next 30 days of transits?",
                `How does my ${selectedPlanet ?? "Sun"} placement show up in relationships?`,
                "What rituals suit this moon phase?",
              ].map((q)=>(
                <Button key={q} size="sm" variant="outline" className="h-7 text-xs" onClick={()=>sendToBot(q)}>{q}</Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
