// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';

import { Subject, of } from 'rxjs';
import { filter, flatMap, take, takeUntil, delay, tap } from 'rxjs/operators';
import { cloneDeep, orderBy, partition, chunk, map as lmap } from 'lodash';
import { hasValue } from 'br-component-library';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { LabProduct, LabTest, TreePill } from '../../../../contracts/models/lab-setup';
import { AnalyteEvaluationMeanSd } from '../../../../contracts/models/lab-setup/analyte-evaluation-mean-sd.model';
import { LevelFloatingStatistics } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { RunSettings } from '../../../../contracts/models/lab-setup/run-settings.model';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../state';
import * as actions from '../../state/actions';
import * as fromSelector from '../../state/selectors';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { asc, id, includeArchivedItems, productMasterLotId, sortOrder } from '../../../../core/config/constants/general.const';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { QueryParameter } from '../../../../shared/models/query-parameter';

@Component({
  selector: 'unext-evaluation-config-mean-sd',
  templateUrl: './evaluation-mean-sd-config.component.html',
  styleUrls: ['./evaluation-mean-sd-config.component.scss']
})
export class EvaluationMeanSdConfigComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public entity: LabProduct | LabTest = this.data.entity;
  public hasEvaluationMeanSd: boolean = this.data.hasEvaluationMeanSd;
  public settingsDataFromParentNode: Settings = this.data.settingsValues;
  public analyteList: Array<LabTest>;
  public analyteEvaluationMeanSdGroup: Array<AnalyteEvaluationMeanSd>;
  public analyteFloatingStatisticsGroup: Array<LevelFloatingStatistics>;
  public analyteForNamingList: Array<LabTest>;
  public productMasterLotId: string;
  currentSelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  currentSelectedLeaf$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf));
  evaluationMeanSdData$ = this.store.pipe(select(fromSelector.getEvaluationMeanSdData));
  analyteFloatingStatisticsData$ = this.store.pipe(select(fromSelector.getanalyteFloatingStatisticsData));
  currentSelectedBranch$ = this.store.pipe(select(fromNavigationSelector.getCurrentBranchState));
  labConfigSettings$ = this.store.pipe(select(fromSelector.getSettings));
  public getArchiveToggle$ = this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn));
  public runSettings: RunSettings;
  public settingsData: Settings;
  public parentEntityId: string;
  public analyteListData: any;
  public selectedPage = 0;
  public inputDataForAllAnalytes;
  public showControlLotInfo = false;
  public itemsPerPage = 5;
  constructor(
    private store: Store<fromRoot.LabSetupStates>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private errorLoggerService: ErrorLoggerService,
    private portalApiService: PortalApiService
  ) { }

  ngOnInit() {
    try {
      // TODO: Change the logic to get analyteList from navigationstate to display dropdownlist for analytes
      if (this.entity.nodeType === EntityType.LabTest) {
        this.analyteList = [<LabTest>this.entity];
      } else {
        if (this.entity.children.length > 0) {
          // this.analyteListData = chunk(orderBy(this.entity.children, ['displayName']), 2);
          // this.analyteList = this.analyteListData[this.selectedPage];
          this.analyteList = orderBy(this.entity.children, [sortOrder, (child: TreePill) => child.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc]);
          // this.analyteList = this.analyteListData[this.selectedPage];
        }
      }

      this.currentSelectedNode$
        .pipe(filter(currentSelectedNode => !!currentSelectedNode),
          take(1))
        .subscribe((currentSelectedNode: TreePill) => {
          if (currentSelectedNode.nodeType === EntityType.LabProduct && currentSelectedNode.hasOwnProperty(productMasterLotId)) {
            this.setControlRelatedData(currentSelectedNode);
          } else if (currentSelectedNode && currentSelectedNode.nodeType === EntityType.Panel) {
            this.getArchiveToggle$.pipe(take(1))
              .pipe(flatMap(isArchiveItemsToggleOn => {
                const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
                return this.portalApiService.getLabSetupNode(EntityType.LabProduct, this.entity.parentNodeId, LevelLoadRequest.LoadChildren,
                  EntityType.None, [queryParameter]);
              }))
              .pipe(filter(productData => !!productData), take(1))
              .subscribe((productDetails: LabProduct) => {
                if (productDetails.nodeType === EntityType.LabProduct && productDetails.hasOwnProperty(productMasterLotId)) {
                  this.setControlRelatedData(productDetails);
                }
              });
          }

        });
      this.labConfigSettings$
        .pipe(filter(settings => !!settings && !!settings.runSettings), take(1))
        .subscribe((settingsData: Settings) => {
          this.settingsData = settingsData;
          this.runSettings = settingsData.runSettings;
        });
      this.currentSelectedBranch$
        .pipe(filter(currentBranch => !!currentBranch), take(1))
        .subscribe((currentBranch: Array<TreePill>) => {
          currentBranch = currentBranch.filter(ele => ele.nodeType === EntityType.LabInstrument);
          if (currentBranch) {
            this.showControlLotInfo =
              (currentBranch[0] && currentBranch[0].children && currentBranch[0].children.length > 1) ? true : false;
          }
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.EvaluationMeanSdConfigComponent + blankSpace + Operations.OnInit)));
    }
  }

  setControlRelatedData(contolData) {
    this.analyteForNamingList = orderBy(contolData.children, [sortOrder, (child: TreePill) => child.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc]);
    this.parentEntityId = contolData.id;
    this.productMasterLotId = contolData.productMasterLotId;
    if (this.entity.nodeType === EntityType.LabProduct) {
      const analyteIds = chunk(lmap(this.analyteForNamingList, id), this.itemsPerPage);
      if (analyteIds[0].length > 0) {
        this.loadAnalyteEvaluationMeanSdData(analyteIds[0]);
      }
    } else {
      this.loadAnalyteEvaluationMeanSdData([this.entity.id]);
    }
  }

  loadAnalyteEvaluationMeanSdData(analyteIds: Array<string>) {
    this.store.dispatch(actions.EvaluationMeanSdConfigActions.getAnalyteEvaluationMeanSdList({ analyteIds }));
    this.getAnalyteEvaluationMeanSdList(analyteIds);
  }

  getAnalyteEvaluationMeanSdList(analyteIds: Array<string>) {
    this.evaluationMeanSdData$
      .pipe(filter(evaluationMeanSdData => !!evaluationMeanSdData),
        takeUntil(this.destroy$))
      .subscribe((evaluationMeanSdData) => {
        const requestedAnalytes = this.analyteForNamingList
          .filter((x) => analyteIds.indexOf(x.id) !== -1);
        let defaultAnalyteEvaluationMeanSdData;
        defaultAnalyteEvaluationMeanSdData = (this.entity.nodeType === EntityType.LabProduct) ?
          this.getDefaultAnalyteEvaluationMeanSdData(requestedAnalytes) :
          this.getDefaultAnalyteEvaluationMeanSdData([<LabTest>this.entity]);

        const evaluationMeansSdGroupDataFromState = orderBy(cloneDeep(evaluationMeanSdData), ['entityId']);
        defaultAnalyteEvaluationMeanSdData = orderBy(defaultAnalyteEvaluationMeanSdData, ['entityId']);
        if (evaluationMeansSdGroupDataFromState.length > 0) {
          defaultAnalyteEvaluationMeanSdData.map((el, i) => {
            const index = evaluationMeansSdGroupDataFromState.findIndex(x => x.entityId === el.entityId);
            if (index !== -1) {
              defaultAnalyteEvaluationMeanSdData[i].isPost = false;
              el.levelEvaluationMeanSds = orderBy(el.levelEvaluationMeanSds, ['level']);
              evaluationMeansSdGroupDataFromState[index].levelEvaluationMeanSds =
                orderBy(evaluationMeansSdGroupDataFromState[index].levelEvaluationMeanSds, ['level']);
              el.levelEvaluationMeanSds.map((elem, ind) => {
                const idx = evaluationMeansSdGroupDataFromState[index].levelEvaluationMeanSds.findIndex(y => y.level === elem.level);
                if (idx !== -1) {
                  evaluationMeansSdGroupDataFromState[index].levelEvaluationMeanSds[ind].isNew = false;
                  defaultAnalyteEvaluationMeanSdData[i].levelEvaluationMeanSds[ind] = {
                    ...defaultAnalyteEvaluationMeanSdData[i].levelEvaluationMeanSds[ind],
                    ...evaluationMeansSdGroupDataFromState[index].levelEvaluationMeanSds[idx]
                  };
                } else {
                  defaultAnalyteEvaluationMeanSdData[i].levelEvaluationMeanSds[ind].isNew = true;
                }
              });
            } else {
              defaultAnalyteEvaluationMeanSdData[i].isPost = true;
              el.levelEvaluationMeanSds.forEach((item, indexOfLevel) => {
                defaultAnalyteEvaluationMeanSdData[i].levelEvaluationMeanSds[indexOfLevel].isNew = true;
              });
            }
          }
          );
        } else {
          defaultAnalyteEvaluationMeanSdData.forEach((element, i) => {
            defaultAnalyteEvaluationMeanSdData[i].isPost = true;
            element.levelEvaluationMeanSds.forEach((item, indexOfLevel) => {
              defaultAnalyteEvaluationMeanSdData[i].levelEvaluationMeanSds[indexOfLevel].isNew = true;
            });
          });
        }
        this.analyteEvaluationMeanSdGroup = cloneDeep(defaultAnalyteEvaluationMeanSdData);
        this.analyteEvaluationMeanSdGroup = this.sortAnalyteEvaluationMeanSdGroup(this.analyteEvaluationMeanSdGroup, requestedAnalytes);
        this.inputDataForAllAnalytes = cloneDeep(defaultAnalyteEvaluationMeanSdData);
        this.inputDataForAllAnalytes = this.sortAnalyteEvaluationMeanSdGroup(this.inputDataForAllAnalytes, requestedAnalytes);
      });
  }

  sortAnalyteEvaluationMeanSdGroup(analyteEvaluationMeanSdGroup: Array<AnalyteEvaluationMeanSd>, requestedAnalytes: Array<LabTest>): Array<AnalyteEvaluationMeanSd> {
    requestedAnalytes = orderBy(requestedAnalytes, [sortOrder, (child: TreePill) => child.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc]);
    const sortedAnalyteEvaluationMeanSdGroup = [];
    for (const analyte of requestedAnalytes) {
      const index = analyteEvaluationMeanSdGroup.findIndex((analyteEvaluationMeanSd) => analyteEvaluationMeanSd.entityId === analyte.id);
      if (index > -1) {
        sortedAnalyteEvaluationMeanSdGroup.push(analyteEvaluationMeanSdGroup[index]);
      }
    }
    return sortedAnalyteEvaluationMeanSdGroup;
  }

  loadAnalyteFloatingStatisticsData(requestFloatingStatistics) {
    try {
      if (requestFloatingStatistics && requestFloatingStatistics.requestedFloatingStatsTimeframe &&
        requestFloatingStatistics.requestedFloatingStatsAnalyteIds) {
        this.store.dispatch(actions.EvaluationMeanSdConfigActions.getAnalyteFloatingStatisticsList({
          analyteIds: requestFloatingStatistics.requestedFloatingStatsAnalyteIds,
          timeFrame: requestFloatingStatistics.requestedFloatingStatsTimeframe
        }));
      }
      this.getAnalyteFloatingStatisticsListData(requestFloatingStatistics.requestedFloatingStatsAnalyteIds);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.EvaluationMeanSdConfigComponent + blankSpace + Operations.LoadAnalyteFloatingStatisticsData)));
    }
  }

  getAnalyteFloatingStatisticsListData(analyteIds: Array<String>) {
    this.analyteFloatingStatisticsData$
      .pipe(filter(evaluationMeanSdData => !!evaluationMeanSdData),
        takeUntil(this.destroy$))
      .subscribe((evaluationMeanSdData) => {
        let defaultLevelFloatingStatsData;
        const requestedAnalytes = this.analyteForNamingList
          .filter((x) => analyteIds.indexOf(x.id) !== -1);
        defaultLevelFloatingStatsData = (this.entity.nodeType === EntityType.LabProduct) ?
          this.getDefaultFloatingStatData(requestedAnalytes) :
          this.getDefaultFloatingStatData([<LabTest>this.entity]);
        const tempFloatingStatsGroup = orderBy(cloneDeep(evaluationMeanSdData), ['entityId']);
        defaultLevelFloatingStatsData = orderBy(cloneDeep(defaultLevelFloatingStatsData), ['entityId']);
        if (tempFloatingStatsGroup.length > 0) {
          defaultLevelFloatingStatsData.map((el, i) => {
            const index = tempFloatingStatsGroup.findIndex(x => x.entityId === el.entityId && x.level === el.level);
            if (index !== -1) {
              defaultLevelFloatingStatsData[i] = {
                ...defaultLevelFloatingStatsData[i],
                ...tempFloatingStatsGroup[index]
              };
            }
          });
        }
        this.analyteFloatingStatisticsGroup = cloneDeep(defaultLevelFloatingStatsData);
      });
  }

  submitEvaluationMeanSdGroupData($event) {

    try {
      const allPostReq = [];
      const allPutReq = [];
      $event.forEach(element => {
        const sortedLevelsData = partition(element.levelEvaluationMeanSds, (item) => {
          return item.isNew === true;
        });
        const clonePostElement = cloneDeep(element);
        if (sortedLevelsData.length > 0 && sortedLevelsData[0].length !== 0) {
          clonePostElement.levelEvaluationMeanSds = sortedLevelsData[0];
          allPostReq.push(clonePostElement);
        }
        const clonePutElement = cloneDeep(element);
        if (sortedLevelsData.length > 0 && sortedLevelsData[1].length !== 0) {
          clonePutElement.levelEvaluationMeanSds = sortedLevelsData[1];
          allPutReq.push(clonePutElement);
        }
      });

      const allPostData = (allPostReq.length > 0) ? this.doFloatForNoData(allPostReq) : [];
      allPostData.forEach(item => {
        delete item.isPost;
        item.levelEvaluationMeanSds.filter(element => delete element.isNew);
      });

      if (allPostData.length > 0) {
        this.store.dispatch(actions.EvaluationMeanSdConfigActions.saveAnalyteEvaluationMeanSdList({
          analyteEvaluationMeanSd: allPostData
        }));
      }
      allPutReq.forEach(item => {
        delete item.isPost;
        item.levelEvaluationMeanSds.forEach(element => delete element.isNew);
      });
      if (allPutReq.length > 0) {
        const obs = of(true).pipe(delay(1000), take(1),
          tap(() => {
            this.store.dispatch(actions.EvaluationMeanSdConfigActions.updateAnalyteEvaluationMeanSdList({
              analyteEvaluationMeanSd: allPutReq
            }));
          })
        );
        const sub = obs.subscribe(() => {
          sub.unsubscribe();
        })
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.EvaluationMeanSdConfigComponent + blankSpace + Operations.OnSubmit +
            blankSpace + Operations.EvaluationMeanSdGroupData)));
    }
  }

  doFloatForNoData(submitData: Array<AnalyteEvaluationMeanSd>) {
    const tempAllArray = orderBy(this.inputDataForAllAnalytes, ['entityId']);
    const tempSubmitDataArray = orderBy(submitData, ['entityId']);
    tempAllArray.map((el, i) => {
      const index = tempSubmitDataArray.findIndex(x => x.entityId === el.entityId);
      if (index !== -1) {
        el.levelEvaluationMeanSds = orderBy(el.levelEvaluationMeanSds, ['level']);
        tempSubmitDataArray[index].levelEvaluationMeanSds = orderBy(tempSubmitDataArray[index].levelEvaluationMeanSds, ['level']);
        el.levelEvaluationMeanSds.map((elem, ind) => {
          const idx = tempSubmitDataArray[index].levelEvaluationMeanSds.findIndex(y => y.level === elem.level);
          if (idx === -1) {
            // if leveldata not updated POST as FLOAT
            if (!hasValue(el.levelEvaluationMeanSds[ind].mean) &&
              !hasValue(el.levelEvaluationMeanSds[ind].sd) && !hasValue(el.levelEvaluationMeanSds[ind].cv)) {
              tempSubmitDataArray[index].levelEvaluationMeanSds.push({
                ...elem,
                ...{
                  meanEvaluationType: EvaluationType.Floating,
                  sdEvaluationType: EvaluationType.Floating,
                  cvEvaluationType: EvaluationType.Floating,
                  sdIsCalculated: false,
                  cvIsCalculated: false
                }
              });
            }
          }
        });
      }
    });
    tempSubmitDataArray.map(e => e.levelEvaluationMeanSds = orderBy(e.levelEvaluationMeanSds, ['level']));
    return tempSubmitDataArray;
  }

  submitFloatingPointAndSettingsData(floatingPoints: string) {
    try {
      const isSettings = this.settingsDataFromParentNode ? true : false;
      const settingsData = this.settingsDataFromParentNode || new Settings();
      settingsData.entityType = this.entity.nodeType;
      settingsData.runSettings = {
        minimumNumberOfPoints: +floatingPoints,
        floatStatsStartDate: this.runSettings?.floatStatsStartDate
      };
      if (isSettings) {
        this.store.dispatch(actions.LabConfigSettingsActions.setSettings({ settings: settingsData }));
      } else {
        settingsData.levelSettings = null;
        settingsData.ruleSettings = null;
        const newSettingsData = { ...this.settingsData, ...settingsData };
        this.store.dispatch(actions.LabConfigSettingsActions.setSettings({ settings: newSettingsData }));
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.EvaluationMeanSdConfigComponent + blankSpace + Operations.OnSubmit
            + blankSpace + Operations.FloatingPointAndSettingsData)));
    }
  }

  getDefaultAnalyteEvaluationMeanSdData(analytes: Array<LabTest>) {
    let analyteEvaluationMeanSdGroup: Array<AnalyteEvaluationMeanSd>;
    analyteEvaluationMeanSdGroup = analytes.map(elem => (
      {
        entityId: elem.id,
        parentEntityId: this.parentEntityId,
        parentMasterLotId: Number(this.productMasterLotId),
        levelEvaluationMeanSds: (elem.levelSettings) ?
          elem.levelSettings.levels.map((x, i) => (x.levelInUse) ? i + 1 : -1).filter(index => index !== -1).map(e => (
            {
              entityId: elem.id,
              level: e,
              meanEvaluationType: null,
              mean: null,
              sdEvaluationType: null,
              sd: null,
              sdIsCalculated: false,
              cvEvaluationType: null,
              cv: null,
              cvIsCalculated: true
            }
          )) : []
      }
    ));
    return analyteEvaluationMeanSdGroup;
  }

  getDefaultFloatingStatData(analytes: Array<LabTest>) {
    const levelFLoatingStatisticsData: Array<LevelFloatingStatistics> = [];
    const tempData = analytes.map(elem => (
      (elem.levelSettings) ?
        elem.levelSettings.levels.map((x, i) => (x.levelInUse) ? i + 1 : -1).filter(index => index !== -1).map(e => (
          {
            entityId: elem.id,
            level: e,
            mean: null,
            sd: null,
            cv: null,
          }
        )) : []
    ));

    tempData.map(el => {
      el.map(e => {
        levelFLoatingStatisticsData.push(e);
      });
    });
    return levelFLoatingStatisticsData;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
