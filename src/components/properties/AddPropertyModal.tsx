import React, { useState } from "react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

// Set the app element for accessibility (adjust '#root' if your app root is different)
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
  amenities: "",
  furnished: "",
  availableFrom: "",
  listedBy: "",
  tags: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      amenities: formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isVerified: formData.isVerified,
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
        <Input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <Input
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleChange}
          required
        />
        <Input
          name="price"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <Input
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <Input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <Input
          name="areaSqFt"
          type="number"
          placeholder="Area (sq ft)"
          value={formData.areaSqFt}
          onChange={handleChange}
        />
        <Input
          name="bedrooms"
          type="number"
          placeholder="Bedrooms"
          value={formData.bedrooms}
          onChange={handleChange}
        />
        <Input
          name="bathrooms"
          type="number"
          placeholder="Bathrooms"
          value={formData.bathrooms}
          onChange={handleChange}
        />
        <Input
          name="amenities"
          placeholder="Amenities (comma separated)"
          value={formData.amenities}
          onChange={handleChange}
        />
        <Input
          name="furnished"
          placeholder="Furnished"
          value={formData.furnished}
          onChange={handleChange}
        />
        <Input
          name="availableFrom"
          type="date"
          placeholder="Available From"
          value={formData.availableFrom}
          onChange={handleChange}
        />
        <Input
          name="listedBy"
          placeholder="Listed By"
          value={formData.listedBy}
          onChange={handleChange}
        />
        <Input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
        />
        <Input
          name="rating"
          type="number"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
        />
        <div className="flex items-center gap-2">
          <Checkbox
            name="isVerified"
            checked={formData.isVerified}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                isVerified: checked === true, // convert "indeterminate" to false
              }))
            }
          />
          <span>Verified</span>

          <span>Verified</span>
        </div>
        <Input
          name="listingType"
          placeholder="Listing Type (rent/sale)"
          value={formData.listingType}
          onChange={handleChange}
          required
        />
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
