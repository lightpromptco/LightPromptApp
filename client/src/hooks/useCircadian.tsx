import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface CircadianContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

const CircadianContext = createContext<CircadianContextType>({
  theme: 'light',
  setTheme: () => {},
  timeOfDay: 'morning',
});

export function useCircadian() {
  return useContext(CircadianContext);
}

interface CircadianProviderProps {
  children: ReactNode;
}

export function CircadianProvider({ children }: CircadianProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  useEffect(() => {
    // Get current time and set appropriate theme
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      setTimeOfDay('morning');
      setTheme('light');
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon');
      setTheme('light');
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('evening');
      setTheme('light');
    } else {
      setTimeOfDay('night');
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value = {
    theme,
    setTheme,
    timeOfDay,
  };

  return (
    <CircadianContext.Provider value={value}>
      {children}
    </CircadianContext.Provider>
  );
}