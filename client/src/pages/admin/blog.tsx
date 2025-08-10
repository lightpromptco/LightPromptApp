import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  date: string;
  url?: string;
}

interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
}

export default function AdminBlog() {
  const [activeTab, setActiveTab] = useState<'posts' | 'links'>('posts');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const { toast } = useToast();

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'The Future of Conscious AI',
      excerpt: 'Exploring how AI can serve as a mirror for human consciousness...',
      content: '',
      status: 'published',
      date: '2025-08-10',
      url: 'https://lightprompt.co/blog/future-conscious-ai'
    }
  ]);

  const [links, setLinks] = useState<Link[]>([
    {
      id: '1',
      title: 'LightPrompt Course',
      url: '/store',
      description: 'Complete conscious AI wellness course',
      category: 'Product'
    },
    {
      id: '2', 
      title: 'Soul Map Navigator',
      url: '/woo-woo',
      description: 'Birth chart analysis tool',
      category: 'Feature'
    }
  ]);

  const handleSavePost = () => {
    if (!editingPost) return;
    
    if (editingPost.id === 'new') {
      const newPost = {
        ...editingPost,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      setBlogPosts([...blogPosts, newPost]);
    } else {
      setBlogPosts(posts => posts.map(p => p.id === editingPost.id ? editingPost : p));
    }
    
    setEditingPost(null);
    toast({
      title: "Post Saved",
      description: "Blog post has been saved successfully.",
    });
  };

  const handleSaveLink = () => {
    if (!editingLink) return;
    
    if (editingLink.id === 'new') {
      const newLink = {
        ...editingLink,
        id: Date.now().toString()
      };
      setLinks([...links, newLink]);
    } else {
      setLinks(prevLinks => prevLinks.map(l => l.id === editingLink.id ? editingLink : l));
    }
    
    setEditingLink(null);
    toast({
      title: "Link Saved",
      description: "Link has been saved successfully.",
    });
  };

  const deletePost = (id: string) => {
    setBlogPosts(posts => posts.filter(p => p.id !== id));
    toast({
      title: "Post Deleted",
      description: "Blog post has been deleted.",
    });
  };

  const deleteLink = (id: string) => {
    setLinks(prevLinks => prevLinks.filter(l => l.id !== id));
    toast({
      title: "Link Deleted", 
      description: "Link has been deleted.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Blog & Links Manager
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your content and external links
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={activeTab === 'posts' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('posts')}
              className="px-6"
            >
              Blog Posts
            </Button>
            <Button
              variant={activeTab === 'links' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('links')}
              className="px-6"
            >
              Links
            </Button>
          </div>
        </div>

        {activeTab === 'posts' && (
          <div className="max-w-4xl mx-auto">
            {!editingPost ? (
              <>
                {/* Add New Post Button */}
                <div className="mb-6">
                  <Button
                    onClick={() => setEditingPost({
                      id: 'new',
                      title: '',
                      excerpt: '',
                      content: '',
                      status: 'draft',
                      date: '',
                    })}
                  >
                    <PlusCircle className="mr-2" size={16} />
                    New Blog Post
                  </Button>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                  {blogPosts.map(post => (
                    <Card key={post.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                              {post.status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingPost(post)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePost(post.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{post.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{post.date}</span>
                          {post.url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={post.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={16} />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              /* Edit Post Form */
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingPost.id === 'new' ? 'New Blog Post' : 'Edit Blog Post'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Post Title"
                    value={editingPost.title}
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  />
                  
                  <Textarea
                    placeholder="Excerpt"
                    value={editingPost.excerpt}
                    onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                    rows={2}
                  />
                  
                  <Input
                    placeholder="External URL (optional)"
                    value={editingPost.url || ''}
                    onChange={(e) => setEditingPost({...editingPost, url: e.target.value})}
                  />
                  
                  <Textarea
                    placeholder="Content"
                    value={editingPost.content}
                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                    rows={8}
                  />
                  
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button
                        variant={editingPost.status === 'draft' ? 'default' : 'outline'}
                        onClick={() => setEditingPost({...editingPost, status: 'draft'})}
                      >
                        Save as Draft
                      </Button>
                      <Button
                        variant={editingPost.status === 'published' ? 'default' : 'outline'}
                        onClick={() => setEditingPost({...editingPost, status: 'published'})}
                      >
                        Publish
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setEditingPost(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSavePost}>
                        Save Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="max-w-4xl mx-auto">
            {!editingLink ? (
              <>
                {/* Add New Link Button */}
                <div className="mb-6">
                  <Button
                    onClick={() => setEditingLink({
                      id: 'new',
                      title: '',
                      url: '',
                      description: '',
                      category: ''
                    })}
                  >
                    <PlusCircle className="mr-2" size={16} />
                    New Link
                  </Button>
                </div>

                {/* Links List */}
                <div className="space-y-4">
                  {links.map(link => (
                    <Card key={link.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{link.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{link.category}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingLink(link)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteLink(link.id)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{link.description}</p>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} className="mr-2" />
                            {link.url}
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              /* Edit Link Form */
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingLink.id === 'new' ? 'New Link' : 'Edit Link'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Link Title"
                    value={editingLink.title}
                    onChange={(e) => setEditingLink({...editingLink, title: e.target.value})}
                  />
                  
                  <Input
                    placeholder="URL"
                    value={editingLink.url}
                    onChange={(e) => setEditingLink({...editingLink, url: e.target.value})}
                  />
                  
                  <Input
                    placeholder="Category"
                    value={editingLink.category}
                    onChange={(e) => setEditingLink({...editingLink, category: e.target.value})}
                  />
                  
                  <Textarea
                    placeholder="Description"
                    value={editingLink.description}
                    onChange={(e) => setEditingLink({...editingLink, description: e.target.value})}
                    rows={3}
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditingLink(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveLink}>
                      Save Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}