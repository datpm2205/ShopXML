import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  listProductOnCart = [];
  cartChange: Subject<any> = new Subject();

  constructor() { 
    const dataOnSession = sessionStorage.getItem("shop_cart");
    if (dataOnSession) {
      this.listProductOnCart = JSON.parse(dataOnSession);
    }
  }

  private addItemToSession(data: any) {
    sessionStorage.setItem("shop_cart", JSON.stringify(data))
  }

  addProductToCart(product: any) {
    let exist = false;
    for (const p of this.listProductOnCart) {
      if (p.id === product.id) {
        exist = true;
        p.amount++;
      }
    }
    if (!exist) {
      product.amount = 1;
      this.listProductOnCart.push(product);
    }
    this.addItemToSession(this.listProductOnCart);
    this.cartChange.next(this.listProductOnCart);
  }

  cleanCart() {
    this.listProductOnCart = [];
    this.addItemToSession([]);
    this.cartChange.next(this.listProductOnCart);
  }

  removeProduct(id: string) {
    for (let i = 0; i < this.listProductOnCart.length; i++) {
      if (this.listProductOnCart[i].id === id) {
        this.listProductOnCart.splice(i, 1);;
      }
    }
    this.addItemToSession(this.listProductOnCart);
    this.cartChange.next(this.listProductOnCart);
  }
}
