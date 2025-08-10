import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Users, Mail } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  guardianEmail?: string;
  checkIns: number;
}

interface GoogleMapProps {
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  locations?: Location[];
  height?: string;
}

export default function GoogleMap({ onLocationSelect, locations = [], height = "400px" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const defaultLocations: Location[] = [
    {
      id: '1',
      name: 'Central Park Meditation Spot',
      lat: 40.7829,
      lng: -73.9654,
      description: 'A peaceful corner for mindful reflection',
      guardianEmail: 'guardian@lightprompt.co',
      checkIns: 127
    },
    {
      id: '2', 
      name: 'Golden Gate Bridge Viewpoint',
      lat: 37.8199,
      lng: -122.4783,
      description: 'Sunrise contemplation point',
      guardianEmail: 'sf.guardian@lightprompt.co',
      checkIns: 89
    },
    {
      id: '3',
      name: 'Griffith Observatory',
      lat: 34.1184,
      lng: -118.3004,
      description: 'Stars and cosmic connection',
      guardianEmail: 'la.guardian@lightprompt.co', 
      checkIns: 156
    },
    {
      id: '4',
      name: 'Brooklyn Bridge',
      lat: 40.7061,
      lng: -73.9969,
      description: 'Urban mindfulness walk',
      guardianEmail: 'brooklyn.guardian@lightprompt.co',
      checkIns: 203
    }
  ];

  const allLocations = [...defaultLocations, ...locations];

  useEffect(() => {
    const initializeMap = () => {
      if (window.google && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 4,
          center: { lat: 39.8283, lng: -98.5795 }, // Center of US
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        mapInstanceRef.current = map;

        // Add markers for all locations
        allLocations.forEach(location => {
          const marker = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.name,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#14B8A6',
              fillOpacity: 0.8,
              strokeWeight: 2,
              strokeColor: '#ffffff'
            }
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${location.name}</h3>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${location.description}</p>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="color: #14B8A6; font-weight: bold;">${location.checkIns} check-ins</span>
                </div>
                ${location.guardianEmail ? `
                  <div style="padding: 8px; background: #f3f4f6; border-radius: 4px; margin-top: 8px;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Guardian: ${location.guardianEmail}</p>
                  </div>
                ` : ''}
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
            setSelectedLocation(location);
          });
        });

        // Add click listener for new locations
        if (onLocationSelect) {
          map.addListener('click', (event: any) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            onLocationSelect({ lat, lng });
          });
        }

        setIsLoaded(true);
      }
    };

    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      window.initMap = initializeMap;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOkmgQ4Kj-CKkA&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup if needed
    };
  }, [onLocationSelect, allLocations]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef} 
            style={{ height, width: '100%' }}
            className="rounded-lg"
          />
          {!isLoaded && (
            <div 
              style={{ height }}
              className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Loading map...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedLocation && (
        <Card className="border-teal-200 bg-teal-50 dark:bg-teal-950/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{selectedLocation.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{selectedLocation.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {selectedLocation.checkIns} check-ins
                  </span>
                  {selectedLocation.guardianEmail && (
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Guardian available
                    </span>
                  )}
                </div>
              </div>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                Check In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <Plus className="w-4 h-4 mr-2 text-teal-600" />
              Add New Location
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Click anywhere on the map to suggest a new GeoPrompt location
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Suggest Location
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-purple-600" />
              Become a Guardian
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Help guide others in mindful practices at special locations
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Join as Guardian
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}