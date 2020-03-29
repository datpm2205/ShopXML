import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { LoaderState } from '../loader';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();

  private signInUrl = environment.apiUrl + "/users/sign-in/";
  private signUpUrl = environment.apiUrl + "/users/sign-up/";
  private getProductUrl = environment.apiUrl + "/products/";
  private billUrl = environment.apiUrl + "/bills/";

  constructor(
    private _http: HttpClient
  ) { }

  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }
  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }

  signIn(username: string, password: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return this._http.post(this.signInUrl, formData, { responseType: 'text' });
  }

  signUp(username: string, password: string, fullName: string, email: string, phone: string) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    return this._http.post(this.signUpUrl, formData, { responseType: 'text' });
  }

  getProduct(pageSize: any, pageIndex: any, sortMode: any) {
    let params = new HttpParams()
      .set('pageSize', pageSize)
      .set('pageIndex', pageIndex)
      .set('sortMode', sortMode);
    return this._http.get(this.getProductUrl, { params: params, responseType: 'text' });
  }

  getProductDetail(id: any) {
    const url = this.getProductUrl + id;
    return this._http.get(url, { responseType: 'text' });
  }

  addBill(data: any, token: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/xml');
    headers = headers.append('Accept', 'application/xml');
    headers = headers.append('token', token);
    return this._http.post(this.billUrl, data, { headers: headers, responseType: 'text' });
  }

  getBills(token: any) {
    let headers = new HttpHeaders();
    headers = headers.append('token', token);
    return this._http.get(this.billUrl, { headers: headers, responseType: 'text' });
  }

  getBillDetail(id: any, token: any) {
    const url = this.billUrl + id;
    let headers = new HttpHeaders();
    headers = headers.append('token', token);
    return this._http.get(url, { headers: headers, responseType: 'text' });
  }
}
