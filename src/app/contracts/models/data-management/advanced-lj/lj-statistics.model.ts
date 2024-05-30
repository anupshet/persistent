// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { StatisticsTypeEnum, TestSpecItemEnum } from '../../../enums/advanced-lj/lj-statistics.enum';
import { TestSpec } from '../../portal-api/labsetup-data.model';

// The payload for requesting statistics (lab, peer, method, etc.) The values to be populated depend on the type of
// statistics being requested.
export class StatisticsRequest {
  statsType: StatisticsTypeEnum;  // The type of statistic being requested
  labInstrumentId: string;  // The entity id of the lab instrument
  analyteId: number;  // The CodeList number of the analyte
  masterLotId: number;  // The product master lot id number
  testSpecId: number;  // The testspec id value
  methodId: number;  // The method id value
  startYearMonth: string;  // Used to request up to three months back or cumulative statistics (format is 202107) / string for cumulative
  endYearMonth: number;  // Used to request up to three months back or cumulative statistics (format is 202107)
  levels?: Array<number>;  // Optional array of levels for which we need data. If null or empty, all available levels are requested.
  testSpecs?: TestSpec[];  // The labtest testspecs for which the request is made. (Needed for a future epic)
  labUnitId : number;
}

// This is provided in response to the statistics request. It’s the statistics and the corresponding timeframe to which
// it should be applied. (The lines and regions for mean and SD.)
export class StatisticsResult {
  levelStatistics: LevelStatistics[]; // The statistics for the given level
}

// Statistics for a particular level
export class LevelStatistics {
  level: number;  // The QC level
  mean: number; // The mean
  sd: number; // The standard deviation
  cv: number; // The coefficient of variation
  numberOfInstruments?: number;  // The size of the group for peer and method groups.
  yearMonthsWithoutData?: number[];  // Indicates the months without data over the timeframe requested
  noDataInGivenTimeframe?: boolean;  // Indicates no data found during any timeframe including, cumulative.
}

// Specifies one TestSpec filter. Ex. { filterType: 1, id: 2005 } - this would request statistics with a reagent lot of 2005
export class TestSpecFilter {
  filterType: TestSpecItemEnum;
  id: number; // Id of the item in the TestSpec record
}

