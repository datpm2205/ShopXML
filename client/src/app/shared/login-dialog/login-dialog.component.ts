import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RestService } from 'src/app/core/service/rest.service';
import { NotifyDialogComponent } from '../notify-dialog/notify-dialog.component';
import { environment } from 'src/environments/environment';
import { UserAuthenService } from 'src/app/shell/user-authen.service';
import { SignUpDialogComponent } from '../sign-up-dialog/sign-up-dialog.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private restService: RestService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private userAuthenService: UserAuthenService,
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get username() {
    return this.formGroup.get('username');
  }

  get password() {
    return this.formGroup.get('password');
  }

  login() {
    this.restService.signIn(this.formGroup.get('username').value, this.formGroup.get('password').value)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.processXml(data);
          this.dialog.open(NotifyDialogComponent, {
            width: '350px',
            disableClose: true,
            autoFocus: false,
            data: { title: "Thông báo", content: "Đăng nhập thành công" },
          });
        },
        (error: any) => {
          console.log(error);
          this.dialog.open(NotifyDialogComponent, {
            width: '350px',
            disableClose: true,
            autoFocus: false,
            data: { title: "Lỗi", content: "Đăng nhập không thành công, vui lòng thử lại" },
          });
        }
      )
    this.dialogRef.close();
  }

  private processXml(data: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const token = xmlDoc.getElementsByTagName("token")[0].childNodes[0].nodeValue;
    const appUserNode = xmlDoc.getElementsByTagName("appUser")[0];
    const user = {
      id: appUserNode.getElementsByTagName("id")[0].childNodes[0].nodeValue,
      userName: appUserNode.getElementsByTagName("userName")[0].childNodes[0].nodeValue,
      fullName: appUserNode.getElementsByTagName("fullName")[0].childNodes[0].nodeValue,
      email: appUserNode.getElementsByTagName("email")[0].childNodes[0].nodeValue,
      phone: appUserNode.getElementsByTagName("phone")[0].childNodes[0].nodeValue,
    };
    sessionStorage.setItem(environment.credentialsKey, JSON.stringify({
      token, user
    }));
    this.userAuthenService.setFullName(user.fullName);
  }

  signUp() {
    this.dialogRef.close();
    this.dialog.open(SignUpDialogComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      position: { top: '70px' }
    });
  }
}
