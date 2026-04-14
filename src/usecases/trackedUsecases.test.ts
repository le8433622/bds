import { afterEach, describe, expect, it } from 'vitest';
import { getTrackedEvents, resetAnalyticsForTesting } from '../services/analytics/analyticsService';
import { setOnboardingCompleted, resetOnboardingStorageForTesting } from '../services/storage/onboardingStorage';
import { resetTokenStorageForTesting, saveToken } from '../services/storage/tokenStorage';
import { pushViewedProperty, resetViewHistoryStorageForTesting } from '../services/storage/viewHistoryStorage';
import {
  createTrackedUsecases,
  trackAppOpenAndResolveRoute,
  trackedBookVisit,
  trackedContactAgent,
  trackedRecommendations,
  trackedSaveProperty,
  trackedSearchProperties,
} from './trackedUsecases';

afterEach(() => {
  resetAnalyticsForTesting();
  resetTokenStorageForTesting();
  resetOnboardingStorageForTesting();
  resetViewHistoryStorageForTesting();
});

describe('trackedUsecases', () => {
  it('tracks app open while resolving route', async () => {
    await saveToken('token');
    await setOnboardingCompleted(true);

    const route = await trackAppOpenAndResolveRoute();
    const events = getTrackedEvents();

    expect(route).toBe('Home');
    expect(events[0]?.name).toBe('app_open');
  });

  it('tracks search submission', async () => {
    await trackedSearchProperties({ location: 'HCM' }, { page: 1, pageSize: 10 });
    expect(getTrackedEvents().some((event) => event.name === 'search_submitted')).toBe(true);
  });

  it('tracks save on success only', async () => {
    await trackedSaveProperty({ isLoggedIn: false, propertyId: 'p-001' });
    expect(getTrackedEvents().some((event) => event.name === 'property_saved')).toBe(false);

    await trackedSaveProperty({ isLoggedIn: true, propertyId: 'p-001' });
    expect(getTrackedEvents().some((event) => event.name === 'property_saved')).toBe(true);
  });

  it('tracks contact and visit actions', async () => {
    await trackedContactAgent({
      propertyId: 'p-001',
      fullName: 'Nguyen Van A',
      phone: '0909123456',
      preferredMethod: 'chat',
    });

    await trackedBookVisit({
      propertyId: 'p-001',
      fullName: 'Nguyen Van A',
      phone: '0909123456',
      visitDate: '2026-08-01T09:00:00.000Z',
    });

    const names = getTrackedEvents().map((event) => event.name);
    expect(names).toContain('contact_requested');
    expect(names).toContain('visit_booked');
  });

  it('tracks recommendation loading', async () => {
    await pushViewedProperty('p-001');
    await trackedRecommendations(2);

    expect(getTrackedEvents().some((event) => event.name === 'recommendation_loaded')).toBe(true);
  });

  it('supports injecting custom tracking function', async () => {
    const trackedNames: string[] = [];
    const tracked = createTrackedUsecases({
      trackFn: async (name) => {
        trackedNames.push(name);
      },
    });

    await tracked.trackedSearchProperties({ location: 'HN' }, { page: 1, pageSize: 10 });
    expect(trackedNames).toContain('search_submitted');
  });
});
