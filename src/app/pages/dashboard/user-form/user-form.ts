import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardLayout } from '../../../components/layouts/dashboard/dashboard-layout.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient } from '@angular/common/http';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardLayout,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzGridModule,
    // NzUploadChangeParam,
    NzUploadModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private message = inject(NzMessageService);

  userForm!: FormGroup;
  loading = false;
  isEditMode = false;
  userId: number | null = null;

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      dob: [null],
      bio: [''],
      isActive: [true],
      isVerifyEmail: [false],
      isVerifyPhone: [false],
    });
  }

  checkEditMode() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.loadUserData(this.userId);
    }
  }

  loadUserData(id: number) {
    this.loading = true;

    // TODO: Replace with actual API call
    // this.http.get<any>(`/api/users/${id}`).subscribe({
    //   next: (user) => {
    //     this.userForm.patchValue({
    //       email: user.email,
    //       username: user.username,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       phoneNumber: user.phoneNumber,
    //       dob: user.dob ? new Date(user.dob) : null,
    //       bio: user.bio,
    //       isActive: user.isActive,
    //       isVerifyEmail: user.isVerifyEmail,
    //       isVerifyPhone: user.isVerifyPhone,
    //     });
    //     this.loading = false;
    //   },
    //   error: () => {
    //     this.loading = false;
    //     this.message.error('Không thể tải dữ liệu người dùng');
    //   }
    // });

    // Mock data
    setTimeout(() => {
      this.userForm.patchValue({
        email: `user${id}@example.com`,
        username: `user${id}`,
        firstName: 'Nguyễn',
        lastName: `Văn ${String.fromCharCode(64 + id)}`,
        phoneNumber: `090000000${id}`,
        dob: new Date('1990-01-01'),
        bio: `Bio của người dùng ${id}`,
        isActive: true,
        isVerifyEmail: id % 2 === 0,
        isVerifyPhone: id % 3 === 0,
      });
      this.loading = false;
    }, 500);
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      const formData = { ...this.userForm.value };

      if (formData.dob) {
        formData.dob = formData.dob.toISOString();
      }

      if (this.isEditMode && this.userId) {
        // TODO: Replace with actual API call
        // this.http.put(`/api/users/${this.userId}`, formData).subscribe({
        //   next: () => {
        //     this.message.success('Cập nhật người dùng thành công');
        //     this.goBack();
        //   },
        //   error: () => {
        //     this.loading = false;
        //     this.message.error('Cập nhật người dùng thất bại');
        //   }
        // });

        setTimeout(() => {
          this.message.success('Cập nhật người dùng thành công');
          this.loading = false;
          this.goBack();
        }, 500);
      } else {
        // TODO: Replace with actual API call
        // this.http.post('/api/users', formData).subscribe({
        //   next: () => {
        //     this.message.success('Tạo người dùng thành công');
        //     this.goBack();
        //   },
        //   error: () => {
        //     this.loading = false;
        //     this.message.error('Tạo người dùng thất bại');
        //   }
        // });

        setTimeout(() => {
          this.message.success('Tạo người dùng thành công');
          this.loading = false;
          this.goBack();
        }, 500);
      }
    } else {
      Object.values(this.userForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} file upload failed.`);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard/users']);
  }
}
