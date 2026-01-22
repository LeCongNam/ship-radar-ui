# ⚠️ QUAN TRỌNG: Đảm Bảo Routes và Sidebar Khớp Nhau

## 📌 Quy Tắc Vàng

```
sidebar.link = '/dashboard/' + route.path
```

## ✅ Quy Trình Đúng

### Bước 1: Tạo Route TRƯỚC
Mở `src/app/app.routes.ts`:
```typescript
{
  path: 'dashboard',
  children: [
    {
      path: 'your-feature',  // ← Không có dấu /
      component: YourComponent,
    }
  ]
}
```

### Bước 2: Test Route
Gõ vào browser: `http://localhost:4200/dashboard/your-feature`
- ✅ Nếu hiển thị page → Route OK
- ❌ Nếu 404 → Sửa route

### Bước 3: Thêm Vào Sidebar
Mở `src/app/components/layouts/dashboard/dashboard-layout.module.ts`:
```typescript
menus: [
  {
    title: 'Your Feature',
    icon: 'icon-name',
    link: '/dashboard/your-feature',  // ← /dashboard/ + path ở trên
  }
]
```

### Bước 4: Test Sidebar
- Click vào menu
- ✅ Navigate đúng page → Hoàn thành
- ❌ Không navigate → Kiểm tra lại path

## 🔍 Kiểm Tra Nhanh

### Công thức kiểm tra:
```typescript
// Route path (không có /)
path: 'abc/xyz'

// Sidebar link (có / ở đầu)  
link: '/dashboard/abc/xyz'
       ^^^^^^^^^^  ^^^^^^^
       prefix      route path
```

### Ví dụ cụ thể:

| Route (app.routes.ts) | Sidebar Link (dashboard-layout) | ✅/❌ |
|-----------------------|--------------------------------|------|
| `path: 'users'` | `link: '/dashboard/users'` | ✅ |
| `path: 'products/list'` | `link: '/dashboard/products/list'` | ✅ |
| `path: 'orders'` | `link: '/dashboard/order'` | ❌ |
| `path: 'shop'` | `link: '/dashboard/shops'` | ❌ |

## 🚨 Lỗi Thường Gặp

### 1. Click menu không navigate
```typescript
// ❌ Lỗi này xảy ra khi:
// Route: path: 'users'
// Sidebar: link: '/dashboard/user'  // Thiếu 's'

// ✅ Sửa lại:
// Sidebar: link: '/dashboard/users'
```

### 2. Redirect về dashboard
```typescript
// ❌ Lỗi này xảy ra khi:
// Sidebar có link nhưng route chưa tồn tại

// ✅ Sửa: Tạo route trước, hoặc xóa menu đó
```

### 3. Path có dấu / sai
```typescript
// ❌ SAI
path: '/users'  // Route không được có / ở đầu
link: 'dashboard/users'  // Sidebar phải có / ở đầu
link: '/dashboard/users/'  // Không được có / ở cuối

// ✅ ĐÚNG
path: 'users'
link: '/dashboard/users'
```

## 📋 Checklist

Trước khi commit code, kiểm tra:

- [ ] Mọi menu trong sidebar đều có route tương ứng trong `app.routes.ts`
- [ ] Path khớp chính xác: `/dashboard/` + route path
- [ ] Đã test tất cả menu bằng cách click
- [ ] Không có menu nào redirect về dashboard
- [ ] Route có component hoặc redirectTo
- [ ] Component đã được import và export đúng

## 🔧 Script Kiểm Tra (Optional)

Bạn có thể tạo script để tự động kiểm tra:

```typescript
// check-routes.ts
const sidebarLinks = [
  '/dashboard/users',
  '/dashboard/products',
  // ... tất cả links từ sidebar
];

const routes = [
  'users',
  'products',
  // ... tất cả paths từ routes
];

sidebarLinks.forEach(link => {
  const path = link.replace('/dashboard/', '');
  if (!routes.includes(path)) {
    console.error(`❌ Sidebar link "${link}" không có route tương ứng!`);
  }
});
```

## 📚 Tài Liệu Liên Quan

- [SIDEBAR_GUIDE.md](SIDEBAR_GUIDE.md) - Hướng dẫn chi tiết về sidebar
- [README_CRUD_IMPLEMENTATION.md](README_CRUD_IMPLEMENTATION.md) - Hướng dẫn tạo CRUD pages
- [app.routes.ts](src/app/app.routes.ts) - File routes
- [dashboard-layout.module.ts](src/app/components/layouts/dashboard/dashboard-layout.module.ts) - File sidebar

---

**Cập nhật:** 16/01/2026  
**Tác giả:** System Documentation
