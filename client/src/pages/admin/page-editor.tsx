import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Save, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  ExternalLink,
  Image,
  Type,
  Layout,
  Palette,
  Link as LinkIcon,
  MousePointer
} from "lucide-react";
import { VisualPageEditor } from "@/components/VisualPageEditor";

interface PageContent {
  id: string;
  pagePath: string;
  pageTitle: string;
  sections: PageSection[];
  metadata: {
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

interface PageSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'cta' | 'features' | 'testimonials' | 'faq';
  title?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  isVisible: boolean;
  order: number;
}

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero Section', icon: Layout },
  { value: 'text', label: 'Text Block', icon: Type },
  { value: 'image', label: 'Image', icon: Image },
  { value: 'cta', label: 'Call to Action', icon: LinkIcon },
  { value: 'features', label: 'Features Grid', icon: Layout },
  { value: 'testimonials', label: 'Testimonials', icon: Type },
  { value: 'faq', label: 'FAQ Section', icon: Type }
];

const AVAILABLE_PAGES = [
  { path: '/', title: 'Home Page' },
  { path: '/store', title: 'Store' },
  { path: '/woo-woo', title: 'Soul Map' },
  { path: '/vision-quest', title: 'Vision Quest' },
  { path: '/community', title: 'Community' },
  { path: '/soul-sync', title: 'Soul Sync' },
  { path: '/geoprompt-new', title: 'GeoPrompt' },
  { path: '/help', title: 'Help' },
  { path: '/privacy', title: 'Privacy' },
  { path: '/blog', title: 'Blog' }
];

