import type { Property } from '../../types/models';

export type SavedScreenState = {
  status: 'idle' | 'loading' | 'success' | 'empty' | 'error';
  items: Property[];
  errorMessage: string | null;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Không thể tải danh sách đã lưu.';
}

export function removeSavedProperty(list: Property[], propertyId: string): Property[] {
  return list.filter((property) => property.id !== propertyId);
}

function sortSavedProperties(items: Property[]): Property[] {
  return [...items].sort((a, b) => b.price - a.price);
}

export function createInitialSavedScreenState(): SavedScreenState {
  return {
    status: 'idle',
    items: [],
    errorMessage: null,
  };
}

export function createSavedScreenController(input: {
  loadSaved: () => Promise<Property[]>;
  unsave: (propertyId: string) => Promise<void>;
}) {
  let state = createInitialSavedScreenState();

  return {
    getState(): SavedScreenState {
      return {
        ...state,
        items: [...state.items],
      };
    },

    async load(): Promise<SavedScreenState> {
      state = {
        ...state,
        status: 'loading',
        errorMessage: null,
      };

      try {
        const items = sortSavedProperties(await input.loadSaved());
        state = {
          ...state,
          status: items.length > 0 ? 'success' : 'empty',
          items,
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

    async unsave(propertyId: string): Promise<SavedScreenState> {
      try {
        await input.unsave(propertyId);
        const items = removeSavedProperty(state.items, propertyId);
        state = {
          ...state,
          status: items.length > 0 ? 'success' : 'empty',
          items,
          errorMessage: null,
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
  };
}
