import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PartnerModeInterface } from "@/components/PartnerModeInterface";

export default function PartnerModePage() {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      setUserId(currentUser.id);
    }
  }, []);

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Partner Mode</h1>
          <p className="text-muted-foreground">Please log in to access Partner Mode features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Partner Mode
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with partners, share wellness insights, and support each other's growth journey.
            Build meaningful connections and achieve your goals together.
          </p>
        </div>
        
        <PartnerModeInterface userId={userId} />
      </div>
    </div>
  );
}