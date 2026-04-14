import { describe, expect, it } from 'vitest';
import type { Property } from '../../types/models';
import { createPropertyListController, sortByNewest } from './PropertyListScreen';

const properties: Property[] = [
  {
    id: '1',
    title: 'Old',
    price: 100,
    location: 'A',
    city: 'HCM',
    area: 50,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: 'apartment',
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
    propertyType: 'house',
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

describe('PropertyListScreen controller', () => {
  it('loads and appends next page', async () => {
    const controller = createPropertyListController({
      loadPage: async (_filters, pagination) => ({
        data: pagination.page === 1 ? [properties[0]] : [properties[1]],
        page: pagination.page ?? 1,
        pageSize: pagination.pageSize ?? 1,
        total: 2,
        totalPages: 2,
      }),
    });

    await controller.load({}, { page: 1, pageSize: 1 });
    const next = await controller.loadNextPage();

    expect(next.items).toHaveLength(2);
    expect(next.canLoadMore).toBe(false);
  });

  it('supports refresh and retry for network failures', async () => {
    let attempts = 0;
    const controller = createPropertyListController({
      loadPage: async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new Error('temporary error');
        }

        return {
          data: [properties[1]],
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1,
        };
      },
    });

    const first = await controller.load({}, { page: 1, pageSize: 10 });
    expect(first.status).toBe('error');
    expect(first.canRetry).toBe(true);

    const retry = await controller.retry();
    expect(retry.status).toBe('success');

    const refreshed = await controller.refresh();
    expect(refreshed.status).toBe('success');
    expect(refreshed.items).toHaveLength(1);
  });
});
