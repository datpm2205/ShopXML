import { Component, OnInit } from '@angular/core';
import { RestService } from '../core/service/rest.service';
import { NotifyDialogComponent } from '../shared/notify-dialog/notify-dialog.component';
import { MatDialog } from '@angular/material';

interface SelectOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products = [];
  length = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [25, 50, 100];
  modeDisplay = 'latest';
  viewModeOption: SelectOption[] = [
    {
      value: 'latest',
      viewValue: 'Mới nhất'
    },
    {
      value: 'oldest',
      viewValue: 'Cũ nhất'
    },
    {
      value: 'name_asc',
      viewValue: 'Tên A đến Z'
    },
    {
      value: 'name_desc',
      viewValue: 'Tên Z đến A'
    },
    {
      value: 'price_asc',
      viewValue: 'Giá từ thấp đến cao'
    },
    {
      value: 'price_desc',
      viewValue: 'Giá từ cao đến thấp'
    }
  ];

  constructor(
    private restService: RestService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.requestSearch(this.pageSize, this.pageIndex, this.modeDisplay);
  }

  changeMode() {
    this.requestSearch(this.pageSize, this.pageIndex, this.modeDisplay);
  }

  onPageEvent(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.requestSearch(this.pageSize, this.pageIndex, this.modeDisplay);
  }

  async requestSearch(pageSize: number, pageIndex: number, modeDisplay: string) {
    await this.restService.getProduct(pageSize, pageIndex, modeDisplay)
      .toPromise()
      .then(
        (res: any) => {
          this.processXML(res)
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

  private processXML(data: any) {
    const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
    this.length = +xmlDoc.getElementsByTagName("totalRecord")[0].childNodes[0].nodeValue;
    this.pageSize = +xmlDoc.getElementsByTagName("pageSize")[0].childNodes[0].nodeValue;
    this.pageIndex = +xmlDoc.getElementsByTagName("pageIndex")[0].childNodes[0].nodeValue;
    this.modeDisplay = xmlDoc.getElementsByTagName("sortMode")[0].childNodes[0].nodeValue;

    const listProductNode: any = xmlDoc.getElementsByTagName("products")[0].childNodes;
    this.products = [];
    for (let i = 0; i < listProductNode.length; i++) {
      const id = listProductNode[i].getElementsByTagName("id")[0].childNodes[0].nodeValue;
      const name = listProductNode[i].getElementsByTagName("name")[0].childNodes[0].nodeValue;
      const image = listProductNode[i].getElementsByTagName("image")[0].childNodes[0].nodeValue;
      const price = this.processPrice(listProductNode[i].getElementsByTagName("price")[0].childNodes[0].nodeValue);
      const description = listProductNode[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
      const fullDescription = listProductNode[i].getElementsByTagName("fullDescription")[0].childNodes[0].nodeValue;
      this.products.push({
        id, name, image, price, description, fullDescription
      });
    }
  }

  private processPrice(price: string): string {
    const parts = price.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }
}
