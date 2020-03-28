import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../core/service/rest.service';
import { NotifyDialogComponent } from '../shared/notify-dialog/notify-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  id: string;
  product: any;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private restService: RestService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.loadContent();
    });
  }

  loadContent() {
    this.restService.getProductDetail(this.id)
      .subscribe(
        (res: any) => {
          this.processXML(res);
        }, () => {
          this.dialog.open(NotifyDialogComponent, {
            width: '350px',
            disableClose: true,
            autoFocus: false,
            data: { title: "Lỗi", content: "Lỗi máy chủ gặp sự cố, vui lòng thử lại" },
          });
        }
      )
  }

  processXML(data: any) {
    const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
    const id = xmlDoc.getElementsByTagName("id")[0].childNodes[0].nodeValue;
    const name = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    const image = xmlDoc.getElementsByTagName("image")[0].childNodes[0].nodeValue;
    const price = this.processPrice(xmlDoc.getElementsByTagName("price")[0].childNodes[0].nodeValue);
    const description = xmlDoc.getElementsByTagName("description")[0].childNodes[0].nodeValue;
    const fullDescription = xmlDoc.getElementsByTagName("fullDescription")[0].childNodes[0].nodeValue;

    this.product = {
      id, name, image, price, description, fullDescription
    }
  }

  private processPrice(price: string): string {
    const parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }
}
