# Continuous Improvement Rules

## Objective
Run repeated debug cycles that either:
- remove a confirmed failure, or
- increase confidence through stronger verification pressure.

## Raise pressure safely
Change only one variable per cycle:
1. Number of loops (`--loops`).
2. Environment realism (mock -> staging-like).
3. Verification breadth (targeted tests -> full gate).

Do not increase multiple variables at once. It makes regressions harder to isolate.

## Pass criteria per cycle
1. All commands in the loop report PASS.
2. No new flaky signal compared with previous cycle.
3. The cycle report is saved and linked in handoff notes.

## Fail criteria per cycle
1. First failing command is clearly identified.
2. Root-cause hypothesis is stated before code changes.
3. Smallest safe fix is applied.
4. Failed command reruns green before restarting full loop.

## Anti-patterns
- Broad refactor while incident cause is still unknown.
- Skipping reproducibility and jumping to random patches.
- Declaring "stable" without repeated green loops.
- Increasing loop count and environment complexity together.
