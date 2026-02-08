import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Shipping {
  id: string;
  orderId: string;
  code: string;
  status: string;
  type: string;
  createdAt: string;
}

@Component({
  selector: 'app-shipping-list',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayout,
    NzTableModule,
    NzPaginationModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzTagModule,
    NzInputModule,
    FormsModule,
  ],
  templateUrl: './shipping-list.html',
  styleUrl: './shipping-list.scss',
})
export class ShippingListPage implements OnInit {
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  listOfData: Shipping[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  searchText = '';
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
    const params: any = {
      page: this.pageIndex,
      limit: this.pageSize,
    };
    if (this.searchText) {
      params.q = this.searchText;
    }

    this.http
      .get<{
        data: Shipping[];
        meta: { total: number };
      }>(createUrl(ROUTER_CONSTANTS.DASHBOARD.SHIPPING), { params })
      .subscribe({
        next: (res) => {
          this.listOfData = res.data || [];
          this.total = res.meta?.total || 0;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.message.error('Không thể tải danh sách vận chuyển');
          this.loading = false;
        },
      });
  }

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  changePageIndex(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.loadData();
  }
}
