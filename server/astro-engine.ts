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

    // Get planetary positions at birth, excluding problematic calculations
    const planets: any[] = [];
    
    // Calculate each planet individually with error handling
    const planetBodies = [
      { body: Body.Moon, name: "Moon" },
      { body: Body.Mercury, name: "Mercury" },
      { body: Body.Venus, name: "Venus" },
      { body: Body.Mars, name: "Mars" },
      { body: Body.Jupiter, name: "Jupiter" },
      { body: Body.Saturn, name: "Saturn" },
      { body: Body.Uranus, name: "Uranus" },
      { body: Body.Neptune, name: "Neptune" },
      { body: Body.Pluto, name: "Pluto" }
    ];

    // Calculate Sun position separately to handle heliocentric issue
    try {
      const sunLongitude = EclipticLongitude(Body.Sun, birthDateTime);
      const { sign, degree } = signFromLongitude(sunLongitude);
      planets.push({
        planet: "Sun",
        sign,
        degree,
        longitude: +sunLongitude.toFixed(4),
        retrograde: false,
        symbol: getBodySymbol(Body.Sun)
      });
    } catch (sunError) {
      // Calculate sun sign based on date if ecliptic longitude fails
      const month = birthDateTime.getMonth() + 1;
      const day = birthDateTime.getDate();
      let sunSign = "aquarius";
      
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sunSign = "aries";
      else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sunSign = "taurus";
      else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sunSign = "gemini";
      else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sunSign = "cancer";
      else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunSign = "leo";
      else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunSign = "virgo";
      else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sunSign = "libra";
      else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sunSign = "scorpio";
      else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sunSign = "sagittarius";
      else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sunSign = "capricorn";
      else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sunSign = "aquarius";
      else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sunSign = "pisces";
      
      planets.push({
        planet: "Sun",
        sign: sunSign,
        degree: 15, // Approximate degree within sign
        longitude: SIGNS.indexOf(sunSign) * 30 + 15,
        retrograde: false,
        symbol: getBodySymbol(Body.Sun)
      });
    }

    // Calculate other planets
    for (const { body, name } of planetBodies) {
      try {
        const longitude = EclipticLongitude(body, birthDateTime);
        const { sign, degree } = signFromLongitude(longitude);
        const retrograde = checkRetrograde(body, birthDateTime);
        
        planets.push({
          planet: name,
          sign,
          degree,
          longitude: +longitude.toFixed(4),
          retrograde,
          symbol: getBodySymbol(body)
        });
      } catch (planetError) {
        console.warn(`Could not calculate ${name} position, using current position as reference`);
        // Use current astronomical data as reference for missing planets
        const currentData = getCurrentAstronomicalData();
        const currentPlanet = currentData.planets[name.toLowerCase()];
        if (currentPlanet) {
          planets.push({
            planet: name,
            sign: currentPlanet.sign,
            degree: currentPlanet.degree,
            longitude: currentPlanet.longitude,
            retrograde: currentPlanet.retrograde,
            symbol: getBodySymbol(body)
          });
        }
      }
    }

    // Calculate houses (simplified approach)
    const houses = Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      sign: SIGNS[i % 12],
      degree: i * 30
    }));

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
      calculated: new Date().toISOString(),
      isAstronomical: true
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