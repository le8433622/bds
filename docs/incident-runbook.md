# HomeFinder MVP Incident Runbook

**Version:** 0.1.0  
**Last updated:** 2026-04-14

## 1. Severity levels
- **Sev-1:** Core flow unavailable (search/detail/save/contact) or major data/security risk.
- **Sev-2:** Degraded performance, high error rate, partial flow failure.
- **Sev-3:** Non-critical issue with workaround.

## 2. On-call rotation
- Primary on-call: Engineering owner of current release.
- Secondary on-call: Product-engineering backup.
- Escalation path: On-call -> Tech lead -> Product lead -> Director (for Sev-1).

## 3. Detection signals
- Crash/error monitoring alerts.
- KPI alert failures (`npm run check:kpi-alerts`).
- Health/readiness failures (`npm run check:backend:readiness`).

## 4. First 15 minutes checklist
1. Confirm severity and blast radius.
2. Check health endpoint and latest deployment.
3. Triage logs by `X-Request-Id`.
4. Decide rollback/no-rollback.
5. Post incident status update in team channel.

## 5. Mitigation patterns
- **API outage:** rollback to previous stable release, switch traffic, disable risky feature flags.
- **Spike in contact abuse:** tighten rate limits and monitor idempotency collisions.
- **Crash spike:** isolate release, revert offending change, hotfix with smoke tests.

## 6. Communication template
- Incident ID
- Start time (UTC)
- Impact summary
- Current mitigation status
- Next update ETA

## 7. Recovery and closeout
1. Verify KPI and error rates return to threshold.
2. Run release readiness checks.
3. Publish postmortem with root cause and preventive actions.
