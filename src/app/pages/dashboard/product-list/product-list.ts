import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { createUrl } from '../../../../shared';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku: string;
  stock: number;
  categoryId: string;
  category?: { name: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardLayout,
    NzTableModule,
    NzPaginationModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzTagModule,
    NzDrawerModule,
    NzDescriptionsModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzInputNumberModule,
    RouterLink,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);

  listOfData: Product[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  searchText = '';

  drawerVisible = false;
  drawerTitle = '';
  selectedProduct: Product | null = null;
  isEditMode = false;
  editForm!: FormGroup;

  ngOnInit() {
    this.initEditForm();
    this.loadData();
  }

  initEditForm() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      isActive: [true],
    });
  }

  loadData() {
    this.loading = true;

    setTimeout(() => {
      this.http
        .get<{
          data: Product[];
          meta: { page: number; pageSize: number; total: number };
        }>(
          createUrl(ROUTER_CONSTANTS.DASHBOARD.PRODUCTS.LIST, {
            query: {
              page: this.pageIndex,
              pageSize: this.pageSize,
              // search: this.searchText,
            },
          }),
        )
        .subscribe({
          next: (data) => {
            this.listOfData = data.data;
            this.total = data.meta.total;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });

      this.total = 100;
      this.loading = false;
    }, 500);
  }

  onSearch() {
    this.pageIndex = 1;
    this.loadData();
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadData();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadData();
  }

  navigateToCreate() {
    this.router.navigate(['/dashboard/products/create']);
  }

  navigateToEdit(id: string) {
    this.router.navigate(['/dashboard/products/edit', id]);
  }

  showDetail(product: Product) {
    this.selectedProduct = product;
    this.isEditMode = false;
    this.drawerTitle = 'Chi tiết sản phẩm';
    this.drawerVisible = true;
  }

  showQuickEdit(product: Product) {
    this.selectedProduct = product;
    this.isEditMode = true;
    this.drawerTitle = 'Sửa nhanh';
    this.drawerVisible = true;

    this.editForm.patchValue({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      description: product.description,
      isActive: product.isActive,
    });
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.selectedProduct = null;
    this.editForm.reset();
  }

  saveQuickEdit() {
    if (this.editForm.valid && this.selectedProduct) {
      this.loading = true;
      setTimeout(() => {
        this.message.success('Cập nhật thành công');
        this.loading = false;
        this.closeDrawer();
        this.loadData();
      }, 500);
    }
  }

  delete(id: string) {
    this.message.success('Xóa thành công');
  }
}
