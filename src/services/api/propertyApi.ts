import { MOCK_PROPERTIES } from '../../data/mockProperties';
import type { Property } from '../../types/models';
import type { SearchFilters } from '../../types/search';
import type { PaginatedResult, PaginationInput } from '../../types/pagination';
import { filterProperties, getFeaturedProperties as getFeaturedFromStore, sortProperties } from '../../store/propertyStore';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProperties(filters: SearchFilters = {}): Promise<Property[]> {
  await delay(50);
  return filterProperties(MOCK_PROPERTIES, filters);
}

export async function getPropertiesPaginated(
  filters: SearchFilters = {},
  pagination: PaginationInput = {},
): Promise<PaginatedResult<Property>> {
  await delay(50);

  const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
  const pageSize = pagination.pageSize && pagination.pageSize > 0 ? pagination.pageSize : 10;

  const filtered = sortProperties(filterProperties(MOCK_PROPERTIES, filters), 'newest');
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const offset = (page - 1) * pageSize;
  const data = filtered.slice(offset, offset + pageSize);

  return {
    data,
    page,
    pageSize,
    total,
    totalPages,
  };
}

export async function getPropertyById(propertyId: string): Promise<Property | null> {
  await delay(30);
  return MOCK_PROPERTIES.find((property) => property.id === propertyId) ?? null;
}

export async function getFeaturedProperties(limit = 5): Promise<Property[]> {
  await delay(30);
  return getFeaturedFromStore(MOCK_PROPERTIES, limit);
}
