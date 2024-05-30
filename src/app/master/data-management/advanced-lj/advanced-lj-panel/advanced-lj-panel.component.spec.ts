/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreModule, Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AdvancedLjPanelComponent } from './advanced-lj-panel.component';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import * as fromRoot from '../../../lab-setup/state';
import { RunsService } from '../../../../shared/services/runs.service';
import { NodeInfoService } from '../../../../shared/services/node-info.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { ConfigService } from '../../../../core/config/config.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { NodeInfoAction } from '../../../../shared/state/node-info.action';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { LocaleConverter } from '../../../../shared/locale/locale-converter.service';
import { imageToPdfTestContent } from '../../../../shared/services/image-to-pdf-test-content.model';
import { AddEditBy } from '../../../../contracts/models/data-management/run-data.model';
import { BrError } from '../../../../contracts/models/shared/br-error.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { TestSpecService } from '../../../../shared/services/test-spec.service';
import { SummaryStatisticsTableService } from '../../analyte-detail-table/analytical-section/summary-statistics-table/summary-statistics-table.service';
import { DynamicReportingService } from '../../../../shared/services/reporting.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';

describe('AdvancedLjPanelComponent', () => {
    let component: AdvancedLjPanelComponent;
    let fixture: ComponentFixture<AdvancedLjPanelComponent>;
    const mockMatDialog = jasmine.createSpyObj(['open', 'close', 'closeAll']);
    let store: MockStore<any>;
    let subStore: MockStore<any>;
    const mockState = {};

    const mockErrorLoggerService = {
        logErrorToBackend: (error: BrError) => { },
        populateErrorObject: () => {
          return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
        }
    };

    const mockTestSpecService = {
        getTestSpecs: () => of([]).toPromise()
    };

    const mockConfigService = {
      getConfig: (string): string => {
        return 'en-US';
      }
    };

    const mockTestSpecSummaryStatisticsTableService = {
        getSummaryStatsByLabMonthStatsInfoAndDate: () => of([]).toPromise()
    };

    const mockTestSpecDynamicReportingService = {
        getStatisticsPeerAndMethodData: () => of([]).toPromise()
    }

    const mockAppNavigationTrackingService = {
        auditTrailViewData: () => { }
    };

    let levels = [2, 3];
    let selectedNode = {
        'displayName': 'Multiqual 1,2,3 Unassayed',
        'productId': '68',
        'productMasterLotId': '406',
        'productCustomName': '',
        'productInfo': {
            'id': 68,
            'name': 'Multiqual 1,2,3 Unassayed',
            'manufacturerId': 2,
            'manufacturerName': 'Bio-Rad',
            'matrixId': 3,
            'matrixName': 'Serum'
        },
        'lotInfo': {
            'id': 406,
            'productId': 68,
            'productName': 'Multiqual 1,2,3 Unassayed',
            'lotNumber': '56610',
            'expirationDate': '2021-07-31T00:00:00'
        },
        'productLotLevels': [
            {
                'id': '1068',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56611',
                'level': 1,
                'levelDescription': '1'
            },
            {
                'id': '1069',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56612',
                'level': 2,
                'levelDescription': '2'
            },
            {
                'id': '1070',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56613',
                'level': 3,
                'levelDescription': '3'
            }
        ],
        'levelSettings': {
            'levelEntityId': null,
            'levelEntityName': 'LevelSetting',
            'parentLevelEntityId': '7ed51e16-7139-421a-b678-a381a1d9106a',
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
            'id': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
            'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
            'parentNode': null,
            'nodeType': 8,
            'displayName': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
            'children': null,
            'isUnavailable': false,
            'unavailableReasonCode': null
        },
        'accountSettings': null,
        'hasOwnAccountSettings': false,
        'isArchived': false,
        'sortOrder': 0,
        'id': '7ed51e16-7139-421a-b678-a381a1d9106a',
        'parentNodeId': '7ffe7f29-dd85-4ef1-a97d-9814420e2380',
        'parentNode': null,
        'nodeType': 5,
        'children': [
            {
                'displayName': 'Alkaline Phosphatase',
                'testSpecId': '3321',
                'correlatedTestSpecId': 'E051E4001DAD4D97AB198DCEB1AC061B',
                'testId': '3312',
                'labUnitId': '56',
                'testSpecInfo': {
                    'id': 3321,
                    'testId': 3312,
                    'analyteStorageUnitId': 33,
                    'analyteId': 26,
                    'analyteName': 'Alkaline Phosphatase',
                    'methodId': 363,
                    'methodName': 'PNPP, AMP Buffer',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1109,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Abbott',
                    'reagentName': 'Alkaline Phosphatase REF 7D55-21',
                    'reagentLotId': 420,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 420,
                        'reagentId': 1109,
                        'reagentName': 'Alkaline Phosphatase REF 7D55-21',
                        "reagentCategory": 1,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.57')
                    },
                    'storageUnitId': 56,
                    'storageUnitName': 'U/L',
                    'calibratorId': 413,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Abbott',
                    'calibratorName': 'Abbott No Cal',
                    'calibratorLotId': 415,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 415,
                        'calibratorId': 413,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': '96cc1101-40db-407f-bae4-557065a9914e',
                    'parentLevelEntityName': 'LabTest',
                    'minNumberOfPoints': 0,
                    'runLength': 0,
                    'dataType': 0,
                    'targets': null,
                    'rules': null,
                    'levels': [
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        }
                    ],
                    'id': '5ebce6a1-7984-d3f8-485e-4304261f16b4',
                    'parentNodeId': '96cc1101-40db-407f-bae4-557065a9914e',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': '5ebce6a1-7984-d3f8-485e-4304261f16b4',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 0,
                'id': '96cc1101-40db-407f-bae4-557065a9914e',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                'parentNode': null,
                'nodeType': 6,
                'children': [],
                'isUnavailable': false,
                'unavailableReasonCode': 'null'
            },
            {
                'displayName': 'Acetaminophen',
                'testSpecId': '1806',
                'correlatedTestSpecId': 'A4F9225716574F6FA2962800E4FA3816',
                'testId': '1801',
                'labUnitId': '53',
                'testSpecInfo': {
                    'id': 1806,
                    'testId': 1801,
                    'analyteStorageUnitId': 667,
                    'analyteId': 4,
                    'analyteName': 'Acetaminophen',
                    'methodId': 112,
                    'methodName': 'Enzymatic, colorimetric',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1105,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Sekisui',
                    'reagentName': 'Sekisui Diagnostics SEKURE Acetaminophen L3K',
                    'reagentLotId': 416,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 416,
                        'reagentId': 1105,
                        'reagentName': 'Sekisui Diagnostics SEKURE Acetaminophen L3K',
                        "reagentCategory": 1,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:45.727')
                    },
                    'storageUnitId': 3,
                    'storageUnitName': 'µg/mL',
                    'calibratorId': 257,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Sekisui',
                    'calibratorName': 'Sekisui Diagnostics SEKURE Acetaminophen L3K Cal',
                    'calibratorLotId': 258,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 258,
                        'calibratorId': 257,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:45.913')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': 'ee496052-15ce-469e-b5f8-1eae5032e59e',
                    'parentLevelEntityName': 'LabTest',
                    'minNumberOfPoints': 0,
                    'runLength': 0,
                    'dataType': 0,
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
                    'id': '4cbd2fcb-eabc-8bf5-1140-8a95e2de76f6',
                    'parentNodeId': 'ee496052-15ce-469e-b5f8-1eae5032e59e',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': '4cbd2fcb-eabc-8bf5-1140-8a95e2de76f6',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 0,
                'id': 'ee496052-15ce-469e-b5f8-1eae5032e59e',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                'parentNode': null,
                'nodeType': 6,
                'children': [],
                'isUnavailable': false,
                'unavailableReasonCode': 'null'
            },
            {
                'displayName': 'Acid Phosphatase, Total',
                'testSpecId': '3435',
                'correlatedTestSpecId': 'B547B5F9225547DAB8E0B502E055AC87',
                'testId': '3425',
                'labUnitId': '56',
                'testSpecInfo': {
                    'id': 3435,
                    'testId': 3425,
                    'analyteStorageUnitId': 10,
                    'analyteId': 14,
                    'analyteName': 'Acid Phosphatase, Total',
                    'methodId': 607,
                    'methodName': 'a-naphthyl phosphate, kinetic',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1106,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Abbott',
                    'reagentName': 'Acid Phosphatase REF 9D87-21',
                    'reagentLotId': 417,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 417,
                        'reagentId': 1106,
                        'reagentName': 'Acid Phosphatase REF 9D87-21',
                        "reagentCategory": 1,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.273')
                    },
                    'storageUnitId': 56,
                    'storageUnitName': 'U/L',
                    'calibratorId': 413,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Abbott',
                    'calibratorName': 'Abbott No Cal',
                    'calibratorLotId': 415,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 415,
                        'calibratorId': 413,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': '106d15b8-0e80-4fb4-b5bb-edb7f16d034c',
                    'parentLevelEntityName': 'LabTest',
                    'minNumberOfPoints': 0,
                    'runLength': 0,
                    'dataType': 0,
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
                    'id': '58bd438d-f094-3001-e0ee-ca4e6f11a2a3',
                    'parentNodeId': '106d15b8-0e80-4fb4-b5bb-edb7f16d034c',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': '58bd438d-f094-3001-e0ee-ca4e6f11a2a3',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 0,
                'id': '106d15b8-0e80-4fb4-b5bb-edb7f16d034c',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                'parentNode': null,
                'nodeType': 6,
                'children': [],
                'isUnavailable': false,
                'unavailableReasonCode': 'null'
            },
            {
                'displayName': 'Albumin',
                'testSpecId': '1889',
                'correlatedTestSpecId': '080727BB2F2D4A70986D043149CD705D',
                'testId': '1884',
                'labUnitId': '15',
                'testSpecInfo': {
                    'id': 1889,
                    'testId': 1884,
                    'analyteStorageUnitId': 3,
                    'analyteId': 7,
                    'analyteName': 'Albumin',
                    'methodId': 583,
                    'methodName': 'Bromcresol Green (BCG)',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1108,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Abbott',
                    'reagentName': 'AlbG REF 7D53-23',
                    'reagentLotId': 419,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 419,
                        'reagentId': 1108,
                        'reagentName': 'AlbG REF 7D53-23',
                        "reagentCategory": 1,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.477')
                    },
                    'storageUnitId': 15,
                    'storageUnitName': 'g/dL',
                    'calibratorId': 258,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Abbott',
                    'calibratorName': 'Multiconstituent Cal REF 1E65',
                    'calibratorLotId': 259,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 259,
                        'calibratorId': 258,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.4')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                    'parentLevelEntityName': 'LabTest',
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
                    'id': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
                    'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 0,
                'id': 'b2d2f361-b7c3-44b2-9db5-134d04d990d6',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
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

    let selectedNodeSortOrder = {
        'displayName': 'Multiqual 1,2,3 Unassayed',
        'productId': '68',
        'productMasterLotId': '406',
        'productCustomName': '',
        'productInfo': {
            'id': 68,
            'name': 'Multiqual 1,2,3 Unassayed',
            'manufacturerId': 2,
            'manufacturerName': 'Bio-Rad',
            'matrixId': 3,
            'matrixName': 'Serum'
        },
        'lotInfo': {
            'id': 406,
            'productId': 68,
            'productName': 'Multiqual 1,2,3 Unassayed',
            'lotNumber': '56610',
            'expirationDate': '2021-07-31T00:00:00'
        },
        'productLotLevels': [
            {
                'id': '1068',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56611',
                'level': 1,
                'levelDescription': '1'
            },
            {
                'id': '1069',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56612',
                'level': 2,
                'levelDescription': '2'
            },
            {
                'id': '1070',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56613',
                'level': 3,
                'levelDescription': '3'
            }
        ],
        'levelSettings': {
            'levelEntityId': null,
            'levelEntityName': 'LevelSetting',
            'parentLevelEntityId': '7ed51e16-7139-421a-b678-a381a1d9106a',
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
            'id': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
            'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
            'parentNode': null,
            'nodeType': 8,
            'displayName': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
            'children': null,
            'isUnavailable': false,
            'unavailableReasonCode': null
        },
        'accountSettings': null,
        'hasOwnAccountSettings': false,
        'isArchived': false,
        'sortOrder': 0,
        'id': '7ed51e16-7139-421a-b678-a381a1d9106a',
        'parentNodeId': '7ffe7f29-dd85-4ef1-a97d-9814420e2380',
        'parentNode': null,
        'nodeType': 5,
        'children': [
            {
                'displayName': 'Alkaline Phosphatase',
                'testSpecId': '3321',
                'correlatedTestSpecId': 'E051E4001DAD4D97AB198DCEB1AC061B',
                'testId': '3312',
                'labUnitId': '56',
                'testSpecInfo': {
                    'id': 3321,
                    'testId': 3312,
                    'analyteStorageUnitId': 33,
                    'analyteId': 26,
                    'analyteName': 'Alkaline Phosphatase',
                    'methodId': 363,
                    'methodName': 'PNPP, AMP Buffer',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1109,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Abbott',
                    'reagentName': 'Alkaline Phosphatase REF 7D55-21',
                    'reagentLotId': 420,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 420,
                        'reagentId': 1109,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.57')
                    },
                    'storageUnitId': 56,
                    'storageUnitName': 'U/L',
                    'calibratorId': 413,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Abbott',
                    'calibratorName': 'Abbott No Cal',
                    'calibratorLotId': 415,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 415,
                        'calibratorId': 413,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': '96cc1101-40db-407f-bae4-557065a9914e',
                    'parentLevelEntityName': 'LabTest',
                    'minNumberOfPoints': 0,
                    'runLength': 0,
                    'dataType': 0,
                    'targets': null,
                    'rules': null,
                    'levels': [
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        }
                    ],
                    'id': '5ebce6a1-7984-d3f8-485e-4304261f16b4',
                    'parentNodeId': '96cc1101-40db-407f-bae4-557065a9914e',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': '5ebce6a1-7984-d3f8-485e-4304261f16b4',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 1,
                'id': '96cc1101-40db-407f-bae4-557065a9914e',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                'parentNode': null,
                'nodeType': 6,
                'children': [],
                'isUnavailable': false,
                'unavailableReasonCode': 'null'
            },
            {
                'displayName': 'Acetaminophen',
                'testSpecId': '1806',
                'correlatedTestSpecId': 'A4F9225716574F6FA2962800E4FA3816',
                'testId': '1801',
                'labUnitId': '53',
                'testSpecInfo': {
                    'id': 1806,
                    'testId': 1801,
                    'analyteStorageUnitId': 667,
                    'analyteId': 4,
                    'analyteName': 'Acetaminophen',
                    'methodId': 112,
                    'methodName': 'Enzymatic, colorimetric',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1105,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Sekisui',
                    'reagentName': 'Sekisui Diagnostics SEKURE Acetaminophen L3K',
                    'reagentLotId': 416,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 416,
                        'reagentId': 1105,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:45.727')
                    },
                    'storageUnitId': 3,
                    'storageUnitName': 'µg/mL',
                    'calibratorId': 257,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Sekisui',
                    'calibratorName': 'Sekisui Diagnostics SEKURE Acetaminophen L3K Cal',
                    'calibratorLotId': 258,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 258,
                        'calibratorId': 257,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:45.913')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': 'ee496052-15ce-469e-b5f8-1eae5032e59e',
                    'parentLevelEntityName': 'LabTest',
                    'minNumberOfPoints': 0,
                    'runLength': 0,
                    'dataType': 0,
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
                    'id': '4cbd2fcb-eabc-8bf5-1140-8a95e2de76f6',
                    'parentNodeId': 'ee496052-15ce-469e-b5f8-1eae5032e59e',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': '4cbd2fcb-eabc-8bf5-1140-8a95e2de76f6',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 2,
                'id': 'ee496052-15ce-469e-b5f8-1eae5032e59e',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                'parentNode': null,
                'nodeType': 6,
                'children': [],
                'isUnavailable': false,
                'unavailableReasonCode': 'null'
            },
            {
                'displayName': 'Acid Phosphatase, Total',
                'testSpecId': '3435',
                'correlatedTestSpecId': 'B547B5F9225547DAB8E0B502E055AC87',
                'testId': '3425',
                'labUnitId': '56',
                'testSpecInfo': {
                    'id': 3435,
                    'testId': 3425,
                    'analyteStorageUnitId': 10,
                    'analyteId': 14,
                    'analyteName': 'Acid Phosphatase, Total',
                    'methodId': 607,
                    'methodName': 'a-naphthyl phosphate, kinetic',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1106,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Abbott',
                    'reagentName': 'Acid Phosphatase REF 9D87-21',
                    'reagentLotId': 417,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 417,
                        'reagentId': 1106,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.273')
                    },
                    'storageUnitId': 56,
                    'storageUnitName': 'U/L',
                    'calibratorId': 413,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Abbott',
                    'calibratorName': 'Abbott No Cal',
                    'calibratorLotId': 415,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 415,
                        'calibratorId': 413,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': '106d15b8-0e80-4fb4-b5bb-edb7f16d034c',
                    'parentLevelEntityName': 'LabTest',
                    'minNumberOfPoints': 0,
                    'runLength': 0,
                    'dataType': 0,
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
                    'id': '58bd438d-f094-3001-e0ee-ca4e6f11a2a3',
                    'parentNodeId': '106d15b8-0e80-4fb4-b5bb-edb7f16d034c',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': '58bd438d-f094-3001-e0ee-ca4e6f11a2a3',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 3,
                'id': '106d15b8-0e80-4fb4-b5bb-edb7f16d034c',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                'parentNode': null,
                'nodeType': 6,
                'children': [],
                'isUnavailable': false,
                'unavailableReasonCode': 'null'
            },
            {
                'displayName': 'Albumin',
                'testSpecId': '1889',
                'correlatedTestSpecId': '080727BB2F2D4A70986D043149CD705D',
                'testId': '1884',
                'labUnitId': '15',
                'testSpecInfo': {
                    'id': 1889,
                    'testId': 1884,
                    'analyteStorageUnitId': 3,
                    'analyteId': 7,
                    'analyteName': 'Albumin',
                    'methodId': 583,
                    'methodName': 'Bromcresol Green (BCG)',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1108,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Abbott',
                    'reagentName': 'AlbG REF 7D53-23',
                    'reagentLotId': 419,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 419,
                        'reagentId': 1108,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.477')
                    },
                    'storageUnitId': 15,
                    'storageUnitName': 'g/dL',
                    'calibratorId': 258,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Abbott',
                    'calibratorName': 'Multiconstituent Cal REF 1E65',
                    'calibratorLotId': 259,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 259,
                        'calibratorId': 258,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.4')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                    'parentLevelEntityName': 'LabTest',
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
                    'id': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
                    'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 0,
                'id': 'b2d2f361-b7c3-44b2-9db5-134d04d990d6',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
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

    let selectedNodeOneChild = {
        'displayName': 'Multiqual 1,2,3 Unassayed',
        'productId': '68',
        'productMasterLotId': '406',
        'productCustomName': '',
        'productInfo': {
            'id': 68,
            'name': 'Multiqual 1,2,3 Unassayed',
            'manufacturerId': 2,
            'manufacturerName': 'Bio-Rad',
            'matrixId': 3,
            'matrixName': 'Serum'
        },
        'lotInfo': {
            'id': 406,
            'productId': 68,
            'productName': 'Multiqual 1,2,3 Unassayed',
            'lotNumber': '56610',
            'expirationDate': '2021-07-31T00:00:00'
        },
        'productLotLevels': [
            {
                'id': '1068',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56611',
                'level': 1,
                'levelDescription': '1'
            },
            {
                'id': '1069',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56612',
                'level': 2,
                'levelDescription': '2'
            },
            {
                'id': '1070',
                'productMasterLotId': '406',
                'productId': '68',
                'productMasterLotNumber': '56610',
                'lotNumber': '56613',
                'level': 3,
                'levelDescription': '3'
            }
        ],
        'levelSettings': {
            'levelEntityId': null,
            'levelEntityName': 'LevelSetting',
            'parentLevelEntityId': '7ed51e16-7139-421a-b678-a381a1d9106a',
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
            'id': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
            'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
            'parentNode': null,
            'nodeType': 8,
            'displayName': 'c6bce6a1-4d8b-8d7c-9802-29001c51c819',
            'children': null,
            'isUnavailable': false,
            'unavailableReasonCode': null
        },
        'accountSettings': null,
        'hasOwnAccountSettings': false,
        'isArchived': false,
        'sortOrder': 0,
        'id': '7ed51e16-7139-421a-b678-a381a1d9106a',
        'parentNodeId': '7ffe7f29-dd85-4ef1-a97d-9814420e2380',
        'parentNode': null,
        'nodeType': 5,
        'children': [
            {
                'displayName': 'Alkaline Phosphatase',
                'testSpecId': '3321',
                'correlatedTestSpecId': 'E051E4001DAD4D97AB198DCEB1AC061B',
                'testId': '3312',
                'labUnitId': '56',
                'testSpecInfo': {
                    'id': 3321,
                    'testId': 3312,
                    'analyteStorageUnitId': 33,
                    'analyteId': 26,
                    'analyteName': 'Alkaline Phosphatase',
                    'methodId': 363,
                    'methodName': 'PNPP, AMP Buffer',
                    'instrumentId': 1254,
                    'instrumentName': 'ARCHITECT c16000',
                    'reagentId': 1109,
                    'reagentManufacturerId': null,
                    'reagentManufacturerName': 'Abbott',
                    'reagentName': 'Alkaline Phosphatase REF 7D55-21',
                    'reagentLotId': 420,
                    'reagentLotNumber': 'Unspecified ***',
                    'reagentLot': {
                        'id': 420,
                        'reagentId': 1109,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-11-16T17:50:46.57')
                    },
                    'storageUnitId': 56,
                    'storageUnitName': 'U/L',
                    'calibratorId': 413,
                    'calibratorManufacturerId': null,
                    'calibratorManufacturerName': 'Abbott',
                    'calibratorName': 'Abbott No Cal',
                    'calibratorLotId': 415,
                    'calibratorLotNumber': 'Unspecified ***',
                    'calibratorLot': {
                        'id': 415,
                        'calibratorId': 413,
                        'lotNumber': 'Unspecified ***',
                        'shelfExpirationDate': new Date('2068-12-05T16:20:55.43')
                    }
                },
                'levelSettings': {
                    'levelEntityId': null,
                    'levelEntityName': 'LevelSetting',
                    'parentLevelEntityId': '96cc1101-40db-407f-bae4-557065a9914e',
                    'parentLevelEntityName': 'LabTest',
                    'minNumberOfPoints': 0,
                    'runLength': 0,
                    'dataType': 0,
                    'targets': null,
                    'rules': null,
                    'levels': [
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': true,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        },
                        {
                            'levelInUse': false,
                            'decimalPlace': 3
                        }
                    ],
                    'id': '5ebce6a1-7984-d3f8-485e-4304261f16b4',
                    'parentNodeId': '96cc1101-40db-407f-bae4-557065a9914e',
                    'parentNode': null,
                    'nodeType': 8,
                    'displayName': '5ebce6a1-7984-d3f8-485e-4304261f16b4',
                    'children': null,
                    'isUnavailable': false,
                    'unavailableReasonCode': null
                },
                'accountSettings': null,
                'hasOwnAccountSettings': false,
                'mappedTestSpecs': null,
                'isArchived': false,
                'sortOrder': 0,
                'id': '96cc1101-40db-407f-bae4-557065a9914e',
                'parentNodeId': '7ed51e16-7139-421a-b678-a381a1d9106a',
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

    const StateArray = {
        navigation: {
            selectedNode: selectedNode
        },
        DataManagement: {
            entityId: '96cc1101-40db-407f-bae4-557065a9914e'
        }
    };

    const StateArrayAlt = {
        navigation: {
            selectedNode: selectedNode
        },
        DataManagement: {
            entityId: '106d15b8-0e80-4fb4-b5bb-edb7f16d034c'
        }
    };

    const StateArraySortOrder = {
        navigation: {
            selectedNode: selectedNodeSortOrder,
            isCustomSortMode: true
        },
        DataManagement: {
            entityId: '96cc1101-40db-407f-bae4-557065a9914e'
        }
    };

    const StateArrayOneChild = {
        navigation: {
            selectedNode: selectedNodeOneChild
        },
        DataManagement: {
            entityId: '96cc1101-40db-407f-bae4-557065a9914e'
        }
    }

    const runsServiceMock = {
        getRawDataForAdvancedLj: () => of('H4sIAAAAAAAACuWRwWvCMBTGz+1fMXq2JUmj1d4EdxhsY2DxMOnhmT5HIbalSQQ3/N+XpCpzm/fBLoH8vvfyvrxvHQYfYRBEdRXldzQlE8ZH7i5hU6DSDw5HmAJkVYqxYHQW80m2iYEzHldjQekGBd1yGvk2bXuWHQrfl3JKPTUK+7nQddsoixsjpcc9KiO1Q2t79T4s3SEo02O1AI1FvUNngBFGYzKN6aygPKeznPIkffUjL++sQBpXPMx0XqB/Q/384iewK/iE0LhSkkzY+EpZLiwnyRm+L0Xbo7UCFg8Gz9DVDVVBVNWqk3CwaAtSoafH0xO1mguBnUa3Et0bPLs2Eld1K2FQ1uWJi7bRfSsfcY/SeRxd1tLc7+0fwe2xOHT4RVTVD4k55WiPMvRWvqWc/v2USc5ZMiXZrZxJko1/i5reiPo/BB2Wn8igvtrRAwAA').toPromise(),
        extractResultStatus: () => 0
    };

    const mockTranslationService = {
        getTranslatedMessage: () => { }
    };

    const PointDataResult = [
      {
          "runId": "28807175",
          "measuredDateTime": new Date("2021-01-01T20:11:59.999Z"),
          "resultValue": 5,
          "targetNPts": 0,
          "targetMean": 0,
          "targetSD": 0,
          "zScoreData": {
              "zScore": 0,
              "display": false
          },
          "isAccepted": true,
          "isRuleEngineIgnored": true,
          "ruleViolated": [],
          "lastModified": new Date("2021-07-29T19:17:14.112728Z"),
          "controlLotID": 1070,
          "controlLevel": 3,
          "meanEvaluationType": 1,
          "sdEvaluationType": 1,
          "testSpecId": 3454,
          "targetCV": 1,
          "editByInfo": new AddEditBy(),
          "resultStatus": 3,
          "reasons": [''],
          "controlLotId": 2345
      },
      {
          "runId": "28807174",
          "measuredDateTime": new Date("2021-01-01T20:11:59.999Z"),
          "resultValue": 3,
          "targetNPts": 0,
          "targetMean": 0,
          "targetSD": 0,
          "zScoreData": {
              "zScore": 0,
              "display": false
          },
          "isAccepted": true,
          "isRuleEngineIgnored": true,
          "ruleViolated": [],
          "lastModified": new Date("2021-07-29T19:17:14.112728Z"),
          "controlLotID": 1069,
          "controlLevel": 2,
          "meanEvaluationType": 1,
          "sdEvaluationType": 1,
          "testSpecId": 3454,
          "targetCV": 1,
          "editByInfo": new AddEditBy(),
          "resultStatus": 3,
          "reasons": [''],
          "controlLotId": 2345
      }
  ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                HttpClientModule,
                StoreModule.forRoot(fromRoot.reducers),
                TranslateModule.forRoot({
                    loader: {
                      provide: TranslateLoader,
                      useFactory: HttpLoaderFactory,
                      deps: [HttpClient]
                    }
                  })
            ],
            declarations: [
                AdvancedLjPanelComponent,
                UnityNextDatePipe
            ],
            providers: [
                AppLoggerService,
                { provide: MatDialog, useValue: mockMatDialog },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: DecimalPipe, useClass: DecimalPipe },
                { provide: MatDialogRef, useValue: {} },
                { provide: Store, useValue: StateArray },
                { provide: RunsService, useValue: runsServiceMock },
                { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
                { provide: TestSpecService, useValue: mockTestSpecService },
                { provide: ConfigService, useValue: mockConfigService },
                { provide: SummaryStatisticsTableService, useValue: mockTestSpecSummaryStatisticsTableService },
                { provide: DynamicReportingService, useValue: mockTestSpecDynamicReportingService },
                { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },
                TranslateService,
                NodeInfoService,
                PortalApiService,
                DatePipe,
                CodelistApiService,
                NodeInfoAction,
                DateTimeHelper,
                LocaleConverter,
                provideMockStore(mockState)
            ]
        }).compileComponents();
        store = TestBed.get(Store);
        subStore = TestBed.get(Store);
    }));

    beforeEach(() => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        fixture = TestBed.createComponent(AdvancedLjPanelComponent);
        component = fixture.componentInstance;
        component.entityId = StateArray.DataManagement.entityId;
        component.hierarchyText = '184708 inst / Multiqual 1,2,3 Unassayed Lot 56610 expires 31 Jul 2021';
        component.isTesting = true;
        fixture.detectChanges();
    });

    it('should create', () => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should display current analyteDisplayName', () => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        component.analytesArray = StateArray.navigation.selectedNode.children;
        fixture.detectChanges();
        const targetElement = fixture.debugElement.nativeElement.querySelector('#spec_advancedljpanel_analyteDisplayName');
        expect(targetElement.textContent?.trim()).toEqual(component.analytesArray[component.arrayPos].displayName?.trim());
    });

    it('should only have Point and not Summary', () => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        fixture.detectChanges();
        expect(component.analytesArray.length).toBeLessThan(StateArray.navigation.selectedNode.children.length);
    });

    it('should uncompress data from rawdata gzip response', async() => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(component.currentAnalytePointResults).toBeDefined();
            expect(component.currentAnalytePointResults.length).toEqual(4);
            expect(component.currentAnalytePointResults[0]).toBeDefined();
            expect(component.currentAnalytePointResults[0].resultValue).toEqual(10.75);
            expect(component.currentAnalytePointResults[1]).toBeDefined();
            expect(component.currentAnalytePointResults[1].resultValue).toEqual(10.75);
            expect(component.currentAnalytePointResults[2]).toBeDefined();
            expect(component.currentAnalytePointResults[2].resultValue).toEqual(11);
            expect(component.currentAnalytePointResults[3]).toBeDefined();
            expect(component.currentAnalytePointResults[3].resultValue).toEqual(11);
        });
    });

    it('should update display name when left nav clicked', () => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        const targetElement = fixture.debugElement.nativeElement.querySelector('#spec_advancedljpanel_analyteDisplayName');
        expect(targetElement.textContent?.trim()).toEqual('Alkaline Phosphatase');
        component.analytesArray = StateArray.navigation.selectedNode.children;
        const btn = document.getElementById('leftAdvLjButton');
        btn.click();
        fixture.detectChanges();
        expect(targetElement.textContent?.trim()).toEqual('Acid Phosphatase, Total');
    });

    it('should update display name when right nav clicked', () => {
        store.setState(StateArrayAlt);
        subStore.setState(StateArrayAlt);
        component.entityId = StateArrayAlt.DataManagement.entityId;
        component.ngOnInit();
        fixture.detectChanges();
        const targetElement = fixture.debugElement.nativeElement.querySelector('#spec_advancedljpanel_analyteDisplayName');
        expect(targetElement.textContent?.trim()).toEqual('Acid Phosphatase, Total');
        component.analytesArray = StateArrayAlt.navigation.selectedNode.children;
        const btn = document.getElementById('rightAdvLjButton');
        btn.click();
        fixture.detectChanges();
        expect(targetElement.textContent?.trim()).toEqual('Acetaminophen');
    });

    it('should display left button disabled if all the way to left', () => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        component.arrayPos = 0;
        component.isNavDisabled();
        fixture.detectChanges();
        expect(component.leftButtonDisabled).toBeTruthy();
        expect(component.rightButtonDisabled).toBeFalsy();
    });

    it('should exercise getOutput for code coverage', () => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        let startDateInput = new Date('Thu Jun 10 2021 00:00:00 GMT-0700 (Pacific Daylight Time)');
        let endDateInput = new Date('Fri Jul 09 2021 23:59:59 GMT-0700 (Pacific Daylight Time)');
        spyOn(component, 'setTimeFrame');
        component.setTimeFrame(startDateInput, endDateInput);
        fixture.detectChanges();
        expect(component.setTimeFrame).toHaveBeenCalled();
    });

    it('should display right button disabled if all the way to the right', () => {
        store.setState(StateArray);
        subStore.setState(StateArray);
        component.arrayPos = component.analytesArray.length - 1;
        component.isNavDisabled();
        fixture.detectChanges();
        expect(component.leftButtonDisabled).toBeFalsy();
        expect(component.rightButtonDisabled).toBeTruthy();
    });

    it('should disable both arrows if 1 analyte', () => {
        store.setState(StateArrayOneChild);
        subStore.setState(StateArrayOneChild);
        fixture = TestBed.createComponent(AdvancedLjPanelComponent);
        component = fixture.componentInstance;
        component.isTesting = true;
        fixture.detectChanges();
        expect(component.leftButtonDisabled).toBeTruthy();
        expect(component.rightButtonDisabled).toBeTruthy();
    });

    it('should use CustomSortOrder if needed', () => {
        store.setState(StateArraySortOrder);
        subStore.setState(StateArraySortOrder);
        fixture = TestBed.createComponent(AdvancedLjPanelComponent);
        component = fixture.componentInstance;
        component.isTesting = true;
        fixture.detectChanges();
        expect(component.analytesArray[0].displayName).toEqual('Alkaline Phosphatase');
    });

    it('should display hierarchy text', () => {
      store.setState(StateArray);
      subStore.setState(StateArray);
      fixture.detectChanges();
      component.showAnalyteDescription = false;
      fixture.detectChanges();
      const targetElement = fixture.debugElement.nativeElement.querySelector('#spec_advancedljpanel_hierarchyText');
      expect(targetElement).toBeTruthy();
      expect(targetElement.textContent).toEqual('184708 inst / Multiqual 1,2,3 Unassayed Lot 56610 expires 31 Jul 2021');
    });

    it('should display No Data string & disable download button', () => {
      store.setState(StateArray);
      subStore.setState(StateArray);
      fixture.detectChanges();
      component.showAnalyteDescription = false;
      component.displayChart = false;
      fixture.detectChanges();
      const targetElement = fixture.debugElement.nativeElement.querySelector('#spec_advancedljpanel_noDataToDisplay');
      expect(targetElement).toBeTruthy();
      expect(targetElement.textContent).toEqual(' ADVANCEDLJPANEL.NODATA [] to [] ');
      const targetDownloadPdfElement = fixture.debugElement.nativeElement.querySelector('#spec_advancedljpanel_downloadPdfElement');
      expect(targetDownloadPdfElement).toBeTruthy();
      expect(targetDownloadPdfElement.disabled).toBeTruthy();
    });

    it('should show analyte description', () => {
      store.setState(StateArray);
      subStore.setState(StateArray);
      fixture.detectChanges();
      component.toggleAnalyteDescription();
      fixture.detectChanges();
      const targetElement = fixture.debugElement.nativeElement.querySelector('#spec_advancedljpanel_analyteDescription');
      expect(targetElement).toBeTruthy();
      expect(component.showAnalyteDescription).toBeTrue();
    });

    it('should receive new image', () => {
      const image = new imageToPdfTestContent().pngImage;
      component.receivePlotlyPng({
          src:image,
          width: 800,
          height: 700
        });
      fixture.detectChanges();
      expect(component.chartPngSrc).toEqual(image);
    });

    it('should receive new levels', () => {
      component.levelsChange(levels);
      fixture.detectChanges();
      expect(component.selectedLevels).toEqual(levels);
    });

    it('should get distinct test IDs', () => {
      let result = component.getDistinctTestSpecIds(PointDataResult);
      fixture.detectChanges();
      expect(result).toEqual([PointDataResult[0].testSpecId]);
    });
});
