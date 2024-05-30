// © 2023 Bio-Rad Laboratories, Inc. AlformNamel Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { BrowserModule, By } from '@angular/platform-browser';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { of } from 'rxjs';
import { MaterialModule } from 'br-component-library';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { Transformer } from '../../../../contracts/models/account-management/transformers.model';
import { CommonConfigurationComponent } from './common-configuration.component';
import { HttpLoaderFactory } from '../../../../app.module';
import * as fromRoot from '../../../../state/app.state';

describe('CommonConfigurationComponent', () => {
  let component: CommonConfigurationComponent;
  let fixture: ComponentFixture<CommonConfigurationComponent>;

  const mockOrchestratorApiService = {
    getConnectivityTransformers: (accountId: string) => null
  };
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);
  const mockStore = {
    'accountName': 'Testing_FeatureEdge',
    'accountNumber': '203295',
    'formattedAccountNumber': '',
    'addOns': 0,
    'connectivityInstalledProduct': '',
    'connectivityTier': 2,
    'crossOverStudy': 0,
    'displayName': 'Testing_FeatureEdge',
    'groupName': 'Testing_FeatureEdge',
    'hasChildren': false,
    'id': '4ebf2f52-3936-4203-bf93-3f8befab64eb',
    'labLocationAddress': null,
    'labLocationAddressId': 'ad59b4bd-c15d-48a7-8626-fae0060e3805',
    'labLocationContact': null,
    'labLocationContactId': '',
    'labLocationName': 'Testing_FeatureEdge',
    'licenseAssignDate': '2022-06-27T00:00:00Z',
    'licenseExpirationDate': '2022-09-27T00:00:00Z',
    'licenseNumberUsers': 1,
    'locationCount': 0,
    'locationDayLightSaving': '01:00:00',
    'locationOffset': '-05:00:00',
    'locationTimeZone': 'America/New_York',
    'lotViewerInstalledProduct': '',
    'lotViewerLicense': 1,
    'nodeType': 2,
    'orderNumber': '',
    'migrationStatus': '',
    'parentNodeId': 'e67e8741-2e94-4073-b550-9698f961b155',
    'parentNode': {
      'displayName': '',
      'labName': '',
      'name': '',
      'parentNodeId': '',
      'nodeType': 0,
      'id': '',
      'isUnavailable': false,
      'unavailableReasonCode': ''
    },
    'previousContactUserId': '',
    'primaryUnityLabNumbers': '',
    'shipTo': '4325643',
    'soldTo': '523534',
    'unityNextInstalledProduct': '',
    'unityNextTier': 0,
    'comments': '',
    'contactRoles': null,
    'usedArchive': true,
    'islabsettingcompleted': true,
    'permissions': [
      4,
      5,
      6,
      7,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      57,
      61,
      63,
      66,
      86,
      87,
      88,
      89,
      90,
      91,
      92,
      93,
      94,
      96
    ],
    'children': null,
    'locationSettings': {
      'displayName': '',
      'dataType': 1,
      'instrumentsGroupedByDept': true,
      'trackReagentCalibrator': true,
      'fixedMean': false,
      'decimalPlaces': 3,
      'siUnits': false,
      'labSetupRating': 0,
      'labSetupComments': '',
      'isLabSetupComplete': true,
      'labSetupLastEntityId': '',
      'legacyPrimaryLab': '',
      'parentNodeId': 'ea750fa2-c89b-4ed5-805b-648ab9be5fce',
      'nodeType': 9,
      'id': '50f2902f-bcac-4eb6-8f76-b790e8947358',
      'locationId': '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      'isUnavailable': false,
      'unavailableReasonCode': ''
    }
  };
  const mockAssignedTransformerList: Array<Transformer> = [
    {
      'id': '3921',
      'displayName': 'Universal Flex File Transformer v4.0',
      'isAssigned': false
    },
    {
      'id': '3922',
      'displayName': 'Meditech Data Review By Activity Transformer v4.0',
      'isAssigned': true
    },
    {
      'id': '1234',
      'displayName': 'ray',
      'isAssigned': true
    },
    {
      'id': '735701',
      'displayName': 'Insomnia Test - Universal Flex File Transformer v4.2',
      'isAssigned': false
    },
    {
      'id': '3961',
      'displayName': 'Cerner Millennium Monthly LJ Chart Transformer v4.0',
      'isAssigned': true
    },
    {
      'id': '3948',
      'displayName': 'Labdaq Daily Control Report Transformer v4.0',
      'isAssigned': false
    },
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonConfigurationComponent],
      imports: [
        MaterialModule,
        MatDialogModule,
        HttpClientModule,
        PerfectScrollbarModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        StoreModule.forRoot(fromRoot.reducers),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => of({}) } },
        { provide: OrchestratorApiService, useValue: mockOrchestratorApiService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: Store, useValue: mockStore },
        provideMockStore({ initialState: mockStore }),
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display group dropdown', () => {
    component.assignedTransformerList = mockAssignedTransformerList.filter(el => el.isAssigned === true);
    component.ngOnInit();
    fixture.detectChanges();
    const configurationTypeDropdown = fixture.debugElement.query(By.css('.select-content')).nativeElement;
    expect(configurationTypeDropdown).toBeDefined();
  });

  it('should display Configurations', async(() => {
    const cancelButton = fixture.debugElement.query(By.css('.cancel-button')).nativeElement;
    expect(cancelButton).toBeDefined();
    const spy = spyOn(component.showListing, 'emit');
    cancelButton.click();
    fixture.detectChanges();

    component.showConfigurations();
    fixture.detectChanges();

    expect(component.showEdgeForm).toBe(false);
    expect(component.showTransformersForm).toBe(false);
    expect(spy).toHaveBeenCalledWith(true);

  }));

  it('should display Edge Form', async(() => {
    component.ngOnInit();
    fixture.detectChanges();

    const ConfigurationTypeDropdown = fixture.debugElement.query(By.css('.select-content')).nativeElement;
    expect(ConfigurationTypeDropdown).toBeDefined();
    ConfigurationTypeDropdown.click();
    fixture.detectChanges();

    const matOption = fixture.debugElement.queryAll(By.css('.select-content'));
    matOption[0].nativeElement.click();
    fixture.detectChanges();

    component.showEdgeForm = true;
    fixture.detectChanges();

    expect(component.showEdgeForm).toBe(true);
  }));

  it('should display Transformer Form', async(() => {
    component.ngOnInit();
    fixture.detectChanges();

    const ConfigurationTypeDropdown = fixture.debugElement.query(By.css('.select-content')).nativeElement;
    expect(ConfigurationTypeDropdown).toBeDefined();
    ConfigurationTypeDropdown.click();
    fixture.detectChanges();

    const matOption = fixture.debugElement.queryAll(By.css('.select-content'));
    matOption[0].nativeElement.click();
    fixture.detectChanges();

    component.showTransformersForm = true;
    fixture.detectChanges();
    expect(component.showTransformersForm).toBe(true);
  }));
});
