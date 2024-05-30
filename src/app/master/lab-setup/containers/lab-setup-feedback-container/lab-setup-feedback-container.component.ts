// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { cloneDeep } from 'lodash';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { AccountSettings } from '../../../../contracts/models/lab-setup/account-settings.model';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { getCurrentBranchState } from '../../../../shared/navigation/state/selectors';
import * as fromAppRoot from '../../../../state/app.state';
import * as fromRoot from '../../state';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { LocationActions } from '../../../../shared/state/actions';

@Component({
  selector: 'unext-lab-setup-feedback-container',
  templateUrl: './lab-setup-feedback-container.component.html',
  styleUrls: ['./lab-setup-feedback-container.component.scss']
})
export class LabSetupFeedbackContainerComponent implements OnInit, OnDestroy {
  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  private destroy$ = new Subject<boolean>();
  constructor(
    private appStore: Store<fromAppRoot.State>,
    private store: Store<fromRoot.LabSetupStates>,
    private navigationService: NavigationService,
    private portalApiService: PortalApiService,
    private errorLoggerService: ErrorLoggerService
  ) { }

  ngOnInit() { }
  onGoToDashboard(): void {
    try {
      this.appStore.pipe(select(getCurrentBranchState))
        .pipe(filter(currentBranches => !!currentBranches), takeUntil(this.destroy$))
        .subscribe((currentBranches) => {
          const labNode = currentBranches.find((branch: TreePill) => branch.nodeType === EntityType.LabLocation);
          if (labNode) {
            this.navigationService.navigateToDashboard(labNode.id);
          }
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LabSetupFeedbackContainerComponent + blankSpace + Operations.OnGoToDashboard)));
    }
  }

  updateAccountSettings(accountSettings: AccountSettings) {
    try {
      this.portalApiService.saveLabsetupDefaults(accountSettings).then(accountDetails => {
        if (accountDetails) {
          this.getCurrentLabLocation$
            .pipe(filter(location => !!location), take(1))
            .subscribe((location) => {
              const _labLocation = cloneDeep(location);
              _labLocation.locationSettings = accountDetails;
              this.store.dispatch(LocationActions.setCurrentLabLocation({ currentLabLocation: _labLocation }));
            });
        }
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LabSetupFeedbackContainerComponent + blankSpace + Operations.UpdateAccountSettings)));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
