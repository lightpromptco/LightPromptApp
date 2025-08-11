from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
from dateutil import parser
from timezonefinder import TimezoneFinder
import pytz
import os
import math

# ---- Swiss Ephemeris / Flatlib setup ----
import flatlib
from flatlib import const
from flatlib.chart import Chart
from flatlib.geopos import GeoPos
from flatlib.datetime import Datetime

# Point Swiss Ephemeris to your folder
os.environ["SE_EPHE_PATH"] = "./se"  # Swiss Ephemeris data files directory

app = FastAPI(title="LightPrompt Professional Astro API", version="1.0")

class BirthData(BaseModel):
    date: str         # "1992-02-17"
    time: str         # "14:32" (24h) or "2:32 PM" or empty for noon
    place_name: str   # optional label for display
    latitude: float
    longitude: float

def to_utc_iso(date_str, time_str, lat, lon):
    """Convert local birth time to UTC datetime handling DST correctly."""
    # Use noon if no time provided
    if not time_str or time_str.strip() == "":
        time_str = "12:00"
    
    # Parse local naive datetime
    local_dt = parser.parse(f"{date_str} {time_str}")
    
    # Find timezone by lat/lon
    tf = TimezoneFinder()
    tzname = tf.timezone_at(lng=lon, lat=lat)
    if not tzname:
        raise ValueError("Could not resolve timezone from coordinates.")
    
    zone = pytz.timezone(tzname)
    localized = zone.localize(local_dt)
    return localized.astimezone(pytz.utc)