export default function PageEditor() {
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'list' | 'visual'>('visual');
  const { toast } = useToast();

  // Check admin access
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.email === 'lightprompt.co@gmail.com';

  useEffect(() => {
    if (isAdmin && selectedPage) {
      loadPageContent(selectedPage);
    }
  }, [selectedPage, isAdmin]);

  const loadPageContent = async (pagePath: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', `/api/admin/pages/${encodeURIComponent(pagePath)}`);
      const data = await response.json();
      setPageContent(data);
    } catch (error) {
      // Create default page structure if doesn't exist
      const defaultPage: PageContent = {
        id: `page-${Date.now()}`,
        pagePath,
        pageTitle: AVAILABLE_PAGES.find(p => p.path === pagePath)?.title || 'Page',
        sections: [],
        metadata: {
          description: '',
          keywords: [],
          ogImage: ''
        }
      };
      setPageContent(defaultPage);
    } finally {
      setIsLoading(false);
    }
  };

  const savePageContent = async () => {
    if (!pageContent) return;
    
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/admin/pages', pageContent);
      toast({
        title: "Page Saved",
        description: "Page content has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save page content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSection = (type: string) => {
    if (!pageContent) return;

    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type: type as PageSection['type'],
      title: '',
      content: '',
      imageUrl: '',
      buttonText: '',
      buttonUrl: '',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      isVisible: true,
      order: pageContent.sections.length
    };

    setPageContent({
      ...pageContent,
      sections: [...pageContent.sections, newSection]
    });
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    if (!pageContent) return;

    setPageContent({
      ...pageContent,
      sections: pageContent.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!pageContent) return;

    setPageContent({
      ...pageContent,
      sections: pageContent.sections.filter(section => section.id !== sectionId)
    });
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!pageContent) return;

    const sections = [...pageContent.sections];
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
      
      // Update order values
      sections.forEach((section, index) => {
        section.order = index;
      });

      setPageContent({
        ...pageContent,
        sections
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-gray-600">You need admin privileges to access the page editor.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show visual editor when in visual mode
  if (editorMode === 'visual') {
    return <VisualPageEditor currentPage={selectedPage} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Page Editor</h1>
            <p className="text-gray-600 dark:text-gray-400">Edit any page content, buttons, and links</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setEditorMode(editorMode === 'visual' ? 'list' : 'visual')}
              variant="outline"
            >
              {editorMode === 'visual' ? (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  List Editor
                </>
              ) : (
                <>
                  <MousePointer className="w-4 h-4 mr-2" />
                  Visual Editor
                </>
              )}
            </Button>
            <Button onClick={savePageContent} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => window.open(selectedPage, '_blank')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Page Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {AVAILABLE_PAGES.map((page) => (
                  <Button
                    key={page.path}
                    variant={selectedPage === page.path ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedPage(page.path)}
                  >
                    {page.title}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Add Section */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Add Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {SECTION_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => addSection(type.value)}
                  >
                    <type.icon className="w-4 h-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-3">
            {pageContent && (
              <Tabs defaultValue="content" className="w-full">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="metadata">SEO & Metadata</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  {pageContent.sections.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Edit3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">No Sections Yet</h3>
                        <p className="text-gray-600 mb-4">Start building your page by adding sections from the sidebar.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    pageContent.sections
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <Card key={section.id}>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                {SECTION_TYPES.find(t => t.value === section.type)?.label}
                              </Badge>
                              <Switch
                                checked={section.isVisible}
                                onCheckedChange={(checked) => updateSection(section.id, { isVisible: checked })}
                              />
                              <span className="text-sm text-gray-500">
                                {section.isVisible ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveSection(section.id, 'up')}
                              >
                                ↑
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveSection(section.id, 'down')}
                              >
                                ↓
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSection(section.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`title-${section.id}`}>Title</Label>
                                <Input
                                  id={`title-${section.id}`}
                                  value={section.title || ''}
                                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                  placeholder="Section title"
                                />
                              </div>
                              {section.type === 'image' && (
                                <div>
                                  <Label htmlFor={`image-${section.id}`}>Image URL</Label>
                                  <Input
                                    id={`image-${section.id}`}
                                    value={section.imageUrl || ''}
                                    onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                  />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <Label htmlFor={`content-${section.id}`}>Content</Label>
                              <Textarea
                                id={`content-${section.id}`}
                                value={section.content || ''}
                                onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                placeholder="Section content..."
                                rows={4}
                              />
                            </div>

                            {(section.type === 'cta' || section.type === 'hero') && (
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`button-text-${section.id}`}>Button Text</Label>
                                  <Input
                                    id={`button-text-${section.id}`}
                                    value={section.buttonText || ''}
                                    onChange={(e) => updateSection(section.id, { buttonText: e.target.value })}
                                    placeholder="Get Started"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`button-url-${section.id}`}>Button URL</Label>
                                  <Input
                                    id={`button-url-${section.id}`}
                                    value={section.buttonUrl || ''}
                                    onChange={(e) => updateSection(section.id, { buttonUrl: e.target.value })}
                                    placeholder="/store"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`bg-color-${section.id}`}>Background Color</Label>
                                <Input
                                  id={`bg-color-${section.id}`}
                                  type="color"
                                  value={section.backgroundColor || '#ffffff'}
                                  onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`text-color-${section.id}`}>Text Color</Label>
                                <Input
                                  id={`text-color-${section.id}`}
                                  type="color"
                                  value={section.textColor || '#000000'}
                                  onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </TabsContent>

                <TabsContent value="metadata">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO & Social Media</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="page-title">Page Title</Label>
                        <Input
                          id="page-title"
                          value={pageContent.pageTitle}
                          onChange={(e) => setPageContent({ ...pageContent, pageTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="meta-description">Meta Description</Label>
                        <Textarea
                          id="meta-description"
                          value={pageContent.metadata.description || ''}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            metadata: { ...pageContent.metadata, description: e.target.value }
                          })}
                          placeholder="Brief description for search engines"
                        />
                      </div>
                      <div>
                        <Label htmlFor="og-image">Social Media Image URL</Label>
                        <Input
                          id="og-image"
                          value={pageContent.metadata.ogImage || ''}
                          onChange={(e) => setPageContent({
                            ...pageContent,
                            metadata: { ...pageContent.metadata, ogImage: e.target.value }
                          })}
                          placeholder="https://example.com/social-image.jpg"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}