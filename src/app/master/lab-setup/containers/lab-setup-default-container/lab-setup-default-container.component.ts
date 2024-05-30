import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LabSetupDefaults } from '../../../../contracts/models/lab-setup/lab-setup-defaults.model';
import * as actions from '../../state/actions';
import * as fromRoot from '../../state';
import * as fromSelector from '../../state/selectors';
import * as fromSecurity from '../../../../security/state/selectors';
import { Error } from '../../../../contracts/models/shared/error.model';
import { AccountSettings } from '../../../../contracts/models/lab-setup/account-settings.model';
import { DataEntryMode } from '../../../../contracts/models/lab-setup/data-entry-mode.enum';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';

@Component({
  selector: 'unext-lab-setup-default-container',
  templateUrl: './lab-setup-default-container.component.html',
  styleUrls: ['./lab-setup-default-container.component.scss']
})
export class LabSetupDefaultContainerComponent implements OnInit, OnDestroy {
  // TODO: replace this with actual value from server
  labconfigurationdefault: LabSetupDefaults = {
    dataType: DataEntryMode.Summary,  // default value for initial lab setup 1 == Summary
    instrumentsGroupedByDept: true,
    trackReagentCalibrator: true,
    fixedMean: false,
    decimalPlaces: 2,
    siUnits: false
  };
  errorMessage: string = null;
  labSetupDefaultsErrorMessage$: Observable<Error>;
  labSetupDefaultsErrorSubscription: Subscription;
  public labSetupDefaultHeaderTitle = 'Hello, {title}';
  public labSetupDefaultName: string = null

  private destroy$ = new Subject<boolean>();

  constructor(
    private store: Store<fromRoot.LabSetupStates>,
    private errorLoggerService: ErrorLoggerService
  ) { }

  ngOnInit() {
    try {
      this.loadHeaderTitleData();
      this.labSetupDefaultsErrorSubscription = this.store.pipe(
        select(fromSelector.getLabSetupDefaultsError),
        takeUntil(this.destroy$))
        .subscribe(data => { this.setErrorMessage(data); });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LabSetupDefaultContainerComponent + blankSpace + Operations.OnInit)));
    }
  }

  saveLabConfigurationDefault(accountSettings: AccountSettings) {
    try {
      this.store.dispatch(
        actions.LabSetupDefaultsActions.saveAccountSettings({ accountSettings, navigate: true })
      );
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstrumentManagementComponent + blankSpace + Operations.SaveLabConfigurationDefault)));
    }
  }

  loadHeaderTitleData() {
    this.store.pipe(select(fromSecurity.getCurrentUserDisplayName),
      filter(displayName => !!displayName), takeUntil(this.destroy$))
      .subscribe((displayName: string) => {
        this.labSetupDefaultHeaderTitle = this.labSetupDefaultHeaderTitle.replace('{title}', displayName);
        this.labSetupDefaultName = displayName;
      });
  }

  setErrorMessage(data: Error) {
    // TODO : Revisit this after Lab-setup default persistence is done
    data = null;
    this.errorMessage = data ? data.error : null;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
