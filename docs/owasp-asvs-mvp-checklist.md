# OWASP ASVS MVP Checklist

**Version:** MVP baseline  
**Date:** 2026-04-14

## V1 Architecture, design, and threat modeling
- [x] Core data flow mapped for auth/search/save/contact.
- [x] Runtime mode separation (mock vs backend) with explicit env validation.
- [ ] Full threat model workshop and signed review.

## V2 Authentication
- [x] Auth guard for protected actions (`requireAuth`).
- [x] Session expiry handling in bootstrap route decision.
- [ ] Multi-factor authentication (out of MVP scope).

## V3 Session management
- [x] Token encryption at rest in storage layer (AES-GCM with compatibility fallback).
- [x] Session expiry checked before route to Home.
- [ ] Server-side session revocation integration.

## V4 Access control
- [x] Protected write actions require authenticated state.
- [ ] Backend authorization matrix validation in staging/prod.

## V5 Input and output validation
- [x] Login/register/contact validators implemented and unit tested.
- [x] API result mapping with typed error handling.
- [ ] Output encoding review for all UI render paths.

## V7 Error handling and logging
- [x] Structured request context support (`X-Request-Id`) in HTTP client.
- [x] Monitoring abstraction with pluggable provider and fail-safe behavior.
- [ ] PII redaction policy enforced in all logs.

## V8 Data protection
- [x] Data provenance check gate integrated in CI.
- [x] Privacy policy and terms drafted for MVP release.
- [ ] Key rotation and secret vault integration.

## V10 Malicious code and abuse
- [x] Contact/visit rate-limit guard at usecase level.
- [x] Idempotency keys for critical write endpoints.
- [ ] Backend WAF/rate-limit enforcement validation in staging.

## V14 Configuration
- [x] Runtime config validation for API/env/retry parameters.
- [x] Documented `.env` contract.
- [ ] Production secret management hardening (vault, rotation, access audit).
