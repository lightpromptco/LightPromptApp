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
import { useUser } from "@/hooks/use-user"; // Assuming useUser hook provides user data

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
  const { user } = useUser(); // Get user data

  const [currentView, setCurrentView] = useState<"welcome" | "chart" | "chat">("welcome"); // Default to welcome
  const [zenMode, setZenMode] = useState(false);
  const [zenBackground, setZenBackground] = useState<"sunset" | "ocean" | "forest" | "cosmic">("sunset");

  // Initialize birthData with empty values - will be loaded from server or user input
  const [birthData, setBirthData] = useState<BirthData>({
    date: "", time: "", location: "", name: "", lat: null, lng: null
  });
  const [birthDataLoaded, setBirthDataLoaded] = useState(false);
  const [rememberBirthData, setRememberBirthData] = useState(true);

  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ name: string; lat: number; lng: number; country?: string }>>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [astronomicalData, setAstronomicalData] = useState<any>(null);

  // chat state
  const CHAT_KEY = `soulmap-chat-${user?.id || 'guest'}`;
  const [chatMessages, setChatMessages] = useState<Array<{role:"user"|"assistant"; content:string}>>([
    { role: "assistant", content: "Welcome to your Soul Map. I'm connecting to your cosmic database..." }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Load user's birth data from server
  useEffect(() => {
    const loadBirthData = async () => {
      if (!user?.id) {
        // For guests, try to load from localStorage
        try {
          const localData = localStorage.getItem("lightprompt-birth-data");
          if (localData) {
            const parsed = JSON.parse(localData);
            setBirthData({
              date: parsed.date || "",
              time: parsed.time || "",
              location: parsed.location || "",
              name: parsed.name || "",
              lat: parsed.lat,
              lng: parsed.lng
            });
          }
        } catch (e) {
          console.log('No local birth data found');
        }
        setBirthDataLoaded(true);
        return;
      }

      try {
        const resp = await apiRequest("GET", `/api/users/${user.id}/birth-data`);
        if (resp.ok) {
          const userData = await resp.json();
          setBirthData({
            date: userData.date || "",
            time: userData.time || "",
            location: userData.location || "",
            name: userData.name || "",
            lat: userData.lat,
            lng: userData.lng
          });
          
          // If user has birth data and they've previously viewed the chart, go directly to chart view
          if (userData.date && userData.lat && userData.lng) {
            const hasVisitedChart = localStorage.getItem(`soulmap-visited-${user.id}`);
            if (hasVisitedChart) {
              setCurrentView("chart");
            }
          }
        }
      } catch (e) {
        console.log('No saved birth data found or remember setting disabled');
      } finally {
        setBirthDataLoaded(true);
      }
    };

    loadBirthData();
  }, [user?.id]);

  // Load user's chat history from server
  useEffect(() => {
    if (!user?.id) {
      // If no user, load from local storage for guests
      try {
        const localMessages = localStorage.getItem(CHAT_KEY);
        if (localMessages) {
          setChatMessages(JSON.parse(localMessages));
        } else {
          setChatMessages([
            { role: "assistant", content: "Welcome to your Soul Map. Ask about any planet, sign, or life theme and I'll ground it in your chart." }
          ]);
        }
      } catch {
        setChatMessages([
          { role: "assistant", content: "Welcome to your Soul Map. Ask about any planet, sign, or life theme and I'll ground it in your chart." }
        ]);
      }
      return;
    }

    const loadChatHistory = async () => {
      try {
        const sessionId = localStorage.getItem(`soulmap-session-${user.id}`);
        if (sessionId) {
          const resp = await apiRequest("GET", `/api/sessions/${sessionId}/messages`);
          if (resp.ok) {
            const messages = await resp.json();
            const formattedMessages = messages.map((msg: any) => ({
              role: msg.role,
              content: msg.content
            }));

            if (formattedMessages.length > 0) {
              setChatMessages(formattedMessages);
            } else {
              setChatMessages([
                { role: "assistant", content: `Welcome back to your Soul Map, ${user.name}. I remember our previous conversations and your cosmic journey. How can I guide you today?` }
              ]);
            }
          } else {
             // If session exists but messages fetch failed, fall back to local or default
             setChatMessages(JSON.parse(localStorage.getItem(CHAT_KEY) || JSON.stringify([{ role: "assistant", content: `Welcome to your Soul Map, ${user.name}. I'm your cosmic guide, ready to explore your astrological blueprint and provide personalized insights. What would you like to discover about yourself?` }])));
          }
        } else {
          // No session found, create one and set initial welcome message
          const sessionResp = await apiRequest("POST", "/api/sessions", {
            userId: user.id,
            botId: SOULMAP_BOT_ID,
            title: "Soul Map Exploration"
          });
          const sessionData = await sessionResp.json();
          localStorage.setItem(`soulmap-session-${user.id}`, sessionData.id);
          setChatMessages([
            { role: "assistant", content: `Welcome to your Soul Map, ${user.name}. I'm your cosmic guide, ready to explore your astrological blueprint and provide personalized insights. What would you like to discover about yourself?` }
          ]);
        }
      } catch (e) {
        console.error('Failed to load chat history:', e);
        setChatMessages([
          { role: "assistant", content: "Welcome to your Soul Map. I'm here to guide you through your cosmic journey." }
        ]);
      }
    };

    loadChatHistory();
  }, [user?.id, user?.name]); // Depend on user?.id and user?.name

  /** ---------- birth data save function ---------- */
  const saveBirthData = async (data: BirthData, remember: boolean = true) => {
    if (!user?.id) {
      // For guests, save to localStorage only
      localStorage.setItem("lightprompt-birth-data", JSON.stringify(data));
      return;
    }

    try {
      await apiRequest("POST", `/api/users/${user.id}/birth-data`, {
        date: data.date,
        time: data.time,
        location: data.location,
        lat: data.lat,
        lng: data.lng,
        timezone: "UTC", // You could make this dynamic based on location
        rememberData: remember
      });
      
      if (remember) {
        toast({
          title: "Birth Data Saved",
          description: "Your cosmic coordinates have been securely saved.",
        });
      }
    } catch (e) {
      console.error('Failed to save birth data:', e);
      toast({
        title: "Save Failed",
        description: "Could not save birth data. Please try again.",
        variant: "destructive"
      });
    }
  };

  /** ---------- effects ---------- */
  // Save messages to local storage only if user is not logged in, otherwise rely on server sync
  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem(CHAT_KEY, JSON.stringify(chatMessages));
    }
  }, [chatMessages, user?.id]);


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
      if (user?.id) {
        // Get or create a SoulMap session for logged-in users
        let sessionId = localStorage.getItem(`soulmap-session-${user.id}`);

        if (!sessionId) {
          const sessionResp = await apiRequest("POST", "/api/sessions", {
            userId: user.id,
            botId: SOULMAP_BOT_ID,
            title: "Soul Map Exploration"
          });
          const sessionData = await sessionResp.json();
          sessionId = sessionData.id;
          localStorage.setItem(`soulmap-session-${user.id}`, sessionId);
        }

        // Send message through the main chat endpoint for proper persistence
        const resp = await apiRequest("POST", "/api/chat", {
          userId: user.id,
          sessionId: sessionId!,
          botId: SOULMAP_BOT_ID,
          content: text,
          context: {
            intent: "soul_map_exploration",
            birthData,
            selectedPlanet,
            chartData: chartContext,
            astronomicalData,
            userProfile: user
          }
        });

        if (!resp.ok) {
          throw new Error('Failed to send message');
        }

        const data = await resp.json();
        const reply = data?.message?.content ?? "I'm processing your cosmic inquiry. Please try again.";

        setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);

        // Update local storage with new messages
        const updatedMessages = [...chatMessages,
          { role: "user", content: text },
          { role: "assistant", content: reply }
        ];
        localStorage.setItem(CHAT_KEY, JSON.stringify(updatedMessages));
      } else {
        // For guests, show a message to login
        setChatMessages((prev) => [...prev, { 
          role: "assistant", 
          content: "Please login to access the Soul Map Oracle and save your conversation history across sessions." 
        }]);
      }

    } catch (e) {
      console.error('SoulMap Oracle error:', e);
      toast({
        title: "Oracle Connection Lost",
        description: "Your cosmic guide is temporarily unavailable. Please try again.",
        variant: "destructive"
      });
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
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${zenMode ? "text-white" : ""}`}>Your Soul Map</h1>
              <p className={`${zenMode ? "text-white/80" : "text-muted-foreground"}`}>Click any planet/sign to explore deeper. Ask the Oracle anytime.</p>
            </div>
            <div className="flex flex-wrap gap-2">
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
            birthData={{
              date: birthData.date,
              time: birthData.time,
              location: birthData.location,
              name: birthData.name,
              lat: birthData.lat ?? undefined,
              lng: birthData.lng ?? undefined
            }}
            onPlanetClick={(planet, sign) => {
              setSelectedPlanet(sign);
              setCurrentMessage(`Explain ${planet} in ${sign} in my chart. What strengths, blind spots, and timing cues should I know?`);
              setCurrentView("chat");
            }}
          />

          {/* Sun sign summary */}
          {sunSign && (
            <Card className="bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-sm mt-6 sm:mt-8">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
                        <Button key={q} variant="outline" size="sm" className="w-full justify-start text-xs text-left"
                          onClick={() => { setCurrentMessage(q); setCurrentView("chat"); }}>
                          <MessageCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{q}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Real-time cosmic weather with comprehensive nerd statistics */}
          <div className={`mt-6 sm:mt-8 ${zenMode ? "bg-white/10 backdrop-blur-md border-white/20" : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"} rounded-xl border p-4 sm:p-6`}>
            <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${zenMode ? "text-white" : "text-gray-900"}`}>
              <Zap className="h-5 w-5 text-indigo-600" />Current Cosmic Weather & Astronomical Data
            </h3>

            {/* Moon Phase Section */}
            <div className={`mb-6 p-4 rounded-lg ${zenMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} border`}>
              <div className="flex items-center justify-between mb-3">
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
              <div className={`${zenMode ? "bg-white/20" : "bg-gray-200"} rounded-full h-2 mb-3`}>
                <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: astronomicalData?.moon ? `${Math.round(astronomicalData.moon.illumination * 100)}%` : "50%" }} />
              </div>
              
              {/* Detailed Moon Statistics Grid */}
              {astronomicalData?.moon && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  <div className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                    <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>Zodiac Position</div>
                    <div className={`font-medium ${zenMode ? "text-white" : "text-gray-800"}`}>
                      {astronomicalData.moon.signName} {astronomicalData.moon.degree}°
                    </div>
                  </div>
                  <div className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                    <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>Phase Angle</div>
                    <div className={`font-medium ${zenMode ? "text-white" : "text-gray-800"}`}>
                      {Math.round(astronomicalData.moon.phaseAngle)}°
                    </div>
                  </div>
                  <div className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                    <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>Age (Days)</div>
                    <div className={`font-medium ${zenMode ? "text-white" : "text-gray-800"}`}>
                      {Math.round(astronomicalData.moon.ageInDays ?? 0)}
                    </div>
                  </div>
                  <div className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                    <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>Distance</div>
                    <div className={`font-medium ${zenMode ? "text-white" : "text-gray-800"}`}>
                      {astronomicalData.moon.distanceKm ? `${Math.round(astronomicalData.moon.distanceKm).toLocaleString()} km` : "—"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Planetary Positions Section */}
            {astronomicalData?.planets && (
              <div className={`mb-6 p-4 rounded-lg ${zenMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} border`}>
                <h4 className={`font-medium mb-3 flex items-center gap-2 ${zenMode ? "text-white" : "text-gray-800"}`}>
                  <Stars className="h-4 w-4" />Current Planetary Positions
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(astronomicalData.planets).map(([planet, data]: [string, any]) => (
                    <div key={planet} className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"} mb-1`}>
                        {planet.charAt(0).toUpperCase() + planet.slice(1)}
                      </div>
                      <div className={`font-medium text-sm ${zenMode ? "text-white" : "text-gray-800"}`}>
                        {data?.signName || "—"} {data?.degree ? `${Math.round(data.degree)}°` : ""}
                      </div>
                      {data?.retrograde && (
                        <div className={`text-xs ${zenMode ? "text-orange-300" : "text-orange-600"}`}>℞ Retrograde</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Astronomical Data */}
            {astronomicalData && (
              <div className={`mb-6 p-4 rounded-lg ${zenMode ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} border`}>
                <h4 className={`font-medium mb-3 flex items-center gap-2 ${zenMode ? "text-white" : "text-gray-800"}`}>
                  <Sun className="h-4 w-4" />Solar & Sidereal Data
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {astronomicalData.julianDay && (
                    <div className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>Julian Day</div>
                      <div className={`font-medium text-sm ${zenMode ? "text-white" : "text-gray-800"}`}>
                        {astronomicalData.julianDay.toFixed(1)}
                      </div>
                    </div>
                  )}
                  {astronomicalData.siderealTime && (
                    <div className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>Sidereal Time</div>
                      <div className={`font-medium text-sm ${zenMode ? "text-white" : "text-gray-800"}`}>
                        {astronomicalData.siderealTime}
                      </div>
                    </div>
                  )}
                  {astronomicalData.deltaT && (
                    <div className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>ΔT (seconds)</div>
                      <div className={`font-medium text-sm ${zenMode ? "text-white" : "text-gray-800"}`}>
                        {astronomicalData.deltaT.toFixed(1)}
                      </div>
                    </div>
                  )}
                  {astronomicalData.obliquity && (
                    <div className={`text-center p-2 rounded ${zenMode ? "bg-white/10" : "bg-gray-50"}`}>
                      <div className={`text-xs ${zenMode ? "text-white/60" : "text-gray-500"}`}>Obliquity</div>
                      <div className={`font-medium text-sm ${zenMode ? "text-white" : "text-gray-800"}`}>
                        {astronomicalData.obliquity.toFixed(2)}°
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Coordinates & Timing */}
            <div className={`mb-4 p-3 rounded-lg ${zenMode ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"} border`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 text-xs">
                <div>
                  <span className={`${zenMode ? "text-white/60" : "text-gray-500"}`}>Timestamp:</span>
                  <span className={`ml-1 font-mono ${zenMode ? "text-white" : "text-gray-800"}`}>
                    {astronomicalData?.timestamp ? new Date(astronomicalData.timestamp).toISOString().slice(0, 19) + 'Z' : "—"}
                  </span>
                </div>
                <div>
                  <span className={`${zenMode ? "text-white/60" : "text-gray-500"}`}>Calculation Engine:</span>
                  <span className={`ml-1 ${zenMode ? "text-white" : "text-gray-800"}`}>Swiss Ephemeris</span>
                </div>
                <div>
                  <span className={`${zenMode ? "text-white/60" : "text-gray-500"}`}>Refresh Rate:</span>
                  <span className={`ml-1 ${zenMode ? "text-white" : "text-gray-800"}`}>30 minutes</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200/50">
              <p className={`text-sm ${zenMode ? "text-white/70" : "text-gray-600"}`}>
                {astronomicalData ? `Live astronomical data • Updated ${new Date().toLocaleTimeString()} • Precision: ±0.1°` : "Loading real-time cosmic data…"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "welcome") {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 text-center space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
            <Compass className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light">Soul Map Navigator</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Discover your cosmic blueprint. The bot weaves live sky + your chart into practical guidance.
          </p>
          <Badge className="bg-gradient-to-r from-purple-500 to-teal-500 text-white">Interactive Astrology Explorer</Badge>
        </div>

        <Card className="max-w-md mx-auto text-left mx-4 sm:mx-auto">
          <CardHeader><CardTitle className="flex items-center gap-2 justify-center"><Stars className="w-5 h-5" />Enter Your Cosmic Coordinates</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {!birthDataLoaded ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading your saved birth data...</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Birth Date *</label>
                  <Input type="date" value={birthData.date} onChange={(e)=>setBirthData(p=>({...p, date:e.target.value}))} required />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Birth Time (if known)</label>
                  <Input type="time" value={birthData.time} onChange={(e)=>setBirthData(p=>({...p, time:e.target.value}))} placeholder="Optional - improves accuracy" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Birth Location *</label>
                  <div className="relative">
                    <Input
                      placeholder="e.g., Los Angeles, CA, USA"
                      value={birthData.location || ""}
                      onChange={(e)=>handleLocationChange(e.target.value)}
                      onFocus={()=>{ if ((birthData.location||"").length>=3) doSearch(birthData.location!); }}
                      onBlur={()=>setTimeout(()=>setShowLocationDropdown(false), 200)}
                      required
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
                </div>
                
                {user?.id && (
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="rememberData"
                      checked={rememberBirthData}
                      onChange={(e) => setRememberBirthData(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="rememberData" className="text-sm text-gray-700 cursor-pointer">
                      Remember my birth data securely for future sessions
                    </label>
                  </div>
                )}
                
                <Button onClick={async ()=>{
                  if (!birthData.date || birthData.lat == null || birthData.lng == null) {
                    toast({
                      title: "Missing Information",
                      description: "Please enter your birth date and location.",
                      variant: "destructive"
                    });
                    return;
                  }
                  
                  if (user?.id) {
                    // Save birth data if user wants to remember it
                    await saveBirthData(birthData, rememberBirthData);
                    // Mark that user has visited the chart
                    localStorage.setItem(`soulmap-visited-${user.id}`, "true");
                    setCurrentView("chart");
                  } else {
                    // For guests, just save to localStorage and continue
                    localStorage.setItem("lightprompt-birth-data", JSON.stringify(birthData));
                    toast({
                      title: "Using Guest Mode",
                      description: "Birth data saved locally. Login to sync across devices.",
                    });
                    setCurrentView("chart");
                  }
                }}
                  className="w-full bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600"
                  disabled={!birthData.date || !birthDataLoaded}
                  >
                  <Wand2 className="w-4 h-4 mr-2" />Explore My Soul Map
                </Button>
                
                {!user?.id && (
                  <Button variant="outline" className="w-full" onClick={() => { 
                    window.location.href = "/api/login";
                  }}>
                    Login to Save Your Data
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === "chat") {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2"><Bot className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />Soul Map Oracle</h1>
            <p className="text-muted-foreground">Your questions → chart-aware replies from the SoulMap bot.</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView("chart")}><ArrowRight className="w-4 h-4 mr-2" />Back to Chart</Button>
        </div>

        <Card className="h-[500px] sm:h-[600px] flex flex-col">
          <CardContent className="flex-1 p-3 sm:p-6 overflow-auto space-y-4">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${m.role === "user" ? "bg-purple-500 text-white ml-2 sm:ml-4" : "bg-gray-100 dark:bg-gray-800 mr-2 sm:mr-4"}`}>
                  <div className="flex items-start gap-2">
                    {m.role === "assistant" ? <Bot className="w-4 h-4 text-purple-500 mt-0.5" /> : <User className="w-4 h-4 text-purple-100 mt-0.5" />}
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
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
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendToBot(currentMessage); }}
                className="flex-1"
              />
              <Button onClick={() => sendToBot(currentMessage)} disabled={!currentMessage.trim() || isGenerating || !user?.id}><Send className="w-4 h-4" /></Button>
            </div>
            {/* quick chips */}
            <div className="mt-3 flex flex-wrap gap-1 sm:gap-2">
              {[
                "What are my next 30 days of transits?",
                `How does my ${selectedPlanet ?? "Sun"} placement show up in relationships?`,
                "What rituals suit this moon phase?",
              ].map((q) => (
                <Button key={q} size="sm" variant="outline" className="h-7 text-xs text-left px-2 flex-shrink-0" onClick={() => sendToBot(q)}>
                  <span className="truncate max-w-[120px] sm:max-w-none">{q}</span>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}