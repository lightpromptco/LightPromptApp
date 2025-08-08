import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExternalLinksCodeSectionProps {
  isAdmin: boolean;
}

interface ExternalLink {
  id: string;
  title: string;
  url: string;
  description: string;
  icon?: string;
  type: 'external' | 'internal';
}

export function ExternalLinksCodeSection({ isAdmin }: ExternalLinksCodeSectionProps) {
  const [links, setLinks] = useState<ExternalLink[]>([
    {
      id: '1',
      title: 'Dashboard Home',
      url: '/dashboard?view=home',
      description: 'Return to main dashboard',
      icon: 'fas fa-home',
      type: 'internal'
    },
    {
      id: '2', 
      title: 'Community',
      url: '/dashboard?view=community',
      description: 'Join our wellness community',
      icon: 'fas fa-users',
      type: 'internal'
    }
  ]);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    icon: 'fas fa-link',
    type: 'external' as 'external' | 'internal'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {links.map(link => (
              <Button
                key={link.id}
                variant="outline"
                className="justify-start h-auto p-3"
                onClick={() => {
                  if (link.type === 'internal') {
                    // Handle internal navigation
                    if (link.url.startsWith('/dashboard')) {
                      const params = new URLSearchParams(link.url.split('?')[1] || '');
                      const view = params.get('view');
                      if (view) {
                        // Trigger view change in dashboard
                        window.dispatchEvent(new CustomEvent('dashboard-navigate', { detail: { view } }));
                      }
                    } else {
                      window.location.href = link.url;
                    }
                  } else {
                    // Handle external links
                    window.open(link.url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <i className={`${link.icon} text-blue-500 mt-1`}></i>
                  <div className="text-left">
                    <div className="font-medium">{link.title}</div>
                    <div className="text-xs text-gray-600">{link.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      const link: ExternalLink = {
        id: Date.now().toString(),
        ...newLink
      };
      setLinks([...links, link]);
      setNewLink({
        title: '',
        url: '',
        description: '',
        icon: 'fas fa-link',
        type: 'external'
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          External Links Code Section
          <Badge className="bg-blue-500">Admin Mode</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="links">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="links">Manage Links</TabsTrigger>
            <TabsTrigger value="code">Generated Code</TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Current Links</h3>
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <i className="fas fa-plus mr-2"></i>
                Add Link
              </Button>
            </div>

            {showAddForm && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Link title"
                      value={newLink.title}
                      onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                    />
                    <Input
                      placeholder="URL (https://... or /dashboard?view=...)"
                      value={newLink.url}
                      onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                    />
                  </div>
                  <Input
                    placeholder="Description"
                    value={newLink.description}
                    onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Icon class (e.g., fas fa-star)"
                      value={newLink.icon}
                      onChange={(e) => setNewLink({...newLink, icon: e.target.value})}
                    />
                    <select
                      className="p-2 border rounded-md"
                      value={newLink.type}
                      onChange={(e) => setNewLink({...newLink, type: e.target.value as 'external' | 'internal'})}
                    >
                      <option value="external">External Link</option>
                      <option value="internal">Internal Navigation</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleAddLink}>Add Link</Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {links.map(link => (
                <div key={link.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className={link.icon}></i>
                    <div>
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-gray-600">{link.url}</div>
                    </div>
                    <Badge variant={link.type === 'internal' ? 'default' : 'outline'}>
                      {link.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLink(link.id)}
                  >
                    <i className="fas fa-trash text-red-500"></i>
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Generated React Component Code</h3>
              <Textarea
                value={`// External Links Component - Copy this code where needed
const ExternalLinksSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    ${links.map(link => `<Button
      variant="outline"
      className="justify-start h-auto p-3"
      onClick={() => {
        ${link.type === 'internal' 
          ? `window.location.href = '${link.url}';`
          : `window.open('${link.url}', '_blank', 'noopener,noreferrer');`
        }
      }}
    >
      <div className="flex items-start space-x-3">
        <i className="${link.icon} text-blue-500 mt-1"></i>
        <div className="text-left">
          <div className="font-medium">${link.title}</div>
          <div className="text-xs text-gray-600">${link.description}</div>
        </div>
      </div>
    </Button>`).join(',\n    ')}
  </div>
);`}
                rows={15}
                readOnly
                className="font-mono text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}