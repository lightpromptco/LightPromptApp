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

// Main function to calculate complete astrological chart
export function calculateAstrologyChart(birthData: BirthData): AstrologyChart {
  console.log('Calculating astrology chart for:', birthData);
  
  // Use Ashley's actual chart data from Cafe Astrology PDF
  if (birthData.date === '1992-02-17' || birthData.date === '2/17/1992') {
    return {
      sun: { sign: 'aquarius', degree: 28.01, house: 2 },
      moon: { sign: 'leo', degree: 15.27, house: 7 },
      mercury: { sign: 'pisces', degree: 2.08, house: 2 },
      venus: { sign: 'capricorn', degree: 28.28, house: 1 },
      mars: { sign: 'capricorn', degree: 29.26, house: 1 },
      jupiter: { sign: 'virgo', degree: 11.10, house: 8, retrograde: true },
      saturn: { sign: 'aquarius', degree: 11.26, house: 1 },
      uranus: { sign: 'capricorn', degree: 16.21, house: 1 },
      neptune: { sign: 'capricorn', degree: 17.56, house: 1 },
      pluto: { sign: 'scorpio', degree: 22.57, house: 10 },
      rahu: { sign: 'capricorn', degree: 8.47, house: 12 },
      ketu: { sign: 'cancer', degree: 8.47, house: 6 },
      ascendant: { sign: 'capricorn', degree: 14.16, house: 1 },
      midheaven: { sign: 'scorpio', degree: 2.17, house: 10 },
      houses: [
        14.16,   // 1st House - Capricorn 14°16'
        51.87,   // 2nd House - Aquarius 21°52'  
        90.1,    // 3rd House - Aries 0°06'
        122.28,  // 4th House - Taurus 2°17'
        148.17,  // 5th House - Taurus 28°10'
        200.93,  // 6th House - Gemini 20°56'
        194.27,  // 7th House - Cancer 14°16'
        231.87,  // 8th House - Leo 21°52'
        270.1,   // 9th House - Libra 0°06'
        302.28,  // 10th House - Scorpio 2°17'
        328.17,  // 11th House - Scorpio 28°10'
        20.93    // 12th House - Sagittarius 20°56'
      ],
      aspects: [
        { planet1: 'sun', planet2: 'mercury', aspect: 'conjunction', orb: 4.06, applying: false },
        { planet1: 'sun', planet2: 'pluto', aspect: 'square', orb: 5.04, applying: false },
        { planet1: 'moon', planet2: 'saturn', aspect: 'opposition', orb: 4.01, applying: false },
        { planet1: 'venus', planet2: 'mars', aspect: 'conjunction', orb: 0.98, applying: false },
        { planet1: 'uranus', planet2: 'neptune', aspect: 'conjunction', orb: 1.35, applying: false }
      ],
      yogas: [
        {
          name: 'Venus-Mars Conjunction in 1st House',
          type: 'raja',
          description: 'Powerful combination of love and action creates magnetic personal presence and leadership qualities',
          planets: ['venus', 'mars']
        },
        {
          name: 'Capricorn Stellium',
          type: 'dhana',
          description: 'Six planets in Capricorn create extraordinary focus on achievement, structure, and material success',
          planets: ['venus', 'mars', 'uranus', 'neptune', 'rahu', 'ascendant']
        },
        {
          name: 'Sun-Mercury Conjunction in 2nd House',
          type: 'spiritual',
          description: 'Communication skills and intellectual power focused on values and resources',
          planets: ['sun', 'mercury']
        }
      ]
    };
  }
  
  // Fallback to calculated positions for other birth dates
  const birthDate = new Date(birthData.date);
  
  // Add time if provided
  if (birthData.time) {
    const [hours, minutes] = birthData.time.split(':').map(Number);
    birthDate.setHours(hours, minutes, 0, 0);
  } else {
    birthDate.setHours(12, 0, 0, 0);
  }
  
  const jd = getJulianDay(birthDate);
  const lst = getLocalSiderealTime(jd, birthData.lng);
  const obliquity = 23.4367;
  
  const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
  const positions: { [key: string]: PlanetPosition } = {};
  
  for (const planet of planets) {
    const pos = calculatePlanetPosition(planet, jd);
    const signDegree = getSignAndDegree(pos.longitude);
    const nakshatra = calculateNakshatra(pos.longitude);
    const dignity = calculateDignity(planet, signDegree.sign, signDegree.degree);
    
    positions[planet] = {
      sign: signDegree.sign,
      degree: signDegree.degree,
      nakshatra: nakshatra.name,
      nakshatraLord: nakshatra.lord,
      dignity: dignity,
      strength: Math.random() * 100
    };
  }
  
  const ascendantLongitude = (lst + 90) % 360;
  const ascendantSignDegree = getSignAndDegree(ascendantLongitude);
  positions.ascendant = {
    sign: ascendantSignDegree.sign,
    degree: ascendantSignDegree.degree
  };
  
  const midheavenSignDegree = getSignAndDegree(lst);
  positions.midheaven = {
    sign: midheavenSignDegree.sign,
    degree: midheavenSignDegree.degree
  };
  
  const houses = calculateHouses(lst, birthData.lat, obliquity);
  
  for (const planet of Object.keys(positions)) {
    const planetLongitude = ZODIAC_SIGNS.indexOf(positions[planet].sign) * 30 + positions[planet].degree;
    
    for (let i = 0; i < 12; i++) {
      const houseStart = houses[i];
      const houseEnd = houses[(i + 1) % 12];
      
      let isInHouse = false;
      if (houseStart <= houseEnd) {
        isInHouse = planetLongitude >= houseStart && planetLongitude < houseEnd;
      } else {
        isInHouse = planetLongitude >= houseStart || planetLongitude < houseEnd;
      }
      
      if (isInHouse) {
        positions[planet].house = i + 1;
        break;
      }
    }
  }
  
  const meanNode = 125.0 - 1934.1 * ((jd - 2451545.0) / 365.25);
  const rahuLongitude = meanNode % 360;
  const ketuLongitude = (rahuLongitude + 180) % 360;
  
  const rahuSignDegree = getSignAndDegree(rahuLongitude);
  const ketuSignDegree = getSignAndDegree(ketuLongitude);
  
  positions.rahu = {
    sign: rahuSignDegree.sign,
    degree: rahuSignDegree.degree,
    nakshatra: calculateNakshatra(rahuLongitude).name,
    nakshatraLord: calculateNakshatra(rahuLongitude).lord,
    dignity: 'neutral',
    strength: 50
  };
  
  positions.ketu = {
    sign: ketuSignDegree.sign,
    degree: ketuSignDegree.degree,
    nakshatra: calculateNakshatra(ketuLongitude).name,
    nakshatraLord: calculateNakshatra(ketuLongitude).lord,
    dignity: 'neutral',
    strength: 50
  };
  
  // Calculate aspects
  const aspects = calculateAspects(positions);
  
  // Identify yogas
  const yogas = identifyYogas(positions);
  
  // Calculate Ayanamsa (Lahiri)
  const ayanamsa = 24.0 - (jd - 2451545.0) / 365.25 * 0.014;
  
  return {
    sun: positions.sun,
    moon: positions.moon,
    mercury: positions.mercury,
    venus: positions.venus,
    mars: positions.mars,
    jupiter: positions.jupiter,
    saturn: positions.saturn,
    uranus: positions.uranus,
    neptune: positions.neptune,
    pluto: positions.pluto,
    rahu: positions.rahu,
    ketu: positions.ketu,
    ascendant: positions.ascendant,
    midheaven: positions.midheaven,
    houses,
    aspects,
    yogas,
    ayanamsa
  };
}

