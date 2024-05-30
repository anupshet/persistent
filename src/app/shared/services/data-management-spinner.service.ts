import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataManagementSpinnerService {
  constructor() {}

  private spinnerSubject = new BehaviorSubject<boolean>(false);
  public spinnerStatus = this.spinnerSubject.asObservable();

  public displaySpinner(isDisplay: boolean): void {
    this.spinnerSubject.next(isDisplay);
  }
}
