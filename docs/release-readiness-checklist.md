# HomeFinder MVP Release Readiness Checklist

## 1) Quality gates
- [ ] `npm run deps:install`
- [ ] `npm run verify`
- [ ] `npm run typecheck`
- [ ] `npm run typecheck:test`
- [ ] `npm test`
- [ ] CI workflow passes on target branch

## 2) Product completeness
- [ ] Splash routing (token + onboarding) works end-to-end
- [ ] Auth flow (login/register/forgot) validated
- [ ] Search + list + pagination works
- [ ] Property detail supports save + contact + book visit actions
- [ ] Saved tab lists/removes items correctly
- [ ] Profile + notification actions tested manually

## 3) Data & API safety
- [ ] Runtime env validated (`APP_ENV`, `API_BASE_URL`, `API_TIMEOUT_MS`, `API_RETRY_COUNT`, `API_RETRY_DELAY_MS`)
- [ ] All API calls return typed result and errors are mapped
- [ ] Empty/error states implemented in UI for every API-driven screen

## 4) Observability
- [ ] Crash/error logging integrated
- [ ] KPI events instrumented (search, save, contact)
- [ ] Release build includes source map strategy

## 5) Launch checklist
- [ ] App icon/splash assets finalized
- [ ] Privacy policy/terms links added
- [ ] Version + changelog updated
- [ ] Rollback plan documented
