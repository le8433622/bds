import type { ApiResult } from '../../types/api';
import type { HttpClient } from './httpClient';

export type HealthResponse = {
  status: 'ok';
  timestamp: string;
};

export type HealthApiGateway = {
  check(): Promise<ApiResult<HealthResponse>>;
};

export function createHealthApiGateway(client: HttpClient): HealthApiGateway {
  return {
    check() {
      return client.get<HealthResponse>('/health', {
        criticality: 'normal',
      });
    },
  };
}
