---
name: human-system-debug
description: "Debug software and system incidents with a human-like investigative workflow: triage symptoms, reproduce deterministically, isolate fault boundaries, rank hypotheses by evidence, implement the smallest safe fix, verify with regression checks, and run continuous hardening loops by progress. Use when users ask to debug errors, flaky tests, CI failures, runtime crashes, API regressions, performance slowdowns, production incidents, or any unclear root cause situation (including requests phrased as 'debug like a real engineer' or 'dieu tra su co he thong')."
---

# Human System Debug

## Overview
Use a strict evidence-first loop. Move from symptom -> reproduction -> isolation -> hypothesis -> fix -> verification. Prefer small, reversible changes and show concrete proof at each step.
For long-running stabilization requests, switch to continuous progress mode (debug loop by cycles) so each pass either removes a real failure or increases confidence.

## Workflow

### 1) Define the failure contract
- Write the exact failure in one sentence: what is wrong, where it happens, and what should happen instead.
- Record scope: affected module, users, environments, and first-seen time.
- Avoid fixing before a reproducible signal exists.

### 2) Capture baseline evidence
- Run `scripts/collect_debug_snapshot.sh` to collect environment and repo state.
- Capture failing command output verbatim (or key lines only if very large).
- Record current branch, dirty files, and last successful commit.

### 3) Reproduce deterministically
- Create the fastest reproducible command or test.
- Minimize the surface area (single test, single endpoint, single file) before broad test runs.
- If failure is flaky, run N times and track pass/fail ratio.

### 4) Isolate the fault boundary
- Identify whether the fault sits in:
  - input/data layer
  - domain/usecase logic
  - integration boundary (API, storage, auth, external service)
  - infrastructure/runtime (env, dependency, CI)
- Shrink search space by binary elimination:
  - compare known-good vs known-bad paths
  - mock external dependencies to localize behavior
  - disable unrelated moving parts

### 5) Run hypothesis loop
- Generate 2-3 ranked hypotheses.
- For each hypothesis:
  - define the expected observable
  - run one targeted experiment
  - keep or discard hypothesis based on evidence
- Prefer proving one hypothesis wrong quickly over adding broad speculative changes.

### 6) Implement minimal safe fix
- Change only the smallest set of files needed.
- Avoid opportunistic refactors during incident fixing.
- Add or update tests that fail before and pass after the fix.

### 7) Verify and guard against regression
- Run targeted tests first, then full quality gate.
- Verify side effects in adjacent flows.
- If applicable, validate alerting/KPI behavior did not regress.

### 8) Close with operator-grade handoff
- Report:
  - root cause
  - exact fix
  - verification evidence
  - residual risks
  - follow-up hardening tasks
- Keep the summary short and actionable.

## Continuous Progress Mode
Use this mode when the ask is "run continuously, fix, and keep improving."

### Cycle runner
- Run `bash scripts/debug_iteration_loop.sh --loops 3`.
- The runner executes `npm start`, `npm run app:smoke`, `npm run verify`, `npm run check:readiness:100`, and `npm run check:progress:gate` per loop.
- Each command writes per-loop logs and a markdown report under `debug-snapshots/continuous/`.

### Progress policy
- If a loop fails:
  - isolate the first failing command
  - implement the smallest safe fix
  - rerun that command
  - rerun the full loop
- If all loops pass:
  - increase stress gradually (for example from `--loops 3` to `--loops 5`)
  - change only one hardening variable per cycle
  - keep a short note of what changed and why
- Never batch unrelated refactors into an incident fix cycle.

## Decision Rules
- Stop and ask for approval before any destructive operation.
- Prefer deterministic scripts over repeated ad-hoc shell fragments.
- Treat missing evidence as uncertainty, not as confirmation.
- If two hypotheses remain plausible, run the cheapest discriminating experiment next.

## Common Failure Modes
Read `references/failure-patterns.md` when the issue matches known signatures (timeout, auth drift, stale cache, race condition, retry storm, config skew).
Read `references/continuous-improvement.md` when running repeated hardening cycles and deciding how to raise test pressure safely.

## Communication Template
Use this compact format in updates:
- Symptom: ...
- Reproduction: ...
- Scope: ...
- Hypothesis (current): ...
- Next experiment: ...
- Confidence: low/medium/high

## Resources
### scripts/
- `scripts/collect_debug_snapshot.sh`: Collect environment and repo debug baseline.
- `scripts/debug_iteration_loop.sh`: Run repeated debug-verify cycles with structured logs and a report.

### references/
- `references/failure-patterns.md`: Signature-based troubleshooting heuristics.
- `references/investigation-checklist.md`: Fast checklist for incident-style debugging.
- `references/continuous-improvement.md`: Rules to raise hardening pressure by progress without creating noisy loops.
