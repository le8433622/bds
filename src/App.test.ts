import { describe, expect, it } from 'vitest';
import App, { APP_FLOW, APP_RUNTIME, createAppShellModel } from './App';

describe('App entrypoint', () => {
  it('returns app shell model output', () => {
    const appShell = App();
    expect(appShell.runtimeMode).toBe(APP_RUNTIME.mode);
    expect(appShell.flow).toBe(APP_FLOW);
    expect(appShell.ui).toBeDefined();
  });

  it('exposes APP_FLOW contract', () => {
    expect(APP_FLOW).toHaveProperty('splash');
    expect(APP_FLOW).toHaveProperty('auth');
  });

  it('exposes APP_RUNTIME contract', () => {
    expect(APP_RUNTIME).toHaveProperty('mode');
    expect(APP_RUNTIME).toHaveProperty('usecases');
  });

  it('createAppShellModel allows injecting runtime', () => {
    const shell = createAppShellModel({
      mode: 'backend',
      usecases: {
        search: async () => ({ ok: true }),
        propertyDetail: async () => ({ ok: true }),
        savedList: async () => ({ ok: true }),
        save: async () => ({ ok: true }),
        unsave: async () => ({ ok: true }),
        contact: async () => ({ ok: true }),
        bookVisit: async () => ({ ok: true }),
        healthCheck: async () => ({ ok: true }),
      },
    });

    expect(shell.runtimeMode).toBe('backend');
    expect(shell.flow).toBe(APP_FLOW);
  });
});
