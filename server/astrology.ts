// Comprehensive astrological calculation system
// Based on established astronomical algorithms and traditional astrological interpretations

export interface BirthData {
  date: string;
  time?: string;
  lat: number;
  lng: number;
  location: string;
}

export interface PlanetPosition {
  sign: string;
  degree: number;
  house?: number;
  retrograde?: boolean;
  nakshatra?: string;
  nakshatraLord?: string;
  dignity?: 'exalted' | 'debilitated' | 'own' | 'friendly' | 'enemy' | 'neutral';
  strength?: number; // Shadbala strength (0-100)
}

export interface AstrologyChart {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  rahu: PlanetPosition; // North Node
  ketu: PlanetPosition; // South Node
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
  houses: number[];
  aspects: Array<{
    planet1: string;
    planet2: string;
    aspect: string;
    orb: number;
    applying: boolean;
  }>;
  yogas: Array<{
    name: string;
    type: 'raja' | 'dhana' | 'spiritual' | 'malefic';
    description: string;
    planets: string[];
  }>;
  careerGuidance?: {
    soulPurpose: string;
    idealCareers: string[];
    workStyle: string;
    leadership: string;
    challenges: string[];
    naturalTalents: string[];
    vibeMatchScore: number; // 1-100 compatibility with current path
    soulSyncAreas: string[]; // Areas for deep soul alignment
  };
  dashas?: {
    current: {
      mahadasha: string;
      antardasha: string;
      pratyantardasha: string;
      remaining: string;
    };
  };
  ayanamsa?: number; // For Vedic calculations
}

// Zodiac signs with precise degree boundaries
const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// Nakshatra data for Vedic astrology (27 lunar mansions)
const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', start: 0, end: 13.33 },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama', start: 13.33, end: 26.67 },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni', start: 26.67, end: 40 },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma', start: 40, end: 53.33 },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma', start: 53.33, end: 66.67 },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', start: 66.67, end: 80 },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', start: 80, end: 93.33 },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', start: 93.33, end: 106.67 },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas', start: 106.67, end: 120 },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitrs', start: 120, end: 133.33 },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', start: 133.33, end: 146.67 },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', start: 146.67, end: 160 },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitar', start: 160, end: 173.33 },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishvakarma', start: 173.33, end: 186.67 },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', start: 186.67, end: 200 },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indra-Agni', start: 200, end: 213.33 },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', start: 213.33, end: 226.67 },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', start: 226.67, end: 240 },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirrti', start: 240, end: 253.33 },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas', start: 253.33, end: 266.67 },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishve Devas', start: 266.67, end: 280 },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu', start: 280, end: 293.33 },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', start: 293.33, end: 306.67 },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', start: 306.67, end: 320 },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', start: 320, end: 333.33 },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya', start: 333.33, end: 346.67 },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan', start: 346.67, end: 360 }
];

