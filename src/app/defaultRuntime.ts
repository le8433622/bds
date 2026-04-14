import { bootstrapAppFromEnv } from './bootstrap';
import type { AppRuntime } from './runtime';
import { createHttpAnalyticsProvider } from '../services/analytics/httpAnalyticsProvider';
import { resetAnalyticsProvider, setAnalyticsProvider } from '../services/analytics/analyticsService';
import { resetMonitoringProvider, setMonitoringProvider } from '../services/monitoring/errorMonitoring';
import { createSentryProvider } from '../services/monitoring/sentryProvider';

function parseAnalyticsTimeoutMs(value?: string): number {
  const timeout = Number(value ?? '3000');
  if (!Number.isFinite(timeout) || timeout <= 0) {
    return 3000;
  }
  return Math.floor(timeout);
}

export function configureAnalyticsFromEnv(env: {
  ANALYTICS_ENDPOINT?: string;
  ANALYTICS_WRITE_KEY?: string;
  ANALYTICS_TIMEOUT_MS?: string;
}): void {
  if (!env.ANALYTICS_ENDPOINT) {
    resetAnalyticsProvider();
    return;
  }

  setAnalyticsProvider(
    createHttpAnalyticsProvider({
      endpoint: env.ANALYTICS_ENDPOINT,
      writeKey: env.ANALYTICS_WRITE_KEY,
      timeoutMs: parseAnalyticsTimeoutMs(env.ANALYTICS_TIMEOUT_MS),
    }),
  );
}

export function configureMonitoringFromEnv(env: {
  APP_ENV?: string;
  SENTRY_DSN?: string;
  SENTRY_RELEASE?: string;
}): void {
  if (!env.SENTRY_DSN) {
    resetMonitoringProvider();
    return;
  }

  setMonitoringProvider(
    createSentryProvider({
      dsn: env.SENTRY_DSN,
      environment: env.APP_ENV ?? 'development',
      release: env.SENTRY_RELEASE,
    }),
  );
}

export function createDefaultRuntime(env: {
  APP_ENV?: string;
  API_BASE_URL?: string;
  API_TIMEOUT_MS?: string;
  API_RETRY_COUNT?: string;
  API_RETRY_DELAY_MS?: string;
  USE_MOCK_API?: string;
  ANALYTICS_ENDPOINT?: string;
  ANALYTICS_WRITE_KEY?: string;
  ANALYTICS_TIMEOUT_MS?: string;
  SENTRY_DSN?: string;
  SENTRY_RELEASE?: string;
} = (globalThis as { process?: { env?: Record<string, string> } }).process?.env ?? {}): AppRuntime {
  configureAnalyticsFromEnv(env);
  configureMonitoringFromEnv(env);

  const result = bootstrapAppFromEnv({
    APP_ENV: env.APP_ENV ?? 'development',
    API_BASE_URL: env.API_BASE_URL ?? 'https://api.homefinder.example.com',
    API_TIMEOUT_MS: env.API_TIMEOUT_MS ?? '5000',
    API_RETRY_COUNT: env.API_RETRY_COUNT ?? '1',
    API_RETRY_DELAY_MS: env.API_RETRY_DELAY_MS ?? '100',
    USE_MOCK_API: env.USE_MOCK_API ?? 'true',
  });

  if (!result.ok) {
    throw new Error(`[BOOTSTRAP_ERROR:${result.error.code}] ${result.error.message}`);
  }

  return result.data.runtime;
}
