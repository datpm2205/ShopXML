import { Component, OnInit } from '@angular/core';
import { RestService } from '../core/service/rest.service';
import { MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { NotifyDialogComponent } from '../shared/notify-dialog/notify-dialog.component';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {
  credential: any;
  bill = [];

  constructor(
    private restService: RestService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.credential = JSON.parse(sessionStorage.getItem(environment.credentialsKey));
    this.getBills();
  }

  getBills() {
    this.restService.getBills(this.credential.token)
    .subscribe(
      (data: any) => {
        this.processXml(data);
      },
      (error: any) => {
        this.dialog.open(NotifyDialogComponent, {
          width: '350px',
          disableClose: true,
          autoFocus: false,
          data: { title: "Lỗi", content: "Lỗi khi thực hiện thao tác, vui lòng thử lại" },
        });
      }
    )
  }

  private processXml(data: any) {
    const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
    const listNodeItem: any = xmlDoc.getElementsByTagName("PersistentBag")[0].childNodes;
    for (const child of listNodeItem) {
      const id = child.getElementsByTagName("id")[0].childNodes[0].nodeValue;
      const dateCreate = child.getElementsByTagName("dateCreate")[0].childNodes[0].nodeValue;
      const recipientName = child.getElementsByTagName("recipientName")[0].childNodes[0].nodeValue;
      const recipientPhone = child.getElementsByTagName("recipientPhone")[0].childNodes[0].nodeValue;
      const recipientAddress = child.getElementsByTagName("recipientAddress")[0].childNodes[0].nodeValue;
      let totalPrice: any = 0;

      const billDetailList = child.getElementsByTagName("billDetails")[0].childNodes;
      for (const detailNode of billDetailList) {
        const price = detailNode.getElementsByTagName("productPrice")[0].childNodes[0].nodeValue;
        const amount = detailNode.getElementsByTagName("amount")[0].childNodes[0].nodeValue;
        totalPrice += price * amount;
      }
      totalPrice = this.processPrice(totalPrice.toString());

      this.bill.push({
        id, dateCreate, recipientName, recipientPhone, recipientAddress, totalPrice
      });
    }
  }

  private processPrice(price: string): string {
    const parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }

}
