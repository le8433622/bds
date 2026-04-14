import { describe, expect, it } from 'vitest';
import { createHealthApiGateway } from './healthApiHttp';
import type { ApiResult } from '../../types/api';

describe('healthApiGateway', () => {
  it('delegates health endpoint', async () => {
    const calls: string[] = [];

    const gateway = createHealthApiGateway({
      get: async <T,>(path: string): Promise<ApiResult<T>> => {
        calls.push(path);
        return { ok: true, data: { status: 'ok', timestamp: '2026-01-01T00:00:00.000Z' } as unknown as T };
      },
      post: async <TBody extends object, TResponse>(): Promise<ApiResult<TResponse>> => {
        return { ok: true, data: {} as TResponse };
      },
    });

    const result = await gateway.check();
    expect(result.ok).toBe(true);
    expect(calls).toEqual(['/health']);
  });
});
