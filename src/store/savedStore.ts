import type { Property } from '../types/models';

export function isSaved(savedIds: string[], propertyId: string): boolean {
  return savedIds.includes(propertyId);
}

export function toggleSaved(savedIds: string[], propertyId: string): string[] {
  return isSaved(savedIds, propertyId)
    ? savedIds.filter((id) => id !== propertyId)
    : [...savedIds, propertyId];
}

export function getSavedProperties(properties: Property[], savedIds: string[]): Property[] {
  return properties.filter((property) => savedIds.includes(property.id));
}
