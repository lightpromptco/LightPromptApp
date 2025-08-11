import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MapPin, Brain, Eye, Calendar, Star, Clock, Users, Target } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// GeoPrompt Component
function GeoPromptExplorer() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ["/api/geoprompt/locations"],
  });

  const visitLocationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/geoprompt/visits", data);
    },
    onSuccess: () => {
      toast({
        title: "Location Visited",
        description: "Your reflection has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/geoprompt/locations"] });
    },
  });

  const handleVisitLocation = (location: any) => {
    setSelectedLocation(location);
  };

  const handleSaveReflection = (reflection: string) => {
    if (selectedLocation) {
      visitLocationMutation.mutate({
        locationId: selectedLocation.id,
        response: reflection,
        rating: 5,
        mood: "peaceful",
      });
      setSelectedLocation(null);
    }
  };

  if (locationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">GeoPrompt Explorer</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Discover mindful locations for reflection and growth
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(locations as any[])?.map((location: any) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <CardTitle className="text-lg">{location.title}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {location.promptType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {location.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{location.visitCount} visits</span>
                </div>
                {location.averageRating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{location.averageRating}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {location.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button 
                onClick={() => handleVisitLocation(location)}
                className="w-full"
                size="sm"
              >
                Visit Location
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{selectedLocation.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedLocation.description}
              </p>
              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Share your reflection on this location..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSaveReflection((e.target as HTMLTextAreaElement).value);
                  }
                }}
              />
              <div className="flex space-x-2">
                <Button 
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      handleSaveReflection(textarea.value);
                    }
                  }}
                  className="flex-1"
                  disabled={visitLocationMutation.isPending}
                >
                  Save Reflection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedLocation(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// VisionQuest Component
function VisionQuestTraining() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeQuest, setActiveQuest] = useState<any>(null);
  const [userResponse, setUserResponse] = useState("");

  const { data: quests, isLoading: questsLoading } = useQuery({
    queryKey: ["/api/visionquest/quests"],
  });

  const completeQuestMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/visionquest/progress", data);
    },
    onSuccess: () => {
      toast({
        title: "Quest Completed",
        description: "Your intuitive response has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/visionquest/quests"] });
      setActiveQuest(null);
      setUserResponse("");
    },
  });

  const handleStartQuest = (quest: any) => {
    setActiveQuest(quest);
  };

  const handleCompleteQuest = () => {
    if (activeQuest) {
      completeQuestMutation.mutate({
        questId: activeQuest.id,
        userResponse,
        emotionalState: "focused",
        confidence: "medium",
      });
    }
  };

  if (questsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">VisionQuest Training</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Develop your intuitive abilities through guided practice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(quests as any[])?.map((quest: any) => (
          <Card key={quest.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">{quest.title}</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {quest.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {quest.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{quest.estimatedTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{quest.questType}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {quest.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button 
                onClick={() => handleStartQuest(quest)}
                className="w-full"
                size="sm"
              >
                Start Quest
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeQuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{activeQuest?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Instructions:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activeQuest?.instructions}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Success Criteria:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {activeQuest?.successCriteria}
                </p>
              </div>

              <textarea
                className="w-full p-3 border rounded-md resize-none"
                rows={4}
                placeholder="Share your intuitive response..."
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
              />
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCompleteQuest}
                  className="flex-1"
                  disabled={completeQuestMutation.isPending || !userResponse.trim()}
                >
                  Complete Quest
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveQuest(null);
                    setUserResponse("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// VibeMatch Component
function VibeMatchExplorer() {
  const { toast } = useToast();
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/vibematch/profiles"],
  });

  if (profilesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">VibeMatch Explorer</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Connect with career-aligned professionals through resonance matching
        </p>
      </div>

      <div className="text-center">
        <Button onClick={() => setShowCreateProfile(true)}>
          Create Your Profile
        </Button>
      </div>

      {(profiles as any[])?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(profiles as any[]).map((profile: any) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{profile.displayName}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {profile.experience}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {profile.bio}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium">Career Field:</div>
                  <Badge variant="outline">{profile.careerField}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium">Current Role:</div>
                  <div className="text-sm">{profile.currentRole}</div>
                </div>

                <Button className="w-full" size="sm">
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No profiles found. Be the first to create one!</p>
        </div>
      )}
    </div>
  );
}

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            LightPrompt Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our three core features designed to enhance your personal and professional growth
          </p>
        </div>

        <Tabs defaultValue="geoprompt" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="geoprompt" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>GeoPrompt</span>
            </TabsTrigger>
            <TabsTrigger value="visionquest" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>VisionQuest</span>
            </TabsTrigger>
            <TabsTrigger value="vibematch" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>VibeMatch</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="geoprompt">
            <GeoPromptExplorer />
          </TabsContent>

          <TabsContent value="visionquest">
            <VisionQuestTraining />
          </TabsContent>

          <TabsContent value="vibematch">
            <VibeMatchExplorer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}