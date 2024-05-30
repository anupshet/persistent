// © 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';

import * as _ from 'lodash';
import * as _moment from 'moment';
import 'moment-timezone';

import { CalibratorLot } from '../contracts/models/codelist-management/calibrator-lot.model';
import { Lot } from '../contracts/models/codelist-management/i-lot.model';
import { ReagentLot } from '../contracts/models/codelist-management/reagent-lot.model';
import { ChangeLotModel } from '../contracts/models/data-management/data-entry/change-lot.model';
import { NewRequestConfigType } from '../contracts/enums/new-request-config-type.enum';
import { Action } from '../contracts';

@Component({
  selector: 'br-change-lot',
  templateUrl: './change-lot.component.html',
  styleUrls: ['./change-lot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrChangeLotComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BrChangeLotComponent),
      multi: true
    }
  ]
})
export class BrChangeLotComponent implements OnInit, OnChanges, ControlValueAccessor, Validators {
  // ChangeLotModel Approach
  @Input() changeLotModel: ChangeLotModel;
  @Input() reagentLots: any;
  @Input() calibratorLots: any;
  @Input() translationLabelDictionary: {};
  // Visible Controls
  @Input() isFormVisible = false;
  @Input() isInsertPastResultLinkVisible = false;
  @Input() selectedDate: Date;
  @Input() labTestId: string;
  @Input() showOptions: boolean;
  @Input() enableComment: any;
  @Input() isSingleSummary: boolean;
  @Input() requestedDisabled: false;
  @Output() editDate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isLotVisible: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() getLots: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() reagentLot: EventEmitter<boolean> = new EventEmitter();
  @Input() totalLevels: any;
  @Input() isArchived: boolean;
  @Input() isDisabled: boolean;
  no = 0;
  @Output() requestNewConfig: EventEmitter<NewRequestConfigType> = new EventEmitter<NewRequestConfigType>();
  @Input() correctiveActions: Array<Action> = [];
  @Input() isPointEntry: boolean;

  reagentLotErrorMessageDate: Date;
  calibratorLotErrorMessageDate: Date;

  onChange: any = () => { };
  onTouched: any = () => { };

  // Lot Selector Variables
  public activeReagentLots: Array<ReagentLot>;
  public activeCalibratorLots: Array<CalibratorLot>;
  public newRequestConfigType = NewRequestConfigType;

  // Forms
  public commentsFormControl = new FormControl();
  public reagentLotSelect = new FormControl();
  public calibratorLotSelect = new FormControl();

  public formGroup: FormGroup;
  public BrChangeLotSelectLotForm: FormGroup;
  public correctiveActionsFormControl = new FormControl();
  private userAction: Action;
  public selectedActionId: number;
  private moment = _moment;

  constructor(private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.totalLevels) {
      const arr = Object.keys(this.totalLevels);
      this.no = arr.length;
    }

