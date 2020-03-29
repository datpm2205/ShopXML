import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyOrderComponent } from './my-order.component';
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
  { path: '', component: MyOrderComponent },
  { path: 'detail/:id', component: DetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyOrderRoutingModule { }
