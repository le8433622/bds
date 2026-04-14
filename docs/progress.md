# HomeFinder MVP Progress Tracker

> Estimated overall progress toward production launch: **~75% (as of April 14, 2026)**

## Completed
- [x] Product brief + MVP scope docs
- [x] TypeScript project setup + scripts
- [x] Core domain models and constants
- [x] In-memory services for properties/saved/contact/book-visit
- [x] Store/usecase layers for auth/search/save/contact/bootstrap/recommendation
- [x] Unit tests for domain/services/usecases
- [x] CI workflow and release readiness checklist
- [x] Runtime app config validation (`appConfig`)
- [x] Basic analytics event tracking layer + tracked usecases
- [x] HTTP client abstraction with typed API result mapping
- [x] Property/Saved/Contact API gateway abstractions for backend migration
- [x] Backend usecase facade wired to HTTP gateways
- [x] Runtime mode switch (mock/backend) via `USE_MOCK_API`
- [x] Extended test coverage for app shell/constants/navigation/screens/hooks/data
- [x] App bootstrap orchestrator from env -> config -> runtime
- [x] Service factory integration test with injected fetch
- [x] App default runtime initialization wired in entrypoint
- [x] Backend health-check gateway + usecase
- [x] Configurable HTTP retry policy wired from env -> runtime -> service factory -> http client
- [x] App entrypoint now exposes an app-shell model (flow + runtime mode + usecases) for UI container integration
- [x] Analytics service now supports pluggable provider injection for future Firebase/Segment wiring
- [x] Tracked usecases now support injected analytics function for easier provider-level integration testing
- [x] HTTP retry now includes incremental backoff delays to reduce transient failure bursts
- [x] Retry backoff base delay is configurable from env (`API_RETRY_DELAY_MS`) through runtime config
- [x] README updated with runtime env contract for handoff clarity (timeout/retry/mock-backend switch)
- [x] Added unified `npm run verify` quality gate and wired CI to use it
- [x] Token storage now persists obfuscated (base64-encoded) value in memory layer
- [x] Token obfuscation uses UTF-8 safe TextEncoder/TextDecoder implementation
- [x] Token storage now validates versioned format (`v1:`) to reject unsupported legacy/corrupted values
- [x] Release checklist and README local flow now prioritize unified `npm run verify`
- [x] Added data-provenance governance doc to prevent unlicensed source-copy into monetized flows
- [x] Added executable provenance gate (`check:provenance`) integrated into `npm run verify`
- [x] Introduced UI container layer wiring runtime usecases to Search/List/Detail screen controllers
- [x] Search controller now supports loading/empty/error/retry state flow on real usecase calls
- [x] Property list controller now supports pagination + pull-to-refresh + transient-error retry
- [x] Added analytics `list_impression` instrumentation in list/search controller flows
- [x] Property detail controller now supports save/unsave pending and contact CTA call/form modes
- [x] Added success/failure tests for property detail save/contact interactions
- [x] Added OpenAPI contract draft for property/saved/contact/health endpoints (`docs/openapi.yaml`)
- [x] Added backend readiness health-check command (`npm run check:backend:readiness`)
- [x] HTTP client now injects `X-Request-Id`, supports per-endpoint retry criticality, and structured request logging hooks
- [x] Save/contact/book-visit HTTP gateway writes now include idempotency keys
- [x] Token storage upgraded from plain obfuscation to AES-GCM encryption (with backward-compatible `v1` read support)
- [x] Added pluggable HTTP analytics provider and env-based runtime analytics configuration

## Remaining to reach 100%
- [ ] Wire runtime mode into real React Native screens/navigation container UI
- [ ] Replace current in-memory flows in full UI rendering layer with backend facade in real React Native views
- [ ] Implement full MVP UI for all prioritized screens
- [ ] Complete visual UI rendering for loading/error/empty/retry states in actual RN components
- [ ] Analytics provider integration (Firebase/Segment)
- [ ] Security hardening remaining scope (rate limits + secret management hardening)
- [ ] UAT + release candidate builds

## Điều kiện xác nhận “thành công”

Để kết luận website/app MVP “thành công”, cần đồng thời đạt:

- [ ] **Gate kỹ thuật:** `npm run verify` pass ổn định trên CI trong 7 ngày liên tiếp.
- [ ] **Gate phát hành:** hoàn tất UAT + release checklist + rollback drill.
- [ ] **Gate sản phẩm (30 ngày sau go-live):**
  - [ ] tỷ lệ crash-free sessions >= 99.5%
  - [ ] tỷ lệ thành công flow Search -> Detail >= 85%
  - [ ] tỷ lệ Save từ màn Detail >= 8%
  - [ ] tỷ lệ Contact từ màn Detail >= 3%
  - [ ] D7 retention >= 12%

## Tự động hóa mục tiêu (phạm vi thực tế)

- Có thể tự động hóa:
  - kiểm tra chất lượng kỹ thuật qua CI,
  - thu thập KPI qua analytics,
  - cảnh báo khi lệch ngưỡng.
- Không thể tự động hóa hoàn toàn:
  - quyết định ưu tiên sản phẩm,
  - xử lý sự cố phức tạp/các trade-off kinh doanh,
  - phê duyệt go/no-go phát hành.

## Mốc thời gian đề xuất

- **Ngày 12/04/2026:** baseline (đang ở ~65%, chủ yếu hoàn tất phần nền tảng).
- **Ngày 03/05/2026:** mục tiêu “feature complete MVP” (xong UI chính + backend wiring).
- **Ngày 10/05/2026:** mục tiêu “release candidate” (xong UAT và checklist phát hành).
- **Ngày 11/05/2026:** mục tiêu go-live MVP.
- **Ngày 10/06/2026:** chốt đánh giá thành công theo KPI 30 ngày sau go-live.

## Kế hoạch hành động vi mô để tăng tốc

- Xem backlog “chia siêu nhỏ task” tại `docs/production-100-plan.md` để triển khai theo 4 lane song song (UI/UX, backend, security/legal, analytics/operations) với nhịp 0.5-1 ngày/task.
