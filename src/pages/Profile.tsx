import React from 'react';
import Header from '@/components/Header';
import UserProfile from '@/components/profile/UserProfile';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <UserProfile />
    </div>
  );
};

export default ProfilePage;
