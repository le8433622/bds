import { afterEach, describe, expect, it } from 'vitest';
import {
  getTrackedEvents,
  resetAnalyticsForTesting,
  setAnalyticsProvider,
  trackEvent,
} from './analyticsService';

afterEach(() => {
  resetAnalyticsForTesting();
});

describe('analyticsService', () => {
  it('tracks event', async () => {
    await trackEvent('app_open');
    const events = getTrackedEvents();

    expect(events).toHaveLength(1);
    expect(events[0]?.name).toBe('app_open');
  });

  it('forwards tracked event to configured provider', async () => {
    const trackedNames: string[] = [];
    setAnalyticsProvider({
      track(event) {
        trackedNames.push(event.name);
      },
    });

    await trackEvent('search_submitted', { query: 'apartment' });
    expect(trackedNames).toEqual(['search_submitted']);
  });

  it('does not throw when provider fails', async () => {
    setAnalyticsProvider({
      track() {
        throw new Error('provider unavailable');
      },
    });

    await expect(trackEvent('search_submitted')).resolves.toBeUndefined();
    expect(getTrackedEvents()).toHaveLength(1);
  });
});
