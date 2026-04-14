export type SearchIntent = 'buy' | 'rent';
export type SearchPropertyType = 'apartment' | 'house' | 'land' | 'rental';

export type SearchFilters = {
  intent?: SearchIntent;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: SearchPropertyType;
  bedrooms?: number;
};