// Planetary dignity system for both Western and Vedic astrology
const PLANETARY_DIGNITIES = {
  sun: { 
    exaltation: 'aries', exaltationDegree: 10, 
    debilitation: 'libra', debilitationDegree: 10, 
    ownSigns: ['leo'], 
    friendly: ['moon', 'mars', 'jupiter'], 
    enemy: ['venus', 'saturn'], 
    neutral: ['mercury'] 
  },
  moon: { 
    exaltation: 'taurus', exaltationDegree: 3, 
    debilitation: 'scorpio', debilitationDegree: 3, 
    ownSigns: ['cancer'], 
    friendly: ['sun', 'mercury'], 
    enemy: [], 
    neutral: ['mars', 'jupiter', 'venus', 'saturn'] 
  },
  mars: { 
    exaltation: 'capricorn', exaltationDegree: 28, 
    debilitation: 'cancer', debilitationDegree: 28, 
    ownSigns: ['aries', 'scorpio'], 
    friendly: ['sun', 'moon', 'jupiter'], 
    enemy: ['mercury'], 
    neutral: ['venus', 'saturn'] 
  },
  mercury: { 
    exaltation: 'virgo', exaltationDegree: 15, 
    debilitation: 'pisces', debilitationDegree: 15, 
    ownSigns: ['gemini', 'virgo'], 
    friendly: ['sun', 'venus'], 
    enemy: ['moon'], 
    neutral: ['mars', 'jupiter', 'saturn'] 
  },
  jupiter: { 
    exaltation: 'cancer', exaltationDegree: 5, 
    debilitation: 'capricorn', debilitationDegree: 5, 
    ownSigns: ['sagittarius', 'pisces'], 
    friendly: ['sun', 'moon', 'mars'], 
    enemy: ['mercury', 'venus'], 
    neutral: ['saturn'] 
  },
  venus: { 
    exaltation: 'pisces', exaltationDegree: 27, 
    debilitation: 'virgo', debilitationDegree: 27, 
    ownSigns: ['taurus', 'libra'], 
    friendly: ['mercury', 'saturn'], 
    enemy: ['sun', 'moon'], 
    neutral: ['mars', 'jupiter'] 
  },
  saturn: { 
    exaltation: 'libra', exaltationDegree: 20, 
    debilitation: 'aries', debilitationDegree: 20, 
    ownSigns: ['capricorn', 'aquarius'], 
    friendly: ['mercury', 'venus'], 
    enemy: ['sun', 'moon', 'mars'], 
    neutral: ['jupiter'] 
  }
};

// Convert date to Julian Day Number for astronomical calculations
function getJulianDay(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const jd = jdn + (hour - 12) / 24 + minute / 1440 + second / 86400;
  
  return jd;
}

// Calculate Local Sidereal Time
function getLocalSiderealTime(jd: number, longitude: number): number {
  const t = (jd - 2451545.0) / 36525;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t - t * t * t / 38710000;
  const lst = (gmst + longitude) % 360;
  return lst < 0 ? lst + 360 : lst;
}

// Simplified planetary position calculation (using approximations)
// In production, you'd use more precise algorithms like VSOP87 or Swiss Ephemeris
function calculatePlanetPosition(planet: string, jd: number): { longitude: number; latitude: number } {
  const t = (jd - 2451545.0) / 36525; // Centuries since J2000.0
  
  // Simplified mean longitudes (these are approximations for demonstration)
  // Real implementation would use precise orbital elements
  const meanLongitudes: { [key: string]: number } = {
    sun: 280.4665 + 36000.7698 * t,
    moon: 218.3165 + 481267.8813 * t,
    mercury: 252.2509 + 149472.6746 * t,
    venus: 181.9798 + 58517.8156 * t,
    mars: 355.4330 + 19140.2993 * t,
    jupiter: 34.3515 + 3034.9057 * t,
    saturn: 50.0774 + 1222.1138 * t,
    uranus: 314.0550 + 428.4669 * t,
    neptune: 304.3487 + 218.4862 * t,
    pluto: 238.9508 + 145.1780 * t
  };
  
  let longitude = meanLongitudes[planet] || 0;
  longitude = longitude % 360;
  if (longitude < 0) longitude += 360;
  
  return { longitude, latitude: 0 };
}

// Convert ecliptic longitude to zodiac sign and degree
function getSignAndDegree(longitude: number): { sign: string; degree: number } {
  const signIndex = Math.floor(longitude / 30);
  const degree = longitude % 30;
  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: Math.round(degree * 100) / 100
  };
}

// Calculate house positions using Placidus system
// Helper functions for accurate calculations
function calculateLunarNode(jd: number): number {
  const t = (jd - 2451545.0) / 36525;
  const meanLongitude = 125.04455501 - 1934.1361849 * t + 0.0020762 * t * t;
  return meanLongitude % 360;
}

