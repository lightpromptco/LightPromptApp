import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { GoogleMapsPicker } from '@/components/GoogleMapsPicker';

interface GeoPromptCheckInInterfaceProps {
  userId: string;
}

const LOCATION_OPTIONS = [
  { id: 'home', name: 'Home', emoji: '🏠' },
  { id: 'work', name: 'Work/Office', emoji: '💼' },
  { id: 'nature', name: 'Nature/Outdoors', emoji: '🌲' },
  { id: 'coffee', name: 'Coffee Shop', emoji: '☕' },
  { id: 'gym', name: 'Gym/Fitness', emoji: '💪' },
  { id: 'travel', name: 'Traveling', emoji: '✈️' },
  { id: 'restaurant', name: 'Restaurant/Cafe', emoji: '🍽️' },
  { id: 'beach', name: 'Beach/Water', emoji: '🏖️' },
  { id: 'city', name: 'City/Urban', emoji: '🏙️' },
  { id: 'mountains', name: 'Mountains', emoji: '⛰️' },
  { id: 'park', name: 'Park', emoji: '🌳' },
  { id: 'other', name: 'Other Location', emoji: '📍' }
];

const VIBE_OPTIONS = [
  { id: 'energized', name: 'Energized', emoji: '⚡', color: 'text-yellow-600' },
  { id: 'calm', name: 'Calm', emoji: '🧘', color: 'text-blue-600' },
  { id: 'curious', name: 'Curious', emoji: '🤔', color: 'text-purple-600' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: 'text-green-600' },
  { id: 'contemplative', name: 'Contemplative', emoji: '💭', color: 'text-indigo-600' },
  { id: 'joyful', name: 'Joyful', emoji: '😊', color: 'text-pink-600' },
  { id: 'focused', name: 'Focused', emoji: '🎯', color: 'text-red-600' },
  { id: 'peaceful', name: 'Peaceful', emoji: '☮️', color: 'text-teal-600' },
  { id: 'inspired', name: 'Inspired', emoji: '✨', color: 'text-amber-600' },
  { id: 'reflective', name: 'Reflective', emoji: '🪞', color: 'text-gray-600' }
];

