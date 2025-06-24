import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import PropertyList from "@/components/properties/PropertyList";
import FavoritesList from "@/components/favorites/FavoritesList";
import UserProfile from "@/components/profile/UserProfile";
import { useNavigate } from "react-router-dom";

// Helper to check JWT expiry
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
}

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<
    "properties" | "favorites" | "profile"
  >("properties");
  const navigate = useNavigate();

  // 1. Check for token and expiry before anything else
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      window.localStorage.removeItem("token"); // Optional: clean up
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  // 2. Redirect if user is not authenticated after loading
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "properties":
        return <PropertyList />;
      case "favorites":
        return <FavoritesList />;
      case "profile":
        return <UserProfile />;
      default:
        return <PropertyList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;
