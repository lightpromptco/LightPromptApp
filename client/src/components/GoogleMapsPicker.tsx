import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Extend window interface for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapsPickerProps {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
    placeId?: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
  };
  className?: string;
}

export function GoogleMapsPicker({ onLocationSelect, initialLocation, className }: GoogleMapsPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchBox, setSearchBox] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          throw new Error('Google Maps API key not found');
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsLoaded(true);
        };
        
        script.onerror = () => {
          setError('Failed to load Google Maps API');
        };

        document.head.appendChild(script);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load maps');
      }
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    const defaultLocation = initialLocation || { lat: 37.7749, lng: -122.4194 }; // San Francisco

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 15,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    const newMarker = new window.google.maps.Marker({
      position: defaultLocation,
      map: newMap,
      draggable: true,
      title: 'Your location'
    });

    // Handle marker drag
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      if (position) {
        reverseGeocode(position.lat(), position.lng());
      }
    });

    // Handle map click
    newMap.addListener('click', (event: any) => {
      if (event.latLng) {
        newMarker.setPosition(event.latLng);
        reverseGeocode(event.latLng.lat(), event.latLng.lng());
      }
    });

    setMap(newMap);
    setMarker(newMarker);

    // Initialize search box
    if (searchInputRef.current) {
      const newSearchBox = new window.google.maps.places.SearchBox(searchInputRef.current);
      setSearchBox(newSearchBox);

      // Handle search box selection
      newSearchBox.addListener('places_changed', () => {
        const places = newSearchBox.getPlaces();
        if (places && places.length > 0) {
          const place = places[0];
          if (place.geometry && place.geometry.location) {
            const location = place.geometry.location;
            newMap.setCenter(location);
            newMarker.setPosition(location);
            
            const selectedLoc = {
              address: place.formatted_address || place.name || 'Selected location',
              lat: location.lat(),
              lng: location.lng(),
              placeId: place.place_id
            };
            
            setSelectedLocation(selectedLoc);
            onLocationSelect(selectedLoc);
          }
        }
      });
    }

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          newMap.setCenter(userLocation);
          newMarker.setPosition(userLocation);
          reverseGeocode(userLocation.lat, userLocation.lng);
        },
        () => {
          // Fallback to default location if geolocation fails
          reverseGeocode(defaultLocation.lat, defaultLocation.lng);
        }
      );
    } else {
      reverseGeocode(defaultLocation.lat, defaultLocation.lng);
    }
  }, [isLoaded]);

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({
        location: { lat, lng }
      });

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        const location = {
          address: result.formatted_address,
          lat,
          lng,
          placeId: result.place_id
        };
        
        setSelectedLocation(location);
        onLocationSelect(location);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      // Fallback location data
      const location = {
        address: `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        lat,
        lng
      };
      setSelectedLocation(location);
      onLocationSelect(location);
    }
  };

  if (error) {
    return (
      <div className={`p-6 border border-red-200 rounded-lg bg-red-50 ${className}`}>
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-xl mb-2"></i>
          <p className="text-red-700 font-medium">Maps unavailable</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`p-6 border border-gray-200 rounded-lg bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <p className="text-gray-600">Loading interactive map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Input
          ref={searchInputRef}
          placeholder="Search for a location..."
          className="pl-10"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border border-gray-300 bg-gray-100"
      />

      {/* Current Selection */}
      {selectedLocation && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 mb-1">Selected Location:</p>
              <p className="text-sm text-green-700">{selectedLocation.address}</p>
              <p className="text-xs text-green-600 mt-1">
                📍 {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </p>
            </div>
            <Badge className="bg-green-500 text-white">
              <i className="fas fa-check mr-1"></i>
              Selected
            </Badge>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        💡 Click on the map or drag the marker to select your exact location
      </p>
    </div>
  );
}