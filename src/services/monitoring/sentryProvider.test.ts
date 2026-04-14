import { describe, expect, it } from 'vitest';
import { createSentryProvider } from './sentryProvider';

describe('sentryProvider', () => {
  it('posts exception payload to sentry endpoint', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = [];
    const provider = createSentryProvider({
      dsn: 'https://sentry.example.com/api/project/store',
      environment: 'staging',
      release: '0.1.0',
      fetchFn: async (url, init) => {
        calls.push({ url, init });
        return new Response('{}', { status: 200 });
      },
    });

    await provider.captureException(new Error('boom'), { feature: 'detail' });
    expect(calls).toHaveLength(1);
    expect(calls[0]?.url).toContain('sentry.example.com');
  });
});
