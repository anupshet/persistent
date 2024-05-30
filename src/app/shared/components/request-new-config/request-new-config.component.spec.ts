// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';
import { ConfigService } from '../../../core/config/config.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { ApiService } from '../../api/api.service';
import { RequestNewConfigEmailService } from '../request-new-config-email.service';
import { UploadConfigFileService } from '../upload-config-file/upload-config-file.service';
import { RequestNewConfigComponent } from './request-new-config.component';
import { UploadConfigFileComponent } from '../upload-config-file/upload-config-file.component';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { RequestNewConfigHelperService } from '../request-new-config-helper.service';
import { RequestNewConfigMessageComponent } from '../request-new-config-message/request-new-config-message.component';
import { LabLocation } from '../../../contracts/models/lab-setup';
import { AppLoggerService } from '../../services/applogger/applogger.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { PresignedUrls } from './new-configuration.model';
import { HttpLoaderFactory } from '../../../app.module';

class MockMatSnackBar extends MatSnackBar {
}

describe('RequestNewConfigComponent', () => {
  let component: RequestNewConfigComponent;
  let fixture: ComponentFixture<RequestNewConfigComponent>;
  let store;
  const initialState = {};

  const mockMatSnackBar = new MockMatSnackBar(null, null, null, null, null, null);
  const authStub = {
    isLoggedIn: true,
    currentUser: {
      userOktaId: '',
      userName: '',
      firstName: 'user',
      lastName: 'test',
      displayName: '',
      email: 'user@bio-rad.com',
      roles: ['User'],
      permissions: [],
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
  const labLocation = {
    currentLabLocation: {
    displayName: 'New Mexico',
    id: '72285DC498024F1DADCF8E9BC12DCDD3',
    labLocationAddress: '',
    labLocationAddressId: '0839deff-5a11-4ece-b781-e3868f2fcdb6',
    labLocationContact: '',
    labLocationContactId: 'c3a68a6c-d4db-4062-a1c3-bc143c472532',
    labLocationName: 'New Mexico',
    locationDayLightSaving: false,
    locationOffset: 0,
    locationTimeZone: 'Asia/Calcutta',
    nodeType: 2,
    parentNode: null,
    parentNodeId: 'DC78CE0672504E5F84B22AF9118ED6F4',
    children: []
  }
};
  const storeStub = {
    security: null,
    auth: authStub,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: labLocation,
    dataManagement: null
  };

  const files = [{
    name: 'test.PNG',
    size: 10000
  }];

  const urls: PresignedUrls[] = [{
    fileName: 'test.PNG',
    url: 'https://unity-dev-api.qcnet.com',
    entityId: '4c6f6065-f34f-4d89-b51a-c4418df257fb-test.PNG',
  }];

  const templateInfo = {
    templateId: 'request-new-test-configuration',
    name: 'test'
  };

  let uploadConfigFileServiceInstance: UploadConfigFileService;
  const mockUploadConfigFileService = {
    isValid: of(true),
    showErrorMessage: of(true),
    numberOfFiles: 0,
    files: files,
    fileNames: [{fileName: 'test.PNG'}]
  };

  let requestNewConfigHelperInstance: RequestNewConfigHelperService;
  const mockRequestNewConfigHelperService = {
    getRequester: () => { },
    setRequesterData: () => { }
  };

  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };

  const dialogStub = {
    open: () => dialogRefStub,
    closeAll: () => of({})
  };

  const appLoggerStub = {
    log: () => { }
  };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  let requestEmailSerInstance: RequestNewConfigEmailService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RequestNewConfigComponent,
        UploadConfigFileComponent,
        TruncatePipe,
        RequestNewConfigMessageComponent
      ],
      imports: [
        MaterialModule,
        MatDialogModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatSnackBarModule,
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
      providers: [
        { provide: MatDialogRef, useValue: { close: () => of({}) } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { data: templateInfo }
        },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: RequestNewConfigHelperService, useValue: mockRequestNewConfigHelperService },
        { provide: ConfigService, useValue: { getConfig: () => of({}) } },
        { provide: UploadConfigFileService, useValue: mockUploadConfigFileService },
        { provide: MessageSnackBarService, useValue: { openFromComponent: () => of({}) } },
        {
          provide: RequestNewConfigEmailService, useValue: {
            setRequesterData: () => of({}),
            getRequester: () => of({}),
            requestUrls: () => of(urls),
            sendFile: () => of(files[0]), requestFileUpload: () => of({})
          }
        },
        ApiService,
        { provide: Store, useValue: storeStub },
        { provide: MatDialog, useValue: dialogStub },
        { provide: AppLoggerService, useValue: appLoggerStub },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        provideMockStore({ initialState }),
        TranslateService,
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [RequestNewConfigMessageComponent] } })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    store.setState(storeStub);
    fixture = TestBed.createComponent(RequestNewConfigComponent);
    component = fixture.componentInstance;
    uploadConfigFileServiceInstance = fixture.debugElement.injector.get(UploadConfigFileService);
    requestNewConfigHelperInstance = fixture.debugElement.injector.get(RequestNewConfigHelperService);
    requestEmailSerInstance = fixture.debugElement.injector.get(RequestNewConfigEmailService);
    fixture.detectChanges();
  });

  it('should create RequestNewConfigComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Ensure upload file component is displayed', () => {
    expect(fixture.debugElement.nativeElement.querySelector('unext-upload-config-file')).not.toBe(null);
  });

  it('Ensure on close icon click dialog gets closed', () => {
    const closePopupLink = fixture.debugElement.nativeElement.querySelector('.spec_closeDialog');
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      closePopupLink.click();
      fixture.detectChanges();
      expect(!component.dialog.openDialogs || component.dialog.openDialogs.length === 0).toBeTruthy();
    });
  });

  it('Should upload test config on click of Send Information', () => {
    const sendInfoHTML = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_sendInformation');
    const event = new Event('click');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      sendInfoHTML.dispatchEvent(event);
      spyOn(component, 'showMessageSnackBar').and.callThrough();
      spyOn(component, 'setRequesterAndSendEmail').and.callThrough();
      spyOn(component, 'uploadFiles').and.callThrough();
      component.showMessageSnackBar();
      component.setRequesterAndSendEmail(new LabLocation());
      component.uploadFiles(urls);
      expect(component.showMessageSnackBar).toHaveBeenCalled();
      expect(component.setRequesterAndSendEmail).toHaveBeenCalled();
      expect(component.uploadFiles).toHaveBeenCalled();
    });
  });

  it('Should show error message if form not valid on click of Send Information', () => {
    component.isValid = false;
    const sendInfoHTML = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_sendInformation');
    const event = new Event('click');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      sendInfoHTML.dispatchEvent(event);
      uploadConfigFileServiceInstance.showErrorMessage.subscribe((a) => {
        if (a) {
          expect(a).toBeTruthy();
        }
      });
    });
  });

  it('Should check if error catched if while subscribing setRequesterAndSendEmail occurs any error', () => {
    delete requestNewConfigHelperInstance.setRequesterData;
    const sendInfoHTML = <HTMLElement>fixture.debugElement.nativeElement.querySelector('#spec_sendInformation');
    const event = new Event('click');
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      sendInfoHTML.dispatchEvent(event);
      spyOn(component, 'setRequesterAndSendEmail');
      component.setRequesterAndSendEmail(new LabLocation());
      expect(component.setRequesterAndSendEmail).toHaveBeenCalled();
    });
  });
});
