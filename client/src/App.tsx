import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChatPage from "@/pages/chat";
import AdminPage from "@/pages/admin";
import PrivacyPage from "@/pages/privacy";
import CourseAccessPage from "@/pages/course-access";
import DashboardPage from "@/pages/dashboard";
import ChallengesPage from "@/pages/challenges";
import SignupPage from "@/pages/signup";
import NotFound from "@/pages/not-found";

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
