import { describe, expect, it } from 'vitest';
import { createSavedApiGateway } from './savedApiHttp';
import type { ApiResult } from '../../types/api';

describe('savedApiGateway', () => {
  it('delegates list/add/remove endpoints', async () => {
    const called: Array<{
      method: 'get' | 'post';
      path: string;
      options?: { criticality?: string; idempotencyKey?: string };
    }> = [];

    const gateway = createSavedApiGateway({
      get: async <T,>(
        path: string,
        options?: { criticality?: string; idempotencyKey?: string },
      ): Promise<ApiResult<T>> => {
        called.push({ method: 'get', path, options });
        return { ok: true, data: [] as unknown as T };
      },
      post: async <TBody extends object, TResponse>(
        path: string,
        _body: TBody,
        options?: { criticality?: string; idempotencyKey?: string },
      ): Promise<ApiResult<TResponse>> => {
        called.push({ method: 'post', path, options });
        return { ok: true, data: { success: true } as unknown as TResponse };
      },
    });

    await gateway.list();
    await gateway.add('p-001');
    await gateway.remove('p-001');

    expect(called).toEqual([
      { method: 'get', path: '/saved-properties', options: { criticality: 'normal' } },
      {
        method: 'post',
        path: '/saved-properties',
        options: { criticality: 'high', idempotencyKey: 'saved:add:p-001' },
      },
      {
        method: 'post',
        path: '/saved-properties/remove',
        options: { criticality: 'high', idempotencyKey: 'saved:remove:p-001' },
      },
    ]);
  });
});
