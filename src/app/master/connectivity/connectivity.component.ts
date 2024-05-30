// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as ngrxStore from '@ngrx/store';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { orderBy } from 'lodash';

import { HeaderService } from './shared/header/header.service';
import * as fromConnectivity from './state';
import { ParsingEngineService } from '../../shared/services/parsing-engine.service';
import * as actions from './state/actions';
import * as sharedStateSelector from '../../shared/state/selectors';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { ErrorType } from '../../contracts/enums/error-type.enum';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { Permissions } from '../../security/model/permissions.model';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { ParsingInfo } from '../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { asc } from '../../core/config/constants/general.const';

@Component({
  selector: 'unext-connectivity',
  templateUrl: './connectivity.component.html',
  styleUrls: ['./connectivity.component.scss']
})
export class ConnectivityComponent implements OnInit, OnDestroy {
  showInstructions: boolean;
  showMapping: boolean;
  showStatus: boolean;
  showUpload: boolean;
  showConfigurations: boolean;
  hasInstructions: boolean;
  labId: string;
  labLocationId: string;
  userId: string;
  userName: string;
  accountId: string;
  accountNumber: string;
  accountLocationTimeZone: string;
  updatedPath: string;
  configurations: ParsingInfo;

  permissions = Permissions;

  protected destroy$ = new Subject<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConnectivityComponent>,
    private _headerService: HeaderService,
    private store: ngrxStore.Store<fromConnectivity.ConnectivityStates>,
    private parsingEngineService: ParsingEngineService,
    private brPermissionsService: BrPermissionsService,
    private errorLoggerService: ErrorLoggerService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.labId = this.data.labId;
    this.userId = this.data.userId;
    this.userName = this.data.userName;
    this.accountId = this.data.accountId;
    this.accountNumber = this.data.accountNumber;
    this.accountLocationTimeZone = this.data.accountLocationTimeZone;

    this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        try {
          this.labLocationId = labLocation.id;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.ConnectivityComponent + blankSpace + Operations.FetchCurrentLocation)));
        }
      });

    this.parsingEngineService.getInstructions(this.labLocationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((instructions) => {
        this.configurations = instructions;
        this.configurations.configs = orderBy(this.configurations.configs, [el => el.name.replace(/\s/g, '')
          .toLocaleLowerCase()], [asc]);

        this.hasInstructions = instructions.configs.length >= 1;
        this.hasInstructions ? this.store.dispatch(actions.connectivityActions.SetHasInstructions({ payload: true }))
          : this.store.dispatch(actions.connectivityActions.ClearHasInstructions({ payload: false }));

        this.store.dispatch(actions.connectivityActions.setConfigurationList({ configurationList: instructions }));

        this.chooseConnectivityComponent();
      });

    this._headerService.getDialogComponent().pipe(
      takeUntil(this.destroy$))
      .subscribe((res) => {
        this.reset();
        this.chooseComponent(res.componentName);
      });

  }

  reset() {
    this.showInstructions = false;
    this.showMapping = false;
    this.showStatus = false;
    this.showUpload = false;
    this.showConfigurations = false;
  }

  chooseComponent(path: string) {
    if (path === unRouting.connectivity.status) {
      this.showStatus = true;
    } else if (path === unRouting.connectivity.upload) {
      this.showUpload = true;
    } else if (path === unRouting.connectivity.configurations) {
      this.showConfigurations = true;
    } else {
      this.showMapping = true;
    }
    this.updatedPath = path;
  }

  setNewPath(path: string) {
    this.updatedPath = path;
  }

  chooseConnectivityComponent() {
    this.router?.url.includes(unRouting.connectivity.mapping) ? this.chooseComponent('mapping') :
      this.router?.url.includes(unRouting.connectivity.configurations) ? this.chooseComponent('configurations') :
        this.router?.url.includes(unRouting.connectivity.status) ? this.chooseComponent('status') : this.chooseComponent('upload');
  }

  // checking Permissions
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}



