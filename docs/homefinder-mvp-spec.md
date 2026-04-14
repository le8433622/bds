# HomeFinder — Product Brief & MVP Spec

## 1. Product Brief

### 1.1 Tên sản phẩm
**HomeFinder** — Ứng dụng bất động sản mobile-first cho người mua/thuê tìm nhà nhanh, rõ, đáng tin.

### 1.2 Mục tiêu sản phẩm
Không làm “siêu app” ở phiên bản đầu. Tập trung giải quyết 1 vấn đề chính:
- Giúp người dùng tìm bất động sản phù hợp.
- Giúp người dùng liên hệ nhanh với người đăng.

### 1.3 Mục tiêu kinh doanh
- Tăng số lượt liên hệ từ listing.
- Tăng số lượt lưu tin.
- Tăng tỷ lệ quay lại app.
- Tạo nền để mở rộng sang đặt lịch xem nhà.

### 1.4 Người dùng mục tiêu
**Persona chính:** người mua/thuê nhà 24–38 tuổi.

**Nhu cầu chính:**
- Thông tin rõ ràng.
- Lọc đúng nhu cầu.
- Tìm nhanh theo khu vực, giá, loại hình.
- Lưu tin xem lại.
- Liên hệ môi giới/chủ nhà dễ.

**Nỗi sợ chính:**
- Tin giả.
- Giá không rõ.
- Thông tin rối.
- Tìm lâu mà không có kết quả phù hợp.

### 1.5 Giá trị cốt lõi
> Nhanh hơn khi tìm, rõ hơn khi xem, dễ hơn khi liên hệ.

### 1.6 Phạm vi MVP
**Có trong vòng 1:**
- Splash
- Onboarding
- Login
- Register
- Home
- Search
- Property List
- Property Detail
- Saved
- Profile

**Chưa làm vòng 1:**
- AI
- Thanh toán
- Escrow
- Deal room
- Đầu tư
- CRM môi giới

## 2. Sitemap

```txt
App
├── Splash
├── Onboarding
├── Auth
│   ├── Login
│   ├── Register
│   └── Forgot Password
├── Main App
│   ├── Home
│   ├── Search
│   │   ├── Search Filter
│   │   └── Property List
│   ├── Saved
│   ├── Notifications
│   └── Profile
├── Property
│   └── Property Detail
└── Secondary
    ├── Contact Agent
    ├── Book Visit
    └── Settings
```

**Bottom tabs MVP:** Home, Search, Saved, Notifications, Profile.

### 2.1 Đề xuất mở rộng màn hình (giai đoạn sau MVP core)

Để tăng chuyển đổi và giảm rủi ro vận hành sau khi đã ổn định 10 màn hình đầu, đề xuất bổ sung:

1. **Search Filter Advanced** (lọc nâng cao: tiện ích, pháp lý, nội thất)
2. **Map Search** (xem listing theo bản đồ)
3. **Contact History** (lịch sử liên hệ môi giới/chủ nhà)
4. **Book Visit Scheduler** (đặt lịch xem nhà theo khung giờ)
5. **Compare Properties** (so sánh 2-3 bất động sản)
6. **My Inquiries** (theo dõi trạng thái các yêu cầu đã gửi)
7. **Notification Preferences** (tuỳ chỉnh loại thông báo)
8. **Account & Security** (đổi mật khẩu, quản lý phiên đăng nhập)
9. **Help Center** (FAQ/chính sách/hỗ trợ)
10. **Report Listing** (báo cáo tin sai/đáng ngờ)

### 2.2 Sơ đồ site đề xuất (phiên bản mở rộng)

