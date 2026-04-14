import { afterEach, describe, expect, it } from 'vitest';
import { createBookVisitRequest, createContactRequest, getContactRequests, getVisitRequests, resetContactStateForTesting } from './contactApi';

afterEach(() => {
  resetContactStateForTesting();
});

describe('contactApi', () => {
  it('creates contact request', async () => {
    const created = await createContactRequest({
      propertyId: 'p-001',
      fullName: 'Nguyen Van A',
      phone: '0909123456',
      preferredMethod: 'chat',
    });

    expect(created.id.startsWith('contact-')).toBe(true);
    expect(getContactRequests()).toHaveLength(1);
  });

  it('creates book visit request', async () => {
    const created = await createBookVisitRequest({
      propertyId: 'p-001',
      fullName: 'Nguyen Van B',
      phone: '0909123456',
      visitDate: '2026-05-01T09:00:00.000Z',
    });

    expect(created.id.startsWith('visit-')).toBe(true);
    expect(getVisitRequests()).toHaveLength(1);
  });

  it('throws when payload is invalid', async () => {
    await expect(
      createContactRequest({
        propertyId: '',
        fullName: '',
        phone: 'abc',
        preferredMethod: 'call',
      }),
    ).rejects.toThrowError();
  });
});
