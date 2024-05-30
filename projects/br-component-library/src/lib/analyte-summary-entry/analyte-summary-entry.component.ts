// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit
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
import { MatInput } from '@angular/material/input';

import { AnalyteSummaryEntry } from '../contracts/models/data-management/data-entry/analyte-entry.model';
import { LevelSummary } from '../contracts/models/level-data.model';
import { calculateLevelEntryTabIndex, calculateRunEntryTabIndex, isNumeric, sleep } from '../shared/utility-functions';
import { CustomRegex } from '../shared/constants/regular-expressions';
import { NewRequestConfigType } from '../contracts/enums/new-request-config-type.enum';
import { AnalyteEntryType, CalibratorLot, ReagentLot } from '../contracts';

@Component({
  selector: 'br-analyte-summary-entry',
  templateUrl: './analyte-summary-entry.component.html',
  styleUrls: ['./analyte-summary-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrAnalyteSummaryEntryComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BrAnalyteSummaryEntryComponent),
      multi: true
    }
  ]
})
export class BrAnalyteSummaryEntryComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor, Validators {
  _isRunEntryMode: boolean;
  get isRunEntryMode(): boolean {
    return this._isRunEntryMode;
  }
  @Input('isRunEntryMode')
  set isRunEntryMode(value: boolean) {
    this._isRunEntryMode = value;
    if (this.columnsToDisplay && this.columnsToDisplay.length > 0) {
      this.getTabIndex();
    }
  }
  _analyteEntryType: AnalyteEntryType;
  get analyteEntryType(): AnalyteEntryType {
    return this._analyteEntryType;
  }
  @Input('analyteEntryType')
  set analyteEntryType(value: AnalyteEntryType) {
    this._analyteEntryType = value;
    this.isSingleEntry = this._analyteEntryType === AnalyteEntryType.Single;
  }
  @Input() translationLabels: any;
  @Input() selectedDate: Date;
  @Input() availableDateTo: Date;
  @Input() availableDateFrom: Date;
  @Input() initialSelectedDate: Date;
  @Output() getLots = new EventEmitter<AnalyteSummaryEntry>();
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() submitEvent = new EventEmitter<AnalyteSummaryEntry>();
  @Output() cancelEvent = new EventEmitter();
  @Input() translationLabelDictionary: {};
  @Input() isSingleEditMode = false;
  @Input() enableSubmit: boolean;
  @Input() enableCancel: boolean;
  @Input() timeZone: string;
  @Input() isProductMasterLotExpired: boolean;
  @Input() isEditMode: boolean;
  @Input() enableCommentArray: Array<string> = [];
  @Input() isSingleSummary: boolean;
  @Input() testSpecId: number;
  @Input() previousCalibratorLot: CalibratorLot;
  @Input() previousReagentLot: ReagentLot;
  @Input() showOptionsForm = false;
  @Output() requestNewConfig: EventEmitter<NewRequestConfigType> = new EventEmitter<NewRequestConfigType>();
  @Input() isArchived: boolean;
  @Input() isDisabled: boolean;
  @Input() currentLanguage: string;
  public columnsToDisplay: string[] = [];
  public analyteEntry: AnalyteSummaryEntry;
  public errorMessage = [[], [], []];
  private previousColIndex = -1;
  private currentColIndex: number;
  private visitedColumn: Array<number>;
  public readOnlyDate = true;
  public displayTime = false;
  public labels: any;
  public tabIndex: Array<Array<number>>;
  public arrIndexFromLevelSummary: Array<number>;
  public isSingleEntry = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  public changeLotForm: FormGroup;
  public changeLotFormControl = new FormControl();
  public regexOnlyDigitsGreaterThanZero = CustomRegex.ONLY_DIGITS_GREATER_THAN_ZERO;
  public regexRationalNumber = CustomRegex.RATIONAL_NUMBER;
  public showOptions: boolean;
  public isFormVisible: boolean;
  public mouseIsEnter: boolean;
  public inputHasFocus: boolean;
  public today = new Date();

  @ViewChild('dataInputEntry', { static: false }) datainputentry: MatInput;
  private inputElements: Array<ElementRef>;

  constructor(private changeDetection: ChangeDetectorRef, private elem: ElementRef) { }

