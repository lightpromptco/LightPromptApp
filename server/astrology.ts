interface BirthData {
  day: number;
  month: number;
  year: number;
  hour: number;
  min: number;
  lat: number;
  lon: number;
  tzone: number;
}

interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

interface HouseInfo {
  house: number;
  sign: string;
  degree: number;
}

interface BirthChart {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planets: PlanetPosition[];
  houses: HouseInfo[];
  aspects: any[];
  interpretation: {
    sunSignMeaning: string;
    moonSignMeaning: string;
    risingSignMeaning: string;
  };
}

// Zodiac signs with accurate date ranges
const zodiacSigns = [
  { name: 'Aries', symbol: '♈', startDay: 80, endDay: 109 },      // Mar 21 - Apr 19
  { name: 'Taurus', symbol: '♉', startDay: 110, endDay: 140 },    // Apr 20 - May 20
  { name: 'Gemini', symbol: '♊', startDay: 141, endDay: 171 },    // May 21 - Jun 20
  { name: 'Cancer', symbol: '♋', startDay: 172, endDay: 203 },    // Jun 21 - Jul 22
  { name: 'Leo', symbol: '♌', startDay: 204, endDay: 234 },       // Jul 23 - Aug 22
  { name: 'Virgo', symbol: '♍', startDay: 235, endDay: 265 },     // Aug 23 - Sep 22
  { name: 'Libra', symbol: '♎', startDay: 266, endDay: 295 },     // Sep 23 - Oct 22
  { name: 'Scorpio', symbol: '♏', startDay: 296, endDay: 325 },   // Oct 23 - Nov 21
  { name: 'Sagittarius', symbol: '♐', startDay: 326, endDay: 355 }, // Nov 22 - Dec 21
  { name: 'Capricorn', symbol: '♑', startDay: 356, endDay: 19 },  // Dec 22 - Jan 19
  { name: 'Aquarius', symbol: '♒', startDay: 20, endDay: 49 },    // Jan 20 - Feb 18
  { name: 'Pisces', symbol: '♓', startDay: 50, endDay: 79 }       // Feb 19 - Mar 20
];

