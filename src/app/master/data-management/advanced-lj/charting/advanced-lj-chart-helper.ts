// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ElementRef } from '@angular/core';

import { intersection } from 'lodash';
import * as moment from 'moment';

import {
  LjChartDataItem, LjChartEvent, LjChartMarker, LjChartSecondaryAxis,
  LjChartShape, LjHoverDetail} from '../../../../contracts/models/data-management/advanced-lj/lj-chart.models';
import { PointDataResult, ResultStatus } from '../../../../contracts/models/data-management/run-data.model';
import { TestSpec } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { LjChartEventType, LjChartMode, LjChartShapeForm, LjChartShapeType, LjChartXAxisType } from '../../../../contracts/enums/advanced-lj/lj-chart.enum';
import {
  advancedLjYaxisSdRange, advancedLjSpecialPointColorDefault, advancedLjSpecialPointColorReject, advancedLjSpecialPointColorWarning,
  advancedLjSpecialMarkerSymbol, advancedLjCrossSymbol, levelColors, advancedLjCrossSize, advancedLjOutOfRangeColor,
  advancedLjOutOfRangeLowSymbol, advancedLjOutOfRangeHighSymbol, advancedLjOutOfRangeSize, advancedLjSpecialPointSize,
  advancedLjOutOfRangePosDivisor, advancedLj2SdValue, advancedLj3SdValue, advancedLjLayerBelow, advancedLjMeanLineColor,
  advancedLjLayerAbove, advancedLj2SdRegionColor, advancedLj3SdRegionColor, advancedLjChartEventMeanChange, advancedLjChartEventSdChange,
  advancedLjChartEventSdChangeBG, advancedLjChartEventCalibratorChange, advancedLjChartEventReagentChange, advancedLjChartEventReagentChangeBG,
  advancedLjDateFormatMonth, advancedLjDateFormatDay, advancedLjPlotEventAnnotationOffset, advancedLjPlotyShiftShim, advancedLj1SdValue, annotationCanvasType,
  advancedLjPlotEventAnnotationFontSize, advancedLjPlotEventAnnotationFontFamily, annotationWidthAligment, advancedLjSecondaryAxisItemColor, advancedLjDashMeanShapeDash,
  advancedLjMeanDashLineSize, advancedLjSecondaryYAxisPosition, advancedLjSecondaryYAxisNoShowGrid, advancedLjSecondaryYAxisTickvalueLength, yAxisPrefix,
  advancedLjChartEventCalibratorChangeBG, advancedLjChartEventMeanChangeBG, advancedLjSecondaryYAxisIncrementValue, incrementYAxisRangeValue
} from '../../../../core/config/constants/advanced-lj.const';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { LevelStatistics } from '../../../../contracts/models/data-management/advanced-lj/lj-statistics.model';
import { Utility } from '../../../../core/helpers/utility';
import { RunsService } from '../../../../shared/services/runs.service';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';

// This is the abstract class used for various modes of LJ charts (RepeatedDate, Overlay, etc.).
export abstract class AdvancedLjChartHelper {

  constructor(public runsService: RunsService, public unityNextDatePipe: UnityNextDatePipe,
    public unityNextNumericPipe: UnityNextNumericPipe
    ) { };

  // Get list of x-axis dates depending on mode and level. For sequence, it will format the date as 'mmm dd_<runId>'. This is
  // to allow matching of data points with others in the same run to line up across subplots.
  public GetXAxisItemsForLevel(levelData: PointDataResult[], timeZone: string, xAxisType: LjChartXAxisType, appLocale: string): string[] {
    let xValues = new Array<string>(),
      curMonthDay,
      dateTimeFormatter = Intl.DateTimeFormat(appLocale, { month: advancedLjDateFormatMonth, day: advancedLjDateFormatDay, timeZone: timeZone });

    if (levelData) {
      // Loop through each data point and add month day string to x-axis values array.
      for (let i = 0, len = levelData.length; i < len; i++) {
        let dataPoint = levelData[i];
        let dateTime = dataPoint.measuredDateTime;

        if (xAxisType === LjChartXAxisType.Sequence) {
          // Track month day string
          curMonthDay = this.unityNextDatePipe.transform( dateTime, 'shortDate');

          // Get in the format "Sep 09_1243423". This is for uniqueness to properly associate each level's data point
          // with the correct x-axis position.
          xValues.push(curMonthDay + '_' + dataPoint.runId);
        } else if (xAxisType === LjChartXAxisType.Date) {
          xValues.push(this.unityNextDatePipe.transform( dateTime, 'shortDate'));
        }
      }
    }

    return xValues;
  }

  // Creates an associative array of x-axis items that have 'mmm dd_<runId>' as keys, with actual sequence dates as values.
  // This is used to set the correct x-axis items when displaying them.
  public GetXAxisItemsLookupBySequenceString(xValues: Array<string>): { [level: number]: Array<string> } {
    let xAxisItems: { [level: number]: Array<string> } = {},
      prevMonthDay, curMonthDay, curMonthDayRepetition = 0;

    if (xValues) {
      // Loop through each data point and add month day string to x-axis values array.
      for (let i = 0, len = xValues.length; i < len; i++) {
        let xValue = xValues[i];
        curMonthDay = xValue.replace(/_.*/g, '');

        if (prevMonthDay !== curMonthDay) {
          prevMonthDay = curMonthDay;
          curMonthDayRepetition = 0;
        } else {
          curMonthDayRepetition++;
        }

        xAxisItems[xValue] = this.GetDateInMonthDayStringFormatWithRepetitions(curMonthDay, curMonthDayRepetition);
      }
    }

    return xAxisItems;
  }

