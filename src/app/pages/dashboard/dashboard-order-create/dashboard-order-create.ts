import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { ROUTER_CONSTANTS } from '../../../../constants/api-router.constant';
import { createUrl } from '../../../../shared';
import { Product } from '../../../models/product.model';
import { Shop } from '../../../models/shop.model';

@Component({
  selector: 'app-dashboard-order-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DashboardLayout,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTableModule,
    NzIconModule,
    NzInputNumberModule,
  ],
  templateUrl: './dashboard-order-create.html',
  styleUrl: './dashboard-order-create.scss',
})
export class DashboardOrderCreate implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  orderForm!: FormGroup;
  loading = false;

  shops: Shop[] = [];
  products: Product[] = [];

  shopsLoading = false;
  productsLoading = false;

  get orderItems(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  get totalAmount(): number {
    return this.orderItems.controls.reduce((acc, control) => {
      const val = control.value;
      return acc + (val.quantity || 0) * (val.price || 0);
    }, 0);
  }

  ngOnInit() {
    this.initForm();
    this.loadShops();
    this.loadProducts();
  }

  initForm() {
    this.orderForm = this.fb.group({
      receiverName: ['', Validators.required],
      receiverPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      receiverAddress: ['', Validators.required],
      noted: [''],
      shopId: [null, Validators.required],
      status: ['PENDING', Validators.required],
      orderItems: this.fb.array([], [Validators.required]),
    });

    // Add one empty item by default
    this.addOrderItem();
  }

  createOrderItem(): FormGroup {
    return this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addOrderItem() {
    this.orderItems.push(this.createOrderItem());
  }

  removeOrderItem(index: number) {
    this.orderItems.removeAt(index);
  }

  onProductChange(index: number, productId: string) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      const itemGroup = this.orderItems.at(index) as FormGroup;
      itemGroup.patchValue({
        price: product.price,
      });
    }
  }

  loadShops() {
    this.shopsLoading = true;
    this.http.get<{ data: Shop[] }>(createUrl(ROUTER_CONSTANTS.DASHBOARD.SHOPS.LIST)).subscribe({
      next: (res) => {
        this.shops = res.data || [];
        // Pre-select first shop if available and nothing selected
        if (this.shops.length > 0 && !this.orderForm.get('shopId')?.value) {
          this.orderForm.patchValue({ shopId: this.shops[0].id });
        }
        this.shopsLoading = false;
      },
      error: () => {
        this.message.error('Không thể tải danh sách cửa hàng');
        this.shopsLoading = false;
      },
    });
  }

  loadProducts() {
    this.productsLoading = true;
    this.http
      .get<{ data: Product[] }>(createUrl(ROUTER_CONSTANTS.DASHBOARD.PRODUCTS.LIST))
      .subscribe({
        next: (res) => {
          this.products = res.data || [];
          this.productsLoading = false;
        },
        error: () => {
          this.message.error('Không thể tải danh sách sản phẩm');
          this.productsLoading = false;
        },
      });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      if (this.orderItems.length === 0) {
        this.message.error('Vui lòng thêm ít nhất một sản phẩm');
        return;
      }

      this.loading = true;
      const formValue = this.orderForm.value;

      const formData = {
        receiverName: formValue.receiverName,
        receiverPhone: formValue.receiverPhone,
        receiverAddress: formValue.receiverAddress,
        noted: formValue.noted,
        shopId: formValue.shopId,
        status: formValue.status,
        orderItems: formValue.orderItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: this.totalAmount,
      };

      console.log('Submitting Order Payload:', formData);

      this.http.post(createUrl(ROUTER_CONSTANTS.DASHBOARD.ORDERS.CREATE), formData).subscribe({
        next: () => {
          this.message.success('Tạo đơn hàng thành công');
          this.router.navigate([ROUTER_CONSTANTS.DASHBOARD.ORDERS.LIST]);
        },
        error: (err) => {
          console.error('Error creating order:', err);
          const errorMessage = err.error?.message || 'Tạo đơn hàng thất bại';
          this.message.error(errorMessage);
          this.loading = false;
        },
      });
    } else {
      console.log('Form Invalid. Errors:', this.orderForm.errors);
      Object.keys(this.orderForm.controls).forEach((key) => {
        const control = this.orderForm.get(key);
        if (control?.invalid) {
          console.log(`Control ${key} invalid:`, control.errors);
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      // Also mark array items
      this.orderItems.controls.forEach((group, index) => {
        if (group instanceof FormGroup) {
          Object.keys(group.controls).forEach((key) => {
            const control = group.get(key);
            if (control?.invalid) {
              console.log(`OrderItem ${index} - Control ${key} invalid:`, control.errors);
              control.markAsDirty();
              control.updateValueAndValidity();
            }
          });
        }
      });
      this.message.warning('Vui lòng kiểm tra lại thông tin đơn hàng');
    }
  }

  goBack() {
    this.router.navigate([ROUTER_CONSTANTS.DASHBOARD.ORDERS.LIST]);
  }
}
