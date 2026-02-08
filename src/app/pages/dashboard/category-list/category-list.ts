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
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';

interface Category {
  id: string;
  name: string;
  description?: string;
  productCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-category-list',
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
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryListPage {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);

  listOfData: Category[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  searchText = '';
  private searchSubject = new Subject<string>();

  drawerVisible = false;
  drawerTitle = '';
  selectedCategory: Category | null = null;
  isEditMode = false;
  editForm!: FormGroup;

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((value) => {
      this.searchText = value;
      this.pageIndex = 1;
      this.loadData();
    });
    this.initEditForm();
    this.loadData();
  }

  initEditForm() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isActive: [true],
    });
  }

  loadData() {
    this.loading = true;

    setTimeout(() => {
      this.http
        .get<{
          data: Category[];
          metadata: { page: number; pageSize: number; total: number };
        }>(createUrl(ROUTER_CONSTANTS.DASHBOARD.CATEGORIES.LIST))
        .subscribe({
          next: (data) => {
            this.listOfData = data.data;
            this.total = data.metadata.total;
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
    }, 500);
  }

  onSearch() {
    this.searchSubject.next(this.searchText);
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
    this.router.navigate(['/dashboard/categories/create']);
  }

  navigateToEdit(id: string) {
    this.router.navigate(['/dashboard/categories/edit', id]);
  }

  showDetail(category: Category) {
    this.selectedCategory = category;
    this.isEditMode = false;
    this.drawerTitle = 'Chi tiết danh mục';
    this.drawerVisible = true;
  }

  showQuickEdit(category: Category) {
    this.selectedCategory = category;
    this.isEditMode = true;
    this.drawerTitle = 'Sửa nhanh';
    this.drawerVisible = true;

    this.editForm.patchValue({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.selectedCategory = null;
    this.editForm.reset();
  }

  saveQuickEdit() {
    if (this.editForm.valid && this.selectedCategory) {
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
