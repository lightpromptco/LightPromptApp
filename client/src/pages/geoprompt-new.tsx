import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  QrCode, 
  MapPin, 
  Users, 
  Sparkles, 
  Camera,
  Shield,
  Plus,
  Eye,
  MessageCircle,
  Share,
  Mail,
  Globe
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

interface Interaction {
  id: string;
  locationId: string;
  userId: string;
  message: string;
  timestamp: string;
  aiResponse?: string;
  imageUrl?: string;
}

export default function GeoPromptNew() {
  const [activeView, setActiveView] = useState<'discover' | 'create' | 'guardian'>('discover');
  const [selectedLocation, setSelectedLocation] = useState<QRLocation | null>(null);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianMessage, setGuardianMessage] = useState('');
  const { toast } = useToast();

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

  const handleLocationClick = (location: { lat: number; lng: number }) => {
    console.log('New location selected:', location);
  };

  const [locations, setLocations] = useState<QRLocation[]>([
    {
      id: '1',
      name: 'Central Park Meditation Spot',
      address: '123 Park Ave, New York',
      lat: 40.7829,
      lng: -73.9654,
      qrCode: 'GEOPROMPT_CP_001',
      createdBy: 'lightprompt.co@gmail.com',
      guardians: ['lightprompt.co@gmail.com', 'guardian1@example.com'],
      interactions: 47,
      description: 'A peaceful spot for mindful reflection surrounded by nature in the heart of the city.',
      category: 'nature',
      isActive: true
    },
    {
      id: '2', 
      name: 'Downtown Art Gallery',
      address: '456 Art St, New York',
      lat: 40.7614,
      lng: -73.9776,
      qrCode: 'GEOPROMPT_AG_002',
      createdBy: 'guardian2@example.com',
      guardians: ['guardian2@example.com'],
      interactions: 23,
      description: 'Creative energy flows here - perfect for artistic inspiration and expression.',
      category: 'creative',
      isActive: true
    }
  ]);

  // Check if current user is admin
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.email === 'lightprompt.co@gmail.com';

  const handleScanQR = () => {
    toast({
      title: "QR Scanner",
      description: "Camera QR scanner would open here in a real implementation.",
    });
    // In real implementation, this would open device camera for QR scanning
  };

  const handleCreateLocation = () => {
    toast({
      title: "Location Creator",
      description: "Would open location creation form with map picker.",
    });
    // In real implementation, this would open a form with map picker
  };

  const handleBecomeGuardian = (locationId: string) => {
    setLocations(prev => prev.map(loc => 
      loc.id === locationId 
        ? {...loc, guardians: [...loc.guardians, currentUser.email]}
        : loc
    ));
    toast({
      title: "Guardian Status Activated",
      description: "You're now a guardian for this location!",
    });
  };

  const handleInteraction = async () => {
    if (!selectedLocation || !userMessage.trim()) return;

    const newInteraction: Interaction = {
      id: Date.now().toString(),
      locationId: selectedLocation.id,
      userId: currentUser.email,
      message: userMessage,
      timestamp: new Date().toISOString(),
      aiResponse: `AI responds to your reflection at ${selectedLocation.name}...`,
    };

    // Update location interaction count
    setLocations(prev => prev.map(loc => 
      loc.id === selectedLocation.id 
        ? {...loc, interactions: loc.interactions + 1}
        : loc
    ));

    setUserMessage('');
    setShowInteractionForm(false);
    
    toast({
      title: "Reflection Shared",
      description: "Your location-based reflection has been recorded!",
    });
  };

  const getCategoryColor = (category: QRLocation['category']) => {
    const colors = {
      nature: 'bg-green-100 text-green-800',
      urban: 'bg-blue-100 text-blue-800', 
      sacred: 'bg-purple-100 text-purple-800',
      community: 'bg-orange-100 text-orange-800',
      creative: 'bg-pink-100 text-pink-800'
    };
    return colors[category];
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
            Discover QR code locations for mindful connection and AI-powered presence
          </p>
        </div>

        {/* Action Buttons */}
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

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1">
            <Button
              variant={activeView === 'discover' ? 'default' : 'ghost'}
              onClick={() => setActiveView('discover')}
              className="px-6"
            >
              Discover
            </Button>
            <Button
              variant={activeView === 'guardian' ? 'default' : 'ghost'}
              onClick={() => setActiveView('guardian')}
              className="px-6"
            >
              Guardian Hub
            </Button>
          </div>
        </div>

        {/* Discover View */}
        {activeView === 'discover' && (
          <div className="max-w-6xl mx-auto">
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
                        {location.interactions} Interactions
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedLocation(location);
                          setShowInteractionForm(true);
                        }}
                      >
                        <Sparkles className="mr-1" size={14} />
                        Reflect Here
                      </Button>
                      
                      {!location.guardians.includes(currentUser.email) && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBecomeGuardian(location.id)}
                        >
                          <Shield className="mr-1" size={14} />
                          Guardian
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Guardian Hub */}
        {activeView === 'guardian' && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Your Guardian Locations</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Locations you're responsible for maintaining and moderating
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations
                    .filter(loc => loc.guardians.includes(currentUser.email))
                    .map(location => (
                    <div key={location.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{location.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(location.category)}>
                            {location.category}
                          </Badge>
                          <Badge variant={location.isActive ? 'default' : 'secondary'}>
                            {location.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {location.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          QR: {location.qrCode} | Interactions: {location.interactions}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-1" size={14} />
                            View Stats
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share className="mr-1" size={14} />
                            Share QR
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {locations.filter(loc => loc.guardians.includes(currentUser.email)).length === 0 && (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <Shield className="mx-auto mb-4" size={48} />
                      <p>You're not a guardian for any locations yet.</p>
                      <p className="text-sm">Become a guardian by visiting locations and clicking the Guardian button.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Interaction Modal */}
        {showInteractionForm && selectedLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Reflect at {selectedLocation.name}</CardTitle>
                <p className="text-gray-600 dark:text-gray-400">
                  Share your thoughts and receive AI insights about this special place
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What are you feeling or thinking at this location?"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInteractionForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleInteraction} disabled={!userMessage.trim()}>
                    <Sparkles className="mr-1" size={14} />
                    Share Reflection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <CardContent className="p-8 text-center">
              <QrCode className="mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold mb-4">How GeoPrompt Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Camera className="mx-auto mb-2" size={32} />
                  <h4 className="font-semibold mb-2">1. Scan</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use your camera to scan QR codes at special locations
                  </p>
                </div>
                <div>
                  <MessageCircle className="mx-auto mb-2" size={32} />
                  <h4 className="font-semibold mb-2">2. Reflect</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Share your thoughts and get AI insights about the place
                  </p>
                </div>
                <div>
                  <Users className="mx-auto mb-2" size={32} />
                  <h4 className="font-semibold mb-2">3. Connect</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Join others who've reflected here and become location guardians
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}