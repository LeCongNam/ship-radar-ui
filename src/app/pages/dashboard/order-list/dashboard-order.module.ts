import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';
import { Order } from '../../../models/order.model';
import { NzTooltipDirective, NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ORDER_CONSTANTS, ORDER_STATUS } from '../../../../constants/order.constant';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DashboardLayout,
    NzTableModule,
    NzPaginationModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzTagModule,
    NzInputModule,
    NzSelectModule,
    NzTooltipModule,
  ],
  templateUrl: './dashboard-order-list.html',
  styleUrl: './dashboard-order-list.scss',
})
export class DashboardOrderListPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private message = inject(NzMessageService);

  listOfData: Order[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  searchText = '';
  statusFilter = 'all';
  isRefreshing = false;

  orderStatusOptions = [...ORDER_CONSTANTS.STATUS];

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      this.searchText = value;
      this.pageIndex = 1;
      this.loadData();
    });
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.isRefreshing = true;

    // Construct query parameters
    const query: any = {
      page: this.pageIndex,
      pageSize: this.pageSize,
    };

    if (this.searchText) {
      query.search = this.searchText;
    }

    if (this.statusFilter !== 'all') {
      query.status = this.statusFilter;
    }

    this.http
      .get<{
        data: Order[];
        metadata: { page: number; pageSize: number; total: number };
      }>(createUrl(ROUTER_CONSTANTS.DASHBOARD.ORDERS.LIST, { query }))
      .subscribe({
        next: (data) => {
          this.listOfData = data.data;
          this.total = data.metadata.total;
          this.loading = false;
          this.isRefreshing = false;
        },
        error: () => {
          this.loading = false;
          this.isRefreshing = false;
        },
      });
  }

  updateStatus(id: number, status: string) {
    this.http
      .patch(createUrl(`${ROUTER_CONSTANTS.DASHBOARD.ORDERS.LIST}/${id}/status`), {
        status,
      })
      .subscribe({
        next: () => {
          this.message.success('Cập nhật trạng thái thành công');
          this.loadData();
        },
        error: (err) => {
          console.error(err);

          this.message.error(err?.error?.message || 'Cập nhật trạng thái thất bại');
        },
      });
  }

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  onFilterChange() {
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
    this.router.navigate(['/dashboard/orders/create']);
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'gold';
      case 'processing':
        return 'blue';
      case 'shipping':
        return 'cyan';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status || 'N/A';
    }
  }

  shippingInProgress = new Set<number>();

  isShipping(id: number): boolean {
    return this.shippingInProgress.has(id);
  }

  shipOrder(id: number): void {
    this.shippingInProgress.add(id);
    this.http
      .patch(createUrl(`${ROUTER_CONSTANTS.DASHBOARD.ORDERS.LIST}/${id}/status`), {
        status: ORDER_STATUS.SHIPPING,
      })
      .subscribe({
        next: () => {
          this.message.success('Cập nhật trạng thái thành công');
          const order = this.listOfData.find((o) => o.id === id);
          if (order) {
            order.status = ORDER_STATUS.SHIPPING;
          }
          setTimeout(() => this.shippingInProgress.delete(id), 1000);
        },
        error: () => {
          this.message.error('Cập nhật trạng thái thất bại');
          setTimeout(() => this.shippingInProgress.delete(id), 1000);
        },
      });
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        this.message.success('Order barcode copied to clipboard!');
      },
      () => {
        this.message.error('Failed to copy order barcode.');
      },
    );
  }
}
