import type { AnalyticsEvent, AnalyticsEventName } from '../../types/analytics';

const events: AnalyticsEvent[] = [];
type AnalyticsPayload = Record<string, string | number | boolean | null>;

export type AnalyticsProvider = {
  track(event: AnalyticsEvent): Promise<void> | void;
};

const inMemoryProvider: AnalyticsProvider = {
  track(): void {
    // No-op provider. Events are persisted in the in-memory array below.
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

  events.push(event);

  try {
    await provider.track(event);
  } catch {
    // Ignore provider failures to avoid breaking user-facing flows.
  }
}

export function getTrackedEvents(): AnalyticsEvent[] {
  return [...events];
}

export function resetAnalyticsForTesting(): void {
  events.length = 0;
  resetAnalyticsProvider();
}
