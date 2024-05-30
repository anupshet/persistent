// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ElementRef } from '@angular/core';

import { LjChartEventType, LjChartMode, LjChartXAxisType } from '../../../../contracts/enums/advanced-lj/lj-chart.enum';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { LjChart, LjChartAxis, LjChartConfig, LjChartDataLevel, LjChartEvent,
  LjChartSecondaryAxis, LjChartShape } from '../../../../contracts/models/data-management/advanced-lj/lj-chart.models';
import { StatisticsResult } from '../../../../contracts/models/data-management/advanced-lj/lj-statistics.model';
import { PointDataResult } from '../../../../contracts/models/data-management/run-data.model';
import { xAxisPrefix, yAxisPrefix, advancedLjDateFormatMonth, advancedLjDateFormatDay,
  advancedLjDateFormatHour, advancedLjDateFormatHour12, advancedLjDateFormatMinute, advancedLjPlotlyModeMarkers,
  advancedLjPlotlyModeLinesAndMarkers, advancedLjActionStringSpace } from '../../../../core/config/constants/advanced-lj.const';
import { AdvancedLjChartHelper } from './advanced-lj-chart-helper';
import { AdvancedLjChartHelperInterface } from './advanced-lj-chart-helper-interface';
import { RunsService } from '../../../../shared/services/runs.service';
import { TestSpec } from '../../../../contracts/models/portal-api/labsetup-data.model';

