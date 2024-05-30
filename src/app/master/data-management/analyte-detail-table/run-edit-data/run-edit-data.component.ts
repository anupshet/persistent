// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DecimalPipe, Time } from '@angular/common';
import * as ngrxStore from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import {
  Action, CalibratorLot, CustomRegex, getTimeZoneAdjustedDateTime, isTimeInputSupported, isValidRegex, ReagentLot, UserComment, getOffset
} from 'br-component-library';
import { cloneDeep } from 'lodash';
import * as moment from 'moment';

import { dataManagement } from '../../../../core/config/constants/data-management.const';
import { PointDataResult, RunData, TestSpecInfo, UpsertRequestOptions } from '../../../../contracts/models/data-management/run-data.model';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { DataManagementSpinnerService } from '../../../../shared/services/data-management-spinner.service';
import { RunsService } from '../../../../shared/services/runs.service';
import { LabTestService } from '../../../../shared/services/test-run.service';
import { AppUser } from '../../../../security/model/app-user.model';
import { AuthState } from '../../../../shared/state/reducers/auth.reducer';
import * as fromRoot from '../../../../state/app.state';
import * as fromDataManagement from '../../state/selectors';
import * as fromAuth from '../../../../shared/state/selectors';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { TestSpec } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, AuditTrailPriorCurrentValues, AnalyteLevelData } from '../../../../shared/models/audit-tracking.model';
import { DataManagementState } from '../../state/reducers/data-management.reducer';
import { Utility } from '../../../../core/helpers/utility';
import { select } from '@ngrx/store';
import * as navigationStateSelector from '../../../../shared/navigation/state/selectors';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { LocalizationDatePickerHelper, DATEPICKER_FORMATS } from '../../../../shared/localization-date-time/localization-date-time-formats';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YY',
  },
  display: {
    dateInput: 'MM/DD/YY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'unext-run-edit-data',
  templateUrl: './run-edit-data.component.html',
  styleUrls: ['./run-edit-data.component.scss'],
  providers: [
    DecimalPipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: DATEPICKER_FORMATS},
  ]
})
export class RunEditDataComponent implements OnInit, OnDestroy {
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  public regexRationalNumber = CustomRegex.RATIONAL_NUMBER;
  public evaluationType = EvaluationType;
  permissions = Permissions;

  // contains raw data
  calibratorLots: CalibratorLot[];
  reagentLots: ReagentLot[];
  // contains no expired lots
  reagentLotsTrim: ReagentLot[];
  calibratorLotsTrim: CalibratorLot[];
  public selectedReagentLotId: number;
  public selectedCalibratorLotId: number;
  public selectedCalibratorLotChangeFlag = false;
  public selectedReagentLotChangeFlag = false;

  public activeReagentExpiredLot = false;
  public activeCalibratorExpiredLot = false;
  public runIndex: number;
  public actions: Array<Action>;

  public runDataPageSet: Array<RunData>;
  private initRunData: RunData;
  public runData: RunData;
  public runEditData: RunData;
  public nextPageFirstRun: RunData;
  public prevPageLastRun: RunData;
  public prevRunDataDateTime: Date;
  public nextRunDataDateTime: Date;
  public pageNumber: number;
  public runDataEdit: Array<RunData>;

  private isLatestRun: boolean;
  private isDataValueChanged: boolean;

  // Date and time fields
  public serializedDate = new FormControl(new Date());
  public nextRunDate = new Date();
  public previousRunDate = dataManagement.earliestDate;

  public selectedRunDate: Date = new Date();
  public selectedDateTime: Date;
  public selectedRunStringTime: string;
  public selectedRunStringTimeAmPm: string;
  public prevRunDate: Date = new Date();
  public prevRunStringTime: string;
  public prevRestartFloatstatistics: boolean;

  public isValidTimeFormat: boolean;
  public isBeforeDay: boolean;
  public isBeforeNextRun: boolean;
  public isAfterPreviousRun: boolean;
  public isValidDateTime: boolean;
  public isTimeInputSupported: boolean = null;
  public selectedActionId: number;
  public commentContent: string;

  public analyteName: string;
  private controlLotIds: Array<number>;
  public levelsInUse: Array<number>;
  public decimalLevels: Array<number>;

  private labTimeZone = '';
  private labTestId: string;
  private labInstrumentId: string;
  private labProductId: string;
  private accountId: string;
  private accountNumber: string;
  private labId: string;

  activeReagent = -1;
  activeCalibrator = -1;

  private currentTestSpecId: number | string;
  private correlatedTestSpecId: string;

  public onEdit = new EventEmitter<RunData>();
  public onDelete = new EventEmitter<number>();

  public lvColVisibleState: Array<boolean> = [false, false, false, false];

