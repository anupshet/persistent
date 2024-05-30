import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

import * as moment_ from 'moment';

import { months } from './constants/months';



@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  private dateTimeOffset: string;
  private moment = moment_;

  format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'input') {
      if (this.dateTimeOffset) {
        return this.moment(date, null, this.locale).utcOffset(this.dateTimeOffset).format('MMM DD YYYY');
      }
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      return `${months[month]} ${day} ${year}`;
    }
    return date.toDateString();
  }

  setDateTimeOffset(dateTimeOffset: string): void {
    this.dateTimeOffset = dateTimeOffset;
  }
}