    this.isFormVisible = false;
    if (this.showOptions) {
      this.isFormVisible = this.showOptions;
    }
    this.createForm();


  }

  public checkCommentStatus(enableComment: Array<string>): void {
    // AJ Bug fix 231798
    // prevent race condition when component renders
    if (enableComment.length >= 0) {
      const commentElement = document.getElementById(this.labTestId);
      const enableIndex = enableComment && enableComment.length > 0 ? enableComment.findIndex(id => this.labTestId === id) : true;
      if (commentElement && enableIndex !== -1) {
        commentElement.removeAttribute('disabled');
      } else if (commentElement && enableIndex === -1) {
        commentElement.setAttribute('disabled', 'true');
        this.commentsFormControl.reset();
      }
    }

  }


  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.reagentLots !== undefined) {
      this.changeLotModel.reagentLots = this.reagentLots;
      this.changeLotModel.calibratorLots = this.calibratorLots;
      this.setupLots();
    }

    if (simpleChanges['selectedDate']) {
      if (this.changeLotModel) {
        this.setupLots();
      }
    }
    // SR 09302020: Check for multiple comments input only on multi-data entry
    if (simpleChanges.enableComment && !this.isSingleSummary) {
      this.checkCommentStatus(simpleChanges.enableComment.currentValue.commentArray);
    }
  }

  createForm() {
    this.BrChangeLotSelectLotForm = new FormGroup({
      reagentLotSelect: this.reagentLotSelect,
      calibratorLotSelect: this.calibratorLotSelect,
    });
    if (this.isPointEntry) {
      this.BrChangeLotSelectLotForm.addControl('action', this.correctiveActionsFormControl);
    }

    this.formGroup = new FormGroup({
      BrChangeLotSelectLotForm: this.BrChangeLotSelectLotForm,
      comments: this.commentsFormControl
    });

  }

  set value(val: ChangeLotModel) {
    this.changeLotModel = val;
    this.onChange(val);
    this.onTouched();
  }

  get value() {
    return this.changeLotModel;
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value) {
    if (value) {
      this.initialize(value);
    } else {
      this.resetForm();
    }
    this.changeDetection.detectChanges();
  }

  validate(formControl: AbstractControl): { [key: string]: boolean } {
    const changeLotModel = formControl.value as (ChangeLotModel);
    if (this.isLotExpired(changeLotModel?.selectedReagentLot) || this.isLotExpired(changeLotModel?.selectedCalibratorLot)) {
      return { LotHasExpired: true };
    }
    return null;
  }

  private initialize(value: ChangeLotModel): void {
    this.value = value;

    if (this.changeLotModel && this.changeLotModel.comment) {
      this.commentsFormControl.setValue(this.changeLotModel.comment);
    }

    if (!this.changeLotModel.selectedReagentLot) {
      this.changeLotModel.selectedReagentLot = this.changeLotModel.defaultReagentLot;
    }
    if (!this.changeLotModel.selectedCalibratorLot) {
      this.changeLotModel.selectedCalibratorLot = this.changeLotModel.defaultCalibratorLot;
    }

    this.setupLots();
  }

  private resetForm(): void {
    if (this.changeLotModel) {
      this.isFormVisible = false;
      this.changeLotModel.comment = null;
      this.correctiveActionsFormControl.reset();
      this.userAction = null;
      this.commentsFormControl.setValue(null);

      this.changeLotModel.reagentLots = null;
      this.changeLotModel.calibratorLots = null;
      this.changeLotModel.selectedReagentLot = this.changeLotModel.defaultReagentLot;
      this.changeLotModel.selectedCalibratorLot = this.changeLotModel.defaultCalibratorLot;

      this.setupLots();

      this.value = this.changeLotModel;
    }
  }

  private setupLots(): void {
    this.populateActiveReagentLots(this.changeLotModel);
    this.populateActiveCalibratorLots(this.changeLotModel);
    this.setReagentLotDropdownSelection(this.changeLotModel, this.activeReagentLots);
    this.setCalibratorLotDropdownSelection(this.changeLotModel, this.activeCalibratorLots);
  }

  public onReagentChanged(selectedReagent: ReagentLot): void {
    if (selectedReagent && this.changeLotModel.selectedReagentLot?.id != selectedReagent?.id) {
      this.changeLotModel.selectedReagentLot = selectedReagent;
      this.onChange(this.changeLotModel);
      this.onTouched();
    }
  }

  public onCalibratorChanged(selectedCalibrator: CalibratorLot): void {
    if (selectedCalibrator && this.changeLotModel.selectedCalibratorLot?.id != selectedCalibrator?.id) {
      this.changeLotModel.selectedCalibratorLot = selectedCalibrator;
      this.onChange(this.changeLotModel);
      this.onTouched();
    }
  }

  public onCommentChanged(): void {
    if (this.changeLotModel && this.changeLotModel.comment != this.commentsFormControl.value) {
      this.changeLotModel.comment = this.commentsFormControl.value;
      this.onChange(this.changeLotModel);
      this.onTouched();
    }
  }

  public onActionChanged(): void {
    if (this.changeLotModel && this.changeLotModel.action?.actionId != this.selectedActionId) {
      this.setAction(this.selectedActionId);
      this.changeLotModel.action = this.userAction;
      this.onChange(this.changeLotModel);
      this.onTouched();
    }
  }

  public toggleDisplayChangeLot(): void {
    if (this.changeLotModel) {
      this.isFormVisible = !this.isFormVisible;
      this.isLotVisible.emit(this.isFormVisible);
      if (!this.changeLotModel.calibratorLots || !this.changeLotModel.reagentLots) {
        this.getLots.emit(true);
      }
    }
  }

  public toggleDateEdit(): void {
    this.editDate.emit(true);
  }

  private setReagentLotDropdownSelection(changeLotModel: ChangeLotModel, activeReagentLots: Array<ReagentLot>) {
    changeLotModel.selectedReagentLot = activeReagentLots.find(lot => lot.id === changeLotModel.selectedReagentLot.id);
    this.reagentLotSelect.patchValue(changeLotModel.selectedReagentLot);
    this.updateReagentLotExpireError(changeLotModel);
  }

  private setCalibratorLotDropdownSelection(changeLotModel: ChangeLotModel, activeCalibratorLots: Array<CalibratorLot>) {
    changeLotModel.selectedCalibratorLot = activeCalibratorLots.find(lot => lot.id === changeLotModel.selectedCalibratorLot.id);
    this.calibratorLotSelect.patchValue(changeLotModel.selectedCalibratorLot);

    this.updateCalibratorLotExpireError(changeLotModel);
  }

  private populateActiveReagentLots(changeLotModel: ChangeLotModel): void {
    // Populate with reagentLots, If reagentLots are empty then populate with defaultReagentLot.
    if (changeLotModel.reagentLots) {
      this.activeReagentLots = <Array<ReagentLot>>(
        this.filterExpiredLots(changeLotModel.reagentLots, changeLotModel.selectedReagentLot.id)
      );
    } else if (changeLotModel.defaultReagentLot) {
      this.activeReagentLots = [_.cloneDeep(changeLotModel.defaultReagentLot)];
    }
    this.activeReagentLots = this.activeReagentLots.sort((a, b) => (a.lotNumber).localeCompare(b.lotNumber));
    // Reagent lots data is populated form API in parent component which has key reagentName,
    // due to this comparing of objects fails so deleting this key as it is never used anywhere in this component
    this.activeReagentLots.forEach(activeRl => {
      if (activeRl.reagentName) {
        delete activeRl.reagentName;
      }
    });
  }

  private populateActiveCalibratorLots(changeLotModel: ChangeLotModel): void {
    // Populate with calibratorLots, If calibratorLots are empty then populate with defaultCalibratorLot.
    if (changeLotModel.calibratorLots) {
      this.activeCalibratorLots = <Array<CalibratorLot>>(
        this.filterExpiredLots(changeLotModel.calibratorLots, changeLotModel.selectedCalibratorLot.id)
      );
    } else if (changeLotModel.defaultCalibratorLot) {
      this.activeCalibratorLots = [_.cloneDeep(changeLotModel.defaultCalibratorLot)];
    }
    // Calibrator lots data is populated form API in parent component which has key calibratorName,
    // due to this comparing of objects fails so deleting this key as it is never used anywhere in this component
    this.activeCalibratorLots.forEach(activeCl => {
      if (activeCl.calibratorName) {
        delete activeCl.calibratorName;
      }
    });
  }

  private updateReagentLotExpireError(changeLotModel: ChangeLotModel): void {
    if (this.isLotExpired(changeLotModel.selectedReagentLot)) {
      this.reagentLotErrorMessageDate = new Date(changeLotModel.selectedReagentLot.shelfExpirationDate);
      this.isFormVisible = true;
    }
  }

  private updateCalibratorLotExpireError(changeLotModel: ChangeLotModel): void {
    if (this.isLotExpired(changeLotModel.selectedCalibratorLot)) {
      this.calibratorLotErrorMessageDate = new Date(changeLotModel.selectedCalibratorLot.shelfExpirationDate);
      this.isFormVisible = true;
    }
  }

  public isLotExpired(lot: Lot): boolean {
    if (lot) {
      const expDate = new Date(lot.shelfExpirationDate);
      const selectedDate = new Date(this.selectedDate);
      return this.moment(expDate).isBefore(selectedDate);
    } else {
      return false;
    }
  }

  public filterExpiredLots(
    lots: Array<Lot>,
    selectedLotId: number
  ): Array<Lot> {
    return lots.filter(
      lot => !this.isLotExpired(lot) || selectedLotId === lot.id
    );
  }

  public hasMoreThanOneReagentLot(): boolean {
    if (this.activeReagentLots) {
      return this.activeReagentLots.length > 1;
    }

    return false;
  }

  public hasMoreThanOneCalibratorLot(): boolean {
    if (this.activeCalibratorLots) {
      return this.activeCalibratorLots.length > 1;
    }

    return false;
  }

  public requestNewConfiguration(type: NewRequestConfigType) {
    this.requestNewConfig.emit(type);
  }

  public setAction(selectedActionId: number): void {
    // AJ Bug fix 231798
    // prevent race condition when component renders
    if (selectedActionId) {
      this.userAction = null;
      const selectedActionIndex = this.correctiveActions.findIndex(item => item.actionId === selectedActionId);
      if (selectedActionIndex > -1) {
        const action = new Action();
        action.enterDateTime = new Date();
        action.actionId = this.correctiveActions[selectedActionIndex].actionId;
        action.actionName = this.correctiveActions[selectedActionIndex].actionName;
        this.userAction = action;
      }
    }
  }
}
