import { Component, OnInit } from '@angular/core';
import { CartService } from '../shell/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  products: any;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.products = this.cartService.listProductOnCart;
  }

}
