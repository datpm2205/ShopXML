import { Component, OnInit, Input } from '@angular/core';
import { CartService } from 'src/app/shell/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: any;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
  }

  addToCart() {
    this.cartService.addProductToCart(this.product);
  }

}
