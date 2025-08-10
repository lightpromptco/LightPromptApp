import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Users, 
  Sparkles, 
  Shield,
  Plus,
  Eye,
  MessageCircle,
  Mail,
  Globe,
  Camera,
  Heart,
  Navigation
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GoogleMap from "@/components/GoogleMap";

interface QRLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  qrCode: string;
  createdBy: string;
  guardians: string[];
  interactions: number;
  description: string;
  category: 'nature' | 'urban' | 'sacred' | 'community' | 'creative';
  isActive: boolean;
}

export default function GeoPrompt() {
  const [activeTab, setActiveTab] = useState('discover');
  const [selectedLocation, setSelectedLocation] = useState<QRLocation | null>(null);
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianMessage, setGuardianMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const { toast } = useToast();

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.email === 'lightprompt.co@gmail.com';

  const [locations] = useState<QRLocation[]>([
    {
      id: '1',
      name: 'Central Park Meditation Spot',
      address: '123 Park Ave, New York',
      lat: 40.7829,
      lng: -73.9654,
      qrCode: 'GEOPROMPT_CP_001',
      createdBy: 'lightprompt.co@gmail.com',
      guardians: ['lightprompt.co@gmail.com', 'guardian1@example.com'],
      interactions: 127,
      description: 'A peaceful spot for mindful reflection surrounded by nature in the heart of the city.',
      category: 'nature',
      isActive: true
    },
    {
      id: '2', 
      name: 'Golden Gate Bridge Viewpoint',
      address: 'Golden Gate Bridge, San Francisco',
      lat: 37.8199,
      lng: -122.4783,
      qrCode: 'GEOPROMPT_GG_002',
      createdBy: 'guardian2@example.com',
      guardians: ['sf.guardian@lightprompt.co'],
      interactions: 89,
      description: 'Sunrise contemplation point with breathtaking views.',
      category: 'sacred',
      isActive: true
    },
    {
      id: '3',
      name: 'Griffith Observatory',
      address: '2800 E Observatory Rd, Los Angeles',
      lat: 34.1184,
      lng: -118.3004,
      qrCode: 'GEOPROMPT_GO_003',
      createdBy: 'guardian3@example.com',
      guardians: ['la.guardian@lightprompt.co'],
      interactions: 156,
      description: 'Stars and cosmic connection under the night sky.',
      category: 'sacred',
      isActive: true
    },
    {
      id: '4',
      name: 'Brooklyn Bridge',
      address: 'Brooklyn Bridge, New York',
      lat: 40.7061,
      lng: -73.9969,
      qrCode: 'GEOPROMPT_BB_004',
      createdBy: 'guardian4@example.com',
      guardians: ['brooklyn.guardian@lightprompt.co'],
      interactions: 203,
      description: 'Urban mindfulness walk connecting two boroughs.',
      category: 'urban',
      isActive: true
    }
  ]);

  const handleGuardianSignup = () => {
    if (!guardianEmail.trim() || !guardianMessage.trim()) {
      toast({
        title: "Please complete all fields",
        description: "Email and message are required to become a Guardian",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Guardian Application Sent!",
      description: "We'll review your application and get back to you within 24 hours.",
    });
    setGuardianEmail('');
    setGuardianMessage('');
  };

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    console.log('New location selected:', location);
    toast({
      title: "Location Selected",
      description: "Click 'Suggest Location' to add this as a new GeoPrompt spot",
    });
  };

  const handleScanQR = () => {
    toast({
      title: "QR Scanner",
      description: "Camera QR scanner would open here in a real implementation.",
    });
  };

  const handleCreateLocation = () => {
    toast({
      title: "Location Creator",
      description: "Would open location creation form with map picker.",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      nature: 'bg-green-100 text-green-800',
      urban: 'bg-blue-100 text-blue-800', 
      sacred: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800',
      creative: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            GeoPrompt
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover locations for mindful connection and AI-powered presence through interactive maps
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-8 space-x-4">
          <Button onClick={handleScanQR} size="lg" className="px-6">
            <Camera className="mr-2" size={20} />
            Scan QR Code
          </Button>
          {isAdmin && (
            <Button onClick={handleCreateLocation} variant="outline" size="lg" className="px-6">
              <Plus className="mr-2" size={20} />
              Create Location
            </Button>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="guardian">Guardian Hub</TabsTrigger>
            <TabsTrigger value="apply">Join as Guardian</TabsTrigger>
          </TabsList>
          
          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map(location => (
                <Card key={location.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{location.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {location.address}
                        </p>
                      </div>
                      <Badge className={getCategoryColor(location.category)}>
                        {location.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {location.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="mr-1" size={16} />
                        {location.guardians.length} Guardian{location.guardians.length !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MessageCircle className="mr-1" size={16} />
                        {location.interactions} Check-ins
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedLocation(location)}
                      >
                        <Sparkles className="mr-1" size={14} />
                        Check In
                      </Button>
                      <Button size="sm" variant="outline">
                        <Navigation className="mr-1" size={14} />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2" size={20} />
                  GeoPrompt Locations Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GoogleMap 
                  height="600px"
                  onLocationSelect={handleLocationSelect}
                  locations={locations.map(loc => ({
                    id: loc.id,
                    name: loc.name,
                    lat: loc.lat,
                    lng: loc.lng,
                    description: loc.description,
                    guardianEmail: loc.guardians[0],
                    checkIns: loc.interactions
                  }))}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guardian Hub Tab */}
          <TabsContent value="guardian" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2" size={20} />
                    Your Guardian Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {locations.filter(loc => loc.guardians.includes(currentUser.email)).length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-muted-foreground mb-4">
                        You're not a guardian at any locations yet
                      </p>
                      <Button onClick={() => setActiveTab('apply')} variant="outline">
                        Apply to be a Guardian
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {locations
                        .filter(loc => loc.guardians.includes(currentUser.email))
                        .map(location => (
                          <Card key={location.id}>
                            <CardContent className="p-4">
                              <h3 className="font-semibold">{location.name}</h3>
                              <p className="text-sm text-muted-foreground">{location.address}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm">{location.interactions} check-ins</span>
                                <Button size="sm" variant="outline">
                                  <Eye className="mr-1" size={14} />
                                  View Details
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Guardian Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-950/20 dark:to-teal-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {locations.reduce((sum, loc) => sum + loc.interactions, 0)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Check-ins</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {locations.reduce((sum, loc) => sum + loc.guardians.length, 0)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Guardians</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {locations.length}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Locations</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Apply Tab */}
          <TabsContent value="apply" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2" size={20} />
                  Apply to be a Guardian
                </CardTitle>
                <p className="text-muted-foreground">
                  Help guide others in mindful practices at special locations around the world
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={guardianEmail}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Location Type</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Nature spots</option>
                      <option>Urban locations</option>
                      <option>Sacred places</option>
                      <option>Community spaces</option>
                      <option>Creative venues</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Why do you want to be a Guardian?</label>
                  <Textarea
                    placeholder="Tell us about your experience with mindfulness, location connection, or helping others on their journey of self-discovery..."
                    value={guardianMessage}
                    onChange={(e) => setGuardianMessage(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Guardian Responsibilities</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Guide visitors through mindful practices at your location</li>
                    <li>• Share insights about the location's special energy or history</li>
                    <li>• Help maintain the peaceful, reflective atmosphere</li>
                    <li>• Report any issues or suggestions for improvement</li>
                  </ul>
                </div>

                <Button onClick={handleGuardianSignup} className="w-full" size="lg">
                  <Mail className="mr-2" size={16} />
                  Submit Guardian Application
                </Button>

                <div className="text-center text-sm text-muted-foreground space-y-1">
                  <p>Applications are reviewed within 24 hours.</p>
                  <p>We'll contact you with next steps if approved.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Interaction Modal */}
        {selectedLocation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{selectedLocation.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedLocation.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Share your reflection</label>
                  <Textarea
                    placeholder="What insights or feelings arise in this moment?"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: "Reflection Shared",
                        description: "Your mindful moment has been recorded",
                      });
                      setSelectedLocation(null);
                      setUserMessage('');
                    }}
                  >
                    Share Reflection
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedLocation(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}