import type { Property } from '../types/models';

const DEFAULT_LIMIT = 20;

export function addViewedProperty(history: string[], propertyId: string, limit = DEFAULT_LIMIT): string[] {
  const next = [propertyId, ...history.filter((id) => id !== propertyId)];
  return next.slice(0, limit);
}

export function clearViewHistory(): string[] {
  return [];
}

export function getViewedProperties(properties: Property[], historyIds: string[]): Property[] {
  const map = new Map(properties.map((property) => [property.id, property]));
  return historyIds.map((id) => map.get(id)).filter((item): item is Property => Boolean(item));
}
