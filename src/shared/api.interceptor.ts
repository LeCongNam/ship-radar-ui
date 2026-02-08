import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { HEADER_CONSTANTS } from '../constants';
import { AuthService } from './auth.service';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { v7 as Uuidv7 } from 'uuid';

// Biến để quản lý trạng thái Refresh Token
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const ApiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = localStorage.getItem(HEADER_CONSTANTS.ACCESS_TOKEN);

  const isPublicApi = req.url.includes('/api/auth/');

  let deviceId = localStorage.getItem(HEADER_CONSTANTS.DEVICE_ID);
  if (!deviceId) {
    deviceId = Uuidv7();
    localStorage.setItem(HEADER_CONSTANTS.DEVICE_ID, deviceId);
  }

  // 1. Đính kèm Token vào Request
  let authReq = req.clone({
    setHeaders: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'x-device-type': 'WEB',
      'x-device-id': deviceId,
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error intercepted:', error);

      // 2. Nếu lỗi 401 và không phải API Public
      if (error.status === 401 && !isPublicApi) {
        return handle401Error(authReq, next, authService, router);
      }

      return throwError(() => error);
    }),
  );
};

// 3. Hàm xử lý Refresh Token chuyên sâu
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem(HEADER_CONSTANTS.REFRESH_TOKEN)!;

    // Gọi API refresh token từ AuthService
    return authService.refreshTokenApi(refreshToken).pipe(
      switchMap((res: any) => {
        isRefreshing = false;

        const { accessToken, refreshToken } = res.data;

        // Lưu token mới
        localStorage.setItem(HEADER_CONSTANTS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(HEADER_CONSTANTS.REFRESH_TOKEN, refreshToken);
        refreshTokenSubject.next(accessToken);

        // Thực hiện lại request cũ với Token mới
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
          }),
        );
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout(); // Nếu refresh cũng lỗi -> Đá ra login
        return throwError(() => err);
      }),
    );
  } else {
    // Nếu đang trong quá trình refresh, các request khác sẽ đợi
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          }),
        );
      }),
    );
  }
}
