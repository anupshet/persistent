// © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved.

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { hasValue, CustomRegex } from 'br-component-library';
import { chunk, cloneDeep, map as lmap, unionBy, orderBy } from 'lodash';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { TimeframeEnum } from '../../../../contracts/enums/lab-setup/timeframe.enum';
import { LabProduct, LabTest } from '../../../../contracts/models/lab-setup';
import { AnalyteEvaluationMeanSd, DecimalPlacesById, EntityIdWithLevel } from '../../../../contracts/models/lab-setup/analyte-evaluation-mean-sd.model';
import { LevelEvaluationMeanSd, LevelEvaluationMeanSdFormState, LevelFloatingStatistics } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { RunSettings } from '../../../../contracts/models/lab-setup/run-settings.model';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { asc, minimumNumberPoints } from '../../../../core/config/constants/general.const';
import { icons } from '../../../../core/config/constants/icon.const';
import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
import { IconService } from '../../../../shared/icons/icons.service';
import { SideBarItem } from '../../../../shared/navigation/models/side-bar-item.model';
import { NavSideBarService } from '../../../../shared/navigation/services/nav-side-bar.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking, AuditTrailPriorCurrentValues } from '../../../../../app/shared/models/audit-tracking.model';


@Component({
  selector: 'unext-evaluation-mean-sd',
  templateUrl: './evaluation-mean-sd.component.html',
  styleUrls: ['./evaluation-mean-sd.component.scss']
})
export class EvaluationMeanSdComponent implements OnInit, OnDestroy {

  @Input() entity: LabProduct | LabTest;
  @Input() analyteForNamingList: Array<LabTest>;
  @Input() showControlLotInfo: boolean;

  disableUpdateBtn = false;

  _analyteList: Array<LabTest>;
  get analyteList(): Array<LabTest> {
    return this._analyteList;
  }
  @Input('analyteList')
  set analyteList(value: Array<LabTest>) {
    this._analyteList = value;
  }

