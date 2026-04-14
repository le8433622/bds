# Release Source Map Strategy

**Version:** 1.0.0  
**Date:** 2026-04-14

## Goal
Enable actionable crash diagnostics in monitoring tools without exposing source maps publicly.

## Strategy
1. Generate source maps only in release build pipeline.
2. Upload source maps to monitoring backend (Sentry-compatible transport).
3. Keep source maps out of public static hosting.
4. Tie upload to release identifier (`SENTRY_RELEASE`).

## Verification checklist
- Release artifact includes source map generation step.
- Source map upload returns success status.
- A synthetic error resolves to symbolized stack trace.
