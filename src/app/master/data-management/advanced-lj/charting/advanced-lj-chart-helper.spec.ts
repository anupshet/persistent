// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Action } from 'br-component-library';
import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { LjChartEventType, LjChartMode, LjChartShapeForm, LjChartXAxisType } from '../../../../contracts/enums/advanced-lj/lj-chart.enum';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { LjChartDataItem, LjChartDataLevel, LjChartSecondaryAxis, LjChartShape,
  LjHoverDetail, LjChartEvent } from '../../../../contracts/models/data-management/advanced-lj/lj-chart.models';
import { PointDataResult, ResultStatus, Rule } from '../../../../contracts/models/data-management/run-data.model';
import { LevelStatistics, StatisticsResult } from '../../../../contracts/models/data-management/advanced-lj/lj-statistics.model';
import { advancedLjCrossSize, advancedLjYaxisSdRange, advancedLjSpecialMarkerSymbol, advancedLjSpecialPointColorDefault,
  advancedLjSpecialPointColorReject, advancedLjSpecialPointColorWarning, advancedLjCrossSymbol, levelColors,
  advancedLjSpecialPointSize, advancedLjOutOfRangeColor, advancedLjOutOfRangeSize, advancedLjOutOfRangeHighSymbol,
  advancedLjOutOfRangeLowSymbol, advancedLj2SdRegionColor, advancedLj2SdValue, advancedLj3SdRegionColor, advancedLj3SdValue,
  advancedLjMeanLineColor, advancedLjDateFormatMonth, advancedLjDateFormatDay, advancedLj1SdValue, advancedLjSecondaryAxisItemColor,
  advancedLjDashMeanShapeDash, advancedLjMeanDashLineSize, advancedLjSecondaryYAxisPosition,
  advancedLjSecondaryYAxisNoShowGrid, advancedLjPlotlyModeMarkers} from '../../../../core/config/constants/advanced-lj.const';
import { AdvancedLjChartHelperForRepeatedDates } from './advanced-lj-chart-helper-repeated-dates';
import { RunsService } from '../../../../shared/services/runs.service';
import { UnityNextDatePipe } from '../../../../shared/date-time/pipes/unity-next-date.pipe';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';
import { HttpLoaderFactory } from '../../../../app.module';