```txt
HomeFinder App
├── Splash
├── Onboarding
├── Auth
│   ├── Login
│   ├── Register
│   └── Forgot Password
├── Main Tabs
│   ├── Home
│   ├── Search
│   │   ├── Search Filter
│   │   ├── Search Filter Advanced
│   │   ├── Property List
│   │   └── Map Search
│   ├── Saved
│   │   └── Compare Properties
│   ├── Notifications
│   │   └── Notification Preferences
│   └── Profile
│       ├── Account & Security
│       ├── My Inquiries
│       └── Contact History
├── Property
│   ├── Property Detail
│   ├── Contact Agent
│   ├── Book Visit Scheduler
│   └── Report Listing
└── Support
    └── Help Center
```

## 3. User Flows

### 3.1 Flow tổng
Mở app → Splash → Onboarding (lần đầu) → Login/Register hoặc Guest → Home → Search → Property List → Property Detail → Save/Contact → Saved/Profile.

### 3.2 Người dùng mới
Splash → Onboarding → Register → Xác thực thành công → Home.

### 3.3 Người dùng cũ
Splash → Check token → hợp lệ: Home / không hợp lệ: Login.

### 3.4 Flow tìm kiếm
Home → Search → chọn filter → Property List → Property Detail → Save/Contact/Book Visit.

### 3.5 Flow lưu tin
Property Card/Detail → Save → (chưa login: Auth) → lưu thành công → Saved.

### 3.6 Flow liên hệ
Property Detail → Contact Agent → form/chat/call → gửi thành công → thông báo xác nhận.

## 4. 10 màn hình đầu tiên

1. Splash
2. Onboarding (3 màn hình)
3. Login
4. Register
5. Home
6. Search
7. Property List
8. Property Detail
9. Saved
10. Profile

## 5. Thứ tự thiết kế/triển khai

### Phase 1: Khung nền
- Splash
- Onboarding
- Login
- Register

### Phase 2: App shell
- Home
- Bottom tab
- Profile

### Phase 3: Core journey
- Search
- Property List
- Property Detail
- Saved

## 6. UI Components

### 6.1 Core components
- AppButton
- AppInput
- AppText
- AppHeader
- SectionTitle
- EmptyState
- LoadingSpinner
- Chip
- Badge
- BottomTabBar
- SearchBar
- BannerCard

### 6.2 Property components
- PropertyCardVertical
- PropertyCardHorizontal
- PropertyGallery
- PropertyInfoRow
- PropertyAmenities
- AgentCard
- ContactActionBar
- SaveButton

### 6.3 Auth components
- LoginForm
- RegisterForm
- PasswordField
- SocialLoginButtons

## 7. UI Foundation

### Color
- Primary: xanh đậm
- Accent: xanh lá hoặc cam nhẹ
- Background: trắng/xám rất nhạt
- Text primary: đen đậm
- Text secondary: xám

### Typography
- H1: 28
- H2: 22
- Title: 18
- Body: 14–16
- Caption: 12

### Spacing
- 8, 12, 16, 24, 32

### Radius
- Card: 16
- Button: 12
- Input: 12

## 8. Data Model cơ bản (TypeScript)

```ts
export type User = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
};

export type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  city: string;
  district?: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: 'apartment' | 'house' | 'land' | 'rental';
  images: string[];
  description: string;
  amenities: string[];
  isSaved?: boolean;
  createdAt: string;
};

export type SavedProperty = {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
};
```

## 9. API tối thiểu cho MVP

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `GET /auth/me`

### Property
- `GET /properties`
- `GET /properties/:id`
- `GET /properties?type=apartment&minPrice=...`
- `GET /featured-properties`
- `GET /new-properties`

### Saved
- `GET /saved-properties`
- `POST /saved-properties`
- `DELETE /saved-properties/:propertyId`

### Contact
- `POST /contact-request`

## 10. Definition of Done (MVP)

MVP hoàn thành khi user làm được end-to-end:
- Mở app
- Đăng ký/đăng nhập
- Vào Home
- Tìm kiếm bất động sản
- Xem danh sách
- Xem chi tiết
- Lưu tin
- Gửi liên hệ
- Xem lại Saved
- Đăng xuất
