// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import * as sharedStateSelector from '../../../../../shared/state/selectors';
import * as _moment from 'moment';
import * as selectors from '../../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../../../../state/app.state';
import * as fromSecuritySelector from '../../../../../security/state/selectors';
import * as fromNavigationSelector from '../../../../../shared/navigation/state/selectors';
import { icons } from '../../../../../core/config/constants/icon.const';
import { CustomCalendarHeaderComponent } from '../../../../data-management/unity-report/custom-calendar-header/custom-calendar-header.component';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import { IconService } from '../../../../../shared/icons/icons.service';
import { TreePill } from '../../../../../contracts/models/lab-setup/tree-pill.model';
import { unRouting } from '../../../../../core/config/constants/un-routing-methods.const';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { ReportType } from '../../../models/report-type';
import { NavBarActions } from '../../../../../shared/navigation/state/actions';
import { IconType, ReportDialogType, StyleOfBtn, TypeOfDialog } from '../../../models/report-dialog';
import { ReportsGenericDialogComponent } from '../reports-generic-dialog/reports-generic-dialog.component';
import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { GenerateReport } from '../../../models/template-response';
import { DynamicReportsService } from '../../services/dynamic-reports.service';
import { LabConfigResponse, SearchObject } from '../../../models/report-info';
import { underscore } from '../../../../../core/config/constants/general.const';
import { LabLocation } from '../../../../../contracts/models/lab-setup';
import { AppUser } from '../../../../../security/model';
import { ITemplate } from '../../../reporting.enum';
import { CommonService } from '../../services/common.service';
import { ActionType } from '../../../../../contracts/enums/action-type.enum';
import { NavigationService } from '../../../../../shared/navigation/navigation.service';
import { ConfirmNavigateGuard } from '../../../shared/guard/confirm-navigate.guard';
import * as navigationStateSelector from '../../../../../shared/navigation/state/selectors';
import { PastReportsFilterReportList } from '../../../../../core/config/constants/past-reports.const';