  _analyteEvaluationMeanSdGroup: Array<AnalyteEvaluationMeanSd>;
  get analyteEvaluationMeanSdGroup(): Array<AnalyteEvaluationMeanSd> {
    return this._analyteEvaluationMeanSdGroup;
  }
  @Input('analyteEvaluationMeanSdGroup')
  set analyteEvaluationMeanSdGroup(value: Array<AnalyteEvaluationMeanSd>) {
    try {
      if (this.analyteList) {
        this.analyteList.forEach(e => {
          const index = this.decimalPlacesArray.findIndex(item => item.entityId === e.id);
          if (index === -1) {
            this.decimalPlacesArray.push({
              entityId: e.id,
              decimalPlaces: (e.levelSettings && e.levelSettings.levels) ? e.levelSettings.levels[0].decimalPlace : 0
            });
          }
        });
      }
      if (this.bufferDisplayAnalyteTitleList && this.bufferDisplayAnalyteTitleList.length > 0) {
        value = this.returnSortedValues(value);
        this.decimalPlacesArray = this.returnSortedValues(this.decimalPlacesArray);
        this.isArraySorted = true;
      }
      if (!this.dummyAnalyteEvaluationMeanSdGroup && value && this.isArraySorted) {
        this.dummyAnalyteEvaluationMeanSdGroup = value;
      }
      this._analyteEvaluationMeanSdGroup = value;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.SetAnalyteEvaluationMeanSdGroup)));
    }
  }

  _analyteFloatingStatisticsGroup: Array<LevelFloatingStatistics>;
  get analyteFloatingStatisticsGroup(): Array<LevelFloatingStatistics> {
    return this._analyteFloatingStatisticsGroup;
  }
  @Input('analyteFloatingStatisticsGroup')
  set analyteFloatingStatisticsGroup(value: Array<LevelFloatingStatistics>) {
    try {
      this._analyteFloatingStatisticsGroup = value;
      this.analyteFloatingStatisticsData = cloneDeep(value);
      if (this.analyteFloatingStatisticsData) {
        let tempData = this.analyteFloatingStatisticsData.map((e) => {
          return {
            entityId: e.entityId,
            levelsData: this.analyteFloatingStatisticsData.filter(x => x.entityId === e.entityId)
          };
        });
        tempData = unionBy(tempData, 'entityId');
        if (this.bufferDisplayAnalyteTitleList && this.bufferDisplayAnalyteTitleList.length > 0) {
          this.floatingstatsData = this.returnSortedValues(tempData);
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.SetAnalyteFloatingStatisticsGroup)));
    }
  }
  @Input() runSettings: RunSettings;
  @Output() requestedAnalyteIds = new EventEmitter<Array<string>>();
  @Output() requestFloatingSatistics = new EventEmitter<{
    requestedFloatingStatsAnalyteIds: Array<string>,
    requestedFloatingStatsTimeframe: TimeframeEnum
  }>();
  @Output() entityEvaluationMeanSdGroup = new EventEmitter<Array<AnalyteEvaluationMeanSd>>();
  @Output() entityFloatingPoint = new EventEmitter<number>();
  @Output() requestedPageNumber = new EventEmitter<number>();
  requestedFloatingStatsTimeframe: TimeframeEnum;
  requestedFloatingStatsAnalyteIds: Array<string>;
  protected formChangesSubscription: Subscription;
  evaluationForm: FormGroup;
  analyteFloatingStatisticsData: Array<LevelFloatingStatistics>;
  private timeframeEnum = TimeframeEnum;
  timeframeOptions = [];
  levelEvaluationFormState: Array<LevelEvaluationMeanSdFormState> = [];
  levelEvaluationMeanSdData: Array<LevelEvaluationMeanSd> = [];
  isChildFormValid = false;
  isChildFormChanged = true;
  entityType = EntityType;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.info[24],
    icons.close[48]
  ];
  public displayAnalyteTitleList: Array<SideBarItem>;
  public displayTitleMain: SideBarItem;
  displayWarning = false;
  private destroy$ = new Subject<boolean>();
  date = new Date(); // To Do: Date set not in this release according to Zeplin
  time = this.date.getTime(); // To Do: Date set not in this release according to Zeplin
  floatingStatisticsFlag = false;
  displayPaginationFlag = false;
  selectedPage = 0;
  analyteIdsChunkList: any;
  displayAnalyteTitleListChunk: any;
  public dummyAnalyteEvaluationMeanSdGroup: Array<AnalyteEvaluationMeanSd>;
  public floatingstatsData;
  public bufferDisplayAnalyteTitleList: Array<SideBarItem>;
  public decimalPlacesArray: Array<DecimalPlacesById> = [];
  itemsPerPage = 5;
  public isArraySorted = false;
  permissions = Permissions;
  levelEvaluationMeanSdProirData: Array<LevelEvaluationMeanSd> = [];
  public auditTrailPayload: AppNavigationTracking;
  timeframeOptionsKeyVal: Array<string> = [];
  constructor(
    private formBuilder: FormBuilder,
    private iconService: IconService,
    private navSideBarService: NavSideBarService,
    private _appNavigationService: AppNavigationTrackingService,
    private matDialogService: MatDialogRef<any>,
    private changeTrackerService: ChangeTrackerService,
    private brPermissionsService: BrPermissionsService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit() {
    this._appNavigationService.minimumNumberOfPoints = null;
    try {
      (this.entity.nodeType === EntityType.LabProduct && this.entity.children.length > this.itemsPerPage ?
        (this.displayPaginationFlag = true) : (this.displayPaginationFlag = false));

      this.populateLabels();
      this.createForm();
      this.setupChangeTracker();
      if (this.analyteList) {
        let analyteIds = [];
        let displayAnalyteTitleList = (this.analyteForNamingList) ?
          this.navSideBarService.getSideBarItems(this.analyteForNamingList) : [];
        let archivedItems = displayAnalyteTitleList.filter((item: SideBarItem) => item.node.isArchived);
        archivedItems = orderBy(archivedItems, [(node: SideBarItem) => node.primaryText.replace(/\s/g, '').toLocaleLowerCase(),
        (node: SideBarItem) => node.additionalText.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc]);
        displayAnalyteTitleList = displayAnalyteTitleList.filter((item: SideBarItem) => !item.node.isArchived);
        for (const archivedItem of archivedItems) {
          displayAnalyteTitleList.push(archivedItem);
        }
        if (this.entity.nodeType === EntityType.LabTest) {
          this.displayAnalyteTitleList = displayAnalyteTitleList.filter(x => x.node.id === this.entity.id);
          this.bufferDisplayAnalyteTitleList = cloneDeep(this.displayAnalyteTitleList);
          this.displayTitleMain = this.getTitleToDisplay(displayAnalyteTitleList, this.entity.id);
          analyteIds = this.getAnalytesIdsArray();
          this.requestedAnalyteIds.emit(analyteIds);
        } else {
          this.bufferDisplayAnalyteTitleList = cloneDeep(displayAnalyteTitleList);
          const controlDisplayList = this.navSideBarService.getSideBarItems([this.entity]);
          this.displayTitleMain = this.getTitleToDisplay(controlDisplayList, this.entity.id);

          const analyteIdsList = displayAnalyteTitleList.map((element) => element.node.id);
          this.analyteIdsChunkList = chunk(analyteIdsList, this.itemsPerPage);

          this.displayAnalyteTitleListChunk = chunk(displayAnalyteTitleList, this.itemsPerPage);
          this.displayAnalyteTitleList = this.displayAnalyteTitleListChunk[this.selectedPage];
          this.requestedAnalyteIds.emit(this.analyteIdsChunkList[this.selectedPage]);
        }
      }
      this._appNavigationService.minimumNumberOfPoints =
      (this.runSettings && this.runSettings.minimumNumberOfPoints) ?
        this.runSettings.minimumNumberOfPoints : minimumNumberPoints;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.OnInit)));
    }
  }

  getTitleToDisplay(list: Array<SideBarItem>, itemId: string) {
    const currentSelected = list.filter(x => x.node.id === itemId);
    return currentSelected[0];
  }

  getAnalytesIdsArray() {
    if (this.entity.nodeType === EntityType.LabTest) {
      return [this.entity.id];
    } else {
      return lmap(this.entity.children, 'id');
    }
  }

  checkChildFormValid(levelItem) {
    try {
      if (this.levelEvaluationFormState.length !== 0) {
        const index = this.levelEvaluationFormState.
          findIndex(item => item.entityId === levelItem.entityId && item.level === levelItem.level);
        if (index === -1) {
          this.levelEvaluationFormState.push(levelItem);
        } else {
          this.levelEvaluationFormState[index] = levelItem;
        }
      } else {
        this.levelEvaluationFormState.push(levelItem);
      }
      this.isChildFormValid = this.levelEvaluationFormState.some(element => !element.isFormValid);
      this.isChildFormChanged = this.levelEvaluationFormState.some(element => element.isFormChanged);
      if (this.isChildFormChanged && !this.evaluationForm.dirty) {
        this.evaluationForm.markAsDirty();
      }
      if (!this.isChildFormChanged) {
        this.evaluationForm.markAsPristine();
      }
      this.evaluationForm.get('childFormData').setValue(this.isChildFormChanged);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.CheckChildFormValid)));
    }
  }

  populateLabels() {
    this.timeframeOptions = Object.keys(this.timeframeEnum).filter(x => !(parseInt(x, 10) >= 0));
    for (const key in this.timeframeOptions) {
      if (this.timeframeOptions.hasOwnProperty(key)) {
        const match = this.timeframeOptions[key].match(/(\d+)/);
        if (this.getTranslation('EVALUATIONMEANSD.LAST') && this.getTranslation('EVALUATIONMEANSD.DAYS')) {
          this.timeframeOptions[key] = match && match[0] ? this.getTranslation('EVALUATIONMEANSD.LAST').trim() + ' ' + match[0] + ' ' +
          this.getTranslation('EVALUATIONMEANSD.DAYS') : this.timeframeOptions[key];
          this.timeframeOptionsKeyVal.push(this.timeframeOptions[key]);
        }
      }
    }
  }

  toggleFloatingStatistcs(event) {
    try {
      if (!event.checked) {
        this.disableUpdateBtn = true;
      } else {
        this.disableUpdateBtn = false;
      }
      this.floatingStatisticsFlag = this.evaluationForm.get('floatingStatistcsFlag').value;
      if (this.evaluationForm.get('floatingStatistcsFlag').value) {
        this.onFloatTypeChange(this.evaluationForm.get('timeFrame').value);
      } else {
        this.evaluationForm.get('timeFrame').setValue(TimeframeEnum.Cumulative);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.ToggleFloatingStatistics)));
    }
  }

  onFloatTypeChange(selectedOption: TimeframeEnum) {
    this.requestedFloatingStatsTimeframe = selectedOption;
    this.requestFloatingSatistics.emit({
      requestedFloatingStatsAnalyteIds: (this.analyteIdsChunkList) ?
        this.analyteIdsChunkList[this.selectedPage] : this.getAnalytesIdsArray(),
      requestedFloatingStatsTimeframe: this.requestedFloatingStatsTimeframe
    });
  }

  createForm() {
    this.evaluationForm = this.formBuilder.group({
      floatingStatistcsFlag: [false, [Validators.required]],
      timeFrame: [1, [Validators.required]],
      floatPoint: [(this.runSettings && this.runSettings.minimumNumberOfPoints) ?
        this.runSettings.minimumNumberOfPoints : minimumNumberPoints,
      [Validators.pattern(CustomRegex.BETWEEN_TWO_TO_NINETY_NINE), Validators.required]],
      childFormData: null
    });
  }

  levelEvaluationMeanSdGroupFromChild(levelItem) {
    try {
      if (this.levelEvaluationMeanSdData.length !== 0) {
        const index = this.levelEvaluationMeanSdData
          .findIndex(item => item.entityId === levelItem.entityId && item.level === levelItem.level);
        if (index === -1) {
          this.levelEvaluationMeanSdData.push(levelItem);
        } else {
          this.levelEvaluationMeanSdData[index] = levelItem;
        }
      } else {
        this.levelEvaluationMeanSdData.push(levelItem);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.LevelEvaluationMeanSdGroupFromChild)));
    }
  }

  onSubmit(form?, exitFlag?) {
    try {
      if (this.entity.nodeType === EntityType.LabProduct) {
        const evalMeanSds = [...new Set(this.levelEvaluationMeanSdData?.map(({entityId}) => entityId))]
          .map(entityId => ({ entityId, levelEvaluationMeanSds: [], parentEntityId: this.entity.id }));
        this.levelEvaluationMeanSdData?.forEach(levelEvalMeanSd =>
          evalMeanSds.filter(evalMeanSd => evalMeanSd.entityId === levelEvalMeanSd.entityId).forEach(evalMeanSd =>
              evalMeanSd.levelEvaluationMeanSds.push(levelEvalMeanSd)));
        this.analyteEvaluationMeanSdGroup?.forEach((analyteEvalMeanSd) =>
          evalMeanSds.filter(evalMeanSd => analyteEvalMeanSd.entityId === evalMeanSd.entityId).forEach(evalMeanSd => {
            evalMeanSd['isPost'] = analyteEvalMeanSd.isPost;
            evalMeanSd['parentMasterLotId'] = Number(analyteEvalMeanSd.parentMasterLotId);
            analyteEvalMeanSd.levelEvaluationMeanSds.forEach(analyteLevelEvalMeanSd =>
              evalMeanSd.levelEvaluationMeanSds.filter(levelEvalMeanSd =>
                levelEvalMeanSd.entityId === analyteLevelEvalMeanSd.entityId &&
                levelEvalMeanSd.level === analyteLevelEvalMeanSd.level)
              .forEach(levelEvalMeanSd => levelEvalMeanSd.isNew = analyteLevelEvalMeanSd.isNew)
            );
        }));
        this.entityEvaluationMeanSdGroup.emit(evalMeanSds);
        this.prepareAuditTrailProirCurrentValues();
        this.levelEvaluationMeanSdData = [];
      } else {
        const evalMeanSd: AnalyteEvaluationMeanSd = {
          entityId: this.entity.id, parentEntityId: this.entity.parentNodeId, levelEvaluationMeanSds: this.levelEvaluationMeanSdData
        };
        this.analyteEvaluationMeanSdGroup?.filter(analyteEvalMeanSd => analyteEvalMeanSd.entityId === evalMeanSd.entityId)
        .forEach(analyteEvalMeanSd => {
          evalMeanSd.isPost = analyteEvalMeanSd.isPost;
          evalMeanSd.parentMasterLotId = Number(analyteEvalMeanSd.parentMasterLotId);
          analyteEvalMeanSd.levelEvaluationMeanSds.forEach((analyteLevelEvalMeanSd) =>
            evalMeanSd.levelEvaluationMeanSds.filter(levelEvalMeanSd =>
              levelEvalMeanSd.entityId === analyteLevelEvalMeanSd.entityId &&
              levelEvalMeanSd.level === analyteLevelEvalMeanSd.level)
            .forEach(levelEvalMeanSd => levelEvalMeanSd.isNew = analyteLevelEvalMeanSd.isNew)
          );
        });
        this.entityEvaluationMeanSdGroup.emit([evalMeanSd]);
        this.prepareAuditTrailProirCurrentValues();
      }
      this.entityFloatingPoint.emit(form.floatPoint);
      if (!this.displayPaginationFlag || exitFlag === true) {
        this.matDialogService.close();
      }
      if (this.displayPaginationFlag) {
        this.goToNext();
      }
      this.changeTrackerService.resetDirty();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  resetTrackerService() {
    try {
      this.changeTrackerService.resetDirty();
      this.matDialogService.close();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.ResetTrackerService)));
    }
  }

  cancel() {
    (this.changeTrackerService.unSavedChanges ? (this.displayWarning = true) : this.matDialogService.close());
  }
  goToNext() {
    this.selectedPage = this.selectedPage + 1;
    this.requestedAnalyteIds.emit(this.analyteIdsChunkList[this.selectedPage]);
    if (this.evaluationForm.get('floatingStatistcsFlag').value) {
      this.onFloatTypeChange(this.evaluationForm.get('timeFrame').value);
    }
    const analyteList = this.analyteIdsChunkList.length - 1;
    if (this.analyteIdsChunkList[this.selectedPage].length < this.itemsPerPage || analyteList === this.selectedPage) {
      this.displayPaginationFlag = false;
    }
    this.displayAnalyteTitleList = this.displayAnalyteTitleListChunk[this.selectedPage];
    this.dummyAnalyteEvaluationMeanSdGroup = null;
    this.isArraySorted = false;
    this.evaluationForm.markAsPristine();
    this.changeTrackerService.resetDirty();
  }

  back() {
    try {
      this.dummyAnalyteEvaluationMeanSdGroup = null;
      this.isArraySorted = false;
      this.selectedPage = this.selectedPage - 1;
      this.requestedAnalyteIds.emit(this.analyteIdsChunkList[this.selectedPage]);
      if (this.evaluationForm.get('floatingStatistcsFlag').value) {
        this.onFloatTypeChange(this.evaluationForm.get('timeFrame').value);
      }
      this.displayAnalyteTitleList = this.displayAnalyteTitleListChunk[this.selectedPage];
      if (this.analyteIdsChunkList[this.selectedPage].length === this.itemsPerPage) {
        this.displayPaginationFlag = true;
      }
      this.evaluationForm.markAsPristine();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.Back)));
    }
  }

  setupChangeTracker(): void {
    const me = this;
    me.changeTrackerService.getDialogRef(async function () {
      me.matDialogService.close();
    });
    me.formChangesSubscription = me.evaluationForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        if (me.evaluationForm.dirty) {
          me.changeTrackerService.setDirty();
          me.changeTrackerService.setCustomPrompt(async function () {
            me.displayWarning = true;
          });
        } else {
          me.changeTrackerService.resetDirty();
        }
      }
    );
  }

  matchEntityIds(item) {
    if (this.analyteFloatingStatisticsGroup) {
      return this.analyteFloatingStatisticsGroup.find(element => item.id === element.entityId);
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getFloatValues(valuesForObject: EntityIdWithLevel) {
    try {
      const isValuesPresent = hasValue(this.analyteFloatingStatisticsGroup) ? this.analyteFloatingStatisticsGroup
        .some(element => valuesForObject.entityId === element.entityId && valuesForObject.level === element.level) : false;
      if (!isValuesPresent) {
        const request = {
          requestedFloatingStatsAnalyteIds: (this.analyteIdsChunkList) ? this.analyteIdsChunkList[this.selectedPage] : this.getAnalytesIdsArray(),
          requestedFloatingStatsTimeframe: TimeframeEnum.Cumulative
        };
        this.requestFloatingSatistics.emit(request);
      } else {
        this.analyteFloatingStatisticsGroup = cloneDeep(this.analyteFloatingStatisticsGroup);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.EvaluationMeanSdComponent + blankSpace + Operations.GetFloatValues)));
    }
  }

  returnSortedValues(array) {
    const sortOrder = this.bufferDisplayAnalyteTitleList.map(e => e.node.id);
    array.sort((a, b) => {
      return sortOrder.indexOf(a.entityId) - sortOrder.indexOf(b.entityId);
    });
    return array;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }


  /**
   * This method is used to prepare current and proir payload details for audit trail api
   */
  public prepareAuditTrailProirCurrentValues() {
    let floatTypeValue: string;
    let proirFloatTypeValue: string;
    this.timeframeOptionsKeyVal.forEach((floatTypeVal, index) => {
      if (this.evaluationForm.value.floatingStatistcsFlag) {
        if (index + 1 === this.evaluationForm.value.timeFrame) {
          floatTypeValue = floatTypeVal;
        } else if (index === 0) {
          proirFloatTypeValue = floatTypeVal;
        }
      }
    });
    const analyteEvalMeanSdArrayData = [];
    this.dummyAnalyteEvaluationMeanSdGroup.forEach((analyteItem, i) => {
      analyteEvalMeanSdArrayData.push(analyteItem.levelEvaluationMeanSds);
    });

    this.levelEvaluationMeanSdData.forEach((levelMeanSDNew, i) => {
      analyteEvalMeanSdArrayData.forEach((levelMeanSDOld, j) => {
        levelMeanSDOld.forEach((item, k) => {
          if ((item.entityId === levelMeanSDNew.entityId) && (item.level === levelMeanSDNew.level)) {
            if (item !== levelMeanSDNew.sd || item.mean !== levelMeanSDNew.mean) {
              this.levelEvaluationMeanSdProirData.push(item);
            }
          }
        });
      });
    });

    const currentValue: AuditTrailPriorCurrentValues = {
      floatingStatistcsFlag: this.evaluationForm.value.floatingStatistcsFlag,
      floatType: floatTypeValue,
    };

    const priorValue: AuditTrailPriorCurrentValues = {
      floatingStatistcsFlag: false,
      floatType: proirFloatTypeValue,
    };
    if (this.levelEvaluationMeanSdData.length === 0) {
      delete currentValue.levelEvalMeanSdData;
    }
    this._appNavigationService.evaluationFloatPointValues = { current: currentValue, prior: priorValue };
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

}
