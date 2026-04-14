import { afterEach, describe, expect, it } from 'vitest';
import { resetSavedStateForTesting } from '../services/api/savedApi';
import { saveProperty } from './saveUsecase';

afterEach(() => {
  resetSavedStateForTesting();
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
});
