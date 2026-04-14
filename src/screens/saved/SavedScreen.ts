import type { Property } from '../../types/models';

export function removeSavedProperty(list: Property[], propertyId: string): Property[] {
  return list.filter((property) => property.id !== propertyId);
}
