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
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalService } from 'ng-zorro-antd/modal';

interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  username: string;
  bio?: string;
  avatar?: string;
  dob?: string;
  phoneNumber?: string;
  isVerifyEmail: boolean;
  isVerifyPhone: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-user-list',
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
    RouterLink,
    NzSwitchModule,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  providers: [NzModalService],
})
export class UserListPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);

  listOfData: User[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  searchText = '';

  drawerVisible = false;
  drawerTitle = '';
  selectedUser: User | null = null;
  isEditMode = false;
  editForm!: FormGroup;
  private modal = inject(NzModalService); // Inject service

  ngOnInit() {
    this.initEditForm();
    this.loadData();
  }

  initEditForm() {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      username: ['', Validators.required],
      phoneNumber: [''],
      bio: [''],
      isActive: [true],
    });
  }

  loadData() {
    this.loading = true;
    // TODO: Replace with actual API call
    this.http
      .get<any>(
        createUrl(ROUTER_CONSTANTS.DASHBOARD.USERS.LIST, {
          query: {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          },
        }),
      )
      .subscribe({
        next: (res) => {
          this.listOfData = res.data;
          this.total = res.total;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);

          this.loading = false;
          this.message.error('Không thể tải dữ liệu');
        },
      });

    // Mock data
    setTimeout(() => {
      // const mockData: User[] = [];
      // for (let i = 1; i <= 10; i++) {
      //   mockData.push({
      //     id: i,
      //     email: `user${i}@example.com`,
      //     firstName: `Nguyễn`,
      //     lastName: `Văn ${String.fromCharCode(64 + i)}`,
      //     username: `user${i}`,
      //     bio: `Bio của người dùng ${i}`,
      //     phoneNumber: `090000000${i}`,
      //     isVerifyEmail: i % 2 === 0,
      //     isVerifyPhone: i % 3 === 0,
      //     isActive: i % 4 !== 0,
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString(),
      //   });
      // }
      // this.listOfData = mockData;
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
    this.router.navigate(['/dashboard/users/create']);
  }

  navigateToEdit(id: number) {
    this.router.navigate(['/dashboard/users/edit', id]);
  }

  showDetail(user: User) {
    this.selectedUser = user;
    this.isEditMode = false;
    this.drawerTitle = 'Chi tiết người dùng';
    this.drawerVisible = true;
  }

  showQuickEdit(user: User) {
    this.selectedUser = user;
    this.isEditMode = true;
    this.drawerTitle = 'Sửa nhanh';
    this.drawerVisible = true;

    this.editForm.patchValue({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      isActive: user.isActive,
    });
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.selectedUser = null;
    this.editForm.reset();
  }

  saveQuickEdit() {
    if (this.editForm.valid && this.selectedUser) {
      this.loading = true;

      // TODO: Replace with actual API call
      // this.http.put(`/api/users/${this.selectedUser.id}`, this.editForm.value)
      //   .subscribe({
      //     next: () => {
      //       this.message.success('Cập nhật thành công');
      //       this.closeDrawer();
      //       this.loadData();
      //     },
      //     error: () => {
      //       this.loading = false;
      //       this.message.error('Cập nhật thất bại');
      //     }
      //   });

      setTimeout(() => {
        this.message.success('Cập nhật thành công');
        this.loading = false;
        this.closeDrawer();
        this.loadData();
      }, 500);
    }
  }

  delete(id: number) {
    // TODO: Add confirmation modal
    // this.http.delete(`/api/users/${id}`).subscribe({
    //   next: () => {
    //     this.message.success('Xóa thành công');
    //     this.loadData();
    //   },
    //   error: () => {
    //     this.message.error('Xóa thất bại');
    //   }
    // });

    this.message.success('Xóa thành công');
  }

  confirmStatusChange(user: User): void {
    const nextStatus = !user.isActive;
    const actionText = nextStatus ? 'kích hoạt' : 'khóa';

    this.modal.confirm({
      nzTitle: `Xác nhận thay đổi`,
      nzContent: `Bạn có chắc chắn muốn <b>${actionText}</b> người dùng <b>${user.username}</b> không?`,
      nzOkText: 'Đồng ý',
      nzOkType: 'primary',
      nzOkDanger: !nextStatus,
      nzOnOk: () => {
        // Gọi API khi nhấn OK
        this.updateUserStatus(user, nextStatus);
      },
      nzCancelText: 'Hủy',
    });
  }

  updateUserStatus(user: User, newStatus: boolean) {
    this.loading = true;

    // Giả sử API của bạn cần ID và trạng thái mới
    const url = createUrl(ROUTER_CONSTANTS.DASHBOARD.USERS.LIST + `/${user.id}/status`);

    this.http.put(url, { isActive: newStatus }).subscribe({
      next: () => {
        user.isActive = newStatus; // Cập nhật UI sau khi thành công
        this.message.success('Cập nhật trạng thái thành công');
        this.loading = false;
      },
      error: (err) => {
        this.message.error('Lỗi hệ thống, không thể cập nhật');
        this.loading = false;
        console.error(err);
      },
    });
  }
}
