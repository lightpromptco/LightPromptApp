import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current user
  const { data: user } = useQuery({
    queryKey: ['/api/users/email/lightprompt.co@gmail.com'],
  });

  // Get community posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['/api/community/posts', selectedFilter],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Get wellness circles
  const { data: wellnessCircles = [] } = useQuery({
    queryKey: ['/api/wellness-circles'],
    refetchInterval: 30000,
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return apiRequest("POST", "/api/community/posts", postData);
    },
    onSuccess: () => {
      setNewPost("");
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      toast({
        title: "Post Shared",
        description: "Your reflection has been shared with the community.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to share post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Join circle mutation
  const joinCircleMutation = useMutation({
    mutationFn: async (circleId: string) => {
      return apiRequest("POST", `/api/wellness-circles/${circleId}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wellness-circles'] });
      toast({
        title: "Joined Circle",
        description: "You've joined the wellness circle!",
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.trim() || !user) return;
    
    createPostMutation.mutate({
      content: newPost,
      userId: user.id,
      type: 'reflection',
      isPublic: true,
    });
  };

  const handleJoinCircle = (circleId: string) => {
    joinCircleMutation.mutate(circleId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Community Hub</h1>
        <p className="text-muted-foreground">Connect with fellow soul-tech travelers</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Active Members</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Daily Reflections</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">GeoPrompt Check-ins</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Post */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Reflection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What insights are you reflecting on today?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleCreatePost} 
            disabled={!newPost.trim() || createPostMutation.isPending}
            className="w-full"
          >
            {createPostMutation.isPending ? "Sharing..." : "Share Reflection"}
          </Button>
        </CardContent>
      </Card>

      {/* Wellness Circles */}
      <Card>
        <CardHeader>
          <CardTitle>Wellness Circles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wellnessCircles.map((circle: any) => (
              <div key={circle.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{circle.name}</h4>
                    <p className="text-sm text-muted-foreground">{circle.description}</p>
                  </div>
                  <Badge variant="secondary">{circle.memberCount || 0} members</Badge>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleJoinCircle(circle.id)}
                  disabled={joinCircleMutation.isPending}
                >
                  Join Circle
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {["all", "reflections", "geoprompt", "challenges"].map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Community Posts */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading community posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No posts yet. Be the first to share!
          </div>
        ) : (
          posts.map((post: any) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage src={post.user?.avatarUrl} />
                    <AvatarFallback>{post.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{post.user?.name || "Anonymous"}</span>
                      <Badge variant="outline">{post.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{post.content}</p>
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes || 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments || 0}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}