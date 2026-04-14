import { afterEach, describe, expect, it } from 'vitest';
import { pushViewedProperty, resetViewHistoryStorageForTesting } from '../services/storage/viewHistoryStorage';
import { getRecommendedProperties } from './recommendationUsecase';

afterEach(() => {
  resetViewHistoryStorageForTesting();
});

describe('recommendationUsecase', () => {
  it('returns empty when no history', async () => {
    const recommendations = await getRecommendedProperties();
    expect(recommendations).toEqual([]);
  });

  it('returns recommendations based on viewed history', async () => {
    await pushViewedProperty('p-001');
    const recommendations = await getRecommendedProperties(2);

    expect(recommendations.length).toBeLessThanOrEqual(2);
    expect(recommendations.some((item) => item.id === 'p-001')).toBe(false);
  });
});
