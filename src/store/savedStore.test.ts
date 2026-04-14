import { describe, expect, it } from 'vitest';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { getSavedProperties, isSaved, toggleSaved } from './savedStore';

describe('savedStore', () => {
  it('toggles saved id on and off', () => {
    const first = toggleSaved([], 'p-001');
    expect(first).toEqual(['p-001']);

    const second = toggleSaved(first, 'p-001');
    expect(second).toEqual([]);
  });

  it('checks if property is saved', () => {
    expect(isSaved(['p-001'], 'p-001')).toBe(true);
    expect(isSaved(['p-001'], 'p-002')).toBe(false);
  });

  it('returns saved properties from full list', () => {
    const saved = getSavedProperties(MOCK_PROPERTIES, ['p-002']);
    expect(saved).toHaveLength(1);
    expect(saved[0]?.id).toBe('p-002');
  });
});
