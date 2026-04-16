import { describe, expect, it } from 'vitest';
import type { Property } from '../../types/models';
import {
  HomeSections,
  createHomeScreenController,
  createInitialHomeScreenState,
} from './HomeScreen';

function createProperty(id: string): Property {
  return {
    id,
    title: `Property ${id}`,
    price: 1_000_000_000,
    location: 'Thu Duc',
    city: 'HCM',
    area: 65,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'apartment',
    images: [],
    description: 'desc',
    amenities: [],
    createdAt: '2026-04-12T00:00:00.000Z',
  };
}

describe('HomeScreen controller', () => {
  it('keeps base sections and empty initial state', () => {
    const state = createInitialHomeScreenState();
    expect(HomeSections).toHaveLength(5);
    expect(state.status).toBe('idle');
    expect(state.sections[0]?.title).toBe('Search Bar');
  });

  it('loads featured/new listings and deduplicates ids', async () => {
    const controller = createHomeScreenController({
      loadFeatured: async () => [createProperty('p-1'), createProperty('p-1')],
      loadNewListings: async () => [createProperty('p-2')],
    });

    const state = await controller.load();
    expect(state.status).toBe('success');
    expect(state.featured).toHaveLength(1);
    expect(state.newListings).toHaveLength(1);
  });

  it('returns empty when both feeds are empty', async () => {
    const controller = createHomeScreenController({
      loadFeatured: async () => [],
      loadNewListings: async () => [],
    });

    const state = await controller.load();
    expect(state.status).toBe('empty');
  });

  it('handles load failures and supports retry', async () => {
    let attempt = 0;
    const controller = createHomeScreenController({
      loadFeatured: async () => {
        attempt += 1;
        if (attempt === 1) {
          throw new Error('service down');
        }
        return [createProperty('p-3')];
      },
      loadNewListings: async () => [],
    });

    const failed = await controller.load();
    expect(failed.status).toBe('error');
    expect(failed.errorMessage).toContain('service down');

    const recovered = await controller.retry();
    expect(recovered.status).toBe('success');
  });
});
