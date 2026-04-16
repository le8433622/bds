export const OnboardingSlides = [
  'Tìm nhà theo nhu cầu',
  'Khám phá theo khu vực nhanh',
  'Lưu tin và liên hệ tức thì',
] as const;

export type OnboardingSlide = {
  id: number;
  title: (typeof OnboardingSlides)[number];
  description: string;
};

export type OnboardingState = {
  status: 'idle' | 'active' | 'completed';
  currentIndex: number;
  slides: OnboardingSlide[];
  canGoBack: boolean;
  canGoNext: boolean;
  isLastSlide: boolean;
};

function toSlides(): OnboardingSlide[] {
  return [
    {
      id: 1,
      title: 'Tìm nhà theo nhu cầu',
      description: 'Lọc theo loại hình, khu vực, mức giá để tìm nhanh hơn.',
    },
    {
      id: 2,
      title: 'Khám phá theo khu vực nhanh',
      description: 'So sánh bất động sản theo quận/huyện để ra quyết định dễ hơn.',
    },
    {
      id: 3,
      title: 'Lưu tin và liên hệ tức thì',
      description: 'Lưu listing yêu thích và gửi yêu cầu liên hệ chỉ với một chạm.',
    },
  ];
}

function buildState(currentIndex: number, status: OnboardingState['status'] = 'active'): OnboardingState {
  const slides = toSlides();
  const maxIndex = slides.length - 1;
  const index = Math.max(0, Math.min(currentIndex, maxIndex));

  return {
    status,
    currentIndex: index,
    slides,
    canGoBack: index > 0,
    canGoNext: index < maxIndex,
    isLastSlide: index === maxIndex,
  };
}

export function createInitialOnboardingState(): OnboardingState {
  return {
    ...buildState(0),
    status: 'idle',
  };
}

export function createOnboardingController(input: {
  completeOnboarding: () => Promise<void>;
}) {
  let state = createInitialOnboardingState();

  return {
    getState(): OnboardingState {
      return {
        ...state,
        slides: [...state.slides],
      };
    },

    start(): OnboardingState {
      state = buildState(0, 'active');
      return this.getState();
    },

    next(): OnboardingState {
      if (state.status === 'completed') {
        return this.getState();
      }

      state = buildState(state.currentIndex + 1, 'active');
      return this.getState();
    },

    back(): OnboardingState {
      if (state.status === 'completed') {
        return this.getState();
      }

      state = buildState(state.currentIndex - 1, 'active');
      return this.getState();
    },

    async skip(): Promise<OnboardingState> {
      await input.completeOnboarding();
      state = buildState(state.currentIndex, 'completed');
      return this.getState();
    },

    async finish(): Promise<OnboardingState> {
      await input.completeOnboarding();
      state = buildState(state.currentIndex, 'completed');
      return this.getState();
    },
  };
}
