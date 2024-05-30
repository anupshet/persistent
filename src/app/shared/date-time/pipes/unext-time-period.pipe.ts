import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import 'moment-timezone';

import {DayPeriod} from '../../../contracts/enums/day-period.enum';
import { AppLoggerService } from './../../../shared/services/applogger/applogger.service';

@Pipe({
  name: 'unextTimePeriod'
})
export class UnextTimePeriodPipe implements PipeTransform {
  constructor(private appLoggerService: AppLoggerService) {
  }
  transform(dateTime: Date, timeZone: string): DayPeriod {
    if (!moment(dateTime) || !moment(dateTime).isValid()) {
      this.appLoggerService.log('Invalid date-time', dateTime);
      return;
    }

    const afternoonHours = 12; // afternoon hours starts from 12 in 24 hour format
    const eveningHours = 17; // evening hours starts from 17 in 24 hour format
    const currentHour = parseFloat(moment.tz(dateTime, timeZone).format('HH'));

    if (currentHour >= afternoonHours && currentHour < eveningHours) {
      return DayPeriod.Afternoon; // afternoon
    } else if (currentHour >= eveningHours) {
      return DayPeriod.Evening; // evening
    } else {
      return DayPeriod.Morning; // morning
    }
  }
}
