// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, inject, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardTitle, MatCardSubtitle, MatCard, MatCardContent } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { NgRedux } from '@angular-redux/store';
import { MatDialogModule } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxPaginationModule } from 'ngx-pagination';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { orderBy } from 'lodash';

import {
  GlobalLabels, AnalyteEntryType, AnalytePointEntry,
  AnalyteSummaryView, TranslationLabels, AnalytePointView, PointLevelDataColumns
} from 'br-component-library';
import { UIConfigService } from '../services/ui-config.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { LabDataApiService } from '../api/labDataApi.service';
import { PageSectionComponent } from './page-section.component';
import { PageSectionService } from './page-section.service';
import { ChangeTrackerService } from '../guards/change-tracker/change-tracker.service';
import { DataManagementSpinnerService } from '../services/data-management-spinner.service';
import { MessageSnackBarService } from '../../core/helpers/message-snack-bar/message-snack-bar.service';
import { RunsService } from '../services/runs.service';
import { NotificationService } from '../../core/notification/services/notification.service';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { AppLoggerService } from '../services/applogger/applogger.service';
// import { UnityNextNumberPipe } from '../number/pipes/unity-next-number.pipe';
import { UnDateFormatPipe } from '../date-time/pipes/unDateFormat.pipe';
import { NavigationService } from '../navigation/navigation.service';
import { ErrorLoggerService } from '../services/errorLogger/error-logger.service';
import { InProgressMessageTranslationService } from '../services/inprogress-message-translation.service';
import * as pageSectionConst from './page-section.const';
import { asc } from '../../core/config/constants/general.const';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../app.module';
import { LoggingApiService } from '../api/logging-api.service';

