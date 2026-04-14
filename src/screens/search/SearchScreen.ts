import type { AnalyticsEventName } from '../../types/analytics';
import type { Property } from '../../types/models';
import type { PaginatedResult, PaginationInput } from '../../types/pagination';
import type { SearchFilters } from '../../types/search';

type AnalyticsPayload = Record<string, string | number | boolean | null>;
type TrackFn = (name: AnalyticsEventName, payload?: AnalyticsPayload) => Promise<void> | void;
type SearchResult = PaginatedResult<Property> | Property[];

export type SearchScreenStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export type SearchScreenState = {
  status: SearchScreenStatus;
  filters: SearchFilters;
  items: Property[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  isRefreshing: boolean;
  isAppending: boolean;
  errorMessage: string | null;
  canRetry: boolean;
  canLoadMore: boolean;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Không thể tải dữ liệu. Vui lòng thử lại.';
}

function normalizeSearchResult(
  result: SearchResult,
  pagination: Required<PaginationInput>,
): PaginatedResult<Property> {
  if (Array.isArray(result)) {
    return {
      data: result,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: result.length,
      totalPages: Math.max(1, Math.ceil(result.length / pagination.pageSize)),
    };
  }

  return result;
}

function mergeUniqueById(current: Property[], next: Property[]): Property[] {
  const merged = [...current];
  const seen = new Set(current.map((property) => property.id));

  for (const property of next) {
    if (seen.has(property.id)) {
      continue;
    }
    merged.push(property);
    seen.add(property.id);
  }

  return merged;
}

function buildPagination(input?: PaginationInput, fallbackPageSize = 10): Required<PaginationInput> {
  return {
    page: input?.page && input.page > 0 ? input.page : 1,
    pageSize: input?.pageSize && input.pageSize > 0 ? input.pageSize : fallbackPageSize,
  };
}

export function createInitialSearchState(pageSize = 10): SearchScreenState {
  return {
    status: 'idle',
    filters: {},
    items: [],
    page: 1,
    pageSize,
    total: 0,
    totalPages: 1,
    isRefreshing: false,
    isAppending: false,
    errorMessage: null,
    canRetry: false,
    canLoadMore: false,
  };
}

export function createSearchScreenController(input: {
  search: (filters: SearchFilters, pagination: PaginationInput) => Promise<SearchResult>;
  trackEvent?: TrackFn;
  initialPageSize?: number;
}) {
  const trackEvent: TrackFn = input.trackEvent ?? (() => undefined);
  const initialPageSize = input.initialPageSize && input.initialPageSize > 0 ? input.initialPageSize : 10;
  let state = createInitialSearchState(initialPageSize);
  let lastQuery: { filters: SearchFilters; pageSize: number } | null = null;

  async function runSearch(filters: SearchFilters, paginationInput?: PaginationInput): Promise<SearchScreenState> {
    const pagination = buildPagination(paginationInput, state.pageSize);
    const isFirstPage = pagination.page === 1;
    const previousItems = state.items;

    state = {
      ...state,
      status: isFirstPage ? 'loading' : state.status,
      filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
      errorMessage: null,
      canRetry: false,
      isAppending: !isFirstPage,
      isRefreshing: state.isRefreshing && isFirstPage,
    };
    lastQuery = { filters, pageSize: pagination.pageSize };

    if (isFirstPage) {
      await trackEvent('search_submitted', {
        hasLocation: Boolean(filters.location),
        hasIntent: Boolean(filters.intent),
        page: pagination.page,
        pageSize: pagination.pageSize,
      });
    }

    try {
      const raw = await input.search(filters, pagination);
      const normalized = normalizeSearchResult(raw, pagination);
      const items = isFirstPage
        ? normalized.data
        : mergeUniqueById(previousItems, normalized.data);
      const status: SearchScreenStatus = items.length === 0 ? 'empty' : 'success';

      state = {
        ...state,
        status,
        items,
        page: normalized.page,
        pageSize: normalized.pageSize,
        total: normalized.total,
        totalPages: normalized.totalPages,
        isAppending: false,
        isRefreshing: false,
        canLoadMore: normalized.page < normalized.totalPages,
      };

      await trackEvent('list_impression', {
        page: normalized.page,
        pageSize: normalized.pageSize,
        count: normalized.data.length,
        total: normalized.total,
      });

      return state;
    } catch (error) {
      state = {
        ...state,
        status: 'error',
        errorMessage: toErrorMessage(error),
        isAppending: false,
        isRefreshing: false,
        canRetry: true,
      };
      return state;
    }
  }

  return {
    getState(): SearchScreenState {
      return { ...state };
    },

    submit(filters: SearchFilters, pagination?: PaginationInput): Promise<SearchScreenState> {
      return runSearch(filters, pagination);
    },

    async loadMore(): Promise<SearchScreenState> {
      if (!lastQuery || !state.canLoadMore || state.isAppending || state.status === 'loading') {
        return this.getState();
      }

      return runSearch(lastQuery.filters, {
        page: state.page + 1,
        pageSize: state.pageSize,
      });
    },

    async refresh(): Promise<SearchScreenState> {
      if (!lastQuery || state.status === 'loading') {
        return this.getState();
      }

      state = {
        ...state,
        isRefreshing: true,
      };

      return runSearch(lastQuery.filters, {
        page: 1,
        pageSize: lastQuery.pageSize,
      });
    },

    async retry(): Promise<SearchScreenState> {
      if (!lastQuery || !state.canRetry) {
        return this.getState();
      }

      return runSearch(lastQuery.filters, {
        page: state.page,
        pageSize: lastQuery.pageSize,
      });
    },
  };
}

export function getSearchEmptyStateMessage(filters: SearchFilters): string {
  const hasFilter =
    Boolean(filters.location) ||
    Boolean(filters.intent) ||
    typeof filters.minPrice === 'number' ||
    typeof filters.maxPrice === 'number' ||
    Boolean(filters.propertyType) ||
    typeof filters.bedrooms === 'number';

  return hasFilter
    ? 'Không tìm thấy bất động sản phù hợp. Hãy nới điều kiện lọc.'
    : 'Hiện chưa có dữ liệu bất động sản.';
}
