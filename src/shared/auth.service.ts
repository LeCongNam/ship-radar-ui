import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HEADER_CONSTANTS } from '../constants';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { createUrl } from './util';
import { ROUTER_CONSTANTS } from '../constants/api-router.constant';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<any | null>(null);
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {
    this.checkInitialAuth();
    this.listenToStorageChanges();
  }

  // auth.service.ts
  logout() {
    const token = localStorage.getItem(HEADER_CONSTANTS.ACCESS_TOKEN);

    // KIỂM TRA: Nếu không có token, khỏi gọi API tốn tài nguyên
    if (!token) {
      ('Token đã mất, chỉ xóa dữ liệu máy khách...');
      this.clearClientData();
      return;
    }

    // Nếu còn token, gọi API để Server hủy session
    this.http.post(createUrl('auth/logout'), {}).subscribe({
      next: () => {
        ('Server đã hủy session thành công');
      },
      error: (err) => {
        // Dù lỗi (vì token hết hạn chẳng hạn) vẫn phải xóa máy khách
        console.error('Server logout lỗi nhưng vẫn xóa máy khách', err);

        this.clearClientData();
      },
    });
  }

  private clearClientData() {
    const deviceId = localStorage.getItem(HEADER_CONSTANTS.DEVICE_ID) || null;

    localStorage.clear(); // Xóa sạch rác

    if (deviceId) {
      localStorage.setItem(HEADER_CONSTANTS.DEVICE_ID, deviceId); // Giữ lại deviceId
    }

    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private checkInitialAuth() {
    const token = localStorage.getItem(HEADER_CONSTANTS.ACCESS_TOKEN);
    if (token) {
      this.currentUser.set({ token });
    }
  }

  private listenToStorageChanges() {
    window.addEventListener('storage', (event) => {
      if (event.key === HEADER_CONSTANTS.ACCESS_TOKEN && !event.newValue) {
        this.logout();
      }
    });
  }

  private apiUrl = ROUTER_CONSTANTS.HOST;
  // auth.service.ts
  refreshTokenApi(refreshToken: string) {
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    // Lưu ý: API này nên được Backend cấu hình để nhận Refresh Token
    return this.http.post<any>(`${this.apiUrl}/auth/refresh`, {
      refreshToken: refreshToken!,
    });
  }
}