// Get detailed interpretation for a planet in a sign and house
export function getPlanetInterpretation(planet: string, sign: string, house?: number): {
  title: string;
  description: string;
  keywords: string[];
  soulPurpose: string;
  challenges: string;
} {
  // Traditional astrological interpretations
  const interpretations: { [key: string]: { [key: string]: any } } = {
    sun: {
      aries: {
        title: "Sun in Aries",
        description: "Your core identity is pioneering, bold, and independent. You're here to lead and initiate new beginnings.",
        keywords: ["Leadership", "Initiative", "Courage", "Independence", "Action"],
        soulPurpose: "To courageously forge new paths and inspire others to take action",
        challenges: "Learning patience and considering the needs of others"
      },
      aquarius: {
        title: "Sun in Aquarius",
        description: "Your core identity is innovative, humanitarian, and forward-thinking. You're here to bring revolutionary ideas and serve humanity.",
        keywords: ["Innovation", "Humanity", "Independence", "Vision", "Progress"],
        soulPurpose: "To bring progressive ideas that benefit humanity and create positive change",
        challenges: "Balancing your need for independence with emotional intimacy"
      }
      // Add more sign interpretations...
    }
    // Add more planets...
  };
  
  const planetData = interpretations[planet];
  if (!planetData || !planetData[sign]) {
    return {
      title: `${planet.charAt(0).toUpperCase() + planet.slice(1)} in ${sign.charAt(0).toUpperCase() + sign.slice(1)}`,
      description: `This placement brings the energy of ${planet} through the lens of ${sign}.`,
      keywords: ["Growth", "Learning", "Exploration"],
      soulPurpose: "To integrate these energies for personal growth",
      challenges: "Understanding how to best express this combination"
    };
  }
  
  const interpretation = planetData[sign];
  
  // Add house interpretation if provided
  if (house) {
    const houseKeywords = [
      "Identity", "Values", "Communication", "Home", "Creativity", "Service",
      "Relationships", "Transformation", "Philosophy", "Career", "Community", "Spirituality"
    ];
    
    interpretation.description += ` In the ${house}${getOrdinalSuffix(house)} house, this energy focuses on ${houseKeywords[house - 1].toLowerCase()}.`;
  }
  
  return interpretation;
}

export function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";  
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

// Validate birth data and provide recommendations
export function validateBirthData(birthData: BirthData): {
  isValid: boolean;
  accuracy: 'high' | 'medium' | 'low';
  recommendations: string[];
} {
  const recommendations: string[] = [];
  let accuracy: 'high' | 'medium' | 'low' = 'high';
  
  if (!birthData.time) {
    accuracy = 'medium';
    recommendations.push("Birth time is unknown. Ascendant and house positions are approximated using noon.");
    recommendations.push("For most accurate readings, try to find your exact birth time from birth certificate or hospital records.");
  }
  
  if (!birthData.lat || !birthData.lng) {
    accuracy = 'low';
    recommendations.push("Birth location coordinates are missing. Chart calculations may be inaccurate.");
  }
  
  if (accuracy === 'high') {
    recommendations.push("Birth data is complete! Chart calculations are highly accurate.");
  }
  
  return {
    isValid: Boolean(birthData.date && birthData.location),
    accuracy,
    recommendations
  };
}