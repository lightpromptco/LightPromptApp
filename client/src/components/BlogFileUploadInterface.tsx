import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface BlogFileUploadInterfaceProps {
  onFileProcessed: (content: any) => void;
}

export function BlogFileUploadInterface({ onFileProcessed }: BlogFileUploadInterfaceProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedContent, setExtractedContent] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Process different file types
      let content: any = {};
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        content = await processTextFile(file);
      } else if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        content = await processMarkdownFile(file);
      } else if (file.name.endsWith('.docx')) {
        content = await processDocxFile(file);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        content = await processPdfFile(file);
      } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
        content = await processJsonFile(file);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      setExtractedContent(content);
      onFileProcessed(content);
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processTextFile = async (file: File): Promise<any> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve({
          type: 'text',
          title: file.name.replace('.txt', ''),
          content: text,
          wordCount: text.split(/\s+/).length,
          readingTime: Math.ceil(text.split(/\s+/).length / 200) // Assume 200 WPM
        });
      };
      reader.readAsText(file);
    });
  };

  const processMarkdownFile = async (file: File): Promise<any> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const markdown = e.target?.result as string;
        const title = markdown.match(/^#\s+(.+)$/m)?.[1] || file.name.replace('.md', '');
        
        resolve({
          type: 'markdown',
          title,
          content: markdown,
          rawContent: markdown,
          wordCount: markdown.split(/\s+/).length,
          readingTime: Math.ceil(markdown.split(/\s+/).length / 200),
          hasImages: /!\[.*?\]\(.*?\)/.test(markdown),
          hasLinks: /\[.*?\]\(.*?\)/.test(markdown)
        });
      };
      reader.readAsText(file);
    });
  };

  const processDocxFile = async (file: File): Promise<any> => {
    // In a real implementation, you'd use a library like mammoth.js
    // For now, we'll simulate the processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          type: 'docx',
          title: file.name.replace('.docx', ''),
          content: '[DOCX content would be extracted here]',
          note: 'Install mammoth.js library to extract DOCX content',
          size: file.size,
          lastModified: new Date(file.lastModified)
        });
      }, 1000);
    });
  };

  const processPdfFile = async (file: File): Promise<any> => {
    // In a real implementation, you'd use a library like pdf-parse
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          type: 'pdf',
          title: file.name.replace('.pdf', ''),
          content: '[PDF content would be extracted here]',
          note: 'Install pdf-parse library to extract PDF content',
          size: file.size,
          lastModified: new Date(file.lastModified)
        });
      }, 1500);
    });
  };

  const processJsonFile = async (file: File): Promise<any> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          resolve({
            type: 'json',
            title: file.name.replace('.json', ''),
            content: JSON.stringify(jsonData, null, 2),
            data: jsonData,
            structure: analyzeJsonStructure(jsonData)
          });
        } catch (error) {
          resolve({
            type: 'json',
            title: file.name,
            content: e.target?.result as string,
            error: 'Invalid JSON format'
          });
        }
      };
      reader.readAsText(file);
    });
  };

  const analyzeJsonStructure = (data: any): any => {
    const type = Array.isArray(data) ? 'array' : typeof data;
    if (type === 'object' && data !== null) {
      return {
        type: 'object',
        keys: Object.keys(data),
        keyCount: Object.keys(data).length
      };
    } else if (type === 'array') {
      return {
        type: 'array',
        length: data.length,
        itemTypes: [...new Set(data.map((item: any) => typeof item))]
      };
    }
    return { type };
  };

  const convertToBlogPost = () => {
    if (!extractedContent) return;

    const blogPost = {
      title: extractedContent.title || 'Untitled Post',
      content: extractedContent.content,
      excerpt: extractedContent.content.substring(0, 200) + '...',
      author: 'LightPrompt',
      category: 'Imported Content',
      tags: ['imported', 'blog'],
      readingTime: extractedContent.readingTime || 5,
      publishedAt: new Date().toISOString(),
      featured: false
    };

    // TODO: Save to blog posts
    console.log('Blog post created:', blogPost);
    alert('Content converted to blog post format!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-file-upload text-blue-500 mr-2"></i>
            Blog File Upload & Integration
          </CardTitle>
          <p className="text-sm text-gray-600">
            Upload documents, extract content, and convert to blog posts
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".txt,.md,.docx,.pdf,.json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-cloud-upload-alt text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: TXT, MD, DOCX, PDF, JSON
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Upload Progress */}
          {isProcessing && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Processing {uploadedFile?.name}</span>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-gray-600">
                    Extracting content and analyzing structure...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extracted Content Preview */}
          {extractedContent && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-check-circle text-green-600 mr-2"></i>
                  Content Extracted Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {extractedContent.type?.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-600">File Type</div>
                  </div>
                  {extractedContent.wordCount && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {extractedContent.wordCount}
                      </div>
                      <div className="text-xs text-gray-600">Words</div>
                    </div>
                  )}
                  {extractedContent.readingTime && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {extractedContent.readingTime}
                      </div>
                      <div className="text-xs text-gray-600">Min Read</div>
                    </div>
                  )}
                  {extractedContent.size && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(extractedContent.size / 1024)}
                      </div>
                      <div className="text-xs text-gray-600">KB</div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input 
                      value={extractedContent.title || ''} 
                      readOnly 
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Content Preview</label>
                    <Textarea 
                      value={extractedContent.content?.substring(0, 500) + '...' || ''} 
                      readOnly 
                      rows={5}
                      className="bg-white"
                    />
                  </div>

                  {extractedContent.note && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <i className="fas fa-info-circle mr-2"></i>
                        {extractedContent.note}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button onClick={convertToBlogPost} className="flex-1">
                    <i className="fas fa-blog mr-2"></i>
                    Convert to Blog Post
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <i className="fas fa-edit mr-2"></i>
                    Edit Content
                  </Button>
                  <Button variant="outline">
                    <i className="fas fa-download mr-2"></i>
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Supported Formats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported File Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-blue-50">TXT</Badge>
                    <span className="text-sm">Plain text files</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-green-50">MD</Badge>
                    <span className="text-sm">Markdown documents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-purple-50">JSON</Badge>
                    <span className="text-sm">Structured data files</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-orange-50">DOCX</Badge>
                    <span className="text-sm">Word documents</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-red-50">PDF</Badge>
                    <span className="text-sm">PDF documents</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}