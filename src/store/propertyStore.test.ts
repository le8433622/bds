import { describe, expect, it } from 'vitest';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { filterProperties, getFeaturedProperties, sortProperties } from './propertyStore';

describe('propertyStore', () => {
  it('filters by intent rent', () => {
    const result = filterProperties(MOCK_PROPERTIES, { intent: 'rent' });
    expect(result.every((item) => item.propertyType === 'rental')).toBe(true);
  });

  it('filters by city keyword', () => {
    const result = filterProperties(MOCK_PROPERTIES, { location: 'hà nội' });
    expect(result).toHaveLength(1);
    expect(result[0]?.city).toBe('Hà Nội');
  });

  it('sorts by price descending', () => {
    const sorted = sortProperties(MOCK_PROPERTIES, 'priceDesc');
    expect(sorted[0].price).toBeGreaterThanOrEqual(sorted[1].price);
  });

  it('gets featured properties with limit', () => {
    const featured = getFeaturedProperties(MOCK_PROPERTIES, 2);
    expect(featured).toHaveLength(2);
  });
});
