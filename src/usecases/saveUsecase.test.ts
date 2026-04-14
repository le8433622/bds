import { afterEach, describe, expect, it } from 'vitest';
import { resetSavedStateForTesting } from '../services/api/savedApi';
import { resetSaveUsecaseInFlightForTesting, saveProperty } from './saveUsecase';

afterEach(() => {
  resetSavedStateForTesting();
  resetSaveUsecaseInFlightForTesting();
});

describe('saveUsecase', () => {
  it('requires auth before saving', async () => {
    const result = await saveProperty({ isLoggedIn: false, propertyId: 'p-001' });
    expect(result).toEqual({ ok: false, reason: 'AUTH_REQUIRED' });
  });

  it('saves property when authenticated', async () => {
    const result = await saveProperty({ isLoggedIn: true, propertyId: 'p-001' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.savedIds).toContain('p-001');
    }
  });

  it('deduplicates concurrent save action for same property', async () => {
    const [first, second] = await Promise.all([
      saveProperty({ isLoggedIn: true, propertyId: 'p-001' }),
      saveProperty({ isLoggedIn: true, propertyId: 'p-001' }),
    ]);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.savedIds).toEqual(second.savedIds);
    }
  });
});
