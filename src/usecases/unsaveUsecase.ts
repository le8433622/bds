import { requireAuth } from '../store/mvpFlow';
import { removeSavedProperty } from '../services/api/savedApi';

export type UnsaveResult =
  | { ok: true; savedIds: string[] }
  | { ok: false; reason: 'AUTH_REQUIRED' };

const unsaveInFlight = new Map<string, Promise<UnsaveResult>>();

export async function unsaveProperty(input: {
  isLoggedIn: boolean;
  propertyId: string;
}): Promise<UnsaveResult> {
  const dedupeKey = `${input.isLoggedIn ? 'auth' : 'guest'}:${input.propertyId}`;
  const existing = unsaveInFlight.get(dedupeKey);
  if (existing) {
    return existing;
  }

  const currentAttempt = (async (): Promise<UnsaveResult> => {
    const guard = requireAuth(input.isLoggedIn);
    if (!guard.allowed) {
      return { ok: false, reason: guard.reason };
    }

    const savedIds = await removeSavedProperty(input.propertyId);
    return { ok: true, savedIds };
  })();

  unsaveInFlight.set(dedupeKey, currentAttempt);

  try {
    return await currentAttempt;
  } finally {
    unsaveInFlight.delete(dedupeKey);
  }
}

export function resetUnsaveUsecaseInFlightForTesting(): void {
  unsaveInFlight.clear();
}
