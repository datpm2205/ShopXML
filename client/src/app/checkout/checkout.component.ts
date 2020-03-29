import { Component, OnInit } from '@angular/core';
import { CartService } from '../shell/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { NotifyDialogComponent } from '../shared/notify-dialog/notify-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  formGroup: FormGroup;
  products: any;
  totalPrice = '0';

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getListProduct();
    const userInfo = JSON.parse(sessionStorage.getItem(environment.credentialsKey));
    if (userInfo) {
      this.formGroup = this.formBuilder.group({
        recipientName: [userInfo.user.fullName, [Validators.required]],
        recipientPhone: [userInfo.user.phone, [Validators.required]],
        recipientAddress: ['', [Validators.required]]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        recipientName: ['', [Validators.required]],
        recipientPhone: ['', [Validators.required]],
        recipientAddress: ['', [Validators.required]]
      });
    }
  }

  getListProduct() {
    this.products = this.cartService.listProductOnCart;
    let temp = 0;
    for (const p of this.products) {
      const price = +p.price.replace(/\./g, "");
      temp += price * p.amount;
    }
    this.totalPrice = this.processPrice(temp.toString());
  }

  removeProduct(id: string) {
    this.cartService.removeProduct(id);
    this.getListProduct();
  }

  private processPrice(price: string): string {
    const parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }

  checkoutProcess() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      disableClose: true,
      autoFocus: false,
      data: { title: "Thông báo", content: "Bạn có muốn thực hiện thanh toán?" },
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // TODO abc
      }
    });
  }
}
