import React, { useEffect, useState } from "react";
import { recommendationsAPI } from "@/services/api";
import PropertyCard from "../properties/PropertyCard";
import { useNavigate } from "react-router-dom";

const RecommendationsReceived = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    recommendationsAPI
      .getReceived()
      .then((res) => setRecommendations(res.recommendations));
  }, []);

  // Handler for viewing details
  const handleViewDetails = (property: any) => {
    navigate(`/properties/${property._id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Properties Recommended to You
      </h2>
      {recommendations.map((rec) =>
        rec.property ? (
          <div key={rec._id} className="mb-6 flex-shrink-0">
            <div className="text-sm text-gray-500 mb-1 text-center">
              Recommended by: {rec.fromUser.email}
              {rec.message && <> | Message: {rec.message}</>}
            </div>
            <PropertyCard
              property={rec.property}
              onViewDetails={handleViewDetails}
            />
          </div>
        ) : null 
      )}
    </div>
  );
};

export default RecommendationsReceived;
