import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import RecommendPropertyModal from "../recommend/RecommendPropertyModal";
import { Property } from "@/services/api";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  isOwner?: boolean;
  showEditButton?: boolean;
  onEdit?: () => void;
  onToggleFavorite?: (propertyId: string, isCurrentlyFavorite: boolean) => void;
  onViewDetails?: (property: Property) => void;
  showRemoveButton?: boolean;
  onRemoveFavorite?: (propertyId: string) => void;
}

const PropertyCard = ({
  property,
  isFavorite = false,
  onToggleFavorite,
  onViewDetails,
  showDeleteButton = false,
  onDelete,
  isOwner = false,
  showEditButton = false,
  onEdit,
  showRemoveButton = false,
  onRemoveFavorite,
}: PropertyCardProps) => {
  const [isRecommendOpen, setIsRecommendOpen] = useState(false);

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">
            {property.title}
          </CardTitle>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(property._id, isFavorite)}
              className="p-1"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                }`}
                aria-hidden="true"
              />
            </Button>
          )}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          {property.city}, {property.state}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold text-primary">
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          }).format(property.price)}
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} bed
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} bath
          </div>
          {property.areaSqFt && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.areaSqFt} sq ft
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {property.type}
          </Badge>
          <Badge
            variant={property.isVerified ? "default" : "secondary"}
            className="text-xs"
          >
            {property.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
        {property.tags && property.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-2 w-full">
          <Button
            className="w-full bg-black text-white hover:bg-gray-900"
            onClick={() => onViewDetails && onViewDetails(property)}
          >
            View Details
          </Button>
          {isOwner && onEdit && (
            <Button
              className="w-full bg-black text-white hover:bg-gray-900"
              onClick={onEdit}
            >
              Edit Property
            </Button>
          )}
          {showDeleteButton && onDelete && (
            <Button
              className="w-full bg-black text-white hover:bg-gray-900"
              onClick={onDelete}
            >
              Delete Property
            </Button>
          )}
          {showRemoveButton && onRemoveFavorite && (
            <Button
              className="w-full bg-black text-white hover:bg-gray-900"
              onClick={() => onRemoveFavorite(property._id)}
            >
              Remove from Favorites
            </Button>
          )}
          {/* Recommend Button */}
          <Button
            className="w-full bg-black text-white hover:bg-gray-900"
            onClick={() => setIsRecommendOpen(true)}
          >
            Recommend
          </Button>
        </div>
        {/* Recommend Modal */}
        <RecommendPropertyModal
          propertyId={property._id}
          isOpen={isRecommendOpen}
          onClose={() => setIsRecommendOpen(false)}
        />
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
