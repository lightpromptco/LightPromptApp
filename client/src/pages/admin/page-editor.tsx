import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  Settings, 
  Layout,
  Palette,
  Type,
  Image,
  Link as LinkIcon,
  Code,
  Trash2,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PageSection {
  id: string;
  type: 'header' | 'text' | 'image' | 'button' | 'link';
  content: string;
  styles?: Record<string, string>;
  metadata?: Record<string, any>;
}

interface PageData {
  id?: string;
  title: string;
  route: string;
  description: string;
  sections: PageSection[];
  globalStyles: Record<string, string>;
}

export default function PageEditor() {
  const [currentPage, setCurrentPage] = useState<PageData>({
    title: 'New Page',
    route: '/new-page',
    description: 'A new page created with the Universal Editor',
    sections: [],
    globalStyles: {}
  });
  
  const [availablePages, setAvailablePages] = useState<PageData[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  // Check if user is admin - support both admin mode and regular user login
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = () => {
      // Check admin mode first
      const isAdminMode = localStorage.getItem('lightprompt-admin-mode') === 'true';
      const adminUser = JSON.parse(localStorage.getItem('lightprompt-admin-user') || 'null');
      
      if (isAdminMode && adminUser && adminUser.email === 'lightprompt.co@gmail.com') {
        setIsAdmin(true);
        return;
      }
      
      // Fallback to regular user check
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.email === 'lightprompt.co@gmail.com') {
        setIsAdmin(true);
        return;
      }
      
      setIsAdmin(false);
    };
    
    checkAdminAccess();
    if (isAdmin) {
      loadAvailablePages();
    }
  }, [isAdmin]);

  const loadAvailablePages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const pages = await response.json();
        setAvailablePages(pages);
        
        // Load first page by default
        if (pages.length > 0) {
          setCurrentPage(pages[0]);
        }
      } else {
        toast({
          title: "Failed to load pages",
          description: "Could not fetch page data from server",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to load pages:', error);
      toast({
        title: "Connection Error",
        description: "Could not connect to page management system",
        variant: "destructive"
      });
    }
  };

  const addSection = (type: PageSection['type']) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type)
    };
    
    setCurrentPage(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const getDefaultContent = (type: PageSection['type']): string => {
    switch (type) {
      case 'header':
        return 'New Header';
      case 'text':
        return 'Enter your text content here...';
      case 'image':
        return '/api/placeholder-image.jpg';
      case 'button':
        return 'Click Me';
      case 'link':
        return 'Learn More';
      default:
        return '';
    }
  };

  const getDefaultStyles = (type: PageSection['type']): Record<string, string> => {
    const baseStyles = {
      padding: '16px',
      margin: '8px 0'
    };

    switch (type) {
      case 'header':
        return {
          ...baseStyles,
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1a202c'
        };
      case 'text':
        return {
          ...baseStyles,
          fontSize: '16px',
          lineHeight: '1.5',
          color: '#2d3748'
        };
      case 'button':
        return {
          ...baseStyles,
          backgroundColor: '#3182ce',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer'
        };
      default:
        return baseStyles;
    }
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    setCurrentPage(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { ...section, content }
          : section
      )
    }));
  };

  const updateSectionStyle = (sectionId: string, property: string, value: string) => {
    setCurrentPage(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              styles: { 
                ...section.styles, 
                [property]: value 
              }
            }
          : section
      )
    }));
  };

  const deleteSection = (sectionId: string) => {
    setCurrentPage(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    setSelectedSection(null);
  };

  const savePage = async () => {
    try {
      const response = await fetch(`/api/pages/${currentPage.id || 'new'}`, {
        method: currentPage.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPage)
      });

      if (response.ok) {
        const savedPage = await response.json();
        setCurrentPage(savedPage);
        
        // Update available pages list
        if (!currentPage.id) {
          setAvailablePages(prev => [...prev, savedPage]);
        } else {
          setAvailablePages(prev => prev.map(p => p.id === savedPage.id ? savedPage : p));
        }
        
        toast({
          title: "Page Saved",
          description: `${savedPage.title} has been saved successfully.`
        });
      } else {
        throw new Error('Failed to save page');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving the page.",
        variant: "destructive"
      });
    }
  };

  const renderSection = (section: PageSection) => {
    const styles = {
      ...section.styles,
      border: selectedSection === section.id ? '2px solid #3182ce' : '1px solid transparent',
      cursor: 'pointer'
    };

    switch (section.type) {
      case 'header':
        return (
          <h1 
            style={styles}
            onClick={() => setSelectedSection(section.id)}
          >
            {section.content}
          </h1>
        );
      case 'text':
        return (
          <p 
            style={styles}
            onClick={() => setSelectedSection(section.id)}
          >
            {section.content}
          </p>
        );
      case 'image':
        return (
          <img 
            src={section.content}
            alt="Page content"
            style={{ ...styles, maxWidth: '100%', height: 'auto' }}
            onClick={() => setSelectedSection(section.id)}
          />
        );
      case 'button':
        return (
          <button 
            style={styles}
            onClick={() => setSelectedSection(section.id)}
          >
            {section.content}
          </button>
        );
      case 'link':
        return (
          <a 
            href="#"
            style={styles}
            onClick={(e) => {
              e.preventDefault();
              setSelectedSection(section.id);
            }}
          >
            {section.content}
          </a>
        );
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Universal Editor requires admin access. Please sign in as an administrator to continue.
            </p>
            <Button 
              onClick={() => window.location.href = '/admin'}
              className="mt-2"
            >
              Go to Admin Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Universal Editor</h1>
            <p className="text-gray-600 dark:text-gray-400">Visual page editor and content management • {availablePages.length} pages loaded</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={savePage}>
              <Save className="w-4 h-4 mr-2" />
              Save Page
            </Button>
          </div>
        </div>
        
        {/* Page Selection */}
        <div className="flex flex-wrap gap-2">
          {availablePages.map((page) => (
            <Button
              key={page.id}
              onClick={() => setCurrentPage(page)}
              variant={currentPage.id === page.id ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              {page.title}
              <Badge 
                variant="secondary" 
                className="ml-2 text-xs"
              >
                {page.route}
              </Badge>
            </Button>
          ))}
          <Button
            onClick={() => setCurrentPage({
              title: 'New Page',
              route: '/new-page',
              description: 'A new page created with the Universal Editor',
              sections: [],
              globalStyles: {}
            })}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            New Page
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Only show in edit mode */}
        {!previewMode && (
          <div className="w-80 bg-white dark:bg-gray-800 border-r p-4 overflow-y-auto">
            <Tabs defaultValue="add" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="add">Add</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="add" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Add Elements</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => addSection('header')}
                    >
                      <Type className="w-4 h-4" />
                      <span className="text-xs">Header</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => addSection('text')}
                    >
                      <Layout className="w-4 h-4" />
                      <span className="text-xs">Text</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => addSection('image')}
                    >
                      <Image className="w-4 h-4" />
                      <span className="text-xs">Image</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => addSection('button')}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs">Button</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-auto p-3 flex flex-col items-center gap-2"
                      onClick={() => addSection('link')}
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span className="text-xs">Link</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                {selectedSection ? (
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Style Selected Element</Label>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Content</Label>
                        <Textarea
                          value={currentPage.sections.find(s => s.id === selectedSection)?.content || ''}
                          onChange={(e) => updateSectionContent(selectedSection, e.target.value)}
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Font Size</Label>
                        <Input
                          type="text"
                          placeholder="16px"
                          onChange={(e) => updateSectionStyle(selectedSection, 'fontSize', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Color</Label>
                        <Input
                          type="color"
                          onChange={(e) => updateSectionStyle(selectedSection, 'color', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Background Color</Label>
                        <Input
                          type="color"
                          onChange={(e) => updateSectionStyle(selectedSection, 'backgroundColor', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSection(selectedSection)}
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Element
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Select an element to style it</p>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Page Settings</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Page Title</Label>
                      <Input
                        value={currentPage.title}
                        onChange={(e) => setCurrentPage(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Route</Label>
                      <Input
                        value={currentPage.route}
                        onChange={(e) => setCurrentPage(prev => ({ ...prev, route: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={currentPage.description}
                        onChange={(e) => setCurrentPage(prev => ({ ...prev, description: e.target.value }))}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {previewMode && (
              <div className="mb-4">
                <Badge variant="secondary">Preview Mode</Badge>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-96 p-6">
              {currentPage.sections.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Layout className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Start Building Your Page</h3>
                  <p>Add elements from the sidebar to start creating your page.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPage.sections.map(section => (
                    <div key={section.id}>
                      {renderSection(section)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}