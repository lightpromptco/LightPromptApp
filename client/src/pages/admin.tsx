import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserProfile } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if current user is admin (database role OR localStorage admin mode)
  const currentUserId = localStorage.getItem('lightprompt_user_id');
  const isLocalAdminMode = localStorage.getItem('lightprompt-admin-mode') === 'true';
  
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/users', currentUserId],
    enabled: !!currentUserId,
  });

  // Get all users (admin only)
  const isAdmin = currentUser?.role === 'admin' || isLocalAdminMode;
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: isAdmin,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User updated successfully" });
    },
  });

  // Reset tokens mutation
  const resetTokensMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}/reset-tokens`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reset tokens');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "Tokens reset successfully" });
    },
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You need admin privileges to access this page.
              {!isLocalAdminMode && (
                <span className="block text-sm mt-2 text-gray-500">
                  To enable admin mode, add "lightprompt-admin-mode" = "true" to localStorage
                </span>
              )}
            </p>
            <Link href="/">
              <Button>Return to Chat</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-600">Manage LightPrompt users and settings</p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Chat
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-users text-teal-600"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Free Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.tier === 'free').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-user text-blue-600"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Premium Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.tier !== 'free' && u.tier !== 'admin').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-crown text-amber-600"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => {
                      const today = new Date().toDateString();
                      return new Date(u.resetDate).toDateString() === today;
                    }).length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-green-600"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Tier</th>
                    <th className="text-left py-3 px-4">Tokens</th>
                    <th className="text-left py-3 px-4">Last Reset</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {user.avatarUrl ? (
                            <img 
                              src={user.avatarUrl} 
                              alt="Avatar" 
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                              <i className="fas fa-user text-teal-600 text-xs"></i>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.tier}
                          onChange={(e) => updateUserMutation.mutate({
                            userId: user.id,
                            updates: { tier: e.target.value }
                          })}
                          className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                          <option value="free">Free</option>
                          <option value="tier_29">$29+ Tier</option>
                          <option value="tier_49">$49+ Tier</option>
                          {isAdmin && (
                            <option value="admin">Admin</option>
                          )}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{user.tokensUsed}/{user.tokenLimit}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resetTokensMutation.mutate(user.id)}
                            disabled={resetTokensMutation.isPending}
                          >
                            Reset
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(user.resetDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <select
                            value={user.tokenLimit}
                            onChange={(e) => updateUserMutation.mutate({
                              userId: user.id,
                              updates: { tokenLimit: parseInt(e.target.value) }
                            })}
                            className="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm w-20"
                          >
                            <option value="10">10</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                            <option value="9999">Unlimited</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}