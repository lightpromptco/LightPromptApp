import { ReactNode } from "react";
import { MainNavigation } from "./MainNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainNavigation />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}