import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { EasterEggProvider } from "@/components/EasterEgg";
import { CircadianProvider } from "@/hooks/useCircadian";
import { MainLayout } from "@/components/MainLayoutWithHierarchy";
import { CartProvider } from "@/hooks/use-cart";
import LandingPage from "@/pages/landing";
import ChatPage from "@/pages/chat";
import SoulMapExplorerPage from "@/pages/soul-map-explorer";
import SoulSyncPage from "@/pages/soul-sync";
import VisionQuestPage from "@/pages/vision-quest";
import CommunityPage from "@/pages/community";
import VibeMatchPage from "@/pages/vibe-match";
import GeoPromptPage from "@/pages/geoprompt";
import DashboardPage from "@/pages/dashboard";
import StorePage from "@/pages/store";
import HelpPage from "@/pages/help";
import SettingsPage from "@/pages/settings";
import BlogPage from "@/pages/blog";
import PrivacyPage from "@/pages/privacy";
import FeaturesPage from "@/pages/features";
import IntegrationsPage from "@/pages/integrations";
import BusinessPage from "@/pages/business";
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
      <Route path="/soul-map-explorer" component={() => (
        <MainLayout>
          <SoulMapExplorerPage />
        </MainLayout>
      )} />
      <Route path="/soul-sync" component={() => (
        <MainLayout>
          <SoulSyncPage />
        </MainLayout>
      )} />
      <Route path="/vision-quest" component={() => (
        <MainLayout>
          <VisionQuestPage />
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
      <Route path="/dashboard" component={() => (
        <MainLayout>
          <DashboardPage />
        </MainLayout>
      )} />
      <Route path="/store" component={() => (
        <MainLayout>
          <StorePage />
        </MainLayout>
      )} />
      <Route path="/help" component={() => (
        <MainLayout>
          <HelpPage />
        </MainLayout>
      )} />
      <Route path="/settings" component={() => (
        <MainLayout>
          <SettingsPage />
        </MainLayout>
      )} />
      <Route path="/blog" component={() => (
        <MainLayout>
          <BlogPage />
        </MainLayout>
      )} />
      <Route path="/privacy" component={() => (
        <MainLayout>
          <PrivacyPage />
        </MainLayout>
      )} />
      <Route path="/features" component={() => (
        <MainLayout>
          <FeaturesPage />
        </MainLayout>
      )} />
      <Route path="/integrations" component={() => (
        <MainLayout>
          <IntegrationsPage />
        </MainLayout>
      )} />
      <Route path="/business" component={() => (
        <MainLayout>
          <BusinessPage />
        </MainLayout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  useEffect(() => {
    document.title = "LightPrompt - Soul-Tech Wellness Platform";
  }, []);

  return (
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CircadianProvider>
            <EasterEggProvider>
              <Router />
              <Toaster />
            </EasterEggProvider>
          </CircadianProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </CartProvider>
  );
}