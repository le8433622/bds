import type { SearchFilters } from '../types/search';
import type { PaginatedResult, PaginationInput } from '../types/pagination';
import type { Property } from '../types/models';
import { getPropertiesPaginated } from '../services/api/propertyApi';

export async function searchProperties(
  filters: SearchFilters,
  pagination: PaginationInput,
): Promise<PaginatedResult<Property>> {
  return getPropertiesPaginated(filters, pagination);
}