  public pointDataResults: Array<PointDataResult>;
  public isSubmitting = false;
  public isPristine = false;
  private isSelectedActionId: number;
  private isCommentContent: string;
  public priorDataManagementState: DataManagementState;
  public prevRunDataPageSet: RunData;
  currentUser: AppUser;
  _pointDataResults: any;
  private destroy$ = new Subject<boolean>();

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24],
    icons.delete[48]
  ];
  private isRestartFloatChanged: boolean;
  public restartFloatstatistics = false;
  public isRunRestarted = false;
  public disableRestartFloatstatistics = false;
  public restartFloatstatisticsIntialValue: boolean;
  private count = 0;
  auditNavigationFailedPayload: AppNavigationTracking;
  public auditTrailPayload: AppNavigationTracking = {
    auditTrail: {
      eventType: AuditTrackingEvent.AnalyteDataTable,
      action: AuditTrackingAction.Add,
      actionStatus: AuditTrackingActionStatus.Success,
      priorValue: {},
      currentValue: {}
    }
  };
  reagentCallibrator;
  selectedLang: any = { lcid: 'en-US' };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DATE_FORMATS) public dataDatePicker: any,
    public dialogRef: MatDialogRef<RunEditDataComponent>,
    private runsService: RunsService,
    private codeListAPIService: CodelistApiService,
    private dateTimeHelper: DateTimeHelper,
    private messageSnackBar: MessageSnackBarService,
    private dataManagementSpinnerService: DataManagementSpinnerService,
    private renderer: Renderer2,
    private labTestService: LabTestService,
    private store: ngrxStore.Store<fromRoot.State>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private _appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService,
    private adapter: DateAdapter<any>,
    private localizationDatePickerHelper: LocalizationDatePickerHelper,
  ) {
    this.iconService.addIcons(this.iconsUsed);
    this.navigationGetLocale$
    .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
    .subscribe(loc => {
      this.localizationDatePickerHelper.getShortDateFormatString(loc);
    });
  }

  ngOnInit() {
    this.getDateFormatString();
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!authState.currentUser), take(1))
      .subscribe((authState: AuthState) => {
        try {
          this.currentUser = authState.currentUser;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
              (componentInfo.RunEditDataComponent + blankSpace + Operations.FetchUser)));
        }
      });
    try {
      this.runIndex = this.data.runIndex;
      this.actions = this.data.actions;
      this.labTimeZone = this.data.labTimeZone;
      this.runDataPageSet = this.data.runDataPageSet;
      this.prevRunDataPageSet = this.data.runDataPageSet[this.runIndex];
      this.nextPageFirstRun = this.data.nextPageFirstRun;
      this.prevPageLastRun = this.data.prevPageLastRun;
      this.labInstrumentId = this.data.labInstrumentId;
      this.labProductId = this.data.labProductId;
      this.labId = this.data.labId;
      this.accountId = this.data.accountId;
      this.accountNumber = this.data.accountNumber;
      this.pageNumber = this.data.pageNumber;
      this.reagentLots = this.data.reagentLots;
      this.calibratorLots = this.data.calibratorLots;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          componentInfo.RunEditDataComponent + blankSpace + Operations.DialogDataPopulation));
    }

    this.store.pipe(ngrxStore.select(fromDataManagement.getDataManagementState))
      .pipe(filter(_dataManagement => !!_dataManagement), takeUntil(this.destroy$))
      .subscribe((dataManagementState) => {
        try {
          const analyteInfo = dataManagementState.cumulativeAnalyteInfo[0];
          this.priorDataManagementState = dataManagementState;
          this.labTestId = dataManagementState.entityId;
          this.analyteName = dataManagementState.entityName;
          this.controlLotIds = analyteInfo.controlLotIds;
          this.levelsInUse = analyteInfo.levelsInUse;
          this.decimalLevels = analyteInfo.decimalPlaces;

          this.activeReagent = analyteInfo.defaultReagentLot.id;
          this.activeCalibrator = analyteInfo.defaultCalibratorLot.id;
          this.selectedReagentLotId = analyteInfo.defaultReagentLot.id;
          this.selectedCalibratorLotId = analyteInfo.defaultCalibratorLot.id;

          this.currentTestSpecId = analyteInfo.testSpecId;
          this.correlatedTestSpecId = analyteInfo.correlatedTestSpecId;
          if (this.reagentLots !== undefined) {
            this.reagentLotsTrim = [...this.reagentLots];
          }

          if (this.calibratorLots !== undefined) {
            this.calibratorLotsTrim = [...this.calibratorLots];
          }
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
              componentInfo.RunEditDataComponent + blankSpace + Operations.FetchDepartmentManagement));
        }
      });
    const runDataPageSet = this.runDataPageSet[this.runIndex];
    // Update selected reagent and calibrator lots based on the particular run being edited
    this.codeListAPIService.getTestSpecByIdAsync(runDataPageSet.testSpecId.toString()).then(testData => {
      if (testData) {
        this.reagentCallibrator = cloneDeep(testData);
        // Update the lots dropdown menu with respective CalibratorLots & ReagentLots
        Promise.all([
          this.codeListAPIService.getReagentLotsByReagentIdAsync(testData.reagentId.toString(), false),
          this.codeListAPIService.getCalibratorLotsByCalibratorIdAsync(testData.calibratorId.toString(), false)
        ]).then(lots => {
          this.reagentLotsTrim = lots[0]?.sort((a, b) => (a.lotNumber).localeCompare(b.lotNumber)); // Sorted ReagentLots List
          this.calibratorLotsTrim = lots[1];
          this.removeExpiredLots(this.selectedRunDate);
        });
        this.selectedReagentLotId = testData.reagentLotId;
        this.activeReagent = testData.reagentLotId;
        this.selectedCalibratorLotId = testData.calibratorLotId;
        this.activeCalibrator = testData.calibratorLotId;
      }
    });

    try {
      this.runData = cloneDeep(runDataPageSet);
      this.restartFloatstatisticsIntialValue = this.runDataPageSet[this.runIndex].isRestartFloat;
      this.restartFloatstatistics = this.runDataPageSet[this.runIndex].isRestartFloat;
      this.disableRestartFloatstatistics = this.restartFloatstatistics;
      this.runData.userActions = [];
      this.initRunData = cloneDeep(this.runData);
      this.pointDataResults = this.setupPointDataResults(this.runData);
      this.isLatestRun = this.isRunLatestRun(this.runIndex, this.pageNumber);
      this.initNextRunDate();
      this.initPreviousRunDate();

      this.isTimeInputSupported = isTimeInputSupported(this.renderer);
      this.dateTimeInit();

      this.prevRunDate = this.selectedRunDate;
      this.prevRunStringTime = this.selectedRunStringTimeAmPm;
      this.prevRestartFloatstatistics = this.restartFloatstatistics;

      // Update the lots dropdown menu
      this.removeExpiredLots(this.selectedRunDate);

      this._pointDataResults = cloneDeep(this.pointDataResults);
      this.isSelectedActionId = this.selectedActionId;
      this.isCommentContent = this.commentContent;
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunEditDataComponent + blankSpace + Operations.RunDataPopulation));
    }
  }

  getDateFormatString() {
    this.store.pipe(select(navigationStateSelector.getLocale)).pipe(takeUntil(this.destroy$))
    .subscribe(
      (lang: any) => {
        this.adapter.setLocale(lang?.locale || lang?.lcid || this.selectedLang.lcid);
      }
    );
  }

  public isLevelInResult(level: number): boolean {
    return this.initRunData.results.filter(result => result.controlLevel === level).length > 0;
  }

  public async selectedReagent(reagentId: number): Promise<void> {
    this.isPristine = true;
    this.activeReagentExpiredLot = false;
    this.activeReagent = reagentId;

    await this.updateTestSpecIdAndLabTest(
      this.activeReagent,
      this.selectedCalibratorLotId
    );
    this.selectedReagentLotId = this.activeReagent;
    this.selectedReagentLotChangeFlag = true;
  }

  private setupPointDataResults(runData: RunData): Array<PointDataResult> {
    const pointDataResults = new Array<PointDataResult>();
    try {
      for (let lvIndex = 0; lvIndex < this.levelsInUse.length; lvIndex++) {
        const level = this.levelsInUse[lvIndex];
        const levelResult = runData.results.find(result => result.controlLevel === level);
        if (levelResult) {
          // AJT update UN 17298 remove converting value to fixed digits. SInce this is editing data, the actual data should be presented like for the data entry input screen.
          // levelResult.resultValue = parseFloat(levelResult.resultValue.toFixed(this.decimalLevels[0]));
          pointDataResults.push(levelResult);
        } else {
          const pointDataResult = new PointDataResult();
          pointDataResult.resultValue = null;
          pointDataResult.isAccepted = true;
          pointDataResult.controlLevel = level;
          pointDataResult.controlLotId = this.controlLotIds[lvIndex];
          pointDataResults.push(pointDataResult);
        }
      }
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunEditDataComponent + blankSpace + Operations.SetupPointDataResults));
    }

    return pointDataResults;

  }

  private async updateTestSpecIdAndLabTest(
    reagentLotId: number,
    calibratorLotId: number
  ) {
    const testSpecData: TestSpecInfo = await this.codeListAPIService.getTestSpecByIdAsync(
      this.runData.testSpecId.toString()
    );

    if (testSpecData) {
      this.currentTestSpecId = await this.codeListAPIService.getTestSpecIdAsync(
        testSpecData.analyteId.toString(),
        testSpecData.methodId.toString(),
        testSpecData.instrumentId.toString(),
        reagentLotId.toString(),
        testSpecData.storageUnitId.toString(),
        calibratorLotId.toString()
      );

      const labTest = await this.labTestService.getLabTest(this.labTestId);
      if (labTest.testSpecId !== this.currentTestSpecId) {
        labTest.testSpecId = this.currentTestSpecId;
        this.correlatedTestSpecId = this.currentTestSpecId;
      }
    }
  }

  private async getExpectedTestSpecId(
    selectedReagentLotId: number,
    selectedCalibratorLotId: number
  ) {
    const testSpecData: TestSpecInfo = await this.codeListAPIService.getTestSpecByIdAsync(
      this.runData.testSpecId.toString()
    );

    if (testSpecData) {
      this.currentTestSpecId = await this.codeListAPIService.getTestSpecIdAsync(
        testSpecData.analyteId.toString(),
        testSpecData.methodId.toString(),
        testSpecData.instrumentId.toString(),
        selectedReagentLotId.toString(),
        testSpecData.storageUnitId.toString(),
        selectedCalibratorLotId.toString()
      );
    }

    if (+this.currentTestSpecId <= 0) {
      const testSpec = new TestSpec();
      testSpec.analyteId = testSpecData.analyteId;
      testSpec.methodId = testSpecData.methodId;
      testSpec.instrumentId = testSpecData.instrumentId;
      testSpec.storageUnitId = testSpecData.storageUnitId;
      testSpec.reagentLotId = +selectedReagentLotId;
      testSpec.calibratorLotId = +selectedCalibratorLotId;
      const testSpecResult = await this.codeListAPIService.postTestSpecAsync(testSpec);
      if (testSpecResult) {
        this.currentTestSpecId = testSpecResult.id.toString();
      }
    }

    return this.currentTestSpecId;
  }

  public selectedCalibrator(calibratorID: number): void {
    this.isPristine = true;
    this.activeCalibratorExpiredLot = false;
    this.activeCalibrator = calibratorID;

    this.updateTestSpecIdAndLabTest(
      this.selectedReagentLotId,
      this.activeCalibrator
    );

    this.selectedCalibratorLotId = this.activeCalibrator;
    this.selectedCalibratorLotChangeFlag = true;
  }

  private isRunLatestRun(runIndex: number, pageNumber: number): boolean {
    return runIndex === 0 && pageNumber === 1;
  }

  private getNextDay(startDate: Date, timezone: string) {
    const tomorrow = startDate;
    tomorrow.setDate(tomorrow.getDate() + 1);
    const timeZoneOffset = this.dateTimeHelper.getTimeZoneOffset(tomorrow, timezone);
    return getTimeZoneAdjustedDateTime(
      tomorrow,
      timeZoneOffset
    );
  }

  private initNextRunDate(): void {
    if (this.runIndex === 0) {
      if (this.prevPageLastRun == null) {
        const labTimeZoneDayFromNow = this.getNextDay(new Date(), this.labTimeZone);
        this.nextRunDate = labTimeZoneDayFromNow;
      } else {
        this.nextRunDate = new Date(this.prevPageLastRun.runDateTime);
      }
    } else {
      this.nextRunDate = new Date(
        this.runDataPageSet[this.runIndex - 1].runDateTime
      );
    }
  }

  private initPreviousRunDate(): void {
    if (this.runIndex === this.runDataPageSet.length - 1) {
      if (this.nextPageFirstRun != null) {
        this.previousRunDate = new Date(this.nextPageFirstRun.runDateTime);
      }
    } else {
      this.previousRunDate = new Date(
        this.runDataPageSet[this.runIndex + 1].runDateTime
      );
    }
  }

  onTimeChange(val) {
    if (val) {
      this.selectedRunStringTime = val;
    }
  }

  private dateTimeInit(): void {
    const dateTimeOffset = getOffset(this.runData.runDateTime, this.labTimeZone);
    const timeZoneAdjustedDateTime = getTimeZoneAdjustedDateTime(this.runData.runDateTime, dateTimeOffset);
    this.serializedDate = new FormControl(timeZoneAdjustedDateTime);
    let date: any;
    date = moment(this.runData.runDateTime);
    this.selectedRunDate = date.tz(this.labTimeZone).format('MMM DD, YYYY');
    this.selectedRunStringTime = date.tz(this.labTimeZone).format('HH:mm');
    this.selectedRunStringTimeAmPm = date.tz(this.labTimeZone).format('hh:mm A');
    this.validateDateTime();
    this.removeExpiredLots(this.selectedRunDate);
  }

  public onDateChange(inputDate: string): void {
    this.isPristine = true;
    this.selectedRunDate = new Date(inputDate);
    this.validateDateTime();
    // update the lots dropdown menu
    this.removeExpiredLots(this.selectedRunDate);
  }

  private removeExpiredLots(selectedRunDate: Date): void {
    try {
      // TODO: Use runsService method instead
      this.activeReagentExpiredLot = false;
      this.activeCalibratorExpiredLot = false;

      this.reagentLotsTrim = [...this.reagentLotsTrim];
      this.calibratorLotsTrim = [...this.calibratorLotsTrim];

      const labDate = new Date(selectedRunDate);

      // trim expired reagents
      for (let re = this.reagentLotsTrim.length - 1; re >= 0; re--) {
        const shelfDate = new Date(this.reagentLotsTrim[re].shelfExpirationDate);
        if (shelfDate < labDate) {
          // if the lot was selected/ active... display error msg and disable saving
          if (
            this.selectedReagentLotId === this.reagentLots[re].id
          ) {
            this.activeReagentExpiredLot = true;
          }
          this.reagentLotsTrim.splice(re, 1);
        }
      }

      // trim expired calibrators
      for (let cal = this.calibratorLotsTrim.length - 1; cal >= 0; cal--) {
        const shelfDate = new Date(
          this.calibratorLotsTrim[cal].shelfExpirationDate
        );
        if (shelfDate < labDate) {
          if (
            this.selectedCalibratorLotId === this.calibratorLots[cal].id
          ) {
            this.activeCalibratorExpiredLot = true;
          }
          this.calibratorLotsTrim.splice(cal, 1);
        }
      }
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunEditDataComponent + blankSpace + Operations.RemoveExpiredLots));
    }
  }

  public onRadioChange(index, status): void {
    this.isPristine = true;
    this.pointDataResults[index].isAccepted = status;
  }

  public timeChanged() {
    if (this.isValidDateTime && this.isValidTimeFormat) {
      this.isPristine = true;
    } else {
      this.isPristine = false;
    }
  }

  public validateDateTime(): void {
    this.isValidTimeFormat = false;
    this.isBeforeDay = false;
    this.isBeforeNextRun = false;
    this.isAfterPreviousRun = false;
    this.isValidDateTime = false;


    if (this.selectedRunStringTime) {
      if (!this.isTimeInputSupported && !isValidRegex(this.selectedRunStringTime, CustomRegex.MILITARY_TIME)) {
        this.isValidTimeFormat = false;
      } else {
        this.isValidTimeFormat = true;
      }

      this.isDateTimeAfterPreviousRun();
      if (this.isLatestRun) {
        this.isDateTimeBeforeDayFromToday();
        this.isBeforeNextRun = true;
      } else {
        this.isDateTimeBeforeNextRun();
        this.isBeforeDay = true;
      }

      if (
        this.isAfterPreviousRun && this.isValidTimeFormat &&
        (this.isBeforeNextRun && this.isBeforeDay)
      ) {
        // Time is correct
        this.isValidDateTime = true;
      } else {
        this.isValidDateTime = false;
      }
    } else {
      this.isBeforeDay = true;
      this.isBeforeNextRun = true;
      this.isAfterPreviousRun = true;
    }
  }

  private isDateTimeBeforeDayFromToday(): void {
    const selectedDate = this.convertHourMinuteToDate(this.selectedRunStringTime);
    const selectedDateMinutes = this.convertDateToMinutes(selectedDate);

    const labTimeZoneDayFromNow = this.getNextDay(new Date(), this.labTimeZone);
    const dayFromTodayDateMinutes = this.convertDateToMinutes(labTimeZoneDayFromNow);

    this.isBeforeDay = selectedDateMinutes <= dayFromTodayDateMinutes;
  }

  public isDateTimeBeforeNextRun(): void {
    let selectedDate = this.convertHourMinuteToDate(this.selectedRunStringTime);
    selectedDate = this.dateTimeHelper.ConvertToDateFromDate(
      selectedDate,
      this.labTimeZone
    );

    const nextRunDateMinutes = this.convertDateToMinutes(this.nextRunDate);
    const selectedDateMinutes = this.convertDateToMinutes(selectedDate);

    this.isBeforeNextRun = selectedDateMinutes <= nextRunDateMinutes;
  }

  public isDateTimeAfterPreviousRun(): void {
    try {
      let selectedDate = this.convertHourMinuteToDate(this.selectedRunStringTime);
      selectedDate = this.dateTimeHelper.ConvertToDateFromDate(
        selectedDate,
        this.labTimeZone
      );

      const previousRunDateMinutes = this.convertDateToMinutes(
        this.previousRunDate
      );
      const selectedDateMinutes = this.convertDateToMinutes(selectedDate);

      this.isAfterPreviousRun = previousRunDateMinutes <= selectedDateMinutes;
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunEditDataComponent + blankSpace + Operations.IsDateTimeAfterPrevRun));
    }
  }

  public convertHourMinuteToDate(hourMinute: string): Date {
    const selectedTime = hourMinute.split(':');
    const selectedHours = Number(selectedTime[0]);
    const selectedMinutes = Number(selectedTime[1]);

    const selectedDate = new Date(this.selectedRunDate);
    selectedDate.setHours(selectedHours);
    selectedDate.setMinutes(selectedMinutes);

    return selectedDate;
  }

  public convertDateToMinutes(date: Date): number {
    return Math.abs(Math.floor(date.getTime() / (1000 * 60)));
  }

  public combineDateAndTime(date: Date, time: Date, seconds: number, milliseconds: number): Date {
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());
    combinedDateTime.setSeconds(seconds, milliseconds);
    return combinedDateTime;
  }

  public setAction(selectedActionId: number): void {
    this.runData.userActions = [];
    const selectedActionIndex = this.actions.findIndex(item => item.actionId === selectedActionId);
    const action = new Action();
    action.userId = this.currentUser.userOktaId;
    action.userFullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
    action.enterDateTime = new Date();
    action.actionId = this.actions[selectedActionIndex].actionId;
    action.actionName = this.actions[selectedActionIndex].actionName;
    this.runData.userActions.push(action);
  }

  private updateResults(
    pointDataResults: Array<PointDataResult>
  ): Array<PointDataResult> {
    const updatedResults = new Array<PointDataResult>();

    pointDataResults.forEach(pointDataResult => {
      if (this.isLevelInResult(pointDataResult.controlLevel)) {
        updatedResults.push(pointDataResult);
      } else {
        if (pointDataResult.resultValue !== null) {
          pointDataResult.measuredDateTime = new Date();
          pointDataResult.lastModified = new Date();
          updatedResults.push(pointDataResult);
        }
      }
    });

    return updatedResults;
  }

  public editRun(): void {
    try {
      this.isSubmitting = true;
      this.runData.userComments = [];
      if (this.activeReagentExpiredLot === true) {
        return;
      }

      if (this.activeCalibratorExpiredLot === true) {
        return;
      }

      this.validateDateTime();

      if (!this.isValidDateTime) {
        return;
      }
      if (this.isFormChanged() || this.isPristine) {
        this.dataManagementSpinnerService.displaySpinner(true);
        this.runData.results = this.updateResults(this.pointDataResults);
        this.updateLastModifiedDates();

        if (this.selectedActionId) {
          this.setAction(this.selectedActionId);
        }

        // Added specifically for IE11 compatibility
        if (this.commentContent) {
          const newComment = new UserComment();
          newComment.content = this.commentContent;
          newComment.userId = this.currentUser.userOktaId;
          newComment.userFullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
          newComment.enterDateTime = new Date();
          this.runData.userComments.push(newComment);
        }

        this.runData.onlyCommentAdded = this.isOnlyCommentAdded();

        if (this.isDataValueChanged && !this.isLatestRun) {
          const autoGeneratedComment = new UserComment();
          autoGeneratedComment.content = 'Data edited after initial evaluation';
          autoGeneratedComment.userFullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
          autoGeneratedComment.enterDateTime = new Date();
          this.runData.userComments.push(autoGeneratedComment);
        }

        this.selectedCalibratorLotId = this.activeCalibrator;
        this.selectedReagentLotId = this.activeReagent;

        this.runData.correlatedTestSpecId = this.correlatedTestSpecId;
        if (this.runData.upsertOptions === null && this.isLatestRun) {
          this.runData.upsertOptions = new UpsertRequestOptions();

          this.runData.upsertOptions.forceRuleEngineReEval = true;
        }

        const selectedTime = this.convertHourMinuteToDate(this.selectedRunStringTime);
        const timeZoneOffset = this.dateTimeHelper.getTimeZoneOffset(this.runData.runDateTime, this.labTimeZone);
        let seconds = 0;
        let milliseconds = 0;
        if (!this.timeWasChanged(selectedTime, getTimeZoneAdjustedDateTime(this.runData.runDateTime, timeZoneOffset))) {
          // preserve seconds and milliseconds
          seconds = this.runData.runDateTime.getSeconds();
          milliseconds = this.runData.runDateTime.getMilliseconds();
        }

        const selectedDateTime = this.combineDateAndTime(
          this.selectedRunDate,
          selectedTime,
          seconds,
          milliseconds
        );
        this.selectedDateTime = selectedDateTime;

        this.runData.runDateTime = this.dateTimeHelper.ConvertToDateFromDate(
          selectedDateTime,
          this.labTimeZone
        );

        this.runData.rawDataDateTime = this.runData.runDateTime;
        // update date & time to UTC. it will be converted to local time via the replacer function in LabDataApiService
        this.runData.localRunDateTime = this.runData.runDateTime;

        this.runData.results.forEach(level => {
          level.resultValue =  Utility.normalizeToRationalNumber(level.resultValue);
        });

        const runDataPut = Object.assign({}, this.runData);

        runDataPut.accountId = this.accountId;
        runDataPut.accountNumber = this.accountNumber;
        runDataPut.labId = this.labId;
        // TODO: Convert Labid to UUID if needed, remove this when ready
        if (!runDataPut.accountId.includes('-')) {
          runDataPut.accountId = runDataPut.accountId.substring(0, 8) + '-' +
            runDataPut.accountId.substring(8, 12) + '-' +
            runDataPut.accountId.substring(12, 16) + '-' +
            runDataPut.accountId.substring(16, 20) + '-' +
            runDataPut.accountId.substring(20, 33);
          runDataPut.accountId = runDataPut.accountId.toLocaleLowerCase();
        }

        // TODO: Convert Labid to UUID if needed, remove this when ready
        if (!runDataPut.labId.includes('-')) {
          runDataPut.labId = runDataPut.labId.substring(0, 8) + '-' +
            runDataPut.labId.substring(8, 12) + '-' +
            runDataPut.labId.substring(12, 16) + '-' +
            runDataPut.labId.substring(16, 20) + '-' +
            runDataPut.labId.substring(20, 33);
          runDataPut.labId = runDataPut.labId.toLocaleLowerCase();
        }

        runDataPut.labInstrumentId = this.labInstrumentId;
        runDataPut.labProductId = this.labProductId;

        runDataPut.labLocationTimeZone = this.labTimeZone;
        runDataPut.results = this.filterEmptyValueLevels();

        this.getExpectedTestSpecId(this.selectedReagentLotId, this.selectedCalibratorLotId).then(async currTestSpecId => {
          runDataPut.testSpecId = +currTestSpecId;
          let labTest = await this.labTestService.getLabTest(runDataPut.labTestId);
          labTest.testSpecId = currTestSpecId;
          if (this.runIndex === 0) {
            labTest = await this.labTestService.putLabTest(labTest).toPromise();
          }
          this.count++;
          this.runsService
            .putRunEditData(runDataPut)
            .then((editedRunData: RunData) => {
              if (editedRunData) {
                this.logAuditTrail();
                this.dataManagementSpinnerService.displaySpinner(false);
                this.onNoClick(--this.count);
                this.isSubmitting = false;
              }
            }, (error) => {
              this.logAuditTrail().auditTrail.actionStatus = AuditTrackingActionStatus.Failure;
            })
            .catch(() => {
              this.isSubmitting = false;
              this.dataManagementSpinnerService.displaySpinner(false);
              this.messageSnackBar.showMessageSnackBar(
                this.getTranslations('RUNEDITDATA.RESULTNOTEDITED')
              );
            });
        });
      }
      if (this.isRestartFloatChanged && !this.disableRestartFloatstatistics) {
        this.count++;
        this.runsService.restartFloatWithRun(this.runData.labTestId, this.runData.id)
          .then((response) => {
            this.dataManagementSpinnerService.displaySpinner(false);
            this.isSubmitting = false;
            this.onNoClick(--this.count, true);
          })
          .catch((error) => {
            this.restartFloatstatistics = !this.restartFloatstatistics;
            this.isRestartFloatChanged = !this.isRestartFloatChanged;
            this.isSubmitting = false;
            this.dataManagementSpinnerService.displaySpinner(false);
            this.messageSnackBar.showMessageSnackBar(
              this.getTranslations('RUNEDITDATA.RESULTNOTEDITED')
            );
          });
      }
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunEditDataComponent + blankSpace + Operations.RemoveExpiredLots));
    }
  }

  // UN-11110 - Update prior value here
  logAuditTrail() {
    const reagentLot = this.reagentLots.find(val => val.id === this.selectedReagentLotId);
    const calibratorLot = this.calibratorLots.find(val => val.id === this.selectedCalibratorLotId);
    let currentPointValue: AuditTrailPriorCurrentValues;
    let priorPointValue: AuditTrailPriorCurrentValues;
    const currentLevelData: AnalyteLevelData[] = [];
    const priorPointAnalyte = this._pointDataResults;
    const priorLevelData: AnalyteLevelData[] = [];

    priorPointAnalyte.map(element => {
      const priorValueObj: AnalyteLevelData = {
        'resultValue': element.resultValue,
        'level': element.controlLevel,
        'isAccept': element.isAccepted,
      };
      priorLevelData.push(priorValueObj);
    });

    this.runData.results.map(element => {
      const currentValueObj: AnalyteLevelData = {
        'resultValue': element.resultValue,
        'level': element.controlLevel,
        'isAccept': element.isAccepted,
      };
      currentLevelData.push(currentValueObj);
    });
    this.dateTimeInit();
    const currRunDate = this.selectedRunDate;
    const currRunStringTime = this.selectedRunStringTimeAmPm;
    currentPointValue = {
      'isReagentLot': this.selectedReagentLotChangeFlag,
      'isCalibratorLot': this.selectedCalibratorLotChangeFlag,
      'levelData': currentLevelData,
      'runDate': currRunDate,
      'runStringTime': currRunStringTime,
      'restartFloat': this.restartFloatstatistics ? true : false,
    };
    if (this.runData?.userComments.length > 0 && this.runData?.userComments[0]?.content) {
      currentPointValue.isComment = this.runData?.userComments.length > 0 ? true : false;
      currentPointValue.comment = this.runData?.userComments.length > 0 ? this.runData?.userComments[0]?.content : null;
    }
    if (this.runData?.userActions.length > 0) {
      currentPointValue.isAction = this.runData?.userActions.length > 0 ? true : false;
      currentPointValue.action = this.runData?.userActions.length > 0 ? this.runData?.userActions[0]?.actionName : null;
    }
    priorPointValue = {
      'isReagentLot': this.selectedReagentLotChangeFlag,
      'isCalibratorLot': this.selectedCalibratorLotChangeFlag,
      'levelData': priorLevelData,
      'runDate': this.prevRunDate,
      'runStringTime': this.prevRunStringTime,
      'restartFloat': this.prevRestartFloatstatistics,
    };
    if (this.selectedReagentLotChangeFlag) {
      currentPointValue.reagentLotID = reagentLot.id;
      currentPointValue.reagentLotName = reagentLot.lotNumber;
      priorPointValue.reagentLotID = this.priorDataManagementState.headerData.reagentLotId;
      priorPointValue.reagentLotName = this.priorDataManagementState.headerData.reagentLotNumber;
    }
    if (this.selectedCalibratorLotChangeFlag) {
      currentPointValue.calibratorLotID = calibratorLot.id;
      currentPointValue.calibratorLotName = calibratorLot.lotNumber;
      priorPointValue.calibratorLotID = this.priorDataManagementState.headerData.calibratorLotId;
      priorPointValue.calibratorLotName = this.priorDataManagementState.headerData.calibratorLotNumber;
    }

    const auditNavigationPayload: AppNavigationTracking = this._appNavigationService.comparePriorAndCurrentValues
      (currentPointValue, priorPointValue, AuditTrackingAction.Update, AuditTrackingEvent.AnalyteDataTable,
        AuditTrackingActionStatus.Success);
    auditNavigationPayload.auditTrail.device_id = this.runData.labTestId;
    auditNavigationPayload.auditTrail.run_id = this.runData.id;

    if (auditNavigationPayload.auditTrail.currentValue.levelData?.length) {
      delete auditNavigationPayload.auditTrail.currentValue['levelData'];
      delete auditNavigationPayload.auditTrail.priorValue['levelData'];
      const resultLevelData = this._appNavigationService.currentPriorChangeValue(currentLevelData, priorLevelData);
      if (resultLevelData.currentValues?.length) {
        auditNavigationPayload.auditTrail.currentValue.levelData = resultLevelData.currentValues;
      }
      if (resultLevelData.priorValues?.length) {
        auditNavigationPayload.auditTrail.priorValue.levelData = resultLevelData.priorValues;
      }
    }
    this.auditNavigationFailedPayload = auditNavigationPayload;
    this._appNavigationService.logAuditTracking(auditNavigationPayload, true);
    return this.auditNavigationFailedPayload;
  }

  private timeWasChanged(selectedTime: Date, runDateTime: Date): boolean {
    return selectedTime.getHours() !== runDateTime.getHours()
      || selectedTime.getMinutes() !== runDateTime.getMinutes();
  }

  private onNoClick(count: number, isRunRestarted?: boolean): void {
    this.isRunRestarted = isRunRestarted ? isRunRestarted : this.isRunRestarted;
    if (count === 0) {
      this.dialogRef.close(isRunRestarted);
    }
  }

  public onRestartFloatChanged(event: Event): void {
    this.isRestartFloatChanged = !this.isRestartFloatChanged;
  }

  private updateLastModifiedDates(): void {
    const lastModifiedDate = new Date();

    this.levelsInUse.forEach(lv => {
      const initResult = this.initRunData.results.find(result => result.controlLevel === lv);
      const newResult = this.runData.results.find(result => result.controlLevel === lv);
      if (initResult) {
        if (initResult.resultValue !== newResult.resultValue) {
          newResult.lastModified = lastModifiedDate;
          if (!this.isDataValueChanged) {
            this.isDataValueChanged = true;
          }
        } else {
          newResult.lastModified = initResult.lastModified;
        }
      }
    });
  }

  public deleteRun(runIndex: number): void {
    this.onDelete.emit(runIndex);
  }

  private filterEmptyValueLevels(): Array<PointDataResult> {
    const levels: Array<PointDataResult> = [];
    this.runData.results.forEach(level => {
      if (level.resultValue !== null && level.resultValue !== undefined && level.resultValue.toString() !== '' ) {
        levels.push(level);
      }
    });

    return levels;
  }

  public enableSubmit(): boolean {
    if (this.isSubmitting) {
      return !this.isSubmitting;
    } else if (this.isFormChanged() || this.isRestartFloatChanged) {
      if (this.isAfterPreviousRun && this.isValidTimeFormat &&
        (this.isBeforeNextRun && this.isBeforeDay)) {
        return true;
      }
    } else if (!this.isValidTimeFormat || !this.isValidDateTime) {
      return false;
    } else if (this.isPristine) {
      return true;
    } else {
      return false;
    }
  }

  private isFormChanged() {
    let isPointResultsEdited = false;
    isPointResultsEdited = this._pointDataResults.some((element, index) =>
      (element.resultValue !== this.pointDataResults[index].resultValue));
    return isPointResultsEdited || this.isSelectedActionId !== this.selectedActionId ||
      this.isCommentContent !== this.commentContent || this.restartFloatstatisticsIntialValue !== this.restartFloatstatistics;
  }

  private isOnlyCommentAdded(): boolean {
    let isPointResultsEdited = false;
    isPointResultsEdited = this._pointDataResults.some((element, index) =>
      (element.resultValue !== this.pointDataResults[index].resultValue));
    return !(isPointResultsEdited || this.isSelectedActionId !== this.selectedActionId || this.isPristine
      || this.isRestartFloatChanged || this.restartFloatstatisticsIntialValue !== this.restartFloatstatistics)
      && this.isCommentContent !== this.commentContent;
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
