import { err, ok, type Result } from '../types/result';

export type AppEnv = 'development' | 'staging' | 'production';

export type AppConfig = {
  env: AppEnv;
  apiBaseUrl: string;
  apiTimeoutMs: number;
  apiRetryCount: number;
  apiRetryDelayMs: number;
  useMockApi: boolean;
};

export type AppConfigError = 'INVALID_ENV' | 'INVALID_API_BASE_URL' | 'INVALID_API_TIMEOUT_MS';

function parseEnv(value?: string): Result<AppEnv, AppConfigError> {
  if (value === 'development' || value === 'staging' || value === 'production') {
    return ok(value);
  }
  return err('INVALID_ENV', 'APP_ENV phải là development, staging hoặc production.');
}

function parseApiBaseUrl(value?: string): Result<string, AppConfigError> {
  if (!value) return err('INVALID_API_BASE_URL', 'API_BASE_URL là bắt buộc.');
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return err('INVALID_API_BASE_URL', 'API_BASE_URL phải là URL http/https hợp lệ.');
    }
    return ok(value);
  } catch {
    return err('INVALID_API_BASE_URL', 'API_BASE_URL không hợp lệ.');
  }
}

function parseApiTimeoutMs(value?: string): Result<number, AppConfigError> {
  const timeout = Number(value ?? '5000');
  if (!Number.isFinite(timeout) || timeout <= 0) {
    return err('INVALID_API_TIMEOUT_MS', 'API_TIMEOUT_MS phải là số dương.');
  }
  return ok(timeout);
}

function parseUseMockApi(value?: string): boolean {
  if (!value) return true;
  return value.toLowerCase() === 'true';
}

function parseApiRetryCount(value?: string): number {
  const retry = Number(value ?? '1');
  if (!Number.isFinite(retry) || retry < 0) {
    return 1;
  }
  return Math.floor(retry);
}

function parseApiRetryDelayMs(value?: string): number {
  const delay = Number(value ?? '100');
  if (!Number.isFinite(delay) || delay < 0) {
    return 100;
  }
  return Math.floor(delay);
}

export function loadAppConfig(input: {
  APP_ENV?: string;
  API_BASE_URL?: string;
  API_TIMEOUT_MS?: string;
  API_RETRY_COUNT?: string;
  API_RETRY_DELAY_MS?: string;
  USE_MOCK_API?: string;
}): Result<AppConfig, AppConfigError> {
  const env = parseEnv(input.APP_ENV);
  if (!env.ok) return env;

  const apiBaseUrl = parseApiBaseUrl(input.API_BASE_URL);
  if (!apiBaseUrl.ok) return apiBaseUrl;

  const apiTimeoutMs = parseApiTimeoutMs(input.API_TIMEOUT_MS);
  if (!apiTimeoutMs.ok) return apiTimeoutMs;

  return ok({
    env: env.data,
    apiBaseUrl: apiBaseUrl.data,
    apiTimeoutMs: apiTimeoutMs.data,
    apiRetryCount: parseApiRetryCount(input.API_RETRY_COUNT),
    apiRetryDelayMs: parseApiRetryDelayMs(input.API_RETRY_DELAY_MS),
    useMockApi: parseUseMockApi(input.USE_MOCK_API),
  });
}
