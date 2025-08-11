import { createContext, useContext, ReactNode } from 'react';

interface EasterEggContextType {
  // Add easter egg functionality here if needed
}

const EasterEggContext = createContext<EasterEggContextType>({});

export function useEasterEgg() {
  return useContext(EasterEggContext);
}

interface EasterEggProviderProps {
  children: ReactNode;
}

export function EasterEggProvider({ children }: EasterEggProviderProps) {
  return (
    <EasterEggContext.Provider value={{}}>
      {children}
    </EasterEggContext.Provider>
  );
}