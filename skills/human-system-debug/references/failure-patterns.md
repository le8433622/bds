# Failure Patterns

## Timeout and retry storms
Signal:
- Requests time out in bursts.
- Latency spikes after retries.

Checks:
- Verify timeout and retry settings.
- Confirm retry only on transient failures.
- Validate backoff behavior.

## Auth/session drift
Signal:
- Intermittent 401/403.
- Works after re-login only.

Checks:
- Verify token expiry logic.
- Confirm clock/timezone assumptions.
- Validate session refresh path.

## Config skew across envs
Signal:
- Works locally, fails in CI/staging.

Checks:
- Compare critical env keys.
- Confirm base URLs, feature flags, and credentials.
- Reproduce using staging-like env.

## Data shape mismatch
Signal:
- Runtime parse/type errors.

Checks:
- Inspect real payload sample.
- Validate schema assumptions.
- Add defensive mapping and test.

## Race condition or flaky test
Signal:
- Non-deterministic pass/fail.

Checks:
- Remove shared mutable state.
- Add explicit synchronization.
- Run repeated test loop to confirm stability.
