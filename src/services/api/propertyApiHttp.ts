import type { SearchFilters } from '../../screens/search/SearchScreen';
import type { Property } from '../../types/models';
import type { PaginationInput } from '../../types/pagination';
import type { ApiResult } from '../../types/api';
import { toQueryString } from '../../utils/query';
import type { HttpClient } from './httpClient';

export type PropertyApiGateway = {
  list(filters?: SearchFilters, pagination?: PaginationInput): Promise<ApiResult<Property[]>>;
  detail(propertyId: string): Promise<ApiResult<Property>>;
};

function toListQuery(filters: SearchFilters = {}, pagination: PaginationInput = {}): string {
  return toQueryString({
    intent: filters.intent,
    location: filters.location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    propertyType: filters.propertyType,
    bedrooms: filters.bedrooms,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
}

export function createPropertyApiGateway(client: HttpClient): PropertyApiGateway {
  return {
    list(filters = {}, pagination = {}) {
      const query = toListQuery(filters, pagination);
      return client.get<Property[]>(`/properties${query}`);
    },

    detail(propertyId: string) {
      return client.get<Property>(`/properties/${propertyId}`);
    },
  };
}
