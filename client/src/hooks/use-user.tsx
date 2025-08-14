import { useQuery } from "@tanstack/react-query";
import { User as SchemaUser } from "@shared/schema";

// Simple user hook that returns user data and loading state
// Removed duplicate - using context-based version below
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  tier: string;
  role: string;
  tokensUsed: number;
  tokenLimit: number;
  courseAccess: boolean;
  createdAt: string;
}

interface UserProfile {
  userId: string;
  currentMood?: string;
  moodDescription?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  coreValues?: string[];
  intentions?: string[];
  vibeMatchEnabled?: boolean;
  vibeMatchBio?: string;
  evolutionScore?: number;
  reflectionStreak?: number;
  preferences?: any;
  privacySettings?: any;
}

interface UserContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Load user profile
          try {
            const profileResp = await apiRequest('GET', `/api/users/${userData.id}/profile`);
            if (profileResp.ok) {
              const profile = await profileResp.json();
              setUserProfile(profile);
            }
          } catch (e) {
            console.log('No user profile found, will create on first update');
          }
        }
      } catch (e) {
        console.error('Error loading user:', e);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string) => {
    try {
      setLoading(true);
      const resp = await apiRequest('GET', `/api/users/email/${encodeURIComponent(email)}`);
      
      if (resp.ok) {
        const userData = await resp.json();
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Load profile
        try {
          const profileResp = await apiRequest('GET', `/api/users/${userData.id}/profile`);
          if (profileResp.ok) {
            const profile = await profileResp.json();
            setUserProfile(profile);
          }
        } catch (e) {
          console.log('No profile found for user');
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      const resp = await apiRequest('PATCH', `/api/users/${user.id}/profile`, updates);
      if (resp.ok) {
        const updatedProfile = await resp.json();
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const resp = await apiRequest('GET', `/api/users/${user.id}`);
      if (resp.ok) {
        const userData = await resp.json();
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('User refresh error:', error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      userProfile,
      loading,
      login,
      logout,
      updateProfile,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
