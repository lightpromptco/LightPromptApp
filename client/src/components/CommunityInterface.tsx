import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CommunityInterfaceProps {
  userId: string;
}

export function CommunityInterface({ userId }: CommunityInterfaceProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general',
    photos: [] as File[],
    photoPreviewUrls: [] as string[]
  });
  const [photoApprovalStatus, setPhotoApprovalStatus] = useState<{
    [key: string]: 'pending' | 'approved' | 'rejected'
  }>({});

  const handleJoinCommunity = () => {
    setIsJoined(true);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + newPost.photos.length > 3) {
      alert('Maximum 3 photos allowed per post');
      return;
    }

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setNewPost({
      ...newPost,
      photos: [...newPost.photos, ...files],
      photoPreviewUrls: [...newPost.photoPreviewUrls, ...newPreviewUrls]
    });

    // Simulate AI content approval (in real app, this would be an API call)
    files.forEach((file, index) => {
      const photoId = `${Date.now()}_${index}`;
      setPhotoApprovalStatus(prev => ({ ...prev, [photoId]: 'pending' }));
      
      // Simulate AI approval after 2 seconds
      setTimeout(() => {
        const isApproved = Math.random() > 0.1; // 90% approval rate for demo
        setPhotoApprovalStatus(prev => ({ 
          ...prev, 
          [photoId]: isApproved ? 'approved' : 'rejected'
        }));
      }, 2000);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = newPost.photos.filter((_, i) => i !== index);
    const newPreviewUrls = newPost.photoPreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newPost.photoPreviewUrls[index]);
    
    setNewPost({
      ...newPost,
      photos: newPhotos,
      photoPreviewUrls: newPreviewUrls
    });
  };

  const handleCreatePost = () => {
    // TODO: Implement post creation
    console.log('Creating post:', newPost);
    
    // Clean up photo preview URLs
    newPost.photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setNewPost({ 
      title: '', 
      content: '', 
      category: 'general',
      photos: [],
      photoPreviewUrls: []
    });
    setPhotoApprovalStatus({});
  };

  if (!isJoined) {
    return (
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-users text-white text-xl"></i>
            </div>
            <CardTitle className="text-2xl">Welcome to the LightPrompt Community</CardTitle>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join a supportive space where souls connect through authentic wellness journeys. 
              Share insights, find accountability partners, and grow together.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-heart text-purple-600"></i>
                </div>
                <h3 className="font-semibold">Authentic Connection</h3>
                <p className="text-sm text-gray-600">
                  Connect with like-minded souls on similar wellness journeys
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-comments text-green-600"></i>
                </div>
                <h3 className="font-semibold">Safe Space</h3>
                <p className="text-sm text-gray-600">
                  Share vulnerably in a judgment-free, supportive environment
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-seedling text-blue-600"></i>
                </div>
                <h3 className="font-semibold">Grow Together</h3>
                <p className="text-sm text-gray-600">
                  Participate in challenges, share wins, and support each other
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleJoinCommunity}
              size="lg"
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              <i className="fas fa-door-open mr-2"></i>
              Join the Community (Free)
            </Button>
            
            <p className="text-sm text-gray-600 mt-4">
              ✨ Free community access unlocks automatically when you create your account
            </p>
          </CardContent>
        </Card>

        {/* Community Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Community Preview</CardTitle>
            <p className="text-sm text-gray-600">
              Here's what's happening in the LightPrompt community
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample Posts */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">S</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sarah M.</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Mindfulness</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  "Started my morning with the LightPrompt breathing exercise. The AI reflection 
                  helped me realize I've been carrying tension I didn't even notice. Grateful for this awareness! 🙏"
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <i className="fas fa-heart mr-1"></i>
                    12 hearts
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-comment mr-1"></i>
                    3 responses
                  </span>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">M</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Marcus L.</p>
                    <p className="text-xs text-gray-600">5 hours ago</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Habit Building</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  "Week 3 of tracking sleep patterns with BodyMirror. The insights about my 
                  energy cycles are game-changing. Anyone else notice patterns they never saw before?"
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <i className="fas fa-heart mr-1"></i>
                    8 hearts
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-comment mr-1"></i>
                    7 responses
                  </span>
                </div>
              </div>

              <div className="text-center py-4">
                <p className="text-sm text-gray-600 mb-3">
                  Join to see more posts and participate in discussions
                </p>
                <Button variant="outline" onClick={handleJoinCommunity}>
                  Join Community
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <i className="fas fa-check text-white"></i>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Welcome to the Community!</h3>
              <p className="text-sm text-green-700">
                You're now part of our supportive wellness tribe. Share, connect, and grow together.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="circles">Wellness Circles</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>

        {/* Community Feed */}
        <TabsContent value="feed" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Community Feed</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <i className="fas fa-filter mr-2"></i>
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <i className="fas fa-sort mr-2"></i>
                Sort
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Community Posts */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">S</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-medium">Sarah M.</p>
                      <Badge variant="outline" className="text-xs">Mindfulness</Badge>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Started my morning with the LightPrompt breathing exercise. The AI reflection 
                      helped me realize I've been carrying tension I didn't even notice. Grateful for this awareness! 🙏
                    </p>
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-heart mr-2 text-red-500"></i>
                        12
                      </Button>
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-comment mr-2 text-blue-500"></i>
                        3
                      </Button>
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-share mr-2 text-green-500"></i>
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">M</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <p className="font-medium">Marcus L.</p>
                      <Badge variant="outline" className="text-xs">Habit Building</Badge>
                      <span className="text-xs text-gray-500">5 hours ago</span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      Week 3 of tracking sleep patterns with BodyMirror. The insights about my 
                      energy cycles are game-changing. Anyone else notice patterns they never saw before?
                    </p>
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-heart mr-2 text-red-500"></i>
                        8
                      </Button>
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-comment mr-2 text-blue-500"></i>
                        7
                      </Button>
                      <Button variant="ghost" size="sm">
                        <i className="fas fa-share mr-2 text-green-500"></i>
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Challenges */}
        <TabsContent value="challenges" className="space-y-6">
          <h3 className="text-lg font-semibold">Community Challenges</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-calendar-check text-blue-600 mr-2"></i>
                  7-Day Mindfulness Challenge
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Daily reflection practices with community support
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Participants:</span>
                    <Badge>247 souls</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time left:</span>
                    <span className="text-sm font-medium">3 days</span>
                  </div>
                  <Button size="sm" className="w-full">
                    Join Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-seedling text-green-600 mr-2"></i>
                  30-Day Habit Builder
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Build one meaningful habit with group accountability
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Participants:</span>
                    <Badge>89 souls</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Starting:</span>
                    <span className="text-sm font-medium">Feb 1st</span>
                  </div>
                  <Button size="sm" className="w-full" variant="outline">
                    Sign Up
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Wellness Circles */}
        <TabsContent value="circles" className="space-y-6">
          <h3 className="text-lg font-semibold">Wellness Circles</h3>
          <p className="text-gray-600">
            Small groups focused on specific wellness topics and mutual support
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anxiety & Mindfulness Circle</CardTitle>
                <p className="text-sm text-gray-600">
                  8 members • Weekly check-ins • Guided by Sarah T.
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  A supportive space for those working with anxiety through mindfulness practices.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Request to Join
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sleep & Recovery Circle</CardTitle>
                <p className="text-sm text-gray-600">
                  12 members • Bi-weekly • Guided by Dr. Marcus L.
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Focus on optimizing sleep patterns and recovery for better wellness.
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Request to Join
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Create Post */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share with the Community</CardTitle>
              <p className="text-sm text-gray-600">
                What's on your heart today? Share your insights, questions, or wins.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Post Title</label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  placeholder="What's this about?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                >
                  <option value="general">General Discussion</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="habits">Habit Building</option>
                  <option value="relationships">Relationships</option>
                  <option value="wellness">Physical Wellness</option>
                  <option value="spirituality">Spirituality</option>
                  <option value="wins">Wins & Celebrations</option>
                  <option value="support">Support Needed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your Message</label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Share what's on your heart..."
                  rows={5}
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Photos (optional)</label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer border border-gray-300"
                    >
                      <i className="fas fa-camera mr-2 text-gray-600"></i>
                      <span className="text-sm text-gray-700">Add Photos</span>
                    </label>
                    <span className="text-xs text-gray-500">Max 3 photos • AI content approval required</span>
                  </div>

                  {/* Photo Previews */}
                  {newPost.photoPreviewUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {newPost.photoPreviewUrls.map((url, index) => {
                        const photoId = `${Date.now()}_${index}`;
                        const approvalStatus = photoApprovalStatus[photoId] || 'pending';
                        
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            
                            {/* AI Approval Status */}
                            <div className="absolute bottom-1 left-1">
                              {approvalStatus === 'pending' && (
                                <Badge className="bg-yellow-500 text-xs px-1 py-0.5">
                                  <i className="fas fa-clock mr-1"></i>
                                  AI Review
                                </Badge>
                              )}
                              {approvalStatus === 'approved' && (
                                <Badge className="bg-green-500 text-xs px-1 py-0.5">
                                  <i className="fas fa-check mr-1"></i>
                                  Approved
                                </Badge>
                              )}
                              {approvalStatus === 'rejected' && (
                                <Badge className="bg-red-500 text-xs px-1 py-0.5">
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
              
              <Button 
                onClick={handleCreatePost}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600"
                disabled={!newPost.title || !newPost.content}
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Share with Community
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}