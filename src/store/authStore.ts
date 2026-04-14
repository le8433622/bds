import type { User } from '../types/models';

export type AuthState = {
  user: User | null;
  token: string | null;
};

export const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  token: null,
};

export function loginSuccess(state: AuthState, payload: { user: User; token: string }): AuthState {
  return {
    ...state,
    user: payload.user,
    token: payload.token,
  };
}

export function logout(state: AuthState): AuthState {
  return {
    ...state,
    user: null,
    token: null,
  };
}

export function isAuthenticated(state: AuthState): boolean {
  return Boolean(state.user && state.token);
}
