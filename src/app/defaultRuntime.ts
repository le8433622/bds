import { bootstrapAppFromEnv } from './bootstrap';
import type { AppRuntime } from './runtime';

export function createDefaultRuntime(env: {
  APP_ENV?: string;
  API_BASE_URL?: string;
  API_TIMEOUT_MS?: string;
  API_RETRY_COUNT?: string;
  API_RETRY_DELAY_MS?: string;
  USE_MOCK_API?: string;
} = (globalThis as { process?: { env?: Record<string, string> } }).process?.env ?? {}): AppRuntime {
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