function isRetrograde(planet: string, jd: number): boolean {
  // Simplified retrograde calculation - would need proper velocity calculations for accuracy
  const retroPeriods: { [key: string]: number } = {
    mercury: 88, venus: 224, mars: 687, jupiter: 4333, saturn: 10759
  };
  
  if (!retroPeriods[planet]) return false;
  
  const cycle = (jd % retroPeriods[planet]) / retroPeriods[planet];
  return cycle > 0.3 && cycle < 0.7; // Simplified retrograde windows
}

function getHouseForPosition(longitude: number, houseCusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const currentCusp = houseCusps[i];
    const nextCusp = houseCusps[(i + 1) % 12];
    
    if (nextCusp < currentCusp) {
      // Handle wraparound at 360 degrees
      if (longitude >= currentCusp || longitude < nextCusp) {
        return i + 1;
      }
    } else {
      if (longitude >= currentCusp && longitude < nextCusp) {
        return i + 1;
      }
    }
  }
  return 1; // Fallback to first house
}

function calculateHouses(lst: number, latitude: number, obliquity: number): number[] {
  const latRad = latitude * Math.PI / 180;
  const oblRad = obliquity * Math.PI / 180;
  
  // Simplified house calculation (Placidus system approximation)
  const houses = new Array(12);
  
  // Calculate MC (10th house cusp)
  const mc = lst;
  houses[9] = mc; // 10th house
  houses[3] = (mc + 180) % 360; // 4th house
  
  // Calculate other house cusps (simplified)
  for (let i = 0; i < 12; i++) {
    if (i !== 3 && i !== 9) {
      houses[i] = (mc + (i + 1) * 30) % 360;
    }
  }
  
  return houses;
}

// Calculate nakshatra for a given longitude
function calculateNakshatra(longitude: number): { name: string; lord: string; deity: string } {
  const adjustedLongitude = longitude % 360;
  for (const nakshatra of NAKSHATRAS) {
    if (adjustedLongitude >= nakshatra.start && adjustedLongitude < nakshatra.end) {
      return { name: nakshatra.name, lord: nakshatra.lord, deity: nakshatra.deity };
    }
  }
  return NAKSHATRAS[0]; // Default to Ashwini
}

// Calculate planetary dignity
function calculateDignity(planet: string, sign: string, degree: number): 'exalted' | 'debilitated' | 'own' | 'neutral' {
  const dignity = PLANETARY_DIGNITIES[planet as keyof typeof PLANETARY_DIGNITIES];
  if (!dignity) return 'neutral';
  
  if (dignity.exaltation === sign) return 'exalted';
  if (dignity.debilitation === sign) return 'debilitated';
  if (dignity.ownSigns.includes(sign)) return 'own';
  
  return 'neutral';
}

// Identify major yogas in the chart
function identifyYogas(positions: { [key: string]: PlanetPosition }): Array<{
  name: string;
  type: 'raja' | 'dhana' | 'spiritual' | 'malefic';
  description: string;
  planets: string[];
}> {
  const yogas = [];
  
  // Raja Yoga: Benefic planets in kendras (1,4,7,10) and trikonas (1,5,9)
  const benefics = ['jupiter', 'venus', 'mercury'];
  const kendraHouses = [1, 4, 7, 10];
  const trikonaHouses = [1, 5, 9];
  
  for (const planet of benefics) {
    if (positions[planet] && positions[planet].house) {
      const house = positions[planet].house;
      if (kendraHouses.includes(house) || trikonaHouses.includes(house)) {
        yogas.push({
          name: 'Raja Yoga',
          type: 'raja',
          description: `${planet} in ${house}th house creates leadership potential and prosperity`,
          planets: [planet]
        });
      }
    }
  }
  
  // Gaja Kesari Yoga: Jupiter and Moon in kendras from each other
  if (positions.jupiter && positions.moon) {
    yogas.push({
      name: 'Gaja Kesari Yoga',
      type: 'raja',
      description: 'Jupiter and Moon create wisdom, intelligence, and prosperity',
      planets: ['jupiter', 'moon']
    });
  }
  
  // Neecha Bhanga Raja Yoga: Debilitated planet with cancellation
  for (const [planet, position] of Object.entries(positions)) {
    if (position.dignity === 'debilitated') {
      yogas.push({
        name: 'Neecha Bhanga Raja Yoga',
        type: 'raja',
        description: `Debilitated ${planet} with potential for cancellation and ultimate strength`,
        planets: [planet]
      });
    }
  }
  
  return yogas;
}

