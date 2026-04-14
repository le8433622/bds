# Investigation Checklist

## Fast triage
1. Re-state failure contract in one line.
2. Confirm environment and branch.
3. Reproduce once with minimal command.
4. Capture raw error and stack trace.

## Isolation
1. Determine first failing boundary (input/domain/integration/runtime).
2. Compare known-good path against failing path.
3. Remove non-essential moving parts.

## Hypothesis discipline
1. List top 3 hypotheses.
2. Run one experiment per hypothesis.
3. Keep evidence notes after each run.

## Fix discipline
1. Apply smallest safe patch.
2. Add/adjust focused regression test.
3. Run targeted tests, then full verification.

## Handoff
1. Root cause.
2. What changed.
3. Proof of fix.
4. Residual risk and next hardening.

## Continuous cycle
1. Run `bash scripts/debug_iteration_loop.sh --loops 3`.
2. If all green, raise one pressure variable for next cycle.
3. If any red, fix only the first failing command path.
4. Keep loop reports so progress can be audited by timestamp.
