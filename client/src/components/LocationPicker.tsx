import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Loader } from "lucide-react";

interface LocationPickerProps {
  onLocationSelect: (location: {
    name: string;
    latitude: number;
    longitude: number;
  }) => void;
  value?: string;
  placeholder?: string;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export function LocationPicker({ onLocationSelect, value = "", placeholder = "Enter birth city or location" }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Using Nominatim API (OpenStreetMap) for free geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Location search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchLocations(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLocationSelect = (result: SearchResult) => {
    const locationName = result.display_name.split(',').slice(0, 3).join(', ');
    setSearchQuery(locationName);
    setShowResults(false);
    
    onLocationSelect({
      name: locationName,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    });
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {isSearching && (
          <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
        {!isSearching && searchQuery && (
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </div>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {searchResults.map((result) => (
              <Button
                key={result.place_id}
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left"
                onClick={() => handleLocationSelect(result)}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {result.display_name.split(',').slice(0, 2).join(', ')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {result.display_name.split(',').slice(2).join(', ')}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}