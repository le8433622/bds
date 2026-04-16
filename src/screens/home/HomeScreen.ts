import type { Property } from '../../types/models';

export const HomeSections = [
  'Search Bar',
  'Quick Categories',
  'Featured Properties',
  'New Listings',
  'Popular Locations',
] as const;

export type HomeSectionId =
  | 'search'
  | 'categories'
  | 'featured'
  | 'newListings'
  | 'popularLocations';

export type HomeSectionConfig = {
  id: HomeSectionId;
  title: (typeof HomeSections)[number];
  priority: number;
};

export type HomeScreenStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export type HomeScreenState = {
  status: HomeScreenStatus;
  sections: HomeSectionConfig[];
  featured: Property[];
  newListings: Property[];
  errorMessage: string | null;
};

const DEFAULT_HOME_SECTIONS: HomeSectionConfig[] = [
  { id: 'search', title: 'Search Bar', priority: 1 },
  { id: 'categories', title: 'Quick Categories', priority: 2 },
  { id: 'featured', title: 'Featured Properties', priority: 3 },
  { id: 'newListings', title: 'New Listings', priority: 4 },
  { id: 'popularLocations', title: 'Popular Locations', priority: 5 },
];

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Không thể tải dữ liệu trang chủ. Vui lòng thử lại.';
}

function dedupeById(items: Property[]): Property[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

export function createInitialHomeScreenState(): HomeScreenState {
  return {
    status: 'idle',
    sections: [...DEFAULT_HOME_SECTIONS],
    featured: [],
    newListings: [],
    errorMessage: null,
  };
}

export function createHomeScreenController(input: {
  loadFeatured: () => Promise<Property[]>;
  loadNewListings: () => Promise<Property[]>;
}) {
  let state = createInitialHomeScreenState();

  return {
    getState(): HomeScreenState {
      return {
        ...state,
        sections: [...state.sections],
        featured: [...state.featured],
        newListings: [...state.newListings],
      };
    },

    async load(): Promise<HomeScreenState> {
      state = {
        ...state,
        status: 'loading',
        errorMessage: null,
      };

      try {
        const [featured, newListings] = await Promise.all([
          input.loadFeatured(),
          input.loadNewListings(),
        ]);

        const nextFeatured = dedupeById(featured);
        const nextNewListings = dedupeById(newListings);
        const hasAnyData = nextFeatured.length > 0 || nextNewListings.length > 0;

        state = {
          ...state,
          status: hasAnyData ? 'success' : 'empty',
          featured: nextFeatured,
          newListings: nextNewListings,
        };

        return this.getState();
      } catch (error) {
        state = {
          ...state,
          status: 'error',
          errorMessage: toErrorMessage(error),
        };

        return this.getState();
      }
    },

    async retry(): Promise<HomeScreenState> {
      if (state.status !== 'error') {
        return this.getState();
      }

      return this.load();
    },
  };
}
