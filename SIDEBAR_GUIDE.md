# 📋 Hướng Dẫn Thêm Menu Vào Sidebar

## ⚠️ QUY TẮC QUAN TRỌNG NHẤT

**PATH TRONG SIDEBAR PHẢI KHỚP CHÍNH XÁC VỚI ROUTES TRONG `app.routes.ts`**

### Công thức:
```
sidebar.link = '/dashboard/' + route.path
```

### Ví dụ:
```typescript
// Trong app.routes.ts:
{
  path: 'dashboard',
  children: [
    {
      path: 'users',  // ← Path này
      component: UserListPage,
    }
  ]
}

// Trong sidebar (dashboard-layout.module.ts):
{
  title: 'Danh sách người dùng',
  link: '/dashboard/users',  // ← /dashboard/ + users
}
```

### Quy trình BẮT BUỘC:

1. **Tạo route trong `app.routes.ts` TRƯỚC**
   ```typescript
   {
     path: 'your-route',
     component: YourComponent,
   }
   ```

2. **Test route hoạt động** - Gõ URL vào browser: `http://localhost:4200/dashboard/your-route`

3. **Sau đó mới thêm vào sidebar** với path: `/dashboard/your-route`

**❌ KHÔNG BAO GIỜ** thêm menu vào sidebar trước khi tạo route!

---

## 🎯 Quy Trình Nhanh

Khi tạo một page/module mới, bạn **BẮT BUỘC** phải thêm vào sidebar để người dùng có thể truy cập.

---

## 📝 Các Bước Thực Hiện

### Bước 1: Mở file dashboard layout
```bash
src/app/components/layouts/dashboard/dashboard-layout.module.ts
```

### Bước 2: Tìm array `menus` (khoảng dòng 60)

### Bước 3: Thêm menu item mới

#### Menu đơn (không có submenu):
```typescript
{
  title: 'Tên hiển thị',
  icon: 'tên-icon',
  link: '/dashboard/route-cua-ban',
}
```

#### Menu có submenu:
```typescript
{
  title: 'Tên menu cha',
  icon: 'tên-icon',
  children: [
    { title: 'Submenu 1', link: '/dashboard/route-1' },
    { title: 'Submenu 2', link: '/dashboard/route-2' },
  ],
}
```

---

## 💡 Ví Dụ Cụ Thể

### Ví dụ 1: Thêm "Quản lý kho"
```typescript
menus: MenuItem[] = [
  // ... các menu cũ
  {
    title: 'Quản lý kho',
    icon: 'database',
    link: '/dashboard/warehouses',
  },
];
```

### Ví dụ 2: Thêm "Quản lý báo cáo" với submenu
```typescript
menus: MenuItem[] = [
  // ... các menu cũ
  {
    title: 'Báo cáo',
    icon: 'bar-chart',
    children: [
      { title: 'Báo cáo doanh thu', link: '/dashboard/reports/revenue' },
      { title: 'Báo cáo tồn kho', link: '/dashboard/reports/inventory' },
      { title: 'Báo cáo đơn hàng', link: '/dashboard/reports/orders' },
    ],
  },
];
```

### Ví dụ 3: Thêm nhiều menu cùng lúc
```typescript
menus: MenuItem[] = [
  // ... các menu cũ
  {
    title: 'Quản lý khách hàng',
    icon: 'team',
    link: '/dashboard/customers',
  },
  {
    title: 'Quản lý nhà cung cấp',
    icon: 'contacts',
    link: '/dashboard/suppliers',
  },
  {
    title: 'Cài đặt',
    icon: 'setting',
    children: [
      { title: 'Cài đặt chung', link: '/dashboard/settings/general' },
      { title: 'Cài đặt thanh toán', link: '/dashboard/settings/payment' },
      { title: 'Cài đặt vận chuyển', link: '/dashboard/settings/shipping' },
    ],
  },
];
```

---

## 🎨 Danh Sách Icon Phổ Biến