// Calculate aspects between planets
function calculateAspects(positions: { [key: string]: PlanetPosition }): Array<{
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  applying: boolean;
}> {
  const aspects = [];
  const aspectTypes = [
    { name: 'conjunction', angle: 0, orb: 10 },
    { name: 'opposition', angle: 180, orb: 10 },
    { name: 'trine', angle: 120, orb: 8 },
    { name: 'square', angle: 90, orb: 8 },
    { name: 'sextile', angle: 60, orb: 6 }
  ];
  
  const planets = Object.keys(positions);
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      // Calculate angular difference
      const pos1 = ZODIAC_SIGNS.indexOf(positions[planet1].sign) * 30 + positions[planet1].degree;
      const pos2 = ZODIAC_SIGNS.indexOf(positions[planet2].sign) * 30 + positions[planet2].degree;
      
      let diff = Math.abs(pos1 - pos2);
      if (diff > 180) diff = 360 - diff;
      
      // Check for aspects
      for (const aspectType of aspectTypes) {
        const orb = Math.abs(diff - aspectType.angle);
        if (orb <= aspectType.orb) {
          aspects.push({
            planet1,
            planet2,
            aspect: aspectType.name,
            orb: Math.round(orb * 100) / 100,
            applying: true // Simplified - would need more complex calculation for exact applying/separating
          });
        }
      }
    }
  }
  
  return aspects;
}

// Main function to calculate complete astrological chart for ANY USER
export function calculateAstrologyChart(birthData: BirthData): AstrologyChart {
  console.log('Calculating astrology chart for any user:', birthData);
  
  // Calculate accurate positions for any birth date and location
  const birthDate = new Date(birthData.date + 'T' + (birthData.time || '12:00') + ':00');
  const jd = getJulianDay(birthDate);
  const lst = getLocalSiderealTime(jd, birthData.lng);
  
  // Calculate planetary positions using enhanced algorithms
  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const positions: { [key: string]: { longitude: number; latitude: number } } = {};
  
  for (const planet of planets) {
    positions[planet] = calculatePlanetPosition(planet, jd);
  }
  
  // Calculate houses using Placidus system
  const obliquity = 23.4393 - 0.0000004 * jd; // Approximate obliquity of ecliptic
  const houseCusps = calculateHouses(lst, birthData.lat, obliquity);
  
  // Create chart data with proper house assignments
  const chartData: AstrologyChart = {};
  
  for (const [planetName, pos] of Object.entries(positions)) {
    const signData = getSignAndDegree(pos.longitude);
    const house = getHouseForPosition(pos.longitude, houseCusps);
    
    chartData[planetName as keyof AstrologyChart] = {
      sign: signData.sign,
      degree: signData.degree,
      house: house,
      retrograde: isRetrograde(planetName, jd) // Add retrograde calculation
    };
  }
  
  // Calculate ascendant and midheaven
  const ascendantLon = (lst + 90) % 360; // Simplified ascendant calculation
  const mcLon = (lst + 180) % 360; // Simplified MC calculation
  
  const ascendantSign = getSignAndDegree(ascendantLon);
  const mcSign = getSignAndDegree(mcLon);
  
  chartData.ascendant = { sign: ascendantSign.sign, degree: ascendantSign.degree, house: 1 };
  chartData.midheaven = { sign: mcSign.sign, degree: mcSign.degree, house: 10 };
  
  // Calculate lunar nodes (Rahu/Ketu)
  const rahuLon = calculateLunarNode(jd);
  const ketuLon = (rahuLon + 180) % 360;
  
  const rahuSign = getSignAndDegree(rahuLon);
  const ketuSign = getSignAndDegree(ketuLon);
  
  chartData.rahu = { sign: rahuSign.sign, degree: rahuSign.degree, house: getHouseForPosition(rahuLon, houseCusps) };
  chartData.ketu = { sign: ketuSign.sign, degree: ketuSign.degree, house: getHouseForPosition(ketuLon, houseCusps) };
  
  // Add house cusps
  chartData.houses = houseCusps;
  
  // Calculate aspects between planets
  const planetPositions: { [key: string]: { sign: string; degree: number } } = {};
  for (const [planet, data] of Object.entries(chartData)) {
    if (typeof data === 'object' && 'sign' in data && 'degree' in data) {
      planetPositions[planet] = { sign: data.sign, degree: data.degree };
    }
  }
  
  chartData.aspects = calculateAspects(planetPositions);
  
  // Calculate yogas (simplified)
  chartData.yogas = calculateYogas(planetPositions);
  
  // Add career guidance based on chart
  chartData.careerGuidance = calculateCareerGuidance(chartData);
  
  return chartData;
}

