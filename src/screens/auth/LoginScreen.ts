import { isNonEmpty, isValidEmail } from '../../utils/validators';

export function validateLoginForm(email: string, password: string): string[] {
  const errors: string[] = [];

  if (!isValidEmail(email)) {
    errors.push('Email không đúng định dạng.');
  }

  if (!isNonEmpty(password)) {
    errors.push('Mật khẩu không được để trống.');
  }

  return errors;
}
