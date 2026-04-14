import { describe, expect, it } from 'vitest';
import { nextRouteAfterSplash, requireAuth } from './mvpFlow';

describe('mvpFlow', () => {
  it('guards actions behind auth', () => {
    expect(requireAuth(true)).toEqual({ allowed: true });
    expect(requireAuth(false)).toEqual({ allowed: false, reason: 'AUTH_REQUIRED' });
  });

  it('routes from splash based on first launch and token', () => {
    expect(nextRouteAfterSplash({ hasToken: true, isFirstLaunch: true })).toBe('Home');
    expect(nextRouteAfterSplash({ hasToken: false, isFirstLaunch: true })).toBe('Onboarding');
    expect(nextRouteAfterSplash({ hasToken: false, isFirstLaunch: false })).toBe('Login');
  });
});
