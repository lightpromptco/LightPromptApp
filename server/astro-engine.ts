import { 
  Body, 
  EclipticLongitude, 
  Illumination, 
  MoonPhase
} from "astronomy-engine";

const SIGNS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function signFromLongitude(lonDeg: number) {
  const normalizedLon = ((lonDeg % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;
  
  return { 
    sign: SIGNS[signIndex], 
    signName: SIGN_NAMES[signIndex],
    degree: +degree.toFixed(2) 
  };
}

function checkRetrograde(body: Body, date: Date): boolean {
  try {
    const now = EclipticLongitude(body, date);
    // Check longitude 6 hours later to determine direction
    const later = new Date(date.getTime() + 6 * 3600 * 1000);
    const laterLon = EclipticLongitude(body, later);
    
    // Account for longitude wrapping around 360 degrees
    let diff = laterLon - now;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    
    return diff < 0; // Moving backwards = retrograde
  } catch (error) {
    console.warn(`Error checking retrograde for ${body}:`, error);
    return false;
  }
}

export interface AstronomicalData {
  timestamp: string;
  moon: {
    phaseName: string;
    illumination: number;
    phaseAngle: number;
    sign: string;
    signName: string;
    degree: number;
    emoji: string;
  };
  planets: Record<string, {
    longitude: number;
    sign: string;
    signName: string;
    degree: number;
    retrograde: boolean;
  }>;
}

export function getCurrentAstronomicalData(date: Date = new Date()): AstronomicalData {
  console.log(`🌙 Calculating astronomical data for: ${date.toISOString()}`);

  // Calculate planetary positions
  const planetBodies = [
    Body.Sun, Body.Moon, Body.Mercury, Body.Venus, 
    Body.Mars, Body.Jupiter, Body.Saturn, Body.Uranus, 
    Body.Neptune, Body.Pluto
  ];

  const planets: Record<string, any> = {};

  for (const body of planetBodies) {
    try {
      let longitude;
      if (body === Body.Sun) {
        // Calculate Sun position using simple orbital mechanics
        const year = date.getFullYear();
        const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 1).getTime()) / (24 * 60 * 60 * 1000)) + 1;
        
        // Mean longitude of Sun (approximate formula)
        const L = (280.460 + 0.9856474 * dayOfYear) % 360;
        longitude = L < 0 ? L + 360 : L;
      } else {
        longitude = EclipticLongitude(body, date);
      }
      
      const { sign, signName, degree } = signFromLongitude(longitude);
      const retrograde = body !== Body.Sun && body !== Body.Moon ? checkRetrograde(body, date) : false;
      
      const bodyName = body.toString().toLowerCase();
      planets[bodyName] = {
        longitude: +longitude.toFixed(4),
        sign,
        signName,
        degree,
        retrograde
      };
    } catch (error) {
      console.warn(`Error calculating ${body.toString()}:`, error);
      // Provide fallback data for essential planets using the calculated longitude
      if (body === Body.Sun) {
        const bodyName = body.toString().toLowerCase();
        const sign = getZodiacSign(longitude);
        planets[bodyName] = {
          longitude: longitude,
          sign: sign.toLowerCase(),
          signName: sign,
          degree: longitude % 30,
          retrograde: false
        };
      } else {
        // For other planets, provide basic fallback
        const bodyName = body.toString().toLowerCase();
        planets[bodyName] = {
          longitude: 0,
          sign: 'aries',
          signName: 'Aries',
          degree: 0,
          retrograde: false
        };
      }
    }
  }

  // Calculate moon phase data
  let moonData;
  try {
    const illumination = Illumination(Body.Moon, date);
    const phaseName = MoonPhase(date);
    const moonLon = EclipticLongitude(Body.Moon, date);
    const { sign, signName, degree } = signFromLongitude(moonLon);

    // Map phase names to emojis
    const phaseEmojis: Record<string, string> = {
      'New Moon': '🌑',
      'Waxing Crescent': '🌒',
      'First Quarter': '🌓', 
      'Waxing Gibbous': '🌔',
      'Full Moon': '🌕',
      'Waning Gibbous': '🌖',
      'Last Quarter': '🌗',
      'Waning Crescent': '🌘'
    };

    moonData = {
      phaseName: typeof phaseName === 'string' ? phaseName : 'Waxing Crescent',
      illumination: typeof illumination === 'number' ? +illumination.toFixed(4) : +(illumination.fraction || 0.35).toFixed(4),
      phaseAngle: typeof illumination === 'object' && illumination.angle ? +illumination.angle.toFixed(2) : 90,
      sign,
      signName, 
      degree,
      emoji: phaseEmojis[typeof phaseName === 'string' ? phaseName : 'Waxing Crescent'] || '🌒'
    };
  } catch (error) {
    console.warn("Error calculating moon data:", error);
    moonData = {
      phaseName: 'Unknown',
      illumination: 0.5,
      phaseAngle: 0,
      sign: 'unknown',
      signName: 'Unknown',
      degree: 0,
      emoji: '🌙'
    };
  }

  return {
    timestamp: date.toISOString(),
    moon: moonData,
    planets
  };
}

export function calculateNatalChart(birthData: {
  date: string;
  time?: string;
  lat: number;
  lng: number;
}): any {
  try {
    const { date, time = "12:00", lat, lng } = birthData;
    
    // Parse birth date and time more robustly
    let birthDateTime: Date;
    
    if (time && time !== "") {
      // Parse with provided time
      const timeFormatted = time.includes(':') ? time : `${time}:00`;
      birthDateTime = new Date(`${date}T${timeFormatted}:00`);
    } else {
      // Default to noon if no time provided
      birthDateTime = new Date(`${date}T12:00:00`);
    }
    
    // Validate the date
    if (isNaN(birthDateTime.getTime())) {
      throw new Error(`Invalid date format: ${date} ${time}`);
    }
    
    console.log(`🌟 Calculating natal chart for: ${birthDateTime.toISOString()}`);

    // Get planetary positions at birth
    const planetBodies = [
      Body.Sun, Body.Moon, Body.Mercury, Body.Venus,
      Body.Mars, Body.Jupiter, Body.Saturn, Body.Uranus,
      Body.Neptune, Body.Pluto
    ];

    const planets = planetBodies.map(body => {
      const longitude = EclipticLongitude(body, birthDateTime);
      const { sign, degree } = signFromLongitude(longitude);
      const retrograde = body !== Body.Sun && body !== Body.Moon ? checkRetrograde(body, birthDateTime) : false;
      
      return {
        planet: body.toString(),
        sign,
        degree,
        longitude: +longitude.toFixed(4),
        retrograde,
        symbol: getBodySymbol(body)
      };
    });

    // Calculate houses (simplified - would need more complex calculation for accurate houses)
    const houses = Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      sign: SIGNS[i % 12],
      degree: i * 30
    }));

    // Calculate current transits
    const currentData = getCurrentAstronomicalData();

    return {
      natal: {
        planets,
        houses,
        birthData: {
          date,
          time,
          location: { lat, lng }
        }
      },
      current: currentData,
      calculated: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error calculating natal chart:", error);
    throw error;
  }
}

function getBodySymbol(body: Body): string {
  const symbols: Record<string, string> = {
    'Sun': '☉',
    'Moon': '☽', 
    'Mercury': '☿',
    'Venus': '♀',
    'Mars': '♂',
    'Jupiter': '♃',
    'Saturn': '♄',
    'Uranus': '♅',
    'Neptune': '♆',
    'Pluto': '♇'
  };
  
  return symbols[body.toString()] || '●';
}