  ngOnInit() {
    this.labels  = [
      this.translationLabels.mean,
      this.translationLabels.sd,
      this.translationLabels.points
    ];
    this.createChangeLotForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputElements = this.elem.nativeElement.querySelectorAll('input'); // checking input elements loaded properly
      if (this.inputElements.length > 0 && this.datainputentry) {
        this.datainputentry.focus();
      }
    }, 0);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedDate']) {
      if (this.initialSelectedDate &&
        this.initialSelectedDate.toISOString() !== simpleChanges['selectedDate'].currentValue.toISOString()) {
        this.enableCancel = true;
      }
      if (simpleChanges['selectedDate'].currentValue &&
        (!simpleChanges['selectedDate'].previousValue ||
          simpleChanges['selectedDate'].previousValue.toISOString() === simpleChanges['selectedDate'].currentValue.toISOString())) {
        this.initialSelectedDate = simpleChanges['selectedDate'].currentValue;
      }
      if (this.analyteEntry) {
        this.analyteEntry.analyteDateTime = this.selectedDate;
      }
    }
  }

  private createChangeLotForm(): void {
    this.changeLotForm = new FormGroup({
      changeLot: this.changeLotFormControl
    });
  }

  public requestLots(): void {
    this.getLots.emit(this.analyteEntry);
  }

  public isLotVisible(value): void {
    this.isFormVisible = value;
  }

  public async analyteChanged(): Promise<void> {
    await sleep(700);
    this.onChange(this.analyteEntry);
    this.onTouched();
  }

  public updateAnalyteDate(selectedDate: Date): void {
    this.analyteEntry.analyteDateTime = selectedDate;
    this.dateSelected.emit(selectedDate);
    this.onChange(this.analyteEntry);
    this.onTouched();
  }

  public updateChangeLotData(): void {
    this.analyteEntry.changeLotData = this.changeLotFormControl.value;
    this.onChange(this.analyteEntry);
    this.onTouched();
  }

  public focusMovedOutside(isOutside: boolean): void {
    if (isOutside) {
      this.validateEachEntry(this.analyteEntry);
    }
  }

  private getColumnsToDisplay(analyteEntry: AnalyteSummaryEntry): Array<string> {
    const columnsToDisplay: Array<string> = [];
    columnsToDisplay.push('label');

    if (analyteEntry && this.analyteEntry.cumulativeLevels) {
      analyteEntry.cumulativeLevels.forEach(level => {
        columnsToDisplay.push(level.toString());
      });
      return columnsToDisplay;
    }
    return columnsToDisplay;
  }

  public getTabIndex() {
    const columnsArray = this.columnsToDisplay.slice(1);
    this.tabIndex = new Array(columnsArray.length);
    this.arrIndexFromLevelSummary = new Array(this.columnsToDisplay.length);
    columnsArray.forEach((colEle, colIndex) => {
      this.arrIndexFromLevelSummary[colIndex] = this.getIndexFromLevelSummary(colIndex);
      this.tabIndex[colIndex] = new Array(this.labels.length);
      this.labels.forEach((rowEle, rowIndex) => {
        this.tabIndex[colIndex][rowIndex] = this.isRunEntryMode ?
          calculateRunEntryTabIndex(colIndex, rowIndex, this.analyteEntry.analyteIndex,
            this.labels.length, this.analyteEntry.cumulativeLevels.length) :
          calculateLevelEntryTabIndex(colIndex, rowIndex, this.analyteEntry.analyteIndex,
            this.labels.length, this.analyteEntry.totalAnalytes);
      });
    });

  }

  public getIndexFromLevelSummary(colIndex: number): number {
    const cLevel = this.analyteEntry.cumulativeLevels[colIndex];
    for (let i = 0; i < this.analyteEntry.levelDataSet.length; i++) {
      if (this.analyteEntry.levelDataSet[i].level === cLevel) {
        return i;
      }
    }
    return null;
  }

  public isSingleSummaryEntry(): boolean {
    return this.analyteEntryType === AnalyteEntryType.Single;
  }

  public toggleEditDate(enableEditDate) {
    this.readOnlyDate = !enableEditDate;
  }

  public onNewFocus(c: number): void {
    this.currentColIndex = c;
    if (this.previousColIndex === -1) {
      this.previousColIndex = this.currentColIndex;
    } else if (this.previousColIndex !== this.currentColIndex || this.visitedColumn[c]) {
      this.visitedColumn[this.previousColIndex] = 1;
      this.previousColIndex = this.currentColIndex;
      this.validateEachEntry(this.analyteEntry);
    }
  }

  get value() {
    return this.analyteEntry;
  }

  set value(val: AnalyteSummaryEntry) {
    this.analyteEntry = val;
    if (this.previousCalibratorLot && this.previousReagentLot) {
      this.analyteEntry.changeLotData.defaultCalibratorLot = this.previousCalibratorLot;
      this.analyteEntry.changeLotData.defaultReagentLot = this.previousReagentLot;
    }
    if (!this.columnsToDisplay || !this.visitedColumn) {
      this.columnsToDisplay = this.getColumnsToDisplay(this.analyteEntry);
      this.visitedColumn = new Array(this.analyteEntry.cumulativeLevels.length).fill(0);
      this.errorMessage.forEach(a => new Array(this.analyteEntry.cumulativeLevels.length).fill(null));
      this.getTabIndex();
    }
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
      this.value = value as AnalyteSummaryEntry;
      if (this.previousCalibratorLot && this.previousReagentLot) {
        this.analyteEntry.changeLotData.defaultCalibratorLot = this.previousCalibratorLot;
        this.analyteEntry.changeLotData.defaultReagentLot = this.previousReagentLot;
      }
      this.changeLotFormControl.setValue(this.value.changeLotData);
    } else {
      if (this.analyteEntry) {
        this.analyteEntry.levelDataSet.forEach(level => {
          if (level.data && level.data.mean != null) {
            level.data.mean = null;
          }
          if (level.data && level.data.sd != null) {
            level.data.sd = null;
          }
          if (level.data && level.data.numPoints != null) {
            level.data.numPoints = null;
          }
        });
      }
      this.previousColIndex = -1;
      this.visitedColumn.fill(0);
      this.readOnlyDate = true;
      this.changeLotForm.reset();
    }
    this.changeDetection.detectChanges();
  }

  // BEGIN implement Validators
  validate(formControl: AbstractControl): { [Key: string]: boolean } {
    const analyteEntry: AnalyteSummaryEntry = formControl.value;
    let errorType = '';

    if (!this.isProductMasterLotExpired) {
      errorType = this.validateAllLevels(analyteEntry);
      this.validateEachEntry(analyteEntry);

      // Reset control to Pristine if all values are NULL
      const levelDataSets = analyteEntry.levelDataSet;
      let count = 0;
      if (levelDataSets.length > 0) {
        levelDataSets.forEach(ld => {
          if (ld.isPristine) {
            count++;
          }
        });
        if (count === levelDataSets.length) {
          formControl.markAsPristine();
        }
      }

      // Validation for Control-lot
      if (this.changeLotFormControl.errors) {
        errorType = 'LotHasExpired';
      }
    }

    switch (errorType) {
      case 'ShoulbBeGreatherThanZero': return { ShoulbBeGreatherThanZero: true };
      // case 'EnterMean' : return { EnterMean: true };
      // case 'EnterSD' : return { EnterSD: true };
      // case 'EnterPoints' : return { EnterPoints: true };
      case 'EnterAllValues': return { EnterAllValues: true };
      case 'SDShouldbeZero': return { SDShouldbeZero: true };
      case 'SDShouldbePositive': return { SDShouldbePositive: true };
      case 'LotHasExpired': return { LotHasExpired: true };
      default: {
        this.errorMessage.forEach(a => new Array(this.analyteEntry.cumulativeLevels.length).fill(null));
        return null;
      }
    }

  }
  // END implement Validators

  normalizeToRationalNumber(no) {
    if (no === '0') {
      return no;
    } else if (!!no) {
      no = no.toString();
      const spaceCount = (no.split(/\s+/gi).length - 1);
      const periodCount = (no.split(/\,+/gi).length - 1);
      let reshapedNumber = no;

      if (spaceCount === 1) {
        reshapedNumber = no.replace(/\s/g, '.');
      }
      if (periodCount === 1) {
        reshapedNumber = no.replace(/,/g, '.');
      }
      return parseFloat(reshapedNumber);
    }
  }

  private validateEachEntry(analyteEntry: AnalyteSummaryEntry): void {
    for (let i = 0; i < analyteEntry.levelDataSet.length; i++) {
      const levelData = <LevelSummary>analyteEntry.levelDataSet[i];
      const colIndex = this.columnsToDisplay.indexOf(levelData.level.toString()) - 1;
      const levelMean = this.normalizeToRationalNumber(levelData.data.mean);
      const levelSd = this.normalizeToRationalNumber(levelData.data.sd);
      const levelNumPoints = this.normalizeToRationalNumber(levelData.data.numPoints);
      // No values entered for column 'i';
      if (!levelData.data || (!isNumeric(levelMean) && !isNumeric(levelSd) && !isNumeric(levelNumPoints))) {
        levelData.isPristine = true;
        this.errorMessage[0][colIndex] = '';
        this.errorMessage[1][colIndex] = '';
        this.errorMessage[2][colIndex] = '';
        continue;
      }

      // Case-1 : If mean is not entered for column 'i';
      if (!levelMean && (levelMean !== 0)) {
        this.errorMessage[0][colIndex] = this.translationLabelDictionary['enterMeanValue'];
      } else {
        this.errorMessage[0][colIndex] = '';
      }

      // Case-1 : If sd is not entered for column 'i';
      // Case-2 : sd should be 0 when points is 1
      // Case-3 : sd should be positive value
      if (!levelSd && (levelSd !== 0)) {
        this.errorMessage[1][colIndex] = this.translationLabelDictionary['enterSDValue'];
      } else if (this.shouldSdBeZero(levelSd, levelNumPoints)) {
        this.errorMessage[1][colIndex] = this.translationLabelDictionary['sdShouldBeZero'];
      } else if (isNumeric(levelSd) && levelSd < 0) {
        this.errorMessage[1][colIndex] = this.translationLabelDictionary['sdShouldBePositive'];
      } else {
        this.errorMessage[1][colIndex] = '';
      }

      // Case-1 : If number of points is not entered for column 'i';
      // Case-2 : number-of-points should be > 0
      if (!levelNumPoints && (levelSd !== 0)) {
        this.errorMessage[2][colIndex] = this.translationLabelDictionary['enterPointValue'];
      } else if (isNumeric(levelNumPoints) && levelNumPoints <= 0) {
        this.errorMessage[2][colIndex] = this.translationLabelDictionary['shouldBeGreatherThanZero'];
      } else {
        this.errorMessage[2][colIndex] = '';
      }

      // Force change detection to apply messages from the errorMessage array.
      this.changeDetection.detectChanges();
    }
  }

  private validateAllLevels(analyteEntry: AnalyteSummaryEntry): string {
    let errorType = '';
    for (let i = 0; i < analyteEntry.levelDataSet.length; i++) {
      const levelData = <LevelSummary>analyteEntry.levelDataSet[i];
      const colIndex = this.columnsToDisplay.indexOf(levelData.level.toString()) - 1;
      const levelMean = this.normalizeToRationalNumber(levelData.data.mean);
      const levelSd = this.normalizeToRationalNumber(levelData.data.sd);
      const levelNumPoints = this.normalizeToRationalNumber(levelData.data.numPoints);

      // No values entered for column 'i';
      if (!levelData.data || (!isNumeric(levelMean) && !isNumeric(levelSd) && !isNumeric(levelNumPoints))) {
        levelData.isPristine = true;
        this.errorMessage[0][colIndex] = '';
        this.errorMessage[1][colIndex] = '';
        this.errorMessage[2][colIndex] = '';
        continue;
      }

      levelData.isPristine = false;

      if (this.shouldSdBeZero(levelSd, levelNumPoints)) {
        this.errorMessage[1][colIndex] = this.translationLabelDictionary['sdShouldBeZero'];
        errorType = 'SDShouldbeZero';
        break;
      } else {
        this.errorMessage[1][colIndex] = '';
      }
      if (isNumeric(levelSd) && levelSd < 0) {
        this.errorMessage[1][colIndex] = this.translationLabelDictionary['sdShouldBePositive'];
        errorType = 'SDShouldbePositive';
        break;
      } else {
        this.errorMessage[1][colIndex] = '';
      }
      if (isNumeric(levelNumPoints) && +levelNumPoints <= 0) {
        this.errorMessage[2][colIndex] = this.translationLabelDictionary['shouldBeGreatherThanZero'];
        errorType = 'ShoulbBeGreatherThanZero';
        break;
      } else {
        this.errorMessage[2][colIndex] = '';
      }

      // One/All of the values entered for the column 'i';
      if (!isNumeric(levelMean) || !isNumeric(levelSd) || !isNumeric(levelNumPoints)) {
        if (isNumeric(levelMean) && isNumeric(levelSd) && isNumeric(levelNumPoints)) {
          // All Values are entered;
          continue;
        } else {
          // One of the value is not entered;
          errorType = 'EnterAllValues';
          break;
        }
      }
    }

    // Force change detection to apply messages from the errorMessage array.
    this.changeDetection.detectChanges();

    return errorType;
  }

  public submit(): void {
    this.enableSubmit = false;
    this.isFormVisible = false;
    this.analyteEntry?.levelDataSet.forEach(levelData => {
      levelData.data.mean = this.normalizeToRationalNumber(levelData.data.mean);
      levelData.data.sd = this.normalizeToRationalNumber(levelData.data.sd);
      levelData.data.numPoints = this.normalizeToRationalNumber(levelData.data.numPoints);
    });
    this.submitEvent.emit(this.analyteEntry);
  }

  public cancel(): void {
    this.cancelEvent.emit();
    if (!this.isSingleEditMode) {
      this.writeValue(null);
    }
    this.enableCancel = false;
    this.isFormVisible = false;
  }

  // If number of points is 1, SD should be 0
  private shouldSdBeZero(sd: any, numPoints: any): boolean {
    return isNumeric(sd) && +sd !== 0 && isNumeric(numPoints) && +numPoints === 1;
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
  }

  evaluateCommentField(): any {
    // SR 09302020: Check for multiple comment input only on multi-data entry
    if (!this.isSingleSummary) {
      if (this.enableCommentArray.length > 0) {
        return { enableComment: '', value: true, commentArray: this.enableCommentArray };
      } else {
        return { enableComment: '', value: false, commentArray: this.enableCommentArray };
      }
    }
  }

  public requestNewConfiguration(type: NewRequestConfigType) {
    this.requestNewConfig.emit(type);
  }
}
