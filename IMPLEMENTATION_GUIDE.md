# Implementation Guide: Remaining Models

## Overview
This document provides code templates for creating CRUD pages for the remaining models. Each model follows the same pattern with:
1. List page with table and drawer
2. Create/Edit form page
3. Routing configuration

## Completed Models ✓
- ✅ User
- ✅ Product
- ✅ Category

## Remaining Models to Implement

### 1. Role Management

#### File: `src/app/pages/dashboard/role-list/role-list.html`
```html
<app-dashboard-layout>
  <div class="page-header">
    <h2>Quản lý vai trò</h2>
  </div>

  <div class="button-add-box">
    <div class="box-search">
      <input nz-input placeholder="Tìm kiếm vai trò" [(ngModel)]="searchText" (ngModelChange)="onSearch()" />
      <div class="search-box">
        <nz-icon nzType="search" nzTheme="outline" class="icon-search"></nz-icon>
      </div>
    </div>

    <button nz-button nzType="primary" (click)="navigateToCreate()">
      <nz-icon nzType="plus" nzTheme="outline" />
      Thêm vai trò
    </button>
  </div>

  <div>
    <nz-table #basicTable [nzData]="listOfData" [nzLoading]="loading" nzShowPagination="false" nzBordered>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên vai trò</th>
          <th>Mô tả</th>
          <th>Số người dùng</th>
          <th>Số quyền</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        @for (data of basicTable.data; track data.id) {
          <tr>
            <td><a (click)="navigateToEdit(data.id)">{{ data.id }}</a></td>
            <td>{{ data.name }}</td>
            <td>{{ data.description }}</td>
            <td>{{ data.userCount || 0 }}</td>
            <td>{{ data.permissionCount || 0 }}</td>
            <td>
              <a (click)="showDetail(data)">Xem</a>
              <nz-divider nzType="vertical"></nz-divider>
              <a (click)="showQuickEdit(data)">Sửa nhanh</a>
              <nz-divider nzType="vertical"></nz-divider>
              <a (click)="delete(data.id)" class="text-danger">Xóa</a>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  </div>

  <div class="pagination">
    <nz-pagination [nzPageIndex]="pageIndex" [nzTotal]="total" [nzPageSize]="pageSize"
      [nzPageSizeOptions]="[10, 20, 50]" (nzPageIndexChange)="onPageChange($event)"
      (nzPageSizeChange)="onPageSizeChange($event)" [nzShowSizeChanger]="true">
    </nz-pagination>
  </div>
</app-dashboard-layout>

<nz-drawer [nzVisible]="drawerVisible" [nzWidth]="720" [nzTitle]="drawerTitle" (nzOnClose)="closeDrawer()">
  @if (selectedRole) {
    @if (isEditMode) {
      <form nz-form [formGroup]="editForm" (ngSubmit)="saveQuickEdit()">
        <nz-form-item>
          <nz-form-label nzRequired>Tên vai trò</nz-form-label>
          <nz-form-control>
            <input nz-input formControlName="name" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label>Mô tả</nz-form-label>
          <nz-form-control>
            <textarea nz-input formControlName="description" [nzAutosize]="{ minRows: 3, maxRows: 6 }"></textarea>
          </nz-form-control>
        </nz-form-item>

        <div class="drawer-footer">
          <button type="button" nz-button (click)="closeDrawer()">Hủy</button>
          <button type="submit" nz-button nzType="primary" [nzLoading]="loading">Lưu</button>
        </div>
      </form>
    } @else {
      <nz-descriptions nzBordered [nzColumn]="1">
        <nz-descriptions-item nzTitle="ID">{{ selectedRole.id }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="Tên vai trò">{{ selectedRole.name }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="Mô tả">{{ selectedRole.description }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="Số người dùng">{{ selectedRole.userCount || 0 }}</nz-descriptions-item>
        <nz-descriptions-item nzTitle="Số quyền">{{ selectedRole.permissionCount || 0 }}</nz-descriptions-item>
      </nz-descriptions>
    }
  }
</nz-drawer>
```