  // Get x-axis items for each selected level and the category array that is needed to ensure x-axis is sorted properly for
  // each subplot.
  public GetXAxisItems(dataPoints: Array<PointDataResult>, selectedLevels: Array<number>, timeZone: string, appLocale: string, xAxisType: LjChartXAxisType): [{ [level: number]: Array<string> }, Array<string>] {
    let xAxisItems: Array<string>,
      xAxisItemsAllLevels = new Array<string>(),
      xAxisItemsByLevel: { [level: number]: Array<string> } = {},
      xAxisCategoryArray: Array<string> = null;

    if (dataPoints && dataPoints.length > 0) {
      // Sequence date x-axis
      if (xAxisType === LjChartXAxisType.Sequence || xAxisType === LjChartXAxisType.Date) {
        // The x-axis category array ensures the x-axis of category labels is ordered properly. Get all possible x-axis items.
        xAxisCategoryArray = this.GetXAxisItemsForLevel(dataPoints, timeZone, xAxisType, appLocale);

        // Get each level's x-axis items and also add them to a collection that will filter the xAxisCategoryArray.
        selectedLevels.forEach((level) => {
          let dataPointsByLevel = dataPoints
            .filter(dataPoint => dataPoint.controlLevel === level);

          // Gets x-axis items in format of 'mmm dd_<run id>'. This is to allow association of data points with proper runs by date
          // as there can be multiple points for a level in the same day.
          xAxisItems = this.GetXAxisItemsForLevel(dataPointsByLevel, timeZone, xAxisType, appLocale);
          xAxisItemsByLevel[level] = xAxisItems;
          xAxisItemsAllLevels = xAxisItemsAllLevels.concat(xAxisItems);
        });

        if (xAxisCategoryArray && xAxisCategoryArray.length > 0 && xAxisItemsAllLevels && xAxisItemsAllLevels.length > 0) {
          // Remove duplicate items that are all possible date items that intersect with the level x-axis items.
          xAxisCategoryArray = intersection(xAxisCategoryArray, xAxisItemsAllLevels);

          // Get a map of keys 'mmm dd_<run id>' to values 'mmm dd' with the proper padding spaces for uniqueness of the sequence
          // category labels.
          let xAxisItemsLookup = this.GetXAxisItemsLookupBySequenceString(xAxisCategoryArray);

          // Update x-axis items in category array from 'mmm dd_<run id>' to 'mmm_dd' format.
          xAxisCategoryArray.forEach((xAxisItem, i, xAxisItems) => {
            xAxisItems[i] = xAxisItemsLookup[xAxisItem];
          });

          // Update x-axis items for all x-axis items by level from 'mmm dd_<run id>' to 'mmm_dd' format.
          selectedLevels.forEach((level) => {
            if (xAxisItemsByLevel[level] && xAxisItemsByLevel[level].length > 0) {
              xAxisItemsByLevel[level].forEach((xAxisItem, i, xAxisItems) => {
                xAxisItems[i] = xAxisItemsLookup[xAxisItem];
              });
            }
          });
        }
      } else {
        // Get Date format x-axis items
        selectedLevels.forEach((level) => {
          let dataPointsByLevel = dataPoints
            .filter(dataPoint => dataPoint.controlLevel === level);

          // Gets x-axis items in format of 'mmm dd_<run id>'. This is to allow association of data points with proper runs by date
          // as there can be multiple points for a level in the same day.
          xAxisItemsByLevel[level] = this.GetXAxisItemsForLevel(dataPointsByLevel, timeZone, xAxisType, appLocale);
        });
      }
    }

    return [xAxisItemsByLevel, xAxisCategoryArray];
  }

  // Extract data needed in LjHoverDetail object for hover template.
  public GetHoverDetailItems(data: PointDataResult[]): LjHoverDetail[] {

    let hoverDetail = new Array<LjHoverDetail>();

    data.forEach(d => {
      let tempHoverDetail = new LjHoverDetail;
      tempHoverDetail.isAccepted = d.isAccepted;
      tempHoverDetail.resultValue = d.resultValue;
      tempHoverDetail.dateTime = d.measuredDateTime;
      tempHoverDetail.level = d.controlLevel;
      tempHoverDetail.decimalPlace = d.decimalPlace || 2;
      tempHoverDetail.mean = d.targetMean || null;
      tempHoverDetail.sd = d.targetSD || null;
      if (d.zScoreData && d.zScoreData.zScore) {
        tempHoverDetail.zScore = d.zScoreData.zScore;
      } else {
        tempHoverDetail.zScore = null;
      }
      tempHoverDetail.userActions = d.userActions || null;

      if (tempHoverDetail.mean && tempHoverDetail.sd) {
        tempHoverDetail.cv = Utility.calculateCV(d.targetSD, d.targetMean);
      } else {
        tempHoverDetail.cv = null;
      }

      // Add Reason Info When Available
      if (d.ruleViolated && d.ruleViolated.length > 0) {
        tempHoverDetail.reasons = this.runsService.convertReasons(d);
      } else {
        tempHoverDetail.reasons = null;
      }

      hoverDetail.push(tempHoverDetail);
    })
    return hoverDetail;
  }

  // Used to get month-day strings from a date as in 'Jun 01' and 'Dec 20'
  public GetDateInMonthDayStringFormat(dateTime: Date, dateFormatter: Intl.DateTimeFormat): string {
    return dateFormatter.format(dateTime);
  }

  // Used to show month-day strings as in 'Jun 01' and 'Dec 20'. This is needed for some chart modes like 'RepeatedDays'.
  // When a level has more than one point on a day, each point gets a unique string of that day.
  // For example, 'Jun 01', 'Jun 01 ', ' Jun 01 ', ' Jun 01  ', '  Jun 01  ', and so on.
  // This is needed by plotly to allow repeated x-axis values.
  public GetDateInMonthDayStringFormatWithRepetitions(monthDayString: string, repetitionNumber: number): string {
    const dateString = monthDayString,
      dateStringPadding = ' ',
      repeatCount = repetitionNumber / 2,
      hasOddNumberOfSpaces = repetitionNumber % 2;
    let prePadding, postPadding;

    // Add balanced padding, but if odd number, the extra space should be added to end of string.
    prePadding = dateStringPadding.repeat(repeatCount);
    postPadding = dateStringPadding.repeat(repeatCount + (hasOddNumberOfSpaces ? 1 : 0));

    return `${prePadding}${dateString}${postPadding}`;
  }

  // Gets date-time in format that plotly uses for graphing with a date x-axis. Example output would be '2021-06-21 15:39:25'
  public GetDateInDateStringFormat(dateTime: Date, timeZone: string): string {
    const momentDate = moment(dateTime);
    return momentDate.tz(timeZone).format('YYYY-MM-DD 00:00:00');
  }

