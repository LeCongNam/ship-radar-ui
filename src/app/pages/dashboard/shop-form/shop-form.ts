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
  selector: 'app-shop-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardLayout,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
  ],
  templateUrl: './shop-form.html',
  styleUrl: './shop-form.scss',
})
export class ShopFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  shopForm!: FormGroup;
  loading = false;
  isEditMode = false;
  shopId: string | null = null;

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.shopForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      address: ['', Validators.required],
      isActive: [true],
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.shopId = id;
      this.loadShopData(this.shopId!);
    }
  }

  loadShopData(id: string) {
    this.loading = true;
    this.http
      .get(
        createUrl(ROUTER_CONSTANTS.DASHBOARD.SHOPS.DETAIL, {
          params: id,
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.shopForm.patchValue(response.data);
          this.loading = false;
        },
        error: (error) => {
          this.message.error('Đã có lỗi xảy ra khi tải dữ liệu cửa hàng. Vui lòng thử lại.');
          this.loading = false;
        },
      });
  }

  onSubmit() {
    if (this.shopForm.valid) {
      this.loading = true;
      const formData = { ...this.shopForm.value };

      if (this.isEditMode && this.shopId) {
        this.http
          .patch(
            createUrl(ROUTER_CONSTANTS.DASHBOARD.SHOPS.EDIT, {
              params: this.shopId,
            }),
            formData,
          )
          .subscribe({
            next: () => {
              this.message.success('Cập nhật cửa hàng thành công');
              this.goBack();
            },
            error: (error) => {
              this.message.error('Cập nhật cửa hàng thất bại');
              this.loading = false;
            },
          });
      } else {
        this.http
          .post(createUrl(ROUTER_CONSTANTS.DASHBOARD.SHOPS.CREATE), formData)
          .subscribe({
            next: () => {
              this.message.success('Tạo cửa hàng thành công');
              this.goBack();
            },
            error: (error) => {
              this.message.error('Tạo cửa hàng thất bại');
              this.loading = false;
            },
          });
      }
    } else {
      Object.values(this.shopForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/shops']);
  }
}
