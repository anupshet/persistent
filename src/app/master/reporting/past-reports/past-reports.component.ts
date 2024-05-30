// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Store, select } from '@ngrx/store';
import gql from 'graphql-tag';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import * as fromRoot from '../../../state/app.state';
import * as fromSharedSelector from '../../../shared/state/selectors';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../core/config/constants/error-logging.const';
import { AuditTracking, AuditTrackingAction, AuditTrackingActionStatus } from '../../../shared/models/audit-tracking.model';
import { LoggingApiService } from '../../../shared/api/logging-api.service';
import { OktaSessionService } from '../../../shared/services/okta-session.service';
import { AuthenticationService } from '../../../security/services';
import { UserActions } from '../../../state/actions';
import { PastReportList } from '../../../core/config/constants/past-reports.const';


@Component({
  selector: 'unext-past-reports',
  templateUrl: './past-reports.component.html',
  styleUrls: ['./past-reports.component.scss']
})
export class PastReportsComponent implements OnInit, OnDestroy {

  dataSource: Array<PastReportList> = [];
  originalData: Array<PastReportList> = [];
  public labLocationId: string;
  signedBylist: Array<string> = [];
  private destroy$ = new Subject<boolean>();
  reset = 0;
  unSigned: string;
  constructor(private store: Store<fromRoot.State>,
    private apollo: Apollo,
    private spinnerService: SpinnerService,
    private errorLoggingService: ErrorLoggerService,
    private loggingApiService: LoggingApiService,
    private oktaSessionService: OktaSessionService,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {

    // get current location information
    this.store.pipe(select(fromSharedSelector.getCurrentLabLocation)).pipe(take(1))
      .subscribe((labLocation) => {
        if (labLocation) {
          this.labLocationId = labLocation.id;
        }
      });

    this.getPastReports();
  }

  filterChanged(data: any) {
    let dataSource: Array<any> = [...this.originalData, ...[]];
    Object.keys(data).forEach((key: string) => {
      if (data[key] && key !== 'reportTypes') {
        if (key === 'signedBy' && data.signedBy === this.unSigned) {
          dataSource = [...dataSource.filter(item => item[key] === ''), ...[]];
        } else {
          dataSource = [...dataSource.filter(item => item[key] === data[key]), ...[]];
        }
      }
    });
    let filterData: Array<any> = [...dataSource, ...[]];
    if (data.reportTypes && data.reportTypes.length > 0) {
      const filteredData = [];
      dataSource.map(item => {
        if (item.type.includes('_')) {
          const hasItem: Array<any> = item.type.split('_').filter(rec => data.reportTypes.includes(rec));
          if (hasItem.length) {
            filteredData.push(item);
          }
        } else {
          if (data.reportTypes.includes(item.type)) {
            return filteredData.push(item);
          }
        }
      });
      filterData = [...filteredData, ...[]];
    }
    this.dataSource = filterData;
    this.getSignedBy(this.dataSource);
  }

  getSignedBy(filteredData: Array<any>) {
    this.signedBylist = [];
    this.unSigned = this.getTranslate('PASTREPORTS.UNSIGNED');
    filteredData.forEach((user: any) => {
      if (!this.signedBylist.includes(user.signedBy)) {
        if (user.signedBy === '') {
          this.signedBylist.push(this.unSigned);
        } else {
          this.signedBylist.push(user.signedBy);
        }

      }
    });
    if (this.signedBylist) {
      this.signedBylist = [...new Set(this.signedBylist)];
    }
  }
  private getTranslate(codeToTranslate: string): string {
    let translatedContent: string;
    this.translateService.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
  logOff() {
    const _auditTracking: AuditTracking = {
      action: AuditTrackingAction.Logout,
      actionStatus: AuditTrackingActionStatus.Success,
      resource: ''
    };
    this.loggingApiService.auditTracking(_auditTracking).then(() => { }).catch((error) => {
      this.errorLoggingService.logErrorToBackend(
        this.errorLoggingService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.NavBarTopComponent + blankSpace + Operations.AuditTracking)));
    });

    this.oktaSessionService.logout();
    this.authenticationService.logOut().toPromise().then(() => {
      this.store.dispatch(UserActions.ResetApp());
    }).catch((error) => {
      this.errorLoggingService.logErrorToBackend(
        this.errorLoggingService.populateErrorObject(ErrorType.Script, error.stack, error.message,
          (componentInfo.NavBarTopComponent + blankSpace + Operations.UserLogOut)));
    });
  }

  getPastReports() {
    const currentEpoch: any = new Date();
    const expTime: number = JSON.parse(localStorage.getItem('okta-token-storage')).accessToken.expiresAt;
    const expEpoch: any = new Date(expTime * 1000);
    if (currentEpoch.getTime() > expEpoch.getTime()) {
      this.logOff();
      return;
    }

    this.startSpinner();
    this.apollo
      .subscribe(
        {
          query: gql`
            query get_all_stats($lab_location_id: String!) {
              get_saved_pdf_report_for_location(input:{
                  lab_location_id: $lab_location_id
                  }){
                    id
                    name
                    type
                    year
                    month
                    signedBy
                    downloadFileName
                    createdOn
                    viewPreSigned
                    downloadPreSigned
                    templateName
                    templateId
                  }
             }
            `,
          variables: { lab_location_id: this.labLocationId }
        })
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        let data: any = (response || {}).data || {};
        data = (data || {}).get_saved_pdf_report_for_location || [];

        // remove signedBy from LC and LH reports since when creating reports there are no corrective actions
        data.forEach((i: any, index) => {
          if (this.isLCLHreport(i)) {
            data[index]['signedBy'] = '';
          }
        });

        data.sort((a, b) => {
          return new Date(b.created_on).getTime() - new Date(a.created_on).getTime();
        });
        this.dataSource = data || [];
        this.originalData = data || [];
        if (this.originalData && this.originalData.length > 0) {
          this.getSignedBy(this.originalData);
        }
        this.stopSpinner();
      }, (error) => {
        this.stopSpinner();
        this.errorLoggingService.logErrorToBackend(
          this.errorLoggingService.populateErrorObject(ErrorType.Script, error, error.errorMessage,
            (componentInfo.PastReportsComponent + blankSpace + Operations.GetSavedPdfReports))
        );
      });
  }

  formReset(event: any) {
    this.dataSource = [...this.originalData, ...[]];
    this.reset++;
  }

  private startSpinner(): void {
    this.spinnerService.displaySpinner(true);
  }

  private stopSpinner(): void {
    this.spinnerService.displaySpinner(false);
  }

  isLCLHreport(data) {
    return (data.type === '1' || data.type === '2' || data.type === '1_2') ? true : false;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
