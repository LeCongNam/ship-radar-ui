import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HEADER_CONSTANTS, USER_CONSTANTS } from '../constants';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem(HEADER_CONSTANTS.ACCESS_TOKEN);
  const userTemp = localStorage.getItem(USER_CONSTANTS.USER_LOCAL);

  // 1. Nếu đã có Token (đã qua OTP) -> Cho vào Dashboard
  if (token) {
    if (state.url.includes('/login') || state.url.includes('/verify-otp')) {
      return router.createUrlTree(['/dashboard']);
    }
    return true;
  }

  // 2. Nếu chưa có Token nhưng đang có dữ liệu User tạm (vừa login xong, chờ OTP)
  if (userTemp) {
    if (state.url.includes('/verify-otp')) {
      return true; // Cho phép ở lại trang OTP
    }
    // Cố tình vào trang khác khi chưa OTP -> Bắt quay lại OTP
    if (!state.url.includes('/login')) {
      return router.createUrlTree(['/verify-otp']);
    }
  }

  // 3. Chưa có gì cả -> Về Login
  if (!state.url.includes('/login')) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
