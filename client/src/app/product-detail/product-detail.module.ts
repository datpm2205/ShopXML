import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailComponent } from './product-detail.component';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    ProductDetailComponent 
  ],
  imports: [
    CommonModule,
    ProductDetailRoutingModule,
    MatButtonModule
  ]
})
export class ProductDetailModule { }
