import { createPropertyDetailController } from '../screens/property/PropertyDetailScreen';
import { createPropertyListController } from '../screens/search/PropertyListScreen';
import { createSearchScreenController } from '../screens/search/SearchScreen';
import { trackEvent } from '../services/analytics/analyticsService';
import type { Property } from '../types/models';
import type { PaginatedResult, PaginationInput } from '../types/pagination';
import type { SearchFilters } from '../types/search';
import type { AppRuntime } from './runtime';

function unwrapResult<T>(value: unknown, fallbackError = 'Upstream request failed.'): T {
  if (
    typeof value === 'object' &&
    value !== null &&
    'ok' in value &&
    typeof (value as { ok?: unknown }).ok === 'boolean'
  ) {
    const result = value as
      | { ok: true; data?: T }
      | { ok: false; error?: { message?: string }; reason?: string };

    if (result.ok) {
      if ('data' in result && typeof result.data !== 'undefined') {
        return result.data;
      }

      return value as T;
    }

    throw new Error(result.error?.message ?? result.reason ?? fallbackError);
  }

  return value as T;
}

function normalizePaginatedResult(
  value: unknown,
  pagination: Required<PaginationInput>,
): PaginatedResult<Property> {
  const data = unwrapResult<unknown>(value);

  if (Array.isArray(data)) {
    return {
      data: data as Property[],
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: data.length,
      totalPages: Math.max(1, Math.ceil(data.length / pagination.pageSize)),
    };
  }

  const paginated = data as PaginatedResult<Property>;
  return {
    data: paginated.data ?? [],
    page: paginated.page ?? pagination.page,
    pageSize: paginated.pageSize ?? pagination.pageSize,
    total: paginated.total ?? (paginated.data?.length ?? 0),
    totalPages: paginated.totalPages ?? 1,
  };
}

function normalizePagination(input?: PaginationInput): Required<PaginationInput> {
  return {
    page: input?.page && input.page > 0 ? input.page : 1,
    pageSize: input?.pageSize && input.pageSize > 0 ? input.pageSize : 10,
  };
}

export function createAppUiContainer(input: {
  runtime: AppRuntime;
  isLoggedIn: boolean;
}) {
  const runtimeSearch = async (filters: SearchFilters, pagination: PaginationInput) => {
    const normalizedPagination = normalizePagination(pagination);
    const result = await input.runtime.usecases.search(filters, normalizedPagination);
    return normalizePaginatedResult(result, normalizedPagination);
  };

  return {
    search: createSearchScreenController({
      search: runtimeSearch,
      trackEvent,
    }),
    propertyList: createPropertyListController({
      loadPage: runtimeSearch,
      trackEvent,
    }),
    createPropertyDetail(propertyId: string) {
      const controller = createPropertyDetailController({
        loadProperty: async (id) => unwrapResult<Property | null>(await input.runtime.usecases.propertyDetail(id)),
        save: async (id) =>
          (await input.runtime.usecases.save({
            isLoggedIn: input.isLoggedIn,
            propertyId: id,
          })) as { ok: true; savedIds?: string[]; data?: { success?: boolean } },
        unsave: async (id) =>
          (await input.runtime.usecases.unsave({
            isLoggedIn: input.isLoggedIn,
            propertyId: id,
          })) as { ok: true; savedIds?: string[]; data?: { success?: boolean } },
        contact: async (payload) => unwrapResult(await input.runtime.usecases.contact(payload)),
        trackEvent,
      });

      void controller.load(propertyId);
      return controller;
    },
  };
}
