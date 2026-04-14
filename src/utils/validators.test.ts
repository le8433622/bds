import { describe, expect, it } from 'vitest';
import { hasMinLength, isNonEmpty, isValidEmail, passwordsMatch } from './validators';

describe('validators', () => {
  it('validates email format', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
  });

  it('checks non-empty strings', () => {
    expect(isNonEmpty('abc')).toBe(true);
    expect(isNonEmpty('   ')).toBe(false);
  });

  it('checks minimum length', () => {
    expect(hasMinLength('123456', 6)).toBe(true);
    expect(hasMinLength('12345', 6)).toBe(false);
  });

  it('matches passwords', () => {
    expect(passwordsMatch('secret', 'secret')).toBe(true);
    expect(passwordsMatch('secret', 'secret1')).toBe(false);
  });
});
