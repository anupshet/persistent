// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed } from '@angular/core/testing';
import * as moment from 'moment';

import { UnDateFormatPipe } from '../pipes/unDateFormat.pipe';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';

describe('Pipe: unDateFormatPipe', () => {
  let pipe: UnDateFormatPipe;

  beforeEach(() => {
    pipe = new UnDateFormatPipe();
    TestBed.configureTestingModule({
      providers: [DateTimeHelper]
    });
  });

  it('should create Instance of pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('Verify date is shown correctly for other dates', () => {
    const otherDate = new Date('2021-12-01T03:15:00');
    const futureOtherdate = moment(otherDate, 'MMM D').add(8, 'days').calendar();
    const otherComparisonDate = moment(futureOtherdate).format('MMM D YYYY');
    expect(pipe.transform(futureOtherdate.toString())).toEqual(otherComparisonDate.toString());
  });
});
