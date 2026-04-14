import type { AnalyticsEvent, AnalyticsEventName } from '../../types/analytics';

const events: AnalyticsEvent[] = [];
type AnalyticsPayload = Record<string, string | number | boolean | null>;

export type AnalyticsProvider = {
  track(event: AnalyticsEvent): Promise<void> | void;
};

const inMemoryProvider: AnalyticsProvider = {
  track(event: AnalyticsEvent): void {
    events.push(event);
  },
};

let provider: AnalyticsProvider = inMemoryProvider;

export function setAnalyticsProvider(nextProvider: AnalyticsProvider): void {
  provider = nextProvider;
}

export function resetAnalyticsProvider(): void {
  provider = inMemoryProvider;
}

export async function trackEvent(
  name: AnalyticsEventName,
  payload?: AnalyticsPayload,
): Promise<void> {
  const event: AnalyticsEvent = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  provider.track(event);
}

export function getTrackedEvents(): AnalyticsEvent[] {
  return [...events];
}

export function resetAnalyticsForTesting(): void {
  events.length = 0;
  resetAnalyticsProvider();
}
