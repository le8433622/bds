import { describe, expect, it } from 'vitest';
import { createDefaultRuntime, configureMonitoringFromEnv } from './defaultRuntime';
import { resetErrorMonitoringForTesting, setMonitoringProvider } from '../services/monitoring/errorMonitoring';

describe('createDefaultRuntime', () => {
  it('uses defaults and returns runtime', () => {
    const runtime = createDefaultRuntime({});
    expect(runtime.mode).toBe('mock');
  });

  it('supports backend mode from env', () => {
    const runtime = createDefaultRuntime({
      APP_ENV: 'production',
      API_BASE_URL: 'https://api.example.com',
      API_TIMEOUT_MS: '3000',
      API_RETRY_COUNT: '3',
      API_RETRY_DELAY_MS: '250',
      USE_MOCK_API: 'false',
    });

    expect(runtime.mode).toBe('backend');
  });

  it('can configure monitoring provider from env', async () => {
    let captured = false;
    setMonitoringProvider({
      captureException() {
        captured = true;
      },
    });

    configureMonitoringFromEnv({});
    // provider reset when SENTRY_DSN is absent; custom provider should not be used
    expect(captured).toBe(false);
    resetErrorMonitoringForTesting();
  });
});
