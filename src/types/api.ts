import type { Result } from './result';

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'INVALID_RESPONSE'
  | 'HTTP_ERROR';

export type ApiError = {
  code: ApiErrorCode;
  message: string;
  status?: number;
};

export type ApiResult<T> = Result<T, ApiErrorCode>;
