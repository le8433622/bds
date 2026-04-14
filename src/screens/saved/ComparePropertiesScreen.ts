import type { Property } from '../../types/models';

export function getPriceGapSummary(base: Property, target: Property): string {
  const gap = target.price - base.price;
  const trend = gap >= 0 ? 'cao hơn' : 'thấp hơn';
  return `${Math.abs(gap).toLocaleString('vi-VN')} VND ${trend}`;
}
