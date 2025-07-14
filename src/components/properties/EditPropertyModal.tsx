import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import statesAndCities from "./statesAndCities.json"; // adjust path as needed

// Constants (should match Add modal)
const PROPERTY_TYPES = ["Villa", "Apartment", "Studio", "Bungalow", "Penthouse"];
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

Modal.setAppElement("#root");

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyData: any;
  onUpdateProperty: (updatedData: any) => void;
}

const initialErrors = {
  title: "",
  type: "",
  price: "",
  state: "",
  city: "",
  areaSqFt: "",
  bedrooms: "",
  bathrooms: "",
  amenities: "",
  furnished: "",
  availableFrom: "",
  listedBy: "",
  tags: "",
  rating: "",
  listingType: "",
};

const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  onClose,
  propertyData,
  onUpdateProperty,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState({ ...initialErrors });

  useEffect(() => {
    if (propertyData) {
      setFormData({
        ...propertyData,
        amenities: Array.isArray(propertyData.amenities)
          ? propertyData.amenities
          : [],
        tags: Array.isArray(propertyData.tags) ? propertyData.tags : [],
        availableFrom: propertyData.availableFrom
          ? propertyData.availableFrom.slice(0, 10)
          : "",
      });
      setErrors({ ...initialErrors });
    }
  }, [propertyData]);

  const cityList =
    statesAndCities.find((s: any) => s.state === formData.state)?.cities || [];

  // For text/select/number fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // For Radix Checkbox
  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setFormData((prev: any) => ({
      ...prev,
      isVerified: checked === true,
    }));
  };

  // For amenities/tags multi-select
  const handleMultiSelect = (name: "amenities" | "tags", option: string) => {
    setFormData((prev: any) => {
      const arr = prev[name] || [];
      return {
        ...prev,
        [name]: arr.includes(option)
          ? arr.filter((v: string) => v !== option)
          : [...arr, option],
      };
    });
  };

  const validate = () => {
    const newErrors: typeof initialErrors = { ...initialErrors };
    if (!formData.title?.trim()) newErrors.title = "Title is required.";
    if (!formData.type?.trim()) newErrors.type = "Type is required.";
    else if (!PROPERTY_TYPES.includes(formData.type))
      newErrors.type = "Select a valid property type.";
    if (
      !formData.price?.toString().trim() ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    )
      newErrors.price = "Price must be a positive number.";
    else if (Number(formData.price) > MAX_PRICE)
      newErrors.price = "Price cannot exceed 10 crore.";
    if (!formData.state?.trim()) newErrors.state = "State is required.";
    else if (!statesAndCities.find((s: any) => s.state === formData.state))
      newErrors.state = "Select a valid state.";
    if (!formData.city?.trim()) newErrors.city = "City is required.";
    else if (!cityList.includes(formData.city))
      newErrors.city = "Select a valid city.";
    if (
      !formData.areaSqFt?.toString().trim() ||
      isNaN(Number(formData.areaSqFt)) ||
      Number(formData.areaSqFt) < 0
    )
      newErrors.areaSqFt = "Area is required and must be a non-negative number.";
    else if (Number(formData.areaSqFt) > MAX_AREA)
      newErrors.areaSqFt = "Area cannot exceed 10,000 sq ft.";
    if (
      !formData.bedrooms?.toString().trim() ||
      isNaN(Number(formData.bedrooms)) ||
      Number(formData.bedrooms) < 0
    )
      newErrors.bedrooms =
        "Bedrooms are required and must be a non-negative number.";
    else if (Number(formData.bedrooms) > MAX_BEDROOMS)
      newErrors.bedrooms = "Bedrooms cannot exceed 10.";
    if (
      !formData.bathrooms?.toString().trim() ||
      isNaN(Number(formData.bathrooms)) ||
      Number(formData.bathrooms) < 0
    )
      newErrors.bathrooms =
        "Bathrooms are required and must be a non-negative number.";
    else if (Number(formData.bathrooms) > MAX_BATHROOMS)
      newErrors.bathrooms = "Bathrooms cannot exceed 10.";
    if (!formData.amenities?.length)
      newErrors.amenities = "Select at least one amenity.";
    else if (
      formData.amenities.some(
        (a: string) => !AMENITIES_OPTIONS.includes(a)
      )
    )
      newErrors.amenities = "Select valid amenities.";
    if (!formData.furnished?.trim())
      newErrors.furnished = "Furnished status is required.";
    else if (!FURNISHED_OPTIONS.includes(formData.furnished))
      newErrors.furnished = "Select a valid furnished option.";
    if (!formData.availableFrom?.trim())
      newErrors.availableFrom = "Available From date is required.";
    if (!formData.listedBy?.trim())
      newErrors.listedBy = "Listed By is required.";
    if (!formData.tags?.length) newErrors.tags = "Select at least one tag.";
    else if (formData.tags.some((t: string) => !TAGS_OPTIONS.includes(t)))
      newErrors.tags = "Select valid tags.";
    if (
      !formData.rating?.toString().trim() ||
      isNaN(Number(formData.rating)) ||
      Number(formData.rating) < 0
    )
      newErrors.rating = "Rating is required and must be between 0 and 5.";
    else if (Number(formData.rating) > MAX_RATING)
      newErrors.rating = "Rating cannot exceed 5.";
    if (!formData.listingType?.trim())
      newErrors.listingType = "Listing Type is required.";
    else if (!LISTING_TYPES.includes(formData.listingType))
      newErrors.listingType = "Select rent or sale.";

    setErrors(newErrors);
    return Object.values(newErrors).every((val) => !val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    const updatedData = {
      ...formData,
      price: Number(formData.price),
      areaSqFt: Number(formData.areaSqFt),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      rating: Number(formData.rating),
      amenities: formData.amenities,
      tags: formData.tags,
      isVerified: formData.isVerified,
      availableFrom: formData.availableFrom
        ? new Date(formData.availableFrom)
        : undefined,
    };
    onUpdateProperty(updatedData);
    toast({
      title: "Property updated",
      description: "Your property has been updated.",
    });
    onClose();
  };

  if (!propertyData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Property"
      style={{
        overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
        content: { maxWidth: 500, margin: "auto", borderRadius: 8 },
      }}
    >
      <h2 className="text-xl font-bold mb-4">Edit Property</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title */}
        <div>
          <Input
            name="title"
            placeholder="Title"
            value={formData.title || ""}
            onChange={handleChange}
            required
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{errors.title}</p>
          )}
        </div>
        {/* Type */}
        <div>
          <select
            name="type"
            value={formData.type || ""}
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
          {errors.type && (
            <p className="text-red-500 text-xs">{errors.type}</p>
          )}
        </div>
        {/* Price */}
        <div>
          <Input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price || ""}
            onChange={handleChange}
            required
            min={0}
            max={MAX_PRICE}
          />
          {errors.price && (
            <p className="text-red-500 text-xs">{errors.price}</p>
          )}
        </div>
        {/* State */}
        <div>
          <select
            name="state"
            value={formData.state || ""}
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
          {errors.state && (
            <p className="text-red-500 text-xs">{errors.state}</p>
          )}
        </div>
        {/* City */}
        <div>
          <select
            name="city"
            value={formData.city || ""}
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
          {errors.city && (
            <p className="text-red-500 text-xs">{errors.city}</p>
          )}
        </div>
        {/* Area */}
        <div>
          <Input
            name="areaSqFt"
            type="number"
            placeholder="Area (sq ft)"
            value={formData.areaSqFt || ""}
            onChange={handleChange}
            required
            min={0}
            max={MAX_AREA}
          />
          {errors.areaSqFt && (
            <p className="text-red-500 text-xs">{errors.areaSqFt}</p>
          )}
        </div>
        {/* Bedrooms */}
        <div>
          <Input
            name="bedrooms"
            type="number"
            placeholder="Bedrooms"
            value={formData.bedrooms || ""}
            onChange={handleChange}
            required
            min={0}
            max={MAX_BEDROOMS}
          />
          {errors.bedrooms && (
            <p className="text-red-500 text-xs">{errors.bedrooms}</p>
          )}
        </div>
        {/* Bathrooms */}
        <div>
          <Input
            name="bathrooms"
            type="number"
            placeholder="Bathrooms"
            value={formData.bathrooms || ""}
            onChange={handleChange}
            required
            min={0}
            max={MAX_BATHROOMS}
          />
          {errors.bathrooms && (
            <p className="text-red-500 text-xs">{errors.bathrooms}</p>
          )}
        </div>
        {/* Amenities */}
        <div>
          <span className="block font-medium">Amenities</span>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.map((amenity) => (
              <label key={amenity} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.amenities?.includes(amenity)}
                  onChange={() => handleMultiSelect("amenities", amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
          {errors.amenities && (
            <p className="text-red-500 text-xs">{errors.amenities}</p>
          )}
        </div>
        {/* Furnished */}
        <div>
          <select
            name="furnished"
            value={formData.furnished || ""}
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
          {errors.furnished && (
            <p className="text-red-500 text-xs">{errors.furnished}</p>
          )}
        </div>
        {/* Available From */}
        <div>
          <Input
            name="availableFrom"
            type="date"
            placeholder="Available From"
            value={formData.availableFrom || ""}
            onChange={handleChange}
            required
          />
          {errors.availableFrom && (
            <p className="text-red-500 text-xs">{errors.availableFrom}</p>
          )}
        </div>
        {/* Listed By */}
        <div>
          <Input
            name="listedBy"
            placeholder="Listed By"
            value={formData.listedBy || ""}
            onChange={handleChange}
            required
          />
          {errors.listedBy && (
            <p className="text-red-500 text-xs">{errors.listedBy}</p>
          )}
        </div>
        {/* Tags */}
        <div>
          <span className="block font-medium">Tags</span>
          <div className="flex flex-wrap gap-2">
            {TAGS_OPTIONS.map((tag) => (
              <label key={tag} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={formData.tags?.includes(tag)}
                  onChange={() => handleMultiSelect("tags", tag)}
                />
                {tag}
              </label>
            ))}
          </div>
          {errors.tags && (
            <p className="text-red-500 text-xs">{errors.tags}</p>
          )}
        </div>
        {/* Rating */}
        <div>
          <Input
            name="rating"
            type="number"
            placeholder="Rating"
            value={formData.rating || ""}
            onChange={handleChange}
            required
            min={0}
            max={MAX_RATING}
          />
          {errors.rating && (
            <p className="text-red-500 text-xs">{errors.rating}</p>
          )}
        </div>
        {/* Verified */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={!!formData.isVerified}
            onCheckedChange={handleCheckboxChange}
            id="isVerified"
          />
          <label htmlFor="isVerified" className="ml-2">
            Verified
          </label>
        </div>
        {/* Listing Type */}
        <div>
          <select
            name="listingType"
            value={formData.listingType || ""}
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
          {errors.listingType && (
            <p className="text-red-500 text-xs">{errors.listingType}</p>
          )}
        </div>
        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <Button type="submit" className="flex-1">
            Update
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

export default EditPropertyModal;
