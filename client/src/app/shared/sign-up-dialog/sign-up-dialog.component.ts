import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { RestService } from 'src/app/core/service/rest.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotifyDialogComponent } from '../notify-dialog/notify-dialog.component';

const passwordMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  if (formGroup.get('newPassword').value === formGroup.get('confirmNewPassword').value) {
    return null;
  } else {
    return {
      passwordMismatch: true
    };
  }
};

@Component({
  selector: 'app-sign-up-dialog',
  templateUrl: './sign-up-dialog.component.html',
  styleUrls: ['./sign-up-dialog.component.scss']
})
export class SignUpDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private restService: RestService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<SignUpDialogComponent>,
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validator: passwordMatchValidator });
  }

  get newPassword() {
    return this.formGroup.get('newPassword');
  }

  get confirmNewPassword() {
    return this.formGroup.get('confirmNewPassword');
  }

  onPasswordInput() {
    if (this.formGroup.hasError('passwordMismatch')) {
      this.confirmNewPassword.setErrors([{ 'passwordMismatch': true }]);
    } else {
      this.confirmNewPassword.setErrors(null);
    }
  }

  createAccount() {
    this.restService.signUp(this.formGroup.get('username').value, this.formGroup.get('newPassword').value,
      this.formGroup.get('fullName').value, this.formGroup.get('email').value, this.formGroup.get('phone').value)
      .subscribe(
        (data: any) => {
          this.dialog.open(NotifyDialogComponent, {
            width: '350px',
            disableClose: true,
            autoFocus: false,
            data: { title: "Thông báo", content: "Tạo tài khoản thành công, vui lòng đăng nhập" },
          });
        },
        (error: any) => {
          console.log(error);
          this.dialog.open(NotifyDialogComponent, {
            width: '350px',
            disableClose: true,
            autoFocus: false,
            data: { title: "Lỗi", content: "Có lỗi khi thực hiện thao tác, vui lòng thử lại" },
          });
        }
      )
    this.dialogRef.close();
  }
}
