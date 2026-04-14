import { afterEach, describe, expect, it } from 'vitest';
import {
  isOnboardingCompleted,
  resetOnboardingStorageForTesting,
  setOnboardingCompleted,
} from '../services/storage/onboardingStorage';
import { resetTokenStorageForTesting, saveSessionToken } from '../services/storage/tokenStorage';
import { resolveInitialRoute } from './bootstrapUsecase';

afterEach(() => {
  resetOnboardingStorageForTesting();
  resetTokenStorageForTesting();
});

describe('auth bootstrap flow', () => {
  it('follows Splash -> Onboarding -> Login -> Home progression', async () => {
    expect(await resolveInitialRoute()).toBe('Onboarding');

    await setOnboardingCompleted(true);
    expect(await isOnboardingCompleted()).toBe(true);
    expect(await resolveInitialRoute()).toBe('Login');

    await saveSessionToken({
      token: 'valid-token',
      expiresAt: '2099-01-01T00:00:00.000Z',
    });
    expect(await resolveInitialRoute()).toBe('Home');
  });
});
