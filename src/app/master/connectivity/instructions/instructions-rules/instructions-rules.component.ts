// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../../core/config/constants/error-logging.const';
import { OrchestratorApiService } from '../../../../shared/api/orchestratorApi.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import * as fromRoot from '../../../../state/app.state';
import * as fromSecuritySelector from '../../../../security/state/selectors';
import { ParsingEngineService } from '../../../../shared/services/parsing-engine.service';
import { EdgeBoxIdentifier, ParsingConfig, ParsingInfo } from '../models/parsing-properties.model';
import { ParsingJobConfig } from '../../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

@Component({
  selector: 'unext-instructions-rules',
  templateUrl: './instructions-rules.component.html',
  styleUrls: ['./instructions-rules.component.scss']
})
export class InstructionsRulesComponent implements OnInit, OnDestroy {

  @Input() accountId: string;
  @Input() labLocationId: string;
  @Input() isEdit: boolean;
  @Input() selectedInstruction: ParsingJobConfig;
  @Input() existingConfigurationsNames: string[];
  @Input() selectedInstructionName: string;

  @Output() showConfigurations: EventEmitter<any> = new EventEmitter();

  instrumentCode: string;
  instructionName: string;
  staticInstrumentCode: string;
  productLotLevel: string;
  testCode: string;
  selectedDateTime: string;
  dateTimeResulted: string;
  timeResulted: string;
  mean: string;
  sd: string;
  numPts: string;
  resultValue: string;
  labId: string;

  fieldValuesLength: number;
  isPoint = true;
  isDecimal = true;
  separateQualitativeQuantitative = false;
  capturedDateTime = false;
  readonly dateTimeFormat = ['YMD', 'MDY', 'DMY', 'YDM'];
  isDisabled = true;
  private parsingInfo: ParsingInfo;
  retrievedParsingInfo;
  edgeBoxIdentifiers;
  instructionsForm: FormGroup;
  displayDuplicateErrMsg: boolean;
  permissions = Permissions;
  previousConfiguredEditData: ParsingInfo;

  getCurrentUserState$ = this.store.pipe(select(fromSecuritySelector.getCurrentUser));

  private destroy$ = new Subject<boolean>();

