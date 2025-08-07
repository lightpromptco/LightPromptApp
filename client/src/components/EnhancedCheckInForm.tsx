import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { WellnessMetric } from '@shared/schema';

interface EnhancedCheckInFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  existingData?: WellnessMetric;
}

export function EnhancedCheckInForm({ onSubmit, isLoading, existingData }: EnhancedCheckInFormProps) {
  const [formData, setFormData] = useState({
    mood: existingData?.mood || '',
    energy: existingData?.energy || 5,
    stress: existingData?.stress || 5,
    gratitude: existingData?.gratitude || '',
    reflection: existingData?.reflection || '',
    // Health/fitness fields
    weight: '',
    workoutType: '',
    workoutDuration: '',
    waterIntake: '',
    sleepHours: '',
    sleepQuality: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Wellness Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
          <i className="fas fa-heart text-blue-600 mr-2"></i>
          Emotional Wellness
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mood">How are you feeling today?</Label>
            <Select value={formData.mood} onValueChange={(value) => setFormData(prev => ({ ...prev, mood: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="happy">😊 Happy</SelectItem>
                <SelectItem value="calm">😌 Calm</SelectItem>
                <SelectItem value="energetic">⚡ Energetic</SelectItem>
                <SelectItem value="focused">🎯 Focused</SelectItem>
                <SelectItem value="anxious">😰 Anxious</SelectItem>
                <SelectItem value="sad">😔 Sad</SelectItem>
                <SelectItem value="tired">😴 Tired</SelectItem>
                <SelectItem value="stressed">😤 Stressed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="energy">Energy Level (1-10)</Label>
            <div className="mt-1 space-y-2">
              <Input
                type="range"
                min="1"
                max="10"
                value={formData.energy}
                onChange={(e) => setFormData(prev => ({ ...prev, energy: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {formData.energy}/10
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="stress">Stress Level (1-10)</Label>
            <div className="mt-1 space-y-2">
              <Input
                type="range"
                min="1"
                max="10"
                value={formData.stress}
                onChange={(e) => setFormData(prev => ({ ...prev, stress: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {formData.stress}/10
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health & Fitness Section */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-4 flex items-center">
          <i className="fas fa-heartbeat text-green-600 mr-2"></i>
          Physical Health
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="150"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="waterIntake">Water Intake (oz)</Label>
            <Input
              id="waterIntake"
              type="number"
              placeholder="64"
              value={formData.waterIntake}
              onChange={(e) => setFormData(prev => ({ ...prev, waterIntake: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sleepHours">Sleep Hours</Label>
            <Input
              id="sleepHours"
              type="number"
              placeholder="8"
              value={formData.sleepHours}
              onChange={(e) => setFormData(prev => ({ ...prev, sleepHours: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="workoutType">Workout Type</Label>
            <Select value={formData.workoutType} onValueChange={(value) => setFormData(prev => ({ ...prev, workoutType: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select workout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="strength">Strength Training</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="pilates">Pilates</SelectItem>
                <SelectItem value="walking">Walking</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="cycling">Cycling</SelectItem>
                <SelectItem value="swimming">Swimming</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="workoutDuration">Workout Duration (min)</Label>
            <Input
              id="workoutDuration"
              type="number"
              placeholder="30"
              value={formData.workoutDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, workoutDuration: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sleepQuality">Sleep Quality (1-10)</Label>
            <div className="mt-1 space-y-2">
              <Input
                type="range"
                min="1"
                max="10"
                value={formData.sleepQuality}
                onChange={(e) => setFormData(prev => ({ ...prev, sleepQuality: parseInt(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-gray-600">
                {formData.sleepQuality}/10
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Section */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
          <i className="fas fa-pen-nib text-purple-600 mr-2"></i>
          Daily Reflection
        </h4>
        <div className="space-y-4">
          <div>
            <Label htmlFor="gratitude">What are you grateful for today?</Label>
            <Textarea
              id="gratitude"
              placeholder="Three things I'm grateful for..."
              value={formData.gratitude}
              onChange={(e) => setFormData(prev => ({ ...prev, gratitude: e.target.value }))}
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="reflection">Daily reflection</Label>
            <Textarea
              id="reflection"
              placeholder="How did today go? What did you learn about yourself?"
              value={formData.reflection}
              onChange={(e) => setFormData(prev => ({ ...prev, reflection: e.target.value }))}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        disabled={isLoading || !formData.mood}
      >
        {isLoading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Saving Your Check-in...
          </>
        ) : (
          <>
            <i className="fas fa-heart mr-2"></i>
            Complete Check-in
          </>
        )}
      </Button>
    </form>
  );
}