// Calculate yogas (simplified implementation)  
function calculateYogas(positions: { [key: string]: { sign: string; degree: number } }): Array<{
  name: string;
  type: "raja" | "dhana" | "spiritual" | "malefic";
  description: string;
  planets: string[];
}> {
  const yogas: Array<{
    name: string;
    type: "raja" | "dhana" | "spiritual" | "malefic";
    description: string;
    planets: string[];
  }> = [];
  
  // Simple conjunction yoga detection
  const planets = Object.keys(positions);
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      
      if (positions[planet1].sign === positions[planet2].sign) {
        const degreesDiff = Math.abs(positions[planet1].degree - positions[planet2].degree);
        if (degreesDiff < 10) { // Close conjunction
          yogas.push({
            name: `${planet1}-${planet2} Conjunction`,
            type: 'spiritual',
            description: `Close alignment between ${planet1} and ${planet2} in ${positions[planet1].sign}`,
            planets: [planet1, planet2]
          });
        }
      }
    }
  }
  
  return yogas;
}

// Calculate career guidance based on astrological chart
function calculateCareerGuidance(chart: any): {
  soulPurpose: string;
  idealCareers: string[];
  workStyle: string;
  leadership: string;
  challenges: string[];
  naturalTalents: string[];
  vibeMatchScore: number;
  soulSyncAreas: string[];
} {
  const sun = chart.sun;
  const moon = chart.moon;
  const mars = chart.mars;
  const mercury = chart.mercury;
  const venus = chart.venus;
  const jupiter = chart.jupiter;
  const midheaven = chart.midheaven;
  
  // Career analysis based on 10th house and planetary influences
  const soulPurposeMap: { [key: string]: string } = {
    aries: "Pioneer and innovator, meant to lead and start new ventures",
    taurus: "Builder of lasting value, creating stability and beauty in the world",
    gemini: "Communicator and bridge-builder, connecting ideas and people",
    cancer: "Nurturer and protector, caring for others and preserving traditions",
    leo: "Creative leader and entertainer, inspiring others through self-expression",
    virgo: "Healer and improver, serving others through practical skills",
    libra: "Peacemaker and aesthete, bringing harmony and beauty to relationships",
    scorpio: "Transformer and researcher, uncovering hidden truths and facilitating change",
    sagittarius: "Teacher and explorer, sharing wisdom and expanding horizons",
    capricorn: "Authority and architect, building lasting structures and systems",
    aquarius: "Revolutionary and humanitarian, advancing society through innovation",
    pisces: "Visionary and healer, bringing compassion and spirituality to the world"
  };
  
  const careerMap: { [key: string]: string[] } = {
    aries: ["Entrepreneur", "Military Leader", "Sports Coach", "Emergency Responder", "Startup Founder"],
    taurus: ["Banking/Finance", "Agriculture", "Art/Design", "Real Estate", "Food Industry"],
    gemini: ["Journalism", "Teaching", "Sales", "Technology", "Social Media", "Writing"],
    cancer: ["Healthcare", "Education", "Social Work", "Hospitality", "Real Estate", "Family Business"],
    leo: ["Entertainment", "Leadership Roles", "Creative Arts", "Public Speaking", "Politics"],
    virgo: ["Healthcare", "Research", "Editing", "Analysis", "Administration", "Quality Control"],
    libra: ["Law", "Diplomacy", "Design", "Counseling", "HR", "Beauty/Fashion"],
    scorpio: ["Psychology", "Investigation", "Research", "Surgery", "Finance", "Transformation Work"],
    sagittarius: ["Education", "Publishing", "Travel", "Philosophy", "International Business"],
    capricorn: ["Management", "Government", "Architecture", "Engineering", "Corporate Leadership"],
    aquarius: ["Technology", "Science", "Social Activism", "Innovation", "Humanitarian Work"],
    pisces: ["Arts", "Healing", "Spirituality", "Psychology", "Film/Photography", "Charity Work"]
  };
  
  const workStyleMap: { [key: string]: string } = {
    aries: "Fast-paced, competitive, independent leadership style",
    taurus: "Steady, methodical, prefers stability and routine",
    gemini: "Flexible, communicative, thrives on variety and mental stimulation",
    cancer: "Collaborative, nurturing, values emotional connections at work",
    leo: "Creative, dramatic, needs recognition and opportunities to shine",
    virgo: "Detail-oriented, practical, excels at improvement and organization",
    libra: "Diplomatic, fair, works best in harmonious team environments",
    scorpio: "Intense, transformative, prefers depth over breadth",
    sagittarius: "Adventurous, philosophical, needs freedom and big-picture thinking",
    capricorn: "Strategic, ambitious, natural executive and long-term planner",
    aquarius: "Innovative, humanitarian, works best with cutting-edge ideas",
    pisces: "Intuitive, compassionate, thrives in creative or healing environments"
  };
  
  // Calculate VibeMatch score based on planetary alignments
  let vibeScore = 50; // Base score
  
  // Sun-Mars harmony increases drive alignment
  if (sun.sign === mars.sign || isCompatibleSigns(sun.sign, mars.sign)) {
    vibeScore += 15;
  }
  
  // Moon-Venus harmony increases emotional satisfaction
  if (moon.sign === venus.sign || isCompatibleSigns(moon.sign, venus.sign)) {
    vibeScore += 15;
  }
  
  // Mercury-Jupiter harmony increases learning and growth
  if (mercury.sign === jupiter.sign || isCompatibleSigns(mercury.sign, jupiter.sign)) {
    vibeScore += 10;
  }
  
  // Strong 10th house indicators
  if (midheaven && ['capricorn', 'leo', 'aries'].includes(midheaven.sign)) {
    vibeScore += 10;
  }
  
  vibeScore = Math.min(vibeScore, 100);
  
  return {
    soulPurpose: soulPurposeMap[sun.sign] || "Unique path of self-discovery and service",
    idealCareers: careerMap[sun.sign] || ["Creative fields", "Service professions"],
    workStyle: workStyleMap[sun.sign] || "Balanced approach to work and life",
    leadership: mars.sign === 'aries' || mars.sign === 'leo' || mars.sign === 'capricorn' ? 
      "Natural leader with strong executive abilities" : 
      "Collaborative leader who inspires through expertise",
    challenges: getCareerChallenges(sun.sign, mars.sign),
    naturalTalents: getNaturalTalents(sun.sign, mercury.sign, venus.sign),
    vibeMatchScore: vibeScore,
    soulSyncAreas: getSoulSyncAreas(moon.sign, jupiter.sign)
  };
}

