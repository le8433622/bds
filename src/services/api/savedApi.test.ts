import { afterEach, describe, expect, it } from 'vitest';
import { getSavedIds, getSavedPropertyList, resetSavedStateForTesting, toggleSavedProperty } from './savedApi';

afterEach(() => {
  resetSavedStateForTesting();
});

describe('savedApi', () => {
  it('toggles saved ids', async () => {
    await toggleSavedProperty('p-001');
    expect(await getSavedIds()).toEqual(['p-001']);

    await toggleSavedProperty('p-001');
    expect(await getSavedIds()).toEqual([]);
  });

  it('returns saved property list', async () => {
    await toggleSavedProperty('p-003');
    const saved = await getSavedPropertyList();
    expect(saved).toHaveLength(1);
    expect(saved[0]?.id).toBe('p-003');
  });
});
