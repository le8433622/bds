import { isNonEmpty, isValidEmail } from '../../utils/validators';

export type LoginFailureReason =
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_LOCKED'
  | 'TOKEN_EXPIRED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

export type LoginState = {
  status: 'idle' | 'submitting' | 'success' | 'error';
  email: string;
  password: string;
  validationErrors: string[];
  errorMessage: string | null;
};

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

function toLoginFailureReason(error: unknown): LoginFailureReason {
  if (error && typeof error === 'object' && 'reason' in error) {
    const reason = (error as { reason?: unknown }).reason;
    if (reason === 'INVALID_CREDENTIALS' || reason === 'ACCOUNT_LOCKED' || reason === 'TOKEN_EXPIRED' || reason === 'NETWORK_ERROR') {
      return reason;
    }
  }

  return 'UNKNOWN';
}

export function createInitialLoginState(): LoginState {
  return {
    status: 'idle',
    email: '',
    password: '',
    validationErrors: [],
    errorMessage: null,
  };
}

export function createLoginScreenController(input: {
  login: (email: string, password: string) => Promise<void>;
}) {
  let state = createInitialLoginState();

  return {
    getState(): LoginState {
      return {
        ...state,
        validationErrors: [...state.validationErrors],
      };
    },

    updateForm(email: string, password: string): LoginState {
      state = {
        ...state,
        email,
        password,
        validationErrors: [],
        errorMessage: null,
      };

      return this.getState();
    },

    async submit(): Promise<LoginState> {
      const validationErrors = validateLoginForm(state.email, state.password);
      if (validationErrors.length > 0) {
        state = {
          ...state,
          status: 'error',
          validationErrors,
        };

        return this.getState();
      }

      state = {
        ...state,
        status: 'submitting',
        validationErrors: [],
        errorMessage: null,
      };

      try {
        await input.login(state.email, state.password);
        state = {
          ...state,
          status: 'success',
        };

        return this.getState();
      } catch (error) {
        state = {
          ...state,
          status: 'error',
          errorMessage: getLoginFailureMessage(toLoginFailureReason(error)),
        };

        return this.getState();
      }
    },
  };
}
