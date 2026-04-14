import type { SearchFilters } from '../screens/search/SearchScreen';
import { getProperties } from '../services/api/propertyApi';

export async function fetchPropertiesByFilters(filters: SearchFilters) {
  return getProperties(filters);
}
