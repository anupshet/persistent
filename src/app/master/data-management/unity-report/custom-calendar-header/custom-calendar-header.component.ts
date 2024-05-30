import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Inject,
  Optional,
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatDatepickerIntl, MatCalendar } from '@angular/material/datepicker';

/** Custom header component for datepicker. */
@Component({
  selector: 'unext-custom-calendar-header',
  templateUrl: './custom-calendar-header.component.html',
  styleUrls: ['./custom-calendar-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CustomCalendarHeaderComponent<D> {




  constructor(private _intl: MatDatepickerIntl,
    @Inject(forwardRef(() => MatCalendar)) public calendar: MatCalendar<D>,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    changeDetectorRef: ChangeDetectorRef) {

    this.calendar.stateChanges.subscribe(() => changeDetectorRef.markForCheck());
  }

  /** The label for the current calendar view. */
  get periodButtonText(): string {
    const month = 'month';
    const year = 'year';

    if (this.calendar.currentView === month) {
      return this._dateAdapter
        .format(this.calendar.activeDate, this._dateFormats.display.monthYearLabel)
        .toLocaleUpperCase();
    }
    if (this.calendar.currentView === year) {
      return this._dateAdapter.getYearName(this.calendar.activeDate);
    }
    const activeYear = this._dateAdapter.getYear(this.calendar.activeDate);
    const firstYearInView = this._dateAdapter.getYearName(
      this._dateAdapter.createDate(activeYear - activeYear % 24, 0, 1));
    const lastYearInView = this._dateAdapter.getYearName(
      this._dateAdapter.createDate(activeYear +
        // yearsPerPage
        9
        - 1 - activeYear % 24, 0, 1));
    return `${firstYearInView} \u2013 ${lastYearInView}`;
  }

  get periodButtonLabel(): string {
    return this.calendar.currentView === 'month' ?
      this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
  }

  /** The label for the previous button. */
  get prevButtonLabel(): string {
    return {
      'month': this._intl.prevMonthLabel,
      'year': this._intl.prevYearLabel,
      'multi-year': this._intl.prevMultiYearLabel
    }[this.calendar.currentView];
  }

  /** The label for the next button. */
  get nextButtonLabel(): string {
    return {
      'month': this._intl.nextMonthLabel,
      'year': this._intl.nextYearLabel,
      'multi-year': this._intl.nextMultiYearLabel
    }[this.calendar.currentView];
  }

  /** Handles user clicks on the period label. */
  currentPeriodClicked(): void {
    this.calendar.currentView = this.calendar.currentView === 'year' ? 'multi-year' : 'year';
  }

  /** Handles user clicks on the previous button. */
  previousClicked(): void {
    this.calendar.activeDate = this.calendar.currentView === 'month' ?
      this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
      this._dateAdapter.addCalendarYears(
        this.calendar.activeDate, this.calendar.currentView === 'year' ? -1 :
          // -yearsPerPage
          -9
      );
  }

  /** Handles user clicks on the next button. */
  nextClicked(): void {
    this.calendar.activeDate = this.calendar.currentView === 'month' ?
      this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
      this._dateAdapter.addCalendarYears(
        this.calendar.activeDate,
        this.calendar.currentView === 'year' ? 1 :
          // yearsPerPage
          9
      );
  }

  /** Whether the previous period button is enabled. */
  previousEnabled(): boolean {
    if (!this.calendar.minDate) {
      return true;
    }
    return !this.calendar.minDate ||
      !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
  }

  /** Whether the next period button is enabled. */
  nextEnabled(): boolean {
    return !this.calendar.maxDate ||
      !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
  }

  /** Whether the two dates represent the same view in the current view mode (month or year). */
  private _isSameView(date1: D, date2: D): boolean {
    if (this.calendar.currentView === 'month') {
      return this._dateAdapter.getYear(date1) === this._dateAdapter.getYear(date2) &&
        this._dateAdapter.getMonth(date1) === this._dateAdapter.getMonth(date2);
    }
    if (this.calendar.currentView === 'year') {
      return this._dateAdapter.getYear(date1) === this._dateAdapter.getYear(date2);
    }
    // Otherwise we are in 'multi-year' view.
    return Math.floor(this._dateAdapter.getYear(date1) /
      // yearsPerPage
      9
    ) ===
      Math.floor(this._dateAdapter.getYear(date2) /
        // yearsPerPage
        9
      );
  }
}
