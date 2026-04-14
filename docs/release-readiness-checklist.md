# HomeFinder MVP Release Readiness Checklist

## 1) Quality gates
- [x] `npm run deps:install`
- [x] `npm run verify`
- [x] `npm run typecheck`
- [x] `npm run typecheck:test`
- [x] `npm test`
- [x] CI workflow passes on target branch

## 2) Product completeness
- [x] Splash routing (token + onboarding) works end-to-end
- [x] Auth flow (login/register/forgot) validated
- [x] Search + list + pagination works
- [x] Property detail supports save + contact + book visit actions
- [x] Saved tab lists/removes items correctly
- [x] Profile + notification actions tested manually

## 3) Data & API safety
- [x] Runtime env validated (`APP_ENV`, `API_BASE_URL`, `API_TIMEOUT_MS`, `API_RETRY_COUNT`, `API_RETRY_DELAY_MS`)
- [x] All API calls return typed result and errors are mapped
- [x] Empty/error states implemented in UI for every API-driven screen

## 4) Observability
- [x] Crash/error logging integrated
- [x] KPI events instrumented (search, save, contact)
- [x] Release build includes source map strategy

## 5) Launch checklist
- [x] App icon/splash assets finalized
- [x] Privacy policy/terms links added
- [x] Version + changelog updated
- [x] Rollback plan documented
