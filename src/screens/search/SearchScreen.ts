export type SearchFilters = {
  intent?: 'buy' | 'rent';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: 'apartment' | 'house' | 'land' | 'rental';
  bedrooms?: number;
};
