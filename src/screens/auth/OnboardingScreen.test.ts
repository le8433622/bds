import { describe, expect, it } from 'vitest';
import { createOnboardingController } from './OnboardingScreen';

describe('Onboarding controller', () => {
  it('navigates through slides and marks completion', async () => {
    let completed = false;
    const controller = createOnboardingController({
      completeOnboarding: async () => {
        completed = true;
      },
    });

    let state = controller.start();
    expect(state.currentIndex).toBe(0);
    expect(state.canGoNext).toBe(true);

    state = controller.next();
    state = controller.next();
    expect(state.isLastSlide).toBe(true);

    state = await controller.finish();
    expect(state.status).toBe('completed');
    expect(completed).toBe(true);
  });
});
