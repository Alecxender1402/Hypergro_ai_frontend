import axios from 'axios';

const API_BASE_URL = 'https://hypergro-ai-backend1.onrender.com/api';

// Create axios instance with interceptors for auth
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types matching your MongoDB schema
export interface User {
  id: string;
  email: string;
  createdAt: string;
}
export interface UserProfile {
    _id: string;
    full_name: string;
    email: string;
    phone?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export const getUserProfile = async (): Promise<UserProfile> => {
    const res = await api.get('/users/me');
    return res.data;
  };
  
  export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await api.put('/users/me', profile);
    return res.data;
  };

export interface Property {
  _id: string;
  id?: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: string;
  availableFrom: string;
  listedBy: string;
  tags: string[];
  rating: number;
  isVerified: boolean;
  listingType: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  _id: string;
  user: string;
  property: Property;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface PropertyResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  pages: number;
  data: Property[];
}

// Auth API calls
export const authAPI = {
    register: async (email: string, password: string) => {
        const response = await api.post<AuthResponse>('/auth/register', {
          email,
          password,
        });
        return response.data;
      },      

  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};

// Property API calls
export const propertyAPI = {
  getProperties: async (filters: any = {}) => {
    // Convert filters to proper format for the backend
    const queryParams: Record<string, any> = {};
    
    // Location filters
    if (filters.state) queryParams.state = filters.state;
    if (filters.city) queryParams.search = filters.city;
    
    // Price filters
    if (filters.minPrice) queryParams['price[gte]'] = filters.minPrice;
    if (filters.maxPrice) queryParams['price[lte]'] = filters.maxPrice;
    
    // Area filters
    if (filters.minAreaSqFt) queryParams['areaSqFt[gte]'] = filters.minAreaSqFt;
    if (filters.maxAreaSqFt) queryParams['areaSqFt[lte]'] = filters.maxAreaSqFt;
    
    // Room filters
    if (filters.bedrooms) queryParams['bedrooms[gte]'] = filters.bedrooms;
    if (filters.bathrooms) queryParams['bathrooms[gte]'] = filters.bathrooms;
    
    // Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      queryParams.amenities = filters.amenities.join(',');
    }
    
    // Furnished status
    if (filters.furnished) queryParams.furnished = filters.furnished;
    
    // Date filters
    if (filters.availableFrom) queryParams['availableFrom[gte]'] = filters.availableFrom;
    
    // Rating filters
    if (filters.minRating) queryParams['rating[gte]'] = filters.minRating;
    if (filters.maxRating) queryParams['rating[lte]'] = filters.maxRating;
    
    // Other filters
    if (filters.isVerified) queryParams.isVerified = filters.isVerified;
    if (filters.listingType) queryParams.listingType = filters.listingType;
    if (filters.propertyType) queryParams.type = filters.propertyType;
    
    // Pagination
    if (filters.page) queryParams.page = filters.page;
    if (filters.limit) queryParams.limit = filters.limit;
    
    const response = await api.get<PropertyResponse>('/properties', { params: queryParams });
    return response.data;
  },

  getPropertyById: async (id: string) => {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData: Omit<Property, '_id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const response = await api.post<Property>('/properties/create', propertyData);
    return response.data;
  },
  deleteProperty: async (propertyId: string) => {
    const response = await api.delete(`/properties/${propertyId}`);
    return response.data;
  },
  updateProperty: async (propertyId: string, updatedData: any) => {
    const response = await api.put(`/properties/${propertyId}`, updatedData);
    return response.data;
  },
};

// Favorites API calls
export const favoritesAPI = {
  getFavorites: async () => {
    const response = await api.get<Favorite[]>('/favorites');
    return response.data;
  },

  addFavorite: async (propertyId: string) => {
    const response = await api.post<Favorite>('/favorites', {
      propertyId,
    });
    return response.data;
  },

  removeFavorite: async (favoriteId: string) => {
    const response = await api.delete(`/favorites/${favoriteId}`);
    return response.data;
  },
};

export const recommendationsAPI = {
  recommendProperty: async (propertyId: string, recipientEmail: string, message?: string) => {
    const res = await api.post("/recommendations", { propertyId, recipientEmail, message });
    return res.data;
  },
  getReceived: async () => {
    const res = await api.get("/recommendations/received");
    return res.data;
  }
};

export default api;
