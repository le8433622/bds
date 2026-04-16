import { describe, expect, it } from 'vitest';
import {
  ProfileMenu,
  createInitialProfileScreenState,
  createProfileScreenController,
} from './ProfileScreen';

describe('ProfileScreen controller', () => {
  it('has default menu and idle state', () => {
    const state = createInitialProfileScreenState();
    expect(ProfileMenu).toContain('Đăng xuất');
    expect(state.status).toBe('idle');
    expect(state.menu).toHaveLength(5);
  });

  it('updates to ready when selecting non-logout action', async () => {
    const controller = createProfileScreenController({
      logout: async () => undefined,
    });

    controller.ready();
    const state = await controller.perform('open_settings');
    expect(state.status).toBe('ready');
    expect(state.didLogout).toBe(false);
  });

  it('handles successful logout', async () => {
    const controller = createProfileScreenController({
      logout: async () => undefined,
    });

    const state = await controller.perform('logout');
    expect(state.status).toBe('ready');
    expect(state.didLogout).toBe(true);
  });

  it('handles logout failure', async () => {
    const controller = createProfileScreenController({
      logout: async () => {
        throw new Error('session revoke failed');
      },
    });

    const state = await controller.perform('logout');
    expect(state.status).toBe('error');
    expect(state.errorMessage).toContain('session revoke failed');
  });
});
