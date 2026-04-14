import type { Property } from '../../types/models';
import type { SearchFilters } from '../../screens/search/SearchScreen';
import { getProperties } from './propertyApi';
import { getSavedProperties, toggleSaved } from '../../store/savedStore';

let savedIds: string[] = [];

export async function getSavedIds(): Promise<string[]> {
  return [...savedIds];
}

export async function toggleSavedProperty(propertyId: string): Promise<string[]> {
  savedIds = toggleSaved(savedIds, propertyId);
  return [...savedIds];
}

export async function getSavedPropertyList(filters: SearchFilters = {}): Promise<Property[]> {
  const properties = await getProperties(filters);
  return getSavedProperties(properties, savedIds);
}

export function resetSavedStateForTesting(): void {
  savedIds = [];
}
