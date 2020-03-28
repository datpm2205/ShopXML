import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  showLoaderSubject: Subject<boolean> = new Subject();

  constructor() { }

  showLoader(value: boolean) {
    this.showLoaderSubject.next(value);
  }
}
