import { isNonEmpty, isValidEmail } from '../../utils/validators';

export type LoginFailureReason =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'TOKEN_EXPIRED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

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

export function getLoginFailureMessage(reason: LoginFailureReason): string {
  switch (reason) {
    case 'INVALID_CREDENTIALS':
      return 'Email hoặc mật khẩu không đúng.';
    case 'ACCOUNT_LOCKED':
      return 'Tài khoản tạm khóa. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.';
    case 'TOKEN_EXPIRED':
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    case 'NETWORK_ERROR':
      return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.';
    case 'UNKNOWN':
    default:
      return 'Đăng nhập thất bại. Vui lòng thử lại.';
  }
}
