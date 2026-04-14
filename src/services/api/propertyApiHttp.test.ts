import { describe, expect, it } from 'vitest';
import { createPropertyApiGateway } from './propertyApiHttp';
import type { ApiResult } from '../../types/api';

describe('propertyApiGateway', () => {
  it('builds list query and delegates to client.get', async () => {
    const called: Array<{ path: string; options?: { criticality?: string } }> = [];
    const gateway = createPropertyApiGateway({
      get: async <T,>(
        path: string,
        options?: { criticality?: string },
      ): Promise<ApiResult<T>> => {
        called.push({ path, options });
        return { ok: true, data: [] as unknown as T };
      },
      post: async <TBody extends object, TResponse>(): Promise<ApiResult<TResponse>> => {
        return { ok: true, data: {} as TResponse };
      },
    });

    const result = await gateway.list({ intent: 'rent', bedrooms: 2 }, { page: 1, pageSize: 20 });

    expect(result.ok).toBe(true);
    expect(called[0].path).toContain('/properties?');
    expect(called[0].path).toContain('intent=rent');
    expect(called[0].path).toContain('bedrooms=2');
    expect(called[0].path).toContain('pageSize=20');
    expect(called[0].options?.criticality).toBe('normal');
  });

  it('delegates property detail endpoint', async () => {
    const called: Array<{ path: string; options?: { criticality?: string } }> = [];
    const gateway = createPropertyApiGateway({
      get: async <T,>(
        path: string,
        options?: { criticality?: string },
      ): Promise<ApiResult<T>> => {
        called.push({ path, options });
        return {
          ok: true,
          data: {
            id: 'p-001',
            title: 'A',
            price: 1,
            location: 'B',
            city: 'C',
            area: 1,
            bedrooms: 1,
            bathrooms: 1,
            propertyType: 'apartment',
            images: [],
            description: '',
            amenities: [],
            createdAt: '2026-01-01T00:00:00.000Z',
          } as unknown as T,
        };
      },
      post: async <TBody extends object, TResponse>(): Promise<ApiResult<TResponse>> => {
        return { ok: true, data: {} as TResponse };
      },
    });

    const result = await gateway.detail('p-001');

    expect(result.ok).toBe(true);
    expect(called[0].path).toBe('/properties/p-001');
    expect(called[0].options?.criticality).toBe('high');
  });
});
