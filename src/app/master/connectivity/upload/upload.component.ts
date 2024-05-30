/* © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved.*/
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subject, forkJoin } from 'rxjs';
import { concatMap, filter, take, takeUntil } from 'rxjs/operators';
import { orderBy } from 'lodash';
import * as ngrxStore from '@ngrx/store';

import * as connectivityStateSelector from '../state/selectors';
import * as fromRoot from '../../../state/app.state';
import * as navigationStateSelector from '../../../shared/navigation/state/selectors';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { ConnectivityFileError } from '../shared/models/connectivity-file-error.model';
import { FileReceiveService } from '../shared/services/file-receive.service';
import { FileVerificationService } from '../shared/services/file-verification.service';
import { unRouting } from '../../../core/config/constants/un-routing-methods.const';
import { HeaderService } from '../shared/header/header.service';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../../shared/icons/icons.service';
import { ApiService } from '../../../shared/api/api.service';
import { allDates, asc, dateRangeOpened, fileFailureStatus, fileSuccessStatus } from '../../../core/config/constants/general.const';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { blankSpace, componentInfo, Operations } from '../../../core/config/constants/error-logging.const';
import { ParsingInfo } from '../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { LabLotTest, LabLotTestType, SlideGenSchedule } from '../shared/models/lab-lot-test.model';
import { LabConfigurationApiService } from '../../../shared/services/lab-configuration.service';
import { MessageSnackBarService } from '../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { Permissions } from '../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { AppNavigationTrackingService } from '../../../shared/services/appNavigationTracking/app-navigation-tracking.service';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrackingEvent } from '../../../shared/models/audit-tracking.model';
import { ParsingJobConfig } from '../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';
import { UpdateStatus } from '../shared/models/connectivity-status.model';
import { LocaleConverter } from '../../../shared/locale/locale-converter.service';
import { LocalizationService } from '../../../shared/navigation/services/localizaton.service';
import { LocalizationDatePickerHelper, DATEPICKER_FORMATS } from '../../../shared/localization-date-time/localization-date-time-formats';


@Component({
  selector: 'unext-upload-dialog',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DATEPICKER_FORMATS },
  ],
})
export class UploadComponent implements OnInit, OnDestroy {
  @Input() labId: string;
  @Input() accountNumber: string;
  @Input() accountId: string;
  @Input() userId: string;
  @Input() userName: string;
  @Input() labLocationId: string;
  @Input() accountLocationTimeZone: string;
  @Output() activeLink: EventEmitter<string> = new EventEmitter<string>();
  public instructions: ParsingInfo;
  selectedInstruction: ParsingJobConfig = {
    name: '',
    id: '',
    edgeDeviceIds: []
  };
  public instructionsCount: number;
  multipleInstructionsSelectedValue;
  public isInstructionOkay = false;

  @ViewChild('fileInput') fileInput: ElementRef;

  fileList: FileList;  // FileList is read only, so selectedFiles is added for removing files in the UI
  dragClass = '';
  selectedFiles: File[];

  isDefaultDialog: boolean;
  isUploadInProgress: boolean;
  isUploadSuccessful: boolean;
  isMappingOrStatusDialog: boolean;

  hasFileError = false;
  fileErrorObject: ConnectivityFileError = {
    code: '',
    messages: '',
    isFileOptionsError: undefined
  };

  canReset = false;
  hadEvent = false;
  hasFile = false;
  hasWarning = false;
  fileUploadResponse: Subject<any> = new Subject();
  fileStatus: Subject<any> = new Subject();
  handlesSlideGen = false;

