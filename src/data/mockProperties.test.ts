import { describe, expect, it } from 'vitest';
import { MOCK_PROPERTIES } from './mockProperties';

describe('MOCK_PROPERTIES', () => {
  it('contains at least 3 records with required fields', () => {
    expect(MOCK_PROPERTIES.length).toBeGreaterThanOrEqual(3);

    for (const item of MOCK_PROPERTIES) {
      expect(item.id).toBeTypeOf('string');
      expect(item.title).toBeTypeOf('string');
      expect(item.price).toBeTypeOf('number');
      expect(item.images).toBeInstanceOf(Array);
    }
  });
});
