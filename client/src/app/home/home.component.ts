import { Component, OnInit } from '@angular/core';

interface SelectOption {
  value: number;
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
  modeDisplay = 1;
  viewModeOption: SelectOption[] = [
    {
      value: 1,
      viewValue: 'Năm qua'
    },
    {
      value: 2,
      viewValue: 'Tháng qua'
    },
    {
      value: 3,
      viewValue: 'Tuần qua'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  changeMode() {

  }

  onPageEvent(event: any) {
    this.requestSearch(event.pageSize, event.pageIndex);
  }

  async requestSearch(pageSize: number, pageIndex: number) {

  }
}
