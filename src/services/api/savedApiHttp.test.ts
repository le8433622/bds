import { describe, expect, it } from 'vitest';
import { createSavedApiGateway } from './savedApiHttp';
import type { ApiResult } from '../../types/api';

describe('savedApiGateway', () => {
  it('delegates list/add/remove endpoints', async () => {
    const called: Array<{ method: 'get' | 'post'; path: string }> = [];

    const gateway = createSavedApiGateway({
      get: async <T,>(path: string): Promise<ApiResult<T>> => {
        called.push({ method: 'get', path });
        return { ok: true, data: [] as unknown as T };
      },
      post: async <TBody extends object, TResponse>(path: string): Promise<ApiResult<TResponse>> => {
        called.push({ method: 'post', path });
        return { ok: true, data: { success: true } as unknown as TResponse };
      },
    });

    await gateway.list();
    await gateway.add('p-001');
    await gateway.remove('p-001');

    expect(called).toEqual([
      { method: 'get', path: '/saved-properties' },
      { method: 'post', path: '/saved-properties' },
      { method: 'post', path: '/saved-properties/remove' },
    ]);
  });
});
