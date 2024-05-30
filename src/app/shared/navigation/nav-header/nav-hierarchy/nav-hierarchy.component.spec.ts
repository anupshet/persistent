// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { Autofixture } from 'ts-autofixture/dist/src';

import { EntityInfo } from '../../../../contracts/models/data-management/entity-info.model';
import { LabLocation, TreePill } from '../../../../contracts/models/lab-setup';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { NavigationService } from '../../navigation.service';
import { NavHierarchyComponent } from './nav-hierarchy.component';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import { UserRole } from '../../../../contracts/enums/user-role.enum';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { ConfirmNavigateGuard } from '../../../../master/reporting/shared/guard/confirm-navigate.guard';
import { HttpLoaderFactory } from '../../../../app.module';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';

describe('NavHierarchyComponent', () => {
  let component: NavHierarchyComponent;
  let fixture: ComponentFixture<NavHierarchyComponent>;
  const State = [];
  let de: DebugElement;
  const mockTranslationService = {
    getTranslatedMessage: () => {
    },
  };
  class MockRouter {
    navigateByUrl = jasmine.createSpy('navigate');
    public ne = new NavigationEnd(0, 'http://localhost:4200', 'http://localhost:4200');
    public events = new Observable(observer => {
      observer.next(this.ne);
      observer.complete();
    });
  }
  const breadcrumbListData: Array<TreePill> = [
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
          children: null
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
    },
    {
      'displayName': 'Acetaminophen',
      'levelSettings': {
        'levelEntityId': null,
        'levelEntityName': 'LevelSetting',
        'parentLevelEntityId': 'bbf00a59-b750-4014-b3e5-4a989855babb',
        'parentLevelEntityName': 'LabTest',
        'minNumberOfPoints': 0,
        'runLength': 0,
        'dataType': 1,
        'targets': null,
        'rules': null,
        'levels': [
          {
            'levelInUse': true,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          }
        ],
        'id': '6ebb5ec9-5cf3-3659-01b4-302f29b73087',
        'parentNodeId': 'bbf00a59-b750-4014-b3e5-4a989855babb',
        'parentNode': null,
        'nodeType': EntityType.LabTest,
        'displayName': '6ebb5ec9-5cf3-3659-01b4-302f29b73087',
        'children': null
      },
      'accountSettings': null,
      'hasOwnAccountSettings': false,
      'id': 'bbf00a59-b750-4014-b3e5-4a989855babb',
      'parentNodeId': 'a16a5eec-774f-4006-b0e8-7761ecabf509',
      'nodeType': 6,
      'children': [],
      'isUnavailable': false,
      'unavailableReasonCode': 'null'
    }
  ];

  const breadcrumbPanelListData: Array<TreePill> = [
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
          children: null
        }
      ]
    },
    {
      'id': '12344',
      'children': [],
      'nodeType': 10,
      'parentNodeId': 'abc123',
      'displayName': 'Daily Test1'
    },
    {
      'displayName': 'Acetaminophen',
      'levelSettings': {
        'levelEntityId': null,
        'levelEntityName': 'LevelSetting',
        'parentLevelEntityId': 'bbf00a59-b750-4014-b3e5-4a989855babb',
        'parentLevelEntityName': 'LabTest',
        'minNumberOfPoints': 0,
        'runLength': 0,
        'dataType': 1,
        'targets': null,
        'rules': null,
        'levels': [
          {
            'levelInUse': true,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          },
          {
            'levelInUse': false,
            'decimalPlace': 2
          }
        ],
        'id': '6ebb5ec9-5cf3-3659-01b4-302f29b73087',
        'parentNodeId': 'bbf00a59-b750-4014-b3e5-4a989855babb',
        'parentNode': null,
        'nodeType': EntityType.LabTest,
        'displayName': '6ebb5ec9-5cf3-3659-01b4-302f29b73087',
        'children': null
      },
      'accountSettings': null,
      'hasOwnAccountSettings': false,
      'id': 'bbf00a59-b750-4014-b3e5-4a989855babb',
      'parentNodeId': 'a16a5eec-774f-4006-b0e8-7761ecabf509',
      'nodeType': 6,
      'children': [],
      'isUnavailable': false,
      'unavailableReasonCode': 'null'
    }
  ];


