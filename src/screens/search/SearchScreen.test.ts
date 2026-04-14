import { describe, expect, it } from 'vitest';
import type { Property } from '../../types/models';
import { createSearchScreenController, getSearchEmptyStateMessage } from './SearchScreen';

function createProperty(id: string): Property {
  return {
    id,
    title: `Property ${id}`,
    price: 1000000000,
    location: 'HCM',
    city: 'HCM',
    area: 70,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'apartment',
    images: [],
    description: 'desc',
    amenities: [],
    createdAt: '2026-04-10T10:00:00.000Z',
  };
}

describe('SearchScreen controller', () => {
  it('handles first-page submit and marks empty state', async () => {
    const controller = createSearchScreenController({
      search: async () => ({
        data: [],
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
      }),
    });

    const state = await controller.submit({ location: 'HCM' }, { page: 1, pageSize: 10 });
    expect(state.status).toBe('empty');
    expect(state.items).toHaveLength(0);
    expect(state.canLoadMore).toBe(false);
  });

  it('supports pagination append and tracks events', async () => {
    const tracked: string[] = [];
    const controller = createSearchScreenController({
      search: async (_filters, pagination) => ({
        data: pagination.page === 1 ? [createProperty('p-1')] : [createProperty('p-2')],
        page: pagination.page ?? 1,
        pageSize: pagination.pageSize ?? 10,
        total: 2,
        totalPages: 2,
      }),
      trackEvent: async (name) => {
        tracked.push(name);
      },
    });

    await controller.submit({ intent: 'buy' }, { page: 1, pageSize: 1 });
    const next = await controller.loadMore();

    expect(next.status).toBe('success');
    expect(next.items.map((item) => item.id)).toEqual(['p-1', 'p-2']);
    expect(tracked).toContain('search_submitted');
    expect(tracked.filter((event) => event === 'list_impression')).toHaveLength(2);
  });

  it('supports retry after failed submit', async () => {
    let attempts = 0;
    const controller = createSearchScreenController({
      search: async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new Error('network down');
        }
        return {
          data: [createProperty('p-1')],
          page: 1,
          pageSize: 10,
          total: 1,
          totalPages: 1,
        };
      },
    });

    const first = await controller.submit({ location: 'Thu Duc' }, { page: 1, pageSize: 10 });
    expect(first.status).toBe('error');
    expect(first.canRetry).toBe(true);

    const retried = await controller.retry();
    expect(retried.status).toBe('success');
    expect(retried.items).toHaveLength(1);
  });

  it('returns specific empty-state message when filters are active', () => {
    expect(getSearchEmptyStateMessage({ location: 'Q1' })).toContain('nới điều kiện lọc');
    expect(getSearchEmptyStateMessage({})).toContain('chưa có dữ liệu');
  });
});
