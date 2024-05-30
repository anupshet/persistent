// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit, EventEmitter, Output, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { ParsingJobConfig } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { Fields, TransformerFields, DynamicFormFieldRequest } from '../../../../contracts/models/account-management/transformers.model';
import { checkbox, Comma, Decimal, maxlength, title, use_stats, use_stats_hms } from '../../../../core/config/constants/general.const';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';

@Component({
  selector: 'unext-transformer-configuration',
  templateUrl: './transformer-configuration.component.html',
  styleUrls: ['./transformer-configuration.component.scss'],
})
export class TransformerConfigurationComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedTransformer: ParsingJobConfig;
  @Input() accountId: string;
  @Input() labLocationId: string;
  @Input() existingConfigurationsNames: string[];
  @Output() showConfigurations: EventEmitter<any> = new EventEmitter();

  public dynamicFormfields: TransformerFields;
  permissions = Permissions;
  public dynamicForm: FormGroup;
  displayDuplicateErrMsg: boolean;
  public hasFormValuesChanged = false;
  public destroy$ = new Subject<boolean>();
  private previousConfiguredEditData: any;

  constructor(
    private orchestratorApiService: OrchestratorApiService,
    private brPermissionsService: BrPermissionsService,
    private errorLoggerService: ErrorLoggerService,
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // TODO: Dynamic form fields being returned from BE, need to return translated fields
    this.getTransformersFormFields();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getTransformersFormFields();
  }

  public getTransformersFormFields() {
    const payloadIdKey = this.selectedTransformer.isConfigured ? 'parsingJobConfigId' : 'transformerId';
    const formfieldPayload: DynamicFormFieldRequest = {
      [payloadIdKey]: this.selectedTransformer.id,
      locationId: this.labLocationId,
    };

    try {
      this.orchestratorApiService.getTransformersFields(formfieldPayload).then((fields: TransformerFields) => {
        this.createDynamicFormfields(fields);
        if (this.selectedTransformer.isConfigured) {
          this.dynamicForm.patchValue({
            instructionName: fields?.instructionName,
          });
          this.retrieveTransformersConfigurations(fields.config);
        }
        // Disable form for view only permission
        this.checkForViewOnlyRole();
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          componentInfo.TransformerConfigurationComponent + blankSpace + Operations.GetTransformersFormFields
        )
      );
    }
  }

  public retrieveTransformersConfigurations(selectedValues: Array<Fields>) {
    if (selectedValues) {
      selectedValues.forEach((el) => {
        if (el.value) {
          // Convert string value in boolean for type checkbox
          el.value = el.type === checkbox ? el.value === 'true' ? true : false : el.value;
          this.dynamicForm.patchValue({
            [el.key]: el.value,
          });
        }
      });

      const initialFormValues = this.dynamicForm.value;
      this.previousConfiguredEditData = initialFormValues;
      this.hasFormValuesChanged = true;
      this.dynamicForm.valueChanges.subscribe((formValue) => {
        this.hasFormValuesChanged =
          JSON.stringify(formValue) === JSON.stringify(initialFormValues);
      });
    }
  }

  public createDynamicFormfields(fields: TransformerFields) {
    const controls = {};
    this.dynamicFormfields = fields;
    if (this.dynamicFormfields.config) {
      this.dynamicFormfields.config.forEach((res) => {
        const validationsArray = [];
        if (res.isRequired === true) {
          validationsArray.push(Validators.required);
        }
        if (res.maxLength && !res.validDateFormat) {
          validationsArray.push(Validators.maxLength(+res.maxLength));
        }
        if (res.type !== title) {
          if (res.type === checkbox) {
            fields.config.forEach(
              el => el.label = el.label.replace('(Y or N)', '')
            );
            controls[res.key] = new FormControl(false, validationsArray);
          } else {
            controls[res.key] = new FormControl('', validationsArray);
          }
        }
      });
    }
    this.dynamicForm = new FormGroup(controls);
    this.dynamicForm.addControl('instructionName', new FormControl('', [Validators.required, this.instructionNameAlreadyExists()]));
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  public displayErrorMessage(key: string) {
    for (const [err, limit] of Object.entries(this.dynamicForm.controls[key].errors)) {
      if (err === maxlength) {
        return (this.getTranslation('TRANSFORMER.FIELD') + limit.requiredLength);
      } else {
        return this.getTranslation('TRANSFORMER.THIS');
      }
    }
    return '';
  }

  public setValue(value: string) {
    if (value === Decimal || value === Comma) {
      return value === Decimal ? '.' : ',';
    } else {
      return value;
    }
  }

  public setupTransformersForm() {
    return Object.entries(this.dynamicForm.value).map(([key, value]) => ({
      'key': key, 'value': value === true ? 'Y'
        : value === false ? 'N'
          : value
    })).filter(el => el.key !== 'instructionName').filter(el => el.key !== '');
  }



  public onSubmit() {
    const dynamicFormData = this.setupTransformersForm();
    const payloadIdKey = this.selectedTransformer.isConfigured ? 'parsingJobConfigId' : 'transformerId';
    const requestPayload = {
      parsingJobName: this.dynamicForm.controls['instructionName'].value,
      accountId: this.accountId,
      data: dynamicFormData,
      locationId: this.labLocationId
    };
    requestPayload[payloadIdKey] = this.selectedTransformer.id;
    if (this.selectedTransformer.isConfigured) {
      let currentConfigValues;
      requestPayload['data'].forEach(payload => {
        currentConfigValues = {
          ...currentConfigValues, [payload.key]: payload.value === 'Y' ?
            true : payload.value === 'N' ? false : payload.value
        };
      });
      currentConfigValues['instructionName'] = requestPayload['parsingJobName'];
      currentConfigValues['parsingJobName'] = requestPayload['parsingJobName'];
      currentConfigValues['parsingJobConfigid'] = requestPayload[payloadIdKey];
      this.orchestratorApiService.updateTransformerConfiguration(requestPayload).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.appNavigationService.sendAuditTrailPayload({ current: currentConfigValues, prior: this.previousConfiguredEditData },
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Update, AuditTrackingActionStatus.Success, AuditTrackingAction.Update);
        this.showConfigurations.emit(true);
      },
        error => {
          this.appNavigationService.sendAuditTrailPayload({ current: currentConfigValues, prior: this.previousConfiguredEditData },
            AuditTrackingEvent.FileUpload, AuditTrackingAction.Update, AuditTrackingActionStatus.Failure, AuditTrackingAction.Update);
        });
    } else {
      this.orchestratorApiService.addTransformerConfiguration(requestPayload).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.appNavigationService.sendAuditTrailPayload(requestPayload,
          AuditTrackingEvent.FileUpload, AuditTrackingAction.Configure, AuditTrackingActionStatus.Success, AuditTrackingAction.Add);
        this.showConfigurations.emit(true);
      },
        error => {
          this.appNavigationService.sendAuditTrailPayload(requestPayload,
            AuditTrackingEvent.FileUpload, AuditTrackingAction.Configure, AuditTrackingActionStatus.Failure, AuditTrackingAction.Add);
        });
    }
  }

  public chooseOneValidation(value: Fields) {
    if (value.isGrouped) {
      this.dynamicFormfields.config.forEach((res) => {
        if (res.isGrouped) {
          if (value.groupName === res.groupName) {
            if (value.key === res.key) {
              this.dynamicForm.controls[res.key].setValue(true);
            } else {
              this.dynamicForm.controls[res.key].setValue(false);
            }
          }
        }
      });
    }

    this.checkIsSummaryCheckTransformer(value);
  }

  // Bug fix UN-12469: by default select use_first_date value for HBOC and HMS Transformer if Read Summarized Statistics is selected.
  checkIsSummaryCheckTransformer(value: Fields) {
    if (value.isSummaryCheck) {
      if (
        this.dynamicForm.controls[value.key].value === true &&
        (value.key === use_stats || value.key === use_stats_hms)
      ) {
        if (
          this.dynamicForm.controls['use_first_date']?.value === false &&
          this.dynamicForm.controls['use_last_date']?.value === false
        ) {
          this.dynamicForm.controls['use_first_date'].setValue(true);
        }
        if (
          this.dynamicForm.controls['use_fd']?.value === false &&
          this.dynamicForm.controls['use_ld']?.value === false
        ) {
          this.dynamicForm.controls['use_fd'].setValue(true);
        }
      }
    }
  }

  instructionNameAlreadyExists(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const modifiedList = this.selectedTransformer.isConfigured ?
        this.existingConfigurationsNames?.filter((item) => item !== this.selectedTransformer?.name) :
        this.existingConfigurationsNames;
      return modifiedList.includes(control.value) ? { displayDuplicateErrMsg: true } : null;
    };
  }

  public checkForViewOnlyRole() {
    if (this.hasPermissionToAccess([Permissions.ConnectivityConfigurationViewOnly])) {
      this.dynamicForm?.disable();
    } else {
      this.dynamicForm?.enable();
    }
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig
      ? this.brPermissionsService.hasAccess(permissionsConfig)
      : false;
  }

  public onCancel() {
    this.showConfigurations.emit(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
