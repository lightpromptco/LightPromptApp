import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Heart, Smile, Frown, Meh, Zap, Flame } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmotionCheckInProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOOD_OPTIONS = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-yellow-500" },
  { value: "calm", label: "Calm", icon: Heart, color: "text-blue-500" },
  { value: "energetic", label: "Energetic", icon: Zap, color: "text-green-500" },
  { value: "grateful", label: "Grateful", icon: Heart, color: "text-pink-500" },
  { value: "peaceful", label: "Peaceful", icon: Heart, color: "text-purple-500" },
  { value: "focused", label: "Focused", icon: Flame, color: "text-indigo-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500" },
  { value: "anxious", label: "Anxious", icon: Frown, color: "text-orange-500" },
  { value: "stressed", label: "Stressed", icon: Frown, color: "text-red-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-blue-600" },
];

export function EmotionCheckIn({ userId, open, onOpenChange }: EmotionCheckInProps) {
  const [selectedMood, setSelectedMood] = useState("neutral");
  const [energy, setEnergy] = useState([5]);
  const [stress, setStress] = useState([5]);
  const [gratitude, setGratitude] = useState("");
  const [reflection, setReflection] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/wellness/checkin", data);
      return response.json();
    },
    onSuccess: () => {
      // Refresh emotion data
      queryClient.invalidateQueries({ queryKey: ['/api/wellness/emotions', userId] });
      
      toast({
        title: "Check-in Complete",
        description: "Your emotional state has been recorded. Thank you for practicing mindfulness.",
      });
      
      onOpenChange(false);
      
      // Reset form
      setSelectedMood("neutral");
      setEnergy([5]);
      setStress([5]);
      setGratitude("");
      setReflection("");
    },
    onError: () => {
      toast({
        title: "Check-in Failed",
        description: "Unable to save your check-in. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    checkInMutation.mutate({
      userId,
      mood: selectedMood,
      energy: energy[0],
      stress: stress[0],
      gratitude: gratitude.trim() || undefined,
      reflection: reflection.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Emotional Check-In</DialogTitle>
          <DialogDescription>
            Take a moment to reflect on how you're feeling right now. Your responses help create personalized insights for your wellness journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mood Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">How are you feeling?</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MOOD_OPTIONS.map((mood) => {
                const Icon = mood.icon;
                return (
                  <Card 
                    key={mood.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedMood === mood.value 
                        ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${mood.color}`} />
                      <div className="text-sm font-medium">{mood.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Energy Level: {energy[0]}/10
            </Label>
            <div className="px-3">
              <Slider
                value={energy}
                onValueChange={setEnergy}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Low Energy</span>
                <span>High Energy</span>
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Stress Level: {stress[0]}/10
            </Label>
            <div className="px-3">
              <Slider
                value={stress}
                onValueChange={setStress}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Very Calm</span>
                <span>Very Stressed</span>
              </div>
            </div>
          </div>

          {/* Gratitude */}
          <div>
            <Label htmlFor="gratitude" className="text-base font-medium mb-2 block">
              What are you grateful for today? (Optional)
            </Label>
            <Textarea
              id="gratitude"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Share something you're grateful for..."
              className="min-h-[80px]"
            />
          </div>

          {/* Reflection */}
          <div>
            <Label htmlFor="reflection" className="text-base font-medium mb-2 block">
              Any thoughts or reflections? (Optional)
            </Label>
            <Textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What's on your mind? How was your day?"
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={checkInMutation.isPending}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {checkInMutation.isPending ? "Saving..." : "Complete Check-In"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}