import React from 'react';
import { getUserEmoji, getUserName } from '@/lib/userUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserEmojiDemo = () => {
  // Sample user IDs to demonstrate different emojis
  const sampleUsers = [
    { id: 'user_12345', email: 'alice@example.com' },
    { id: 'user_67890', email: 'bob@example.com' },
    { id: 'user_abcde', email: 'charlie@example.com' },
    { id: 'user_fghij', email: 'diana@example.com' },
    { id: 'user_klmno', email: 'eva@example.com' },
    { id: 'user_pqrst', email: 'frank@example.com' },
    { id: 'user_uvwxy', email: 'grace@example.com' },
    { id: 'user_z1234', email: 'henry@example.com' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">User Emoji System Demo</h2>
      <p className="text-gray-600 mb-8 text-center">
        Each user gets a unique emoji and name based on their user ID
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sampleUsers.map((user) => {
          const emoji = getUserEmoji(user.id);
          const name = getUserName(emoji);
          
          return (
            <Card key={user.id} className="text-center">
              <CardHeader>
                <div className="text-4xl mb-2">{emoji}</div>
                <CardTitle className="text-lg">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-400 mt-2">ID: {user.id}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Each user ID is hashed to generate a consistent number</li>
          <li>• The number maps to one of 30 professional emojis</li>
          <li>• Same user ID always gets the same emoji</li>
          <li>• Each emoji has an associated name for personalization</li>
        </ul>
      </div>
    </div>
  );
};

export default UserEmojiDemo;
