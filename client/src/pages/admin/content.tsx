import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Plus, 
  Edit3, 
  Eye, 
  EyeOff, 
  Search, 
  Image, 
  Save,
  Trash2,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const TEMPLATES = [
  { value: "standard", label: "Standard Page" },
  { value: "landing", label: "Landing Page" },
  { value: "minimal", label: "Minimal Page" },
];

const FONT_OPTIONS = [
  { value: "default", label: "Default (Inter)" },
  { value: "serif", label: "Serif (Georgia)" },
  { value: "mono", label: "Monospace (Monaco)" },
  { value: "display", label: "Display (Playfair)" },
];

export default function ContentManagement() {
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all content pages
  // Fetch real page data from the pages database
  const { data: pages = [], isLoading, error } = useQuery({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const response = await fetch('/api/pages');
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      return response.json();
    },
    refetchInterval: 30000,
    retry: 1,
  });

  // Get media assets
  const { data: mediaAssets = [] } = useQuery({
    queryKey: ['/api/content/media'],
    queryFn: () => Promise.resolve([]),
    enabled: showMediaLibrary,
  });

  // Create or update page mutation
  const updatePageMutation = useMutation({
    mutationFn: async (pageData: any) => {
      if (pageData.id) {
        return await apiRequest("PUT", `/api/content/pages/${pageData.id}`, pageData);
      } else {
        return await apiRequest("POST", "/api/content/pages", pageData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/pages'] });
      toast({
        title: "Success",
        description: "Page saved successfully!",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to save page. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete page mutation
  const deletePageMutation = useMutation({
    mutationFn: async (pageId: string) => {
      return await apiRequest("DELETE", `/api/content/pages/${pageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/content/pages'] });
      toast({
        title: "Success",
        description: "Page deleted successfully!",
      });
      setSelectedPage(null);
    },
  });

  const filteredPages = pages.filter((page: any) =>
    page.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.route?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSavePage = (formData: FormData) => {
    const pageData = {
      id: selectedPage?.id,
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      content: {
        body: formData.get('content') as string,
        fontFamily: formData.get('fontFamily') as string,
        customCss: formData.get('customCss') as string,
      },
      template: formData.get('template') as string,
      isPublished: formData.get('isPublished') === 'on',
      seoTitle: formData.get('seoTitle') as string,
      seoKeywords: (formData.get('seoKeywords') as string)?.split(',').map(k => k.trim()).filter(Boolean) || [],
      featuredImage: formData.get('featuredImage') as string,
    };

    updatePageMutation.mutate(pageData);
  };

  const createNewPage = () => {
    setSelectedPage({
      title: "New Page",
      slug: "new-page",
      description: "",
      content: { body: "", fontFamily: "default", customCss: "" },
      template: "standard",
      isPublished: false,
      seoTitle: "",
      seoKeywords: [],
      featuredImage: "",
    });
    setIsEditing(true);
  };

  const insertMediaIntoContent = (mediaUrl: string) => {
    const contentTextarea = document.getElementById('content') as HTMLTextAreaElement;
    if (contentTextarea) {
      const cursorPos = contentTextarea.selectionStart;
      const textBefore = contentTextarea.value.substring(0, cursorPos);
      const textAfter = contentTextarea.value.substring(cursorPos);
      const imageMarkdown = `![Image](${mediaUrl})`;
      contentTextarea.value = textBefore + imageMarkdown + textAfter;
      contentTextarea.focus();
      contentTextarea.setSelectionRange(cursorPos + imageMarkdown.length, cursorPos + imageMarkdown.length);
    }
    setShowMediaLibrary(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Content Management
          </h1>
          <p className="text-muted-foreground">Manage your website pages, content, and media</p>
        </div>
        <Button onClick={createNewPage}>
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPages.map((page: any) => (
              <Card
                key={page.id}
                className={`cursor-pointer transition-colors ${
                  selectedPage?.id === page.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  setSelectedPage(page);
                  setIsEditing(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{page.title}</h3>
                      <p className="text-xs text-muted-foreground">{page.route || `/${page.id}`}</p>
                      <p className="text-xs text-gray-600">{page.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          <Eye className="h-3 w-3 mr-1" />
                          Real Data
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {page.sections?.length || 0} sections
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ID: {page.id}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Page Editor */}
        <div className="lg:col-span-2">
          {selectedPage ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {isEditing ? 'Edit Page' : 'Page Details'}
                </CardTitle>
                <div className="flex gap-2">
                  {!isEditing && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      {selectedPage.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePageMutation.mutate(selectedPage.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleSavePage(formData);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                          name="title"
                          defaultValue={selectedPage.title}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">URL Slug</label>
                        <Input
                          name="slug"
                          defaultValue={selectedPage.slug}
                          placeholder="url-friendly-name"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Description</label>
                      <Textarea
                        name="description"
                        defaultValue={selectedPage.description}
                        placeholder="Brief description for search engines..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Template</label>
                        <Select name="template" defaultValue={selectedPage.template}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TEMPLATES.map((template) => (
                              <SelectItem key={template.value} value={template.value}>
                                {template.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Font Family</label>
                        <Select name="fontFamily" defaultValue={selectedPage.content?.fontFamily || "default"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_OPTIONS.map((font) => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium">Content</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowMediaLibrary(!showMediaLibrary)}
                        >
                          <Image className="h-4 w-4 mr-2" />
                          Add Image
                        </Button>
                      </div>
                      <Textarea
                        id="content"
                        name="content"
                        defaultValue={selectedPage.content?.body || ""}
                        placeholder="Write your content here... Supports Markdown!"
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>

                    {showMediaLibrary && (
                      <Card className="p-4">
                        <h4 className="font-medium mb-3">Media Library</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {mediaAssets.map((asset: any) => (
                            <div
                              key={asset.id}
                              className="cursor-pointer border rounded p-2 hover:bg-muted"
                              onClick={() => insertMediaIntoContent(asset.url)}
                            >
                              <img
                                src={asset.thumbnailUrl || asset.url}
                                alt={asset.alt || asset.filename}
                                className="w-full h-16 object-cover rounded"
                              />
                              <p className="text-xs mt-1 truncate">{asset.filename}</p>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Custom CSS (Optional)</label>
                      <Textarea
                        name="customCss"
                        defaultValue={selectedPage.content?.customCss || ""}
                        placeholder="/* Custom styles for this page */"
                        rows={4}
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">SEO Title</label>
                        <Input
                          name="seoTitle"
                          defaultValue={selectedPage.seoTitle}
                          placeholder="Custom title for search engines"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
                        <Input
                          name="seoKeywords"
                          defaultValue={selectedPage.seoKeywords?.join(', ')}
                          placeholder="wellness, AI, mindfulness"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        name="isPublished"
                        defaultChecked={selectedPage.isPublished}
                      />
                      <label className="text-sm font-medium">Publish page</label>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={updatePageMutation.isPending}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updatePageMutation.isPending ? 'Saving...' : 'Save Page'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Status:</span>
                        <div className="mt-1">
                          {selectedPage.isPublished ? (
                            <Badge variant="default">
                              <Eye className="h-3 w-3 mr-1" />
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Draft
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Template:</span>
                        <p className="mt-1">{selectedPage.template}</p>
                      </div>
                      <div>
                        <span className="font-medium">URL:</span>
                        <p className="mt-1 text-blue-600">/{selectedPage.slug}</p>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <p className="mt-1">{new Date(selectedPage.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {selectedPage.description && (
                      <div>
                        <span className="font-medium text-sm">Description:</span>
                        <p className="mt-1 text-sm text-muted-foreground">{selectedPage.description}</p>
                      </div>
                    )}

                    <div>
                      <span className="font-medium text-sm">Content Preview:</span>
                      <div className="mt-2 p-3 bg-muted rounded text-sm max-h-32 overflow-y-auto">
                        {selectedPage.content?.body ? (
                          <p>{selectedPage.content.body.substring(0, 300)}...</p>
                        ) : (
                          <p className="text-muted-foreground">No content</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Page Selected</h3>
                <p className="text-muted-foreground">
                  Select a page from the list to view and edit its content, or create a new page.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}