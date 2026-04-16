export const SplashScreenConfig = {
  name: 'Splash',
  purpose: 'Hiển thị logo, loading, kiểm tra token và điều hướng.',
};

export type SplashRouteTarget = 'Onboarding' | 'Login' | 'Home';

export type SplashScreenState = {
  status: 'idle' | 'checking' | 'resolved' | 'error';
  route: SplashRouteTarget | null;
  errorMessage: string | null;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Không thể khởi tạo ứng dụng.';
}

export function createInitialSplashState(): SplashScreenState {
  return {
    status: 'idle',
    route: null,
    errorMessage: null,
  };
}

export function createSplashScreenController(input: {
  hasValidToken: () => Promise<boolean>;
  hasCompletedOnboarding: () => Promise<boolean>;
}) {
  let state = createInitialSplashState();

  return {
    getState(): SplashScreenState {
      return { ...state };
    },

    async resolveInitialRoute(): Promise<SplashScreenState> {
      state = {
        ...state,
        status: 'checking',
        errorMessage: null,
      };

      try {
        const [hasToken, hasOnboarding] = await Promise.all([
          input.hasValidToken(),
          input.hasCompletedOnboarding(),
        ]);

        const route: SplashRouteTarget = hasToken ? 'Home' : hasOnboarding ? 'Login' : 'Onboarding';

        state = {
          ...state,
          status: 'resolved',
          route,
        };

        return this.getState();
      } catch (error) {
        state = {
          ...state,
          status: 'error',
          errorMessage: toErrorMessage(error),
        };

        return this.getState();
      }
    },

    retry(): Promise<SplashScreenState> {
      return this.resolveInitialRoute();
    },
  };
}
