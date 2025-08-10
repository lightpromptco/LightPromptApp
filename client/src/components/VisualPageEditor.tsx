import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ObjectUploader } from '@/components/ObjectUploader';
import { 
  Save, 
  Eye, 
  Edit3, 
  Upload, 
  Type, 
  Image, 
  Link, 
  Palette, 
  MousePointer,
  Undo,
  Redo,
  Copy,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'link' | 'heading';
  content: string;
  selector: string;
  styles: Record<string, string>;
  position: { x: number; y: number; width: number; height: number };
}

interface VisualPageEditorProps {
  currentPage: string;
}

export function VisualPageEditor({ currentPage }: VisualPageEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [elements, setElements] = useState<EditableElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [changes, setChanges] = useState<Record<string, any>>({});
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Initialize editor by scanning the current page
  useEffect(() => {
    scanPageElements();
  }, [currentPage]);

  const scanPageElements = async () => {
    setIsLoading(true);
    try {
      // Load the page in iframe for live preview
      setPreviewUrl(window.location.origin + currentPage);
      
      // Scan for editable elements using DOM traversal
      const response = await apiRequest('GET', `/api/admin/scan-dom?path=${encodeURIComponent(currentPage)}`);
      const data = await response.json();
      
      setElements(data.elements || []);
      toast({
        title: "Page Loaded",
        description: `Found ${data.elements?.length || 0} editable elements`
      });
    } catch (error) {
      console.error('Error scanning page:', error);
      toast({
        title: "Scan Error",
        description: "Could not load page elements",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleElementEdit = (elementId: string, newContent: string) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, content: newContent } : el
    ));
    
    setChanges(prev => ({
      ...prev,
      [elementId]: { content: newContent }
    }));

    // Update live preview if iframe is loaded
    if (iframeRef.current?.contentWindow) {
      const iframe = iframeRef.current;
      const element = iframe.contentDocument?.querySelector(`[data-edit-id="${elementId}"]`);
      if (element) {
        if (element.tagName === 'IMG') {
          (element as HTMLImageElement).src = newContent;
        } else {
          element.textContent = newContent;
        }
      }
    }
  };

  const handleStyleUpdate = (elementId: string, property: string, value: string) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { ...el, styles: { ...el.styles, [property]: value } }
        : el
    ));

    setChanges(prev => ({
      ...prev,
      [elementId]: { 
        ...prev[elementId],
        styles: { ...prev[elementId]?.styles, [property]: value }
      }
    }));

    // Apply styles to live preview
    if (iframeRef.current?.contentWindow) {
      const iframe = iframeRef.current;
      const element = iframe.contentDocument?.querySelector(`[data-edit-id="${elementId}"]`) as HTMLElement;
      if (element) {
        element.style.setProperty(property, value);
      }
    }
  };

  const handleImageUpload = async (elementId: string) => {
    // This will be called when ObjectUploader completes
    return {
      method: 'PUT' as const,
      url: '/api/upload-temp-image' // We'll implement this endpoint
    };
  };

  const handleImageUploadComplete = (elementId: string, result: any) => {
    if (result.successful && result.successful[0]) {
      const imageUrl = result.successful[0].uploadURL;
      handleElementEdit(elementId, imageUrl);
      toast({
        title: "Image Uploaded",
        description: "Image has been updated successfully"
      });
    }
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/admin/save-page-changes', {
        path: currentPage,
        changes,
        elements
      });
      
      setChanges({});
      toast({
        title: "Changes Saved",
        description: "Page has been updated successfully"
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Save Error",
        description: "Could not save changes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewElement = (type: 'text' | 'image' | 'button') => {
    const newElement: EditableElement = {
      id: `new-${Date.now()}`,
      type,
      content: type === 'text' ? 'New Text Element' : type === 'image' ? '/placeholder-image.jpg' : 'New Button',
      selector: '',
      styles: {
        fontSize: '16px',
        color: '#000000',
        backgroundColor: type === 'button' ? '#3b82f6' : 'transparent',
        padding: type === 'button' ? '8px 16px' : '0',
        borderRadius: type === 'button' ? '6px' : '0'
      },
      position: { x: 50, y: 50, width: 200, height: type === 'button' ? 40 : 20 }
    };
    
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Element Tree & Properties */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Edit3 className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold">Visual Editor</h2>
            <Badge variant="outline" className="ml-auto">
              {elements.length} elements
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={saveChanges} 
              disabled={isLoading || Object.keys(changes).length === 0}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="add">Add New</TabsTrigger>
            </TabsList>
            
            <TabsContent value="elements" className="p-4 space-y-2">
              {elements.map((element) => (
                <Card 
                  key={element.id}
                  className={`cursor-pointer transition-colors ${
                    selectedElement?.id === element.id ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedElement(element)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      {element.type === 'text' && <Type className="w-4 h-4 text-gray-500" />}
                      {element.type === 'image' && <Image className="w-4 h-4 text-gray-500" />}
                      {element.type === 'button' && <MousePointer className="w-4 h-4 text-gray-500" />}
                      {element.type === 'link' && <Link className="w-4 h-4 text-gray-500" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {element.content}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="add" className="p-4 space-y-3">
              <Button 
                onClick={() => addNewElement('text')} 
                variant="outline" 
                className="w-full justify-start"
              >
                <Type className="w-4 h-4 mr-2" />
                Add Text
              </Button>
              <Button 
                onClick={() => addNewElement('image')} 
                variant="outline" 
                className="w-full justify-start"
              >
                <Image className="w-4 h-4 mr-2" />
                Add Image
              </Button>
              <Button 
                onClick={() => addNewElement('button')} 
                variant="outline" 
                className="w-full justify-start"
              >
                <MousePointer className="w-4 h-4 mr-2" />
                Add Button
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Properties Panel */}
        {selectedElement && (
          <div className="border-t border-gray-200 p-4 space-y-4 max-h-96 overflow-y-auto">
            <h3 className="font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Properties
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="content">Content</Label>
                {selectedElement.type === 'image' ? (
                  <div className="space-y-2">
                    <Input
                      id="content"
                      value={selectedElement.content}
                      onChange={(e) => handleElementEdit(selectedElement.id, e.target.value)}
                      placeholder="Image URL"
                    />
                    <ObjectUploader
                      onGetUploadParameters={() => handleImageUpload(selectedElement.id)}
                      onComplete={(result) => handleImageUploadComplete(selectedElement.id, result)}
                      maxFileSize={5242880} // 5MB
                      buttonClassName="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Image
                    </ObjectUploader>
                  </div>
                ) : (
                  <Textarea
                    id="content"
                    value={selectedElement.content}
                    onChange={(e) => handleElementEdit(selectedElement.id, e.target.value)}
                    placeholder="Enter content..."
                    rows={3}
                  />
                )}
              </div>

              <Separator />

              <div>
                <Label>Font Size</Label>
                <Select
                  value={selectedElement.styles.fontSize || '16px'}
                  onValueChange={(value) => handleStyleUpdate(selectedElement.id, 'fontSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12px">Small (12px)</SelectItem>
                    <SelectItem value="14px">Normal (14px)</SelectItem>
                    <SelectItem value="16px">Medium (16px)</SelectItem>
                    <SelectItem value="18px">Large (18px)</SelectItem>
                    <SelectItem value="24px">XL (24px)</SelectItem>
                    <SelectItem value="32px">2XL (32px)</SelectItem>
                    <SelectItem value="48px">3XL (48px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Text Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={selectedElement.styles.color || '#000000'}
                  onChange={(e) => handleStyleUpdate(selectedElement.id, 'color', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="backgroundColor">Background</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={selectedElement.styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleUpdate(selectedElement.id, 'backgroundColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Live Preview */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">
              Editing: {currentPage === '/' ? 'Home Page' : currentPage}
            </h1>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 bg-gray-100">
          <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden" style={{ width: '1200px', height: '800px' }}>
            {previewUrl && (
              <iframe
                ref={iframeRef}
                src={previewUrl}
                className="w-full h-full border-0"
                title="Page Preview"
                onLoad={() => {
                  // Inject editing capabilities into iframe
                  if (iframeRef.current?.contentWindow) {
                    const iframe = iframeRef.current;
                    const doc = iframe.contentDocument;
                    if (doc) {
                      // Add data attributes to elements for editing
                      elements.forEach((element, index) => {
                        const domElement = doc.querySelector(element.selector);
                        if (domElement) {
                          domElement.setAttribute('data-edit-id', element.id);
                          domElement.setAttribute('contenteditable', isEditing ? 'true' : 'false');
                        }
                      });
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}