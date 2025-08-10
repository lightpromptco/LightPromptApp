import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Compass, Globe } from 'lucide-react';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
    description?: string;
  }>;
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export function GoogleMap({ 
  center = { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  zoom = 13,
  onLocationSelect,
  markers = [],
  height = "400px",
  className = ""
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load Google Maps API
  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkGoogle = setInterval(() => {
        if (window.google?.maps) {
          setIsLoaded(true);
          clearInterval(checkGoogle);
        }
      }, 100);
      return () => clearInterval(checkGoogle);
    }

    // Create script tag to load Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps. Please check your API key configuration.');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Initialize map when API is loaded
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      try {
        const googleMap = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          styles: [
            {
              featureType: 'all',
              elementType: 'geometry',
              stylers: [{ color: '#f5f5f5' }]
            },
            {
              featureType: 'water',
              elementType: 'all',
              stylers: [{ color: '#e9e9e9' }, { visibility: 'on' }]
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [{ visibility: 'simplified' }]
            }
          ]
        });

        setMap(googleMap);

        // Add click listener for location selection
        if (onLocationSelect) {
          googleMap.addListener('click', (event: any) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            onLocationSelect({ lat, lng });
          });
        }
      } catch (err) {
        setError('Failed to initialize Google Maps');
      }
    }
  }, [isLoaded, center, zoom, onLocationSelect, map]);

  // Add markers when they change
  useEffect(() => {
    if (map && markers.length > 0) {
      markers.forEach(marker => {
        new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map,
          title: marker.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#8b5cf6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            scale: 8
          }
        });
      });
    }
  }, [map, markers]);

  // Get current location
  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setCurrentLocation(newLocation);
          
          if (map) {
            map.setCenter(newLocation);
            map.setZoom(15);
            
            // Add marker for current location
            new window.google.maps.Marker({
              position: newLocation,
              map,
              title: 'Your Location',
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#10b981',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3,
                scale: 10
              }
            });
          }
          
          onLocationSelect?.(newLocation);
        },
        () => {
          setError('Unable to get your current location');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser');
    }
  };

  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <MapPin className="h-5 w-5" />
            Google Maps Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <Globe className="h-12 w-12 mx-auto text-gray-400" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="text-xs text-gray-500">
              <p>To enable Google Maps:</p>
              <ul className="mt-2 space-y-1">
                <li>• Ensure GOOGLE_MAPS_API_KEY is configured</li>
                <li>• Enable Maps JavaScript API in Google Cloud Console</li>
                <li>• Add your domain to API restrictions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent>
          <div className="flex items-center justify-center py-8 space-x-3" style={{ height }}>
            <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-muted-foreground">Loading Google Maps...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-purple-500 text-lg">⬢</span>
            <span>GeoPrompt Map</span>
            <Badge variant="outline" className="text-xs">
              Interactive
            </Badge>
          </div>
          <Button
            onClick={getCurrentLocation}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Compass className="h-4 w-4" />
            My Location
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          style={{ height, width: '100%' }}
          className="rounded-b-lg overflow-hidden"
        />
        {currentLocation && (
          <div className="p-3 bg-muted/50 text-xs text-muted-foreground border-t">
            Current Location: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}