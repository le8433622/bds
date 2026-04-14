import { err, ok } from '../../types/result';
import type { ApiResult } from '../../types/api';

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;
type SleepFn = (ms: number) => Promise<void>;

export type HttpClient = {
  get<T>(path: string): Promise<ApiResult<T>>;
  post<TBody extends object, TResponse>(path: string, body: TBody): Promise<ApiResult<TResponse>>;
};

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function createHttpClient(input: {
  baseUrl: string;
  timeoutMs: number;
  retryCount?: number;
  retryDelayMs?: number;
  sleepFn?: SleepFn;
  fetchFn?: FetchFn;
}): HttpClient {
  const fetchFn = input.fetchFn ?? fetch;
  const retryCount = Math.max(0, Math.floor(input.retryCount ?? 0));
  const retryDelayMs = Math.max(0, Math.floor(input.retryDelayMs ?? 100));
  const sleepFn: SleepFn = input.sleepFn ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));

  async function executeOnce<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), input.timeoutMs);

    try {
      const response = await fetchFn(joinUrl(input.baseUrl, path), {
        ...init,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(init?.headers ?? {}),
        },
      });

      if (!response.ok) {
        return err('HTTP_ERROR', `HTTP ${response.status}`);
      }

      const data = (await response.json()) as T;
      return ok(data);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return err('TIMEOUT', 'Request timeout.');
      }

      return err('NETWORK_ERROR', 'Network request failed.');
    } finally {
      clearTimeout(timeout);
    }
  }

  async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
    let attempts = 0;
    while (attempts <= retryCount) {
      const result = await executeOnce<T>(path, init);
      if (result.ok) {
        return result;
      }

      const shouldRetry = result.error.code === 'NETWORK_ERROR' || result.error.code === 'TIMEOUT';
      if (!shouldRetry || attempts === retryCount) {
        return result;
      }

      const backoffDelay = retryDelayMs * (attempts + 1);
      await sleepFn(backoffDelay);
      attempts += 1;
    }

    return err('NETWORK_ERROR', 'Network request failed.');
  }

  return {
    get<T>(path: string): Promise<ApiResult<T>> {
      return request<T>(path, { method: 'GET' });
    },

    post<TBody extends object, TResponse>(path: string, body: TBody): Promise<ApiResult<TResponse>> {
      return request<TResponse>(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    },
  };
}
