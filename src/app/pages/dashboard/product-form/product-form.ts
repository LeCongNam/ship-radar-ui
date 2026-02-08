import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { createUrl } from '../../../../shared';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormatPricePipe } from './format-price-pipe';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardLayout,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzInputNumberModule,
    NzSelectModule,
    NzGridModule,
    NzTooltipModule,
    NzIconModule,
    // FormatPricePipe,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductFormPage implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);
  private readonly SAFE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

  productForm!: FormGroup;
  loading = false;
  isEditMode = false;
  productId: string | null = null;
  categories: Array<{ id: string; name: string }> = [];

  // formatterVND = (value: number): string => `${value} đ`;
  // parserVND = (value: string): number => Number(value.replace(' đ', ''));

  ngOnInit() {
    this.initForm();
    this.loadCategories();
    this.checkEditMode();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      sku: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      description: [''],
      isActive: [true],
    });

    this.productForm.get('name')?.valueChanges.subscribe((name) => {
      if (!this.isEditMode) {
        // Chỉ tự động sinh mã khi tạo mới
        this.generateAutoSku(name);
      }
    });
  }

  generateAutoSku(name: string): void {
    if (!name) {
      this.productForm.get('sku')?.patchValue('');
      return;
    }

    // 1. Lấy tiền tố: Chuyển tiếng Việt có dấu thành không dấu, lấy các chữ cái đầu
    const prefix = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Khử dấu
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word[0].toUpperCase())
      .join('')
      .slice(0, 4); // Lấy tối đa 4 ký tự đầu

    // 2. Sinh Suffix: 4 ký tự ngẫu nhiên để phục vụ Index nhanh nhất
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += this.SAFE_CHARS.charAt(Math.floor(Math.random() * this.SAFE_CHARS.length));
    }

    const finalSku = `${prefix}-${suffix}`;

    // 3. Update vào form
    this.productForm.get('sku')?.patchValue(finalSku, { emitEvent: false });
  }

  loadCategories() {
    this.http
      .get(createUrl(ROUTER_CONSTANTS.DASHBOARD.CATEGORIES.LIST))
      .subscribe((response: any) => {
        this.categories = response.data || [];
      });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProductData(this.productId);
    }
  }

  loadProductData(id: string) {
    this.loading = true;

    let productData;
    this.http
      .get(
        createUrl(ROUTER_CONSTANTS.DASHBOARD.PRODUCTS.EDIT, {
          params: id,
        }),
      )
      .subscribe({
        next: (response: any) => {
          productData = response.data;
          this.productForm.patchValue({
            name: productData.name,
            sku: productData.sku,
            price: productData.price,
            stock: productData.stock,
            categoryId: productData.categoryId,
            description: productData.description,
            isActive: productData.isActive,
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.loading = true;
      const formData = { ...this.productForm.value };

      let isSuccess = false;

      if (this.isEditMode && this.productId) {
        this.http
          .patch(
            createUrl(ROUTER_CONSTANTS.DASHBOARD.PRODUCTS.EDIT, {
              params: this.productId,
            }),
            formData,
          )
          .subscribe({
            next: () => {
              this.message
                .loading('Đang cập nhật sản phẩm', { nzDuration: 1000 })
                .onClose!.pipe(
                  concatMap(
                    () =>
                      this.message.success('Cập nhật sản phẩm thành công', { nzDuration: 2500 })
                        .onClose!,
                  ),
                )
                .subscribe();
              isSuccess = true;
            },
            error: (responseError) => {
              this.message
                .loading('Đang cập nhật sản phẩm', { nzDuration: 1000 })
                .onClose!.pipe(
                  concatMap(
                    () =>
                      this.message.error(
                        `Cập nhật sản phẩm thất bại: ${responseError.error.message}`,
                        {
                          nzDuration: 5000,
                        },
                      ).onClose!,
                  ),
                )
                .subscribe();
              this.loading = false;
            },
          });
      } else {
        this.http.post(createUrl(ROUTER_CONSTANTS.DASHBOARD.PRODUCTS.CREATE), formData).subscribe({
          next: () => {
            this.message
              .loading('Đang tạo sản phẩm', { nzDuration: 1000 })
              .onClose!.pipe(
                concatMap(
                  () =>
                    this.message.success('Tạo sản phẩm thành công', { nzDuration: 2500 }).onClose!,
                ),
              )
              .subscribe();
            isSuccess = true;
          },
          error: (responseError) => {
            this.message
              .loading('Đang tạo sản phẩm', { nzDuration: 1000 })
              .onClose!.pipe(
                concatMap(
                  () =>
                    this.message.error(`Tạo sản phẩm thất bại: ${responseError.error.message}`, {
                      nzDuration: 5000,
                    }).onClose!,
                ),
              )
              .subscribe();
            this.loading = false;
          },
        });
      }

      setTimeout(() => {
        if (isSuccess) {
          this.goBack();
        }
        this.loading = false;
      }, 500);
    } else {
      Object.values(this.productForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // Chuyển thành số để hiển thị dấu chấm phân cách hàng nghìn
  formatterCurrency = (value: number | string): string => {
    if (!value && value !== 0) return '';
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Phải trả về number để khớp với yêu cầu của nz-input-number
  parserCurrency = (value: string): number => {
    if (!value) return 0;
    // Loại bỏ tất cả ký tự không phải số rồi ép kiểu thành Number
    const parsedValue = Number(value.replace(/\D/g, ''));
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  goBack() {
    this.router.navigate(['/dashboard/products']);
  }
}
