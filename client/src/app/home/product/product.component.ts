import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() imageUrl: string;
  @Input() price: string;

  constructor() { }

  ngOnInit() {
  }

}
