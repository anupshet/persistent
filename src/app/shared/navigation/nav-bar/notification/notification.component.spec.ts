// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';

import { NotificationComponent } from './notification.component';
import { NotificationApiService } from '../../services/notificationApi.service';
import * as fromRoot from '../../../../state/app.state';
import { UserNotification } from '../../models/notification.model';
import { NotificationService } from '../../../../core/notification/services/notification.service';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import * as actions from '../../state/actions';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { DateTimeHelper } from '../../../date-time/date-time-helper';
import { LocaleConverter } from '../../../locale/locale-converter.service';
import { NavigationService } from '../../navigation.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { UnityNextTier } from '../../../../contracts/enums/lab-location.enum';
import { HttpLoaderFactory } from '../../../../app.module';
import { LoggingApiService } from '../../../../shared/api/logging-api.service';
import { UIConfigService } from '../../../../shared/services/ui-config.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let store: MockStore<any>;
  let spyOnStore: any;
  const mockState = {};
  let de: DebugElement;

  const mockNotificationApiService = {
    notificationData: () => {
      return {
        auditTrail: {
          eventType: 'notification',
          action: 'view',
          actionStatus: 'Success',
          currentValue:
            { ids: ['4c354ec8-cfbc-479b-ac3b-0dff92602c75', '72cef12e-deab-4995-975f-79638daf1718'] }
          , priorValue: {}
        },
      };
    },

  };

  class MockNotificationService {
    public get $labStream() {
      return of(2);
    }
  };
   const mockLoggingApiService = {
    auditTracking: () => { }
  };
  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);


  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigate')
  };

  const currentLabLocation = {
    displayName: 'Vishwajit\'s Lab',
    labLocationName: 'Vishwajit\'s Lab',
    locationTimeZone: 'Asia/Kolkata',
    locationOffset: '05:30:00',
    locationDayLightSaving: '00:00:00',
    labLocationContactId: '74098d1f-e0a0-46ab-b1c1-405cf10c4d9b',
    labLocationAddressId: '0a69a3c7-68ca-4f42-92c7-be79879bb37d',
    labLocationContact: {
      entityType: 0,
      searchAttribute: 'vishwajit_shinde+devconn@bio-rad.com',
      firstName: 'vishwajit',
      middleName: '',
      lastName: 'shinde',
      name: 'vishwajit shinde',
      email: 'vishwajit_shinde+devconn@bio-rad.com',
      phone: '',
      id: '74098d1f-e0a0-46ab-b1c1-405cf10c4d9b',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
      }
    },
    labLocationAddress: {
      entityType: 1,
      searchAttribute: '',
      nickName: '',
      streetAddress1: 'Rajiv Gandhi IT park',
      streetAddress2: '',
      streetAddress3: '',
      streetAddress: 'Rajiv Gandhi IT park',
      suite: '',
      city: 'Pune',
      state: 'MH',
      country: 'IN',
      zipCode: '410057',
      id: '0a69a3c7-68ca-4f42-92c7-be79879bb37d',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
      }
    },
    accountSettings: {
      displayName: '',
      dataType: 1,
      instrumentsGroupedByDept: true,
      trackReagentCalibrator: false,
      fixedMean: false,
      decimalPlaces: 2,
      siUnits: false,
      labSetupRating: 0,
      labSetupComments: '',
      isLabSetupComplete: true,
      labSetupLastEntityId: 'null',
      id: '635b3412-679a-4201-97f4-c6df45bcfab6',
      parentNodeId: 'd1de4052-28a5-479f-b637-ef258e0e2578',
      parentNode: null,
      nodeType: 9,
      children: null
    },
    hasOwnAccountSettings: false,
    id: '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
    parentNodeId: 'b6e6e6e3-ed8e-4bc9-8b1b-3fcdfecd3476',
    parentNode: null,
    nodeType: 2,
    children: []
  };

  const notificationState: Array<UserNotification> = [{
    notificationUuid: '1',
    typeId: 0,
    featureId: 0,
    messageId: 0,
    qcDataSourceId: 0,
    order: 0,
    createdTimestamp: new Date('2020-09-29T05:49:00Z'),
    notificationSpecificData: {
      dataProcessingError: {
        instrumentName: null,
        productName: null,
        analyteName: null,
        departmentName: null,
        dataTypeId: 1,
        decimalPlaces: 2,
        levelData: [
          {
            level: 1,
            value: 1.2
          }
        ]
      }
    }
  }];

  const StateArray = {
    location: {
      currentLabLocation: currentLabLocation
    },
    notification: {
      notificationList: notificationState
    }
  };

  const mockUIConfSvc = {
    updateAnalyticalSectionState: () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(fromRoot.reducers),
        MaterialModule,
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
      declarations: [NotificationComponent, NotificationListComponent, DecimalPipe],
      providers: [
        { provide: NotificationApiService, useValue: mockNotificationApiService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: LoggingApiService, useValue: mockLoggingApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: Store, useValue: StateArray },
        { provide: Router, useValue: mockRouter },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: NavigationService, useValue: of('') },
        { provide: UIConfigService, useValue: mockUIConfSvc },
        DateTimeHelper,
        LocaleConverter,
        provideMockStore(mockState),
        TranslateService,
      ],
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(StateArray);
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should fetch notification using Id for Peer QC', () => {
    spyOnStore = spyOn(store, 'dispatch');
    component.labLocation.id = 'e2231cca-07c1-43e2-a1a2-5ea2de501247';
    component.labLocation.unityNextTier =  UnityNextTier.PeerQc;
    fixture.detectChanges();
    component.ngOnInit();
    expect(spyOnStore).toHaveBeenCalledTimes(2);
    expect(spyOnStore).toHaveBeenCalledWith(
      actions.notificationActions.getNotificationList({ locationId: component.labLocation.id })
    );
  });

  it('Should fetch notification using Id for Advanced QC', () => {
    spyOnStore = spyOn(store, 'dispatch');
    component.labLocation.id = 'e2231cca-07c1-43e2-a1a2-5ea2de501247';
    component.labLocation.unityNextTier =  UnityNextTier.DailyQc;
    fixture.detectChanges();
    component.ngOnInit();
    expect(spyOnStore).toHaveBeenCalledTimes(2);
    expect(spyOnStore).toHaveBeenCalledWith(
      actions.notificationActions.getNotificationList({ locationId: component.labLocation.id })
    );
  });

  it('Should dismiss notification using notificationUuid', () => {
    const notificationListComp = de.query(By.directive(NotificationListComponent));
    const cmp = notificationListComp.componentInstance;
    spyOnStore = spyOn(store, 'dispatch');
    cmp.dismissNotificationId.emit('1');
    expect(spyOnStore).toHaveBeenCalledTimes(1);
    expect(spyOnStore).toHaveBeenCalledWith(
      actions.notificationActions.dismissNotification({ notificationUuid: '1' })
    );
  });

  it('Should remove all notification', () => {
    spyOnStore = spyOn(store, 'dispatch');
    component.removeAllNotifications();
    expect(spyOnStore).toHaveBeenCalledWith(
      actions.notificationActions.dismissAllNotification({ locationId: component.labLocation.id })
    );
  });
});