#### File: `src/app/pages/dashboard/role-list/role-list.ts`
```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';

interface Role {
  id: number;
  name: string;
  description?: string;
  userCount?: number;
  permissionCount?: number;
}

@Component({
  selector: 'app-role-list',
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, DashboardLayout,
    NzTableModule, NzPaginationModule, NzButtonModule, NzIconModule,
    NzDividerModule, NzDrawerModule, NzDescriptionsModule,
    NzFormModule, NzInputModule,
  ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.scss',
})
export class RoleListPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);

  listOfData: Role[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  searchText = '';

  drawerVisible = false;
  drawerTitle = '';
  selectedRole: Role | null = null;
  isEditMode = false;
  editForm!: FormGroup;

  ngOnInit() {
    this.initEditForm();
    this.loadData();
  }

  initEditForm() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  loadData() {
    this.loading = true;
    setTimeout(() => {
      const mockData: Role[] = [
        { id: 1, name: 'Admin', description: 'Quản trị viên hệ thống', userCount: 5, permissionCount: 20 },
        { id: 2, name: 'Manager', description: 'Quản lý', userCount: 15, permissionCount: 10 },
        { id: 3, name: 'Staff', description: 'Nhân viên', userCount: 50, permissionCount: 5 },
      ];
      this.listOfData = mockData;
      this.total = mockData.length;
      this.loading = false;
    }, 500);
  }

  onSearch() { this.pageIndex = 1; this.loadData(); }
  onPageChange(page: number) { this.pageIndex = page; this.loadData(); }
  onPageSizeChange(size: number) { this.pageSize = size; this.pageIndex = 1; this.loadData(); }
  navigateToCreate() { this.router.navigate(['/dashboard/roles/create']); }
  navigateToEdit(id: number) { this.router.navigate(['/dashboard/roles/edit', id]); }

  showDetail(role: Role) {
    this.selectedRole = role;
    this.isEditMode = false;
    this.drawerTitle = 'Chi tiết vai trò';
    this.drawerVisible = true;
  }

  showQuickEdit(role: Role) {
    this.selectedRole = role;
    this.isEditMode = true;
    this.drawerTitle = 'Sửa nhanh';
    this.drawerVisible = true;
    this.editForm.patchValue({ name: role.name, description: role.description });
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.selectedRole = null;
    this.editForm.reset();
  }

  saveQuickEdit() {
    if (this.editForm.valid && this.selectedRole) {
      this.loading = true;
      setTimeout(() => {
        this.message.success('Cập nhật thành công');
        this.loading = false;
        this.closeDrawer();
        this.loadData();
      }, 500);
    }
  }

  delete(id: number) { this.message.success('Xóa thành công'); }
}
```

### 2. Shop Management

#### File: `src/app/pages/dashboard/shop-list/shop-list.html`
Table columns: ID, Tên cửa hàng, Chủ sở hữu, Địa chỉ, Số điện thoại, Email, Trạng thái, Hành động

Interface:
```typescript
interface Shop {
  id: string;
  name: string;
  ownerId: number;
  ownerName?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}
```

### 3. Order Management

#### File: `src/app/pages/dashboard/order-list/order-list.html`
Table columns: ID, Tổng giá, Người nhận, SĐT người nhận, Địa chỉ, Trạng thái, Cửa hàng, Ngày tạo, Hành động

Interface:
```typescript
interface Order {
  id: number;
  totalPrice: number;
  status: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  noted?: string;
  shopId: string;
  shopName?: string;
  createdAt: string;
}
```

### 4. DeliveryBrand Management

#### File: `src/app/pages/dashboard/delivery-brand-list/delivery-brand-list.html`
Table columns: ID, Tên đơn vị vận chuyển, Website, Hotline, Email hỗ trợ, Trạng thái, Hành động

Interface:
```typescript
interface DeliveryBrand {
  id: number;
  name: string;
  website?: string;
  hotline?: string;
  supportEmail?: string;
  supportPhone?: string;
  isActive: boolean;
  createdAt: string;
}
```

### 5. Shipping Management