  // Returns events used to render annotations for when there are reagent or calibrator lot changes. Also, for fixed and floating mean/SD changes.
  public GetLjChartEvents(levelData: PointDataResult[], testSpecs: TestSpec[], xAxisName: string, yAxisRange: number[], annotationCanvas : ElementRef,
    eventsToInclude: Array<LjChartEventType>): LjChartEvent[] {
    let chartEvents = new Array<LjChartEvent>();

    if (levelData.length > 0 && eventsToInclude) {
      for (let p = 1, len = levelData.length; p < len; p++) {
        let previousPoint = levelData[p - 1];
        let currentPoint = levelData[p];
        let previousTestSpecId = previousPoint.testSpecId;
        let currentTestSpecId = currentPoint.testSpecId;
        let previousMeanEvalType = previousPoint.meanEvaluationType;
        let currentMeanEvalType = currentPoint.meanEvaluationType;
        let previousSdEvalType = previousPoint.sdEvaluationType;
        let currentSdEvalType = currentPoint.sdEvaluationType;

        // Setup position of event hover
        let topValue = yAxisRange ? yAxisRange[1] : 0;
        let eventItems = new Array<LjChartEvent>();

        // Evaluation of Reagent/Calibrator Lot Change
        if (testSpecs && testSpecs.length > 0 && currentTestSpecId > 0 && previousTestSpecId > 0
          && currentTestSpecId !== previousTestSpecId) {
          const currTestSpecData: TestSpec = testSpecs.find(ts => ts?.id === currentTestSpecId);
          const prevTestSpecData: TestSpec = testSpecs.find(ts => ts?.id === previousTestSpecId);

          if (!!currTestSpecData && !!prevTestSpecData) {
            if (eventsToInclude.some(evt => evt === LjChartEventType.ReagentLotChange)
              && (currTestSpecData.reagentLotId !== prevTestSpecData.reagentLotId
              || currTestSpecData.reagentId !== prevTestSpecData.reagentId)) {
              let tempChartEvent = new LjChartEvent();
              tempChartEvent.eventType = LjChartEventType.ReagentLotChange;
              tempChartEvent.targetXIndex = p;
              tempChartEvent.xAxis = xAxisName;
              tempChartEvent.controlLevel = currentPoint.controlLevel;
              tempChartEvent.yValue = topValue;
              tempChartEvent.text = 'R ' + currTestSpecData.reagentLotNumber;
              tempChartEvent.xShift = this.getAnnotationWidth(tempChartEvent.text, annotationCanvas);
              tempChartEvent.color = advancedLjChartEventReagentChange;
              tempChartEvent.bgColor = advancedLjChartEventReagentChangeBG;
              eventItems.push(tempChartEvent);
            }

            if (eventsToInclude.some(evt => evt === LjChartEventType.CalibratorLotChange)
              && currTestSpecData.calibratorLotId !== prevTestSpecData.calibratorLotId
              || currTestSpecData.calibratorId !== prevTestSpecData.calibratorId) {
              let tempChartEvent = new LjChartEvent();
              tempChartEvent.eventType = LjChartEventType.CalibratorLotChange
              tempChartEvent.targetXIndex = p;
              tempChartEvent.xAxis = xAxisName;
              tempChartEvent.controlLevel = currentPoint.controlLevel;
              tempChartEvent.yValue = topValue;
              tempChartEvent.text = 'C ' + currTestSpecData.calibratorLotNumber;
              tempChartEvent.xShift = this.getAnnotationWidth(tempChartEvent.text, annotationCanvas);
              tempChartEvent.color = advancedLjChartEventCalibratorChange;
              tempChartEvent.bgColor = advancedLjChartEventCalibratorChangeBG;
              eventItems.push(tempChartEvent);
            }
          }
        }

        // Evaluation of Mean Change
        if (eventsToInclude.some(evt => evt === LjChartEventType.MeanChange)
          && currentMeanEvalType !== previousMeanEvalType) {
          let tempChartEvent = new LjChartEvent();
          tempChartEvent.eventType = LjChartEventType.MeanChange;
          tempChartEvent.targetXIndex = p;
          tempChartEvent.xAxis = xAxisName;
          tempChartEvent.controlLevel = currentPoint.controlLevel;
          tempChartEvent.yValue = topValue;
          tempChartEvent.bgColor = advancedLjChartEventMeanChangeBG;
          tempChartEvent.color = advancedLjChartEventMeanChange;
          if (currentMeanEvalType == EvaluationType.Fixed) {
            tempChartEvent.text = 'M  {evalfixedmean}'; // translation happens later
            tempChartEvent.xShift = 50;
          } else {
            tempChartEvent.text = 'M  {evalfloatmean}'; // tranlsation happens later
            tempChartEvent.xShift = 58;
          }
          eventItems.push(tempChartEvent);
        }

        // Evaluation of Sd Change
        if (eventsToInclude.some(evt => evt === LjChartEventType.SdChange)
          && currentSdEvalType !== previousSdEvalType) {
          let tempChartEvent = new LjChartEvent();
          tempChartEvent.eventType = LjChartEventType.SdChange;
          tempChartEvent.targetXIndex = p;
          tempChartEvent.xAxis = xAxisName;
          tempChartEvent.controlLevel = currentPoint.controlLevel;
          tempChartEvent.yValue = topValue;
          tempChartEvent.bgColor = advancedLjChartEventSdChangeBG;
          tempChartEvent.color = advancedLjChartEventSdChange;
          if (currentSdEvalType == EvaluationType.Fixed) {
            tempChartEvent.text = 'SD  {evalfixedsd}';
            tempChartEvent.xShift = 42;
          } else {
            tempChartEvent.text = 'SD  {evalfloatsd}';
            tempChartEvent.xShift = 51;
          }
          eventItems.push(tempChartEvent);
        }

        // If multiple events, they must be offset from each other consecutively down the y-axis.
        if (eventItems.length > 0) {
          eventItems.forEach((eI, i) => {
            // Bug fix 219076 AJT 9/23/2021  yshift elements down so top one doesnt cover level header info
            eI.yShift = (eI.yShift - i * advancedLjPlotEventAnnotationOffset) - advancedLjPlotyShiftShim;
            chartEvents.push(eI);
          });
        }
      }
    }

    return chartEvents;
  }

