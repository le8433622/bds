# HomeFinder MVP

HomeFinder là ứng dụng bất động sản mobile-first giúp người dùng mua/thuê nhà tìm bất động sản phù hợp nhanh, rõ ràng và đáng tin cậy.

## Mục tiêu MVP

- Giúp người dùng tìm bất động sản theo nhu cầu.
- Giúp người dùng xem thông tin listing rõ ràng.
- Giúp người dùng lưu tin và liên hệ môi giới/chủ nhà nhanh chóng.

## Luồng giá trị cốt lõi

**Nhanh hơn khi tìm, rõ hơn khi xem, dễ hơn khi liên hệ.**

## 10 màn hình ưu tiên

1. Splash
2. Onboarding
3. Login
4. Register
5. Home
6. Search
7. Property List
8. Property Detail
9. Saved
10. Profile

## Cấu trúc frontend đề xuất (React Native / Expo)

```txt
src/
├── assets/
├── components/
├── screens/
├── navigation/
├── services/
├── store/
├── hooks/
├── types/
├── constants/
├── utils/
└── App.tsx
```

## Sprint đề xuất

- Sprint 1: App skeleton (theme, navigation, splash, onboarding)
- Sprint 2: Auth (login/register + token)
- Sprint 3: Home (banner, categories, featured/new listings)
- Sprint 4: Search + Property List
- Sprint 5: Property Detail + Save + Contact CTA
- Sprint 6: Saved + Profile + Logout
- Sprint 7: Polish (loading/error/skeleton/responsive)

Chi tiết đầy đủ nằm tại `docs/homefinder-mvp-spec.md`.
Trong đó đã có thêm mục đề xuất màn hình mở rộng và sơ đồ site phiên bản mở rộng để phục vụ giai đoạn sau MVP core.

## Trạng thái scaffold hiện tại

- Đã có store logic thuần cho auth/property/saved để xử lý:
  - filter/sort listing
  - toggle saved
  - login/logout state
- Đã có mock data + mock API async cho property để UI có thể tích hợp ngay không cần backend thật.
- Đã bổ sung unit test cho store logic ngoài các test validators trước đó.
- Đã có contact/book visit flow logic + validator để chuẩn bị cho màn Contact Agent / Book Visit.
- Đã có logic pagination cho property list và store logic cho notifications/profile.
- Đã có usecase layer cho search/save/contact/book-visit để kết nối UI với service theo luồng nghiệp vụ.

## Type checking

- `npm run typecheck`: kiểm tra code ứng dụng (không bao gồm file `*.test.ts`) để luôn chạy được kể cả khi chưa cài dev test types.
- `npm run typecheck:test`: kiểm tra cả test files (yêu cầu cài đầy đủ dependencies, gồm `vitest`).
- `npm run check:provenance`: kiểm tra metadata nguồn dữ liệu trong `docs/data-sources.json`.
- `npm run check:progress:gate`: kiểm tra % tiến độ hiện tại không thấp hơn baseline trong `.ci/progress-baseline.json` (tự dùng `progress-report.json` nếu có, hoặc tự sinh JSON tiến độ khi chạy local).
- `npm run check:readiness:100`: kiểm tra điều kiện đạt 100% (fail nếu vẫn còn task pending trong plan/tracker).
- `npm run check:readiness:100:report`: in báo cáo readiness 100% mà không fail pipeline.
- `npm run check:readiness:100:json`: xuất báo cáo readiness 100% dạng JSON để dùng trong CI/dashboard.
- `npm run complete:task -- --id A1.1 [--dry-run]`: đánh dấu một task trong plan là hoàn thành (hỗ trợ dry-run để kiểm tra trước).
- `npm run complete:next -- --limit 3 [--dry-run]`: đánh dấu nhanh N task pending tiếp theo để cập nhật checklist theo batch.
- `npm run cycle:light-speed -- --limit 3 [--apply] [--update-baseline]`: chạy chu trình tăng tốc (xem task -> complete batch -> report -> tùy chọn cập nhật baseline).
- `npm run generate:director-report`: tạo báo cáo tiến độ tự động gửi giám đốc tại `docs/bao-cao-tien-do-tu-dong.md`.
- `npm run generate:parallel-plan`: tạo bảng triển khai song song theo wave tại `docs/ke-hoach-song-song-100.md`.
- `npm run generate:status-report`: tạo báo cáo tình hình ngắn gọn tại `docs/tinh-hinh-hien-tai.md`.
- CI hiện tự động chạy cả 2 lệnh báo cáo trên và upload cùng artifact `execution-reports`.
- `npm run next:tasks`: liệt kê nhanh các task pending tiếp theo (mặc định 10 task đầu trong `docs/production-100-plan.md`).
- `npm run next:tasks:json`: xuất danh sách task pending dạng JSON để đẩy vào dashboard/automation.
- `npm run report:progress`: tự động tính và in % hoàn thành dự án từ checklist trong `docs/progress.md` và `docs/production-100-plan.md`.
- `npm run report:progress:json`: xuất báo cáo tiến độ dạng JSON (phù hợp CI/dashboard tự động).
- `npm run report:progress:brief`: chỉ in ngắn gọn nếu tiến độ không đổi (tránh lặp số liệu).
- `npm run report:progress:record`: lưu snapshot tiến độ hiện tại vào `.ci/last-progress-snapshot.json`.
- `npm run update:progress:baseline -- [--dry-run]`: cập nhật baseline `.ci/progress-baseline.json` theo tiến độ hiện tại.
- Báo cáo tiến độ hiện cũng hiển thị phần **còn thiếu để đạt 100%** (số task và % còn lại).
- `npm run verify`: chạy trọn gói `typecheck + typecheck:test + test` trước khi push PR.
- Đã có storage + bootstrap usecase để điều hướng Splash -> Home/Onboarding/Login theo token và trạng thái onboarding.
- `npm test` đã có fallback: nếu thiếu local `vitest` binary, script sẽ tự dùng `npx vitest@3.2.4` (cần internet).