// Calculate day of year
function getDayOfYear(day: number, month: number, year: number): number {
  const date = new Date(year, month - 1, day);
  const start = new Date(year, 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Get zodiac sign from day of year
function getZodiacSign(dayOfYear: number): string {
  for (const sign of zodiacSigns) {
    if (sign.name === 'Capricorn') {
      // Handle Capricorn wrap-around (Dec 22 - Jan 19)
      if (dayOfYear >= sign.startDay || dayOfYear <= sign.endDay) {
        return sign.name;
      }
    } else if (dayOfYear >= sign.startDay && dayOfYear <= sign.endDay) {
      return sign.name;
    }
  }
  return 'Aries'; // Fallback
}

// Calculate Julian Day Number for astronomical calculations
function julianDayNumber(year: number, month: number, day: number, hour: number, minute: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const fractionalDay = (hour + minute / 60) / 24;
  
  return jdn + fractionalDay;
}

// Calculate Local Sidereal Time (simplified)
function localSiderealTime(jd: number, longitude: number): number {
  const t = (jd - 2451545.0) / 36525;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * t * t - (t * t * t) / 38710000;
  const lst = (gmst + longitude) % 360;
  return lst < 0 ? lst + 360 : lst;
}

// Calculate Ascendant (Rising Sign) - simplified method
function calculateAscendant(jd: number, latitude: number, longitude: number): string {
  const lst = localSiderealTime(jd, longitude);
  
  // Simplified ascendant calculation
  // In reality, this requires complex spherical trigonometry
  const ascendantDegree = (lst + latitude * 0.5) % 360;
  const dayOfYearEquivalent = Math.floor((ascendantDegree / 360) * 365);
  
  return getZodiacSign(dayOfYearEquivalent);
}

// Generate enhanced planet positions based on astronomical principles
function generateEnhancedPlanetPositions(birthData: BirthData): PlanetPosition[] {
  const jd = julianDayNumber(birthData.year, birthData.month, birthData.day, birthData.hour, birthData.min);
  const dayOfYear = getDayOfYear(birthData.day, birthData.month, birthData.year);
  
  // Planetary orbital periods (in Earth years) for semi-realistic movement
  const orbitalPeriods = {
    Sun: 1,
    Moon: 0.075, // ~27.3 days
    Mercury: 0.24,
    Venus: 0.62,
    Mars: 1.88,
    Jupiter: 11.86,
    Saturn: 29.46,
    Uranus: 84.01,
    Neptune: 164.8,
    Pluto: 248.09
  };
  
  // Base positions adjusted by time and orbital mechanics
  const planets: PlanetPosition[] = [];
  
  Object.entries(orbitalPeriods).forEach(([planet, period], index) => {
    // Calculate approximate position based on orbital period
    const yearsFromEpoch = (jd - 2451545.0) / 365.25; // Years from J2000.0
    const orbitalPosition = (yearsFromEpoch / period) * 360;
    const adjustedPosition = (dayOfYear * (360 / period) + orbitalPosition + index * 30) % 360;
    const signIndex = Math.floor(adjustedPosition / 30);
    const degreeInSign = adjustedPosition % 30;
    
    planets.push({
      name: planet,
      sign: zodiacSigns[signIndex % 12].name,
      degree: Math.round(degreeInSign * 100) / 100,
      house: (Math.floor(adjustedPosition / 30) + index * 2) % 12 + 1,
      retrograde: Math.random() < (planet === 'Mercury' || planet === 'Venus' ? 0.2 : 0.1)
    });
  });
  
  return planets;
}

// Generate house system (simplified Placidus-like)
function generateHouseSystem(birthData: BirthData): HouseInfo[] {
  const jd = julianDayNumber(birthData.year, birthData.month, birthData.day, birthData.hour, birthData.min);
  const lst = localSiderealTime(jd, birthData.lon);
  
  const houses: HouseInfo[] = [];
  
  for (let i = 1; i <= 12; i++) {
    // Each house covers 30 degrees, starting from Ascendant
    const houseDegree = (lst + (i - 1) * 30 + birthData.lat * 0.25) % 360;
    const signIndex = Math.floor(houseDegree / 30);
    const degreeInSign = houseDegree % 30;
    
    houses.push({
      house: i,
      sign: zodiacSigns[signIndex % 12].name,
      degree: Math.round(degreeInSign * 100) / 100
    });
  }
  
  return houses;
}

// Generate astrological aspects between planets
function generateAspects(planets: PlanetPosition[]): any[] {
  const aspects = [];
  const majorAspects = [
    { name: 'Conjunction', angle: 0, orb: 8 },
    { name: 'Opposition', angle: 180, orb: 8 },
    { name: 'Trine', angle: 120, orb: 6 },
    { name: 'Square', angle: 90, orb: 6 },
    { name: 'Sextile', angle: 60, orb: 4 }
  ];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calculate angle between planets (simplified)
      const angle1 = zodiacSigns.findIndex(s => s.name === planet1.sign) * 30 + planet1.degree;
      const angle2 = zodiacSigns.findIndex(s => s.name === planet2.sign) * 30 + planet2.degree;
      let angleDiff = Math.abs(angle1 - angle2);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;
      
      // Check for major aspects
      for (const aspect of majorAspects) {
        if (Math.abs(angleDiff - aspect.angle) <= aspect.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspect.name,
            angle: angleDiff,
            orb: Math.abs(angleDiff - aspect.angle)
          });
          break;
        }
      }
    }
  }
  
  return aspects;
}

