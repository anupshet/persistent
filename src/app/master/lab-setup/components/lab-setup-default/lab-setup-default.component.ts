// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ApplicationInitStatus, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BrMouseOver, BrValidators, ErrorStateMatcherMouseOver } from 'br-component-library';

import { DataEntryMode } from '../../../../contracts/models/lab-setup/data-entry-mode.enum';
import { LabSetupDefaults } from '../../../../contracts/models/lab-setup/lab-setup-defaults.model';
import { HeaderType } from '../../../../contracts/enums/lab-setup/header-type.enum';
import { AccountSettings } from '../../../../contracts/models/lab-setup/account-settings.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';

@Component({
  selector: 'unext-lab-setup-default',
  templateUrl: './lab-setup-default.component.html',
  styleUrls: ['./lab-setup-default.component.scss']
})
export class LabSetupDefaultComponent implements OnInit {

  public type = HeaderType;
  public placeholder = 'Decimal places';
  @Input() currentNode: number;
  @Input() title: string;
  @Input() fullName: string;

  @Input() labconfigurationdefault: LabSetupDefaults;
  @Input() errorMessage: string;
  @Output() saveLabConfigurationDefault = new EventEmitter<AccountSettings>();

  labSetupForm: FormGroup;
  mouseOverSubmit = new BrMouseOver();
  errorStateMatcherMouseOver: ErrorStateMatcherMouseOver;
  errorStateMatchesForPassword: ErrorStateMatcherMouseOver;
  errorNames = BrValidators.ErrorNames;
  summary = DataEntryMode.Summary;
  point = DataEntryMode.Point;
  decimalPlacesData = ['0', '1', '2', '3', '4'];
  permissions = Permissions;


  constructor(private formBuilder: FormBuilder,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private appNavigationService: AppNavigationTrackingService) { }

  ngOnInit() {
    try {
      this.errorStateMatcherMouseOver = new ErrorStateMatcherMouseOver(this.mouseOverSubmit);
      this.setDefaultForm();

      if (this.labconfigurationdefault) {
        this.loadForm(this.labconfigurationdefault);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnInit)));
    }

    const auditTrailPayload: AppNavigationTracking = this.appNavigationService
      .comparePriorAndCurrentValues({}, {}, AuditTrackingAction.View, AuditTrackingEvent.Preferences, AuditTrackingActionStatus.Success);
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
  }

  setDefaultForm() {
    this.labSetupForm = this.formBuilder.group({
      dataType: [this.summary],
      instrumentsGroupedByDept: [true],
      trackReagentCalibrator: [true],
      fixedMean: [true],
      decimalPlaces: ['', [Validators.required, Validators.min(0), Validators.max(4), BrValidators.noEmptyString]],
      siUnits: [false]
    });
  }

  onSubmit(labSetupDefaults: LabSetupDefaults) {
    try {
      const labConfigFormValues = {
        ...new AccountSettings(), ...labSetupDefaults,
        auditTrail: {
          labSettingsDialogComponent: true,
          priorLabSettingsValue: this.labconfigurationdefault,
          currentLabSettingsValue: { ...labSetupDefaults, decimalPlaces: +labSetupDefaults.decimalPlaces }
        }
      };
      this.saveLabConfigurationDefault.emit(labConfigFormValues);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  // load the form for edit after retrieving from server
  loadForm(labconfigurationdefault: LabSetupDefaults) {
    this.labSetupForm.setValue({
      dataType: labconfigurationdefault.dataType,
      instrumentsGroupedByDept: labconfigurationdefault.instrumentsGroupedByDept,
      trackReagentCalibrator: labconfigurationdefault.trackReagentCalibrator,
      fixedMean: labconfigurationdefault.fixedMean, // TODO: need to change the interface as boolean
      decimalPlaces: labconfigurationdefault.decimalPlaces.toString(),
      siUnits: labconfigurationdefault.siUnits
    });
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }
}
