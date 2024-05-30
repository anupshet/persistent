// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CookieDisclaimerMessageComponent } from '../../shared/components/cookie-disclaimer-message/cookie-disclaimer-message.component';
import { cookieExpiryPeriod } from '../config/constants/general.const';

@Component({
  template: ''
})
export class Cookies implements OnDestroy {

  static destroy$ = new Subject<boolean>();

  static displayCookieDisclaimerMessage(dialog: MatDialog): void {
    const dialogRef = dialog.open(CookieDisclaimerMessageComponent, {
      width: '100vw',
      maxWidth: '100vw',
      height: '350px',
      position: {
        bottom: '0px', left: '0px', right: '0px'
      },
      disableClose: true,
      data: {}
    });
    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe(value => {
        if (value) {
          this.setCookies('cookies_accepted', 'true', cookieExpiryPeriod);
        } else {
          this.setCookies('cookies_accepted', 'false', cookieExpiryPeriod);
        }
      });
  }

  static setCookies(cookieName: string, cookieValue: string, cookieExpiry: number) {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + (cookieExpiry * 24 * 60 * 60 * 1000));
    const expires = `expires="${currentDate.toUTCString()}`;
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
  }

  static getCookies(cookieName: string) {
    const cookieData = document.cookie.split(';');
    for (let i = 0; i < cookieData.length; i++) {
      if (cookieData[i].split('=')[0].trim() === cookieName) {
        return true;
      }
    }
  }
  static getCookiesValue(cookieName: string) {
    const cookieData = document.cookie.split(';');
    for (let i = 0; i < cookieData.length; i++) {
      if (cookieData[i].split('=')[0].trim() === cookieName) {
        return cookieData[i].split('=')[1].trim();
      }
    }
  }
  static isCookiesAccepted() {
    const cookieData = this.getCookies('cookies_accepted');
    return cookieData;
  }

  static checkCookiesValue(value) {
    const cData = document.cookie.split(';');
    for (let i = 0; i < cData.length; i++) {
      if (cData[i].split('=')[1]?.trim() === value) {
        return true;
      }
    }
  }

  ngOnDestroy(): void {
    Cookies.destroy$.next(true);
    Cookies.destroy$.unsubscribe();
  }
}
