import { describe, expect, it } from 'vitest';
import { createHttpAnalyticsProvider } from './httpAnalyticsProvider';

describe('httpAnalyticsProvider', () => {
  it('sends event payload to configured endpoint', async () => {
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const provider = createHttpAnalyticsProvider({
      endpoint: 'https://analytics.example.com/track',
      writeKey: 'key-123',
      fetchFn: async (url, init) => {
        requests.push({ url, init });
        return new Response('{}', { status: 200 });
      },
    });

    await provider.track({
      name: 'search_submitted',
      timestamp: '2026-04-14T09:00:00.000Z',
      payload: { location: 'HCM' },
    });

    expect(requests).toHaveLength(1);
    expect(requests[0]?.url).toBe('https://analytics.example.com/track');
    const headers = requests[0]?.init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer key-123');
  });
});
