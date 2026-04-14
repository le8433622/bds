import { afterEach, describe, expect, it } from 'vitest';
import { resetContactStateForTesting } from '../services/api/contactApi';
import { bookVisit, contactAgent, resetContactUsecaseInFlightForTesting } from './contactUsecase';

afterEach(() => {
  resetContactStateForTesting();
  resetContactUsecaseInFlightForTesting();
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

  it('deduplicates concurrent contact requests with same payload', async () => {
    const payload = {
      propertyId: 'p-001',
      fullName: 'Nguyen Van A',
      phone: '0909123456',
      preferredMethod: 'call' as const,
    };

    const [first, second] = await Promise.all([contactAgent(payload), contactAgent(payload)]);
    expect(first.id).toBe(second.id);
  });

  it('blocks repeated contact requests when rate limit is exceeded', async () => {
    const payload = {
      propertyId: 'p-001',
      fullName: 'Nguyen Van A',
      phone: '0909000000',
      preferredMethod: 'call' as const,
    };

    await contactAgent(payload);
    await contactAgent(payload);
    await contactAgent(payload);

    await expect(contactAgent(payload)).rejects.toThrow('RATE_LIMIT_EXCEEDED');
  });
});
