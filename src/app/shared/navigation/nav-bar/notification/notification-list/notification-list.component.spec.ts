//  © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MaterialModule } from 'br-component-library';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DecimalPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NotificationListComponent } from './notification-list.component';
import { DateTimeHelper } from '../../../../date-time/date-time-helper';
import { LocaleConverter } from '../../../../locale/locale-converter.service';
import { ErrorLoggerService } from '../../../../services/errorLogger/error-logger.service';
import { OperationType } from '../../../../../contracts/enums/lab-setup/operation-type.enum';
import { NavigationService } from '../../../navigation.service';
import { AppNavigationTrackingService } from '../../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { NotificationApiService } from '../../../services/notificationApi.service';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { HttpLoaderFactory } from '../../../../../app.module';
import { UIConfigService } from '../../../../services/ui-config.service';

describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  let notificationApiService: NotificationApiService;
  let appNavigationService: AppNavigationTrackingService;
  let fixture: ComponentFixture<NotificationListComponent>;
  const mockNavigationService = { setSelectedInstrumentNodeById: () => { }, setSelectedNotificationId: () => { } };
  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { }
  };

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

  const mockAuditTrailValues = {
    'auditTrail': {
      'eventType': 'notification',
      'action': 'view',
      'actionStatus': 'Success',
      'currentValue': {},
      'priorValue': {}
    }
  };

  const mockNotifications = [
    {
      notificationUuid: '111111111111111111',
      typeId: 1,
      featureId: 1,
      messageId: 1,
      qcDataSourceId: 1,
      order: 1,
      createdTimestamp: new Date(),
      notificationSpecificData: {
        dataProcessingError: {
          instrumentName: 'Dummy Instrument 1',
          productName: 'Dummy Product 1',
          analyteName: 'Dummy Analyte 1',
          departmentName: null,
          dataTypeId: 0,
          decimalPlaces: 3,
          levelData: [
            {
              level: 1,
              value: 1.1,
            },
            {
              level: 2,
              value: 2.2,
            }
          ]
        }
      }
    },
    {
      notificationUuid: '22222222222222',
      typeId: 1,
      featureId: 1,
      messageId: 1,
      qcDataSourceId: 1,
      order: 1,
      createdTimestamp: new Date('2020-08-11T02:35:58.542Z'),
      notificationSpecificData: {
        dataProcessingError: {
          instrumentName: 'Dummy Instrument 2',
          productName: 'Dummy Product 2',
          analyteName: 'Dummy Analyte 2',
          departmentName: 'Dummy Department 2',
          dataTypeId: 1,
          decimalPlaces: 2,
          levelData: [
            {
              level: 3,
              mean: 3.3,
              sd: 2.1,
              nPts: 5
            },
            {
              level: 1,
              mean: 3.2,
              sd: 2.4,
              nPts: 6
            },
            {
              level: 2,
              mean: 2.3,
              sd: 1.1,
              nPts: 4
            }
          ]
        }
      }
    }
  ];

  const mockRouter = {
    navigateByUrl: jasmine.createSpy('navigate')
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpClientModule,
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
      ],
      declarations: [
        NotificationListComponent,
        DecimalPipe
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UIConfigService, useValue: {} },
        DateTimeHelper,
        LocaleConverter,
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: NotificationApiService, useValue: mockNotificationApiService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService},
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    notificationApiService = TestBed.inject(NotificationApiService);
    appNavigationService = TestBed.inject(AppNavigationTrackingService);
    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
    component.notifications = mockNotifications;
    component.expandNotificationList = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call captureViewEvent', () => {
    spyOn(notificationApiService, 'notificationData').and.returnValue(mockAuditTrailValues);
    spyOn(appNavigationService, 'logAuditTracking');
    component.captureViewEvent();
    expect(notificationApiService.notificationData).toHaveBeenCalled();
    expect(appNavigationService.logAuditTracking).toHaveBeenCalledWith(mockAuditTrailValues, true);
  });

  it('verify if notification list shown on click of notifications icon', () => {
    const notificationIconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_notification_icon');
    const notificationMenuElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('mat-menu');
    notificationIconElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(notificationMenuElement).toBeTruthy();
    });
  });

  it('verify if notification menu do not appear on click of notifications icon when expandNotificationList is false', () => {
    component.expandNotificationList = false;
    fixture.detectChanges();
    const notificationIconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_notification_icon');
    const notificationMenuElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_notification_menu');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      notificationIconElement.click();
      fixture.detectChanges();
      expect(notificationMenuElement).toBeFalsy();
    });
  });

  it('verify if notification is dismiss when clicked on X', () => {
    const notificationIconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_notification_icon');
    notificationIconElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const notificationDismissElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_dismiss_notification');
      if (notificationDismissElement) {
        notificationDismissElement.click();
      }
      spyOn(component, 'dismissNotification').and.callThrough();
      component.dismissNotification('22222222222222');
      expect(component.dismissNotification).toHaveBeenCalled();
    });
  });

  it('verify correct notification shown for Panel create failure', () => {
    component.notifications = [
      {
        notificationUuid: '111111111111111111',
        typeId: 1,
        featureId: 4,
        messageId: 1,
        qcDataSourceId: 1,
        order: 1,
        createdTimestamp: new Date(),
        notificationSpecificData: {
          panel: {
            panelName: 'Panel ABC',
            dateTime: new Date(),
            panelState: 0,
            isSuccess: false
          }
        }
      }
    ];
    fixture.detectChanges();
    const notificationIconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_notification_icon');
    const notificationMenuElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('mat-menu');
    notificationIconElement.click();
    fixture.detectChanges();
    const notificationTitle = fixture.debugElement.query(By.css('.spec_notificationTitle'));
    const notificationMsg = fixture.debugElement.query(By.css('.spec_notificationMsg'));
    expect(notificationMenuElement).toBeTruthy();
    expect(notificationTitle.nativeElement.textContent.trim()).toEqual(component.getTranslations('TRANSLATION.CREATIONERROR'));
    expect(notificationMsg.nativeElement.textContent.trim())
      .toEqual(component.getTranslations('TRANSLATION.CREATIONERROR') + '  [ ' + component.notifications[0].notificationSpecificData.panel.panelName + ' ]');
  });

  it('verify correct notification shown for Panel edit failure', () => {
    component.notifications = [
      {
        notificationUuid: '111111111111111111',
        typeId: 1,
        featureId: 4,
        messageId: 1,
        qcDataSourceId: 1,
        order: 1,
        createdTimestamp: new Date(),
        notificationSpecificData: {
          panel: {
            panelName: 'Panel ABC',
            dateTime: new Date(),
            panelState: 1,
            isSuccess: false
          }
        }
      }
    ];
    fixture.detectChanges();
    const notificationIconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_notification_icon');
    const notificationMenuElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('mat-menu');
    notificationIconElement.click();
    fixture.detectChanges();
    const notificationTitle = fixture.debugElement.query(By.css('.spec_notificationTitle'));
    const notificationMsg = fixture.debugElement.query(By.css('.spec_notificationMsg'));
    expect(notificationMenuElement).toBeTruthy();
    expect(notificationTitle.nativeElement.textContent.trim()).toEqual(component.getTranslations('TRANSLATION.EDITERROR'));
    expect(notificationMsg.nativeElement.textContent.trim())
      .toEqual(component.getTranslations('TRANSLATION.EDITERROR') + '  [ ' + component.notifications[0].notificationSpecificData.panel.panelName + ' ]');
  });

  it('verify correct notification shown for Copy Instrument failure', () => {
    component.notifications = [
      {
        notificationUuid: '111111111111111111',
        typeId: 1,
        featureId: 5,
        messageId: 1,
        qcDataSourceId: 1,
        order: 1,
        createdTimestamp: new Date(),
        notificationSpecificData: {
          copyInstrument: {
            instrumentName: 'instrument1',
            departmentName: 'department1',
            copyTimestamp: new Date(),
            operationType: OperationType.Copy,
            isSuccess: false
          }
        }
      }
    ];
    fixture.detectChanges();
    const notificationIconElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_notification_icon');
    const notificationMenuElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('mat-menu');
    notificationIconElement.click();
    fixture.detectChanges();
    const notificationTitle = fixture.debugElement.query(By.css('.spec_notificationTitle'));
    const notificationMsg = fixture.debugElement.query(By.css('.spec_notificationMsg'));
    expect(notificationMenuElement).toBeTruthy();
    expect(notificationTitle.nativeElement.textContent.trim()).toEqual(component.getTranslations('TRANSLATION.INSTRUMENTERROR'));
    expect(notificationMsg.nativeElement.textContent.trim())
      .toEqual(component.getTranslations('TRANSLATION.COPYINSTRUMENT'));
  });

  it('should dismiss all notification when clear button is clicked', () => {
    const notificationsData =
      [{
        notificationUuid: 'TestNotificationId',
        typeId: 1,
        featureId: 6,
        messageId: 1,
        qcDataSourceId: 1,
        order: 1,
        createdTimestamp: new Date(),
        notificationSpecificData: {
          copyInstrument: {
            instrumentName: 'instrument1',
            departmentName: 'department1',
            copyTimestamp: new Date(),
            operationType: OperationType.Copy,
            isSuccess: false
          },
          reports: {
            pdfUrl: 'testUrl',
            accountName: '',
            yearMonth: '',
            instrumentName: '',
            isSuccess: true,
            metaId: '',
            instrumentId: '',
          }
        }
      }];
    const spy = spyOn(component.dismissAllNotifications, 'emit');
    component.notifications = notificationsData;
    component.clearAllNotifications();
    expect(spy).toHaveBeenCalled();
  });
});
