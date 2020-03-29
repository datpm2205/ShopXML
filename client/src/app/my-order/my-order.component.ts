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

  }
}
