import React, { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import PropertyFiltersComponent, { PropertyFilters } from "./PropertyFilters";
import Pagination from "./Pagination";
import AddPropertyModal from "./AddPropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import { propertyAPI, favoritesAPI, Favorite, Property } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";

const PAGE_SIZE = 12;

// Helper to build query string from filters
const buildFilters = (
  filters: PropertyFilters,
  page: number,
  limit: number
) => {
  const params = new URLSearchParams();
  if (filters.state) params.append("state", filters.state);
  if (filters.city) params.append("city", filters.city);
  if (filters.minPrice) params.append("price[gte]", filters.minPrice);
  if (filters.maxPrice) params.append("price[lte]", filters.maxPrice);
  if (filters.minAreaSqFt) params.append("areaSqFt[gte]", filters.minAreaSqFt);
  if (filters.maxAreaSqFt) params.append("areaSqFt[lte]", filters.maxAreaSqFt);
  if (filters.bedrooms) params.append("bedrooms[gte]", filters.bedrooms);
  if (filters.bathrooms) params.append("bathrooms[gte]", filters.bathrooms);
  if (filters.amenities.length)
    params.append("amenities", filters.amenities.join(","));
  if (filters.furnished) params.append("furnished", filters.furnished);
  if (filters.availableFrom)
    params.append("availableFrom[gte]", filters.availableFrom);
  if (filters.minRating) params.append("rating[gte]", filters.minRating);
  if (filters.maxRating) params.append("rating[lte]", filters.maxRating);
  if (filters.isVerified) params.append("isVerified", filters.isVerified);
  if (filters.listingType) params.append("listingType", filters.listingType);
  if (filters.propertyType) params.append("type", filters.propertyType);
  params.append("page", String(page));
  params.append("limit", String(limit));
  return params.toString();
};

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

  useEffect(() => {
    setLoading(true);
    const queryString = buildFilters(filters, page, PAGE_SIZE);
    propertyAPI
      .getProperties(queryString)
      .then((res) => {
        setProperties(res.data);
        setTotal(res.total);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  useEffect(() => {
    if (user) {
      favoritesAPI.getFavorites().then(setFavorites);
    }
  }, [user]);

  const handlePageChange = (newPage: number) => setPage(newPage);

  const clearFilters = () => {
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
  };

  const isFavorite = (propertyId: string) =>
    favorites.some((fav) => fav?.property?._id === propertyId);

  const toggleFavorite = async (
    propertyId: string,
    isCurrentlyFavorite: boolean
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }
    try {
      if (isCurrentlyFavorite) {
        const fav = favorites.find((fav) => fav.property._id === propertyId);
        if (fav) {
          await favoritesAPI.removeFavorite(fav._id);
          setFavorites(favorites.filter((f) => f.property._id !== propertyId));
          toast({
            title: "Removed from favorites",
            description: "Property removed from your favorites.",
          });
        }
      } else {
        const newFav = await favoritesAPI.addFavorite(propertyId);
        setFavorites([...favorites, newFav]);
        toast({
          title: "Added to favorites",
          description: "Property added to your favorites.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddProperty = async (propertyData: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add properties",
        variant: "destructive",
      });
      return;
    }
    try {
      await propertyAPI.createProperty(propertyData);
      toast({
        title: "Property added",
        description: "New property has been added successfully.",
      });
      setIsAddModalOpen(false);
      setPage(1); // reset to first page
      // Refresh properties
      const queryString = buildFilters(filters, 1, PAGE_SIZE);
      const res = await propertyAPI.getProperties(queryString);
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

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await propertyAPI.deleteProperty(propertyId);
      toast({
        title: "Property deleted",
        description: "Property has been deleted successfully.",
      });
      // Refresh property list
      const queryString = buildFilters(filters, page, PAGE_SIZE);
      const res = await propertyAPI.getProperties(queryString);
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

  // ---- EDIT/UPDATE SUPPORT ----
  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleUpdateProperty = async (updatedData: any) => {
    if (!selectedProperty) return;
    try {
      await propertyAPI.updateProperty(selectedProperty._id, updatedData);
      toast({
        title: "Property updated",
        description: "Property updated successfully.",
      });
      setIsEditModalOpen(false);
      setSelectedProperty(null);
      // Refresh property list
      const queryString = buildFilters(filters, page, PAGE_SIZE);
      const res = await propertyAPI.getProperties(queryString);
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
  // ---- END EDIT/UPDATE SUPPORT ----

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
            onFiltersChange={(updated) =>
              setFilters((prev) => ({ ...prev, ...updated }))
            }
            onClearFilters={clearFilters}
          />
        </div>
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-8">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No properties found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => {
                  const isOwner = user && property.createdBy === user.id;
                  return (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      isFavorite={isFavorite(property._id)}
                      onToggleFavorite={toggleFavorite}
                      onViewDetails={() =>
                        (window.location.href = `/properties/${property._id}`)
                      }
                      showDeleteButton={isOwner}
                      onDelete={() => handleDeleteProperty(property._id)}
                      showEditButton={isOwner}
                      onEdit={() => handleEdit(property)}
                    />
                  );
                })}
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