| Icon | Tên | Sử dụng cho |
|------|-----|-------------|
| `dashboard` | Dashboard | Trang chủ dashboard |
| `user` | User | Quản lý người dùng |
| `team` | Team | Khách hàng, nhóm |
| `safety` | Safety | Phân quyền, bảo mật |
| `shopping` | Shopping | Sản phẩm, mua sắm |
| `shop` | Shop | Cửa hàng |
| `file-text` | File Text | Đơn hàng, tài liệu |
| `car` | Car | Vận chuyển, giao hàng |
| `database` | Database | Kho, dữ liệu |
| `bar-chart` | Bar Chart | Báo cáo, thống kê |
| `setting` | Setting | Cài đặt |
| `tool` | Tool | Công cụ |
| `calendar` | Calendar | Lịch, thời gian |
| `notification` | Notification | Thông báo |
| `mail` | Mail | Email, tin nhắn |
| `wallet` | Wallet | Thanh toán, tài chính |
| `gift` | Gift | Khuyến mãi, ưu đãi |
| `contacts` | Contacts | Liên hệ, nhà cung cấp |
| `api` | API | API, tích hợp |
| `cloud` | Cloud | Cloud, lưu trữ |

**Xem tất cả icons:** https://ng.ant.design/components/icon/en

---

## ✅ Checklist Khi Thêm Menu

- [ ] **✨ Route đã được tạo trong `app.routes.ts`** ⭐ BẮT BUỘC KIỂM TRA ĐẦU TIÊN
- [ ] **✨ Path trong sidebar khớp chính xác: `/dashboard/` + route path**
- [ ] Đã test route bằng cách gõ URL vào browser
- [ ] File `dashboard-layout.module.ts` đã được mở
- [ ] Menu được thêm vào array `menus`
- [ ] Icon phù hợp đã được chọn
- [ ] Đã thêm dấu phẩy ở cuối object trước đó
- [ ] Syntax đúng (không có lỗi)
- [ ] File đã được save
- [ ] Đã test menu trên browser - click menu navigate đúng trang

---

## 🔍 Cách Kiểm Tra Path Có Khớp

### Phương pháp 1: Đối chiếu trực tiếp

**Bước 1:** Mở `app.routes.ts`
```typescript
// Tìm trong children của dashboard:
{
  path: 'products',  // ← Ghi nhớ path này
  component: ProductListPage,
}
```

**Bước 2:** Mở `dashboard-layout.module.ts`
```typescript
// Trong menus array, path phải là:
{
  title: 'Danh sách sản phẩm',
  link: '/dashboard/products',  // ← /dashboard/ + products
  //     ^^^^^^^^^^ ^^^^^^^^
  //     prefix     route path
}
```

### Phương pháp 2: Dùng bảng đối chiếu

| Sidebar Menu Link | Route Path (trong app.routes.ts) | Khớp? |
|-------------------|----------------------------------|-------|
| `/dashboard/users` | `path: 'users'` | ✅ |
| `/dashboard/products` | `path: 'products'` | ✅ |
| `/dashboard/orders/list` | `path: 'orders/list'` | ✅ |
| `/dashboard/product` | `path: 'products'` | ❌ Thiếu 's' |
| `/dashboard/user/list` | `path: 'users'` | ❌ Sai cấu trúc |

### Phương pháp 3: Test bằng browser

1. Copy link từ sidebar menu
2. Dán vào browser: `http://localhost:4200` + link
3. Nếu hiển thị page → ✅ Khớp
4. Nếu redirect hoặc 404 → ❌ Không khớp, cần kiểm tra lại

---

## 📋 Danh Sách Routes và Sidebar Hiện Tại (Đã Khớp)

