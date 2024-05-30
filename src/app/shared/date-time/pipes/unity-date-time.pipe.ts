import { Pipe, PipeTransform } from '@angular/core';

import 'moment-timezone';

import { DateTimeHelper } from '../date-time-helper';

// NOTE: Do not use this pipe. This is here for legacy reasons. Use UnityNextDatePipe.
//       We need to eventually replace this one with UnityNextDatePipe.
@Pipe({
  name: 'uDate'
})
export class UnityDateTimePipe implements PipeTransform {

  constructor(private dateTimeHelper: DateTimeHelper) { }

  transform(value: Date, tz: string, format: string): any {
    return this.dateTimeHelper.formatDateTime(value, tz, format);
  }

}
