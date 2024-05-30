// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { Icon } from '../../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../../core/config/constants/icon.const';
import { IconService } from '../../../../../shared/icons/icons.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IconType, ReportDialogType, SavedValue, StyleOfBtn, TypeOfDialog, TypeOfMessage } from '../../../models/report-dialog';
import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { ITemplate } from '../../../reporting.enum';
import { ErrorsInterceptor } from '../../../../../contracts/enums/http-errors.enum';


@Component({
  selector: 'unext-reports-generic-dialog',
  templateUrl: './reports-generic-dialog.component.html',
  styleUrls: ['./reports-generic-dialog.component.scss']
})

export class ReportsGenericDialogComponent implements OnInit {
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.greyClose[24],
    icons.contentCopy[24],
    icons.contentDelete[24],
    icons.contentDownload[24],
    icons.redWarning[24],
    icons.contentEdit[24],
    icons.cardWarning[24],
    icons.contentUpdate[24],
    icons.contentVisibility[24],
    icons.yellowWarning[24],
    icons.notInterested[24],
    icons.refresh[24]
  ];

  ReportDialogType = TypeOfDialog;
  ReportMessageType = TypeOfMessage;
  ButtonStyleType = StyleOfBtn;
  IconType = IconType;
  genericForm: FormGroup;


  constructor(private iconService: IconService,
    private formbuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogContent: ReportDialogType,
    private dynamicReportsService: DynamicReportingService,
    public dialogRef: MatDialogRef<ReportsGenericDialogComponent>) {
    this.iconService.replayIcons(this.iconsUsed);
    this.dialogRef.disableClose = true;
    this.iconService.addIcons(this.iconsUsed);

    if (this.dialogContent && this.dialogContent.dialogType === TypeOfDialog.FormBlock) {
      this.genericForm = this.formbuilder.group({
        templateName: [this.dialogContent.isRename ? this.dialogContent.templateData.templateName : null,
        [Validators.required, Validators.maxLength(35), Validators.pattern('^[a-zA-Z0-9-_ ]+$')]]
      });
    }
  }


  ngOnInit(): void {

  }

  checkForhasError = (controlName: string, errorName: string) => {
    return this.genericForm.controls[controlName].hasError(errorName) && this.genericForm.controls[controlName].dirty;
  }

  closeDialog(buttonIndex: number) {
    if (buttonIndex === 0 && this.genericForm && this.dialogContent.dialogType === TypeOfDialog.FormBlock) {
      if (!this.dialogContent.isRename && this.dialogContent?.templateData) {
        this.dialogContent.templateData.templateName = this.genericForm.controls['templateName'].value;
        this.saveTemplate(this.dialogContent.templateData, buttonIndex);
      } else if (this.dialogContent.isRename) {
        this.dialogContent.templateData.isRename = true;
        this.dialogContent.templateData.templateName = this.genericForm.controls['templateName'].value;
        this.renameTemplate(this.dialogContent.templateData, buttonIndex);
      }
    } else {
      const savedValue: SavedValue = {
        buttonIndex: buttonIndex,
        templateInfo: this.dialogContent.templateData
      };
      this.dialogRef.close(savedValue);
    }
  }

  getMessageBg(): string {
    if (this.dialogContent) {
      return this.dialogContent.messageType === this.ReportMessageType.Warning ? 'warning-bg' : 'error-bg';
    }
  }

  getMessageColor(): string {
    if (this.dialogContent) {
      return this.dialogContent.messageType === this.ReportMessageType.Warning ? 'warning-title-color' : 'error-title-color';
    }
  }

  saveTemplate(saveData: ITemplate, buttonIndex: number) {
    this.dynamicReportsService.saveTemplate(saveData, true)
      .pipe(take(1))
      .subscribe(
        templateInfo => {
          if (templateInfo) {
            this.genericForm.reset();
            const savedValue: SavedValue = {
              buttonIndex: buttonIndex,
              templateInfo: templateInfo
            };
            this.dialogRef.close(savedValue);
          }
        },
        error => {
          if (error.error?.errorCode === ErrorsInterceptor.dynamicreports045) {
            this.genericForm.controls['templateName'].markAsDirty();
            this.genericForm.controls['templateName'].setErrors({ invalid: true, duplicateName: true });
          }
        }
      );
  }

  renameTemplate(saveData: ITemplate, buttonIndex: number) {
    this.dynamicReportsService.updateTemplate(saveData)
      .pipe(take(1))
      .subscribe(
        templateInfo => {
          if (templateInfo) {
            this.genericForm.reset();
            const savedValue: SavedValue = {
              buttonIndex: buttonIndex,
              templateInfo: templateInfo
            };
            this.dialogRef.close(savedValue);
          }
        },
        error => {
          if (error.error?.errorCode === ErrorsInterceptor.dynamicreports045) {
            this.genericForm.controls['templateName'].markAsDirty();
            this.genericForm.controls['templateName'].setErrors({ invalid: true, duplicateName: true });
          }
        }
      );
  }

}
