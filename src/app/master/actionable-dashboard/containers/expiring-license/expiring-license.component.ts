// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Subject } from 'rxjs';

import { expirationDayLimit } from '../../../../core/config/constants/general.const';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import * as moment from 'moment';

@Component({
  selector: 'unext-expiring-license',
  templateUrl: './expiring-license.component.html',
  styleUrls: ['./expiring-license.component.scss']
})
export class ExpiringLicenseComponent implements OnInit, OnDestroy {
  @Output() hasExpiryLicenceToDisplay = new EventEmitter();
  @Input() timeZone = 'America/Los_Angeles';
  @Input() location: LabLocation;
  public accountStateSubscription: Subscription;
  numberOfDaysToExpire: number = null;
  licenseExpirationDate: Date;
  showExpiringLicense = false;
  protected cleanUp$ = new Subject<boolean>();
  today: Date;
  ajToday: Date;
  expiryDate: Date;

  constructor(
    private dataTimeHelper: DateTimeHelper,
  ) { }

  ngOnInit() {
    this.loadLicenseExpirationData();
  }

  loadLicenseExpirationData() {
    if (!!this.location) {
      this.today = new Date(this.dataTimeHelper.getNow(this.timeZone).tzDateTime.DateTimeFormatted);
      this.ajToday = moment().endOf('day').toDate();
      this.expiryDate = new Date(this.location?.licenseExpirationDate);
      this.licenseExpirationDate = this.expiryDate;
      this.numberOfDaysToExpire = this.dataTimeHelper.getDifferenceInDays(this.expiryDate, this.today);
      this.showExpiringLicense = this.numberOfDaysToExpire <= Number(expirationDayLimit) ? true : false;
      this.hasExpiryLicenceToDisplay.emit(this.showExpiringLicense);
    }
  }

  ngOnDestroy() {
    this.cleanUp$.next(true);
    this.cleanUp$.unsubscribe();
  }
}
