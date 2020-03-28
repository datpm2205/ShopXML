import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ProductComponent } from './product/product.component';


@NgModule({
  declarations: [HomeComponent, ProductComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule
  ]
})
export class HomeModule { }