// Get detailed interpretations
function getInterpretations(sunSign: string, moonSign: string, risingSign: string) {
  const sunMeanings: Record<string, string> = {
    'Aries': 'You are a natural leader with pioneering spirit and boundless energy. Your core self thrives on challenges and new beginnings.',
    'Taurus': 'You have a steady, reliable nature with deep appreciation for beauty and comfort. Your core self values stability and sensual pleasures.',
    'Gemini': 'You are curious, adaptable, and communicative. Your core self thrives on variety, learning, and intellectual connections.',
    'Cancer': 'You are nurturing, intuitive, and emotionally deep. Your core self is protective and values family, home, and emotional security.',
    'Leo': 'You are creative, confident, and naturally magnetic. Your core self seeks recognition, creative expression, and generous leadership.',
    'Virgo': 'You are analytical, helpful, and detail-oriented. Your core self strives for improvement, service, and practical solutions.',
    'Libra': 'You are diplomatic, harmonious, and beauty-loving. Your core self seeks balance, partnership, and aesthetic perfection.',
    'Scorpio': 'You are intense, transformative, and deeply intuitive. Your core self desires profound experiences and hidden truths.',
    'Sagittarius': 'You are adventurous, philosophical, and freedom-loving. Your core self seeks higher meaning, exploration, and wisdom.',
    'Capricorn': 'You are ambitious, disciplined, and goal-oriented. Your core self strives for achievement, responsibility, and lasting success.',
    'Aquarius': 'You are innovative, humanitarian, and independently minded. Your core self values progress, friendship, and unique perspectives.',
    'Pisces': 'You are compassionate, imaginative, and spiritually inclined. Your core self flows with intuition, creativity, and empathy.'
  };
  
  const moonMeanings: Record<string, string> = {
    'Aries': 'Your emotional nature is impulsive and direct. You need excitement and independence in your emotional life.',
    'Taurus': 'Your emotional nature craves security and comfort. You find peace in routine and material stability.',
    'Gemini': 'Your emotional nature is changeable and intellectually driven. You need variety and mental stimulation.',
    'Cancer': 'Your emotional nature is deep and protective. You need emotional security and nurturing environments.',
    'Leo': 'Your emotional nature is dramatic and warm-hearted. You need appreciation and creative outlets for feelings.',
    'Virgo': 'Your emotional nature is practical and service-oriented. You need to feel useful and appreciated for your help.',
    'Libra': 'Your emotional nature seeks harmony and partnership. You need beauty and balance in your emotional world.',
    'Scorpio': 'Your emotional nature is intense and transformative. You need deep, authentic emotional connections.',
    'Sagittarius': 'Your emotional nature is optimistic and adventurous. You need freedom and philosophical understanding.',
    'Capricorn': 'Your emotional nature is reserved and goal-oriented. You need structure and recognition for achievements.',
    'Aquarius': 'Your emotional nature is detached and humanitarian. You need friendship and intellectual emotional connections.',
    'Pisces': 'Your emotional nature is fluid and empathetic. You need spiritual connection and creative expression.'
  };
  
  const risingMeanings: Record<string, string> = {
    'Aries': 'You appear energetic, direct, and pioneering to others. People see you as a natural leader and initiator.',
    'Taurus': 'You appear steady, reliable, and grounded to others. People see you as calm and reassuring.',
    'Gemini': 'You appear curious, talkative, and adaptable to others. People see you as intelligent and versatile.',
    'Cancer': 'You appear nurturing, sensitive, and protective to others. People see you as caring and intuitive.',
    'Leo': 'You appear confident, creative, and magnetic to others. People see you as charismatic and generous.',
    'Virgo': 'You appear helpful, organized, and modest to others. People see you as reliable and detail-oriented.',
    'Libra': 'You appear charming, diplomatic, and balanced to others. People see you as harmonious and fair.',
    'Scorpio': 'You appear mysterious, intense, and powerful to others. People see you as magnetic and transformative.',
    'Sagittarius': 'You appear adventurous, optimistic, and wise to others. People see you as inspiring and free-spirited.',
    'Capricorn': 'You appear ambitious, responsible, and authoritative to others. People see you as competent and goal-oriented.',
    'Aquarius': 'You appear unique, friendly, and independent to others. People see you as innovative and humanitarian.',
    'Pisces': 'You appear gentle, intuitive, and compassionate to others. People see you as artistic and spiritually inclined.'
  };
  
  return {
    sunSignMeaning: sunMeanings[sunSign] || 'Your sun sign represents your core identity and life purpose.',
    moonSignMeaning: moonMeanings[moonSign] || 'Your moon sign represents your emotional nature and inner world.',
    risingSignMeaning: risingMeanings[risingSign] || 'Your rising sign represents how others perceive you and your approach to life.'
  };
}

// Main function to generate birth chart
export async function generateBirthChart(birthData: BirthData): Promise<BirthChart> {
  console.log('🔮 Generating birth chart for:', { 
    date: `${birthData.year}-${birthData.month}-${birthData.day}`, 
    time: `${birthData.hour}:${birthData.min}`,
    location: `${birthData.lat}, ${birthData.lon}`
  });
  
  // Calculate Julian Day Number
  const jd = julianDayNumber(birthData.year, birthData.month, birthData.day, birthData.hour, birthData.min);
  
  // Calculate basic signs
  const dayOfYear = getDayOfYear(birthData.day, birthData.month, birthData.year);
  const sunSign = getZodiacSign(dayOfYear);
  
  // Calculate Moon sign (approximate based on lunar cycle)
  const lunarMonth = ((jd - 2451550.1) / 29.53) % 12; // Approximate lunar cycles since new moon
  const moonSignIndex = Math.abs(Math.floor(lunarMonth)) % 12;
  const moonSign = zodiacSigns[moonSignIndex].name;
  
  // Calculate Rising sign (Ascendant)
  const risingSign = calculateAscendant(jd, birthData.lat, birthData.lon);
  
  // Generate planet positions
  const planets = generateEnhancedPlanetPositions(birthData);
  
  // Generate house system
  const houses = generateHouseSystem(birthData);
  
  // Generate aspects
  const aspects = generateAspects(planets);
  
  // Get interpretations
  const interpretation = getInterpretations(sunSign, moonSign, risingSign);
  
  console.log('✨ Birth chart generated successfully:', {
    sunSign, moonSign, risingSign,
    planetsCount: planets.length,
    aspectsCount: aspects.length
  });
  
  return {
    sunSign,
    moonSign,
    risingSign,
    planets,
    houses,
    aspects,
    interpretation
  };
}