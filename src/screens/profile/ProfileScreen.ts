export const ProfileMenu = ['Thông tin cá nhân', 'Lịch sử xem', 'Lịch hẹn', 'Cài đặt', 'Đăng xuất'] as const;

export type ProfileStatus = 'idle' | 'ready' | 'updating' | 'error';

export type ProfileMenuAction =
  | 'open_profile'
  | 'open_view_history'
  | 'open_inquiries'
  | 'open_settings'
  | 'logout';

export type ProfileScreenState = {
  status: ProfileStatus;
  menu: Array<{
    label: (typeof ProfileMenu)[number];
    action: ProfileMenuAction;
  }>;
  errorMessage: string | null;
  didLogout: boolean;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Không thể cập nhật hồ sơ lúc này.';
}

function createMenu(): ProfileScreenState['menu'] {
  return [
    { label: 'Thông tin cá nhân', action: 'open_profile' },
    { label: 'Lịch sử xem', action: 'open_view_history' },
    { label: 'Lịch hẹn', action: 'open_inquiries' },
    { label: 'Cài đặt', action: 'open_settings' },
    { label: 'Đăng xuất', action: 'logout' },
  ];
}

export function createInitialProfileScreenState(): ProfileScreenState {
  return {
    status: 'idle',
    menu: createMenu(),
    errorMessage: null,
    didLogout: false,
  };
}

export function createProfileScreenController(input: {
  logout: () => Promise<void>;
}) {
  let state = createInitialProfileScreenState();

  return {
    getState(): ProfileScreenState {
      return {
        ...state,
        menu: [...state.menu],
      };
    },

    ready(): ProfileScreenState {
      state = {
        ...state,
        status: 'ready',
      };
      return this.getState();
    },

    async perform(action: ProfileMenuAction): Promise<ProfileScreenState> {
      if (action !== 'logout') {
        state = {
          ...state,
          status: 'ready',
          errorMessage: null,
        };
        return this.getState();
      }

      state = {
        ...state,
        status: 'updating',
        errorMessage: null,
      };

      try {
        await input.logout();
        state = {
          ...state,
          status: 'ready',
          didLogout: true,
        };

        return this.getState();
      } catch (error) {
        state = {
          ...state,
          status: 'error',
          errorMessage: toErrorMessage(error),
          didLogout: false,
        };

        return this.getState();
      }
    },
  };
}
