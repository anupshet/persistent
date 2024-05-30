// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as ngrxStore from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, finalize, shareReplay } from 'rxjs/operators';
import { ApiConfig } from '../../core/config/config.contract';
import { ConfigService } from '../../core/config/config.service';
import { StatusCode } from './status-codes.enum';
import { SpinnerService } from '../services/spinner.service';
import * as fromRoot from '../../state/app.state';
import * as fromAuth from '../../shared/state/selectors';
import { AuthState } from '../state/reducers/auth.reducer';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { IS_LOCALHOST } from '../../core/config/constants/general.const';

@Injectable()
export class ApiService {
  protected apiUrl: string;
  protected httpOptions: any;
  protected httpOptionsFileUpload: any;
  protected httpOptionsFileUploadS3: any;
  protected httpOptionsPDF: any;
  protected httpCallRetry: number;
  protected authState: any;
  private readonly URL_WARNING_LENGTH = 255;
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private store: ngrxStore.Store<fromRoot.State>,
    @Optional() private spinnerService?: SpinnerService
  ) {
    if (config.getConfig('api')) {
      ({ portalUrl: this.apiUrl, httpCallRetry: this.httpCallRetry } = <ApiConfig>(
        config.getConfig('api')
      ));
    }
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .subscribe((authState: AuthState) => {
        if (authState && authState.isLoggedIn && authState.currentUser) {
          this.authState = authState;
          // Regular Headers
          const headersWithUser = new HttpHeaders({ // change from const to let when running locally
            'Content-Type': 'application/json',
            Authorization:
              authState.currentUser.accessToken.tokenType +
              ' ' +
              authState.currentUser.accessToken.accessToken,
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
            'Locale': 'en-US'
          });

          // Uncomment the following for testing with labsetup service running locally.
          // While testing locally just change from !== to === for the service which you are running locally,rest services will point to DEV
          // there will be no cros error and you can add the headers to the locally running service by changing it from !== to ===
          // if (IS_LOCALHOST && this.constructor.name !== 'CodelistApiService' && this.constructor.name !== 'LabDataApiService'
          //   && this.constructor.name !== 'PortalApiService' && this.constructor.name !== 'TreeNodesService'
          //   && this.constructor.name !== 'LabSetupDefaultsService' && this.constructor.name !== 'MappingService'
          //   && this.constructor.name !== 'NotificationApiService' && this.constructor.name !== 'LotViewerService'
          //   && this.constructor.name !== 'LoggingApiService' && this.constructor.name !== 'UserManagementApiService'
          //   && this.constructor.name !== 'SummaryStatisticsTableService'
          //   && this.constructor.name !== 'OrchestratorApiService'
          //   && this.constructor.name === 'ReportingService') {
          //   // while running locarlly add the hardcoded values of the account you are login in the below lines for headers.
          //   headersWithUser = headersWithUser.append('uid', authState.currentUser.userOktaId || '');
          //   headersWithUser = headersWithUser.append('userid', authState.currentUser.id || '');
          //   headersWithUser = headersWithUser.append('accountId', authState.currentUser.accountId || '');
          //   headersWithUser = headersWithUser.append('UserRoles', authState.currentUser.roles &&
          //     authState.currentUser.roles.length ? authState.currentUser.roles[0] : '');
          // }
          this.httpOptions = {
            headers: headersWithUser,
            observe: 'response'
          };
          // 2020.06.04: Headers for connectivity S3 file upload
          this.httpOptionsFileUploadS3 = new HttpHeaders({
            'Content-Type': 'text/plain'
          });
          this.httpOptionsFileUpload = {
            headers: headersWithUser
          };
          // 2020.04.08: Added headers for PDF generation
          const headersWithUserPDF = new HttpHeaders({
            'Content-Type': 'application/pdf',
            Authorization:
              authState.currentUser.accessToken.tokenType +
              ' ' +
              authState.currentUser.accessToken.accessToken,
            Accept: 'application/pdf',
            'Cache-Control': 'no-cache'
          });
          this.httpOptionsPDF = {
            headers: headersWithUserPDF,
            observe: 'response'
          };
        } else {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Cache-Control': 'no-cache'
          });
          this.httpOptions = {
            headers: headers,
            observe: 'response'
          };
        }
      });
  }
  get<T>(path: string, responseType?: string, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    const options = this.extractOptions(this.httpOptions, responseType);
    this.warnForUrlLength(this.apiUrl + path);
    this.displaySpinner(showAsBusy, true);
    return this.http
      .get<T>(`${this.apiUrl}/${path}`, options).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
  }
  // This version returns the error as an observable, rather than just throwing an exception.
  // This allows for handling HTTP errors for cases where it's not a show stopper.
  getWithError<T>(path: string, responseType?: string, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    const options = this.extractOptions(this.httpOptions, responseType);
    this.displaySpinner(showAsBusy, true);
    return this.http
      .get<T>(`${this.apiUrl}/${path}`, options).pipe(
        catchError(e => of(e)))
      .pipe(
        shareReplay(1),
        retry(this.httpCallRetry),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)));
  }
  put<T>(path: string, data: any, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .put<T>(`${this.apiUrl}/${path}`, JSON.stringify(data), this.httpOptions).pipe(
      retry(this.httpCallRetry),
      map(this.checkForError),
      map(this.extractData),
      finalize(() => this.displaySpinner(showAsBusy, false)),
      catchError(this.handleError1.bind(this)));
    return response;
  }
  putSettingsData<T>(nodeType: EntityType, path: string, data: any, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .put<T>(`${this.apiUrl}/${path}/${nodeType}`, JSON.stringify(data), this.httpOptions).pipe(
      retry(this.httpCallRetry),
      map(this.checkForError),
      map(this.extractData),
      finalize(() => this.displaySpinner(showAsBusy, false)),
      catchError(this.handleError1.bind(this)));
    return response;
  }
  putJson<T>(path: string, jsonData: string, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .put<T>(`${this.apiUrl}/${path}`, jsonData, this.httpOptions).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  putFileWithS3<T>(path: string, data: any, showAsBusy?: boolean): Observable<T> {
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .put<T>(`${path}`, data, { headers: this.httpOptionsFileUploadS3 }).pipe(
        retry(this.httpCallRetry),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  post<T>(path: string, data: any, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .post<T>(`${this.apiUrl}/${path}`, JSON.stringify(data), this.httpOptions).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  postSettingsData<T>(nodeType: EntityType, path: string, data: any, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .post<T>(`${this.apiUrl}/${path}/${nodeType}`, JSON.stringify(data), this.httpOptions).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  postForPdf<T>(path: string, data: any, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .post<T>(`${this.apiUrl}/${path}`, JSON.stringify(data), this.httpOptionsPDF).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  postJson<T>(path: string, jsonData: string, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .post<T>(`${this.apiUrl}/${path}`, jsonData, this.httpOptions).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  postFile<T>(path: string, data: any, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .post(`${this.apiUrl}/${path}`, data, { headers: this.httpOptionsFileUpload, observe: 'response' }).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  putFile<T>(path: string, data: any, showAsBusy?: boolean): Observable<T> {
    this.warnForUrlLength(path);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .put(`${path}`, data, { headers: this.httpOptionsFileUpload, observe: 'response' }).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)));
    return response;
  }
  del<T>(path: string, showAsBusy?: boolean): Observable<any> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    const response = this.http
      .delete(`${this.apiUrl}/${path}`, this.httpOptions).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  delWithData<T>(path: string, data, showAsBusy?: boolean): Observable<any> {
    this.warnForUrlLength(`${this.apiUrl}/${path}`);
    this.displaySpinner(showAsBusy, true);
    this.httpOptions.body = data;
    const response = this.http
      .delete(`${this.apiUrl}/${path}`, this.httpOptions).pipe(
        retry(this.httpCallRetry),
        map(this.checkForError),
        map(this.extractData),
        finalize(() => this.displaySpinner(showAsBusy, false)),
        catchError(this.handleError1.bind(this)));
    return response;
  }
  private handleError1(error: any) {
    throw error;
  }
  protected appendUrl(url: string, queryKey: string, queryValue: string): string {
    if (queryValue) {
      if (!url.includes('?')) {
        url += '?';
      } else {
        url += '&';
      }
      url += queryKey + '=' + queryValue;
    }
    return url;
  }
  private checkForError(response: HttpResponse<any> | any) {
    if (
      response.status >= StatusCode.OK &&
      response.status < StatusCode.Ambiguous
    ) {
      return response;
    } else if (response.status === StatusCode.BadRequest) {
      return response;
    } else if (response.status === StatusCode.NotFound) {
      return response;
    } else {
      const error = new Error(response.statusText);
      error['response'] = response;
      console.error(error);
      throw error;
    }
  }
  private extractData(response: HttpResponse<any> | any) {
    if (response.body) {
      return response.body || {};
    } else {
      return response;
    }
  }
  private extractOptions(httpOptions: any, responseType?: string): any {
    const options = { ...httpOptions };
    if (responseType) {
      options.responseType = responseType;
    } else {
      options.responseType = 'json';
    }
    return options;
  }
  private warnForUrlLength(url: string) {
    if (url.length >= this.URL_WARNING_LENGTH) {
      console.warn(`Warning: the URL requested is ${url.length} in length.\n\n${url}`);
    }
    // Uncomment the following for testing with labsetup service running locally.
    // if (url.includes('portal/labsetup')){
    //   let headersWithUser = new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //     'Cache-Control': 'no-cache',
    //     'Locale': 'en-US'
    //   });

    //   if (IS_LOCALHOST
    //   && this.constructor.name != 'CodelistApiService' && this.constructor.name != 'LabDataApiService'
    //   && this.constructor.name != 'NotificationApiService' && this.constructor.name != 'LotViewerService'
    //   && this.constructor.name != 'LoggingApiService' && this.constructor.name != 'UserManagementApiService'
    //   && this.constructor.name != 'ReportingService' && this.constructor.name != 'SummaryStatisticsTableService'
    //   && this.constructor.name != 'OrchestratorApiService') {
    //     headersWithUser = headersWithUser.append('uid', '00uhon30y0lK1e73G2p7');
    //     headersWithUser = headersWithUser.append('AccountId', 'b776693d-a08f-4fea-a2f1-288fc414ebda');
    //     headersWithUser = headersWithUser.append('UserId', 'f64d4a34-f086-4103-b68e-808d7fa8191f');
    //     headersWithUser = headersWithUser.append('UserRoles', 'LabSupervisor');
    //   }
    //   this.httpOptions = {
    //     headers: headersWithUser,
    //     observe: 'response'
    //   };
    // }
  }
  private displaySpinner(showAsBusy: boolean, showSpinner: boolean) {
    if (showAsBusy) {
      this.spinnerService.displaySpinner(showSpinner);
    }
  }

  /**
   * This method is used to call audit trail api
   * @param path audit trail api url
   * @param data audit trail payload details
   * @param showAsBusy
   * @returns post call response
   */
  public postAuditTrackingNavigation<T>(path: string, data: any, showAsBusy?: boolean): Observable<T> {
    const response = this.http
      .post<T>(`${path}`, JSON.stringify(data), this.httpOptions).pipe(
      retry(this.httpCallRetry),
      map(this.checkForError),
      map(this.extractData),
      finalize(() => this.displaySpinner(showAsBusy, false)),
      catchError(this.handleError1.bind(this)));
    return response;
  }
}
