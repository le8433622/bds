import { describe, expect, it } from 'vitest';
import type { Property } from '../../types/models';
import {
  createSavedScreenController,
  removeSavedProperty,
} from './SavedScreen';

function createProperty(id: string, price: number): Property {
  return {
    id,
    title: `P-${id}`,
    price,
    location: 'Q1',
    city: 'HCM',
    area: 70,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'apartment',
    images: [],
    description: 'desc',
    amenities: [],
    createdAt: '2026-04-12T00:00:00.000Z',
  };
}

describe('SavedScreen controller', () => {
  it('removes property by id', () => {
    const items = [createProperty('1', 1), createProperty('2', 2)];
    expect(removeSavedProperty(items, '1').map((item) => item.id)).toEqual(['2']);
  });

  it('loads items and sorts by price desc', async () => {
    const controller = createSavedScreenController({
      loadSaved: async () => [createProperty('1', 100), createProperty('2', 200)],
      unsave: async () => undefined,
    });

    const state = await controller.load();
    expect(state.status).toBe('success');
    expect(state.items.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('supports unsave transition to empty', async () => {
    const controller = createSavedScreenController({
      loadSaved: async () => [createProperty('1', 100)],
      unsave: async () => undefined,
    });

    await controller.load();
    const state = await controller.unsave('1');
    expect(state.status).toBe('empty');
    expect(state.items).toHaveLength(0);
  });
});
