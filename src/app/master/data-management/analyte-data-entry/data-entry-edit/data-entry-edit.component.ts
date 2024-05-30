// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as ngrxStore from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';

import {
  AnalyteEntry,
  AnalyteEntryType,
  AnalyteSummaryEntry,
  BrAnalyteSummaryEntryComponent,
  ChangeLotModel,
  TranslationLabels,
} from 'br-component-library';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { DataManagementSpinnerService } from '../../../../shared/services/data-management-spinner.service';
import { PageSectionService } from '../../../../shared/page-section/page-section.service';
import * as fromRoot from '../../../../state/app.state';
import * as navigationStateSelector from '../../../../shared/navigation/state/selectors';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { ReagentLot } from '../../../../contracts/models/lab-setup/reagent-lot.model';
import { CalibratorLot } from '../../../../contracts/models/lab-setup/calibrator-lot.model';
import { NewRequestConfigType } from '../../../../contracts/enums/lab-setup/new-request-config-type.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';

@Component({
  selector: 'unext-data-entry-edit',
  templateUrl: './data-entry-edit.component.html',
  styleUrls: ['./data-entry-edit.component.scss']
})
export class DataEntryEditComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('analyteSummaryEntryEdit') analyteSummaryEntryEdit: BrAnalyteSummaryEntryComponent;

  public submitDataEntryEditEvent = new EventEmitter<AnalyteEntry>();
  public cancelDataEntryEditEvent = new EventEmitter();
  public onDelete = new EventEmitter<AnalyteEntry>();
  public requestNewConfig = new EventEmitter<NewRequestConfigType>();

  private inputElements: Array<ElementRef>;
  public translationLabelDictionary: TranslationLabels = new TranslationLabels();

  public isSummary: boolean;
  public labTestId: string;
  public testSpecId: number;
  public previousReagentLot: ReagentLot;
  public previousCalibratorLot: CalibratorLot;
  public isTabOrderRunEntry = true;
  public isSummaryEditMode = true;
  public selectedDateTime: Date;
  public currentDateTime = new Date();
  public availableDateFrom: Date;
  currentLanguage: string;
  public timeZone: string;

  public analyteEntryType: AnalyteEntryType;
  public analyteEntry: AnalyteSummaryEntry;

  public editFormGroup: FormGroup;
  public editFormControl: FormControl;
  public levelsToDisplay = [];
  public isSubmitting = false;
  public permissions = Permissions;

  private destroy$ = new Subject<boolean>();
  mean?: number;
  sd?: number;
  numPoints?: number;
  level?: number;
  nPts?: number;
  mydata: AnalyteEntry;
  selectedLang: any = { lcid: 'en-US' };
  navigationGetLocale$ = this.store.pipe(ngrxStore.select(navigationStateSelector.getLocale));
  public translationLabels: any = {
    peergroup: this.getTranslations('ENTRYSAVE.PEERGROUP'),
    cancel: this.getTranslations('ENTRYSAVE.CANCEL'),
    change: this.getTranslations('DATETIMEPICKER.CHANGE'),
    date: this.getTranslations('DATETIMEPICKER.DATE'),
    mean: this.getTranslations('TRANSLATION.MEAN'),
    sd: this.getTranslations('TRANSLATION.SD'),
    points: this.getTranslations('TRANSLATION.POINTS'),
    expired: this.getTranslations('ANALYTESUMMARYENTRY.LOTEXPIRED'),
    na: this.getTranslations('ANALYTESUMMARYENTRY.NA'),
    submit: this.getTranslations('ANALYTESUMMARYENTRY.SUBMIT'),
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AnalyteEntry,
    public dialogRef: MatDialogRef<DataEntryEditComponent>,
    private elem: ElementRef,
    private spinnerService: DataManagementSpinnerService,
    private cd: ChangeDetectorRef,
    private pageSectionService: PageSectionService,
    protected dateTimeHelper: DateTimeHelper,
    private store: ngrxStore.Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private codeListAPIService: CodelistApiService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService
  ) {
    this.translationLabelDictionary = this.pageSectionService.populateTranslationLabelDictionary(this.translationLabelDictionary);
  }

  async ngOnInit() {
    this.getCurrentSelectLanguage();
    this.startSpinner();
    this.instantiateFormGroup();
    this.analyteEntryType = AnalyteEntryType.Single;
    this.pullData();
    this.availableDateFrom = new Date();
    this.availableDateFrom.setMonth(this.availableDateFrom.getMonth() - 120);

    this.store.pipe(ngrxStore.select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        try {
          this.timeZone = labLocation.locationTimeZone;
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.DataEntryEditComponent + blankSpace + Operations.GetLocation)));
        }
      });
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  // this should be fine now
  public keytab(event): void {
    event.preventDefault();
    if (
      event.srcElement.attributes.tabIndex &&
      event.srcElement.attributes.tabIndex.value > 0
    ) {
      this.inputElements = this.elem.nativeElement.querySelectorAll('input');
      this.findNextTabIndex(event.srcElement.attributes.tabIndex.value);
    }
  }

  getCurrentSelectLanguage() {
    this.navigationGetLocale$.pipe(take(1))
    .subscribe(
      (lang) => {
        this.selectedLang = lang;
        this.currentLanguage = this.selectedLang.language;
      }
    );
  }

  private findNextTabIndex(currentIndex: number): void {
    let nextElement: ElementRef;
    this.inputElements.forEach(element => {
      if (element['tabIndex'] && element['tabIndex'] > currentIndex) {
        if (nextElement && nextElement['tabIndex'] > element['tabIndex']) {
          nextElement = element;
        }
        if (!nextElement) {
          nextElement = element;
        }
      }
    });
    if (nextElement) {
      nextElement.nativeElement.focus();
      nextElement.nativeElement.select();
    }
  }

  private pullData() {
    try {
      this.isSummary = this.data.isSummary;
      this.labTestId = this.data.labTestId;
      this.selectedDateTime = this.data.analyteDateTime;
      this.testSpecId = this.data.testSpecId;
      this.pageSectionService.priorAnalyteData = [];
      const priorAnalyteData = cloneDeep(this.data);
      this.pageSectionService.priorAnalyteData.push(priorAnalyteData);
      this.codeListAPIService.getTestSpecInfoFromCodeListAsync(this.testSpecId.toString()).then(testInfoSPP => {
        this.previousReagentLot = testInfoSPP.reagentLot;
        this.previousCalibratorLot = testInfoSPP.calibratorLot;
      });
      this.editFormControl.setValue(this.data);
      this.isSubmitting = false;
      this.stopSpinner();
      // TODO: TRUPTI - Check if required
      this.data.levelDataSet.forEach(item => {
        this.levelsToDisplay.push(item.level);
        /* AJT update UN 17298 remove converting value to fixed digits. 
        SInce this is editing data, the actual data should be presented like for the data entry input screen.*/
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DataEntryEditComponent + blankSpace + Operations.DialogDataPopulation)));
    }
  }

  private instantiateFormGroup() {
    this.editFormControl = new FormControl();
    this.editFormGroup = new FormGroup({
      analyteEntry: this.editFormControl
    });
  }
  public async submitEventAsync(): Promise<void> {
    this.isSubmitting = true;
    this.startSpinner();
    const updatedAnalayteEntry = this.editFormControl.value;
    this.pageSectionService.currentAnalyteData = [];
    this.pageSectionService.currentAnalyteData.push(updatedAnalayteEntry);
    this.submitDataEntryEditEvent.emit(updatedAnalayteEntry);
  }

  public cancelEventAsync(): void {
    this.cancelDataEntryEditEvent.emit();
  }

  public requestNewConfiguration(type: NewRequestConfigType) {
    this.requestNewConfig.emit(type);
  }

  public deleteData(): void {
    try {
      this.onDelete.emit(this.data);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DataEntryEditComponent + blankSpace + Operations.DialogDataPopulation)));
    }
  }

  canSubmit(): boolean {
    if (this.isSubmitting) {
      return !this.isSubmitting;
    } else {
      return this.editFormControl.valid && !this.editFormControl.pristine;
    }
  }

  public async getLotsDataEntry(): Promise<void> {
    this.startSpinner();
    this.pageSectionService.getLotsByTestSpecIdAsync(this.testSpecId)
      .then((changeLotModel: ChangeLotModel) => {
        try {
          this.data.changeLotData = changeLotModel;
          this.editFormControl.setValue(this.data);
          this.stopSpinner();
        } catch (err) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.DataEntryEditComponent + blankSpace + Operations.FetchChangedModel)));
        }
      });
  }

  private startSpinner(): void {
    this.spinnerService.displaySpinner(true);
  }

  private stopSpinner(): void {
    this.spinnerService.displaySpinner(false);
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}



