import { describe, expect, it } from 'vitest';
import { getPropertiesPaginated } from './propertyApi';

describe('propertyApi pagination', () => {
  it('returns paginated data shape', async () => {
    const result = await getPropertiesPaginated({}, { page: 1, pageSize: 2 });

    expect(result.data.length).toBeLessThanOrEqual(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(2);
    expect(result.totalPages).toBeGreaterThanOrEqual(1);
  });

  it('supports filter + pagination', async () => {
    const result = await getPropertiesPaginated({ intent: 'rent' }, { page: 1, pageSize: 10 });
    expect(result.data.every((item) => item.propertyType === 'rental')).toBe(true);
  });
});
