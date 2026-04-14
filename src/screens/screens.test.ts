import { describe, expect, it } from 'vitest';
import { SplashScreenConfig } from './auth/SplashScreen';
import { OnboardingSlides } from './auth/OnboardingScreen';
import { getForgotPasswordMessage } from './auth/ForgotPasswordScreen';
import { HomeSections } from './home/HomeScreen';
import { ProfileMenu } from './profile/ProfileScreen';
import { buildMapSearchHint } from './search/MapSearchScreen';
import { getPriceGapSummary } from './saved/ComparePropertiesScreen';
import { summarizeInquiries } from './profile/MyInquiriesScreen';
import { MOCK_PROPERTIES } from '../data/mockProperties';

describe('screen helpers', () => {
  it('has splash metadata', () => {
    expect(SplashScreenConfig.name).toBe('Splash');
    expect(SplashScreenConfig.purpose.length).toBeGreaterThan(0);
  });

  it('has onboarding 3 slides', () => {
    expect(OnboardingSlides).toHaveLength(3);
  });

  it('returns forgot-password helper message', () => {
    expect(getForgotPasswordMessage()).toContain('email');
  });

  it('has home sections and profile menu', () => {
    expect(HomeSections.length).toBeGreaterThan(3);
    expect(ProfileMenu).toContain('Đăng xuất');
  });

  it('supports map search hint and compare summary', () => {
    expect(buildMapSearchHint({ centerLat: 10.7769, centerLng: 106.7009, zoom: 12 })).toContain('z12');
    expect(getPriceGapSummary(MOCK_PROPERTIES[0], MOCK_PROPERTIES[1])).toContain('VND');
  });

  it('summarizes inquiry statuses', () => {
    expect(summarizeInquiries(['pending', 'scheduled', 'pending', 'closed']).pending).toBe(2);
  });
});
