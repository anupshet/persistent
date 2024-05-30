// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ElementRef } from '@angular/core';

import { TestSpec } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { LjChartEventType, LjChartMode, LjChartXAxisType } from '../../../../contracts/enums/advanced-lj/lj-chart.enum';
import { LjChart, LjChartConfig, LjChartDataItem } from '../../../../contracts/models/data-management/advanced-lj/lj-chart.models';
import { StatisticsResult } from '../../../../contracts/models/data-management/advanced-lj/lj-statistics.model';
import { PointDataResult } from '../../../../contracts/models/data-management/run-data.model';

export interface AdvancedLjChartHelperInterface {
  // Calls the corresponding helper function to get LjChart object needed to render Plotly chart, depending on the mode.
  // These functions iterate through all points for the selected levels, obtaining the data and configurations needed to plot the chart.
  GetChartContent(selectedLevels: Array<number>,
    startDate: Date,
    endDate: Date,
    data: PointDataResult[],
    comparisonStatistics: StatisticsResult,
    timeZone: string,
    hoverTextTranslations: any,
    appLocale: string,
    testSpecs: Array<TestSpec>,
    xAxisType: LjChartXAxisType,
    chartMode: LjChartMode,
    canvas: ElementRef,
    eventsToInclude: Array<LjChartEventType>,
    yAxisStatistics: StatisticsResult
    ): LjChart;

  // Get list of x-axis dates depending on mode and level. Should use the parent GetDateInMonthDayStringFormat function.
  GetXAxisItemsForLevel(levelData: PointDataResult[], timeZone: string, xAxisType: LjChartXAxisType, appLocale: string) : string[];

  // Get y-values for given level. This should correspond to the xAxisItems.
  GetYAxisItemsForLevel(levelData: PointDataResult[], plotByZscore: boolean) : number[];

  // For the selected levels, iterate through all points and get all warning, rejected, and not accepted points.
  // Add the points to the LjChartDataItem array to be plotted.
  GetSpecialPoints(xAxis: string, yAxis: string, xAxisItems: Array<string>, sortedAndFilteredByLevelData: Array<PointDataResult>, chartMode: LjChartMode, plotByZscore: boolean): Array<LjChartDataItem>;

  // For the given mode, populate the chart config object.
  // The x-axis range should be from startDate to endDate in the proper date format.
  // The y-axis range should be a maximum of -3SD to +3SD in range based on the most recent points' mean and SD
  // The matches property must be the same to allow synchronize zoom and pan
  GetChartConfig(data: PointDataResult[], startDate: Date, endDate: Date, timeZone: string): LjChartConfig;
}
