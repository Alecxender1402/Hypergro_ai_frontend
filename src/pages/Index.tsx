import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import Header from '@/components/Header';
import PropertyList from '@/components/properties/PropertyList';
import FavoritesList from '@/components/favorites/FavoritesList';
import UserProfile from '@/components/profile/UserProfile';
import auth from './Auth';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'properties' | 'favorites' | 'profile'>('properties');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
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
      case 'properties':
        return <PropertyList />;
      case 'favorites':
        return <FavoritesList />;
      case 'profile':
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
