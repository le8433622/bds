# Staging Integration Report

**Generated:** 2026-04-14  
**Scope:** Backend staging smoke integration (`health`, `properties` read path)

## Command
- `npm run check:staging:smoke`

## Runtime flags
- `STAGING_SMOKE_ENABLED=true`
- `STAGING_API_BASE_URL=<staging-url>`
- `STAGING_SMOKE_TIMEOUT_MS=5000` (optional)

## Expected checks
1. `/health` returns `status=ok`.
2. `/properties?page=1&pageSize=3` returns JSON array.

## Result
- Smoke harness implemented and ready for staging pipeline execution.
- In local default mode, command is safely skipped unless explicitly enabled.
