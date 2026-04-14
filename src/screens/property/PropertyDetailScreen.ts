import type { Property } from '../../types/models';
import { formatPriceVND } from '../../utils/formatPrice';

export function getPropertySummary(property: Property): string {
  return `${property.title} - ${formatPriceVND(property.price)} - ${property.location}`;
}
