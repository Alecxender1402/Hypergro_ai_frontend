import React, { useState } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import statesAndCities from "./statesAndCities.json"; 

// Set the app element for accessibility
Modal.setAppElement("#root");

// Constants
const PROPERTY_TYPES = [
  "Villa",
  "Apartment",
  "Studio",
  "Bungalow",
  "Penthouse",
];
const FURNISHED_OPTIONS = ["semi", "unfurnished", "furnished"];
const AMENITIES_OPTIONS = [
  "pool",
  "power-backup",
  "clubhouse",
  "parking",
  "lift",
  "security",
  "wifi",
];
const TAGS_OPTIONS = [
  "affordable",
  "near-metro",
  "sea-view",
  "corner-plot",
  "luxury",
];
const LISTING_TYPES = ["rent", "sale"];
const MAX_PRICE = 100000000;
const MAX_AREA = 10000;
const MAX_BEDROOMS = 10;
const MAX_BATHROOMS = 10;
const MAX_RATING = 5;

// TypeScript interfaces for form and errors
interface PropertyForm {
  title: string;
  type: string;
  price: string;
  state: string;
  city: string;
  areaSqFt: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  furnished: string;
  availableFrom: string;
  listedBy: string;
  tags: string[];
  rating: string;
  isVerified: boolean;
  listingType: string;
}

interface PropertyFormErrors {
  title?: string;
  type?: string;
  price?: string;
  state?: string;
  city?: string;
  areaSqFt?: string;
  bedrooms?: string;
  bathrooms?: string;
  amenities?: string;
  furnished?: string;
  availableFrom?: string;
  listedBy?: string;
  tags?: string;
  rating?: string;
  isVerified?: string;
  listingType?: string;
}

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (data: any) => void;
}

