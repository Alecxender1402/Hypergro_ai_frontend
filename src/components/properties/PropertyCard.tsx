
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Bed, Bath, Square } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Property = Tables<'properties'>;

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
  onViewDetails?: (property: Property) => void;
}

const PropertyCard = ({ 
  property, 
  isFavorite = false, 
  onToggleFavorite, 
  onViewDetails 
}: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{property.title}</CardTitle>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(property.id)}
              className="p-1"
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
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
          {formatPrice(property.price)}/month
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
          {property.square_feet && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.square_feet} sq ft
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {property.property_type}
          </Badge>
          <Badge 
            variant={property.status === 'available' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {property.status}
          </Badge>
        </div>
        {property.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {property.description}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewDetails && onViewDetails(property)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
