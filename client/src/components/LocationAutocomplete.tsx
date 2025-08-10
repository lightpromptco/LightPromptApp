import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

interface LocationSuggestion {
  place_id: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (location: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  label?: string;
}

export function LocationAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter birth location...",
  label = "Birth Location"
}: LocationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Major cities with coordinates for quick selection
  const popularLocations = [
    { description: "New York, NY, USA", latitude: 40.7128, longitude: -74.0060 },
    { description: "Los Angeles, CA, USA", latitude: 34.0522, longitude: -118.2437 },
    { description: "London, UK", latitude: 51.5074, longitude: -0.1278 },
    { description: "Paris, France", latitude: 48.8566, longitude: 2.3522 },
    { description: "Tokyo, Japan", latitude: 35.6762, longitude: 139.6503 },
    { description: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093 },
    { description: "Toronto, Canada", latitude: 43.6532, longitude: -79.3832 },
    { description: "Mumbai, India", latitude: 19.0760, longitude: 72.8777 },
    { description: "São Paulo, Brazil", latitude: -23.5505, longitude: -46.6333 },
    { description: "Cairo, Egypt", latitude: 30.0444, longitude: 31.2357 }
  ];

  // Debounced search function
  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions(popularLocations.slice(0, 5));
      return;
    }

    setIsLoading(true);
    try {
      // Check if we have Google Maps API key
      const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (googleMapsKey) {
        // Use backend API to avoid CORS issues
        const response = await fetch(`/api/geocode/search?query=${encodeURIComponent(query)}`);
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        } else {
          // Fallback to filtered popular locations
          const filtered = popularLocations.filter(loc => 
            loc.description.toLowerCase().includes(query.toLowerCase())
          );
          setSuggestions(filtered);
        }
      } else {
        // Fallback to filtered popular locations when no API key
        const filtered = popularLocations.filter(loc => 
          loc.description.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
      }
    } catch (error) {
      console.error('Location search error:', error);
      // Fallback to filtered popular locations
      const filtered = popularLocations.filter(loc => 
        loc.description.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      searchLocations(newValue);
      setShowSuggestions(true);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    onChange(suggestion.description, suggestion.latitude, suggestion.longitude);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (suggestions.length === 0) {
      setSuggestions(popularLocations.slice(0, 5));
    }
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Label htmlFor="location-input">{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="location-input"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id || index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
            >
              <MapPin className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {suggestion.description}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}