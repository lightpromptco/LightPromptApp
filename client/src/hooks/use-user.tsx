import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

// Simple user hook that returns user data and loading state
export function useUser() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
  };
}