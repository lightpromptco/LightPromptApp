import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const LOCATION_TYPES = [
  { id: 'home', name: 'Home', emoji: '🏠', description: 'Your personal sanctuary' },
  { id: 'nature', name: 'Nature', emoji: '🌳', description: 'Outdoor natural spaces' },
  { id: 'sacred', name: 'Sacred Space', emoji: '🕊️', description: 'Churches, temples, meditation halls' },
  { id: 'work', name: 'Work', emoji: '💼', description: 'Office or workplace' },
  { id: 'travel', name: 'Travel', emoji: '✈️', description: 'Away from home, exploring' },
  { id: 'custom', name: 'Custom', emoji: '📍', description: 'Somewhere unique' }
];

const VIBE_OPTIONS = [
  { id: 'energetic', name: 'Energetic', emoji: '⚡', color: 'text-yellow-500' },
  { id: 'calm', name: 'Calm', emoji: '🧘', color: 'text-blue-500' },
  { id: 'creative', name: 'Creative', emoji: '🎨', color: 'text-purple-500' },
  { id: 'focused', name: 'Focused', emoji: '🎯', color: 'text-green-500' },
  { id: 'grateful', name: 'Grateful', emoji: '🙏', color: 'text-orange-500' },
  { id: 'peaceful', name: 'Peaceful', emoji: '☮️', color: 'text-indigo-500' },
  { id: 'inspired', name: 'Inspired', emoji: '✨', color: 'text-pink-500' },
  { id: 'reflective', name: 'Reflective', emoji: '🪞', color: 'text-gray-500' }
];

const DISPLAY_NAME_OPTIONS = [
  { value: 'real_name', label: 'Use Real Name' },
  { value: 'custom', label: 'Custom Name' },
  { value: 'anonymous', label: 'Anonymous' }
];

interface GeoPromptCheckInInterfaceProps {
  userId: string;
  onComplete: () => void;
}

export function GeoPromptCheckInInterface({ userId, onComplete }: GeoPromptCheckInInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [checkInData, setCheckInData] = useState({
    location: '',
    customLocation: '',
    vibe: '',
    reflection: '',
    mapAddress: '',
    displayName: 'real_name',
    customName: '',
    sharePublicly: false,
    coordinates: null as { lat: number; lng: number } | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const selectedLocation = LOCATION_TYPES.find(l => l.id === checkInData.location);
  const selectedVibe = VIBE_OPTIONS.find(v => v.id === checkInData.vibe);

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCheckInData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          toast({
            title: "Location Captured",
            description: "Your current location has been saved with this check-in.",
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          toast({
            title: "Location Not Available",
            description: "Unable to capture location. You can still add a manual address.",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const submissionData = {
        userId,
        location: checkInData.location,
        customLocation: checkInData.location === 'custom' ? checkInData.customLocation : null,
        vibe: checkInData.vibe,
        reflection: checkInData.reflection,
        mapAddress: checkInData.mapAddress,
        displayName: checkInData.displayName,
        customName: checkInData.displayName === 'custom' ? checkInData.customName : null,
        sharePublicly: checkInData.sharePublicly,
        coordinates: checkInData.coordinates,
        timestamp: new Date().toISOString()
      };

      const response = await apiRequest("POST", "/api/geoprompt-checkins", submissionData);
      
      toast({
        title: "Check-in Complete!",
        description: "Your GeoPrompt reflection has been saved successfully.",
      });
      
      onComplete();
    } catch (error: any) {
      console.error("Check-in submission error:", error);
      toast({
        title: "Error",
        description: "Failed to save check-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = checkInData.location && checkInData.vibe;
  const canProceedToStep3 = canProceedToStep2 && checkInData.reflection.trim();
  const canSubmit = canProceedToStep3 && 
    (checkInData.displayName !== 'custom' || checkInData.customName.trim()) &&
    (checkInData.location !== 'custom' || checkInData.customLocation.trim());

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`flex items-center space-x-2`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step <= currentStep 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-8 h-1 ${
                step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Location & Vibe */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Where & How</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">Where are you checking in from?</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {LOCATION_TYPES.map((location) => (
                  <Button
                    key={location.id}
                    variant={checkInData.location === location.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setCheckInData(prev => ({ ...prev, location: location.id }))}
                  >
                    <span className="text-2xl">{location.emoji}</span>
                    <span className="text-sm font-medium">{location.name}</span>
                  </Button>
                ))}
              </div>
              {selectedLocation && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedLocation.description}
                </p>
              )}
            </div>

            {checkInData.location === 'custom' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Custom Location</label>
                <Input
                  placeholder="Describe your unique location..."
                  value={checkInData.customLocation}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, customLocation: e.target.value }))}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-3 block">What's your current vibe?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {VIBE_OPTIONS.map((vibe) => (
                  <Button
                    key={vibe.id}
                    variant={checkInData.vibe === vibe.id ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-center space-y-1"
                    onClick={() => setCheckInData(prev => ({ ...prev, vibe: vibe.id }))}
                  >
                    <span className="text-xl">{vibe.emoji}</span>
                    <span className="text-xs font-medium">{vibe.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setCurrentStep(2)}
              disabled={!canProceedToStep2}
              className="w-full"
            >
              Continue to Reflection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Reflection */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Your Reflection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <span className="text-2xl">{selectedLocation?.emoji}</span>
              <span className="text-2xl">{selectedVibe?.emoji}</span>
              <div>
                <p className="font-medium">
                  {selectedLocation?.name} • {selectedVibe?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ready to capture this moment
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                What's happening in your inner world right now?
              </label>
              <Textarea
                placeholder="Share your thoughts, feelings, insights, or observations about this moment and place..."
                value={checkInData.reflection}
                onChange={(e) => setCheckInData(prev => ({ ...prev, reflection: e.target.value }))}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {checkInData.reflection.length} characters
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Address or Location Description (Optional)
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="e.g. Central Park, NYC or just 'my favorite coffee shop'"
                  value={checkInData.mapAddress}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, mapAddress: e.target.value }))}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLocationCapture}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={!canProceedToStep3}
                className="flex-1"
              >
                Continue to Privacy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Privacy & Submit */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Privacy & Sharing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-3 block">How do you want to appear?</label>
              <Select
                value={checkInData.displayName}
                onValueChange={(value) => setCheckInData(prev => ({ ...prev, displayName: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISPLAY_NAME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {checkInData.displayName === 'custom' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Custom Display Name</label>
                <Input
                  placeholder="How do you want to be known in this check-in?"
                  value={checkInData.customName}
                  onChange={(e) => setCheckInData(prev => ({ ...prev, customName: e.target.value }))}
                />
              </div>
            )}

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="sharePublicly"
                checked={checkInData.sharePublicly}
                onChange={(e) => setCheckInData(prev => ({ ...prev, sharePublicly: e.target.checked }))}
                className="mt-1"
              />
              <div>
                <label htmlFor="sharePublicly" className="text-sm font-medium block">
                  Share with Community
                </label>
                <p className="text-xs text-muted-foreground">
                  Allow others to see this reflection in the public feed. Your exact location will not be shared.
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {selectedLocation?.emoji} {selectedLocation?.name}
                  </Badge>
                  <Badge variant="secondary">
                    {selectedVibe?.emoji} {selectedVibe?.name}
                  </Badge>
                </div>
                <p className="text-sm">{checkInData.reflection}</p>
                <p className="text-xs text-muted-foreground">
                  By {checkInData.displayName === 'anonymous' ? 'Anonymous' : 
                      checkInData.displayName === 'custom' ? (checkInData.customName || 'Custom Name') : 
                      'Your Name'}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Complete Check-in
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}