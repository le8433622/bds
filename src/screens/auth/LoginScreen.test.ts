import { describe, expect, it } from 'vitest';
import { getLoginFailureMessage, validateLoginForm } from './LoginScreen';

describe('validateLoginForm', () => {
  it('returns errors for invalid input', () => {
    const errors = validateLoginForm('bad-email', '');
    expect(errors).toContain('Email không đúng định dạng.');
    expect(errors).toContain('Mật khẩu không được để trống.');
  });

  it('returns empty array for valid input', () => {
    const errors = validateLoginForm('hello@example.com', '123456');
    expect(errors).toEqual([]);
  });

  it('returns standardized login failure messages', () => {
    expect(getLoginFailureMessage('INVALID_CREDENTIALS')).toContain('không đúng');
    expect(getLoginFailureMessage('TOKEN_EXPIRED')).toContain('hết hạn');
    expect(getLoginFailureMessage('NETWORK_ERROR')).toContain('kết nối');
  });
});
