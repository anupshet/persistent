// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  ChangeDetectorRef, OnChanges, SimpleChanges, Component, EventEmitter, Input, OnInit, Output,
  forwardRef, ChangeDetectionStrategy, ViewChild
} from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, FormControl, FormGroup, Validators, NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subject } from 'rxjs';

import {
  Action, AnalyteEntryType, AnalytePointEntry, AnalytePointView, BasePoint, calculateLevelEntryTabIndex,
  calculateRunEntryTabIndex, CalibratorLot, isEmpty, isNumeric, LevelData, ReagentLot, sleep
} from 'br-component-library';

import { ResultStatus } from '../../../../contracts/models/data-management/runs-result.model';
import { Utility } from '../../../../core/helpers/utility';
import { NewRequestConfigType } from '../../../../contracts/enums/lab-setup/new-request-config-type.enum';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { CustomRegex } from '../../../../shared/constants/regular-expressions';

@Component({
  selector: 'unext-analyte-multi-point',
  templateUrl: './analyte-multi-point.component.html',
  styleUrls: ['./analyte-multi-point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AnalyteMultiPointComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AnalyteMultiPointComponent),
      multi: true
    }
  ]
})
export class AnalyteMultiPointComponent implements OnInit, OnChanges, ControlValueAccessor, Validators {
  @Input() analyteEntryType: AnalyteEntryType;
  @Input() analyteEntry: AnalytePointEntry;
  @Input() analytePointView: AnalytePointView;
  @Input() isRunEntryMode: boolean;
  @Input() selectedDate: Date;
  @Input() timeZone: string;
  @Input() isProductMasterLotExpired: boolean;
  @Input() enableCommentArray: Array<string> = [];
  @Input() isLastDataEntry: boolean;
  @Input() lastEntryToggleClicked: Subject<boolean>;
  @Input() analyteId: string;
  @Input() isArchived: boolean;
  @Input() correctiveActions: Array<Action>;
  @Input() isDisabled: boolean;

  @Output() getLots = new EventEmitter<AnalytePointEntry>();
  @Output() isLotVisible: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() translationLabelDictionary: {};
  @Output() requestNewConfig: EventEmitter<NewRequestConfigType> = new EventEmitter<NewRequestConfigType>();

  onChange: any = () => { };
  onTouched: any = () => { };

  form: FormGroup;
  changeLotForm: FormGroup;
  dateTimePicker: FormControl;
  changeLotFormControl: FormControl = new FormControl();
  readOnlyDate = true;
  foundIndex: number;
  columnsToDisplay: Array<string> = [];
  dataRows = [
    'value'
  ];

  readonly levelIdentifier = 'level-';
  regexRationalNumber = CustomRegex.RATIONAL_NUMBER;
  public mouseIsEnter: boolean;
  public showOptions: boolean;
  public inputHasFocus: boolean;
  public targetCV: number;
  reagentLots: ReagentLot[];
  calibratorLots: CalibratorLot[];

  constructor(
    private changeDetection: ChangeDetectorRef,
    private codeListService: CodelistApiService,
  ) { }

