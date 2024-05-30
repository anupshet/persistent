// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { filter, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { DataEntryMode } from '../../../contracts/models/lab-setup/data-entry-mode.enum';
import * as sharedStateSelector from '../../../shared/state/selectors';
import * as fromRoot from '../../../state/app.state';
import { AccountSettings } from '../../../contracts/models/lab-setup/account-settings.model';
import { LabSetupDefaults } from '../../../contracts/models/lab-setup/lab-setup-defaults.model';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../models/audit-tracking.model';

@Component({
  selector: 'unext-lab-settings-dialog',
  templateUrl: './lab-settings-dialog.component.html',
  styleUrls: ['./lab-settings-dialog.component.scss']
})
export class LabSettingsDialogComponent implements OnInit {
  summary = DataEntryMode.Summary;
  point = DataEntryMode.Point;
  decimalPlacesData = ['0', '1', '2', '3', '4'];
  labSettingsForm: FormGroup;
  hasValuesChanged: boolean;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];
  labSetting: AccountSettings;

  public getCurrentLabLocation$ = this.store.select(sharedStateSelector.getCurrentLabLocation);
  permissions = Permissions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LabSettingsDialogComponent>,
    private formBuilder: FormBuilder,
    private iconService: IconService,
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private appNavigationService: AppNavigationTrackingService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LabSettingsDialogComponent + blankSpace + Operations.AddIcons)));
    }
  }

  ngOnInit(): void {
    const auditTrailPayload: AppNavigationTracking = this.appNavigationService
      .comparePriorAndCurrentValues({}, {}, AuditTrackingAction.View, AuditTrackingEvent.Preferences, AuditTrackingActionStatus.Success);
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    this.setupLabSettingsForm();
    /* Applying Permissions to the Accounts Form */
    if (this.hasPermissionToAccess([Permissions.LabSettingsViewOnly])) {
      this.labSettingsForm.disable();
    } else {
      this.labSettingsForm.enable();
    }
    this.getAccountSettings();
  }

  public setupLabSettingsForm() {
    this.labSettingsForm = this.formBuilder.group({
      dataType: [],
      trackReagentCalibrator: [],
      decimalPlaces: ['', [Validators.required, Validators.min(0), Validators.max(4)]],
      siUnits: [false],
      instrumentsGroupedByDept: true
    });
  }

  public getAccountSettings() {
    this.getCurrentLabLocation$.pipe(filter(location => !!location), take(1))
      .subscribe(location => {
        if (location && location.locationSettings) {
          this.patchAccountSettingsValue(location.locationSettings);
          this.labSetting = location.locationSettings;
        }
      });
  }

  public patchAccountSettingsValue(locationSettings: AccountSettings) {
    if (locationSettings) {
      this.labSettingsForm.patchValue({
        dataType: locationSettings.dataType,
        trackReagentCalibrator: locationSettings.trackReagentCalibrator,
        decimalPlaces: locationSettings.decimalPlaces.toString(),
        siUnits: locationSettings.siUnits,
        instrumentsGroupedByDept: locationSettings.instrumentsGroupedByDept
      });
    }

    const intialAccountSettings = this.labSettingsForm.value;
    this.labSettingsForm.valueChanges.subscribe(formValue => {
      this.hasValuesChanged = JSON.stringify(formValue) !== JSON.stringify(intialAccountSettings);
    });
  }

  public onUpdateClick(labSetupDefaults: LabSetupDefaults) {
    try {
      const labSettingsFormValues = {
        ...new AccountSettings(), ...labSetupDefaults,
        auditTrail: {
          labSettingsDialogComponent: true, priorLabSettingsValue: this.labSetting,
          currentLabSettingsValue: { ...labSetupDefaults, decimalPlaces: +labSetupDefaults.decimalPlaces }
        }
      };
      this.dialogRef.close(labSettingsFormValues);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LabSettingsDialogComponent + blankSpace + Operations.sendAuditTrailPayloadError)));
    }
  }

  public onBackClick() {
    this.labSettingsForm.reset();
    this.getAccountSettings();
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

}
