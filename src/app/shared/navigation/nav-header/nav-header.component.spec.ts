// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { last } from 'lodash';

import { EntityInfo } from '../../../contracts/models/data-management/entity-info.model';
import { PortalApiService } from '../../api/portalApi.service';
import { EntityTypeService } from '../../services/entity-type.service';
import { NavigationService } from '../navigation.service';
import { NavCurrentLocationComponent } from './nav-current-location/nav-current-location.component';
import { NavHeaderComponent } from './nav-header.component';
import { NavHierarchyComponent } from './nav-hierarchy/nav-hierarchy.component';
import { NavBarActions } from '../state/actions';
import { TreePill } from '../../../contracts/models/lab-setup';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { RouterNavigationType } from '../../../contracts/enums/router-navigation-type.enum';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { DynamicReportingService } from '../../services/reporting.service';
import { NotificationService } from '../../../core/notification/services/notification.service';
import { ConfirmNavigateGuard } from '../../../master/reporting/shared/guard/confirm-navigate.guard';
import { HttpLoaderFactory } from '../../../app.module';

describe('NavHeaderComponent', () => {
  let component: NavHeaderComponent;
  let fixture: ComponentFixture<NavHeaderComponent>;
  let store: MockStore<any>;
  let de: DebugElement;
  const autofixture = new Autofixture();
  const testData = autofixture.create(new EntityInfo());
  let navigationServiceInstance: NavigationService;
  let dispatchSpy;

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const ApiServiceStub = {
    get: (number): Observable<any> => {
      return of(testData);
    }
  };

  const mockNavigationService = {
    routeToMapping: () => { },
    navigateToUrl: () => { },
    routeToFileUpload: () => { },
  };

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const initialState = {
    navigation: {
      selectedNode: null,
      selectedLeaf: null,
      currentBranch: null,
      error: null,
      isSideNavExpanded: null,
      currentUser: null,
      showSettings: null
    },
    location: {
      currentLabLocation: null,
      currentLabLocationContact: null
    }
  };
  const appState = [];
  const currentBranchData: Array<TreePill> = [
    {
      displayName: 'Vishwajit\'s Lab',
      accountSettings: {
        displayName: '',
        dataType: 1,
        instrumentsGroupedByDept: true,
        trackReagentCalibrator: true,
        fixedMean: true,
        decimalPlaces: 0,
        siUnits: true,
        labSetupRating: 0,
        labSetupComments: '',
        isLabSetupComplete: false,
        labSetupLastEntityId: 'null',
        id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
        parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      id: '0d66767b-612c-4254-9eed-3a7ab393029f',
      parentNodeId: '5340ad39-3d2f-473e-a940-d27e8dbac1af',
      nodeType: 2,
      children: [
        {
          displayName: 'Vishwajit Dept',
          levelSettings: {
            levelEntityId: null,
            levelEntityName: null,
            parentLevelEntityId: null,
            parentLevelEntityName: null,
            minNumberOfPoints: 5,
            runLength: 4,
            dataType: 1,
            targets: null,
            rules: [
              {
                id: '2',
                category: '1k',
                k: '3',
                disposition: 'D'
              },
              {
                id: '1',
                category: '1k',
                k: '2',
                disposition: 'D'
              }
            ],
            levels: [
              {
                levelInUse: true,
                decimalPlace: 2
              }
            ],
            id: '631d3481-6b11-4311-9752-55f5a50f32a5',
            parentNodeId: 'e5593914-c140-418a-a6f7-716037d3df40',
            parentNode: null,
            nodeType: EntityType.LabTest,
            displayName: '631d3481-6b11-4311-9752-55f5a50f32a5',
            children: null
          },
          accountSettings: {
            displayName: '',
            dataType: 1,
            instrumentsGroupedByDept: true,
            trackReagentCalibrator: true,
            fixedMean: true,
            decimalPlaces: 0,
            siUnits: true,
            labSetupRating: 0,
            labSetupComments: '',
            isLabSetupComplete: false,
            labSetupLastEntityId: 'null',
            id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
            parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          id: 'e5593914-c140-418a-a6f7-716037d3df40',
          parentNodeId: '0d66767b-612c-4254-9eed-3a7ab393029f',
          nodeType: 3,
          children: []
        }
      ]
    },
    {
      displayName: 'Vishwajit Dept',
      levelSettings: {
        levelEntityId: null,
        levelEntityName: null,
        parentLevelEntityId: null,
        parentLevelEntityName: null,
        minNumberOfPoints: 5,
        runLength: 4,
        dataType: 1,
        targets: null,
        rules: [
          {
            id: '2',
            category: '1k',
            k: '3',
            disposition: 'D'
          },
          {
            id: '1',
            category: '1k',
            k: '2',
            disposition: 'D'
          }
        ],
        levels: [
          {
            levelInUse: true,
            decimalPlace: 2
          }
        ],
        id: '631d3481-6b11-4311-9752-55f5a50f32a5',
        parentNodeId: 'e5593914-c140-418a-a6f7-716037d3df40',
        parentNode: null,
        nodeType: EntityType.LabTest,
        displayName: '631d3481-6b11-4311-9752-55f5a50f32a5',
        children: null
      },
      accountSettings: {
        displayName: '',
        dataType: 1,
        instrumentsGroupedByDept: true,
        trackReagentCalibrator: true,
        fixedMean: true,
        decimalPlaces: 0,
        siUnits: true,
        labSetupRating: 0,
        labSetupComments: '',
        isLabSetupComplete: false,
        labSetupLastEntityId: 'null',
        id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
        parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      id: 'e5593914-c140-418a-a6f7-716037d3df40',
      parentNodeId: '0d66767b-612c-4254-9eed-3a7ab393029f',
      nodeType: 3,
      children: [
        {
          displayName: 'Instrument',
          levelSettings: {
            levelEntityId: null,
            levelEntityName: null,
            parentLevelEntityId: null,
            parentLevelEntityName: null,
            minNumberOfPoints: 5,
            runLength: 4,
            dataType: 1,
            targets: null,
            rules: [
              {
                id: '2',
                category: '1k',
                k: '3',
                disposition: 'D'
              },
              {
                id: '1',
                category: '1k',
                k: '2',
                disposition: 'D'
              }
            ],
            levels: [
              {
                levelInUse: true,
                decimalPlace: 2
              }
            ],
            id: '40be6f2c-0706-449f-aa4f-732d4b70f22b',
            parentNodeId: '84d5e269-2ba2-434e-99c0-6604f066f252',
            parentNode: null,
            nodeType: EntityType.LabTest,
            displayName: '40be6f2c-0706-449f-aa4f-732d4b70f22b',
            children: null
          },
          accountSettings: {
            displayName: '',
            dataType: 1,
            instrumentsGroupedByDept: true,
            trackReagentCalibrator: true,
            fixedMean: true,
            decimalPlaces: 0,
            siUnits: true,
            labSetupRating: 0,
            labSetupComments: '',
            isLabSetupComplete: false,
            labSetupLastEntityId: 'null',
            id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
            parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          id: '84d5e269-2ba2-434e-99c0-6604f066f252',
          parentNodeId: 'e5593914-c140-418a-a6f7-716037d3df40',
          nodeType: 4,
          children: []
        }
      ]
    },
    {
      displayName: 'Instrument',
      levelSettings: {
        levelEntityId: null,
        levelEntityName: null,
        parentLevelEntityId: null,
        parentLevelEntityName: null,
        minNumberOfPoints: 5,
        runLength: 4,
        dataType: 1,
        targets: null,
        rules: [
          {
            id: '2',
            category: '1k',
            k: '3',
            disposition: 'D'
          },
          {
            id: '1',
            category: '1k',
            k: '2',
            disposition: 'D'
          }
        ],
        levels: [
          {
            levelInUse: true,
            decimalPlace: 2
          }
        ],
        id: '40be6f2c-0706-449f-aa4f-732d4b70f22b',
        parentNodeId: '84d5e269-2ba2-434e-99c0-6604f066f252',
        parentNode: null,
        nodeType: EntityType.LabTest,
        displayName: '40be6f2c-0706-449f-aa4f-732d4b70f22b',
        children: null
      },
      accountSettings: {
        displayName: '',
        dataType: 1,
        instrumentsGroupedByDept: true,
        trackReagentCalibrator: true,
        fixedMean: true,
        decimalPlaces: 0,
        siUnits: true,
        labSetupRating: 0,
        labSetupComments: '',
        isLabSetupComplete: false,
        labSetupLastEntityId: 'null',
        id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
        parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      id: '84d5e269-2ba2-434e-99c0-6604f066f252',
      parentNodeId: 'e5593914-c140-418a-a6f7-716037d3df40',
      nodeType: 4,
      children: [
        {
          displayName: 'Assayed Chemistry',
          levelSettings: {
            levelEntityId: null,
            levelEntityName: null,
            parentLevelEntityId: null,
            parentLevelEntityName: null,
            minNumberOfPoints: 5,
            runLength: 4,
            dataType: 1,
            targets: [
              {
                controlLotId: '105',
                controlLevel: '1',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '106',
                controlLevel: '2',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '107',
                controlLevel: '3',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '108',
                controlLevel: '4',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '109',
                controlLevel: '5',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '110',
                controlLevel: '6',
                mean: 0,
                sd: 0,
                points: 0
              }
            ],
            rules: [
              {
                id: '2',
                category: '1k',
                k: '3',
                disposition: 'D'
              },
              {
                id: '1',
                category: '1k',
                k: '2',
                disposition: 'D'
              }
            ],
            levels: [
              {
                levelInUse: true,
                decimalPlace: 2
              },
              {
                levelInUse: true,
                decimalPlace: 2
              },
              {
                levelInUse: true,
                decimalPlace: 2
              },
              {
                levelInUse: true,
                decimalPlace: 2
              },
              {
                levelInUse: false,
                decimalPlace: 2
              },
              {
                levelInUse: false,
                decimalPlace: 2
              }
            ],
            id: '986721b1-a55f-4bc6-87a7-2074cb368bcc',
            parentNodeId: '36189279-e4a8-493a-b3a6-ef5c7e879272',
            parentNode: null,
            nodeType: EntityType.LabTest,
            displayName: '986721b1-a55f-4bc6-87a7-2074cb368bcc',
            children: null
          },
          accountSettings: {
            displayName: '',
            dataType: 1,
            instrumentsGroupedByDept: true,
            trackReagentCalibrator: true,
            fixedMean: true,
            decimalPlaces: 0,
            siUnits: true,
            labSetupRating: 0,
            labSetupComments: '',
            isLabSetupComplete: false,
            labSetupLastEntityId: 'null',
            id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
            parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          id: '36189279-e4a8-493a-b3a6-ef5c7e879272',
          parentNodeId: '84d5e269-2ba2-434e-99c0-6604f066f252',
          nodeType: 5,
          children: []
        }
      ]
    },
    {
      displayName: 'Assayed Chemistry',
      levelSettings: {
        levelEntityId: null,
        levelEntityName: null,
        parentLevelEntityId: null,
        parentLevelEntityName: null,
        minNumberOfPoints: 5,
        runLength: 4,
        dataType: 1,
        targets: [
          {
            controlLotId: '105',
            controlLevel: '1',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '106',
            controlLevel: '2',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '107',
            controlLevel: '3',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '108',
            controlLevel: '4',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '109',
            controlLevel: '5',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '110',
            controlLevel: '6',
            mean: 0,
            sd: 0,
            points: 0
          }
        ],
        rules: [
          {
            id: '2',
            category: '1k',
            k: '3',
            disposition: 'D'
          },
          {
            id: '1',
            category: '1k',
            k: '2',
            disposition: 'D'
          }
        ],
        levels: [
          {
            levelInUse: true,
            decimalPlace: 2
          },
          {
            levelInUse: true,
            decimalPlace: 2
          },
          {
            levelInUse: true,
            decimalPlace: 2
          },
          {
            levelInUse: true,
            decimalPlace: 2
          },
          {
            levelInUse: false,
            decimalPlace: 2
          },
          {
            levelInUse: false,
            decimalPlace: 2
          }
        ],
        id: '986721b1-a55f-4bc6-87a7-2074cb368bcc',
        parentNodeId: '36189279-e4a8-493a-b3a6-ef5c7e879272',
        parentNode: null,
        nodeType: EntityType.LabTest,
        displayName: '986721b1-a55f-4bc6-87a7-2074cb368bcc',
        children: null
      },
      accountSettings: {
        displayName: '',
        dataType: 1,
        instrumentsGroupedByDept: true,
        trackReagentCalibrator: true,
        fixedMean: true,
        decimalPlaces: 0,
        siUnits: true,
        labSetupRating: 0,
        labSetupComments: '',
        isLabSetupComplete: false,
        labSetupLastEntityId: 'null',
        id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
        parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      id: '36189279-e4a8-493a-b3a6-ef5c7e879272',
      parentNodeId: '84d5e269-2ba2-434e-99c0-6604f066f252',
      nodeType: 5,
      children: [
        {
          displayName: 'Albumin',
          levelSettings: {
            levelEntityId: null,
            levelEntityName: null,
            parentLevelEntityId: null,
            parentLevelEntityName: null,
            minNumberOfPoints: 5,
            runLength: 4,
            dataType: 1,
            targets: [
              {
                controlLotId: '105',
                controlLevel: '1',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '106',
                controlLevel: '2',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '107',
                controlLevel: '3',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '108',
                controlLevel: '4',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '109',
                controlLevel: '5',
                mean: 0,
                sd: 0,
                points: 0
              },
              {
                controlLotId: '110',
                controlLevel: '6',
                mean: 0,
                sd: 0,
                points: 0
              }
            ],
            rules: [
              {
                id: '2',
                category: '1k',
                k: '3',
                disposition: 'D'
              },
              {
                id: '1',
                category: '1k',
                k: '2',
                disposition: 'D'
              }
            ],
            levels: [
              {
                levelInUse: false,
                decimalPlace: 2
              },
              {
                levelInUse: true,
                decimalPlace: 2
              },
              {
                levelInUse: true,
                decimalPlace: 2
              },
              {
                levelInUse: false,
                decimalPlace: 2
              },
              {
                levelInUse: false,
                decimalPlace: 2
              },
              {
                levelInUse: false,
                decimalPlace: 2
              }
            ],
            id: '750e9d2c-7fef-468c-9e66-6e11c2edefea',
            parentNodeId: '5e180f9d-7261-477a-bd5a-57bb12a1424d',
            parentNode: null,
            nodeType: EntityType.LabTest,
            displayName: '750e9d2c-7fef-468c-9e66-6e11c2edefea',
            children: null
          },
          accountSettings: {
            displayName: '',
            dataType: 1,
            instrumentsGroupedByDept: true,
            trackReagentCalibrator: true,
            fixedMean: true,
            decimalPlaces: 0,
            siUnits: true,
            labSetupRating: 0,
            labSetupComments: '',
            isLabSetupComplete: false,
            labSetupLastEntityId: 'null',
            id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
            parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          id: '5e180f9d-7261-477a-bd5a-57bb12a1424d',
          parentNodeId: '36189279-e4a8-493a-b3a6-ef5c7e879272',
          nodeType: 6,
          children: []
        }
      ]
    }
  ];
  const selectedNodeData: any = currentBranchData[0];
  const selectedLeafData = currentBranchData[3];
  const navigationState = {
    selectedNode: selectedNodeData,
    selectedLeaf: selectedLeafData,
    currentBranch: currentBranchData,
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: true,
    showSettings: false,
    selectedLeftNavItem: currentBranchData[3],
    instrumentsGroupedByDept: true,
    currentLabLocation: null,
    currentLabLocationContact: null
  };
  const locationState = {
    currentLabLocation: {
      accountName: 'Duplicate Lots Phase 2 Lab',
      accountNumber: '102617',
      formattedAccountNumber: '',
      addOns: 0,
      connectivityInstalledProduct: '',
      connectivityTier: 2,
      crossOverStudy: 0,
      displayName: 'Duplicate Lots Phase 2 Lab',
      groupName: 'Duplicate Lots Phase 2 Lab',
      hasChildren: false,
      id: '6603d729-7aa5-4710-a7bb-8548b9ec852a',
      labLocationAddress: null,
      labLocationAddressId: '3f6f4b55-306a-4c1e-b925-643da4b400aa',
      labLocationContact: null,
      labLocationContactId: '',
      labLocationName: 'Duplicate Lots Phase 2 Lab',
      licenseAssignDate: '2021-03-15T00:00:00Z',
      licenseExpirationDate: '2023-03-15T00:00:00Z',
      licenseNumberUsers: 5,
      locationCount: 0,
      locationDayLightSaving: '00:00:00',
      locationOffset: '05:30:00',
      locationTimeZone: 'Asia/Kolkata',
      lotViewerInstalledProduct: '',
      lotViewerLicense: 1,
      nodeType: 2,
      orderNumber: '',
      migrationStatus: '',
      parentNodeId: 'aa1e40c7-d1a8-4bc6-8f99-dc9d9e2d343c',
      parentNode: {
        displayName: '',
        labName: '',
        parentNodeId: '',
        nodeType: 0,
        id: '',
        isUnavailable: false,
        unavailableReasonCode: ''
      },
      primaryUnityLabNumbers: '',
      shipTo: '0009876',
      soldTo: '0009876',
      unityNextInstalledProduct: '',
      unityNextTier: 0,
      comments: '',
      children: null,
      locationSettings: {
        displayName: '',
        dataType: 1,
        instrumentsGroupedByDept: true,
        trackReagentCalibrator: false,
        fixedMean: false,
        decimalPlaces: 2,
        siUnits: false,
        labSetupRating: 5,
        labSetupComments: '',
        isLabSetupComplete: true,
        labSetupLastEntityId: '',
        legacyPrimaryLab: '',
        parentNodeId: '465d833c-9e72-45e3-b8ff-02726d2349d7',
        nodeType: 9,
        id: 'bc5bbda6-940e-4625-9962-3e3dfbb1e916',
        isUnavailable: false,
        unavailableReasonCode: ''
      }
    },
    currentLabLocationContact: null
  };
  const storeStub = {
    location: locationState,
    navigation: navigationState
  };

  const mockConfirmNavigateGuard = {
    canDeactivate:     () => { },
    openGenericDialog: () => { },
    confirmationModal: () => { },
  };

  const dynamicReportingService = {
    getReportNotifications: () => of([])
  };

  class MockNotificationService {
    public get $labStream() {
      return of(2);
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgReduxTestingModule,
        MatIconModule,
        HttpClientModule,
        MatTooltipModule,
        StoreModule.forRoot(appState),
        MatMenuModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [NavHeaderComponent, NavHierarchyComponent, NavCurrentLocationComponent, TruncatePipe ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        EntityTypeService,
        { provide: PortalApiService, useValue: ApiServiceStub },
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState }),
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: DynamicReportingService, useValue: dynamicReportingService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: ConfirmNavigateGuard, useValue: mockConfirmNavigateGuard },
        TranslateService,
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(storeStub);
    fixture = TestBed.createComponent(NavHeaderComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    component.isLabSetupCompleted = true;
    navigationServiceInstance = fixture.debugElement.injector.get(NavigationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should display location name as the selected node and no back arrow also breadcrumb should be empty
    when only location is selected`, () => {
    const navHierarchyElement = de.query(By.directive(NavHierarchyComponent));
    const navHierarchyComponent = navHierarchyElement.componentInstance;
    navHierarchyComponent.breadcrumbList = [currentBranchData[0]];
    const navCurrentLocationElement = de.query(By.directive(NavCurrentLocationComponent));
    const navCurrentLocationComponent = navCurrentLocationElement.componentInstance;
    navCurrentLocationComponent.displayTitle = currentBranchData[0].displayName;
    navCurrentLocationComponent.hasParent = false;
    fixture.detectChanges();
    const breadcrumbElement = fixture.debugElement.nativeElement.querySelector('.spec_breadcrumb_item');
    const displayTitle = fixture.debugElement.nativeElement.querySelector('.displayTitle');
    const backArrow = fixture.debugElement.nativeElement.querySelector('.backArrow');
    expect(breadcrumbElement).toBe(null);
    expect(backArrow).toBe(null);
    expect(displayTitle.innerText).toBe(currentBranchData[0].displayName);
  });

  it(`should display the location in the breadcrumb and department as selected node with the back arrow.`, () => {
    const navHierarchyElement = de.query(By.directive(NavHierarchyComponent));
    const navHierarchyComponent = navHierarchyElement.componentInstance;
    navHierarchyComponent.breadcrumbList = currentBranchData.slice(0, 2);
    const navCurrentLocationElement = de.query(By.directive(NavCurrentLocationComponent));
    const navCurrentLocationComponent = navCurrentLocationElement.componentInstance;
    navCurrentLocationComponent.displayTitle = currentBranchData[1].displayName;
    navHierarchyComponent.nodeType = EntityType.LabDepartment;
    fixture.detectChanges();
    const breadcrumbElement = de.nativeElement.querySelector('.spec_breadcrumb');
    const displayTitle = de.nativeElement.querySelector('.displayTitle');
    const backArrow = de.nativeElement.querySelector('.backArrow');
    fixture.whenStable().then(() => {
      expect(breadcrumbElement.childElementCount).toBe(2);
      expect(displayTitle.innerText).toBe(currentBranchData[1].displayName);
    });
  });

  it(`should display the location, department, instrument in the breadcrumb and control name as the selected node with back arrow`, () => {
    const navHierarchyElement = de.query(By.directive(NavHierarchyComponent));
    const navHierarchyComponent = navHierarchyElement.componentInstance;
    navHierarchyComponent.breadcrumbList = currentBranchData.slice(0, 4);
    const navCurrentLocationElement = de.query(By.directive(NavCurrentLocationComponent));
    const navCurrentLocationComponent = navCurrentLocationElement.componentInstance;
    navCurrentLocationComponent.displayTitle = currentBranchData[3].displayName;
    navHierarchyComponent.nodeType = EntityType.LabProduct;
    fixture.detectChanges();
    const breadcrumbElement = de.nativeElement.querySelector('.spec_breadcrumb');
    const displayTitle = de.nativeElement.querySelector('.displayTitle');
    const backArrow = de.nativeElement.querySelector('.backArrow');
    fixture.whenStable().then(() => {
      expect(breadcrumbElement.childElementCount).toBe(4);
      expect(displayTitle.innerText).toBe(currentBranchData[3].displayName);
      expect(breadcrumbElement.childNodes[2].childNodes[0].innerText).toBe(currentBranchData[2].displayName);
    });
  });

  it('should call navigate to parent on back arrow button click.', () => {
    spyOn(component, 'onNavigateToParent').and.callThrough();

    const counter1 = fixture.debugElement.query(By.directive(NavCurrentLocationComponent));
    const cmp1 = counter1.componentInstance;
    const counter2 = fixture.debugElement.query(By.directive(NavHierarchyComponent));
    const cmp2 = counter2.componentInstance;
    spyOn(cmp2, 'navigateToNodeContents').and.callThrough();
    cmp1.navigateToParent.emit(currentBranchData);

    expect(component.onNavigateToParent).toHaveBeenCalledWith(currentBranchData);
    const index = (component.selectedLeaf) ?
      currentBranchData.length - RouterNavigationType.Initial : currentBranchData.length - RouterNavigationType.RoutedFromInitial;
    expect(cmp2.navigateToNodeContents)
      .toHaveBeenCalledWith(currentBranchData[index]);
  });

  it('should call navigate to node contents with no selected node, selected leaf and atleast one analyte', () => {
    component.selectedNode = null;
    component.selectedLeaf = null;

    const counter1 = fixture.debugElement.query(By.directive(NavCurrentLocationComponent));
    const cmp1 = counter1.componentInstance;
    const counter2 = fixture.debugElement.query(By.directive(NavHierarchyComponent));
    const cmp2 = counter2.componentInstance;
    spyOn(cmp2, 'navigateToNodeContents').and.callThrough();
    cmp1.navigateToParent.emit(currentBranchData);
    const index = (component.selectedLeaf) ?
      currentBranchData.length - RouterNavigationType.Initial : currentBranchData.length - RouterNavigationType.RoutedFromInitial;
    expect(cmp2.navigateToNodeContents).toHaveBeenCalledWith(currentBranchData[index]);
  });

  it('should call navigate to node contents with no selected node, selected leaf and analyte', () => {
    last(currentBranchData).children = null;
    component.selectedNode = null;
    component.selectedLeaf = null;

    const counter1 = fixture.debugElement.query(By.directive(NavCurrentLocationComponent));
    const cmp1 = counter1.componentInstance;
    const counter2 = fixture.debugElement.query(By.directive(NavHierarchyComponent));
    const cmp2 = counter2.componentInstance;
    spyOn(cmp2, 'navigateToNodeContents').and.callThrough();
    cmp1.navigateToParent.emit(currentBranchData);
    const index = (component.selectedLeaf) ?
      currentBranchData.length - RouterNavigationType.Initial : currentBranchData.length - RouterNavigationType.RoutedFromInitial;

    expect(cmp2.navigateToNodeContents).toHaveBeenCalledWith(currentBranchData[index]);
  });

  it('should dispatch remove items from current branch when no selected leaf.', () => {
    dispatchSpy = spyOn(store, 'dispatch');

    component.selectedLeaf = null;

    const counter1 = fixture.debugElement.query(By.directive(NavCurrentLocationComponent));
    const cmp1 = counter1.componentInstance;
    cmp1.navigateToParent.emit(currentBranchData);
    const index = (component.selectedLeaf) ?
      currentBranchData.length - RouterNavigationType.Initial : currentBranchData.length - RouterNavigationType.RoutedFromInitial;

    fixture.whenStable().then(() => {
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        NavBarActions.removeLastItemFromCurrentBranch()
      );
    });
  });

  it('should call navigate to settings on header title click when instruments grouped by dept.', () => {
    spyOn(component, 'onNavigateToSettings').and.callThrough();
    const spy = spyOn(navigationServiceInstance, 'navigateToUrl');
    dispatchSpy = spyOn(store, 'dispatch');

    locationState.currentLabLocation.locationSettings.instrumentsGroupedByDept = false;
    component.ngOnInit();
    fixture.detectChanges();
    const counter = fixture.debugElement.query(By.directive(NavCurrentLocationComponent));
    const cmp = counter.componentInstance;
    cmp.navigateToSettings.emit();

    fixture.whenStable().then(() => {
      expect(dispatchSpy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

  });

  it('should call navigate to settings on header title click when instruments not grouped by dept.', () => {
    spyOn(component, 'onNavigateToSettings').and.callThrough();
    const spy = spyOn(navigationServiceInstance, 'navigateToUrl');
    dispatchSpy = spyOn(store, 'dispatch');

    locationState.currentLabLocation.locationSettings.instrumentsGroupedByDept = false;
    component.ngOnInit();
    fixture.detectChanges();

    const counter = fixture.debugElement.query(By.directive(NavCurrentLocationComponent));
    const cmp = counter.componentInstance;
    cmp.navigateToSettings.emit();

    fixture.whenStable().then(() => {
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        NavBarActions.setSelectedLeaf({ selectedLeaf: null })
      );
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should call routeToConnectivityMapping service on button click', async(() => {
    const spy = spyOn(navigationServiceInstance, 'routeToFileUpload');

    component.ngOnInit();
    component.hasConnectivityLicense = true;
    component.migrationPending = false;
    fixture.detectChanges();
    const button = de.query(By.css('#spc_route_to_connectivity_button'));
    button.triggerEventHandler('click', null);
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  }));

});
