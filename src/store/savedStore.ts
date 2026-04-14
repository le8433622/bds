import type { Property } from '../types/models';

export function isSaved(savedIds: string[], propertyId: string): boolean {
  return savedIds.includes(propertyId);
}

export function addSaved(savedIds: string[], propertyId: string): string[] {
  return isSaved(savedIds, propertyId) ? [...savedIds] : [...savedIds, propertyId];
}

export function removeSaved(savedIds: string[], propertyId: string): string[] {
  return savedIds.filter((id) => id !== propertyId);
}

export function toggleSaved(savedIds: string[], propertyId: string): string[] {
  return isSaved(savedIds, propertyId)
    ? removeSaved(savedIds, propertyId)
    : addSaved(savedIds, propertyId);
}

export function getSavedProperties(properties: Property[], savedIds: string[]): Property[] {
  return properties.filter((property) => savedIds.includes(property.id));
}
