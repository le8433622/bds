export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
};

export type PropertyType = 'apartment' | 'house' | 'land' | 'rental';

export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  city: string;
  district?: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: PropertyType;
  images: string[];
  description: string;
  amenities: string[];
  isSaved?: boolean;
  createdAt: string;
};

export type SavedProperty = {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
};
