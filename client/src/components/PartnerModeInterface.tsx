import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { PartnerConnection, User } from '@shared/schema';

interface PartnerModeInterfaceProps {
  userId: string;
}

export function PartnerModeInterface({ userId }: PartnerModeInterfaceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  // Get partner connections
  const { data: connections, isLoading } = useQuery<PartnerConnection[]>({
    queryKey: ['/api/partner-connections', userId],
    queryFn: async () => {
      const response = await fetch(`/api/partner-connections/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch connections');
      return response.json();
    },
  });

  // Send partner invitation
  const invitePartnerMutation = useMutation({
    mutationFn: async ({ email, relationshipType }: { email: string; relationshipType: string }) => {
      const response = await fetch('/api/partner-connections/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          inviteEmail: email,
          relationshipType,
        }),
      });
      if (!response.ok) throw new Error('Failed to send invitation');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/partner-connections'] });
      setInviteEmail('');
      toast({
        title: "Invitation sent! 💕",
        description: "Your partner will receive an email to join your wellness journey.",
      });
    },
  });

  // Update shared goal
  const updateGoalMutation = useMutation({
    mutationFn: async ({ connectionId, goal }: { connectionId: string; goal: string }) => {
      const response = await fetch(`/api/partner-connections/${connectionId}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });
      if (!response.ok) throw new Error('Failed to update goal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/partner-connections'] });
      setNewGoal('');
      toast({
        title: "Goal added! ✨",
        description: "Your shared growth intention has been saved.",
      });
    },
  });

  const handleInvitePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    invitePartnerMutation.mutate({ 
      email: inviteEmail.trim(), 
      relationshipType: 'romantic' // Default, will add selection later
    });
  };

  const handleAddGoal = (connectionId: string) => {
    if (!newGoal.trim()) return;
    updateGoalMutation.mutate({ connectionId, goal: newGoal.trim() });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading your connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Partner Mode</h2>
        <p className="text-gray-600">
          Share your wellness journey with trusted partners and grow together through meaningful connection.
        </p>
      </div>

      {/* Invite Partner */}
      <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <i className="fas fa-heart text-teal-600 mr-2"></i>
            Invite a Partner
          </CardTitle>
          <p className="text-sm text-gray-600">
            Invite someone special to share your wellness insights and grow together
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvitePartner} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partner-email">Partner's Email</Label>
                <Input
                  id="partner-email"
                  type="email"
                  placeholder="their.email@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="relationship-type">Relationship Type</Label>
                <Select defaultValue="romantic">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="romantic">💕 Romantic Partner</SelectItem>
                    <SelectItem value="friendship">🫂 Close Friend</SelectItem>
                    <SelectItem value="family">🏡 Family Member</SelectItem>
                    <SelectItem value="growth_partner">🌱 Growth Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={!inviteEmail.trim() || invitePartnerMutation.isPending}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600"
            >
              {invitePartnerMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending invitation...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Invitation
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Connections */}
      {connections && connections.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Wellness Partners</h3>
          
          {connections.map((connection) => (
            <Card key={connection.id} className="border-l-4 border-l-teal-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-300 to-pink-400 rounded-full flex items-center justify-center">
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">Your {connection.relationshipType.replace('_', ' ')} Partner</h4>
                      <p className="text-sm text-gray-600">
                        Connection Level: {connection.connectionLevel}/10
                      </p>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="capitalize">
                    {connection.relationshipType.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Data Sharing Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-3">Shared Wellness Data</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(connection.dataSharing as any || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="text-sm capitalize">
                          {key.replace('_', ' ')}
                        </Label>
                        <Switch checked={value as boolean} disabled />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Goals */}
                <div>
                  <h5 className="font-medium mb-3">Shared Growth Goals</h5>
                  <div className="space-y-2 mb-3">
                    {(connection.sharedGoals as string[] || []).map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-teal-50 p-2 rounded">
                        <i className="fas fa-target text-teal-500"></i>
                        <span className="text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a shared growth goal..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => handleAddGoal(connection.id)}
                      disabled={!newGoal.trim() || updateGoalMutation.isPending}
                      size="sm"
                    >
                      <i className="fas fa-plus"></i>
                    </Button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    <i className="fas fa-chart-line mr-2"></i>
                    View Shared Insights
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-comments mr-2"></i>
                    Send Wellness Check-in
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="fas fa-gift mr-2"></i>
                    Share Recommendation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <i className="fas fa-heart text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No partners connected yet</h3>
            <p className="text-gray-600 mb-4">
              Partner Mode allows you to share your wellness journey with trusted individuals.
              Start by inviting someone special!
            </p>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              💡 <strong>How it works:</strong> When you invite a partner, they'll receive an email to join LightPrompt. 
              Once connected, you can share wellness insights, set mutual goals, and support each other's growth.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}