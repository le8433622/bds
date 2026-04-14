import { describe, expect, it } from 'vitest';
import { createServiceFactory } from './serviceFactory';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('serviceFactory integration (with fetch)', () => {
  it('property gateway list/detail works through http client', async () => {
    const calls: string[] = [];

    const factory = createServiceFactory({
      apiBaseUrl: 'https://api.example.com',
      timeoutMs: 1000,
      fetchFn: async (url) => {
        calls.push(url);

        if (url.endsWith('/properties/p-001')) {
          return jsonResponse({
            id: 'p-001',
            title: 'A',
            price: 100,
            location: 'B',
            city: 'C',
            area: 50,
            bedrooms: 1,
            bathrooms: 1,
            propertyType: 'apartment',
            images: [],
            description: '',
            amenities: [],
            createdAt: '2026-01-01T00:00:00.000Z',
          });
        }

        return jsonResponse([]);
      },
    });

    const list = await factory.propertyGateway.list({ intent: 'rent' }, { page: 1, pageSize: 10 });
    const detail = await factory.propertyGateway.detail('p-001');

    expect(list.ok).toBe(true);
    expect(detail.ok).toBe(true);
    expect(calls.some((url) => url.includes('/properties?'))).toBe(true);
    expect(calls.some((url) => url.endsWith('/properties/p-001'))).toBe(true);
  });

  it('passes retryCount to http client for transient failures', async () => {
    let attempts = 0;
    const factory = createServiceFactory({
      apiBaseUrl: 'https://api.example.com',
      timeoutMs: 1000,
      retryCount: 1,
      fetchFn: async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new Error('temporary failure');
        }
        return jsonResponse({ status: 'ok' });
      },
    });

    const result = await factory.healthGateway.check();
    expect(result.ok).toBe(true);
    expect(attempts).toBe(2);
  });
});
