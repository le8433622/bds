import { MOCK_PROPERTIES } from '../data/mockProperties';
import type { Property } from '../types/models';
import { getViewedHistoryIds } from '../services/storage/viewHistoryStorage';
import { getViewedProperties } from '../store/viewHistoryStore';

function scoreCandidate(candidate: Property, viewed: Property[]): number {
  return viewed.reduce((score, item) => {
    let points = score;
    if (candidate.city === item.city) points += 3;
    if (candidate.propertyType === item.propertyType) points += 2;
    const areaDiff = Math.abs(candidate.area - item.area);
    if (areaDiff <= 20) points += 1;
    return points;
  }, 0);
}

export async function getRecommendedProperties(limit = 5): Promise<Property[]> {
  const historyIds = await getViewedHistoryIds();
  if (historyIds.length === 0) return [];

  const viewed = getViewedProperties(MOCK_PROPERTIES, historyIds);
  const viewedSet = new Set(viewed.map((item) => item.id));

  const scored = MOCK_PROPERTIES.filter((item) => !viewedSet.has(item.id)).map((item) => ({
    item,
    score: scoreCandidate(item, viewed),
  }));

  return scored
    .sort((a, b) => b.score - a.score || b.item.price - a.item.price)
    .slice(0, limit)
    .map((entry) => entry.item);
}
