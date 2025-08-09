import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";

interface GoogleMapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  height?: string;
  initialLocation?: { lat: number; lng: number };
}

export function GoogleMap({ onLocationSelect, height = "400px", initialLocation }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        if (typeof google !== 'undefined' && google.maps) {
          setIsLoaded(true);
          return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          setError("Google Maps API key not configured. Contact admin to enable maps.");
          return;
        }

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setIsLoaded(true);
        };
        
        script.onerror = () => {
          setError("Failed to load Google Maps");
        };

        document.head.appendChild(script);
      } catch (err) {
        setError("Error loading Google Maps");
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return;

    try {
      const defaultLocation = initialLocation || { lat: 37.7749, lng: -122.4194 }; // San Francisco default

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#e0f2fe" }]
          }
        ],
      });

      // Add a marker
      const marker = new google.maps.Marker({
        position: defaultLocation,
        map: mapInstance,
        draggable: true,
      });

      // Handle map clicks
      mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          
          marker.setPosition(position);
          
          // Get address from coordinates
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: position }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              onLocationSelect?.({
                ...position,
                address: results[0].formatted_address
              });
            } else {
              onLocationSelect?.({
                ...position,
                address: `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
              });
            }
          });
        }
      });

      // Handle marker drag
      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        if (position) {
          const pos = {
            lat: position.lat(),
            lng: position.lng()
          };
          
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              onLocationSelect?.({
                ...pos,
                address: results[0].formatted_address
              });
            }
          });
        }
      });

      setMap(mapInstance);
    } catch (err) {
      setError("Error initializing map");
    }
  }, [isLoaded, initialLocation, onLocationSelect, map]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (map) {
          map.setCenter(pos);
          map.setZoom(15);
          
          const marker = new google.maps.Marker({
            position: pos,
            map: map,
          });

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              onLocationSelect?.({
                ...pos,
                address: results[0].formatted_address
              });
            }
          });
        }
      },
      () => {
        setError("Unable to get your location");
      }
    );
  };

  if (error) {
    return (
      <Card className="p-6 text-center" style={{ height }}>
        <div className="space-y-4">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="font-medium text-destructive">Map Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="p-6 text-center" style={{ height }}>
        <div className="space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={getCurrentLocation} size="sm" variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          Use Current Location
        </Button>
      </div>
      <div
        ref={mapRef}
        style={{ height, width: "100%" }}
        className="rounded-lg border"
      />
      <p className="text-xs text-muted-foreground">
        Click on the map or drag the marker to select a location
      </p>
    </div>
  );
}