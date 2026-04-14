import type { MonitoringProvider } from './errorMonitoring';

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export function createSentryProvider(input: {
  dsn: string;
  environment: string;
  release?: string;
  fetchFn?: FetchFn;
}): MonitoringProvider {
  const fetchFn = input.fetchFn ?? fetch;

  return {
    async captureException(error, context): Promise<void> {
      const response = await fetchFn(input.dsn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          environment: input.environment,
          release: input.release ?? null,
          extra: context ?? {},
        }),
      });

      if (!response.ok) {
        throw new Error(`SENTRY_HTTP_${response.status}`);
      }
    },
  };
}
