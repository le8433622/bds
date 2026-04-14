import { describe, expect, it } from 'vitest';
import { MOCK_PROPERTIES } from '../data/mockProperties';
import { addViewedProperty, clearViewHistory, getViewedProperties } from './viewHistoryStore';

describe('viewHistoryStore', () => {
  it('adds viewed property to the front and deduplicates', () => {
    const history = addViewedProperty(['p-001', 'p-002'], 'p-002');
    expect(history[0]).toBe('p-002');
    expect(history).toEqual(['p-002', 'p-001']);
  });

  it('clears history', () => {
    expect(clearViewHistory()).toEqual([]);
  });

  it('maps history ids to property list order', () => {
    const viewed = getViewedProperties(MOCK_PROPERTIES, ['p-003', 'p-001']);
    expect(viewed[0]?.id).toBe('p-003');
    expect(viewed[1]?.id).toBe('p-001');
  });
});
