import React from "react";
import { getAllStates, getCitiesForState, getTopCities } from "@/lib/locationData";

export interface PropertyFilters {
  state: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  minAreaSqFt: string;
  maxAreaSqFt: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  furnished: string;
  availableFrom: string;
  minRating: string;
  maxRating: string;
  isVerified: string;
  listingType: string;
  propertyType: string;
}

interface Props {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onClearFilters: () => void;
}

// Get available states
const STATES = getAllStates();

// Amenity options
const AMENITIES = [
  "lift", "gym", "garden", "pool", "security", "clubhouse", "power-backup", "wifi"
];

const FURNISHED_OPTIONS = [
  { value: "", label: "Any" },
  { value: "semi", label: "Semi" },
  { value: "full", label: "Full" },
  { value: "un", label: "Unfurnished" }
];

const PROPERTY_TYPES = [
  { value: "", label: "Any" },
  { value: "penthouse", label: "Penthouse" },
  { value: "apartment", label: "Apartment" },
  { value: "studio", label: "Studio" },
  { value: "bungalow", label: "Bungalow" },
  { value: "building", label: "Building" }
];

const LISTING_TYPES = [
  { value: "", label: "Any" },
  { value: "rent", label: "Rent" },
  { value: "sale", label: "Sale" }
];

const VERIFIED_OPTIONS = [
  { value: "", label: "Any" },
  { value: "true", label: "Verified" },
  { value: "false", label: "Unverified" }
];

const BEDROOMS = ["", "1", "2", "3", "4", "5+"];
const BATHROOMS = ["", "1", "2", "3", "4", "5+"];

const RATINGS = Array.from({ length: 5 }, (_, i) => String(i + 1));

const PropertyFiltersComponent: React.FC<Props> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const update = (key: keyof PropertyFilters, value: any) => {
    // Clear city when state changes
    if (key === "state") {
      onFiltersChange({ ...filters, [key]: value, city: "" });
    } else {
      onFiltersChange({ ...filters, [key]: value });
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (filters.amenities.includes(amenity)) {
      update("amenities", filters.amenities.filter(a => a !== amenity));
    } else {
      update("amenities", [...filters.amenities, amenity]);
    }
  };

  // Get cities based on selected state
  const availableCities = filters.state 
    ? getCitiesForState(filters.state)
    : getTopCities();

  return (
    <div className="bg-white rounded shadow p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">Filters</h3>
        <button
          className="text-blue-600 text-sm underline"
          onClick={onClearFilters}
          type="button"
        >
          Clear All
        </button>
      </div>

      {/* State */}
      <div>
        <label className="block font-medium mb-1">State</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.state}
          onChange={e => update("state", e.target.value)}
        >
          <option value="">All States</option>
          {STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block font-medium mb-1">
          City {filters.state && <span className="text-xs text-gray-500">in {filters.state}</span>}
        </label>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.city}
          onChange={e => update("city", e.target.value)}
        >
          <option value="">{filters.state ? `All Cities in ${filters.state}` : "All Cities"}</option>
          {availableCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-medium mb-1">Min Price</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={filters.minPrice}
            onChange={e => update("minPrice", e.target.value)}
            placeholder="₹ Min"
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">Max Price</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={filters.maxPrice}
            onChange={e => update("maxPrice", e.target.value)}
            placeholder="₹ Max"
          />
        </div>
      </div>

      {/* Area Sq Ft */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-medium mb-1">Min Area (sq ft)</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={filters.minAreaSqFt}
            onChange={e => update("minAreaSqFt", e.target.value)}
            placeholder="Min"
          />
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">Max Area (sq ft)</label>
          <input
            type="number"
            className="w-full border rounded px-2 py-1"
            value={filters.maxAreaSqFt}
            onChange={e => update("maxAreaSqFt", e.target.value)}
            placeholder="Max"
          />
        </div>
      </div>

      {/* Bedrooms/Bathrooms */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-medium mb-1">Bedrooms</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.bedrooms}
            onChange={e => update("bedrooms", e.target.value)}
          >
            {BEDROOMS.map(b => (
              <option key={b} value={b}>{b === "" ? "Any" : b}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">Bathrooms</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.bathrooms}
            onChange={e => update("bathrooms", e.target.value)}
          >
            {BATHROOMS.map(b => (
              <option key={b} value={b}>{b === "" ? "Any" : b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block font-medium mb-1">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              <span className="capitalize">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Furnished */}
      <div>
        <label className="block font-medium mb-1">Furnished</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.furnished}
          onChange={e => update("furnished", e.target.value)}
        >
          {FURNISHED_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Available From */}
      <div>
        <label className="block font-medium mb-1">Available From</label>
        <input
          type="date"
          className="w-full border rounded px-2 py-1"
          value={filters.availableFrom}
          onChange={e => update("availableFrom", e.target.value)}
        />
      </div>

      {/* Rating */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block font-medium mb-1">Min Rating</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.minRating}
            onChange={e => update("minRating", e.target.value)}
          >
            <option value="">Any</option>
            {RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">Max Rating</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={filters.maxRating}
            onChange={e => update("maxRating", e.target.value)}
          >
            <option value="">Any</option>
            {RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Verified */}
      <div>
        <label className="block font-medium mb-1">Verified</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.isVerified}
          onChange={e => update("isVerified", e.target.value)}
        >
          {VERIFIED_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Listing Type */}
      <div>
        <label className="block font-medium mb-1">Listing Type</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={filters.listingType}
          onChange={e => update("listingType", e.target.value)}
        >
          {LISTING_TYPES.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PropertyFiltersComponent;
