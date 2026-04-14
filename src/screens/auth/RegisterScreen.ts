import { hasMinLength, isNonEmpty, passwordsMatch } from '../../utils/validators';

export function validateRegisterForm(input: {
  fullName: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}): string[] {
  const errors: string[] = [];

  if (!isNonEmpty(input.fullName)) {
    errors.push('Họ tên là bắt buộc.');
  }

  if (!hasMinLength(input.password, 6)) {
    errors.push('Mật khẩu tối thiểu 6 ký tự.');
  }

  if (!passwordsMatch(input.password, input.confirmPassword)) {
    errors.push('Xác nhận mật khẩu chưa khớp.');
  }

  if (!input.acceptedTerms) {
    errors.push('Bạn cần chấp nhận điều khoản.');
  }

  return errors;
}
