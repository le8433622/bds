import { describe, expect, it } from 'vitest';
import { createHttpClient } from './httpClient';

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('httpClient', () => {
  it('returns ok result for successful GET', async () => {
    const client = createHttpClient({
      baseUrl: 'https://api.example.com',
      timeoutMs: 1000,
      fetchFn: async () => createJsonResponse({ value: 123 }),
    });

    const result = await client.get<{ value: number }>('/health');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.value).toBe(123);
    }
  });

  it('returns HTTP_ERROR for non-2xx', async () => {
    const client = createHttpClient({
      baseUrl: 'https://api.example.com',
      timeoutMs: 1000,
      fetchFn: async () => createJsonResponse({ message: 'bad' }, 500),
    });

    const result = await client.get('/health');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('HTTP_ERROR');
    }
  });

  it('returns NETWORK_ERROR for thrown fetch error', async () => {
    const client = createHttpClient({
      baseUrl: 'https://api.example.com',
      timeoutMs: 1000,
      fetchFn: async () => {
        throw new Error('network down');
      },
    });

    const result = await client.get('/health');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
  });

  it('retries when fetch fails with network error and succeeds later', async () => {
    let attempts = 0;
    const delays: number[] = [];
    const client = createHttpClient({
      baseUrl: 'https://api.example.com',
      timeoutMs: 1000,
      retryCount: 1,
      sleepFn: async (ms) => {
        delays.push(ms);
      },
      fetchFn: async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new Error('temporary network issue');
        }
        return createJsonResponse({ value: 777 });
      },
    });

    const result = await client.get<{ value: number }>('/health');
    expect(result.ok).toBe(true);
    expect(attempts).toBe(2);
    expect(delays).toEqual([100]);
    if (result.ok) {
      expect(result.data.value).toBe(777);
    }
  });

  it('stops after configured retries', async () => {
    let attempts = 0;
    const delays: number[] = [];
    const client = createHttpClient({
      baseUrl: 'https://api.example.com',
      timeoutMs: 1000,
      retryCount: 2,
      sleepFn: async (ms) => {
        delays.push(ms);
      },
      fetchFn: async () => {
        attempts += 1;
        throw new Error('still down');
      },
    });

    const result = await client.get('/health');
    expect(result.ok).toBe(false);
    expect(attempts).toBe(3);
    expect(delays).toEqual([100, 200]);
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
  });
});