  public GetOverlayChartEventsByRunAndLevel(levelData: PointDataResult[], testSpecs: TestSpec[]): { [runIdLevel: string]: Array<LjChartEventType> } {
    let runLevelsWithChanges: { [runIdLevel: string]: Array<LjChartEventType> } = {};

    if (levelData && levelData.length > 0 && testSpecs && testSpecs.length > 0) {
      for (let p = 1, len = levelData.length; p < len; p++) {
        let currentPoint = levelData[p],
          previousTestSpecId = levelData[p-1].testSpecId,
          currentTestSpecId = currentPoint.testSpecId,
          key = `${currentPoint.runId}_${currentPoint.controlLevel}`;

        // Evaluation of Reagent/Calibrator Lot Change
        if (currentTestSpecId > 0 && previousTestSpecId > 0
          && currentTestSpecId !== previousTestSpecId) {
          const currTestSpecData: TestSpec = testSpecs.find(ts => ts?.id === currentTestSpecId);
          const prevTestSpecData: TestSpec = testSpecs.find(ts => ts?.id === previousTestSpecId);

          if (!!currTestSpecData && !!prevTestSpecData) {
            runLevelsWithChanges[key] = new Array<LjChartEventType>();

            if (currTestSpecData.reagentLotId !== prevTestSpecData.reagentLotId
              || currTestSpecData.reagentId !== prevTestSpecData.reagentId) {
              runLevelsWithChanges[key].push(LjChartEventType.ReagentLotChange);
            }

            if (currTestSpecData.calibratorLotId !== prevTestSpecData.calibratorLotId
              || currTestSpecData.calibratorId !== prevTestSpecData.calibratorId) {
              runLevelsWithChanges[key].push(LjChartEventType.CalibratorLotChange);
            }
          }
        }
      }
    }

    return runLevelsWithChanges;
  }

  // Returns events used to render annotations for when there are reagent or calibrator lot changes. Also, for fixed and floating mean/SD changes.
  public GetLjChartEventsForOverlay(levelData: PointDataResult[], testSpecs: TestSpec[], xAxisName: string, yAxisRange: number[], annotationCanvas : ElementRef,
    runIdLevelsForChartEvents: { [runIdLevel: string]: Array<LjChartEventType> }, eventsToInclude: Array<LjChartEventType>): LjChartEvent[] {
      let chartEvents = new Array<LjChartEvent>();

      if (levelData.length > 0 && eventsToInclude) {
        for (let p = 0, len = levelData.length; p < len; p++) {
          let currentPoint = levelData[p],
            currentTestSpecId = currentPoint.testSpecId,
            runIdLevel = runIdLevelsForChartEvents
              ? runIdLevelsForChartEvents[`${currentPoint.runId}_${currentPoint.controlLevel}`]
              : null;

          // Setup position of event hover
          let topValue = yAxisRange ? yAxisRange[1] : 0;
          let eventItems = new Array<LjChartEvent>();

          // Evaluation of Reagent/Calibrator Lot Change
          if (testSpecs && testSpecs.length > 0 && runIdLevel && runIdLevel.length > 0) {
            const currTestSpecData: TestSpec = testSpecs.find(ts => ts?.id === currentTestSpecId);

            if (currTestSpecData) {
              if (eventsToInclude.some(evt => evt === LjChartEventType.ReagentLotChange)
                && runIdLevel.some(value => value === LjChartEventType.ReagentLotChange)) {
                let tempChartEvent = new LjChartEvent();
                tempChartEvent.eventType = LjChartEventType.ReagentLotChange;
                tempChartEvent.targetXIndex = p;
                tempChartEvent.xAxis = xAxisName;
                tempChartEvent.controlLevel = currentPoint.controlLevel;
                tempChartEvent.yValue = topValue;
                tempChartEvent.text = 'R ' + currTestSpecData.reagentLotNumber;
                tempChartEvent.xShift = this.getAnnotationWidth(tempChartEvent.text , annotationCanvas);
                tempChartEvent.color = advancedLjChartEventReagentChange;
                tempChartEvent.bgColor = advancedLjChartEventReagentChangeBG;
                eventItems.push(tempChartEvent);
              }

              if (eventsToInclude.some(evt => evt === LjChartEventType.CalibratorLotChange)
                && runIdLevel.some(value => value === LjChartEventType.CalibratorLotChange)) {
                let tempChartEvent = new LjChartEvent();
                tempChartEvent.eventType = LjChartEventType.CalibratorLotChange
                tempChartEvent.targetXIndex = p;
                tempChartEvent.xAxis = xAxisName;
                tempChartEvent.controlLevel = currentPoint.controlLevel;
                tempChartEvent.yValue = topValue;
                tempChartEvent.text = 'C ' + currTestSpecData.calibratorLotNumber;
                tempChartEvent.xShift = this.getAnnotationWidth(tempChartEvent.text , annotationCanvas);
                tempChartEvent.color = advancedLjChartEventCalibratorChange;
                tempChartEvent.bgColor = advancedLjChartEventCalibratorChangeBG;
                eventItems.push(tempChartEvent);
              }
            }
          }

          // If multiple events, they must be offset from each other consecutively down the y-axis.
          if (eventItems.length > 0) {
            eventItems.forEach((eI, i) => {
              eI.yShift = (eI.yShift - i * advancedLjPlotEventAnnotationOffset) - advancedLjPlotyShiftShim;
              chartEvents.push(eI);
            });
          }
        }
      }

      return chartEvents;
  }

