import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Bot, 
  Package, 
  Shield, 
  GraduationCap,
  Palette,
  Database,
  RefreshCw,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function KnowledgeAdminPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  // Fetch all LightPrompt knowledge
  const { data: knowledge, isLoading, refetch } = useQuery({
    queryKey: ['/api/knowledge'],
    queryFn: async () => {
      const response = await fetch('/api/knowledge');
      if (!response.ok) throw new Error('Failed to fetch knowledge');
      return response.json();
    },
    refetchInterval: 30000
  });

  const categoryIcons = {
    brand_identity: Palette,
    products: Package,
    bots: Bot,
    ethics: Shield,
    course_content: GraduationCap
  };

  const categoryColors = {
    brand_identity: "bg-teal-100 text-teal-800",
    products: "bg-blue-100 text-blue-800", 
    bots: "bg-purple-100 text-purple-800",
    ethics: "bg-green-100 text-green-800",
    course_content: "bg-orange-100 text-orange-800"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LightPrompt Knowledge System</h1>
          <p className="text-gray-600 mb-4">
            Core reference materials for maintaining brand integrity and accurate information
          </p>
          <div className="flex items-center gap-4">
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Badge className="bg-green-100 text-green-800">
              <Database className="w-3 h-3 mr-1" />
              {Object.keys(knowledge || {}).length} Categories Loaded
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="brand_identity">Brand</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="bots">Bots</TabsTrigger>
            <TabsTrigger value="ethics">Ethics</TabsTrigger>
            <TabsTrigger value="course_content">Course</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {knowledge && Object.entries(knowledge).map(([category, items]: [string, any[]]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons] || Database;
                const colorClass = categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800";
                
                return (
                  <Card key={category} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg capitalize">{category.replace('_', ' ')}</CardTitle>
                          <p className="text-sm text-gray-600">{items.length} items stored</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {items.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">{item.key}</span>
                            <Badge variant="secondary" className="text-xs">
                              Importance: {item.importance}/10
                            </Badge>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-xs text-gray-500 text-center pt-2">
                            +{items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {knowledge && Object.entries(knowledge).map(([category, items]: [string, any[]]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="space-y-4">
                {items.map((item: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{item.key}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            Importance: {item.importance}/10
                          </Badge>
                          <Badge className="bg-teal-100 text-teal-800">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-gray-600">{item.description}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto max-h-96">
                          {typeof item.value === 'object' 
                            ? JSON.stringify(item.value, null, 2)
                            : item.value
                          }
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}