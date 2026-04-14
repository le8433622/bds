import { describe, expect, it } from 'vitest';
import { createBackendUsecases } from './backendUsecases';

describe('backendUsecases', () => {
  it('delegates to gateways', async () => {
    const usecases = createBackendUsecases({
      propertyGateway: {
        list: async () => ({ ok: true, data: [] }),
        detail: async () => ({ ok: true, data: { id: 'p-001' } as never }),
      },
      savedGateway: {
        list: async () => ({ ok: true, data: [] }),
        add: async () => ({ ok: true, data: { success: true } }),
        remove: async () => ({ ok: true, data: { success: true } }),
      },
      contactGateway: {
        contact: async () => ({ ok: true, data: { id: 'c-1' } }),
        bookVisit: async () => ({ ok: true, data: { id: 'v-1' } }),
      },
      healthGateway: {
        check: async () => ({ ok: true, data: { status: 'ok', timestamp: '2026-01-01T00:00:00.000Z' } }),
      },
    });

    const search = await usecases.search({}, { page: 1, pageSize: 20 });
    const save = await usecases.save('p-001');
    const contact = await usecases.contact({
      propertyId: 'p-001',
      fullName: 'A',
      phone: '0909123456',
      preferredMethod: 'call',
    });
    const health = await usecases.healthCheck();

    expect(search.ok).toBe(true);
    expect(save.ok).toBe(true);
    expect(contact.ok).toBe(true);
    expect(health.ok).toBe(true);
  });
});
