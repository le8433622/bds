import { afterEach, describe, expect, it } from 'vitest';
import { isOnboardingCompleted, resetOnboardingStorageForTesting, setOnboardingCompleted } from './onboardingStorage';

afterEach(() => {
  resetOnboardingStorageForTesting();
});

describe('onboardingStorage', () => {
  it('defaults to false', async () => {
    expect(await isOnboardingCompleted()).toBe(false);
  });

  it('can be marked completed', async () => {
    await setOnboardingCompleted(true);
    expect(await isOnboardingCompleted()).toBe(true);
  });
});