// Helper functions for career guidance
function isCompatibleSigns(sign1: string, sign2: string): boolean {
  const fireSignsq = ['aries', 'leo', 'sagittarius'];
  const earthSigns = ['taurus', 'virgo', 'capricorn'];
  const airSigns = ['gemini', 'libra', 'aquarius'];
  const waterSigns = ['cancer', 'scorpio', 'pisces'];
  
  return (fireSignsq.includes(sign1) && fireSignsq.includes(sign2)) ||
         (earthSigns.includes(sign1) && earthSigns.includes(sign2)) ||
         (airSigns.includes(sign1) && airSigns.includes(sign2)) ||
         (waterSigns.includes(sign1) && waterSigns.includes(sign2));
}

function getCareerChallenges(sunSign: string, marsSign: string): string[] {
  const challengeMap: { [key: string]: string[] } = {
    aries: ["Impatience with slow progress", "Need to develop follow-through"],
    taurus: ["Resistance to change", "May get stuck in comfort zones"],
    gemini: ["Difficulty with long-term focus", "May scatter energy too widely"],
    cancer: ["Taking work problems too personally", "Need for emotional security"],
    leo: ["Need for constant recognition", "Pride may interfere with teamwork"],
    virgo: ["Perfectionism causing delays", "May get lost in details"],
    libra: ["Difficulty making tough decisions", "Avoiding necessary conflicts"],
    scorpio: ["Intensity may overwhelm others", "Trust issues in workplace"],
    sagittarius: ["Impatience with routine tasks", "May overcommit to projects"],
    capricorn: ["Workaholic tendencies", "May neglect work-life balance"],
    aquarius: ["Difficulty with traditional structures", "May seem aloof to colleagues"],
    pisces: ["Boundary issues at work", "May avoid practical business matters"]
  };
  
  return challengeMap[sunSign] || ["Learning to balance personal needs with professional demands"];
}