export function GeoPromptCheckInInterface({ userId }: GeoPromptCheckInInterfaceProps) {
  const [checkInData, setCheckInData] = useState({
    location: '',
    customLocation: '',
    mapLocation: null as { address: string; lat: number; lng: number; placeId?: string } | null,
    vibe: '',
    displayName: 'anonymous',
    customName: '',
    customInitials: '',
    reflection: '',
    sharePublicly: false,
    logoPhotos: [] as File[],
    logoPhotoPreviewUrls: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoApprovalStatus, setPhotoApprovalStatus] = useState<{
    [key: string]: 'pending' | 'approved' | 'rejected'
  }>({});
  const [useMapSelection, setUseMapSelection] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare check-in data for API
      const checkInPayload = {
        userId: checkInData.userId || userId,
        location: checkInData.location,
        customLocation: checkInData.customLocation,
        mapAddress: checkInData.mapLocation?.address,
        mapLat: checkInData.mapLocation?.lat,
        mapLng: checkInData.mapLocation?.lng,
        mapPlaceId: checkInData.mapLocation?.placeId,
        vibe: checkInData.vibe,
        displayName: checkInData.displayName,
        customName: checkInData.customName,
        customInitials: checkInData.customInitials,
        reflection: checkInData.reflection,
        sharePublicly: checkInData.sharePublicly,
        logoPhotos: [] // Will be implemented later for file uploads
      };

      const response = await fetch('/api/geoprompt-checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkInPayload),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save check-in');
      }

      console.log('✅ Check-in saved successfully:', result);
      
      // Reset form
      checkInData.logoPhotoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setCheckInData({
        location: '',
        customLocation: '',
        mapLocation: null,
        vibe: '',
        displayName: 'anonymous',
        customName: '',
        customInitials: '',
        reflection: '',
        sharePublicly: false,
        logoPhotos: [],
        logoPhotoPreviewUrls: []
      });
      setPhotoApprovalStatus({});
      
      alert('GeoPrompt check-in saved! Ready for location-based reflection.');
    } catch (error) {
      console.error('Error saving check-in:', error);
      alert('Error saving check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLocation = LOCATION_OPTIONS.find(loc => loc.id === checkInData.location);
  const selectedVibe = VIBE_OPTIONS.find(vibe => vibe.id === checkInData.vibe);

  const handleLogoPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + checkInData.logoPhotos.length > 2) {
      alert('Maximum 2 LightPrompt logo photos allowed per check-in');
      return;
    }

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setCheckInData({
      ...checkInData,
      logoPhotos: [...checkInData.logoPhotos, ...files],
      logoPhotoPreviewUrls: [...checkInData.logoPhotoPreviewUrls, ...newPreviewUrls]
    });

    // Simulate AI content approval
    files.forEach((file, index) => {
      const photoId = `${Date.now()}_${index}`;
      setPhotoApprovalStatus(prev => ({ ...prev, [photoId]: 'pending' }));
      
      // Simulate AI approval after 1.5 seconds
      setTimeout(() => {
        const isApproved = Math.random() > 0.05; // 95% approval rate for logo photos
        setPhotoApprovalStatus(prev => ({ 
          ...prev, 
          [photoId]: isApproved ? 'approved' : 'rejected'
        }));
      }, 1500);
    });
  };

  const removeLogoPhoto = (index: number) => {
    const newPhotos = checkInData.logoPhotos.filter((_, i) => i !== index);
    const newPreviewUrls = checkInData.logoPhotoPreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(checkInData.logoPhotoPreviewUrls[index]);
    
    setCheckInData({
      ...checkInData,
      logoPhotos: newPhotos,
      logoPhotoPreviewUrls: newPreviewUrls
    });
  };

  const handleMapLocationSelect = (location: { address: string; lat: number; lng: number; placeId?: string }) => {
    setCheckInData({ ...checkInData, mapLocation: location });
  };

  const getDisplayNamePreview = () => {
    if (checkInData.displayName === 'anonymous') return '👤 Anonymous';
    if (checkInData.displayName === 'name') return `👤 ${checkInData.customName || 'Your Name'}`;
    if (checkInData.displayName === 'initials') return `👤 ${checkInData.customInitials || 'Initials'}`;
    return '👤 Anonymous';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-map-marker-alt text-white text-xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">GeoPrompt Check-In</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with your current space and energy. Share your location and vibe to receive 
          contextual prompts and connect with others in similar spaces.
        </p>
      </div>

      {/* Check-in Form */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-teal-50 to-green-50 border-teal-200">
        <CardHeader>
          <CardTitle>Where are you and how are you feeling?</CardTitle>
          <p className="text-sm text-gray-600">
            Your location and vibe help create meaningful, contextual reflections
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">
                  📍 Where are you right now?
                </label>
                <div className="flex items-center space-x-2 text-sm">
                  <Button
                    type="button"
                    variant={!useMapSelection ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseMapSelection(false)}
                    className="text-xs"
                  >
                    <i className="fas fa-list mr-1"></i>
                    Preset Locations
                  </Button>
                  <Button
                    type="button"
                    variant={useMapSelection ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseMapSelection(true)}
                    className="text-xs"
                  >
                    <i className="fas fa-map mr-1"></i>
                    Map Selection
                  </Button>
                </div>
              </div>

              {!useMapSelection ? (
                <Select value={checkInData.location} onValueChange={(value) => 
                  setCheckInData({...checkInData, location: value, mapLocation: null})
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your location type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_OPTIONS.map(location => (
                      <SelectItem key={location.id} value={location.id}>
                        <span className="flex items-center">
                          <span className="mr-2">{location.emoji}</span>
                          {location.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <GoogleMapsPicker
                  onLocationSelect={handleMapLocationSelect}
                  className="mt-2"
                />
              )}
            </div>

            {/* Custom Location */}
            {checkInData.location === 'other' && !useMapSelection && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your location
                </label>
                <Input
                  value={checkInData.customLocation}
                  onChange={(e) => setCheckInData({...checkInData, customLocation: e.target.value})}
                  placeholder="e.g., Library, Friend's house, Concert venue..."
                />
              </div>
            )}

            {/* Vibe Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                ✨ What's your current vibe?
              </label>
              <Select value={checkInData.vibe} onValueChange={(value) => 
                setCheckInData({...checkInData, vibe: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current energy" />
                </SelectTrigger>
                <SelectContent>
                  {VIBE_OPTIONS.map(vibe => (
                    <SelectItem key={vibe.id} value={vibe.id}>
                      <span className="flex items-center">
                        <span className="mr-2">{vibe.emoji}</span>
                        <span className={vibe.color}>{vibe.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Display Name Option */}
            <div>
              <label className="block text-sm font-medium mb-2">
                How would you like to appear to others?
              </label>
              <Select value={checkInData.displayName} onValueChange={(value) => 
                setCheckInData({...checkInData, displayName: value})
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Choose display option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anonymous">
                    <span className="flex items-center">
                      <i className="fas fa-user-secret mr-2 text-gray-500"></i>
                      Anonymous
                    </span>
                  </SelectItem>
                  <SelectItem value="name">
                    <span className="flex items-center">
                      <i className="fas fa-user mr-2 text-blue-500"></i>
                      Your Name
                    </span>
                  </SelectItem>
                  <SelectItem value="initials">
                    <span className="flex items-center">
                      <i className="fas fa-user-circle mr-2 text-green-500"></i>
                      Initials Only
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Name Input */}
            {checkInData.displayName === 'name' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter your name
                </label>
                <Input
                  value={checkInData.customName}
                  onChange={(e) => setCheckInData({...checkInData, customName: e.target.value})}
                  placeholder="Your name as you'd like it to appear"
                />
              </div>
            )}

            {/* Custom Initials Input */}
            {checkInData.displayName === 'initials' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter your initials
                </label>
                <Input
                  value={checkInData.customInitials}
                  onChange={(e) => setCheckInData({...checkInData, customInitials: e.target.value})}
                  placeholder="e.g., J.D."
                  maxLength={10}
                />
              </div>
            )}

            {/* Quick Reflection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                💭 Quick reflection (optional)
              </label>
              <Textarea
                value={checkInData.reflection}
                onChange={(e) => setCheckInData({...checkInData, reflection: e.target.value})}
                placeholder="What's present for you in this moment and place?"
                rows={3}
              />
            </div>

            {/* LightPrompt Logo Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                📸 LightPrompt Logo Photos (optional)
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Spotted a LightPrompt logo in the wild? Share it with the community!
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    id="logo-photo-upload"
                    accept="image/*"
                    multiple
                    onChange={handleLogoPhotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-photo-upload"
                    className="flex items-center px-4 py-2 bg-white hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-300 shadow-sm"
                  >
                    <i className="fas fa-camera mr-2 text-teal-600"></i>
                    <span className="text-sm text-gray-700">Add Logo Photos</span>
                  </label>
                  <span className="text-xs text-gray-500">Max 2 photos • AI content approval required</span>
                </div>

                {/* Logo Photo Previews */}
                {checkInData.logoPhotoPreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {checkInData.logoPhotoPreviewUrls.map((url, index) => {
                      const photoId = `${Date.now()}_${index}`;
                      const approvalStatus = photoApprovalStatus[photoId] || 'pending';
                      
                      return (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Logo photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-teal-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeLogoPhoto(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                          
                          {/* Approval Status Badge */}
                          <div className="absolute bottom-2 left-2">
                            {approvalStatus === 'pending' && (
                              <Badge className="bg-yellow-500 text-white text-xs">
                                <i className="fas fa-clock mr-1"></i>
                                Reviewing...
                              </Badge>
                            )}
                            {approvalStatus === 'approved' && (
                              <Badge className="bg-green-500 text-white text-xs">
                                <i className="fas fa-check mr-1"></i>
                                Approved
                              </Badge>
                            )}
                            {approvalStatus === 'rejected' && (
                              <Badge className="bg-red-500 text-white text-xs">
                                <i className="fas fa-times mr-1"></i>
                                Rejected
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {(checkInData.location || checkInData.mapLocation || checkInData.vibe) && (
              <div className="bg-white p-4 rounded-lg border border-teal-300">
                <h4 className="font-medium mb-2 text-teal-800">Your Check-in Preview:</h4>
                <div className="flex items-center space-x-4 text-sm">
                  {useMapSelection && checkInData.mapLocation ? (
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      📍 {checkInData.mapLocation.address}
                    </Badge>
                  ) : selectedLocation && (
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {selectedLocation.emoji} {selectedLocation.name}
                    </Badge>
                  )}
                  {selectedVibe && (
                    <Badge variant="outline" className="text-teal-700 border-teal-300">
                      {selectedVibe.emoji} {selectedVibe.name}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-gray-600">
                    {getDisplayNamePreview()}
                  </Badge>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={(!checkInData.location && !checkInData.mapLocation) || !checkInData.vibe || isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Checking In...
                </>
              ) : (
                <>
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Complete GeoPrompt Check-In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-comments text-blue-600 mr-2"></i>
              Start GeoPrompt Reflection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Ready to dive deeper? Get AI-guided prompts based on your current location and energy.
            </p>
            <Link href="/chat/geoprompt">
              <Button variant="outline" className="w-full">
                <i className="fas fa-eye mr-2"></i>
                Open GeoPrompt Bot
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-map text-purple-600 mr-2"></i>
              Explore GeoPrompt Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              See check-ins from others in similar locations and discover new reflection opportunities.
            </p>
            <Button variant="outline" className="w-full">
              <i className="fas fa-globe mr-2"></i>
              View GeoPrompt Map
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Check-ins */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Recent GeoPrompt Activity</CardTitle>
          <p className="text-sm text-gray-600">
            See what others are reflecting on around the world
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock recent check-ins */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🌲</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">Anonymous</span>
                    <Badge variant="outline" className="text-xs">Nature/Outdoors</Badge>
                    <Badge variant="outline" className="text-xs">Peaceful</Badge>
                  </div>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <i className="fas fa-eye text-gray-400"></i>
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">☕</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">M.K.</span>
                    <Badge variant="outline" className="text-xs">Coffee Shop</Badge>
                    <Badge variant="outline" className="text-xs">Contemplative</Badge>
                  </div>
                  <p className="text-xs text-gray-600">15 minutes ago</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <i className="fas fa-eye text-gray-400"></i>
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button variant="ghost" size="sm">
                View All Activity
                <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}