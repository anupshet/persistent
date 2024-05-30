// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { MappingService } from './mapping.service';
import { ApiService } from '../../../shared/api/api.service';
import { ConfigService } from '../../../core/config/config.service';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ConnectivityMappingApiService } from '../../../shared/api/connectivityMappingApi.service';
import { CodelistApiService } from '../../../shared/api/codelistApi.service';
import { IconService } from '../../../shared/icons/icons.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { LoggingApiService } from '../../../shared/api/logging-api.service';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../shared/locale/locale-converter.service';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { TranslateService } from '@ngx-translate/core';

describe('MappingService', () => {

  let service: MappingService;

  const appNavigationTrackingServiceMock = jasmine.createSpyObj('AppNavigationTrackingService', ['logAuditTracking']);

  const ConfigServiceStub = {
    getConfig: () => {
      return { 'connectivityMappingUrl': '' };
    }
  };
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ApiService,
        AppLoggerService,
        ConnectivityMappingApiService,
        CodelistApiService,
        IconService,
        LoggingApiService,
        DateTimeHelper,
        LocaleConverter,
        { provide: TranslateService, useValue: { get: tag => of(tag) } },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: ConfigService, useValue: ConfigServiceStub },
        { provide: Store, useValue: [] },
        { provide: AppNavigationTrackingService, useValue: appNavigationTrackingServiceMock },
        provideMockStore({})
      ],
    });
    service = TestBed.inject(MappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call sendAuditTrailPayload method', () => {
    const auditTrailCurrentPayload: any = {
      documentId: 'd2956f09-efdc-45ee-90fb-fb15577282a9',
      locationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      departmentId: '06bc334f-7cf4-4713-92d8-4bc0ad78b484',
      entityId: 'e524b088-8601-4256-854d-9b80d64f9204',
      code: 'DARWIN SQUARE EXL BIORAD1'
    };
    const nodeType = 'instrument';
    const eventType = 'File Upload';
    const action = 'Map';
    const actionStatus = 'Success';
    service.sendAuditTrailPayload(auditTrailCurrentPayload, nodeType, eventType, action, actionStatus);

    const auditTrailFinalPayload = {
      auditTrail: {
        eventType: eventType,
        action: action,
        actionStatus: actionStatus,
        currentValue: {
          documentId: 'd2956f09-efdc-45ee-90fb-fb15577282a9',
        locationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
        departmentId: '06bc334f-7cf4-4713-92d8-4bc0ad78b484',
        entityId: 'e524b088-8601-4256-854d-9b80d64f9204',
        code: 'DARWIN SQUARE EXL BIORAD1',
        nodeTypeName: nodeType
        }
      }
    };

    expect(appNavigationTrackingServiceMock['logAuditTracking']).toHaveBeenCalledWith(auditTrailFinalPayload, true);
  });
});
