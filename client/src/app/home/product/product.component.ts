import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/shell/cart.service';
import { ToastComponent } from 'src/app/shared/toast/toast.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: any;

  constructor(
    private cartService: CartService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  addToCart() {
    this.cartService.addProductToCart(this.product);
    this._snackBar.openFromComponent(ToastComponent, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      data: { message: 'Đã thêm vào giỏ hàng' }
    });
  }

}