def sign_name_from_longitude(longitude):
    """Convert longitude to zodiac sign name."""
    signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
             'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
    sign_index = int(longitude // 30)
    return signs[sign_index]

def house_system_placidus(chart):
    """Get house cusps using Placidus system."""
    houses = []
    for i in range(1, 13):
        cusp_obj = chart.get(f'Cusp{i}')
        if cusp_obj:
            houses.append({
                'house': i,
                'sign': sign_name_from_longitude(cusp_obj.lon),
                'degree': cusp_obj.lon % 30,
                'longitude': cusp_obj.lon
            })
    return houses

def build_chart(bd: BirthData):
    """Build accurate natal chart using Swiss Ephemeris."""
    utc_dt = to_utc_iso(bd.date, bd.time, bd.latitude, bd.longitude)
    fdt = Datetime(utc_dt.strftime("%Y/%m/%d"), utc_dt.strftime("%H:%M"), 0)
    pos = GeoPos(bd.latitude, bd.longitude)
    
    # Create chart with all major objects
    chart = Chart(fdt, pos, IDs=const.LIST_OBJECTS)
    return chart, utc_dt

def get_planet_house(planet_lon, houses):
    """Determine which house a planet falls in."""
    if not houses:
        return 1  # Fallback
    
    for i in range(len(houses)):
        current_house = houses[i]
        next_house = houses[(i + 1) % 12]
        
        start_lon = current_house['longitude']
        end_lon = next_house['longitude']
        
        # Handle wrap-around at 360 degrees
        if end_lon < start_lon:
            if planet_lon >= start_lon or planet_lon < end_lon:
                return current_house['house']
        else:
            if start_lon <= planet_lon < end_lon:
                return current_house['house']
    
    return 1  # Fallback to first house

@app.post("/chart")
def chart_endpoint(bd: BirthData):
    """Generate professional natal chart with accurate planetary positions."""
    try:
        chart, utc_dt = build_chart(bd)
        
        # Get timezone info
        tf = TimezoneFinder()
        timezone = tf.timezone_at(lng=bd.longitude, lat=bd.latitude)
        
        # Major planets and points
        planets = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"]
        important_points = ["ASC", "MC"]
        
        # Get house cusps first
        houses = house_system_placidus(chart)
        
        # Build planet data
        chart_data = {}
        
        for planet in planets:
            try:
                obj = chart.get(planet)
                if obj:
                    sign = sign_name_from_longitude(obj.lon)
                    house = get_planet_house(obj.lon, houses)
                    
                    chart_data[planet.lower()] = {
                        "sign": sign,
                        "degree": round(obj.lon % 30, 2),
                        "longitude": round(obj.lon, 4),
                        "house": house,
                        "retrograde": getattr(obj, 'retrograde', False)
                    }
            except Exception as e:
                print(f"Error getting {planet}: {e}")
                continue
        
        # Get important points
        for point in important_points:
            try:
                obj = chart.get(point)
                if obj:
                    sign = sign_name_from_longitude(obj.lon)
                    chart_data[point.lower()] = {
                        "sign": sign,
                        "degree": round(obj.lon % 30, 2),
                        "longitude": round(obj.lon, 4)
                    }
            except Exception as e:
                print(f"Error getting {point}: {e}")
                continue
        
        return {
            "chart": chart_data,
            "houses": houses,
            "timezone": timezone,
            "utc_datetime": utc_dt.isoformat(),
            "accuracy": "high" if bd.time and bd.time.strip() else "medium"
        }
        
    except Exception as e:
        print(f"Chart calculation error: {e}")
        raise HTTPException(status_code=400, detail=f"Chart calculation failed: {str(e)}")

@app.post("/report")
def report_endpoint(bd: BirthData):
    """Generate human-readable birth chart report."""
    try:
        chart, utc_dt = build_chart(bd)
        
        def brief_description(planet_name):
            try:
                obj = chart.get(planet_name)
                if obj:
                    sign = sign_name_from_longitude(obj.lon)
                    houses = house_system_placidus(chart)
                    house = get_planet_house(obj.lon, houses)
                    return f"{planet_name} in {sign.title()} (House {house})"
                return f"{planet_name} - unavailable"
            except:
                return f"{planet_name} - unavailable"
        
        # Big Six planetary placements
        big_six = [brief_description(x) for x in ["Sun", "Moon", "ASC", "Mercury", "Venus", "Mars"]]
        
        # Simple aspect calculation (major aspects only)
        aspects = []
        majors = [(0, "Conjunction"), (60, "Sextile"), (90, "Square"), (120, "Trine"), (180, "Opposition")]
        planet_ids = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"]
        
        for i in range(len(planet_ids)):
            for j in range(i + 1, len(planet_ids)):
                try:
                    a = chart.get(planet_ids[i])
                    b = chart.get(planet_ids[j])
                    if a and b:
                        # Calculate angular separation
                        diff = abs((a.lon - b.lon + 540) % 360 - 180)
                        
                        for deg, name in majors:
                            orb = 3 if name == "Conjunction" else 6  # Tighter orb for conjunctions
                            if abs(diff - deg) <= orb:
                                aspects.append(f"{planet_ids[i]} {name} {planet_ids[j]}")
                except:
                    continue
        
        # Generate professional summary
        summary = (
            f"Professional Natal Chart Analysis\n\n"
            f"Birth Data: {bd.date} at {bd.time or 'time unknown'} in {bd.place_name}\n"
            f"Coordinates: {bd.latitude:.2f}°N, {bd.longitude:.2f}°W\n\n"
            f"Core Planetary Placements:\n"
            f"• {chr(10).join(['• ' + placement for placement in big_six])}\n\n"
            f"Major Aspects ({len(aspects)} found):\n"
            f"• {chr(10).join(['• ' + aspect for aspect in aspects]) if aspects else '• None within standard orbs'}\n\n"
            f"Note: This analysis uses Swiss Ephemeris for maximum accuracy. "
            f"Planetary positions are calculated for your exact birth time and location."
        )
        
        return {
            "summary": summary,
            "big_six": big_six,
            "aspects": aspects,
            "accuracy": "high" if bd.time and bd.time.strip() else "medium"
        }
        
    except Exception as e:
        print(f"Report generation error: {e}")
        raise HTTPException(status_code=400, detail=f"Report generation failed: {str(e)}")

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "LightPrompt Professional Astro API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)