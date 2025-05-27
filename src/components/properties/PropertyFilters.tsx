
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export interface PropertyFilters {
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  city: string;
  petFriendly: boolean;
  parkingAvailable: boolean;
  furnished: boolean;
}

interface PropertyFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onClearFilters: () => void;
}

const PropertyFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: PropertyFiltersProps) => {
  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Filters</CardTitle>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <Select 
            value={filters.propertyType} 
            onValueChange={(value) => updateFilter('propertyType', value === 'all' ? '' : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any type</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="loft">Loft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="minPrice">Min Price</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice">Max Price</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="No limit"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select 
              value={filters.bedrooms} 
              onValueChange={(value) => updateFilter('bedrooms', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="0">Studio</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Select 
              value={filters.bathrooms} 
              onValueChange={(value) => updateFilter('bathrooms', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Enter city name"
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="petFriendly"
              checked={filters.petFriendly}
              onCheckedChange={(checked) => updateFilter('petFriendly', checked)}
            />
            <Label htmlFor="petFriendly" className="text-sm">Pet Friendly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="parkingAvailable"
              checked={filters.parkingAvailable}
              onCheckedChange={(checked) => updateFilter('parkingAvailable', checked)}
            />
            <Label htmlFor="parkingAvailable" className="text-sm">Parking Available</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="furnished"
              checked={filters.furnished}
              onCheckedChange={(checked) => updateFilter('furnished', checked)}
            />
            <Label htmlFor="furnished" className="text-sm">Furnished</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFiltersComponent;
