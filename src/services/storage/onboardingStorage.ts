let completed = false;

export async function setOnboardingCompleted(value: boolean): Promise<void> {
  completed = value;
}

export async function isOnboardingCompleted(): Promise<boolean> {
  return completed;
}

export function resetOnboardingStorageForTesting(): void {
  completed = false;
}
