import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyAPI } from "@/services/api";
import { Button } from "@/components/ui/button";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const lastUpdated = localStorage.getItem("lastUpdatedProperty");
    if (lastUpdated) {
      const parsed = JSON.parse(lastUpdated);
      if (parsed._id === id) {
        setProperty(parsed);
        setLoading(false);
        return;
      }
    }
    if (id) {
      setLoading(true);
      propertyAPI.getPropertyById(id)
        .then(res => setProperty(res))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading property details...</div>;
  }

  if (!property) {
    return <div className="container mx-auto py-8 text-center">Property not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        &larr; Back
      </Button>
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
        <p className="text-lg text-gray-600 mb-2">{property.city}, {property.state}</p>
        <div className="mb-4">
          <span className="font-semibold">Type:</span> {property.type} <br />
          <span className="font-semibold">Price:</span> ₹{property.price} <br />
          <span className="font-semibold">Bedrooms:</span> {property.bedrooms} <br />
          <span className="font-semibold">Bathrooms:</span> {property.bathrooms} <br />
          <span className="font-semibold">Area:</span> {property.areaSqFt} sq ft <br />
          <span className="font-semibold">Furnished:</span> {property.furnished} <br />
          <span className="font-semibold">Available From:</span> {property.availableFrom ? new Date(property.availableFrom).toLocaleDateString() : '-'} <br />
          <span className="font-semibold">Listed By:</span> {property.listedBy} <br />
          <span className="font-semibold">Tags:</span> {property.tags?.join(', ')} <br />
          <span className="font-semibold">Amenities:</span> {property.amenities?.join(', ')} <br />
          <span className="font-semibold">Verified:</span> {property.isVerified ? 'Yes' : 'No'} <br />
          <span className="font-semibold">Rating:</span> {property.rating} <br />
          <span className="font-semibold">Listing Type:</span> {property.listingType} <br />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