  // For the selected levels, iterate through all points and get all warning, rejected, and not accepted points.
  // Add the points to the LjChartDataItem array to be plotted.
  public GetSpecialPoints(xAxis: string, yAxis: string, xAxisItems: Array<string>, sortedAndFilteredByLevelData: Array<PointDataResult>, chartMode: LjChartMode, plotByZscore: boolean): Array<LjChartDataItem> {
    let xAxisItemsWarning = new Array<string>(),
      yAxisItemsWarning = new Array<number>(),
      xAxisItemsReject = new Array<string>(),
      yAxisItemsReject = new Array<number>(),
      xAxisItemsNotAccepted = new Array<string>(),
      yAxisItemsNotAccepted = new Array<number>(),
      xAxisItemsWarningNotAccepted = new Array<string>(),
      yAxisItemsWarningNotAccepted = new Array<number>(),
      xAxisItemsRejectNotAccepted= new Array<string>(),
      yAxisItemsRejectNotAccepted = new Array<number>(),
      xAxisItemsOutOfRangeLow = new Array<string>(),
      yAxisItemsOutOfRangeLow = new Array<number>(),
      xAxisItemsOutOfRangeHigh = new Array<string>(),
      yAxisItemsOutOfRangeHigh = new Array<number>(),
      chartDataItems = new Array<LjChartDataItem>(),
      ljChartMarker: LjChartMarker;

    if (xAxisItems && xAxisItems.length > 0 && sortedAndFilteredByLevelData && sortedAndFilteredByLevelData.length > 0) {
      let yAxisRange = this.GetYAxisRange(sortedAndFilteredByLevelData, chartMode),
        hasYaxisRange = yAxisRange && yAxisRange.length === 2,
        yValueLow: number, yValueHigh: number,
        yValue = 0;

      sortedAndFilteredByLevelData.forEach((levelData, i) => {
        if (plotByZscore) {
          yValue = levelData.zScoreData ? levelData.zScoreData.zScore : 0;
        } else {
          yValue = levelData.resultValue;
        }

        switch (levelData.resultStatus) {
          case ResultStatus.Warning:
            if (levelData.isAccepted) {
              // Warning - Accepted
              xAxisItemsWarning.push(xAxisItems[i]);
              yAxisItemsWarning.push(yValue);
            } else {
              // Warning - Not Accepted
              xAxisItemsWarningNotAccepted.push(xAxisItems[i]);
              yAxisItemsWarningNotAccepted.push(yValue);
            }
            break;
          case ResultStatus.Reject:
            if (levelData.isAccepted) {
              // Reject - Accepted
              xAxisItemsReject.push(xAxisItems[i]);
              yAxisItemsReject.push(yValue);
            } else {
              // Reject - Not Accepted
              xAxisItemsRejectNotAccepted.push(xAxisItems[i]);
              yAxisItemsRejectNotAccepted.push(yValue);
            }
            break;
          default:
            // Not Accepted
            if (!levelData.isAccepted) {
              xAxisItemsNotAccepted.push(xAxisItems[i]);
              yAxisItemsNotAccepted.push(yValue);
            }
            break;
        }

        // Also, determine if out of range
        if (hasYaxisRange) {
          yValueLow = yAxisRange[0];
          yValueHigh = yAxisRange[1];

          // Position slightly below and above +/- 3 SD
          let yOffset = (yValueHigh - yValueLow) / advancedLjOutOfRangePosDivisor;
          if (yValue < yValueLow) {
            xAxisItemsOutOfRangeLow.push(xAxisItems[i]);
            yAxisItemsOutOfRangeLow.push(yValueLow + yOffset);
          } else if (yValue > yValueHigh) {
            xAxisItemsOutOfRangeHigh.push(xAxisItems[i]);
            yAxisItemsOutOfRangeHigh.push(yValueHigh - yOffset);
          }
        }
      });

      // Warning - Accepted
      if (xAxisItemsWarning.length > 0) {
        ljChartMarker = this.GetSpecialPointsMarker(ResultStatus.Warning, true);
        chartDataItems.push(this.CreateChartDataItem(xAxis, yAxis, xAxisItemsWarning, yAxisItemsWarning, [], ljChartMarker, true));
      }

      // Warning - Not Accepted
      if (xAxisItemsWarningNotAccepted.length > 0) {
        ljChartMarker = this.GetSpecialPointsMarker(ResultStatus.Warning, false);
        chartDataItems.push(this.CreateChartDataItem(xAxis, yAxis, xAxisItemsWarningNotAccepted, yAxisItemsWarningNotAccepted, [], ljChartMarker, true));
      }

      // Reject - Accepted
      if (xAxisItemsReject.length > 0) {
        ljChartMarker = this.GetSpecialPointsMarker(ResultStatus.Reject, true);
        chartDataItems.push(this.CreateChartDataItem(xAxis, yAxis, xAxisItemsReject, yAxisItemsReject, [], ljChartMarker, true));
      }

      // Reject - Not Accepted
      if (xAxisItemsRejectNotAccepted.length > 0) {
        ljChartMarker = this.GetSpecialPointsMarker(ResultStatus.Reject, false);
        chartDataItems.push(this.CreateChartDataItem(xAxis, yAxis, xAxisItemsRejectNotAccepted, yAxisItemsRejectNotAccepted, [], ljChartMarker, true));
      }

      // Not Accepted
      if (xAxisItemsNotAccepted.length > 0) {
        ljChartMarker = this.GetSpecialPointsMarker(ResultStatus.None, false);
        chartDataItems.push(this.CreateChartDataItem(xAxis, yAxis, xAxisItemsNotAccepted, yAxisItemsNotAccepted, [], ljChartMarker, true));
      }

      // Out of range - low
      if (xAxisItemsOutOfRangeLow.length > 0) {
        ljChartMarker = this.GetOutOfRangePointMarker(true);
        chartDataItems.push(this.CreateChartDataItem(xAxis, yAxis, xAxisItemsOutOfRangeLow, yAxisItemsOutOfRangeLow, [], ljChartMarker, false));
      }

      // Out of range - high
      if (xAxisItemsOutOfRangeHigh.length > 0) {
        ljChartMarker = this.GetOutOfRangePointMarker(false);
        chartDataItems.push(this.CreateChartDataItem(xAxis, yAxis, xAxisItemsOutOfRangeHigh, yAxisItemsOutOfRangeHigh, [], ljChartMarker, false));
      }
    }

    return chartDataItems;
  }

  // Get level color for levels 1 - 6 that are currently supported.
  protected GetLevelColor(level: number): string {
    if (levelColors.length > 0 && level >= 1 && level <= levelColors.length) {
      return levelColors[level - 1];
    }

    return '';
  }

  // Get x-axis range of dates based on start and end dates
  protected GetXAxisRange(sortedAndFilteredByLevelData: Array<PointDataResult>, xAxisLevelData: Array<string>, startDate: Date, endDate: Date): Array<string> {
    let rangeStartIndex: number, rangeEndIndex: number;

    let dataStartDate = new Date(sortedAndFilteredByLevelData[0].measuredDateTime);
    let dataEndDate = new Date(sortedAndFilteredByLevelData[sortedAndFilteredByLevelData.length - 1].measuredDateTime);

    // if selected dates are before or after dataRange
    if (endDate < dataStartDate || startDate > dataEndDate) {
      return null;
    }


    if (sortedAndFilteredByLevelData && sortedAndFilteredByLevelData.length > 0) {
      rangeStartIndex = sortedAndFilteredByLevelData.findIndex(dataItem => (new Date(dataItem.measuredDateTime)) >= startDate);
      rangeEndIndex = sortedAndFilteredByLevelData.findIndex(dataItem => (new Date(dataItem.measuredDateTime)) > endDate) - 1;

      // If there is no point after the end date, then the range includes the end of the array.
      if (rangeEndIndex < 0) {
        rangeEndIndex = sortedAndFilteredByLevelData.length - 1;
      }

      return rangeStartIndex >= 0 && rangeEndIndex >= rangeStartIndex
        ? [xAxisLevelData[rangeStartIndex], xAxisLevelData[rangeEndIndex]]
        : null;
    }

    return null;
  }