describe('AdvancedLjChartHelper', () => {
  let advancedLjChartHelperForRepeatedDates: AdvancedLjChartHelperForRepeatedDates;
  const localTimeZone = 'America/Los_Angeles';
  const appLocale = 'en-US';
  const dateTimeFormatter = Intl.DateTimeFormat(appLocale, { month: advancedLjDateFormatMonth, day: advancedLjDateFormatDay, timeZone: localTimeZone });
  const anotherTimeZone = 'Pacific/Auckland';
  const dateTimeFormatterAnotherTimezone = Intl.DateTimeFormat(appLocale, { month: advancedLjDateFormatMonth, day: advancedLjDateFormatDay, timeZone: anotherTimeZone });
  let canvas: ElementRef = {
    nativeElement: {
      getContext: () => {
        return {
          measureText: () => 50
        }
      }
    }
  };
  const ljChartEventReagent = LjChartEventType.ReagentLotChange;
  const ljChartEventCalibrator = LjChartEventType.CalibratorLotChange;
  const ljChartEventMean = LjChartEventType.MeanChange;
  const ljChartEventSd = LjChartEventType.SdChange;
  const chartEventFilterSelection = [
    ljChartEventReagent,
    ljChartEventCalibrator,
    ljChartEventMean,
    ljChartEventSd
  ];

  const dataPoints: PointDataResult[] = [
    {
      runId: '10001',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 10.5,
      targetMean: 0,
      targetSD: 1.2,
      zScoreData: { zScore: 1.3, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Floating,
      testSpecId: 1806,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10001',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 75,
      targetMean: 72,
      targetSD: 5.2,
      zScoreData: { zScore: 1.5, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Floating,
      testSpecId: 1806,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10002',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 16.1,
      targetMean: 10.1,
      targetSD: 1.3,
      zScoreData: { zScore: 3.55, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Warning,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Fixed,
      testSpecId: 1806,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10002',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 77.1,
      targetMean: 72,
      targetSD: 7.3,
      zScoreData: { zScore: 0.70, display: true },
      isAccepted: false,
      resultStatus: ResultStatus.Reject,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Floating,
      testSpecId: 1806,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 10.7,
      targetMean: 11.5,
      targetSD: 1.4,
      zScoreData: { zScore: 0.9, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Fixed,
      testSpecId: 8005,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 76.2,
      targetMean: 73,
      targetSD: 7.4,
      zScoreData: { zScore: 2.3, display: true },
      isAccepted: false,
      resultStatus: ResultStatus.Warning,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Fixed,
      testSpecId: 8005,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10004',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 10.7,
      targetMean: 11.0,
      targetSD: 1.5,
      zScoreData: { zScore: 1.3, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Fixed,
      testSpecId: 8005,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10004',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 51.4,
      targetMean: 75,
      targetSD: 7.8,
      zScoreData: { zScore: 3.03, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Fixed,
      testSpecId: 8005,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10005',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 21, 20, 2, 0),
      resultValue: 11.7,
      targetMean: 10.8,
      targetSD: 1.7,
      zScoreData: { zScore: 1.0, display: true },
      isAccepted: false,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Fixed,
      testSpecId: 8008,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10005',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 21, 20, 2, 0),
      resultValue: 75.8,
      targetMean: 71,
      targetSD: 7.8,
      zScoreData: { zScore: 0.3, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Fixed,
      testSpecId: 8008,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10006',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 21, 20, 2, 0),
      resultValue: 75.9,
      targetMean: 75.2,
      targetSD: 7.8,
      zScoreData: { zScore: 1.1, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Fixed,
      testSpecId: 8008,
      decimalPlace : 2
    } as PointDataResult
  ];

  const dataPoints2: PointDataResult[] = [
    {
      runId: '10001',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 10.5,
      targetSD: 1.1,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10001',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 75,
      targetSD: 5.6,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10002',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 10.9,
      targetSD: 1.2,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10002',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 77.1,
      targetSD: 7.3,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 10.7,
      targetSD: 1.4,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 76.2,
      targetSD: 7.4,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10004',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 10.7,
      targetSD: 1.5,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10004',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 76.8,
      targetSD: 7.3,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace : 2
    } as PointDataResult,
    {
      runId: '10005',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 21, 20, 2, 0),
      resultValue: 11.7,
      targetMean: 10.8,
      targetSD: 1.8,
      zScoreData: { zScore: 0.5, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Fixed
    } as PointDataResult,
    {
      runId: '10005',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 21, 20, 2, 0),
      resultValue: 75.8,
      targetSD: 7.2,
      isAccepted: true,
      resultStatus: ResultStatus.Accept
    } as PointDataResult,
    {
      runId: '10006',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 21, 20, 2, 0),
      resultValue: 75.9,
      targetMean: 75.2,
      targetSD: 5.5,
      zScoreData: { zScore: 0.127, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Floating
    } as PointDataResult
  ];

  const dataPoints3: PointDataResult[] = [
    {
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 10.5,
      isAccepted: true,
      resultStatus: ResultStatus.Accept
    } as PointDataResult,
    {
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 75,
      isAccepted: true,
      resultStatus: ResultStatus.Accept
    } as PointDataResult,
    {
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 10.9,
      isAccepted: true,
      resultStatus: ResultStatus.Accept
    } as PointDataResult,
    {
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 77.1,
      isAccepted: true,
      resultStatus: ResultStatus.Accept
    } as PointDataResult
  ];

  const dataPoints4: PointDataResult[] = [
    {
      runId: '10001',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 7,
      targetSD: 0.8,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10002',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 8.9,
      targetSD: 1.7,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 14.9,
      targetSD: 1.2,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 3,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 6.2,
      targetSD: 0.4,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 11.0,
      targetSD: 1.3,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 6,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 12.5,
      targetSD: 1.6,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10004',
      controlLevel: 6,
      measuredDateTime: new Date(2021, 2, 11, 20, 2, 0),
      resultValue: 7.1,
      targetSD: 0.3,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10005',
      controlLevel: 6,
      measuredDateTime: new Date(2021, 2, 14, 20, 2, 0),
      resultValue: 13.5,
      targetSD: 2.8,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10006',
      controlLevel: 3,
      measuredDateTime: new Date(2021, 2, 21, 20, 2, 0),
      resultValue: 5.1,
      targetSD: 0.4,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10006',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 21, 20, 2, 0),
      resultValue: 9.9,
      targetSD: 1.6,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10007',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 23, 20, 2, 0),
      resultValue: 7.9,
      targetSD: 0.2,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
  ];

  const dataPoints5: PointDataResult[] = [
    {
      runId: '10001',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 5, 20, 2, 0),
      resultValue: 7,
      targetSD: 0.8,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10002',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 14.9,
      targetSD: 1.2,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10003',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 7, 20, 2, 0),
      resultValue: 9.9,
      targetMean: 10.8,
      targetSD: 0.4,
      zScoreData: { zScore: 0.5, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Fixed,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10004',
      controlLevel: 1,
      measuredDateTime: new Date(2021, 2, 11, 20, 2, 0),
      resultValue: 7.1,
      targetSD: 0.3,
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      decimalPlace: 2
    } as PointDataResult,
    {
      runId: '10005',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 23, 20, 2, 0),
      resultValue: 7.9,
      targetMean: 75.2,
      targetSD: 0.2,
      zScoreData: { zScore: 0.127, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Accept,
      meanEvaluationType: EvaluationType.Floating,
      sdEvaluationType: EvaluationType.Floating,
      decimalPlace: 2
    } as PointDataResult,
  ];

  const dataPoints6: PointDataResult[] = [
    {
      runId: '10002',
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 77.1,
      targetMean: 72,
      targetSD: 7.3,
      zScoreData: { zScore: 0.70, display: true },
      isAccepted: true,
      resultStatus: ResultStatus.Reject,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Floating,
      testSpecId: 1806,
      decimalPlace : 2
    } as PointDataResult
  ];

  const yAxisStatistics: StatisticsResult = {
    levelStatistics:
      [
        {
          level: 1,
          mean: 10.62,
          sd: 0.78,
          cv: 3,
        } as LevelStatistics,
        {
          level: 2,
          mean: 11.1,
          sd: 0.46,
          cv: 4,
        } as LevelStatistics,
        {
          level: 3,
          mean: 14,
          sd: 1.01,
          cv: 2.3,
        } as LevelStatistics,
        {
          level: 4,
          mean: 10.88,
          sd: 0.45,
          cv: 2,
        } as LevelStatistics,
        {
          level: 5,
          mean: 9.75,
          sd: 0.71,
          cv: 2.2,
        } as LevelStatistics
      ]
  }

  const dataPointsHoverDetail: PointDataResult[] = [
    { // Tests basic function
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 20, 2, 0),
      resultValue: 76.2,
      targetMean: 73,
      targetSD: 7.4,
      zScoreData: { zScore: 1.3, display: true },
      isAccepted: false,
      resultStatus: ResultStatus.Warning,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Fixed
    } as PointDataResult,
    { // Tests hour 0, and user actions
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 0, 2, 0),
      resultValue: 76.2,
      targetMean: 73,
      targetSD: 7.4,
      zScoreData: { zScore: 1.3, display: true },
      isAccepted: false,
      resultStatus: ResultStatus.Warning,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Fixed,
      userActions: [{actionId: 1,
        actionName: 'string'} as Action]
    } as PointDataResult,
    { // Tests hour 9 no SD
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 9, 2, 0),
      resultValue: 76.2,
      targetMean: 73,
      targetSD: null,
      zScoreData: { zScore: 1.3, display: true },
      isAccepted: false,
      resultStatus: ResultStatus.Warning,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Fixed,
      userActions: [{actionId: 1,
        actionName: 'string'} as Action]
    } as PointDataResult,
    { // Tests hour 12, and reason
      controlLevel: 5,
      measuredDateTime: new Date(2021, 2, 9, 12, 2, 0),
      resultValue: 76.2,
      targetMean: 73,
      targetSD: null,
      zScoreData: { zScore: 1.3, display: true },
      isAccepted: false,
      resultStatus: ResultStatus.Warning,
      meanEvaluationType: EvaluationType.Fixed,
      sdEvaluationType: EvaluationType.Fixed,
      userActions: [{actionId: 1,
        actionName: 'string'} as Action],
      ruleViolated: [{category: "1-ks", k: 3, disposition: "R"} as Rule]
    } as PointDataResult
  ];

  const dataPointsHoverDetailResult: LjHoverDetail[] = [
    { // Expected value is correct
      resultValue: 76.2,
      dateTime: new Date('Tue Mar 09 2021 20:02:00 GMT-0800 (Pacific Standard Time)'),
      level: 5,
      decimalPlace: 2,
      mean: 73,
      sd: 7.4,
      zScore: 1.3,
      userActions: null,
      cv: 10.136986301369863,
      reasons: null } as LjHoverDetail,
    { // Expected Actions is correct
      resultValue: 76.2,
      dateTime: new Date('Tue Mar 09 2021 20:02:00 GMT-0800 (Pacific Standard Time)'),
      level: 5,
      decimalPlace: 2,
      mean: 73,
      sd: 7.4,
      zScore: 1.3,
      userActions: [{actionId: 1, actionName: 'string'}],
      cv: 10.136986301369863,
      reasons: null } as LjHoverDetail,
    { // Expected Actions is correct
       resultValue: 76.2,
       dateTime: new Date('Tue Mar 09 2021 20:02:00 GMT-0800 (Pacific Standard Time)'),
       level: 5,
       decimalPlace: 2,
       mean: 73,
       sd: null,
       zScore: 1.3,
       userActions: [{actionId: 1, actionName: 'string'}],
       cv: 10.136986301369863,
       reasons: null } as LjHoverDetail,
    { // Expected Actions is correct
       resultValue: 76.2,
       dateTime: new Date('Tue Mar 09 2021 20:02:00 GMT-0800 (Pacific Standard Time)'),
       level: 5,
       decimalPlace: 2,
       mean: 73,
       sd: null,
       zScore: 1.3,
       userActions: [{actionId: 1, actionName: 'string'}],
       cv: 10.136986301369863,
       reasons: ['1-3s'] } as LjHoverDetail,
  ]

  const comparisonStatistics: StatisticsResult = {
    levelStatistics:
      [
        {
          level: 1,
          mean: 10.62,
          sd: 0.78,
          cv: 3,
        } as LevelStatistics,
        {
          level: 2,
          mean: 11.1,
          sd: 0.46,
          cv: 4,
        } as LevelStatistics,
        {
          level: 3,
          mean: 14,
          sd: 1.01,
          cv: 2.3,
        } as LevelStatistics,
        {
          level: 4,
          mean: 10.88,
          sd: 0.45,
          cv: 2,
        } as LevelStatistics

      ]
  }

  const hoverTranslation = {
    "level": " Level ",
    "mean": " Mean ",
    "sd": " SD ",
    "cv": " CV ",
    "zScore": " ZScore ",
    "actions": " Actions ",
    "reason": " Reason "
  }

  let testSpecs = [
    {
        "id": 1806,
        "testId": 1801,
        "analyteStorageUnitId": 667,
        "analyteId": 4,
        "analyteName": "Acetaminophen",
        "methodId": 112,
        "methodName": "Enzymatic, colorimetric",
        "instrumentId": 1254,
        "instrumentName": "ARCHITECT c16000",
        "reagentId": 1105,
        "reagentManufacturerName": "Sekisui",
        "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
        "reagentLotId": 416,
        "reagentLotNumber": "Unspecified ***",
        "reagentLot": {
            "id": 416,
            "reagentId": 1105,
            "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
            "reagentCategory": 1,
            "lotNumber": "Unspecified ***",
            "shelfExpirationDate": new Date('2068-11-16T17:50:45.727')
        },
        "storageUnitId": 3,
        "storageUnitName": "µg/mL",
        "calibratorId": 257,
        "calibratorManufacturerName": "Sekisui",
        "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
        "calibratorLotId": 258,
        "calibratorLotNumber": "Unspecified ***",
        "calibratorLot": {
            "id": 258,
            "calibratorId": 257,
            "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
            "lotNumber": "Unspecified ***",
            "shelfExpirationDate": new Date('2068-11-16T17:50:45.913')
        }
    },
    {
        "id": 8005,
        "testId": 1801,
        "analyteStorageUnitId": 667,
        "analyteId": 4,
        "analyteName": "Acetaminophen",
        "methodId": 112,
        "methodName": "Enzymatic, colorimetric",
        "instrumentId": 1254,
        "instrumentName": "ARCHITECT c16000",
        "reagentId": 1105,
        "reagentManufacturerName": "Sekisui",
        "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
        "reagentLotId": 2206,
        "reagentLotNumber": "ACETAL3K-1",
        "reagentLot": {
            "id": 2206,
            "reagentId": 1105,
            "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
            "reagentCategory": 1,
            "lotNumber": "ACETAL3K-1",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        },
        "storageUnitId": 3,
        "storageUnitName": "µg/mL",
        "calibratorId": 257,
        "calibratorManufacturerName": "Sekisui",
        "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
        "calibratorLotId": 258,
        "calibratorLotNumber": "Unspecified ***",
        "calibratorLot": {
            "id": 258,
            "calibratorId": 257,
            "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
            "lotNumber": "Unspecified ***",
            "shelfExpirationDate": new Date('2068-11-16T17:50:45.913')
        }
    },
    {
        "id": 8008,
        "testId": 1801,
        "analyteStorageUnitId": 667,
        "analyteId": 4,
        "analyteName": "Acetaminophen",
        "methodId": 112,
        "methodName": "Enzymatic, colorimetric",
        "instrumentId": 1254,
        "instrumentName": "ARCHITECT c16000",
        "reagentId": 1105,
        "reagentManufacturerName": "Sekisui",
        "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
        "reagentLotId": 2206,
        "reagentLotNumber": "ACETAL3K-1",
        "reagentLot": {
            "id": 2206,
            "reagentId": 1105,
            "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
            "reagentCategory": 1,
            "lotNumber": "ACETAL3K-1",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        },
        "storageUnitId": 3,
        "storageUnitName": "µg/mL",
        "calibratorId": 257,
        "calibratorManufacturerName": "Sekisui",
        "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
        "calibratorLotId": 1247,
        "calibratorLotNumber": "ACETA-CAL-L3K-1",
        "calibratorLot": {
            "id": 1247,
            "calibratorId": 257,
            "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
            "lotNumber": "ACETA-CAL-L3K-1",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        }
    },
    {
        "id": 8009,
        "testId": 1801,
        "analyteStorageUnitId": 667,
        "analyteId": 4,
        "analyteName": "Acetaminophen",
        "methodId": 112,
        "methodName": "Enzymatic, colorimetric",
        "instrumentId": 1254,
        "instrumentName": "ARCHITECT c16000",
        "reagentId": 1105,
        "reagentManufacturerName": "Sekisui",
        "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
        "reagentLotId": 2207,
        "reagentLotNumber": "ACETAL3K-2",
        "reagentLot": {
            "id": 2207,
            "reagentId": 1105,
            "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
            "reagentCategory": 1,
            "lotNumber": "ACETAL3K-2",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        },
        "storageUnitId": 3,
        "storageUnitName": "µg/mL",
        "calibratorId": 257,
        "calibratorManufacturerName": "Sekisui",
        "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
        "calibratorLotId": 1248,
        "calibratorLotNumber": "ACETA-CAL-L3K-2",
        "calibratorLot": {
            "id": 1248,
            "calibratorId": 257,
            "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
            "lotNumber": "ACETA-CAL-L3K-2",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        }
    },
    {
        "id": 8010,
        "testId": 1801,
        "analyteStorageUnitId": 667,
        "analyteId": 4,
        "analyteName": "Acetaminophen",
        "methodId": 112,
        "methodName": "Enzymatic, colorimetric",
        "instrumentId": 1254,
        "instrumentName": "ARCHITECT c16000",
        "reagentId": 1105,
        "reagentManufacturerName": "Sekisui",
        "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
        "reagentLotId": 2206,
        "reagentLotNumber": "ACETAL3K-1",
        "reagentLot": {
            "id": 2206,
            "reagentId": 1105,
            "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
            "reagentCategory": 1,
            "lotNumber": "ACETAL3K-1",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        },
        "storageUnitId": 3,
        "storageUnitName": "µg/mL",
        "calibratorId": 257,
        "calibratorManufacturerName": "Sekisui",
        "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
        "calibratorLotId": 1249,
        "calibratorLotNumber": "ACETA-CAL-L3K-3",
        "calibratorLot": {
            "id": 1249,
            "calibratorId": 257,
            "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
            "lotNumber": "ACETA-CAL-L3K-3",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        }
    },
    {
        "id": 8012,
        "testId": 1801,
        "analyteStorageUnitId": 667,
        "analyteId": 4,
        "analyteName": "Acetaminophen",
        "methodId": 112,
        "methodName": "Enzymatic, colorimetric",
        "instrumentId": 1254,
        "instrumentName": "ARCHITECT c16000",
        "reagentId": 1105,
        "reagentManufacturerName": "Sekisui",
        "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
        "reagentLotId": 416,
        "reagentLotNumber": "Unspecified ***",
        "reagentLot": {
            "id": 416,
            "reagentId": 1105,
            "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
            "reagentCategory": 1,
            "lotNumber": "Unspecified ***",
            "shelfExpirationDate": new Date('2068-11-16T17:50:45.727')
        },
        "storageUnitId": 3,
        "storageUnitName": "µg/mL",
        "calibratorId": 257,
        "calibratorManufacturerName": "Sekisui",
        "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
        "calibratorLotId": 1248,
        "calibratorLotNumber": "ACETA-CAL-L3K-2",
        "calibratorLot": {
            "id": 1248,
            "calibratorId": 257,
            "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
            "lotNumber": "ACETA-CAL-L3K-2",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        }
    },
    {
        "id": 8006,
        "testId": 1801,
        "analyteStorageUnitId": 667,
        "analyteId": 4,
        "analyteName": "Acetaminophen",
        "methodId": 112,
        "methodName": "Enzymatic, colorimetric",
        "instrumentId": 1254,
        "instrumentName": "ARCHITECT c16000",
        "reagentId": 1105,
        "reagentManufacturerName": "Sekisui",
        "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
        "reagentLotId": 2206,
        "reagentLotNumber": "ACETAL3K-1",
        "reagentLot": {
            "id": 2206,
            "reagentId": 1105,
            "reagentName": "Sekisui Diagnostics SEKURE Acetaminophen L3K",
            "reagentCategory": 1,
            "lotNumber": "ACETAL3K-1",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        },
        "storageUnitId": 3,
        "storageUnitName": "µg/mL",
        "calibratorId": 257,
        "calibratorManufacturerName": "Sekisui",
        "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
        "calibratorLotId": 1248,
        "calibratorLotNumber": "ACETA-CAL-L3K-2",
        "calibratorLot": {
            "id": 1248,
            "calibratorId": 257,
            "calibratorName": "Sekisui Diagnostics SEKURE Acetaminophen L3K Cal",
            "lotNumber": "ACETA-CAL-L3K-2",
            "shelfExpirationDate": new Date('2025-08-01T00:00:00')
        }
    }
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
    settings: null
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
        }),
      ],
      providers: [
        RunsService,
        UnityNextDatePipe,
        UnityNextNumericPipe,
        TranslateService,
        AdvancedLjChartHelperForRepeatedDates,
        { provide: Store, useValue: storeStub },
        provideMockStore({ initialState: storeStub }),
        { provide: DecimalPipe, useClass: DecimalPipe }
      ]
    });
    advancedLjChartHelperForRepeatedDates = TestBed.inject(AdvancedLjChartHelperForRepeatedDates);
    let mockRunsService = jasmine.createSpyObj('RunsService', ['convertReasons()']);
    mockRunsService = {convertReasons: () => {return ['1-3s'];}}
    advancedLjChartHelperForRepeatedDates.runsService = mockRunsService;
    const datePipe = TestBed.inject(UnityNextDatePipe);
    const numericPipe = TestBed.inject(UnityNextNumericPipe);
    advancedLjChartHelperForRepeatedDates.unityNextDatePipe = datePipe;
    advancedLjChartHelperForRepeatedDates.unityNextNumericPipe = numericPipe;
  });

  it('should create', () => {
    expect(advancedLjChartHelperForRepeatedDates).toBeTruthy();
  });

  it('converts a date to month day format adjusted for time zone using GetDateInMonthDayStringFormat', () => {
    let testDate = new Date(2021, 2, 5, 20, 2, 0);

    let dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormat(testDate, dateTimeFormatter);
    expect(dateStringResult).toEqual('Mar 05');

    // Use a time zone for New Zealand to test time zone adjustment
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormat(testDate, dateTimeFormatterAnotherTimezone);
    expect(dateStringResult).toEqual('Mar 06');

    // Two-digit date
    testDate = new Date(2021, 10, 25, 20, 2, 0);
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormat(testDate, dateTimeFormatter);
    expect(dateStringResult).toEqual('Nov 25');
  });

  it('Extract data needed in LjHoverDetail object for hover template.', () => {
    expect(advancedLjChartHelperForRepeatedDates.GetHoverDetailItems(dataPointsHoverDetail)[0].reasons).toBeNull();
    expect(advancedLjChartHelperForRepeatedDates.GetHoverDetailItems(dataPointsHoverDetail)[1].userActions[0].actionName).toEqual(dataPointsHoverDetailResult[1].userActions[0].actionName);
    expect(advancedLjChartHelperForRepeatedDates.GetHoverDetailItems(dataPointsHoverDetail)[2].sd).toBeNull();
    expect(advancedLjChartHelperForRepeatedDates.GetHoverDetailItems(dataPointsHoverDetail)[3].reasons).toEqual(dataPointsHoverDetailResult[3].reasons);
  });

  it('returns events used to render annotations for when there are reagent or calibrator lot changes, and eval mean or SD type changes', () => {
    let chartEvents: Array<LjChartEvent>;

    // Level 1
    let levelData = dataPoints.filter(dataPoint => dataPoint.controlLevel === 1);
    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEvents(levelData, testSpecs, 'x1', [0,1], canvas, chartEventFilterSelection);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(3)
    expect(chartEvents[0].eventType).toEqual(LjChartEventType.SdChange);
    expect(chartEvents[1].eventType).toEqual(LjChartEventType.ReagentLotChange);
    expect(chartEvents[2].eventType).toEqual(LjChartEventType.CalibratorLotChange);

    // Level 5
    levelData = dataPoints.filter(dataPoint => dataPoint.controlLevel === 5);
    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEvents(levelData, testSpecs, 'x2', [0,1], canvas, chartEventFilterSelection);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(4)
    expect(chartEvents[0].eventType).toEqual(LjChartEventType.ReagentLotChange);
    expect(chartEvents[1].eventType).toEqual(LjChartEventType.SdChange);
    expect(chartEvents[2].eventType).toEqual(LjChartEventType.CalibratorLotChange);
    expect(chartEvents[3].eventType).toEqual(LjChartEventType.MeanChange);
  });

  it('filters events used to render annotations for when there are reagent or calibrator lot changes, and eval mean or SD type changes', () => {
    let chartEvents: Array<LjChartEvent>;
    let chartEventFilter = [
      ljChartEventReagent,
      ljChartEventCalibrator
    ];

    // Only reagent and calibrator lots
    let levelData = dataPoints.filter(dataPoint => dataPoint.controlLevel === 5);
    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEvents(levelData, testSpecs, 'x1', [0,1], canvas, chartEventFilter);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(2)
    expect(chartEvents[0].eventType).toEqual(LjChartEventType.ReagentLotChange);
    expect(chartEvents[1].eventType).toEqual(LjChartEventType.CalibratorLotChange);

    // Only mean and SD
    chartEventFilter = [
      ljChartEventMean,
      ljChartEventSd
    ];

    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEvents(levelData, testSpecs, 'x1', [0,1], canvas, chartEventFilter);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(2)
    expect(chartEvents[0].eventType).toEqual(LjChartEventType.SdChange);
    expect(chartEvents[1].eventType).toEqual(LjChartEventType.MeanChange);

    // None
    chartEventFilter = [];

    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEvents(levelData, testSpecs, 'x1', [0,1], canvas, chartEventFilter);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(0)
  });

  it('for overlay, returns events used to render annotations for when there are reagent or calibrator lot changes', () => {
    let chartEvents: Array<LjChartEvent>;
    let runIdLevelsForChartEvents: { [runIdLevel: string]: Array<LjChartEventType> } = {
      '10003_1': [LjChartEventType.ReagentLotChange],
      '10005_1': [LjChartEventType.CalibratorLotChange]
    };

    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEventsForOverlay(dataPoints, testSpecs, 'x1', [0,1], canvas, runIdLevelsForChartEvents, chartEventFilterSelection);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(2)
    expect(chartEvents[0].eventType).toEqual(LjChartEventType.ReagentLotChange);
    expect(chartEvents[1].eventType).toEqual(LjChartEventType.CalibratorLotChange);
  });

  it('for overlay, filters events used to render annotations for when there are reagent or calibrator lot changes', () => {
    let chartEvents: Array<LjChartEvent>;
    let runIdLevelsForChartEvents: { [runIdLevel: string]: Array<LjChartEventType> } = {
      '10003_1': [LjChartEventType.ReagentLotChange],
      '10005_1': [LjChartEventType.CalibratorLotChange]
    };

    // Only reagent lot
    let chartEventFilter = [
      ljChartEventReagent
    ];

    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEventsForOverlay(dataPoints, testSpecs, 'x1', [0,1], canvas, runIdLevelsForChartEvents, chartEventFilter);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(1)
    expect(chartEvents[0].eventType).toEqual(LjChartEventType.ReagentLotChange);

    // Only calibrator lot
    chartEventFilter = [
      ljChartEventCalibrator
    ];

    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEventsForOverlay(dataPoints, testSpecs, 'x1', [0,1], canvas, runIdLevelsForChartEvents, chartEventFilter);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(1)
    expect(chartEvents[0].eventType).toEqual(LjChartEventType.CalibratorLotChange);

    // None
    chartEventFilter = [];

    chartEvents = advancedLjChartHelperForRepeatedDates.GetLjChartEventsForOverlay(dataPoints, testSpecs, 'x1', [0,1], canvas, runIdLevelsForChartEvents, chartEventFilter);
    expect(chartEvents).toBeDefined();
    expect(chartEvents.length).toEqual(0)
  });

  it('adds proper padding to a date string in the month day format using GetDateInMonthDayStringFormatWithRepetitions', () => {
    let testDate = new Date(2021, 2, 5, 20, 2, 0),
      monthDayString = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormat(testDate, dateTimeFormatter);

    // 0 repeated dates
    let dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormatWithRepetitions(monthDayString, 0);
    expect(dateStringResult).toEqual('Mar 05');

    // 1st repeated date string
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormatWithRepetitions(monthDayString, 1);
    expect(dateStringResult).toEqual('Mar 05 ');

    // 2nd repeated date string
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormatWithRepetitions(monthDayString, 2);
    expect(dateStringResult).toEqual(' Mar 05 ');

    // 3rd repeated date string
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormatWithRepetitions(monthDayString, 9);
    expect(dateStringResult).toEqual('    Mar 05     ');

    // 3rd repeated date string
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormatWithRepetitions(monthDayString, 10);
    expect(dateStringResult).toEqual('     Mar 05     ');

    // Use a time zone for New Zealand to test time zone adjustment
    monthDayString = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormat(testDate, dateTimeFormatterAnotherTimezone);
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormatWithRepetitions(monthDayString, 2);
    expect(dateStringResult).toEqual(' Mar 06 ');

    // Two-digit date
    testDate = new Date(2021, 10, 25, 20, 2, 0);
    monthDayString = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormat(testDate, dateTimeFormatter);
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInMonthDayStringFormatWithRepetitions(monthDayString, 1);
    expect(dateStringResult).toEqual('Nov 25 ');
  });

  it('returns date string format given a date time object', () => {
    let testDate = new Date(2021, 2, 5, 20, 2, 0);

    // Return date string format used in Sequence plots
    let dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInDateStringFormat(testDate, localTimeZone);
    expect(dateStringResult).toEqual('2021-03-05 00:00:00');

    // Use a time zone for New Zealand to test time zone adjustment
    const anotherTimeZone = 'Pacific/Auckland';
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInDateStringFormat(testDate, anotherTimeZone);
    expect(dateStringResult).toEqual('2021-03-06 00:00:00');

    // Two-digit date
    testDate = new Date(2021, 10, 25, 20, 2, 0);
    dateStringResult = advancedLjChartHelperForRepeatedDates.GetDateInDateStringFormat(testDate, localTimeZone);
    expect(dateStringResult).toEqual('2021-11-25 00:00:00');
  });

  it('populates x-axis array with x-axis values of each point for Sequence plots', () => {
    let selectedLevels = [1, 2, 5];
    let xAxisItemsResults = advancedLjChartHelperForRepeatedDates.GetXAxisItems(dataPoints, selectedLevels, localTimeZone, appLocale, LjChartXAxisType.Sequence);
    expect(xAxisItemsResults).toBeDefined();
    expect(xAxisItemsResults.length).toEqual(2);
    let xAxisItemsByLevel = xAxisItemsResults[0];

    let xAxisItems = xAxisItemsByLevel[selectedLevels[0]];
    expect(xAxisItems).toEqual(['3/5/21', '3/9/21', '3/9/21 ', ' 3/9/21 ', '3/21/21']);

    xAxisItems = xAxisItemsByLevel[selectedLevels[1]];
    expect(xAxisItems).toEqual([]);

    xAxisItems = xAxisItemsByLevel[selectedLevels[2]];
    expect(xAxisItems).toEqual(['3/5/21', '3/9/21', '3/9/21 ', ' 3/9/21 ', '3/21/21', '3/21/21 ']);
  });

  it('populates chart content for use by chart component', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    let levelDataValues: Array<LjChartDataLevel>, levelData: LjChartDataLevel;
    let levelDataItems: Array<LjChartDataItem>, levelDataItem: LjChartDataItem;
    let meanValue: number, sdValue: number;
    let levelItems: PointDataResult[];

    expect(ljChart).toBeDefined();

    // Check data
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    levelDataValues = ljChart.data.filter(data => data instanceof LjChartDataLevel) as Array<LjChartDataLevel>;
    expect(levelDataValues.length).toEqual(levels.length);
    levelData = levelDataValues[0];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21 ', ' 3/9/21 ', '3/21/21']);
    expect(levelData.y).toBeDefined();
    expect(levelData.y).toEqual([10.5, 16.1, 10.7, 10.7, 11.7]);
    expect(levelData.lineColor).toEqual(levelColors[levels[0] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);
    levelData = levelDataValues[1];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21 ', ' 3/9/21 ', '3/21/21', '3/21/21 ']);
    expect(levelData.y).toBeDefined();
    expect(levelData.y).toEqual([75, 77.1, 76.2, 51.4, 75.8, 75.9]);
    expect(levelData.lineColor).toEqual(levelColors[levels[1] - 1]);
    expect(levelData.xAxisName).toEqual(`x2`);
    expect(levelData.yAxisName).toEqual(`y2`);

    // Check special points
    levelDataItems = ljChart.data.filter(data => data instanceof LjChartDataItem) as Array<LjChartDataItem>;
    expect(levelDataItems.length).toEqual(6);
    levelDataItem = levelDataItems[0];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([16.1]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjSpecialPointSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjSpecialMarkerSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[1];
    expect(levelDataItem.x).toEqual(['3/21/21']);
    expect(levelDataItem.y).toEqual([11.7]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorDefault);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[2];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([15.05]);   // Out of range indicator at 2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeFalse();

    levelDataItem = levelDataItems[3];
    expect(levelDataItem.x).toEqual(['3/9/21 ']);
    expect(levelDataItem.y).toEqual([76.2]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[4];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([77.1]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorReject);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[5];
    expect(levelDataItem.x).toEqual([' 3/9/21 ']);
    expect(levelDataItem.y).toEqual([55.7]);   // Out of range indicator at -2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeLowSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeFalse();

    // Check config
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0]).toBeDefined();
    expect(ljChart.config.xAxis[0].matches).toBeUndefined();
    expect(ljChart.config.xAxis[0].range).toEqual([0, 5]);
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(2);
    expect(ljChart.config.yAxis[0]).toBeDefined();
    expect(ljChart.config.yAxis[0].matches).toBeUndefined();
    levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 1);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[0].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);
    expect(ljChart.config.xAxis[1]).toBeDefined();
    expect(ljChart.config.xAxis[1].matches).toEqual(`x`);
    expect(ljChart.config.xAxis[1].range).toEqual([0, 5]);
    expect(ljChart.config.yAxis[1]).toBeDefined();
    expect(ljChart.config.yAxis[1].matches).toBeUndefined();
    levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 5);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[1].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);
  });

  it('displays accepted reject result as expected', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints6, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    let levelDataItems: Array<LjChartDataItem>, levelDataItem: LjChartDataItem;

    expect(ljChart).toBeDefined();

    levelDataItems = ljChart.data.filter(data => data instanceof LjChartDataItem) as Array<LjChartDataItem>;
    expect(levelDataItems.length).toEqual(1);
    levelDataItem = levelDataItems[0];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([77.1]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorReject);
    expect(levelDataItem.marker.size).toEqual(advancedLjSpecialPointSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjSpecialMarkerSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeTrue();
  });

  it('populates chart content as overlay for use by chart component', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Overlay, canvas, chartEventFilterSelection, null);
    let levelDataValues: Array<LjChartDataLevel>, levelData: LjChartDataLevel;
    let levelDataItems: Array<LjChartDataItem>, levelDataItem: LjChartDataItem;

    expect(ljChart).toBeDefined();

    // Check data
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Overlay);
    levelDataValues = ljChart.data.filter(data => data instanceof LjChartDataLevel) as Array<LjChartDataLevel>;
    expect(levelDataValues.length).toEqual(levels.length);
    levelData = levelDataValues[0];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21 ', ' 3/9/21 ', '3/21/21']);
    expect(levelData.y).toBeDefined();
    let zScores = dataPoints
      .filter(dataPoint => dataPoint.controlLevel === levels[0])
      .map(dataPoint => dataPoint.zScoreData?.zScore);
    expect(zScores).toBeDefined();
    expect(zScores.length).toBeGreaterThan(0);
    expect(levelData.y).toEqual(zScores);
    expect(levelData.lineColor).toEqual(levelColors[levels[0] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);
    levelData = levelDataValues[1];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21 ', ' 3/9/21 ', '3/21/21', '3/21/21 ']);
    expect(levelData.y).toBeDefined();
    zScores = dataPoints
      .filter(dataPoint => dataPoint.controlLevel === levels[1])
      .map(dataPoint => dataPoint.zScoreData?.zScore);
    expect(zScores).toBeDefined();
    expect(zScores.length).toBeGreaterThan(0);
    expect(levelData.y).toEqual(zScores);
    expect(levelData.lineColor).toEqual(levelColors[levels[1] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);

    // Check special points
    levelDataItems = ljChart.data.filter(data => data instanceof LjChartDataItem) as Array<LjChartDataItem>;
    expect(levelDataItems.length).toEqual(6);
    levelDataItem = levelDataItems[0];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([3.55]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjSpecialPointSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjSpecialMarkerSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[1];
    expect(levelDataItem.x).toEqual(['3/21/21']);
    expect(levelDataItem.y).toEqual([1.0]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorDefault);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[2];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([2.5]);   // Out of range indicator at 2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeFalse();

    levelDataItem = levelDataItems[3];
    expect(levelDataItem.x).toEqual(['3/9/21 ']);
    expect(levelDataItem.y).toEqual([2.3]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[4];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([0.7]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorReject);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[5];
    expect(levelDataItem.x).toEqual([' 3/9/21 ']);
    expect(levelDataItem.y).toEqual([2.5]);   // Out of range indicator at -2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeFalse();

    // Check config
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(1);
    expect(ljChart.config.xAxis[0]).toBeDefined();
    expect(ljChart.config.xAxis[0].matches).toBeUndefined();
    expect(ljChart.config.xAxis[0].range).toEqual([0, 5]);
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(1);
    expect(ljChart.config.yAxis[0]).toBeDefined();
    expect(ljChart.config.yAxis[0].matches).toBeUndefined();
    expect(ljChart.config.yAxis[0].range).toEqual([-advancedLjYaxisSdRange, advancedLjYaxisSdRange]);
  });

  it('populates chart content by z-score for each level for use by chart component', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Zscore, canvas, chartEventFilterSelection, null);
    let levelDataValues: Array<LjChartDataLevel>, levelData: LjChartDataLevel;
    let levelDataItems: Array<LjChartDataItem>, levelDataItem: LjChartDataItem;

    expect(ljChart).toBeDefined();

    // Check data
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Zscore);
    levelDataValues = ljChart.data.filter(data => data instanceof LjChartDataLevel) as Array<LjChartDataLevel>;
    expect(levelDataValues.length).toEqual(levels.length);
    levelData = levelDataValues[0];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21 ', ' 3/9/21 ', '3/21/21']);
    expect(levelData.y).toBeDefined();
    let zScores = dataPoints
      .filter(dataPoint => dataPoint.controlLevel === levels[0])
      .map(dataPoint => dataPoint.zScoreData?.zScore);
    expect(zScores).toBeDefined();
    expect(zScores.length).toBeGreaterThan(0);
    expect(levelData.y).toEqual(zScores);
    expect(levelData.lineColor).toEqual(levelColors[levels[0] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);
    levelData = levelDataValues[1];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21 ', ' 3/9/21 ', '3/21/21', '3/21/21 ']);
    expect(levelData.y).toBeDefined();
    zScores = dataPoints
      .filter(dataPoint => dataPoint.controlLevel === levels[1])
      .map(dataPoint => dataPoint.zScoreData?.zScore);
    expect(zScores).toBeDefined();
    expect(zScores.length).toBeGreaterThan(0);
    expect(levelData.y).toEqual(zScores);
    expect(levelData.lineColor).toEqual(levelColors[levels[1] - 1]);
    expect(levelData.xAxisName).toEqual(`x2`);
    expect(levelData.yAxisName).toEqual(`y2`);

    // Check special points
    levelDataItems = ljChart.data.filter(data => data instanceof LjChartDataItem) as Array<LjChartDataItem>;
    expect(levelDataItems.length).toEqual(6);
    levelDataItem = levelDataItems[0];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([3.55]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjSpecialPointSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjSpecialMarkerSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[1];
    expect(levelDataItem.x).toEqual(['3/21/21']);
    expect(levelDataItem.y).toEqual([1.0]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorDefault);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[2];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([2.5]);   // Out of range indicator at 2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeFalse();

    levelDataItem = levelDataItems[3];
    expect(levelDataItem.x).toEqual(['3/9/21 ']);
    expect(levelDataItem.y).toEqual([2.3]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[4];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([0.7]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorReject);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[5];
    expect(levelDataItem.x).toEqual([' 3/9/21 ']);
    expect(levelDataItem.y).toEqual([2.5]);   // Out of range indicator at -2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeFalse();

    // Check config
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0]).toBeDefined();
    expect(ljChart.config.xAxis[0].matches).toBeUndefined();
    expect(ljChart.config.xAxis[0].range).toEqual([0, 5]);
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(2);
    expect(ljChart.config.yAxis[0]).toBeDefined();
    expect(ljChart.config.yAxis[0].matches).toBeUndefined();
    let levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 1);
    expect(levelItems.length).toBeGreaterThan(0);
    expect(ljChart.config.yAxis[0].range).toEqual([-advancedLj3SdValue, advancedLj3SdValue]);

    expect(ljChart.config.xAxis[1]).toBeDefined();
    expect(ljChart.config.xAxis[1].matches).toEqual(`x`);
    expect(ljChart.config.xAxis[1].range).toEqual([0, 5]);
    expect(ljChart.config.yAxis[1]).toBeDefined();
    expect(ljChart.config.yAxis[1].matches).toBeUndefined();
    levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 5);
    expect(levelItems.length).toBeGreaterThan(0);
    expect(ljChart.config.yAxis[1].range).toEqual([-advancedLj3SdValue, advancedLj3SdValue]);
  });

  it('has the proper x-axis ranges depending on start date and end date', () => {
    // January 1 - March 8
    let levels = [1, 5];
    let startDate = new Date(2021, 0, 1, 20, 2, 0), endDate = new Date(2021, 2, 8, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0].range).toEqual([0, 0]);
    expect(ljChart.config.xAxis[1].range).toEqual([0, 0]);

    // March 5 - March 8
    startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 8, 20, 2, 0);
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0].range).toEqual([0, 0]);
    expect(ljChart.config.xAxis[1].range).toEqual([0, 0]);

    // March 6 - March 8
    startDate = new Date(2021, 2, 6, 20, 2, 0), endDate = new Date(2021, 2, 8, 20, 2, 0);
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0].range).toBeNull();
    expect(ljChart.config.xAxis[0].range).toBeNull();

    // March 8 - March 10
    startDate = new Date(2021, 2, 8, 20, 2, 0);
    endDate = new Date(2021, 2, 10, 20, 2, 0);
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0].range).toEqual([1, 3]);
    expect(ljChart.config.xAxis[1].range).toEqual([1, 3]);

    // March 9 - March 25
    startDate = new Date(2021, 2, 9, 20, 2, 0);
    endDate = new Date(2021, 2, 25, 20, 2, 0);
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0].range).toEqual([1, 5]);
    expect(ljChart.config.xAxis[1].range).toEqual([1, 5]);

    // Before data
    startDate = new Date(2019, 2, 9, 20, 2, 0);
    endDate = new Date(2019, 2, 25, 20, 2, 0);
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0].range).toBeNull();
    expect(ljChart.config.xAxis[1].range).toBeNull();

    // After data
    startDate = new Date(2119, 2, 9, 20, 2, 0);
    endDate = new Date(2119, 2, 25, 20, 2, 0);
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0].range).toBeNull();
    expect(ljChart.config.xAxis[1].range).toBeNull();

    // Data in split runs
    startDate = new Date(2021, 2, 5, 20, 2, 0);
    endDate = new Date(2021, 2, 21, 20, 2, 0);
    levels = [1, 5];
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints5, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0].range).toEqual([0, 3]);
    expect(ljChart.config.xAxis[1].range).toEqual([0, 3]);

    // Data in split runs and no z-score
    levels = [1, 3, 5, 6];
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints4, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(4);
    expect(ljChart.config.xAxis[0].range).toEqual([0, 5]);
    expect(ljChart.config.xAxis[1].range).toEqual([0, 5]);
    expect(ljChart.config.xAxis[2].range).toEqual([0, 5]);
    expect(ljChart.config.xAxis[3].range).toEqual([0, 5]);

    startDate = new Date(2021, 2, 10, 20, 2, 0);
    endDate = new Date(2021, 2, 20, 20, 2, 0);
    levels = [1, 3, 5, 6];
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints4, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(4);
    expect(ljChart.config.xAxis[0].range).toBeNull();
    expect(ljChart.config.xAxis[1].range).toBeNull();
    expect(ljChart.config.xAxis[2].range).toBeNull();
    expect(ljChart.config.xAxis[3].range).toEqual([3, 4]);
  });

  it('has the proper y-axis ranges depending on the last eval SD', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 1, 20, 2, 0), endDate = new Date(2021, 2, 31, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    let meanValue: number, sdValue: number;
    let levelItems: PointDataResult[];

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(2);
    levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 1);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[0].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);
    levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 5);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[1].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);

    // Test with other data set
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints2, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(2);
    levelItems = dataPoints2.filter(dataPoint => dataPoint.controlLevel === 1);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[0].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);
    levelItems = dataPoints2.filter(dataPoint => dataPoint.controlLevel === 5);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[1].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);

    // Test with data set containing no z-scores
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints3, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(2);
    levelItems = dataPoints3.filter(dataPoint => dataPoint.controlLevel === 1);
    expect(levelItems.length).toBeGreaterThan(0);
    expect(ljChart.config.yAxis[0].range).toEqual([10.5 - 0.2, 10.9 + 0.2]);
    levelItems = dataPoints3.filter(dataPoint => dataPoint.controlLevel === 5);
    expect(levelItems.length).toBeGreaterThan(0);
    expect(ljChart.config.yAxis[1].range).toEqual([75 - 0.2, 77.1 + 0.2 ]);
  });

  it('adds mean lines and SD regions', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    let levelItems: Array<PointDataResult>;
    let levelItem: PointDataResult;
    let shapes: Array<LjChartShape>;
    let shape: LjChartShape;

    expect(ljChart).toBeDefined();
    expect(ljChart.config).toBeDefined();
    shapes = ljChart.config.shapes;
    expect(shapes).toBeDefined();
    expect(shapes.length).toEqual(38);

    shapes = shapes.filter(shape => shape.color != advancedLjSecondaryAxisItemColor);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Rectangle && shape.color === advancedLj2SdRegionColor).length).toEqual(16);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Rectangle && shape.color === advancedLj3SdRegionColor).length).toEqual(16);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Line && shape.color === advancedLjMeanLineColor).length).toEqual(6);

    // Level 1 Shapes

    // SD region set 1
    levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 1);
    levelItem = levelItems[4];
    shape = shapes[0];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual(' 3/9/21 ');
    expect(shape.x1).toEqual('3/21/21');
    expect(shape.y0).toEqual(levelItem.targetMean - advancedLj2SdValue * levelItem.targetSD);
    expect(shape.y1).toEqual(levelItem.targetMean - levelItem.targetSD);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[1];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual(' 3/9/21 ');
    expect(shape.x1).toEqual('3/21/21');
    expect(shape.y0).toEqual(levelItem.targetMean + levelItem.targetSD);
    expect(shape.y1).toEqual(levelItem.targetMean + advancedLj2SdValue * levelItem.targetSD);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[2];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual(' 3/9/21 ');
    expect(shape.x1).toEqual('3/21/21');
    expect(shape.y0).toEqual(levelItem.targetMean - advancedLj3SdValue * levelItem.targetSD);
    expect(shape.y1).toEqual(levelItem.targetMean - advancedLj2SdValue * levelItem.targetSD);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[3];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual(' 3/9/21 ');
    expect(shape.x1).toEqual('3/21/21');
    expect(shape.y0).toEqual(levelItem.targetMean + advancedLj2SdValue * levelItem.targetSD);
    expect(shape.y1).toEqual(levelItem.targetMean + advancedLj3SdValue * levelItem.targetSD);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    // Mean line across all level 1 points
    levelItem = levelItems[4];
    shape = shapes[16];
    expect(shape.color).toEqual(advancedLjMeanLineColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21');
    expect(shape.y0).toEqual(levelItem.targetMean);
    expect(shape.y1).toEqual(levelItem.targetMean);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    // Level 5 Shapes

    // Mean line for first floating section
    levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 5);
    levelItem = levelItems[5];

    // SD region set 1
    levelItem = levelItems[5];
    shape = shapes[17];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual(' 3/9/21 ');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(levelItem.targetMean - advancedLj2SdValue * levelItem.targetSD);
    expect(shape.y1).toEqual(levelItem.targetMean - levelItem.targetSD);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    shape = shapes[18];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual(' 3/9/21 ');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(levelItem.targetMean + levelItem.targetSD);
    expect(shape.y1).toEqual(levelItem.targetMean + advancedLj2SdValue * levelItem.targetSD);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    shape = shapes[19];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual(' 3/9/21 ');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(levelItem.targetMean - advancedLj3SdValue * levelItem.targetSD);
    expect(shape.y1).toEqual(levelItem.targetMean - advancedLj2SdValue * levelItem.targetSD);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    shape = shapes[20];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual(' 3/9/21 ');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(levelItem.targetMean + advancedLj2SdValue * levelItem.targetSD);
    expect(shape.y1).toEqual(levelItem.targetMean + advancedLj3SdValue * levelItem.targetSD);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    // First mean line segment
    shape = shapes[21];
    expect(shape.color).toEqual(advancedLjMeanLineColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/21/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(levelItem.targetMean);
    expect(shape.y1).toEqual(levelItem.targetMean);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    // Last mean line segment
    levelItem = levelItems[0];
    shape = shapes[37];
    expect(shape.color).toEqual(advancedLjMeanLineColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/9/21');
    expect(shape.y0).toEqual(levelItem.targetMean);
    expect(shape.y1).toEqual(levelItems[1].targetMean);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');
  });

  it('adds mean lines and SD regions for cumulative data', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, yAxisStatistics);
    let shapes: Array<LjChartShape>;
    let shape: LjChartShape;

    expect(ljChart).toBeDefined();
    expect(ljChart.config).toBeDefined();
    shapes = ljChart.config.shapes;
    expect(shapes).toBeDefined();
    expect(shapes.length).toEqual(10);


    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Rectangle && shape.color === advancedLj2SdRegionColor).length).toEqual(4);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Rectangle && shape.color === advancedLj3SdRegionColor).length).toEqual(4);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Line && shape.color === advancedLjMeanLineColor).length).toEqual(2);

    // Level 1 Shapes
    shape = shapes[0];
    expect(shape.color).toEqual(advancedLjMeanLineColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[0].mean);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[0].mean);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[1];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[0].mean - advancedLj1SdValue * yAxisStatistics.levelStatistics[0].sd);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[0].mean - advancedLj2SdValue * yAxisStatistics.levelStatistics[0].sd);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[2];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[0].mean + advancedLj1SdValue * yAxisStatistics.levelStatistics[0].sd);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[0].mean + advancedLj2SdValue * yAxisStatistics.levelStatistics[0].sd);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[3];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[0].mean - advancedLj2SdValue * yAxisStatistics.levelStatistics[0].sd);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[0].mean - advancedLj3SdValue * yAxisStatistics.levelStatistics[0].sd);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[4];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[0].mean + advancedLj2SdValue * yAxisStatistics.levelStatistics[0].sd);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[0].mean + advancedLj3SdValue * yAxisStatistics.levelStatistics[0].sd);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');


    // Level 3 Shapes
    shape = shapes[5];
    expect(shape.color).toEqual(advancedLjMeanLineColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[4].mean);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[4].mean);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    shape = shapes[6];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[4].mean - advancedLj1SdValue * yAxisStatistics.levelStatistics[4].sd);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[4].mean - advancedLj2SdValue * yAxisStatistics.levelStatistics[4].sd);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    shape = shapes[7];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[4].mean + advancedLj1SdValue * yAxisStatistics.levelStatistics[4].sd);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[4].mean + advancedLj2SdValue * yAxisStatistics.levelStatistics[4].sd);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    shape = shapes[8];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[4].mean - advancedLj2SdValue * yAxisStatistics.levelStatistics[4].sd);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[4].mean - advancedLj3SdValue * yAxisStatistics.levelStatistics[4].sd);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    shape = shapes[9];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[4].mean + advancedLj2SdValue * yAxisStatistics.levelStatistics[4].sd);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[4].mean + advancedLj3SdValue * yAxisStatistics.levelStatistics[4].sd);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');
  })

  it('adds no mean lines or SD regions for single points', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints.slice(0, 2), null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    let shapes: Array<LjChartShape>;

    expect(ljChart).toBeDefined();
    expect(ljChart.config).toBeDefined();
    shapes = ljChart.config.shapes;

    shapes = shapes.filter(shape => shape.type === LjChartShapeForm.Line && shape.color != advancedLjSecondaryAxisItemColor);
    expect(shapes).toBeDefined();
    expect(shapes.length).toEqual(0);
  });

  it('no level path', () => {
    let levels = [];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints.slice(0, 2), null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.config).toBeDefined();
  });

  it('adds no mean lines or SD regions for no points', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, [], null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    let shapes: Array<LjChartShape>;

    expect(ljChart).toBeDefined();
    expect(ljChart.config).toBeDefined();
    shapes = ljChart.config.shapes;
    expect(shapes).toBeDefined();
    expect(shapes.length).toEqual(0);
  });

  it('adds mean lines and SD regions for overlay', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Overlay, canvas, chartEventFilterSelection, null);
    let shapes: Array<LjChartShape>;
    let shape: LjChartShape;

    expect(ljChart).toBeDefined();
    expect(ljChart.config).toBeDefined();
    shapes = ljChart.config.shapes;
    expect(shapes).toBeDefined();
    expect(shapes.length).toEqual(5);

    shapes = shapes.filter(shape => shape.color != advancedLjSecondaryAxisItemColor);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Rectangle && shape.color === advancedLj2SdRegionColor).length).toEqual(2);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Rectangle && shape.color === advancedLj3SdRegionColor).length).toEqual(2);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Line && shape.color === advancedLjMeanLineColor).length).toEqual(1);

    // Mean line
    shape = shapes[0];
    expect(shape.color).toEqual(advancedLjMeanLineColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(0);
    expect(shape.y1).toEqual(0);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    // SD regions
    shape = shapes[1];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(-advancedLj1SdValue);
    expect(shape.y1).toEqual(-advancedLj2SdValue);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[2];
    expect(shape.color).toEqual(advancedLj2SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(advancedLj1SdValue);
    expect(shape.y1).toEqual(advancedLj2SdValue);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[3];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(-advancedLj2SdValue);
    expect(shape.y1).toEqual(-advancedLj3SdValue);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    shape = shapes[4];
    expect(shape.color).toEqual(advancedLj3SdRegionColor);
    expect(shape.type).toEqual(LjChartShapeForm.Rectangle);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(advancedLj2SdValue);
    expect(shape.y1).toEqual(advancedLj3SdValue);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');
  });

  it('sets level mean and SD evaluation types in content response based on most recent point', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, hoverTranslation, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.config.xAxis).toBeDefined();
    let xAxis = ljChart.config.xAxis;
    expect(xAxis.length).toEqual(2);
    expect(xAxis[0].showTitle).toBeTrue();
    expect(xAxis[0].isFixedMean).toBeFalse();
    expect(xAxis[0].isFixedSd).toBeTrue();
    expect(xAxis[1].showTitle).toBeTrue();
    expect(xAxis[1].isFixedMean).toBeFalse();
    expect(xAxis[1].isFixedSd).toBeTrue();

    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints2, null, localTimeZone, hoverTranslation, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    expect(ljChart).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.config.xAxis).toBeDefined();
    xAxis = ljChart.config.xAxis;
    expect(xAxis.length).toEqual(2);
    expect(xAxis[0].showTitle).toBeTrue();
    expect(xAxis[0].isFixedMean).toBeTrue();
    expect(xAxis[0].isFixedSd).toBeTrue();
    expect(xAxis[1].showTitle).toBeTrue();
    expect(xAxis[1].isFixedMean).toBeFalse();
    expect(xAxis[1].isFixedSd).toBeFalse();
  });

  it('add dash mean lines when statistics data is present and overlay is false and not plotted by z-score', () => {
    let levels = [1, 5];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, comparisonStatistics, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    let shapes: Array<LjChartShape>;
    let shape: LjChartShape;

    expect(ljChart).toBeDefined();
    expect(ljChart.mode).toBe(LjChartMode.Value);
    expect(ljChart.config).toBeDefined();
    expect(comparisonStatistics).toBeDefined();
    expect(comparisonStatistics.levelStatistics.length).toBeGreaterThan(0);
    shapes = ljChart.config.shapes;
    expect(shapes).toBeDefined();
    expect(shapes.length).toBeGreaterThan(0);

    let dashLines = shapes.filter(shape => shape.type === LjChartShapeForm.Line && shape.color === advancedLjSecondaryAxisItemColor);
    expect(dashLines.length).toEqual(1);
    // Dash Mean line
    shape = dashLines[0];
    expect(shape.color).toEqual(advancedLjSecondaryAxisItemColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21 ');
    expect(shape.y0).toEqual(comparisonStatistics.levelStatistics[0].mean);
    expect(shape.y1).toEqual(comparisonStatistics.levelStatistics[0].mean);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');
    expect(shape.line.color).toEqual(advancedLjSecondaryAxisItemColor);
    expect(shape.line.dash).toEqual(advancedLjDashMeanShapeDash);
    expect(shape.line.width).toEqual(advancedLjMeanDashLineSize);
  });

  it('add secondary y axis when statistics data is present and overlay is false', () => {
    let levels = [1];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, comparisonStatistics, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);
    let singleSecondaryYaxis: LjChartSecondaryAxis;
    let secondaryYaxis: Array<LjChartSecondaryAxis>;
    secondaryYaxis = ljChart.config.secondaryYAxis;

    let pRange = ljChart.config.yAxis[0].range;
    expect(ljChart).toBeDefined();
    expect(ljChart.mode).toBe(LjChartMode.Value);
    expect(ljChart.config).toBeDefined();
    expect(comparisonStatistics).toBeDefined();
    expect(comparisonStatistics.levelStatistics.length).toBeGreaterThan(0);
    expect(secondaryYaxis).toBeDefined();
    expect(secondaryYaxis.length).toBeGreaterThan(0);
    let tMean = comparisonStatistics.levelStatistics[0].mean;
    let tSd = comparisonStatistics.levelStatistics[0].sd;

    let tickArr  = [(tMean-3*tSd),(tMean-2*tSd),(tMean-1*tSd),tMean,(tMean+1*tSd),(tMean+2*tSd),(tMean+3*tSd)]
    tickArr = tickArr.map(val => parseFloat(val.toFixed(dataPoints[0].decimalPlace)))
    // Dash secondary y axis
    singleSecondaryYaxis = secondaryYaxis[0];
    expect(singleSecondaryYaxis.range).toEqual(pRange);
    expect(singleSecondaryYaxis.titlefont.color).toEqual(advancedLjSecondaryAxisItemColor);
    expect(singleSecondaryYaxis.overlaying).toEqual('y1');
    expect(singleSecondaryYaxis.side).toEqual(advancedLjSecondaryYAxisPosition);
    expect(singleSecondaryYaxis.showgrid).toEqual(advancedLjSecondaryYAxisNoShowGrid);
    expect(singleSecondaryYaxis.tickvals).toEqual(tickArr);
  });

  it('set correct range for all levels when data is entered in split runs', () => {
    let levels = [1, 3, 5, 6];
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints4, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);

    // Check config
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(4);
    let minRange = Number((ljChart.config.xAxis[0].range)[0]);
    let maxRange = Number((ljChart.config.xAxis[0].range)[1]);
    ljChart.config.xAxis.forEach((lvl) => { if (Number(lvl.range[0]) < minRange) { minRange = Number(lvl.range[0]) } });
    ljChart.config.xAxis.forEach((lvl) => { if (Number(lvl.range[1]) > maxRange) { maxRange = Number(lvl.range[1]) } });
    expect(ljChart.config.xAxis[0]).toBeDefined();
    expect(ljChart.config.xAxis[0].range).toEqual([minRange, maxRange]);
    expect(ljChart.config.xAxis[1]).toBeDefined();
    expect(ljChart.config.xAxis[1].range).toEqual([minRange, maxRange]);
    expect(ljChart.config.xAxis[2]).toBeDefined();
    expect(ljChart.config.xAxis[2].range).toEqual([minRange, maxRange]);
    expect(ljChart.config.xAxis[3]).toBeDefined();
    expect(ljChart.config.xAxis[3].range).toEqual([minRange, maxRange]);

    levels = [1, 5];
    ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints5, null, localTimeZone, {}, appLocale, [], LjChartXAxisType.Sequence, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value);

    // Check config
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    minRange = Number((ljChart.config.xAxis[0].range)[0]);
    maxRange = Number((ljChart.config.xAxis[0].range)[1]);
    ljChart.config.xAxis.forEach((lvl) => { if (Number(lvl.range[0]) < minRange) { minRange = Number(lvl.range[0]) } });
    ljChart.config.xAxis.forEach((lvl) => { if (Number(lvl.range[1]) > maxRange) { maxRange = Number(lvl.range[1]) } });
    expect(ljChart.config.xAxis[0]).toBeDefined();
    expect(ljChart.config.xAxis[0].range).toEqual([minRange, maxRange]);
    expect(ljChart.config.xAxis[1]).toBeDefined();
    expect(ljChart.config.xAxis[1].range).toEqual([minRange, maxRange]);
  })

  it('populates x-axis array with x-axis values of each point for Date plots', () => {
    let xAxisType = LjChartXAxisType.Date;
    let xAxisItems = advancedLjChartHelperForRepeatedDates.GetXAxisItemsForLevel(dataPoints.filter(dataPoint => dataPoint.controlLevel === 1), localTimeZone, xAxisType, appLocale);
    expect(xAxisItems).toEqual(['3/5/21', '3/9/21', '3/9/21', '3/9/21', '3/21/21']);

    xAxisItems = advancedLjChartHelperForRepeatedDates.GetXAxisItemsForLevel(dataPoints.filter(dataPoint => dataPoint.controlLevel === 2), localTimeZone, xAxisType, appLocale);
    expect(xAxisItems).toEqual([]);

    xAxisItems = advancedLjChartHelperForRepeatedDates.GetXAxisItemsForLevel(dataPoints.filter(dataPoint => dataPoint.controlLevel === 5), localTimeZone, xAxisType, appLocale);
    expect(xAxisItems).toEqual(['3/5/21', '3/9/21', '3/9/21', '3/9/21', '3/21/21', '3/21/21']);
  });

  it('populates chart content by z-score for each level for use by chart component with x axis values for each point as Date Plots', () => {
    let levels = [1, 5];
    let xAxisType = LjChartXAxisType.Date;
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], xAxisType, LjChartMode.Zscore, canvas, chartEventFilterSelection, null);
    let levelDataValues: Array<LjChartDataLevel>, levelData: LjChartDataLevel;
    let levelDataItems: Array<LjChartDataItem>, levelDataItem: LjChartDataItem;

    let xAxisItems = advancedLjChartHelperForRepeatedDates.GetXAxisItemsForLevel(dataPoints.filter(dataPoint => dataPoint.controlLevel === 1), localTimeZone, xAxisType, appLocale);
    expect(xAxisItems).toEqual(['3/5/21', '3/9/21', '3/9/21', '3/9/21', '3/21/21']);

    expect(ljChart).toBeDefined();

    // Check data
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Zscore);
    levelDataValues = ljChart.data.filter(data => data instanceof LjChartDataLevel) as Array<LjChartDataLevel>;
    expect(levelDataValues.length).toEqual(levels.length);
    levelData = levelDataValues[0];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21', '3/9/21', '3/21/21']);
    expect(levelData.y).toBeDefined();
    let zScores = dataPoints
      .filter(dataPoint => dataPoint.controlLevel === levels[0])
      .map(dataPoint => dataPoint.zScoreData?.zScore);
    expect(zScores).toBeDefined();
    expect(zScores.length).toBeGreaterThan(0);
    expect(levelData.y).toEqual(zScores);
    expect(levelData.lineColor).toEqual(levelColors[levels[0] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);
    expect(levelData.mode).toEqual(advancedLjPlotlyModeMarkers);
    levelData = levelDataValues[1];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21', '3/9/21', '3/21/21', '3/21/21']);
    expect(levelData.y).toBeDefined();
    zScores = dataPoints
      .filter(dataPoint => dataPoint.controlLevel === levels[1])
      .map(dataPoint => dataPoint.zScoreData?.zScore);
    expect(zScores).toBeDefined();
    expect(zScores.length).toBeGreaterThan(0);
    expect(levelData.y).toEqual(zScores);
    expect(levelData.lineColor).toEqual(levelColors[levels[1] - 1]);
    expect(levelData.xAxisName).toEqual(`x2`);
    expect(levelData.yAxisName).toEqual(`y2`);
    expect(levelData.mode).toEqual(advancedLjPlotlyModeMarkers);

    // Check special points
    levelDataItems = ljChart.data.filter(data => data instanceof LjChartDataItem) as Array<LjChartDataItem>;
    expect(levelDataItems.length).toEqual(6);
    levelDataItem = levelDataItems[0];

    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([3.55]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjSpecialPointSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjSpecialMarkerSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[1];
    expect(levelDataItem.x).toEqual(['3/21/21']);
    expect(levelDataItem.y).toEqual([1.0]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorDefault);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[2];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([2.5]);   // Out of range indicator at 2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeFalse();

    levelDataItem = levelDataItems[3];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([2.3]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[4];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([0.7]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorReject);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[5];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([2.5]);   // Out of range indicator at -2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x2');
    expect(levelDataItem.yAxisName).toEqual('y2');
    expect(levelDataItem.showHoverText).toBeFalse();

    // Check config
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(2);
    expect(ljChart.config.xAxis[0]).toBeDefined();
    expect(ljChart.config.xAxis[0].matches).toBeUndefined();
    expect(ljChart.config.xAxis[0].range).toEqual([0, 2]);
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(2);
    expect(ljChart.config.yAxis[0]).toBeDefined();
    expect(ljChart.config.yAxis[0].matches).toBeUndefined();
    let levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 1);
    expect(levelItems.length).toBeGreaterThan(0);
    expect(ljChart.config.yAxis[0].range).toEqual([-advancedLj3SdValue, advancedLj3SdValue]);

    expect(ljChart.config.xAxis[1]).toBeDefined();
    expect(ljChart.config.xAxis[1].matches).toEqual(`x`);
    expect(ljChart.config.xAxis[1].range).toEqual([0, 2]);
    expect(ljChart.config.yAxis[1]).toBeDefined();
    expect(ljChart.config.yAxis[1].matches).toBeUndefined();
    levelItems = dataPoints.filter(dataPoint => dataPoint.controlLevel === 5);
    expect(levelItems.length).toBeGreaterThan(0);
    expect(ljChart.config.yAxis[1].range).toEqual([-advancedLj3SdValue, advancedLj3SdValue]);
  });

  it('populates chart content by Eval mean for each level to be use by chart component with x axis values for each point as Date Plots', () => {
    let levels = [1, 5];
    let xAxisType = LjChartXAxisType.Date;
    let startDate = new Date(2021, 2, 1, 20, 2, 0), endDate = new Date(2021, 2, 31, 20, 2, 0);
    let meanValue: number, sdValue: number;
    let levelItems: PointDataResult[];
    let levelDataValues: Array<LjChartDataLevel>, levelData: LjChartDataLevel;
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints2, null, localTimeZone, {}, appLocale, [], xAxisType, LjChartMode.Value, canvas, chartEventFilterSelection, null);

    // Check data
    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value); // this mode is for both cumulative mean and eval mean
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(2);
    levelItems = dataPoints2.filter(dataPoint => dataPoint.controlLevel === 1);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[0].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);
    levelItems = dataPoints2.filter(dataPoint => dataPoint.controlLevel === 5);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[1].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);

    levelDataValues = ljChart.data.filter(data => data instanceof LjChartDataLevel) as Array<LjChartDataLevel>;
    expect(levelDataValues.length).toEqual(levels.length);
    levelData = levelDataValues[0];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/7/21', '3/9/21', '3/9/21', '3/21/21']);
    expect(levelData.y).toBeDefined();
    expect(levelData.lineColor).toEqual(levelColors[levels[0] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);
    expect(levelData.mode).toEqual(advancedLjPlotlyModeMarkers);

  });

  it('populates chart content by Cumulative mean for each level to be use by chart component with x axis values for each point as Date Plots', () => {
    let levels = [1, 5];
    let xAxisType = LjChartXAxisType.Date;
    let startDate = new Date(2021, 2, 1, 20, 2, 0), endDate = new Date(2021, 2, 31, 20, 2, 0);
    let meanValue: number, sdValue: number;
    let levelItems: PointDataResult[];
    let levelDataValues: Array<LjChartDataLevel>;
    let levelData: LjChartDataLevel;
    let shapes: Array<LjChartShape>;
    let shape: LjChartShape;
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints2, null, localTimeZone, {}, appLocale, [], xAxisType, LjChartMode.Value, canvas, chartEventFilterSelection, yAxisStatistics);

    // Check data
    expect(ljChart).toBeDefined();
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Value); // this mode is for both cumulative mean and eval mean
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(2);
    levelItems = dataPoints2.filter(dataPoint => dataPoint.controlLevel === 1);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[0].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);
    levelItems = dataPoints2.filter(dataPoint => dataPoint.controlLevel === 5);
    expect(levelItems.length).toBeGreaterThan(0);
    meanValue = levelItems[levelItems.length - 1].targetMean;
    sdValue = levelItems[levelItems.length - 1].targetSD;
    expect(ljChart.config.yAxis[1].range).toEqual([meanValue - advancedLjYaxisSdRange * sdValue, meanValue + advancedLjYaxisSdRange * sdValue]);

    shapes = ljChart.config.shapes;
    expect(shapes).toBeDefined();
    expect(shapes.length).toEqual(10);
    expect(shapes.filter(shape => shape.type === LjChartShapeForm.Line && shape.color === advancedLjMeanLineColor).length).toEqual(2);

    // Level 1 Shapes
    shape = shapes[0];
    expect(shape.color).toEqual(advancedLjMeanLineColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[0].mean);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[0].mean);
    expect(shape.xAxisName).toEqual('x1');
    expect(shape.yAxisName).toEqual('y1');

    // Level 5 Shapes
    shape = shapes[5];
    expect(shape.color).toEqual(advancedLjMeanLineColor);
    expect(shape.type).toEqual(LjChartShapeForm.Line);
    expect(shape.x0).toEqual('3/5/21');
    expect(shape.x1).toEqual('3/21/21');
    expect(shape.y0).toEqual(yAxisStatistics.levelStatistics[4].mean);
    expect(shape.y1).toEqual(yAxisStatistics.levelStatistics[4].mean);
    expect(shape.xAxisName).toEqual('x2');
    expect(shape.yAxisName).toEqual('y2');

    levelDataValues = ljChart.data.filter(data => data instanceof LjChartDataLevel) as Array<LjChartDataLevel>;
    expect(levelDataValues.length).toEqual(levels.length);
    levelData = levelDataValues[0];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/7/21', '3/9/21', '3/9/21', '3/21/21']);
    expect(levelData.y).toBeDefined();
    expect(levelData.lineColor).toEqual(levelColors[levels[0] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);
    expect(levelData.mode).toEqual(advancedLjPlotlyModeMarkers);

  });

  it('populates chart content as overlay for use by chart component with x axis values for each point as Date Plots', () => {
    let levels = [1, 5];
    let xAxisType = LjChartXAxisType.Date;
    let startDate = new Date(2021, 2, 5, 20, 2, 0), endDate = new Date(2021, 2, 21, 20, 2, 0);
    let ljChart = advancedLjChartHelperForRepeatedDates.GetChartContent(levels, startDate, endDate, dataPoints, null, localTimeZone, {}, appLocale, [], xAxisType, LjChartMode.Overlay, canvas, chartEventFilterSelection, null);
    let levelDataValues: Array<LjChartDataLevel>, levelData: LjChartDataLevel;
    let levelDataItems: Array<LjChartDataItem>, levelDataItem: LjChartDataItem;

    expect(ljChart).toBeDefined();

    // Check data
    expect(ljChart.data).toBeDefined();
    expect(ljChart.config).toBeDefined();
    expect(ljChart.mode).toEqual(LjChartMode.Overlay);
    levelDataValues = ljChart.data.filter(data => data instanceof LjChartDataLevel) as Array<LjChartDataLevel>;
    expect(levelDataValues.length).toEqual(levels.length);
    levelData = levelDataValues[0];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21', '3/9/21', '3/21/21']);
    expect(levelData.y).toBeDefined();
    let zScores = dataPoints
      .filter(dataPoint => dataPoint.controlLevel === levels[0])
      .map(dataPoint => dataPoint.zScoreData?.zScore);
    expect(zScores).toBeDefined();
    expect(zScores.length).toBeGreaterThan(0);
    expect(levelData.y).toEqual(zScores);
    expect(levelData.lineColor).toEqual(levelColors[levels[0] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);
    expect(levelData.mode).toEqual(advancedLjPlotlyModeMarkers);
    levelData = levelDataValues[1];
    expect(levelData.x).toBeDefined();
    expect(levelData.x).toEqual(['3/5/21', '3/9/21', '3/9/21', '3/9/21', '3/21/21', '3/21/21']);
    expect(levelData.y).toBeDefined();
    zScores = dataPoints
      .filter(dataPoint => dataPoint.controlLevel === levels[1])
      .map(dataPoint => dataPoint.zScoreData?.zScore);
    expect(zScores).toBeDefined();
    expect(zScores.length).toBeGreaterThan(0);
    expect(levelData.y).toEqual(zScores);
    expect(levelData.lineColor).toEqual(levelColors[levels[1] - 1]);
    expect(levelData.xAxisName).toEqual(`x1`);
    expect(levelData.yAxisName).toEqual(`y1`);
    expect(levelData.mode).toEqual(advancedLjPlotlyModeMarkers);

    // Check special points
    levelDataItems = ljChart.data.filter(data => data instanceof LjChartDataItem) as Array<LjChartDataItem>;
    expect(levelDataItems.length).toEqual(6);
    levelDataItem = levelDataItems[0];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([3.55]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjSpecialPointSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjSpecialMarkerSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[1];
    expect(levelDataItem.x).toEqual(['3/21/21']);
    expect(levelDataItem.y).toEqual([1.0]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorDefault);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[2];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([2.5]);   // Out of range indicator at 2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeFalse();

    levelDataItem = levelDataItems[3];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([2.3]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorWarning);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[4];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([0.7]);
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjSpecialPointColorReject);
    expect(levelDataItem.marker.size).toEqual(advancedLjCrossSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjCrossSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeTrue();

    levelDataItem = levelDataItems[5];
    expect(levelDataItem.x).toEqual(['3/9/21']);
    expect(levelDataItem.y).toEqual([2.5]);   // Out of range indicator at -2.5 SD
    expect(levelDataItem.marker).toBeDefined();
    expect(levelDataItem.marker.color).toEqual(advancedLjOutOfRangeColor);
    expect(levelDataItem.marker.size).toEqual(advancedLjOutOfRangeSize);
    expect(levelDataItem.marker.symbol).toEqual(advancedLjOutOfRangeHighSymbol);
    expect(levelDataItem.xAxisName).toEqual('x1');
    expect(levelDataItem.yAxisName).toEqual('y1');
    expect(levelDataItem.showHoverText).toBeFalse();

    // Check config
    expect(ljChart.config.xAxis).toBeDefined();
    expect(ljChart.config.xAxis.length).toEqual(1);
    expect(ljChart.config.xAxis[0]).toBeDefined();
    expect(ljChart.config.xAxis[0].matches).toBeUndefined();
    expect(ljChart.config.xAxis[0].range).toEqual([0, 2]);
    expect(ljChart.config.yAxis).toBeDefined();
    expect(ljChart.config.yAxis.length).toEqual(1);
    expect(ljChart.config.yAxis[0]).toBeDefined();
    expect(ljChart.config.yAxis[0].matches).toBeUndefined();
    expect(ljChart.config.yAxis[0].range).toEqual([-advancedLjYaxisSdRange, advancedLjYaxisSdRange]);
  });

});
