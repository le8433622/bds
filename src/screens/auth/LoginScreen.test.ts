import { describe, expect, it } from 'vitest';
import {
  createLoginScreenController,
  getLoginFailureMessage,
  validateLoginForm,
} from './LoginScreen';

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

  it('submits login successfully with controller', async () => {
    const controller = createLoginScreenController({
      login: async () => undefined,
    });

    controller.updateForm('hello@example.com', '123456');
    const state = await controller.submit();
    expect(state.status).toBe('success');
  });

  it('maps login failure reason to user message', async () => {
    const controller = createLoginScreenController({
      login: async () => {
        throw { reason: 'ACCOUNT_LOCKED' };
      },
    });

    controller.updateForm('hello@example.com', '123456');
    const state = await controller.submit();
    expect(state.status).toBe('error');
    expect(state.errorMessage).toContain('tạm khóa');
  });
});
