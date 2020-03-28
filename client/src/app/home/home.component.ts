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
  length = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions: number[] = [25, 50, 100, 200];
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
    console.log('sdads');
    await this.restService.getProduct(pageSize, pageIndex, modeDisplay)
      .toPromise()
      .then(
        (res: any) => {
          console.log(res);
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
}
