import { ReactNode } from "react";
import { HierarchicalNavigation } from "./HierarchicalNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <HierarchicalNavigation />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}