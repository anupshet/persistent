// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { filter, take, takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { MatSelect } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';

import * as fromSharedSelector from '../../../../../shared/state/selectors';
import * as sharedStateSelector from '../../../../../shared/state/selectors';
import * as fromSecurity from '../../../../../security/state/selectors';

import * as fromRoot from '../../../../../state/app.state';
import { icons } from '../../../../../core/config/constants/icon.const';
import { IconService } from '../../../../../shared/icons/icons.service';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import { Operations, componentInfo } from '../../../../../core/config/constants/error-logging.const';
import { blankSpace } from '../../../../../core/config/constants/general.const';
import { ErrorType } from '../../../../../contracts/enums/error-type.enum';
import { ReportsGenericDialogComponent } from '../reports-generic-dialog/reports-generic-dialog.component';
import { IconType, ReportDialogType, StyleOfBtn, TypeOfDialog, TypeOfMessage } from '../../../models/report-dialog';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { CorrectiveActionInfo, PdfResponse, SavePdfResponse } from '../../../models/report-info';
import { LabLocation } from '../../../../../contracts/models/lab-setup';
import { ConfigService } from '../../../../../core/config/config.service';
import { Account } from '../../../../../contracts/models/account-management/account';
import { AppUser } from '../../../../../security/model';
import { ITemplate } from '../../../reporting.enum';
import { ActionType } from '../../../../../contracts/enums/action-type.enum';
import { Permissions } from '../../../../../security/model/permissions.model';
import { NavigationService } from '../../../../../shared/navigation/navigation.service';

@Component({
  selector: 'unext-report-preview-footer',
  templateUrl: './report-preview-footer.component.html',
  styleUrls: ['./report-preview-footer.component.scss']
})
export class ReportPreviewFooterComponent implements OnInit, OnDestroy {
  @Input() pdfData: PdfResponse;
  @Input() correctiveActionsFormStatus: boolean;
  @Input() correctiveActionsPayload: CorrectiveActionInfo;
  @Output() isRedirectToPreview: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() sendTemplateInfo: EventEmitter<ITemplate> = new EventEmitter<ITemplate>();
  @ViewChild('selector') selectDropdown: MatSelect;

