import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Users, Sparkles, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const ENERGY_LEVELS = [
  { value: 1, label: "Zen", emoji: "🧘", color: "text-blue-500" },
  { value: 3, label: "Balanced", emoji: "⚖️", color: "text-green-500" },
  { value: 5, label: "Vibrant", emoji: "✨", color: "text-yellow-500" },
  { value: 7, label: "Electric", emoji: "⚡", color: "text-orange-500" },
  { value: 10, label: "Cosmic", emoji: "🌌", color: "text-purple-500" }
];

const INTERESTS = [
  "Meditation", "Astrology", "Crystals", "Yoga", "Mindfulness",
  "Soul Work", "Energy Healing", "Tarot", "Manifestation", 
  "Nature Connection", "Sacred Geometry", "Breathwork"
];

export default function VibeMatchPage() {
  const [profileStep, setProfileStep] = useState(1);
  const [vibeProfile, setVibeProfile] = useState({
    energyLevel: 5,
    currentMood: "",
    intentions: "",
    interests: [] as string[],
    lookingFor: "friendship",
    shareLocation: false,
    bio: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/users/email/lightprompt.co@gmail.com'],
  });

  // Get user's vibe profile
  const { data: userVibeProfile } = useQuery({
    queryKey: ['/api/vibe-profile', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Get potential matches
  const { data: potentialMatches = [], refetch: refetchMatches } = useQuery({
    queryKey: ['/api/vibe-matches', user?.id],
    enabled: !!user?.id && !!userVibeProfile,
    refetchInterval: 30000,
  });

  // Get active matches
  const { data: activeMatches = [] } = useQuery({
    queryKey: ['/api/active-matches', user?.id],
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  // Create/update vibe profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return apiRequest("POST", "/api/vibe-profile", {
        ...profileData,
        userId: user?.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vibe-profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vibe-matches'] });
      toast({
        title: "Profile Updated",
        description: "Your vibe profile has been updated!",
      });
    },
  });

  // Send match request mutation
  const sendMatchMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      return apiRequest("POST", "/api/vibe-matches/request", {
        fromUserId: user?.id,
        toUserId: targetUserId
      });
    },
    onSuccess: () => {
      refetchMatches();
      toast({
        title: "Vibe Match Sent",
        description: "Your vibe match request has been sent!",
      });
    },
  });

  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(vibeProfile);
  };

  const handleSendMatch = (targetUserId: string) => {
    sendMatchMutation.mutate(targetUserId);
  };

  const handleInterestToggle = (interest: string) => {
    setVibeProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Initialize profile from existing data
  useEffect(() => {
    if (userVibeProfile) {
      setVibeProfile({
        energyLevel: userVibeProfile.energyLevel || 5,
        currentMood: userVibeProfile.currentMood || "",
        intentions: userVibeProfile.intentions || "",
        interests: userVibeProfile.interests || [],
        lookingFor: userVibeProfile.lookingFor || "friendship",
        shareLocation: userVibeProfile.shareLocation || false,
        bio: userVibeProfile.bio || ""
      });
    }
  }, [userVibeProfile]);

  const currentEnergyLevel = ENERGY_LEVELS.find(level => level.value <= vibeProfile.energyLevel)
    || ENERGY_LEVELS[ENERGY_LEVELS.length - 1];

  if (!userVibeProfile && profileStep === 1) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-2">
          <Sparkles className="h-12 w-12 mx-auto text-purple-500" />
          <h1 className="text-3xl font-bold">Create Your Vibe Profile</h1>
          <p className="text-muted-foreground">Connect with souls on your wavelength</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step {profileStep} of 3: Energy & Mood</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Current Energy Level</Label>
              <div className="mt-4 space-y-4">
                <Slider
                  value={[vibeProfile.energyLevel]}
                  onValueChange={([value]) => setVibeProfile(prev => ({ ...prev, energyLevel: value }))}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <div className={`text-2xl ${currentEnergyLevel.color}`}>
                    {currentEnergyLevel.emoji}
                  </div>
                  <p className="font-medium">{currentEnergyLevel.label}</p>
                  <p className="text-sm text-muted-foreground">Level {vibeProfile.energyLevel}/10</p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="mood">Current Mood</Label>
              <Input
                id="mood"
                placeholder="How are you feeling right now?"
                value={vibeProfile.currentMood}
                onChange={(e) => setVibeProfile(prev => ({ ...prev, currentMood: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="intentions">Intentions</Label>
              <Textarea
                id="intentions"
                placeholder="What are you manifesting or working on?"
                value={vibeProfile.intentions}
                onChange={(e) => setVibeProfile(prev => ({ ...prev, intentions: e.target.value }))}
              />
            </div>

            <Button 
              onClick={() => setProfileStep(2)} 
              className="w-full"
              disabled={!vibeProfile.currentMood || !vibeProfile.intentions}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileStep === 2) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 2 of 3: Interests & Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Your Interests</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <Button
                    key={interest}
                    variant={vibeProfile.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="lookingFor">Looking For</Label>
              <Select
                value={vibeProfile.lookingFor}
                onValueChange={(value) => setVibeProfile(prev => ({ ...prev, lookingFor: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendship">Soul Friendship</SelectItem>
                  <SelectItem value="guidance">Spiritual Guidance</SelectItem>
                  <SelectItem value="practice">Practice Partner</SelectItem>
                  <SelectItem value="community">Community Connection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setProfileStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setProfileStep(3)}
                disabled={vibeProfile.interests.length === 0}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileStep === 3) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 3 of 3: Bio & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="bio">Tell the community about yourself</Label>
              <Textarea
                id="bio"
                placeholder="Share what makes your soul shine..."
                value={vibeProfile.bio}
                onChange={(e) => setVibeProfile(prev => ({ ...prev, bio: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="shareLocation"
                checked={vibeProfile.shareLocation}
                onChange={(e) => setVibeProfile(prev => ({ ...prev, shareLocation: e.target.checked }))}
              />
              <Label htmlFor="shareLocation">Share general location for local connections</Label>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setProfileStep(2)}>
                Back
              </Button>
              <Button 
                onClick={handleUpdateProfile}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <Sparkles className="h-12 w-12 mx-auto text-purple-500" />
        <h1 className="text-3xl font-bold">Vibe Match</h1>
        <p className="text-muted-foreground">Connect with souls on your wavelength</p>
      </div>

      {/* Current Vibe Status */}
      <Card>
        <CardHeader>
          <CardTitle>Your Current Vibe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`text-3xl ${currentEnergyLevel.color}`}>
                {currentEnergyLevel.emoji}
              </div>
              <div>
                <p className="font-medium">{currentEnergyLevel.label} Energy</p>
                <p className="text-sm text-muted-foreground">{vibeProfile.currentMood}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setProfileStep(1)}>
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Matches */}
      {activeMatches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Vibe Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMatches.map((match: any) => (
                <div key={match.id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarImage src={match.user?.avatarUrl} />
                      <AvatarFallback>{match.user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{match.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{match.vibeProfile?.currentMood}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Potential Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Discover Soul Connections</CardTitle>
        </CardHeader>
        <CardContent>
          {potentialMatches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No potential matches found. Try updating your profile or check back later!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {potentialMatches.map((match: any) => (
                <Card key={match.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar>
                        <AvatarImage src={match.avatarUrl} />
                        <AvatarFallback>{match.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{match.name}</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{match.vibeProfile?.energyEmoji}</span>
                          <span className="text-sm text-muted-foreground">
                            {match.vibeProfile?.energyLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{match.vibeProfile?.bio}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {match.vibeProfile?.interests?.slice(0, 3).map((interest: string) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSendMatch(match.id)}
                      disabled={sendMatchMutation.isPending}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Send Vibe Match
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}