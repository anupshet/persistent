// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, take, takeUntil} from 'rxjs/operators';
import { select } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as ngrxSelector from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import * as fromAuth from '../../../../shared/state/selectors';
import * as fromRoot from './../../../../state/app.state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { Operations, componentInfo } from '../../../../core/config/constants/error-logging.const';
import { blankSpace } from '../../../../core/config/constants/general.const';
import { AuthState } from '../../../../shared/state/reducers/auth.reducer';
import { ReviewType, UnReviewedCountRequest, UnReviewedCountResponse, UnReviewedDataRequest } from '../../../../contracts/models/data-review/data-review-info.model';
import { DataReviewService } from '../../../../shared/api/data-review.service';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import { BioRadUserRoles, UserRole } from '../../../../contracts/enums/user-role.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { UnityNextTier } from '../../../../contracts/enums/lab-location.enum';

@Component({
  selector: 'unext-qc-review-result-panel',
  templateUrl: './qc-review-result-panel.component.html',
  styleUrls: ['./qc-review-result-panel.component.scss']
})

export class QcReviewResultPanelComponent implements OnInit, OnDestroy {
  public getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));
  private destroy$ = new Subject<boolean>();
  authState: AuthState;
  labLocation: LabLocation;
  reviewType: ReviewType;
  unReviewedDataRequest: UnReviewedDataRequest;
  totalRunAvailable: number;
  permissions = Permissions;

  constructor(
    private dataReviewApiService: DataReviewService,
    private errorLoggerService: ErrorLoggerService,
    private store: ngrxSelector.Store<fromRoot.State>,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getLabLocationData();
  }

  getLabLocationData() {
      this.store.pipe(ngrxSelector.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!authState.directory || !!authState.currentUser.roles), takeUntil(this.destroy$))
      .subscribe(authState => {
        try {
          if (authState) {
            this.authState = authState;
          }
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, error.message,
              (componentInfo.LotviewerComponent + blankSpace + Operations.FetchAuthState)));
        }
      });

      this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(
        filter(labLocation => !!labLocation && labLocation.unityNextTier === UnityNextTier.DailyQc),
        takeUntil(this.destroy$))
      .subscribe(labLocation => {
        if (labLocation) {
          const currentUser = this.authState?.directory?.children.find(ele => ele.userOktaId === this.authState?.currentUser?.userOktaId);

          if (currentUser && currentUser.userRoles && currentUser.userRoles.length) {
            currentUser.userRoles.forEach((userRoles) => {
                if (userRoles === UserRole.Technician || userRoles === UserRole.LeadTechnician || userRoles === BioRadUserRoles.CTSUser ) {
                    this.reviewType = ReviewType.Bench;
                } else if (userRoles === UserRole.LabSupervisor) {
                  this.reviewType = ReviewType.Supervisor;
                }
            });
          } else if (this.hasPermissionToAccess([this.permissions.BenchReviewViewOnly, this.permissions.SupervisorReviewViewOnly])) {
            this.reviewType = ReviewType.Bench;
          }

          const dataReviewedCountRequest: UnReviewedCountRequest = {
            labLocationId: labLocation?.id,
            reviewType: this.reviewType
          };
          this.getDataReviewCount(dataReviewedCountRequest);
        }
      });
    }

    getDataReviewCount(dataReviewedCountRequest: UnReviewedCountRequest) {
      this.dataReviewApiService.getDataReviewCount(dataReviewedCountRequest).pipe(take(1))
        .subscribe((totalRunAvailablecount: UnReviewedCountResponse) => {
          this.totalRunAvailable = totalRunAvailablecount.totalUnreviewedRunCount;
        }, error => {
          if (error.error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
                (componentInfo.DataReviewComponent + blankSpace + Operations.GetDataReviewData)));
          }
        });
    }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
