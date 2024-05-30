// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import { BrDialogComponent } from 'br-component-library';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-confirm-nbr-dialog-delete',
  templateUrl: './confirm-dialog-nbr-delete.component.html',
  styleUrls: ['./confirm-dialog-nbr-delete.component.scss']
})
export class ConfirmNbrControlDeleteComponent extends BrDialogComponent {

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48],
    icons.delete[48],
    icons.redWarning[24]
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmNbrControlDeleteComponent>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {
    super(data);
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ConfirmNbrControlDeleteComponent + blankSpace + Operations.AddIcons)));
    }
  }

  onSubmit() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
