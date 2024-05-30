/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { Observable } from 'rxjs';

import * as moment from 'moment';

import { ILabDataAPIService } from '../../contracts/interfaces/i-lab-data-api.service';
import { BaseRawDataModel, DataType, RawDataType } from '../../contracts/models/data-management/base-raw-data.model';
import { RawDataPage } from '../../contracts/models/data-management/raw-data-page.model';
import { RunData } from '../../contracts/models/data-management/run-data.model';
import { SummaryDataModel } from '../../contracts/models/data-management/summary-data.model';
import { YearMonth } from '../../contracts/models/lab-data/year-month.model';
import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import * as fromRoot from '../../state/app.state';
import { SpinnerService } from '../services/spinner.service';
import { ApiService } from './api.service';


@Injectable()
export class LabDataApiService extends ApiService
  implements ILabDataAPIService {

  private readonly _rawdata = 'rawdata';

  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService,
    private datePipe: DatePipe
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).labDataUrl;
  }

  public getRawDataPageByLabTestId(
    labTestId: string,
    page: number,
    rawDataType: RawDataType,
    runs: number,
    controlLotIds?: string,
    runDateRange?: string,
    doNotshowBusy?: boolean
  ): Observable<RawDataPage> {
    // Fix for IE caching issue
    const dateTimeStamp = new Date();
    const date = this.datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');

    let url = unApi.labData.rawdata;

    url = this.appendUrl(url, 'runs', runs.toString());
    url = this.appendUrl(url, 'labtestid', labTestId);
    url = this.appendUrl(url, 'controlLotIds', controlLotIds);
    url = this.appendUrl(url, 'rundaterange', runDateRange);
    url = this.appendUrl(url, 'datatype', RawDataType[rawDataType]);
    url = this.appendUrl(url, 'page', page.toString());
    url = this.appendUrl(url, 'v', date);

    return this.get<RawDataPage>(url, null, !doNotshowBusy);
  }

  public getRawDataForAdvancedLj(
    labTestId: string,
    startDate: Date,
    endDate: Date,
    doNotShowBusy?: boolean
  ): Observable<string> {
    // Fix for IE caching issue
    const cacheBuster = this.datePipe.transform(new Date(), 'yyyyMMddhhmmssSS');
    let url = unApi.labData.rawdataAdvLj
      .replace(urlPlaceholders.labTestId, labTestId)
      .replace(urlPlaceholders.startDate, this.getDateString(startDate))
      .replace(urlPlaceholders.endDate, this.getDateString(endDate))
      .replace(urlPlaceholders.cacheBuster, cacheBuster)

    // Get base 64 string representation of binary gzip content
    return this.get<string>(url, 'text', !doNotShowBusy);
  }

  // Multi-Summary Mode
  public async getSummaryDataByLabTestIdsAsync(
    labTestIds: string[],
    runs?: number,
    runDateTime?: Date,
  ): Promise<SummaryDataModel[]> {

    const rawSearchValues: any = {
      labTestIds: labTestIds,
      dataType: DataType.SummaryData,
    };

    if (runDateTime) {
      rawSearchValues.rawDataDateTime = runDateTime;
    }
    if (runs) {
      rawSearchValues.runs = runs;
    }
    // Fix for IE caching issue
    const dateTimeStamp = new Date();
    const date = this.datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    const b64SearchValues = btoa(JSON.stringify(rawSearchValues));

    let summaryDataUrl = unApi.labData.rawdata;
    summaryDataUrl = this.appendUrl(summaryDataUrl, urlPlaceholders.searchParams, b64SearchValues);
    summaryDataUrl = this.appendUrl(summaryDataUrl, 'v', date);
    return await this.get<SummaryDataModel[]>(summaryDataUrl, null, true).toPromise();
  }

  public async getRunDataByLabTestIdsAsync(
    labTestIds: string[],
    runDateTime?: Date
  ): Promise<RunData[]> {

    const rawSearchValues: any = {
      labTestIds: labTestIds,
      dataType: DataType.RunData,
      runs: 1
    };

    if (runDateTime) {
      rawSearchValues.rawDataDateTime = runDateTime;
    }
    // Fix for IE caching issue
    const dateTimeStamp = new Date();
    const date = this.datePipe.transform(dateTimeStamp, 'yyyyMMddhhmmssSS');
    const b64SearchValues = btoa(JSON.stringify(rawSearchValues));
    let runDataUrl = unApi.labData.rawdata;
    runDataUrl = this.appendUrl(runDataUrl, urlPlaceholders.searchParams, b64SearchValues);
    runDataUrl = this.appendUrl(runDataUrl, 'v', date);
    return await this.get<RunData[]>(runDataUrl, null, true).toPromise();
  }

  // Mixed Mode
  public getRawDataByLabTestIds(
    runDataLabTestId: string[],
    summaryDataLabTestId: string[],
    rawDataDateTime: Date,
    runs?: number
  ): BaseRawDataModel[] {
    
    if (runDataLabTestId && summaryDataLabTestId) {
      const result: BaseRawDataModel[] = [];

      this.getRunDataByLabTestIdsAsync(runDataLabTestId, rawDataDateTime).then(
        data => {
          result.concat(data);
        }
      );

      this.getSummaryDataByLabTestIdsAsync(
        summaryDataLabTestId,
        runs,
        rawDataDateTime
      ).then(data => {
        result.concat(data);
      });

      return result;
    }
  }

  // Single Summary Mode
  public async getLatestSummaryDataByLabTestIdAsync(
    labTestId: string,
    rawDataDateTime?: Date,
    showSpinner = true
  ): Promise<SummaryDataModel[]> {
    if (labTestId) {
      let summaryDataUrl = unApi.labData.rawdata;

      summaryDataUrl = this.appendUrl(summaryDataUrl, 'labtestid', labTestId);
      summaryDataUrl = this.buildUrl(
        summaryDataUrl,
        'SummaryData',
        rawDataDateTime,
        1000
      );

      return await this.get<SummaryDataModel[]>(summaryDataUrl, null, showSpinner).toPromise();
    }
  }

  public async getLatestRunDataByLabTestIdAsync(
    labTestId: string,
    rawDataDateTime?: Date
  ): Promise<any> {
    if (labTestId) {
      let runDataUrl = unApi.labData.rawdata;

      runDataUrl = this.appendUrl(runDataUrl, 'labtestid', labTestId);
      runDataUrl = this.appendUrl(runDataUrl, 'page', '1');
      runDataUrl = this.buildUrl(runDataUrl, 'RunData', rawDataDateTime, 1);
      return await this.get<RunData[]>(runDataUrl, null, true).toPromise();
    }
  }

  public async getRawDataWithSearchParamsAsync(
    labTestIds: string[],
    rawDataDateTime: Date,
    rawDataType: RawDataType,
    doNotShowAsBusy?: boolean
  ): Promise<RunData[]> {
    const rawSearchValues = {
      rawDataDateTime: rawDataDateTime,
      getNearestRuns: true,
      labTestIds: labTestIds
    };
    const b64SearchValues = btoa(JSON.stringify(rawSearchValues));

    let url = unApi.labData.rawdata;

    url = this.appendUrl(url, 'searchparams', b64SearchValues);
    url = this.appendUrl(url, 'datatype', RawDataType[rawDataType]);

    return await this.get<RunData[]>(url, null, !doNotShowAsBusy).toPromise();
  }

  replacer = function (key, value) {
    if (key === 'localRunDateTime' || key === 'localSummaryDateTime') {
      // LabData is expecting a date format without offset.
      // Inside this replacer function, 'this' refers to the BaseRawDataModel object.
      // TimeZone is needed on the BaseRawDataModel object to format in the correct time (adjusted for time zone).
      return moment(new Date(value)).tz(this.labLocationTimeZone).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }
    return value;
  };

  public async postDataAsync(
    data: BaseRawDataModel
  ): Promise<BaseRawDataModel> {
    const jsonData = JSON.stringify(data, this.replacer);
    const url = unApi.labData.rawdata;
    return await this.postJson<BaseRawDataModel>(url, jsonData, true).toPromise();
  }

  public async postDataBatchAsync(
    baseRawDataModel: BaseRawDataModel[]
  ): Promise<BaseRawDataModel[]> {
    const jsonData = JSON.stringify(baseRawDataModel, this.replacer);
    let url = unApi.labData.rawdata;
    url = this.appendUrl(url, 'batch', 'true');
    return await this.postJson<BaseRawDataModel[]>(url, jsonData, true).toPromise();
  }

  public putData(
    baseRawDataModel: BaseRawDataModel
  ): Observable<BaseRawDataModel> {
    const url = this.createPutDataUrl(baseRawDataModel);
    return this.put<BaseRawDataModel>(url, baseRawDataModel, true);
  }

  public putDataJson(
    baseRawDataModel: BaseRawDataModel
  ): Observable<BaseRawDataModel> {
    const jsonData = JSON.stringify(baseRawDataModel, this.replacer);
    const url = this.createPutDataUrl(baseRawDataModel);
    return this.putJson<BaseRawDataModel>(url, jsonData, true);
  }

  private createPutDataUrl(baseRawDataModel: BaseRawDataModel): string {
    let url = unApi.labData.rawdata;
    url = this.appendUrl(url, 'labtestid', baseRawDataModel.labTestId);
    url = this.appendUrl(
      url,
      'datatype',
      RawDataType[baseRawDataModel.dataType].toString()
    );
    return url;
  }

  public async putDataBatchAsync(
    baseRawDataModel: BaseRawDataModel[]
  ): Promise<BaseRawDataModel[]> {
    const jsonData = JSON.stringify(baseRawDataModel, this.replacer);
    let url = unApi.labData.rawdata;
    url = this.appendUrl(url, 'batch', 'true');
    return await this.put<BaseRawDataModel[]>(url, jsonData, true).toPromise();
  }

  public deleteData(
    runId: string,
    baseRawDataModel: BaseRawDataModel
  ): Observable<BaseRawDataModel> {
    let url = unApi.labData.rawdata;
    url = this.appendUrl(url, 'datatype', baseRawDataModel.dataType.toString());
    return this.delWithData<BaseRawDataModel>(url, baseRawDataModel, true);
  }

  public getYearsAndMonthsWithDataPoints(
    year: number,
    labTestIds: string
  ): Observable<YearMonth> {
    const path = unApi.labData.yearsAndMonthsWithPointData.replace(
      '{year}',
      year.toString()
    ).replace('{labTestIds}', labTestIds);
    return this.get(path, labTestIds, true);
  }

  protected appendUrl(url: string, queryKey: string, queryValue: string): string {
    if (queryValue) {
      if (url.endsWith(this._rawdata)) {
        url += '?';
      } else {
        url += '&';
      }
      url += queryKey + '=' + queryValue;
    }
    return url;
  }

  private buildUrl(
    summaryDataUrl: string,
    dataType: string,
    rawDataDateTime?: Date,
    run?: number
  ) {
    if (rawDataDateTime) {
      summaryDataUrl = this.appendUrl(
        summaryDataUrl,
        'runDateTime',
        rawDataDateTime.toString()
      );
    }

    summaryDataUrl = this.appendUrl(summaryDataUrl, 'datatype', dataType);
    if (run) {
      summaryDataUrl = this.appendUrl(summaryDataUrl, 'runs', run.toString());
    }
    return summaryDataUrl;
  }

  private getDateString(dateObj: Date): string {
    const dateMonth = dateObj.getUTCMonth() + 1;
    const monthString = (dateMonth > 9 ? '' : '0') + dateMonth;
    const dateDay =  dateObj.getUTCDate();
    const dayString = (dateDay > 9 ? '' : '0') + dateDay;
    return dateObj.getUTCFullYear() + '-' + monthString + '-' + dayString;
  }
}
