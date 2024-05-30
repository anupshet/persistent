// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrInfoTooltip, MaterialModule, BrCore, ReagentCategory } from 'br-component-library';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { LabProduct, LabTest } from '../../../../contracts/models/lab-setup';
import { AnalyteEvaluationMeanSd } from '../../../../contracts/models/lab-setup/analyte-evaluation-mean-sd.model';
import { LevelFloatingStatistics } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
import { NavSideBarService } from '../../../../shared/navigation/services/nav-side-bar.service';
import { LevelEvaluationMeanSdComponent } from '../level-evaluation-mean-sd/level-evaluation-mean-sd.component';
import { EvaluationMeanSdComponent } from './evaluation-mean-sd.component';
import { UnityRestrictDecimalPlacesDirective } from '../../../../shared/directives/unity-restrict-decimal-places.directive';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('EvaluationMeanSdComponent', () => {
  let component: EvaluationMeanSdComponent;
  let fixture: ComponentFixture<EvaluationMeanSdComponent>;

  const mockAppNavigationTrackingService = {
    comparePriorAndCurrentValues: () => {},
    logAuditTracking: () => { }
  };
  const analyteList: Array<LabTest> = [
    {
      displayName: 'Folate',
      testSpecId: '5238',
      correlatedTestSpecId: '962F51AC893942CCB91DF80F727D7298',
      testId: '5220',
      labUnitId: '52',
      testSpecInfo: {
        id: 5238,
        testId: 5220,
        analyteStorageUnitId: 75,
        analyteId: 70,
        analyteName: 'Folate',
        methodId: 63,
        methodName: 'Chemiluminescence',
        instrumentId: 3116,
        instrumentName: 'Alinity i',
        reagentId: 2239,
        reagentManufacturerId: null,
        reagentManufacturerName: 'Abbott',
        reagentName: 'Folate REF 08P14',
        reagentLotId: 1550,
        reagentLotNumber: 'Unspecified ***',
        reagentLot: {
          id: 1550,
          reagentId: 2239,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date(),
          reagentCategory: 1
        },
        storageUnitId: 2,
        storageUnitName: 'ng/mL',
        calibratorId: 809,
        calibratorManufacturerId: null,
        calibratorManufacturerName: 'Abbott',
        calibratorName: 'Folate Cal REF 08P1401',
        calibratorLotId: 811,
        calibratorLotNumber: 'Unspecified ***',
        calibratorLot: {
          id: 811,
          calibratorId: 809,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date()
        }
      },
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
            controlLotId: '117',
            controlLevel: '1',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '118',
            controlLevel: '2',
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
          }
        ],
        id: '3554b3b3-de65-472b-873b-16f6a44ddabe',
        parentNodeId: '65a159e9-26db-4c95-82be-dac080688421',
        parentNode: null,
        nodeType: 8,
        displayName: '3554b3b3-de65-472b-873b-16f6a44ddabe',
        children: null
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
        id: 'dc889c46-f310-4662-8c80-147fac28ecad',
        parentNodeId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      mappedTestSpecs: null,
      id: '65a159e9-26db-4c95-82be-dac080688421',
      parentNodeId: '1628ad45-c0b4-4708-8ad0-e448628820fe',
      parentNode: null,
      nodeType: 6,
      children: []
    },
    {
      displayName: 'Cortisol',
      testSpecId: '5203',
      correlatedTestSpecId: '136F034126974CC8A16EA9F474E72F67',
      testId: '5185',
      labUnitId: '52',
      testSpecInfo: {
        id: 5203,
        testId: 5185,
        analyteStorageUnitId: 48,
        analyteId: 41,
        analyteName: 'Cortisol',
        methodId: 63,
        methodName: 'Chemiluminescence',
        instrumentId: 3116,
        instrumentName: 'Alinity i',
        reagentId: 2235,
        reagentManufacturerId: null,
        reagentManufacturerName: 'Abbott',
        reagentName: 'Cortisol REF 08P33',
        reagentLotId: 1546,
        reagentLotNumber: 'Unspecified ***',
        reagentLot: {
          id: 1546,
          reagentId: 2235,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date(),
          reagentCategory: 1
        },
        storageUnitId: 13,
        storageUnitName: 'µg/dL',
        calibratorId: 805,
        calibratorManufacturerId: null,
        calibratorManufacturerName: 'Abbott',
        calibratorName: 'Cortisol Cal REF 08P3301',
        calibratorLotId: 807,
        calibratorLotNumber: 'Unspecified ***',
        calibratorLot: {
          id: 807,
          calibratorId: 805,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date()
        }
      },
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
            controlLotId: '117',
            controlLevel: '1',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '118',
            controlLevel: '2',
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
          }
        ],
        id: '54701a68-39a1-4ba6-bf6e-381c0c506a9f',
        parentNodeId: '8385565c-0f28-47a2-9853-49d787327c46',
        parentNode: null,
        nodeType: 8,
        displayName: '54701a68-39a1-4ba6-bf6e-381c0c506a9f',
        children: null
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
        id: 'dc889c46-f310-4662-8c80-147fac28ecad',
        parentNodeId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      mappedTestSpecs: null,
      id: '8385565c-0f28-47a2-9853-49d787327c46',
      parentNodeId: '1628ad45-c0b4-4708-8ad0-e448628820fe',
      parentNode: null,
      nodeType: 6,
      children: []
    },
    {
      displayName: 'FSH',
      testSpecId: '5205',
      correlatedTestSpecId: '7D9F6B7803A8419F9147F483A65EAEE7',
      testId: '5187',
      labUnitId: '34',
      testSpecInfo: {
        id: 5205,
        testId: 5187,
        analyteStorageUnitId: 78,
        analyteId: 73,
        analyteName: 'FSH',
        methodId: 63,
        methodName: 'Chemiluminescence',
        instrumentId: 3116,
        instrumentName: 'Alinity i',
        reagentId: 2240,
        reagentManufacturerId: null,
        reagentManufacturerName: 'Abbott',
        reagentName: 'FSH REF 07P49',
        reagentLotId: 1551,
        reagentLotNumber: 'Unspecified ***',
        reagentLot: {
          id: 1551,
          reagentId: 2240,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date(),
          reagentCategory: 1
        },
        storageUnitId: 34,
        storageUnitName: 'mIU/mL',
        calibratorId: 810,
        calibratorManufacturerId: null,
        calibratorManufacturerName: 'Abbott',
        calibratorName: 'FSH Cal REF 07P4901',
        calibratorLotId: 812,
        calibratorLotNumber: 'Unspecified ***',
        calibratorLot: {
          id: 812,
          calibratorId: 810,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date()
        }
      },
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
            controlLotId: '117',
            controlLevel: '1',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '118',
            controlLevel: '2',
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
          }
        ],
        id: '6b7b8b65-cd5a-4eac-9627-13d0cec3c218',
        parentNodeId: '6709fa3c-5439-46db-b944-8b47aa5f2c72',
        parentNode: null,
        nodeType: 8,
        displayName: '6b7b8b65-cd5a-4eac-9627-13d0cec3c218',
        children: null
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
        id: 'dc889c46-f310-4662-8c80-147fac28ecad',
        parentNodeId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      mappedTestSpecs: null,
      id: '6709fa3c-5439-46db-b944-8b47aa5f2c72',
      parentNodeId: '1628ad45-c0b4-4708-8ad0-e448628820fe',
      parentNode: null,
      nodeType: 6,
      children: []
    },
    {
      displayName: 'Prolactin',
      testSpecId: '5200',
      correlatedTestSpecId: 'BB76D4286A6A49E3A3B59E3B2D2FA840',
      testId: '5182',
      labUnitId: '2',
      testSpecInfo: {
        id: 5200,
        testId: 5182,
        analyteStorageUnitId: 275,
        analyteId: 341,
        analyteName: 'Prolactin',
        methodId: 63,
        methodName: 'Chemiluminescence',
        instrumentId: 3116,
        instrumentName: 'Alinity i',
        reagentId: 2251,
        reagentManufacturerId: null,
        reagentManufacturerName: 'Abbott',
        reagentName: 'Prolactin REF 07P66',
        reagentLotId: 1562,
        reagentLotNumber: 'Unspecified ***',
        reagentLot: {
          id: 1562,
          reagentId: 2251,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date(),
          reagentCategory: 1
        },
        storageUnitId: 2,
        storageUnitName: 'ng/mL',
        calibratorId: 821,
        calibratorManufacturerId: null,
        calibratorManufacturerName: 'Abbott',
        calibratorName: 'Prolactin Cal REF 07P6601',
        calibratorLotId: 823,
        calibratorLotNumber: 'Unspecified ***',
        calibratorLot: {
          id: 823,
          calibratorId: 821,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date()
        }
      },
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
            controlLotId: '117',
            controlLevel: '1',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '118',
            controlLevel: '2',
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
          }
        ],
        id: 'df033e8f-18d8-4224-8ee7-1e30dd3a4fbe',
        parentNodeId: 'c18dc897-dc48-420a-a0b6-e884a6e81a7f',
        parentNode: null,
        nodeType: 8,
        displayName: 'df033e8f-18d8-4224-8ee7-1e30dd3a4fbe',
        children: null
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
        id: 'dc889c46-f310-4662-8c80-147fac28ecad',
        parentNodeId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      mappedTestSpecs: null,
      id: 'c18dc897-dc48-420a-a0b6-e884a6e81a7f',
      parentNodeId: '1628ad45-c0b4-4708-8ad0-e448628820fe',
      parentNode: null,
      nodeType: 6,
      children: []
    },
    {
      displayName: 'LH',
      testSpecId: '5210',
      correlatedTestSpecId: '38E3AE307EE24176AB2BBC80E09F400A',
      testId: '5192',
      labUnitId: '75',
      testSpecInfo: {
        id: 5210,
        testId: 5192,
        analyteStorageUnitId: 112,
        analyteId: 112,
        analyteName: 'LH',
        methodId: 63,
        methodName: 'Chemiluminescence',
        instrumentId: 3116,
        instrumentName: 'Alinity i',
        reagentId: 2246,
        reagentManufacturerId: null,
        reagentManufacturerName: 'Abbott',
        reagentName: 'LH REF 07P91',
        reagentLotId: 1557,
        reagentLotNumber: 'Unspecified ***',
        reagentLot: {
          id: 1557,
          reagentId: 2246,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date(),
          reagentCategory: 1
        },
        storageUnitId: 34,
        storageUnitName: 'mIU/mL',
        calibratorId: 816,
        calibratorManufacturerId: null,
        calibratorManufacturerName: 'Abbott',
        calibratorName: 'LH Cal REF 07P9101',
        calibratorLotId: 818,
        calibratorLotNumber: 'Unspecified ***',
        calibratorLot: {
          id: 818,
          calibratorId: 816,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: new Date()
        }
      },
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
            controlLotId: '117',
            controlLevel: '1',
            mean: 0,
            sd: 0,
            points: 0
          },
          {
            controlLotId: '118',
            controlLevel: '2',
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
          }
        ],
        id: '8910f587-25d2-438f-a9ec-c7ffb534092f',
        parentNodeId: 'fa935019-60e8-4447-9d23-aa7fd9c62be4',
        parentNode: null,
        nodeType: 8,
        displayName: '8910f587-25d2-438f-a9ec-c7ffb534092f',
        children: null
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
        id: 'dc889c46-f310-4662-8c80-147fac28ecad',
        parentNodeId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      mappedTestSpecs: null,
      id: 'fa935019-60e8-4447-9d23-aa7fd9c62be4',
      parentNodeId: '1628ad45-c0b4-4708-8ad0-e448628820fe',
      parentNode: null,
      nodeType: 6,
      children: []
    }
  ];

  const entity: LabProduct = {
    displayName: 'Assayed Chemistry',
    productId: '2',
    productMasterLotId: '73',
    productCustomName: '',
    productInfo: {
      id: 2,
      name: 'Assayed Chemistry',
      manufacturerId: '2',
      manufacturerName: 'Bio-Rad',
      matrixId: 3,
      matrixName: 'Serum'
    },
    lotInfo: {
      id: 73,
      productId: 2,
      productName: 'Assayed Chemistry',
      lotNumber: '26440',
      expirationDate: new Date()
    },
    productLotLevels: [
      {
        id: '117',
        productMasterLotId: '73',
        productId: '2',
        productMasterLotNumber: '26440',
        lotNumber: '26441',
        level: 1,
        levelDescription: '1'
      },
      {
        id: '118',
        productMasterLotId: '73',
        productId: '2',
        productMasterLotNumber: '26440',
        lotNumber: '26442',
        level: 2,
        levelDescription: '2'
      }
    ],
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
          controlLotId: '117',
          controlLevel: '1',
          mean: 0,
          sd: 0,
          points: 0
        },
        {
          controlLotId: '118',
          controlLevel: '2',
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
        }
      ],
      id: '40c7a5f3-d2af-4ba1-b13b-9360b320e554',
      parentNodeId: '1628ad45-c0b4-4708-8ad0-e448628820fe',
      parentNode: null,
      nodeType: 8,
      displayName: '40c7a5f3-d2af-4ba1-b13b-9360b320e554',
      children: null
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
      id: 'dc889c46-f310-4662-8c80-147fac28ecad',
      parentNodeId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
      parentNode: null,
      nodeType: 9,
      children: null
    },
    hasOwnAccountSettings: false,
    id: '1628ad45-c0b4-4708-8ad0-e448628820fe',
    parentNodeId: 'f1a7e048-4684-4a26-8438-45a336603b59',
    parentNode: null,
    nodeType: 5,
    children: analyteList
  };

  const analyteEvaluationMeanSdGroup: Array<AnalyteEvaluationMeanSd> = [
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'testSpecInfo': {
        'id': 0,
        'testId': 0,
        'analyteStorageUnitId': 0,
        'analyteId': 0,
        'analyteName': 'string',
        'methodId': 0,
        'methodName': 'string',
        'instrumentId': 0,
        'instrumentName': 'string',
        'reagentId': 0,
        'reagentManufacturerName': 'string',
        'reagentName': 'string',
        'reagentLotId': 0,
        'reagentLotNumber': 'string',
        'reagentLot': {
          'id': 0,
          'reagentId': 0,
          'reagentName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 0,
        'storageUnitName': 'string',
        'calibratorId': 0,
        'calibratorManufacturerName': 'string',
        'calibratorName': 'string',
        'calibratorLotId': 0,
        'calibratorLotNumber': 'string',
        'calibratorLot': {
          'id': 0,
          'calibratorId': 0,
          'calibratorName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date()
        }
      },
      'levelEvaluationMeanSds': [
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 1,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 2,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 2,
          'meanEvaluationType': 1,
          'mean': 4,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 2,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 3,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        }
      ]
    },
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'testSpecInfo': {
        'id': 0,
        'testId': 0,
        'analyteStorageUnitId': 0,
        'analyteId': 0,
        'analyteName': 'string',
        'methodId': 0,
        'methodName': 'string',
        'instrumentId': 0,
        'instrumentName': 'string',
        'reagentId': 0,
        'reagentManufacturerName': 'string',
        'reagentName': 'string',
        'reagentLotId': 0,
        'reagentLotNumber': 'string',
        'reagentLot': {
          'id': 0,
          'reagentId': 0,
          'reagentName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 0,
        'storageUnitName': 'string',
        'calibratorId': 0,
        'calibratorManufacturerName': 'string',
        'calibratorName': 'string',
        'calibratorLotId': 0,
        'calibratorLotNumber': 'string',
        'calibratorLot': {
          'id': 0,
          'calibratorId': 0,
          'calibratorName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date()
        }
      },
      'levelEvaluationMeanSds': [
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 1,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 2,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 2,
          'meanEvaluationType': 1,
          'mean': 4,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 2,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 3,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        }
      ]
    },
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'testSpecInfo': {
        'id': 0,
        'testId': 0,
        'analyteStorageUnitId': 0,
        'analyteId': 0,
        'analyteName': 'string',
        'methodId': 0,
        'methodName': 'string',
        'instrumentId': 0,
        'instrumentName': 'string',
        'reagentId': 0,
        'reagentManufacturerName': 'string',
        'reagentName': 'string',
        'reagentLotId': 0,
        'reagentLotNumber': 'string',
        'reagentLot': {
          'id': 0,
          'reagentId': 0,
          'reagentName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 0,
        'storageUnitName': 'string',
        'calibratorId': 0,
        'calibratorManufacturerName': 'string',
        'calibratorName': 'string',
        'calibratorLotId': 0,
        'calibratorLotNumber': 'string',
        'calibratorLot': {
          'id': 0,
          'calibratorId': 0,
          'calibratorName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date()
        }
      },
      'levelEvaluationMeanSds': [
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 1,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 2,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 2,
          'meanEvaluationType': 1,
          'mean': 4,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 2,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 3,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        }
      ]
    },
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'testSpecInfo': {
        'id': 0,
        'testId': 0,
        'analyteStorageUnitId': 0,
        'analyteId': 0,
        'analyteName': 'string',
        'methodId': 0,
        'methodName': 'string',
        'instrumentId': 0,
        'instrumentName': 'string',
        'reagentId': 0,
        'reagentManufacturerName': 'string',
        'reagentName': 'string',
        'reagentLotId': 0,
        'reagentLotNumber': 'string',
        'reagentLot': {
          'id': 0,
          'reagentId': 0,
          'reagentName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 0,
        'storageUnitName': 'string',
        'calibratorId': 0,
        'calibratorManufacturerName': 'string',
        'calibratorName': 'string',
        'calibratorLotId': 0,
        'calibratorLotNumber': 'string',
        'calibratorLot': {
          'id': 0,
          'calibratorId': 0,
          'calibratorName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date()
        }
      },
      'levelEvaluationMeanSds': [
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 1,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 2,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 2,
          'meanEvaluationType': 1,
          'mean': 4,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 2,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 3,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        }
      ]
    },
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'testSpecInfo': {
        'id': 0,
        'testId': 0,
        'analyteStorageUnitId': 0,
        'analyteId': 0,
        'analyteName': 'string',
        'methodId': 0,
        'methodName': 'string',
        'instrumentId': 0,
        'instrumentName': 'string',
        'reagentId': 0,
        'reagentManufacturerName': 'string',
        'reagentName': 'string',
        'reagentLotId': 0,
        'reagentLotNumber': 'string',
        'reagentLot': {
          'id': 0,
          'reagentId': 0,
          'reagentName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 0,
        'storageUnitName': 'string',
        'calibratorId': 0,
        'calibratorManufacturerName': 'string',
        'calibratorName': 'string',
        'calibratorLotId': 0,
        'calibratorLotNumber': 'string',
        'calibratorLot': {
          'id': 0,
          'calibratorId': 0,
          'calibratorName': 'string',
          'lotNumber': 'string',
          'shelfExpirationDate': new Date()
        }
      },
      'levelEvaluationMeanSds': [
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 1,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 2,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 2,
          'meanEvaluationType': 1,
          'mean': 4,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 2,
          'cvIsCalculated': true
        },
        {
          'entityId': '11111111-1111-1111-1111-111111111111',
          'level': 3,
          'meanEvaluationType': 1,
          'mean': 2,
          'sdEvaluationType': 1,
          'sd': 3,
          'sdIsCalculated': false,
          'cvEvaluationType': 1,
          'cv': 1,
          'cvIsCalculated': true
        }
      ]
    }
  ];

  const analyteFloatingStatisticsGroup: Array<LevelFloatingStatistics> = [
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'level': 1,
      'mean': 1,
      'sd': 2,
      'cv': 4
    },
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'level': 2,
      'mean': 1,
      'sd': 2,
      'cv': 3
    },
    {
      'entityId': '11111111-1111-1111-1111-111111111111',
      'level': 3,
      'mean': 1,
      'sd': 2,
      'cv': 3
    }
  ];

  const appState = [];
  const mockMatRefProvider = {
    close: () => { }
  };

  const mockChangeTrackerService = {
    canDeactivate: () => { },
    setDirty: () => { },
    resetDirty: () => { },
    setOkAction: () => { },
    getDialogRef: () => { },
    setCustomPrompt: () => { },
    unSavedChanges: () => true
  };

  const mockDisplayList = [
    {
      'primaryText': 'Cortisol',
      'secondaryText': '',
      'additionalText': '',
      'node': {
        'displayName': 'Cortisol',
        'testSpecId': '5203',
        'correlatedTestSpecId': '136F034126974CC8A16EA9F474E72F67',
        'testId': '5185',
        'labUnitId': '52',
        'testSpecInfo': {
          'id': 5203,
          'testId': 5185,
          'analyteStorageUnitId': 48,
          'analyteId': 41,
          'analyteName': 'Cortisol',
          'methodId': 63,
          'methodName': 'Chemiluminescence',
          'instrumentId': 3116,
          'instrumentName': 'Alinity i',
          'reagentId': 2235,
          'reagentManufacturerId': null,
          'reagentManufacturerName': 'Abbott',
          'reagentName': 'Cortisol REF 08P33',
          'reagentLotId': 1546,
          'reagentLotNumber': 'Unspecified ***',
          'reagentLot': {
            'id': 1546,
            'reagentId': 2235,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.377'
          },
          'storageUnitId': 13,
          'storageUnitName': 'µg/dL',
          'calibratorId': 805,
          'calibratorManufacturerId': null,
          'calibratorManufacturerName': 'Abbott',
          'calibratorName': 'Cortisol Cal REF 08P3301',
          'calibratorLotId': 807,
          'calibratorLotNumber': 'Unspecified ***',
          'calibratorLot': {
            'id': 807,
            'calibratorId': 805,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.377'
          }
        },
        'levelSettings': {
          'levelEntityId': null,
          'levelEntityName': null,
          'parentLevelEntityId': null,
          'parentLevelEntityName': null,
          'minNumberOfPoints': 5,
          'runLength': 4,
          'dataType': 1,
          'targets': [
            {
              'controlLotId': '117',
              'controlLevel': 1,
              'mean': 0,
              'sd': 0,
              'points': 0
            },
            {
              'controlLotId': '118',
              'controlLevel': 2,
              'mean': 0,
              'sd': 0,
              'points': 0
            }
          ],
          'rules': [
            {
              'id': '2',
              'category': '1k',
              'k': 3,
              'disposition': 'D'
            },
            {
              'id': '1',
              'category': '1k',
              'k': 2,
              'disposition': 'D'
            }
          ],
          'levels': [
            {
              'levelInUse': true,
              'decimalPlace': 2
            },
            {
              'levelInUse': true,
              'decimalPlace': 2
            }
          ],
          'id': '54701a68-39a1-4ba6-bf6e-381c0c506a9f',
          'parentNodeId': '8385565c-0f28-47a2-9853-49d787327c46',
          'parentNode': null,
          'nodeType': 8,
          'displayName': '54701a68-39a1-4ba6-bf6e-381c0c506a9f',
          'children': null
        },
        'accountSettings': {
          'displayName': '',
          'dataType': 1,
          'instrumentsGroupedByDept': true,
          'trackReagentCalibrator': false,
          'fixedMean': false,
          'decimalPlaces': 2,
          'siUnits': false,
          'labSetupRating': 0,
          'labSetupComments': '',
          'isLabSetupComplete': true,
          'labSetupLastEntityId': 'null',
          'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
          'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
          'parentNode': null,
          'nodeType': 9,
          'children': null
        },
        'hasOwnAccountSettings': false,
        'mappedTestSpecs': null,
        'id': '8385565c-0f28-47a2-9853-49d787327c46',
        'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
        'parentNode': null,
        'nodeType': 6,
        'children': [

        ]
      }
    },
    {
      'primaryText': 'Folate',
      'secondaryText': '',
      'additionalText': '',
      'node': {
        'displayName': 'Folate',
        'testSpecId': '5238',
        'correlatedTestSpecId': '962F51AC893942CCB91DF80F727D7298',
        'testId': '5220',
        'labUnitId': '52',
        'testSpecInfo': {
          'id': 5238,
          'testId': 5220,
          'analyteStorageUnitId': 75,
          'analyteId': 70,
          'analyteName': 'Folate',
          'methodId': 63,
          'methodName': 'Chemiluminescence',
          'instrumentId': 3116,
          'instrumentName': 'Alinity i',
          'reagentId': 2239,
          'reagentManufacturerId': null,
          'reagentManufacturerName': 'Abbott',
          'reagentName': 'Folate REF 08P14',
          'reagentLotId': 1550,
          'reagentLotNumber': 'Unspecified ***',
          'reagentLot': {
            'id': 1550,
            'reagentId': 2239,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.437'
          },
          'storageUnitId': 2,
          'storageUnitName': 'ng/mL',
          'calibratorId': 809,
          'calibratorManufacturerId': null,
          'calibratorManufacturerName': 'Abbott',
          'calibratorName': 'Folate Cal REF 08P1401',
          'calibratorLotId': 811,
          'calibratorLotNumber': 'Unspecified ***',
          'calibratorLot': {
            'id': 811,
            'calibratorId': 809,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.44'
          }
        },
        'levelSettings': {
          'levelEntityId': null,
          'levelEntityName': null,
          'parentLevelEntityId': null,
          'parentLevelEntityName': null,
          'minNumberOfPoints': 5,
          'runLength': 4,
          'dataType': 1,
          'targets': [
            {
              'controlLotId': '117',
              'controlLevel': 1,
              'mean': 0,
              'sd': 0,
              'points': 0
            },
            {
              'controlLotId': '118',
              'controlLevel': 2,
              'mean': 0,
              'sd': 0,
              'points': 0
            }
          ],
          'rules': [
            {
              'id': '2',
              'category': '1k',
              'k': 3,
              'disposition': 'D'
            },
            {
              'id': '1',
              'category': '1k',
              'k': 2,
              'disposition': 'D'
            }
          ],
          'levels': [
            {
              'levelInUse': true,
              'decimalPlace': 2
            },
            {
              'levelInUse': true,
              'decimalPlace': 2
            }
          ],
          'id': '3554b3b3-de65-472b-873b-16f6a44ddabe',
          'parentNodeId': '65a159e9-26db-4c95-82be-dac080688421',
          'parentNode': null,
          'nodeType': 8,
          'displayName': '3554b3b3-de65-472b-873b-16f6a44ddabe',
          'children': null
        },
        'accountSettings': {
          'displayName': '',
          'dataType': 1,
          'instrumentsGroupedByDept': true,
          'trackReagentCalibrator': false,
          'fixedMean': false,
          'decimalPlaces': 2,
          'siUnits': false,
          'labSetupRating': 0,
          'labSetupComments': '',
          'isLabSetupComplete': true,
          'labSetupLastEntityId': 'null',
          'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
          'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
          'parentNode': null,
          'nodeType': 9,
          'children': null
        },
        'hasOwnAccountSettings': false,
        'mappedTestSpecs': null,
        'id': '65a159e9-26db-4c95-82be-dac080688421',
        'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
        'parentNode': null,
        'nodeType': 6,
        'children': [

        ]
      }
    },
    {
      'primaryText': 'FSH',
      'secondaryText': '',
      'additionalText': '',
      'node': {
        'displayName': 'FSH',
        'testSpecId': '5205',
        'correlatedTestSpecId': '7D9F6B7803A8419F9147F483A65EAEE7',
        'testId': '5187',
        'labUnitId': '34',
        'testSpecInfo': {
          'id': 5205,
          'testId': 5187,
          'analyteStorageUnitId': 78,
          'analyteId': 73,
          'analyteName': 'FSH',
          'methodId': 63,
          'methodName': 'Chemiluminescence',
          'instrumentId': 3116,
          'instrumentName': 'Alinity i',
          'reagentId': 2240,
          'reagentManufacturerId': null,
          'reagentManufacturerName': 'Abbott',
          'reagentName': 'FSH REF 07P49',
          'reagentLotId': 1551,
          'reagentLotNumber': 'Unspecified ***',
          'reagentLot': {
            'id': 1551,
            'reagentId': 2240,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.45'
          },
          'storageUnitId': 34,
          'storageUnitName': 'mIU/mL',
          'calibratorId': 810,
          'calibratorManufacturerId': null,
          'calibratorManufacturerName': 'Abbott',
          'calibratorName': 'FSH Cal REF 07P4901',
          'calibratorLotId': 812,
          'calibratorLotNumber': 'Unspecified ***',
          'calibratorLot': {
            'id': 812,
            'calibratorId': 810,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.45'
          }
        },
        'levelSettings': {
          'levelEntityId': null,
          'levelEntityName': null,
          'parentLevelEntityId': null,
          'parentLevelEntityName': null,
          'minNumberOfPoints': 5,
          'runLength': 4,
          'dataType': 1,
          'targets': [
            {
              'controlLotId': '117',
              'controlLevel': 1,
              'mean': 0,
              'sd': 0,
              'points': 0
            },
            {
              'controlLotId': '118',
              'controlLevel': 2,
              'mean': 0,
              'sd': 0,
              'points': 0
            }
          ],
          'rules': [
            {
              'id': '2',
              'category': '1k',
              'k': 3,
              'disposition': 'D'
            },
            {
              'id': '1',
              'category': '1k',
              'k': 2,
              'disposition': 'D'
            }
          ],
          'levels': [
            {
              'levelInUse': true,
              'decimalPlace': 2
            },
            {
              'levelInUse': true,
              'decimalPlace': 2
            }
          ],
          'id': '6b7b8b65-cd5a-4eac-9627-13d0cec3c218',
          'parentNodeId': '6709fa3c-5439-46db-b944-8b47aa5f2c72',
          'parentNode': null,
          'nodeType': 8,
          'displayName': '6b7b8b65-cd5a-4eac-9627-13d0cec3c218',
          'children': null
        },
        'accountSettings': {
          'displayName': '',
          'dataType': 1,
          'instrumentsGroupedByDept': true,
          'trackReagentCalibrator': false,
          'fixedMean': false,
          'decimalPlaces': 2,
          'siUnits': false,
          'labSetupRating': 0,
          'labSetupComments': '',
          'isLabSetupComplete': true,
          'labSetupLastEntityId': 'null',
          'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
          'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
          'parentNode': null,
          'nodeType': 9,
          'children': null
        },
        'hasOwnAccountSettings': false,
        'mappedTestSpecs': null,
        'id': '6709fa3c-5439-46db-b944-8b47aa5f2c72',
        'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
        'parentNode': null,
        'nodeType': 6,
        'children': [

        ]
      }
    },
    {
      'primaryText': 'LH',
      'secondaryText': '',
      'additionalText': '',
      'node': {
        'displayName': 'LH',
        'testSpecId': '5210',
        'correlatedTestSpecId': '38E3AE307EE24176AB2BBC80E09F400A',
        'testId': '5192',
        'labUnitId': '75',
        'testSpecInfo': {
          'id': 5210,
          'testId': 5192,
          'analyteStorageUnitId': 112,
          'analyteId': 112,
          'analyteName': 'LH',
          'methodId': 63,
          'methodName': 'Chemiluminescence',
          'instrumentId': 3116,
          'instrumentName': 'Alinity i',
          'reagentId': 2246,
          'reagentManufacturerId': null,
          'reagentManufacturerName': 'Abbott',
          'reagentName': 'LH REF 07P91',
          'reagentLotId': 1557,
          'reagentLotNumber': 'Unspecified ***',
          'reagentLot': {
            'id': 1557,
            'reagentId': 2246,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.523'
          },
          'storageUnitId': 34,
          'storageUnitName': 'mIU/mL',
          'calibratorId': 816,
          'calibratorManufacturerId': null,
          'calibratorManufacturerName': 'Abbott',
          'calibratorName': 'LH Cal REF 07P9101',
          'calibratorLotId': 818,
          'calibratorLotNumber': 'Unspecified ***',
          'calibratorLot': {
            'id': 818,
            'calibratorId': 816,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.523'
          }
        },
        'levelSettings': {
          'levelEntityId': null,
          'levelEntityName': null,
          'parentLevelEntityId': null,
          'parentLevelEntityName': null,
          'minNumberOfPoints': 5,
          'runLength': 4,
          'dataType': 1,
          'targets': [
            {
              'controlLotId': '117',
              'controlLevel': 1,
              'mean': 0,
              'sd': 0,
              'points': 0
            },
            {
              'controlLotId': '118',
              'controlLevel': 2,
              'mean': 0,
              'sd': 0,
              'points': 0
            }
          ],
          'rules': [
            {
              'id': '2',
              'category': '1k',
              'k': 3,
              'disposition': 'D'
            },
            {
              'id': '1',
              'category': '1k',
              'k': 2,
              'disposition': 'D'
            }
          ],
          'levels': [
            {
              'levelInUse': true,
              'decimalPlace': 2
            },
            {
              'levelInUse': true,
              'decimalPlace': 2
            }
          ],
          'id': '8910f587-25d2-438f-a9ec-c7ffb534092f',
          'parentNodeId': 'fa935019-60e8-4447-9d23-aa7fd9c62be4',
          'parentNode': null,
          'nodeType': 8,
          'displayName': '8910f587-25d2-438f-a9ec-c7ffb534092f',
          'children': null
        },
        'accountSettings': {
          'displayName': '',
          'dataType': 1,
          'instrumentsGroupedByDept': true,
          'trackReagentCalibrator': false,
          'fixedMean': false,
          'decimalPlaces': 2,
          'siUnits': false,
          'labSetupRating': 0,
          'labSetupComments': '',
          'isLabSetupComplete': true,
          'labSetupLastEntityId': 'null',
          'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
          'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
          'parentNode': null,
          'nodeType': 9,
          'children': null
        },
        'hasOwnAccountSettings': false,
        'mappedTestSpecs': null,
        'id': 'fa935019-60e8-4447-9d23-aa7fd9c62be4',
        'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
        'parentNode': null,
        'nodeType': 6,
        'children': [

        ]
      }
    },
    {
      'primaryText': 'Prolactin',
      'secondaryText': '',
      'additionalText': '',
      'node': {
        'displayName': 'Prolactin',
        'testSpecId': '5200',
        'correlatedTestSpecId': 'BB76D4286A6A49E3A3B59E3B2D2FA840',
        'testId': '5182',
        'labUnitId': '2',
        'testSpecInfo': {
          'id': 5200,
          'testId': 5182,
          'analyteStorageUnitId': 275,
          'analyteId': 341,
          'analyteName': 'Prolactin',
          'methodId': 63,
          'methodName': 'Chemiluminescence',
          'instrumentId': 3116,
          'instrumentName': 'Alinity i',
          'reagentId': 2251,
          'reagentManufacturerId': null,
          'reagentManufacturerName': 'Abbott',
          'reagentName': 'Prolactin REF 07P66',
          'reagentLotId': 1562,
          'reagentLotNumber': 'Unspecified ***',
          'reagentLot': {
            'id': 1562,
            'reagentId': 2251,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.59'
          },
          'storageUnitId': 2,
          'storageUnitName': 'ng/mL',
          'calibratorId': 821,
          'calibratorManufacturerId': null,
          'calibratorManufacturerName': 'Abbott',
          'calibratorName': 'Prolactin Cal REF 07P6601',
          'calibratorLotId': 823,
          'calibratorLotNumber': 'Unspecified ***',
          'calibratorLot': {
            'id': 823,
            'calibratorId': 821,
            'lotNumber': 'Unspecified ***',
            'shelfExpirationDate': '2069-05-24T19:50:56.59'
          }
        },
        'levelSettings': {
          'levelEntityId': null,
          'levelEntityName': null,
          'parentLevelEntityId': null,
          'parentLevelEntityName': null,
          'minNumberOfPoints': 5,
          'runLength': 4,
          'dataType': 1,
          'targets': [
            {
              'controlLotId': '117',
              'controlLevel': 1,
              'mean': 0,
              'sd': 0,
              'points': 0
            },
            {
              'controlLotId': '118',
              'controlLevel': 2,
              'mean': 0,
              'sd': 0,
              'points': 0
            }
          ],
          'rules': [
            {
              'id': '2',
              'category': '1k',
              'k': 3,
              'disposition': 'D'
            },
            {
              'id': '1',
              'category': '1k',
              'k': 2,
              'disposition': 'D'
            }
          ],
          'levels': [
            {
              'levelInUse': true,
              'decimalPlace': 2
            },
            {
              'levelInUse': true,
              'decimalPlace': 2
            }
          ],
          'id': 'df033e8f-18d8-4224-8ee7-1e30dd3a4fbe',
          'parentNodeId': 'c18dc897-dc48-420a-a0b6-e884a6e81a7f',
          'parentNode': null,
          'nodeType': 8,
          'displayName': 'df033e8f-18d8-4224-8ee7-1e30dd3a4fbe',
          'children': null
        },
        'accountSettings': {
          'displayName': '',
          'dataType': 1,
          'instrumentsGroupedByDept': true,
          'trackReagentCalibrator': false,
          'fixedMean': false,
          'decimalPlaces': 2,
          'siUnits': false,
          'labSetupRating': 0,
          'labSetupComments': '',
          'isLabSetupComplete': true,
          'labSetupLastEntityId': 'null',
          'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
          'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
          'parentNode': null,
          'nodeType': 9,
          'children': null
        },
        'hasOwnAccountSettings': false,
        'mappedTestSpecs': null,
        'id': 'c18dc897-dc48-420a-a0b6-e884a6e81a7f',
        'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
        'parentNode': null,
        'nodeType': 6,
        'children': [

        ]
      }
    }
  ];

  const mockControlDisplayList = [
    {
      'primaryText': 'Assayed Chemistry',
      'secondaryText': '',
      'additionalText': ' Lot 26440',
      'node': {
        'displayName': 'Assayed Chemistry',
        'productId': '2',
        'productMasterLotId': '73',
        'productCustomName': '',
        'productInfo': {
          'id': 2,
          'name': 'Assayed Chemistry',
          'manufacturerId': 2,
          'manufacturerName': 'Bio-Rad',
          'matrixId': 3,
          'matrixName': 'Serum'
        },
        'lotInfo': {
          'id': 73,
          'productId': 2,
          'productName': 'Assayed Chemistry',
          'lotNumber': '26440',
          'expirationDate': '2020-11-30T00:00:00',
          'lotWithExpirationDate': '26440    exp. Nov 30 2020'
        },
        'productLotLevels': [
          {
            'id': '117',
            'productMasterLotId': '73',
            'productId': '2',
            'productMasterLotNumber': '26440',
            'lotNumber': '26441',
            'level': 1,
            'levelDescription': '1'
          },
          {
            'id': '118',
            'productMasterLotId': '73',
            'productId': '2',
            'productMasterLotNumber': '26440',
            'lotNumber': '26442',
            'level': 2,
            'levelDescription': '2'
          }
        ],
        'levelSettings': {
          'levelEntityId': null,
          'levelEntityName': null,
          'parentLevelEntityId': null,
          'parentLevelEntityName': null,
          'minNumberOfPoints': 5,
          'runLength': 4,
          'dataType': 1,
          'targets': [
            {
              'controlLotId': '117',
              'controlLevel': 1,
              'mean': 0,
              'sd': 0,
              'points': 0
            },
            {
              'controlLotId': '118',
              'controlLevel': 2,
              'mean': 0,
              'sd': 0,
              'points': 0
            }
          ],
          'rules': [
            {
              'id': '2',
              'category': '1k',
              'k': 3,
              'disposition': 'D'
            },
            {
              'id': '1',
              'category': '1k',
              'k': 2,
              'disposition': 'D'
            }
          ],
          'levels': [
            {
              'levelInUse': true,
              'decimalPlace': 2
            },
            {
              'levelInUse': true,
              'decimalPlace': 2
            }
          ],
          'id': '40c7a5f3-d2af-4ba1-b13b-9360b320e554',
          'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
          'parentNode': null,
          'nodeType': 8,
          'displayName': '40c7a5f3-d2af-4ba1-b13b-9360b320e554',
          'children': null
        },
        'accountSettings': {
          'displayName': '',
          'dataType': 1,
          'instrumentsGroupedByDept': true,
          'trackReagentCalibrator': false,
          'fixedMean': false,
          'decimalPlaces': 2,
          'siUnits': false,
          'labSetupRating': 0,
          'labSetupComments': '',
          'isLabSetupComplete': true,
          'labSetupLastEntityId': 'null',
          'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
          'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
          'parentNode': null,
          'nodeType': 9,
          'children': null
        },
        'hasOwnAccountSettings': false,
        'id': '1628ad45-c0b4-4708-8ad0-e448628820fe',
        'parentNodeId': 'f1a7e048-4684-4a26-8438-45a336603b59',
        'parentNode': null,
        'nodeType': 5,
        'children': [
          {
            'displayName': 'Folate',
            'testSpecId': '5238',
            'correlatedTestSpecId': '962F51AC893942CCB91DF80F727D7298',
            'testId': '5220',
            'labUnitId': '52',
            'testSpecInfo': {
              'id': 5238,
              'testId': 5220,
              'analyteStorageUnitId': 75,
              'analyteId': 70,
              'analyteName': 'Folate',
              'methodId': 63,
              'methodName': 'Chemiluminescence',
              'instrumentId': 3116,
              'instrumentName': 'Alinity i',
              'reagentId': 2239,
              'reagentManufacturerId': null,
              'reagentManufacturerName': 'Abbott',
              'reagentName': 'Folate REF 08P14',
              'reagentLotId': 1550,
              'reagentLotNumber': 'Unspecified ***',
              'reagentLot': {
                'id': 1550,
                'reagentId': 2239,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.437'
              },
              'storageUnitId': 2,
              'storageUnitName': 'ng/mL',
              'calibratorId': 809,
              'calibratorManufacturerId': null,
              'calibratorManufacturerName': 'Abbott',
              'calibratorName': 'Folate Cal REF 08P1401',
              'calibratorLotId': 811,
              'calibratorLotNumber': 'Unspecified ***',
              'calibratorLot': {
                'id': 811,
                'calibratorId': 809,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.44'
              }
            },
            'levelSettings': {
              'levelEntityId': null,
              'levelEntityName': null,
              'parentLevelEntityId': null,
              'parentLevelEntityName': null,
              'minNumberOfPoints': 5,
              'runLength': 4,
              'dataType': 1,
              'targets': [
                {
                  'controlLotId': '117',
                  'controlLevel': 1,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                },
                {
                  'controlLotId': '118',
                  'controlLevel': 2,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                }
              ],
              'rules': [
                {
                  'id': '2',
                  'category': '1k',
                  'k': 3,
                  'disposition': 'D'
                },
                {
                  'id': '1',
                  'category': '1k',
                  'k': 2,
                  'disposition': 'D'
                }
              ],
              'levels': [
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                },
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                }
              ],
              'id': '3554b3b3-de65-472b-873b-16f6a44ddabe',
              'parentNodeId': '65a159e9-26db-4c95-82be-dac080688421',
              'parentNode': null,
              'nodeType': 8,
              'displayName': '3554b3b3-de65-472b-873b-16f6a44ddabe',
              'children': null
            },
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
              'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'hasOwnAccountSettings': false,
            'mappedTestSpecs': null,
            'id': '65a159e9-26db-4c95-82be-dac080688421',
            'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
            'parentNode': null,
            'nodeType': 6,
            'children': [

            ]
          },
          {
            'displayName': 'Cortisol',
            'testSpecId': '5203',
            'correlatedTestSpecId': '136F034126974CC8A16EA9F474E72F67',
            'testId': '5185',
            'labUnitId': '52',
            'testSpecInfo': {
              'id': 5203,
              'testId': 5185,
              'analyteStorageUnitId': 48,
              'analyteId': 41,
              'analyteName': 'Cortisol',
              'methodId': 63,
              'methodName': 'Chemiluminescence',
              'instrumentId': 3116,
              'instrumentName': 'Alinity i',
              'reagentId': 2235,
              'reagentManufacturerId': null,
              'reagentManufacturerName': 'Abbott',
              'reagentName': 'Cortisol REF 08P33',
              'reagentLotId': 1546,
              'reagentLotNumber': 'Unspecified ***',
              'reagentLot': {
                'id': 1546,
                'reagentId': 2235,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.377'
              },
              'storageUnitId': 13,
              'storageUnitName': 'µg/dL',
              'calibratorId': 805,
              'calibratorManufacturerId': null,
              'calibratorManufacturerName': 'Abbott',
              'calibratorName': 'Cortisol Cal REF 08P3301',
              'calibratorLotId': 807,
              'calibratorLotNumber': 'Unspecified ***',
              'calibratorLot': {
                'id': 807,
                'calibratorId': 805,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.377'
              }
            },
            'levelSettings': {
              'levelEntityId': null,
              'levelEntityName': null,
              'parentLevelEntityId': null,
              'parentLevelEntityName': null,
              'minNumberOfPoints': 5,
              'runLength': 4,
              'dataType': 1,
              'targets': [
                {
                  'controlLotId': '117',
                  'controlLevel': 1,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                },
                {
                  'controlLotId': '118',
                  'controlLevel': 2,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                }
              ],
              'rules': [
                {
                  'id': '2',
                  'category': '1k',
                  'k': 3,
                  'disposition': 'D'
                },
                {
                  'id': '1',
                  'category': '1k',
                  'k': 2,
                  'disposition': 'D'
                }
              ],
              'levels': [
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                },
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                }
              ],
              'id': '54701a68-39a1-4ba6-bf6e-381c0c506a9f',
              'parentNodeId': '8385565c-0f28-47a2-9853-49d787327c46',
              'parentNode': null,
              'nodeType': 8,
              'displayName': '54701a68-39a1-4ba6-bf6e-381c0c506a9f',
              'children': null
            },
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
              'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'hasOwnAccountSettings': false,
            'mappedTestSpecs': null,
            'id': '8385565c-0f28-47a2-9853-49d787327c46',
            'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
            'parentNode': null,
            'nodeType': 6,
            'children': [

            ]
          },
          {
            'displayName': 'FSH',
            'testSpecId': '5205',
            'correlatedTestSpecId': '7D9F6B7803A8419F9147F483A65EAEE7',
            'testId': '5187',
            'labUnitId': '34',
            'testSpecInfo': {
              'id': 5205,
              'testId': 5187,
              'analyteStorageUnitId': 78,
              'analyteId': 73,
              'analyteName': 'FSH',
              'methodId': 63,
              'methodName': 'Chemiluminescence',
              'instrumentId': 3116,
              'instrumentName': 'Alinity i',
              'reagentId': 2240,
              'reagentManufacturerId': null,
              'reagentManufacturerName': 'Abbott',
              'reagentName': 'FSH REF 07P49',
              'reagentLotId': 1551,
              'reagentLotNumber': 'Unspecified ***',
              'reagentLot': {
                'id': 1551,
                'reagentId': 2240,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.45'
              },
              'storageUnitId': 34,
              'storageUnitName': 'mIU/mL',
              'calibratorId': 810,
              'calibratorManufacturerId': null,
              'calibratorManufacturerName': 'Abbott',
              'calibratorName': 'FSH Cal REF 07P4901',
              'calibratorLotId': 812,
              'calibratorLotNumber': 'Unspecified ***',
              'calibratorLot': {
                'id': 812,
                'calibratorId': 810,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.45'
              }
            },
            'levelSettings': {
              'levelEntityId': null,
              'levelEntityName': null,
              'parentLevelEntityId': null,
              'parentLevelEntityName': null,
              'minNumberOfPoints': 5,
              'runLength': 4,
              'dataType': 1,
              'targets': [
                {
                  'controlLotId': '117',
                  'controlLevel': 1,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                },
                {
                  'controlLotId': '118',
                  'controlLevel': 2,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                }
              ],
              'rules': [
                {
                  'id': '2',
                  'category': '1k',
                  'k': 3,
                  'disposition': 'D'
                },
                {
                  'id': '1',
                  'category': '1k',
                  'k': 2,
                  'disposition': 'D'
                }
              ],
              'levels': [
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                },
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                }
              ],
              'id': '6b7b8b65-cd5a-4eac-9627-13d0cec3c218',
              'parentNodeId': '6709fa3c-5439-46db-b944-8b47aa5f2c72',
              'parentNode': null,
              'nodeType': 8,
              'displayName': '6b7b8b65-cd5a-4eac-9627-13d0cec3c218',
              'children': null
            },
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
              'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'hasOwnAccountSettings': false,
            'mappedTestSpecs': null,
            'id': '6709fa3c-5439-46db-b944-8b47aa5f2c72',
            'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
            'parentNode': null,
            'nodeType': 6,
            'children': [

            ]
          },
          {
            'displayName': 'Prolactin',
            'testSpecId': '5200',
            'correlatedTestSpecId': 'BB76D4286A6A49E3A3B59E3B2D2FA840',
            'testId': '5182',
            'labUnitId': '2',
            'testSpecInfo': {
              'id': 5200,
              'testId': 5182,
              'analyteStorageUnitId': 275,
              'analyteId': 341,
              'analyteName': 'Prolactin',
              'methodId': 63,
              'methodName': 'Chemiluminescence',
              'instrumentId': 3116,
              'instrumentName': 'Alinity i',
              'reagentId': 2251,
              'reagentManufacturerId': null,
              'reagentManufacturerName': 'Abbott',
              'reagentName': 'Prolactin REF 07P66',
              'reagentLotId': 1562,
              'reagentLotNumber': 'Unspecified ***',
              'reagentLot': {
                'id': 1562,
                'reagentId': 2251,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.59'
              },
              'storageUnitId': 2,
              'storageUnitName': 'ng/mL',
              'calibratorId': 821,
              'calibratorManufacturerId': null,
              'calibratorManufacturerName': 'Abbott',
              'calibratorName': 'Prolactin Cal REF 07P6601',
              'calibratorLotId': 823,
              'calibratorLotNumber': 'Unspecified ***',
              'calibratorLot': {
                'id': 823,
                'calibratorId': 821,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.59'
              }
            },
            'levelSettings': {
              'levelEntityId': null,
              'levelEntityName': null,
              'parentLevelEntityId': null,
              'parentLevelEntityName': null,
              'minNumberOfPoints': 5,
              'runLength': 4,
              'dataType': 1,
              'targets': [
                {
                  'controlLotId': '117',
                  'controlLevel': 1,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                },
                {
                  'controlLotId': '118',
                  'controlLevel': 2,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                }
              ],
              'rules': [
                {
                  'id': '2',
                  'category': '1k',
                  'k': 3,
                  'disposition': 'D'
                },
                {
                  'id': '1',
                  'category': '1k',
                  'k': 2,
                  'disposition': 'D'
                }
              ],
              'levels': [
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                },
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                }
              ],
              'id': 'df033e8f-18d8-4224-8ee7-1e30dd3a4fbe',
              'parentNodeId': 'c18dc897-dc48-420a-a0b6-e884a6e81a7f',
              'parentNode': null,
              'nodeType': 8,
              'displayName': 'df033e8f-18d8-4224-8ee7-1e30dd3a4fbe',
              'children': null
            },
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
              'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'hasOwnAccountSettings': false,
            'mappedTestSpecs': null,
            'id': 'c18dc897-dc48-420a-a0b6-e884a6e81a7f',
            'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
            'parentNode': null,
            'nodeType': 6,
            'children': [

            ]
          },
          {
            'displayName': 'LH',
            'testSpecId': '5210',
            'correlatedTestSpecId': '38E3AE307EE24176AB2BBC80E09F400A',
            'testId': '5192',
            'labUnitId': '75',
            'testSpecInfo': {
              'id': 5210,
              'testId': 5192,
              'analyteStorageUnitId': 112,
              'analyteId': 112,
              'analyteName': 'LH',
              'methodId': 63,
              'methodName': 'Chemiluminescence',
              'instrumentId': 3116,
              'instrumentName': 'Alinity i',
              'reagentId': 2246,
              'reagentManufacturerId': null,
              'reagentManufacturerName': 'Abbott',
              'reagentName': 'LH REF 07P91',
              'reagentLotId': 1557,
              'reagentLotNumber': 'Unspecified ***',
              'reagentLot': {
                'id': 1557,
                'reagentId': 2246,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.523'
              },
              'storageUnitId': 34,
              'storageUnitName': 'mIU/mL',
              'calibratorId': 816,
              'calibratorManufacturerId': null,
              'calibratorManufacturerName': 'Abbott',
              'calibratorName': 'LH Cal REF 07P9101',
              'calibratorLotId': 818,
              'calibratorLotNumber': 'Unspecified ***',
              'calibratorLot': {
                'id': 818,
                'calibratorId': 816,
                'lotNumber': 'Unspecified ***',
                'shelfExpirationDate': '2069-05-24T19:50:56.523'
              }
            },
            'levelSettings': {
              'levelEntityId': null,
              'levelEntityName': null,
              'parentLevelEntityId': null,
              'parentLevelEntityName': null,
              'minNumberOfPoints': 5,
              'runLength': 4,
              'dataType': 1,
              'targets': [
                {
                  'controlLotId': '117',
                  'controlLevel': 1,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                },
                {
                  'controlLotId': '118',
                  'controlLevel': 2,
                  'mean': 0,
                  'sd': 0,
                  'points': 0
                }
              ],
              'rules': [
                {
                  'id': '2',
                  'category': '1k',
                  'k': 3,
                  'disposition': 'D'
                },
                {
                  'id': '1',
                  'category': '1k',
                  'k': 2,
                  'disposition': 'D'
                }
              ],
              'levels': [
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                },
                {
                  'levelInUse': true,
                  'decimalPlace': 2
                }
              ],
              'id': '8910f587-25d2-438f-a9ec-c7ffb534092f',
              'parentNodeId': 'fa935019-60e8-4447-9d23-aa7fd9c62be4',
              'parentNode': null,
              'nodeType': 8,
              'displayName': '8910f587-25d2-438f-a9ec-c7ffb534092f',
              'children': null
            },
            'accountSettings': {
              'displayName': '',
              'dataType': 1,
              'instrumentsGroupedByDept': true,
              'trackReagentCalibrator': false,
              'fixedMean': false,
              'decimalPlaces': 2,
              'siUnits': false,
              'labSetupRating': 0,
              'labSetupComments': '',
              'isLabSetupComplete': true,
              'labSetupLastEntityId': 'null',
              'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
              'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
              'parentNode': null,
              'nodeType': 9,
              'children': null
            },
            'hasOwnAccountSettings': false,
            'mappedTestSpecs': null,
            'id': 'fa935019-60e8-4447-9d23-aa7fd9c62be4',
            'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
            'parentNode': null,
            'nodeType': 6,
            'children': [

            ]
          }
        ]
      }
    }
  ];


  const analyteForNamingList: Array<LabTest> = [
    {
      'displayName': 'Cortisol',
      'testSpecId': '5203',
      'correlatedTestSpecId': '136F034126974CC8A16EA9F474E72F67',
      'testId': '5185',
      'labUnitId': '52',
      'testSpecInfo': {
        'id': 5203,
        'testId': 5185,
        'analyteStorageUnitId': 48,
        'analyteId': 41,
        'analyteName': 'Cortisol',
        'methodId': 63,
        'methodName': 'Chemiluminescence',
        'instrumentId': 3116,
        'instrumentName': 'Alinity i',
        'reagentId': 2235,
        'reagentManufacturerId': null,
        'reagentManufacturerName': 'Abbott',
        'reagentName': 'Cortisol REF 08P33',
        'reagentLotId': 1546,
        'reagentLotNumber': 'Unspecified ***',
        'reagentLot': {
          'id': 1546,
          'reagentId': 2235,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 13,
        'storageUnitName': 'µg/dL',
        'calibratorId': 805,
        'calibratorManufacturerId': null,
        'calibratorManufacturerName': 'Abbott',
        'calibratorName': 'Cortisol Cal REF 08P3301',
        'calibratorLotId': 807,
        'calibratorLotNumber': 'Unspecified ***',
        'calibratorLot': {
          'id': 807,
          'calibratorId': 805,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date()
        }
      },
      'levelSettings': {
        'levelEntityId': null,
        'levelEntityName': null,
        'parentLevelEntityId': null,
        'parentLevelEntityName': null,
        'minNumberOfPoints': 5,
        'runLength': 4,
        'dataType': 1,
        'targets': [
          {
            'controlLotId': '117',
            'controlLevel': '1',
            'mean': 0,
            'sd': 0,
            'points': 0
          },
          {
            'controlLotId': '118',
            'controlLevel': '2',
            'mean': 0,
            'sd': 0,
            'points': 0
          }
        ],
        'rules': [
          {
            'id': '2',
            'category': '1k',
            'k': '3',
            'disposition': 'D'
          },
          {
            'id': '1',
            'category': '1k',
            'k': '2',
            'disposition': 'D'
          }
        ],
        'levels': [
          {
            'levelInUse': true,
            'decimalPlace': 2
          },
          {
            'levelInUse': true,
            'decimalPlace': 2
          }
        ],
        'id': '54701a68-39a1-4ba6-bf6e-381c0c506a9f',
        'parentNodeId': '8385565c-0f28-47a2-9853-49d787327c46',
        'parentNode': null,
        'nodeType': 8,
        'displayName': '54701a68-39a1-4ba6-bf6e-381c0c506a9f',
        'children': null
      },
      'accountSettings': {
        'displayName': '',
        'dataType': 1,
        'instrumentsGroupedByDept': true,
        'trackReagentCalibrator': false,
        'fixedMean': false,
        'decimalPlaces': 2,
        'siUnits': false,
        'labSetupRating': 0,
        'labSetupComments': '',
        'isLabSetupComplete': true,
        'labSetupLastEntityId': 'null',
        'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
        'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        'parentNode': null,
        'nodeType': 9,
        'children': null
      },
      'hasOwnAccountSettings': false,
      'mappedTestSpecs': null,
      'id': '8385565c-0f28-47a2-9853-49d787327c46',
      'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
      'parentNode': null,
      'nodeType': 6,
      'children': [

      ]
    },
    {
      'displayName': 'FSH',
      'testSpecId': '5205',
      'correlatedTestSpecId': '7D9F6B7803A8419F9147F483A65EAEE7',
      'testId': '5187',
      'labUnitId': '34',
      'testSpecInfo': {
        'id': 5205,
        'testId': 5187,
        'analyteStorageUnitId': 78,
        'analyteId': 73,
        'analyteName': 'FSH',
        'methodId': 63,
        'methodName': 'Chemiluminescence',
        'instrumentId': 3116,
        'instrumentName': 'Alinity i',
        'reagentId': 2240,
        'reagentManufacturerId': null,
        'reagentManufacturerName': 'Abbott',
        'reagentName': 'FSH REF 07P49',
        'reagentLotId': 1551,
        'reagentLotNumber': 'Unspecified ***',
        'reagentLot': {
          'id': 1551,
          'reagentId': 2240,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 34,
        'storageUnitName': 'mIU/mL',
        'calibratorId': 810,
        'calibratorManufacturerId': null,
        'calibratorManufacturerName': 'Abbott',
        'calibratorName': 'FSH Cal REF 07P4901',
        'calibratorLotId': 812,
        'calibratorLotNumber': 'Unspecified ***',
        'calibratorLot': {
          'id': 812,
          'calibratorId': 810,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date()
        }
      },
      'levelSettings': {
        'levelEntityId': null,
        'levelEntityName': null,
        'parentLevelEntityId': null,
        'parentLevelEntityName': null,
        'minNumberOfPoints': 5,
        'runLength': 4,
        'dataType': 1,
        'targets': [
          {
            'controlLotId': '117',
            'controlLevel': '1',
            'mean': 0,
            'sd': 0,
            'points': 0
          },
          {
            'controlLotId': '118',
            'controlLevel': '2',
            'mean': 0,
            'sd': 0,
            'points': 0
          }
        ],
        'rules': [
          {
            'id': '2',
            'category': '1k',
            'k': '3',
            'disposition': 'D'
          },
          {
            'id': '1',
            'category': '1k',
            'k': '2',
            'disposition': 'D'
          }
        ],
        'levels': [
          {
            'levelInUse': true,
            'decimalPlace': 2
          },
          {
            'levelInUse': true,
            'decimalPlace': 2
          }
        ],
        'id': '6b7b8b65-cd5a-4eac-9627-13d0cec3c218',
        'parentNodeId': '6709fa3c-5439-46db-b944-8b47aa5f2c72',
        'parentNode': null,
        'nodeType': 8,
        'displayName': '6b7b8b65-cd5a-4eac-9627-13d0cec3c218',
        'children': null
      },
      'accountSettings': {
        'displayName': '',
        'dataType': 1,
        'instrumentsGroupedByDept': true,
        'trackReagentCalibrator': false,
        'fixedMean': false,
        'decimalPlaces': 2,
        'siUnits': false,
        'labSetupRating': 0,
        'labSetupComments': '',
        'isLabSetupComplete': true,
        'labSetupLastEntityId': 'null',
        'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
        'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        'parentNode': null,
        'nodeType': 9,
        'children': null
      },
      'hasOwnAccountSettings': false,
      'mappedTestSpecs': null,
      'id': '6709fa3c-5439-46db-b944-8b47aa5f2c72',
      'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
      'parentNode': null,
      'nodeType': 6,
      'children': [

      ]
    },
    {
      'displayName': 'Folate',
      'testSpecId': '5238',
      'correlatedTestSpecId': '962F51AC893942CCB91DF80F727D7298',
      'testId': '5220',
      'labUnitId': '52',
      'testSpecInfo': {
        'id': 5238,
        'testId': 5220,
        'analyteStorageUnitId': 75,
        'analyteId': 70,
        'analyteName': 'Folate',
        'methodId': 63,
        'methodName': 'Chemiluminescence',
        'instrumentId': 3116,
        'instrumentName': 'Alinity i',
        'reagentId': 2239,
        'reagentManufacturerId': null,
        'reagentManufacturerName': 'Abbott',
        'reagentName': 'Folate REF 08P14',
        'reagentLotId': 1550,
        'reagentLotNumber': 'Unspecified ***',
        'reagentLot': {
          'id': 1550,
          'reagentId': 2239,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 2,
        'storageUnitName': 'ng/mL',
        'calibratorId': 809,
        'calibratorManufacturerId': null,
        'calibratorManufacturerName': 'Abbott',
        'calibratorName': 'Folate Cal REF 08P1401',
        'calibratorLotId': 811,
        'calibratorLotNumber': 'Unspecified ***',
        'calibratorLot': {
          'id': 811,
          'calibratorId': 809,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date()
        }
      },
      'levelSettings': {
        'levelEntityId': null,
        'levelEntityName': null,
        'parentLevelEntityId': null,
        'parentLevelEntityName': null,
        'minNumberOfPoints': 5,
        'runLength': 4,
        'dataType': 1,
        'targets': [
          {
            'controlLotId': '117',
            'controlLevel': '1',
            'mean': 0,
            'sd': 0,
            'points': 0
          },
          {
            'controlLotId': '118',
            'controlLevel': '2',
            'mean': 0,
            'sd': 0,
            'points': 0
          }
        ],
        'rules': [
          {
            'id': '2',
            'category': '1k',
            'k': '3',
            'disposition': 'D'
          },
          {
            'id': '1',
            'category': '1k',
            'k': '2',
            'disposition': 'D'
          }
        ],
        'levels': [
          {
            'levelInUse': true,
            'decimalPlace': 2
          },
          {
            'levelInUse': true,
            'decimalPlace': 2
          }
        ],
        'id': '3554b3b3-de65-472b-873b-16f6a44ddabe',
        'parentNodeId': '65a159e9-26db-4c95-82be-dac080688421',
        'parentNode': null,
        'nodeType': 8,
        'displayName': '3554b3b3-de65-472b-873b-16f6a44ddabe',
        'children': null
      },
      'accountSettings': {
        'displayName': '',
        'dataType': 1,
        'instrumentsGroupedByDept': true,
        'trackReagentCalibrator': false,
        'fixedMean': false,
        'decimalPlaces': 2,
        'siUnits': false,
        'labSetupRating': 0,
        'labSetupComments': '',
        'isLabSetupComplete': true,
        'labSetupLastEntityId': 'null',
        'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
        'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        'parentNode': null,
        'nodeType': 9,
        'children': null
      },
      'hasOwnAccountSettings': false,
      'mappedTestSpecs': null,
      'id': '65a159e9-26db-4c95-82be-dac080688421',
      'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
      'parentNode': null,
      'nodeType': 6,
      'children': [

      ]
    },
    {
      'displayName': 'LH',
      'testSpecId': '5210',
      'correlatedTestSpecId': '38E3AE307EE24176AB2BBC80E09F400A',
      'testId': '5192',
      'labUnitId': '75',
      'testSpecInfo': {
        'id': 5210,
        'testId': 5192,
        'analyteStorageUnitId': 112,
        'analyteId': 112,
        'analyteName': 'LH',
        'methodId': 63,
        'methodName': 'Chemiluminescence',
        'instrumentId': 3116,
        'instrumentName': 'Alinity i',
        'reagentId': 2246,
        'reagentManufacturerId': null,
        'reagentManufacturerName': 'Abbott',
        'reagentName': 'LH REF 07P91',
        'reagentLotId': 1557,
        'reagentLotNumber': 'Unspecified ***',
        'reagentLot': {
          'id': 1557,
          'reagentId': 2246,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 34,
        'storageUnitName': 'mIU/mL',
        'calibratorId': 816,
        'calibratorManufacturerId': null,
        'calibratorManufacturerName': 'Abbott',
        'calibratorName': 'LH Cal REF 07P9101',
        'calibratorLotId': 818,
        'calibratorLotNumber': 'Unspecified ***',
        'calibratorLot': {
          'id': 818,
          'calibratorId': 816,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date()
        }
      },
      'levelSettings': {
        'levelEntityId': null,
        'levelEntityName': null,
        'parentLevelEntityId': null,
        'parentLevelEntityName': null,
        'minNumberOfPoints': 5,
        'runLength': 4,
        'dataType': 1,
        'targets': [
          {
            'controlLotId': '117',
            'controlLevel': '1',
            'mean': 0,
            'sd': 0,
            'points': 0
          },
          {
            'controlLotId': '118',
            'controlLevel': '2',
            'mean': 0,
            'sd': 0,
            'points': 0
          }
        ],
        'rules': [
          {
            'id': '2',
            'category': '1k',
            'k': '3',
            'disposition': 'D'
          },
          {
            'id': '1',
            'category': '1k',
            'k': '2',
            'disposition': 'D'
          }
        ],
        'levels': [
          {
            'levelInUse': true,
            'decimalPlace': 2
          },
          {
            'levelInUse': true,
            'decimalPlace': 2
          }
        ],
        'id': '8910f587-25d2-438f-a9ec-c7ffb534092f',
        'parentNodeId': 'fa935019-60e8-4447-9d23-aa7fd9c62be4',
        'parentNode': null,
        'nodeType': 8,
        'displayName': '8910f587-25d2-438f-a9ec-c7ffb534092f',
        'children': null
      },
      'accountSettings': {
        'displayName': '',
        'dataType': 1,
        'instrumentsGroupedByDept': true,
        'trackReagentCalibrator': false,
        'fixedMean': false,
        'decimalPlaces': 2,
        'siUnits': false,
        'labSetupRating': 0,
        'labSetupComments': '',
        'isLabSetupComplete': true,
        'labSetupLastEntityId': 'null',
        'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
        'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        'parentNode': null,
        'nodeType': 9,
        'children': null
      },
      'hasOwnAccountSettings': false,
      'mappedTestSpecs': null,
      'id': 'fa935019-60e8-4447-9d23-aa7fd9c62be4',
      'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
      'parentNode': null,
      'nodeType': 6,
      'children': [

      ]
    },
    {
      'displayName': 'Prolactin',
      'testSpecId': '5200',
      'correlatedTestSpecId': 'BB76D4286A6A49E3A3B59E3B2D2FA840',
      'testId': '5182',
      'labUnitId': '2',
      'testSpecInfo': {
        'id': 5200,
        'testId': 5182,
        'analyteStorageUnitId': 275,
        'analyteId': 341,
        'analyteName': 'Prolactin',
        'methodId': 63,
        'methodName': 'Chemiluminescence',
        'instrumentId': 3116,
        'instrumentName': 'Alinity i',
        'reagentId': 2251,
        'reagentManufacturerId': null,
        'reagentManufacturerName': 'Abbott',
        'reagentName': 'Prolactin REF 07P66',
        'reagentLotId': 1562,
        'reagentLotNumber': 'Unspecified ***',
        'reagentLot': {
          'id': 1562,
          'reagentId': 2251,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date(),
          'reagentCategory': 1
        },
        'storageUnitId': 2,
        'storageUnitName': 'ng/mL',
        'calibratorId': 821,
        'calibratorManufacturerId': null,
        'calibratorManufacturerName': 'Abbott',
        'calibratorName': 'Prolactin Cal REF 07P6601',
        'calibratorLotId': 823,
        'calibratorLotNumber': 'Unspecified ***',
        'calibratorLot': {
          'id': 823,
          'calibratorId': 821,
          'lotNumber': 'Unspecified ***',
          'shelfExpirationDate': new Date()
        }
      },
      'levelSettings': {
        'levelEntityId': null,
        'levelEntityName': null,
        'parentLevelEntityId': null,
        'parentLevelEntityName': null,
        'minNumberOfPoints': 5,
        'runLength': 4,
        'dataType': 1,
        'targets': [
          {
            'controlLotId': '117',
            'controlLevel': '1',
            'mean': 0,
            'sd': 0,
            'points': 0
          },
          {
            'controlLotId': '118',
            'controlLevel': '2',
            'mean': 0,
            'sd': 0,
            'points': 0
          }
        ],
        'rules': [
          {
            'id': '2',
            'category': '1k',
            'k': '3',
            'disposition': 'D'
          },
          {
            'id': '1',
            'category': '1k',
            'k': '2',
            'disposition': 'D'
          }
        ],
        'levels': [
          {
            'levelInUse': true,
            'decimalPlace': 2
          },
          {
            'levelInUse': true,
            'decimalPlace': 2
          }
        ],
        'id': 'df033e8f-18d8-4224-8ee7-1e30dd3a4fbe',
        'parentNodeId': 'c18dc897-dc48-420a-a0b6-e884a6e81a7f',
        'parentNode': null,
        'nodeType': 8,
        'displayName': 'df033e8f-18d8-4224-8ee7-1e30dd3a4fbe',
        'children': null
      },
      'accountSettings': {
        'displayName': '',
        'dataType': 1,
        'instrumentsGroupedByDept': true,
        'trackReagentCalibrator': false,
        'fixedMean': false,
        'decimalPlaces': 2,
        'siUnits': false,
        'labSetupRating': 0,
        'labSetupComments': '',
        'isLabSetupComplete': true,
        'labSetupLastEntityId': 'null',
        'id': 'dc889c46-f310-4662-8c80-147fac28ecad',
        'parentNodeId': 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
        'parentNode': null,
        'nodeType': 9,
        'children': null
      },
      'hasOwnAccountSettings': false,
      'mappedTestSpecs': null,
      'id': 'c18dc897-dc48-420a-a0b6-e884a6e81a7f',
      'parentNodeId': '1628ad45-c0b4-4708-8ad0-e448628820fe',
      'parentNode': null,
      'nodeType': 6,
      'children': [

      ]
    }
  ];

  const levelItemObject = {
    'isFormDirty': false,
    'isFormChanged': false,
    'isFormValid': false,
    'level': 2,
    'entityId': '11111111-1111-1111-1111-111111111111'
  };

  const mockNavSideBarService = {
    getSideBarItems: (itemList) => {
      if (itemList.length === 5) {
        return mockDisplayList;
      } else {
        return mockControlDisplayList;
      }
    }
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
      declarations: [
        EvaluationMeanSdComponent,
        LevelEvaluationMeanSdComponent,
        UnityRestrictDecimalPlacesDirective
      ],
      imports: [
        PerfectScrollbarModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatIconModule,
        HttpClientModule,
        StoreModule.forRoot(appState),
        BrInfoTooltip,
        BrCore,
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
        { provide: NavSideBarService, useValue: mockNavSideBarService },
        { provide: MatDialogRef, useValue: mockMatRefProvider },
        { provide: ChangeTrackerService, useValue: mockChangeTrackerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
        TranslateService,
        HttpClient
      ]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationMeanSdComponent);
    component = fixture.componentInstance;
    component.entity = entity;
    component.analyteList = analyteList;
    component.isArraySorted = true;
    component.analyteForNamingList = analyteForNamingList;
    component.analyteEvaluationMeanSdGroup = analyteEvaluationMeanSdGroup;
    component.analyteFloatingStatisticsGroup = analyteFloatingStatisticsGroup;
    component.analyteFloatingStatisticsData = analyteFloatingStatisticsGroup;
    component.showControlLotInfo = true;
    fixture.detectChanges();
  });

  it('should emit form values when the button is clicked', () => {
    component.displayPaginationFlag = true;
    component.analyteEvaluationMeanSdGroup[0].entityId = '1628ad45-c0b4-4708-8ad0-e448628820fe';
    component.analyteEvaluationMeanSdGroup[0].isPost = true;
    component.analyteEvaluationMeanSdGroup[0].parentMasterLotId = 1111;
    const spy = spyOn(component.entityEvaluationMeanSdGroup, 'emit');
    component.evaluationForm.controls['floatPoint'].setValue('77');
    component.evaluationForm.markAsDirty();
    expect(component.evaluationForm.valid).toBeTruthy();
    component.levelEvaluationMeanSdData[0] = component.evaluationForm.value;
    component.levelEvaluationMeanSdData[0].entityId = component.entity.id;
    const analyteDataToSave = new AnalyteEvaluationMeanSd();
    analyteDataToSave.entityId = component.entity.id;
    analyteDataToSave.levelEvaluationMeanSds = component.levelEvaluationMeanSdData;
    analyteDataToSave.parentEntityId = component.entity.id;
    analyteDataToSave.isPost = component.analyteEvaluationMeanSdGroup[0].isPost;
    analyteDataToSave.parentMasterLotId = component.analyteEvaluationMeanSdGroup[0].parentMasterLotId;
    const analytesDataToSave = [];
    analytesDataToSave.push({ ...analyteDataToSave });
    component.analyteIdsChunkList = [component.analyteIdsChunkList[0], component.analyteIdsChunkList[0]];
    component.displayAnalyteTitleListChunk = [component.displayAnalyteTitleListChunk[0], component.displayAnalyteTitleListChunk[0]];
    fixture.detectChanges();
    const updateButton = fixture.debugElement.nativeElement.querySelector('#spec_updateButton');
    updateButton.click();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalledWith(analytesDataToSave);
    });
  });


  it('should navigate back if clicked on back button', () => {
    const spy = spyOn(component, 'back').and.callThrough();
    component.selectedPage = 1;
    fixture.detectChanges();
    const backButton = fixture.debugElement.nativeElement.querySelector('#spec_backButton');
    backButton.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should emit floatingStatistcs when the FloatingStatistcs toggle button gets active', () => {
    const event = {};
    const spy = spyOn(component.requestFloatingSatistics, 'emit');
    component.evaluationForm.controls['floatingStatistcsFlag'].setValue(true);
    component.toggleFloatingStatistcs(event);
    component.evaluationForm.markAsDirty();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should displays 5 analytes of a control at a time', () => {
    const analyteItemList = fixture.debugElement.nativeElement.querySelector('#spec_analyteList');
    expect(analyteItemList.childElementCount).toEqual(5);
  });

  it(`should displays the “You are about to lose changes.” prompt at the top of the dialog
    if there are pending changes and the user attempts to navigate away`, () => {
    component.evaluationForm.controls['floatPoint'].setValue('22');
    expect(component.evaluationForm.valid).toBeTruthy();
    const cancelButton = fixture.debugElement.nativeElement.querySelector('.spec-close-button');
    cancelButton.click();
    fixture.detectChanges();
    const warningBox = fixture.debugElement.nativeElement.querySelector('#spec_warningBox');
    expect(warningBox).not.toBeNull();
  });

  it('should properly disables the update buttons based on input and valid values.', () => {
    component.evaluationForm.controls['floatPoint'].setValue('666');
    component.evaluationForm.markAsDirty();
    expect(component.evaluationForm.valid).toBeFalsy();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const updateButton = fixture.debugElement.nativeElement.querySelector('#spec_updateButton');
      expect(updateButton.disabled).toBeTruthy();
    });
  });

  it('should properly enables the update buttons based on input and valid values.', () => {
    component.evaluationForm.controls['floatPoint'].setValue('55');
    component.evaluationForm.markAsDirty();
    expect(component.evaluationForm.valid).toBeTruthy();
    fixture.detectChanges();
    const updateButton = fixture.debugElement.nativeElement.querySelector('#spec_updateButton');
    expect(updateButton.disabled).toBeFalsy();
  });

  it('should displays the selected control or analyte name properly', () => {
    const spec_primaryText = fixture.debugElement.nativeElement.querySelector('#spec_primaryText');
    const spec_additionalText = fixture.debugElement.nativeElement.querySelector('#spec_additionalText');
    const spec_analytePrimaryText = fixture.debugElement.nativeElement.querySelector('#spec_analytePrimaryText0');
    expect(spec_primaryText.textContent).toBe('Assayed Chemistry');
    expect(spec_additionalText.textContent).toBe('( Lot 26440)');
    expect(spec_analytePrimaryText.textContent).toBe(' Cortisol');
  });

  it('ensure that checkChildFormValid function performing certain activities', () => {
    component.checkChildFormValid(levelItemObject);
    fixture.whenStable().then(() => {
      expect(component.isChildFormValid).toBe(true);
      expect(component.isChildFormChanged).toBe(false);
    });
  });

  it('should create  displays the LevelFixedMeanSdComponent for a selected analyte', () => {
    component.entity = analyteList[0];
    component.analyteList = [analyteList[0]];
    component.analyteForNamingList = [analyteForNamingList[2]];
    component.ngOnInit();
    const levelEvaluationMeanSd = fixture.debugElement.nativeElement.querySelector('#spec_levelEvaluationMeanSd');
    expect(levelEvaluationMeanSd.childElementCount).toEqual(3);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit form values when the button is clicked when on analyte page', () => {
    component.entity = analyteList[0];
    component.analyteList = [analyteList[0]];
    component.analyteForNamingList = [analyteForNamingList[2]];
    component.analyteEvaluationMeanSdGroup[0].entityId = component.entity.id;
    component.ngOnInit();
    const spy = spyOn(component.entityEvaluationMeanSdGroup, 'emit');
    component.evaluationForm.controls['floatPoint'].setValue('77');
    component.evaluationForm.markAsDirty();
    expect(component.evaluationForm.valid).toBeTruthy();
    component.levelEvaluationMeanSdData[0] = component.evaluationForm.value;
    component.levelEvaluationMeanSdData[0].entityId = component.entity.id;
    const analyteDataToSave = new AnalyteEvaluationMeanSd();
    analyteDataToSave.entityId = component.entity.id;
    analyteDataToSave.levelEvaluationMeanSds = component.levelEvaluationMeanSdData;
    analyteDataToSave.parentEntityId = component.entity.id;
    const analytesDataToSave = [];
    analytesDataToSave.push({ ...analyteDataToSave });
    fixture.detectChanges();
    const updateButton = fixture.debugElement.nativeElement.querySelector('#spec_updateButton');
    updateButton.click();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

});
