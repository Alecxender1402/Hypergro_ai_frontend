import React from 'react';
import Header from '@/components/Header';
import FavoritesList from '@/components/favorites/FavoritesList';

const FavoritesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FavoritesList />
    </div>
  );
};

export default FavoritesPage;
