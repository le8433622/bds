const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 3;

type RateLimitState = Map<string, number[]>;

const attemptsByKey: RateLimitState = new Map();

function sanitizePositiveInt(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.floor(value);
}

function loadWindowMs(): number {
  const env = (globalThis as { process?: { env?: Record<string, string> } }).process?.env ?? {};
  return sanitizePositiveInt(Number(env.CONTACT_RATE_LIMIT_WINDOW_MS), DEFAULT_WINDOW_MS);
}

function loadMaxRequests(): number {
  const env = (globalThis as { process?: { env?: Record<string, string> } }).process?.env ?? {};
  return sanitizePositiveInt(Number(env.CONTACT_RATE_LIMIT_MAX_REQUESTS), DEFAULT_MAX_REQUESTS);
}

export function consumeContactRateLimit(
  key: string,
  input?: { nowMs?: number; windowMs?: number; maxRequests?: number },
): { allowed: true } | { allowed: false; reason: 'RATE_LIMIT_EXCEEDED' } {
  const nowMs = input?.nowMs ?? Date.now();
  const windowMs = input?.windowMs ?? loadWindowMs();
  const maxRequests = input?.maxRequests ?? loadMaxRequests();
  const cutoff = nowMs - windowMs;

  const previous = attemptsByKey.get(key) ?? [];
  const withinWindow = previous.filter((timestamp) => timestamp > cutoff);

  if (withinWindow.length >= maxRequests) {
    attemptsByKey.set(key, withinWindow);
    return { allowed: false, reason: 'RATE_LIMIT_EXCEEDED' };
  }

  attemptsByKey.set(key, [...withinWindow, nowMs]);
  return { allowed: true };
}

export function resetContactRateLimitForTesting(): void {
  attemptsByKey.clear();
}
