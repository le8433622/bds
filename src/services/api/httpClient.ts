import { err, ok } from '../../types/result';
import type { ApiResult } from '../../types/api';

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;
type SleepFn = (ms: number) => Promise<void>;
type HttpMethod = 'GET' | 'POST';

export type RequestCriticality = 'low' | 'normal' | 'high';

export type HttpRequestOptions = {
  requestId?: string;
  retryCount?: number;
  criticality?: RequestCriticality;
  idempotencyKey?: string;
  headers?: Record<string, string>;
};

type HttpLogEvent = 'request_start' | 'request_retry' | 'request_success' | 'request_failure';
type HttpLogger = (
  event: HttpLogEvent,
  context: {
    requestId: string;
    method: HttpMethod;
    path: string;
    attempt: number;
    maxAttempts: number;
    durationMs?: number;
    errorCode?: string;
    errorMessage?: string;
    criticality: RequestCriticality;
  },
) => void;

export type HttpClient = {
  get<T>(path: string, options?: HttpRequestOptions): Promise<ApiResult<T>>;
  post<TBody extends object, TResponse>(
    path: string,
    body: TBody,
    options?: HttpRequestOptions,
  ): Promise<ApiResult<TResponse>>;
};

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function toRequestCriticality(value?: RequestCriticality): RequestCriticality {
  return value ?? 'normal';
}

function sanitizeRetryCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }
  return Math.floor(value);
}

function parseHttpStatus(errorMessage: string): number | null {
  const matched = /^HTTP (\d{3})$/.exec(errorMessage.trim());
  if (!matched) {
    return null;
  }
  const status = Number(matched[1]);
  return Number.isFinite(status) ? status : null;
}

function shouldRetryResult(result: ApiResult<unknown>): boolean {
  if (result.ok) {
    return false;
  }

  if (result.error.code === 'NETWORK_ERROR' || result.error.code === 'TIMEOUT') {
    return true;
  }

  if (result.error.code !== 'HTTP_ERROR') {
    return false;
  }

  const status = parseHttpStatus(result.error.message);
  return status === 429 || status === 502 || status === 503 || status === 504;
}

export function createHttpClient(input: {
  baseUrl: string;
  timeoutMs: number;
  retryCount?: number;
  retryDelayMs?: number;
  sleepFn?: SleepFn;
  fetchFn?: FetchFn;
  requestIdFactory?: () => string;
  logger?: HttpLogger;
}): HttpClient {
  const fetchFn = input.fetchFn ?? fetch;
  const baseRetryCount = sanitizeRetryCount(input.retryCount ?? 0);
  const retryDelayMs = Math.max(0, Math.floor(input.retryDelayMs ?? 100));
  const sleepFn: SleepFn = input.sleepFn ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const logger: HttpLogger = input.logger ?? (() => undefined);

  let sequence = 0;
  const requestIdFactory =
    input.requestIdFactory ??
    (() => {
      sequence += 1;
      return `req-${Date.now()}-${sequence}`;
    });

  function resolveRetryCount(options?: HttpRequestOptions): number {
    if (typeof options?.retryCount === 'number') {
      return sanitizeRetryCount(options.retryCount);
    }

    const criticality = toRequestCriticality(options?.criticality);
    if (criticality === 'low') {
      return Math.max(0, baseRetryCount - 1);
    }

    if (criticality === 'high') {
      return baseRetryCount + 1;
    }

    return baseRetryCount;
  }

  async function executeOnce<T>(inputRequest: {
    method: HttpMethod;
    path: string;
    body?: string;
    requestId: string;
    options?: HttpRequestOptions;
  }): Promise<ApiResult<T>> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), input.timeoutMs);

    try {
      const response = await fetchFn(joinUrl(input.baseUrl, inputRequest.path), {
        method: inputRequest.method,
        body: inputRequest.body,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Id': inputRequest.requestId,
          ...(inputRequest.options?.idempotencyKey
            ? { 'Idempotency-Key': inputRequest.options.idempotencyKey }
            : {}),
          ...(inputRequest.options?.headers ?? {}),
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

  async function request<T>(inputRequest: {
    method: HttpMethod;
    path: string;
    body?: string;
    options?: HttpRequestOptions;
  }): Promise<ApiResult<T>> {
    const maxRetries = resolveRetryCount(inputRequest.options);
    const maxAttempts = maxRetries + 1;
    const requestId = inputRequest.options?.requestId ?? requestIdFactory();
    const criticality = toRequestCriticality(inputRequest.options?.criticality);
    let attempt = 0;

    while (attempt < maxAttempts) {
      logger(attempt === 0 ? 'request_start' : 'request_retry', {
        requestId,
        method: inputRequest.method,
        path: inputRequest.path,
        attempt: attempt + 1,
        maxAttempts,
        criticality,
      });

      const startedAt = Date.now();
      const result = await executeOnce<T>({
        ...inputRequest,
        requestId,
      });
      const durationMs = Date.now() - startedAt;

      if (result.ok) {
        logger('request_success', {
          requestId,
          method: inputRequest.method,
          path: inputRequest.path,
          attempt: attempt + 1,
          maxAttempts,
          durationMs,
          criticality,
        });
        return result;
      }

      if (!shouldRetryResult(result) || attempt + 1 >= maxAttempts) {
        logger('request_failure', {
          requestId,
          method: inputRequest.method,
          path: inputRequest.path,
          attempt: attempt + 1,
          maxAttempts,
          durationMs,
          errorCode: result.error.code,
          errorMessage: result.error.message,
          criticality,
        });
        return result;
      }

      const backoffDelay = retryDelayMs * (attempt + 1);
      await sleepFn(backoffDelay);
      attempt += 1;
    }

    return err('NETWORK_ERROR', 'Network request failed.');
  }

  return {
    get<T>(path: string, options?: HttpRequestOptions): Promise<ApiResult<T>> {
      return request<T>({ method: 'GET', path, options });
    },

    post<TBody extends object, TResponse>(
      path: string,
      body: TBody,
      options?: HttpRequestOptions,
    ): Promise<ApiResult<TResponse>> {
      return request<TResponse>({
        method: 'POST',
        path,
        body: JSON.stringify(body),
        options,
      });
    },
  };
}