const selectedNodeData: LabLocation = {
  displayName: 'vs\'s Lab',
  labLocationName: 'vs\'s Lab',
  locationTimeZone: 'America/Los_Angeles',
  locationOffset: '-08:00:00',
  locationDayLightSaving: '00:00:00',
  labLocationContactId: '52a79ee7-fa7b-41be-afc8-e665cf8aa2dc',
  labLocationAddressId: '735c5975-be30-4156-849c-3ecb6e729484',
  labLocationContact: {
    entityType: 0,
    searchAttribute: 'vishwajit_shinde+dev21@bio-rad.com',
    firstName: 'Vishwajit',
    middleName: '',
    lastName: 'Shinde',
    name: 'Vishwajit Shinde',
    email: 'vishwajit_shinde+dev21@bio-rad.com',
    phone: '',
    id: '52a79ee7-fa7b-41be-afc8-e665cf8aa2dc',
    featureInfo: {
      uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
    }
  },
  contactRoles: [UserRole.LabSupervisor],
  labLocationAddress: {
    entityType: 1,
    searchAttribute: '',
    nickName: '',
    streetAddress1: 'Rajiv Gandhi IT Park',
    streetAddress2: '',
    streetAddress3: '',
    streetAddress: 'Rajiv Gandhi IT Park',
    suite: '',
    city: 'Irvine',
    state: 'CA',
    country: 'IN',
    zipCode: '92620',
    id: '735c5975-be30-4156-849c-3ecb6e729484',
    featureInfo: {
      uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
    }
  },
  accountSettings: null,
  hasOwnAccountSettings: false,
  id: 'ce701493-5dcf-48ad-b891-09344a179527',
  parentNodeId: '120268b4-2e63-4fff-8a95-eeb1e1d67e57',
  parentNode: null,
  nodeType: 2,
  children: null,
  previousContactUserId: null
};
const navigationState = {
  selectedNode: selectedNodeData,
  selectedLeaf: {},
  currentBranch: breadcrumbListData,
  error: {},
  isSideNavExpanded: false,
  showSettings: false
};
const state = {
  security: {
    isLoggedIn: true,
    currentUser: {
      labId: '1',
      firstName: 'first',
      lastName: 'last',
      email: 'user@bio-rad.com',
      userId: '112233',
      accountNumber: '123456789',
      labLocationId: '1234',
      accountId: '123456789',
      roles: ['LabSupervisor', 'LeadTechnician', 'Technician'],
      userOktaId: 'fake id',
      accessToken: {
        tokenType: 'Bearer',
      },
      userName: '',
      displayName: '',
      permissions: [],
      userData: null,
      labLocationIds: null,
      accountNumberArray: null,
      id: ''
    },
    directory: null
  },
  department: null,
  instrument: null,
  connectivity: null,
  router: null,
  navigation: navigationState
};
const account = {
  currentAccountSummary: {
    migrationStatus: ''
  }
};
const router = {
  state: {
    url: '/login',
    params: {},
    queryParams: {}
  },
  navigationId: 1
};
const stub = {
  security: state.security,
  auth: null,
  userPreference: null,
  router: router,
  navigation: navigationState,
  location: null,
  account: account,
  uiConfigState: null
};
const mockNavigationService = {
  navigateToDepartmentSettings: () => { }
};

const mockConfirmNavigateGuard = {
  canDeactivate:     () => { },
  openGenericDialog: () => { },
  confirmationModal: () => { },
};

