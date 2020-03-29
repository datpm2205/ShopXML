import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOrderRoutingModule } from './my-order-routing.module';
import { MyOrderComponent } from './my-order.component';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
    MyOrderComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    MyOrderRoutingModule
  ]
})
export class MyOrderModule { }
