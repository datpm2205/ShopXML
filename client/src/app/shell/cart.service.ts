import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  listProductOnCart = [];
  cartChange: Subject<any> = new Subject();

  constructor() { }

  addProductToCart(product: any) {
    let exist = false;
    for (const p of this.listProductOnCart) {
      if (p.id === product.id) {
        exist = true;
        p.amount++;
      }
    }
    if (!exist) {
      product.amount = 0;
      this.listProductOnCart.push(product);
    }
    this.cartChange.next(this.listProductOnCart);
  }

  cleanCart() {
    this.listProductOnCart = [];
    this.cartChange.next(this.listProductOnCart);
  }

  removeProduct(id: string) {
    for (let i = 0; i < this.listProductOnCart.length; i++) {
      if (this.listProductOnCart[i].id === id) {
        this.listProductOnCart.splice(i, 1);;
      }
    }
    this.cartChange.next(this.listProductOnCart);
  }
}
