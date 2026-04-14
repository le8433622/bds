import { describe, expect, it } from 'vitest';
import { isValidPhone, validateBookVisitRequest, validateContactRequest } from './contactValidators';

describe('contactValidators', () => {
  it('validates phone', () => {
    expect(isValidPhone('0909123456')).toBe(true);
    expect(isValidPhone('bad-phone')).toBe(false);
  });

  it('validates contact payload', () => {
    const errors = validateContactRequest({
      propertyId: '',
      fullName: '',
      phone: 'x',
      preferredMethod: 'call',
    });

    expect(errors).toContain('Thiếu mã bất động sản.');
    expect(errors).toContain('Họ tên là bắt buộc.');
    expect(errors).toContain('Số điện thoại không hợp lệ.');
  });

  it('validates book visit payload', () => {
    const errors = validateBookVisitRequest({
      propertyId: 'p-001',
      fullName: 'A',
      phone: '0909123456',
      visitDate: 'not-a-date',
    });

    expect(errors).toContain('Ngày xem nhà không đúng định dạng.');
  });
});
