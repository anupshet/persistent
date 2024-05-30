// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { TestBed } from '@angular/core/testing';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AddEditBy, PointDataResult } from '../../../../contracts/models/data-management/run-data.model';
import { AdvancedLjChartHelperForRepeatedDates } from './advanced-lj-chart-helper-repeated-dates';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';
import { HttpLoaderFactory } from '../../../../app.module';

describe('AdvancedLjChartHelperForRepeatedDates', () => {
  let advancedLjChartHelperForRepeatedDates: AdvancedLjChartHelperForRepeatedDates;

  let dataPoints: PointDataResult[] = [
    {
      controlLevel: 1,
      measuredDateTime: new Date("2021, 2, 5, 20, 2, 0"),
      resultValue: 10.5
    } as PointDataResult,
    {
      controlLevel: 5,
      measuredDateTime: new Date("2021, 2, 5, 20, 2, 0"),
      resultValue: 75
    } as PointDataResult,
    {
      controlLevel: 1,
      measuredDateTime: new Date("2021, 2, 9, 20, 2, 0"),
      resultValue: 10.9
    } as PointDataResult,
    {
      controlLevel: 5,
      measuredDateTime: new Date("2021, 2, 9, 20, 2, 0"),
      resultValue: 77.1
    } as PointDataResult,
    {
      controlLevel: 1,
      measuredDateTime: new Date("2021, 2, 9, 20, 2, 0"),
      resultValue: 10.7
    } as PointDataResult,
    {
      controlLevel: 5,
      measuredDateTime: new Date("2021, 2, 9, 20, 2, 0"),
      resultValue: 76.2
    } as PointDataResult,
    {
      controlLevel: 1,
      measuredDateTime: new Date("2021, 2, 9, 20, 2, 0"),
      resultValue: 10.7
    } as PointDataResult,
    {
      controlLevel: 5,
      measuredDateTime: new Date("2021, 2, 9, 20, 2, 0"),
      resultValue: 76.8
    } as PointDataResult,
    {
      controlLevel: 1,
      measuredDateTime: new Date("2021, 2, 21, 20, 2, 0"),
      resultValue: 11.7
    } as PointDataResult,
    {
      controlLevel: 5,
      measuredDateTime: new Date("2021, 2, 21, 20, 2, 0"),
      resultValue: 75.8
    } as PointDataResult,
    {
      controlLevel: 5,
      measuredDateTime: new Date("2021, 2, 21, 20, 2, 0"),
      resultValue: 75.9
    } as PointDataResult
  ];

  let levelData: PointDataResult[] = [
    {
        "runId": "10001",
        "measuredDateTime": new Date("2021-08-01T07:03:59.999Z"),
        "resultValue": 5,
        "targetNPts": 42,
        "targetMean": 4.904761904761905,
        "targetSD": 0.93207,
        "targetCV": 1,
        "isRuleEngineIgnored": false,
        "editByInfo": new AddEditBy(),
        "ruleViolated": null,
        "resultStatus": null,
        "lastModified": new Date(),
        "controlLotId": 1234,
        "reasons": [''],
        "zScoreData": {
            "zScore": 0.10217912306811174,
            "display": true
        },
        "isAccepted": true,
        "controlLevel": 3,
        "meanEvaluationType": 1,
        "sdEvaluationType": 1,
        "testSpecId": 3454,
        "userActions": [
            {
                "actionId": 889,
                "actionName": "Instrument  electrode/cartridge change ",
                "userId": "00u7toe8nw2g0aVUx2p7",
                "userFullName": "francisco deguzman",
                "enterDateTime": new Date("2021-08-25T00:10:41.090702Z")
            },
            {
                "actionId": 885,
                "actionName": "Maintenance  daily ",
                "userId": "00u7toe8nw2g0aVUx2p7",
                "userFullName": "francisco deguzman",
                "enterDateTime": new Date("2021-08-19T14:24:55.140505Z")
            }
        ],
        "decimalPlace": 4
    },
    {
      "runId": "10002",
      "measuredDateTime": new Date("2021-08-01T01:03:59.999Z"),
      "resultValue": 5,
      "targetNPts": 42,
      "targetMean": null,
      "targetSD": null,
      "targetCV": 1,
      "isRuleEngineIgnored": false,
      "editByInfo": new AddEditBy(),
      "ruleViolated": [
        {
            "category": "1-ks",
            "k": 3,
            "disposition": "R"
        },
        {
            "category": "1-ks",
            "k": 2,
            "disposition": "W"
        }
      ],
      "resultStatus": null,
      "lastModified": new Date(),
      "controlLotId": 1234,
      "reasons": [''],
      "zScoreData": null,
      "isAccepted": true,
      "controlLevel": 3,
      "meanEvaluationType": 1,
      "sdEvaluationType": 1,
      "testSpecId": 3454,
      "userActions": [
          {
              "actionId": 889,
              "actionName": "Instrument  electrode/cartridge change ",
              "userId": "00u7toe8nw2g0aVUx2p7",
              "userFullName": "francisco deguzman",
              "enterDateTime": new Date("2021-08-25T00:10:41.090702Z")
          },
          {
              "actionId": 885,
              "actionName": "Maintenance  daily ",
              "userId": "00u7toe8nw2g0aVUx2p7",
              "userFullName": "francisco deguzman",
              "enterDateTime": new Date("2021-08-19T14:24:55.140505Z")
          }
      ],
      "decimalPlace": 4
    },
    {
      "runId": "10003",
      "measuredDateTime": new Date("2021-08-01T17:03:59.999Z"),
      "resultValue": 5,
      "targetNPts": 42,
      "targetMean": null,
      "targetSD": null,
      "targetCV": 1,
      "isRuleEngineIgnored": false,
      "editByInfo": new AddEditBy(),
      "ruleViolated": [
        {
            "category": "1-ks",
            "k": 3,
            "disposition": "R"
        },
        {
            "category": "1-ks",
            "k": 2,
            "disposition": "W"
        }
      ],
      "resultStatus": null,
      "lastModified": new Date(),
      "controlLotId": 1234,
      "reasons": [''],
      "zScoreData": null,
      "isAccepted": true,
      "controlLevel": 3,
      "meanEvaluationType": 1,
      "sdEvaluationType": 1,
      "testSpecId": 3454,
      "userActions": [
          {
              "actionId": 889,
              "actionName": "Instrument  electrode/cartridge change ",
              "userId": "00u7toe8nw2g0aVUx2p7",
              "userFullName": "francisco deguzman",
              "enterDateTime": new Date("2021-08-25T00:10:41.090702Z")
          },
          {
              "actionId": 885,
              "actionName": "Maintenance  daily ",
              "userId": "00u7toe8nw2g0aVUx2p7",
              "userFullName": "francisco deguzman",
              "enterDateTime": new Date("2021-08-19T14:24:55.140505Z")
          }
      ],
      "decimalPlace": 4
    },
    {
      "runId": "10004",
      "measuredDateTime": new Date("2021-08-01T09:03:59.999Z"),
      "resultValue": 5,
      "targetNPts": 42,
      "targetMean": 4.904761904761905,
      "targetSD": 0.93207,
      "targetCV": 1,
      "isRuleEngineIgnored": false,
      "editByInfo": new AddEditBy(),
      "ruleViolated": null,
      "resultStatus": null,
      "lastModified": new Date(),
      "controlLotId": 1234,
      "reasons": [''],
      "zScoreData": {
          "zScore": 0.10217912306811174,
          "display": true
      },
      "isAccepted": true,
      "controlLevel": 3,
      "meanEvaluationType": 1,
      "sdEvaluationType": 1,
      "testSpecId": 3454,
      "userActions": [
          {
              "actionId": 889,
              "actionName": "Instrument  electrode/cartridge change ",
              "userId": "00u7toe8nw2g0aVUx2p7",
              "userFullName": "francisco deguzman",
              "enterDateTime": new Date("2021-08-25T00:10:41.090702Z")
          },
          {
              "actionId": 885,
              "actionName": "Maintenance  daily ",
              "userId": "00u7toe8nw2g0aVUx2p7",
              "userFullName": "francisco deguzman",
              "enterDateTime": new Date("2021-08-19T14:24:55.140505Z")
          }
      ],
      "decimalPlace": 4
    }
  ];

  let timeZone = 'America/Los_Angeles';
  let appLocale = 'en-US';

  let  hoverTranslation = {
    "level": " Level ",
    "mean": " Mean ",
    "sd": " SD ",
    "cv": " CV ",
    "zScore": " ZScore ",
    "actions": " Actions ",
    "reason": " Reason "
  }

  let getHoverTemplateInformationResult = [
    '<b><span style="color:#9F41F9;">Aug 01 12:03 AM</span></b><br><br><b><span style="color:#9F41F9;"> Level 3</span></b>      <span style="text-decoration: {line-through};">5.0000</span><br><span style="color:	#808080;"> Mean </span>         4.9048<br><span style="color:	#808080;"> SD </span>                0.9321<br><span style="color:	#808080;"> CV </span>               19.0034<br><span style="color:	#808080;"> ZScore </span>     0.10<br><span style="color:	#808080;"> Reason </span><br><span style="color:	#808080;"> Actions </span>    Instrument  electrode/cartridge change,<br>                          Maintenance  daily',
    '<b><span style="color:#9F41F9;">Jul 31 6:03 PM</span></b><br><br><b><span style="color:#9F41F9;"> Level 3</span></b>      <span style="text-decoration: {line-through};">5.0000</span><br><span style="color:	#808080;"> Mean </span>         <br><span style="color:	#808080;"> SD </span>                <br><span style="color:	#808080;"> CV </span>               <br><span style="color:	#808080;"> ZScore </span>     <br><span style="color:	#808080;"> Reason </span>    1-3s<br><span style="color:	#808080;"> Actions </span>    Instrument  electrode/cartridge change,<br>                          Maintenance  daily',
    '<b><span style="color:#9F41F9;">Aug 01 10:03 AM</span></b><br><br><b><span style="color:#9F41F9;"> Level 3</span></b>      <span style="text-decoration: {line-through};">5.0000</span><br><span style="color:	#808080;"> Mean </span>         <br><span style="color:	#808080;"> SD </span>                <br><span style="color:	#808080;"> CV </span>               <br><span style="color:	#808080;"> ZScore </span>     <br><span style="color:	#808080;"> Reason </span>    1-3s<br><span style="color:	#808080;"> Actions </span>    Instrument  electrode/cartridge change,<br>                          Maintenance  daily',
    '<b><span style="color:#9F41F9;">Aug 01 2:03 AM</span></b><br><br><b><span style="color:#9F41F9;"> Level 3</span></b>      <span style="text-decoration: {line-through};">5.0000</span><br><span style="color:	#808080;"> Mean </span>         4.9048<br><span style="color:	#808080;"> SD </span>                0.9321<br><span style="color:	#808080;"> CV </span>               19.0034<br><span style="color:	#808080;"> ZScore </span>     0.10<br><span style="color:	#808080;"> Reason </span><br><span style="color:	#808080;"> Actions </span>    Instrument  electrode/cartridge change,<br>                          Maintenance  daily'
  ];

  const mockNavigationState = {
    selectedNode: {
      displayName: 'Test control',
      productId: '240',
      productMasterLotId: '223',
      productCustomName: 'Test control',
      productInfo: {
        id: 240,
        name: 'Diabetes (Liquichek)',
        manufacturerId: 2,
        manufacturerName: 'Bio-Rad',
        matrixId: 6,
        matrixName: 'Whole Blood'
      },
      lotInfo: {
        id: 223,
        productId: 240,
        productName: 'Diabetes (Liquichek)',
        lotNumber: '38580',
        expirationDate: '2020-10-31T00:00:00'
      },
      productLotLevels: [
        {
          id: '563',
          productMasterLotId: '223',
          productId: '240',
          productMasterLotNumber: '38580',
          lotNumber: '38581',
          level: 1,
          levelDescription: '1'
        },
        {
          id: '564',
          productMasterLotId: '223',
          productId: '240',
          productMasterLotNumber: '38580',
          lotNumber: '38582',
          level: 2,
          levelDescription: '2'
        },
        {
          id: '565',
          productMasterLotId: '223',
          productId: '240',
          productMasterLotNumber: '38580',
          lotNumber: '38583',
          level: 3,
          levelDescription: '3'
        }
      ],
      levelSettings: {
        levelEntityId: null,
        levelEntityName: 'LevelSetting',
        parentLevelEntityId: '28a442cc-92fc-42d0-85b6-700c9496545f',
        parentLevelEntityName: 'LabProduct',
        minNumberOfPoints: 0,
        runLength: 0,
        dataType: 0,
        targets: null,
        rules: null,
        levels: [
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          }
        ],
        id: '52c93907-7655-4232-82f2-396cd23e2814',
        parentNodeId: '28a442cc-92fc-42d0-85b6-700c9496545f',
        parentNode: null,
        nodeType: 8,
        displayName: '52c93907-7655-4232-82f2-396cd23e2814',
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
        id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
        parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      id: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
      parentNodeId: '28a442cc-92fc-42d0-85b6-700c9496545f',
      parentNode: null,
      nodeType: 5,
      children: [
        {
          displayName: ' Hemoglobin A1c',
          testSpecId: '1',
          correlatedTestSpecId: '11535054496E4BABBDF8BEE875351096',
          testId: '1',
          labUnitId: '6',
          testSpecInfo: {
            id: 1,
            testId: 1,
            analyteStorageUnitId: 666,
            analyteId: 2566,
            analyteName: ' Hemoglobin A1c',
            methodId: 22,
            methodName: 'HPLC',
            instrumentId: 2749,
            instrumentName: 'D-10',
            reagentId: 664,
            reagentManufacturerId: null,
            reagentManufacturerName: 'Bio-Rad',
            reagentName: 'D-10 Dual HbA1c/A2/F (220-0201)',
            reagentLotId: 1,
            reagentLotNumber: 'Unspecified ***',
            reagentLot: {
              id: 1,
              reagentId: 664,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-02T16:50:23.827'
            },
            storageUnitId: 93,
            storageUnitName: '%',
            calibratorId: 1,
            calibratorManufacturerId: null,
            calibratorManufacturerName: 'Bio-Rad',
            calibratorName: 'D-10 Dual A2/F/A1c Calibrator',
            calibratorLotId: 1,
            calibratorLotNumber: 'Unspecified ***',
            calibratorLot: {
              id: 1,
              calibratorId: 1,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-02T16:50:23.827'
            }
          },
          levelSettings: {
            levelEntityId: null,
            levelEntityName: 'LevelSetting',
            parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentLevelEntityName: 'LabTest',
            minNumberOfPoints: 0,
            runLength: 0,
            dataType: 0,
            targets: null,
            rules: null,
            levels: [
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              }
            ],
            id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
            parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentNode: null,
            nodeType: 8,
            displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
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
            id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
            parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          mappedTestSpecs: null,
          id: '798b574c-d7d0-4f5a-9be3-61e9cb927182',
          parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
          parentNode: null,
          nodeType: 6,
          children: []
        },
        {
          displayName: ' Hemoglobin A1c',
          testSpecId: '5',
          correlatedTestSpecId: 'CF4619742EA04099A4A9463550E90305',
          testId: '5',
          labUnitId: '93',
          testSpecInfo: {
            id: 5,
            testId: 5,
            analyteStorageUnitId: 666,
            analyteId: 2566,
            analyteName: ' Hemoglobin A1c',
            methodId: 22,
            methodName: 'HPLC',
            instrumentId: 2749,
            instrumentName: 'D-10',
            reagentId: 693,
            reagentManufacturerId: null,
            reagentManufacturerName: 'Bio-Rad',
            reagentName: 'D-10 Dual A1c (220-0201)',
            reagentLotId: 3,
            reagentLotNumber: 'Unspecified ***',
            reagentLot: {
              id: 3,
              reagentId: 693,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-02T16:50:23.89'
            },
            storageUnitId: 93,
            storageUnitName: '%',
            calibratorId: 3,
            calibratorManufacturerId: null,
            calibratorManufacturerName: 'Bio-Rad',
            calibratorName: 'D-10 Dual A1c Calibrator',
            calibratorLotId: 3,
            calibratorLotNumber: 'Unspecified ***',
            calibratorLot: {
              id: 3,
              calibratorId: 3,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-02T16:50:23.89'
            }
          },
          levelSettings: {
            levelEntityId: null,
            levelEntityName: 'LevelSetting',
            parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentLevelEntityName: 'LabTest',
            minNumberOfPoints: 0,
            runLength: 0,
            dataType: 0,
            targets: null,
            rules: null,
            levels: [
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              }
            ],
            id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
            parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentNode: null,
            nodeType: 8,
            displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
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
            id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
            parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          mappedTestSpecs: null,
          id: 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
          parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
          parentNode: null,
          nodeType: 6,
          children: []
        },
        {
          displayName: ' Hemoglobin A1c',
          testSpecId: '4',
          correlatedTestSpecId: '3A1CA2C15B2E466C816278DEFE24740C',
          testId: '4',
          labUnitId: '6',
          testSpecInfo: {
            id: 4,
            testId: 4,
            analyteStorageUnitId: 666,
            analyteId: 2566,
            analyteName: ' Hemoglobin A1c',
            methodId: 22,
            methodName: 'HPLC',
            instrumentId: 2749,
            instrumentName: 'D-10',
            reagentId: 662,
            reagentManufacturerId: null,
            reagentManufacturerName: 'Bio-Rad',
            reagentName: 'D-10 HbA1c (220-0101)',
            reagentLotId: 2,
            reagentLotNumber: 'Unspecified ***',
            reagentLot: {
              id: 2,
              reagentId: 662,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-02T16:50:23.86'
            },
            storageUnitId: 93,
            storageUnitName: '%',
            calibratorId: 2,
            calibratorManufacturerId: null,
            calibratorManufacturerName: 'Bio-Rad',
            calibratorName: 'D-10 A1c Level 1, 2 Calibrator',
            calibratorLotId: 2,
            calibratorLotNumber: 'Unspecified ***',
            calibratorLot: {
              id: 2,
              calibratorId: 2,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-02T16:50:23.86'
            }
          },
          levelSettings: {
            levelEntityId: null,
            levelEntityName: 'LevelSetting',
            parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentLevelEntityName: 'LabTest',
            minNumberOfPoints: 0,
            runLength: 0,
            dataType: 0,
            targets: null,
            rules: null,
            levels: [
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              }
            ],
            id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
            parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentNode: null,
            nodeType: 8,
            displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
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
            id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
            parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          mappedTestSpecs: null,
          id: '979c1151-e7f9-4d16-ab43-05189f7d2abe',
          parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
          parentNode: null,
          nodeType: 6,
          children: []
        },
        {
          displayName: 'Hemoglobin F',
          testSpecId: '3',
          correlatedTestSpecId: '03C4E8B90B6F4A329C37AC4F07E39254',
          testId: '3',
          labUnitId: '93',
          testSpecInfo: {
            id: 3,
            testId: 3,
            analyteStorageUnitId: 250,
            analyteId: 290,
            analyteName: 'Hemoglobin F',
            methodId: 22,
            methodName: 'HPLC',
            instrumentId: 2749,
            instrumentName: 'D-10',
            reagentId: 664,
            reagentManufacturerId: null,
            reagentManufacturerName: 'Bio-Rad',
            reagentName: 'D-10 Dual HbA1c/A2/F (220-0201)',
            reagentLotId: 1,
            reagentLotNumber: 'Unspecified ***',
            reagentLot: {
              id: 1,
              reagentId: 664,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-02T16:50:23.827'
            },
            storageUnitId: 93,
            storageUnitName: '%',
            calibratorId: 1,
            calibratorManufacturerId: null,
            calibratorManufacturerName: 'Bio-Rad',
            calibratorName: 'D-10 Dual A2/F/A1c Calibrator',
            calibratorLotId: 1,
            calibratorLotNumber: 'Unspecified ***',
            calibratorLot: {
              id: 1,
              calibratorId: 1,
              lotNumber: 'Unspecified ***',
              shelfExpirationDate: '2068-11-02T16:50:23.827'
            }
          },
          levelSettings: {
            levelEntityId: null,
            levelEntityName: 'LevelSetting',
            parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentLevelEntityName: 'LabTest',
            minNumberOfPoints: 0,
            runLength: 0,
            dataType: 0,
            targets: null,
            rules: null,
            levels: [
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              },
              {
                levelInUse: false,
                decimalPlace: 0
              }
            ],
            id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
            parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
            parentNode: null,
            nodeType: 8,
            displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
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
            id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
            parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
            parentNode: null,
            nodeType: 9,
            children: null
          },
          hasOwnAccountSettings: false,
          mappedTestSpecs: null,
          id: 'bb1fe8b3-bc6a-4820-a35f-00c2028f3f00',
          parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
          parentNode: null,
          nodeType: 6,
          children: []
        }
      ]
    },
    selectedLeaf: {
      displayName: ' Hemoglobin A1c',
      testSpecId: '5',
      correlatedTestSpecId: 'CF4619742EA04099A4A9463550E90305',
      testId: '5',
      labUnitId: '93',
      testSpecInfo: {
        id: 5,
        testId: 5,
        analyteStorageUnitId: 666,
        analyteId: 2566,
        analyteName: ' Hemoglobin A1c',
        methodId: 22,
        methodName: 'HPLC',
        instrumentId: 2749,
        instrumentName: 'D-10',
        reagentId: 693,
        reagentManufacturerId: null,
        reagentManufacturerName: 'Bio-Rad',
        reagentName: 'D-10 Dual A1c (220-0201)',
        reagentLotId: 3,
        reagentLotNumber: 'Unspecified ***',
        reagentLot: {
          id: 3,
          reagentId: 693,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: '2068-11-02T16:50:23.89'
        },
        storageUnitId: 93,
        storageUnitName: '%',
        calibratorId: 3,
        calibratorManufacturerId: null,
        calibratorManufacturerName: 'Bio-Rad',
        calibratorName: 'D-10 Dual A1c Calibrator',
        calibratorLotId: 3,
        calibratorLotNumber: 'Unspecified ***',
        calibratorLot: {
          id: 3,
          calibratorId: 3,
          lotNumber: 'Unspecified ***',
          shelfExpirationDate: '2068-11-02T16:50:23.89'
        }
      },
      levelSettings: {
        levelEntityId: null,
        levelEntityName: 'LevelSetting',
        parentLevelEntityId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
        parentLevelEntityName: 'LabTest',
        minNumberOfPoints: 0,
        runLength: 0,
        dataType: 0,
        targets: null,
        rules: null,
        levels: [
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          },
          {
            levelInUse: false,
            decimalPlace: 0
          }
        ],
        id: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
        parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
        parentNode: null,
        nodeType: 8,
        displayName: 'cc411e0f-f66d-4ab6-b49a-04453e85dfa4',
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
        id: 'b65b970d-072d-4675-8182-fd0ccffaf0e8',
        parentNodeId: 'd23ed149-77a8-4a0f-ae1a-d5e6e30c39e5',
        parentNode: null,
        nodeType: 9,
        children: null
      },
      hasOwnAccountSettings: false,
      mappedTestSpecs: null,
      id: 'c36eaa78-ab6f-4e68-b0fa-1609d6499149',
      parentNodeId: '63a72dbf-49ce-44e5-b949-b43f7d512e73',
      parentNode: null,
      nodeType: 6,
      children: []
    },
    connectivityFullTree: null,
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: true,
    showSettings: true,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: true,
    settings: null,
    locale: {
      country: 'US',
      locale: 'en-US',
      language: 'en',
      name: 'English',
      numberFormat: 0,
      timeFormat: 0,
      dateFormat: 0,
      dateFormatValues: [
        {
            date: 'Jan 30 1963',
            value: 0
        },
        {
            date: '30 Jan 1963',
            value: 1
        },
        {
            date: '1963 Jan 30',
            value: 2
        }
      ]
    }
  };

  const storeStub = {
    security: null,
    auth: '',
    userPreference: null,
    router: null,
    location: {
      currentLabLocation: {
        displayName: 'Test lab',
        labLocationName: 'Test lab',
        locationTimeZone: 'America/Los_Angeles',
        locationOffset: '-08:00:00',
        locationDayLightSaving: '01:00:00',
        labLocationContactId: '403a6761-0957-4361-a209-aac140fb0be6',
        labLocationAddressId: '16df8949-14cf-4efb-8597-be4ca471f611',
        labLocationContact: {
          entityType: 0,
          searchAttribute: 'test@bio-rad.com',
          firstName: 'Test',
          middleName: '',
          lastName: 'Name',
          name: 'Test Name',
          email: 'test@bio-rad.com',
          phone: '',
          id: '403a6761-0957-4361-a209-aac140fb0be6',
          featureInfo: {
            uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
          }
        },
        labLocationAddress: {
          entityType: 1,
          searchAttribute: '',
          nickName: '',
          streetAddress1: 'test',
          streetAddress2: '',
          streetAddress3: '',
          streetAddress: 'test',
          suite: '',
          city: 'irvine',
          state: 'US',
          country: 'US',
          zipCode: '12345',
          id: '16df8949-14cf-4efb-8597-be4ca471f611',
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
          id: 'f3a873fa-b6f8-48e5-85d4-f54198b3af8d',
          parentNodeId: '64b7287e-d9cb-4533-9429-505f3dab512d',
          parentNode: null,
          nodeType: 9,
          children: null
        },
        hasOwnAccountSettings: false,
        id: 'a03e9329-7bce-4197-8b1d-63adfb6362f8',
        parentNodeId: 'e9d7a127-9fea-467c-8efd-3955bab92f3c',
        parentNode: null,
        nodeType: 2,
        children: []
      }
    },
    uiConfigState: null,
    navigation: mockNavigationState
  };

  registerLocaleData(localeEn, 'en', localeEnExtra);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UnityNextDatePipe,
        UnityNextNumericPipe
      ],
      imports: [
        HttpClientModule,
        StoreModule.forRoot([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        AdvancedLjChartHelperForRepeatedDates,
        { provide: DecimalPipe, useClass: DecimalPipe },
        TranslateService,
        UnityNextDatePipe,
        UnityNextNumericPipe,
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        TranslateService
      ]
    });

    advancedLjChartHelperForRepeatedDates = TestBed.inject(AdvancedLjChartHelperForRepeatedDates);
    let mockRunsService = jasmine.createSpyObj('RunsService', ['convertReasons()']);
    mockRunsService = {convertReasons: () => {return ['1-3s'];}};
    advancedLjChartHelperForRepeatedDates.runsService = mockRunsService;
    const datePipe = TestBed.inject(UnityNextDatePipe);
    const numericPipe = TestBed.inject(UnityNextNumericPipe);
    advancedLjChartHelperForRepeatedDates.unityNextDatePipe = datePipe;
    advancedLjChartHelperForRepeatedDates.unityNextNumericPipe = numericPipe;
  });

  // Resolve this technical debt from localization release
  it('populates y-axis array with y-axis values of each point specifically for Sequence plotting (RepeatedDates)', () => {
    let yValues = advancedLjChartHelperForRepeatedDates.GetYAxisItemsForLevel(dataPoints.filter(dataPoint => dataPoint.controlLevel === 1), false);
    expect(yValues).toEqual([10.5, 10.9, 10.7, 10.7, 11.7]);

    yValues = advancedLjChartHelperForRepeatedDates.GetYAxisItemsForLevel(dataPoints.filter(dataPoint => dataPoint.controlLevel === 3), false);
    expect(yValues).toEqual([]);

    yValues = advancedLjChartHelperForRepeatedDates.GetYAxisItemsForLevel(dataPoints.filter(dataPoint => dataPoint.controlLevel === 5), false);
    expect(yValues).toEqual([75, 77.1, 76.2, 76.8, 75.8, 75.9]);

    // temp execution for code coverage until method is populated
    expect(advancedLjChartHelperForRepeatedDates.GetChartConfig(dataPoints, new Date(), new Date(), timeZone)).toBeNull();
    expect(advancedLjChartHelperForRepeatedDates.GetHoverTemplateInformation(levelData, timeZone, appLocale, hoverTranslation)).toEqual(getHoverTemplateInformationResult);
  });
});
