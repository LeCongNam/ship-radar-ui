import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NgOtpInputModule } from 'ng-otp-input';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { interval, Subscription, takeWhile, finalize } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HEADER_CONSTANTS } from '../../../constants';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [NgOtpInputModule, ReactiveFormsModule, NzButtonModule],
  templateUrl: './otp-verify.html',
  styleUrl: './otp-verify.scss',
})
export class OtpVerify implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
 private messageClient = inject(NzMessageService);

  email: string = '';
  otpControl = new FormControl('', [Validators.required, Validators.minLength(6)]);

  bntResendOtpDisabled = true;
  timer = 90; // đếm ngược 90 giây
  private timerSub?: Subscription;

  ngOnInit() {
    // Lấy email từ router state
    this.email = window.history.state?.['email'] ?? '';
    if (!this.email) {
      console.error('Không có email trong state');
      this.router.navigate(['/login']);
      return;
    }

    // Gửi OTP lần đầu
    this.callApiGetOtp();
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }

  /** Gửi yêu cầu gửi OTP mới */
  callApiGetOtp() {
    this.bntResendOtpDisabled = true;
    this.startCountdown();

    this.httpClient
      .post('http://localhost:3001/api/auth/send-otp', { email: this.email })
      .subscribe({
        next: (response) => {
          console.log('OTP sent:', response);
        },
        error: (error) => {
          console.error('Error sending OTP:', error);
        },
      });
  }

  /** Đếm ngược dùng RxJS */
  private startCountdown() {
    this.timer = 90; // reset thời gian
    this.timerSub?.unsubscribe(); // nếu đang chạy countdown cũ thì dừng lại

    this.timerSub = interval(1000)
      .pipe(
        takeWhile(() => this.timer > 0),
        finalize(() => {
          console.log('Time is up!');
          this.bntResendOtpDisabled = false;
          this.timer = 0;
        })
      )
      .subscribe(() => {
        this.timer -= 1;
      });
  }

  /** Nhận giá trị OTP từ input */
  handleOtpChange(value: string) {
    this.otpControl.setValue(value);

    // Tự động verify nếu nhập đủ 6 ký tự
    if (value.length === 6) {
      this.verifyOtp();
    }
  }

  /** Gửi OTP verify đến server */
  verifyOtp() {
    if (!this.otpControl.valid) {
      console.log('OTP chưa đủ 6 số');
      return;
    }

    const otp = this.otpControl.value;
    console.log('Verify OTP:', otp);

    this.httpClient
      .post('http://localhost:3001/api/auth/verify-otp', {
        otp,
        email: this.email,
      })
      .subscribe({
        next: (response: any) => {
          console.log('OTP verified successfully:', response);
          this.messageClient.success('Xác thực OTP thành công!');

          localStorage.setItem(HEADER_CONSTANTS.ACCESS_TOKEN, response?.token?.accessToken);
          localStorage.setItem(HEADER_CONSTANTS.REFRESH_TOKEN,response?.token?.refreshToken)

            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 3000);
        },
        error: (error) => {
          console.error('OTP verification failed:', error);
          this.otpControl.setValue('');
          alert('OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.');
        },
      });
  }
}
