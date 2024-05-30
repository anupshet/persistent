// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { inject, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { NgReduxTestingModule } from '@angular-redux/store/lib/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';

import { PortalApiService } from '../api/portalApi.service';
import { NavigationService } from './navigation.service';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { EntityTypeService } from '../services/entity-type.service';
import { TreePill } from '../../contracts/models/lab-setup';
import { ActionType } from '../../contracts/enums/action-type.enum';
import { UserRole } from '../../contracts/enums/user-role.enum';
import { NavigationState } from './state/reducers/navigation.reducer';
import { BrPermissionsService } from '../../security/services/permissions.service';

const mockEntityTypeService = {
  getNodeTypeUrl: () => '',
  getLabSetupUrl: () => ''
};

const mockLocation = {
  replaceState: () => { }
};

const mockBrPermissionsService = {
  hasAccess: () => { },
};

describe('NavigationService', () => {
  let navigation: NavigationService;
  let router: Router;
  let store: MockStore<any>;
  const selectedNodeChildrenSorted = [
    {
      'displayName': 'New Mexico 1',
      'id': 'fake id',
      'labLocationAddress': '',
      'labLocationAddressId': '',
      'labLocationContact': '',
      'labLocationContactId': '',
      'labLocationName': 'New Mexico',
      'locationDayLightSaving': false,
      'locationOffset': 0,
      'locationTimeZone': 'Asia/Calcutta',
      'nodeType': 5,
      'parentNode': null,
      'parentNodeId': '',
      'children': []
    },
    {
      'displayName': 'New Mexico 2',
      'id': 'fake-id',
      'labLocationAddress': '',
      'labLocationAddressId': '',
      'labLocationContact': '',
      'labLocationContactId': '',
      'labLocationName': 'New Mexico',
      'locationDayLightSaving': false,
      'locationOffset': 0,
      'locationTimeZone': 'Asia/Calcutta',
      'nodeType': 6,
      'parentNode': null,
      'parentNodeId': '',
      'children': []
    }
  ];
  const selectedNodeChildren = [
    {
      'displayName': 'New Mexico 2',
      'id': 'fake-id',
      'labLocationAddress': '',
      'labLocationAddressId': '',
      'labLocationContact': '',
      'labLocationContactId': '',
      'labLocationName': 'New Mexico',
      'locationDayLightSaving': false,
      'locationOffset': 0,
      'locationTimeZone': 'Asia/Calcutta',
      'nodeType': 6,
      'parentNode': null,
      'parentNodeId': '',
      'children': []
    },
    {
      'displayName': 'New Mexico 1',
      'id': 'fake id',
      'labLocationAddress': '',
      'labLocationAddressId': '',
      'labLocationContact': '',
      'labLocationContactId': '',
      'labLocationName': 'New Mexico',
      'locationDayLightSaving': false,
      'locationOffset': 0,
      'locationTimeZone': 'Asia/Calcutta',
      'nodeType': 5,
      'parentNode': null,
      'parentNodeId': '',
      'children': []
    }
  ];
  const currentBranch = [
    {
      displayName: 'Vishwajit\'s Lab',
      labLocationName: 'Vishwajit\'s Lab',
      locationTimeZone: 'America/New_York',
      locationOffset: '-05:00:00',
      locationDayLightSaving: '00:00:00',
      labLocationContactId: '05c1be86-ad8d-4937-a834-2369bec4604e',
      labLocationAddressId: '1d196092-3052-41fa-9110-b95aae0a048e',
      labLocationContact: {
        entityType: 0,
        searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
        firstName: 'Vishwajit',
        middleName: '',
        lastName: 'Shinde',
        name: 'Vishwajit Shinde',
        email: 'vishwajit_shinde+dev20@bio-rad.com',
        phone: '',
        id: '05c1be86-ad8d-4937-a834-2369bec4604e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
        }
      },
      labLocationAddress: {
        entityType: 1,
        searchAttribute: '',
        nickName: '',
        streetAddress1: '21 Technology Drive',
        streetAddress2: '',
        streetAddress3: '',
        streetAddress: '21 Technology Drive',
        suite: '',
        city: '',
        state: '',
        country: 'US',
        zipCode: '',
        id: '1d196092-3052-41fa-9110-b95aae0a048e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
        }
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
      id: '0d66767b-612c-4254-9eed-3a7ab393029f',
      parentNodeId: '5340ad39-3d2f-473e-a940-d27e8dbac1af',
      parentNode: null,
      nodeType: 2,
      children: [
        {
          displayName: 'Vishwajit Dept',
          departmentName: 'Vishwajit Dept',
          departmentManagerId: '05c1be86-ad8d-4937-a834-2369bec4604e',
          departmentManager: {
            entityType: 0,
            searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
            firstName: 'Vishwajit',
            middleName: '',
            lastName: 'Shinde',
            name: 'Vishwajit Shinde',
            email: 'vishwajit_shinde+dev20@bio-rad.com',
            phone: '',
            id: '05c1be86-ad8d-4937-a834-2369bec4604e',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
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
            nodeType: 8,
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
          parentNode: null,
          nodeType: 3,
          children: null
        }
      ]
    },
    {
      displayName: 'Vishwajit Dept',
      departmentName: 'Vishwajit Dept',
      departmentManagerId: '05c1be86-ad8d-4937-a834-2369bec4604e',
      departmentManager: {
        entityType: 0,
        searchAttribute: 'vishwajit_shinde+dev20@bio-rad.com',
        firstName: 'Vishwajit',
        middleName: '',
        lastName: 'Shinde',
        name: 'Vishwajit Shinde',
        email: 'vishwajit_shinde+dev20@bio-rad.com',
        phone: '',
        id: '05c1be86-ad8d-4937-a834-2369bec4604e',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
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
        nodeType: 8,
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
      parentNode: null,
      nodeType: 3,
      children: [
        {
          displayName: 'Instrument',
          instrumentId: '1497',
          instrumentCustomName: 'Instrument',
          instrumentSerial: '',
          instrumentInfo: {
            id: 1497,
            name: 'ARCHITECT c4000',
            manufacturerId: 1,
            manufacturerName: 'Abbott'
          },
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
            nodeType: 8,
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
          parentNode: null,
          nodeType: 4,
          children: [],
          lotNumber: 'ARCHITECT c4000',
          lotInfo: 'Instrument'
        }
      ]
    },
    {
      displayName: 'Instrument',
      instrumentId: '1497',
      instrumentCustomName: 'Instrument',
      instrumentSerial: '',
      instrumentInfo: {
        id: 1497,
        name: 'ARCHITECT c4000',
        manufacturerId: 1,
        manufacturerName: 'Abbott'
      },
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
        nodeType: 8,
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
      parentNode: null,
      nodeType: 4,
      children: [
        {
          displayName: 'Assayed Chemistry',
          productId: '2',
          productMasterLotId: '69',
          productCustomName: '',
          productInfo: {
            id: 2,
            name: 'Assayed Chemistry',
            manufacturerId: 2,
            manufacturerName: 'Bio-Rad',
            matrixId: 3,
            matrixName: 'Serum'
          },
          lotInfo: {
            id: 69,
            productId: 2,
            productName: 'Assayed Chemistry',
            lotNumber: '23000',
            expirationDate: '2020-12-31T00:00:00'
          },
          productLotLevels: [
            {
              id: '105',
              productMasterLotId: '69',
              productId: '2',
              productMasterLotNumber: '23000',
              lotNumber: '23001',
              level: 1,
              levelDescription: '1'
            },
            {
              id: '106',
              productMasterLotId: '69',
              productId: '2',
              productMasterLotNumber: '23000',
              lotNumber: '23002',
              level: 2,
              levelDescription: '2'
            },
            {
              id: '107',
              productMasterLotId: '69',
              productId: '2',
              productMasterLotNumber: '23000',
              lotNumber: '23003',
              level: 3,
              levelDescription: '3'
            },
            {
              id: '108',
              productMasterLotId: '69',
              productId: '2',
              productMasterLotNumber: '23000',
              lotNumber: '23004',
              level: 4,
              levelDescription: '4'
            },
            {
              id: '109',
              productMasterLotId: '69',
              productId: '2',
              productMasterLotNumber: '23000',
              lotNumber: '23005',
              level: 5,
              levelDescription: '5'
            },
            {
              id: '110',
              productMasterLotId: '69',
              productId: '2',
              productMasterLotNumber: '23000',
              lotNumber: '23006',
              level: 6,
              levelDescription: '6'
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
            nodeType: 8,
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
          parentNode: null,
          nodeType: 5,
          children: [],
          lotNumber: ' Lot 23000'
        }
      ]
    },
    {
      displayName: 'Assayed Chemistry',
      productId: '2',
      productMasterLotId: '69',
      productCustomName: '',
      productInfo: {
        id: 2,
        name: 'Assayed Chemistry',
        manufacturerId: 2,
        manufacturerName: 'Bio-Rad',
        matrixId: 3,
        matrixName: 'Serum'
      },
      lotInfo: {
        id: 69,
        productId: 2,
        productName: 'Assayed Chemistry',
        lotNumber: '23000',
        expirationDate: '2020-12-31T00:00:00'
      },
      productLotLevels: [
        {
          id: '105',
          productMasterLotId: '69',
          productId: '2',
          productMasterLotNumber: '23000',
          lotNumber: '23001',
          level: 1,
          levelDescription: '1'
        },
        {
          id: '106',
          productMasterLotId: '69',
          productId: '2',
          productMasterLotNumber: '23000',
          lotNumber: '23002',
          level: 2,
          levelDescription: '2'
        },
        {
          id: '107',
          productMasterLotId: '69',
          productId: '2',
          productMasterLotNumber: '23000',
          lotNumber: '23003',
          level: 3,
          levelDescription: '3'
        },
        {
          id: '108',
          productMasterLotId: '69',
          productId: '2',
          productMasterLotNumber: '23000',
          lotNumber: '23004',
          level: 4,
          levelDescription: '4'
        },
        {
          id: '109',
          productMasterLotId: '69',
          productId: '2',
          productMasterLotNumber: '23000',
          lotNumber: '23005',
          level: 5,
          levelDescription: '5'
        },
        {
          id: '110',
          productMasterLotId: '69',
          productId: '2',
          productMasterLotNumber: '23000',
          lotNumber: '23006',
          level: 6,
          levelDescription: '6'
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
        nodeType: 8,
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
      parentNode: null,
      nodeType: 5,
      children: [
        {
          displayName: 'Albumin',
          testSpecId: '1797',
          correlatedTestSpecId: '987B78E6E11F48A1B2A2ECAF8D968B81',
          testId: '1792',
          labUnitId: '15',
          testSpecInfo: {
            id: 1797,
            testId: 1792,
            analyteStorageUnitId: 3,
            analyteId: 7,
            analyteName: 'Albumin',
            methodId: 583,
            methodName: 'Bromcresol Green (BCG)',
            instrumentId: 1497,
            instrumentName: 'ARCHITECT c4000',
            reagentId: 1108,
            reagentManufacturerId: null,
            reagentManufacturerName: 'Abbott',
            reagentName: 'AlbG REF 7D53-23',
            reagentLotId: 419,
            reagentLotNumber: 'Unspecified ***',
            reagentLot: {
              id: 419,
              reagentId: 1108,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-16T17:50:46.477'
            },
            storageUnitId: 15,
            storageUnitName: 'g/dL',
            calibratorId: 258,
            calibratorManufacturerId: null,
            calibratorManufacturerName: 'Abbott',
            calibratorName: 'Multiconstituent Cal REF 1E65',
            calibratorLotId: 259,
            calibratorLotNumber: 'Unspecified ***',
            calibratorLot: {
              id: 259,
              calibratorId: 258,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-16T17:50:46.4'
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
            nodeType: 8,
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
          mappedTestSpecs: null,
          id: '5e180f9d-7261-477a-bd5a-57bb12a1424d',
          parentNodeId: '36189279-e4a8-493a-b3a6-ef5c7e879272',
          parentNode: null,
          nodeType: 6,
          children: []
        }
      ]
    }
  ];
  const selectedNode = {
    displayName: 'control 1 edited',
    productId: '391',
    productCustomName: 'control 1 edited',
    id: '5bb2fab0-6358-412e-b606-3636c4fc0b84',
    parentNodeId: '4c85f20c-b507-4f82-8f78-1cc5c14f3e51',
    nodeType: 5,
    children: [
      {
        displayName: 'IgE',
        id: 'af56e051-3717-4b52-9244-cadf33d6e724',
        parentNodeId: '5bb2fab0-6358-412e-b606-3636c4fc0b84',
        nodeType: 6,
        children: []
      }
    ]
  };
  const location = {
    'id': '669b42c2-355d-4e88-af85-e34d74d90920',
    'parentNodeId': '99415057-1026-4c22-b687-5198ec44a5ab',
    'parentNode': {
      'displayName': 'Dev2 Internal Account1',
      'id': '99415057-1026-4c22-b687-5198ec44a5ab',
      'isUnavailable': false,
      'labName': 'Dev2 Internal Account1',
      'nodeType': 1,
      'parentNodeId': 'bf1d67a6-a43a-46ac-bafc-992b8305f421'
    },
    'nodeType': 2,
    'displayName': 'Amazing Lab Center',
    'children': null,
    'labLocationName': 'test after',
    'locationTimeZone': '',
    'locationOffset': '',
    'locationDayLightSaving': '',
    'labLocationContactId': '9753dfcb-448c-4faa-b5f0-e5a40f47033a',
    'labLocationAddressId': '57c048df-7904-4d9d-aed1-77e64ab760fb',
    'labLocationContact': {
      'entityType': 0,
      'firstName': 'rock',
      'lastName': 'doe',
      'name': 'rockdoe',
      'email': 'rock@gms.com',
      'id': ''
    },
    'contactRoles': [UserRole.LabSupervisor],
    'labLocationAddress': {
      'entityType': 0,
      'nickName': '123 Main St.',
      'streetAddress1': 'demoi',
      'streetAddress2': 'Ste. ABC',
      'streetAddress': 'demoi',
      'city': 'ee',
      'state': 'eee',
      'country': 'AX',
      'zipCode': '234234',
      'id': ''
    },
    'shipTo': '1234',
    'soldTo': '123456',
    'orderNumber': 'U100503',
    'unityNextTier': 1,
    'unityNextInstalledProduct': null,
    'connectivityTier': 1,
    'connectivityInstalledProduct': null,
    'lotViewerLicense': 1,
    'lotViewerInstalledProduct': null,
    'addOns': 1,
    'addOnsFlags': {
      'valueAssignment': true,
      'allowBR': false,
      'allowNonBR': false,
      'allowSiemensHematology': false,
      'allowSysmexHemostasis': false
    },
    // 'crossOverStudy': 1,
    'licenseNumberUsers': 12223,
    'licenseAssignDate': new Date('2022-04-28T13:10:26.889Z'),
    'licenseExpirationDate': new Date('2022-06-28T13:10:26.889Z'),
    'hasChildren': true,
    'locationCount': 3,
    'accountName': 'Amazing Lab Center',
    'accountNumber': 'U100503',
    'groupName': 'Another Group',
    'formattedAccountNumber': 'U100503',
    'transformers': null,
    'previousContactUserId': null,
    'labLanguagePreference': 'en-us'
  };

  const mockPortalApiService = {
    getLabSetupNode: (): Observable<TreePill> => of(selectedNode),
    getLabSetupNodeWithTestSettings: (): Observable<TreePill> => of(selectedNode.children[0])
  };

  const navigationState: NavigationState = {
    selectedNode: selectedNode,
    selectedLeaf: selectedNode,
    currentBranch: [],
    error: null,
    isSideNavExpanded: false,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: false,
    connectivityFullTree: null,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: false,
    settings: null,
    showArchivedItemsToggle: false,
    isArchiveItemsToggleOn: false,
    showAccountUserSelectorToggle: false,
    isAccountUserSelectorOn: false,
    hasNonBrLicense: false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgReduxTestingModule,
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot([])
      ],
      providers: [
        { provide: Store, useValue: location },
        { provide: EntityTypeService, useValue: mockEntityTypeService },
        { provide: Location, useValue: mockLocation },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
            navigateByUrl = jasmine.createSpy('navigateByUrl');
          }
        },
        NavigationService,
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: Store, useValue: {} },
        provideMockStore({}),
        { provide: BrPermissionsService, useValue: mockBrPermissionsService }
      ]
    });
    router = TestBed.get(Router);
    store = TestBed.get(Store);
  });

  beforeEach(inject(
    [NavigationService],
    (service: NavigationService) => {
      navigation = service;
      navigation.getArchiveToggle$ = of(true);
      navigation.getNavigationState$ = of(navigationState);
    }
  ));

  beforeEach(() => {
    store.setState(location);

  });

  it('should be created', () => {
    const service: NavigationService = TestBed.get(
      NavigationService
    );
    expect(service).toBeTruthy();
  });

  it('should route to specified url', () => {
    const url = '/fake/url';
    navigation.routeTo(url);
    expect(router.navigate).toHaveBeenCalledWith([url], undefined);
  });

  it('should navigate to lab management', () => {
    navigation.routeToLabManagement('fake-location-id', 'fake-lab-id');
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should navigate to connectivity', () => {
    navigation.routeToConnectivity('fake-sub-path', 'fake-lab-id');
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should navigate to instructions', () => {
    const routeToConnectivity = spyOn(navigation, 'routeToConnectivity');
    navigation.routeToInstructions('fake-lab-id');
    expect(routeToConnectivity).toHaveBeenCalled();
  });

  it('should navigate to mapping', () => {
    const routeToConnectivity = spyOn(navigation, 'routeToConnectivity');
    navigation.routeToMapping('fake-lab-id');
    expect(routeToConnectivity).toHaveBeenCalled();
  });

  it('should navigate to file upload', () => {
    const routeToConnectivity = spyOn(navigation, 'routeToConnectivity');
    navigation.routeToFileUpload('fake-lab-id');
    expect(routeToConnectivity).toHaveBeenCalled();
  });

  it('should navigate to connectivity status', () => {
    const routeToConnectivity = spyOn(navigation, 'routeToConnectivity');
    navigation.routeToConnectivityStatus('fake-lab-id');
    expect(routeToConnectivity).toHaveBeenCalled();
  });

  it('should navigate to user managementNew', () => {
    const routeTo = spyOn(navigation, 'routeTo');
    navigation.routeToUserManagement('fake-lab-id');
    expect(routeTo).toHaveBeenCalled();
  });

  it('should navigate to user management addNew', () => {
    navigation.routeToUserManagementAddNew('fake-lab-id');
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should navigate to account management', () => {
    const routeTo = spyOn(navigation, 'routeTo');
    navigation.routeToAccountManagement();
    expect(routeTo).toHaveBeenCalled();
  });

  it('should navigate to account management add', () => {
    navigation.routeToAccountManagementAdd();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should navigate to dashboard', () => {
    const routeTo = spyOn(navigation, 'routeTo');
    navigation.routeToDashboard();
    expect(routeTo).toHaveBeenCalledWith(unRouting.actionableDashboard);
  });

  it('should navigate to add location', () => {
    const routeTo = spyOn(navigation, 'routeTo');
    const parentId = 'fake-parent-id';
    navigation.navigateToAddLocation(parentId);
    const url = unRouting.labManagement.lab + '/' + unRouting.add.location.replace(':parentId', parentId);
    expect(routeTo).toHaveBeenCalledWith(url);
  });

  it('should navigate to login', () => {
    const routeTo = spyOn(navigation, 'routeTo');
    navigation.navigateToLogin();
    expect(routeTo).toHaveBeenCalledWith(unRouting.login);
  });

  it('should navigate to login with query params', () => {
    const queryParams = { queryParams: { test: 'test-value' } };
    navigation.navigateToLoginWithQueryParams(queryParams);
    expect(router.navigate).toHaveBeenCalledWith([unRouting.login], queryParams);
  });

  it('should navigate to content', () => {
    const selectedLink = { displayText: 'test-value', link: '' };
    navigation.navigateToContent(selectedLink);
    expect(router.navigate).toHaveBeenCalledWith([selectedLink.link]);
  });

  it('should navigate to lab setup default', () => {
    navigation.navigateToLabSetupDefault();
    expect(router.navigateByUrl).toHaveBeenCalledWith(`/${unRouting.labSetup.lab}/${unRouting.labSetup.labDefault}`);
  });

  it('should navigate to specified url', () => {
    const obj = {
      postProcess: () => { }
    };
    const callbackSpy = spyOn(obj, 'postProcess');
    navigation.navigateToUrl('fake url', false, selectedNode, null);
    navigation.navigateToUrl('fake url', false, null, 'fake-id', obj.postProcess);
    expect(callbackSpy).toHaveBeenCalled();
  });

  it('should navigate to dashboard', () => {
    const routeToDashboardSpy = spyOn(navigation, 'routeToDashboard');
    const locationId = 'fake-location-id';
    navigation.navigateToDashboard(locationId);
    expect(routeToDashboardSpy).toHaveBeenCalled();
  });

  it('should navigate to department settings', () => {
    const routeTo = spyOn(navigation, 'setStateForSelectedNode');
    const departmentUrl = `/${unRouting.labSetup.lab}/${unRouting.labSetup.departments}/${selectedNode.id}/${unRouting.labSetup.settings}`;
    navigation.navigateToDepartmentSettings(selectedNode);
    expect(routeTo).toHaveBeenCalledWith(selectedNode, true, departmentUrl);
  });

  it('should navigate to instrument settings', () => {
    const setStateForSelectedNodeSpy = spyOn(navigation, 'setStateForSelectedNode');
    navigation.navigateToInstrumentSettings('url', false, selectedNode, null);
    expect(setStateForSelectedNodeSpy).toHaveBeenCalled();
  });

  it('should navigate to lab setup', () => {
    navigation.navigateToLabSetup(selectedNode, location);
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should sort nav items', () => {
    const _selectedNodeChildren = navigation.sortNavItems(selectedNodeChildren);
    expect(_selectedNodeChildren).toEqual(selectedNodeChildrenSorted);
  });

  it('should identify if selected node is valid to show data table pages', () => {
    const isValid = navigation.isSelectedNodeOfDataTable(selectedNode);
    expect(isValid).toBeTruthy();
  });

  it('should get updated selected node', () => {
    let node = navigation.getUpdatedSelectedNodeState(currentBranch, null, ActionType.delete, currentBranch[1].id);
    expect(node).not.toBe(null);
    node = navigation.getUpdatedSelectedNodeState(currentBranch, selectedNode.children[0], ActionType.delete, selectedNode.children[0].id);
    expect(node).not.toBe(null);
  });

  it('should set selected node by id', () => {
    const obj = {
      postProcess: () => { }
    };
    const callbackSpy = spyOn(obj, 'postProcess');
    navigation.setSelectedNodeById(selectedNode.nodeType, selectedNode.id, obj.postProcess);
    expect(callbackSpy).toHaveBeenCalled();
  });

  it('should set selected node with test settings', () => {
    const setCurrentlySelectedNodeSpy = spyOn(navigation, 'setCurrentlySelectedNode');
    navigation.setSelectedNodeWithTestSettings(selectedNode); // updated url
    expect(setCurrentlySelectedNodeSpy).toHaveBeenCalledWith(selectedNode.children[0]);
  });
});
