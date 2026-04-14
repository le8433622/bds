import { describe, expect, it } from 'vitest';
import { createContactApiGateway } from './contactApiHttp';
import type { ApiResult } from '../../types/api';

describe('contactApiGateway', () => {
  it('delegates contact and visit endpoints', async () => {
    const called: Array<{ path: string; options?: { criticality?: string; idempotencyKey?: string } }> = [];

    const gateway = createContactApiGateway({
      get: async <T,>(): Promise<ApiResult<T>> => ({ ok: true, data: {} as T }),
      post: async <TBody extends object, TResponse>(
        path: string,
        _body: TBody,
        options?: { criticality?: string; idempotencyKey?: string },
      ): Promise<ApiResult<TResponse>> => {
        called.push({ path, options });
        return { ok: true, data: { id: 'req-1' } as unknown as TResponse };
      },
    });

    const contact = await gateway.contact({
      propertyId: 'p-001',
      fullName: 'A',
      phone: '0909123456',
      preferredMethod: 'chat',
    });

    const visit = await gateway.bookVisit({
      propertyId: 'p-001',
      fullName: 'A',
      phone: '0909123456',
      visitDate: '2026-09-01T09:00:00.000Z',
    });

    expect(contact.ok).toBe(true);
    expect(visit.ok).toBe(true);
    expect(called).toEqual([
      {
        path: '/contact-request',
        options: {
          criticality: 'high',
          idempotencyKey: 'contact:p-001:0909123456:chat',
        },
      },
      {
        path: '/book-visit',
        options: {
          criticality: 'high',
          idempotencyKey: 'visit:p-001:0909123456:2026-09-01T09:00:00.000Z',
        },
      },
    ]);
  });
});
