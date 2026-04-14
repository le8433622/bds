import type { Property } from '../../types/models';

export function sortByNewest(properties: Property[]): Property[] {
  return [...properties].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
