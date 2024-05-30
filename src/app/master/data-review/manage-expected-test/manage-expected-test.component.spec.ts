// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'br-component-library';
import { cloneDeep } from 'lodash';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ManageExpectedTestComponent } from './manage-expected-test.component';
import { HttpLoaderFactory } from '../../../app.module';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { UserRole } from '../../../contracts/enums/user-role.enum';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../shared/locale/locale-converter.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../../contracts/models/shared/br-error.model';
import { DataReviewService } from '../../../shared/api/data-review.service';
import { UserManageExpectedTestsSettings } from '../../../contracts/models/data-review/data-review-info.model';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';

describe('ManageExpectedTestComponent', () => {
  let component: ManageExpectedTestComponent;
  let fixture: ComponentFixture<ManageExpectedTestComponent>;

  const mockCurrentLabLocation = {
    children: [{
        "displayName": "Test",
        "departmentName": "Test",
        "departmentManagerId": "aa2627ad-873f-42d4-a7dd-06e03fc033bd",
        "id": "e04e3556-139e-4804-bc62-f743e082bfe9",
        "parentNodeId": "a0f2fdd8-ae79-40bb-abf3-239cfc0ce682",
        "nodeType": 3,
        "isArchived": false,
        "sortOrder": 0,
        "isUnavailable": false,
        "unavailableReasonCode": "",
        "children": null
    }],
    locationTimeZone: 'America/Los_Angeles',
    locationOffset: '',
    locationDayLightSaving: '',
    nodeType: 2,
    labLocationName: '',
    labLocationContactId: '',
    labLocationAddressId: '',
    labLocationContact: null,
    labLocationAddress: null,
    id: 'aa12fdd8-ae79-40bb-abf3-239cfc0ce682',
    parentNodeId: '',
    displayName: '',
    contactRoles: [UserRole.Technician, UserRole.LabSupervisor],
    locationSettings: {
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
      id: 'ee5b3412-679a-4201-97f4-c6df45bcfab6',
      parentNodeId: 'aaf2fdd8-ae79-40bb-abf3-239cfc0ce682',
      parentNode: null,
      nodeType: 9,
      children: null,
      isLabSetupCompleted: true
    },
    previousContactUserId: null
  };

  const mockAppNavigationTrackingService = {
    logAuditTracking: () => { },
    prepareAuditTrailPayload: () => {}
  };

  const mockDepartment = {
    "displayName": "Test",
    "departmentName": "Test",
    "departmentManagerId": "aa2627ad-873f-42d4-a7dd-06e03fc033bd",
    "departmentManager": {
        "entityType": 0,
        "searchAttribute": "devtechtest@bio-rad.com",
        "firstName": "DevLeadTech",
        "middleName": "",
        "lastName": "Test",
        "name": "DevLeadTech Test",
        "email": "devtechtest@bio-rad.com",
        "phone": "",
        "id": "aa17cda1-a95f-4ac5-8d8f-665717c95e82"
    },
    "id": "e04e3556-139e-4804-bc62-f743e082bfe9",
    "parentNodeId": "aaf2fdd8-ae79-40bb-abf3-239cfc0ce682",
    "nodeType": 3,
    "isArchived": false,
    "sortOrder": 0,
    "isUnavailable": false,
    "unavailableReasonCode": "",
    "children": [
        {
            "displayName": "Advanced Instrument",
            "instrumentId": "3439",
            "instrumentCustomName": "",
            "instrumentSerial": "",
            "instrumentInfo": {
                "id": 3439,
                "name": "Advanced Instrument",
                "manufacturerId": 1,
                "manufacturerName": "Abbott"
            },
            "id": "abc8d71e-db65-410a-a564-f9e8fd4f825d",
            "parentNodeId": "bd4e3556-139e-4804-bc62-f743e082bfe9",
            "nodeType": 4,
            "isArchived": false,
            "sortOrder": 0,
            "isUnavailable": false,
            "unavailableReasonCode": "",
            "children": [
                {
                    "id": "d4686eec-df74-44c3-9a61-5ce8c7dff99a",
                    "parentNodeId": "abc8d71e-db65-410a-a564-f9e8fd4f825d",
                    "nodeType": 5,
                    "displayName": "Assayed Chemistry",
                    "productId": "2",
                    "productMasterLotId": "1550",
                    "productCustomName": "",
                    "isArchived": false,
                    "sortOrder": 0,
                    "isUnavailable": false,
                    "unavailableReasonCode": "",
                    "productInfo": {
                        "id": 2,
                        "name": "Assayed Chemistry",
                        "manufacturerId": 2,
                        "manufacturerName": "Bio-Rad",
                        "matrixId": 3,
                        "matrixName": "Serum"
                    },
                    "lotInfo": {
                        "id": 1550,
                        "productId": 2,
                        "productName": "Assayed Chemistry",
                        "lotNumber": "89710",
                        "expirationDate": "2024-11-30T00:00:00Z"
                    },
                    "productLotLevels": [
                        {
                            "id": "3129",
                            "productMasterLotId": "1550",
                            "productId": "2",
                            "productMasterLotNumber": "89710",
                            "lotNumber": "89711",
                            "level": 1,
                            "levelDescription": "Level 1"
                        },
                        {
                            "id": "3130",
                            "productMasterLotId": "1550",
                            "productId": "2",
                            "productMasterLotNumber": "89710",
                            "lotNumber": "89712",
                            "level": 2,
                            "levelDescription": "Level 2"
                        }
                    ],
                    "children": [
                        {
                            "id": "aad0d15c-46fd-46b4-b88c-a9246184c9bc",
                            "displayName": "Acetaminophen",
                            "testId": "7537",
                            "testSpecId": "8262",
                            "labUnitId": "63",
                            "correlatedTestSpecId": "",
                            "testSpecInfo": {
                                "id": 8262,
                                "testId": 7537,
                                "analyteStorageUnitId": 667,
                                "analyteId": 4,
                                "analyteName": "Acetaminophen",
                                "methodId": 112,
                                "methodName": "Enzymatic, colorimetric",
                                "instrumentId": 3439,
                                "instrumentName": "Advanced Instrument",
                                "reagentId": 1105,
                                "reagentManufacturerId": "1",
                                "reagentManufacturerName": "Abbott",
                                "reagentName": "SEKURE Acetaminophen L3K",
                                "reagentLotId": 2206,
                                "reagentLotNumber": "ACETAL3K-1",
                                "reagentLot": {
                                    "id": 2206,
                                    "reagentId": 1105,
                                    "lotNumber": "ACETAL3K-1",
                                    "shelfExpirationDate": "2025-08-01T00:00:00Z"
                                },
                                "storageUnitId": 3,
                                "storageUnitName": "µg/mL",
                                "calibratorId": 257,
                                "calibratorManufacturerId": "1",
                                "calibratorManufacturerName": "Abbott",
                                "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
                                "calibratorLotId": 1247,
                                "calibratorLotNumber": "ACETA-CAL-L3K-1",
                                "calibratorLot": {
                                    "id": 1247,
                                    "calibratorId": 257,
                                    "lotNumber": "ACETA-CAL-L3K-1",
                                    "shelfExpirationDate": "2025-08-01T00:00:00Z"
                                }
                            },
                            "parentNodeId": "d4686eec-df74-44c3-9a61-5ce8c7dff99a",
                            "nodeType": 6,
                            "isArchived": false,
                            "sortOrder": 0,
                            "isUnavailable": false,
                            "unavailableReasonCode": "",
                            "allTestSpecIds": [
                                8262
                            ],
                            "isRemapRequired": false,
                            "levelSettings": {
                                "levelEntityName": "LevelSetting",
                                "parentLevelEntityId": "44d0d15c-46fd-46b4-b88c-a9246184c9bc",
                                "parentLevelEntityName": "LabTest",
                                "minNumberOfPoints": 0,
                                "runLength": 0,
                                "dataType": 0,
                                "targets": null,
                                "rules": null,
                                "levels": [
                                    {
                                        "levelInUse": true,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": true,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    }
                                ],
                                "id": "f572eae6-e6ab-4947-b9db-8fb91b4099d7",
                                "parentNodeId": "44d0d15c-46fd-46b4-b88c-a9246184c9bc",
                                "nodeType": 8,
                                "displayName": "f572eae6-e6ab-4947-b9db-8fb91b4099d7",
                                "isUnavailable": false,
                                "unavailableReasonCode": ""
                            }
                        }
                    ],
                    "levelSettings": {
                        "levelEntityName": "LevelSetting",
                        "parentLevelEntityId": "d4686eec-df74-44c3-9a61-5ce8c7dff99a",
                        "parentLevelEntityName": "LabProduct",
                        "minNumberOfPoints": 0,
                        "runLength": 0,
                        "dataType": 0,
                        "targets": null,
                        "rules": null,
                        "levels": [
                            {
                                "levelInUse": true,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": true,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            }
                        ],
                        "id": "d5b04348-09fc-4457-8d45-3761a61879e1",
                        "parentNodeId": "d4686eec-df74-44c3-9a61-5ce8c7dff99a",
                        "nodeType": 8,
                        "displayName": "d5b04348-09fc-4457-8d45-3761a61879e1",
                        "isUnavailable": false,
                        "unavailableReasonCode": ""
                    }
                }
            ]
        },
        {
            "displayName": "AU2700",
            "instrumentId": "2299",
            "instrumentCustomName": "",
            "instrumentSerial": "",
            "instrumentInfo": {
                "id": 2299,
                "name": "AU2700",
                "manufacturerId": 14,
                "manufacturerName": "Beckman Coulter"
            },
            "id": "ba18859a-5076-42a6-8478-e56a16a40a01",
            "parentNodeId": "bd4e3556-139e-4804-bc62-f743e082bfe9",
            "nodeType": 4,
            "isArchived": false,
            "sortOrder": 0,
            "isUnavailable": false,
            "unavailableReasonCode": "",
            "children": [
                {
                    "id": "dc20ca25-92fa-46c2-b20d-40817c8d6ae3",
                    "parentNodeId": "ba18859a-5076-42a6-8478-e56a16a40a01",
                    "nodeType": 5,
                    "displayName": "Assayed Chemistry",
                    "productId": "2",
                    "productMasterLotId": "1651",
                    "productCustomName": "",
                    "isArchived": false,
                    "sortOrder": 0,
                    "isUnavailable": false,
                    "unavailableReasonCode": "",
                    "productInfo": {
                        "id": 2,
                        "name": "Assayed Chemistry",
                        "manufacturerId": 2,
                        "manufacturerName": "Bio-Rad",
                        "matrixId": 3,
                        "matrixName": "Serum"
                    },
                    "lotInfo": {
                        "id": 1651,
                        "productId": 2,
                        "productName": "Assayed Chemistry",
                        "lotNumber": "89700",
                        "expirationDate": "2027-12-31T00:00:00Z"
                    },
                    "productLotLevels": [
                        {
                            "id": "3201",
                            "productMasterLotId": "1651",
                            "productId": "2",
                            "productMasterLotNumber": "89700",
                            "lotNumber": "89701",
                            "level": 1,
                            "levelDescription": "Level 1"
                        },
                        {
                            "id": "3202",
                            "productMasterLotId": "1651",
                            "productId": "2",
                            "productMasterLotNumber": "89700",
                            "lotNumber": "89702",
                            "level": 2,
                            "levelDescription": "Level 2"
                        }
                    ],
                    "children": [
                        {
                            "id": "66558b9e-0d73-43bf-a066-d24ab8ccae08",
                            "displayName": "Amylase",
                            "testId": "1067",
                            "testSpecId": "8279",
                            "labUnitId": "56",
                            "correlatedTestSpecId": "",
                            "testSpecInfo": {
                                "id": 8279,
                                "testId": 1067,
                                "analyteStorageUnitId": 40,
                                "analyteId": 31,
                                "analyteName": "Amylase",
                                "methodId": 359,
                                "methodName": "G7 PNP, Blocked - IFCC Ref. Proc., Calibrated",
                                "instrumentId": 2299,
                                "instrumentName": "AU2700",
                                "reagentId": 699,
                                "reagentManufacturerId": "14",
                                "reagentManufacturerName": "Beckman Coulter",
                                "reagentName": "Alpha Amylase REF OSR6182",
                                "reagentLotId": 9,
                                "reagentLotNumber": "Unspecified ***",
                                "reagentLot": {
                                    "id": 9,
                                    "reagentId": 699,
                                    "lotNumber": "Unspecified ***",
                                    "shelfExpirationDate": "2068-11-05T14:57:48.68Z"
                                },
                                "storageUnitId": 56,
                                "storageUnitName": "U/L",
                                "calibratorId": 5,
                                "calibratorManufacturerId": "14",
                                "calibratorManufacturerName": "Beckman Coulter",
                                "calibratorName": "Cal 66300",
                                "calibratorLotId": 1216,
                                "calibratorLotNumber": "Cal lot 663001",
                                "calibratorLot": {
                                    "id": 1216,
                                    "calibratorId": 5,
                                    "lotNumber": "Cal lot 663001",
                                    "shelfExpirationDate": "2025-06-28T00:00:00Z"
                                }
                            },
                            "parentNodeId": "dc20ca25-92fa-46c2-b20d-40817c8d6ae3",
                            "nodeType": 6,
                            "isArchived": false,
                            "sortOrder": 0,
                            "isUnavailable": false,
                            "unavailableReasonCode": "",
                            "allTestSpecIds": [
                                8279
                            ],
                            "isRemapRequired": false,
                            "levelSettings": {
                                "levelEntityName": "LevelSetting",
                                "parentLevelEntityId": "66558b9e-0d73-43bf-a066-d24ab8ccae08",
                                "parentLevelEntityName": "LabTest",
                                "minNumberOfPoints": 0,
                                "runLength": 0,
                                "dataType": 1,
                                "targets": null,
                                "rules": null,
                                "levels": [
                                    {
                                        "levelInUse": true,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": true,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    }
                                ],
                                "id": "48ae019e-f73f-4343-b919-08a718541c1d",
                                "parentNodeId": "66558b9e-0d73-43bf-a066-d24ab8ccae08",
                                "nodeType": 8,
                                "displayName": "48ae019e-f73f-4343-b919-08a718541c1d",
                                "isUnavailable": false,
                                "unavailableReasonCode": ""
                            }
                        },
                        {
                            "id": "eb425521-21a2-4261-b295-33657908fb16",
                            "displayName": "ALT (ALAT/GPT)",
                            "testId": "1086",
                            "testSpecId": "9111",
                            "labUnitId": "56",
                            "correlatedTestSpecId": "",
                            "testSpecInfo": {
                                "id": 9111,
                                "testId": 1086,
                                "analyteStorageUnitId": 23,
                                "analyteId": 20,
                                "analyteName": "ALT (ALAT/GPT)",
                                "methodId": 138,
                                "methodName": "UV without P5P",
                                "instrumentId": 2299,
                                "instrumentName": "AU2700",
                                "reagentId": 696,
                                "reagentManufacturerId": "14",
                                "reagentManufacturerName": "Beckman Coulter",
                                "reagentName": "ALT REF OSR6X07",
                                "reagentLotId": 6,
                                "reagentLotNumber": "Unspecified ***",
                                "reagentLot": {
                                    "id": 6,
                                    "reagentId": 696,
                                    "lotNumber": "Unspecified ***",
                                    "shelfExpirationDate": "2068-11-05T14:57:47.9Z"
                                },
                                "storageUnitId": 56,
                                "storageUnitName": "U/L",
                                "calibratorId": 5,
                                "calibratorManufacturerId": "14",
                                "calibratorManufacturerName": "Beckman Coulter",
                                "calibratorName": "Cal 66300",
                                "calibratorLotId": 1216,
                                "calibratorLotNumber": "Cal lot 663001",
                                "calibratorLot": {
                                    "id": 1216,
                                    "calibratorId": 5,
                                    "lotNumber": "Cal lot 663001",
                                    "shelfExpirationDate": "2025-06-28T00:00:00Z"
                                }
                            },
                            "parentNodeId": "dc20ca25-92fa-46c2-b20d-40817c8d6ae3",
                            "nodeType": 6,
                            "isArchived": false,
                            "sortOrder": 0,
                            "isUnavailable": false,
                            "unavailableReasonCode": "",
                            "allTestSpecIds": [
                                9111
                            ],
                            "isRemapRequired": false,
                            "levelSettings": {
                                "levelEntityName": "LevelSetting",
                                "parentLevelEntityId": "eb425521-21a2-4261-b295-33657908fb16",
                                "parentLevelEntityName": "LabTest",
                                "minNumberOfPoints": 0,
                                "runLength": 0,
                                "dataType": 0,
                                "targets": null,
                                "rules": null,
                                "levels": [
                                    {
                                        "levelInUse": true,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": true,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    },
                                    {
                                        "levelInUse": false,
                                        "decimalPlace": 2
                                    }
                                ],
                                "id": "866657d4-5b68-4d01-b94f-b7ede1c55697",
                                "parentNodeId": "eb425521-21a2-4261-b295-33657908fb16",
                                "nodeType": 8,
                                "displayName": "866657d4-5b68-4d01-b94f-b7ede1c55697",
                                "isUnavailable": false,
                                "unavailableReasonCode": ""
                            }
                        }
                    ],
                    "levelSettings": {
                        "levelEntityName": "LevelSetting",
                        "parentLevelEntityId": "dc20ca25-92fa-46c2-b20d-40817c8d6ae3",
                        "parentLevelEntityName": "LabProduct",
                        "minNumberOfPoints": 0,
                        "runLength": 0,
                        "dataType": 0,
                        "targets": null,
                        "rules": null,
                        "levels": [
                            {
                                "levelInUse": true,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": true,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            },
                            {
                                "levelInUse": false,
                                "decimalPlace": 2
                            }
                        ],
                        "id": "3a8e4ac8-3380-44de-82c2-020bc3a16932",
                        "parentNodeId": "dc20ca25-92fa-46c2-b20d-40817c8d6ae3",
                        "nodeType": 8,
                        "displayName": "3a8e4ac8-3380-44de-82c2-020bc3a16932",
                        "isUnavailable": false,
                        "unavailableReasonCode": ""
                    }
                }
            ]
        }
      ]
    };

  const mockPortalApiService = jasmine.createSpyObj('LabTestService', {
    getLabSetupNode: of(mockDepartment)
  });

  const dialogData = {
    labLocation: mockCurrentLabLocation
  };

  const userExpectedTestsSettings = {
    "labLocationId": "aa12fdd8-ae79-40bb-abf3-239cfc0ce682",
    "expectedTests": [
        {
            "labLotTestId": "aad0d15c-46fd-46b4-b88c-a9246184c9bc",
            "level": 1,
            "isSelected": true
        },
        {
            "labLotTestId": "aad0d15c-46fd-46b4-b88c-a9246184c9bc",
            "level": 2,
            "isSelected": true
        }
    ]
  } as UserManageExpectedTestsSettings;

  const mockDataReviewService = {
    getExpectedTests: () => {
      return of(userExpectedTestsSettings);
    },
    putExpectedTests: () => {
      return of();
    }
  };

  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  let hasPermission = false;
  const mockBrPermissionsService = {
    hasAccess: () => hasPermission,
  };

  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientModule,
        MaterialModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ ManageExpectedTestComponent ],
      providers: [
        TranslateService,
        ChangeTrackerService,
        DateTimeHelper,
        LocaleConverter,
        { provide: FormBuilder, useValue: formBuilder },
        { provide: PortalApiService, useValue: mockPortalApiService },
        { provide: DataReviewService, useValue: mockDataReviewService },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: {} },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageExpectedTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load expected tests', () => {
    const labLocationNode = fixture.debugElement.nativeElement.querySelector('#' + mockCurrentLabLocation.id);
    expect(labLocationNode).not.toBeNull();
    expect(labLocationNode.innerHTML).toContain(mockCurrentLabLocation.displayName);
    const departmentNode = fixture.debugElement.nativeElement.querySelector('#' + mockDepartment.id);
    expect(departmentNode).not.toBeNull();
    expect(departmentNode.innerHTML).toContain(mockDepartment.displayName);

    const instrumentNode1 = fixture.debugElement.nativeElement.querySelector('#' + mockDepartment.children[0].id);
    expect(instrumentNode1).not.toBeNull();
    expect(instrumentNode1.innerHTML).toContain(mockDepartment.children[0].displayName);
    const productNode1 = fixture.debugElement.nativeElement.querySelector('#' + mockDepartment.children[0].children[0].id);
    expect(productNode1).not.toBeNull();
    expect(productNode1.innerHTML).toContain(mockDepartment.children[0].children[0].displayName);
    const testNode1 = fixture.debugElement.nativeElement.querySelector('#' + mockDepartment.children[0].children[0].children[0].id);
    expect(testNode1).not.toBeNull();
    expect(testNode1.innerHTML).toContain(mockDepartment.children[0].children[0].children[0].displayName);

    const instrumentNode2 = fixture.debugElement.nativeElement.querySelector('#' + mockDepartment.children[1].id);
    expect(instrumentNode2).not.toBeNull();
    expect(instrumentNode2.innerHTML).toContain(mockDepartment.children[1].displayName);
    const productNode2 = fixture.debugElement.nativeElement.querySelector('#' + mockDepartment.children[1].children[0].id);
    expect(productNode2).not.toBeNull();
    expect(productNode2.innerHTML).toContain(mockDepartment.children[1].children[0].displayName);
    const testNode2 = fixture.debugElement.nativeElement.querySelector('#' + mockDepartment.children[1].children[0].children[0].id);
    expect(testNode2).not.toBeNull();
    expect(testNode2.innerHTML).toContain(mockDepartment.children[1].children[0].children[0].displayName);

    expect(component.formGroup.controls).toBeDefined();
    expect(Object.keys(component.formGroup.controls)).toHaveSize(4);
    expect(component.formGroup.controls[`${mockDepartment.children[0].children[0].children[0].id}_1`]).toBeDefined();
    expect(component.formGroup.controls[`${mockDepartment.children[0].children[0].children[0].id}_1`].value).toBeTrue();
    expect(component.formGroup.controls[`${mockDepartment.children[0].children[0].children[0].id}_2`]).toBeDefined();
    expect(component.formGroup.controls[`${mockDepartment.children[0].children[0].children[0].id}_2`].value).toBeTrue();
    expect(component.formGroup.controls[`${mockDepartment.children[1].children[0].children[0].id}_1`]).toBeDefined();
    expect(component.formGroup.controls[`${mockDepartment.children[1].children[0].children[0].id}_1`].value).toBeFalse();
    expect(component.formGroup.controls[`${mockDepartment.children[1].children[0].children[0].id}_2`]).toBeDefined();
    expect(component.formGroup.controls[`${mockDepartment.children[1].children[0].children[0].id}_2`].value).toBeFalse();
  });

  it('should request selections to apply', () => {
    const putExpectedTestsSpy = spyOn(mockDataReviewService, 'putExpectedTests').and.callThrough();
    const prepareAuditTrailPayloadSpy = spyOn(mockAppNavigationTrackingService, 'prepareAuditTrailPayload').and.callThrough();

    component.saveExpectedTests();
    expect(prepareAuditTrailPayloadSpy).toHaveBeenCalled();
    expect(mockDataReviewService.putExpectedTests).toHaveBeenCalledTimes(1);
    const putExpectedTestsArgs: Array<Array<UserManageExpectedTestsSettings>> = cloneDeep(putExpectedTestsSpy.calls.allArgs());
    expect(putExpectedTestsArgs).toHaveSize(1);
    const userManageExpectedTestsSettings = putExpectedTestsArgs[0][0];
    expect(userManageExpectedTestsSettings.labLocationId).toEqual(mockCurrentLabLocation.id);
    expect(userManageExpectedTestsSettings.expectedTests).toHaveSize(2);
    expect(userManageExpectedTestsSettings.expectedTests[0].labLotTestId).toEqual(userExpectedTestsSettings.expectedTests[0].labLotTestId);
    expect(userManageExpectedTestsSettings.expectedTests[0].level).toEqual(userExpectedTestsSettings.expectedTests[0].level);
    expect(userManageExpectedTestsSettings.expectedTests[0].isSelected).toEqual(userExpectedTestsSettings.expectedTests[0].isSelected);
    expect(userManageExpectedTestsSettings.expectedTests[1].labLotTestId).toEqual(userExpectedTestsSettings.expectedTests[1].labLotTestId);
    expect(userManageExpectedTestsSettings.expectedTests[1].level).toEqual(userExpectedTestsSettings.expectedTests[1].level);
    expect(userManageExpectedTestsSettings.expectedTests[1].isSelected).toEqual(userExpectedTestsSettings.expectedTests[1].isSelected);
  });
});