  constructor(
    private store: Store<fromRoot.State>,
    private activatedRoute: ActivatedRoute,
    private parsingServiceApi: ParsingEngineService,
    private formBuilder: FormBuilder,
    private orchestratorApiService: OrchestratorApiService,
    private brPermissionsService: BrPermissionsService,
    private errorLoggerService: ErrorLoggerService,
    private appNavigationService: AppNavigationTrackingService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.labId = paramMap.get('id');
    });

    this.initInstructionsForm();
    this.checkLoggedInUserRole();
    this.checkForViewOnlyRole();
  }

  initInstructionsForm() {
    this.instructionsForm = this.formBuilder.group({
      instructionName: new FormControl('', [this.instructionNameAlreadyExists()]),
      edgeBoxIdentifier: new FormControl(''),
      dataEntry: new FormControl(true),
      instrumentCode: new FormControl(''),
      staticInstrumentCode: new FormControl(''),
      productLotLevel: new FormControl(''),
      testCode: new FormControl(''),
      dateTimeFormats: new FormControl(),
      dateTimeResulted: new FormControl(''),
      timeResulted: new FormControl(''),
      capturedDateTime: new FormControl(false),
      mean: new FormControl(''),
      sd: new FormControl(''),
      numPts: new FormControl(''),
      resultValue: new FormControl(''),
      decimalCommaSeparator: new FormControl(true),
      separateQualitativeQuantitative: new FormControl(true)
    });
  }

  retrieveInstructions(retrievedParsingInfo) {
    this.instructionsForm.patchValue({
      instructionName: retrievedParsingInfo?.name,
      instrumentCode: retrievedParsingInfo?.config.instrumentCodeField,
      staticInstrumentCode: retrievedParsingInfo?.config.staticInstrumentCode,
      productLotLevel: retrievedParsingInfo?.config.controlLotCodeField,
      testCode: retrievedParsingInfo?.config.analyteCodeField,
      dateTimeFormats: retrievedParsingInfo?.config.dateTimeFormat,
      dateTimeResulted: retrievedParsingInfo?.config.dateField,
      timeResulted: retrievedParsingInfo?.config.timeField,
      capturedDateTime: retrievedParsingInfo?.config.capturedDateTime === 'Y' ? !this.capturedDateTime : this.capturedDateTime,
      decimalCommaSeparator: retrievedParsingInfo?.config.decimalSeparator === '.' ? this.isDecimal : !this.isDecimal,
      separateQualitativeQuantitative: retrievedParsingInfo?.config.separateQualitativeQuantitative ?
        !this.separateQualitativeQuantitative : this.separateQualitativeQuantitative,
      resultValue: retrievedParsingInfo?.config.resultField,
      mean: retrievedParsingInfo?.config.meanField,
      sd: retrievedParsingInfo?.config.sdField,
      numPts: retrievedParsingInfo?.config.numPointsField
    });
  }

  instructionNameAlreadyExists(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const modifiedList = this.selectedInstruction.isConfigured ?
        this.existingConfigurationsNames?.filter((item) => item !== this.selectedInstruction?.name) :
        this.existingConfigurationsNames;
      return (modifiedList?.includes(control.value)) ? { displayDuplicateErrMsg: true } : null;
    };
  }

  onPointDataEntryChange(dataEntryType: boolean) {
    this.isPoint = dataEntryType;
    if (this.isPoint) {
      this.instructionsForm.get('mean').clearValidators();
      this.instructionsForm.get('mean').updateValueAndValidity();
      this.instructionsForm.get('sd').clearValidators();
      this.instructionsForm.get('sd').updateValueAndValidity();
      this.instructionsForm.get('numPts').clearValidators();
      this.instructionsForm.get('numPts').updateValueAndValidity();
    } else {
      this.instructionsForm.get('resultValue').clearValidators();
      this.instructionsForm.get('resultValue').updateValueAndValidity();
    }
  }

  onCapturedDateTimeChange(capturedDateTime: boolean) {
    this.capturedDateTime = capturedDateTime;
  }

  onSeparatorChange(isSeparator: boolean) {
    this.isDecimal = isSeparator;
  }

  onButtonChange(buttonType: boolean) {
    this.separateQualitativeQuantitative = buttonType;
  }

  setupInstructionsForm(instructionForm) {
    this.parsingInfo = new ParsingInfo();
    this.parsingInfo.config = new ParsingConfig();

    this.parsingInfo.accountId = this.accountId;
    this.parsingInfo.instructionName = instructionForm.instructionName.trim();
    this.parsingInfo.edgeBoxIdentifier = instructionForm.edgeBoxIdentifier ? instructionForm.edgeBoxIdentifier : '';
    this.parsingInfo.config.instrumentCodeField = instructionForm.instrumentCode;
    this.parsingInfo.config.staticInstrumentCode = instructionForm.staticInstrumentCode ? instructionForm.staticInstrumentCode : '';
    this.parsingInfo.config.controlLotCodeField = instructionForm.productLotLevel;
    this.parsingInfo.config.analyteCodeField = instructionForm.testCode;
    this.parsingInfo.config.dateTimeFormat = instructionForm.dateTimeFormats;
    this.parsingInfo.config.dateField = instructionForm.dateTimeResulted;
    this.parsingInfo.config.timeField = instructionForm.timeResulted ? instructionForm.timeResulted : '';
    this.parsingInfo.config.capturedDateTime = instructionForm.capturedDateTime ? 'Y' : 'N';
    this.parsingInfo.config.decimalSeparator = this.isDecimal ? '.' : ',';
    this.parsingInfo.config.separateQualitativeFromQuantitative = this.separateQualitativeQuantitative;
    if (this.isPoint) {
      this.parsingInfo.config.resultField = instructionForm.resultValue;
      this.parsingInfo.config.meanField = '';
      this.parsingInfo.config.sdField = '';
      this.parsingInfo.config.numPointsField = '';
    } else {
      this.parsingInfo.config.resultField = '';
      this.parsingInfo.config.meanField = instructionForm.mean;
      this.parsingInfo.config.sdField = instructionForm.sd;
      this.parsingInfo.config.numPointsField = instructionForm.numPts;
    }
    return this.parsingInfo;
  }

  updateInstructionsForm(instructionForm) {
    this.parsingInfo = new ParsingInfo();
    this.parsingInfo.config = new ParsingConfig();

    this.parsingInfo.accountId = this.accountId;
    this.parsingInfo.id = this.selectedInstruction.id;
    this.parsingInfo.name = instructionForm.instructionName.trim();
    this.parsingInfo.edgeBoxIdentifier = instructionForm.edgeBoxIdentifier ? instructionForm.edgeBoxIdentifier : '';
    this.parsingInfo.config.instrumentCodeField = instructionForm.instrumentCode;
    this.parsingInfo.config.staticInstrumentCode = instructionForm.staticInstrumentCode ? instructionForm.staticInstrumentCode : '';
    this.parsingInfo.config.controlLotCodeField = instructionForm.productLotLevel;
    this.parsingInfo.config.analyteCodeField = instructionForm.testCode;
    this.parsingInfo.config.dateTimeFormat = instructionForm.dateTimeFormats;
    this.parsingInfo.config.dateField = instructionForm.dateTimeResulted;
    this.parsingInfo.config.timeField = instructionForm.timeResulted ? instructionForm.timeResulted : '';
    this.parsingInfo.config.capturedDateTime = instructionForm.capturedDateTime ? 'Y' : 'N';
    this.parsingInfo.config.decimalSeparator = this.isDecimal ? '.' : ',';
    this.parsingInfo.config.separateQualitativeFromQuantitative = this.separateQualitativeQuantitative;
    if (this.isPoint) {
      this.parsingInfo.config.resultField = instructionForm.resultValue;
      this.parsingInfo.config.meanField = '';
      this.parsingInfo.config.sdField = '';
      this.parsingInfo.config.numPointsField = '';
    } else {
      this.parsingInfo.config.resultField = '';
      this.parsingInfo.config.meanField = instructionForm.mean;
      this.parsingInfo.config.sdField = instructionForm.sd;
      this.parsingInfo.config.numPointsField = instructionForm.numPts;
    }
    return this.parsingInfo;
  }

  public checkForViewOnlyRole() {
    if (this.hasPermissionToAccess([Permissions.ConnectivityConfigurationViewOnly])) {
      this.instructionsForm.disable();
    } else {
      this.instructionsForm.enable();
    }
  }

  public loadEdgeBoxIdentifiersList() {
    try {
      this.orchestratorApiService.getEdgeBoxIdentifiers(this.accountId, this.labLocationId).then((serialNumber: EdgeBoxIdentifier) => {
        if (serialNumber && serialNumber.edgeBoxIdentifiers) {
          this.edgeBoxIdentifiers = serialNumber.edgeBoxIdentifiers;
          if (this.selectedInstruction.isConfigured) {
            this.retrievedParsingInfoById();
          } else if (this.edgeBoxIdentifiers.length === 1) {
            this.instructionsForm.controls.edgeBoxIdentifier.setValue(this.edgeBoxIdentifiers[0]);
          }
        }
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InstructionsRulesComponent + blankSpace + Operations.getEdgeBoxIdentifiers)));
    }
  }

  retrievedParsingInfoById() {
    this.parsingServiceApi.getInstructionsById(this.selectedInstruction.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(instruction => {
        this.retrievedParsingInfo = instruction;
        this.previousConfiguredEditData = this.retrievedParsingInfo;
        this.retrieveInstructions(this.retrievedParsingInfo);
        this.instructionsForm.controls['resultValue'].value === '' ? this.onPointDataEntryChange(false) : this.onPointDataEntryChange(true);
        this.edgeBoxIdentifiers?.unshift(this.retrievedParsingInfo.edgeBoxIdentifier);
        this.instructionsForm.controls.edgeBoxIdentifier.setValue(this.retrievedParsingInfo.edgeBoxIdentifier);
      });
  }

  onSubmit() {
    if (this.selectedInstruction.isConfigured) {
      this.updateInstructionsForm(this.instructionsForm.value);
      const currentConfigValues = {
        ...this.parsingInfo['config'],
        name: this.parsingInfo['name'],
        edgeBoxIdentifier: this.parsingInfo['edgeBoxIdentifier']
      };
      const priorConfigValues = {
        ...this.previousConfiguredEditData['config'],
        name: this.previousConfiguredEditData['name'],
        edgeBoxIdentifier: this.previousConfiguredEditData['edgeBoxIdentifier']
      };
      this.parsingServiceApi.updateInstructions(this.selectedInstruction.id, this.labLocationId, this.parsingInfo)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.instructionsForm.reset();
            this.appNavigationService.sendAuditTrailPayload({ current: currentConfigValues, prior: priorConfigValues },
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Update, AuditTrackingActionStatus.Success, AuditTrackingAction.Update);
            this.showConfigurations.emit(true);
          }
        },
        error => {
          this.appNavigationService.sendAuditTrailPayload({ current: currentConfigValues, prior: priorConfigValues },
            AuditTrackingEvent.FileUpload, AuditTrackingAction.Update, AuditTrackingActionStatus.Failure, AuditTrackingAction.Update);
        });
    } else {
      this.setupInstructionsForm(this.instructionsForm.value);
      this.parsingServiceApi.addInstructions(this.labLocationId, this.parsingInfo)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          res => {
            if (res) {
              this.instructionsForm.reset();
              this.appNavigationService.sendAuditTrailPayload({ ...this.parsingInfo, labLocationId: this.labLocationId },
                AuditTrackingEvent.FileUpload, AuditTrackingAction.Create, AuditTrackingActionStatus.Success, AuditTrackingAction.Add);
              this.showConfigurations.emit(true);
            }
          },
          err => {
            if (err.status === 500) {
              this.displayDuplicateErrMsg = true;
            }
            this.appNavigationService.sendAuditTrailPayload({ ...this.parsingInfo, labLocationId: this.labLocationId },
              AuditTrackingEvent.FileUpload, AuditTrackingAction.Create, AuditTrackingActionStatus.Failure, AuditTrackingAction.Add);
          }
        );
    }
  }

  checkLoggedInUserRole() {
    if (this.hasPermissionToAccess([Permissions.ConnectivityConfiguration])) {
      this.instructionsForm.controls['edgeBoxIdentifier'].enable();
      this.instructionsForm.get('edgeBoxIdentifier').setValidators(Validators.required);
      this.loadEdgeBoxIdentifiersList();
    } else {
      this.instructionsForm.controls['edgeBoxIdentifier'].disable();
      if (this.selectedInstruction.isConfigured) {
        this.edgeBoxIdentifiers = [];
        this.retrievedParsingInfoById();
      }
    }
  }

  onCancel() {
    if (this.selectedInstruction.isConfigured && this.retrievedParsingInfo.edgeBoxIdentifier) {
      this.edgeBoxIdentifiers?.shift(this.retrievedParsingInfo.edgeBoxIdentifier);
    }
    this.instructionsForm.reset();
    this.showConfigurations.emit(true);
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
