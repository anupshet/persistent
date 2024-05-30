// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { isEqual, cloneDeep } from 'lodash';
import { CustomRegex, hasValue, getCalculatedCV, getCalculatedSD } from 'br-component-library';

import { LevelEvaluationMeanSd, LevelFloatingStatistics } from '../../../../contracts/models/lab-setup/level-evaluation-mean-sd.model';
import { maxInputLength, removeKeysArray, decimalPlacesPattern, decimalPlaceholder } from '../../../../core/config/constants/general.const';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { EntityIdWithLevel } from '../../../../contracts/models/lab-setup/analyte-evaluation-mean-sd.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';

@Component({
  selector: 'unext-level-evaluation-mean-sd',
  templateUrl: './level-evaluation-mean-sd.component.html',
  styleUrls: ['./level-evaluation-mean-sd.component.scss'],
  providers: [DecimalPipe, UnityNextNumericPipe]
})
export class LevelEvaluationMeanSdComponent implements OnInit {
  _levelEvaluationMeanSd: LevelEvaluationMeanSd;
  get levelEvaluationMeanSd(): LevelEvaluationMeanSd {
    return this._levelEvaluationMeanSd;
  }
  @Input('levelEvaluationMeanSd')
  set levelEvaluationMeanSd(value: LevelEvaluationMeanSd) {
    try {
      this._levelEvaluationMeanSd = value;
      if (this._levelEvaluationMeanSd) {
        this.beforeFormInit();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.SetLevelEvaluationMeanSd)));
    }
  }
  _levelFloatingStatistics: LevelFloatingStatistics;
  get levelFloatingStatistics(): LevelFloatingStatistics {
    return this._levelFloatingStatistics;
  }
  @Input('levelFloatingStatistics')
  set levelFloatingStatistics(value: LevelFloatingStatistics) {
    try {
      this._levelFloatingStatistics = value;
      this.isFloatingStatistics = (value) ? true : false;
      const callUpdate = (value && this.getfloatingValuesForObj) ?
        (value.entityId === this.getfloatingValuesForObj.entityId && value.level === this.getfloatingValuesForObj.level) : false;
      if (value && !this.isFloatinInitialSet && !this.floatingStatisticsFlag &&
        (this.levelEvaluationMeanSd && (this.levelEvaluationMeanSd.meanEvaluationType === EvaluationType.Floating ||
          this.levelEvaluationMeanSd.sdEvaluationType === EvaluationType.Floating))) {
        this.beforeFormInit();
      }
      if (value && callUpdate && this.isFloatinInitialSet) {
        this.updateFloatingValues();
      }
      if (!callUpdate && this.floatingStatisticsFlag && this.levelEvaluationMSForm) {
        this.toggleValues();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.SetLevelFloatingStatistics)));
    }
  }

  _floatingStatisticsFlag: boolean;
  get floatingStatisticsFlag(): boolean {
    return this._floatingStatisticsFlag;
  }
  @Input('floatingStatisticsFlag')
  set floatingStatisticsFlag(value: boolean) {
    try {
      this.getfloatingValuesForObj = null;
      this._floatingStatisticsFlag = value;
      if (this._floatingStatisticsFlag && this.levelEvaluationMSForm) {
        this.levelEvaluationMSForm.patchValue({
          meanEvaluationType: EvaluationType.Fixed,
          sdEvaluationType: EvaluationType.Fixed,
          cvEvaluationType: EvaluationType.Fixed
        });
      }
      if (this.levelEvaluationMSForm) {
        this.toggleValues();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.SetFloatingStatisticsFlag)));
    }
  }

  @Input() isArchived: boolean;
  @Input() decimalPlaces: number;
  @Output() emitterLevelEvaluationMeanSd = new EventEmitter<LevelEvaluationMeanSd>();
  @Output() emitterLevelFormValid = new EventEmitter();
  @Output() emitterGetFloatValues = new EventEmitter<EntityIdWithLevel>();
  levelEvaluationMSForm: FormGroup;
  public meanPlaceholder: string;
  public cvPlaceholder: string;
  public sdPlaceholder: string;
  public isSdEdited = false;
  public isCvEdited = false;
  public isMeanEdited = false;
  public regexRationalNumber = CustomRegex.RATIONAL_NUMBER;
  public currentValues: any;
  public isFloatingStatistics = false;
  public initialValues: LevelEvaluationMeanSd;
  public getfloatingValuesForObj: EntityIdWithLevel;
  public isFloatinInitialSet = false;
  public patternToDecimal: string;
  constructor(
    private _decimalPipe: DecimalPipe,
    private brPermissionsService: BrPermissionsService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService,
    private unityNextNumericPipe: UnityNextNumericPipe
  ) { }

  ngOnInit() {
    try {
      this.populateLabels();
      this.beforeFormInit();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.OnInit)));
    }
  }

  beforeFormInit() {
    const regexPattern: RegExp = new RegExp(decimalPlaceholder, 'g');
    this.patternToDecimal = (hasValue(this.decimalPlaces)) ?
      decimalPlacesPattern.replace(regexPattern, this.decimalPlaces.toString()) : '';
    let formInitValues;
    if (this.isFloatingStatistics && (((this.levelEvaluationMeanSd.meanEvaluationType === EvaluationType.Floating ||
      this.levelEvaluationMeanSd.sdEvaluationType === EvaluationType.Floating)) || this.floatingStatisticsFlag)) {
      const tempFloatingStats = cloneDeep(this.levelFloatingStatistics);
      if (!this.floatingStatisticsFlag && this.levelEvaluationMeanSd.meanEvaluationType === EvaluationType.Fixed) {
        delete tempFloatingStats.mean;
      }
      if (!this.floatingStatisticsFlag && this.levelEvaluationMeanSd.sdEvaluationType === EvaluationType.Fixed) {
        delete tempFloatingStats.sd;
        delete tempFloatingStats.cv;
      }
      formInitValues = { ...this.levelEvaluationMeanSd, ...tempFloatingStats };
      if (this.floatingStatisticsFlag) {
        formInitValues.meanEvaluationType = EvaluationType.Fixed;
        formInitValues.sdEvaluationType = EvaluationType.Fixed;
        formInitValues.cvEvaluationType = EvaluationType.Fixed;
      }
      this.isFloatinInitialSet = ((this.levelFloatingStatistics.entityId === this.levelEvaluationMeanSd.entityId) &&
        (hasValue(this.levelFloatingStatistics.mean) || hasValue(this.levelFloatingStatistics.sd) ||
          hasValue(this.levelFloatingStatistics.cv))) ? true : false;
    } else {
      formInitValues = this.levelEvaluationMeanSd;
    }
    this.initialValues = {
      ...cloneDeep(formInitValues),
      ...{
        mean: (hasValue(formInitValues.mean)) ? +this.getDecimalPlaceConvertedValue(formInitValues.mean) : null,
        sd: (hasValue(formInitValues.sd)) ? +this.getDecimalPlaceConvertedValue(formInitValues.sd) : null,
        cv: (hasValue(formInitValues.cv)) ? +this.getDecimalPlaceConvertedValue(formInitValues.cv) : null,
        meanEvaluationType: (hasValue(formInitValues.meanEvaluationType)) ? formInitValues.meanEvaluationType : EvaluationType.Fixed,
        sdEvaluationType: (hasValue(formInitValues.sdEvaluationType)) ? formInitValues.sdEvaluationType : EvaluationType.Fixed,
        cvEvaluationType: (hasValue(formInitValues.cvEvaluationType)) ? formInitValues.cvEvaluationType : EvaluationType.Fixed
      }
    };
    this.currentValues = {
      mean: (hasValue(this.levelEvaluationMeanSd.mean)) ?
        this.getDecimalPlaceConvertedValue(this.levelEvaluationMeanSd.mean) : null,
      sd: (hasValue(this.levelEvaluationMeanSd.sd)) ?
        this.getDecimalPlaceConvertedValue(this.levelEvaluationMeanSd.sd) : null,
      cv: (hasValue(this.levelEvaluationMeanSd.cv)) ?
        this.getDecimalPlaceConvertedValue(this.levelEvaluationMeanSd.cv) : null
    };
    // if Float selected then load cumulative values at initial as per acceptance criteria
    if (!this.floatingStatisticsFlag && (this.levelEvaluationMeanSd.meanEvaluationType === EvaluationType.Floating ||
      this.levelEvaluationMeanSd.sdEvaluationType === EvaluationType.Floating)) {
      const isfloatingCalled = (formInitValues && this.getfloatingValuesForObj) ?
        (formInitValues.entityId === this.getfloatingValuesForObj.entityId &&
          formInitValues.level === this.getfloatingValuesForObj.level) : false;
      if (!isfloatingCalled) {
        this.getFloatingValues();
      }
    }
    this.setInitForm(formInitValues);
  }

  toggleValues() {
    try {
      if (this.isFloatingStatistics && this.floatingStatisticsFlag) {
        const currentFormValues = this.getFormCurrentValues();
        if (!currentFormValues.sdIsCalculated && !currentFormValues.cvIsCalculated) {
          currentFormValues.cvIsCalculated = true;
        }
        const formInitValues = { ...currentFormValues, ...this.levelFloatingStatistics };
        this.setInitForm(formInitValues);
      } else {
        const floatMean = (this.levelFloatingStatistics && hasValue(this.levelFloatingStatistics.mean)) ?
          this.getDecimalPlaceConvertedValue(this.levelFloatingStatistics.mean) : null;
        const floatSd = (this.levelFloatingStatistics && hasValue(this.levelFloatingStatistics.sd)) ?
          this.getDecimalPlaceConvertedValue(this.levelFloatingStatistics.sd) : null;
        const floatCv = (this.levelFloatingStatistics && hasValue(this.levelFloatingStatistics.cv)) ?
          this.getDecimalPlaceConvertedValue(this.levelFloatingStatistics.cv) : null;
        const valuesToSet = {
          mean: (this.levelEvaluationMeanSd.meanEvaluationType === EvaluationType.Floating) ?
            floatMean : this.currentValues.mean,
          sd: (this.levelEvaluationMeanSd.sdEvaluationType === EvaluationType.Floating) ?
            floatSd : this.currentValues.sd,
          cv: (this.levelEvaluationMeanSd.cvEvaluationType === EvaluationType.Floating) ?
            floatCv : this.currentValues.cv,
        };
        const formInitValues = (this.levelEvaluationMSForm) ?
          { ...this.getFormCurrentValues(), ...valuesToSet } :
          { ...this.levelEvaluationMeanSd, ...valuesToSet };
        this.setInitForm(formInitValues);
      }
      this.emitOutput();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.ToggleValues)));
    }
  }
  getFormCurrentValues() {
    const levelFormValues = this.levelEvaluationMSForm.getRawValue();
    levelFormValues.mean = this.replaceComma(levelFormValues.mean);
    levelFormValues.sd = this.replaceComma(levelFormValues.sd);
    levelFormValues.cv = this.replaceComma(levelFormValues.cv);
    const outputValues: LevelEvaluationMeanSd = {
      ...levelFormValues,
      ...{
        entityId: this.levelEvaluationMeanSd.entityId,
        mean: (levelFormValues.meanEvaluationType === EvaluationType.Fixed) ?
          +levelFormValues.mean : null,
        sd: (levelFormValues.sdEvaluationType === EvaluationType.Fixed) ?
          +levelFormValues.sd : null,
        cv: (levelFormValues.sdEvaluationType === EvaluationType.Fixed) ?
          +levelFormValues.cv : null,
        //  TODO: Remove when Evaluation type flag is one for both SD and CV,
        // currently there are two different flags even there is only one radio button for both
        // EvaluationType should be same for both SD and CV
        cvEvaluationType: levelFormValues.sdEvaluationType
      }
    };
    return outputValues;
  }

  populateLabels() {
    this.meanPlaceholder = this.getTranslation('LEVELEVALUATIONMEANSD.MEAN');
    this.sdPlaceholder = this.getTranslation('LEVELEVALUATIONMEANSD.SD');
    this.cvPlaceholder = this.getTranslation('LEVELEVALUATIONMEANSD.CV');
  }

  greaterThanZero: ValidatorFn = (control: FormControl): ValidationErrors | null => {
    if (Number(control.value) <= 0) {
      return { nonZero: true };
    } else {
      return null;
    }
  }

  setInitForm(data) {
    const meanData = (hasValue(data.mean)) ? this.getDecimalPlaceConvertedValue(this.replaceComma(data.mean.toString())) : null;
    const sdData = (hasValue(data.sd)) ? this.getDecimalPlaceConvertedValue(this.replaceComma(data.sd.toString())) : null;
    const cvData = (hasValue(data.cv)) ? this.getDecimalPlaceConvertedValue(this.replaceComma(data.cv.toString())) : null;
    this.levelEvaluationMSForm = new FormGroup({
      level: new FormControl(data.level),
      meanEvaluationType: new FormControl(
        { value: (data.meanEvaluationType) ? data.meanEvaluationType : EvaluationType.Fixed, disabled: this.isArchived }),
      mean: new FormControl({ value: meanData, disabled: data.meanEvaluationType === EvaluationType.Floating || this.isArchived },
        [Validators.required, Validators.maxLength(maxInputLength)]),
      sdEvaluationType: new FormControl(
        { value: (data.sdEvaluationType) ? data.sdEvaluationType : EvaluationType.Fixed, disabled: this.isArchived }),
      sd: new FormControl({
        value: sdData,
        disabled: (data.sdEvaluationType === EvaluationType.Floating || this.isArchived) ? true :
          (hasValue(data.sdIsCalculated) ? data.sdIsCalculated : false)
      },
        [Validators.required, Validators.maxLength(maxInputLength),
        this.greaterThanZero]),
      sdIsCalculated: new FormControl(hasValue(data.sdIsCalculated) ? data.sdIsCalculated : false),
      cvEvaluationType: new FormControl((data.cvEvaluationType) ? data.cvEvaluationType : EvaluationType.Fixed),
      cv: new FormControl({
        value: cvData,
        disabled: (data.cvEvaluationType === EvaluationType.Floating || this.isArchived) ? true :
          (hasValue(data.cvIsCalculated) ? data.cvIsCalculated : true)
      },
        [Validators.required, Validators.maxLength(maxInputLength),
        this.greaterThanZero]),
      cvIsCalculated: new FormControl(hasValue(data.cvIsCalculated) ? data.cvIsCalculated : true)
    });

    if (meanData === null && sdData === null && cvData === null) {
      this.levelEvaluationMSForm.get('mean').clearValidators();
      this.levelEvaluationMSForm.get('sd').clearValidators();
      this.levelEvaluationMSForm.get('cv').clearValidators();
      this.levelEvaluationMSForm.updateValueAndValidity();
  }
    if (!this.floatingStatisticsFlag) {
      this.currentValues = {
        mean: meanData,
        sd: sdData,
        cv: cvData
      };
    } else {
      this.markInputsTouched();
    }

    if (this.hasPermissionToAccess([Permissions.EvalMeanSDCV])) {
      this.levelEvaluationMSForm.enable();
    } else {
      this.levelEvaluationMSForm.disable();
    }
  }
  enableDisableInput(e: string) {
    try {
      if (this.levelEvaluationMSForm.get('sdEvaluationType').value === EvaluationType.Fixed) {
        if (e === this.sdPlaceholder) {
          this.levelEvaluationMSForm.get('sd').enable();
          this.levelEvaluationMSForm.get('cv').disable();
          this.levelEvaluationMSForm.get('sdIsCalculated').setValue(false);
          this.levelEvaluationMSForm.get('cvIsCalculated').setValue(true);
        } else {
          this.levelEvaluationMSForm.get('cv').enable();
          this.levelEvaluationMSForm.get('sd').disable();
          this.levelEvaluationMSForm.get('sdIsCalculated').setValue(true);
          this.levelEvaluationMSForm.get('cvIsCalculated').setValue(false);
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.EnableDisableInput)));
    }
  }

  inputsChanged() {
    try {
      this.calculateValuesbyFormula();
      this.markInputsTouched();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.InputsChanged)));
    }
  }

  inputsLoseFocus(currentValue: string, fieldName: string) {
    if (fieldName === this.sdPlaceholder) {
      const initialValue = (this.initialValues && this.initialValues.sd) ? this.initialValues.sd.toString() : '';
      if (initialValue === currentValue && !this.isSdEdited) {
        this.emitOutput();
      }
    } else {
      const initialValue = (this.initialValues && this.initialValues.cv) ? this.initialValues.cv.toString() : '';
      if (initialValue === currentValue && !this.isCvEdited) {
        this.emitOutput();
      }
    }
    this.markInputsTouched();
  }

  inputsGetsFocus(currentValue: string, fieldName: string) {
    if (fieldName === this.sdPlaceholder) {
      const initialValue = (this.initialValues && this.initialValues.sd) ? this.initialValues.sd.toString() : '';
      if (initialValue !== currentValue && !this.isSdEdited) {
        this.isSdEdited = true;
      }
    } else {
      const initialValue = (this.initialValues && this.initialValues.cv) ? this.initialValues.cv.toString() : '';
      if (initialValue !== currentValue && !this.isCvEdited) {
        this.isCvEdited = true;
      }
    }
  }

  onMeanChange() {
    try {
      const initialValue = (this.initialValues && this.initialValues.mean) ? this.initialValues.mean.toString() : '';
      const mean = (this.levelEvaluationMSForm.get('mean').value) ?
      parseFloat(this.replaceComma(this.levelEvaluationMSForm.get('mean').value)) : 0;
      if (initialValue !== mean.toString()) {
        this.isMeanEdited = true;
      } else {
        this.isMeanEdited = false;
      }
      this.calculateValuesbyFormula();
      this.markInputsTouched();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.OnMeanChange)));
    }
  }

  replaceComma(value: string): string {
    return value.replace(/\s/g, '').replace(',', '.');
  }

  calculateValuesbyFormula() {
    let res: number;
    const formMean = this.levelEvaluationMSForm.get('mean');
    const formCv = this.levelEvaluationMSForm.get('cv');
    const formSd = this.levelEvaluationMSForm.get('sd');

    const cvValue = (formCv.value && !isNaN(+this.replaceComma(formCv.value))) ?
      parseFloat(this.replaceComma(formCv.value)) : 0;
    const sdValue = (formSd.value && !isNaN(+this.replaceComma(formSd.value))) ?
      parseFloat(this.replaceComma(formSd.value)) : 0;
    const mean = (formMean.value && !isNaN(+this.replaceComma(formMean.value))) ?
      parseFloat(this.replaceComma(formMean.value)) : 0;
    if (!this.floatingStatisticsFlag && mean) {
      this.currentValues.mean = this.getDecimalPlaceConvertedValue(mean);
    }
    if (this.levelEvaluationMSForm.get('sdIsCalculated').value) {
      // calculate SD
      const initialValue = (this.initialValues && this.initialValues.cv) ? this.initialValues.cv.toString() : '';
      if ((initialValue !== cvValue.toString() || this.isMeanEdited) && cvValue > 0) {
        this.isCvEdited = true;
      } else {
        this.isCvEdited = false;
      }
      res = (mean) ? getCalculatedSD(mean, cvValue) : 0;
      if (!this.floatingStatisticsFlag) {
        this.currentValues.sd = this.limitToLength(res.toString(), maxInputLength);
        this.currentValues.cv = this.getDecimalPlaceConvertedValue(cvValue.toString());
      }
      formSd.setValue(this.limitToLength(res.toString(), maxInputLength));

    } else if (this.levelEvaluationMSForm.get('cvIsCalculated').value) {
      // calculate CV
      const initialValue = (this.initialValues && this.initialValues.sd) ? this.initialValues.sd.toString() : '';
      if ((initialValue !== sdValue.toString() || this.isMeanEdited) && sdValue > 0) {
        this.isSdEdited = true;
      } else {
        this.isSdEdited = false;
      }
      res = (sdValue && mean) ? getCalculatedCV(mean, sdValue) : 0;
      if (!this.floatingStatisticsFlag) {
        this.currentValues.cv = this.limitToLength(res.toString(), maxInputLength);
        this.currentValues.sd = this.getDecimalPlaceConvertedValue(sdValue.toString());
      }
      formCv.setValue(this.limitToLength(res.toString(), maxInputLength));
    }
    this.emitOutput();
  }

  limitToLength(value: string, length: number) {
    value = this.getDecimalPlaceConvertedValue(value);
    return value.slice(0, length);
  }

  emitOutput() {
    const formRawValues = this.levelEvaluationMSForm.getRawValue();
    formRawValues.mean = this.replaceComma(formRawValues.mean);
    formRawValues.sd = this.replaceComma(formRawValues.sd);
    formRawValues.cv = this.replaceComma(formRawValues.cv);
    const initUserInputValues = cloneDeep(this.initialValues);
    const currentValues = {
      entityId: this.levelEvaluationMeanSd.entityId,
      level: formRawValues.level,
      mean: (formRawValues.mean) ? +formRawValues.mean : null,
      sd: (formRawValues.sd) ? +formRawValues.sd : null,
      cv: (formRawValues.cv) ? +formRawValues.cv : null,
      sdEvaluationType: formRawValues.sdEvaluationType,
      cvEvaluationType: formRawValues.sdEvaluationType,
      meanEvaluationType: formRawValues.meanEvaluationType
    };
    removeKeysArray.forEach((key) => {
      delete initUserInputValues[key];

    });
    const isChanged = !isEqual(initUserInputValues, currentValues);
    const finalOutput = this.getFormCurrentValues();
    const formValid = {
      isFormDirty: <boolean>this.levelEvaluationMSForm.dirty,
      isFormChanged: <boolean>isChanged,
      isFormValid: <boolean>this.levelEvaluationMSForm.valid,
      level: <number>finalOutput.level,
      entityId: <string>finalOutput.entityId
    };
    if (this.levelEvaluationMSForm.valid) {
      if (finalOutput.sdEvaluationType === EvaluationType.Floating && finalOutput.cvEvaluationType === EvaluationType.Floating) {
        finalOutput.sdIsCalculated = finalOutput.cvIsCalculated = false;
      }
      this.emitterLevelEvaluationMeanSd.emit(finalOutput);
    }
    this.emitterLevelFormValid.emit(formValid);
  }

  onSdCvFixedFloatChange(selectedValue: EvaluationType) {
    try {
      this.isFloatinInitialSet = true;
      if (selectedValue === EvaluationType.Floating) {
        this.getFloatingValues();
        this.levelEvaluationMSForm.patchValue({
          sdIsCalculated: false,
          cvIsCalculated: false
        });
        this.levelEvaluationMSForm.get('sd').disable();
        this.levelEvaluationMSForm.get('cv').disable();
      } else {
        // if both sdIsCalculated and cvIsCalculated are false then set cvIsCalculated to true by default
        // when user changes float to fixed
        if (!this.levelEvaluationMSForm.get('sdIsCalculated').value && !this.levelEvaluationMSForm.get('cvIsCalculated').value) {
          this.levelEvaluationMSForm.get('cvIsCalculated').setValue(true);
        }
        this.updateFixedValues();
      }
      this.emitOutput();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.OnSdCvFixedFloatChange)));
    }
  }

  onMeanFixedFloatChange(selectedValue: EvaluationType) {
    try {
      this.isFloatinInitialSet = true;
      if (selectedValue === EvaluationType.Floating) {
        this.getFloatingValues();
        this.levelEvaluationMSForm.get('mean').disable();
      } else {
        this.levelEvaluationMSForm.get('mean').enable();
        this.updateFixedValues();
      }
      this.emitOutput();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.OnMeanFixedFloatChange)));
    }
  }

  getFloatingValues() {
    this.getfloatingValuesForObj = {
      entityId: this.levelEvaluationMeanSd.entityId,
      level: this.levelEvaluationMeanSd.level
    };
    this.emitterGetFloatValues.emit(this.getfloatingValuesForObj);
  }

  updateFloatingValues() {
    this.markInputsTouched();
    const meanEvaluationType = this.levelEvaluationMSForm.get('meanEvaluationType').value;
    const sdEvaluationType = this.levelEvaluationMSForm.get('sdEvaluationType').value;
    const meanFloatValue = hasValue(this.levelFloatingStatistics.mean) ?
      this.getDecimalPlaceConvertedValue(this.levelFloatingStatistics.mean) : null;
    const sdFloatValue = hasValue(this.levelFloatingStatistics.sd) ?
      this.getDecimalPlaceConvertedValue(this.levelFloatingStatistics.sd) : null;
    const cvFloatValue = hasValue(this.levelFloatingStatistics.cv) ?
      this.getDecimalPlaceConvertedValue(this.levelFloatingStatistics.cv) : null;
    if (meanEvaluationType === EvaluationType.Floating && meanFloatValue &&
      this.levelEvaluationMSForm.get('mean').value !== meanFloatValue) {
      this.levelEvaluationMSForm.get('mean')
        .setValue(meanFloatValue);
      this.calculateValuesbyFormula();
    }
    if (sdEvaluationType === EvaluationType.Floating &&
      sdFloatValue &&
      cvFloatValue &&
      (this.levelEvaluationMSForm.get('sd').value !== sdFloatValue ||
        this.levelEvaluationMSForm.get('cv').value !== cvFloatValue)) {
      this.levelEvaluationMSForm.patchValue({
        sd: sdFloatValue,
        cv: cvFloatValue
      });
      this.calculateValuesbyFormula();
    }
  }

  updateFixedValues() {
    this.markInputsTouched();
    const meanEvaluationType = this.levelEvaluationMSForm.get('meanEvaluationType').value;
    const sdEvaluationType = this.levelEvaluationMSForm.get('sdEvaluationType').value;
    if (meanEvaluationType === EvaluationType.Fixed && this.currentValues && hasValue(this.currentValues.mean)) {
      this.levelEvaluationMSForm.get('mean')
        .setValue(this.getDecimalPlaceConvertedValue(this.currentValues.mean));
    }
    if (sdEvaluationType === EvaluationType.Fixed && this.currentValues &&
      hasValue(this.currentValues.sd) && hasValue(this.currentValues.cv)) {
      this.levelEvaluationMSForm.patchValue({
        sd: this.getDecimalPlaceConvertedValue(this.currentValues.sd),
        cv: this.getDecimalPlaceConvertedValue(this.currentValues.cv)
      });
    }
    if (sdEvaluationType === EvaluationType.Fixed && !this.levelEvaluationMSForm.get('sdIsCalculated').value) {
      this.levelEvaluationMSForm.get('sd').enable();
    }
    if (sdEvaluationType === EvaluationType.Fixed && !this.levelEvaluationMSForm.get('cvIsCalculated').value) {
      this.levelEvaluationMSForm.get('cv').enable();
    }
    this.calculateValuesbyFormula();
  }

  getDecimalPlaceConvertedValue(actualValue) {
    return this.unityNextNumericPipe.transform(actualValue, false, this.decimalPlaces);
  }

  markInputsTouched() {
    this.levelEvaluationMSForm.get('mean').markAsTouched();
    this.levelEvaluationMSForm.get('cv').markAsTouched();
    this.levelEvaluationMSForm.get('sd').markAsTouched();
  }

  applyFormulaToValues(levelEvaluationMeanSd: LevelEvaluationMeanSd) {
    try {
      let sd = (hasValue(levelEvaluationMeanSd.sd)) ? +this.getDecimalPlaceConvertedValue(levelEvaluationMeanSd.sd) : null;
      let cv = (hasValue(levelEvaluationMeanSd.cv)) ? +this.getDecimalPlaceConvertedValue(levelEvaluationMeanSd.cv) : null;
      const mean = (hasValue(levelEvaluationMeanSd.mean)) ? +this.getDecimalPlaceConvertedValue(levelEvaluationMeanSd.mean) : null;
      if (sd && cv) {
        if (levelEvaluationMeanSd.sdIsCalculated) {
          sd = (mean) ? getCalculatedSD(mean, cv) : 0;
        }
        if (levelEvaluationMeanSd.cvIsCalculated) {
          cv = (mean && sd) ? getCalculatedCV(mean, sd) : 0;
        }
        return {
          ...levelEvaluationMeanSd, ...{
            mean: (mean) ? +this.getDecimalPlaceConvertedValue(mean) : null,
            sd: +this.getDecimalPlaceConvertedValue(sd),
            cv: +this.getDecimalPlaceConvertedValue(cv)
          }
        };
      } else {
        return levelEvaluationMeanSd;
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.LevelEvaluationMeanSdComponent + blankSpace + Operations.ApplyFormulaToValues)));
    }
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
