import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';

@Component({
  selector: 'app-category-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardLayout,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  categoryForm!: FormGroup;
  loading = false;
  isEditMode = false;
  categoryId: string | null = null;

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isActive: [true],
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.categoryId = id;
      this.loadCategoryData(this.categoryId);
    }
  }

  loadCategoryData(id: string) {
    this.loading = true;
    this.http
      .get(
        createUrl(ROUTER_CONSTANTS.DASHBOARD.CATEGORIES.EDIT, {
          params: id,
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.categoryForm.patchValue(response.data);
          this.loading = false;
        },
        error: (error) => {
          this.message.error('Đã có lỗi xảy ra khi tải dữ liệu danh mục. Vui lòng thử lại.');
          this.loading = false;
        },
      });

    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.loading = true;
      const formData = { ...this.categoryForm.value };

      if (this.isEditMode && this.categoryId) {
        this.http
          .patch(
            createUrl(ROUTER_CONSTANTS.DASHBOARD.CATEGORIES.EDIT, {
              params: this.categoryId,
            }),
            formData,
          )
          .subscribe({
            error: (error) => {
              this.message.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
              this.loading = false;
            },
          });
      } else {
        this.http
          .post(createUrl(ROUTER_CONSTANTS.DASHBOARD.CATEGORIES.CREATE), formData)
          .subscribe({
            next: (response) => {
              this.message.success(
                this.isEditMode ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công',
              );
              this.loading = false;
              this.goBack();
            },
            error: (error) => {
              this.message.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
              this.loading = false;
            },
          });
      }

      setTimeout(() => {
        this.message.success(
          this.isEditMode ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công',
        );
        this.loading = false;
        this.goBack();
      }, 500);
    } else {
      Object.values(this.categoryForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/categories']);
  }
}
