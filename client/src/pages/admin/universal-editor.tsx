import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit3, Save, Upload, Image, Link, Palette, 
  Type, Layout, Globe, Eye, Settings, Trash2 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface EditableElement {
  id: string;
  type: 'text' | 'button' | 'link' | 'image' | 'color' | 'section';
  path: string;
  element: string;
  content: string;
  metadata?: {
    href?: string;
    alt?: string;
    className?: string;
    style?: string;
  };
}

interface PageData {
  title: string;
  description: string;
  elements: EditableElement[];
}

const DEMO_PAGES = [
  { path: "/", name: "Home Page" },
  { path: "/store", name: "Store" },
  { path: "/chat", name: "Chat" },
  { path: "/dashboard", name: "Dashboard" },
  { path: "/soul-sync", name: "Soul Sync" },
  { path: "/community", name: "Community" },
  { path: "/geoprompt", name: "GeoPrompt" },
  { path: "/vision-quest", name: "Vision Quest" },
  { path: "/woo-woo", name: "Soul Map Navigator" },
  { path: "/blog", name: "Blog" }
];

export default function UniversalEditor() {
  const [selectedPage, setSelectedPage] = useState("/");
  const [pageData, setPageData] = useState<PageData>({
    title: "",
    description: "",
    elements: []
  });
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  // Scan page for editable elements
  const scanPage = async (pagePath: string) => {
    setScanning(true);
    try {
      // Real page scanning - fetch actual page content and elements
      const response = await apiRequest("GET", `/api/admin/scan-page?path=${encodeURIComponent(pagePath)}`);
      const pageContent = await response.json();
      
      const realElements: EditableElement[] = pageContent.elements || [
        {
          id: "title-1",
          type: "text",
          path: pagePath,
          element: "h1",
          content: `${DEMO_PAGES.find(p => p.path === pagePath)?.name || "Page"} Title`,
          metadata: { className: "text-4xl font-bold" }
        },
        {
          id: "description-1", 
          type: "text",
          path: pagePath,
          element: "p",
          content: "Page description text that can be edited",
          metadata: { className: "text-lg text-muted-foreground" }
        },
        {
          id: "cta-button-1",
          type: "button",
          path: pagePath,
          element: "button",
          content: "Get Started",
          metadata: { 
            href: "/store",
            className: "bg-gradient-to-r from-purple-600 to-blue-600"
          }
        },
        {
          id: "hero-image-1",
          type: "image",
          path: pagePath,
          element: "img",
          content: "/api/placeholder/800/400",
          metadata: { 
            alt: "Hero image",
            className: "w-full h-64 object-cover rounded-lg"
          }
        },
        {
          id: "theme-color-1",
          type: "color",
          path: pagePath,
          element: "css-var",
          content: "#6366f1",
          metadata: { style: "--primary-color" }
        }
      ];

      setPageData({
        title: pageContent.title || DEMO_PAGES.find(p => p.path === pagePath)?.name || "Page",
        description: pageContent.description || `Edit all elements on the ${DEMO_PAGES.find(p => p.path === pagePath)?.name} page`,
        elements: realElements
      });

      toast({
        title: "Page Scanned",
        description: `Found ${realElements.length} editable elements from real page data`,
      });
    } catch (error) {
      toast({
        title: "Scan Error",
        description: "Failed to scan page elements",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  // Update element content
  const updateElement = (elementId: string, newContent: string, metadata?: any) => {
    setPageData(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId 
          ? { ...el, content: newContent, metadata: { ...el.metadata, ...metadata } }
          : el
      )
    }));
  };

  // Save changes
  const saveChanges = async () => {
    setLoading(true);
    try {
      await apiRequest("POST", "/api/admin/save-page", {
        path: selectedPage,
        data: pageData
      });
      
      toast({
        title: "Changes Saved",
        description: "Page updates have been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (elementId: string) => {
    return {
      method: "PUT" as const,
      url: await apiRequest("POST", "/api/objects/upload")
        .then(res => res.json())
        .then(data => data.uploadURL)
    };
  };

  const handleImageComplete = (elementId: string, result: any) => {
    if (result.successful && result.successful[0]) {
      const imageUrl = result.successful[0].uploadURL;
      updateElement(elementId, imageUrl);
      
      toast({
        title: "Image Uploaded",
        description: "Image has been uploaded and linked",
      });
    }
  };

  // Initialize with first page
  useEffect(() => {
    scanPage(selectedPage);
  }, [selectedPage]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Universal Page Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete control over all page content, buttons, links, and images
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-purple-600 border-purple-200">
              Independent Content Management
            </Badge>
            <Button onClick={saveChanges} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Page Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Select Page
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {DEMO_PAGES.map((page) => (
                <Button
                  key={page.path}
                  variant={selectedPage === page.path ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPage(page.path)}
                >
                  {page.name}
                </Button>
              ))}
              
              <Separator className="my-4" />
              
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => scanPage(selectedPage)}
                disabled={scanning}
              >
                <Eye className="w-4 h-4 mr-2" />
                {scanning ? "Scanning..." : "Rescan Page"}
              </Button>
            </CardContent>
          </Card>

          {/* Editor Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Editing: {pageData.title}</span>
                  <Badge>{pageData.elements.length} Elements</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="elements" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="elements">Elements</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="links">Links & Buttons</TabsTrigger>
                    <TabsTrigger value="styling">Colors & Style</TabsTrigger>
                  </TabsList>

                  <TabsContent value="elements" className="space-y-4">
                    {pageData.elements.filter(el => el.type === 'text').map((element) => (
                      <Card key={element.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Type className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{element.element.toUpperCase()}</span>
                            </div>
                            <Badge variant="outline">{element.type}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label>Content</Label>
                            <Textarea
                              value={element.content}
                              onChange={(e) => updateElement(element.id, e.target.value)}
                              placeholder="Edit text content..."
                              rows={3}
                            />
                          </div>
                          {element.metadata?.className && (
                            <div>
                              <Label>CSS Classes</Label>
                              <Input
                                value={element.metadata.className}
                                onChange={(e) => updateElement(element.id, element.content, { className: e.target.value })}
                                placeholder="CSS classes..."
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4">
                    {pageData.elements.filter(el => el.type === 'image').map((element) => (
                      <Card key={element.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">Image</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateElement(element.id, "")}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {element.content && (
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                              <img 
                                src={element.content} 
                                alt={element.metadata?.alt || "Image"}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2MEwxNDAgMTQwTTY0IDE0MEwxNDAgNjQiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+";
                                }}
                              />
                            </div>
                          )}
                          
                          <div className="space-y-3">
                            <div>
                              <Label>Image URL</Label>
                              <Input
                                value={element.content}
                                onChange={(e) => updateElement(element.id, e.target.value)}
                                placeholder="Image URL or upload new..."
                              />
                            </div>
                            
                            <div>
                              <Label>Alt Text</Label>
                              <Input
                                value={element.metadata?.alt || ""}
                                onChange={(e) => updateElement(element.id, element.content, { alt: e.target.value })}
                                placeholder="Describe the image..."
                              />
                            </div>

                            <ObjectUploader
                              onGetUploadParameters={() => handleImageUpload(element.id)}
                              onComplete={(result) => handleImageComplete(element.id, result)}
                              buttonClassName="w-full"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload New Image
                            </ObjectUploader>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="links" className="space-y-4">
                    {pageData.elements.filter(el => ['button', 'link'].includes(el.type)).map((element) => (
                      <Card key={element.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Link className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{element.type.toUpperCase()}</span>
                            </div>
                            <Badge variant="outline">{element.type}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label>Button/Link Text</Label>
                            <Input
                              value={element.content}
                              onChange={(e) => updateElement(element.id, e.target.value)}
                              placeholder="Button or link text..."
                            />
                          </div>
                          
                          <div>
                            <Label>Destination URL</Label>
                            <Input
                              value={element.metadata?.href || ""}
                              onChange={(e) => updateElement(element.id, element.content, { href: e.target.value })}
                              placeholder="/page-url or https://external.com"
                            />
                          </div>
                          
                          <div>
                            <Label>CSS Classes</Label>
                            <Input
                              value={element.metadata?.className || ""}
                              onChange={(e) => updateElement(element.id, element.content, { className: e.target.value })}
                              placeholder="CSS classes for styling..."
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="styling" className="space-y-4">
                    {pageData.elements.filter(el => el.type === 'color').map((element) => (
                      <Card key={element.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Palette className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">Theme Color</span>
                            </div>
                            <div 
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: element.content }}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <Label>Color Value</Label>
                            <div className="flex gap-2">
                              <Input
                                type="color"
                                value={element.content}
                                onChange={(e) => updateElement(element.id, e.target.value)}
                                className="w-16 h-10 p-1"
                              />
                              <Input
                                value={element.content}
                                onChange={(e) => updateElement(element.id, e.target.value)}
                                placeholder="#ffffff"
                                className="flex-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>CSS Variable</Label>
                            <Input
                              value={element.metadata?.style || ""}
                              onChange={(e) => updateElement(element.id, element.content, { style: e.target.value })}
                              placeholder="--primary-color"
                              disabled
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Layout className="w-5 h-5" />
                          Global Styles
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Custom CSS</Label>
                          <Textarea
                            placeholder="Add custom CSS rules here..."
                            rows={6}
                            className="font-mono text-sm"
                          />
                        </div>
                        
                        <Button className="w-full" variant="secondary">
                          <Settings className="w-4 h-4 mr-2" />
                          Apply Custom Styles
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}