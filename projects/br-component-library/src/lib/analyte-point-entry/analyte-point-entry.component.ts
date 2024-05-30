import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  OnChanges,
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

import { AnalyteEntryType, AnalytePointEntry, BasePoint, LevelData } from '../contracts';
import { calculateLevelEntryTabIndex, calculateRunEntryTabIndex, isEmpty, sleep, CustomRegex, isNumeric } from '../shared';
import { NewRequestConfigType } from '../contracts/enums/new-request-config-type.enum';

@Component({
  selector: 'br-analyte-point-entry',
  templateUrl: './analyte-point-entry.component.html',
  styleUrls: ['./analyte-point-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrAnalytePointEntryComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BrAnalytePointEntryComponent),
      multi: true
    }
  ]
})

export class BrAnalytePointEntryComponent implements OnInit, OnChanges, ControlValueAccessor, Validators {
  @Input() analyteEntryType: AnalyteEntryType;
  @Input() analyteEntry: AnalytePointEntry;
  @Input() isRunEntryMode: boolean;
  @Input() selectedDate: Date;
  @Input() timeZone: string;
  @Input() isProductMasterLotExpired: boolean;
  @Input() enableCommentArray: Array<string> = [];

  @Output() getLots = new EventEmitter<AnalytePointEntry>();
  @Input() translationLabelDictionary: {};
  @Output() requestNewConfig: EventEmitter<NewRequestConfigType> = new EventEmitter<NewRequestConfigType>();
  @Input() isArchived: boolean;

  onChange: any = () => { };
  onTouched: any = () => { };

  form: FormGroup;
  changeLotForm: FormGroup;
  dateTimePicker: FormControl;
  readOnlyDate = true;
  changeLotFormControl: FormControl;
  columnsToDisplay: Array<string> = [];
  dataRows = [
    'value'
  ];
  regexRationalNumber = CustomRegex.RATIONAL_NUMBER;
  readonly levelIdentifier = 'level-';
  public showOptions: boolean;
  public inputHasFocus: boolean;
  public mouseIsEnter: boolean;

  constructor(private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {
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
    if (this.analyteEntry && this.analyteEntry.changeLotData) {
      this.changeLotFormControl = new FormControl(this.analyteEntry.changeLotData);
    } else {
      this.changeLotFormControl = new FormControl();
    }

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
    return columnsToDisplay;
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
        level.isPristine = false;
        hasValue = true;
        if (!isNumeric(level.data.value)) {
          areAllValuesValid = false;
        }
        if (level.data.value.toString().length > 15) {
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
      if (this.isSinglePointEntry) {
        this.selectedDate = this.value.analyteDateTime;
      }
      this.createChangeLotForm();
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

  public requestNewConfiguration(type: NewRequestConfigType) {
    this.requestNewConfig.emit(type);
  }
}
