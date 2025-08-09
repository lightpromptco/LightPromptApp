import { Switch, Route } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/MainNavigation";
import LandingPage from "@/pages/landing";
import ChatPage from "@/pages/chat";
import AdminPage from "@/pages/admin";
import PrivacyPage from "@/pages/privacy";
import CourseAccessPage from "@/pages/course-access";
import DashboardPage from "@/pages/dashboard";
import ChallengesPage from "@/pages/challenges";
import SignupPage from "@/pages/signup";
import PlansPage from "@/pages/plans";
import VibeMatchPage from "@/pages/vibe-match";
import GeoPromptPage from "@/pages/geoprompt";
import PrismPointsPage from "@/pages/prism-points";
import HelpPage from "@/pages/help";
import BookPage from "@/pages/book";
import CoursePage from "@/pages/course";
import ProductsPage from "@/pages/products";
import B2BPage from "@/pages/b2b";
import SettingsPage from "@/pages/settings";
import AdminSettingsPage from "@/pages/admin-settings";
import WooWooPage from "@/pages/woo-woo";
import VisionQuestPage from "@/pages/vision-quest";
import VisionQuestIndexPage from "@/pages/vision-quest/index";
import VisionQuestStagePage from "@/pages/vision-quest/stage";
import ContentManagement from "@/pages/admin/content";
import BlogPage from "@/pages/blog";
import CommunityPage from "@/pages/community";
import PartnerModePage from "@/pages/partner-mode";
import SoulSyncPage from "@/pages/soul-sync";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/chat" component={() => (
        <MainLayout>
          <ChatPage />
        </MainLayout>
      )} />
      <Route path="/admin" component={() => (
        <MainLayout>
          <AdminPage />
        </MainLayout>
      )} />
      <Route path="/privacy" component={() => (
        <MainLayout>
          <PrivacyPage />
        </MainLayout>
      )} />
      <Route path="/course-access" component={() => (
        <MainLayout>
          <CourseAccessPage />
        </MainLayout>
      )} />
      <Route path="/dashboard" component={() => (
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      )} />
      <Route path="/challenges" component={() => (
        <MainLayout>
          <ChallengesPage />
        </MainLayout>
      )} />
      <Route path="/signup" component={() => (
        <MainLayout>
          <SignupPage />
        </MainLayout>
      )} />
      <Route path="/plans" component={() => (
        <MainLayout>
          <PlansPage />
        </MainLayout>
      )} />
      <Route path="/community" component={() => (
        <MainLayout>
          <CommunityPage />
        </MainLayout>
      )} />
      <Route path="/vibe-match" component={() => (
        <MainLayout>
          <VibeMatchPage />
        </MainLayout>
      )} />
      <Route path="/geoprompt" component={() => (
        <MainLayout>
          <GeoPromptPage />
        </MainLayout>
      )} />
      <Route path="/prism-points" component={() => (
        <MainLayout>
          <PrismPointsPage />
        </MainLayout>
      )} />
      <Route path="/help" component={() => (
        <MainLayout>
          <HelpPage />
        </MainLayout>
      )} />
      <Route path="/book" component={() => (
        <MainLayout>
          <BookPage />
        </MainLayout>
      )} />
      <Route path="/course" component={() => (
        <MainLayout>
          <CoursePage />
        </MainLayout>
      )} />
      <Route path="/products" component={() => (
        <MainLayout>
          <ProductsPage />
        </MainLayout>
      )} />
      <Route path="/b2b" component={() => (
        <MainLayout>
          <B2BPage />
        </MainLayout>
      )} />
      <Route path="/settings" component={() => (
        <MainLayout>
          <SettingsPage />
        </MainLayout>
      )} />
      <Route path="/admin/settings" component={() => (
        <MainLayout>
          <AdminSettingsPage />
        </MainLayout>
      )} />
      <Route path="/woo-woo" component={() => (
        <MainLayout>
          <WooWooPage />
        </MainLayout>
      )} />
      <Route path="/vision-quest" component={() => (
        <MainLayout>
          <VisionQuestPage />
        </MainLayout>
      )} />
      <Route path="/vision-quest/index" component={() => (
        <MainLayout>
          <VisionQuestIndexPage />
        </MainLayout>
      )} />
      <Route path="/vision-quest/stage/:stageId" component={() => (
        <MainLayout>
          <VisionQuestStagePage />
        </MainLayout>
      )} />
      <Route path="/admin/content" component={() => (
        <MainLayout>
          <ContentManagement />
        </MainLayout>
      )} />
      <Route path="/blog" component={() => (
        <MainLayout>
          <BlogPage />
        </MainLayout>
      )} />
      <Route path="/community" component={() => (
        <MainLayout>
          <CommunityPage />
        </MainLayout>
      )} />
      <Route path="/soul-sync" component={() => (
        <MainLayout>
          <SoulSyncPage />
        </MainLayout>
      )} />
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
