import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import PropertyCard from './PropertyCard';
import PropertyFiltersComponent, { PropertyFilters } from './PropertyFilters';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

type Property = Tables<'properties'>;
type Favorite = Tables<'favorites'>;

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    petFriendly: false,
    parkingAvailable: false,
    furnished: false,
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'available');

      // Apply filters
      if (filters.propertyType) {
        query = query.eq('property_type', filters.propertyType as any);
      }
      if (filters.minPrice) {
        query = query.gte('price', parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte('price', parseFloat(filters.maxPrice));
      }
      if (filters.bedrooms) {
        query = query.gte('bedrooms', parseInt(filters.bedrooms));
      }
      if (filters.bathrooms) {
        query = query.gte('bathrooms', parseInt(filters.bathrooms));
      }
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.petFriendly) {
        query = query.eq('pet_friendly', true);
      }
      if (filters.parkingAvailable) {
        query = query.eq('parking_available', true);
      }
      if (filters.furnished) {
        query = query.eq('furnished', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProperties(data || []);
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

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    const isFavorite = favorites.some(f => f.property_id === propertyId);

    try {
      if (isFavorite) {
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
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            property_id: propertyId,
          });
        
        if (error) throw error;
        fetchFavorites();
        toast({
          title: "Added to favorites",
          description: "Property added to your favorites",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      city: '',
      petFriendly: false,
      parkingAvailable: false,
      furnished: false,
    });
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const isFavorite = (propertyId: string) => {
    return favorites.some(f => f.property_id === propertyId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PropertyFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Available Properties</h2>
            <p className="text-gray-600">{properties.length} properties found</p>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading properties...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={isFavorite(property.id)}
                  onToggleFavorite={toggleFavorite}
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
          {!loading && properties.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No properties found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
