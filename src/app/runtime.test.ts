import { describe, expect, it } from 'vitest';
import { createAppRuntime } from './runtime';

describe('createAppRuntime', () => {
  it('builds mock runtime when USE_MOCK_API=true', () => {
    const runtime = createAppRuntime({
      env: 'development',
      apiBaseUrl: 'https://api.example.com',
      apiTimeoutMs: 5000,
      apiRetryCount: 1,
      apiRetryDelayMs: 100,
      useMockApi: true,
    });

    expect(runtime.mode).toBe('mock');
  });

  it('builds backend runtime when USE_MOCK_API=false', () => {
    const runtime = createAppRuntime({
      env: 'production',
      apiBaseUrl: 'https://api.example.com',
      apiTimeoutMs: 5000,
      apiRetryCount: 1,
      apiRetryDelayMs: 100,
      useMockApi: false,
    });

    expect(runtime.mode).toBe('backend');
  });
});