#### File: `src/app/pages/dashboard/shipping-list/shipping-list.html`
Table columns: ID, Đơn hàng, Đơn vị vận chuyển, Mã tracking, Shipper, SĐT Shipper, Biển số xe, COD, Trạng thái, Hành động

Interface:
```typescript
interface Shipping {
  id: number;
  orderId: number;
  deliveryBrandId: number;
  deliveryBrandName?: string;
  trackingNumber: string;
  shipperName: string;
  shipperPhone: string;
  licensePlate?: string;
  type: string;
  isCod: boolean;
  codAmount?: number;
  status: string;
  createdAt: string;
}
```

## Common SCSS Template

Use this for all list pages (`*-list.scss`):

```scss
.page-header {
  margin-bottom: 24px;
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
}

.button-add-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;

  .box-search {
    position: relative;
    flex: 1;
    max-width: 400px;
    input { padding-right: 40px; }
    .search-box {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      .icon-search {
        font-size: 16px;
        color: #999;
      }
    }
  }
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.text-danger {
  color: #ff4d4f;
  &:hover { color: #ff7875; }
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
```

## Form Page SCSS Template

Use this for all form pages (`*-form.scss`):

```scss
.page-header {
  margin-bottom: 24px;
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
}

.form-container {
  max-width: 800px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 32px;
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
```

## Routes to Add

Add to `src/app/app.routes.ts`:

```typescript
// Roles
{
  path: 'roles',
  component: RoleListPage,
},
{
  path: 'roles/create',
  component: RoleFormPage,
},
{
  path: 'roles/edit/:id',
  component: RoleFormPage,
},
// Shops
{
  path: 'shops',
  component: ShopListPage,
},
{
  path: 'shops/create',
  component: ShopFormPage,
},
{
  path: 'shops/edit/:id',
  component: ShopFormPage,
},
// Orders
{
  path: 'orders',
  component: OrderListPage,
},
{
  path: 'orders/create',
  component: OrderFormPage,
},
{
  path: 'orders/edit/:id',
  component: OrderFormPage,
},
// Delivery Brands
{
  path: 'delivery-brands',
  component: DeliveryBrandListPage,
},
{
  path: 'delivery-brands/create',
  component: DeliveryBrandFormPage,
},
{
  path: 'delivery-brands/edit/:id',
  component: DeliveryBrandFormPage,
},
// Shipping
{
  path: 'shipping',
  component: ShippingListPage,
},
{
  path: 'shipping/create',
  component: ShippingFormPage,
},
{
  path: 'shipping/edit/:id',
  component: ShippingFormPage,
},
```

## Exports to Add

Add to `src/app/pages/index.ts`:

```typescript
// Role Management
export * from './dashboard/role-list/role-list';
export * from './dashboard/role-form/role-form';

// Shop Management
export * from './dashboard/shop-list/shop-list';
export * from './dashboard/shop-form/shop-form';

// Order Management  
export * from './dashboard/order-list/order-list';
export * from './dashboard/order-form/order-form';

// DeliveryBrand Management
export * from './dashboard/delivery-brand-list/delivery-brand-list';
export * from './dashboard/delivery-brand-form/delivery-brand-form';

// Shipping Management
export * from './dashboard/shipping-list/shipping-list';
export * from './dashboard/shipping-form/shipping-form';
```

## Implementation Steps

For each remaining model:

1. Create list page files:
   - `*-list.html` (copy from User/Product/Category and adjust)
   - `*-list.ts` (copy and change interface/fields)
   - `*-list.scss` (use common template)

2. Create form page files:
   - `*-form.html` (create form based on model fields)
   - `*-form.ts` (implement form logic)
   - `*-form.scss` (use common template)

3. Update `pages/index.ts` with exports

4. Update `app.routes.ts` with routes

5. Import components in routes file

## Notes

- All mock data uses `setTimeout` for simulating API calls
- Replace `// TODO` comments with actual API calls
- All forms use Reactive Forms with validation
- Drawers are used for quick view/edit
- Full page navigation for detailed edit
- Tables use ng-zorro pagination
