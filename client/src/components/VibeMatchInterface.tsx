import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { VibeProfile, VibeMatch, PrismPoint } from '@shared/schema';
import { SecureMatchChat } from './SecureMatchChat';

interface VibeMatchInterfaceProps {
  userId: string;
}

interface PotentialMatch {
  profile: VibeProfile;
  matchScore: number;
  distance?: string;
  sharedInterests: string[];
}

export function VibeMatchInterface({ userId }: VibeMatchInterfaceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState<'profile' | 'discovery' | 'matches' | 'prism' | 'chat'>('profile');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<VibeMatch | null>(null);

  // Get user's vibe profile
  const { data: vibeProfile, isLoading: profileLoading } = useQuery<VibeProfile>({
    queryKey: ['/api/vibe-profile', userId],
    queryFn: async () => {
      const response = await fetch(`/api/vibe-profile/${userId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch vibe profile');
      }
      return response.json();
    },
  });

  // Get potential matches
  const { data: potentialMatches, isLoading: matchesLoading } = useQuery<PotentialMatch[]>({
    queryKey: ['/api/vibe-matches/potential', userId],
    queryFn: async () => {
      const response = await fetch(`/api/vibe-matches/potential/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch potential matches');
      return response.json();
    },
    enabled: !!vibeProfile?.profileComplete,
  });

  // Get current matches
  const { data: currentMatches } = useQuery<VibeMatch[]>({
    queryKey: ['/api/vibe-matches/current', userId],
    queryFn: async () => {
      const response = await fetch(`/api/vibe-matches/current/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch current matches');
      return response.json();
    },
    enabled: !!vibeProfile?.profileComplete,
  });

  // Get prism points
  const { data: prismPoints } = useQuery<PrismPoint[]>({
    queryKey: ['/api/prism-points', userId],
    queryFn: async () => {
      const response = await fetch(`/api/prism-points/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch prism points');
      return response.json();
    },
  });

  // Create/update vibe profile mutation
  const profileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await fetch('/api/vibe-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...profileData }),
      });
      if (!response.ok) throw new Error('Failed to save vibe profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vibe-profile'] });
      toast({
        title: "Profile saved!",
        description: "Your vibe profile has been updated. Ready to find your soul connections!",
      });
      setCurrentView('discovery');
    },
  });

  // Match action mutation (like/pass)
  const matchActionMutation = useMutation({
    mutationFn: async ({ matchUserId, action }: { matchUserId: string; action: 'like' | 'pass' }) => {
      const response = await fetch('/api/vibe-matches/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, matchUserId, action }),
      });
      if (!response.ok) throw new Error('Failed to process match action');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.matched) {
        toast({
          title: "Soul Connection Made! ✨",
          description: "You have a mutual match! Keep connecting to unlock Prism Point.",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/vibe-matches'] });
      setCurrentMatchIndex(prev => prev + 1);
    },
  });

  const currentMatch = potentialMatches?.[currentMatchIndex];

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your vibe profile...</p>
        </div>
      </div>
    );
  }

  // Profile setup view
  if (!vibeProfile || !vibeProfile.profileComplete) {
    return <VibeProfileSetup onSave={(data) => profileMutation.mutate(data)} isLoading={profileMutation.isPending} />;
  }

  // Main VibeMatch interface
  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex space-x-2 border-b border-gray-200">
        {[
          { id: 'profile', label: 'My Vibe', icon: 'fas fa-user-circle' },
          { id: 'discovery', label: 'Discover', icon: 'fas fa-heart' },
          { id: 'matches', label: 'Connections', icon: 'fas fa-users' },
          { id: 'prism', label: 'Prism Points', icon: 'fas fa-gem' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id as any)}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              currentView === tab.id
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-pink-500'
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile View */}
      {currentView === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Vibe Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Bio</h4>
                <p className="text-sm text-gray-600">{vibeProfile.bio}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-sm text-gray-600">{vibeProfile.location}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Interests</h4>
                <div className="flex flex-wrap gap-1">
                  {vibeProfile.interests?.map((interest, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Vibe Words</h4>
                <div className="flex flex-wrap gap-1">
                  {vibeProfile.vibeWords?.map((word, i) => (
                    <Badge key={i} className="text-xs bg-pink-100 text-pink-700">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button
              onClick={() => profileMutation.mutate({
                ...vibeProfile,
                profileComplete: false,
              })}
              variant="outline"
            >
              <i className="fas fa-edit mr-2"></i>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Discovery View - Tinder-like interface */}
      {currentView === 'discovery' && (
        <div className="space-y-6">
          {matchesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600">Finding your soul connections...</p>
              </div>
            </div>
          ) : currentMatch ? (
            <div className="max-w-md mx-auto">
              <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 overflow-hidden">
                {/* Match Card */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-4xl text-gray-400"></i>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-pink-600">
                      {currentMatch.matchScore}% match
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Anonymous Soul</h3>
                      <p className="text-sm text-gray-600">
                        {currentMatch.distance && `${currentMatch.distance} away`}
                      </p>
                    </div>

                    <p className="text-sm text-gray-700">{currentMatch.profile.bio}</p>

                    <div>
                      <h4 className="font-semibold mb-2">Shared Vibes</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentMatch.sharedInterests.map((interest, i) => (
                          <Badge key={i} className="text-xs bg-purple-100 text-purple-700">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Energy Words</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentMatch.profile.vibeWords?.slice(0, 3).map((word, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4 pb-6">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-16 h-16 rounded-full border-red-200 hover:bg-red-50"
                    onClick={() => matchActionMutation.mutate({
                      matchUserId: currentMatch.profile.userId,
                      action: 'pass'
                    })}
                    disabled={matchActionMutation.isPending}
                  >
                    <i className="fas fa-times text-xl text-red-500"></i>
                  </Button>
                  <Button
                    size="lg"
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    onClick={() => matchActionMutation.mutate({
                      matchUserId: currentMatch.profile.userId,
                      action: 'like'
                    })}
                    disabled={matchActionMutation.isPending}
                  >
                    <i className="fas fa-heart text-xl text-white"></i>
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-heart text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No More Souls to Discover</h3>
              <p className="text-gray-600">Check back later for new connections!</p>
            </div>
          )}
        </div>
      )}

      {/* Chat View */}
      {currentView === 'chat' && selectedMatch && (
        <SecureMatchChat
          match={selectedMatch}
          currentUserId={userId}
          onBack={() => {
            setCurrentView('matches');
            setSelectedMatch(null);
          }}
        />
      )}

      {/* Matches View */}
      {currentView === 'matches' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Soul Connections</h3>
          {currentMatches?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMatches.map((match) => (
                <Card 
                  key={match.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer" 
                  onClick={() => {
                    setSelectedMatch(match);
                    setCurrentView('chat');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-white"></i>
                        </div>
                        <div>
                          <h4 className="font-semibold">Anonymous Soul</h4>
                          <p className="text-xs text-gray-600">Matched recently</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {match.resonanceCount || 0}/3 resonance
                      </Badge>
                    </div>
                    
                    {(match.resonanceCount || 0) >= 3 ? (
                      <div className="text-center">
                        <div className="w-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mb-3">
                          <i className="fas fa-gem text-purple-600 text-lg mb-1"></i>
                          <p className="text-sm font-semibold text-purple-700">
                            Prism Point Ready!
                          </p>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-600">
                          <i className="fas fa-unlock mr-2"></i>
                          Unlock Connection
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Progress value={((match.resonanceCount || 0) / 3) * 100} className="mb-2" />
                        <p className="text-xs text-gray-600 text-center">
                          {3 - (match.resonanceCount || 0)} more resonance interactions needed
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
              <h4 className="text-lg font-medium text-gray-700 mb-2">No Connections Yet</h4>
              <p className="text-gray-600 mb-4">Start discovering souls to build your connections!</p>
              <Button onClick={() => setCurrentView('discovery')}>
                <i className="fas fa-heart mr-2"></i>
                Start Discovering
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Prism Points View */}
      {currentView === 'prism' && (
        <div className="space-y-4">
          <div className="text-center">
            <i className="fas fa-gem text-4xl text-purple-500 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Prism Points</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              After 3 resonance matches, you and your soul connection can choose to unlock deeper connection 
              and exchange contact information through Prism Point.
            </p>
          </div>
          
          {prismPoints?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prismPoints.map((point) => (
                <Card key={point.id} className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <i className="fas fa-gem text-3xl text-purple-600"></i>
                      <h4 className="font-semibold">Soul Connection Unlocked</h4>
                      {point.unlocked ? (
                        <div className="space-y-2">
                          <Badge className="bg-green-100 text-green-700">Prism Point Active</Badge>
                          <p className="text-sm text-gray-600">
                            You can now exchange contact information with your soul connection.
                          </p>
                          <Button size="sm">
                            <i className="fas fa-envelope mr-2"></i>
                            View Contact Info
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Badge variant="outline">Waiting for Mutual Consent</Badge>
                          <p className="text-sm text-gray-600">
                            Both souls must agree to unlock this Prism Point.
                          </p>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-purple-500 to-pink-600"
                          >
                            <i className="fas fa-key mr-2"></i>
                            Give Consent to Unlock
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-gem text-4xl text-gray-300 mb-4"></i>
              <h4 className="text-lg font-medium text-gray-700 mb-2">No Prism Points Yet</h4>
              <p className="text-gray-600 mb-4">
                Build deeper connections through 3 resonance matches to unlock Prism Points!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Profile setup component
function VibeProfileSetup({ onSave, isLoading }: { onSave: (data: any) => void; isLoading: boolean }) {
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    interests: [] as string[],
    vibeWords: [] as string[],
    seekingConnection: '',
    ageRange: '',
  });

  const [interestInput, setInterestInput] = useState('');
  const [vibeWordInput, setVibeWordInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      profileComplete: true,
    });
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  const addVibeWord = () => {
    if (vibeWordInput.trim() && !formData.vibeWords.includes(vibeWordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        vibeWords: [...prev.vibeWords, vibeWordInput.trim()]
      }));
      setVibeWordInput('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Create Your Vibe Profile</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Set up your soul connection profile to start discovering like-minded beings
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="bio">Your Vibe Bio</Label>
            <Textarea
              id="bio"
              placeholder="Share your journey, what lights you up, and what you're seeking in soul connections..."
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State/Region"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="seekingConnection">What are you seeking?</Label>
              <Select value={formData.seekingConnection} onValueChange={(value) => setFormData(prev => ({ ...prev, seekingConnection: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Type of connection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendship">Friendship</SelectItem>
                  <SelectItem value="growth_partner">Growth Partner</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="mentee">Mentee</SelectItem>
                  <SelectItem value="spiritual_companion">Spiritual Companion</SelectItem>
                  <SelectItem value="accountability_buddy">Accountability Buddy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="ageRange">Age Range</Label>
            <Select value={formData.ageRange} onValueChange={(value) => setFormData(prev => ({ ...prev, ageRange: value }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select age range" />
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

          <div>
            <Label>Interests & Passions</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                placeholder="Add an interest..."
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button type="button" onClick={addInterest} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.interests.map((interest, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    interests: prev.interests.filter((_, index) => index !== i)
                  }))}
                >
                  {interest} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Vibe Words (describe your energy)</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                placeholder="Add a vibe word..."
                value={vibeWordInput}
                onChange={(e) => setVibeWordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVibeWord())}
              />
              <Button type="button" onClick={addVibeWord} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.vibeWords.map((word, i) => (
                <Badge
                  key={i}
                  className="bg-pink-100 text-pink-700 cursor-pointer"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    vibeWords: prev.vibeWords.filter((_, index) => index !== i)
                  }))}
                >
                  {word} ×
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            disabled={isLoading || !formData.bio || !formData.location || !formData.seekingConnection || !formData.ageRange}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Creating Your Vibe...
              </>
            ) : (
              <>
                <i className="fas fa-heart mr-2"></i>
                Start Soul Discovery
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}