import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Eye,
  Code,
  Palette,
  Type,
  Image,
  Link,
  Layout
} from 'lucide-react';

interface PageSection {
  id: string;
  type: 'header' | 'text' | 'hero' | 'cta' | 'image' | 'code';
  title?: string;
  content?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
  isVisible: boolean;
  order: number;
}

interface PageContent {
  id?: string;
  title: string;
  slug: string;
  description: string;
  pageTitle: string;
  metaDescription: string;
  ogImage?: string;
  sections: PageSection[];
}

interface VisualPageEditorProps {
  currentPage?: string;
}

const SECTION_TEMPLATES = [
  { type: 'header', icon: Type, label: 'Header', description: 'Main page heading' },
  { type: 'text', icon: Type, label: 'Text Block', description: 'Rich text content' },
  { type: 'hero', icon: Layout, label: 'Hero Section', description: 'Large banner with CTA' },
  { type: 'cta', icon: Link, label: 'Call to Action', description: 'Button with link' },
  { type: 'image', icon: Image, label: 'Image', description: 'Image with caption' },
  { type: 'code', icon: Code, label: 'Code Block', description: 'Syntax highlighted code' },
];

export function VisualPageEditor({ currentPage }: VisualPageEditorProps) {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (currentPage) {
      fetchPageContent();
    }
  }, [currentPage]);

  const fetchPageContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/pages/${currentPage}`);
      if (response.ok) {
        const data = await response.json();
        setPageContent(data);
      } else {
        // Create new page if it doesn't exist
        setPageContent({
          title: 'New Page',
          slug: currentPage || 'new-page',
          description: '',
          pageTitle: 'New Page',
          metaDescription: '',
          sections: []
        });
      }
    } catch (error) {
      console.error('Error fetching page:', error);
      toast({
        title: "Error",
        description: "Failed to load page content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSection = (type: string) => {
    if (!pageContent) return;

    const newSection: PageSection = {
      id: `section_${Date.now()}`,
      type: type as PageSection['type'],
      title: type === 'header' ? 'New Header' : undefined,
      content: type === 'text' ? 'Enter your content here...' : 
               type === 'code' ? '// Your code here\nconsole.log("Hello World");' : 
               undefined,
      buttonText: type === 'cta' || type === 'hero' ? 'Get Started' : undefined,
      buttonUrl: type === 'cta' || type === 'hero' ? '#' : undefined,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      isVisible: true,
      order: pageContent.sections.length
    };

    setPageContent({
      ...pageContent,
      sections: [...pageContent.sections, newSection]
    });
    setSelectedSection(newSection.id);
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
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!pageContent) return;

    const sections = [...pageContent.sections];
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
      
      sections.forEach((section, index) => {
        section.order = index;
      });

      setPageContent({
        ...pageContent,
        sections
      });
    }
  };

  const savePage = async () => {
    if (!pageContent) return;

    try {
      const method = pageContent.id ? 'PUT' : 'POST';
      const url = pageContent.id ? `/api/admin/pages/${pageContent.id}` : '/api/admin/pages';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageContent),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Page saved successfully!",
        });
      } else {
        throw new Error('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      });
    }
  };

  const renderSectionPreview = (section: PageSection) => {
    const style = {
      backgroundColor: section.backgroundColor || '#ffffff',
      color: section.textColor || '#000000',
    };

    const isSelected = selectedSection === section.id;

    switch (section.type) {
      case 'header':
        return (
          <div 
            className={`p-6 border-2 transition-all cursor-pointer ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
            }`}
            style={style}
            onClick={() => setSelectedSection(section.id)}
          >
            <h1 className="text-3xl font-bold">{section.title || 'Header'}</h1>
          </div>
        );
      
      case 'text':
        return (
          <div 
            className={`p-6 border-2 transition-all cursor-pointer ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
            }`}
            style={style}
            onClick={() => setSelectedSection(section.id)}
          >
            <div className="prose max-w-none">
              {section.content?.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        );
      
      case 'hero':
        return (
          <div 
            className={`p-12 text-center border-2 transition-all cursor-pointer ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
            }`}
            style={style}
            onClick={() => setSelectedSection(section.id)}
          >
            <h1 className="text-4xl font-bold mb-4">{section.title || 'Hero Title'}</h1>
            <p className="text-xl mb-6">{section.content || 'Hero description goes here'}</p>
            {section.buttonText && (
              <Button size="lg">{section.buttonText}</Button>
            )}
          </div>
        );
      
      case 'cta':
        return (
          <div 
            className={`p-8 text-center border-2 transition-all cursor-pointer ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
            }`}
            style={style}
            onClick={() => setSelectedSection(section.id)}
          >
            <h2 className="text-2xl font-bold mb-4">{section.title || 'Call to Action'}</h2>
            {section.content && <p className="mb-4">{section.content}</p>}
            <Button>{section.buttonText || 'Click Here'}</Button>
          </div>
        );
      
      case 'image':
        return (
          <div 
            className={`p-6 border-2 transition-all cursor-pointer ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
            }`}
            style={style}
            onClick={() => setSelectedSection(section.id)}
          >
            <div className="bg-gray-200 h-48 flex items-center justify-center rounded">
              {section.imageUrl ? (
                <img src={section.imageUrl} alt={section.title} className="max-h-full object-contain" />
              ) : (
                <Image className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {section.title && <p className="text-center mt-2">{section.title}</p>}
          </div>
        );
      
      case 'code':
        return (
          <div 
            className={`p-6 border-2 transition-all cursor-pointer ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
            }`}
            onClick={() => setSelectedSection(section.id)}
          >
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
              <code>{section.content || '// Code goes here'}</code>
            </pre>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading page editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/admin/content'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pages
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {pageContent?.title || 'New Page'}
              </h1>
              <p className="text-sm text-gray-500">Visual Page Editor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('edit')}
            >
              Edit
            </Button>
            <Button
              variant={viewMode === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('preview')}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button onClick={savePage}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {viewMode === 'edit' && (
          <div className="w-80 bg-white border-r h-screen overflow-y-auto">
            {/* Section Templates */}
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-3">Add Section</h3>
              <div className="grid gap-2">
                {SECTION_TEMPLATES.map((template) => (
                  <Button
                    key={template.type}
                    variant="outline"
                    size="sm"
                    onClick={() => addSection(template.type)}
                    className="justify-start h-auto p-3"
                  >
                    <template.icon className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{template.label}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Section Properties */}
            {selectedSection && pageContent && (
              <div className="p-4">
                <h3 className="font-semibold mb-3">Section Properties</h3>
                {(() => {
                  const section = pageContent.sections.find(s => s.id === selectedSection);
                  if (!section) return null;

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Switch
                          checked={section.isVisible}
                          onCheckedChange={(checked) => updateSection(section.id, { isVisible: checked })}
                        />
                        <span className="text-sm">{section.isVisible ? 'Visible' : 'Hidden'}</span>
                      </div>

                      {(section.type === 'header' || section.type === 'hero' || section.type === 'cta' || section.type === 'image') && (
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            value={section.title || ''}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            placeholder="Section title"
                          />
                        </div>
                      )}

                      {(section.type === 'text' || section.type === 'hero' || section.type === 'cta' || section.type === 'code') && (
                        <div>
                          <label className="text-sm font-medium">Content</label>
                          <Textarea
                            value={section.content || ''}
                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                            placeholder="Section content"
                            rows={4}
                          />
                        </div>
                      )}

                      {(section.type === 'hero' || section.type === 'cta') && (
                        <>
                          <div>
                            <label className="text-sm font-medium">Button Text</label>
                            <Input
                              value={section.buttonText || ''}
                              onChange={(e) => updateSection(section.id, { buttonText: e.target.value })}
                              placeholder="Button text"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Button URL</label>
                            <Input
                              value={section.buttonUrl || ''}
                              onChange={(e) => updateSection(section.id, { buttonUrl: e.target.value })}
                              placeholder="/path-or-url"
                            />
                          </div>
                        </>
                      )}

                      {section.type === 'image' && (
                        <div>
                          <label className="text-sm font-medium">Image URL</label>
                          <Input
                            value={section.imageUrl || ''}
                            onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm font-medium">Background</label>
                          <Input
                            type="color"
                            value={section.backgroundColor || '#ffffff'}
                            onChange={(e) => updateSection(section.id, { backgroundColor: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Text Color</label>
                          <Input
                            type="color"
                            value={section.textColor || '#000000'}
                            onChange={(e) => updateSection(section.id, { textColor: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={section.order === 0}
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={section.order === pageContent.sections.length - 1}
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 bg-white">
          <div className="max-w-4xl mx-auto">
            {pageContent?.sections
              .sort((a, b) => a.order - b.order)
              .filter(section => viewMode === 'preview' ? section.isVisible : true)
              .map((section) => (
                <div key={section.id} className="relative">
                  {renderSectionPreview(section)}
                  {viewMode === 'edit' && selectedSection === section.id && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-500">Selected</Badge>
                    </div>
                  )}
                </div>
              ))}
            
            {pageContent?.sections.length === 0 && (
              <div className="text-center py-20">
                <Layout className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Start Building Your Page</h3>
                <p className="text-gray-600">Add sections from the sidebar to build your page</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}