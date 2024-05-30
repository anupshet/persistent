/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import * as ngrxStore from '@ngrx/store';

import 'moment-timezone';
import { CalibratorLot, Lot, PointDataResultStatus, ReagentLot } from 'br-component-library';

import { RuleDisposition } from '../../contracts/enums/lab-setup/spc-rule-enums/spc-rule-disposition.enum';
import { BaseRawDataModel, RawDataType } from '../../contracts/models/data-management/base-raw-data.model';
import { RawDataPage } from '../../contracts/models/data-management/raw-data-page.model';
import { PointDataResult, ResultStatus, Rule, RunData } from '../../contracts/models/data-management/run-data.model';
import { Level, Run, RunsResult, ZScoreResult } from '../../contracts/models/data-management/runs-result.model';
import { dataManagement } from '../../core/config/constants/data-management.const';
import { LabDataApiService } from '../api/labDataApi.service';
import { DateTimeHelper } from '../date-time/date-time-helper';
import { LabTestService } from './test-run.service';
import { CodelistApiService } from '../api/codelistApi.service';
import { LabTest } from '../../contracts/models/lab-setup';
import * as fromRoot from '../../state/app.state';
import * as fromAuth from '../state/selectors';
import { AuthState } from '../state/reducers/auth.reducer';
import { AwsApiService } from '../api/aws.service';
import { TestSpec } from '../../contracts/models/portal-api/labsetup-data.model';


@Injectable()
export class RunsService implements OnDestroy {
  protected accountNumber: string;
  private numberOfRuns = dataManagement.numberOfRuns;
  private cachedComment = new BehaviorSubject<string>('');
  private destroy$ = new Subject<boolean>();

