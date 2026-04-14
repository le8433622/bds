export type ActionGuardResult =
  | { allowed: true }
  | { allowed: false; reason: 'AUTH_REQUIRED' };

export function requireAuth(isLoggedIn: boolean): ActionGuardResult {
  return isLoggedIn ? { allowed: true } : { allowed: false, reason: 'AUTH_REQUIRED' };
}

export function nextRouteAfterSplash(input: {
  hasToken: boolean;
  isFirstLaunch: boolean;
}): 'Home' | 'Onboarding' | 'Login' {
  if (input.hasToken) return 'Home';
  if (input.isFirstLaunch) return 'Onboarding';
  return 'Login';
}