describe('PageSectionComponent', () => {
  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  let component: PageSectionComponent;
  let fixture: ComponentFixture<PageSectionComponent>;

  const loggingApiServiceMock = jasmine.createSpyObj('LoggingApiService', ['appNavigationTracking']);

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'br-analyte-summary-entry', template: '' })
  class BrAnalyteSummaryEntryStubComponent {
    @Input() isRunEntryMode: boolean;
    @Input() selectedDate: Date;
    @Input() availableDateTo: Date;
    @Input() availableDateFrom: Date;
    @Input() translationLabelDictionary: {};
    @Input() analyteEntryType: AnalyteEntryType;
    @Input() isSingleEditMode = false;
    @Input() enableSubmit: boolean;
    @Input() timeZone: string;
    @Input() isProductMasterLotExpired: boolean;
  }

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'br-analyte-summary-view', template: '<div></div>' })
  class BrAnalyteSummaryViewStubComponent {
    @Input() formControlName: string;
    @Input() analyteView: AnalyteSummaryView;
    @Input() globalLabels: GlobalLabels;
    @Input() translationLabelDictionary: TranslationLabels;
    @Input() isSinglePageSummary: boolean;
    @Input() dateTimeOffset: string;
  }

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'br-analyte-point-entry', template: '' })
  class BrAnalytePointEntryStubComponent {
    @Input() analyteEntryType: AnalyteEntryType;
    @Input() analyteEntry: AnalytePointEntry;
    @Input() isRunEntryMode: boolean;
    @Input() selectedDate: Date;
    @Input() timeZone: string;
    @Input() isProductMasterLotExpired: boolean;
    @Input() translationLabelDictionary: {};
  }

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'br-analyte-point-view', template: '<div></div>' })
  class BrAnalytePointViewComponent {
    @Input() public analytePointView: AnalytePointView;
    @Input() public displayedLevelDataColumns: Set<PointLevelDataColumns>;
    @Input() public showAnalyteNameHeader: boolean;
    @Input() public dateTimeOffset: string;
  }

  // tslint:disable-next-line:component-selector
  @Component({ selector: 'br-entry-save', template: '<div></div>' })
  class BrEntrySaveComponent {
    @Input() defaultDate: Date;
    @Input() displayTime = true;
    @Input() enableSubmit: boolean;
    @Input() maxDate: Date;
    @Input() minDate: Date;
    @Input() entryViewStyle = true;
    @Input() showDatePicker = false;
    @Input() showChangeDateButton = false;
    @Input() timeZone: string;
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatRadioModule,
        PerfectScrollbarModule,
        MatDialogModule,
        NgxPaginationModule,
        StoreModule.forRoot([]),
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        PageSectionComponent,
        BrAnalyteSummaryEntryStubComponent,
        BrAnalyteSummaryViewStubComponent,
        BrAnalytePointEntryStubComponent,
        BrAnalytePointViewComponent,
        BrEntrySaveComponent,
        MatCard,
        MatCardTitle,
        MatCardSubtitle,
        MatCardContent,
        // UnityNextNumberPipe,
        UnDateFormatPipe
      ],
      providers: [
        { provide: PageSectionService, useValue: pageSectionConst.mockPageSectionService },
        { provide: LabDataApiService, useValue: pageSectionConst.mockLabDataApiService },
        { provide: CodelistApiService, useValue: pageSectionConst.mockCodelistApiService },
        { provide: UIConfigService, useValue: pageSectionConst.mockUIConfigAction },
        { provide: ChangeTrackerService },
        { provide: DataManagementSpinnerService, useValue: pageSectionConst.mockDataManagementSpinnerService },
        { provide: MessageSnackBarService, useValue: '' },
        { provide: RunsService, useValue: pageSectionConst.mockRunsService },
        { provide: NotificationService, useClass: pageSectionConst.MockNotificationService },
        { provide: DateTimeHelper, useValue: pageSectionConst.mockDateTimeHelper },
        { provide: NavigationService, useValue: pageSectionConst.mockNavigationService },
        { provide: AppLoggerService, useValue: {} },
        { provide: NgRedux, useValue: {} },
        { provide: Store, useValue: pageSectionConst.mockStore },
        { provide: ErrorLoggerService, useValue: pageSectionConst.mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: InProgressMessageTranslationService, useValue: pageSectionConst.mockInprogressMessageService },
        { provide: LoggingApiService, useValue: loggingApiServiceMock },
        provideMockStore({ initialState: pageSectionConst.mockStore }),
        TranslateService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSectionComponent);
    component = fixture.componentInstance;
    component.licensedProducts = [{ product: 1, fileOption: 1 }];
    component.licensedProductTypeConnectivity = 1;
    component.instrumentSection = pageSectionConst.mockInstrumentSection;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submitAsync should call postDataBatch with data', inject([PageSectionService], (pageSectionService: PageSectionService) => {
    spyOn(pageSectionService, 'extractValidAnalyteEntries').and.returnValue([pageSectionConst.mockAnalyteEntry]);
    spyOn(pageSectionService, 'createPostBaseRawDataSet').and.returnValue(of(pageSectionConst.mockRawdata).toPromise());
    component.instrumentSection = pageSectionConst.mockInstrumentSection;
    fixture.detectChanges();

    component.submitAsync();

    expect(pageSectionService.extractValidAnalyteEntries).toHaveBeenCalled();
    expect(pageSectionService.createPostBaseRawDataSet).toHaveBeenCalled();
  }));

  it('should navigate to instrument settings', async () => {
    component.instrumentId = '2749';
    component.inProgress = false;
    const spyObj = spyOn(component, 'gotoInstrumentSettings').and.callThrough();
    fixture.detectChanges();
    const btnElem = fixture.debugElement.query(By.css('.spec_instrument_nav'));
    expect(btnElem).toBeTruthy();
    btnElem.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spyObj).toHaveBeenCalled();
    });
  });

  it('should navigate to control settings', async () => {
    component.controlId = '240';
    component.inProgress = false;
    const spyObj = spyOn(component, 'gotoControlSettings').and.callThrough();
    fixture.detectChanges();
    const btnElem = fixture.debugElement.query(By.css('.spec_control_nav'));
    expect(btnElem).toBeTruthy();
    btnElem.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spyObj).toHaveBeenCalled();
    });
  });

  it('should navigate to panel settings', async () => {
    component.panelId = '2749';
    component.inProgress = false;
    const spyObj = spyOn(component, 'gotoEditPanel').and.callThrough();
    fixture.detectChanges();
    const btnElem = fixture.debugElement.query(By.css('.spec_panel_nav'));
    expect(btnElem).toBeTruthy();
    btnElem.nativeElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(spyObj).toHaveBeenCalled();
    });
  });

  it('should toggle between edit entry and readonly', () => {
    spyOn(component, 'toggleLastEntryVisibility').and.callThrough();
    component.isLastDataEntryVisible = false;
    fixture.detectChanges();
    component.toggleLastEntryVisibility();
    expect(component.isLastDataEntryVisible).toBeTrue();
  });

  it('should change tab order', () => {
    spyOn(component, 'onTabOrderChange').and.callThrough();
    component.onTabOrderChange(true);
    expect(component['isTabOrderRunEntry']).toBeTrue();
    expect(component['uiConfigAction'].updateTabOrderState).toHaveBeenCalledWith(true);
  });

  it('should show data table sorted as per the custom sort order', async () => {
    const sortedItems = orderBy(pageSectionConst.mockInstrumentSection.productSections[0].analyteSections,
      [(analyteSection) => analyteSection.analyteInfo.sortOrder,
      (analyteSection) => analyteSection.analyteInfo.testName.replace(/\s/g, '').toLocaleLowerCase()],
      [asc, asc]);
    expect(pageSectionConst.mockInstrumentSection.productSections[0].analyteSections[0].analyteInfo.testName)
      .not.toEqual(sortedItems[0].analyteInfo.testName);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.sortedAnalyteSections[0].analyteInfo.testName).toEqual(sortedItems[0].analyteInfo.testName);
      expect(component.sortedAnalyteSections[1].analyteInfo.testName).toEqual(sortedItems[1].analyteInfo.testName);
    });
  });
});