### Routes trong `app.routes.ts`:
```typescript
children: [
  { path: '', component: DashboardHomePage },
  { path: 'orders/list', component: DashboardOrderListPage },
  { path: 'orders/create', component: DashboardOrderCreate },
  { path: 'users', component: UserListPage },
  { path: 'users/create', component: UserFormPage },
  { path: 'users/edit/:id', component: UserFormPage },
  { path: 'products', component: ProductListPage },
  { path: 'products/create', component: ProductFormPage },
  { path: 'products/edit/:id', component: ProductFormPage },
  { path: 'categories', component: CategoryListPage },
  { path: 'categories/create', component: CategoryFormPage },
  { path: 'categories/edit/:id', component: CategoryFormPage },
  { path: 'roles', redirectTo: '' },  // Placeholder
  { path: 'shops', redirectTo: '' },  // Placeholder
  { path: 'delivery-brands', redirectTo: '' },  // Placeholder
  { path: 'shipping', redirectTo: '' },  // Placeholder
]
```

### Menu trong Sidebar (dashboard-layout.module.ts):
```typescript
menus: [
  { title: 'Dashboard', link: '/dashboard' },  // → path: ''
  { 
    title: 'Quản lý người dùng',
    children: [
      { title: 'Danh sách', link: '/dashboard/users' },  // → path: 'users'
      { title: 'Thêm mới', link: '/dashboard/users/create' },  // → path: 'users/create'
    ]
  },
  { title: 'Vai trò', link: '/dashboard/roles' },  // → path: 'roles'
  { 
    title: 'Quản lý sản phẩm',
    children: [
      { title: 'Danh sách', link: '/dashboard/products' },  // → path: 'products'
      { title: 'Thêm mới', link: '/dashboard/products/create' },  // → path: 'products/create'
      { title: 'Danh mục', link: '/dashboard/categories' },  // → path: 'categories'
    ]
  },
  { title: 'Cửa hàng', link: '/dashboard/shops' },  // → path: 'shops'
  { 
    title: 'Đơn hàng',
    children: [
      { title: 'Danh sách', link: '/dashboard/orders/list' },  // → path: 'orders/list'
      { title: 'Tạo mới', link: '/dashboard/orders/create' },  // → path: 'orders/create'
    ]
  },
  { 
    title: 'Vận chuyển',
    children: [
      { title: 'Đơn vị VC', link: '/dashboard/delivery-brands' },  // → path: 'delivery-brands'
      { title: 'Quản lý VC', link: '/dashboard/shipping' },  // → path: 'shipping'
    ]
  },
]
```

✅ **Tất cả đều đã khớp!**

---

## 🔍 Cấu Trúc Menu Hiện Tại

```typescript
menus: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: '/dashboard',
  },
  {
    title: 'Quản lý người dùng',
    icon: 'user',
    children: [
      { title: 'Danh sách người dùng', link: '/dashboard/users' },
      { title: 'Thêm người dùng', link: '/dashboard/users/create' },
    ],
  },
  {
    title: 'Quản lý vai trò',
    icon: 'safety',
    link: '/dashboard/roles',
  },
  {
    title: 'Quản lý sản phẩm',
    icon: 'shopping',
    children: [
      { title: 'Danh sách sản phẩm', link: '/dashboard/products' },
      { title: 'Thêm sản phẩm', link: '/dashboard/products/create' },
      { title: 'Danh mục', link: '/dashboard/categories' },
    ],
  },
  {
    title: 'Quản lý cửa hàng',
    icon: 'shop',
    link: '/dashboard/shops',
  },
  {
    title: 'Đơn hàng',
    icon: 'file-text',
    children: [
      { title: 'Danh sách đơn hàng', link: '/dashboard/orders/list' },
      { title: 'Tạo đơn hàng', link: '/dashboard/orders/create' },
    ],
  },
  {
    title: 'Vận chuyển',
    icon: 'car',
    children: [
      { title: 'Đơn vị vận chuyển', link: '/dashboard/delivery-brands' },
      { title: 'Quản lý vận chuyển', link: '/dashboard/shipping' },
    ],
  },
];
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Thứ tự menu
- Menu sẽ hiển thị theo thứ tự trong array
- Menu quan trọng nên đặt ở trên cùng

### 2. Link phải khớp với routes
```typescript
// Link trong menu
link: '/dashboard/products'

