/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { advLjDefaultSliderValue, advLjMaxValueForSlider, advLjMinValueForSlider, advLjShowThumbLabel, advLjTickInterval } from '../../../../core/config/constants/general.const';
import { PointDataResult } from '../../../../contracts/models/data-management/run-data.model';

@Component({
  selector: 'unext-advanced-lj-timeframe',
  templateUrl: './advanced-lj-timeframe.component.html',
  styleUrls: ['./advanced-lj-timeframe.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvancedLjTimeframeComponent implements OnInit, OnChanges {
  @Input() timeframeIncrement: number;
  @Input() earliestDataDateTime: Date;
  @Input() latestDataDateTime: Date;
  @Input() currentAnalytePointResults: Array<PointDataResult> = [];
  @Input() runDateTime: Date;   // If provided and is within a year, it will initialize the timeframe to include this date-time.
  startDate: Date;
  endDate: Date;
  @Output() emitDateOutput = new EventEmitter();
  public max = advLjMaxValueForSlider;
  public min = advLjMinValueForSlider;
  public tickInterval = advLjTickInterval;
  public step: number;
  public sliderValue = advLjDefaultSliderValue;
  public dateOneYearBefore: Date;
  public dateToday: Date;
  public daysDifferenceLimit: number;
  public startLimitReached = false;
  public endLimitReached = true;
  public sliderThumbLabel = advLjShowThumbLabel;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.navigateNext[24],
    icons.navigateBefore[24]
  ];

  constructor(
    private dateTimeHelper: DateTimeHelper,
    private iconService: IconService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.dateToday = this.dateTimeHelper.getEndDate(new Date());
    this.dateOneYearBefore = this.dateTimeHelper.getDateOneYearBefore(this.dateToday);

    this.timeframeIncrement = 1;
    this.step = this.timeframeIncrement;

    let runDateTime = this.runDateTime ? this.dateTimeHelper.getEndDate(new Date(this.runDateTime)) : null;

    this.endDate = runDateTime && (runDateTime >= this.dateOneYearBefore) ? runDateTime : this.dateToday; // default end date
    this.startDate = this.dateTimeHelper.getStartDate(
      this.dateTimeHelper.getDateBeforeDifferenceInDays(this.endDate, this.getSliderOffset())); // default start date
    this.endLimitReached = this.endDate >= this.dateToday;

    this.emitOutput();
  }

  ngOnChanges() {
    //if there is no data then we can disable the start limit arrow else we can check the second condition
    if (this.currentAnalytePointResults && this.currentAnalytePointResults.length == 0) {
      this.startLimitReached = true;
    } else {
      this.startLimitReached = false;
    }
    // check the earliest datapoint is oneyear before and we only have the 30 days timeframe and no other data
    if (this.earliestDataDateTime && (+this.earliestDataDateTime > +this.startDate)) {
      this.startLimitReached = true;
    }
  }

  getSliderOffset() {
    // Range is set from 0 - 90 to ensure the slider thumb and the tick intervals are aligned.
    // Slider value 0 is not a valid entry for our purposes, so moving it to 1
    if (this.sliderValue <= 0) {
      this.sliderValue = 1;
    }
    return this.sliderValue - 1;
  }

  goBack() {
    this.endLimitReached = false;
    this.startDate = this.dateTimeHelper.getStartDate(
      this.dateTimeHelper.getDateBeforeDifferenceInDays(this.startDate, this.sliderValue)
    );
    if (+this.startDate <= +this.dateOneYearBefore) {
      // if start date is going below date before 1 year then set start date to date before 1 year
      this.startDate = this.dateOneYearBefore;
      this.startLimitReached = true;

      this.endDate = this.dateTimeHelper.getEndDate(
        this.dateTimeHelper.getDateAfterDifferenceInDays(this.startDate, this.getSliderOffset())
      );
    } else {
      this.endDate = this.dateTimeHelper.getEndDate(
        this.dateTimeHelper.getDateBeforeDifferenceInDays(this.endDate, this.sliderValue)
      );
    }

    if (+this.earliestDataDateTime > +this.startDate) {
      this.startLimitReached = true;
    }

    this.emitOutput();
  }

  goForward() {
    this.startLimitReached = false;
    this.startDate = this.dateTimeHelper.getStartDate(
      this.dateTimeHelper.getDateAfterDifferenceInDays(this.startDate, this.sliderValue)
    );
    this.endDate = this.dateTimeHelper.getEndDate(
      this.dateTimeHelper.getDateAfterDifferenceInDays(this.endDate, this.sliderValue)
    );

    if (+this.endDate >= +this.dateToday) {
      // if end date is going further than Today then set it to Todays date
      // and start date slider days before end date
      this.endLimitReached = true;
      this.endDate = this.dateToday;
      this.startDate = this.dateTimeHelper.getStartDate(
        this.dateTimeHelper.getDateBeforeDifferenceInDays(this.endDate, this.getSliderOffset())
      );
    }
    this.emitOutput();
  }

  onSliderChange() {
    // on change of slider the end date will be the same only start date varies with slider value
    this.startDate = this.dateTimeHelper.getStartDate(
      this.dateTimeHelper.getDateBeforeDifferenceInDays(this.endDate, this.getSliderOffset())
    );
    // check the earliestDataDateTime and latestDataDateTime, if there is datapoint available then enable arrow else disable arrow
    if (this.earliestDataDateTime && this.latestDataDateTime) {
      if (+this.startDate <= +this.dateOneYearBefore) {
        // when moving the slider if start date is going below date before 1 year then set start date to date before 1 year
        this.startDate = this.dateOneYearBefore;
        this.startLimitReached = true;
        // calculate end date in this case as start date should be dateOneYearBefore
        this.endDate = this.dateTimeHelper.getEndDate(
          this.dateTimeHelper.getDateAfterDifferenceInDays(this.startDate, this.getSliderOffset())
        );
      } else if (+this.earliestDataDateTime > +this.startDate) {
        this.startLimitReached = true;
      } else {
        // when moving the slider if start date is greater than date before 1 year then prev arrow should get enabled
        this.startLimitReached = false;
      }
    } else {
      this.startLimitReached = true;
    }
    this.emitOutput();
  }

  emitOutput() {
    this.emitDateOutput.emit({ startDate: this.startDate, endDate: this.endDate });
  }
}
