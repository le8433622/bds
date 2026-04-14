import type { AnalyticsEvent } from '../../types/analytics';
import type { AnalyticsProvider } from './analyticsService';

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export function createHttpAnalyticsProvider(input: {
  endpoint: string;
  writeKey?: string;
  timeoutMs?: number;
  fetchFn?: FetchFn;
}): AnalyticsProvider {
  const timeoutMs = input.timeoutMs ?? 3000;
  const fetchFn = input.fetchFn ?? fetch;

  return {
    async track(event: AnalyticsEvent): Promise<void> {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchFn(input.endpoint, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(input.writeKey ? { Authorization: `Bearer ${input.writeKey}` } : {}),
          },
          body: JSON.stringify({
            event: event.name,
            timestamp: event.timestamp,
            properties: event.payload ?? {},
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}
