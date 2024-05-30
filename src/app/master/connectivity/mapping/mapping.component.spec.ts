// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpLoaderFactory } from 'src/app/app.module';

import { MappingComponent } from './mapping.component';
import { MappingService } from './mapping.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { HeaderService } from '../shared/header/header.service';
import * as fromRoot from '../../../state/app.state';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { ConnectivityMapTree } from '../../../contracts/models/connectivity-map/connectivity-map-tree.model';
import { ConnectivityMapLabData } from '../../../contracts/models/connectivity-map/connectivity-map-lab.model';
import { BrPermissionsService } from '../../../security/services/permissions.service';

describe('MappingComponent', () => {
  let component: MappingComponent;
  let fixture: ComponentFixture<MappingComponent>;
  let store: MockStore<any>;
  const mockState = {};
  let _headerService: HeaderService;
  let _connectivityMapService: MappingService;
  let SpyonStore: any;

  const fullTree = {
    'displayName': 'Vishwajit\'s Lab',
    'labLocationName': 'Vishwajit\'s Lab',
    'locationTimeZone': 'Asia/Kolkata',
    'locationOffset': '05:30:00',
    'locationDayLightSaving': '00:00:00',
    'labLocationContactId': '74098d1f-e0a0-46ab-b1c1-405cf10c4d9b',
    'labLocationAddressId': '0a69a3c7-68ca-4f42-92c7-be79879bb37d',
    'labLocationContact': {
      'entityType': 0,
      'searchAttribute': 'vishwajit_shinde+devconn@bio-rad.com',
      'firstName': 'vishwajit',
      'middleName': '',
      'lastName': 'shinde',
      'name': 'vishwajit shinde',
      'email': 'vishwajit_shinde+devconn@bio-rad.com',
      'phone': '',
      'id': '74098d1f-e0a0-46ab-b1c1-405cf10c4d9b',
      'featureInfo': {
        'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
      }
    },
    'labLocationAddress': {
      'entityType': 1,
      'searchAttribute': '',
      'nickName': '',
      'streetAddress1': 'Rajiv Gandhi IT park',
      'streetAddress2': '',
      'streetAddress3': '',
      'streetAddress': 'Rajiv Gandhi IT park',
      'suite': '',
      'city': 'Pune',
      'state': 'MH',
      'country': 'IN',
      'zipCode': '410057',
      'id': '0a69a3c7-68ca-4f42-92c7-be79879bb37d',
      'featureInfo': {
        'uniqueServiceName': 'Portal.Core.Models.Address/Portal.Core.Models.Address'
      }
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
      'legacyPrimaryLab': null,
      'id': '635b3412-679a-4201-97f4-c6df45bcfab6',
      'parentNodeId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
      'parentNode': null,
      'nodeType': 9,
      'children': null,
      'isUnavailable': false,
      'unavailableReasonCode': ''
    },
    'hasOwnAccountSettings': false,
    'id': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
    'parentNodeId': 'b6e6e6e3-ed8e-4bc9-8b1b-3fcdfecd3476',
    'parentNode': null,
    'nodeType': 2,
    'children': [
      {
        'displayName': 'Connectivity Dept',
        'departmentName': 'Connectivity Dept',
        'departmentManagerId': '74098d1f-e0a0-46ab-b1c1-405cf10c4d9b',
        'departmentManager': {
          'entityType': 0,
          'searchAttribute': 'vishwajit_shinde+devconn@bio-rad.com',
          'firstName': 'vishwajit',
          'middleName': '',
          'lastName': 'shinde',
          'name': 'vishwajit shinde',
          'email': 'vishwajit_shinde+devconn@bio-rad.com',
          'phone': '',
          'id': '74098d1f-e0a0-46ab-b1c1-405cf10c4d9b',
          'featureInfo': {
            'uniqueServiceName': 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
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
          'legacyPrimaryLab': null,
          'id': '635b3412-679a-4201-97f4-c6df45bcfab6',
          'parentNodeId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
          'parentNode': null,
          'nodeType': 9,
          'children': null,
          'isUnavailable': false,
          'unavailableReasonCode': ''
        },
        'hasOwnAccountSettings': false,
        'id': '69e08235-3274-4a52-b304-21d557728604',
        'parentNodeId': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
        'parentNode': null,
        'nodeType': 3,
        'children': [
          {
            'displayName': 'AU640',
            'instrumentId': '2300',
            'instrumentCustomName': '',
            'instrumentSerial': '',
            'instrumentInfo': {
              'id': 2300,
              'name': 'AU640',
              'manufacturerId': 14,
              'manufacturerName': 'Beckman Coulter'
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
              'legacyPrimaryLab': null,
              'id': '635b3412-679a-4201-97f4-c6df45bcfab6',
              'parentNodeId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
              'parentNode': null,
              'nodeType': 9,
              'children': null,
              'isUnavailable': false,
              'unavailableReasonCode': ''
            },
            'hasOwnAccountSettings': false,
            'id': '18167f04-3e83-4635-8c2e-1a19fc69d195',
            'parentNodeId': '69e08235-3274-4a52-b304-21d557728604',
            'parentNode': null,
            'nodeType': 4,
            'children': [
              {
                'displayName': 'Assayed Chemistry',
                'productId': '2',
                'productMasterLotId': '69',
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
                  'id': 69,
                  'productId': 2,
                  'productName': 'Assayed Chemistry',
                  'lotNumber': '23000',
                  'expirationDate': '2020-12-31T00:00:00'
                },
                'productLotLevels': [
                  {
                    'id': '105',
                    'productMasterLotId': '69',
                    'productId': '2',
                    'productMasterLotNumber': '23000',
                    'lotNumber': '23001',
                    'level': 1,
                    'levelDescription': '1'
                  },
                  {
                    'id': '106',
                    'productMasterLotId': '69',
                    'productId': '2',
                    'productMasterLotNumber': '23000',
                    'lotNumber': '23002',
                    'level': 2,
                    'levelDescription': '2'
                  },
                  {
                    'id': '107',
                    'productMasterLotId': '69',
                    'productId': '2',
                    'productMasterLotNumber': '23000',
                    'lotNumber': '23003',
                    'level': 3,
                    'levelDescription': '3'
                  },
                  {
                    'id': '108',
                    'productMasterLotId': '69',
                    'productId': '2',
                    'productMasterLotNumber': '23000',
                    'lotNumber': '23004',
                    'level': 4,
                    'levelDescription': '4'
                  },
                  {
                    'id': '109',
                    'productMasterLotId': '69',
                    'productId': '2',
                    'productMasterLotNumber': '23000',
                    'lotNumber': '23005',
                    'level': 5,
                    'levelDescription': '5'
                  },
                  {
                    'id': '110',
                    'productMasterLotId': '69',
                    'productId': '2',
                    'productMasterLotNumber': '23000',
                    'lotNumber': '23006',
                    'level': 6,
                    'levelDescription': '6'
                  }
                ],
                'levelSettings': {
                  'levelEntityId': null,
                  'levelEntityName': 'LevelSetting',
                  'parentLevelEntityId': '98d87cfe-7adf-4a51-a6d8-124876cec325',
                  'parentLevelEntityName': 'LabProduct',
                  'minNumberOfPoints': 0,
                  'runLength': 0,
                  'dataType': 1,
                  'targets': null,
                  'rules': null,
                  'levels': [
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
                    },
                    {
                      'levelInUse': false,
                      'decimalPlace': 2
                    }
                  ],
                  'id': 'd2bb020e-41f6-18bf-6595-40d8a1085d81',
                  'parentNodeId': '98d87cfe-7adf-4a51-a6d8-124876cec325',
                  'parentNode': null,
                  'nodeType': 8,
                  'displayName': 'd2bb020e-41f6-18bf-6595-40d8a1085d81',
                  'children': null,
                  'isUnavailable': false,
                  'unavailableReasonCode': null
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
                  'legacyPrimaryLab': null,
                  'id': '635b3412-679a-4201-97f4-c6df45bcfab6',
                  'parentNodeId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
                  'parentNode': null,
                  'nodeType': 9,
                  'children': null,
                  'isUnavailable': false,
                  'unavailableReasonCode': ''
                },
                'hasOwnAccountSettings': false,
                'id': '98d87cfe-7adf-4a51-a6d8-124876cec325',
                'parentNodeId': '18167f04-3e83-4635-8c2e-1a19fc69d195',
                'parentNode': null,
                'nodeType': 5,
                'children': [
                  {
                    'displayName': 'Glucose',
                    'testSpecId': '1406',
                    'correlatedTestSpecId': 'EA35C43B56F34D6190FA6B482E7B9D9B',
                    'testId': '1405',
                    'labUnitId': '14',
                    'testSpecInfo': {
                      'id': 1406,
                      'testId': 1405,
                      'analyteStorageUnitId': 92,
                      'analyteId': 96,
                      'analyteName': 'Glucose',
                      'methodId': 221,
                      'methodName': 'Hexokinase',
                      'instrumentId': 2300,
                      'instrumentName': 'AU640',
                      'reagentId': 725,
                      'reagentManufacturerId': null,
                      'reagentManufacturerName': 'Beckman Coulter',
                      'reagentName': 'GLUC REF OSR6X21',
                      'reagentLotId': 35,
                      'reagentLotNumber': 'Unspecified ***',
                      'reagentLot': {
                        'id': 35,
                        'reagentId': 725,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': '2068-11-05T14:57:54.57'
                      },
                      'storageUnitId': 14,
                      'storageUnitName': 'mg/dL',
                      'calibratorId': 4,
                      'calibratorManufacturerId': null,
                      'calibratorManufacturerName': 'Beckman Coulter',
                      'calibratorName': 'Chemistry Cal DR0070',
                      'calibratorLotId': 4,
                      'calibratorLotNumber': 'Unspecified ***',
                      'calibratorLot': {
                        'id': 4,
                        'calibratorId': 4,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': '2068-11-05T14:57:47.227'
                      }
                    },
                    'levelSettings': {
                      'levelEntityId': null,
                      'levelEntityName': 'LevelSetting',
                      'parentLevelEntityId': '21c9621c-b3e1-43a1-975d-96a4c9dea1fc',
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
                      'id': '2abb020e-8af7-285f-1a55-62b1dda3f609',
                      'parentNodeId': '21c9621c-b3e1-43a1-975d-96a4c9dea1fc',
                      'parentNode': null,
                      'nodeType': 8,
                      'displayName': '2abb020e-8af7-285f-1a55-62b1dda3f609',
                      'children': null,
                      'isUnavailable': false,
                      'unavailableReasonCode': null
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
                      'legacyPrimaryLab': null,
                      'id': '635b3412-679a-4201-97f4-c6df45bcfab6',
                      'parentNodeId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
                      'parentNode': null,
                      'nodeType': 9,
                      'children': null,
                      'isUnavailable': false,
                      'unavailableReasonCode': ''
                    },
                    'hasOwnAccountSettings': false,
                    'mappedTestSpecs': null,
                    'id': '21c9621c-b3e1-43a1-975d-96a4c9dea1fc',
                    'parentNodeId': '98d87cfe-7adf-4a51-a6d8-124876cec325',
                    'parentNode': null,
                    'nodeType': 6,
                    'children': [],
                    'isUnavailable': false,
                    'unavailableReasonCode': 'null'
                  }
                ],
                'isUnavailable': false,
                'unavailableReasonCode': 'null'
              }
            ],
            'isUnavailable': false,
            'unavailableReasonCode': ''
          }
        ],
        'isUnavailable': false,
        'unavailableReasonCode': ''
      }
    ],
    'isUnavailable': false,
    'unavailableReasonCode': ''
  };

  const trees: ConnectivityMapTree[] = [
    {
      'id': 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec',
      'labId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
      'locationId': null,
      'departmentId': null,
      'instrumentId': '18167f04-3e83-4635-8c2e-1a19fc69d195',
      'codes': [
        {
          'id': 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec',
          'code': 'AU600',
          'disabled': false
        }
      ],
      'product': [
        {
          'id': '98d87cfe-7adf-4a51-a6d8-124876cec325',
          'levelCodes': [
            {
              'id': '105',
              'lotLevel': 1,
              'codes': [
                {
                  'id': 'a8cd31a4-c1b0-11ea-bb1e-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--1',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': '21c9621c-b3e1-43a1-975d-96a4c9dea1fc',
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': 35,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': 4,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          'id': null,
          'levelCodes': [
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '8db08c8a-d697-11ea-a459-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--2',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '8db0913a-d697-11ea-a45a-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--3',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'id': 'da6e1050-d6a2-11ea-b4f1-06fe5f17c9ec',
      'labId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
      'locationId': null,
      'departmentId': null,
      'instrumentId': null,
      'codes': [
        {
          'id': 'da6e1050-d6a2-11ea-b4f1-06fe5f17c9ec',
          'code': 'AU640',
          'disabled': false
        }
      ],
      'product': [
        {
          'id': null,
          'levelCodes': [
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': 'da6e05ce-d6a2-11ea-8ba5-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--1',
                  'disabled': false
                }
              ],
              'test': []
            },
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': 'da6e0b1e-d6a2-11ea-8ba6-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--2',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'id': '962ecace-d6a2-11ea-aef3-06fe5f17c9ec',
      'labId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
      'locationId': null,
      'departmentId': null,
      'instrumentId': null,
      'codes': [
        {
          'id': '962ecace-d6a2-11ea-aef3-06fe5f17c9ec',
          'code': 'AU400',
          'disabled': false
        }
      ],
      'product': [
        {
          'id': null,
          'levelCodes': [
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '962ecaf6-d6a2-11ea-96f2-06fe5f17c9ec',
                  'code': 'CardiacMarkers_ProductLotCode--3',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': 'CKTest',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'Dia1',
                          'disabled': false
                        }
                      ]
                    }
                  ],
                  'calibratorLot': [
                    {
                      'id': null,
                      'codes': [
                        {
                          'code': 'FlowChem',
                          'disabled': false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      'id': '0856980e-db92-11ea-93a0-06e557ed42ee',
      'labId': 'd1de4052-28a5-479f-b637-ef258e0e2578',
      'locationId': null,
      'departmentId': null,
      'instrumentId': null,
      'codes': [
        {
          'id': '0856980e-db92-11ea-93a0-06e557ed42ee',
          'code': '1480',
          'disabled': false
        }
      ],
      'product': [
        {
          'id': null,
          'levelCodes': [
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '085693a4-db92-11ea-b243-06e557ed42ee',
                  'code': '45800--1',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': '118',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [],
                  'calibratorLot': []
                }
              ]
            },
            {
              'id': null,
              'lotLevel': null,
              'codes': [
                {
                  'id': '0856982c-db92-11ea-b244-06e557ed42ee',
                  'code': '45800--3',
                  'disabled': false
                }
              ],
              'test': [
                {
                  'id': null,
                  'codes': [
                    {
                      'code': '118',
                      'disabled': false
                    }
                  ],
                  'reagentLot': [],
                  'calibratorLot': []
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const labData: ConnectivityMapLabData = {
    'connectivityMapCards': {
      'instrumentCards': [
        {
          'locationName': 'Vishwajit\'s Lab',
          'locationId': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
          'departmentName': 'Connectivity Dept',
          'departmentId': '69e08235-3274-4a52-b304-21d557728604',
          'instrumentModelName': 'AU640',
          'instrumentId': '18167f04-3e83-4635-8c2e-1a19fc69d195',
          'instrumentAlias': '',
          'badgeCount': 3,
          'codes': [
            {
              'code': 'AU600',
              'documentId': 'a8cd2d4e-c1b0-11ea-938a-06fe5f17c9ec'
            }
          ]
        }
      ],
      'productCards': [
        {
          'badgeCount': undefined,
          'locationId': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
          'departmentId': '69e08235-3274-4a52-b304-21d557728604',
          'instrumentId': '18167f04-3e83-4635-8c2e-1a19fc69d195',
          'productId': '98d87cfe-7adf-4a51-a6d8-124876cec325',
          'productName': 'Assayed Chemistry',
          'productMasterLotNumber': '23000',
          'controlLotLevelIds': [
            '105',
            '106',
            '107',
            '108',
            '109',
            '110'
          ],
          'levels': [
            1,
            2,
            3,
            4,
            5,
            6
          ],
          'productLevels': [
            {
              'codes': [],
              'controlLotLevelId': '105',
              'level': 1
            },
            {
              'codes': [],
              'controlLotLevelId': '106',
              'level': 2
            },
            {
              'codes': [],
              'controlLotLevelId': '107',
              'level': 3
            },
            {
              'codes': [],
              'controlLotLevelId': '108',
              'level': 4
            },
            {
              'codes': [],
              'controlLotLevelId': '109',
              'level': 5
            },
            {
              'codes': [],
              'controlLotLevelId': '110',
              'level': 6
            }
          ]
        }
      ],
      'testCards': [
        {
          'codes': [],
          'linkedCalibratorLotCodes': undefined,
          'linkedReagentLotCodes': undefined,
          'methodName': undefined,
          'locationId': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
          'departmentId': '69e08235-3274-4a52-b304-21d557728604',
          'instrumentId': '18167f04-3e83-4635-8c2e-1a19fc69d195',
          'productId': '98d87cfe-7adf-4a51-a6d8-124876cec325',
          'labTestId': '21c9621c-b3e1-43a1-975d-96a4c9dea1fc',
          'codeListTestId': '1405',
          'analyteName': 'Glucose',
          'calibratorLots': [
            {
              'id': 4,
              'calibratorId': 4,
              'calibratorName': 'Chemistry Cal DR0070',
              'lotNumber': 'Unspecified ***',
              'shelfExpirationDate': new Date('2068-11-05T14:57:47.227')
            }
          ],
          'reagentLots': [
            {
              'id': 35,
              'reagentId': 725,
              'reagentName': 'GLUC REF OSR6X21',
              'lotNumber': 'Unspecified ***',
              'shelfExpirationDate': new Date('2068-11-05T14:57:54.57')
            }
          ]
        }
      ]
    },
    'connectivityMapDropdowns': {
      'locationDropdown': [
        {
          'name': 'Vishwajit\'s Lab',
          'locationId': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
          'productId': null,
          'instrumentId': null,
          'departmentId': null
        }
      ],
      'departmentDropdown': [
        {
          'name': 'Connectivity Dept',
          'locationId': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
          'productId': null,
          'instrumentId': null,
          'departmentId': '69e08235-3274-4a52-b304-21d557728604'
        }
      ],
      'instrumentDropdown': [
        {
          'name': 'AU640',
          'locationId': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
          'productId': null,
          'instrumentId': '18167f04-3e83-4635-8c2e-1a19fc69d195',
          'departmentId': '69e08235-3274-4a52-b304-21d557728604'
        }
      ],
      'productDropdown': [
        {
          'name': 'Assayed Chemistry',
          'locationId': '91c5d6a6-d2e9-48a9-9d7b-1faddf61abc9',
          'productId': '98d87cfe-7adf-4a51-a6d8-124876cec325',
          'instrumentId': '18167f04-3e83-4635-8c2e-1a19fc69d195',
          'departmentId': '69e08235-3274-4a52-b304-21d557728604'
        }
      ]
    }
  };

  const mockService = {
    clearSelectionStates() { },
    resetData: () => of(''),
    createConnectivityMapTrees: () => of(''),
    createCardAndDropdownLabData() { },
    getFullTree: () => {
      return of(fullTree);
    },
    getConnectivityMapTrees: () => {
      return of(trees);
    },
    getCardAndDropdownLabData: () => {
      return of(labData);
    },
    updateConnectivityMapTrees: () => of(trees),
    updateConnectivityMapDropdowns: () => of(''),
    currentConnectivityMapTrees: of(trees),
    currentMapCardsData: of(labData.connectivityMapCards),
    updateInstrumentUnmappedChips() { },
    updateProductUnmappedChips() { },
    updateTestUnmappedChips() { },
    updateMappedInstrumentIds() { },
    updateMappedProductIds() { },
    updateProductMappedChips() { },
    updateTestMappedChips() { },
    updateInstrumentCards() { },
    updateProductCards() { },
    updateTestCards() { },
    updateInstrumentNavigation() { },
    updateProductNavigation() { },
    updateTestNavigation() { },
    unmapInstrument: of(''),
    updateDocument() { },
    unmapProduct: of(''),
    unmapTest: of(''),
    triggerDataRefresh: new Subject<Array<boolean>>()
  };

  const headerServiceMock = {
    getDialogComponentMapping: () => {
      return of({ componentName: 'instrument' });
    }
  };

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const securityData = {
    isLoggedIn: true,
    currentUser: {
      firstName: 'Nikita ',
      lastName: 'Pawar',
      email: 'nikita_pawar+dev22@bio-rad.com',
      userOktaId: '00u6atq71s2yUBNJr2p7',
      roles: [
        'Admin'
      ],
      accessToken: {
        accessToken: `eyJraWQiOiJPYWRzbHZzVDBQRU0tMUdya1FLQzd2TXY3bXVnc3B2NkdnMEx1NVczd
        S1NIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnVIOFhLMW90MEJtOVU0cm9JTkt1a0Rfa
        DhDM2UtRHhqenJ4Szh6Y1l3WkkiLCJpc3MiOiJodHRwczovL2Jpb3JhZC1leHQub2t0YS5jb20vb2F1dGgyL2
        F1czUzbmxtOTAwQkJLbFBuMnA3IiwiYXVkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJpYXQiOjE1ODM3Mzk4
        OTMsImV4cCI6MTU4Mzc0MzQ5MywiY2lkIjoiMG9hNTNuYmd0c3o2TlBkaWcycDciLCJ1aWQiOiIwMHU2YXRxNz
        FzMnlVQk5KcjJwNyIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCJdLCJzdWIiOiJuaWtpdGFfcGF3YXIrZGV2MjJA
        YmlvLXJhZC5jb20iLCJVc2VyTGFzdE5hbWUiOiJQYXdhciIsIlVzZXJGaXJzdE5hbWUiOiJOaWtpdGEgIiwiVX
        NlckVtYWlsIjoibmlraXRhX3Bhd2FyK2RldjIyQGJpby1yYWQuY29tIiwiVXNlckRpc3BsYXlOYW1lIjoiTmlr
        aXRhICBQYXdhciJ9.ow3UfX0S9YMKvhkWeRVyDF5hG3JSkFIShnswfRnN9xKVasyglxr_Nfdvp5dh0ETI8OqDn
        SLB6qGofOpYza6L244R0Pw4DTbjMLwrX3fhMX1zNrLXn3O6c7p89HFG2EcrrfpuvNZe7hyVBlKxg9GJfCWlvML
        De68Zxa8aQUWTxdYZnuPokJbRLFuN-gs9WdDE0mfTouNnCK4rPen-xPjfnUZRAMFA4bOdIcuNdEyD0PB8FpraQ
        R2yLXF1EHLl7Pab77RgXC-PWHBpL4vem02CkTTInd2oWnpEfyneNB74hQtD9xVkBxf_JaSylYNHqBMnkW_jEco
        HvUElo9zA0BAD2w`,
        expiresAt: 1583743492,
        tokenType: 'Bearer',
        scopes: [
          'openid',
          'email'
        ],
        authorizeUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/authorize',
        userinfoUrl: 'https://biorad-ext.okta.com/oauth2/aus53nlm900BBKlPn2p7/v1/userinfo'
      },
      accountNumber: '100503',
      accountId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
      accountNumberArray: [
        '100503'
      ],
      labLocationId: '25dc4656-0670-47bd-be1c-0f12eaf3e20c',
      labLocationIds: [
        '25dc4656-0670-47bd-be1c-0f12eaf3e20c'
      ],
      permissions: {},
      userData: {},
      id: '9b576ae9-6352-4425-9b7d-399caa26c6f8'
    },
    directory: {
      name: 'vishavajit',
      location: null,
      displayName: '100503',
      accountNumber: '100503',
      formattedAccountNumber: 'U100503',
      sapNumber: '',
      orderNumber: '',
      accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
      accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
      accountLicenseType: 0,
      licensedProducts: [
        {
          product: 1,
          fileOption: 0
        }
      ],
      licenseNumberUsers: 20,
      accountContact: {
        entityType: 0,
        searchAttribute: 'nikita_pawar+dev22@bio-rad.com',
        firstName: 'Nikita',
        middleName: '',
        lastName: 'Pawar',
        name: 'Nikita Pawar',
        email: 'nikita_pawar+dev22@bio-rad.com',
        phone: '',
        id: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
        }
      },
      accountAddress: {
        entityType: 1,
        searchAttribute: '',
        nickName: '',
        streetAddress1: 'Pune',
        streetAddress2: '',
        streetAddress3: '',
        streetAddress: 'Pune',
        suite: '',
        city: '',
        state: '',
        country: 'IN',
        zipCode: '',
        id: '65114ca9-6bb6-4474-ba3d-12d142026907',
        featureInfo: {
          uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
        }
      },
      licenseAssignDate: '2020-02-12T08:36:41.324Z',
      licenseExpirationDate: '2020-07-12T18:30:00Z',
      comments: '',
      primaryUnityLabNumbers: '',
      migrationStatus: '',
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
        id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
        parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
      parentNodeId: 'ROOT',
      parentNode: null,
      nodeType: 0,
      children: [
        {
          displayName: 'Nikitas Lab',
          labName: 'Nikitas Lab',
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
            id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
            parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          id: '9da2e249-18d5-4f94-a5a0-06f6bf81db69',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 1,
          children: [
            {
              displayName: 'Nikitas Lab',
              labLocationName: 'Nikitas Lab',
              locationTimeZone: 'America/Indiana/Indianapolis',
              locationOffset: '-05:00:00',
              locationDayLightSaving: '00:00:00',
              labLocationContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              labLocationAddressId: 'f29e65c1-83d6-476b-b492-f06880049c0b',
              labLocationContact: {
                entityType: 0,
                searchAttribute: 'nikita_pawar+dev22@bio-rad.com',
                firstName: 'Nikita',
                middleName: '',
                lastName: 'Pawar',
                name: 'Nikita Pawar',
                email: 'nikita_pawar+dev22@bio-rad.com',
                phone: '',
                id: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
                featureInfo: {
                  uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
                }
              },
              labLocationAddress: {
                entityType: 1,
                searchAttribute: '',
                nickName: '',
                streetAddress1: 'Pune',
                streetAddress2: '',
                streetAddress3: '',
                streetAddress: 'Pune',
                suite: '',
                city: '',
                state: '',
                country: 'IN',
                zipCode: '',
                id: 'f29e65c1-83d6-476b-b492-f06880049c0b',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              hasOwnAccountSettings: false,
              id: '25dc4656-0670-47bd-be1c-0f12eaf3e20c',
              parentNodeId: '9da2e249-18d5-4f94-a5a0-06f6bf81db69',
              parentNode: null,
              nodeType: 2,
              children: []
            }
          ]
        },
        {
          displayName: 'pratik thakare',
          contactId: '4bd3b6e0-2845-4a29-9bec-6dbf2af86bc9',
          userOktaId: '00u6att5uyrKTbE9U2p7',
          userRoles: [
            'User'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'pratik_thakare+User@bio-rad.com',
            firstName: 'pratik',
            middleName: '',
            lastName: 'thakare',
            name: 'pratik thakare',
            email: 'pratik_thakare+User@bio-rad.com',
            phone: '',
            id: '4bd3b6e0-2845-4a29-9bec-6dbf2af86bc9',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: '2020-02-12T08:54:55.968Z',
            id: 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
              comments: '',
              primaryUnityLabNumbers: '',
              migrationStatus: '',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: 'e6ffc737-3f1e-4854-b5ab-98b269b7eeb6',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'nilam pawar',
          contactId: 'f2f57f89-5a0d-45cf-98bd-09adb2f28ef4',
          userOktaId: '00u6ciixxaeWo1TTh2p7',
          userRoles: [
            'User'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'nikita_pawar+dev_user21@persistent.com',
            firstName: 'nilam',
            middleName: '',
            lastName: 'pawar',
            name: 'nilam pawar',
            email: 'nikita_pawar+dev_user21@persistent.com',
            phone: '',
            id: 'f2f57f89-5a0d-45cf-98bd-09adb2f28ef4',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: 'd12378dc-6090-4af2-9676-bae37dd3c64a',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: null,
            id: 'd12378dc-6090-4af2-9676-bae37dd3c64a',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
              comments: '',
              primaryUnityLabNumbers: '',
              migrationStatus: '',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: 'd12378dc-6090-4af2-9676-bae37dd3c64a',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'Neha Pagar',
          contactId: 'ad13388d-3bac-4167-a53a-5439df492c62',
          userOktaId: '00u6cikekrE3XqcBT2p7',
          userRoles: [
            'User'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'nikita_pawar+dev_22_user@bio-rad.com',
            firstName: 'Neha',
            middleName: '',
            lastName: 'Pagar',
            name: 'Neha Pagar',
            email: 'nikita_pawar+dev_22_user@bio-rad.com',
            phone: '',
            id: 'ad13388d-3bac-4167-a53a-5439df492c62',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: '2020-02-17T13:20:49.664Z',
            id: '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
              comments: '',
              primaryUnityLabNumbers: '',
              migrationStatus: '',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: '3f1792d0-c985-489e-a5ee-6ec59ec990c6',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'mahesh janugade',
          contactId: 'e698c9cc-eca4-464a-a54b-2e2524887e73',
          userOktaId: '00u6cih3xuerXD5g02p7',
          userRoles: [
            'User'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'mahesh_janugade+dev_user1@bio-rad.com',
            firstName: 'mahesh',
            middleName: '',
            lastName: 'janugade',
            name: 'mahesh janugade',
            email: 'mahesh_janugade+dev_user1@bio-rad.com',
            phone: '',
            id: 'e698c9cc-eca4-464a-a54b-2e2524887e73',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: '8ec9544f-059c-4351-87a5-4a04c2f33c28',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: null,
            id: '8ec9544f-059c-4351-87a5-4a04c2f33c28',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
              comments: '',
              primaryUnityLabNumbers: '',
              migrationStatus: '',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: '8ec9544f-059c-4351-87a5-4a04c2f33c28',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        },
        {
          displayName: 'Nikita Pawar',
          contactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
          userOktaId: '00u6atq71s2yUBNJr2p7',
          userRoles: [
            'Admin'
          ],
          contactInfo: {
            entityType: 0,
            searchAttribute: 'nikita_pawar+dev22@bio-rad.com',
            firstName: 'Nikita',
            middleName: '',
            lastName: 'Pawar',
            name: 'Nikita Pawar',
            email: 'nikita_pawar+dev22@bio-rad.com',
            phone: '',
            id: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
            }
          },
          preferences: {
            entityType: 2,
            searchAttribute: '9b576ae9-6352-4425-9b7d-399caa26c6f8',
            lastSelectedEntityId: null,
            lastSelectedEntityType: 0,
            termsAcceptedDateTime: '2020-02-12T08:43:41.866Z',
            id: '9b576ae9-6352-4425-9b7d-399caa26c6f8',
            featureInfo: {
              uniqueServiceName: 'Portal.Core.Models.UserPreferences/Portal.Core.Models.UserPreferences'
            }
          },
          parentAccounts: [
            {
              displayName: '100503',
              accountNumber: '100503',
              formattedAccountNumber: 'U100503',
              sapNumber: '',
              orderNumber: '',
              accountAddressId: '65114ca9-6bb6-4474-ba3d-12d142026907',
              accountContactId: '7080a74b-3c8b-4ba9-9b8d-b68fa8c83957',
              accountLicenseType: 0,
              licensedProducts: [
                {
                  product: 1,
                  fileOption: 0
                }
              ],
              licenseNumberUsers: 20,
              accountContact: null,
              accountAddress: null,
              licenseAssignDate: '2020-02-12T08:36:41.324Z',
              licenseExpirationDate: '2020-07-12T18:30:00Z',
              comments: '',
              primaryUnityLabNumbers: '',
              migrationStatus: '',
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
                id: '04c21413-6775-4c50-9a2a-a9a2c028a139',
                parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
                parentNode: null,
                nodeType: 9,
                children: null
              },
              id: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
              parentNodeId: 'ROOT',
              parentNode: null,
              nodeType: 0,
              children: null
            }
          ],
          id: '9b576ae9-6352-4425-9b7d-399caa26c6f8',
          parentNodeId: '9fb217cb-81d5-4fa3-93f6-f8b7acbb2c52',
          parentNode: null,
          nodeType: 7,
          children: []
        }
      ]
    }
  };

  const StateArray = {
    security: securityData
  };

  const mockBrPermissionsService = {
    hasAccess: () => { },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
      declarations: [MappingComponent],
      providers: [
        TranslateService,
        { provide: MessageSnackBarService, useValue: MessageSnackBarService },
        { provide: MappingService, useValue: mockService },
        { provide: HeaderService, usevalue: headerServiceMock },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: Store, useValue: StateArray },
        provideMockStore(mockState),
        HttpClient
      ]
    })
      .compileComponents();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    store.setState(StateArray);
    fixture = TestBed.createComponent(MappingComponent);
    component = fixture.componentInstance;
    _headerService = TestBed.get(HeaderService);
    _connectivityMapService = TestBed.get(MappingService);
    component.accountId = 'd1de4052-28a5-479f-b637-ef258e0e2578';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call to choose component as instrument', () => {
    spyOn(_headerService, 'getDialogComponentMapping').and.returnValue(
      of({
        componentName: 'instrument'
      })
    );
    spyOn(component, 'chooseComponent').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.chooseComponent).toHaveBeenCalledWith('instrument');
  });

  it('should call to choose component as product', () => {
    spyOn(_headerService, 'getDialogComponentMapping').and.returnValue(
      of({
        componentName: 'product'
      })
    );
    spyOn(component, 'chooseComponent').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.chooseComponent).toHaveBeenCalledWith('product');
  });

  it('should call to choose component as test', () => {
    spyOn(_headerService, 'getDialogComponentMapping').and.returnValue(
      of({
        componentName: 'test'
      })
    );
    spyOn(component, 'chooseComponent').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.chooseComponent).toHaveBeenCalledWith('test');
  });

  it('should dispatch update connectivity tree state', () => {
    SpyonStore = spyOn(store, 'dispatch');
    spyOn(_connectivityMapService, 'getFullTree').and.returnValue(
      of(fullTree)
    ).and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(SpyonStore).toHaveBeenCalledTimes(1);
  });

  it('should call processConnectivityMapData', () => {
    spyOn(_connectivityMapService, 'createConnectivityMapTrees').and.callThrough();
    spyOn(_connectivityMapService, 'createCardAndDropdownLabData').and.callThrough();
    spyOn(component, 'processConnectivityMapData').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.processConnectivityMapData).toHaveBeenCalled();
  });
});
