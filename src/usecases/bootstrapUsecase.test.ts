import { afterEach, describe, expect, it } from 'vitest';
import { setOnboardingCompleted, resetOnboardingStorageForTesting } from '../services/storage/onboardingStorage';
import { resetTokenStorageForTesting, saveSessionToken, saveToken } from '../services/storage/tokenStorage';
import { resolveInitialRoute } from './bootstrapUsecase';

afterEach(() => {
  resetOnboardingStorageForTesting();
  resetTokenStorageForTesting();
});

describe('bootstrapUsecase', () => {
  it('routes to Home if token exists', async () => {
    await saveToken('token');
    await setOnboardingCompleted(false);
    expect(await resolveInitialRoute()).toBe('Home');
  });

  it('routes first-time user to Onboarding', async () => {
    await setOnboardingCompleted(false);
    expect(await resolveInitialRoute()).toBe('Onboarding');
  });

  it('routes returning user without token to Login', async () => {
    await setOnboardingCompleted(true);
    expect(await resolveInitialRoute()).toBe('Login');
  });

  it('routes to Login if token is expired', async () => {
    await saveSessionToken({
      token: 'expired-token',
      expiresAt: '2000-01-01T00:00:00.000Z',
    });
    await setOnboardingCompleted(true);
    expect(await resolveInitialRoute()).toBe('Login');
  });
});
