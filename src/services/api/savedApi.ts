import type { Property } from '../../types/models';
import type { SearchFilters } from '../../types/search';
import { getProperties } from './propertyApi';
import { addSaved, getSavedProperties, removeSaved, toggleSaved } from '../../store/savedStore';

let savedIds: string[] = [];

export async function getSavedIds(): Promise<string[]> {
  return [...savedIds];
}

export async function toggleSavedProperty(propertyId: string): Promise<string[]> {
  savedIds = toggleSaved(savedIds, propertyId);
  return [...savedIds];
}

export async function addSavedProperty(propertyId: string): Promise<string[]> {
  savedIds = addSaved(savedIds, propertyId);
  return [...savedIds];
}

export async function removeSavedProperty(propertyId: string): Promise<string[]> {
  savedIds = removeSaved(savedIds, propertyId);
  return [...savedIds];
}

export async function getSavedPropertyList(filters: SearchFilters = {}): Promise<Property[]> {
  const properties = await getProperties(filters);
  return getSavedProperties(properties, savedIds);
}

export function resetSavedStateForTesting(): void {
  savedIds = [];
}
