import { Component, OnInit } from '@angular/core';
import { CartService } from '../shell/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  products: any;
  totalPrice = 0;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.products = this.cartService.listProductOnCart;
  }

  removeProduct(id: string) {
    this.cartService.removeProduct(id);
    this.products = this.cartService.listProductOnCart;
  }

  private processPrice(price: string): string {
    const parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }
}
