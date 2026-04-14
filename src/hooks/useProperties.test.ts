import { describe, expect, it } from 'vitest';
import { fetchPropertiesByFilters } from './useProperties';

describe('useProperties hook helper', () => {
  it('fetches properties by filters', async () => {
    const result = await fetchPropertiesByFilters({ intent: 'rent' });
    expect(result.every((item) => item.propertyType === 'rental')).toBe(true);
  });
});
