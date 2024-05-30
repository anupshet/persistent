import { AnalyteSummaryEntry, Action } from 'br-component-library';

export const analyteEntrySummaryData: AnalyteSummaryEntry = {
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
      {id: 1, reagentId: 1, lotNumber: '1', shelfExpirationDate: new Date(), reagentCategory: 1 },
      {id: 3, reagentId: 3, lotNumber: '3', shelfExpirationDate: new Date(), reagentCategory: 2 }
    ],
    calibratorLots: [
      {id: 2, calibratorId: 2, lotNumber: '2', shelfExpirationDate: new Date() },
      {id: 4, calibratorId: 4, lotNumber: '4', shelfExpirationDate: new Date() }

    ],
    errorMessages: [],
    defaultReagentLot: {id: 1, reagentId: 1, lotNumber: '1', shelfExpirationDate: new Date(), reagentCategory: 1 },
    defaultCalibratorLot: {id: 2, calibratorId: 2, lotNumber: '2', shelfExpirationDate: new Date() },
    selectedReagentLot: {id: 1, reagentId: 1, lotNumber: '1', shelfExpirationDate: new Date(), reagentCategory: 2 },
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
        mean: 1,
        sd: 1,
        cv: 1,
        numPoints: 1
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        mean: null,
        sd: null,
        cv: null,
        numPoints: null
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 0,
      isPristine: true,
      data: {
        mean: null,
        sd: null,
        cv: null,
        numPoints: null
      }
    }
  ]
};

