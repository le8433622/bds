import { hasMinLength, isNonEmpty, passwordsMatch } from '../../utils/validators';

export type RegisterState = {
  status: 'idle' | 'submitting' | 'success' | 'error';
  fullName: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
  validationErrors: string[];
  errorMessage: string | null;
};

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

export function createInitialRegisterState(): RegisterState {
  return {
    status: 'idle',
    fullName: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
    validationErrors: [],
    errorMessage: null,
  };
}

export function createRegisterScreenController(input: {
  register: (payload: {
    fullName: string;
    password: string;
    confirmPassword: string;
    acceptedTerms: boolean;
  }) => Promise<void>;
}) {
  let state = createInitialRegisterState();

  return {
    getState(): RegisterState {
      return {
        ...state,
        validationErrors: [...state.validationErrors],
      };
    },

    updateForm(form: {
      fullName: string;
      password: string;
      confirmPassword: string;
      acceptedTerms: boolean;
    }): RegisterState {
      state = {
        ...state,
        ...form,
        validationErrors: [],
        errorMessage: null,
      };

      return this.getState();
    },

    async submit(): Promise<RegisterState> {
      const validationErrors = validateRegisterForm({
        fullName: state.fullName,
        password: state.password,
        confirmPassword: state.confirmPassword,
        acceptedTerms: state.acceptedTerms,
      });

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
        await input.register({
          fullName: state.fullName,
          password: state.password,
          confirmPassword: state.confirmPassword,
          acceptedTerms: state.acceptedTerms,
        });

        state = {
          ...state,
          status: 'success',
        };

        return this.getState();
      } catch (error) {
        state = {
          ...state,
          status: 'error',
          errorMessage: error instanceof Error && error.message ? error.message : 'Đăng ký thất bại.',
        };

        return this.getState();
      }
    },
  };
}
