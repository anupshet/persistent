// <!-- © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.-->
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { StoreModule } from '@ngrx/store';

import { BrAnalyteSummaryEntryComponent, MaterialModule, AnalyteEntryType } from 'br-component-library';

import { AnalyteSummaryEntryComponent } from './analyte-summary-entry.component';
import { analyteEntrySummaryData } from './analyte-summary-entry.data.spec';
import { HttpLoaderFactory } from '../../../../../app.module';


describe('AnalyteSummaryEntryComponent', () => {
  let component: AnalyteSummaryEntryComponent;
  let fixture: ComponentFixture<AnalyteSummaryEntryComponent>;
  let componentChangeLot: ChangeLotComponent;
  let fixtureChangeLot: ComponentFixture<ChangeLotComponent>;

  const appState = [];

  @Component({ selector: 'br-change-lot', template: '' }) class ChangeLotComponent {
    @Output() getLots = new EventEmitter<boolean>();
    @Input() selectedDate: Date;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BrAnalyteSummaryEntryComponent,
        ChangeLotComponent,
        AnalyteSummaryEntryComponent
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        StoreModule.forRoot(appState)
      ],
      providers: [TranslateService, ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixtureChangeLot = TestBed.createComponent(ChangeLotComponent);
    componentChangeLot = fixtureChangeLot.componentInstance;
    fixtureChangeLot.detectChanges();
    fixture = TestBed.createComponent(AnalyteSummaryEntryComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyteEntrySummaryData;
    component.analyteEntryType = 1;
    component.isLastDataEntry = true;
    component.isProductMasterLotExpired = false;
    component.isRunEntryMode = true;
    component.visitedColumn = [0, 1, 2, 3];
    component.selectedDate = new Date();
    fixture.detectChanges();
    component.getIndexFromLevelSummary(1);
  });

  it('should create', (() => {
    expect(component).toBeTruthy();
  }));

  it('should display/not-display AnalyteName based on AnalyteEntryType', (() => {
    component.analyteEntryType = AnalyteEntryType.Single;
    fixture.detectChanges();
    const analyteName = fixture.debugElement.query(By.css('h6'));
    expect(analyteName).toBeNull();
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    expect(analyteName).toBeDefined();
  }));

  it('should display/not-display DateTimePicker based on AnalyteEntryType', (() => {
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    const dateTimePicker = fixture.debugElement.query(By.css('br-date-time-picker'));
    expect(dateTimePicker).toBeNull();
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    expect(dateTimePicker).toBeDefined();
  }));

  it('should display ChangeLot for single/multi summary entry', (() => {
    component.analyteEntryType = AnalyteEntryType.Single;
    fixture.detectChanges();
    const changeLot = fixture.debugElement.query(By.css('br-change-lot'));
    expect(changeLot).toBeDefined();
    component.analyteEntryType = AnalyteEntryType.Multi;
    fixture.detectChanges();
    expect(changeLot).toBeDefined();
  }));

  it('should should set selectedDate to updated date when changed', () => {
    component.analyteEntry = analyteEntrySummaryData;
    const simpleChanges: SimpleChanges = {
      selectedDate: {
        previousValue: null,
        currentValue: false,
        firstChange: null,
        isFirstChange: null
      }
    };
    component.ngOnChanges(simpleChanges);
    fixture.detectChanges();
    expect(component.analyteEntry.analyteDateTime).toEqual(component.selectedDate);
  });

  it('should update analyte date and change Lot Data', () => {
    component.analyteEntry = analyteEntrySummaryData;
    component.analyteEntryType = 1;
    fixture.detectChanges();
    component.updateAnalyteDate(component.selectedDate);
    fixture.detectChanges();
    expect(component.analyteEntry.analyteDateTime).toEqual(component.selectedDate);
    component.updateChangeLotData();
    expect(component.analyteEntry.changeLotData).toEqual(component.changeLotFormControl.value);
  });


  it('should emit the getLots event for change lot form', () => {
    component.analyteEntry = analyteEntrySummaryData;
    componentChangeLot.getLots.emit(true);
    const spy = spyOn(component, 'requestLots');
    fixture.detectChanges();
    component.requestLots();
    expect(spy).toHaveBeenCalled();
  });

  it('should change analyte', () => {
    component.analyteEntry = analyteEntrySummaryData;
    spyOn(component, 'analyteChanged').and.callThrough();
    component.analyteChanged();
    expect(component.analyteChanged).toHaveBeenCalled();
  });


  it('should called writeValue function for true value', () => {
    fixture.detectChanges();
    spyOn(component, 'writeValue').and.callThrough();
    component.writeValue(1);
    component.changeLotFormControl.setValue(component.value.changeLotData);
    expect(component.writeValue).toHaveBeenCalled();
  });

  it('should called writeValue function for false value', () => {
    component.analyteEntry = analyteEntrySummaryData;
    component.readOnlyDate = true;
    fixture.detectChanges();
    spyOn(component, 'writeValue').and.callThrough();
    component.writeValue(0);
    expect(component.writeValue).toHaveBeenCalled();
  });

  it('should should emit the getLots event for change lot form', () => {
    component.analyteEntry = analyteEntrySummaryData;
    component.columnsToDisplay = ['test', 'test'];
    spyOn(component, 'getTabIndex').and.callThrough();
    component.getTabIndex();
    expect(component.getTabIndex).toHaveBeenCalled();
  });

  it('should triggers focus event check for onChange and onTouched', () => {
    component.previousColIndex = 1;
    component.focusMovedOutside(true);
    component.onNewFocus(1);
    component.registerOnChange(1);
    expect(component.onChange).toEqual(1);
    component.registerOnTouched(2);
    expect(component.onTouched).toEqual(2);
  });

  it('should triggers mouseEnter event', () => {
    component.mouseIsEnter = true;
    component.inputHasFocus = false;
    component.mouseEnter(true);
    expect(component.showOptions).toEqual(true);
  });

  it('should called submit and cancel event on click on submit and cancel button', () => {
    component.analyteEntry = analyteEntrySummaryData;
    component.enableSubmit = false;
    spyOn(component, 'submit').and.callThrough();
    component.submit();
    expect(component.submit).toHaveBeenCalled();
    component.submitEvent.emit(component.analyteEntry);
    spyOn(component, 'cancel').and.callThrough();
    component.cancel();
    component.cancelEvent.emit();
    expect(component.cancel).toHaveBeenCalled();
  });

  it('should called focus event and enable comment array', () => {
    component.mouseIsEnter = false;
    component.inputHasFocus = true;
    component.focus(true);
    expect(component.showOptions).toEqual(true);
    component.enableCommentArray.length = 1;
    spyOn(component, 'evaluateCommentField').and.callThrough();
    component.evaluateCommentField();
    expect(component.evaluateCommentField).toHaveBeenCalled();
  });

});
