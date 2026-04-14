import { describe, expect, it } from 'vitest';
import { INITIAL_AUTH_STATE, isAuthenticated, loginSuccess, logout } from './authStore';

describe('authStore', () => {
  it('logs in and becomes authenticated', () => {
    const loggedIn = loginSuccess(INITIAL_AUTH_STATE, {
      token: 'token-123',
      user: {
        id: 'u-1',
        fullName: 'Nguyen Van A',
        email: 'a@example.com',
      },
    });

    expect(isAuthenticated(loggedIn)).toBe(true);
  });

  it('logs out and clears auth state', () => {
    const loggedIn = loginSuccess(INITIAL_AUTH_STATE, {
      token: 'token-123',
      user: {
        id: 'u-1',
        fullName: 'Nguyen Van A',
        email: 'a@example.com',
      },
    });

    const loggedOut = logout(loggedIn);
    expect(isAuthenticated(loggedOut)).toBe(false);
    expect(loggedOut.token).toBeNull();
  });
});
