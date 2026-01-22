import { Routes } from '@angular/router';
import {
  DashboardHomePage,
  DashboardOrderCreate,
  DashboardOrderListPage,
  LoginPage,
  OtpVerify,
  UserListPage,
  UserFormPage,
  ProductListPage,
  ProductFormPage,
  CategoryListPage,
  CategoryFormPage,
  DeliveryBrandList,
  DeliveryBrandFormPage,
  ShopListPage,
  ShopFormPage,
} from './pages';
import { authGuard } from '../guards/auth.guard';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'verify-otp',
    component: OtpVerify,
  },

  {
    path: 'dashboard',
    children: [
      {
        path: '',
        component: DashboardHomePage,
      },
      // Orders
      {
        path: 'orders/list',
        component: DashboardOrderListPage,
      },
      {
        path: 'orders/create',
        component: DashboardOrderCreate,
      },
      // Users
      {
        path: 'users',
        component: UserListPage,
      },
      {
        path: 'users/create',
        component: UserFormPage,
      },
      {
        path: 'users/edit/:id',
        component: UserFormPage,
      },
      // Products
      {
        path: 'products',
        component: ProductListPage,
      },
      {
        path: 'products/create',
        component: ProductFormPage,
      },
      {
        path: 'products/edit/:id',
        component: ProductFormPage,
      },
      // Categories
      {
        path: 'categories',
        component: CategoryListPage,
      },
      {
        path: 'categories/create',
        component: CategoryFormPage,
      },
      {
        path: 'categories/edit/:id',
        component: CategoryFormPage,
      },
      // Roles (placeholder - component chưa tạo)
      {
        path: 'roles',
        redirectTo: '',
        pathMatch: 'full',
      },
      // Shops
      {
        path: 'shops',
        component: ShopListPage,
      },
      {
        path: 'shops/create',
        component: ShopFormPage,
      },
      {
        path: 'shops/edit/:id',
        component: ShopFormPage,
      },
      // Delivery Brands
      {
        path: 'delivery-brands',
        component: DeliveryBrandList,
      },
      {
        path: 'delivery-brands/create',
        component: DeliveryBrandFormPage,
      },
      {
        path: 'delivery-brands/edit/:id',
        component: DeliveryBrandFormPage,
      },
      // Shipping (placeholder - component chưa tạo)
      {
        path: 'shipping',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
    canActivate: [authGuard],
  },

  {
    path: '',
    component: Home,
  },
];