// Route trong app.routes.ts phải có:
{
  path: 'products',
  component: ProductListPage,
}
```

### 3. Submenu tự động mở
- Khi truy cập vào một route con, submenu cha sẽ tự động mở
- Không cần config thêm gì

### 4. Icon bắt buộc
- Menu không có icon sẽ trông không đẹp
- Chọn icon phù hợp với chức năng

---

## 🐛 Xử Lý Lỗi Thường Gặp

### ❌ Lỗi: Click menu không navigate hoặc redirect về Dashboard

**Nguyên nhân:**
- Path trong sidebar KHÔNG KHỚP với route trong `app.routes.ts`
- Route chưa được tạo
- Component chưa được import

**Cách khắc phục:**
1. ✅ Kiểm tra `app.routes.ts` có route đó chưa
   ```typescript
   // Phải có route này:
   {
     path: 'users',  // ← Kiểm tra chính xác
     component: UserListPage,
   }
   ```

2. ✅ Kiểm tra sidebar link khớp với route
   ```typescript
   // Link phải là:
   link: '/dashboard/users'
   //                ^^^^^
   //                phải khớp với path ở trên
   ```

3. ✅ Nếu route chưa có, tạo route trước rồi mới thêm menu

### ❌ Lỗi: Menu hiển thị nhưng page không load

**Nguyên nhân:**
- Component chưa được export trong `pages/index.ts`
- Component chưa được import trong `app.routes.ts`

**Cách khắc phục:**
```typescript
// 1. Check pages/index.ts có export component:
export * from './dashboard/users/user-list';

// 2. Check app.routes.ts có import:
import { UserListPage } from './pages';
```

### ❌ Lỗi: Path có dấu / hay không có dấu /?

**Quy tắc:**
```typescript
// ✅ ĐÚNG - Sidebar
link: '/dashboard/users'  // Có / ở đầu

// ✅ ĐÚNG - Routes
path: 'users'  // KHÔNG có / ở đầu và cuối

// ❌ SAI
link: 'dashboard/users'  // Thiếu / ở đầu
link: '/dashboard/users/'  // Thừa / ở cuối
path: '/users'  // Thừa / ở đầu
path: 'users/'  // Thừa / ở cuối
```

---

## 📝 Template Khi Thêm Menu Mới

### Bước 1: Tạo route trong `app.routes.ts`
```typescript
// Thêm vào children của dashboard:
{
  path: 'your-feature',  // ← Không có dấu /
  component: YourComponent,
},
{
  path: 'your-feature/create',
  component: YourFormComponent,
},
```

### Bước 2: Thêm menu vào sidebar
```typescript
// Thêm vào menus array:
{
  title: 'Tên Feature',
  icon: 'icon-name',
  children: [
    { title: 'Danh sách', link: '/dashboard/your-feature' },  // ← Có /dashboard/
    { title: 'Thêm mới', link: '/dashboard/your-feature/create' },
  ],
}
```

### Bước 3: Test
```bash
# Gõ vào browser:
http://localhost:4200/dashboard/your-feature
```

---

## 📖 Tài Liệu Tham Khảo

- [ng-zorro Menu Component](https://ng.ant.design/components/menu/en)
- [ng-zorro Icons](https://ng.ant.design/components/icon/en)
- [Angular Router](https://angular.dev/guide/routing)

---

## 💬 Một Số Tips

1. **Nhóm menu liên quan**: Đặt các chức năng liên quan vào cùng một submenu
2. **Tên rõ ràng**: Dùng tên tiếng Việt dễ hiểu, không viết tắt
3. **Icon nhất quán**: Dùng icon style giống nhau trong toàn bộ ứng dụng
4. **Không quá nhiều level**: Tối đa 1 cấp submenu (cha -> con), không nên lồng sâu hơn
5. **Responsive**: Menu tự động collapse trên mobile

---

**Cập nhật lần cuối:** 16/01/2026  
**Phiên bản:** 1.0
