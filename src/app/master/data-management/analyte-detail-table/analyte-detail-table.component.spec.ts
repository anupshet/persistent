// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.

import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRouteStub } from '../../../../testing/activated-route-stub';
import { Autofixture } from 'ts-autofixture/dist/src';
import {
  Run,
  RunsResult
} from '../../../contracts/models/data-management/runs-result.model';
import { AnalyteDetailTableComponent } from './analyte-detail-table.component';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { RunsService } from '../../../shared/services/runs.service';

import { NotificationService } from '../../../core/notification/services/notification.service';
import { ConfigService } from '../../../core/config/config.service';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { SummaryStatisticsTableService } from './analytical-section/summary-statistics-table/summary-statistics-table.service';
import { DataManagementSpinnerService } from '../../../shared/services/data-management-spinner.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { InProgressMessageTranslationService } from '../../../shared/services/inprogress-message-translation.service';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { TranslateService } from '@ngx-translate/core';

const autofixture = new Autofixture();
const runsResultStub = autofixture.create(new RunsResult());
runsResultStub.runs = autofixture.createMany(new Run());

const activatedRouteStub = new ActivatedRouteStub(null, { id: '1' });
const mockNavigationService = {
  navigateToUrl: () => { }
};

const mockRunsService = jasmine.createSpyObj([
  'getCachedComment',
  'setCachedComment',
  'updateTestSpecId',
  'filterExpiredLotsForSpecificDate',
  'isLotExpiredForSpecificDate',
  'postNewRunData',
  'getTranslation'
]);

class MockNotificationService {
  public get $labStream() {
    return of(2);
  }
}

const ConfigServiceStub = {
  getConfig: () => {
    return { 'auditTrail': '' };
  }
};

const mockErrorLoggerService = jasmine.createSpyObj([
  'logErrorToBackend',
  'populateErrorObject'
]);

const mockInprogressMessageService = {
  setProgressMessage: (unavailableReasonCode) => {
    return { progressHeader: null, progressMessage: null };
  },
  getTranslatedInprogressTexts: (translationCode) => { }
};

const mockTestSpecSummaryStatisticsTableService = {
  getSummaryStatsByLabMonthStatsInfoAndDate: () => of([]).toPromise()
};

const mockAppNavigationTrackingService = {
  logAuditTracking: () => { }
};

@Component({ selector: 'unext-level-toggle', template: '' })
class LevelToggleStubComponent { }

@Component({ selector: 'unext-summary-statistics-table', template: '' })
class SummaryStatisticsTableStubComponent { }

@Component({ selector: 'unext-lj-chart', template: '' })
class LjChartStubComponent {
  @Input() data: RunsResult;
}

@Component({ selector: 'unext-runs-table', template: '' })
class RunsTableStubComponent { }

describe('AnalyteDetailTableComponent', () => {
  let component: AnalyteDetailTableComponent;
  let fixture: ComponentFixture<AnalyteDetailTableComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [MatButtonToggleModule, NgReduxTestingModule],
        declarations: [
          AnalyteDetailTableComponent,
          LevelToggleStubComponent,
          SummaryStatisticsTableStubComponent,
          LjChartStubComponent,
          RunsTableStubComponent
        ],
        providers: [
          CodelistApiService,
          HttpClient,
          HttpHandler,
          DataManagementSpinnerService,
          { provide: TranslateService, useValue: { get: tag => of(tag) } },
          { provide: Store, useValue: [] },
          { provide: ConfigService, useValue: ConfigServiceStub },
          { provide: SummaryStatisticsTableService, useValue: mockTestSpecSummaryStatisticsTableService },
          {
            provide: ActivatedRoute,
            useValue: activatedRouteStub
          },
          { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
          {
            provide: NavigationService,
            useValue: mockNavigationService
          },
          { provide: InProgressMessageTranslationService, useValue: mockInprogressMessageService },
          {
            provide: ErrorLoggerService, useValue: mockErrorLoggerService
          },
          { provide: RunsService, useValue: mockRunsService },
          { provide: NotificationService, useClass: MockNotificationService },
          provideMockStore({})
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyteDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should called auditEditdata', () => {
    fixture.detectChanges();
    spyOn(component, 'gotoEditAnalyte').and.callThrough();
    spyOn(component, 'auditEditdata').and.callThrough();
    component.gotoEditAnalyte();
    component.auditEditdata();
    expect(component.auditEditdata).toHaveBeenCalled();
  });
});
