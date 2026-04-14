# Chính sách nguồn dữ liệu & bản quyền nội dung (Data Provenance)

## Mục tiêu
Tránh rủi ro “copy nguồn internet rồi xem như tài sản nội bộ”, đảm bảo sản phẩm kiếm tiền dựa trên dữ liệu hợp pháp, truy vết được và kiểm chứng được.

## 2 câu hỏi bắt buộc trước khi ingest dữ liệu
1. **Ai chịu trách nhiệm cho workflow lấy dữ liệu này?** (owner + approver)
2. **Nguồn dữ liệu có quyền sử dụng thương mại không?** (license/ToS/attribution)

Nếu chưa trả lời được 2 câu hỏi trên thì **không được đưa dữ liệu vào sản phẩm**.

## Phân loại dữ liệu
- **Original**: dữ liệu tự thu thập nội bộ (first-party).
- **Licensed**: dữ liệu bên thứ ba có hợp đồng/quyền sử dụng rõ ràng.
- **Reference-only**: chỉ tham khảo, không được dùng trực tiếp để hiển thị/kiếm tiền.

## Metadata bắt buộc cho mỗi nguồn
- `source_name`
- `source_url`
- `license_type` / `tos_clause`
- `collected_at` (UTC)
- `owner`
- `confidence_score`
- `last_verified_at`

## Quy trình chuẩn đề xuất
1. Đăng ký nguồn + legal review.
2. Cấu hình workflow ingest có owner/alert.
3. Chuẩn hóa, loại bỏ nội dung cấm tái sử dụng.
4. QA dữ liệu (độ đúng, độ mới, độ phủ).
5. Xuất bản với attribution khi cần.
6. Audit định kỳ và rollback nếu vi phạm.

## Quy tắc cấm
- Cấm copy nguyên văn nội dung không có quyền.
- Cấm xóa attribution khi license yêu cầu.
- Cấm dùng dữ liệu “reference-only” cho tính năng thương mại.

## Gợi ý tích hợp vào CI/CD
- Thêm bước kiểm tra metadata nguồn trước khi merge.
- Fail pipeline khi thiếu `source_url/license_type/owner`.
- Lưu log provenance cho mọi dataset release.
