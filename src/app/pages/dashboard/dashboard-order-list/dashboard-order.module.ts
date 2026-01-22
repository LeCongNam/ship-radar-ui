import { Component, inject } from '@angular/core';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClient } from '@angular/common/http';

export interface Data {
  id: string;
  name: string;
  age: number;
  address: string;
  disabled: boolean;
}

@Component({
  selector: 'app-orders',
  imports: [
    DashboardLayout,
    NzDividerModule,
    NzTableModule,
    NzPaginationModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './dashboard-order-list.html',
  styleUrl: './dashboard-order-list.scss',
})
export class DashboardOrderListPage {
  listOfData: any[] = [];
  pageIndex = 1;
  pageSize = 10;
  total = 100;

  private http = inject(HttpClient);

  ngOnInit() {
    this.loadData(this.pageIndex, this.pageSize);
  }

  loadData(pageIndex: number, pageSize: number) {
    // // API backend phải trả về { data: [], total: number }
    // this.http.get<any>(`/api/users?page=${pageIndex}&limit=${pageSize}`).subscribe((res) => {
    //   this.listOfData = res.data;
    //   this.total = res.total;
    // });

    this.http.get('http://localhost:3001/api/customers/profile').subscribe({});

    const mockData: Data[] = [];
    for (let i = 1; i <= 10; i++) {
      const random = Math.floor(Math.random() * 1000);
      mockData.push({
        id: i.toString(),
        name: `Người dùng ${random}`,
        age: 20 + (i % 30),
        address: `Địa chỉ số ${random}`,
        disabled: i % 10 === 0,
      });
    }

    this.listOfData = mockData;

    return mockData;
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadData(this.pageIndex, this.pageSize);
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1; // reset về page 1
    this.loadData(this.pageIndex, this.pageSize);
  }
}
