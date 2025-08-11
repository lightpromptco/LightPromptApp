import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, Eye, Plus, Type, FileText, MousePointer, Image, Layout, 
  Settings, Trash2, Copy, Move, Zap, DollarSign, Menu, Sparkles,
  List, Quote, Palette, Code, Globe, Users, BarChart3, ArrowUp,
  ArrowDown, Edit3, Layers, PaintBucket, Monitor, Smartphone, Tablet
} from 'lucide-react';

interface PageSection {
  id: string;
  type: 'header' | 'text' | 'button' | 'image' | 'hero' | 'card' | 'pricing' | 'navigation' | 'custom';
  content: string;
  styles?: Record<string, string>;
  metadata?: Record<string, any>;
  children?: PageSection[];
}

interface PageData {
  id?: string;
  title: string;
  route: string;
  description: string;
  sections: PageSection[];
  globalStyles: Record<string, string>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
  responsive?: {
    mobile?: Record<string, any>;
    tablet?: Record<string, any>;
    desktop?: Record<string, any>;
  };
}

export default function EnhancedPageEditor() {
  const [currentPage, setCurrentPage] = useState<PageData>({
    title: 'New Page',
    route: '/new-page',
    description: 'A new page created with the Enhanced Universal Editor',
    sections: [],
    globalStyles: {},
    seo: {},
    responsive: {}
  });
  
  const [availablePages, setAvailablePages] = useState<PageData[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  const { toast } = useToast();

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminAccess = () => {
      const isAdminMode = localStorage.getItem('lightprompt-admin-mode') === 'true';
      const adminUser = JSON.parse(localStorage.getItem('lightprompt-admin-user') || 'null');
      
      if (isAdminMode && adminUser && adminUser.email === 'lightprompt.co@gmail.com') {
        setIsAdmin(true);
        loadAvailablePages();
        return;
      }
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.email === 'lightprompt.co@gmail.com') {
        setIsAdmin(true);
        loadAvailablePages();
        return;
      }
      
      setIsAdmin(false);
    };
    
    checkAdminAccess();
  }, []);

  const loadAvailablePages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const pages = await response.json();
        setAvailablePages(pages);
        
        if (pages.length > 0) {
          setCurrentPage(pages[0]);
        }
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

  const generateAIContent = async (type: string) => {
    setIsGeneratingAI(true);
    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          context: {
            pageName: currentPage.title,
            pageDescription: currentPage.description,
            route: currentPage.route
          }
        })
      });

      if (response.ok) {
        const { content, suggestions } = await response.json();
        
        // Add generated content as new section
        const newSection: PageSection = {
          id: `ai-${Date.now()}`,
          type: type === 'marketing-copy' ? 'text' : type === 'feature-list' ? 'text' : 'card',
          content,
          styles: getDefaultStyles(type),
          metadata: { aiGenerated: true, suggestions }
        };
        
        setCurrentPage(prev => ({
          ...prev,
          sections: [...prev.sections, newSection]
        }));
        
        toast({
          title: "AI Content Generated",
          description: `${type} content has been added to your page.`
        });
      }
    } catch (error) {
      toast({
        title: "AI Generation Failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getDefaultStyles = (type: string): Record<string, string> => {
    const styleTemplates = {
      'marketing-copy': {
        fontSize: '18px',
        lineHeight: '1.6',
        color: '#374151',
        marginBottom: '24px',
        textAlign: 'center'
      },
      'feature-list': {
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#4b5563',
        listStyleType: 'none',
        padding: '0'
      },
      'testimonial': {
        fontSize: '16px',
        fontStyle: 'italic',
        color: '#6b7280',
        borderLeft: '4px solid #3b82f6',
        paddingLeft: '20px',
        marginBottom: '16px'
      },
      'hero': {
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundClip: 'text',
        color: 'transparent',
        marginBottom: '20px'
      },
      'pricing': {
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#ffffff'
      }
    };
    
    return styleTemplates[type] || {
      fontSize: '16px',
      color: '#374151',
      marginBottom: '16px'
    };
  };

  const addSection = (type: PageSection['type']) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
      metadata: {}
    };
    
    setCurrentPage(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    setSelectedSection(newSection.id);
  };

  const getDefaultContent = (type: string): string => {
    const contentTemplates = {
      header: 'New Header',
      text: 'Your text content goes here. Edit this to add your message.',
      button: 'Click Me',
      image: '/api/placeholder-image.jpg',
      hero: 'Welcome to Your Amazing Site',
      card: 'Card Title\n\nCard description goes here with details about this section.',
      pricing: '$29/month\n\nPremium Plan\n• Feature 1\n• Feature 2\n• Feature 3',
      navigation: 'Home | About | Services | Contact',
      custom: 'Custom content'
    };
    
    return contentTemplates[type] || 'New content';
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    setCurrentPage(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
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

  const duplicateSection = (sectionId: string) => {
    const section = currentPage.sections.find(s => s.id === sectionId);
    if (section) {
      const duplicate = {
        ...section,
        id: `section-${Date.now()}`,
        content: section.content + ' (Copy)'
      };
      setCurrentPage(prev => ({
        ...prev,
        sections: [...prev.sections, duplicate]
      }));
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = currentPage.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;
    
    const newSections = [...currentPage.sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
      setCurrentPage(prev => ({ ...prev, sections: newSections }));
    }
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
        
        if (!currentPage.id) {
          setAvailablePages(prev => [...prev, savedPage]);
        } else {
          setAvailablePages(prev => prev.map(p => p.id === savedPage.id ? savedPage : p));
        }
        
        toast({
          title: "Page Saved Successfully",
          description: `${savedPage.title} has been saved with ${savedPage.sections?.length || 0} sections.`
        });
      } else {
        throw new Error('Failed to save page');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Failed",
        description: "There was an error saving the page. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderSection = (section: PageSection) => {
    const isSelected = selectedSection === section.id;
    const styles = {
      ...section.styles,
      border: isSelected ? '2px solid #3b82f6' : '1px solid transparent',
      borderRadius: '4px',
      padding: isSelected ? '8px' : '4px',
      cursor: 'pointer',
      position: 'relative' as const
    };

    const commonProps = {
      style: styles,
      onClick: () => setSelectedSection(section.id),
      className: `transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : 'hover:bg-gray-50'}`
    };

    switch (section.type) {
      case 'header':
        return (
          <h1 {...commonProps}>
            {section.content}
            {isSelected && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-1">
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }}>
                  <ArrowUp className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }}>
                  <ArrowDown className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}>
                  <Copy className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </h1>
        );
      case 'text':
        return (
          <div {...commonProps}>
            {section.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            {isSelected && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-1">
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}>
                  <Copy className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        );
      case 'button':
        return (
          <button {...commonProps}>
            {section.content}
          </button>
        );
      case 'hero':
        return (
          <div {...commonProps} className={`${commonProps.className} text-center py-12`}>
            <h1 style={{ ...section.styles, fontSize: '48px', fontWeight: 'bold' }}>
              {section.content}
            </h1>
            {isSelected && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-1">
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}>
                  <Copy className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        );
      case 'card':
        const cardLines = section.content.split('\n');
        return (
          <div {...commonProps} className={`${commonProps.className} border rounded-lg p-6`}>
            <h3 className="text-xl font-semibold mb-3">{cardLines[0]}</h3>
            <div>
              {cardLines.slice(1).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            {isSelected && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-1">
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}>
                  <Copy className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        );
      case 'pricing':
        const pricingLines = section.content.split('\n').filter(line => line.trim());
        return (
          <div {...commonProps} className={`${commonProps.className} border-2 rounded-lg p-6 text-center`}>
            <div className="text-3xl font-bold text-blue-600 mb-2">{pricingLines[0]}</div>
            <div className="text-lg font-semibold mb-4">{pricingLines[1]}</div>
            <div className="space-y-2">
              {pricingLines.slice(2).map((feature, i) => (
                <div key={i} className="flex items-center justify-center">
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            {isSelected && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-1">
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}>
                  <Copy className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div {...commonProps}>
            {section.content}
          </div>
        );
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
              The Enhanced Universal Editor requires admin access. Please sign in as an administrator.
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
      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Enhanced Universal Editor
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced visual page editor with AI-powered content generation • {availablePages.length} pages loaded
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Device Preview Toggle */}
              <div className="flex items-center border rounded-lg">
                <Button 
                  variant={devicePreview === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevicePreview('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button 
                  variant={devicePreview === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevicePreview('tablet')}
                >
                  <Tablet className="w-4 h-4" />
                </Button>
                <Button 
                  variant={devicePreview === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDevicePreview('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
              
              <Button 
                onClick={savePage} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Page
              </Button>
            </div>
          </div>
          
          {/* Enhanced Page Selection */}
          <div className="flex flex-wrap gap-2">
            {availablePages.map((page) => (
              <Button
                key={page.id}
                onClick={() => setCurrentPage(page)}
                variant={currentPage.id === page.id ? "default" : "outline"}
                size="sm"
                className="h-auto py-2 px-3"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{page.title}</span>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {page.route}
                  </Badge>
                </div>
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage({
                title: 'New Page',
                route: '/new-page',
                description: 'A new page created with the Enhanced Universal Editor',
                sections: [],
                globalStyles: {},
                seo: {},
                responsive: {}
              })}
              variant="outline"
              size="sm"
              className="h-auto py-2 px-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>New Page</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-140px)]">
        {/* Enhanced Sidebar */}
        {!previewMode && (
          <div className="w-96 bg-white dark:bg-gray-800 border-r overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-6 mt-4">
                {/* Add Elements */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Add Elements</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'header', icon: Type, label: 'Header' },
                      { type: 'text', icon: FileText, label: 'Text' },
                      { type: 'button', icon: MousePointer, label: 'Button' },
                      { type: 'image', icon: Image, label: 'Image' },
                      { type: 'hero', icon: Zap, label: 'Hero' },
                      { type: 'card', icon: Layout, label: 'Card' },
                      { type: 'pricing', icon: DollarSign, label: 'Pricing' },
                      { type: 'navigation', icon: Menu, label: 'Nav' }
                    ].map(({ type, icon: Icon, label }) => (
                      <Button 
                        key={type}
                        variant="outline" 
                        className="h-auto p-3 flex flex-col items-center gap-2"
                        onClick={() => addSection(type as PageSection['type'])}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* AI Content Generation */}
                <div>
                  <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Content Generation
                  </Label>
                  <div className="space-y-2">
                    {[
                      { type: 'marketing-copy', icon: Edit3, label: 'Marketing Copy' },
                      { type: 'feature-list', icon: List, label: 'Feature List' },
                      { type: 'testimonial', icon: Quote, label: 'Testimonial' }
                    ].map(({ type, icon: Icon, label }) => (
                      <Button 
                        key={type}
                        variant="outline" 
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => generateAIContent(type)}
                        disabled={isGeneratingAI}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {isGeneratingAI ? 'Generating...' : `Generate ${label}`}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Section Editor */}
                {selectedSection && (
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Edit Selected Section</Label>
                    {(() => {
                      const section = currentPage.sections.find(s => s.id === selectedSection);
                      if (!section) return null;
                      
                      return (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs">Content</Label>
                            <Textarea
                              value={section.content}
                              onChange={(e) => updateSection(selectedSection, { content: e.target.value })}
                              rows={4}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Font Size</Label>
                              <Input
                                type="text"
                                value={section.styles?.fontSize || ''}
                                onChange={(e) => updateSection(selectedSection, { 
                                  styles: { ...section.styles, fontSize: e.target.value }
                                })}
                                placeholder="16px"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Color</Label>
                              <Input
                                type="color"
                                value={section.styles?.color || '#000000'}
                                onChange={(e) => updateSection(selectedSection, { 
                                  styles: { ...section.styles, color: e.target.value }
                                })}
                                className="mt-1 h-9"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs">Text Align</Label>
                            <Select
                              value={section.styles?.textAlign || 'left'}
                              onValueChange={(value) => updateSection(selectedSection, { 
                                styles: { ...section.styles, textAlign: value }
                              })}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                                <SelectItem value="justify">Justify</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => duplicateSection(selectedSection)}
                              className="flex-1"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Duplicate
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteSection(selectedSection)}
                              className="flex-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Page Information</Label>
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
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Page Analytics</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{currentPage.sections?.length || 0}</div>
                      <div className="text-xs text-gray-600">Sections</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((currentPage.sections?.filter(s => s.content.trim()).length || 0) / Math.max(currentPage.sections?.length || 1, 1) * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">SEO Settings</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Meta Title</Label>
                      <Input
                        value={currentPage.seo?.metaTitle || ''}
                        onChange={(e) => setCurrentPage(prev => ({ 
                          ...prev, 
                          seo: { ...prev.seo, metaTitle: e.target.value }
                        }))}
                        placeholder="Page title for search engines"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Meta Description</Label>
                      <Textarea
                        value={currentPage.seo?.metaDescription || ''}
                        onChange={(e) => setCurrentPage(prev => ({ 
                          ...prev, 
                          seo: { ...prev.seo, metaDescription: e.target.value }
                        }))}
                        placeholder="Brief description for search results"
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Keywords (comma-separated)</Label>
                      <Input
                        value={currentPage.seo?.keywords?.join(', ') || ''}
                        onChange={(e) => setCurrentPage(prev => ({ 
                          ...prev, 
                          seo: { ...prev.seo, keywords: e.target.value.split(',').map(k => k.trim()) }
                        }))}
                        placeholder="keyword1, keyword2, keyword3"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Global Page Styles</Label>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Background Color</Label>
                      <Input
                        type="color"
                        value={currentPage.globalStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => setCurrentPage(prev => ({ 
                          ...prev, 
                          globalStyles: { ...prev.globalStyles, backgroundColor: e.target.value }
                        }))}
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Font Family</Label>
                      <Select
                        value={currentPage.globalStyles.fontFamily || 'system-ui'}
                        onValueChange={(value) => setCurrentPage(prev => ({ 
                          ...prev, 
                          globalStyles: { ...prev.globalStyles, fontFamily: value }
                        }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system-ui">System UI</SelectItem>
                          <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                          <SelectItem value="Georgia, serif">Georgia</SelectItem>
                          <SelectItem value="monospace">Monospace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Page Actions</Label>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        const exported = JSON.stringify(currentPage, null, 2);
                        navigator.clipboard.writeText(exported);
                        toast({ title: "Page exported to clipboard" });
                      }}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Export Page JSON
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.open(currentPage.route, '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      View Live Page
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Enhanced Preview Area */}
        <div className="flex-1 overflow-auto">
          <div 
            className={`mx-auto bg-white transition-all duration-300 ${
              devicePreview === 'mobile' ? 'max-w-sm' : 
              devicePreview === 'tablet' ? 'max-w-2xl' : 
              'max-w-full'
            }`}
            style={{ 
              ...currentPage.globalStyles,
              minHeight: '100vh',
              boxShadow: devicePreview !== 'desktop' ? '0 0 20px rgba(0,0,0,0.1)' : 'none',
              margin: devicePreview !== 'desktop' ? '20px auto' : '0'
            }}
          >
            {currentPage.sections.length === 0 ? (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No content yet</h3>
                  <p className="text-sm">Add sections from the sidebar to build your page</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-6">
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
  );
}