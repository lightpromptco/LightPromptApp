import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimpleGeoCheckInProps {
  userId: string;
  onComplete?: () => void;
}

export function SimpleGeoCheckIn({ userId, onComplete }: SimpleGeoCheckInProps) {
  const [location, setLocation] = useState('');
  const [feeling, setFeeling] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!location.trim() || !feeling.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Simple check-in submission
      console.log('Submitting geo check-in:', { location, feeling, userId });
      
      toast({
        title: "Check-in Submitted",
        description: "Your mindful moment has been recorded.",
      });
      
      onComplete?.();
      setLocation('');
      setFeeling('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit check-in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-teal-500 rounded-full flex items-center justify-center">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="flex items-center gap-2 justify-center">
            <span className="text-purple-500">⬢</span>
            GeoPrompt Check-In
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Where are you?</label>
            <Input
              placeholder="Your current location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">How does it feel?</label>
            <Textarea
              placeholder="Share how this place feels to you in this moment..."
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              rows={4}
              className="w-full resize-none"
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={!location.trim() || !feeling.trim() || isSubmitting}
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Check-In'}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            <p>Your mindful moment will be recorded with respect and privacy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}