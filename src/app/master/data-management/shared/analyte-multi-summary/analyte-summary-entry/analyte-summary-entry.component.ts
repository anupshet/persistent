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
import { Subject } from 'rxjs/internal/Subject';

import { TranslateService } from '@ngx-translate/core';

import {
  AnalyteEntryType,
  AnalyteSummaryEntry,
  CustomRegex,
  sleep,
  calculateRunEntryTabIndex,
  calculateLevelEntryTabIndex,
  LevelSummary,
  isNumeric,
  AnalyteSummaryView,
  GlobalLabels,
  BaseSummary,
  LevelData,
} from 'br-component-library';
import { NewRequestConfigType } from '../../../../../contracts/enums/lab-setup/new-request-config-type.enum';
import { take } from 'rxjs/operators';
import { Utility } from '../../../../../core/helpers/utility';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { select } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import * as ngrxSelector from '@ngrx/store';

interface NavigationState {
  locale?: object;
}
interface State {
  navigation: NavigationState;
}

@Component({
  selector: 'unext-analyte-summary-entry',
  templateUrl: './analyte-summary-entry.component.html',
  styleUrls: ['./analyte-summary-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AnalyteSummaryEntryComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AnalyteSummaryEntryComponent),
      multi: true,
    },
  ],
})
export class AnalyteSummaryEntryComponent
  implements OnInit, OnChanges, ControlValueAccessor, Validators {
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
  @Input() selectedDate: Date;
  @Input() availableDateTo: Date;
  @Input() availableDateFrom: Date;
  @Output() getLots = new EventEmitter<AnalyteSummaryEntry>();
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() submitEvent = new EventEmitter<AnalyteSummaryEntry>();
  @Output() cancelEvent = new EventEmitter();
  @Output() isLotVisible: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() translationLabelDictionary: {};
  @Input() isSingleEditMode = false;
  @Input() enableSubmit: boolean;
  @Input() timeZone: string;
  @Input() isProductMasterLotExpired: boolean;
  @Input() isEditMode: boolean;
  @Input() enableCommentArray: Array<string> = [];
  @Input() isSingleSummary: boolean;
  @Input() showOptionsForm = false;
  @Input() isArchived: boolean;

  _analyteSummaryView: AnalyteSummaryView;
  @Input('analyteSummaryView')
  set analyteSummaryView(value: AnalyteSummaryView) {
    this._analyteSummaryView = value;
    this.setLevelToIndexDictionary();
  }
  get analyteSummaryView(): AnalyteSummaryView {
    return this._analyteSummaryView;
  }

  @Input() isLastDataEntry: boolean;
  @Input() productName: string;
  @Input() productLotNumber: number;
  @Input() dateTimeOffset: string;
  @Input() globalLabels: GlobalLabels = {
    mean: 'mean1',
    sd: 'sd2',
    points: 'points3',
  };
  @Input() analyteId: string;
  @Input() isDisabled: boolean;

  public columnsToDisplay: string[] = [];
  public analyteEntry: AnalyteSummaryEntry;
  public errorMessage = [[], [], []];
  public previousColIndex = -1;
  public currentColIndex: number;
  public visitedColumn: Array<number>;
  public readOnlyDate = true;
  public displayTime = false;
  public labels: any;

  public isPreviousYear: boolean;

  public tabIndex: Array<Array<number>>;
  public arrIndexFromLevelSummary: Array<number>;
  public dictLevelToArrayIndex: { [level: number]: number; } = {};
  public isSingleEntry = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  public changeLotForm: FormGroup;
  public changeLotFormControl = new FormControl();
  public regexOnlyDigitsGreaterThanZero =
    CustomRegex.ONLY_DIGITS_GREATER_THAN_ZERO;
  public regexRationalNumber = CustomRegex.RATIONAL_NUMBER;
  public showOptions: boolean;
  public mouseIsEnter: boolean;
  public inputHasFocus: boolean;

  public meanValuesToDisplay = [];
  public sdValuesToDisplay = [];
  public numPointsToDisplay = [];
  public isCommaDecimalSeperator: boolean;

  protected destroy$ = new Subject<boolean>();
  @Output() requestNewConfig: EventEmitter<NewRequestConfigType> = new EventEmitter<NewRequestConfigType>();
  getNavigationState = createFeatureSelector<NavigationState>('navigation');
  getLocale = createSelector(this.getNavigationState, (state) => state &&
  state.locale ? state.locale : { country: 'US', lcid: 'en-US', value: 'en', name: 'English' });
  navigationGetLocale$ = this.store.pipe(select(this.getLocale));

  constructor(
    private changeDetection: ChangeDetectorRef,
    private elem: ElementRef,
    private translate: TranslateService,
    private store: ngrxSelector.Store<State>,
    ) { }

  ngOnInit() {
    this.labels  = [
      'TRANSLATION.MEAN',
      'TRANSLATION.SD',
      'TRANSLATION.POINTS'
    ];
    this.createChangeLotForm();


    this.navigationGetLocale$
    .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
    .subscribe(loc => {
      if (loc) {
        const numberFormat =  (loc.hasOwnProperty('numberFormat')) ? loc['numberFormat'] : 0;
        this.isCommaDecimalSeperator =  (numberFormat === 1 ||  numberFormat === 2) ? true : false;
      }
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['selectedDate']) {
      if (this.analyteEntry) {
        this.analyteEntry.analyteDateTime = this.selectedDate;
      }
    }
  }

  private createChangeLotForm(): void {
    this.changeLotForm = new FormGroup({
      changeLot: this.changeLotFormControl,
    });
  }

  public requestLots(): void {
    this.getLots.emit(this.analyteEntry);
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

  public isLotFormVisible(value) {
    this.isLotVisible.emit(value);
  }

  private getColumnsToDisplay(
    analyteEntry: AnalyteSummaryEntry
  ): Array<string> {
    const columnsToDisplay: Array<string> = [];
    columnsToDisplay.push('label');
    if (analyteEntry && this.analyteEntry.cumulativeLevels) {
      analyteEntry.cumulativeLevels.forEach((level) => {
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
      this.arrIndexFromLevelSummary[colIndex] =
        this.getIndexFromLevelSummary(colIndex);
      this.tabIndex[colIndex] = new Array(this.labels.length);
      this.labels.forEach((rowEle, rowIndex) => {
        this.tabIndex[colIndex][rowIndex] = this.isRunEntryMode
          ? calculateRunEntryTabIndex(
            colIndex,
            rowIndex,
            this.analyteEntry.analyteIndex,
            this.labels.length,
            this.analyteEntry.cumulativeLevels.length
          )
          : calculateLevelEntryTabIndex(
            colIndex,
            rowIndex,
            this.analyteEntry.analyteIndex,
            this.labels.length,
            this.analyteEntry.totalAnalytes
          );
      });
    });
  }

  private setLevelToIndexDictionary() {
    this.dictLevelToArrayIndex = new Array(this._analyteSummaryView.levelDataSet.length);
    for (let i = 0; i < this._analyteSummaryView.levelDataSet.length; i++) {
      this.dictLevelToArrayIndex[this._analyteSummaryView.levelDataSet[i].level] = i;
    }
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
    } else if (
      this.previousColIndex !== this.currentColIndex ||
      this.visitedColumn[c]
    ) {
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

    if (!this.columnsToDisplay || !this.visitedColumn) {
      this.columnsToDisplay = this.getColumnsToDisplay(this.analyteEntry);
      this.visitedColumn = new Array(
        this.analyteEntry.cumulativeLevels.length
      ).fill(0);
      this.errorMessage.forEach((a) =>
        new Array(this.analyteEntry.cumulativeLevels.length).fill(null)
      );
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
      this.changeLotFormControl.setValue(this.value.changeLotData);
    } else {
      if (this.analyteEntry) {
        this.analyteEntry.levelDataSet.forEach((level) => {
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


  toCommaDecimalSeperator(no) {
    if (!!no) {
      const regex = /\./g;
      no = no.toString();
      return  no.replace(regex, ',');
    }
  }

  // BEGIN implement Validators
  validate(formControl: AbstractControl): { [Key: string]: boolean } {
    const analyteEntry: AnalyteSummaryEntry = formControl.value;
    let errorType = '';
    // AJ bug fix 231798
    if (!this.isProductMasterLotExpired && analyteEntry) {
      errorType = this.validateAllLevels(analyteEntry);
      this.validateEachEntry(analyteEntry);

      // Reset control to Pristine if all values are NULL
      const levelDataSets = analyteEntry.levelDataSet;
      let count = 0;
      if (levelDataSets.length > 0) {
        levelDataSets.forEach((ld) => {
          if (ld.isPristine) {
            count++;
          }
        });
        if (count === levelDataSets.length) {
          formControl.markAsPristine();
        }
      }

      // Native Angular forms validators after check validity out of box returns number (and we need to be a string)
     if (this.isCommaDecimalSeperator) {
        for (let i = 0; i < analyteEntry.levelDataSet.length; i++) {
          const levelData = <LevelSummary>analyteEntry.levelDataSet[i];
          if (levelData.data) {
            levelData.data.mean = this.toCommaDecimalSeperator(levelData.data.mean);
            levelData.data.sd = this.toCommaDecimalSeperator(levelData.data.sd);
            levelData.data.numPoints = this.toCommaDecimalSeperator(levelData.data.numPoints);
          }
        }
        this.analyteEntry.levelDataSet =  levelDataSets;
      }

      // Validation for Control-lot
      if (this.changeLotFormControl.errors) {
        errorType = 'LotHasExpired';
      }
    }

    switch (errorType) {
      case 'ShoulbBeGreatherThanZero':
        return { ShoulbBeGreatherThanZero: true };
      // case 'EnterMean' : return { EnterMean: true };
      // case 'EnterSD' : return { EnterSD: true };
      // case 'EnterPoints' : return { EnterPoints: true };
      case 'EnterAllValues':
        return { EnterAllValues: true };
      case 'SDShouldbeZero':
        return { SDShouldbeZero: true };
      case 'SDShouldbePositive':
        return { SDShouldbePositive: true };
      case 'LotHasExpired':
        return { LotHasExpired: true };
      default: {
        this.errorMessage.forEach((a) =>
          new Array(this.analyteEntry.cumulativeLevels.length).fill(null)
        );
        return null;
      }
    }
  }
  // END implement Validators

  private validateEachEntry(analyteEntry: AnalyteSummaryEntry): void {
    for (let i = 0; i < analyteEntry.levelDataSet.length; i++) {
      const levelData = <LevelSummary>analyteEntry.levelDataSet[i];
      const colIndex =
        this.columnsToDisplay.indexOf(levelData.level.toString()) - 1;
        const levelMean = Utility.normalizeToRationalNumber(levelData.data.mean);
        const levelSd = Utility.normalizeToRationalNumber(levelData.data.sd);
        const levelNumPoints = Utility.normalizeToRationalNumber(levelData.data.numPoints);
      // No values entered for column 'i';
      if (
        !levelData.data ||
        (!isNumeric(levelMean) &&
          !isNumeric(levelSd) &&
          !isNumeric(levelNumPoints))
      ) {
        levelData.isPristine = true;
        this.errorMessage[0][colIndex] = '';
        this.errorMessage[1][colIndex] = '';
        this.errorMessage[2][colIndex] = '';
        continue;
      }

      // Case-1 : If mean is not entered for column 'i';
      if (!levelMean && levelMean !== 0) {
        this.errorMessage[0][colIndex] =
          this.translationLabelDictionary['enterMeanValue'];
      } else {
        this.errorMessage[0][colIndex] = '';
      }

      // Case-1 : If sd is not entered for column 'i';
      // Case-2 : sd should be 0 when points is 1
      // Case-3 : sd should be positive value
      if (!levelSd && levelSd !== 0) {
        this.errorMessage[1][colIndex] =
          this.translationLabelDictionary['enterSDValue'];
      } else if (
        this.shouldSdBeZero(levelSd, levelNumPoints)
      ) {
        this.errorMessage[1][colIndex] =
          this.translationLabelDictionary['sdShouldBeZero'];
      } else if (isNumeric(levelSd) && levelSd < 0) {
        this.errorMessage[1][colIndex] =
          this.translationLabelDictionary['sdShouldBePositive'];
      } else {
        this.errorMessage[1][colIndex] = '';
      }

      // Case-1 : If number of points is not entered for column 'i';
      // Case-2 : number-of-points should be > 0
      if (!levelNumPoints && levelSd !== 0) {
        this.errorMessage[2][colIndex] =
          this.translationLabelDictionary['enterPointValue'];
      } else if (
        isNumeric(levelNumPoints) &&
        levelNumPoints <= 0
      ) {
        this.errorMessage[2][colIndex] =
          this.translationLabelDictionary['shouldBeGreatherThanZero'];
      } else {
        this.errorMessage[2][colIndex] = '';
      }
    }
  }

  private validateAllLevels(analyteEntry: AnalyteSummaryEntry): string {
    let errorType = '';
    for (let i = 0; i < analyteEntry.levelDataSet.length; i++) {
      const levelData = <LevelSummary>analyteEntry.levelDataSet[i];
      const colIndex =
        this.columnsToDisplay.indexOf(levelData.level.toString()) - 1;
        const levelMean = Utility.normalizeToRationalNumber(levelData.data.mean);
        const levelSd = Utility.normalizeToRationalNumber(levelData.data.sd);
        const levelNumPoints = Utility.normalizeToRationalNumber(levelData.data.numPoints);
      // No values entered for column 'i';
      if (
        !levelData.data ||
        (!isNumeric(levelMean) &&
          !isNumeric(levelSd) &&
          !isNumeric(levelNumPoints))
      ) {
        levelData.isPristine = true;
        this.errorMessage[0][colIndex] = '';
        this.errorMessage[1][colIndex] = '';
        this.errorMessage[2][colIndex] = '';
        continue;
      }

      levelData.isPristine = false;

      if (this.shouldSdBeZero(levelSd, levelNumPoints)) {
        this.errorMessage[1][colIndex] =
          this.translationLabelDictionary['sdShouldBeZero'];
        errorType = 'SDShouldbeZero';
        break;
      } else {
        this.errorMessage[1][colIndex] = '';
      }
      if (isNumeric(levelSd) && levelSd < 0) {
        this.errorMessage[1][colIndex] =
          this.translationLabelDictionary['sdShouldBePositive'];
        errorType = 'SDShouldbePositive';
        break;
      } else {
        this.errorMessage[1][colIndex] = '';
      }
      if (
        isNumeric(levelNumPoints) &&
        +levelNumPoints <= 0
      ) {
        this.errorMessage[2][colIndex] =
          this.translationLabelDictionary['shouldBeGreatherThanZero'];
        errorType = 'ShoulbBeGreatherThanZero';
        break;
      } else {
        this.errorMessage[2][colIndex] = '';
      }

      // One/All of the values entered for the column 'i';
      if (
        !isNumeric(levelMean) ||
        !isNumeric(levelSd) ||
        !isNumeric(levelNumPoints)
      ) {
        if (
          isNumeric(levelMean) &&
          isNumeric(levelSd) &&
          isNumeric(levelNumPoints)
        ) {
          // All Values are entered;
          continue;
        } else {
          // One of the value is not entered;
          errorType = 'EnterAllValues';
          break;
        }
      }
    }

    return errorType;
  }

  public submit(): void {
    this.enableSubmit = false;
    this.analyteEntry?.levelDataSet.forEach(levelData => {
      levelData.data.mean = Utility.normalizeToRationalNumber(levelData.data.mean);
      levelData.data.sd = Utility.normalizeToRationalNumber(levelData.data.sd);
      levelData.data.numPoints = Utility.normalizeToRationalNumber(levelData.data.numPoints);
    });
    this.submitEvent.emit(this.analyteEntry);
  }

  public cancel(): void {
    this.cancelEvent.emit();

    if (!this.isSingleEditMode) {
      this.writeValue(null);
    }
  }

  // If number of points is 1, SD should be 0
  private shouldSdBeZero(sd: any, numPoints: any): boolean {
    return (
      isNumeric(sd) && +sd !== 0 && isNumeric(numPoints) && +numPoints === 1
    );
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
        return {
          enableComment: '',
          value: true,
          commentArray: this.enableCommentArray,
        };
      } else {
        return {
          enableComment: '',
          value: false,
          commentArray: this.enableCommentArray,
        };
      }
    }
  }

  public requestNewConfiguration(type: NewRequestConfigType) {
    this.requestNewConfig.emit(type);
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
