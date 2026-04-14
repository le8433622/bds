# Kế hoạch chạy song song để tiến tới 100%

**Nguồn dữ liệu:** docs/production-100-plan.md

## Nguyên tắc triển khai đồng thời
- Mỗi lane chạy tối đa 1 task active để tránh tắc nghẽn review.
- Wave kế tiếp chỉ mở khi tất cả task cùng hàng đã có owner + deadline.
- Ưu tiên xử lý blocker liên lane trước task tối ưu nhỏ.

## Bảng phân rã song song (theo wave)
| Wave | Lane A — UI & UX core flow (10 ngày) | Lane B — Backend readiness & reliability (8 ngày) | Lane C — Security, compliance, legal (6 ngày) | Lane D — Growth analytics & operations (6 ngày) |
|---|---|---|---|---|
| 1 | A1.1 Hook SearchScreen vào usecase thật, bỏ mock hardcode. | B1. Chuẩn hóa contract API property/saved/contact (OpenAPI hoặc schema tương đương). | C1. Nâng cấp token storage (không chỉ obfuscation, cần encryption thực tế). | D1. Tích hợp provider analytics thật (Firebase/Segment). |
| 2 | A1.2 Thêm loading skeleton + empty state + retry CTA. | B2. Thêm request-id + logging context ở HTTP client. | C2. Thêm rate-limit cho contact endpoint. | D2. Dashboard funnel Search -> Detail -> Save -> Contact. |
| 3 | A1.3 Thêm analytics event `search_submitted`. | B3. Áp dụng retry policy theo endpoint criticality. | C3. Rà soát data provenance và giấy phép dữ liệu. | D3. Thiết lập crash/error monitoring (Sentry hoặc tương đương). |
| 4 | A1.4 Test UI logic cho filter cơ bản. | B4. Health endpoint + readiness check cho deploy gate. | C4. Hoàn tất Privacy Policy + Terms of Service bản phát hành. | D4. Alert theo ngưỡng KPI và error budget. |
| 5 | A2.1 Nối pagination từ store/usecase vào UI list. | B5. Idempotency cho action save/contact để tránh double-submit. | C5. Checklist bảo mật OWASP ASVS mức MVP. | D5. Runbook incident + phân ca on-call. |
| 6 | A2.2 Xử lý pull-to-refresh và lỗi mạng tạm thời. | B6. Test integration với backend staging. |  |  |
| 7 | A2.3 Thêm analytics event `list_impression`. |  |  |  |
| 8 | A2.4 Viết test cho sort/filter/pagination integration. |  |  |  |
| 9 | A3.1 Render đầy đủ trường dữ liệu listing quan trọng. |  |  |  |
| 10 | A3.2 Save/unsave realtime + trạng thái pending. |  |  |  |
| 11 | A3.3 Contact CTA theo 2 mode (call/form). |  |  |  |
| 12 | A3.4 Test hành vi save/contact ở case thành công/lỗi. |  |  |  |
| 13 | A4.1 Hoàn thiện guard route khi token hết hạn. |  |  |  |
| 14 | A4.2 Chuẩn hóa thông báo login thất bại. |  |  |  |
| 15 | A4.3 Test Splash -> Onboarding -> Login -> Home. |  |  |  |

## Cách dùng
1. Gán owner cho từng ô trong wave hiện tại.
2. Chốt deadline 24h cho từng task.
3. Cuối ngày cập nhật checklist và chạy lại generator này.
