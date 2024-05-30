import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { EntityType } from '../../contracts/enums/entity-type.enum';
import { LabSetupDefaults } from '../../contracts/models/lab-setup/lab-setup-defaults.model';
import { Error } from '../../contracts/models/shared/error.model';
import { EntityTypeService } from '../../shared/services/entity-type.service';
import * as fromSelector from './state/selectors';
import * as fromNavigationSelector from '../../shared/navigation/state/selectors';
import * as fromRoot from './state';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-lab-setup',
  templateUrl: './lab-setup.component.html',
  styleUrls: ['./lab-setup.component.scss']
})
export class LabSetupComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<boolean>();
  // TODO: For future use. It will be used for location component, which is currently not in place.
  // countries: any[];
  errorMessage: string = null;
  public showSettings: boolean;

  // Retrieving Errors from the store
  labSetupErrorMessage$: Observable<Error>;
  labSetupDefaultsErrorMessage$: Observable<Error>;
  labConfigLocationErrorMessage$: Observable<Error>;
  labConfigDepartmentErrorMessage$: Observable<Error>;
  labConfigInstrumentErrorMessage$: Observable<Error>;

  // Retrieving values from the store
  navigationState$ = this.store.pipe(select(fromNavigationSelector.getNavigationState));

  // Subscribing to the error states from the stores
  labSetupDefaultsErrorSubscription = this.store.pipe(select(fromSelector.getLabSetupDefaultsError), takeUntil(this.destroy$))
    .subscribe(data => { this.setErrorMessage(data); });
  labConfigDepartmentErrorSubscription = this.store.pipe(select(fromSelector.getLabConfigDepartmentError), takeUntil(this.destroy$))
    .subscribe(data => { this.setErrorMessage(data); });
  labConfigInstrumentErrorSubscription = this.store.pipe(select(fromSelector.getLabConfigInstrumentError), takeUntil(this.destroy$))
    .subscribe(data => { this.setErrorMessage(data); });
  allProductModelsList: any;

  constructor(
    private entityTypeService: EntityTypeService,
    private store: Store<fromRoot.LabSetupStates>,
    private errorLoggerService: ErrorLoggerService) { }

  ngOnInit() {
    // TODO: For future use. It will be used for location component, which is currently not in place.
    // this.creatCountryArray();
    try {
      this.loadShowSettings();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LabSetupComponent + blankSpace + Operations.OnInit)));
    }
  }

  setErrorMessage(data: Error) {
    // TODO : Revisit this after Lab-setup default persistence is done
    data = null;
    this.errorMessage = data ? data.error : null;
  }

  loadShowSettings() {
    this.navigationState$
      .pipe(filter(navigationState => !!navigationState), takeUntil(this.destroy$))
      .subscribe(navigationState => {
        this.showSettings = navigationState.showSettings;
      });
  }

  // TODO: replace this with actual value from server
  labconfigurationdefault: LabSetupDefaults = {
    dataType: 0,
    instrumentsGroupedByDept: true,
    trackReagentCalibrator: false,
    fixedMean: false,
    decimalPlaces: 3,
    siUnits: false
  };

  // TODO: This all has to be done for all the components after setting up ones for Lab Setup Defaults
  getLabDepartmentSource(): string {
    return this.entityTypeService.getNodeTypeSrcString(EntityType.LabDepartment);
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
