import { afterEach, describe, expect, it } from 'vitest';
import { resetContactStateForTesting } from '../services/api/contactApi';
import { bookVisit, contactAgent } from './contactUsecase';

afterEach(() => {
  resetContactStateForTesting();
});

describe('contactUsecase', () => {
  it('creates contact agent request', async () => {
    const created = await contactAgent({
      propertyId: 'p-001',
      fullName: 'Nguyen Van A',
      phone: '0909123456',
      preferredMethod: 'call',
    });

    expect(created.id.startsWith('contact-')).toBe(true);
  });

  it('creates book visit request', async () => {
    const created = await bookVisit({
      propertyId: 'p-001',
      fullName: 'Nguyen Van A',
      phone: '0909123456',
      visitDate: '2026-06-01T09:00:00.000Z',
    });

    expect(created.id.startsWith('visit-')).toBe(true);
  });
});
