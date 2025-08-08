import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Heart, MessageCircle, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { GeoPromptCheckInInterface } from "@/components/GeoPromptCheckInInterface";

const LOCATION_TYPES = [
  { id: 'all', name: 'All Locations', emoji: '🌍' },
  { id: 'home', name: 'Home', emoji: '🏠' },
  { id: 'nature', name: 'Nature', emoji: '🌳' },
  { id: 'sacred', name: 'Sacred Space', emoji: '🕊️' },
  { id: 'work', name: 'Work', emoji: '💼' },
  { id: 'travel', name: 'Travel', emoji: '✈️' },
  { id: 'custom', name: 'Custom', emoji: '📍' }
];

const VIBE_FILTERS = [
  { id: 'all', name: 'All Vibes', emoji: '✨' },
  { id: 'energetic', name: 'Energetic', emoji: '⚡' },
  { id: 'calm', name: 'Calm', emoji: '🧘' },
  { id: 'creative', name: 'Creative', emoji: '🎨' },
  { id: 'focused', name: 'Focused', emoji: '🎯' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏' },
  { id: 'peaceful', name: 'Peaceful', emoji: '☮️' },
  { id: 'inspired', name: 'Inspired', emoji: '✨' },
  { id: 'reflective', name: 'Reflective', emoji: '🪞' }
];

export default function GeoPromptPage() {
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [viewMode, setViewMode] = useState<'feed' | 'map' | 'stats'>('feed');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/users/email/lightprompt.co@gmail.com'],
  });

  // Get user's check-ins
  const { data: userCheckIns = [], isLoading: loadingUserCheckIns } = useQuery({
    queryKey: ['/api/geoprompt-checkins', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Get public check-ins feed
  const { data: publicCheckIns = [], isLoading: loadingPublic } = useQuery({
    queryKey: ['/api/geoprompt-checkins/public', selectedLocation, selectedVibe],
    refetchInterval: 30000,
  });

  // Get check-in statistics
  const { data: stats } = useQuery({
    queryKey: ['/api/geoprompt-checkins/stats', user?.id],
    enabled: !!user?.id,
  });

  const handleCheckInComplete = () => {
    setShowCheckIn(false);
    queryClient.invalidateQueries({ queryKey: ['/api/geoprompt-checkins'] });
    toast({
      title: "Check-in Complete",
      description: "Your GeoPrompt reflection has been saved!",
    });
  };

  const filteredCheckIns = publicCheckIns.filter((checkIn: any) => {
    const locationMatch = selectedLocation === 'all' || checkIn.location === selectedLocation;
    const vibeMatch = selectedVibe === 'all' || checkIn.vibe === selectedVibe;
    return locationMatch && vibeMatch;
  });

  if (showCheckIn) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowCheckIn(false)}
            className="mb-4"
          >
            ← Back to GeoPrompt
          </Button>
        </div>
        <GeoPromptCheckInInterface 
          userId={user?.id || ''} 
          onComplete={handleCheckInComplete}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <MapPin className="h-12 w-12 mx-auto text-green-500" />
        <h1 className="text-3xl font-bold">GeoPrompt</h1>
        <p className="text-muted-foreground">Location-based reflections and check-ins</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.totalCheckIns || 0}</p>
                <p className="text-sm text-muted-foreground">Total Check-ins</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.uniqueLocations || 0}</p>
                <p className="text-sm text-muted-foreground">Locations Visited</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.streak || 0}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.favoriteVibe || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Favorite Vibe</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => setShowCheckIn(true)}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
        >
          <MapPin className="h-5 w-5 mr-2" />
          New Check-in
        </Button>
        
        <div className="flex space-x-2">
          {['feed', 'map', 'stats'].map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "outline"}
              onClick={() => setViewMode(mode as any)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Location:</span>
          <div className="flex space-x-1">
            {LOCATION_TYPES.map((location) => (
              <Button
                key={location.id}
                variant={selectedLocation === location.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLocation(location.id)}
              >
                {location.emoji} {location.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Vibe:</span>
          <div className="flex space-x-1">
            {VIBE_FILTERS.slice(0, 5).map((vibe) => (
              <Button
                key={vibe.id}
                variant={selectedVibe === vibe.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedVibe(vibe.id)}
              >
                {vibe.emoji} {vibe.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === 'feed' && (
        <>
          {/* My Recent Check-ins */}
          {userCheckIns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Recent Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userCheckIns.slice(0, 6).map((checkIn: any) => (
                    <div key={checkIn.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">
                          {LOCATION_TYPES.find(l => l.id === checkIn.location)?.emoji} {checkIn.location}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(checkIn.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">
                          {VIBE_FILTERS.find(v => v.id === checkIn.vibe)?.emoji}
                        </span>
                        <span className="font-medium">{checkIn.vibe}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{checkIn.reflection}</p>
                      {checkIn.mapAddress && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {checkIn.mapAddress}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Public Check-ins Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Community Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPublic ? (
                <div className="text-center py-8">Loading check-ins...</div>
              ) : filteredCheckIns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No public check-ins found for the selected filters.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCheckIns.map((checkIn: any) => (
                    <Card key={checkIn.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage src={checkIn.user?.avatarUrl} />
                            <AvatarFallback>
                              {checkIn.displayName === 'anonymous' ? '👤' : checkIn.displayName?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">
                                {checkIn.displayName === 'anonymous' ? 'Anonymous Traveler' : 
                                 checkIn.customName || checkIn.user?.name || 'Unknown'}
                              </span>
                              <Badge variant="outline">
                                {LOCATION_TYPES.find(l => l.id === checkIn.location)?.emoji} {checkIn.location}
                              </Badge>
                              <Badge variant="secondary">
                                {VIBE_FILTERS.find(v => v.id === checkIn.vibe)?.emoji} {checkIn.vibe}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(checkIn.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{checkIn.reflection}</p>
                            {checkIn.mapAddress && (
                              <p className="text-xs text-muted-foreground mb-2">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {checkIn.mapAddress}
                              </p>
                            )}
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4 mr-1" />
                                {checkIn.likes || 0}
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {checkIn.comments || 0}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === 'map' && (
        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Interactive map coming soon...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Location Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {LOCATION_TYPES.slice(1).map((location) => {
                  const count = userCheckIns.filter((c: any) => c.location === location.id).length;
                  const percentage = userCheckIns.length > 0 ? (count / userCheckIns.length) * 100 : 0;
                  return (
                    <div key={location.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{location.emoji}</span>
                        <span className="text-sm">{location.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{count}</span>
                        <div className="text-xs text-muted-foreground">
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vibe Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {VIBE_FILTERS.slice(1).map((vibe) => {
                  const count = userCheckIns.filter((c: any) => c.vibe === vibe.id).length;
                  const percentage = userCheckIns.length > 0 ? (count / userCheckIns.length) * 100 : 0;
                  return (
                    <div key={vibe.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{vibe.emoji}</span>
                        <span className="text-sm">{vibe.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">{count}</span>
                        <div className="text-xs text-muted-foreground">
                          {percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}