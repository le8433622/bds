# Changelog

## Unreleased

### Added
- Sandbox ops health check script (`npm run ops:health`) for quick runtime diagnostics (git status, runtime versions, process list, listening ports with fallback, and core script presence checks).
- Nightly ops workflow and GitHub issue/PR governance templates for incident/feature intake and standardized PR validation.

### Changed
- CI gate strengthened with app smoke checks, KPI/funnel generation, and expanded execution artifacts.

## 1.0.0 - 2026-04-14

### Added
- UI container wiring runtime usecases to Search/List/Detail controllers.
- Search/List controllers with loading, empty, retry, pagination, and analytics hooks.
- Property detail controller with save/unsave pending handling and contact mode support.
- OpenAPI contract (`docs/openapi.yaml`) for MVP backend endpoints.
- Staging smoke check (`npm run check:staging:smoke`) and backend readiness check.
- KPI funnel dashboard and alert scripts.
- Privacy policy, terms of service, OWASP ASVS checklist, and incident runbook docs.
- Error monitoring abstraction and Sentry-compatible provider.
- Contact rate-limit guard and idempotency hardening for critical write actions.

### Changed
- HTTP client now injects `X-Request-Id` and applies retry policy by endpoint criticality.
- Token storage upgraded to AES-GCM encrypted session format with backward compatibility.
- Runtime configuration now supports analytics and monitoring provider bootstrapping.

### Validation
- `npm run verify` green on release snapshot.
- CI workflow passing on `main`.
