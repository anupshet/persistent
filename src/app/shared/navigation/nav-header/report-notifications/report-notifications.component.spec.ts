// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReportNotificationsComponent } from './report-notifications.component';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { ReportNotification } from '../../models/report-notification.model';
import { NavigationService } from '../../navigation.service';
import { DynamicReportingService } from '../../../../shared/services/reporting.service';
import { HttpLoaderFactory } from '../../../../app.module';


describe('ReportNotificationsComponent', () => {
  let component: ReportNotificationsComponent;
  let fixture: ComponentFixture<ReportNotificationsComponent>;
  let router: Router;
  const storeStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['User'],
      permissions: {
        rolePermissions: {
          role: {
            permission: true,
          }
        }
      },
      userData: {
        assignedLabNumbers: [],
        defaultLab: ''
      },
      accountNumber: '',
      accountId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
      labLocationId: '0d66767b-612c-4254-9eed-3a7ab393029f',
      labLocationIds: ['0d66767b-612c-4254-9eed-3a7ab393029f'],
      accountNumberArray: [],
      accessToken: '',
      id: 'eca89ea6-aba1-4b95-9396-0238352a4765',
      labId: ''
    },
    directory: {
      id: 10,
      name: 'Test',
      locations: null,
      children: [],
      primaryUnityLabNumbers: 'Test',
    }
  };
  const mockData: ReportNotification[] = [
    {
        id: 'd9d2a418-fb92-11ed-be56-0242ac120002',
        metaId: '747D042F12FD4F18A783272DD9EAC557',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: -1,
        reportType: '0_1_2',
        reportName: 'Template report testing dummy 05-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-04-05T08:01:01.669Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    },
    {
        id: 'd9d2b28c-fb92-11ed-be56-0242ac120002',
        metaId: '3C6F3873EBAB4B8A92C6FAB618BE8999',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: 1,
        reportType: '0_1_2',
        reportName: 'Template report testing dummy 05-2023',
        pdfUrl: 'temp-en-US-103226-20230404131835-202312-0_1_2-925fef03-b2e1-40f5-b0df-91304ced1e3a-00ugnpnk25bSS232z2p7.pdf',
        updatedTimestamp: '2023-04-04T07:49:34.443Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: true
    },
    {
        id: 'd9d2ace2-fb92-11ed-be56-0242ac120002',
        metaId: '747D042F12FD4F18A783272DD9EAC559',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: -1,
        reportType: '0_1_2',
        reportName: 'Template report testing dummy 05-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-04-05T08:01:01.669Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    },
    {
        id: '21d17eeb-fc4a-42b6-ba36-041a56314389',
        metaId: '747D042F12FD4F18A783272DD9EAC552',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: -1,
        reportType: '0_1_2',
        reportName: 'Template report test4 12-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-04-05T08:01:01.669753Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: true
    },
    {
        id: '0a3d2692-e494-4ad8-b2d7-bab86e35cecf',
        metaId: '858366C599434E46860A10853CBC938E',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: 0,
        reportType: '0_1_2',
        reportName: 'Template report test4 12-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-04-11T13:13:00.564767Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: true
    },
    {
        id: 'ed11cfd1-da9e-4845-a346-3f21c54decdc',
        metaId: '3C6F3873EBAB4B8A92C6FAB618BE7778',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: 1,
        reportType: '0_1_2',
        reportName: 'Template report test4 12-2023',
        pdfUrl: 'temp-en-US-103226-20230404131835-202312-0_1_2-925fef03-b2e1-40f5-b0df-91304ced1e3a-00ugnpnk25bSS232z2p7.pdf',
        updatedTimestamp: '2023-04-04T07:49:34.443181Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    },
    {
        id: '9fe60cb0-fadc-11ed-be56-0242ac120002',
        metaId: '747D042F12FD4F18A783272DD9EAC555',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: -1,
        reportType: '0_1_2',
        reportName: 'Template report testing dummy 05-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-04-05T08:01:01.669Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    },
    {
        id: '9fe60b5c-fadc-11ed-be56-0242ac120002',
        metaId: '747D042F12FD4F18A783272DD9EAC554',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: -1,
        reportType: '0_1_2',
        reportName: 'Template report testing dummy 05-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-04-05T08:01:01.669Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    },
    {
        id: 'd9d2afe4-fb92-11ed-be56-0242ac120002',
        metaId: '3C6F3873EBAB4B8A92C6FAB618BE7899',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: 1,
        reportType: '0_1_2',
        reportName: 'Template report testing dummy 05-2023',
        pdfUrl: 'temp-en-US-103226-20230404131835-202312-0_1_2-925fef03-b2e1-40f5-b0df-91304ced1e3a-00ugnpnk25bSS232z2p7.pdf',
        updatedTimestamp: '2023-04-04T07:49:34.443Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: true
    },
    {
        id: 'd436547e-301e-4e90-be9b-fc0266ce278e',
        metaId: '5C91F764F70A40E1852B2325A5BB7FC8',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: 0,
        reportType: '0_1_2',
        reportName: 'Template report test4 12-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-04-03T09:50:39.502931Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    },
    {
        id: 'e9761c9c-7a11-4d83-9fc5-c6c427607ea6',
        metaId: 'E9F4F0E2BDEE40EAB8D250BFEAA4CE3E',
        accountNumber: '103226',
        yearMonth: '202312',
        reportStatus: 0,
        reportType: '0_1_2',
        reportName: 'Template report test4 12-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-05-25T09:09:41.460481Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    },
    {
        id: 'bae0f8d0-c7be-42f2-bf22-5b39393075cd',
        metaId: '9F5ABA44ACDF4C80A9D67F932C3C8A2B',
        accountNumber: '103226',
        yearMonth: '202304',
        reportStatus: 0,
        reportType: '0_1_2',
        reportName: 'Template report test8 04-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-06-07T07:30:16.017627Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    },
    {
        id: 'f6280d57-5d82-4078-bfa9-8b3607ed59e7',
        metaId: 'AAA7309A08394390BA8C1BA2CD09F90A',
        accountNumber: '103226',
        yearMonth: '202304',
        reportStatus: 0,
        reportType: '0_1_2',
        reportName: 'Template report test8 04-2023',
        pdfUrl: '',
        updatedTimestamp: '2023-06-07T07:49:41.396929Z',
        locationId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
        isDismiss: false,
        isRead: false
    }
];

  const mockNotificationApiService = {
    getNotificationReport: () => {
      return of(mockData);
    }
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);


  const dynamicReportingService = {
    getReportNotifications: () => of([])
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      declarations: [ReportNotificationsComponent],
      providers: [{ provide: Store, useValue: storeStub },
      { provide: NavigationService, useValue: of('') },
      { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
      { provide: DynamicReportingService, useValue: dynamicReportingService },
        DateTimeHelper,
        TranslateService,
        LocaleConverter,
      provideMockStore({})
      ]
    })
      .compileComponents()
      .then(() => {
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get name based on report type', () => {
    const name = component.getName(mockData[0]);
    expect(name).toBe(component.getTranslations('REPORTPANEL.ALL - FILTERMONTHS.DECEMBER') + ' 2023');
  });

  it('should push object to notifications array based on report status', () => {
    component.notificationList = mockData;
    component.sortNotifications();
    expect(component.generatingReports?.length).toBe(5);
    expect(component.failedReports?.length).toBe(5);
    expect(component.readyReports?.length).toBe(3);
  });

  it('should show the unread icon in ready tab for notitications which has isRead as false', () => {
    component.notificationList = mockData;
    component.sortNotifications();
    expect(component.readyReports?.length).toBe(3);
    const isReadElement = fixture.debugElement.nativeElement.querySelector('.spec-read');
    expect(isReadElement).toBeDefined();
  });

  it('should not show the unread icon in ready tab for notitications which has isRead as true', () => {
    component.notificationList = mockData;
    component.sortNotifications();
    expect(component.readyReports?.length).toBe(3);
    component.readyReports[1].isRead = true;
    const isReadElement = fixture.debugElement.nativeElement.querySelector('.spec-read');
    expect(isReadElement).toBeNull();
  });

  it('should update notification on click of a notification from unread to read', () => {
    component.notificationList = mockData;
    component.sortNotifications();
    expect(component.readyReports?.length).toBe(3);
    component.readyReports[0].isRead = false;
    fixture.whenStable().then(() => {
      const isReadElement = fixture.debugElement.nativeElement.querySelector('.spec-read');
      expect(isReadElement).toBeDefined();
      isReadElement.click();
      spyOn(component, 'updateNotification').and.callThrough();
      expect(component.updateNotification).toHaveBeenCalledWith(component.readyReports[0]);
      expect(isReadElement).toBeNull();
      expect(component.readyReports[0].isRead).toBe(false);
    });
  });

  it('should update notification on click of a notification from unread to read and navogate to reports page', () => {
    component.notificationList = mockData;
    component.sortNotifications();
    expect(component.readyReports?.length).toBe(3);
    component.readyReports[0].isRead = false;
    fixture.whenStable().then(() => {
      const isReadElement = fixture.debugElement.nativeElement.querySelector('.spec-read');
      expect(isReadElement).toBeDefined();
      isReadElement.click();
      spyOn(component, 'updateNotification').and.callThrough();
      expect(component.updateNotification).toHaveBeenCalledWith(component.readyReports[0]);
      expect(isReadElement).toBeNull();
      expect(component.readyReports[0].isRead).toBe(false);
      spyOn(component, 'openReport').and.callThrough();
      expect(component.openReport).toHaveBeenCalledWith(component.readyReports[0]);
      expect(router.navigate).toHaveBeenCalled();
    });
  });


  it('should dismiss all notification when clear all is clicked', () => {
    component.notificationList = mockData;
    component.sortNotifications();
    expect(component.generatingReports?.length).toBe(5);
    expect(component.failedReports?.length).toBe(5);
    expect(component.readyReports?.length).toBe(3);
    const clearAllElement = fixture.debugElement.nativeElement.querySelector('.spec-clearAll');
    fixture.whenStable().then(() => {
      expect(clearAllElement).toBeDefined();
      clearAllElement.click();
      spyOn(component, 'dismissAllNotifications').and.callThrough();
      expect(component.dismissAllNotifications).toHaveBeenCalledWith();
      expect(component.generatingReports?.length).toBe(0);
      expect(component.failedReports?.length).toBe(0);
      expect(component.readyReports?.length).toBe(0);
    });
  });

  it('should dismiss single notification when single delete icon is clicked', () => {
    component.notificationList = mockData;
    component.sortNotifications();
    expect(component.generatingReports?.length).toBe(5);
    expect(component.failedReports?.length).toBe(5);
    expect(component.readyReports?.length).toBe(3);
    const singleElement = fixture.debugElement.nativeElement.querySelector('.spec-single');
    fixture.whenStable().then(() => {
      expect(singleElement).toBeDefined();
      singleElement.click();
      spyOn(component, 'dismissSingleNotification').and.callThrough();
      expect(component.dismissSingleNotification).toHaveBeenCalledWith(component.readyReports[0].id, null);
      expect(component.readyReports?.length).toBe(2);
    });
  });

});
