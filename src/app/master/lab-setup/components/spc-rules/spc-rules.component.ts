// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormArray, FormGroup, FormBuilder, Validators, ValidatorFn, FormControl } from '@angular/forms';

import { Subscription, Subject } from 'rxjs';
import { filter, map, pairwise, take, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import * as ngrxStore from '@ngrx/store';
import { select } from '@ngrx/store';

import { SpcRulesService } from '../spc-rules/spc-rules.service';
import { SpcRulesDialogComponent } from '../spc-rules-dialog/spc-rules-dialog.component';
import { defaultSpcRulesArray } from '../../../../core/config/constants/spc-rules.const';
import { RuleDisposition } from '../../../../contracts/enums/lab-setup/spc-rule-enums/spc-rule-disposition.enum';
import { RuleEntryFormat } from '../../../../contracts/enums/lab-setup/spc-rule-enums/spc-rule-entry-format.enum';
import { RuleDescription } from '../../../../contracts/enums/lab-setup/spc-rule-enums/rule-description.enum';
import { Rule } from '../../../../contracts/models/lab-setup/rule.model';
import { RuleSetting } from '../../../../contracts/models/lab-setup/rule-setting.model';
import * as constants from '../../../../core/config/constants/general.const';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';
import { RuleName } from '../../../../contracts/enums/lab-setup/spc-rule-enums/rule-name.enum';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { UnityNextNumericPipe } from '../../../../shared/date-time/pipes/unity-numeric.pipe';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { Permissions } from '../../../../security/model/permissions.model';
import * as fromRoot from '../../../../state/app.state';
import * as navigationStateSelector from '../../../../shared/navigation/state/selectors';

export interface DialogData {
  ruleName: string;
  note: string;
  imagePath: string;
  ruleId: number;
  description: string;
  defaultTitle: any;
}

export function unsubscribe(subscription: Subscription) {
  if (subscription && subscription.unsubscribe) {
    subscription.unsubscribe();
  }
}

@Component({
  selector: 'unext-spc-rules-component',
  templateUrl: './spc-rules.component.html',
  styleUrls: ['./spc-rules.component.scss'],
  providers: [UnityNextNumericPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpcRulesComponent implements OnInit, OnDestroy {
  // placeholders for valid data
  _settings: Settings;
  @Input() showSpcRules: boolean;
  @Input() disabled: boolean;
  @Input() maxLevelInUse: number;
  @Input() disableForm: boolean;

  spcRules;
  imagePath: string;
  ruleName: string;
  selectedRowIndex;
  disableRules;
  spcRulesCached;
  isSummary = false;
  resetRulesSubscription: Subscription;
  levelsInUse = 0;

  errorMessage = '';
  isValid = true;
  newSpcRulesCached: any;
  disposition = RuleDisposition;
  ruleSettings: FormArray = new FormArray([]);
  spcRulesForm: FormGroup;
  ruleSettingsDummyInput = [];
  rules: Array<Rule> = new Array();
  messages = {
    warningMessage: this.getTranslation('SPCRULESCOMPONENT.WARNINGMESSAGE'),
    error: this.getTranslation('SPCRULESCOMPONENT.ERROR'),
    warning: this.getTranslation('SPCRULESCOMPONENT.WARNING')
  };
  selectedOption: number;
  optionRuleId: number;
  ruleId: number;
  description: string;
  name = RuleName;
  isSpcFormValid = true;
  private destroy$ = new Subject<boolean>();
  @Output() isFormValidEmitter = new EventEmitter<boolean>();
  @Output() rulesPristineEmitter = new EventEmitter<boolean>();
  permissions = Permissions;

  get settings(): Settings {
    return this._settings;
  }

  @Input('settings')
  set settings(value: Settings) {
    try {
      this._settings = value;
      if (this._settings) {
        this.ruleSettingsDummyInput = this.settings && this.settings.ruleSettings || [];
        for (const level in this.settings.levelSettings) {
          if (level.startsWith('level') && this.settings.levelSettings[level]) {
            this.levelsInUse++;
          }
        }
        this.setInitForm();
        this.extractNewSpcRules(this.rules);
        this.updateNewDisableStatus();
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SpcRulesComponent + blankSpace + Operations.SetSettings)));
    }
  }

  navigationGetLocale = this.store.pipe(select(navigationStateSelector.getLocale));
  ruleValues: number[] = [];

  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
    private formBuilder: FormBuilder,
    private spcRulesService: SpcRulesService,
    private translateService: TranslateService,
    public dialog: MatDialog,
    private errorLoggerService: ErrorLoggerService,
    public unityNextNumericPipe: UnityNextNumericPipe,
    private changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    try {
      this.resetRulesSubscription = this.spcRulesService.getResetRules().subscribe(res => {
        if (res) {
          this.resetNewRules();
          if (this.rulesSettingsGetter) {
            this.rulesSettingsGetter.markAsPristine();
            this.rulesSettingsGetter.markAsUntouched();
            this.updateNewDisableStatus();
            this.rulesPristineEmitter.emit(true);
          }
        }
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SpcRulesComponent + blankSpace + Operations.OnInit)));
    }
    this.subscribeToLanguageChanges();
  }

  subscribeToLanguageChanges() {
    this.translateService.onLangChange.pipe(
      takeUntil(this.destroy$)).subscribe(() => {
        this.rules.forEach(rule => {
        rule.description = this.localizeDescription(rule.ruleId.toString());
        });
      });
    this.navigationGetLocale.pipe(
      pairwise(),
      map(([prev, cur]: ([any, any]))=>([prev?.numberFormat, cur?.numberFormat])),
      filter(([prev, cur]) => prev !== cur),
      takeUntil(this.destroy$)).subscribe(() => {
        this.ruleValues.forEach((ruleValue, index) => {
          const isNumericFormattable = this.rules[index].valueOptions?.length === 1;
          if(isNumericFormattable) {
            const value = this.unityNextNumericPipe.transform(ruleValue);
            this.rulesSettingsGetter?.controls[index].patchValue({ value });
          }
        });
        this.changeDetectionRef.detectChanges();
      });
  }

  setInitForm() {
    this.ruleValues = [];
    this.rules = cloneDeep(defaultSpcRulesArray);
    this.spcRulesForm = this.formBuilder.group({
      ruleSettings: this.formBuilder.array([])
    });

    this.spcRulesForm.valueChanges
      .subscribe(change => {
        if (!this.spcRulesForm.pristine) {
          this.rulesPristineEmitter.emit(false);
        } else {
          this.rulesPristineEmitter.emit(true);
        }
      }, takeUntil(this.destroy$));
    this.rules.forEach(rule => {
      let ruleSettingObj: RuleSetting = new RuleSetting();
      const index = this.ruleSettingsDummyInput.findIndex(ruleDummy => ruleDummy.ruleId === rule.ruleId);
      if (index === -1) {
        let value = null;
        switch (rule.entryFormat) {
          case RuleEntryFormat.FreeForm:
            value = rule.valueOptions[0].value;
            break;
          case RuleEntryFormat.MultiOption:
            value = rule.valueOptions.find(option => option.isDefault).value;
        }
        ruleSettingObj = { ruleId: rule.ruleId, value: value, disposition: rule.disposition };
      } else {
        ruleSettingObj = {
          ruleId: this.ruleSettingsDummyInput[index].ruleId,
          value: this.ruleSettingsDummyInput[index].value ? this.ruleSettingsDummyInput[index].value : null,
          disposition: this.ruleSettingsDummyInput[index].disposition
        };
      }
      this.ruleValues.push(ruleSettingObj.value);
      this.addControl(ruleSettingObj, rule.entryFormat);
      rule.description = (rule.name !== constants.k_1s) ? this.localizeDescription(rule.ruleId.toString()) : '';

      /**
        * Rule 2 of 3/2s(rule id 4) should be visible when 3 or more level settings checked.
        **/
      if (rule.name === constants._2_3_2s && this.levelsInUse < 3) {
        rule.isVisible = false;
      }
    });
    this.ruleSettings = cloneDeep(this.rulesSettingsGetter.value);
  }

  createRuleSettings(ruleSettingObj, entryFormat): FormGroup {
    let inputValue = '';
    if (entryFormat === RuleEntryFormat.FreeForm) {
      inputValue = this.unityNextNumericPipe.transform(ruleSettingObj.value);
    } else {
      inputValue = null;
    }
    const ruleSetting = this.formBuilder.group({
      ruleId: ruleSettingObj.ruleId,
      value: inputValue ? inputValue : ruleSettingObj.value,
      disposition: ruleSettingObj.disposition

    });
    const valueControl = ruleSetting.get(constants.value);
    if (ruleSettingObj.ruleId === 1 || ruleSettingObj.ruleId === 2) {
      valueControl.setValidators([Validators.required, this.spcRuleInputValidation]);
    }

    return ruleSetting;
  }

  spcRuleInputValidation: ValidatorFn = (control: FormControl): { [key: string]: boolean } | null => {
    const integerValue = parseFloat(control.value);
    let actualValue: string = control.value ? control.value.toString() : '';
    if (!isNaN(integerValue)) {
      if (integerValue < 0.01 || integerValue > 9.99) {
        if (integerValue !== 0) {
          control.markAsTouched();
          actualValue = actualValue.slice(0, actualValue.length - 1);
          control.setValue(actualValue);
        }
        return { 'value': true };
      }
    }
    return null;
  }


  addControl(ruleSettingObj, entryFormat) {
    this.rulesSettingsGetter.push(this.createRuleSettings(ruleSettingObj, entryFormat));
  }

  get rulesSettingsGetter() {
    return this.spcRulesForm && this.spcRulesForm.get(constants.ruleSettings) ?
      this.spcRulesForm.get(constants.ruleSettings) as FormArray : null;
  }

  getValueAt(index) {
    return this.rulesSettingsGetter.controls[index].get('value').value;
  }

  onNameChange(index): void {
    try {
      this.selectedRowIndex = index;
      this.transformMainContent(index);
      this.openDialog();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SpcRulesComponent + blankSpace + Operations.OnNameChange)));
    }
  }

  /* Method called when radio buttons of new SPC rules change */
  onRadioNewChange(index, status): void {
    this.rulesSettingsGetter.value[index].disposition = status;
    if (index === 0 || index === 1) {
      this.checkForWaringMsg(this.rules[index], parseFloat(this.getValueAt(index)), index);
    }
    this.selectedRowIndex = index;
    this.updateNewDisableStatus();
  }

  /* Sorting the new SPC rules array based on display order */
  private extractNewSpcRules(rules): void {
    this.rules = rules.sort((obj1, obj2) => obj1.displayOrder - obj2.displayOrder);
  }

  transformMainContent(index): void {
    try {
      if (this.selectedOption && this.selectedOption < constants.rule && index === 7) {
        this.ruleId = this.optionRuleId;
        this.imagePath = this.selectedOption + '-1';
        this.description = JSON.parse(this.localizeDescription(this.imagePath));
      } else {
        const {ruleId, name, description, valueOptions} = this.rules[index];
        if (name === constants._2_of_2s || name === constants.kx) {
          this.ruleId = ruleId;
          this.imagePath = name;
          this.description = JSON.parse(description);
        } else if (name === constants.k_1s) {
          this.ruleId = ruleId;
          const valueOption = this.rulesSettingsGetter.value[7].value === 4 ? valueOptions[1] : valueOptions[0];
          this.imagePath = valueOption.displayText;
          this.description = JSON.parse(this.localizeDescription(this.imagePath));
        } else {
          this.ruleId = null;
          this.imagePath = name.replace('/', '-');
          this.description = description;
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SpcRulesComponent + blankSpace + Operations.TransformMainContent)));
    }
  }

  /* Deep copy of new SPC rules array */
  resetNewRules() {
    if (this.rulesSettingsGetter) {
      this.rulesSettingsGetter.setValue(cloneDeep(this.ruleSettings));
      this.rules.forEach(rule => {
        if (!rule[constants.isValid]) {
          rule[constants.isValid] = true;
          rule[constants.errorMessage] = '';
        }
      });
    }
  }

  /* Update new SPC Rules segment based on Slider value */
  private updateNewDisableStatus(): void {
    this.rulesSettingsGetter.value.forEach(item => {
      const ruleObj = this.rules.find(rule => rule.ruleId === item.ruleId);
      let initValue;
      switch (ruleObj.entryFormat) {
        case RuleEntryFormat.FreeForm:
          initValue = this.unityNextNumericPipe.transform(ruleObj.valueOptions[0].value);
          break;
        case RuleEntryFormat.MultiOption:
          initValue = ruleObj.valueOptions.find(value => value.isDefault).value;

      }
    });
    this.rulesSettingsGetter.setValue(this.rulesSettingsGetter.value);
  }

  public summaryToggleHandler(event: MatSlideToggleChange) {
    this.isSummary = event.checked;
  }

  // placeholders for valid data
  toggleshowSpcRules() {
    this.showSpcRules = !this.showSpcRules;
  }

  public togglePanelDisabled() {
    this.disabled = !this.disabled;
  }

  openDialog() {
    try {
      // If this becomes standard config should be moved to common area for all dialogs of this type
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.width = '400px';
      dialogConfig.position = {
        'top': '45px',
        right: '0'
      };
      dialogConfig.panelClass = 'spc-rules-dialog';
      dialogConfig.backdropClass = 'spc-rules-dialog';

      dialogConfig.data = {
        ruleName: this.ruleName,
        imagePath: this.imagePath,
        ruleId: this.ruleId,
        description: this.description,
      };

      this.dialog.open(SpcRulesDialogComponent, dialogConfig);
      this.ruleName = '';
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SpcRulesComponent + blankSpace + Operations.OpenDialog)));
    }
  }

  onSpcRuleValueChange(value, index) {
    try {
      const inputValue = value.currentTarget.value;
      const spcObject = this.rules[index];
      const integerValue = parseFloat(inputValue);
      if (inputValue !== '') {
        const isNumericFormattable = this.rules[index].valueOptions?.length === 1 && !isNaN(integerValue);
        this.rulesSettingsGetter.value[index].value = isNumericFormattable ? this.unityNextNumericPipe.transform(integerValue) : inputValue;
        this.updateNewDisableStatus();
        if (!isNaN(integerValue)) {
          this.checkForWaringMsg(spcObject, integerValue, index);
        }
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SpcRulesComponent + blankSpace + Operations.OnSpcRuleValueChange)));
    }
  }

  checkForWaringMsg(spcObject: Partial<Rule>, integerValue, index) {
    const isDisabled = this.rulesSettingsGetter.value[0].disposition === this.disposition.disable ||
      this.rulesSettingsGetter.value[1].disposition === this.disposition.disable;
    if (spcObject.disabledDisposition === this.disposition.reject && (integerValue <
      parseFloat(this.getValueAt(index + 1)) || isDisabled)) {
      spcObject[constants.isValid] = true;
      spcObject[constants.errorMessage] = '';
      this.rules[index + 1][constants.isValid] = true;
      this.rules[index + 1][constants.errorMessage] = '';
      this.isSpcFormValid = true;
    } else if (spcObject.disabledDisposition === this.disposition.warning && (integerValue >
      parseFloat(this.getValueAt(index - 1)) || isDisabled)) {
      spcObject[constants.isValid] = true;
      spcObject[constants.errorMessage] = '';
      this.rules[index - 1][constants.isValid] = true;
      this.rules[index - 1][constants.errorMessage] = '';
      this.isSpcFormValid = true;
    } else {
      spcObject[constants.isValid] = false;
      spcObject[constants.errorMessage] = this.messages.warningMessage;
      spcObject[constants.text] = this.messages.warning
      this.isSpcFormValid = false;
    }
    this.isFormValidEmitter.emit(this.isSpcFormValid);

  }

  applySelectFilter(event, ruleIds) {
    this.selectedOption = event.value;
    this.optionRuleId = ruleIds;
  }

  ngOnDestroy() {
    unsubscribe(this.resetRulesSubscription);
  }

  localizeDescription(translationCode: string): string {
    const hasTwoDescriptions = new Set([
        RuleDescription._2_2s, RuleDescription.k_x, RuleDescription._3_1s, RuleDescription._4_1s
      ].map(ruleDescription => `${ruleDescription}`)
    ).has(translationCode);
    if(hasTwoDescriptions) {
      // As there are two descriptions that are being shown for 2of2s, 3-1s, 4-1 and 10-x rules.
      const within = this.getTranslation(`SPCRULEDESCRIPTIONS.${translationCode}W`);
      const across = this.getTranslation(`SPCRULEDESCRIPTIONS.${translationCode}A`);
      return JSON.stringify({ within, across });
    } else {
      return this.getTranslation(`SPCRULEDESCRIPTIONS.${translationCode}`);
    }
  }

  getTranslation(translationCode: string): string {
    let translatedContent:string;
    this.translateService.get(translationCode).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
