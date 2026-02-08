import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { ORDER_CONSTANTS } from '../../../../constants/order.constant';

@Component({
  selector: 'app-dashboard-order-form',
  standalone: true,
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
  templateUrl: './dashboard-order-form.html',
  styleUrls: ['./dashboard-order-form.scss'],
})
export class DashboardOrderFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  orderForm!: FormGroup;
  loading = false;
  orderId: string | null = null;
  isViewMode = false;
  pageTitle = 'Tạo đơn hàng mới';

  shops: Shop[] = [];
  products: Product[] = [];

  shopsLoading = false;
  productsLoading = false;

  orderStatusOptions = ORDER_CONSTANTS.STATUS;

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

    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.isViewMode = true;
      this.pageTitle = 'Chi tiết đơn hàng';
      this.loadOrder(this.orderId);
    }
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

    // this.addOrderItem();
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

  trackByShop(index: number, item: Shop) {
    return item.id;
  }

  trackByProduct(index: number, item: Product) {
    return item.id;
  }

  loadShops() {
    this.shopsLoading = true;
    this.http.get<{ data: Shop[] }>(createUrl(ROUTER_CONSTANTS.DASHBOARD.SHOPS.LIST)).subscribe({
      next: (res) => {
        this.shops = res.data || [];
        this.shopsLoading = false;
      },
      error: (err) => {
        this.shopsLoading = false;
        this.message.error('Không thể tải danh sách cửa hàng');
        console.error('❌ loadShops error:', err);
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
        error: (err) => {
          this.productsLoading = false;
          this.message.error('Không thể tải danh sách sản phẩm');
          console.error('❌ loadProducts error:', err);
        },
      });
  }

  loadOrder(id: string) {
    this.loading = true;
    this.http.get<any>(createUrl(`${ROUTER_CONSTANTS.DASHBOARD.ORDERS.CREATE}/${id}`)).subscribe({
      next: (res) => {
        this.loading = false;
        const order = res.data;

        this.orderForm.patchValue({
          receiverName: order.receiverName,
          receiverPhone: order.receiverPhone,
          receiverAddress: order.receiverAddress,
          noted: order.noted,
          shopId: order.shopId,
          status: order.status,
        });

        const itemsArray = this.orderForm.get('orderItems') as FormArray;
        itemsArray.clear();

        order.orderItems?.forEach((item: any) => {
          itemsArray.push(
            this.fb.group({
              productId: [item.productId, Validators.required],
              quantity: [item.quantity, [Validators.required, Validators.min(1)]],
              price: [Number(item.price), [Validators.required, Validators.min(0)]],
            }),
          );
        });
      },
      error: (err) => {
        this.loading = false;
        this.message.error('Không thể tải thông tin đơn hàng');
        console.error('❌ loadOrder error:', err);
      },
    });
  }

  onSubmit() {
    if (!this.orderForm.valid) {
      this.message.warning('Vui lòng kiểm tra lại thông tin đơn hàng');
      return;
    }

    const formValue = this.orderForm.value;
    const formData = {
      ...formValue,
      orderItems: formValue.orderItems,
      totalPrice: this.totalAmount,
    };

    this.http.post(createUrl(ROUTER_CONSTANTS.DASHBOARD.ORDERS.CREATE), formData).subscribe({
      next: (res) => {
        this.message.success('Tạo đơn hàng thành công');
        this.goBack();
      },
      error: (err) => {
        console.error('❌ Error creating order:', err);
        this.message.error('Tạo đơn hàng thất bại');
      },
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/orders/list']);
  }
}
