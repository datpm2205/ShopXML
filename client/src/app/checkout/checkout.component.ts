import { Component, OnInit } from '@angular/core';
import { CartService } from '../shell/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { NotifyDialogComponent } from '../shared/notify-dialog/notify-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { RestService } from '../core/service/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  formGroup: FormGroup;
  products: any;
  totalPrice = '0';
  credential: any;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private restService: RestService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getListProduct();
    this.credential = JSON.parse(sessionStorage.getItem(environment.credentialsKey));
    if (this.credential) {
      this.formGroup = this.formBuilder.group({
        recipientName: [this.credential.user.fullName, [Validators.required]],
        recipientPhone: [this.credential.user.phone, [Validators.required]],
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
        this.buildXmlBodyRequest();
      }
    });
  }

  private buildXmlBodyRequest() {
    const xmlDoc = document.implementation.createDocument(null, "BillDTO", null);
    const bill = xmlDoc.getElementsByTagName("BillDTO")[0];
    let newText: any;

    const recipientName = xmlDoc.createElement("recipientName");
    newText = xmlDoc.createTextNode(this.formGroup.get('recipientName').value);
    recipientName.appendChild(newText);
    bill.appendChild(recipientName);

    const recipientPhone = xmlDoc.createElement("recipientPhone");
    newText = xmlDoc.createTextNode(this.formGroup.get('recipientPhone').value);
    recipientPhone.appendChild(newText);
    bill.appendChild(recipientPhone);

    const recipientAddress = xmlDoc.createElement("recipientAddress");
    newText = xmlDoc.createTextNode(this.formGroup.get('recipientAddress').value);
    recipientAddress.appendChild(newText);
    bill.appendChild(recipientAddress);
    
    const productIdsParent = xmlDoc.createElement("productIds");
    for (const product of this.products) {
      for (let i = 0; i < product.amount; i++) {
        const productIds = xmlDoc.createElement("productIds");
        newText = xmlDoc.createTextNode(product.id);
        productIds.appendChild(newText);
        productIdsParent.appendChild(productIds);
      }
    }
    bill.appendChild(productIdsParent);

    console.log(new XMLSerializer().serializeToString(xmlDoc.documentElement));

    this.restService.addBill(new XMLSerializer().serializeToString(xmlDoc.documentElement), this.credential.token)
      .subscribe(
        (data: any) => {
          this.cartService.cleanCart();
          this.getListProduct();
          const dialogRef = this.dialog.open(NotifyDialogComponent, {
            width: '350px',
            disableClose: true,
            autoFocus: false,
            data: { title: "Thông báo", content: "Đặt hàng thành công" },
          });
          dialogRef.afterClosed().subscribe(res => {
            this.router.navigate(["/"]);
          });
        },
        (error: any) => {
          this.dialog.open(NotifyDialogComponent, {
            width: '350px',
            disableClose: true,
            autoFocus: false,
            data: { title: "Lỗi", content: "Lỗi khi thực hiện thao tác, vui lòng thử lại" },
          });
        }
      )
  }
}
