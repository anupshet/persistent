// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { MissingTestsComponent } from './missing-tests.component';
import { missigTestsData } from './missing-tests.data';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { DataReviewService } from '../../../../app/shared/api/data-review.service';
import { AppNavigationTrackingService } from '../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import * as mockData from '../../../../../db.json';
import { HttpLoaderFactory } from '../../../../app/app.module';

describe('MissingTestsComponent', () => {
  let component: MissingTestsComponent;
  let fixture: ComponentFixture<MissingTestsComponent>;
  const unreviewedDataResponse = mockData.data;

  const mockDataReviewService = {
    getDataReviewData: () => {
      return of(unreviewedDataResponse);
    },
    reviewData: () => {
      return of();
    },
    getUserReviewPreferences: () => {
      return of();
    },
    dataColumnsHandler: () => {
      return of();
    }
  };

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const mockMissingTestsData = {
    "labLocationId": "a078eece-99a6-4c12-8efd-8d1c5c0c74a7",
    "reviewType": 1,
    "labDepartments": [
      "767ee78f-b17d-41e3-bcac-42af8a220a20",
      "71375a2d-629a-4348-9536-d188e8ae5652",
      "fb5d3aec-26bc-46af-8065-962261e023b9"
    ],
    "labInstruments": [
      "5cec0153-c705-44dc-9334-e66b5fc82816",
      "43c851a4-1ec5-450b-95a6-76058fdf8029",
      "4ed1f0cb-0c53-4b82-b3b3-ffad313227e5",
      "49d1b98f-d0c3-4bf9-abb4-a2fa654d5adb",
      "cd831070-abc0-48ef-9e1d-7414130e5699",
      "9702f002-67b8-4c27-9540-78796ea4d73a",
      "3dc18c08-1cbe-4083-9ad7-bca47bc2ccf0"
    ],
    'instrumentsGroupedByDept': true,
    "response": {
      "missingTests": [
        {
          "labLotTestId": "1ae8704e-64b3-486b-a1f6-916ac346138f",
          "departmentName": "DemoDeprt",
          "instrumentName": "Polymedco",
          "controlName": "Unassayed Chemistry",
          "lot": "28870",
          "analyteName": "Cholesterol, HDL",
          "level": 1
        }
      ],
      "paginationParams": {
        "pageIndex": 0,
        "totalPages": 3,
        "pageSize": 10,
        "totalItems": 23
      }
    }
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    comparePriorAndCurrentValues: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatTableModule,
        NgxPaginationModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ MissingTestsComponent ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: mockMissingTestsData},
        { provide: DataReviewService, useValue: mockDataReviewService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    mockMissingTestsData.instrumentsGroupedByDept = true;
    fixture = TestBed.createComponent(MissingTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check test of all elements', () => {
    fixture.detectChanges();
    
    let dialogTitle = fixture.debugElement.query(By.css('#dialogTitle'));
    expect(dialogTitle.nativeElement.innerText).toEqual('MISSINGTESTS.MISSINGTESTSTITLE');

    let cancelButtonText = fixture.debugElement.query(By.css('#cancelButton'));
    expect(cancelButtonText.nativeElement.innerText).toEqual('MISSINGTESTS.CANCEL');

    const okayButtonText = fixture.debugElement.query(By.css('.okay-button'));
    expect(okayButtonText.nativeElement.innerText).toEqual('MISSINGTESTS.OKAY');
  });

  it('should render the table', () => {
    const table = fixture.nativeElement.querySelector('.missing-tests-table');
    expect(table).toBeTruthy();
  });

  it('should render the table with the correct number of rows', () => {
    component.dataSource = missigTestsData;
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.rowData');
    expect(rows.length).toEqual(missigTestsData.length);

    for (let row = 0; row < rows.length; row++) {
      expect(rows[row].children[0].innerText).toContain(missigTestsData[row].departmentName);
      expect(rows[row].children[1].innerText).toContain(missigTestsData[row].instrumentName);
      expect(rows[row].children[2].innerText).toContain(missigTestsData[row].controlName);
      expect(rows[row].children[3].innerText).toContain(missigTestsData[row].lot);
      expect(rows[row].children[4].innerText).toContain(missigTestsData[row].analyteName);
      expect(rows[row].children[5].innerText).toContain(missigTestsData[row].level);
    }
  });

  it('should hide the department column if the instruments are not grouped by department', () => {
    const allColumnsCount = component.displayedColumns.length;
    component.dataSource = missigTestsData;
    fixture.detectChanges();
    
    // instrumentsGroupedByDept is true
    let cols = fixture.nativeElement.querySelectorAll('th');
    expect(cols.length).toEqual(allColumnsCount);
    expect(cols[0].innerText).toEqual('MISSINGTESTS.DEPARTMENT');
    expect(cols[1].innerText).toEqual('MISSINGTESTS.INSTRUMENT');
    expect(cols[2].innerText).toEqual('MISSINGTESTS.CONTROL');
    expect(cols[3].innerText).toEqual('MISSINGTESTS.LOT');
    expect(cols[4].innerText).toEqual('MISSINGTESTS.ANALYTE');
    expect(cols[5].innerText).toEqual('MISSINGTESTS.LEVEL');

    mockMissingTestsData.instrumentsGroupedByDept = false;
    component.ngOnInit();
    fixture.detectChanges();
  
    // instrumentsGroupedByDept is false
    cols = fixture.nativeElement.querySelectorAll('th');
    expect(cols.length).toEqual(allColumnsCount - 1);
    expect(cols[0].innerText).toEqual('MISSINGTESTS.INSTRUMENT');
    expect(cols[1].innerText).toEqual('MISSINGTESTS.CONTROL');
    expect(cols[2].innerText).toEqual('MISSINGTESTS.LOT');
    expect(cols[3].innerText).toEqual('MISSINGTESTS.ANALYTE');
    expect(cols[4].innerText).toEqual('MISSINGTESTS.LEVEL');
  });
});
