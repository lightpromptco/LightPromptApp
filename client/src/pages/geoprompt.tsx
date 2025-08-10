import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GoogleMap } from '@/components/GoogleMap';
import { GeoPromptCheckInInterface } from '@/components/GeoPromptCheckInInterface';
import { MapPin, Compass, Globe, QrCode } from 'lucide-react';

export default function GeoPromptPage() {
  const [activeView, setActiveView] = useState<'map' | 'checkin'>('map');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-teal-500 rounded-2xl flex items-center justify-center">
          <span className="text-white text-2xl">⬢</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            GeoPrompt
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Discover mindful moments through location-based reflections and QR code experiences
          </p>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            Interactive Maps
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-muted p-1 rounded-lg">
          <Button
            variant={activeView === 'map' ? 'default' : 'ghost'}
            onClick={() => setActiveView('map')}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Explore Map
          </Button>
          <Button
            variant={activeView === 'checkin' ? 'default' : 'ghost'}
            onClick={() => setActiveView('checkin')}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Check In
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeView === 'map' ? (
        <div className="space-y-6">
          {/* Google Maps Integration */}
          <GoogleMap
            height="500px"
            onLocationSelect={handleLocationSelect}
            markers={[
              { lat: 37.7749, lng: -122.4194, title: 'San Francisco', description: 'Golden Gate Park' },
              { lat: 40.7128, lng: -74.0060, title: 'New York', description: 'Central Park' },
              { lat: 34.0522, lng: -118.2437, title: 'Los Angeles', description: 'Griffith Observatory' }
            ]}
          />

          {selectedLocation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-purple-500" />
                  Selected Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Location: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => setActiveView('checkin')} className="flex-1">
                      Create Check-In Here
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      Generate QR Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Discovery */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🌳</span>
                </div>
                <h3 className="font-medium">Nature Spots</h3>
                <p className="text-sm text-muted-foreground">
                  Find peaceful outdoor locations for mindful moments
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🏛️</span>
                </div>
                <h3 className="font-medium">Sacred Spaces</h3>
                <p className="text-sm text-muted-foreground">
                  Discover temples, churches, and spiritual centers
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🎨</span>
                </div>
                <h3 className="font-medium">Creative Hubs</h3>
                <p className="text-sm text-muted-foreground">
                  Explore galleries, studios, and inspiring spaces
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <GeoPromptCheckInInterface
          userId="demo-user"
          onComplete={() => {
            console.log('Check-in completed');
            setActiveView('map');
          }}
        />
      )}
    </div>
  );
}