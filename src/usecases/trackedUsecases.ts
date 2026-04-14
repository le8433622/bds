import type { BookVisitPayload, ContactRequestPayload } from '../types/contact';
import type { PaginationInput } from '../types/pagination';
import type { SearchFilters } from '../types/search';
import { trackEvent } from '../services/analytics/analyticsService';
import { resolveInitialRoute } from './bootstrapUsecase';
import { contactAgent, bookVisit } from './contactUsecase';
import { getRecommendedProperties } from './recommendationUsecase';
import { saveProperty } from './saveUsecase';
import { searchProperties } from './searchUsecase';

type TrackFn = typeof trackEvent;

export function createTrackedUsecases(input?: { trackFn?: TrackFn }) {
  const trackFn = input?.trackFn ?? trackEvent;

  return {
    async trackAppOpenAndResolveRoute() {
      await trackFn('app_open');
      return resolveInitialRoute();
    },

    async trackedSearchProperties(filters: SearchFilters, pagination: PaginationInput) {
      await trackFn('search_submitted', {
        hasLocation: Boolean(filters.location),
        hasIntent: Boolean(filters.intent),
        page: pagination.page ?? 1,
      });

      return searchProperties(filters, pagination);
    },

    async trackedSaveProperty(input: { isLoggedIn: boolean; propertyId: string }) {
      const result = await saveProperty(input);

      if (result.ok) {
        await trackFn('property_saved', {
          propertyId: input.propertyId,
          savedCount: result.savedIds.length,
        });
      }

      return result;
    },

    async trackedContactAgent(payload: ContactRequestPayload) {
      const result = await contactAgent(payload);
      await trackFn('contact_requested', {
        propertyId: payload.propertyId,
        method: payload.preferredMethod,
      });
      return result;
    },

    async trackedBookVisit(payload: BookVisitPayload) {
      const result = await bookVisit(payload);
      await trackFn('visit_booked', {
        propertyId: payload.propertyId,
      });
      return result;
    },

    async trackedRecommendations(limit = 5) {
      const result = await getRecommendedProperties(limit);
      await trackFn('recommendation_loaded', {
        limit,
        count: result.length,
      });
      return result;
    },
  };
}

const defaultTrackedUsecases = createTrackedUsecases();

export const trackAppOpenAndResolveRoute = defaultTrackedUsecases.trackAppOpenAndResolveRoute;
export const trackedSearchProperties = defaultTrackedUsecases.trackedSearchProperties;
export const trackedSaveProperty = defaultTrackedUsecases.trackedSaveProperty;
export const trackedContactAgent = defaultTrackedUsecases.trackedContactAgent;
export const trackedBookVisit = defaultTrackedUsecases.trackedBookVisit;
export const trackedRecommendations = defaultTrackedUsecases.trackedRecommendations;