## Runtime env quan trọng

- `APP_ENV`: môi trường chạy (`development` | `staging` | `production`).
- `API_BASE_URL`: base URL cho HTTP gateway.
- `API_TIMEOUT_MS`: timeout cho mỗi request.
- `API_RETRY_COUNT`: số lần retry khi lỗi mạng/timeout (retry policy).
- `API_RETRY_DELAY_MS`: độ trễ cơ sở cho incremental backoff giữa các lần retry.
- `USE_MOCK_API`: `true` dùng mock/in-memory, `false` dùng backend HTTP gateway.

Tham khảo giá trị mẫu tại `.env.example`.

## Ghi chú cài dependencies (npm)

Trong môi trường CI/sandbox có thể gặp lỗi `403 Forbidden` khi chạy npm do policy mạng/proxy của môi trường, không phải do mã nguồn.

Quy trình khuyến nghị ở máy local:

1. `npm config set registry https://registry.npmjs.org/`
2. `npm run deps:install`
3. `npm run verify`

Lưu ý: `npm run verify` sẽ chạy `check:provenance`, `typecheck`, `typecheck:test` và `test`.

Nếu vẫn bị `403`, cần mở quyền truy cập registry trong môi trường chạy CI/sandbox.

### Lệnh cài dependencies được chuẩn hoá

Repo có script `npm run deps:install` để:
- ép registry về `https://registry.npmjs.org/`
- chạy npm với môi trường đã loại các proxy env phổ biến gây warning
- ưu tiên `npm ci` khi có `package-lock.json` (reproducible hơn cho CI), fallback `npm install` khi chưa có lockfile

Nếu vẫn lỗi `403`, đó là do policy mạng của sandbox/CI (cần mở outbound tới npm registry).

## Recommendation module

- Đã có view-history + recommendation usecase để chuẩn bị cho mục gợi ý bất động sản theo hành vi xem tin.

## Governance dữ liệu

- Xem chính sách nguồn dữ liệu & bản quyền tại `docs/nguon-du-lieu-va-ban-quyen.md`.
- Tờ trình giám đốc phê duyệt chiến lược tiếp theo: `docs/de-xuat-giam-doc-phe-duyet-2026-04-12.md`.

## FAQ ngắn

### Có nên “luôn cập nhật model mới nhất miễn phí” là đủ không?

Không. Với MVP production, nên:
- **pin version/model** theo từng release để tránh thay đổi hành vi đột ngột,
- có **ngân sách và giới hạn chi phí** rõ ràng (không phụ thuộc giả định “miễn phí mãi”),
- và chỉ nâng model sau khi qua test hồi quy + đo KPI thực tế.

### Có thể “tự động hoàn thành mục tiêu đề ra” không?

Không thể theo nghĩa hoàn toàn tự động. Dự án chỉ có thể **tự động hóa quy trình đo lường & cảnh báo**,
còn quyết định sản phẩm và vận hành vẫn cần con người chịu trách nhiệm.

Tối thiểu nên có:
- CI gate (`npm run verify`) để chặn lỗi kỹ thuật trước khi merge.
- Dashboard KPI (Search -> Detail, Save, Contact, retention) để theo dõi mục tiêu theo tuần/tháng.
- Alert theo ngưỡng (ví dụ crash-free < 99.5% hoặc Contact rate giảm mạnh) để kích hoạt hành động khắc phục.
