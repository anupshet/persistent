// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { NgReduxModule, NgRedux } from '@angular-redux/store';
import { MatCardModule } from '@angular/material/card';
import { MockNgRedux } from '@angular-redux/store/lib/testing';
import { StoreModule } from '@ngrx/store';

import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../../app/shared/locale/locale-converter.service';
import { ExpiringLicenseComponent } from './expiring-license.component';
import { ExpiringLicensePanelComponent } from '../../components/expiring-license-panel/expiring-license-panel.component';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';

describe('ExpiringLicenseComponent', () => {
  let component: ExpiringLicenseComponent;
  let fixture: ComponentFixture<ExpiringLicenseComponent>;
  const State = [];
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };
  // const mockAccountState = {
  //   currentAccountSummary: <Account>{
  //     id: '',
  //     accountNumber: '',
  //     formattedAccountNumber: '',
  //     sapNumber: '',
  //     orderNumber: '',
  //     primaryUnityLabNumbers: '',
  //     labName: '',
  //     accountAddressId: '',
  //     accountAddress: <Address>{
  //       id: '',
  //       streetAddress1: '',
  //       streetAddress2: '',
  //       streetAddress3: '',
  //       city: '',
  //       state: '',
  //       zipCode: '',
  //       country: '',
  //       entityType: 1,
  //     },
  //     accountContactId: '',
  //     accountContact: <Contact>{
  //       firstName: '',
  //       lastName: '',
  //       name: '',
  //       email: '',
  //     },
  //     licenseNumberUsers: 10,
  //     accountLicenseType: 10,
  //     licensedProducts: [],
  //     licenseAssignDate: {},
  //     licenseExpirationDate: {},
  //     comments: '',
  //     nodeType: 0,
  //     parentNodeId: 'ROOT',
  //     displayName: '',
  //   }
  // };

  const mockRedux = MockNgRedux.getInstance();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, NgReduxModule, StoreModule.forRoot(State)],
      declarations: [ExpiringLicenseComponent,
        ExpiringLicensePanelComponent, UnityNextDatePipe],
      providers: [DateTimeHelper, LocaleConverter, {
        provide: NgRedux,
        useValue: mockRedux
      },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiringLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verify date is passed to child component', () => {
    expect(component.timeZone).toBe('America/Los_Angeles');
  });

  it('verify that hasDataToDisplay is properly set and emitted', () => {
    expect(component.showExpiringLicense).not.toBeUndefined();
  });

  // it('should call the loadLicenseExpirationData method and test for the expiration time ', () => {
  //    spyOn(mockRedux, 'select').and.returnValue(of(mockAccountState));
  //    spyOn(component.hasExpiryLicenceToDisplay,'emit').and.callThrough();
  //    component.loadLicenseExpirationData();
  //    const today = new Date('02/02/2020');
  //    const expiryDate = new Date('02/02/2020');
  //    component.licenseExpirationDate = expiryDate;
  //    component.numberOfDaysToExpire = 20;
  //    component.showExpiringLicense =  false;
  //    fixture.detectChanges();
  //    expect(mockRedux.select).toHaveBeenCalled();
  //    expect(component.hasExpiryLicenceToDisplay.emit).toHaveBeenCalledWith(component.showExpiringLicense);
  // });

});
