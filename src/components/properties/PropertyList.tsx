import React, { useState, useEffect, useCallback } from "react";
import PropertyCard from "./PropertyCard";
import PropertyFiltersComponent, { PropertyFilters } from "./PropertyFilters";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import AddPropertyModal from "./AddPropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import { propertyAPI, favoritesAPI, Favorite, Property } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "../ui/button";

const PAGE_SIZE = 12;

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [filters, setFilters] = useState<PropertyFilters>({
    state: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    minAreaSqFt: "",
    maxAreaSqFt: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    furnished: "",
    availableFrom: "",
    minRating: "",
    maxRating: "",
    isVerified: "",
    listingType: "",
    propertyType: "",
  });
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debounce filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 500); // 500ms delay

  // Fetch properties when debounced filters or page change
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await propertyAPI.getProperties({ 
        ...debouncedFilters, 
        page, 
        limit: PAGE_SIZE 
      });
      setProperties(res.data);
      setTotal(res.total);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch properties",
        variant: "destructive",
      });
      // Set empty results on error
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, page, toast]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Fetch user favorites if logged in
  useEffect(() => {
    if (user) {
      favoritesAPI.getFavorites().then(setFavorites);
    }
  }, [user]);

  const handlePageChange = (newPage: number) => setPage(newPage);

  const clearFilters = useCallback(() => {
    setFilters({
      state: "",
      city: "",
      minPrice: "",
      maxPrice: "",
      minAreaSqFt: "",
      maxAreaSqFt: "",
      bedrooms: "",
      bathrooms: "",
      amenities: [],
      furnished: "",
      availableFrom: "",
      minRating: "",
      maxRating: "",
      isVerified: "",
      listingType: "",
      propertyType: "",
    });
    setPage(1);
  }, []);

  // Optimized filter change handler
  const handleFiltersChange = useCallback((updatedFilters: PropertyFilters) => {
    setFilters(updatedFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  const isFavorite = (propertyId: string) =>
    favorites.some((fav) => fav.property._id === propertyId);

  const getFavoriteId = (propertyId: string) => {
    const favorite = favorites.find((fav) => fav.property._id === propertyId);
    return favorite ? favorite._id : null;
  };

  const handleToggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite(propertyId)) {
        const favoriteId = getFavoriteId(propertyId);
        if (favoriteId) {
          await favoritesAPI.removeFavorite(favoriteId);
          setFavorites((prev) =>
            prev.filter((fav) => fav._id !== favoriteId)
          );
          toast({
            title: "Success",
            description: "Removed from favorites",
          });
        }
      } else {
        const favorite = await favoritesAPI.addFavorite(propertyId);
        setFavorites((prev) => [...prev, favorite]);
        toast({
          title: "Success",
          description: "Added to favorites",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddProperty = async (propertyData: any) => {
    try {
      await propertyAPI.createProperty(propertyData);
      toast({
        title: "Property added",
        description: "Property has been added successfully.",
      });
      setIsAddModalOpen(false);
      // Refresh properties
      const res = await propertyAPI.getProperties({ ...filters, page, limit: PAGE_SIZE });
      setProperties(res.data);
      setTotal(res.total);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProperty = async (updatedData: any) => {
    if (!selectedProperty) return;
    try {
      // 1. Update in DB (API)
      const updated = await propertyAPI.updateProperty(selectedProperty._id, updatedData);
      toast({
        title: "Property updated",
        description: "Property updated successfully.",
      });
      setIsEditModalOpen(false);
      setSelectedProperty(null);
  
      // 2. Refresh property list from backend (best for consistency)
      const res = await propertyAPI.getProperties({ ...filters, page, limit: PAGE_SIZE });
      setProperties(res.data);
      setTotal(res.total);
  
      // 3. Optionally, persist last updated property for details page (see below)
      localStorage.setItem("lastUpdatedProperty", JSON.stringify(updated));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
  try {
    await propertyAPI.deleteProperty(propertyId); // API call to backend
    setProperties(prev => prev.filter(p => p._id !== propertyId)); // Remove from UI
    toast({
      title: "Deleted",
      description: "Property deleted successfully.",
    });
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.response?.data?.error || error.message,
      variant: "destructive",
    });
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Properties</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <span className="text-xl font-bold">+</span> Add Property
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PropertyFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearFilters}
          />
        </div>
        <div className="lg:col-span-3">
          {/* Filter loading indicator */}
          {loading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-800">Applying filters...</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Results counter */}
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {total > 0 ? (
                    <>
                      Showing {((page - 1) * PAGE_SIZE) + 1} to {Math.min(page * PAGE_SIZE, total)} of {total} properties
                    </>
                  ) : (
                    'No properties found'
                  )}
                </p>
                {Object.values(debouncedFilters).some(value => 
                  Array.isArray(value) ? value.length > 0 : value !== ""
                ) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={isFavorite(property._id)}
                  onToggleFavorite={() => handleToggleFavorite(property._id)}
                  onViewDetails={() => navigate(`/properties/${property._id}`)}
                  onEdit={() => {
                    setSelectedProperty(property);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={() => handleDeleteProperty(property._id)}
                  isOwner={user && user.id === property.createdBy}
                />
                ))}

                {properties.length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <h3 className="text-xl font-semibold text-gray-500">
                      No properties found
                    </h3>
                    <p className="text-gray-400 mt-2">
                      Try changing your filters or check back later
                    </p>
                  </div>
                )}
              </div>

              <Pagination
                currentPage={page}
                totalCount={total}
                onPageChange={handlePageChange}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </div>
      </div>
      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProperty={handleAddProperty}
      />
      <EditPropertyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        propertyData={selectedProperty}
        onUpdateProperty={handleUpdateProperty}
      />
    </div>
  );
};

export default PropertyList;
