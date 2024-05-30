// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { DateTimeHelper } from '../date-time-helper';
import * as fromRoot from '../../../state/app.state';
import * as sharedStateSelector from '../../../shared/state/selectors';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-date',
  templateUrl: './unity-datetime-display.component.html',
  styles: []
})
export class UnityDateTimeDisplayComponent implements OnInit, OnDestroy {
  @Input() dateTime: Date;
  @Input() display: 'DateTime' | 'Date' | 'MonthDay' | 'MonthDayYear' | 'Time' = 'DateTime';
  @Input() dateFormat: string;
  @Input() timeFormat: string;
  @Input() showTimeZone = false;
  @Input() fromMultiDataEntry = false;

  labLocationTimeZone = '';
  format = '';
  protected destroy$ = new Subject<boolean>();

  constructor(private dateTimeHelper: DateTimeHelper,
    private errorLoggerService: ErrorLoggerService,
    protected store: ngrxStore.Store<fromRoot.State>
    ) { }

  ngOnInit() {
    this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        this.labLocationTimeZone = labLocation.locationTimeZone;
        this.initFormat();
        this.initTimeZone();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private initFormat() {
    const dateFormat = this.dateTimeHelper.GetOrDefaultDateFormat(this.dateFormat);
    const timeFormat = this.dateTimeHelper.GetOrDefaultTimeFormat(this.timeFormat);
    const fullFormat = `${dateFormat} ${timeFormat}`;
    const monthDayFormat = this.dateTimeHelper.GetOrDefaultTimeFormat('MMM DD');
    const monthDayYearFormat = this.dateTimeHelper.GetOrDefaultTimeFormat('MMM DD YYYY');
    switch (this.display) {
      case 'DateTime':
        this.format = fullFormat;
        break;

      case 'Date':
        this.format = dateFormat;
        break;

      case 'Time':
        this.format = timeFormat;
        break;

      case 'MonthDay':
        this.format = monthDayFormat;
        break;

      case 'MonthDayYear':
        this.format = monthDayYearFormat;
        break;

      default:
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, '', Operations.InitFormat,
            (componentInfo.UnityDateTimeDisplayComponent + blankSpace + Operations.InitFormat)));
        break;
    }
  }

  private initTimeZone() {
    this.labLocationTimeZone = this.dateTimeHelper.GetOrGuessTimeZone(this.labLocationTimeZone);
  }
}
