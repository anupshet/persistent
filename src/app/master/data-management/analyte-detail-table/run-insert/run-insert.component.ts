// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as ngrxStore from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';

import { Subscription, Subject } from 'rxjs';
import { filter, takeUntil, take } from 'rxjs/operators';

import * as moment from 'moment';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';

import { Action, CalibratorLot, Lot, ReagentLot, UserComment } from 'br-component-library';
import { TestInfo } from '../../../../contracts/models/codelist-management/test-info.model';
import { RawDataType } from '../../../../contracts/models/data-management/base-raw-data.model';
import { LevelValue } from '../../../../contracts/models/data-management/level-value.model';
import { PointDataResult, RunData, TestSpecInfo } from '../../../../contracts/models/data-management/run-data.model';
import { RunInsertState } from '../../../../contracts/models/data-management/run-insert-state.model';
import { TestSpec } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { ConfigService } from '../../../../core/config/config.service';
import { dataManagement } from '../../../../core/config/constants/data-management.const';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { unsubscribe } from '../../../../core/helpers/rxjs-helper';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { LabDataApiService } from '../../../../shared/api/labDataApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { DataManagementSpinnerService } from '../../../../shared/services/data-management-spinner.service';
import { RunsService } from '../../../../shared/services/runs.service';
import { DataManagementService } from '../../../../shared/services/data-management.service';
import { LabProduct } from '../../../../contracts/models/lab-setup';
import { AppUser } from '../../../../security/model/app-user.model';
import * as fromRoot from '../../../../state/app.state';
import * as fromAuth from '../../../../shared/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { AuthState } from '../../../../shared/state/reducers/auth.reducer';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { NewRequestConfigType } from '../../../../contracts/enums/lab-setup/new-request-config-type.enum';
import { RequestNewConfigComponent } from '../../../../shared/components/request-new-config/request-new-config.component';
import { TemplateType } from '../../../../contracts/enums/lab-setup/template-type.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import {
  AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent, AuditTrailPriorCurrentValues,
  AnalyteLevelData
} from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { NavBarActions } from '../../../../shared/navigation/state/actions';
import { Utility } from '../../../../core/helpers/utility';

@Component({
  selector: 'unext-run-insert',
  templateUrl: './run-insert.component.html',
  styleUrls: ['./run-insert.component.scss']
})
export class RunInsertComponent implements OnInit, OnDestroy {
  // State of RunInsert will live in RunTable to preserve state
  // when RunInsert component gets destroyed by the virtual scroll
  @Input() state: RunInsertState;
  @Input() defaultReagentLotId: number;
  @Input() lastRunReagentLotId: number;
  @Input() defaultCalibratorLotId: number;
  @Input() lastRunCalibratorLotId: number;
  @Input() defaultReagentLot: ReagentLot;
  @Input() defaultCalibratorLot: CalibratorLot;
  @Input() selectedReagentLot: ReagentLot;
  @Input() selectedCalibratorLot: CalibratorLot;
  @Input() reagentLots: Array<ReagentLot>;
  @Input() calibratorLots: Array<CalibratorLot>;
  @Input() correctiveActions: Array<Action>;
  @Input() labTimeZone: string;
  @Input() controlLotIds: Array<number>;
  @Input() labTestId: string;
  @Input() labInstrumentId: string;
  @Input() labProductId: string;
  @Input() codeListTestId: number;
  @Input() labId: string;
  @Input() labUnitId: number;
  @Input() accountId: string;
  @Input() latestRunData: RunData;
  @Input() testId: string;
  @Input() productMasterLotExpiration: Date;
  @Input() productId: string;
  @Input() productMasterLotId: number;
  @Input() isLeafArchived: boolean;
  @Input() currentLanguage: boolean;
  @Output() onNewRunPost: EventEmitter<RunData> = new EventEmitter<RunData>();
  @Output() lotVisibility = new EventEmitter<boolean>();
  @Output() onInsertDifferentDate = new EventEmitter<boolean>();
  @Output() onSavedSelectedReagentId = new EventEmitter<number>();
  @Output() onSavedSelectedCalibratorId = new EventEmitter<number>();

  public timeZone: string;
  public submitDataToolTip: string;

