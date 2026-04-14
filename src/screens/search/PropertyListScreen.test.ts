import { describe, expect, it } from 'vitest';
import { sortByNewest } from './PropertyListScreen';

const properties = [
  {
    id: '1',
    title: 'Old',
    price: 100,
    location: 'A',
    city: 'HCM',
    area: 50,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: 'apartment' as const,
    images: [],
    description: '',
    amenities: [],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'New',
    price: 200,
    location: 'B',
    city: 'HCM',
    area: 70,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'house' as const,
    images: [],
    description: '',
    amenities: [],
    createdAt: '2026-02-01T00:00:00.000Z',
  },
];

describe('sortByNewest', () => {
  it('sorts properties by createdAt descending', () => {
    const sorted = sortByNewest(properties);
    expect(sorted[0].id).toBe('2');
    expect(sorted[1].id).toBe('1');
  });
});
