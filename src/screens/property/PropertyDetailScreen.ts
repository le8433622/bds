import type { ContactRequestPayload } from '../../types/contact';
import type { AnalyticsEventName } from '../../types/analytics';
import type { Property } from '../../types/models';
import { formatPriceVND } from '../../utils/formatPrice';

type SaveResultLike =
  | { ok: true; savedIds?: string[]; data?: { success?: boolean } }
  | { ok: false; reason?: string; error?: { message?: string } };

export type PropertyDetailContactMode = 'call' | 'form';
export type PropertyDetailStatus = 'idle' | 'loading' | 'success' | 'error';

export type PropertyDetailState = {
  status: PropertyDetailStatus;
  property: Property | null;
  isSaved: boolean;
  isSavePending: boolean;
  isContactPending: boolean;
  contactMode: PropertyDetailContactMode;
  errorMessage: string | null;
  lastContactRequestId: string | null;
};

export type PropertyDetailViewModel = {
  id: string;
  title: string;
  priceLabel: string;
  addressLabel: string;
  locationLabel: string;
  typeLabel: string;
  areaLabel: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
  images: string[];
  publishedAt: string;
};

type AnalyticsPayload = Record<string, string | number | boolean | null>;
type TrackFn = (name: AnalyticsEventName, payload?: AnalyticsPayload) => Promise<void> | void;

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return 'Không thể xử lý yêu cầu.';
}

function isSaveSucceeded(result: SaveResultLike, propertyId: string): boolean {
  if (!result.ok) {
    return false;
  }

  if (Array.isArray(result.savedIds)) {
    return result.savedIds.includes(propertyId);
  }

  return result.data?.success === true;
}

export function createInitialPropertyDetailState(): PropertyDetailState {
  return {
    status: 'idle',
    property: null,
    isSaved: false,
    isSavePending: false,
    isContactPending: false,
    contactMode: 'call',
    errorMessage: null,
    lastContactRequestId: null,
  };
}

export function createPropertyDetailController(input: {
  loadProperty: (propertyId: string) => Promise<Property | null>;
  save: (propertyId: string) => Promise<SaveResultLike>;
  unsave?: (propertyId: string) => Promise<SaveResultLike>;
  contact: (payload: ContactRequestPayload) => Promise<{ id: string }>;
  trackEvent?: TrackFn;
}) {
  const trackEvent: TrackFn = input.trackEvent ?? (() => undefined);
  let state = createInitialPropertyDetailState();
  let propertyId: string | null = null;

  return {
    getState(): PropertyDetailState {
      return { ...state };
    },

    setContactMode(mode: PropertyDetailContactMode): PropertyDetailState {
      state = {
        ...state,
        contactMode: mode,
      };
      return this.getState();
    },

    async load(id: string): Promise<PropertyDetailState> {
      propertyId = id;
      state = {
        ...state,
        status: 'loading',
        errorMessage: null,
      };

      try {
        const property = await input.loadProperty(id);
        if (!property) {
          state = {
            ...state,
            status: 'error',
            property: null,
            errorMessage: 'Không tìm thấy bất động sản.',
          };
          return this.getState();
        }

        state = {
          ...state,
          status: 'success',
          property,
        };

        await trackEvent('detail_viewed', {
          propertyId: property.id,
        });
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

    async toggleSave(): Promise<PropertyDetailState> {
      if (!propertyId || state.isSavePending) {
        return this.getState();
      }

      state = {
        ...state,
        isSavePending: true,
        errorMessage: null,
      };

      try {
        const saveAction = state.isSaved && input.unsave ? input.unsave : input.save;
        const result = await saveAction(propertyId);
        if (!result.ok) {
          state = {
            ...state,
            isSavePending: false,
            errorMessage: result.error?.message ?? result.reason ?? 'Không thể lưu tin.',
          };
          return this.getState();
        }

        const nextSaved = state.isSaved && input.unsave
          ? !isSaveSucceeded(result, propertyId)
          : isSaveSucceeded(result, propertyId);

        state = {
          ...state,
          isSaved: nextSaved,
          isSavePending: false,
        };

        if (nextSaved) {
          await trackEvent('property_saved', { propertyId });
        }
        return this.getState();
      } catch (error) {
        state = {
          ...state,
          isSavePending: false,
          errorMessage: toErrorMessage(error),
        };
        return this.getState();
      }
    },

    async contactAgent(payload: Omit<ContactRequestPayload, 'preferredMethod'>): Promise<PropertyDetailState> {
      if (!propertyId || state.isContactPending) {
        return this.getState();
      }

      state = {
        ...state,
        isContactPending: true,
        errorMessage: null,
      };

      try {
        const response = await input.contact({
          ...payload,
          propertyId,
          preferredMethod: state.contactMode === 'call' ? 'call' : 'form',
        });

        state = {
          ...state,
          isContactPending: false,
          lastContactRequestId: response.id,
        };

        await trackEvent('contact_requested', {
          propertyId,
          method: state.contactMode,
        });
        return this.getState();
      } catch (error) {
        state = {
          ...state,
          isContactPending: false,
          errorMessage: toErrorMessage(error),
        };
        return this.getState();
      }
    },
  };
}

export function getPropertySummary(property: Property): string {
  return `${property.title} - ${formatPriceVND(property.price)} - ${property.location}`;
}

export function buildPropertyDetailViewModel(property: Property): PropertyDetailViewModel {
  const districtLabel = property.district ? `, ${property.district}` : '';
  return {
    id: property.id,
    title: property.title,
    priceLabel: formatPriceVND(property.price),
    addressLabel: `${property.location}${districtLabel}, ${property.city}`,
    locationLabel: property.location,
    typeLabel: property.propertyType,
    areaLabel: `${property.area} m2`,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    amenities: [...property.amenities],
    description: property.description,
    images: [...property.images],
    publishedAt: property.createdAt,
  };
}
