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
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  MessageCircle, 
  Users, 
  Sparkles, 
  MapPin, 
  Calendar,
  Eye,
  EyeOff,
  Zap,
  Moon,
  Sun,
  Compass,
  Lock,
  Unlock,
  X,
  Check,
  Star,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const CONNECTION_TYPES = [
  { id: 'friendship', label: 'Soul Friendship', emoji: '🤝', description: 'Deep platonic connections' },
  { id: 'spiritual_companion', label: 'Spiritual Companion', emoji: '🕊️', description: 'Growth journey partner' },
  { id: 'romantic', label: 'Romantic Connection', emoji: '💕', description: 'Love through resonance' },
  { id: 'collaboration', label: 'Creative Collaboration', emoji: '🎨', description: 'Co-creation partnership' },
  { id: 'mentorship', label: 'Mentorship', emoji: '🌱', description: 'Teaching & learning exchange' }
];

const VIBE_WORDS = [
  'Authentic', 'Empathetic', 'Curious', 'Grounded', 'Intuitive', 'Playful',
  'Reflective', 'Adventurous', 'Peaceful', 'Creative', 'Wise', 'Compassionate',
  'Free-spirited', 'Thoughtful', 'Mystical', 'Nurturing', 'Bold', 'Gentle'
];

const INTERESTS = [
  'Meditation', 'Astrology', 'Energy Healing', 'Yoga', 'Mindfulness',
  'Soul Work', 'Tarot', 'Manifestation', 'Nature Connection', 
  'Sacred Geometry', 'Breathwork', 'Plant Medicine', 'Sound Healing',
  'Crystal Work', 'Shamanism', 'Conscious Living', 'Spiritual Psychology'
];

