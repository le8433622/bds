import { describe, expect, it } from 'vitest';
import { loadAppConfig } from './appConfig';

describe('loadAppConfig', () => {
  it('loads valid config', () => {
    const result = loadAppConfig({
      APP_ENV: 'development',
      API_BASE_URL: 'https://api.homefinder.dev',
      API_TIMEOUT_MS: '6000',
      API_RETRY_COUNT: '2',
      API_RETRY_DELAY_MS: '250',
      USE_MOCK_API: 'false',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.apiTimeoutMs).toBe(6000);
      expect(result.data.apiRetryCount).toBe(2);
      expect(result.data.apiRetryDelayMs).toBe(250);
      expect(result.data.useMockApi).toBe(false);
    }
  });

  it('rejects invalid APP_ENV', () => {
    const result = loadAppConfig({
      APP_ENV: 'local',
      API_BASE_URL: 'https://api.homefinder.dev',
      API_TIMEOUT_MS: '6000',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_ENV');
    }
  });

  it('rejects invalid API URL', () => {
    const result = loadAppConfig({
      APP_ENV: 'development',
      API_BASE_URL: 'invalid-url',
      API_TIMEOUT_MS: '6000',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_API_BASE_URL');
    }
  });

  it('rejects non-positive timeout', () => {
    const result = loadAppConfig({
      APP_ENV: 'development',
      API_BASE_URL: 'https://api.homefinder.dev',
      API_TIMEOUT_MS: '0',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_API_TIMEOUT_MS');
    }
  });

  it('falls back to default retry count when invalid', () => {
    const result = loadAppConfig({
      APP_ENV: 'development',
      API_BASE_URL: 'https://api.homefinder.dev',
      API_TIMEOUT_MS: '6000',
      API_RETRY_COUNT: '-3',
      API_RETRY_DELAY_MS: '-10',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.apiRetryCount).toBe(1);
      expect(result.data.apiRetryDelayMs).toBe(100);
    }
  });
});
