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

      if (this.isEditMode && this.productId) {
        this.http
          .patch(
            createUrl(ROUTER_CONSTANTS.DASHBOARD.PRODUCTS.EDIT, {
              params: this.productId,
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
        this.http.post(createUrl(ROUTER_CONSTANTS.DASHBOARD.PRODUCTS.CREATE), formData).subscribe({
          error: (error) => {
            this.message.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
            this.loading = false;
          },
        });
      }

      setTimeout(() => {
        this.message.success(
          this.isEditMode ? 'Cập nhật sản phẩm thành công' : 'Tạo sản phẩm thành công',
        );
        this.loading = false;
        this.goBack();
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

  goBack() {
    this.router.navigate(['/dashboard/products']);
  }
}
