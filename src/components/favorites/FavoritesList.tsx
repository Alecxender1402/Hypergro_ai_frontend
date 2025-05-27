
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import PropertyCard from '../properties/PropertyCard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

type Property = Tables<'properties'>;
type Favorite = Tables<'favorites'>;

const FavoritesList = () => {
  const [favorites, setFavorites] = useState<(Favorite & { properties: Property })[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          properties (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);
      
      if (error) throw error;
      setFavorites(favorites.filter(f => f.property_id !== propertyId));
      toast({
        title: "Removed from favorites",
        description: "Property removed from your favorites",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your favorites...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Your Favorite Properties</h2>
        <p className="text-gray-600">{favorites.length} properties saved</p>
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't saved any properties yet.</p>
          <p className="text-sm text-gray-500">Browse properties and click the heart icon to save your favorites!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <PropertyCard
              key={favorite.id}
              property={favorite.properties}
              isFavorite={true}
              onToggleFavorite={removeFavorite}
              onViewDetails={(property) => {
                toast({
                  title: "Property Details",
                  description: `Viewing details for ${property.title}`,
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