  constructor(
    private labDataApiService: LabDataApiService,
    private awsApiService: AwsApiService,
    private store: ngrxStore.Store<fromRoot.State>,
    private labTestService: LabTestService,
    private codeListService: CodelistApiService,
    private dateTimeHelper: DateTimeHelper
  ) {
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        if (authState && authState.isLoggedIn && authState.currentUser) {
          this.accountNumber = authState.currentUser.accountNumber;
        }
      });
  }

  public setCachedComment(str): void {
    this.cachedComment.next(str);
  }

  public getCachedComment() {
    return this.cachedComment.value;
  }

  getRawDataPageByLabTestId(
    labTestId: string,
    page: number,
    controlLotIds?: string,
    runDateRange?: string,
    doNotshowBusy?: boolean
  ): Promise<RawDataPage> {
    return this.labDataApiService
      .getRawDataPageByLabTestId(
        labTestId,
        page,
        RawDataType.RunData,
        this.numberOfRuns,
        controlLotIds,
        runDateRange,
        doNotshowBusy
      )
      .toPromise();
  }

  getRawDataForAdvancedLj(
    labTestId: string,
    startDate: Date,
    endDate: Date,
    doNotShowBusy?: boolean
  ): Observable<string> {
    return this.labDataApiService
      .getRawDataForAdvancedLj(
        labTestId,
        startDate,
        endDate,
        doNotShowBusy
      );
  }

  postNewRunData(runData: BaseRawDataModel): Promise<BaseRawDataModel> {
    return this.labDataApiService.postDataAsync(runData);
  }

  postNewSummaryData(summaryData: BaseRawDataModel): Promise<BaseRawDataModel> {
    return this.labDataApiService.postDataAsync(summaryData);
  }

  putRunEditData(runData: RunData): Promise<BaseRawDataModel> {
    return this.labDataApiService.putDataJson(runData).toPromise();
  }

  public restartFloatWithRun(entityId: string, runId: string): Promise<any> {
    return this.awsApiService.floatingStatisticsStart(entityId, runId).toPromise();
  }

  deleteRunData(
    runData: RunData
  ): Promise<BaseRawDataModel> {
    return this.labDataApiService.deleteData(runData.id, runData).toPromise();
  }

  public filterExpiredLots(
    lots: Array<Lot>,
    selectedLotId: number,
    labTimeZone: string
  ): Array<Lot> {
    return lots.filter(
      lot =>
        !this.isLotExpired(lot.shelfExpirationDate, labTimeZone) ||
        selectedLotId === lot.id
    );
  }

  public filterExpiredLotsForSpecificDate(
    lots: Array<Lot>,
    selectedLot: Lot,
    specificDate: Date
  ): Array<Lot> {
    return lots?.filter(
      lot =>
        !this.isLotExpiredForSpecificDate(
          lot.shelfExpirationDate,
          specificDate
        ) || selectedLot === lot
    );
  }

  public isLotExpired(shelfExpirationDate: Date, labTimeZone: string): boolean {
    return this.dateTimeHelper.isExpired(shelfExpirationDate);
  }

  public isLotExpiredForSpecificDate(
    shelfExpirationDate: Date,
    dateTime: Date
  ): boolean {
    return this.dateTimeHelper.isExpiredOnSpecificDate(shelfExpirationDate, dateTime);
  }

  private filterRunDataPageSetWithLevelsInUse(
    runDataPageSet: Array<RunData>,
    levelsInUse: Array<number>
  ): Array<RunData> {
    runDataPageSet.forEach(runData => {
      runData.results = this.filterLevelsWithLevelsInUse(runData, levelsInUse);
    });

    return runDataPageSet;
  }

  public filterLevelsWithLevelsInUse(
    runData: RunData,
    levelsInUse: Array<number>
  ): Array<PointDataResult> {
    const pointDataRessult = Array<PointDataResult>(dataManagement.maxLevels);
    runData.results.forEach(result => {
      if (result) {
        pointDataRessult[levelsInUse.indexOf(result.controlLevel)] = result;
      }
    });
    return pointDataRessult;
  }

  public extractResultStatus(result: PointDataResult): ResultStatus {
    let resultStatus: ResultStatus;

    if(result.ruleViolated) {
        if (result.ruleViolated.length > 0 && !result.isAccepted) {
          const rulesList = result.ruleViolated.map(rule => rule.disposition);
          if (rulesList.includes(RuleDisposition.warning) && rulesList.includes(RuleDisposition.reject)) {
            return ResultStatus.Reject;
          }
        }

        for (let i = 0; i < result.ruleViolated.length; i++) {
          let rule = result.ruleViolated[i];
          switch (rule.disposition) {
            case RuleDisposition.warning:
              resultStatus = ResultStatus.Warning;
              break;
            case RuleDisposition.reject:
              resultStatus = ResultStatus.Reject;
              return resultStatus;
            default:
              resultStatus = ResultStatus.Warning;
          }
        }

      return resultStatus;
    }
  }

  public extractPointDataResultStatus(result: PointDataResult): PointDataResultStatus {
    const spaResult = this.extractResultStatus(result);
    let componentLibraryResult: PointDataResultStatus;
    switch (spaResult) {
      case ResultStatus.Accept:
        componentLibraryResult = PointDataResultStatus.Accept;
        break;
      case ResultStatus.Reject:
        componentLibraryResult = PointDataResultStatus.Reject;
        break;
      case ResultStatus.Warning:
        componentLibraryResult = PointDataResultStatus.Warning;
        break;
      default:
        componentLibraryResult = PointDataResultStatus.None;
        break;
    }
    return componentLibraryResult;
  }

  public convertRunReasons(runData: RunData): Array<string> {
    let runReasons = null;

    if (runData.evaluationRules != null) {
      runReasons = new Array<string>();
      runData.evaluationRules.forEach(rule => {
        if (rule.disposition !== dataManagement.disabledRule) {
          runReasons.push(this.convertRule(rule));
        }
      });
    }
    return runReasons;
  }

  public convertReasons(result: PointDataResult): Array<string> {
    let reasons = null;

    if (result.ruleViolated != null) {
      reasons = new Array<string>();
      result.ruleViolated.forEach(rule => {
        reasons.push(this.convertRule(rule));
      });
    }
    return reasons;
  }

  private convertRule(rule: Rule): string {
    let runReason = rule.category;
    if (rule.k) {
      runReason = runReason.replace('k', rule.k.toString());
    }
    if (rule.disposition === 'W') {
      runReason += '[W]';
    }
    return runReason;
  }

  public convertRunDataPageSetToRunsResult(
    runDataPageSet: Array<RunData>
  ): RunsResult {
    const runs: Array<Run> = [];
    runDataPageSet.forEach(runData => {
      const run: Run = {
        dataSource: runData.dataSource,
        runId: runData.id,
        runDateTime: runData.runDateTime,
        enteredDateTime: runData.enteredDateTime,
        actions: [],
        comments: [],
        interactions: [],
        levels: [],
        runReasons: [],
        reagentLotId: null,
        calibratorLotId: null
      };

      runData.results.forEach(pointDataResult => {
        if (pointDataResult.zScoreData === null) {
          pointDataResult.zScoreData = new ZScoreResult();
          pointDataResult.zScoreData.zScore = 0;
        }
        const resultStatus = pointDataResult.resultStatus;

        const level: Level = {
          level: pointDataResult.controlLevel,
          controlLotId: pointDataResult.controlLotId,
          value: pointDataResult.resultValue,
          sd: pointDataResult.targetSD,
          mean: pointDataResult.targetMean,
          cv: pointDataResult.targetCV,
          zScoreResult: pointDataResult.zScoreData,
          isAccepted: pointDataResult.isAccepted,
          reasons: pointDataResult.reasons,
          resultStatus: resultStatus,
          measuredDateTime: pointDataResult.measuredDateTime,
          lastModified: pointDataResult.lastModified
        };

        run.levels.push(level);
      });

      runs.push(run);
    });

    const runsResult: RunsResult = {
      runs: runs,
      labTimeZone: null,
      reagentLots: [],
      calibratorLots: []
    };
    return runsResult;
  }

  public async updateTestSpecId(reagentLot: ReagentLot, calibratorLot: CalibratorLot, testId: string, labTestId: string, selectedDateTime: Date, currentDateTime: Date): Promise<LabTest> {
    let labTest = await this.labTestService.getLabTest(labTestId);
    const newTestSpecId = await this.getTestSpecIdAsync(testId, reagentLot.id.toString(), calibratorLot.id.toString());
    if (labTest && labTest.testSpecId !== newTestSpecId) {
      labTest.testSpecId = newTestSpecId;
      if(selectedDateTime.toISOString() >= currentDateTime.toISOString()){
        labTest = await this.labTestService.postLabTest(labTest);
      }
    }

    return labTest;
  }

  private async getTestSpecIdAsync(testId: string, reagentLotId: string, calibratorLotId: string): Promise<string> {
    const testInfo = await this.codeListService.getTestByIdAsync(testId);
    let testSpecId = await this.codeListService.getTestSpecIdAsync(testInfo.analyteId.toString(), testInfo.methodId.toString(),
      testInfo.instrumentId.toString(), reagentLotId, testInfo.storageUnitId.toString(), calibratorLotId);

    // TestSpec not found, so we must request a new one be created for this combination.
    if (+testSpecId <= 0) {
      let testSpec = new TestSpec();
      testSpec.analyteId = testInfo.analyteId;
      testSpec.methodId = testInfo.methodId;
      testSpec.instrumentId = testInfo.instrumentId;
      testSpec.storageUnitId = testInfo.storageUnitId;
      testSpec.reagentLotId = +reagentLotId;
      testSpec.calibratorLotId = +calibratorLotId;
      let testSpecResult = await this.codeListService.postTestSpecAsync(testSpec);

      if (testSpecResult) {
        testSpecId = testSpecResult.id.toString();
      }
    }

    return testSpecId;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
