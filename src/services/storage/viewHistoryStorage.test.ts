import { afterEach, describe, expect, it } from 'vitest';
import {
  clearViewedHistoryIds,
  getViewedHistoryIds,
  pushViewedProperty,
  resetViewHistoryStorageForTesting,
} from './viewHistoryStorage';

afterEach(() => {
  resetViewHistoryStorageForTesting();
});

describe('viewHistoryStorage', () => {
  it('pushes and returns history ids', async () => {
    await pushViewedProperty('p-001');
    await pushViewedProperty('p-002');

    expect(await getViewedHistoryIds()).toEqual(['p-002', 'p-001']);
  });

  it('clears history ids', async () => {
    await pushViewedProperty('p-001');
    await clearViewedHistoryIds();

    expect(await getViewedHistoryIds()).toEqual([]);
  });
});