  // Get 3SD value from last point's targetSD value (evaluation SD) to set the y-axis range
  protected GetYAxisRange(sortedAndFilteredByLevelData: PointDataResult[], chartMode: LjChartMode): Array<number> {
    let meanValue = 0, range3SdValue = 0, minValue = 0, maxValue = 0;

    if (chartMode === LjChartMode.Overlay || chartMode === LjChartMode.Zscore) {
      return [-advancedLjYaxisSdRange, advancedLjYaxisSdRange];
    } else {
      if (sortedAndFilteredByLevelData && sortedAndFilteredByLevelData.length > 0) {
        let lastPointWithZscore = null;

        // Get the most recent point with a z-score.
        for (let len = sortedAndFilteredByLevelData.length, i = len - 1; i >= 0; i--) {
          let dataPoint = sortedAndFilteredByLevelData[i];
          if (dataPoint.zScoreData && dataPoint.zScoreData.display) {
            lastPointWithZscore = dataPoint;
            break;
          }
        }

        if (lastPointWithZscore) {
          meanValue = lastPointWithZscore.targetMean;
          range3SdValue = lastPointWithZscore.targetSD * advancedLjYaxisSdRange;
          minValue = meanValue - range3SdValue;
          maxValue = meanValue + range3SdValue;
        } else {
          // Use min and max values if we still don't have z-scores
          let valuesArray = sortedAndFilteredByLevelData.map(dataPoint => dataPoint.resultValue);
          minValue = Math.min(...valuesArray) - incrementYAxisRangeValue;
          maxValue = Math.max(...valuesArray) + incrementYAxisRangeValue;
        }

        return [minValue, maxValue];
      }
    }

    return null;
  }

  // Get mean lines and SD regions for this data
  protected GetEvalMeanAndSdLinesAndRegions(sortedAndFilteredByLevelData: PointDataResult[], xAxisItems: Array<string>, xAxisName: string, yAxisName: string): Array<LjChartShape> {
    let meanAndSdShapes = new Array<LjChartShape>(),
      currentMeanLine: LjChartShape,
      currentLowWarningRegion: LjChartShape,
      currentHighWarningRegion: LjChartShape,
      currentLowRejectionRegion: LjChartShape,
      currentHighRejectionRegion: LjChartShape,
      currentPoint: PointDataResult,
      currentMeanEvalType: EvaluationType,
      currentSdEvalType: EvaluationType,
      currentMeanValue: number,
      currentSdValue: number,
      hasMeanLineStarted = false,
      hasSdRegionStarted = false,
      indexWithChange = -1,
      hasEvalMeanChanged = false,
      hasEvalSdChanged = false,
      hasZscore = false,
      isFixedMean = false;

    // Lines and regions are only for cases where we have two points or more.
    if (sortedAndFilteredByLevelData && sortedAndFilteredByLevelData.length > 1 && xAxisItems && xAxisItems.length === sortedAndFilteredByLevelData.length) {
      // Starting from last point and moving backwards
      for (let len = sortedAndFilteredByLevelData.length, i = len - 1; i >= 0; i--) {
        currentPoint = sortedAndFilteredByLevelData[i];

        // Determine if mean line has a change - either eval type changed or if fixed, the fixed value changed
        hasEvalMeanChanged = currentMeanEvalType !== currentPoint.meanEvaluationType
          || (currentMeanEvalType === EvaluationType.Fixed && currentPoint.targetMean !== currentMeanValue);

        // Determine if SD region has a change - either eval type changed or if fixed, the fixed value changed
        hasEvalSdChanged = currentSdEvalType !== currentPoint.sdEvaluationType
          || (currentSdEvalType === EvaluationType.Fixed && currentPoint.targetSD !== currentSdValue);

        hasZscore = currentPoint.zScoreData && currentPoint.zScoreData.display;
        isFixedMean = currentPoint.meanEvaluationType === EvaluationType.Fixed;

        // SD Regions

        // Has SD region been started
        if (hasSdRegionStarted) {
          // If new eval type or fixed value has changed or at the first data point, then we need to close off the line
          if (hasEvalMeanChanged || hasEvalSdChanged || i === 0) {
            indexWithChange = (hasEvalMeanChanged || hasEvalSdChanged) && !hasZscore ? i + 1 : i;   // Go forward one increment if that is the one with a z-score
            let xAxisItemWithChange = xAxisItems[indexWithChange];    // Close off the current region
            currentLowWarningRegion.x0 = xAxisItemWithChange;
            currentHighWarningRegion.x0 = xAxisItemWithChange;
            currentLowRejectionRegion.x0 = xAxisItemWithChange;
            currentHighRejectionRegion.x0 = xAxisItemWithChange;

            meanAndSdShapes.push(currentLowWarningRegion);
            meanAndSdShapes.push(currentHighWarningRegion);
            meanAndSdShapes.push(currentLowRejectionRegion);
            meanAndSdShapes.push(currentHighRejectionRegion);
            hasSdRegionStarted = false;
          }
        }

        // Begin a new region if there was a change
        if (!hasSdRegionStarted && hasZscore && (hasEvalSdChanged || hasEvalMeanChanged)) {
          hasSdRegionStarted = true;
          currentSdEvalType = currentPoint.sdEvaluationType;
          currentSdValue = currentPoint.targetSD;

          // -2SD
          currentLowWarningRegion = this.CreateChartShape(LjChartShapeType.Sd2Region, xAxisName, yAxisName);
          currentLowWarningRegion.x1 = xAxisItems[i];
          currentLowWarningRegion.y0 = currentPoint.targetMean - advancedLj2SdValue * currentSdValue;
          currentLowWarningRegion.y1 = currentPoint.targetMean - currentSdValue;

          // +2SD
          currentHighWarningRegion = this.CreateChartShape(LjChartShapeType.Sd2Region, xAxisName, yAxisName);
          currentHighWarningRegion.x1 = xAxisItems[i];
          currentHighWarningRegion.y0 = currentPoint.targetMean + currentSdValue;
          currentHighWarningRegion.y1 = currentPoint.targetMean + advancedLj2SdValue * currentSdValue;

          // -3SD
          currentLowRejectionRegion = this.CreateChartShape(LjChartShapeType.Sd3Region, xAxisName, yAxisName);
          currentLowRejectionRegion.x1 = xAxisItems[i];
          currentLowRejectionRegion.y0 = currentPoint.targetMean - advancedLj3SdValue * currentSdValue;
          currentLowRejectionRegion.y1 = currentPoint.targetMean - advancedLj2SdValue * currentSdValue;

          // +3SD
          currentHighRejectionRegion = this.CreateChartShape(LjChartShapeType.Sd3Region, xAxisName, yAxisName);
          currentHighRejectionRegion.x1 = xAxisItems[i];
          currentHighRejectionRegion.y0 = currentPoint.targetMean + advancedLj2SdValue * currentSdValue;
          currentHighRejectionRegion.y1 = currentPoint.targetMean + advancedLj3SdValue * currentSdValue;
        }

        // Mean line

        // Has mean line been started
        if (hasMeanLineStarted) {
          // If new eval type or fixed value has changed or at the first data point, then we need to close off the line
          if (hasEvalMeanChanged || i === 0) {
            indexWithChange = hasEvalMeanChanged ? i + 1 : i;   // Go forward one increment as that is where the change took place
            currentMeanLine.x0 = xAxisItems[indexWithChange];   // Close off the line at the previous index value if the eval mean changed

            // If not closed off at the same x position
            if (currentMeanLine.x0 !== currentMeanLine.x1) {
              meanAndSdShapes.push(currentMeanLine);
            }
            hasMeanLineStarted = false;

            // If eval mean changed and not at first point, then add connecting line to indicate mean change between points
            if (hasEvalMeanChanged && (hasZscore || isFixedMean) && indexWithChange > i) {
              let previousMeanLine = currentMeanLine;
              currentMeanLine = this.CreateChartShape(LjChartShapeType.MeanLine, xAxisName, yAxisName);
              currentMeanLine.x0 = xAxisItems[i];
              currentMeanLine.x1 = xAxisItems[indexWithChange];
              currentMeanLine.y0 = currentPoint.targetMean;
              currentMeanLine.y1 = previousMeanLine.y0;
              meanAndSdShapes.push(currentMeanLine);
            }
          }
        }

        // Begin a new line if there was a change
        if (!hasMeanLineStarted && (hasZscore || isFixedMean) && hasEvalMeanChanged) {
          hasMeanLineStarted = true;
          currentMeanEvalType = currentPoint.meanEvaluationType;
          currentMeanValue = currentPoint.targetMean;
          currentMeanLine = this.CreateChartShape(LjChartShapeType.MeanLine, xAxisName, yAxisName);
          currentMeanLine.x1 = xAxisItems[i];
          currentMeanLine.y0 = currentPoint.targetMean;
          currentMeanLine.y1 = currentPoint.targetMean;
        }
      }
    }

    return meanAndSdShapes;
  }

