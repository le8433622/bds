# Kế hoạch UI Production + Go-Live Ops

**Mục tiêu giai đoạn:** chuyển từ nền tảng kỹ thuật ổn định sang bản phát hành có UI production-ready và vận hành go-live thực chiến.

## Lane E — UI Production Integration

- [ ] E1. Chuẩn hóa design tokens production (typography, spacing, color, elevation) và khóa version.
- [ ] E2. Thay toàn bộ placeholder/screen shell bằng layout production cho 10 màn hình MVP.
- [ ] E3. Hoàn thiện trạng thái loading/empty/error/retry cho từng màn có dữ liệu từ API.
- [ ] E4. Rà soát accessibility: touch targets, contrast, heading order, focus flow.
- [ ] E5. Thiết lập visual QA matrix cho iOS/Android theo breakpoints chính.
- [ ] E6. Chốt checklist UAT cho Search -> Detail -> Save -> Contact với sign-off Product/Design.

## Lane F — Go-Live Operations

- [ ] F1. Chạy drill go-live mô phỏng: deploy -> smoke -> rollback trong môi trường staging.
- [ ] F2. Chốt ngưỡng alert production cho error rate, latency và funnel conversion.
- [ ] F3. Hoàn tất lịch trực on-call tuần go-live (primary/secondary/escalation).
- [ ] F4. Thiết lập dashboard vận hành ngày go-live (health, error, funnel, contact success).
- [ ] F5. Soạn runbook truyền thông sự cố (internal update + stakeholder update template).
- [ ] F6. Chạy go/no-go review 24 giờ trước release với biên bản quyết định.

## Definition of Done (pha này)

- UI MVP production được sign-off bởi Product + Design + QA.
- Smoke test staging pass liên tiếp >= 3 vòng.
- Rollback drill đạt < 15 phút.
- Không còn blocker Sev-1/Sev-2 mở trước giờ phát hành.
