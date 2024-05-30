import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { AnalyteEvaluationMeanSd } from '../../contracts/models/lab-setup/analyte-evaluation-mean-sd.model';
import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import * as fromRoot from '../../state/app.state';
import { SpinnerService } from '../services/spinner.service';
import { ApiService } from './api.service';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { TimeframeEnum } from '../../contracts/enums/lab-setup/timeframe.enum';
import { LevelFloatingStatistics, LevelEvaluationMeanSd } from '../../contracts/models/lab-setup/level-evaluation-mean-sd.model';


// TODO : Pratik :: This service is have temporary purpose i.e. call APIs from tdg9rz2yx7.execute-api.us-west-2.amazonaws.com

@Injectable()
export class AwsApiService extends ApiService {

  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).settingsUrl;
  }

  evaluationMeanSdItemsRequest(items: Array<string>): Observable<AnalyteEvaluationMeanSd[]> {
    const url = unApi.evaluationMeanSd.evaluationMeanSdItems;
    const payload = items;
    return this.post(url, payload);
  }

  evaluationMeanSdUpdate(items): Observable<AnalyteEvaluationMeanSd[]> {
    const url = unApi.evaluationMeanSd.evaluationMeanSd;
    const payload = items;
    return this.putJson(url, payload);
  }

  evaluationMeanSdSave(items): Observable<AnalyteEvaluationMeanSd[]> {
    const url = unApi.evaluationMeanSd.evaluationMeanSd;
    const payload = items;
    return this.post(url, payload);
  }

  public floatingStatisticsStart(entityId: string, runId: string): Observable<any> {
    const url = unApi.floatingStatistics.floatingStatisticsStart.replace(urlPlaceholders.entityId, entityId);
    const payload = runId;
    return this.post(url, payload);
  }

  floatingStatisticsRequest(items: Array<string>,
    timeframeValue: TimeframeEnum): Observable<LevelFloatingStatistics[]> {
    const url = unApi.floatingStatistics.floatingStatisticsTimeframe;
    const payload = { entityIds: items, timeframe: timeframeValue };
    return this.post(url, payload);
  }

  getEvaluationMeanSdForRun(runId: string): Observable<Array<LevelEvaluationMeanSd>> {
    const url = unApi.evaluationMeanSd.evaluationMeanSdForRun.replace(urlPlaceholders.runId, runId);
    return this.get(url, null, true);
    const data: Array<LevelEvaluationMeanSd> = [
      {
        'entityId': '11111111-1111-1111-1111-111111111111',
        'level': 1,
        'meanEvaluationType': 1,
        'mean': 15.15,
        'sdEvaluationType': 2,
        'sd': 15.15,
        'sdIsCalculated': false,
        'cvEvaluationType': 2,
        'cv': 100,
        'cvIsCalculated': true
      }, {
        'entityId': '11111111-1111-1111-1111-111111111111',
        'level': 2,
        'meanEvaluationType': 1,
        'mean': 15.15,
        'sdEvaluationType': 2,
        'sd': 15.15,
        'sdIsCalculated': false,
        'cvEvaluationType': 2,
        'cv': 100,
        'cvIsCalculated': true
      }
    ];
    return of(data);
  }
}
