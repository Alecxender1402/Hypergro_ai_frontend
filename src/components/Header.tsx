import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Heart, Home, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUserEmoji, getUserName } from '@/lib/userUtils';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
  };

  // Determine current view based on pathname
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === '/favorites') return 'favorites';
    if (path === '/recommendations') return 'recommendations';
    if (path === '/profile') return 'profile';
    return 'properties';
  };

  const currentView = getCurrentView();

  // Get user-specific emoji and name
  const userEmoji = user ? getUserEmoji(user.id) : '👤';
  const userName = user ? getUserName(userEmoji) : 'User';

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
                onClick={() => navigate('/')}
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                Properties
              </Button>
              <Button
                variant={currentView === 'favorites' ? 'default' : 'ghost'}
                onClick={() => navigate('/favorites')}
                size="sm"
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Button>
              <Button
                variant={currentView === 'recommendations' ? 'default' : 'ghost'}
                onClick={() => navigate('/recommendations')}
                size="sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Recommendations
              </Button>
              
              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={currentView === 'profile' ? 'default' : 'ghost'}
                    size="sm"
                    className="relative h-8 w-8 rounded-full p-0"
                  >
                    <span className="text-lg">{userEmoji}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userEmoji} {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
