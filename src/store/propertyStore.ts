import type { Property } from '../types/models';
import type { SearchFilters } from '../screens/search/SearchScreen';

export type PropertySort = 'newest' | 'priceAsc' | 'priceDesc';

function matchesIntent(property: Property, intent?: SearchFilters['intent']): boolean {
  if (!intent) return true;

  const rentalTypes: Property['propertyType'][] = ['rental'];
  const isRental = rentalTypes.includes(property.propertyType);

  return intent === 'rent' ? isRental : !isRental;
}

function matchesLocation(property: Property, location?: string): boolean {
  if (!location) return true;
  const keyword = location.trim().toLowerCase();

  return (
    property.location.toLowerCase().includes(keyword) ||
    property.city.toLowerCase().includes(keyword) ||
    (property.district?.toLowerCase().includes(keyword) ?? false)
  );
}

function matchesPriceRange(property: Property, minPrice?: number, maxPrice?: number): boolean {
  if (typeof minPrice === 'number' && property.price < minPrice) return false;
  if (typeof maxPrice === 'number' && property.price > maxPrice) return false;
  return true;
}

function matchesPropertyType(property: Property, propertyType?: SearchFilters['propertyType']): boolean {
  if (!propertyType) return true;
  return property.propertyType === propertyType;
}

function matchesBedrooms(property: Property, bedrooms?: number): boolean {
  if (typeof bedrooms !== 'number') return true;
  return property.bedrooms >= bedrooms;
}

export function filterProperties(properties: Property[], filters: SearchFilters): Property[] {
  return properties.filter((property) => {
    return (
      matchesIntent(property, filters.intent) &&
      matchesLocation(property, filters.location) &&
      matchesPriceRange(property, filters.minPrice, filters.maxPrice) &&
      matchesPropertyType(property, filters.propertyType) &&
      matchesBedrooms(property, filters.bedrooms)
    );
  });
}

export function sortProperties(properties: Property[], sortBy: PropertySort): Property[] {
  const list = [...properties];

  switch (sortBy) {
    case 'priceAsc':
      return list.sort((a, b) => a.price - b.price);
    case 'priceDesc':
      return list.sort((a, b) => b.price - a.price);
    case 'newest':
    default:
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export function getFeaturedProperties(properties: Property[], limit = 10): Property[] {
  return sortProperties(properties, 'newest').slice(0, limit);
}
