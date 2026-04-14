import { describe, expect, it } from 'vitest';
import { formatPriceVND } from './formatPrice';

describe('formatPriceVND', () => {
  it('formats number to VND currency', () => {
    const result = formatPriceVND(1250000000);
    expect(result).toContain('₫');
    expect(result).toContain('1');
  });
});
