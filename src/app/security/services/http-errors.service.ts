// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HttpErrorService {

  constructor() { }

  private  _errorCode = new BehaviorSubject<string>(null);
  _errorCode$ = this._errorCode.asObservable();

  geterrorCode(): string {
    return this._errorCode.getValue();
  }

  setErrorCode(val: string) {
    this._errorCode.next(val);
  }
}
