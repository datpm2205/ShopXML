import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/core/service/rest.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  credential: any;
  billInfo: any;
  products = [];

  constructor(
    private route: ActivatedRoute,
    private restService: RestService,
    private router: Router
  ) { }

  ngOnInit() {
    this.credential = JSON.parse(sessionStorage.getItem(environment.credentialsKey));
    this.route.paramMap.subscribe(params => {
      this.getData(params.get('id'));
    });
  }

  getData(id: any) {
    this.restService.getBillDetail(id, this.credential.token)
    .subscribe(
      (data: any) => {
        this.processXml(data);
      },
      (error: any) => {
        this.router.navigate(["/"]);
      }
    )
  }
  
  private processXml(data: any) {
    const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
    const dateCreate = xmlDoc.getElementsByTagName("dateCreate")[0].childNodes[0].nodeValue;
    const recipientName = xmlDoc.getElementsByTagName("recipientName")[0].childNodes[0].nodeValue;
    const recipientPhone = xmlDoc.getElementsByTagName("recipientPhone")[0].childNodes[0].nodeValue;
    const recipientAddress = xmlDoc.getElementsByTagName("recipientAddress")[0].childNodes[0].nodeValue;
    
    const detailList: any = xmlDoc.getElementsByTagName("billDetails")[0].childNodes;
    let totalPrice: any = 0;
    for (const billDetail of detailList) {
      const name = billDetail.getElementsByTagName("productName")[0].childNodes[0].nodeValue;
      const image = billDetail.getElementsByTagName("productImage")[0].childNodes[0].nodeValue;
      const price = billDetail.getElementsByTagName("productPrice")[0].childNodes[0].nodeValue;
      const amount = billDetail.getElementsByTagName("amount")[0].childNodes[0].nodeValue;
      this.products.push({
        name, image, amount,
        price: this.processPrice(price)
      });
      totalPrice += price * amount;
    }
    totalPrice = this.processPrice(totalPrice.toString());

    this.billInfo = {
      dateCreate, recipientName, recipientPhone, recipientAddress, totalPrice
    };
  }

  private processPrice(price: string): string {
    const parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }
}