  // States
  public levelValues: Array<LevelValue>;
  public selectedDateTime: Date;
  public currentDateTime: Date;
  public availableDateFrom: Date = dataManagement.earliestDate;
  public availableDateTo: Date;
  public selectedActionId: number;
  public isPastResultInsertAllowed: boolean;
  public isLotVisible: boolean;
  public expiredWarning: string;
  public dateTimeErrorMessage: string;
  public canInputDate = false;
  public isProductMasterLotExpired = false;
  public accountNumber: string;

  public appLocale: string;
  private newRun: RunData;

  public runDataInsertForm: FormGroup;
  public date: FormControl;
  public reagentLotSelect: FormControl;
  public calibratorLotSelect: FormControl;
  public correctiveActionsSelect: FormControl;

  public activeReagentLots: Array<ReagentLot>;

  public activeCalibratorLots: Array<CalibratorLot>;

  private userActions: Array<Action>;

  public isDefaultLot: boolean;
  public areValuesEmpty: boolean;
  public isSubmitDisabled = true;
  private isTimeInputValid = true;
  private dateSubscription$: Subscription;
  private dateErrorSubscription$: Subscription;
  public showOptions: boolean;
  public mouseIsEnter: boolean;
  public inputHasFocus: boolean;

  public addACommentPlaceholder = 'Comment ';
  // Forms
  public correctiveActionsFormControl = new FormControl();
  public commentsFormControl = new FormControl();
  public isComment: boolean;
  public comment: string;
  public formGroup: FormGroup;

  private destroy$ = new Subject<boolean>();

  onChange: any = () => { };
  onTouched: any = () => { };
  currentUser: AppUser;
  permissions = Permissions;
  currentPointsResults: Array<PointDataResult> = [];

