import { Switch, Route } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import ChatPage from "@/pages/chat";
import AdminPage from "@/pages/admin";
import PrivacyPage from "@/pages/privacy";
import CourseAccessPage from "@/pages/course-access";
import DashboardPage from "@/pages/dashboard";
import ChallengesPage from "@/pages/challenges";
import SignupPage from "@/pages/signup";
import PlansPage from "@/pages/plans";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/course-access" component={CourseAccessPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/challenges" component={ChallengesPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/plans" component={PlansPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Global Easter Egg System
function useEasterEggs() {
  const { toast } = useToast();

  useEffect(() => {
    // Konami Code Easter Egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiProgress = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === konamiCode[konamiProgress]) {
        konamiProgress++;
        if (konamiProgress === konamiCode.length) {
          discoverEasterEgg('konami-code', 'The Ancient Sequence', 'You remember the old ways...', 30);
          konamiProgress = 0;
        }
      } else {
        konamiProgress = 0;
      }
    };

    // Midnight Visitor Easter Egg
    const checkMidnightVisitor = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 2 && hour <= 4) {
        // Check if user hasn't discovered this egg recently
        const lastMidnightEgg = localStorage.getItem('lastMidnightEgg');
        const lastTime = lastMidnightEgg ? new Date(lastMidnightEgg) : null;
        const today = now.toDateString();
        
        if (!lastTime || lastTime.toDateString() !== today) {
          localStorage.setItem('lastMidnightEgg', now.toISOString());
          setTimeout(() => {
            discoverEasterEgg('midnight-visitor', 'Night Owl Wisdom', 'The night holds special insights.', 40);
          }, 3000); // Delay a bit for mystery
        }
      }
    };

    const discoverEasterEgg = async (eggId: string, name: string, description: string, points: number) => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!currentUser.id) return;

        // Check if already discovered
        const discovered = localStorage.getItem(`egg-${eggId}`);
        if (discovered) return;

        // Mark as discovered locally
        localStorage.setItem(`egg-${eggId}`, 'true');

        // Award the discovery
        await apiRequest('POST', '/api/easter-eggs/discover', {
          userId: currentUser.id,
          eggId: eggId
        });

        // Show magical notification
        toast({
          title: `🥚 ${name} Discovered!`,
          description: `${description} (+${points} points)`,
          className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none",
        });

        // Add sparkle animation to body
        document.body.classList.add('easter-egg-sparkle');
        setTimeout(() => {
          document.body.classList.remove('easter-egg-sparkle');
        }, 3000);

        console.log(`🥚 Easter Egg Discovered: ${name}`);
      } catch (error) {
        console.error('Error discovering easter egg:', error);
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    checkMidnightVisitor();
    
    // Expose easter egg function globally for other components
    (window as any).discoverEasterEgg = discoverEasterEgg;

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      delete (window as any).discoverEasterEgg;
    };
  }, [toast]);
}

function EasterEggProvider({ children }: { children: React.ReactNode }) {
  useEasterEggs();
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <EasterEggProvider>
          <Toaster />
          <Router />
        </EasterEggProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
