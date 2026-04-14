import type { SearchFilters } from '../types/search';
import { getProperties } from '../services/api/propertyApi';

export async function fetchPropertiesByFilters(filters: SearchFilters) {
  return getProperties(filters);
}
