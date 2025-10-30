import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

const Index = () => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Auth />;
};

export default Index;