  // Get mean lines and SD regions by z-score
  protected GetZscoreMeanAndSdLinesAndRegions(xStartValue: string, xEndValue: string, xAxisName: string, yAxisName: string): Array<LjChartShape> {
    return this.GetMeanAndSdLinesAndRegions(xStartValue, xEndValue, xAxisName, yAxisName, 0, 1);
  }

  // Get mean lines and SD regions by mean and SD values
  protected GetMeanAndSdLinesAndRegions(xStartValue: string, xEndValue: string, xAxisName: string, yAxisName: string, meanValue: number, sdValue: number): Array<LjChartShape> {
    let meanAndSdShapes = new Array<LjChartShape>(),
      meanLine: LjChartShape,
      lowWarningRegion: LjChartShape,
      highWarningRegion: LjChartShape,
      lowRejectionRegion: LjChartShape,
      highRejectionRegion: LjChartShape;

    meanLine = this.CreateChartShape(LjChartShapeType.MeanLine, xAxisName, yAxisName);
    meanLine.x0 = xStartValue;
    meanLine.x1 = xEndValue;
    meanLine.y0 = meanValue;
    meanLine.y1 = meanValue;
    meanAndSdShapes.push(meanLine);

    lowWarningRegion = this.CreateChartShape(LjChartShapeType.Sd2Region, xAxisName, yAxisName);
    lowWarningRegion.x0 = xStartValue;
    lowWarningRegion.x1 = xEndValue;
    lowWarningRegion.y0 = meanValue - advancedLj1SdValue * sdValue;
    lowWarningRegion.y1 = meanValue - advancedLj2SdValue * sdValue;
    meanAndSdShapes.push(lowWarningRegion);

    highWarningRegion = this.CreateChartShape(LjChartShapeType.Sd2Region, xAxisName, yAxisName);
    highWarningRegion.x0 = xStartValue;
    highWarningRegion.x1 = xEndValue;
    highWarningRegion.y0 = meanValue + advancedLj1SdValue * sdValue;
    highWarningRegion.y1 = meanValue + advancedLj2SdValue * sdValue;
    meanAndSdShapes.push(highWarningRegion);

    lowRejectionRegion = this.CreateChartShape(LjChartShapeType.Sd3Region, xAxisName, yAxisName);
    lowRejectionRegion.x0 = xStartValue;
    lowRejectionRegion.x1 = xEndValue;
    lowRejectionRegion.y0 = meanValue - advancedLj2SdValue * sdValue;
    lowRejectionRegion.y1 = meanValue - advancedLj3SdValue * sdValue;
    meanAndSdShapes.push(lowRejectionRegion);

    highRejectionRegion = this.CreateChartShape(LjChartShapeType.Sd3Region, xAxisName, yAxisName);
    highRejectionRegion.x0 = xStartValue;
    highRejectionRegion.x1 = xEndValue;
    highRejectionRegion.y0 = meanValue + advancedLj2SdValue * sdValue;
    highRejectionRegion.y1 = meanValue + advancedLj3SdValue * sdValue;
    meanAndSdShapes.push(highRejectionRegion);

    return meanAndSdShapes;
  }

  private GetSpecialPointsMarker(resultStatus: ResultStatus, isAccepted: boolean): LjChartMarker {
    let ljChartMarker: LjChartMarker,
      color: string;

    switch (resultStatus) {
      case ResultStatus.Warning:
        color = advancedLjSpecialPointColorWarning;
        break;
      case ResultStatus.Reject:
        color = advancedLjSpecialPointColorReject;
        break;
      default:
        color = advancedLjSpecialPointColorDefault;
        break;
    }

    ljChartMarker = new LjChartMarker();
    ljChartMarker.color = color;
    ljChartMarker.size = isAccepted ? advancedLjSpecialPointSize : advancedLjCrossSize;
    ljChartMarker.symbol = isAccepted ? advancedLjSpecialMarkerSymbol : advancedLjCrossSymbol;

    return ljChartMarker;
  }

