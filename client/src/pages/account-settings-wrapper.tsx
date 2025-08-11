import { useState, useEffect } from 'react';
import { User, UserProfile } from '@shared/schema';
import { AccountSettings } from './account-settings';
import { Loader2 } from 'lucide-react';

export function AccountSettingsWrapper() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage (matching ChatPage pattern)
    const initializeUser = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to access account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <AccountSettings 
      user={user}
      userProfile={userProfile}
      onUserUpdate={handleUserUpdate}
    />
  );
}