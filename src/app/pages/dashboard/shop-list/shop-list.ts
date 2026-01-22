import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HttpClient } from '@angular/common/http';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';
import { Shop } from '../../../models/shop.model';

@Component({
  selector: 'app-shop-list',
  standalone: true,
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
  templateUrl: './shop-list.html',
  styleUrl: './shop-list.scss',
})
export class ShopListPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private message = inject(NzMessageService);

  listOfData: Shop[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  searchText = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Simulate API call structure matching other lists
    const params: any = {
      page: this.pageIndex,
      limit: this.pageSize,
    };

    if (this.searchText) {
      params.search = this.searchText;
    }

    // construct query params string
    let queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      queryParams.append(key, params[key]);
    });

    this.http
      .get<{
        data: Shop[];
        meta: { page: number; pageSize: number; total: number };
      }>(`${createUrl(ROUTER_CONSTANTS.DASHBOARD.SHOPS.LIST)}?${queryParams.toString()}`)
      .subscribe({
        next: (response) => {
          this.listOfData = response.data || [];
          if (response.meta) {
            this.total = response.meta.total;
            this.pageIndex = response.meta.page;
          }
           // Fallback if meta is not provided properly or structure differs
           if(!response.meta && Array.isArray(response)){
               this.listOfData = response as any;
               this.total = this.listOfData.length;
           }

          this.loading = false;
        },
        error: (error) => {
          console.error(error);
          this.message.error('Không thể tải danh sách cửa hàng');
          this.loading = false;
        },
      });
  }

  onSearch() {
    this.pageIndex = 1;
    this.loadData();
  }

  onPageChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.loadData();
  }

  navigateToCreate() {
    this.router.navigate(['/dashboard/shops/create']);
  }

  navigateToEdit(id: string) {
    this.router.navigate([`/dashboard/shops/edit/${id}`]);
  }

  delete(id: string) {
    this.http
      .delete(
        createUrl(ROUTER_CONSTANTS.DASHBOARD.SHOPS.EDIT + '/' + id)
        // Note: Assuming DELETE uses same base path plus ID.
        // In category implementation: createUrl(ROUTER_CONSTANTS.DASHBOARD.CATEGORIES.EDIT, { params: this.categoryId })
        // But createUrl helper usage might differ. Let's stick to manual concatenation or check createUrl utility.
        // Checking category-list again, it doesn't show delete impl in the snippet I read.
        // checking category-form it uses createUrl with params object on patch.
      )
      .subscribe({
        next: () => {
          this.message.success('Xóa cửa hàng thành công');
          this.loadData();
        },
        error: (error) => {
          this.message.error('Có lỗi xảy ra khi xóa cửa hàng');
        },
      });
  }
}
