// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import * as ngrxStore from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { ApiService } from './api.service';
import { SpinnerService } from '../services/spinner.service';
import * as fromRoot from '../../state/app.state';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { MissingTestPayload, MissingTestResponseData, MissingTestUpdateData, ReviewDataRequest, UnReviewedCountRequest, UnReviewedCountResponse, UnReviewedDataRequest,
  UnReviewedDataResponse, UserManageExpectedTestsSettings, UserReviewPreferences } from '../../contracts/models/data-review/data-review-info.model';

@Injectable()
export class DataReviewService extends ApiService {
  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).dataReviewUrl;
  }

  getDataReviewData(dataReviewRequest: UnReviewedDataRequest): Observable<UnReviewedDataResponse> {
    const path = unApi.dataReview.unreviewedData;
    return this.post(`${path}`, dataReviewRequest);    // Use post call for calling the API
    // return this.get(`${path}`, null, true);   // Use get call for local JSON server
  }

  // data review count result
  getDataReviewCount(dataReviewedCountRequest: UnReviewedCountRequest): Observable<UnReviewedCountResponse> {
    const path = unApi.dataReview.dataRunCount;
    return this.post(`${path}`, dataReviewedCountRequest , true);
  }

  // Review the requested items
  reviewData(reviewDataRequest: ReviewDataRequest): Observable<void> {
    const path = unApi.dataReview.reviewedData;
    return this.post(`${path}`, reviewDataRequest, true);
  }

  // Get user review preferences
  getUserReviewPreferences(id: string): Observable<UserReviewPreferences> {
    const path = unApi.dataReview.userReviewPreferences + '/' + id;
    return this.get(`${path}`, null, true);
  }

   // Save user review preferences
  saveUserReviewPreferences(reviewPreference: UserReviewPreferences): Observable<UserReviewPreferences> {
    const path = unApi.dataReview.userReviewPreferences;
    return this.put(`${path}`, reviewPreference, true);
  }

  // DataColumns checkboxes label handler function
  dataColumnsHandler(preferenceItem) {
    preferenceItem = preferenceItem.replace(/^show+/i, '');
    preferenceItem = preferenceItem.split('Eval').join('Eval ');
    preferenceItem = preferenceItem.split('Peer').join('Peer ');
    preferenceItem = preferenceItem.split('Z').join('Z-');
    preferenceItem = preferenceItem.split('ReportedBy').join('By');
    return preferenceItem;
  }

  // get missing tests information
  getMissingTests(payload: MissingTestPayload): Observable<MissingTestResponseData> {
    const path = unApi.dataReview.missingTest;
    return this.post(`${path}`, payload, true);
  }

  //save missing tests information
  saveMissingTests(payload: MissingTestUpdateData): Observable<any> {
    const path = unApi.dataReview.missingTest;
    return this.put(`${path}`, payload, true);
  }

  getExpectedTests(labLocationId: string): Observable<UserManageExpectedTestsSettings> {
    const path = unApi.dataReview.expectedTests;
    return this.get(`${path}/${labLocationId}`);
  }

  putExpectedTests(userManageExpectedTestsSettings: UserManageExpectedTestsSettings): Observable<UserManageExpectedTestsSettings> {
    const path = unApi.dataReview.expectedTests;
    return this.put(`${path}`, userManageExpectedTestsSettings, true);
  }
}
