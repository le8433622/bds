import { describe, expect, it } from 'vitest';
import { searchProperties } from './searchUsecase';

describe('searchUsecase', () => {
  it('searches with filters and pagination', async () => {
    const result = await searchProperties({ intent: 'rent' }, { page: 1, pageSize: 5 });
    expect(result.page).toBe(1);
    expect(result.data.every((property) => property.propertyType === 'rental')).toBe(true);
  });
});
