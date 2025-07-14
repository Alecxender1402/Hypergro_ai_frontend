import React from 'react';
import Header from '@/components/Header';
import RecommendationsReceived from '@/components/recommend/RecommendationsReceived';

const RecommendationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <RecommendationsReceived />
    </div>
  );
};

export default RecommendationsPage;