  today = new FormControl(new Date());
  tomorrow = new Date();
  currentLanguage: string;
  todaySerializedDate = new FormControl(new Date().toISOString());
  dateType = allDates;
  isStartDatePickerDisabled = false;
  isEndDatePickerDisabled = false;
  startDatePickerValue = this.today.value;
  endDatePickerValue;
  isDateRangeOkay = true;
  labLocationDate = new Date();
  slideGenPromptValue = '';
  showUploadButton: boolean;
  configurationList: Array<ParsingJobConfig>;
  public showScheduler: boolean;
  public hasSlideGenAnalytes: boolean;
  public slideGenAnalytes: Array<LabLotTest>;
  permissions = Permissions;
  selectedLang: any = { locale: 'en-US' };
  public destroy$ = new Subject<boolean>();
  navigationGetLocale$ = this.store.pipe(select(navigationStateSelector.getLocale));
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.publish[48],
    icons.fileOkay[32],
    icons.fileError[32],
    icons.edit[24]
  ];

  constructor(
    private activateRoute: ActivatedRoute,
    private fileReceiveService: FileReceiveService,
    private fileVerificationService: FileVerificationService,
    private dateTimeHelper: DateTimeHelper,
    private router: Router,
    private location: Location,
    private _headerService: HeaderService,
    private iconService: IconService,
    private apiService: ApiService,
    private errorLoggerService: ErrorLoggerService,
    private labConfigurationApiService: LabConfigurationApiService,
    private messageSnackBar: MessageSnackBarService,
    private brPermissionsService: BrPermissionsService,
    private appNavigationService: AppNavigationTrackingService,
    private translate: TranslateService,
    @Inject(MAT_DATE_LOCALE) private language: string,
    private adapter: DateAdapter<any>,
    private localeConverter: LocaleConverter,
    private store: Store<fromRoot.State>,
    private localizationService: LocalizationService,
    private localizationDatePickerHelper: LocalizationDatePickerHelper,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.navigationGetLocale$.pipe(take(1))
      .subscribe((lang) => {
        this.localizationDatePickerHelper.getShortDateFormatString(lang);
        this.selectedLang = lang;
        this.currentLanguage = this.selectedLang.language === 'zh' ? 'zh-CN' : this.selectedLang.language;
        this.setAdapterLocale(this.currentLanguage);
      });
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    this.showBox('1');

    this.activateRoute.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(paramMap => {
        this.getInstructions();
        this.getLabLotTests();
      });

    const currentDate = this.dateTimeHelper.getNowWithInputFormat(this.accountLocationTimeZone);
    this.labLocationDate = new Date(currentDate.tzDateTime.DateFormatted);
  }

  setAdapterLocale(currentLanguage) {
    switch (currentLanguage) {
        // For both English & English UK
        case 'en':
            this.adapter.setLocale('en-US');
            break;
        case 'es':
            this.adapter.setLocale('es-ES');
            break;
        // For both French & French Canada
        case 'fr':
            this.adapter.setLocale('fr-FR');
            break;
        case 'it':
            this.adapter.setLocale('it-IT');
            break;
        case 'pt':
            this.adapter.setLocale('pt-PT');
            break;
        case 'pl':
            this.adapter.setLocale('pl-PL');
            break;
        case 'hu':
            this.adapter.setLocale('hu-HU');
            break;
        case 'de':
            this.adapter.setLocale('de-DE');
            break;
        case 'ru':
            this.adapter.setLocale('ru-RU');
            break;
        case 'ko':
            this.adapter.setLocale('ko-KR');
            break;
        case 'ja':
            this.adapter.setLocale('ja-JP');
            break;
        case 'zh-CN':
            this.adapter.setLocale('zh-CN');
            break;
        default:
            this.adapter.setLocale('en-US');
            break;
    }
  }

  onBackFromScheduler(): void {
    this.showScheduler = false;
    this.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getInstructions(): void {
    this.store.pipe(ngrxStore.select(connectivityStateSelector.getConfigurations))
      .pipe(takeUntil(this.destroy$))
      .subscribe(getConfigurations => {
        this.instructions = getConfigurations;
        this.configurationList = this.instructions?.configs?.filter(el => el.isConfigured);
        this.configurationList = orderBy(this.configurationList, [el => el.name.replace(/\s/g, '')
          .toLocaleLowerCase()], [asc]);

        this.instructionsCount = this.configurationList?.length;
        if (this.configurationList?.length === 0) {
          this.selectedInstruction['name'] = '';
          this.selectedInstruction['id'] = '';
          this.isInstructionOkay = false;
        }

        if (this.configurationList?.length === 1) {
          this.selectedInstruction['name'] = this.configurationList[0].name;
          this.selectedInstruction['id'] = this.configurationList[0].id;
          this.isInstructionOkay = true;
          this.handlesSlideGen = this.configurationList[0].handlesSlideGen;
          this.dateType = this.handlesSlideGen ? dateRangeOpened : allDates;
        }
      });
  }

  public getLabLotTests() {
    this.labConfigurationApiService.getTests(this.labLocationId, LabLotTestType.Microslide).pipe(filter(analytes => !!analytes), take(1))
      .subscribe((analytes: Array<LabLotTest>) => {
        this.slideGenAnalytes = analytes;
        this.hasSlideGenAnalytes = this.slideGenAnalytes.length > 0 ? true : false;
      });
  }

  fileChange(event) {
    const files = event.target.files;
    // Cancel was selected
    if (files.length === 0) {
      return;
    }
    this.fileVerificationService.handlesSlideGen = this.handlesSlideGen;
    this.verifyChange(files);
    this.selectedFiles = [];
    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(files[i]);
    }
  }

  verifyChange(files): void {
    this.hadEvent = true;

    this.hasFileError = false;
    this.fileErrorObject = this.fileVerificationService.getEmptyErrorObj();
    this.hasWarning = false;

    if (this.configurationList.length === 1) {
      this.isInstructionOkay = true;
    }
    const errorObject = this.fileVerificationService.verifyFile(files);
    if (errorObject !== null) {
      if (errorObject.code === '10') {
        this.hasWarning = true;
      } else {
        this.onError(errorObject);
      }
    }

    this.fileList = files;
    this.resetEligibility();
    if (!this.hasFileError) {
      this.hasFile = true;
    }
  }

  onError(errorObj): void {
    this.hasFileError = true;
    this.fileErrorObject = errorObj;
    this.showBox('1');
  }

  adjustTime() {
    const start = new Date(this.startDatePickerValue);
    const end = new Date(this.endDatePickerValue);

    const startDay = start.getDay();
    const startHours = start.getHours();
    const startMins = start.getMinutes();
    const endDay = end.getDay();

    end.setHours(startHours);

    if (startDay !== endDay) {
      end.setMinutes(startMins);
    } else {
      end.setMinutes(startMins + 1);
    }

    this.startDatePickerValue = start.toISOString();
    this.endDatePickerValue = end.toISOString();
  }

  initFileUpload(slideGenSchedules: Array<SlideGenSchedule> = null) {
    this.showScheduler = false;
    if (this.fileList?.length > 0) {
      this.hasFile = true;
      this.hadEvent = false;

      if (this.dateType === allDates) {
        this.startDatePickerValue = '';
        this.endDatePickerValue = '';
      } else {
        this.adjustTime();
      }

      const data = {
        parsingJobName: this.selectedInstruction['name'],
        parsingJobId: this.selectedInstruction['id'],
        startDate: this.startDatePickerValue,
        endDate: this.endDatePickerValue,
        slideGenSchedules: slideGenSchedules,
        fileNames: []
      };

      this.showBox('2');

      const statusData: UpdateStatus = {
        id: '',
        status: fileSuccessStatus,
        error: ''
      };

      this.processUpload(data, statusData);
    }
  }

  updateSlidegenSelection(selectedValue: string) {
    this.showUploadButton = (selectedValue === 'no') ? true : false;
  }

  displaySlideGenScheduler() {
    if (this.slideGenPromptValue === 'yes') {
      this.showScheduler = true;
    }
  }

  processUpload(data, statusData) {
    // processing upload of single or multiple files
    this.selectedFiles.forEach((selectedFile, index) => {
      data.fileNames.push(this.selectedFiles[index].name);
      const error = 0;
      /* if error on any file terminate upload */
      if (error !== 0) {
        return;
      }
    });
    this.uploadFiles(this.selectedFiles, data, statusData);
  }

  uploadFiles(files: File[], data, statusData: UpdateStatus) {
    this.fileReceiveService.postFiles(data).pipe(
      concatMap(fileUploadResponse => {
        if (fileUploadResponse) {
          statusData = {
            id: fileUploadResponse.id,
            status: fileSuccessStatus,
            error: '',
            locationId: this.labLocationId,
          };
        }
        return this.putFilesWithS3(fileUploadResponse, files, statusData);
      }),
      concatMap(res => {
        try {
          this.showBox('3');
          this.sendAuditTrailPayload(data, AuditTrackingEvent.FileUpload,
            AuditTrackingAction.FileUpload, AuditTrackingActionStatus.Success);
          this.routeTo('status');
          // update file status only once for multi or single file upload
          this.fileReceiveService.updateFileStatus(statusData)
            .pipe(take(1))
            .subscribe((status) => this.fileStatus.next(status));
          return this.fileStatus.asObservable();
        } catch (error) {
          setTimeout(() => {
            this.showBox('4');
          }, 1500);
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              componentInfo.UploadComponent + blankSpace + Operations.OnUpdateFileStatus
            ));
          this.sendAuditTrailPayload(data, AuditTrackingEvent.FileUpload,
            AuditTrackingAction.FileUpload, AuditTrackingActionStatus.Failure);
        }
      })
    ).pipe(takeUntil(this.destroy$))
      .subscribe(result => { },
        error => {
          if (error.status === 400) {
            this.messageSnackBar.showMessageSnackBar(this.getTranslations('TRANSLATION.INVALIDFILE'), 3000);
            this.showBox('1');
          }
          this.sendAuditTrailPayload(data, AuditTrackingEvent.FileUpload,
            AuditTrackingAction.FileUpload, AuditTrackingActionStatus.Failure);
        });
  }

  putFilesWithS3(fileUploadResponse, selectedFile: File[], statusData: UpdateStatus): Observable<any> {
    const response = fileUploadResponse.files;
    const fileObservables = [];
    response.forEach((uploadedFile, index) => {
      fileObservables.push(this.apiService.putFileWithS3(uploadedFile.url, selectedFile[index], true));
    });
    if (fileObservables.length > 0 && response.length === fileObservables.length) {
      forkJoin(fileObservables).subscribe((res) => {
        if (res) {
          try {
            this.fileUploadResponse.next(res[0]);
          } catch (error) {
            this.errorLoggerService.logErrorToBackend(
              this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
                componentInfo.UploadComponent + blankSpace + Operations.OnUploadingFilesToS3
              ));
          }
        }
      }, error => {
        statusData.status = fileFailureStatus;
        this.fileReceiveService.updateFileStatus(statusData)
          .pipe(take(1))
          .subscribe((status) => this.fileStatus.next(status));
      }
      );
    }
    return this.fileUploadResponse.asObservable();
  }

  reset(): void {

    const currentDate = this.dateTimeHelper.getNowWithInputFormat(this.accountLocationTimeZone);
    this.labLocationDate = new Date(currentDate.tzDateTime.DateFormatted);

    this.canReset = false;
    this.hadEvent = false;
    this.fileList = null;
    this.hasFile = false;
    this.dateType = allDates;
    this.dragClass = '';
    this.selectedInstruction = {
      name: '',
      id: '',
      edgeDeviceIds: []
    };
    this.multipleInstructionsSelectedValue = undefined;
    this.isInstructionOkay = this.configurationList.length === 1 ? true : false;

    this.showBox('1');

    this.hasFileError = false;
    this.fileErrorObject = this.fileVerificationService.getEmptyErrorObj();
    this.hasWarning = false;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = null;
    }

    this.today = new FormControl(new Date());
    this.isStartDatePickerDisabled = false;
    this.isEndDatePickerDisabled = false;
    this.startDatePickerValue = this.today.value;
    this.endDatePickerValue = null;
    this.isDateRangeOkay = true;
    this.selectedFiles = [];
    this.slideGenPromptValue = '';
    this.showUploadButton = false;
  }

  showBox(id: string): void {
    switch (id) {
      case '1':
        this.isDefaultDialog = true;
        this.isUploadInProgress = false;
        this.isUploadSuccessful = false;
        this.isMappingOrStatusDialog = false;
        break;
      case '2':
        this.isDefaultDialog = false;
        this.isUploadInProgress = true;
        this.isUploadSuccessful = false;
        this.isMappingOrStatusDialog = false;
        break;
      case '3':
        this.isDefaultDialog = false;
        this.isUploadInProgress = false;
        this.isUploadSuccessful = true;
        this.isMappingOrStatusDialog = false;
        break;
      case '4':
        this.isDefaultDialog = false;
        this.isUploadInProgress = false;
        this.isUploadSuccessful = false;
        this.isMappingOrStatusDialog = true;
        break;
    }
  }

  routeTo(direction: string) {

    let subPath, url;
    const root = unRouting.connectivity.connectivity;
    const labs = unRouting.connectivity.labs.replace(':id', this.labId);

    switch (direction) {
      case 'status':
        this.activeLink.emit('status');
        subPath = unRouting.connectivity.status;
        url = `${root}/${labs}/${subPath}`;
        this.location.go(
          this.router.createUrlTree([url]).toString()
        );
        this._headerService.setDialogComponent('status');
        break;
      case 'mapping':
        this.activeLink.emit('mapping');
        subPath = `${unRouting.connectivity.mapping}/${unRouting.connectivity.map.instrument
          }`;
        url = `${root}/${labs}/${subPath}`;
        this.location.go(
          this.router.createUrlTree([url]).toString()
        );
        this._headerService.setDialogComponent('mapping');
        break;
      default:
        return;
    }
  }

  // Drag&Drop events
  onDrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = '';

    this.verifyChange(evt.dataTransfer.files);
    this.selectedFiles = [];
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      this.selectedFiles.push(evt.dataTransfer.files[i]);
    }
  }

  onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = 'box-on-drag';
  }

  onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragClass = '';
  }

  onDateRangeChange(): void {
    this.hadEvent = true;

    const isSlideGen = this.handlesSlideGen;

    if (this.dateType === dateRangeOpened || isSlideGen) {
      this.today = new FormControl(new Date());
      this.isStartDatePickerDisabled = false;
      this.isEndDatePickerDisabled = false;
      this.startDatePickerValue = this.today.value;
      this.endDatePickerValue = null;
      this.isDateRangeOkay = false;
    } else {
      this.isDateRangeOkay = true;
    }

    this.resetEligibility();
  }

  addStartDatePickerEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.hadEvent = true;
    this.isEndDatePickerDisabled = false;
    this.startDatePickerValue = event.value;

    // If you re-enter starting date after choosing end date
    if (this.endDatePickerValue) {
      const start = new Date(this.startDatePickerValue).getTime();
      const end = new Date(this.endDatePickerValue).getTime();

      // Wrong starting date
      if (start > end) {
        this.endDatePickerValue = null;
        this.isDateRangeOkay = false;
      } else {
        this.isDateRangeOkay = true;
      }
    }
  }

  addEndDatePickerEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.hadEvent = true;
    this.endDatePickerValue = event.value;
    this.isDateRangeOkay = true;
  }

  onSelectionChange(val) {
    this.selectedInstruction = val;
    this.isInstructionOkay = true;
    this.hadEvent = true;
    this.handlesSlideGen = val.handlesSlideGen;
    if (this.handlesSlideGen) {
      this.dateType = dateRangeOpened;
      this.onDateRangeChange();
    } else {
      this.dateType = allDates;
    }
  }

  // Reset eligibility
  resetEligibility(): void {
    let flag = false;

    // Datepicker
    if (this.dateType === dateRangeOpened) {
      flag = true;
    } else if (this.fileList && this.fileList.length > 0) {
      flag = true;
    }

    this.canReset = flag;
  }

  fileDelete(fileToRemove: string) {
    this.selectedFiles.forEach((value, index) => {
      if (value.name === fileToRemove) { this.selectedFiles.splice(index, 1); }
    });
    this.verifyChange(this.selectedFiles);
    this.hasFile = this.selectedFiles.length <= 0 ? false : true;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  public sendAuditTrailPayload(fileUploadData: any, eventType: string, action: string, actionStatus: string): void {
    const auditTrailFinalPayload = this.prepareAuditTrailPayload(fileUploadData, eventType, action, actionStatus);
    this.appNavigationService.logAuditTracking(auditTrailFinalPayload, true);
  }

  public prepareAuditTrailPayload(fileUploadData: any, eventType: string, action: string, actionStatus: string): AppNavigationTracking {
    const auditPayload: AppNavigationTracking = {
      auditTrail: {
        eventType: eventType,
        action: action,
        actionStatus: actionStatus,
        currentValue: { ...fileUploadData },
      }
    };
    return auditPayload;
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}


