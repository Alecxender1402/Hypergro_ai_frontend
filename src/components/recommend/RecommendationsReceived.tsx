import React, { useEffect, useState } from "react";
import { recommendationsAPI } from "@/services/api";
import PropertyCard from "../properties/PropertyCard";

const RecommendationsReceived = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    recommendationsAPI.getReceived().then(res => setRecommendations(res.recommendations));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Properties Recommended to You</h2>
      {recommendations.length === 0 ? (
        <p>No recommendations yet.</p>
      ) : (
        recommendations.map(rec => (
          <div key={rec._id} className="mb-6">
            <div className="text-sm text-gray-500 mb-1">
              Recommended by: {rec.fromUser.email}
              {rec.message && <> | Message: {rec.message}</>}
            </div>
            <PropertyCard property={rec.property} />
          </div>
        ))
      )}
    </div>
  );
};

export default RecommendationsReceived;
