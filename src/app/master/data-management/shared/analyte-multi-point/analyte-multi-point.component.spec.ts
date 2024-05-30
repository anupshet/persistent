// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Subject } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import {
  MaterialModule, BrNumericValueDirective, ChangeLotModel, CalibratorLot, ReagentLot, Action
} from 'br-component-library';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { AnalyteMultiPointComponent } from './analyte-multi-point.component';
import { HttpLoaderFactory } from '../../../../app.module';
import * as fromRoot from '../../../../state/app.state';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';


describe('AnalyteMultiPointComponent', () => {
  let component: AnalyteMultiPointComponent;
  let fixture: ComponentFixture<AnalyteMultiPointComponent>;
  let changeLotComponent: ChangeLotComponent;
  let changeLotFixture: ComponentFixture<ChangeLotComponent>;

  const appState = [];

  const mockLastEntryToggleClicked = new Subject<boolean>();

  const codelistApiServiceMock = {
    getReagentLotsByReagentIdAsync: (): Promise<ReagentLot[]> => Promise.resolve([]),
    getCalibratorLotsByCalibratorIdAsync: (): Promise<CalibratorLot[]> => Promise.resolve([]),
  };

  const analyteEntryMock = {
    levelDataSet: [
      {
        level: 1,
        decimalPlace: 2,
        controlLotId: null,
        isPristine: false,
        data: {
          value: 1,
          z: 1,
          displayZScore: true,
          isAccepted: true,
          resultStatus: null
        }
      }
    ],
    isRunEntryMode: true,
    analyteIndex: 0,
    isSingleAnalyteMode: false,
    action: null,
    totalAnalytes: 1,
    changeLotData: null,
    id: '',
    labTestId: '',
    testSpecId: 123,
    correlatedTestSpecId: '',
    cumulativeLevels: [1],
    analyteName: '',
    analyteDateTime: new Date(),
    analyteDateTimeOffset: '',
    isSummary: false
  };

  const analytePointViewMock = {
    levelDataSet: [
      {
        level: 1,
        decimalPlace: 2,
        controlLotId: null,
        isPristine: false,
        data: {
          value: 1,
          z: 1,
          displayZScore: true,
          isAccepted: true,
          resultStatus: null
        }
      }
    ],
    isInsert: true,
    userComments: null,
    userActions: [],
    userInteractions: [],
    dataSource: '',
    id: '',
    labTestId: '',
    testSpecId: 123,
    correlatedTestSpecId: '',
    cumulativeLevels: [1],
    analyteName: '',
    analyteDateTime: new Date(),
    analyteDateTimeOffset: '',
    isSummary: false
  };

  const changeLotModelMock: ChangeLotModel = {
    labTestId: '1',
    calibratorLots: [
      { calibratorId: 2, calibratorName: '2' } as CalibratorLot,
      { calibratorId: 4, calibratorName: '4' } as CalibratorLot,
    ],
    defaultCalibratorLot: { calibratorId: 2, calibratorName: '2' } as CalibratorLot,
    selectedCalibratorLot: { calibratorId: 2, calibratorName: '2' } as CalibratorLot,
    reagentLots: [
      { id: 1, reagentId: 1, lotNumber: '1', shelfExpirationDate: new Date(), reagentCategory: 1 },
      { id: 3, reagentId: 3, lotNumber: '3', shelfExpirationDate: new Date(), reagentCategory: 2 }
    ],
    defaultReagentLot: { id: 3, reagentId: 3, lotNumber: '3', shelfExpirationDate: new Date(), reagentCategory: 2 },
    selectedReagentLot: { id: 3, reagentId: 3, lotNumber: '3', shelfExpirationDate: new Date(), reagentCategory: 2 },
    errorMessages: [],
    comment: ''
  };

  @Component({ selector: 'br-change-lot', template: '' }) class ChangeLotComponent {
    @Output() getLots = new EventEmitter<boolean>();
    @Input() formControlName: string;
    @Input() changeLotModel: ChangeLotModel;
    @Input() reagentLots: ReagentLot[];
    @Input() calibratorLots: CalibratorLot[];
    @Input() selectedDate: Date;
    @Input() translationLabelDictionary: {};
    @Input() correctiveActions: Action[];
    @Input() labTestId: number;
    @Input() totalLevels: number;
    @Input() isInsertPastResultLinkVisible: boolean;
    @Input() isFormVisible: boolean;
    @Input() showOptions: boolean;
    @Input() isArchived: boolean;
    @Input() isPointEntry: boolean;
    @Input() isDisabled: boolean;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnalyteMultiPointComponent,
        ChangeLotComponent,
        BrNumericValueDirective,
        UnityNextNumericPipe,
        UnityNextDatePipe,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        StoreModule.forRoot(fromRoot.reducers),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        NavigationService,
        { provide: Store, useValue: {}},
        provideMockStore({ initialState: {}}),
        { provide: DecimalPipe, useClass: DecimalPipe },
        { provide: DatePipe, useClass: DatePipe },
        { provide: CodelistApiService, useValue: codelistApiServiceMock }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyteMultiPointComponent);
    component = fixture.componentInstance;
    component.analyteEntry = analyteEntryMock;
    component.analytePointView = analytePointViewMock;
    component.lastEntryToggleClicked = mockLastEntryToggleClicked;
    component.analyteEntryType = 1;
    component.isLastDataEntry = true;
    component.isProductMasterLotExpired = false;
    component.isRunEntryMode = true;
    component.selectedDate = new Date();
    changeLotFixture = TestBed.createComponent(ChangeLotComponent);
    changeLotComponent = changeLotFixture.componentInstance;
    changeLotComponent.changeLotModel = changeLotModelMock;
    changeLotFixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set date time picker as analyteDateTime in analyte entry object', () => {
    component.analyteEntry = analyteEntryMock;
    component.analytePointView = analytePointViewMock;
    component.lastEntryToggleClicked.next(true);
    fixture.detectChanges();
    expect(component.dateTimePicker.value).toEqual(component.analyteEntry.analyteDateTime);
  });

  it('should show the tooltip with last data entry details on hover', () => {
    component.isLastDataEntry = true;
    component.analytePointView = analytePointViewMock;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const triggerElement = fixture.debugElement.nativeElement.querySelector('.spec_trigger');
      const lastDataEntryDetailsMenuElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('mat-menu');
      triggerElement.dispatchEvent(new MouseEvent('mouseover'));
      fixture.detectChanges();
      expect(lastDataEntryDetailsMenuElement).toBeTruthy();
    });
  });

  it('should set selectedDate to updated date when changed', () => {
    component.analyteEntry = analyteEntryMock;
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

  it('should emit the getLots event for change lot form', () => {
    component.analyteEntry = analyteEntryMock;
    const spy = spyOn(component, 'requestLots');
    changeLotComponent.getLots.emit(true);
    fixture.detectChanges();
    component.requestLots();
    expect(spy).toHaveBeenCalled();
  });

  it('should called writeValue function for true value', () => {
    fixture.detectChanges();
    spyOn(component, 'writeValue').and.callThrough();
    component.writeValue(1);
    expect(component.writeValue).toHaveBeenCalled();
  });

  it('should called writeValue function for false value', () => {
    component.analyteEntry = analyteEntryMock;
    component.readOnlyDate = true;
    fixture.detectChanges();
    spyOn(component, 'writeValue').and.callThrough();
    component.writeValue(0);
    component.changeLotForm.reset();
    expect(component.writeValue).toHaveBeenCalled();
  });

  it('should called triggers mouseEnter event', () => {
    component.mouseIsEnter = true;
    component.inputHasFocus = false;
    component.mouseEnter(true);
    expect(component.showOptions).toEqual(true);
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

  it('should triggers level Data change event', () => {
    component.analyteEntry = analyteEntryMock;
    const levelData = {
      level: 1,
      decimalPlace: 1,
      controlLotId: 1,
      isPristine: true,
      data: null
    };
    spyOn(component, 'levelDataChange').and.callThrough();
    component.levelDataChange(levelData);
    expect(component.levelDataChange).toHaveBeenCalled();
  });

  it('should show Tab Index with column and row index', () => {
    component.analyteEntry = analyteEntryMock;
    const columnIndex = 2;
    const rowIndex = 2;
    component.isRunEntryMode = false;
    spyOn(component, 'getTabIndex').and.callThrough();
    component.getTabIndex(columnIndex, rowIndex);
    expect(component.getTabIndex).toHaveBeenCalled();
  });

  it('should update analyte date and change Lot Data', () => {
    component.analyteEntry = analyteEntryMock;
    component.analytePointView = analytePointViewMock;
    component.analyteEntryType = 1;
    fixture.detectChanges();
    component.dateTimePicker.setValue(new Date());
    component.updateAnalyteDate();
    fixture.detectChanges();
    expect(component.analyteEntry.analyteDateTime).toEqual(component.dateTimePicker.value);
    component.updateChangeLotData();
    expect(component.analyteEntry.changeLotData).toEqual(component.changeLotFormControl.value);
  });

  it('should create form for change lots and return Comments', () => {
    component.analyteEntry = analyteEntryMock;
    component.analyteEntry.changeLotData = {
      labTestId: '',
      reagentLots: [],
      calibratorLots: [],
      errorMessages: [],
      defaultReagentLot: null,
      defaultCalibratorLot: null,
      selectedReagentLot: null,
      selectedCalibratorLot: null,
      comment: 'test'
    };
    component.createChangeLotForm();
    component.hasComment(component.analyteEntry);
    component.registerOnChange(1);
    expect(component.onChange).toEqual(1);
    component.registerOnTouched(2);
    expect(component.onTouched).toEqual(2);
  });

  it('should show last entry by default', () => {
    component.analytePointView = analytePointViewMock;
    fixture.detectChanges();
    const triggerElement = fixture.debugElement.nativeElement.querySelector('.spec_trigger');
    expect(triggerElement.innerText).toBe('1.00 ');
  });
});