  private GetOutOfRangePointMarker(isLowValue: boolean): LjChartMarker {
    let ljChartMarker = new LjChartMarker();
    ljChartMarker.color = advancedLjOutOfRangeColor;
    ljChartMarker.size = advancedLjOutOfRangeSize;
    ljChartMarker.symbol = isLowValue ? advancedLjOutOfRangeLowSymbol : advancedLjOutOfRangeHighSymbol;

    return ljChartMarker;
  }

  private CreateChartDataItem(xAxis: string, yAxis: string, xAxisItems: Array<string>, yAxisItems: Array<number>,
    textItems: Array<any>, ljChartMarker: LjChartMarker, showHoverText: boolean): LjChartDataItem {
    let chartDataItem = new LjChartDataItem();

    chartDataItem.x = xAxisItems;
    chartDataItem.y = yAxisItems,
      chartDataItem.text = textItems;
    chartDataItem.marker = ljChartMarker;
    chartDataItem.xAxisName = xAxis;
    chartDataItem.yAxisName = yAxis;
    chartDataItem.showHoverText = showHoverText;

    return chartDataItem;
  }

  private CreateChartShape(shapeType: LjChartShapeType, xAxisName: string, yAxisName: string): LjChartShape {
    let chartShape = new LjChartShape();

    chartShape.xAxisName = xAxisName;
    chartShape.yAxisName = yAxisName;

    switch (shapeType) {
      case LjChartShapeType.MeanLine:
        chartShape.type = LjChartShapeForm.Line;
        chartShape.color = advancedLjMeanLineColor;
        chartShape.layer = advancedLjLayerAbove;
        break;
      case LjChartShapeType.Sd2Region:
        chartShape.type = LjChartShapeForm.Rectangle;
        chartShape.color = advancedLj2SdRegionColor;
        chartShape.layer = advancedLjLayerBelow;
        break;
      case LjChartShapeType.Sd3Region:
        chartShape.type = LjChartShapeForm.Rectangle;
        chartShape.color = advancedLj3SdRegionColor;
        chartShape.layer = advancedLjLayerBelow;
        break;
    }

    return chartShape;
  }

  private getAnnotationWidth(annotationText: string, annotationCanvas: ElementRef) {
    let ctx = annotationCanvas.nativeElement.getContext(annotationCanvasType);
    ctx.font = `${advancedLjPlotEventAnnotationFontSize}px ${advancedLjPlotEventAnnotationFontFamily}`;
    let annotationWidth = Math.round(ctx.measureText(annotationText).width / 2);
    return (annotationWidth + annotationWidthAligment); // added  more pixels for correct aligment
  }

  protected GetDashMeanLinePoints(levelStatistics: LevelStatistics, xStartValue: string, xEndValue: string, xAxisName: string,
    yAxisName: string, decimalPlaces: number): Array<LjChartShape> {
    let chartShapeArr = new Array<LjChartShape>();
    let chartShape = new LjChartShape();
    if (levelStatistics) {
      chartShape.xAxisName = xAxisName;
      chartShape.yAxisName = yAxisName;
      chartShape.type = LjChartShapeForm.Line;
      chartShape.color = advancedLjSecondaryAxisItemColor;
      chartShape.x0 = xStartValue;
      chartShape.y0 = +levelStatistics?.mean.toFixed(decimalPlaces);
      chartShape.x1 = xEndValue;
      chartShape.y1 = +levelStatistics?.mean.toFixed(decimalPlaces);
      chartShape.line = {
        color: advancedLjSecondaryAxisItemColor,
        dash: advancedLjDashMeanShapeDash,
        width: advancedLjMeanDashLineSize
      }
      chartShapeArr.push(chartShape);
    }
    return chartShapeArr;
  }

  protected GetSecondaryYAxis(levelStatistics: LevelStatistics, yAxisRange: Array<number>, levelIndex: number,
    decimalPlaces: number): Array<LjChartSecondaryAxis> {
    let chartSecondaryAxis = new Array<LjChartSecondaryAxis>();
    let singleYAxis = new LjChartSecondaryAxis();
    if (levelStatistics) {
      let statsMean = parseFloat(levelStatistics?.mean.toFixed(decimalPlaces));
      let statsSd = parseFloat(levelStatistics?.sd.toFixed(decimalPlaces));
      singleYAxis.range = yAxisRange;
      singleYAxis.titlefont = {
        color: advancedLjSecondaryAxisItemColor
      };
      singleYAxis.tickfont = {
        color: advancedLjSecondaryAxisItemColor
      };
      singleYAxis.overlaying = `${yAxisPrefix}${levelIndex + advancedLjSecondaryYAxisIncrementValue}`;
      singleYAxis.side = advancedLjSecondaryYAxisPosition;
      singleYAxis.showgrid = advancedLjSecondaryYAxisNoShowGrid;
      singleYAxis.tickvals = this.GetTickValsFromMeanAndSD(statsMean, statsSd, decimalPlaces);
      chartSecondaryAxis.push(singleYAxis);
    }
    return chartSecondaryAxis;
  }

  protected GetTickValsFromMeanAndSD(culMean: number, culSd: number, decimalPlaces: number): Array<number> {
    const tickValues: Array<number> = [];
    if(culSd){
      const centerIndex = Math.floor(advancedLjSecondaryYAxisTickvalueLength / 2); // calculate the center Index of array
      tickValues[centerIndex] = culMean;
      for (let tIndex = 0; tIndex < advancedLjSecondaryYAxisTickvalueLength; tIndex++) {
        if (tIndex < centerIndex) {
          tickValues[tIndex] = parseFloat((culMean - (centerIndex - tIndex) * culSd).toFixed(decimalPlaces));
        } else if (tIndex > centerIndex) {
          tickValues[tIndex] = parseFloat(((tIndex - centerIndex) * culSd + culMean).toFixed(decimalPlaces));
        }
      }
    }
    else if(culSd === 0){ // when we have sd 0 we need to show atleast mean and the dash line on the plot
      tickValues.push(culMean);
    }
    return tickValues;
  }


}
