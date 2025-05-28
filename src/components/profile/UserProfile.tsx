import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile, updateUserProfile, UserProfile as IUserProfile } from '@/services/api';

const UserProfile = () => {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });
  const { toast } = useToast();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getUserProfile();
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateUserProfile({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
      });
      setProfile(updated);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Update Profile'}
            </Button>
          </form>
          {profile && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Account Information</h3>
              <div className="text-sm text-gray-600">
                <p>Member since: {new Date(profile.createdAt).toLocaleDateString()}</p>
                <p>Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