export default function VibeMatchPage() {
  const [currentView, setCurrentView] = useState<'intro' | 'profile' | 'discovery' | 'matches' | 'prism'>('intro');
  const [profileStep, setProfileStep] = useState(1);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [vibeProfile, setVibeProfile] = useState({
    bio: "",
    location: "",
    interests: [] as string[],
    vibeWords: [] as string[],
    seekingConnection: "friendship",
    ageRange: "25-35",
    shareLocation: false,
    profileComplete: false
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
  });

  // Get potential matches
  const { data: potentialMatches = [] } = useQuery({
    queryKey: ['/api/vibe-matches/potential', user?.id],
    enabled: !!user?.id && !!userVibeProfile?.profileComplete,
  });

  // Get current matches
  const { data: currentMatches = [] } = useQuery({
    queryKey: ['/api/vibe-matches/current', user?.id],
    enabled: !!user?.id,
  });

  // Get prism points
  const { data: prismPoints = [] } = useQuery({
    queryKey: ['/api/prism-points', user?.id],
    enabled: !!user?.id,
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
        title: "Soul Map Updated",
        description: "Your energetic profile has been enhanced!",
      });
    },
  });

  // Process match action (like/pass)
  const matchActionMutation = useMutation({
    mutationFn: async ({ matchUserId, action }: { matchUserId: string; action: 'like' | 'pass' }) => {
      return apiRequest("POST", "/api/vibe-matches/action", {
        userId: user?.id,
        matchUserId,
        action
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/vibe-matches'] });
      if (data.isMatch) {
        toast({
          title: "Resonance Match! ✨",
          description: "You've found an energetic connection. Ready for PrismPoint?",
        });
      }
      // Move to next potential match
      setCurrentMatchIndex(prev => prev + 1);
    },
  });

  const handleUpdateProfile = () => {
    const profileData = {
      ...vibeProfile,
      profileComplete: true
    };
    updateProfileMutation.mutate(profileData);
    setCurrentView('discovery');
  };

  const handleMatchAction = (action: 'like' | 'pass') => {
    if (potentialMatches[currentMatchIndex]) {
      matchActionMutation.mutate({
        matchUserId: potentialMatches[currentMatchIndex].profile.userId,
        action
      });
    }
  };

  const handleInterestToggle = (interest: string) => {
    setVibeProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleVibeWordToggle = (word: string) => {
    setVibeProfile(prev => ({
      ...prev,
      vibeWords: prev.vibeWords.includes(word)
        ? prev.vibeWords.filter(w => w !== word)
        : [...prev.vibeWords, word]
    }));
  };

  // Initialize profile from existing data
  useEffect(() => {
    if (userVibeProfile) {
      setVibeProfile(userVibeProfile);
      setCurrentView(userVibeProfile.profileComplete ? 'discovery' : 'profile');
    }
  }, [userVibeProfile]);

  // Determine initial view
  useEffect(() => {
    if (user?.tier === 'free') {
      setCurrentView('intro');
    } else if (!userVibeProfile?.profileComplete) {
      setCurrentView('profile');
    } else {
      setCurrentView('discovery');
    }
  }, [user, userVibeProfile]);

  // Introduction screen for users who need to upgrade
  if (currentView === 'intro') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-white" />
          </div>
          
          <div>
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              VibeMatch
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Resonance-Based Connection
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Because real alignment can't be filtered.
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">What is VibeMatch?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              A new way to meet people — based on how you actually feel and who you really are.
              Not just another swipe app. Not another personality quiz.
              VibeMatch connects you through resonance — your emotional tone, values, cycles, and reflections.
            </p>
          </CardContent>
        </Card>

        {/* How it's different */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <X className="h-5 w-5" />
                Not This
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <X className="h-4 w-4 text-red-500" />
                Profile photos until you match in resonance
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <X className="h-4 w-4 text-red-500" />
                Judgment based on appearance or algorithms
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <X className="h-4 w-4 text-red-500" />
                Endless scrolling
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                But This
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Check className="h-4 w-4 text-green-500" />
                Shared reflections & emotional tracking
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Check className="h-4 w-4 text-green-500" />
                Intentional values-based prompts
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Check className="h-4 w-4 text-green-500" />
                Secure, private, mirror-based matching
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Access requirement */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-2">Growth Plan Required</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              VibeMatch is available with the Growth Plan to ensure authentic connections 
              and prevent misuse.
            </p>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
              Upgrade to Growth Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Profile creation/editing
  if (currentView === 'profile') {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Your Soul Map</h1>
          <p className="text-muted-foreground">
            Build your energetic profile for deeper connections
          </p>
          <Progress value={(profileStep / 4) * 100} className="w-full mt-4" />
        </div>

        {profileStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Essence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio - Share your soul story (no name needed)</Label>
                <Textarea
                  id="bio"
                  placeholder="I'm on a journey of self-discovery and love connecting with like-minded souls..."
                  value={vibeProfile.bio}
                  onChange={(e) => setVibeProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>What type of connection are you seeking?</Label>
                <div className="grid grid-cols-1 gap-3">
                  {CONNECTION_TYPES.map((type) => (
                    <Card 
                      key={type.id}
                      className={`cursor-pointer transition-all ${
                        vibeProfile.seekingConnection === type.id 
                          ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setVibeProfile(prev => ({ ...prev, seekingConnection: type.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{type.emoji}</span>
                          <div>
                            <h3 className="font-medium">{type.label}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => setProfileStep(2)}
                  disabled={!vibeProfile.bio.trim() || !vibeProfile.seekingConnection}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {profileStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Vibe Words</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose words that capture your energy (select 3-6)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {VIBE_WORDS.map((word) => (
                  <Badge
                    key={word}
                    variant={vibeProfile.vibeWords.includes(word) ? "default" : "outline"}
                    className="cursor-pointer p-2 text-center justify-center"
                    onClick={() => handleVibeWordToggle(word)}
                  >
                    {word}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setProfileStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setProfileStep(3)}
                  disabled={vibeProfile.vibeWords.length < 3}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {profileStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Interests</CardTitle>
              <p className="text-sm text-muted-foreground">
                What draws your soul? (select 5-10)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={vibeProfile.interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer p-2 text-center justify-center"
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setProfileStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setProfileStep(4)}
                  disabled={vibeProfile.interests.length < 5}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {profileStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Final Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location">General Location (City, State/Country)</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={vibeProfile.location}
                  onChange={(e) => setVibeProfile(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range You're Open To</Label>
                <Select 
                  value={vibeProfile.ageRange} 
                  onValueChange={(value) => setVibeProfile(prev => ({ ...prev, ageRange: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25</SelectItem>
                    <SelectItem value="25-35">25-35</SelectItem>
                    <SelectItem value="35-45">35-45</SelectItem>
                    <SelectItem value="45-55">45-55</SelectItem>
                    <SelectItem value="55+">55+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setProfileStep(3)}>
                  Back
                </Button>
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={!vibeProfile.location.trim() || updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {updateProfileMutation.isPending ? 'Creating Soul Map...' : 'Complete Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Discovery interface (the main Tinder-like experience)
  if (currentView === 'discovery') {
    const currentMatch = potentialMatches[currentMatchIndex];
    
    return (
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Soul Discovery</h1>
            <p className="text-sm text-muted-foreground">
              {potentialMatches.length - currentMatchIndex} potential resonances
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentView('matches')}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentView('prism')}
            >
              <Unlock className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Match Card */}
        {currentMatch ? (
          <Card className="w-full h-[600px] relative overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Energy Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-xl font-semibold">Soul Resonance</h2>
                <Badge variant="secondary" className="mt-2">
                  {currentMatch.matchScore}% compatibility
                </Badge>
              </div>

              {/* Bio */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Essence</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentMatch.profile.bio}
                  </p>
                </div>

                {/* Shared Interests */}
                <div>
                  <h3 className="font-medium mb-2">Shared Resonance</h3>
                  <div className="flex flex-wrap gap-1">
                    {currentMatch.sharedInterests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Connection Type */}
                <div>
                  <h3 className="font-medium mb-2">Seeking</h3>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">
                    {CONNECTION_TYPES.find(t => t.id === currentMatch.profile.seekingConnection)?.label}
                  </Badge>
                </div>

                {/* Distance */}
                {currentMatch.distance && (
                  <div>
                    <h3 className="font-medium mb-2">Distance</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {currentMatch.distance}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300"
                  onClick={() => handleMatchAction('pass')}
                  disabled={matchActionMutation.isPending}
                >
                  <X className="h-5 w-5 mr-2 text-red-500" />
                  Pass
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => handleMatchAction('like')}
                  disabled={matchActionMutation.isPending}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Resonate
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full h-[600px] flex items-center justify-center">
            <CardContent className="text-center">
              <Compass className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No More Souls To Discover</h2>
              <p className="text-muted-foreground mb-4">
                Check back later for new potential connections
              </p>
              <Button onClick={() => setCurrentView('matches')}>
                View Your Matches
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Active matches view
  if (currentView === 'matches') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Resonance Connections</h1>
            <p className="text-muted-foreground">
              {currentMatches.length} active soul connections
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setCurrentView('discovery')}
          >
            <Compass className="h-4 w-4 mr-2" />
            Discover More
          </Button>
        </div>

        {currentMatches.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No Matches Yet</h2>
              <p className="text-muted-foreground mb-6">
                Keep exploring to find your soul resonances
              </p>
              <Button onClick={() => setCurrentView('discovery')}>
                Start Discovering
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mb-3">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <Badge variant="secondary">
                      {match.matchScore}% resonance
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      Soul connection established through energetic alignment...
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 7) + 1} days ago
                      </span>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // PrismPoint unlocks view
  if (currentView === 'prism') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">PrismPoint Moments</h1>
            <p className="text-muted-foreground">
              The consensual reveal - where soul connections become visible
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setCurrentView('discovery')}
          >
            <Compass className="h-4 w-4 mr-2" />
            Back to Discovery
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 mx-auto mb-4 text-purple-500" />
            <h2 className="text-2xl font-semibold mb-4">The Anti-Swipe Moment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              In most apps, the face comes first. In VibeMatch, the face is the reward for showing up with your truth.
              PrismPoint is the moment when both people consent to reveal more - you can choose how you want to connect.
            </p>
          </CardContent>
        </Card>

        {prismPoints.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Unlock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No PrismPoints Yet</h2>
              <p className="text-muted-foreground">
                Build deeper connections first, then unlock the moment of revelation
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prismPoints.map((point) => (
              <Card key={point.id}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mb-3">
                      {point.unlocked ? <Unlock className="h-8 w-8 text-white" /> : <Lock className="h-8 w-8 text-white" />}
                    </div>
                    <Badge variant={point.unlocked ? "default" : "secondary"}>
                      {point.unlocked ? "Unlocked" : "Pending Consent"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-center">
                      {point.unlocked 
                        ? "Both souls have consented to reveal deeper connection details"
                        : "Waiting for mutual consent to unlock PrismPoint"}
                    </p>
                    
                    {point.unlocked ? (
                      <Button className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Connection
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Awaiting Consent
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
                  <h3 className="font-medium mb-2">Seeking</h3>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600">
                    {CONNECTION_TYPES.find(t => t.id === currentMatch.profile.seekingConnection)?.label}
                  </Badge>
                </div>

                {/* Distance */}
                {currentMatch.distance && (
                  <div>
                    <h3 className="font-medium mb-2">Distance</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {currentMatch.distance}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300"
                  onClick={() => handleMatchAction('pass')}
                  disabled={matchActionMutation.isPending}
                >
                  <X className="h-5 w-5 mr-2 text-red-500" />
                  Pass
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => handleMatchAction('like')}
                  disabled={matchActionMutation.isPending}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Resonate
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full h-[600px] flex items-center justify-center">
            <CardContent className="text-center">
              <Compass className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No More Souls To Discover</h2>
              <p className="text-muted-foreground mb-4">
                Check back later for new potential connections
              </p>
              <Button onClick={() => setCurrentView('matches')}>
                View Your Matches
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Active matches view
  if (currentView === 'matches') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Resonance Connections</h1>
            <p className="text-muted-foreground">
              {currentMatches.length} active soul connections
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setCurrentView('discovery')}
          >
            <Compass className="h-4 w-4 mr-2" />
            Discover More
          </Button>
        </div>

        {currentMatches.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No Matches Yet</h2>
              <p className="text-muted-foreground mb-6">
                Keep exploring to find your soul resonances
              </p>
              <Button onClick={() => setCurrentView('discovery')}>
                Start Discovering
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMatches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mb-3">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <Badge variant="secondary">
                      {match.matchScore}% resonance
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      Soul connection established through energetic alignment...
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 7) + 1} days ago
                      </span>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // PrismPoint unlocks view
  if (currentView === 'prism') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">PrismPoint Moments</h1>
            <p className="text-muted-foreground">
              The consensual reveal - where soul connections become visible
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => setCurrentView('discovery')}
          >
            <Compass className="h-4 w-4 mr-2" />
            Back to Discovery
          </Button>
        </div>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-8 text-center">
            <Lock className="h-16 w-16 mx-auto mb-4 text-purple-500" />
            <h2 className="text-2xl font-semibold mb-4">The Anti-Swipe Moment</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              In most apps, the face comes first. In VibeMatch, the face is the reward for showing up with your truth.
              PrismPoint is the moment when both people consent to reveal more - you can choose how you want to connect.
            </p>
          </CardContent>
        </Card>

        {prismPoints.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Unlock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No PrismPoints Yet</h2>
              <p className="text-muted-foreground">
                Build deeper connections first, then unlock the moment of revelation
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prismPoints.map((point) => (
              <Card key={point.id}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mb-3">
                      {point.unlocked ? <Unlock className="h-8 w-8 text-white" /> : <Lock className="h-8 w-8 text-white" />}
                    </div>
                    <Badge variant={point.unlocked ? "default" : "secondary"}>
                      {point.unlocked ? "Unlocked" : "Pending Consent"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-center">
                      {point.unlocked 
                        ? "Both souls have consented to reveal deeper connection details"
                        : "Waiting for mutual consent to unlock PrismPoint"}
                    </p>
                    
                    {point.unlocked ? (
                      <Button className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Connection
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Awaiting Consent
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
