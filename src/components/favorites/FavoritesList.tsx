import React, { useState, useEffect } from "react";
import { favoritesAPI, Favorite } from "@/services/api";
import PropertyCard from "../properties/PropertyCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const FavoritesList = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await favoritesAPI.getFavorites();
      setFavorites(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId: string) => {
    if (!user) return;
    const favorite = favorites.find((f) => f.property._id === propertyId);
    if (!favorite) return;
    try {
      await favoritesAPI.removeFavorite(favorite._id);
      setFavorites(favorites.filter((f) => f.property._id !== propertyId));
      toast({
        title: "Removed from favorites",
        description: "Property removed from your favorites",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  // Handler for viewing details
  const handleViewDetails = (property: any) => {
    navigate(`/properties/${property._id}`);
  };

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
          <p className="text-gray-600 mb-4">
            You haven't saved any properties yet.
          </p>
          <p className="text-sm text-gray-500">
            Browse properties and click the heart icon to save your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites
            .filter((favorite) => favorite.property)
            .map((favorite) => (
              <PropertyCard
                key={favorite._id}
                property={favorite.property}
                isFavorite={true}
                showRemoveButton={true}
                onRemoveFavorite={removeFavorite}
                onViewDetails={handleViewDetails}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