const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'unext-report-parameters-filter',
  templateUrl: './report-parameters-filter.component.html',
  styleUrls: ['./report-parameters-filter.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    CommonService
  ],
})
export class ReportParametersFilterComponent implements OnInit, OnChanges, OnDestroy {
  private dialogRef: MatDialogRef<ReportsGenericDialogComponent>;
  @ViewChild('matReportType') matReportType;
  @ViewChild('reportTemplate') reportTemplate;
  @Input() hasError: boolean;
  @Input() errorMessage: string;
  @Input() labConfigData: LabConfigResponse;
  @Input() sendTemplateDetails: ITemplate;
  @Output() isClearSelection: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() labConfigDataChange: EventEmitter<LabConfigResponse> = new EventEmitter<LabConfigResponse>();
  @Output() searchReportApiCall: EventEmitter<SearchObject> = new EventEmitter<SearchObject>();
  maxDate = new Date();
  date = new FormControl(moment());
  customCalendarHeader = CustomCalendarHeaderComponent;
  icons = icons;
  selectedNode: TreePill;
  selectedLeaf: TreePill;
  public currentBranch: TreePill[];
  public breadcrumbList: TreePill[];
  newReportsForm: FormGroup;
  selectTemplateData: ITemplate;
  recentlySelectedTypes: Array<string> = [];
  allSelected = false;
  createReportSelectedYear = moment().year();
  createReportSelectedMonth = moment().month() + 1;
  data = {
    chosenReports: new Array,
    yearMonth: `${this.createReportSelectedYear}${this.getMonth(this.createReportSelectedMonth)}`
  };
  public navigationCurrentlySelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode));
  reportList: Array<ReportType> = [
    { key: '0', reportCategory: 'All', reportType: '0_1_2' },
    { key: '1', reportCategory: 'Monthly Evaluation', reportType: '0' },
    { key: '2', reportCategory: 'Lab Comparison', reportType: '1' },
    { key: '3', reportCategory: 'Lab Histogram', reportType: '2' },
  ];

  iconsUsed: Array<Icon> = [
    icons.replay[24],
  ];

  protected destroy$ = new Subject<boolean>();
  private createButtonStatus$: Subscription;
  showCreateButton = false;
  labLocation: LabLocation;
  currentUser: AppUser;
  instrumentGroupByDept = false;
  reportDate: string;
  actionType = ActionType;
  isSearchEnabled = false;
  selectedLang: any = { lcid: 'en-US' };

  constructor(private dialog: MatDialog, private iconService: IconService, private router: Router,
    private formBuilder: FormBuilder, private store: Store<fromRoot.State>,
    private dynamicReportingService: DynamicReportingService,
    private dynamicReportsService: DynamicReportsService,
    private navigationService: NavigationService,
    private confirmNavigate: ConfirmNavigateGuard,
    private adapter: DateAdapter<any>,
    private translate: TranslateService,
    private commonService: CommonService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
    this.getDateFormatString();
    this.newReportsForm = this.formBuilder.group({
      reportType: new FormControl([])
    });
    this.store.pipe(select(selectors.getCurrentlySelectedLeaf), takeUntil(this.destroy$)).subscribe((selectedLeaf) => {
      this.selectedLeaf = selectedLeaf;
    });
    this.getLabLocationData();
    this.getCurrentUser();

    this.store.pipe(select(selectors.getCurrentlySelectedNode),
      takeUntil(this.destroy$)).subscribe((selectedNode) => {
        this.selectedNode = null;
        if (selectedNode) {
          this.selectedNode = JSON.parse(JSON.stringify(selectedNode));
          if (this.selectedNode.reportCreate) {
            const year = +(this.selectedNode.reportCreate?.slice(0, 4));
            const month = +(this.selectedNode.reportCreate?.slice(4));
            const months = month - 1;
            this.date = new FormControl(new Date(year, months));
            this.newReportsForm = this.formBuilder.group({
              reportType: new FormControl(this.reportList?.map(ele => ele.reportType))
            });
            this.recentlySelectedTypes = this.reportList?.map(ele => ele.reportType);
            this.allSelected = true;
            this.searchReportApiCall.emit({reportDate : new Date(year, months), fromQuickReports : true});
          } else {
            this.searchReportApiCall.emit({reportDate : new Date(), fromQuickReports : false});
          }
        } else {
          this.searchReportApiCall.emit({reportDate : new Date(), fromQuickReports : false});
        }
      });

    this.store
      .pipe(select(selectors.getCurrentBranchState))
      .pipe(
        filter((currentBranch) => !!currentBranch),
        takeUntil(this.destroy$)
      )
      .subscribe((currentBranch) => {
        this.currentBranch = cloneDeep(currentBranch);
      });
    this.createButtonStatus$ = this.dynamicReportsService.getCreateButtonStatus()
      .subscribe(res => {
        this.showCreateButton = res;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.labConfigData = changes?.labConfigData?.currentValue;
    if (this.labConfigData) {
      this.labConfigData.locations?.forEach((location) => {
        this.instrumentGroupByDept = location.instrumentGroupByDept;
      });
      this.isSearchEnabled = this.labConfigData.isFiltered;
    }

    if (changes?.sendTemplateDetails?.currentValue) {
        this.setTemplateValue(changes?.sendTemplateDetails?.currentValue);
    }
  }

  callNgOnChanges() {
    this.labConfigDataChange.emit({ ...this.labConfigData });
  }

  getDateFormatString() {
    this.store.pipe(select(navigationStateSelector.getLocale)).pipe(takeUntil(this.destroy$))
    .subscribe(
      (lang: any) => {
        this.adapter.setLocale(lang?.locale || lang?.lcid || this.selectedLang.lcid);
      }
    );
  }

  getLabLocationData() {
    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        this.labLocation = labLocation;
      });
  }

  getCurrentUser() {
    this.store.pipe(select(fromSecuritySelector.getCurrentUser))
      .pipe(filter(currentUser => !!currentUser), takeUntil(this.destroy$)).subscribe(currentUser => {
        this.currentUser = currentUser;
      });
  }

  reportsOnSelection() {
    const reportValue = this.reportList?.map(ele => ele.reportType);
    reportValue.shift();
    if (reportValue.every(ele => this.recentlySelectedTypes.includes(ele))) {
      this.allSelected = true;
      this.recentlySelectedTypes = this.reportList?.map(ele => ele.reportType);
    } else {
      this.allSelected = false;
      if (this.recentlySelectedTypes.includes(this.reportList[0].reportType)) {
        this.recentlySelectedTypes.shift();
        this.recentlySelectedTypes = [...this.recentlySelectedTypes];
      }
    }
  }

  toggleAllSelection() {
    this.allSelected = !this.allSelected;  // to control select-unselect
    this.recentlySelectedTypes = this.allSelected ? this.reportList?.map(ele => ele.reportType) : [];
  }

  chosenMonthHandler(normalizedSelection: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
    this.date = new FormControl(moment());
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedSelection.year());
    ctrlValue.month(normalizedSelection.month());
    this.date.setValue(ctrlValue);
    this.createReportSelectedYear = normalizedSelection.year();
    this.createReportSelectedMonth = normalizedSelection.month() + 1;
    this.data.yearMonth = `${this.createReportSelectedYear}${this.getMonth(this.createReportSelectedMonth)}`;
    datepicker.close();
    // Uncomment when report template is added back
    // this.reportTemplate.clearTemplateFromParent(true);
    this.searchReportApiCall.emit({reportDate : new Date(normalizedSelection.year(), normalizedSelection.month()),
       fromQuickReports : false});
  }

  reset() {
    this.newReportsForm.reset();
    this.recentlySelectedTypes = [];
    this.date = new FormControl(moment());
    this.createReportSelectedYear = moment().year();
    this.createReportSelectedMonth = moment().month() + 1;
    this.data.yearMonth = `${this.createReportSelectedYear}${this.getMonth(this.createReportSelectedMonth)}`;
    this.dynamicReportingService.resetFields(true);
    this.searchReportApiCall.emit({reportDate : new Date(), fromQuickReports : false});
  }


  disableCreateBtn() {
    return (this.recentlySelectedTypes && this.recentlySelectedTypes.length > 0) ? false : true;
  }

  async onCancel() {
    const result = await this.confirmNavigate.confirmationModal();
    if (!result) {
      return;
    }
    if (this.selectedNode && this.selectedNode.nodeType === EntityType.LabLocation) {
      this.store.dispatch(NavBarActions.setNodeItems({
        nodeType: this.selectedNode.nodeType,
        id: this.selectedNode.id,
      }));
      this.navigationService.gotoDashboard();
    } else if (this.selectedNode && this.selectedNode.nodeType === EntityType.LabDepartment) {
      this.store.dispatch(NavBarActions.setNodeItems({
        nodeType: this.selectedNode.nodeType,
        id: this.selectedNode.id,
      }));
      this.router.navigateByUrl(`/${unRouting.labSetup.lab}/${unRouting.labSetup.instruments}/${(this.selectedLeaf
        || this.selectedNode).id}/${unRouting.labSetup.settings}`);
    } else if (this.selectedNode && this.selectedNode.nodeType === EntityType.LabInstrument) {
      this.store.dispatch(NavBarActions.setNodeItems({
        nodeType: this.selectedNode.nodeType,
        id: this.selectedNode.id,
      }));
      this.router.navigateByUrl(`/data/${this.selectedNode.id}/${this.selectedNode.nodeType}/table`);
    } else if (this.selectedNode && this.selectedNode.nodeType === EntityType.LabProduct && !this.selectedLeaf) {
      this.store.dispatch(NavBarActions.setNodeItems({
        nodeType: this.selectedNode.nodeType,
        id: this.selectedNode.id,
      }));
      this.router.navigateByUrl(`/data/${this.selectedNode.id}/${this.selectedNode.nodeType}/table`);
    } else if (this.selectedLeaf && this.selectedLeaf.nodeType === EntityType.LabTest) {
      this.store.dispatch(NavBarActions.setSelectedLeaf({
        selectedLeaf: this.selectedLeaf
      }));
      this.router.navigateByUrl(`/data/${this.selectedLeaf.id}/${this.selectedLeaf.nodeType}/table`);
    } else if (this.selectedNode === null) {
      // selectedNode is null when the user refreshes the browser page.
      this.navigationService.gotoDashboard();
    }
  }

  onCreateReport() {
    this.generateReportTemplate();
  }

  setTemplateValue(selectTemplate: ITemplate) {
    this.selectTemplateData = selectTemplate;
  }

  generateReportData(reportData: GenerateReport) {
    return this.dynamicReportingService.createReport(reportData).pipe(
      takeUntil(this.destroy$),
      tap(
        (templateValue) => {
        },
        (error) => {
          const titleMessage = this.getTranslation('LABCONFIGSELECTION.REPORTFAILED');
          const messageContent = [this.getTranslation('LABCONFIGSELECTION.REPORTFAILEDMESSAGE')];
          const buttonName = this.getTranslation('LABCONFIGSELECTION.CLOSE');
          this.openGenericDialog(TypeOfDialog.doubleBlock,
            IconType.CardWarning, titleMessage, IconType.RedWarning, messageContent, buttonName, StyleOfBtn.SolidButton, true);
          this.clearSelection(true);
        }
      )
    );
  }

  async generateReportTemplate() {
    const dateString = this.date.value;
    const dateConvert = new Date(dateString);
    const year = dateConvert.getFullYear();
    const month = dateConvert.getMonth() + 1;
    const formattedDate = `${year}${String(month).padStart(2, '0')}`;
    this.reportDate = formattedDate;
    const reportType = this.reportTypeCalculate();
    const currentUserAccountNumber = this.currentUser?.accountNumber;
    const labLocationAccountNumber = this.labLocation?.accountNumber;
    const labTimeZone = this.labLocation.locationTimeZone;

    if (!this.selectTemplateData ||
     !this.dynamicReportsService.getTemplateUpdated()) {
      const { departmentList, instrumentList, controlList, analyteList, isSelectionValid, canProceed, directionIndex }
        = this.commonService.filterLabConfigData(this.labConfigData);
      if (!isSelectionValid) {
        const isContinue = await this.commonService.openSelectionsDialog(this.dialogRef, ReportsGenericDialogComponent,
          TypeOfDialog.SimpleBlock, [
          canProceed ? this.getTranslation('LABCONFIGSELECTION.SELECTIONCONFIRMATIONONE') :
            this.getTranslation('LABCONFIGSELECTION.SELECTIONCONFIRMATIONONECANNOTPROCEED'),
          canProceed ? this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO') :
            this.getTranslation('LABCONFIGSELECTION.SELECTIONCONFIRMATIONTWOCANNOTPROCEED')
        ],
          [
            {
              btnName: this.getTranslation('LABCONFIGSELECTION.CONTINUEBUTTONTEXT'), btnStyle: StyleOfBtn.SolidButton,
              btnDisable: !canProceed
            },
            {
              btnName: this.getTranslation('LABCONFIGSELECTION.CANCEL'),
              btnStyle: StyleOfBtn.OutlineButton
            },
          ], true);
        if (!isContinue) {
          return;
        }
      }

      // firstApiPayload is payload for first Api that is save_filter_template Api
      const firstApiPayload: ITemplate = {
        labLocationId: this.labLocation.id,
        templateName: '',
        templateBody: {
          filterCondition: {
            lotFilter: controlList,
            instrumentFilter: instrumentList,
            departmentFilter: departmentList,
            analyteFilter: analyteList,
            reportType: this.reportTypeCalculate(),
            filterBaseColumn: directionIndex
          }
        }
      };

      const titleMessage = this.getTranslation('REPORTNOTIFICATIONS.GENERATINGREPORT');
      const messageContent = [this.getTranslation('LABCONFIGSELECTION.GENERATINGREPORTMESSAGE')];
      const buttonName = this.getTranslation('LABCONFIGSELECTION.CLOSE');
      this.openGenericDialog(TypeOfDialog.SingleBlock, IconType.GeneratingCircle,
        titleMessage, null, messageContent, buttonName, StyleOfBtn.SolidButton, false);
      this.clearSelection(true);

      this.dynamicReportingService.saveTemplate(firstApiPayload, false).pipe(switchMap((firstAPIResponse: ITemplate) => {
        const reportData: GenerateReport = {
          labLocationId: firstAPIResponse.labLocationId,
          templateId: firstAPIResponse.id,
          reportType: reportType,
          yearMonth: this.reportDate,
          accountNumber: currentUserAccountNumber || labLocationAccountNumber,
          labTimeZone: labTimeZone
        };
        return this.generateReportData(reportData);
      })
      ).subscribe();
    } else {

      const titleMessage = this.getTranslation('REPORTNOTIFICATIONS.GENERATINGREPORT');
      const messageContent = [this.getTranslation('LABCONFIGSELECTION.GENERATINGREPORTMESSAGE')];
      const buttonName = this.getTranslation('LABCONFIGSELECTION.CLOSE');
      this.openGenericDialog(TypeOfDialog.SingleBlock, IconType.GeneratingCircle,
        titleMessage, null, messageContent, buttonName, StyleOfBtn.SolidButton, false);
      this.clearSelection(true);

      const reportData: GenerateReport = {
        labLocationId: this.selectTemplateData.labLocationId,
        templateId: this.selectTemplateData.id,
        reportType: reportType,
        yearMonth: this.reportDate,
        accountNumber: currentUserAccountNumber || labLocationAccountNumber,
        labTimeZone: labTimeZone
      };
      this.generateReportData(reportData).subscribe();
    }
  }

  openGenericDialog(dialogType: TypeOfDialog, titleIcon: IconType, titleMessage: string, messageIcon: IconType,
    messageContent: string[], buttonName: string, buttonStyle: StyleOfBtn, dialogFullwidth: boolean) {
    const dialogMessageContent: ReportDialogType = {
      dialogType: dialogType,
      titleIcon: titleIcon,
      titleMessage: titleMessage,
      messageIcon: messageIcon,
      messageContent: messageContent,
      fullwidth: dialogFullwidth,
      buttonsList: [{
        btnName: buttonName,
        btnStyle: buttonStyle
      }]
    };
    this.dialogRef = this.dialog.open(ReportsGenericDialogComponent, {
      panelClass: ['report-generic-container'],
      data: dialogMessageContent,
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.reset(); // To reset the form
      // Uncomment when report template is added back
      // this.reportTemplate.clearTemplateFromParent();
    });
  }

  // Here we are calculating the report type
  reportTypeCalculate(): string {
    let reportType: string;
    if (this.allSelected) {
      reportType = this.recentlySelectedTypes[0];
    } else {
      reportType = this.recentlySelectedTypes.join(underscore);
    }
    return reportType;
  }

  getMonth(month: number): string {
    let formattedMonth: string;
    if (Number(month) < 10) {
      formattedMonth = '0' + month;
    } else {
      formattedMonth = String(month);
    }
    return formattedMonth;
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  getReportTypes(index: string): string {
   return this.getTranslation(PastReportsFilterReportList[index].name);
  }

  clearSelection(event: boolean) {
    this.isClearSelection.emit(event);
  }

  setReportType(event: string) {
    if (event === this.actionType.delete) {
      this.recentlySelectedTypes = [];
      return;
    }
    this.newReportsForm.controls['reportType'].setValue([event]);
    if (event === this.reportList[0].reportType) {
      this.allSelected = true;
      this.recentlySelectedTypes = this.reportList?.map(ele => ele.reportType);
    } else {
      const selectedReportTypes: string[] = event?.split('_');
      if (selectedReportTypes) {
        this.recentlySelectedTypes = [...selectedReportTypes];
      }
    }
  }

  setReportDate(event: string) {
    if (event) {
      const year = +(event.slice(0, 4));
      const month = +(event.slice(4));
      const months = month - 1;
      this.date = new FormControl(new Date(year, months));
    }
  }

  ngOnDestroy() {
    // reset the reportcreate key
    if (this.selectedNode && this.selectedNode.hasOwnProperty('reportCreate')) {
      this.selectedNode.reportCreate = '';
    }
    this.store.dispatch(NavBarActions.setDefaultNode({ selectedNode: this.selectedNode }));
    this.store.dispatch(NavBarActions.setItemToCurrentBranch({ currentBranchItem: this.selectedNode }));
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.createButtonStatus$.unsubscribe();
  }
}
