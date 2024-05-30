// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ElementRef, OnInit, OnDestroy, Renderer2, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as ngrxStore from '@ngrx/store';
import { Observable, Subscription, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { unsubscribe } from '../../core/helpers/rxjs-helper';
import { select } from '@ngrx/store';
import {
  AnalyteEntry, AnalyteView, GlobalLabels, LabMonthLevel,
  TranslationLabels, BrDialogComponent, DialogResult, getTimeZoneAdjustedDateTime
} from 'br-component-library';

import { cloneDeep } from 'lodash';
import * as moment from 'moment';

import { BaseRawDataModel, UpsertRequestOptions } from '../../contracts/models/data-management/base-raw-data.model';
import {
  AnalyteSection,
  PanelSection,
  ProductSection,
} from '../../contracts/models/data-management/page-section/instrument-section.model';
import { dataManagement } from '../../core/config/constants/data-management.const';
import { MessageSnackBarService } from '../../core/helpers/message-snack-bar/message-snack-bar.service';
import { UnityNotification } from '../../core/notification/interfaces/unity-notification';
import { NotificationService } from '../../core/notification/services/notification.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { LabDataApiService } from '../api/labDataApi.service';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { ChangeTrackerService } from '../guards/change-tracker/change-tracker.service';
import { AppLoggerService } from '../services/applogger/applogger.service';
import { RunsService } from '../services/runs.service';
import { DataManagementSpinnerService } from '../services/data-management-spinner.service';
import { PageSectionService } from './page-section.service';
import * as stateSelector from '../state/selectors';
import * as navigationStateSelector from '../navigation/state/selectors';
import * as fromRoot from '../../state/app.state';
import { LabLocation, TreePill } from '../../contracts/models/lab-setup';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../models/audit-tracking.model';
import { AppNavigationTrackingService } from '../services/appNavigationTracking/app-navigation-tracking.service';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { Utility } from '../../core/helpers/utility';
@Component({
  template: ''
})
export abstract class PageSectionBase implements OnInit, OnDestroy {
  public formControlNames: Array<string> = [];
  public sortedAnalyteSections: Array<AnalyteSection>;
  public displayAnalyteSections: Array<AnalyteSection>;
  public filteredSortedAnalyteSections: Array<AnalyteSection>;
  public analyteViewSets: Array<AnalyteView> = new Array<AnalyteView>();
  public analyteEntrySets: Array<AnalyteEntry>;
  public analyteForm: FormGroup;
  public sortedProductSections: Array<ProductSection>;
  public sortedPanelSections: Array<PanelSection>;
  public monthSummaryByLevel: Array<LabMonthLevel>;
  public isLastDataEntryVisible: boolean;
  public commentArray: Array<string>;
  postDataBatchMergedPayload: Array<BaseRawDataModel>;
  private dialogRef: MatDialogRef<BrDialogComponent, any> = null;

  protected inputBaseIdentifier = 'analyte-entry-';
  protected labId: string;
  protected accountNumber: string;
  protected accountId: string;
  protected isTabOrderRunEntry: boolean;

  protected defaultDateTime: Date = new Date();
  protected selectedDateTime: Date = new Date();
  protected availableDateFrom: Date = dataManagement.earliestDate;
  protected availableDateTo: Date = new Date();
  protected timeZone: string;
  protected dateTimeOffset: string;

  protected translationLabelDictionary: TranslationLabels = new TranslationLabels();
  protected globalLabels: GlobalLabels;

  public columnsToDisplay: string[] = [];
  public cumulativeLevelsInUse: number[];
  public pageTitleEntityName: string;
  public instrumentId: string;
  public controlId: string;
  public panelId: string;
  public pageTitleProductLot: string;
  public isCustomSortMode: boolean;
  public isValuePresent: boolean;
  public isDateChanged: boolean;
  public isFormVisible: boolean;
  public baseRawDataSet: Array<BaseRawDataModel> = [];
  protected inputElements: Array<ElementRef>;

  protected labLocation$: Observable<LabLocation>;
  protected formChangesSubscription: Subscription;
  protected notificationSubscription: Subscription;
  protected destroy$ = new Subject<boolean>();
  private controlDataTableValues: AnalyteEntry[];
  public nodeList: TreePill[] = [];
  public eventTypeName: string;
  public nodeValue: number;
  constructor(
    protected pageSectionService: PageSectionService,
    protected codeListService: CodelistApiService,
    protected dataManagementSpinnerService: DataManagementSpinnerService,
    protected labDataService: LabDataApiService,
    protected messageSnackBar: MessageSnackBarService,
    protected runsService: RunsService,
    protected notification: NotificationService,
    protected dateTimeHelper: DateTimeHelper,
    protected changeTrackerService: ChangeTrackerService,
    protected appLoggerService: AppLoggerService,
    protected translateService: TranslateService,
    protected elem: ElementRef,
    protected renderer: Renderer2,
    protected store: ngrxStore.Store<fromRoot.State>,
    protected dialog: MatDialog,
    public appNavigationService: AppNavigationTrackingService,
  ) {
    this.globalLabels = this.pageSectionService.getGlobalLabels();
    this.translationLabelDictionary = this.pageSectionService.populateTranslationLabelDictionary(this.translationLabelDictionary);

    const today = new Date();
    this.defaultDateTime = new Date(today.getFullYear(), today.getMonth(), 0);
    this.selectedDateTime = this.defaultDateTime;
  }
  public currentBranch$ = this.store.pipe(select(state => {
    if (state && state.navigation) {
      return state.navigation.currentBranch;
    }
  }));

  ngOnInit() {
    this.labLocation$ = this.store.pipe(ngrxStore.select(stateSelector.getCurrentLabLocation));

    this.labLocation$
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        this.timeZone = labLocation.locationTimeZone;
      });
  }

  ngOnDestroy() {
    this.changeTrackerService.customWidth = null;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  unsubscribeToNotificationSubscription(): void {
    unsubscribe(this.notificationSubscription);
  }

  createForm(
    sortedAnalyteSections: Array<AnalyteSection>,
    analyteEntrySets: Array<AnalyteEntry>
  ): FormGroup {
    this.formControlNames = [];
    const formData = {};
    for (let i = 0, len = sortedAnalyteSections.length; i < len; i++) {
      const identifier =
        this.inputBaseIdentifier +
        sortedAnalyteSections[i].analyteInfo.labTestId;
      const analyteEntrySet = analyteEntrySets.find(
        entrySet => entrySet.analyteIndex === i
      );
      formData[identifier] = new FormControl(analyteEntrySet, []);
      this.formControlNames.push(identifier);
    }

    return new FormGroup(formData);
  }

  public async getLotsAsync(labTestId: string): Promise<void> {
    const test = await this.pageSectionService.getTestInfoAsync(
      labTestId,
      this.sortedAnalyteSections
    );

    const reagentLots = await this.codeListService.getReagentLotsByReagentIdAsync(
      test.reagentId.toString()
    );

    const calibratorLots = await this.codeListService.getCalibratorLotsByCalibratorIdAsync(
      test.calibratorId.toString()
    );

    const key = this.inputBaseIdentifier + labTestId;

    const analyteEntry = this.pageSectionService.getAnalyteEntryByFormControlName(
      this.analyteForm,
      key
    );

    analyteEntry.changeLotData.reagentLots = reagentLots;
    analyteEntry.changeLotData.calibratorLots = calibratorLots;

    this.pageSectionService.setAnalyteEntryByFormControlName(
      this.analyteForm,
      key,
      analyteEntry
    );
  }

  getFormControlName(labTestId: string): string {
    return this.inputBaseIdentifier + labTestId;
  }

  subscribeToNotification(analyteSections: Array<AnalyteSection>): void {
    analyteSections.forEach(analyteSection => {
      this.notification.subscribeLabTestToHubWithoutUnsubscribePrevious(analyteSection.analyteInfo.labTestId);
    });

    this.notificationSubscription = this.notification.$labTestStream.subscribe(
      (data: UnityNotification) => {
        if (data) {
          this.getAndUpdateAnalyteViewByLabTestId(data.correlationId);
        }
      }
    );
  }

  updateChangeTracker(): void {
    const me = this;
    me.formChangesSubscription = me.analyteForm.valueChanges.subscribe(
      () => {
        if (me.analyteForm.dirty) {
          me.changeTrackerService.setDirty();
          me.changeTrackerService.customWidth = 425;
          me.changeTrackerService.setOkAction(async function () {
            if (me.analyteForm.valid) {
              await me.submitAsync().then(() => {
                // TODO: Fix the forms visibility condition and ensure change tracker works as expected
                // me.isDataEntryFormsVisible = false;
              });
              me.changeTrackerService.dialog.closeAll();
              me.changeTrackerService.canDeactivateSubject.next(true);
              me.changeTrackerService.resetDirty();
            } else {
              me.changeTrackerService.setDirty();
              me.changeTrackerService.dialog.closeAll();
              me.changeTrackerService.canDeactivateSubject.next(false);
            }
          });
        } else {
          me.changeTrackerService.resetDirty();
        }
      }
    );
  }

  public getAndUpdateAnalyteViewByLabTestId(labTestId: string): void {
    if (this.sortedAnalyteSections.filter(as => as.analyteInfo.isSummary && as.analyteInfo.labTestId === labTestId).length !== 0) {
      this.labDataService
        .getLatestSummaryDataByLabTestIdAsync(labTestId)
        .then(response => {
          this.updateAnalyteView(response[0]);
        });
    }
    if (this.sortedAnalyteSections.filter(as => !as.analyteInfo.isSummary && as.analyteInfo.labTestId === labTestId).length !== 0) {
      this.labDataService.getRunDataByLabTestIdsAsync([labTestId]).then(responsed => {
        this.updateAnalyteView(responsed[0]);
      });
    }
  }

  /**
     * This methoed returns node value for nodetype relations
     * @returns nodetype value
     */
  public getHierarchyTree(): number {
    let nodeType: number;
    const hierarchyData = {};
    this.currentBranch$.pipe(takeUntil(this.destroy$)).subscribe(element => {
      this.nodeList = element;
    });
    this.nodeList.map((value) => {
      if (value.nodeType === EntityType.LabInstrument) {
        hierarchyData['instrumentId'] = value.id;
        hierarchyData['instrumentName'] = value.displayName;
      } else if (value.nodeType === EntityType.LabProduct) {
        hierarchyData['controlId'] = value.id;
        hierarchyData['controlName'] = value.displayName;
      }
      nodeType = value.nodeType;
    });
    return nodeType;
  }

  /**
   * This function sets current values for audit trail and call audit trail api
   * @param analyte Contains analyte values
   */
  public setCurrentValueForAuditTrailAPI(analytes?: any) {
    analytes.forEach((controlTableData) => {
      const analyteFormVal = this.controlDataTableValues.
        filter(val => val.labTestId === controlTableData.labTestId);
      const runsDate = moment(controlTableData['runDateTime'] ? controlTableData['runDateTime'] :
        this.selectedDateTime);
      // create AT payload
      this.nodeValue = this.getHierarchyTree();
      if (this.nodeValue === EntityType.LabInstrument) {
        this.eventTypeName = AuditTrackingEvent.InstrumentDataTable;
      } else {
        this.eventTypeName = AuditTrackingAction.ControlDataTable;
      }
      const auditTrailPayload: any = {
        auditTrail: {
          eventType: this.eventTypeName,
          action: AuditTrackingAction.Add,
          actionStatus: AuditTrackingActionStatus.Success,
          priorValue: {},
          currentValue: {},
        }
      };

      auditTrailPayload.auditTrail = {
        ...auditTrailPayload.auditTrail,
        device_id: controlTableData['labTestId'],
        run_id: controlTableData['id'],
        runDateTime: controlTableData['runDateTime'] ? controlTableData['runDateTime'] : runsDate
      };

      if (analyteFormVal[0]['isSummary']) {
        const summaryAnalyteValues = controlTableData.results.map((summaryAnalyteLevelData) => {
          return {
            level: summaryAnalyteLevelData['controlLevel'],
            mean: summaryAnalyteLevelData['mean'],
            numPoints: summaryAnalyteLevelData['nPts'],
            sd: summaryAnalyteLevelData['sd']
          };
        });
        if (summaryAnalyteValues && summaryAnalyteValues.length) {
          auditTrailPayload.auditTrail.currentValue.levelData = summaryAnalyteValues;
        }
      } else if (!analyteFormVal[0]['isSummary']) {
        const runAnalyteValues = controlTableData.results.map((runAnalyteLevelData) => {
          return {
            controlLevel: runAnalyteLevelData['controlLevel'],
            resultValue: runAnalyteLevelData['resultValue']
          };
        });
        if (runAnalyteValues && runAnalyteValues.length) {
          auditTrailPayload.auditTrail.currentValue.levelData = runAnalyteValues;
        }
      }

      auditTrailPayload.auditTrail.currentValue = {
        ...auditTrailPayload.auditTrail.currentValue,
        isAction: controlTableData.userActions ? true : false,
        action: controlTableData.userActions ? controlTableData.userActions[0].actionName : '',
        isComment: controlTableData.userComments ? true : false,
        comment: controlTableData.userComments ? controlTableData.userComments[0]['content'] : '',
        isReagentLot: analyteFormVal[0].changeLotData.reagentLots ? true : false,
        reagentLot: analyteFormVal[0].changeLotData.selectedReagentLot.lotNumber ?
          analyteFormVal[0].changeLotData.selectedReagentLot.lotNumber : '',
        reagentId: analyteFormVal[0].changeLotData.selectedReagentLot.reagentId ?
          analyteFormVal[0].changeLotData.selectedReagentLot.reagentId : '',
        isCalibratorLot: analyteFormVal[0].changeLotData.calibratorLots ? true : false,
        calibratorId: analyteFormVal[0].changeLotData.selectedCalibratorLot.calibratorId ?
          analyteFormVal[0].changeLotData.selectedCalibratorLot.calibratorId : '',
        calibratorLot: analyteFormVal[0].changeLotData.selectedCalibratorLot.lotNumber ?
          analyteFormVal[0].changeLotData.selectedCalibratorLot.lotNumber : '',
        runDate: runsDate.tz(this.timeZone).format('MMM DD, YYYY'),
        runStringTime: !analyteFormVal[0]['isSummary'] ? runsDate.tz(this.timeZone).format('hh:mm A') : null,
      };
      const auditDetails = this.appNavigationService.prepareAuditTrailPayload(auditTrailPayload);
      this.postDataBatchMergedPayload.find(val => val.labTestId === controlTableData.labTestId)['auditDetails'] = auditDetails;
    });
  }

  public async submitAsync(): Promise<void> {
    this.dataManagementSpinnerService.displaySpinner(true);
    const validAnalyteEntries = this.pageSectionService.extractValidAnalyteEntries(
      this.analyteForm,
      this.formControlNames
    );
    this.controlDataTableValues = cloneDeep(validAnalyteEntries);

    if (!validAnalyteEntries) {
      return; // No valid entries
    }

    const enteredDateTime = new Date();
    // Performs each BaseRawDataSet creation in async parallel
    const promises = validAnalyteEntries.map(validEntry =>


      this.pageSectionService.createPostBaseRawDataSet(
        validEntry,
        this.sortedAnalyteSections,
        this.labId,
        this.accountId,
        this.accountNumber,
        this.selectedDateTime,
        enteredDateTime,
        this.timeZone
      )
    );

    // Waits until all async parallel creation process completes
    const postBaseRawDataSets = await Promise.all(promises);
    postBaseRawDataSets[0]?.results.forEach(levelData => {
      levelData.mean = Utility.normalizeToRationalNumber(levelData.mean);
      levelData.sd = Utility.normalizeToRationalNumber(levelData.sd);
      levelData.nPts = Utility.normalizeToRationalNumber( levelData.nPts);
    });

    // 20200225 Compatibility fix, convert mean to a number.
    // This fix is applied here, to maintain Validation logic at the base component level
    for (let i = 0; i < postBaseRawDataSets.length; i++) {
      for (let j = 0; j < postBaseRawDataSets[i].results.length; j++) {
        postBaseRawDataSets[i].results[j].mean = +postBaseRawDataSets[i].results[j].mean;
        postBaseRawDataSets[i].results[j].sd = +postBaseRawDataSets[i].results[j].sd;
        postBaseRawDataSets[i].results[j].nPts = +postBaseRawDataSets[i].results[j].nPts;
        postBaseRawDataSets[i].results[j].isAccepted = true;

        const previousRunInserted = this.getAnalyteView(postBaseRawDataSets[i].labTestId);

        const timeZoneAdjustedSelectedDateTime = getTimeZoneAdjustedDateTime(this.selectedDateTime, this.dateTimeOffset);

        // SR 09242020: Check if data for Date/time prior to previous entered run is inserted
        if (previousRunInserted && timeZoneAdjustedSelectedDateTime.getTime() < previousRunInserted.analyteDateTime.getTime()) {

          // Display dialog only if old point data is entered
          if (postBaseRawDataSets[i].dataType === 0) {
            postBaseRawDataSets[i].upsertOptions = new UpsertRequestOptions();
            postBaseRawDataSets[i].upsertOptions.isInsertOperation = true;
            postBaseRawDataSets[i].upsertOptions.forceRuleEngineReEval = true;
          }
        } else {
          postBaseRawDataSets[i].upsertOptions = new UpsertRequestOptions();
          postBaseRawDataSets[i].upsertOptions.isInsertOperation = false;
          postBaseRawDataSets[i].upsertOptions.forceRuleEngineReEval = true;
        }
      }
    }
    this.postDataBatchMergedPayload = cloneDeep(postBaseRawDataSets);
    this.setCurrentValueForAuditTrailAPI(postBaseRawDataSets);
    await this.labDataService.postDataBatchAsync(this.postDataBatchMergedPayload).catch(
      // Error Dialog for Failed Submission
      error => {
        this.postDataBatchMergedPayload.map((payload) => {
          const auditTrailPayload = payload.auditDetails;
          auditTrailPayload.auditTrail.actionStatus = AuditTrackingActionStatus.Failure;
          this.appNavigationService.logAuditTracking(payload.auditDetails, true);
        });
        this.errorSubmissionDialog();
      }

    );

    const lotUpdatePromises = postBaseRawDataSets.map(async baseRawData => {
      const analyteEntry = validAnalyteEntries.find(
        ae => ae.labTestId === baseRawData.labTestId
      );
      const analyteInfo = this.sortedAnalyteSections.find(
        as => as.analyteInfo.labTestId === baseRawData.labTestId
      ).analyteInfo;

      this.pageSectionService.updateTestSpecId(
        analyteEntry,
        analyteInfo.testId
      );
    });

    await Promise.all(lotUpdatePromises);

    this.pageSectionService.updateDefaultLots(validAnalyteEntries);

    this.resetForm();

    this.appLoggerService.log('Result Insert Success');

    this.dataManagementSpinnerService.displaySpinner(false);
  }

  updateAnalyteView(baseRawData: BaseRawDataModel): void {
    if (baseRawData) {
      this.baseRawDataSet.push(baseRawData);
      const targetItemIndex = this.analyteViewSets.findIndex(
        x => x.labTestId === baseRawData.labTestId
      );
      const analyteSection = this.sortedAnalyteSections.find(
        as => as.analyteInfo.labTestId === baseRawData.labTestId
      );
      if (analyteSection) {
        const analyteView = this.pageSectionService.createAnalyteViewFromBaseRawData(
          analyteSection,
          baseRawData,
          this.cumulativeLevelsInUse,
          this.timeZone,
          false
        );
        if (targetItemIndex === -1) {
          this.analyteViewSets.push(analyteView);
        } else {
          this.analyteViewSets[targetItemIndex] = analyteView;
        }
      }
    }

  }

  getAnalyteView(labTestId: string): AnalyteView {
    let currentAnalyteView: AnalyteView = null;
    if (this.analyteViewSets != null && this.analyteViewSets.length > 0) {
      currentAnalyteView = this.analyteViewSets.find(
        x => x.labTestId === labTestId
      );
    }
    return currentAnalyteView;
  }

  cancel(): void {
    this.resetForm();
    // pbi217077 new Date() replaced this.defaultDateTime (which was the last day of the previous month)
    this.selectedDateTime = this.getDateWithLaterTime(new Date(), this.availableDateFrom);
  }

  resetForm() {
    this.formControlNames.forEach(formControlName => {
      if (this.analyteForm.controls[formControlName].dirty) {
        this.analyteForm.controls[formControlName].reset();
      }
    });
    this.isDateChanged = false;
    this.isFormVisible = false;
  }

  public keytab(event): void {
    event.preventDefault();
    if (
      event.srcElement.attributes.tabIndex &&
      event.srcElement.attributes.tabIndex.value > 0
    ) {
      this.inputElements = this.elem.nativeElement.querySelectorAll('input');
      this.findNextTabIndex(event.srcElement.attributes.tabIndex.value);
    }
  }

  private findNextTabIndex(currentIndex: number): void {
    let nextElement: ElementRef;
    this.inputElements.forEach(element => {
      if (element['tabIndex'] && element['tabIndex'] > currentIndex && !element['disabled']) {
        if (nextElement && nextElement['tabIndex'] > element['tabIndex']) {
          nextElement = element;
        }
        if (!nextElement) {
          nextElement = element;
        }
      }
    });

    if (nextElement) {
      setTimeout(() => {
        const nextInput = document.querySelector('[tabindex="' + nextElement['tabIndex'] + '"]');
        // @ts-ignore:
        nextInput.focus();
        // @ts-ignore:
        nextInput.select();
      }, 0);
    }
  }

  protected startSpinner(): void {
    this.dataManagementSpinnerService.displaySpinner(true);
  }

  protected stopSpinner(): void {
    this.dataManagementSpinnerService.displaySpinner(false);
  }

  protected updateSelectedDateTime(selectedDateTime: Date): void {
    if (this.selectedDateTime.toISOString() !== selectedDateTime.toISOString()) {
      this.isDateChanged = true;
    }
    this.selectedDateTime = selectedDateTime;
  }

  public isLotVisible(value) {
    this.isFormVisible = value;
  }

  public canSubmit(): boolean {
    // SR 08272020: checking for analyte's with valid input value
    const tempArray = [];
    this.isValuePresent = this.isDateChanged || false;
    Object.keys(this.analyteForm.controls).forEach(control => {
      const value = this.analyteForm.controls[control];
      if (!value.pristine || this.isFormVisible) {
        this.isValuePresent = true;
      }
      if (!value.pristine) {
        tempArray.push(value.value.labTestId);
      }
    });
    this.commentArray = tempArray;
    return this.analyteForm.valid && !this.analyteForm.pristine;
  }

  protected getDateWithLaterTime(selectedDateTime: Date, availableDateFrom: Date): Date {
    return new Date(selectedDateTime).getTime() < new Date(availableDateFrom).getTime() ? availableDateFrom : selectedDateTime;
  }

  protected hasProductMasterLotExpired(productMasterLotExpiration: Date, selectedDateTime): boolean {
    return this.dateTimeHelper.isExpiredOnSpecificDate(productMasterLotExpiration, selectedDateTime);
  }

  public checkCustomSortModeEnabled(): void {
    this.store.pipe(ngrxStore.select(navigationStateSelector.getCustomSortModeState))
      .pipe(takeUntil(this.destroy$))
      .subscribe((isCustomSortMode: boolean) => {
        this.isCustomSortMode = isCustomSortMode;
      });
  }

  protected errorSubmissionDialog() {
    if (this.dialogRef != null) {
      return;
    }
    const translatedTitle = this.getTranslate('TRANSLATION.DATASUBMISSION');
    const translatedCancelButton = this.getTranslate('TRANSLATION.CLOSE');

    this.dialogRef = this.dialog.open(BrDialogComponent, {
      data: {
        title: translatedTitle,
        cancelButton: translatedCancelButton
      }
    });

    const buttonClick = this.dialogRef.componentInstance.buttonClicked.subscribe(
      async dialogResult => {
        // Action if Close is clicked
        if (dialogResult === DialogResult.Cancel) {
          this.dialogRef.close();
        }
      },
      error => { }
    );

    this.dialogRef.afterClosed().subscribe(() => {
      buttonClick.unsubscribe();
      this.dialogRef = undefined;
    });
  }

  private getTranslate(codeToTranslate: string): string {
    let translatedContent:string;
    this.translateService.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
