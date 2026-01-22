import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { LoginService } from './login.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ErrorBox } from '../../components/error-box/error-box';
import { NzModalService } from 'ng-zorro-antd/modal';
import { USER_CONSTANTS } from '../../../constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [LoginService, ErrorBox, NzModalService],
})
export class LoginPage {
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true),
  });

  constructor(
    private readonly loginService: LoginService,
    private message: NzMessageService,
    private _errorBox: ErrorBox,
  ) {}

  submitForm(): void {
    if (this.validateForm.valid) {
      this.loginService.login(this.validateForm.value).subscribe({
        next: async (response: any) => {
          // Lưu thông tin user tạm thời để Guard cho phép vào trang OTP
          localStorage.setItem(USER_CONSTANTS.USER_LOCAL, JSON.stringify(response.data?.user));

          // Điều hướng sang trang OTP
          await this.router.navigate(['/verify-otp'], {
            state: { email: response.data?.user?.email },
          });
        },
        error: (err) => this._errorBox.showError(err),
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
