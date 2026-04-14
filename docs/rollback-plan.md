# Rollback Plan (MVP)

**Version:** 1.0.0  
**Last updated:** 2026-04-14

## Trigger conditions
- Sev-1 outage in Search/Detail/Save/Contact core flow.
- Error budget burn exceeds threshold.
- Security incident requiring immediate containment.

## Rollback steps
1. Identify last known stable commit tag.
2. Redeploy previous stable artifact.
3. Run `npm run check:backend:readiness`.
4. Run `npm run check:kpi-alerts` (allow-empty for low-volume environments).
5. Confirm incident status in runbook channel.

## Validation after rollback
- Health endpoint healthy.
- No active blocker on core flow.
- Crash and error trend returns below alert threshold.

## Ownership
- Primary: Engineering on-call.
- Approver: Tech lead / release manager.
