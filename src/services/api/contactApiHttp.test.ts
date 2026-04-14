import { describe, expect, it } from 'vitest';
import { createContactApiGateway } from './contactApiHttp';
import type { ApiResult } from '../../types/api';

describe('contactApiGateway', () => {
  it('delegates contact and visit endpoints', async () => {
    const called: string[] = [];

    const gateway = createContactApiGateway({
      get: async <T,>(): Promise<ApiResult<T>> => ({ ok: true, data: {} as T }),
      post: async <TBody extends object, TResponse>(path: string): Promise<ApiResult<TResponse>> => {
        called.push(path);
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
    expect(called).toEqual(['/contact-request', '/book-visit']);
  });
});
