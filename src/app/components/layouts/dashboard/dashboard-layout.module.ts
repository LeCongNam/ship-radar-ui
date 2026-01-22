import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzBreadCrumbComponent, NzBreadCrumbItemComponent } from 'ng-zorro-antd/breadcrumb';
import {
  NzContentComponent,
  NzFooterComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent,
} from 'ng-zorro-antd/layout';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

// Định nghĩa cấu trúc Menu để dễ dàng quản lý và thêm mới
interface MenuItem {
  title: string;
  icon: string;
  link?: string;
  open?: boolean;
  children?: { title: string; link: string; key?: string }[];

  key?: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    NzBreadCrumbComponent,
    NzBreadCrumbItemComponent,
    NzContentComponent,
    NzFooterComponent,
    NzHeaderComponent,
    NzIconDirective,
    NzLayoutComponent,
    NzMenuDirective,
    NzMenuItemComponent,
    NzSiderComponent,
    NzSubMenuComponent,
    RouterLink,
    RouterLinkActive,
    NgxSpinnerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout implements OnInit {
  sidebarWidth = 200;
  isResizing = false;

  isCollapsed = false;
  protected readonly date = new Date();
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  listBreadcrumb: string[] = [];
  isLoading = false;

  // DANH SÁCH MENU: Thêm menu mới tại đây, không cần sửa HTML
  // ⚠️ QUAN TRỌNG: Path trong menu PHẢI KHỚP CHÍNH XÁC với routes trong app.routes.ts
  // Ví dụ: link: '/dashboard/users' ↔ path: 'users' trong routes
  menus: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      link: '/dashboard',
      key: 'dashboard',
    },
    {
      title: 'Quản lý người dùng',
      icon: 'user',
      children: [
        { title: 'Danh sách người dùng', link: '/dashboard/users', key: 'users' },
        { title: 'Thêm người dùng', link: '/dashboard/users/create' },
      ],
      key: 'users',
    },
    {
      title: 'Quản lý vai trò',
      icon: 'safety',
      link: '/dashboard/roles',
    },
    {
      title: 'Quản lý sản phẩm',
      icon: 'shopping',
      children: [
        { title: 'Danh sách sản phẩm', link: '/dashboard/products', key: 'products' },
        { title: 'Thêm sản phẩm', link: '/dashboard/products/create', key: 'products-create' },
        { title: 'Danh mục', link: '/dashboard/categories', key: 'categories' },
      ],
    },
    {
      title: 'Quản lý cửa hàng',
      icon: 'shop',
      link: '/dashboard/shops',
      key: 'shops',
    },
    {
      title: 'Đơn hàng',
      icon: 'file-text',
      children: [
        { title: 'Danh sách đơn hàng', link: '/dashboard/orders/list', key: 'orders-list' },
        { title: 'Tạo đơn hàng', link: '/dashboard/orders/create', key: 'orders-create' },
      ],
    },
    {
      title: 'Vận chuyển',
      icon: 'car',
      key: 'shipping',
      children: [
        { title: 'Đơn vị vận chuyển', link: '/dashboard/delivery-brands', key: 'delivery-brands' },
        { title: 'Quản lý vận chuyển', link: '/dashboard/shipping', key: 'shipping' },
      ],
    },
  ];

  ngOnInit(): void {
    // 1. Khởi tạo trạng thái dựa trên URL hiện tại khi load trang lần đầu
    this.handleNavigation(this.router.url);

    // 2. Theo dõi sự thay đổi URL để cập nhật Breadcrumb và trạng thái mở menu
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.handleNavigation(event.urlAfterRedirects);
      });

    this.runLoading();
  }

  private handleNavigation(url: string): void {
    this.updateBreadcrumbs(url);
    this.autoOpenMenuByUrl(url);
  }

  // Tự động mở menu cha nếu có con đang được truy cập
  private autoOpenMenuByUrl(url: string): void {
    this.menus.forEach((menu) => {
      if (menu.children) {
        // Kiểm tra xem URL hiện tại có khớp với bất kỳ con nào không
        const isChildActive = menu.children.some((child) => url.includes(child.link));
        if (isChildActive) {
          menu.open = true;
        }
      }
    });
  }

  private updateBreadcrumbs(url: string): void {
    const pathNodes = url.split('/').filter((node) => node);
    this.listBreadcrumb = pathNodes.map((node) => node.charAt(0).toUpperCase() + node.slice(1));
  }

  runLoading(): void {
    this.isLoading = true;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.isLoading = false;
    }, 1500); // Mock delay cho data
  }

  startResizing(event: MouseEvent) {
    this.isResizing = true;
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) {
      return;
    }

    // Limit sidebar width between 200px and 500px
    if (event.clientX >= 200 && event.clientX <= 500) {
      this.sidebarWidth = event.clientX;
    }
  }

  @HostListener('window:mouseup')
  stopResizing() {
    this.isResizing = false;
  }
}
