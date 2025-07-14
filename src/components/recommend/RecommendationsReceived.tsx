import React, { useEffect, useState } from "react";
import { recommendationsAPI } from "@/services/api";
import PropertyCard from "../properties/PropertyCard";
import { useNavigate } from "react-router-dom";
import { getUserEmoji, getUserName } from "@/lib/userUtils";


const RecommendationsReceived = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    recommendationsAPI.getReceived()
      .then(res => {
        setRecommendations(res.recommendations || []);
        setDeletedCount(res.deletedPropertiesCount || 0);
      })
      .catch(error => {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
        setDeletedCount(0);
      })
      .finally(() => setLoading(false));
  }, []);

   const handleViewDetails = (property: any) => {
    navigate(`/properties/${property._id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Properties Recommended to You</h2>
      
      {deletedCount > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            {deletedCount} recommendation{deletedCount > 1 ? 's' : ''} {deletedCount > 1 ? 'have' : 'has'} properties that are no longer available.
          </p>
        </div>
      )}

      {recommendations.length === 0 ? (
        <p>{deletedCount > 0 ? 'All recommended properties are no longer available.' : 'No recommendations yet.'}</p>
      ) : (
        recommendations.map(rec => (
          <div key={rec._id} className="mb-6">
            <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <span>{getUserEmoji(rec.fromUser._id || rec.fromUser.id || 'unknown')}</span>
              <span>
                Recommended by: <strong>{getUserName(getUserEmoji(rec.fromUser._id || rec.fromUser.id || 'unknown'))}</strong> ({rec.fromUser.email})
                {rec.message && <> | Message: <em>"{rec.message}"</em></>}
              </span>
            </div>
            <PropertyCard
            property={rec.property}
            onViewDetails={handleViewDetails} />
          </div>
        ))
      )}
    </div>
  );
};

export default RecommendationsReceived;
