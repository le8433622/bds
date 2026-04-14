# Kế hoạch "chia siêu nhỏ task" để đạt 100% production thương mại

**Ngày lập kế hoạch:** 12/04/2026  
**Mục tiêu:** đạt trạng thái sẵn sàng vận hành thương mại (production) nhanh nhưng kiểm soát rủi ro.

## 1) Định nghĩa 100% production thương mại

Chỉ chốt 100% khi đồng thời đạt:
- Feature-complete cho MVP flow: Search -> Detail -> Save -> Contact.
- Chất lượng phát hành: CI xanh ổn định, UAT pass, rollback drill pass.
- Vận hành production: monitoring + alert + runbook + on-call.
- Chỉ số kinh doanh 30 ngày sau go-live đạt ngưỡng tối thiểu.

## 2) Nguyên tắc "tốc độ vũ trụ" nhưng an toàn

- Chia task tối đa 0.5-1 ngày/task (micro-task).
- Mỗi task bắt buộc có: owner, DoD, test/check, log rủi ro.
- WIP limit: tối đa 2 task/người để tránh nghẽn.
- Merge nhỏ, nhiều lần trong ngày; không gom mega-PR.

## 3) Backlog vi mô theo 4 lane song song

## Lane A — UI & UX core flow (10 ngày)

### A1. Search
- [x] A1.1 Hook SearchScreen vào usecase thật, bỏ mock hardcode.
- [x] A1.2 Thêm loading skeleton + empty state + retry CTA.
- [x] A1.3 Thêm analytics event `search_submitted`.
- [x] A1.4 Test UI logic cho filter cơ bản.

### A2. Property List
- [x] A2.1 Nối pagination từ store/usecase vào UI list.
- [x] A2.2 Xử lý pull-to-refresh và lỗi mạng tạm thời.
- [x] A2.3 Thêm analytics event `list_impression`.
- [x] A2.4 Viết test cho sort/filter/pagination integration.

### A3. Property Detail
- [x] A3.1 Render đầy đủ trường dữ liệu listing quan trọng.
- [x] A3.2 Save/unsave realtime + trạng thái pending.
- [x] A3.3 Contact CTA theo 2 mode (call/form).
- [x] A3.4 Test hành vi save/contact ở case thành công/lỗi.

### A4. Auth + bootstrap
- [x] A4.1 Hoàn thiện guard route khi token hết hạn.
- [x] A4.2 Chuẩn hóa thông báo login thất bại.
- [x] A4.3 Test Splash -> Onboarding -> Login -> Home.

## Lane B — Backend readiness & reliability (8 ngày)

- [x] B1. Chuẩn hóa contract API property/saved/contact (OpenAPI hoặc schema tương đương).
- [x] B2. Thêm request-id + logging context ở HTTP client.
- [x] B3. Áp dụng retry policy theo endpoint criticality.
- [x] B4. Health endpoint + readiness check cho deploy gate.
- [x] B5. Idempotency cho action save/contact để tránh double-submit.
- [ ] B6. Test integration với backend staging.

## Lane C — Security, compliance, legal (6 ngày)

- [x] C1. Nâng cấp token storage (không chỉ obfuscation, cần encryption thực tế).
- [x] C2. Thêm rate-limit cho contact endpoint.
- [x] C3. Rà soát data provenance và giấy phép dữ liệu.
- [x] C4. Hoàn tất Privacy Policy + Terms of Service bản phát hành.
- [x] C5. Checklist bảo mật OWASP ASVS mức MVP.

## Lane D — Growth analytics & operations (6 ngày)

- [x] D1. Tích hợp provider analytics thật (Firebase/Segment).
- [x] D2. Dashboard funnel Search -> Detail -> Save -> Contact.
- [x] D3. Thiết lập crash/error monitoring (Sentry hoặc tương đương).
- [x] D4. Alert theo ngưỡng KPI và error budget.
- [x] D5. Runbook incident + phân ca on-call.

## 4) Lịch thực thi đề xuất (từ 12/04/2026)

- **Tuần 1 (13/04-19/04):** Lane A1-A2 + B1-B2 + D1.
- **Tuần 2 (20/04-26/04):** Lane A3-A4 + B3-B4 + D2-D3.
- **Tuần 3 (27/04-03/05):** B5-B6 + C1-C3 + D4.
- **Tuần 4 (04/05-10/05):** C4-C5 + D5 + UAT + rollback drill + RC.
- **Go-live mục tiêu:** 11/05/2026.
- **Chốt thành công thương mại giai đoạn 1:** 10/06/2026 (sau 30 ngày KPI).

## 5) Đo hoàn thành theo scoreboard hằng ngày

Mỗi ngày cập nhật 5 số:
1. % task hoàn tất theo lane.
2. Số bug mở mới / bug đóng.
3. Tỷ lệ pass CI.
4. Crash-free sessions staging.
5. Funnel conversion staging.

## 6) Quy tắc go/no-go phát hành

Go-live chỉ được duyệt nếu:
- Không còn blocker Sev-1/Sev-2 mở.
- UAT pass >= 95% test cases critical.
- Rollback drill < 15 phút.
- Dashboard và alert hoạt động thực chiến.

Nếu không đạt một trong các điều kiện trên => tự động chuyển trạng thái **No-Go**.