// This is the concrete class for plotting the advanced LJ charts with separated levels and repeated dates (Sequence option)
// for points on the same day.
export class AdvancedLjChartHelperForRepeatedDates
  extends AdvancedLjChartHelper
  implements AdvancedLjChartHelperInterface {

  public runsService: RunsService;

  // Calls the corresponding helper function to get LjChart object needed to render Plotly chart, depending on the mode.
  // These functions iterate through all points for the selected levels, obtaining the data and configurations needed to plot the chart.
  public GetChartContent(selectedLevels: Array<number>, startDate: Date, endDate: Date, data: PointDataResult[],
    comparisonStatistics: StatisticsResult, timeZone: string, hoverTextTranslations: any, appLocale: string,
    testSpecs: Array<TestSpec>, xAxisType: LjChartXAxisType, chartMode: LjChartMode, canvas: ElementRef,
    eventsToInclude: Array<LjChartEventType>, yAxisStatistics: StatisticsResult): LjChart {

    let ljChart = new LjChart();
    let sortedAndFilteredByLevelData: Array<PointDataResult>;
    let xAxisRange: Array<string>, yAxisRange: Array<number>;
    let plotByZscore = chartMode === LjChartMode.Overlay || chartMode === LjChartMode.Zscore;
    let isFixedMean = false, isFixedSd = false;

    if (data && data.length > 0) {
      // Get x-axis items for each selected level and the category array that is needed to ensure x-axis is sorted properly for
      // each subplot.
      let xAxisItemsResults:  [{ [level: number]: Array<string> }, Array<string>],
        xAxisItemsByLevel: { [level: number]: Array<string> },
        xAxisCategoryArray: Array<string>,
        selectedLevelsXaxisRange = new Array<Array<string>>(),    // Track all x-value ranges to determine widest range for overlay.

        // Track run ids of levels where chart events for overlays should be shown so they are not repeated for each level
        runIdLevelsForChartEvents: { [runIdLevel: string]: Array<LjChartEventType> };

      xAxisItemsResults = this.GetXAxisItems(data, selectedLevels, timeZone, appLocale, xAxisType);

      if (xAxisItemsResults && xAxisItemsResults.length === 2) {
        xAxisItemsByLevel = xAxisItemsResults[0];
        xAxisCategoryArray = xAxisItemsResults[1];
      }

      ljChart.mode = chartMode;
      ljChart.config.chartEvents = new Array<LjChartEvent>();

      // Track run ids of levels where chart events for overlays should be shown so they are not repeated for each level
      if (chartMode === LjChartMode.Overlay) {
        runIdLevelsForChartEvents = this.GetOverlayChartEventsByRunAndLevel(data.filter(dataPoint => selectedLevels.some(
          selectedLevel => dataPoint.controlLevel === selectedLevel)
        ), testSpecs);
      }

      if (xAxisItemsByLevel && ((xAxisType === LjChartXAxisType.Date)
        || (xAxisType === LjChartXAxisType.Sequence && xAxisCategoryArray && xAxisCategoryArray.length > 0))) {
        selectedLevels.forEach((level, i) => {
          let xAxisItemsOfLevel = xAxisItemsByLevel[level];
          sortedAndFilteredByLevelData = data
            .filter(dataPoint => dataPoint.controlLevel === level);

          if (sortedAndFilteredByLevelData.length > 0 && xAxisItemsOfLevel
            && xAxisItemsOfLevel.length === sortedAndFilteredByLevelData.length) {
            let chartNumber = (chartMode !== LjChartMode.Overlay ? i : 0) + 1,    // For overlay, all levels will shared the same chart.
              xAxisName = `${xAxisPrefix}${chartNumber}`,  // For synchronization, use the same name for the "matches" property of the axis
              yAxisName = `${yAxisPrefix}${chartNumber}`,
              xAxisLevelData = xAxisItemsOfLevel,
              yAxisLevelData = this.GetYAxisItemsForLevel(sortedAndFilteredByLevelData, plotByZscore),
              specialPointsChartItems = this.GetSpecialPoints(xAxisName, yAxisName, xAxisLevelData, sortedAndFilteredByLevelData, chartMode, plotByZscore),
              chartDataLevel = new LjChartDataLevel(),
              shapesForLevel: Array<LjChartShape>,
              shapesForLine : Array<LjChartShape>,
              secondaryYAxis : Array<LjChartSecondaryAxis>,
              dataLength = sortedAndFilteredByLevelData.length;

            // Get x-axis index range based on start and end dates.
            xAxisRange = this.GetXAxisRange(sortedAndFilteredByLevelData, xAxisLevelData, startDate, endDate);
            selectedLevelsXaxisRange.push(xAxisRange);

            // Get +/-3SD value from last point's targetSD value (evaluation SD) to set the y-axis range
            yAxisRange = this.GetYAxisRange(sortedAndFilteredByLevelData, chartMode);

            // Populate lines and markers for charts
            chartDataLevel.x = xAxisLevelData;
            chartDataLevel.y = yAxisLevelData;
            chartDataLevel.text = this.GetHoverTemplateInformation(sortedAndFilteredByLevelData, timeZone, appLocale, hoverTextTranslations);
            chartDataLevel.showLine = true;
            chartDataLevel.lineColor = this.GetLevelColor(level);
            chartDataLevel.xAxisName = xAxisName;
            chartDataLevel.yAxisName = yAxisName;
            chartDataLevel.level = level;
            chartDataLevel.mode = xAxisType === LjChartXAxisType.Date ? advancedLjPlotlyModeMarkers : advancedLjPlotlyModeLinesAndMarkers;
            ljChart.data.push(chartDataLevel);

            // Append items for special points: Warning, Reject, Not Accepted
            if (specialPointsChartItems && specialPointsChartItems.length > 0) {
              ljChart.data = ljChart.data.concat(specialPointsChartItems);
            }

            // Chart events
            // Overlay reagent and calibrator events are consolidated instead of repeating the same change for each level.
            if (chartMode === LjChartMode.Overlay) {
              this.GetLjChartEventsForOverlay(sortedAndFilteredByLevelData, testSpecs, `${xAxisPrefix}1`, yAxisRange,
                canvas, runIdLevelsForChartEvents, eventsToInclude).forEach(chartEvent => {
                ljChart.config.chartEvents.push(chartEvent);
              });
            } else {
              this.GetLjChartEvents(sortedAndFilteredByLevelData, testSpecs, xAxisName, yAxisRange, canvas, eventsToInclude)
                .forEach(chartEvent => {
                  ljChart.config.chartEvents.push(chartEvent);
                });
            }

            if (yAxisStatistics && yAxisStatistics.levelStatistics.length > 0) {
              if (chartMode !== LjChartMode.Overlay) {
                let yData = yAxisStatistics.levelStatistics.filter(yData => yData.level === level);
                if (yData && yData.length > 0) {
                    shapesForLevel = this.GetMeanAndSdLinesAndRegions(xAxisCategoryArray[0], xAxisCategoryArray[xAxisCategoryArray.length - 1],
                      xAxisName, yAxisName, yData[0]?.mean,  yData[0]?.sd);
                    if (shapesForLevel && shapesForLevel.length > 0) {
                      ljChart.config.shapes = ljChart.config.shapes.concat(shapesForLevel);
                    }
                  }
              }
            }

            if (!plotByZscore && !yAxisStatistics) {
              shapesForLevel = this.GetEvalMeanAndSdLinesAndRegions(sortedAndFilteredByLevelData, xAxisLevelData, xAxisName, yAxisName);

              if (shapesForLevel && shapesForLevel.length > 0) {
                ljChart.config.shapes = ljChart.config.shapes.concat(shapesForLevel);
              }

            }

            //comparison mean line and secondary y-axis
            if (comparisonStatistics && comparisonStatistics?.levelStatistics?.length > 0 && !plotByZscore) {
              let decimalPlaces = sortedAndFilteredByLevelData[0].decimalPlace; // only getting the decimal value of 1 object as all objects will have the same value
              // getting the only one level Statistics inside the for loop, below functions will excute only once per iteration
              let sData = comparisonStatistics.levelStatistics.filter(sData => sData.level === level);
              if (sData && sData.length > 0) {
                shapesForLine = this.GetDashMeanLinePoints(sData[0], xAxisCategoryArray[0], xAxisCategoryArray[xAxisCategoryArray.length - 1],
                  xAxisName, yAxisName, decimalPlaces);
                if (shapesForLine && shapesForLine.length > 0) {
                  ljChart.config.shapes = ljChart.config.shapes.concat(shapesForLine);
                }
                secondaryYAxis = this.GetSecondaryYAxis(sData[0], yAxisRange, i, decimalPlaces);
                if (secondaryYAxis && secondaryYAxis.length > 0) {
                  ljChart.config.secondaryYAxis = ljChart.config.secondaryYAxis.concat(secondaryYAxis);
                }
              }
            }

            isFixedMean = sortedAndFilteredByLevelData[dataLength - 1].meanEvaluationType === EvaluationType.Fixed;
            isFixedSd = sortedAndFilteredByLevelData[dataLength - 1].sdEvaluationType === EvaluationType.Fixed;

            // Set axis configurations
            if (chartMode !== LjChartMode.Overlay) {
              // Populate configurations and lines/rectangles and other shapes for charts.
              ljChart.config.xAxis.push({
                range: xAxisRange,
                showTitle: true,
                levels: [level],    // Axis is only for this level
                isFixedMean: isFixedMean,
                isFixedSd: isFixedSd
              } as LjChartAxis);

              // Set "matches" property for x-axis of plots after the first one so they synchronize in pan and zoom
              if (i > 0) {
                ljChart.config.xAxis[ljChart.config.xAxis.length - 1].matches = xAxisPrefix;
              }

              ljChart.config.yAxis.push({
                range: yAxisRange,   // Needs to be +/- 3SD range of values
                byZscore: plotByZscore
              } as LjChartAxis);
            }
          }
        });
      }

      // The x-axis category array ensures the x-axis of category labels is ordered properly.
      if (xAxisCategoryArray && xAxisCategoryArray.length > 0) {
        let rangeIndexes: Array<number>;

        if (chartMode !== LjChartMode.Overlay) {
          if (ljChart.config && ljChart.config.xAxis) {
            let xAxisConfig = ljChart.config.xAxis;
            let arrRangeIndexes = new Array<Array<number>>();

            for (let i = 0; i < xAxisConfig.length; i++) {
              let xAxisConfigItem = xAxisConfig[i],
                xAxisName = `${xAxisPrefix}${i + 1}`,  // For synchronization, use the same name for the "matches" property of the axis
                yAxisName = `${yAxisPrefix}${i + 1}`;

              xAxisConfigItem.categoryArray = xAxisCategoryArray;

              // Using x-range date string values, get the index within the entire x-axis category array that spans all level subplots.
              // This is because category axis ranges require indexes for the start and end values.
              if (xAxisConfigItem.range && xAxisConfigItem.range.length === 2) {
                rangeIndexes = new Array<number>();
                rangeIndexes.push(xAxisCategoryArray.indexOf(xAxisConfigItem.range[0] as string));
                rangeIndexes.push(xAxisCategoryArray.indexOf(xAxisConfigItem.range[1] as string));
                arrRangeIndexes.push(rangeIndexes);
              }

              // If plotting by z-score, save shapes for lines and regions
              if (plotByZscore) {
                let shapesForLinesAndRegions = this.GetZscoreMeanAndSdLinesAndRegions(xAxisCategoryArray[0], xAxisCategoryArray[xAxisCategoryArray.length - 1], xAxisName, yAxisName);
                if (shapesForLinesAndRegions && shapesForLinesAndRegions.length > 0) {
                  ljChart.config.shapes = ljChart.config.shapes.concat(shapesForLinesAndRegions);
                }
              }
            }

            if (arrRangeIndexes && arrRangeIndexes.length > 0) {
              // find the minimum 0th index and maximum 1st index from ranges of all the levels.
              let minIndex = arrRangeIndexes[0][0], maxIndex = arrRangeIndexes[0][1];
              arrRangeIndexes.forEach(range => {
                if (range[0] < minIndex && range[0] !== null) {
                  minIndex = range[0];
                }
                if (range[1] > maxIndex && range[1] !== null) {
                  maxIndex = range[1];
                }
              })

              for (let i = 0; i < xAxisConfig.length; i++) {
                if (xAxisConfig[i].range !== null) {
                  xAxisConfig[i].range = [minIndex, maxIndex]
                }
              }
            }
          }
        } else {
            // For overlay, use all xAxisRanges of levels to get lowest and highest range values to determine widest range
            // in shared axis. xAxisCategoryArray has all possible x-values in order.
            let catArrayIndex, lowestRangeIndex = -1, highestRangeIndex = -1, hasInitialValue = false;
            rangeIndexes = null;

            if ((xAxisCategoryArray && xAxisCategoryArray.length > 0)
              && (selectedLevelsXaxisRange && selectedLevelsXaxisRange.length > 0)) {
              selectedLevelsXaxisRange.forEach((xAxisRangeOfLevel, i) => {
                if (xAxisRangeOfLevel && xAxisRangeOfLevel.length == 2) {
                  if (!hasInitialValue) {
                    lowestRangeIndex = xAxisCategoryArray.indexOf(xAxisRangeOfLevel[0]);
                    highestRangeIndex = xAxisCategoryArray.indexOf(xAxisRangeOfLevel[1]);
                    hasInitialValue = true;
                  } else {
                    // Start index
                    catArrayIndex = xAxisCategoryArray.indexOf(xAxisRangeOfLevel[0]);
                    lowestRangeIndex = catArrayIndex >= 0 && catArrayIndex < lowestRangeIndex ? catArrayIndex : lowestRangeIndex;

                    // End index
                    catArrayIndex = xAxisCategoryArray.indexOf(xAxisRangeOfLevel[1]);
                    highestRangeIndex = catArrayIndex >= 0 && catArrayIndex > highestRangeIndex ? catArrayIndex : highestRangeIndex;
                  }
                }
              });
            }

            if (lowestRangeIndex >= 0 && lowestRangeIndex < xAxisCategoryArray.length
              && highestRangeIndex >= lowestRangeIndex && highestRangeIndex < xAxisCategoryArray.length) {
              rangeIndexes = new Array<number>();
              rangeIndexes.push(lowestRangeIndex);
              rangeIndexes.push(highestRangeIndex);
            }

            // Add mean line and SD regions by z-score for overlay.
            let xAxisName = `${xAxisPrefix}1`,
              yAxisName = `${yAxisPrefix}1`,
              shapesForOverlay = this.GetZscoreMeanAndSdLinesAndRegions(xAxisCategoryArray[0], xAxisCategoryArray[xAxisCategoryArray.length - 1], xAxisName, yAxisName);

            if (shapesForOverlay && shapesForOverlay.length > 0) {
              ljChart.config.shapes = ljChart.config.shapes.concat(shapesForOverlay);
            }

            // Populate configurations and lines/rectangles and other shapes for charts.
            ljChart.config.xAxis.push({
              range: rangeIndexes,
              showTitle: true,
              levels: selectedLevels,
              isFixedMean: isFixedMean,   // Last value for isFixedMean; used when only level is selected
              isFixedSd: isFixedSd,   // Last value for isFixedSd; used when only level is selected
              categoryArray: xAxisCategoryArray
            } as LjChartAxis);

            // +/-3 for overlay
            yAxisRange = this.GetYAxisRange([], chartMode);

            ljChart.config.yAxis.push({
              range: yAxisRange,   // Needs to be +/- 3SD range of values
              byZscore: true
            } as LjChartAxis);
        }
      }
    }
    return ljChart;
  }

  // Get list of x-axis dates depending on mode and level. Should use the parent GetDateInMonthDayStringFormat function.
  public GetXAxisItemsForLevel(levelData: PointDataResult[], timeZone: string, xAxisType: LjChartXAxisType, appLocale: string) : string[] {
    return super.GetXAxisItemsForLevel(levelData, timeZone, xAxisType, appLocale);
  }

  public GetHoverTemplateInformation(levelData: PointDataResult[], timezone: string, appLocale: string, hoverTranslations: any) {
    let hoverTemplateArray = [];
    let hoverDetailItems = this.GetHoverDetailItems(levelData),
    dateTimeFormatter = Intl.DateTimeFormat(appLocale, {
      month: advancedLjDateFormatMonth,
      day: advancedLjDateFormatDay,
      hour: advancedLjDateFormatHour,
      minute: advancedLjDateFormatMinute,
      hour12: advancedLjDateFormatHour12,
      timeZone: timezone
    });

    // format information here
    hoverDetailItems.forEach(d => {
      let levelColor = this.GetLevelColor(d.level);
      let precision = d.decimalPlace;
      let tempHoverTemplate = '';

      // First Line: Date Time
      let timeString = this.unityNextDatePipe.transform(d.dateTime, 'monthAndDateAbbreviated') + ' ' +
      this.unityNextDatePipe.transform(d.dateTime, 'shortTime');
      timeString ='<b><span style="color:' + levelColor + ';">' + timeString + '</span></b><br><br>' ;
      tempHoverTemplate += timeString;

      // Second Line: Level # and Value
      let levelString =
      '<b><span style="color:' +
      levelColor + ';">Level' + d.level + '</span></b>      <span style="text-decoration: {line-through};">' +
      this.unityNextNumericPipe.transform(d.resultValue, false, precision) + '</span><br>';
      levelString = levelString.replace('Level', hoverTranslations.level);
      tempHoverTemplate += levelString;

      // Third line: Mean and Value
      let meanString = '<span style="color:	#808080;">Mean</span>         ';
      meanString = meanString.replace('Mean', hoverTranslations.mean);
      if (d.mean) {
        meanString += this.unityNextNumericPipe.transform(d.mean, false, precision);
      }
      tempHoverTemplate += meanString + '<br>'

      // Fourth line: SD and Value
      let sdString = '<span style="color:	#808080;">SD</span>                ';
      sdString = sdString.replace('SD', hoverTranslations.sd);
      if (d.sd) {
        sdString += this.unityNextNumericPipe.transform(d.sd, false, precision);
      }
      tempHoverTemplate += sdString + '<br>';

      // Fifth line: CV and Value
      let cvString = '<span style="color:	#808080;">CV</span>               ';
      cvString = cvString.replace('CV', hoverTranslations.cv);
      if (d.cv) {
        cvString += this.unityNextNumericPipe.transform(d.cv, false, precision);
      }
      tempHoverTemplate += cvString + '<br>';

      // Sixth line: ZScore and value
      let zScoreString = '<span style="color:	#808080;">Z score</span>     ';
      zScoreString = zScoreString.replace('Z score', hoverTranslations.zScore || '');
      if (d.zScore) {
        zScoreString += this.unityNextNumericPipe.transform(d.zScore, true);
      }
      tempHoverTemplate += zScoreString + '<br>';

      // Seventh line: Reason
      let reasonString = '<span style="color:	#808080;">Reason</span>';
      reasonString = reasonString.replace('Reason', hoverTranslations.reason);
      if (d.reasons) {
        let firstReason = true;
        d.reasons.forEach(r => {
            let reasonItem = r;
            if(firstReason) {
              reasonItem = '    ' + reasonItem;
              firstReason = false;
            } else {
              reasonItem = ',<br>                      ' + reasonItem;
            }
            reasonString += reasonItem;
        })
      }
      tempHoverTemplate += reasonString + '<br>';

      // Eight line: Actions
      let actionsString = '<span style="color:	#808080;">Actions</span>';
      actionsString = actionsString.replace('Actions', hoverTranslations.actions);

      if (d.userActions) {
        let firstItem = true;
        d.userActions.forEach(a => {
          let actionItems = advancedLjActionStringSpace + a.actionName;
          actionItems = actionItems.trimEnd();
          if(firstItem) {
            actionItems = actionItems.replace(advancedLjActionStringSpace, '    ');
            firstItem = false;
          } else {
            actionItems = ',<br>' + actionItems.replace(advancedLjActionStringSpace, '                          ');
          }
          actionsString += actionItems;
        });
        tempHoverTemplate += actionsString;
      }

      if(!d.isAccepted) {
        tempHoverTemplate = tempHoverTemplate.replace('{line-through}', 'line-through');
      }

      hoverTemplateArray.push(tempHoverTemplate);
    });
    return hoverTemplateArray;
  }

  // Get y-values for given level. This should correspond to the xAxisItems.
  public GetYAxisItemsForLevel(levelData: PointDataResult[], plotByZscore: boolean) : number[] {
    let yValues = new Array<number>();

    if (levelData && levelData.length > 0) {
      yValues = levelData
        .map(dataPoint => {
          if (plotByZscore) {
            return dataPoint.zScoreData ? dataPoint.zScoreData.zScore : 0;
          }

          return dataPoint.resultValue
        });
    }

    return yValues;
  }

  // For the given mode, populate the chart config object.
  // The x-axis range should be from startDate to endDate in the proper date format.
  // The y-axis range should be a maximum of -3SD to +3SD in range based on the most recent points' mean and SD
  // This will include the mean lines and SD regions as shapes
  // The matches property must be the same to allow synchronize zoom and pan
  public GetChartConfig(data: PointDataResult[], startDate: Date, endDate: Date, timeZone: string): LjChartConfig {
    return null;
  }
}
