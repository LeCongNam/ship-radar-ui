import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';
import { DeliveryBrand } from '../../../models/delivery-brand.model';

@Component({
  selector: 'app-delivery-brand-list',
  imports: [
    CommonModule,
    FormsModule,
    DashboardLayout,
    NzTableModule,
    NzPaginationModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzTagModule,
    NzPopconfirmModule,
    NzInputModule,
  ],
  templateUrl: './delivery-brand-list.html',
  styleUrl: './delivery-brand-list.scss',
})
export class DeliveryBrandList implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private message = inject(NzMessageService);

  listOfData: DeliveryBrand[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  searchText = '';
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.searchText = value;
        this.pageIndex = 1;
        this.loadData();
      });
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Construct params for search and pagination if backend supports it
    // For now assuming simple get
    const params: any = {
      page: this.pageIndex,
      limit: this.pageSize,
    };

    if (this.searchText) {
      params.q = this.searchText;
    }

    this.http
      .get<{
        data: DeliveryBrand[];
        meta: { page: number; pageSize: number; total: number };
      }>(createUrl(ROUTER_CONSTANTS.DASHBOARD.DELIVERY_BRANDS.LIST), { params })
      .subscribe({
        next: (res) => {
          this.listOfData = res.data || [];
          // Adjust based on actual API response structure
          this.total = res.meta?.total || 0;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.message.error('Không thể tải danh sách đối tác vận chuyển');
          this.loading = false;
        },
      });
  }

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  navigateToCreate() {
    this.router.navigate(['dashboard/delivery-brands/create']);
  }

  navigateToEdit(id: number | string) {
    // The createUrl helper might handle parameter replacement if defined like :id
    // But since the constant is likely just the base path, we construct the array for router.navigate
    // Checking api-router.constant.ts again
    // IT was: EDIT: 'dashboard/delivery-brands',
    // But my earlier edit changed it to object structure.

    // Actually the router constant is usually the URL string.
    // If I check router constants:
    // DELIVERY_BRANDS: { LIST: 'dashboard/delivery-brands', CREATE: 'dashboard/delivery-brands', EDIT: 'dashboard/delivery-brands' }
    // Wait, createUrl is for HTTP calls usually?
    // Let's re-read the router constant file to be sure how to use it for navigation vs api calls.
    // Ah, ROUTER_CONSTANTS contains API paths mostly?
    // "HOST: 'http://localhost:3001/api'," implies these are API routes.
    // The App Routes are in src/app/app.routes.ts
    // The App Route for edit is 'delivery-brands/edit/:id' (relative to dashboard)

    // So for navigation I should use the path defined in app.routes.ts
    // which corresponds to something like ['dashboard', 'delivery-brands', 'edit', id]

    this.router.navigate(['dashboard', 'delivery-brands', 'edit', id]);
  }

  delete(id: number | string) {
    this.http
      .delete(createUrl(ROUTER_CONSTANTS.DASHBOARD.DELIVERY_BRANDS.EDIT + '/' + id))
      .subscribe({
        next: () => {
          this.message.success('Xóa đối tác thành công');
          this.loadData();
        },
        error: () => {
          this.message.error('Xóa đối tác thất bại');
        },
      });
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
}