  ngOnInit(): void {
    this.columnsToDisplay = this.getColumnsToDisplay(this.analyteEntry);
    this.createForm();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedDate']) {
      if (this.analyteEntry) {
        this.analyteEntry.analyteDateTime = this.selectedDate;
      }
    }
  }

  createForm(): void {
    this.createDateTimePickerForm();
    this.createChangeLotForm();
  }

  createDateTimePickerForm(): void {
    if (this.analyteEntry) {
      this.dateTimePicker = new FormControl(this.analyteEntry.analyteDateTime);
    } else {
      this.dateTimePicker = new FormControl();
    }

    this.form = new FormGroup({
      analyteDate: this.dateTimePicker
    });
  }

  createChangeLotForm(): void {
    this.changeLotForm = new FormGroup({
      changeLot: this.changeLotFormControl
    });
  }

  requestLots() {
    this.getLots.emit(this.analyteEntry);
  }

  updateAnalyteDate(): void {
    this.analyteEntry.analyteDateTime = this.dateTimePicker.value;
    if (this.isSinglePointEntry) {
      this.selectedDate = this.dateTimePicker.value;
    }
    this.onChange(this.analyteEntry);
    this.onTouched();
  }

  updateChangeLotData(): void {
    this.analyteEntry.changeLotData = this.changeLotFormControl.value;
    this.onChange(this.analyteEntry);
    this.onTouched();
  }

  getColumnsToDisplay(analyteEntry: AnalytePointEntry): Array<string> {
    const columnsToDisplay: Array<string> = [];
    columnsToDisplay.push('date');

    if (analyteEntry && this.analyteEntry.cumulativeLevels) {
      analyteEntry.cumulativeLevels.forEach(level => {
        columnsToDisplay.push(level.toString());
      });
      return columnsToDisplay;
    }

    // Display last data entry based on toggle switch
    this.lastEntryToggleClicked.subscribe(toggleChecked => {
      if (toggleChecked && this.analytePointView && this.analytePointView.levelDataSet) {
        this.analytePointView.levelDataSet.forEach(pointResult => {
          columnsToDisplay.push(pointResult.data.value.toString());
        });
      }
    });
    return columnsToDisplay;
  }

  findIndex(index): number {
    const foundIndex = this.analytePointView.levelDataSet.findIndex(element => {
      return element.level === +index;
    });
    this.foundIndex = foundIndex;
    return foundIndex;
  }

  // Note : If you are using this in conjunction with analyteSummary, then make sure
  // to set the labels.length to max of analytePoint & analyteSummary.
  // In this case it is set to 3 since analyteSummary has 3 labels.
  public getTabIndex(columnIndex: number, rowIndex: number): number {
    return this.isRunEntryMode ?
      calculateRunEntryTabIndex(columnIndex, rowIndex, this.analyteEntry.analyteIndex, 3, this.analyteEntry.cumulativeLevels.length) :
      calculateLevelEntryTabIndex(columnIndex, rowIndex, this.analyteEntry.analyteIndex, 3, this.analyteEntry.totalAnalytes);
  }

  hasLevelSet(columnIndex): boolean {
    const level = this.analyteEntry.cumulativeLevels[columnIndex];
    const levelSetItem = this.findLevelSetItem(this.analyteEntry.levelDataSet, level);
    if (levelSetItem) {
      return true;
    }
    return false;
  }

  getLevel(columnIndex: number): LevelData<BasePoint> {
    const level = this.analyteEntry.cumulativeLevels[columnIndex];
    const levelSetItem = this.findLevelSetItem(this.analyteEntry.levelDataSet, level);

    // SR 08/14/2020: Conversion is handled outside the component library to handle Negative Input
    // Adding check for NaN validation
    if (levelSetItem.data.value) {
      levelSetItem.data.value = levelSetItem.data.value;
    } else {
      levelSetItem.data.value = null;
    }
    return levelSetItem as LevelData<BasePoint>;
  }

  getCalculatedCV(columnIndex: number): number {
    return this.targetCV = Utility.calculateCV(
      this.analytePointView.levelDataSet[columnIndex].data.sd,
      this.analytePointView.levelDataSet[columnIndex].data.mean
    );
  }

  isMultiPointEntry(): boolean {
    return this.analyteEntryType === AnalyteEntryType.Multi;
  }

  isSinglePointEntry(): boolean {
    return this.analyteEntryType === AnalyteEntryType.Single;
  }

  findLevelSetItem(levelSet: Array<LevelData<BasePoint>>, level: number): LevelData<BasePoint> {
    if (levelSet) {
      return levelSet.find(item => item.level === level);
    }
    return undefined;
  }

  toggleEditDate(enableEditDate): void {
    this.readOnlyDate = !enableEditDate;
  }

  async levelDataChange(level: LevelData<BasePoint>) {
    await sleep(200);
    this.onChange(this.analyteEntry);
    this.onTouched();
  }

  validate(formControl: AbstractControl): { [key: string]: boolean } {
    const analyteEntry = formControl.value as (AnalytePointEntry);
    let hasValue = false;
    let areAllValuesValid = true;
    if (!analyteEntry || !analyteEntry.levelDataSet) {
      return { atLeastOneLevel: true };
    }
    analyteEntry.levelDataSet.forEach(level => {
      if (level.data && (level.data.value != null && (level.data.value && level.data.value.toString() !== ''))) {
        const levelValue = Utility.normalizeToRationalNumber(level.data.value);
        level.isPristine = false;
        hasValue = true;
        if (!isNumeric(levelValue)) {
          areAllValuesValid = false;
        }
        if (levelValue.toString().length > 15) {
          areAllValuesValid = false;
        }
      } else {
        level.isPristine = true;
      }
    });

    if (!areAllValuesValid) {
      return { NotAllValuesAreNumber: true };
    }
    // Validation for Control-lot
    if (this.changeLotFormControl.errors) {
      return { LotHasExpired: true };
    }

    if (!hasValue) {
      formControl.markAsPristine();
    }
    return null;
  }

  hasComment(analyteEntry: AnalytePointEntry) {
    return analyteEntry.changeLotData
      && analyteEntry.changeLotData.comment
      && analyteEntry.changeLotData.comment
      && !isEmpty(analyteEntry.changeLotData.comment);
  }

  get value() {
    return this.analyteEntry;
  }

  set value(val: AnalytePointEntry) {
    this.analyteEntry = val;
    this.columnsToDisplay = this.getColumnsToDisplay(this.analyteEntry);
    this.onChange(val);
    this.onTouched();
  }

  // We implement this method to keep a reference to the onChange
  // callback function passed by the forms API
  registerOnChange(fn) {
    this.onChange = fn;
  }
  // We implement this method to keep a reference to the onTouched
  // callback function passed by the forms API
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  // This is a basic setter that the forms API is going to use
  writeValue(value) {
    if (value) {
      this.value = value;
      this.changeLotFormControl.setValue(this.value.changeLotData);
      if (this.isSinglePointEntry) {
        this.selectedDate = this.value.analyteDateTime;
      }
    } else {
      if (this.analyteEntry) {
        this.analyteEntry.levelDataSet.forEach(level => {
          if (level.data && level.data.value != null) {
            level.data.value = null;
          }
        });
      }
      this.form.reset();
      this.changeLotForm.reset();
      this.readOnlyDate = true;
    }
    if (this.changeDetection) {
      this.changeDetection.detectChanges();
    }
  }

  mouseEnter(input: boolean) {
    this.mouseIsEnter = input;
    if (!this.inputHasFocus) {
      this.showOptions = input;
    }
  }

  focus(input: boolean) {
    this.inputHasFocus = input;
    if (!this.mouseIsEnter) {
      this.showOptions = input;
    }
    this.evaluateCommentField();
  }

  evaluateCommentField(): any {
    if (this.enableCommentArray.length > 0) {
      return { enableComment: '', value: true, commentArray: this.enableCommentArray };
    } else {
      return { enableComment: '', value: false, commentArray: this.enableCommentArray };
    }
  }

  public isLotFormVisible(value) {
    this.isLotVisible.emit(value);
  }

  getResultStatus(resultStatus) {
    switch (resultStatus) {
      case ResultStatus.Warning:
        return 'yellow';
      case ResultStatus.Accept:
      case ResultStatus.Reject:
        return 'red';
      default:
        return '';
    }
  }

  public requestNewConfiguration(type: NewRequestConfigType) {
    this.requestNewConfig.emit(type);
  }
}
