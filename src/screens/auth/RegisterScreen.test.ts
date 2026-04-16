import { describe, expect, it } from 'vitest';
import {
  createRegisterScreenController,
  validateRegisterForm,
} from './RegisterScreen';

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

  it('submits register with controller', async () => {
    const controller = createRegisterScreenController({
      register: async () => undefined,
    });

    controller.updateForm({
      fullName: 'Nguyen Van A',
      password: '123456',
      confirmPassword: '123456',
      acceptedTerms: true,
    });

    const state = await controller.submit();
    expect(state.status).toBe('success');
  });

  it('returns error when register API fails', async () => {
    const controller = createRegisterScreenController({
      register: async () => {
        throw new Error('email existed');
      },
    });

    controller.updateForm({
      fullName: 'Nguyen Van A',
      password: '123456',
      confirmPassword: '123456',
      acceptedTerms: true,
    });

    const state = await controller.submit();
    expect(state.status).toBe('error');
    expect(state.errorMessage).toContain('email existed');
  });
});
