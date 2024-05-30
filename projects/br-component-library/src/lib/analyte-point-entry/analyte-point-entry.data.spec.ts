import { Action, AnalytePointEntry, PointDataResultStatus } from '../contracts';

export const analyeEntryNoLevelData: AnalytePointEntry = {
  id: '',
  labTestId: '1',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  isRunEntryMode: true,
  analyteIndex: 1,
  isSingleAnalyteMode: false,
  cumulativeLevels: [1, 2, 3, 4, 5, 6, 7],
  analyteName: 'Analyte_Name',
  analyteDateTime: new Date(),
  analyteDateTimeOffset: '-04:00',
  action: new Action(),
  isSummary: false,
  totalAnalytes: 1,
  changeLotData: {
    labTestId: '1',
    reagentLots: [
      {id: 1, reagentId: 1, lotNumber: '1', reagentCategory: 2, shelfExpirationDate: new Date() },
      {id: 3, reagentId: 3, lotNumber: '3', reagentCategory: 2, shelfExpirationDate: new Date() }
    ],
    calibratorLots: [
      {id: 2, calibratorId: 2, lotNumber: '2', shelfExpirationDate: new Date() },
      {id: 4, calibratorId: 4, lotNumber: '4', shelfExpirationDate: new Date() }

    ],
    errorMessages: [],
    defaultReagentLot: {id: 1, reagentId: 1, lotNumber: '1', reagentCategory: 1, shelfExpirationDate: new Date() },
    defaultCalibratorLot: {id: 2, calibratorId: 2, lotNumber: '2', shelfExpirationDate: new Date() },
    selectedReagentLot: {id: 1, reagentId: 1, lotNumber: '1',  reagentCategory: 1, shelfExpirationDate: new Date() },
    selectedCalibratorLot: {id: 2, calibratorId: 2, lotNumber: '2', shelfExpirationDate: new Date() },
    comment: ''
  },
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        value: null,
        z: null,
        displayZScore: null,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        value: null,
        z: null,
        displayZScore: null,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        value: null,
        z: null,
        displayZScore: null,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ]
};


export const analyeEntryLevelDisplayTest: AnalytePointEntry = {
  id: '',
  labTestId: '1',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  isRunEntryMode: true,
  analyteIndex: 1,
  isSingleAnalyteMode: false,
  cumulativeLevels: [1, 2, 3, 4, 5, 6, 7],
  analyteName: 'Analyte_Name',
  analyteDateTime: new Date(),
  analyteDateTimeOffset: undefined,
  action: new Action(),
  isSummary: false,
  totalAnalytes: 1,
  changeLotData: {
    labTestId: '1',
    reagentLots: [
      {id: 1, reagentId: 1, lotNumber: '1',  reagentCategory: 1, shelfExpirationDate: new Date() },
      {id: 3, reagentId: 3, lotNumber: '3',  reagentCategory: 1, shelfExpirationDate: new Date() }
    ],
    calibratorLots: [
      {id: 2, calibratorId: 2, lotNumber: '2', shelfExpirationDate: new Date() },
      {id: 4, calibratorId: 4, lotNumber: '4', shelfExpirationDate: new Date() }

    ],
    errorMessages: [],
    defaultReagentLot: {id: 1, reagentId: 1, lotNumber: '1',  reagentCategory: 2, shelfExpirationDate: new Date() },
    defaultCalibratorLot: {id: 2, calibratorId: 2, lotNumber: '2', shelfExpirationDate: new Date() },
    selectedReagentLot: {id: 1, reagentId: 1, lotNumber: '1',  reagentCategory: 2, shelfExpirationDate: new Date() },
    selectedCalibratorLot: {id: 2, calibratorId: 2, lotNumber: '2', shelfExpirationDate: new Date() },
    comment: ''
  },
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        value: null,
        z: null,
        displayZScore: null,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        value: null,
        z: null,
        displayZScore: null,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        value: null,
        z: null,
        displayZScore: null,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 8,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        value: null,
        z: null,
        displayZScore: null,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ]
};
