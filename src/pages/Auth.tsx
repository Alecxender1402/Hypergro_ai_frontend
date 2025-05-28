import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to PropertyHub</h1>
        <p className="text-gray-600">Find your perfect rental property</p>
      </div>
      <AuthForm onAuthSuccess={() => window.location.href = '/'} />
    </div>
  </div>
);

export default Auth;
