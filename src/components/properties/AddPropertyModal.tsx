import React, { useState } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const states: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Tawang"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangalore", "Hubli"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal", "Thoubal"],
  "Meghalaya": ["Shillong", "Tura"],
  "Mizoram": ["Aizawl", "Lunglei"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Sikkim": ["Gangtok", "Namchi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
  "Tripura": ["Agartala", "Udaipur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
  "Delhi": ["New Delhi", "Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry", "Karaikal", "Mahe"],
};

const propertyTypes = [
  "Apartment", "House", "Villa", "Office", "Shop", "Plot", "Studio", "Bungalow"
];
const furnishedOptions = [
  "Fully Furnished", "Semi-Furnished", "Unfurnished"
];
const amenitiesOptions = [
  "Lift", "Gym", "Garden", "Pool", "Security", "Clubhouse", "Power-Backup", "Wifi"
];
const tagsOptions = [
  "Luxury", "Budget", "Prime Location", "Renovated", "Sea View", "New Launch", "Ready to Move"
];
const ratings = [1, 2, 3, 4, 5];
const listingTypes = ["Rent", "Sale"];

Modal.setAppElement("#root");

const initialForm = {
  title: "",
  type: "",
  price: "",
  state: "",
  city: "",
  areaSqFt: "",
  bedrooms: "",
  bathrooms: "",
  amenities: [] as string[],
  furnished: "",
  availableFrom: "",
  listedBy: "",
  tags: [] as string[],
  rating: "",
  isVerified: false,
  listingType: "",
};

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (propertyData: any) => void;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
}) => {
  const [formData, setFormData] = useState(initialForm);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Amenities checkbox group
  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleTagChange = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const propertyData = {
      ...formData,
      price: Number(formData.price),
      areaSqFt: Number(formData.areaSqFt),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      rating: Number(formData.rating),
      amenities: formData.amenities,
      tags: formData.tags,
      isVerified: formData.isVerified,
      availableFrom: formData.availableFrom ? new Date(formData.availableFrom) : undefined,
    };
    onAddProperty(propertyData);
    setFormData(initialForm);
    toast({
      title: "Property submitted",
      description: "Your property has been submitted.",
    });
    onClose();
  };

  const cityOptions = formData.state ? states[formData.state] || [] : [];

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
        <Input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />

        {/* Type Dropdown */}
        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Property Type</option>
          {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>

        <Input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />

        {/* State Dropdown */}
        <select name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select State</option>
          {Object.keys(states).map(state => <option key={state} value={state}>{state}</option>)}
        </select>

        {/* City Dropdown */}
        <select name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" required disabled={!formData.state}>
          <option value="">Select City</option>
          {cityOptions.map(city => <option key={city} value={city}>{city}</option>)}
        </select>

        <Input name="areaSqFt" type="number" placeholder="Area (sq ft)" value={formData.areaSqFt} onChange={handleChange} />
        <Input name="bedrooms" type="number" placeholder="Bedrooms" value={formData.bedrooms} onChange={handleChange} />
        <Input name="bathrooms" type="number" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} />

        {/* Amenities Checkbox Group */}
        <div>
          <label className="block font-semibold mb-1">Amenities</label>
          <div className="flex flex-wrap gap-3">
            {amenitiesOptions.map((amenity) => (
              <label key={amenity} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="amenities"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Furnished Dropdown */}
        <select name="furnished" value={formData.furnished} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Furnishing</option>
          {furnishedOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>

        <Input name="availableFrom" type="date" placeholder="Available From" value={formData.availableFrom} onChange={handleChange} />
        <Input name="listedBy" placeholder="Listed By" value={formData.listedBy} onChange={handleChange} />

        {/* Tags Checkbox Group */}
        <div>
          <label className="block font-semibold mb-1">Tags</label>
          <div className="flex flex-wrap gap-3">
            {tagsOptions.map((tag) => (
              <label key={tag} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  checked={formData.tags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Rating Dropdown */}
        <select name="rating" value={formData.rating} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Rating</option>
          {ratings.map(rating => <option key={rating} value={rating}>{rating}</option>)}
        </select>

        <div className="flex items-center gap-2">
          <Checkbox
            name="isVerified"
            checked={formData.isVerified}
            onCheckedChange={(checked) =>
              setFormData(prev => ({
                ...prev,
                isVerified: checked === true,
              }))
            }
          />
          <span>Verified</span>
        </div>

        <select name="listingType" value={formData.listingType} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Listing Type</option>
          {listingTypes.map(type => <option key={type} value={type}>{type}</option>)}
        </select>

        <div className="flex gap-2 mt-4">
          <Button type="submit" className="flex-1">Add</Button>
          <Button type="button" onClick={onClose} className="flex-1" variant="outline">Cancel</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPropertyModal;
