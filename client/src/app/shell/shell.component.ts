import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RestService } from '../core/service/rest.service';
import { LoaderService } from './loader.service';
import { Subscription } from 'rxjs';
import { LoaderState } from '../core/loader';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../shared/login-dialog/login-dialog.component';
import { UserAuthenService } from './user-authen.service';
import { environment } from 'src/environments/environment';
import { CartService } from './cart.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  showLoader = false;
  subscription: Subscription;
  fullNameUser: string;
  productOnCart = [];

  constructor(
    private restService: RestService,
    private loaderService: LoaderService,
    private userAuthenService: UserAuthenService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private cartService: CartService,
  ) {
    this.loaderService.showLoaderSubject.subscribe((value: boolean) => {
      this.showLoader = value;
      changeDetectorRef.detectChanges();
    });
    this.userAuthenService.fullNameChange.subscribe((value: any) => {
      this.fullNameUser = value;
    });
    this.cartService.cartChange.subscribe((value: any) => {
      this.productOnCart = value;
    });
  }

  ngOnInit() {
    this.subscription = this.restService.loaderState.subscribe(
      (state: LoaderState) => {
        this.loaderService.showLoader(state.show);
      }
    );
    const savedCredentials: any = sessionStorage.getItem(environment.credentialsKey);
    console.log(savedCredentials);
    if (savedCredentials) {
      this.fullNameUser = JSON.parse(savedCredentials).user.fullName;
    }
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      position: { top: '70px' }
    });
  }

  logout() {
    this.fullNameUser = undefined;
    sessionStorage.removeItem(environment.credentialsKey);
  }

  removeProductFromCart(id: string, event: any) {
    event.stopPropagation();
    this.cartService.removeProduct(id);
  }
}
