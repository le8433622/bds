import { describe, expect, it } from 'vitest';
import { validateLoginForm } from './LoginScreen';

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
});
