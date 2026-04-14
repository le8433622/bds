import type { AnalyticsEventName } from '../../types/analytics';
import type { Property } from '../../types/models';
import type { PaginatedResult, PaginationInput } from '../../types/pagination';
import type { SearchFilters } from '../../types/search';

type AnalyticsPayload = Record<string, string | number | boolean | null>;
type TrackFn = (name: AnalyticsEventName, payload?: AnalyticsPayload) => Promise<void> | void;

export type PropertyListStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export type PropertyListState = {
  status: PropertyListStatus;
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
  filters: SearchFilters;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return 'Không thể tải danh sách bất động sản.';
}

function getValidPagination(input?: PaginationInput, fallbackPageSize = 10): Required<PaginationInput> {
  return {
    page: input?.page && input.page > 0 ? input.page : 1,
    pageSize: input?.pageSize && input.pageSize > 0 ? input.pageSize : fallbackPageSize,
  };
}

export function sortByNewest(properties: Property[]): Property[] {
  return [...properties].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createInitialPropertyListState(pageSize = 10): PropertyListState {
  return {
    status: 'idle',
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
    filters: {},
  };
}

export function createPropertyListController(input: {
  loadPage: (filters: SearchFilters, pagination: PaginationInput) => Promise<PaginatedResult<Property>>;
  trackEvent?: TrackFn;
  initialPageSize?: number;
}) {
  const trackEvent: TrackFn = input.trackEvent ?? (() => undefined);
  const pageSize = input.initialPageSize && input.initialPageSize > 0 ? input.initialPageSize : 10;
  let state = createInitialPropertyListState(pageSize);
  let lastFilters: SearchFilters = {};

  async function run(filters: SearchFilters, paginationInput?: PaginationInput): Promise<PropertyListState> {
    const pagination = getValidPagination(paginationInput, state.pageSize);
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
    };
    lastFilters = { ...filters };

    try {
      const result = await input.loadPage(filters, pagination);
      const merged = isFirstPage
        ? sortByNewest(result.data)
        : sortByNewest([...previousItems, ...result.data]);
      const nextStatus: PropertyListStatus = merged.length === 0 ? 'empty' : 'success';

      state = {
        ...state,
        status: nextStatus,
        items: merged,
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
        canLoadMore: result.page < result.totalPages,
        isRefreshing: false,
        isAppending: false,
      };

      await trackEvent('list_impression', {
        page: result.page,
        pageSize: result.pageSize,
        count: result.data.length,
        total: result.total,
      });

      return state;
    } catch (error) {
      state = {
        ...state,
        status: 'error',
        errorMessage: toErrorMessage(error),
        canRetry: true,
        isAppending: false,
        isRefreshing: false,
      };
      return state;
    }
  }

  return {
    getState(): PropertyListState {
      return { ...state };
    },

    load(filters: SearchFilters, pagination?: PaginationInput): Promise<PropertyListState> {
      return run(filters, pagination);
    },

    async loadNextPage(): Promise<PropertyListState> {
      if (!state.canLoadMore || state.isAppending || state.status === 'loading') {
        return this.getState();
      }
      return run(lastFilters, {
        page: state.page + 1,
        pageSize: state.pageSize,
      });
    },

    async refresh(): Promise<PropertyListState> {
      if (state.status === 'loading') {
        return this.getState();
      }

      state = {
        ...state,
        isRefreshing: true,
      };
      return run(lastFilters, {
        page: 1,
        pageSize: state.pageSize,
      });
    },

    async retry(): Promise<PropertyListState> {
      if (!state.canRetry) {
        return this.getState();
      }
      return run(lastFilters, {
        page: state.page,
        pageSize: state.pageSize,
      });
    },
  };
}
