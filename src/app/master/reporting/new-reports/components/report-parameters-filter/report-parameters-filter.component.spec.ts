// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject, of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';


import { NavigationService } from '../../../../../shared/navigation/navigation.service';
import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { DynamicReportsService } from '../../services/dynamic-reports.service';
import { ReportParametersFilterComponent } from './report-parameters-filter.component';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../../../../contracts/models/shared/br-error.model';
import { ConfirmNavigateGuard } from '../../../shared/guard/confirm-navigate.guard';
import { HttpLoaderFactory } from '../../../../../app.module';

describe('ReportParametersFilterComponent', () => {
  let component: ReportParametersFilterComponent;
  let fixture: ComponentFixture<ReportParametersFilterComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };
  const mockTestSpecDynamicReportingService = {
    getStatisticsPeerAndMethodData: () => of([]).toPromise()
  };
  const storeStub = {
    security: null,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null
  };
  const mockNavigationService = {
    navigateToUrl: jasmine.createSpy()
  };

  const isCreateBtnDisabled = new BehaviorSubject<boolean>(false);
  const reportingService = {
    searchReport: () => {
      return of({});
    },
    enableOrDisableCreateButton: (status: boolean) => {
      isCreateBtnDisabled.next(status);
    },
    getCreateButtonStatus: () => {
      return of(true);
    }
  };
  const dialogRefStub = {
    close: () => { },
    afterClosed: () => of(false)
  };
  const dialogStub = {
    open: () => dialogRefStub,
    close: () => { }
  };

  const mockConfirmNavigateGuard = {
    canDeactivate:     () => { },
    openGenericDialog: () => { },
    confirmationModal: () => { },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportParametersFilterComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        TranslateService,
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MatDialog, useValue: dialogStub },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: FormBuilder, useValue: formBuilder },
        { provide: DynamicReportingService, useValue: mockTestSpecDynamicReportingService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: DynamicReportsService, useValue: reportingService },
        { provide: ConfirmNavigateGuard, useValue: mockConfirmNavigateGuard },
        provideMockStore({ initialState: storeStub })
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportParametersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should reset form when clicked on resetbutton', () => {
    const spy = spyOn(component.newReportsForm, 'reset').and.callThrough();
    const resetButton = fixture.debugElement.query(By.css('.filter-one-component'));
    expect(resetButton.nativeElement).toBeDefined();
  });
  it('should navigate previous route when clicked on cancel', () => {
    const cancelBtn = fixture.debugElement.query(By.css('.btn-cancel')).nativeElement;
    expect(cancelBtn).toBeDefined();
  });
});
