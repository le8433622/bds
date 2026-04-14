import { afterEach, describe, expect, it } from 'vitest';
import { addSavedProperty, resetSavedStateForTesting } from '../services/api/savedApi';
import { resetUnsaveUsecaseInFlightForTesting, unsaveProperty } from './unsaveUsecase';

afterEach(() => {
  resetSavedStateForTesting();
  resetUnsaveUsecaseInFlightForTesting();
});

describe('unsaveUsecase', () => {
  it('requires auth before unsaving', async () => {
    const result = await unsaveProperty({ isLoggedIn: false, propertyId: 'p-001' });
    expect(result).toEqual({ ok: false, reason: 'AUTH_REQUIRED' });
  });

  it('removes property when authenticated', async () => {
    await addSavedProperty('p-001');

    const result = await unsaveProperty({ isLoggedIn: true, propertyId: 'p-001' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.savedIds).not.toContain('p-001');
    }
  });
});
