import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Heart, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  currentView: 'properties' | 'favorites' | 'profile';
  onViewChange: (view: 'properties' | 'favorites' | 'profile') => void;
}

const Header = ({ currentView, onViewChange }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">PropertyHub</h1>
          </div>
          
          {user && (
            <nav className="flex items-center space-x-4">
              <Button
                variant={currentView === 'properties' ? 'default' : 'ghost'}
                onClick={() => onViewChange('properties')}
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                Properties
              </Button>
              <Button
                variant={currentView === 'favorites' ? 'default' : 'ghost'}
                onClick={() => onViewChange('favorites')}
                size="sm"
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                onClick={() => onViewChange('profile')}
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Recommdation
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