const autofixture = new Autofixture();
const testData = autofixture.create(new EntityInfo());
const ApiServiceStub = {
  get: (number): Observable<any> => {
    return of(testData);
  }
};
const mockErrorLoggerService = {
  logErrorToBackend: (error: BrError) => { },
  populateErrorObject: () => {
    return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
  }
};
let breadcrumbElement;

beforeEach(async(() => {
  TestBed.configureTestingModule({
    imports: [
      MatIconModule,
      HttpClientModule,
      MatTooltipModule,
      StoreModule.forRoot(State),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
    ],
    declarations: [NavHierarchyComponent, TruncatePipe],
    providers: [
      TranslateService,
      { provide: PortalApiService, useValue: ApiServiceStub },
      { provide: NavigationService, useValue: mockNavigationService },
      { provide: Store, useValue: stub },
      { provide: Router, useClass: MockRouter },
      provideMockStore({ initialState: stub }),
      { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
      { provide: ConfirmNavigateGuard, useValue: mockConfirmNavigateGuard },
    ]
  })
    .compileComponents();
  fixture = TestBed.createComponent(NavHierarchyComponent);
  component = fixture.componentInstance;
}));

beforeEach(() => {
  fixture = TestBed.createComponent(NavHierarchyComponent);
  component = fixture.componentInstance;
  de = fixture.debugElement;
  fixture.detectChanges();
});

it('should create', () => {
  expect(component).toBeTruthy();
});

it('breadcrumb should not have one nodes or null value, display error in the template', () => {
  component.breadcrumbList = breadcrumbListData;
  fixture.detectChanges();
  breadcrumbElement = de.nativeElement.querySelector('.spec_breadcrumb');
  expect(breadcrumbElement.childElementCount).not.toBe(1);
  expect(breadcrumbElement.childElementCount).not.toBe(0);
  expect(breadcrumbElement.childElementCount).not.toBe(null);
});
it('breadcrumb should have tow nodes (location and department), display them in the template', () => {
  component.breadcrumbList = breadcrumbListData.slice(0, 2);
  fixture.detectChanges();
  breadcrumbElement = fixture.debugElement.nativeElement.querySelector('.spec_breadcrumb');
  expect(breadcrumbElement.childElementCount).toBe(2);
});
it('breadcrumb should have three nodes (location, department, and instrument), display them in the template', () => {
  component.breadcrumbList = breadcrumbListData.slice(0, 3);
  fixture.detectChanges();
  breadcrumbElement = fixture.debugElement.nativeElement.querySelector('.spec_breadcrumb');
  expect(breadcrumbElement.childElementCount).toBe(3);
});
it('breadcrumb should have four nodes (location, department, instrument, and product), display them in the template', () => {
  component.breadcrumbList = breadcrumbListData.slice(0, 4);
  fixture.detectChanges();
  breadcrumbElement = fixture.debugElement.nativeElement.querySelector('.spec_breadcrumb');
  expect(breadcrumbElement.childElementCount).toBe(4);
});
it('breadcrumb should have five nodes (location, department, instrument, product, and test), display them in the template', () => {
  component.breadcrumbList = breadcrumbListData;
  fixture.detectChanges();
  breadcrumbElement = fixture.debugElement.nativeElement.querySelector('.spec_breadcrumb');
  expect(breadcrumbElement.childElementCount).toBe(5);
});

it('breadcrumb should have two nodes when at the Panel level (location and panel), display them in the template', () => {
  component.breadcrumbList = breadcrumbPanelListData.slice(0, 2);
  fixture.detectChanges();
  breadcrumbElement = fixture.debugElement.nativeElement.querySelector('.spec_breadcrumb');
  expect(breadcrumbElement.childElementCount).toBe(2);
});

it('breadcrumb should have three nodes when at analytes under Panel (location, panel and analyte), display them in the template', () => {
  component.breadcrumbList = breadcrumbPanelListData;
  fixture.detectChanges();
  breadcrumbElement = fixture.debugElement.nativeElement.querySelector('.spec_breadcrumb');
  expect(breadcrumbElement.childElementCount).toBe(3);
});
});
