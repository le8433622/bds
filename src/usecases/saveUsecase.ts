import { requireAuth } from '../store/mvpFlow';
import { toggleSavedProperty } from '../services/api/savedApi';

export type SaveResult =
  | { ok: true; savedIds: string[] }
  | { ok: false; reason: 'AUTH_REQUIRED' };

export async function saveProperty(input: { isLoggedIn: boolean; propertyId: string }): Promise<SaveResult> {
  const guard = requireAuth(input.isLoggedIn);
  if (!guard.allowed) {
    return { ok: false, reason: guard.reason };
  }

  const savedIds = await toggleSavedProperty(input.propertyId);
  return { ok: true, savedIds };
}
