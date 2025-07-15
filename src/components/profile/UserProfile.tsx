import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserEmoji, getUserName } from '@/lib/userUtils';

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">No user data available</div>
      </div>
    );
  }

  // Get user-specific emoji and name
  const userEmoji = getUserEmoji(user.id);
  const userName = getUserName(userEmoji);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">{userEmoji}</div>
        <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
        <p className="text-gray-600">Welcome to your profile</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">User ID</p>
              <p className="text-sm text-gray-600 font-mono">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
