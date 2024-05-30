/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import * as moment from 'moment';

import { MaterialModule } from 'br-component-library';
import { AdvancedLjTimeframeComponent } from './advanced-lj-timeframe.component';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { IconService } from '../../../../shared/icons/icons.service';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('AdvancedLjTimeframeComponent', () => {
  let component: AdvancedLjTimeframeComponent;
  let fixture: ComponentFixture<AdvancedLjTimeframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedLjTimeframeComponent],
      providers: [
        DateTimeHelper,
        IconService,
        LocaleConverter,
        TranslateService,
      ],
      imports: [
        MaterialModule,
        HttpClientModule,
        MatSliderModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedLjTimeframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start date is going below date before 1 year', () => {
    const sliderValue = 30;
    component.earliestDataDateTime = moment('2021-10-25').startOf('day').toDate();
    component.latestDataDateTime = new Date();
    const startDate = moment().subtract(sliderValue, 'days').startOf('day').toDate();
    component.onSliderChange();
    component.dateToday = startDate;
    fixture.detectChanges();
    const endDate = new Date(startDate.valueOf() + 31556925993);
    component.dateOneYearBefore = endDate;
    component.onSliderChange();
    fixture.detectChanges();
    expect(component.startDate).toEqual(component.dateOneYearBefore);
  });

  it('should set slider value to one, if 0', () => {
    component.sliderValue = 0;
    component.getSliderOffset();
    fixture.detectChanges();
    expect(component.sliderValue).toEqual(1);
  });

  it('should set todays date as endDate and date before 29 days as start date', () => {
    const sliderValue = 30;
    const todaysDate = moment().endOf('day').toDate();
    const startDate = moment().subtract(component.getSliderOffset(), 'days').startOf('day').toDate();
    fixture.detectChanges();
    expect(component.sliderValue).toEqual(sliderValue);
    expect(+component.startDate).toEqual(+startDate);
    expect(+component.endDate).toEqual(+todaysDate);
  });

  it('should set run date time as endDate and date before 29 days as start date if run date time is provided', () => {
    const dateSixMonthsAgo = new Date();
    dateSixMonthsAgo.setMonth(dateSixMonthsAgo.getMonth() - 6);
    component.runDateTime = dateSixMonthsAgo;
    const startDate = moment(component.runDateTime).subtract(component.getSliderOffset(), 'days').startOf('day').toDate();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.startDate).toEqual(startDate);
    const runDateTimeEndOfDay = moment(component.runDateTime).endOf('day').toDate();
    expect(component.endDate).toEqual(runDateTimeEndOfDay);
  });

  it('should set todays date as endDate if run date time is provided, but is earlier than one year ago', () => {
    const date18MonthsAgo = new Date();
    date18MonthsAgo.setMonth(date18MonthsAgo.getMonth() - 18);
    const todaysDate = moment().endOf('day').toDate();
    component.runDateTime = date18MonthsAgo;
    const startDate = moment().subtract(component.getSliderOffset(), 'days').startOf('day').toDate();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.startDate).toEqual(startDate);
    expect(component.endDate).toEqual(todaysDate);
  });

  it('should emit output on slider value change', () => {
    const spy = spyOn(component, 'onSliderChange').and.callThrough();
    component.sliderValue = 30;
    component.startDate = moment('2021-04-29').startOf('day').toDate();
    component.endDate = moment('2021-05-29').endOf('day').toDate();
    fixture.detectChanges();
    const sliderElement = fixture.debugElement.query(By.css('.spec_slider')).nativeElement;
    const event = new Event('change');
    sliderElement.dispatchEvent(event);
    component.sliderValue = 90;
    fixture.detectChanges();
    component.onSliderChange();
    expect(spy).toHaveBeenCalled();
    expect(+component.startDate).toEqual(+moment('2021-03-01').startOf('day').toDate());
    expect(+component.endDate).toEqual(+moment('2021-05-29').endOf('day').toDate());
  });

  it('should set todays date as enddate and disable next button whenever boundry limit reached by clicking next', () => {
    const spy = spyOn(component, 'goForward').and.callThrough();
    component.sliderValue = 90;
    component.endLimitReached = false;
    component.dateToday = moment('2021-06-28').endOf('day').toDate();
    component.startDate = moment('2021-02-28').startOf('day').toDate();
    component.endDate = moment('2021-05-29').endOf('day').toDate();
    fixture.detectChanges();
    const nextButtonElement = fixture.debugElement.query(By.css('.spec_nextButton')).nativeElement;
    nextButtonElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(+component.startDate).toEqual(+moment('2021-03-31').startOf('day').toDate());
    expect(+component.endDate).toEqual(+moment('2021-06-28').endOf('day').toDate());
    expect(nextButtonElement.disabled).toBeTruthy();
  });

  it(`should set date from 1 year ago as start date and disable previous button,
      whenever boundary limit reached by clicking previous button`, () => {
    const spy = spyOn(component, 'goBack').and.callThrough();
    component.sliderValue = 10;
    component.dateToday = moment('2021-06-28').endOf('day').toDate();
    component.dateOneYearBefore = moment('2020-06-29').startOf('day').toDate();
    component.startDate = moment('2020-07-02').startOf('day').toDate();
    component.endDate = moment('2020-07-12').endOf('day').toDate();
    fixture.detectChanges();
    const prevButtonElement = fixture.debugElement.query(By.css('.spec_prevButton')).nativeElement;
    prevButtonElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(+component.startDate).toEqual(+moment('2020-06-29').startOf('day').toDate());
    expect(+component.endDate).toEqual(+moment('2020-07-08').endOf('day').toDate());
    expect(prevButtonElement.disabled).toBeTruthy();
  });
});