  public getAccountState$ = this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentAccount));
  public newRequestConfigType = NewRequestConfigType;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.public[24],
  ];
  public auditTrailPayload: AppNavigationTracking = {
    auditTrail: {
      eventType: AuditTrackingEvent.AnalyteDataTable,
      action: AuditTrackingAction.Add,
      actionStatus: AuditTrackingActionStatus.Success,
      priorValue: {},
      currentValue: {}
    }
  };

  public translationLabels: any = {
    peergroup: this.getTranslations('ENTRYSAVE.PEERGROUP'),
    cancel: this.getTranslations('ENTRYSAVE.CANCEL'),
    change: this.getTranslations('DATETIMEPICKER.CHANGE'),
    date: this.getTranslations('DATETIMEPICKER.DATE')
  };

  constructor(
    private config: ConfigService,
    private runsService: RunsService,
    private codeListService: CodelistApiService,
    private labDataApiService: LabDataApiService,
    private appLoggerService: AppLoggerService,
    private messageSnackBar: MessageSnackBarService,
    private changeTrackerService: ChangeTrackerService,
    private dataManagementSpinnerService: DataManagementSpinnerService,
    private dateTimeHelper: DateTimeHelper,
    private dataManagementService: DataManagementService,
    private store: ngrxStore.Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private zone: NgZone,
    private iconService: IconService,
    public dialog: MatDialog,
    private brPermissionsService: BrPermissionsService,
    private _appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    // TOFIX The whole component after sucessfull post is initilized multiple times again.
    // That's why lastRunReagentLotId is send back to parent component then reading it again
    // and not making multiple api calls to get last save regent id
    try {
      this.isPastResultInsertAllowed = false;
      this.populateLabels();
      this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation))
        .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
          this.timeZone = labLocation.locationTimeZone;
        });

      this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
        .pipe(filter(authState => !!authState.currentUser), takeUntil(this.destroy$))
        .subscribe((authState: AuthState) => {
          if (authState.currentUser) {
            this.currentUser = authState.currentUser;
          }
        });

      if (this.state) {
        this.restoreState(this.state);
      }

      // Initialize selectDateTime prior to onValueChange
      this.setupDateTime();
      this.onValueChange();
      this.setupChangeTracker();
      this.setupLots();
      this.setupRunDataForm();
      this.setupLotDropdown();


      this.getAccountState$
        .pipe(filter(account => !!account), take(1))
        .subscribe(accounts => {
          this.accountNumber = accounts.accountNumber;
        });

      this.updateProductMasterLotStatus(this.productMasterLotExpiration, new Date());

    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
          componentInfo.RunInsertComponent + blankSpace + Operations.OnInit));
    }
  }

  private setupLots(): void {
    this.isDefaultLot = true;
    if (this.lastRunReagentLotId) {
      this.defaultReagentLotId = this.lastRunReagentLotId;
    }
    if (this.lastRunCalibratorLotId) {
      this.defaultCalibratorLotId = this.lastRunCalibratorLotId;
    }
    this.defaultReagentLot = this.reagentLots?.find(
      r => r.id === this.defaultReagentLotId
    );
    this.defaultCalibratorLot = this.calibratorLots?.find(
      c => c.id === this.defaultCalibratorLotId
    );
    this.selectedReagentLot = this.defaultReagentLot;
    this.selectedCalibratorLot = this.defaultCalibratorLot;
    this.activeReagentLots = <Array<ReagentLot>>(
      this.filterExpiredLots(this.reagentLots, this.selectedReagentLot)
    );
    this.activeCalibratorLots = <Array<CalibratorLot>>(
      this.filterExpiredLots(this.calibratorLots, this.selectedCalibratorLot)
    );
  }

  private setupDateTime(): void {
    this.appLocale = this.config.getConfig('appLocale');
    this.selectedDateTime = this.selectedDateTime
      ? this.selectedDateTime
      : new Date();
    this.currentDateTime = this.selectedDateTime;
    const tomorrow = new Date();

    if (this.isPastResultInsertAllowed) {
      this.availableDateFrom = dataManagement.earliestDate;
    } else if (this.latestRunData) {
      this.availableDateFrom = this.latestRunData.runDateTime;
    } else {
      this.availableDateFrom = dataManagement.earliestDate;
    }
    this.availableDateTo = new Date(tomorrow.setDate(tomorrow.getDate() + 1));
  }

  private setupLotDropdown(): void {
    if (this.selectedReagentLot && this.selectedCalibratorLot) {
      this.runDataInsertForm.patchValue({
        reagentLotSelect: this.selectedReagentLot,
        calibratorLotSelect: this.selectedCalibratorLot
      });
    }
  }

  private setupRunDataForm(): void {
    this.date = new FormControl(this.selectedDateTime, [
      this.isSelectedDateTimeEqualOrOver24HoursFromNow.bind(this),
      this.isSelectedDateTimeBeforePreviousRun.bind(this)
    ]);
    this.reagentLotSelect = new FormControl();
    this.calibratorLotSelect = new FormControl();

    this.runDataInsertForm = new FormGroup({
      date: this.date,
      reagentLotSelect: this.reagentLotSelect,
      calibratorLotSelect: this.calibratorLotSelect,
      comments: this.commentsFormControl,
      correctiveActions: this.correctiveActionsFormControl
    });

    this.runDataInsertForm.patchValue({
      comments: this.runsService.getCachedComment()
    });

    this.setupFormSubscription();
  }

  private setupFormSubscription(): void {
    this.dateSubscription$ = this.runDataInsertForm
      .get('date')
      .valueChanges.subscribe(dt => {
        this.onDateSelected(dt);
      });
    this.dateErrorSubscription$ = this.runDataInsertForm
      .get('date')
      .statusChanges.subscribe(dte => {
        this.dateErrorHandling();
      });
  }

  private dateErrorHandling(): boolean {
    const getDate = this.runDataInsertForm.get('date');
    if (
      getDate.errors &&
      getDate.errors['DateTimeCannotBeAfter24hFromNow']
    ) {
      this.dateTimeErrorMessage = this.getTranslations('RUNINSERT.DATETIME');
      return true;
    } else if (
      getDate.errors &&
      getDate.errors['DateTimeCannotBeBeforePreviousRun'] &&
      !this.isPastResultInsertAllowed
    ) {
      this.dateTimeErrorMessage = this.getTranslations('RUNINSERT.PREVIOUSRUN');
      return true;
    } else {
      this.dateTimeErrorMessage = null;
      return false;
    }
  }

  public onDateSelected(selectedDate: Date): void {
    this.selectedDateTime = new Date(selectedDate);
    // Bug fix for 131792, for ordering, if inserting a past run
    if (this.isPastResultInsertAllowed) {
      // Sets milliseconds to 999, so that it will show as latest entered for that minute.
      this.selectedDateTime = new Date(this.selectedDateTime.setSeconds(59, 999));
    }

    this.activeReagentLots = <Array<ReagentLot>>(
      this.filterExpiredLots(this.reagentLots, this.selectedReagentLot)
    );
    this.activeCalibratorLots = <Array<CalibratorLot>>(
      this.filterExpiredLots(this.calibratorLots, this.selectedCalibratorLot)
    );
    this.setDefaultLotsByDateTime(this.selectedDateTime);
    this.updateProductMasterLotStatus(this.productMasterLotExpiration, this.selectedDateTime);

    this.updateSubmitButtonState();
  }

  public toggleDisplayChangeLot(): void {
    this.isLotVisible = !this.isLotVisible;
    this.lotVisibility.emit(this.isLotVisible);
  }

  public toggleDisplayChangeDate(): void {
    this.isPastResultInsertAllowed = !this.isPastResultInsertAllowed;
    this.onInsertDifferentDate.emit();

    if (this.isPastResultInsertAllowed) {
      this.availableDateFrom = dataManagement.earliestDate;
      this.runDataInsertForm.get('date').setErrors(null);
    } else {
      if (this.latestRunData) {
        this.availableDateFrom = this.latestRunData.runDateTime;
      }
    }
  }

  public onReagentChanged(selectedReagent: ReagentLot): void {
    this.selectedReagentLot = selectedReagent;
    this.updateSubmitButtonState();
  }

  public onCalibratorChanged(selectedCalibrator: CalibratorLot): void {
    this.selectedCalibratorLot = selectedCalibrator;
    this.updateSubmitButtonState();
  }

  private filterExpiredLots(lots: Array<Lot>, selectedLot: Lot): Array<Lot> {
    return this.runsService.filterExpiredLotsForSpecificDate(
      lots,
      selectedLot,
      this.selectedDateTime
    );
  }

  public isLotExpired(lot: Lot): boolean {
    this.expiredWarning = this.getTranslations('RUNINSERT.EXPIRED');

    const expDate = new Date(lot?.shelfExpirationDate);
    return this.runsService?.isLotExpiredForSpecificDate(
      expDate,
      this.selectedDateTime
    );
  }

  private normalizeValues() {
    this.levelValues?.forEach(levelValue => {
      if (levelValue.value !== undefined) {
        levelValue.value = Utility.normalizeToRationalNumber(levelValue.value);
      }
    });
  }

  private areAllValuesEmpty(): boolean {
    let isAllValuesEmpty = true;
    this.levelValues?.forEach(levelValue => {
      if (!this.isValueEmpty(levelValue.value)) {
        isAllValuesEmpty = false;
      }
    });
    return isAllValuesEmpty;
  }

  private isValueEmpty(value: number): boolean {
    return value === undefined || value === null || String(value) === '';
  }

  public isSelectedDateTimeEqualOrOver24HoursFromNow(
    control: FormControl
  ): { [s: string]: boolean } {
    if (control.value >= this.availableDateTo) {
      return { DateTimeCannotBeAfter24hFromNow: true };
    }
    return null;
  }

  public isSelectedDateTimeBeforePreviousRun(
    control: FormControl
  ): { [s: string]: boolean } {
    if (
      control.value < this.availableDateFrom &&
      !this.isPastResultInsertAllowed
    ) {
      return { DateTimeCannotBeBeforePreviousRun: true };
    }
    return null;
  }

  private isLotsExpired(): boolean {
    return (
      this.isLotExpired(this.selectedReagentLot) &&
      this.isLotExpired(this.selectedCalibratorLot)
    );
  }

  private isFormValid(): boolean {
    if (this.areAllValuesEmpty() || this.runDataInsertForm.invalid || this.isLotsExpired()) {
      return false;
    }

    return true;
  }

  public setAction(selectedActionId: number): void {
    this.userActions = [];
    const selectedActionIndex = this.correctiveActions.findIndex(item => item.actionId === selectedActionId);
    const action = new Action();
    action.userId = this.currentUser.userOktaId;
    action.userFullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
    action.enterDateTime = new Date();
    action.actionId = this.correctiveActions[selectedActionIndex].actionId;
    action.actionName = this.correctiveActions[selectedActionIndex].actionName;
    this.userActions.push(action);
  }

  public enableCancelButton() {
    return this.isLotVisible || !this.isSubmitDisabled
      || this.currentDateTime.toISOString() !== this.selectedDateTime.toISOString() || this.isPastResultInsertAllowed;
  }

  public async insertRun() {

    if (this.dateErrorHandling()) {
      return;
    }

    if (!this.isFormValid()) {
      return;
    }

    // this.dataManagementSpinnerService.displaySpinner(true);

    // Disable submit button to prevent submit spamming
    this.isSubmitDisabled = true;
    if (this.selectedActionId) {
      this.setAction(this.selectedActionId);
    }
    this.onSavedSelectedReagentId.emit(this.selectedReagentLot.id);
    this.onSavedSelectedCalibratorId.emit(this.selectedCalibratorLot.id);
    await this.setupRunDataModelAsync();
    this.postRun();
    this.reset(true);
    this.runsService.setCachedComment('');
  }

  // Add function call
  logAuditTrail(): AppNavigationTracking {
    const currentValue = [];
    const priorValue = [];
    const levelData: AnalyteLevelData[] = [];
    const runsDate = moment(this.newRun?.runDateTime);
    let currentSummary: AuditTrailPriorCurrentValues = {};
    this.currentPointsResults.forEach((element, index) => {
      const currentValueObj: AnalyteLevelData = {
        'resultValue': element.resultValue,
        'level': element.controlLevel,
      };
      levelData[index] = currentValueObj;
    });
    this.currentPointsResults = [];
    currentSummary = {
      'isComment': this.newRun?.userComments[0]?.content ? true : false,
      'isAction': this.newRun?.userActions && this.newRun?.userActions?.length ? true : false,
      'isReagentLot': this.selectedReagentLot != null ? true : false,
      'reagentLotID': this.selectedReagentLot.id,
      'reagentLotName': this.selectedReagentLot.lotNumber,
      'isCalibratorLot': this.selectedCalibratorLot != null ? true : false,
      'calibratorLotID': this.selectedCalibratorLot.id,
      'calibratorLotName': this.selectedCalibratorLot.lotNumber,
      'levelData': levelData,
      'runDate': runsDate.tz(this.timeZone).format('MMM DD, YYYY'),
      'runStringTime': runsDate.tz(this.timeZone).format('hh:mm A'),
    };
    if (this.newRun?.userComments && this.newRun?.userComments[0]?.content) {
      currentSummary.comment = this.newRun?.userComments[0].content;
    }
    if (this.newRun?.userActions && this.newRun?.userActions[0]?.actionName) {
      currentSummary.action = this.newRun?.userActions[0]?.actionName;
    }
    currentValue.push(currentSummary);
    const auditNavigationPayload: AppNavigationTracking =
      this._appNavigationService.comparePriorAndCurrentValues
        (currentValue[0], priorValue[0], AuditTrackingAction.Add, AuditTrackingEvent.AnalyteDataTable, AuditTrackingActionStatus.Success);
    auditNavigationPayload.auditTrail.device_id = this.newRun?.labTestId;
    auditNavigationPayload.auditTrail.run_id = this.newRun?.id;
    auditNavigationPayload.auditTrail.runDateTime = runsDate.toDate();
    return this._appNavigationService.prepareAuditTrailPayload(auditNavigationPayload);
  }

  private async setupRunDataModelAsync() {

    const labTest = await this.runsService.updateTestSpecId(this.selectedReagentLot, this.selectedCalibratorLot,
      this.testId, this.labTestId, this.selectedDateTime, this.currentDateTime);
      this.store.dispatch(NavBarActions.setSelectedLeaf({ selectedLeaf: labTest }));

    this.newRun = new RunData();
    this.newRun.testSpecId = +labTest.testSpecId;
    this.newRun.labTestId = this.labTestId;
    this.newRun.labInstrumentId = this.labInstrumentId;
    this.newRun.labProductId = this.labProductId;
    this.newRun.testId = this.codeListTestId;
    this.newRun.labId = this.labId;
    this.newRun.accountId = this.accountId;
    this.newRun.accountNumber = this.accountNumber;
    this.newRun.labUnitId = this.labUnitId;
    // this.newRun.flags = new Array<RawDataFlags>();
    this.newRun.dataType = RawDataType.RunData;
    this.newRun.userComments = new Array<UserComment>();
    this.newRun.userActions = this.userActions;

    const runDateTime = new Date(this.selectedDateTime);
    this.newRun.runDateTime = runDateTime;
    this.newRun.localRunDateTime = runDateTime;
    this.newRun.enteredDateTime = new Date();
    this.newRun.labLocationTimeZone = this.timeZone;
    this.newRun.results = new Array<PointDataResult>();

    for (let i = 0; i < this.levelValues.length; i++) {
      if (this.levelValues[i].value) {
        const pointDataResult = new PointDataResult();
        pointDataResult.resultValue = +this.levelValues[i].value;
        pointDataResult.controlLotId = this.controlLotIds[i];
        pointDataResult.controlLevel = this.levelValues[i].level;
        pointDataResult.lastModified = runDateTime;
        pointDataResult.measuredDateTime = runDateTime;
        pointDataResult.isAccepted = true;
        this.currentPointsResults.push(pointDataResult);
        this.newRun.results.push(pointDataResult);
      }
    }
    this.newRun.upsertOptions = {
      forceRuleEngineReEval: true,
      isInsertOperation: false
    };
    if (
      this.latestRunData &&
      this.latestRunData.runDateTime.getTime() > runDateTime.getTime()
    ) {
      this.newRun.upsertOptions.isInsertOperation = true;
    }
  }

  private async updateTestSpecInfo(testSpecInfo: TestSpecInfo, testSpecId: number) {
    if (!testSpecInfo.testSpecId) {
      testSpecInfo.testSpecId = testSpecId;
    }
    const product: LabProduct =
      await this.dataManagementService.getPortalProductByLabInstrumentProductLotIdAsync(this.productId.toString());
    if (product) {
      if (!testSpecInfo.productId) {
        testSpecInfo.productId = +product.productId;
      }
      if (!testSpecInfo.productMasterLotId) {
        testSpecInfo.productMasterLotId = product.lotInfo.id;
      }
    }
    if (!testSpecInfo.labUnitId) {
      testSpecInfo.labUnitId = this.labUnitId;
    }
    // Apply Reagent/Calibrator Lots
    testSpecInfo.reagentLotId = this.selectedReagentLot.id;
    testSpecInfo.calibratorId = this.selectedCalibratorLot.id;
  }

  private async setDefaultLotsByDateTime(selectedDateTime: Date) {
    if (this.latestRunData == null) {
      return;
    }

    if (
      this.latestRunData &&
      this.latestRunData.localRunDateTime.getTime() < selectedDateTime.getTime()
    ) {
      return;
    }

    const defaultTestSpecId = await this.getClosestRunTestSpecId(
      selectedDateTime
    );

    const testSpec = await this.codeListService.getTestSpecByIdAsync(
      defaultTestSpecId.toString()
    );

    if (!testSpec) {
      this.appLoggerService.log(
        'Test Specifications were not found for test spec id ' +
        defaultTestSpecId.toString()
      );
    }

    const reagentLot = this.activeReagentLots.find(
      rl => rl.id === testSpec.reagentLotId
    );
    const calibratorLot = this.activeCalibratorLots.find(
      cl => cl.id === testSpec.calibratorLotId
    );

    this.patchSelect(reagentLot, calibratorLot);
  }

  private async getClosestRunTestSpecId(
    selectedDateTime: Date
  ): Promise<number> {
    const labTestIds = [this.labTestId];

    const rawData = await this.labDataApiService.getRawDataWithSearchParamsAsync(
      labTestIds,
      selectedDateTime,
      RawDataType.RunData,
      true
    );
    if (!rawData) {
      this.appLoggerService.log(
        'Lab Data API service did not return data for lab test id ' +
        this.labTestId +
        ' and date ' +
        new Date(selectedDateTime)
      );
    }
    const selectedDate = new Date(selectedDateTime.toISOString());
    let runData = rawData.find(
      f => new Date(f.runDateTime.toString()) <= selectedDate
    );
    if (!runData) {
      runData = rawData.find(
        f => new Date(f.runDateTime.toString()) > selectedDate
      );
    }
    if (!runData) {
      this.appLoggerService.log('No closest run found for selected date');
    }

    return runData.testSpecId;
  }

  private patchSelect(reagentLot: Lot, calibratorLot: Lot) {
    this.runDataInsertForm.patchValue({
      reagentLotSelect: reagentLot,
      calibratorLotSelect: calibratorLot
    });
  }

  private async getTestSpecIdAsync(testInfo: TestInfo): Promise<string> {
    let testSpecId = await this.codeListService.getTestSpecIdAsync(
      testInfo.analyteId.toString(),
      testInfo.methodId.toString(),
      testInfo.instrumentId.toString(),
      this.selectedReagentLot.id.toString(),
      testInfo.storageUnitId.toString(),
      this.selectedCalibratorLot.id.toString()
    );

    if (testSpecId.toString() === '-1') {
      const testSpec: TestSpec = new TestSpec();

      testSpec.analyteId = testInfo.analyteId;
      testSpec.methodId = testInfo.methodId;
      testSpec.instrumentId = testInfo.instrumentId;
      testSpec.reagentLotId = this.selectedReagentLot.id;
      testSpec.storageUnitId = testInfo.storageUnitId;
      testSpec.calibratorLotId = this.selectedCalibratorLot.id;

      const newTestSpec = await this.codeListService.postTestSpecAsync(testSpec);
      testSpecId = newTestSpec.id.toString();
    }

    return testSpecId;
  }

  private async postRun(): Promise<void> {
    if (this.selectedActionId) {
      this.setAction(this.selectedActionId);
    }

    if (this.comment && this.comment.length > 0) {
      const userComment = new UserComment;
      userComment.userId = this.currentUser.userOktaId;
      userComment.userFullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
      userComment.enterDateTime = this.newRun.enteredDateTime;
      userComment.content = this.comment;
      this.newRun.userComments.push(userComment);
    }

    // TODO: Convert Labid to UUID if needed, remove this when ready
    if (!this.newRun.labId.includes('-')) {
      this.newRun.labId = this.newRun.labId.substring(0, 8) + '-' +
        this.newRun.labId.substring(8, 12) + '-' +
        this.newRun.labId.substring(12, 16) + '-' +
        this.newRun.labId.substring(16, 20) + '-' +
        this.newRun.labId.substring(20, 33);
      this.newRun.labId = this.newRun.labId.toLocaleLowerCase();
    }
    const auditDetails = this.logAuditTrail();
    this.newRun.auditDetails = auditDetails;

    this.zone.run(() => {
      this.runsService
        .postNewRunData(this.newRun)
        .then((insertedRun: RunData) => {
          this.dataManagementSpinnerService.displaySpinner(false);
          this.reset();
        }, error => {
          auditDetails.auditTrail.actionStatus = AuditTrackingActionStatus.Failure;
          this._appNavigationService.logAuditTracking(auditDetails, true);
        })
        .catch(() => {
          this.dataManagementSpinnerService.displaySpinner(false);
          this.messageSnackBar.showMessageSnackBar(
            this.getTranslations('RUNINSERT.RESULTNOTINSERTED')
          );
        });
    });
  }

  public cancel(): void {
    this.reset(true);
  }

  public reset(resetLotsToDefault: boolean = false): void {
    this.commentsFormControl.reset();
    this.comment = '';
    this.correctiveActionsFormControl.reset();
    this.userActions = [];
    this.selectedDateTime = new Date();
    this.runDataInsertForm.patchValue({
      date: new Date(),
      reagentLotSelect: this.defaultReagentLot,
      calibratorLotSelect: this.defaultCalibratorLot
    });

    this.isPastResultInsertAllowed = false;
    this.dateTimeErrorMessage = null;
    this.isLotVisible = false;
    this.lotVisibility.emit(this.isLotVisible);
    this.levelValues?.forEach(levelValue => {
      levelValue.value = undefined;
    });
    if (resetLotsToDefault) {
      this.selectedReagentLot = this.defaultReagentLot;
      this.selectedCalibratorLot = this.defaultCalibratorLot;
    }

    this.isSubmitDisabled = true;

    this.setupDateTime();
    this.setupLotDropdown();
    this.setupLots();

    this.changeTrackerService.resetDirty();
    this.runsService.setCachedComment('');
  }

  public onValueChange() {
    this.updateSubmitButtonState();
  }

  public setTimeInputValid(value: boolean) {
    this.isTimeInputValid = value;
    this.updateSubmitButtonState();
  }

  private updateSubmitButtonState(): void {
    let disableSubmitButton = false;
    this.normalizeValues();
    if (this.areAllValuesEmpty()) {
      disableSubmitButton = true;
      this.changeTrackerService.resetDirty();
    }

    if (this.isLotExpired(this.selectedReagentLot) || this.isLotExpired(this.selectedCalibratorLot)) {
      disableSubmitButton = true;
    }

    if (!this.isTimeInputValid) {
      disableSubmitButton = true;
    }

    this.isSubmitDisabled = disableSubmitButton;

    if (!this.isSubmitDisabled) {
      this.changeTrackerService.setDirty();
    }
  }

  private restoreState(runInsertState: RunInsertState): void {
    this.levelValues = runInsertState.levelValues;
    this.selectedDateTime = runInsertState.selectedDateTime;
    this.selectedReagentLot = runInsertState.selectedReagentLot;
    this.selectedCalibratorLot = runInsertState.selectedCalibratorLot;
    this.isPastResultInsertAllowed = runInsertState.isPastResultInsertAllowed;
    this.isLotVisible = runInsertState.isLotVisible;
  }

  private backupState(): void {
    this.state.levelValues = this.levelValues;
    this.state.selectedDateTime = this.selectedDateTime;
    this.state.selectedReagentLot = this.selectedReagentLot;
    this.state.selectedCalibratorLot = this.selectedCalibratorLot;
    this.state.isPastResultInsertAllowed = this.isPastResultInsertAllowed;
    this.state.isLotVisible = this.isLotVisible;
  }

  private updateProductMasterLotStatus(productMasterLotExpiration: Date, selectedDate: Date) {
    this.isProductMasterLotExpired = this.dateTimeHelper.isExpiredOnSpecificDate(productMasterLotExpiration, selectedDate);
  }

  private setupChangeTracker(): void {
    const me = this;
    this.changeTrackerService.setOkAction(async function () {
      if (me.isFormValid()) {
        me.insertRun();
        me.changeTrackerService.dialog.closeAll();
        me.changeTrackerService.canDeactivateSubject.next(true);
        me.changeTrackerService.resetDirty();
      } else {
        me.changeTrackerService.setDirty();
        me.changeTrackerService.dialog.closeAll();
        me.changeTrackerService.canDeactivateSubject.next(false);
      }
    });
  }

  populateLabels() {
    this.submitDataToolTip = this.getTranslations('RUNINSERT.SUBMITDATA');
  }

  public mouseEnter(input: boolean): void {
    this.mouseIsEnter = input;
    if (!this.inputHasFocus) {
      this.showOptions = input;
    }
  }

  public focus(input: boolean): void {
    this.inputHasFocus = input;
    if (!this.mouseIsEnter) {
      this.showOptions = input;
    }
  }

  public onCommentChanged(): void {
    this.runsService.setCachedComment(this.commentsFormControl.value);
    this.comment = this.commentsFormControl.value;
    this.onChange(this.comment);
    this.onTouched();
  }

  requestNewConfiguration(type: NewRequestConfigType) {
    let templateId, name;
    switch (type) {
      case this.newRequestConfigType.CalibratorLot:
        templateId = TemplateType.CalibratorLot;
        name = this.getTranslations('RUNINSERT.CALIBRATOR');
        break;
      case this.newRequestConfigType.ReagentLot:
        templateId = TemplateType.ReagentLot;
        name = this.getTranslations('RUNINSERT.REAGENT');
        break;
      default:
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, '', Operations.defaultCaseRequestNewConfig,
            (componentInfo.RunInsertComponent + blankSpace + Operations.defaultCaseRequestNewConfig)));
        break;
    }
    this.dialog.open(RequestNewConfigComponent, {
      width: '450px',
      data: {
        templateId: templateId,
        name: name
      }
    });
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
    unsubscribe(this.dateSubscription$);
    unsubscribe(this.dateErrorSubscription$);
    this.backupState();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
