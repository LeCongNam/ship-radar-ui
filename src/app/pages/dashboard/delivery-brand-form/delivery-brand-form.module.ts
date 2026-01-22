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
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { HttpClient } from '@angular/common/http';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';

@Component({
  selector: 'app-delivery-brand-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardLayout,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzTimePickerModule,
  ],
  templateUrl: './delivery-brand-form.html',
  styleUrl: './delivery-brand-form.scss',
})
export class DeliveryBrandFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  brandForm!: FormGroup;
  loading = false;
  isEditMode = false;
  brandId: string | null = null;

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      website: [''],
      hotline: [''],
      supportEmail: ['', [Validators.email]],
      supportPhone: [''],
      time_pickup_from: [null],
      time_pickup_to: [null],
      operating_hours: [''],
      opening_time: [null],
      closing_time: [null],
      isActive: [true],
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.brandId = id;
      this.loadBrandData(this.brandId);
    }
  }

  loadBrandData(id: string) {
    this.loading = true;
    this.http
      .get(
        createUrl(ROUTER_CONSTANTS.DASHBOARD.DELIVERY_BRANDS.EDIT, {
          params: id,
        }),
      )
      .subscribe({
        next: (response: any) => {
          const data = response.data;
          // Convert date strings to Date objects for time pickers
          if (data.time_pickup_from) data.time_pickup_from = new Date(data.time_pickup_from);
          if (data.time_pickup_to) data.time_pickup_to = new Date(data.time_pickup_to);
          if (data.opening_time) data.opening_time = new Date(data.opening_time);
          if (data.closing_time) data.closing_time = new Date(data.closing_time);

          this.brandForm.patchValue(data);
          this.loading = false;
        },
        error: (error) => {
          this.message.error(
            'Đã có lỗi xảy ra khi tải dữ liệu đối tác vận chuyển. Vui lòng thử lại.',
          );
          this.loading = false;
        },
      });

    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.brandForm.valid) {
      this.loading = true;
      const formData = { ...this.brandForm.value };

      if (this.isEditMode && this.brandId) {
        this.http
          .patch(
            createUrl(ROUTER_CONSTANTS.DASHBOARD.DELIVERY_BRANDS.EDIT, {
              params: this.brandId,
            }),
            formData,
          )
          .subscribe({
            next: () => {
              this.message.success('Cập nhật đối tác vận chuyển thành công');
              this.router.navigate([ROUTER_CONSTANTS.DASHBOARD.DELIVERY_BRANDS.LIST]);
            },
            error: () => {
              this.message.error('Cập nhật thất bại');
              this.loading = false;
            },
          });
      } else {
        this.http
          .post(createUrl(ROUTER_CONSTANTS.DASHBOARD.DELIVERY_BRANDS.CREATE), formData)
          .subscribe({
            next: () => {
              this.message.success('Tạo đối tác vận chuyển thành công');
              this.router.navigate([ROUTER_CONSTANTS.DASHBOARD.DELIVERY_BRANDS.LIST]);
            },
            error: () => {
              this.message.error('Tạo thất bại');
              this.loading = false;
            },
          });
      }
    } else {
      Object.keys(this.brandForm.controls).forEach((key) => {
        const control = this.brandForm.get(key);
        if (control?.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goBack() {
    this.router.navigate([ROUTER_CONSTANTS.DASHBOARD.DELIVERY_BRANDS.LIST]);
  }
}