const initialForm: PropertyForm = {
  title: "",
  type: "",
  price: "",
  state: "",
  city: "",
  areaSqFt: "",
  bedrooms: "",
  bathrooms: "",
  amenities: [],
  furnished: "",
  availableFrom: "",
  listedBy: "",
  tags: [],
  rating: "",
  isVerified: false,
  listingType: "",
};

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
}) => {
  const [formData, setFormData] = useState<PropertyForm>(initialForm);
  const [errors, setErrors] = useState<PropertyFormErrors>({});
  const { toast } = useToast();

  // Get city list based on selected state
  const cityList =
    statesAndCities.find((s: any) => s.state === formData.state)?.cities || [];

  // Handle input changes for native inputs/selects
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle Radix Checkbox
  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setFormData((prev) => ({
      ...prev,
      isVerified: checked === true,
    }));
  };

  // Handle amenities and tags (checkbox groups)
  const handleMultiSelect = (name: "amenities" | "tags", option: string) => {
    setFormData((prev) => {
      const arr = prev[name];
      return {
        ...prev,
        [name]: arr.includes(option)
          ? arr.filter((v) => v !== option)
          : [...arr, option],
      };
    });
  };

  // Validation
  const validate = () => {
    const newErrors: PropertyFormErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!PROPERTY_TYPES.includes(formData.type))
      newErrors.type = "Select a valid property type";
    if (!formData.price) newErrors.price = "Price is required";
    else if (Number(formData.price) > MAX_PRICE)
      newErrors.price = "Price cannot exceed 10 crore";
    if (!formData.state) newErrors.state = "State is required";
    if (!statesAndCities.find((s: any) => s.state === formData.state))
      newErrors.state = "Select a valid state";
    if (!formData.city) newErrors.city = "City is required";
    else if (!cityList.includes(formData.city))
      newErrors.city = "Select a valid city";
    if (!formData.areaSqFt) newErrors.areaSqFt = "Area is required";
    else if (Number(formData.areaSqFt) > MAX_AREA)
      newErrors.areaSqFt = "Area cannot exceed 10,000 sq ft";
    if (!formData.bedrooms) newErrors.bedrooms = "Bedrooms is required";
    else if (Number(formData.bedrooms) > MAX_BEDROOMS)
      newErrors.bedrooms = "Bedrooms cannot exceed 10";
    if (!formData.bathrooms) newErrors.bathrooms = "Bathrooms is required";
    else if (Number(formData.bathrooms) > MAX_BATHROOMS)
      newErrors.bathrooms = "Bathrooms cannot exceed 10";
    if (!formData.amenities.length)
      newErrors.amenities = "Select at least one amenity";
    if (!formData.furnished) newErrors.furnished = "Furnished is required";
    else if (!FURNISHED_OPTIONS.includes(formData.furnished))
      newErrors.furnished = "Select a valid furnished option";
    if (!formData.availableFrom) newErrors.availableFrom = "Date is required";
    if (!formData.listedBy) newErrors.listedBy = "Listed By is required";
    if (!formData.tags.length) newErrors.tags = "Select at least one tag";
    if (!formData.rating) newErrors.rating = "Rating is required";
    else if (Number(formData.rating) > MAX_RATING)
      newErrors.rating = "Rating cannot exceed 5";
    if (!formData.listingType) newErrors.listingType = "Listing type required";
    else if (!LISTING_TYPES.includes(formData.listingType))
      newErrors.listingType = "Select rent or sale";
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length) {
      // Show all errors in a toast
      const errorMessages = Object.values(validationErrors).filter(Boolean);
      toast({
        title: "Validation Error",
        description: errorMessages.join(', '),
        variant: "destructive",
      });
      return;
    }

    const propertyData = {
      ...formData,
      price: Number(formData.price),
      areaSqFt: Number(formData.areaSqFt),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      rating: Number(formData.rating),
      availableFrom: formData.availableFrom
        ? new Date(formData.availableFrom)
        : undefined,
    };
    onAddProperty(propertyData);
    setFormData(initialForm);
    toast({
      title: "Property submitted",
      description: "Your property has been submitted.",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Property"
      style={{
        overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
        content: { maxWidth: 500, margin: "auto", borderRadius: 8 },
      }}
    >
      <h2 className="text-xl font-bold mb-4">Add New Property</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <Input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Type */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        >
          <option value="">Select Type</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Price */}
        <Input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          min={0}
          max={MAX_PRICE}
        />

        {/* State */}
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        >
          <option value="">Select State</option>
          {statesAndCities.map((s: any) => (
            <option key={s.state} value={s.state}>
              {s.state}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
          disabled={!formData.state}
        >
          <option value="">Select City</option>
          {cityList.map((city: string) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Area */}
        <Input
          name="areaSqFt"
          type="number"
          placeholder="Area (sq ft)"
          value={formData.areaSqFt}
          onChange={handleChange}
          required
          min={0}
          max={MAX_AREA}
        />

        {/* Bedrooms */}
        <Input
          name="bedrooms"
          type="number"
          placeholder="Bedrooms"
          value={formData.bedrooms}
          onChange={handleChange}
          required
          min={0}
          max={MAX_BEDROOMS}
        />

        {/* Bathrooms */}
        <Input
          name="bathrooms"
          type="number"
          placeholder="Bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
          required
          min={0}
          max={MAX_BATHROOMS}
        />

        {/* Amenities */}
        <div>
          <span className="block font-medium">Amenities</span>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.map((amenity) => (
              <label key={amenity} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleMultiSelect("amenities", amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Furnished */}
        <select
          name="furnished"
          value={formData.furnished}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        >
          <option value="">Select Furnished</option>
          {FURNISHED_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Available From */}
        <Input
          name="availableFrom"
          type="date"
          placeholder="Available From"
          value={formData.availableFrom}
          onChange={handleChange}
          required
        />

        {/* Listed By */}
        <Input
          name="listedBy"
          placeholder="Listed By"
          value={formData.listedBy}
          onChange={handleChange}
          required
        />

        {/* Tags */}
        <div>
          <span className="block font-medium">Tags</span>
          <div className="flex flex-wrap gap-2">
            {TAGS_OPTIONS.map((tag) => (
              <label key={tag} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.tags.includes(tag)}
                  onChange={() => handleMultiSelect("tags", tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <Input
          name="rating"
          type="number"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
          required
          min={0}
          max={MAX_RATING}
        />

        {/* Verified */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={formData.isVerified}
            onCheckedChange={handleCheckboxChange}
            id="isVerified"
          />
          <label htmlFor="isVerified" className="ml-2">
            Verified
          </label>
        </div>

        {/* Listing Type */}
        <select
          name="listingType"
          value={formData.listingType}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        >
          <option value="">Listing Type</option>
          {LISTING_TYPES.map((lt) => (
            <option key={lt} value={lt}>
              {lt}
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <Button type="submit" className="flex-1">
            Add
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="flex-1"
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPropertyModal;