  private dialogRef: MatDialogRef<ReportsGenericDialogComponent>;
  private destroy$ = new Subject<boolean>();
  labLocation: LabLocation;
  accountInfo: Account;
  currentUser: AppUser;
  appLocale: string;
  actionType = ActionType;
  hasReportsCorrectiveActionsEntryPermission: boolean;
  hasReportsSaveAndDownloadPermission: boolean;
  hasReportsCreateOrUpdateTemplate: boolean;
  isMonthlyEvalReportType = false;
  templateList: string[] = [];
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.addCircleOutline[24],
  ];

  footerForm: FormGroup;

  constructor(private iconService: IconService,
    private config: ConfigService,
    private navigationService: NavigationService,
    private dynamicReportsService: DynamicReportingService,
    private errorLoggerService: ErrorLoggerService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private brPermissionsService: BrPermissionsService,
    private store: Store<fromRoot.State>,
    private formBuilder: FormBuilder) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {

    this.hasReportsCorrectiveActionsEntryPermission = this.hasPermissionToAccess([Permissions.ReportsCorrectiveActionsEntry]);
    this.hasReportsSaveAndDownloadPermission = this.hasPermissionToAccess([Permissions.ReportsSaveAndDownload]);
    this.hasReportsCreateOrUpdateTemplate = this.hasPermissionToAccess([Permissions.CreateOrUpdateTemplate])
      || this.hasPermissionToAccess([Permissions.ViewTemplate]);
    this.appLocale = this.config.getConfig('appLocale');

    // get account information
    this.store.pipe(select(sharedStateSelector.getCurrentAccount))
      .pipe(filter(account => !!account), takeUntil(this.destroy$))
      .subscribe(accounts => {
        this.accountInfo = accounts;
      });


    // get current user information
    this.store.pipe(select(fromSecurity.getCurrentUser))
      .pipe(filter(currentUser => !!currentUser), takeUntil(this.destroy$))
      .subscribe(currentUser => {
        this.currentUser = currentUser;
      });

    // get current location information
    this.store.pipe(select(fromSharedSelector.getCurrentLabLocation)).pipe(takeUntil(this.destroy$))
      .subscribe((labLocation) => {
        if (labLocation) {
          this.labLocation = labLocation;
        }
      });

    this.setInitialFormValues();
    if (this.pdfData && this.pdfData.dynReportType.includes('0')) {
      const signedBy = new FormControl('signedBy');
      this.footerForm.addControl('signedBy', signedBy);
      signedBy.setValue(true);
      signedBy.setValidators(Validators.required);
      signedBy.updateValueAndValidity();
      this.isMonthlyEvalReportType = true;
    } else {
      this.isMonthlyEvalReportType = false;
    }
  }
  setInitialFormValues() {
    if (this.pdfData && this.pdfData.templateName && this.pdfData.templateName !== '') {
      this.templateList.push(this.pdfData.templateName);
    } else {
      this.templateList.push('None');
    }
    this.footerForm = this.formBuilder.group({
      templateInfo: [this.templateList[0]],
    });
  }

  saveNewTemplate() {
    this.selectDropdown.close();
    const titleMessage = this.getTranslation('LABCONFIGSELECTION.TEMPLATESAVETITLEFOOTER');
    this.openGenericDialog(TypeOfDialog.FormBlock, IconType.ContentCopy, titleMessage, [],
      this.getTranslation('LABCONFIGSELECTION.TEMPLATESAVE'),
      this.getTranslation('LABCONFIGSELECTION.CANCEL'),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, this.actionType.insert);
  }

  editTemplate() {
    let simpleMessageList: string[];
    if (this.pdfData && this.pdfData.dynReportType.includes('0')) {
      simpleMessageList = [this.getTranslation('LABCONFIGSELECTION.EDITREPORT'),
      this.getTranslation('LABCONFIGSELECTION.TEMPLATECORRECTIVEACTIONSMESSAGE'),
      this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO')];
    } else {
      simpleMessageList = [this.getTranslation('LABCONFIGSELECTION.EDITREPORT'),
      this.getTranslation('LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO')];
    }

    this.openGenericDialog(TypeOfDialog.SimpleBlock, null, null, simpleMessageList,
      this.getTranslation('LABCONFIGSELECTION.CONTINUEBUTTONTEXT'),
      this.getTranslation('LABCONFIGSELECTION.CANCEL'),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, true, this.actionType.edit);
  }



  getSaveDisabledStatus(): boolean {
    if (this.isMonthlyEvalReportType) {
      return !(this.footerForm.controls['signedBy']?.value && !this.correctiveActionsFormStatus);
    }
    return false;
  }

  savePdfInfo() {
    if (this.pdfData) {

      let filename: string[] = this.pdfData.pdfUrl.split('/');
      filename = filename[filename.length - 1].split('?');

      const savePDf: SavePdfResponse = {
        labLocationId: this.labLocation.id,
        reportType: this.pdfData.dynReportType,
        tempReportFileName: filename[0],
        metaId: this.pdfData.metaId,
        templateId: this.pdfData.templateId,
        yearMonth: this.pdfData.yearMonth,
        languageCode: this.appLocale,
        labTimeZone: this.labLocation.locationTimeZone,
        streetAddress: this.labLocation.labLocationAddress ?
          this.labLocation.labLocationAddress.streetAddress1 : this.accountInfo.accountAddress.streetAddress1,
        streetAddress2: this.labLocation.labLocationAddress ?
          this.labLocation.labLocationAddress.streetAddress2 : this.accountInfo.accountAddress.streetAddress2,
        city: this.labLocation.labLocationAddress ?
          this.labLocation.labLocationAddress.city : this.accountInfo.accountAddress.city,
        subDivision: this.labLocation.labLocationAddress ?
          this.labLocation.labLocationAddress.state : this.accountInfo.accountAddress.state,
        country: this.labLocation.labLocationAddress ?
          this.labLocation.labLocationAddress.country : this.accountInfo.accountAddress.country,
        labName: this.labLocation.displayName,
        accountNumber: this.labLocation.accountNumber ?
          this.labLocation.accountNumber : this.accountInfo.accountNumber,
      };

      if (this.isMonthlyEvalReportType) {
        savePDf.reportSignee = {
          signedBy: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
          signedOn: new Date(),
        };
        savePDf.correctiveActions = this.correctiveActionsPayload;
      }

      const titleMessage = this.getTranslation('REPORTNOTIFICATIONS.SAVINGREPORT');
      const messageContent = [this.getTranslation('LABCONFIGSELECTION.GENERATINGREPORTMESSAGE')];
      const buttonName = this.getTranslation('LABCONFIGSELECTION.CLOSE');
      this.openGenericDialog(TypeOfDialog.SingleBlock, IconType.GeneratingCircle, titleMessage, messageContent,
        buttonName, null, StyleOfBtn.SolidButton, null, false, this.actionType.save);

      this.dynamicReportsService.saveReportInfo(savePDf).subscribe(
        (templateValue) => { },
        (error) => {
          const titleErrorMessage = this.getTranslation('LABCONFIGSELECTION.REPORTSAVEDFAILED');
          const messageErrorContent = [this.getTranslation('LABCONFIGSELECTION.REPORTSAVEDFAILEDMESSAGE')];
          const buttonErrorName = this.getTranslation('LABCONFIGSELECTION.CLOSE');
          this.openGenericDialog(TypeOfDialog.doubleBlock, IconType.CardWarning, titleErrorMessage, messageErrorContent,
            buttonErrorName, null, StyleOfBtn.SolidButton, null, true, '', IconType.RedWarning);
        }
      );

    }
  }


  openGenericDialog(dialogType: TypeOfDialog, titleIcon: IconType, titleMessage: string,
    messageContent: string[], button1: string, button2: string, btn1Style, btn2Style, dialogFullWidth: boolean,
    actionType: string, messageIcon?: IconType, messageType?: TypeOfMessage) {
    const templateInfo: ITemplate = {
      labLocationId: this.labLocation.id,
      templateName: '',
      templateBody: this.pdfData.templateBody,
    };
    templateInfo.templateBody.filterCondition.reportType = this.pdfData.dynReportType;
    const dialogMessageContent: ReportDialogType = {
      dialogType: dialogType,
      titleIcon: titleIcon,
      titleMessage: titleMessage,
      messageIcon: messageIcon,
      messageContent: messageContent,
      messageType: messageType,
      simpleMessageList: dialogType === TypeOfDialog.SimpleBlock ? messageContent : null,
      fullwidth: dialogFullWidth,
      buttonsList: [{
        btnName: button1,
        btnStyle: btn1Style
      },
      {
        btnName: button2,
        btnStyle: btn2Style
      }],
      templateData: templateInfo,
      isRename: false,
    };
    this.dialogRef = this.dialog.open(ReportsGenericDialogComponent, {
      panelClass: ['report-generic-container'],
      data: dialogMessageContent,
      autoFocus: false
    });
    this.dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$))
      .subscribe(value => {
        if (!value.buttonIndex) {
          if (actionType === this.actionType.edit) {
            this.navigationService.setSelectedReportNotificationId('');
            this.isRedirectToPreview.emit(false);
            const templateDetails: ITemplate = {
              labLocationId: this.labLocation.id,
              templateName: this.pdfData.templateName,
              templateBody: this.pdfData.templateBody,
              id: this.pdfData.templateId,
              yearMonth: this.pdfData.yearMonth,
              isEditReport: true
            };
            this.sendTemplateInfo.emit(templateDetails);
          }

          if (actionType === this.actionType.save) {
            this.isRedirectToPreview.emit(false);
          }

          if (actionType === this.actionType.insert) {
            titleMessage = this.getTranslation('LABCONFIGSELECTION.TEMPLATESAVETITLEFOOTER');
            messageContent = [this.getTranslation('LABCONFIGSELECTION.PREVIEWINSERTTEMPLATESUCCESSDIALOG')];
            const buttonName = this.getTranslation('LABCONFIGSELECTION.CLOSE');
            this.openGenericDialog(TypeOfDialog.SingleBlock, IconType.ContentCopy, titleMessage, messageContent,
              buttonName, null, StyleOfBtn.SolidButton, null, false, null);
              this.pdfData.templateId = value.templateInfo?.id;
              this.pdfData.templateName = value.templateInfo?.templateName;
              this.pdfData.templateBody = value.templateInfo?.templateBody;
              this.pdfData.dynReportType = value.templateInfo?.templateBody?.filterCondition?.reportType;
              this.templateList = [];
              this.templateList.push(this.pdfData.templateName);
              this.footerForm.controls['templateInfo'].setValue(this.templateList[0]);
          }

        } else if (value.buttonIndex === -1 && actionType === this.actionType.save) {
          this.isRedirectToPreview.emit(false);
        }
      }, (err) => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.ReportPreviewFooterComponent + blankSpace + Operations.CloseDialog)));
      });
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
