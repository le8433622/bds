import { describe, expect, it } from 'vitest';
import { bootstrapAppFromEnv } from './bootstrap';

describe('bootstrapAppFromEnv', () => {
  it('creates runtime for valid env', () => {
    const result = bootstrapAppFromEnv({
      APP_ENV: 'development',
      API_BASE_URL: 'https://api.example.com',
      API_TIMEOUT_MS: '5000',
      API_RETRY_COUNT: '2',
      API_RETRY_DELAY_MS: '150',
      USE_MOCK_API: 'true',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.runtime.mode).toBe('mock');
    }
  });

  it('returns config error for invalid env', () => {
    const result = bootstrapAppFromEnv({
      APP_ENV: 'invalid',
      API_BASE_URL: 'https://api.example.com',
      API_TIMEOUT_MS: '5000',
      API_RETRY_COUNT: '2',
      API_RETRY_DELAY_MS: '150',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('INVALID_ENV');
    }
  });
});
