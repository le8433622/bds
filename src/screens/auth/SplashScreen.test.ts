import { describe, expect, it } from 'vitest';
import { createSplashScreenController } from './SplashScreen';

describe('SplashScreen controller', () => {
  it('routes to onboarding when no token and onboarding incomplete', async () => {
    const controller = createSplashScreenController({
      hasValidToken: async () => false,
      hasCompletedOnboarding: async () => false,
    });

    const state = await controller.resolveInitialRoute();
    expect(state.status).toBe('resolved');
    expect(state.route).toBe('Onboarding');
  });

  it('routes to home when token exists', async () => {
    const controller = createSplashScreenController({
      hasValidToken: async () => true,
      hasCompletedOnboarding: async () => true,
    });

    const state = await controller.resolveInitialRoute();
    expect(state.route).toBe('Home');
  });
});
