import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/services/api';

Modal.setAppElement('#root');

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyData: Property | null;
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
        amenities: propertyData.amenities.join(', '),
        tags: propertyData.tags.join(', '),
        availableFrom: propertyData.availableFrom?.slice(0, 10) || '',
      });
      setErrors({ ...initialErrors });
    }
  }, [propertyData]);

  const validate = () => {
    const newErrors: typeof initialErrors = { ...initialErrors };

    if (!formData.title?.trim()) newErrors.title = "Title is required.";
    if (!formData.type?.trim()) newErrors.type = "Type is required.";
    if (!formData.price?.toString().trim() || isNaN(Number(formData.price)) || Number(formData.price) <= 0)
      newErrors.price = "Price must be a positive number.";
    if (!formData.state?.trim()) newErrors.state = "State is required.";
    if (!formData.city?.trim()) newErrors.city = "City is required.";
    if (!formData.areaSqFt?.toString().trim() || isNaN(Number(formData.areaSqFt)) || Number(formData.areaSqFt) < 0)
      newErrors.areaSqFt = "Area is required and must be a non-negative number.";
    if (!formData.bedrooms?.toString().trim() || isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) < 0)
      newErrors.bedrooms = "Bedrooms are required and must be a non-negative number.";
    if (!formData.bathrooms?.toString().trim() || isNaN(Number(formData.bathrooms)) || Number(formData.bathrooms) < 0)
      newErrors.bathrooms = "Bathrooms are required and must be a non-negative number.";
    if (!formData.amenities?.trim()) newErrors.amenities = "Amenities are required.";
    if (!formData.furnished?.trim()) newErrors.furnished = "Furnished status is required.";
    if (!formData.availableFrom?.trim()) newErrors.availableFrom = "Available From date is required.";
    if (!formData.listedBy?.trim()) newErrors.listedBy = "Listed By is required.";
    if (!formData.tags?.trim()) newErrors.tags = "Tags are required.";
    if (!formData.rating?.toString().trim() || isNaN(Number(formData.rating)) || Number(formData.rating) < 0 || Number(formData.rating) > 10)
      newErrors.rating = "Rating is required and must be between 0 and 10.";
    if (!formData.listingType?.trim()) newErrors.listingType = "Listing Type is required.";

    setErrors(newErrors);
    // Return true if no errors
    return Object.values(newErrors).every(val => !val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: "" })); 
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
      amenities: formData.amenities.split(',').map((a: string) => a.trim()).filter(Boolean),
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      isVerified: formData.isVerified,
      availableFrom: formData.availableFrom ? new Date(formData.availableFrom) : undefined,
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
        overlay: { backgroundColor: 'rgba(0,0,0,0.5)' },
        content: { maxWidth: 500, margin: 'auto', borderRadius: 8 },
      }}
    >
      <h2 className="text-xl font-bold mb-4">Edit Property</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Input name="title" placeholder="Title" value={formData.title || ''} onChange={handleChange} />
          {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
        </div>
        <div>
          <Input name="type" placeholder="Type" value={formData.type || ''} onChange={handleChange} />
          {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
        </div>
        <div>
          <Input name="price" type="number" placeholder="Price" value={formData.price || ''} onChange={handleChange} />
          {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
        </div>
        <div>
          <Input name="state" placeholder="State" value={formData.state || ''} onChange={handleChange} />
          {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
        </div>
        <div>
          <Input name="city" placeholder="City" value={formData.city || ''} onChange={handleChange} />
          {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
        </div>
        <div>
          <Input name="areaSqFt" type="number" placeholder="Area (sq ft)" value={formData.areaSqFt || ''} onChange={handleChange} />
          {errors.areaSqFt && <p className="text-red-500 text-xs">{errors.areaSqFt}</p>}
        </div>
        <div>
          <Input name="bedrooms" type="number" placeholder="Bedrooms" value={formData.bedrooms || ''} onChange={handleChange} />
          {errors.bedrooms && <p className="text-red-500 text-xs">{errors.bedrooms}</p>}
        </div>
        <div>
          <Input name="bathrooms" type="number" placeholder="Bathrooms" value={formData.bathrooms || ''} onChange={handleChange} />
          {errors.bathrooms && <p className="text-red-500 text-xs">{errors.bathrooms}</p>}
        </div>
        <div>
          <Input name="amenities" placeholder="Amenities (comma separated)" value={formData.amenities || ''} onChange={handleChange} />
          {errors.amenities && <p className="text-red-500 text-xs">{errors.amenities}</p>}
        </div>
        <div>
          <Input name="furnished" placeholder="Furnished" value={formData.furnished || ''} onChange={handleChange} />
          {errors.furnished && <p className="text-red-500 text-xs">{errors.furnished}</p>}
        </div>
        <div>
          <Input name="availableFrom" type="date" placeholder="Available From" value={formData.availableFrom || ''} onChange={handleChange} />
          {errors.availableFrom && <p className="text-red-500 text-xs">{errors.availableFrom}</p>}
        </div>
        <div>
          <Input name="listedBy" placeholder="Listed By" value={formData.listedBy || ''} onChange={handleChange} />
          {errors.listedBy && <p className="text-red-500 text-xs">{errors.listedBy}</p>}
        </div>
        <div>
          <Input name="tags" placeholder="Tags (comma separated)" value={formData.tags || ''} onChange={handleChange} />
          {errors.tags && <p className="text-red-500 text-xs">{errors.tags}</p>}
        </div>
        <div>
          <Input name="rating" type="number" placeholder="Rating" value={formData.rating || ''} onChange={handleChange} />
          {errors.rating && <p className="text-red-500 text-xs">{errors.rating}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox name="isVerified" checked={!!formData.isVerified} onCheckedChange={checked => setFormData((prev: any) => ({ ...prev, isVerified: checked === true }))} />
          <span>Verified</span>
        </div>
        <div>
          <Input name="listingType" placeholder="Listing Type (rent/sale)" value={formData.listingType || ''} onChange={handleChange} />
          {errors.listingType && <p className="text-red-500 text-xs">{errors.listingType}</p>}
        </div>
        <div className="flex gap-2 mt-4">
          <Button type="submit" className="flex-1">Update</Button>
          <Button type="button" onClick={onClose} className="flex-1" variant="outline">Cancel</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPropertyModal;
