import { requireAuth } from '../store/mvpFlow';
import { addSavedProperty } from '../services/api/savedApi';

export type SaveResult =
  | { ok: true; savedIds: string[] }
  | { ok: false; reason: 'AUTH_REQUIRED' };

const saveInFlight = new Map<string, Promise<SaveResult>>();

export async function saveProperty(input: { isLoggedIn: boolean; propertyId: string }): Promise<SaveResult> {
  const dedupeKey = `${input.isLoggedIn ? 'auth' : 'guest'}:${input.propertyId}`;
  const existing = saveInFlight.get(dedupeKey);
  if (existing) {
    return existing;
  }

  const currentAttempt = (async (): Promise<SaveResult> => {
    const guard = requireAuth(input.isLoggedIn);
    if (!guard.allowed) {
      return { ok: false, reason: guard.reason };
    }

    const savedIds = await addSavedProperty(input.propertyId);
    return { ok: true, savedIds };
  })();

  saveInFlight.set(dedupeKey, currentAttempt);

  try {
    return await currentAttempt;
  } finally {
    saveInFlight.delete(dedupeKey);
  }
}

export function resetSaveUsecaseInFlightForTesting(): void {
  saveInFlight.clear();
}
