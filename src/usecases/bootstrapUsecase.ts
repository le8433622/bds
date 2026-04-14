import { nextRouteAfterSplash } from '../store/mvpFlow';
import { isOnboardingCompleted } from '../services/storage/onboardingStorage';
import { hasValidToken } from '../services/storage/tokenStorage';

export async function resolveInitialRoute(): Promise<'Home' | 'Onboarding' | 'Login'> {
  const [tokenValid, onboardingDone] = await Promise.all([hasValidToken(), isOnboardingCompleted()]);

  return nextRouteAfterSplash({
    hasToken: tokenValid,
    isFirstLaunch: !onboardingDone,
  });
}
