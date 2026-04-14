import { describe, expect, it } from 'vitest';
import { validateRegisterForm } from './RegisterScreen';

describe('validateRegisterForm', () => {
  it('returns multiple validation errors', () => {
    const errors = validateRegisterForm({
      fullName: '',
      password: '123',
      confirmPassword: '1234',
      acceptedTerms: false,
    });

    expect(errors).toContain('Họ tên là bắt buộc.');
    expect(errors).toContain('Mật khẩu tối thiểu 6 ký tự.');
    expect(errors).toContain('Xác nhận mật khẩu chưa khớp.');
    expect(errors).toContain('Bạn cần chấp nhận điều khoản.');
  });

  it('passes for valid input', () => {
    const errors = validateRegisterForm({
      fullName: 'Nguyen Van A',
      password: '123456',
      confirmPassword: '123456',
      acceptedTerms: true,
    });

    expect(errors).toEqual([]);
  });
});