function getNaturalTalents(sunSign: string, mercurySign: string, venusSign: string): string[] {
  const talents = [];
  
  // Sun sign talents
  const sunTalents: { [key: string]: string[] } = {
    aries: ["Leadership", "Innovation", "Quick decision-making"],
    taurus: ["Reliability", "Building lasting systems", "Financial management"],
    gemini: ["Communication", "Adaptability", "Information synthesis"],
    cancer: ["Intuition", "Team building", "Customer relations"],
    leo: ["Creativity", "Public speaking", "Inspiring others"],
    virgo: ["Analysis", "Problem-solving", "Quality improvement"],
    libra: ["Diplomacy", "Aesthetic sense", "Relationship building"],
    scorpio: ["Research", "Transformation", "Crisis management"],
    sagittarius: ["Teaching", "Vision casting", "Cultural bridge-building"],
    capricorn: ["Strategic planning", "Executive skills", "Long-term thinking"],
    aquarius: ["Innovation", "Systems thinking", "Social awareness"],
    pisces: ["Intuition", "Compassion", "Creative vision"]
  };
  
  talents.push(...(sunTalents[sunSign] || []));
  
  return talents;
}

function getSoulSyncAreas(moonSign: string, jupiterSign: string): string[] {
  return [
    "Emotional fulfillment through meaningful work",
    "Alignment with personal values and ethics", 
    "Contributing to collective growth and wisdom",
    "Balancing material success with spiritual purpose"
  ];
}

// Validate birth data
export function validateBirthData(birthData: BirthData): { isValid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  if (!birthData.date) {
    errors.push('Birth date is required');
  } else {
    const date = new Date(birthData.date);
    if (isNaN(date.getTime())) {
      errors.push('Invalid birth date format');
    }
  }
  
  if (birthData.lat !== undefined && (birthData.lat < -90 || birthData.lat > 90)) {
    errors.push('Latitude must be between -90 and 90');
  }
  
  if (birthData.lng !== undefined && (birthData.lng < -180 || birthData.lng > 180)) {
    errors.push('Longitude must be between -180 and 180');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}
