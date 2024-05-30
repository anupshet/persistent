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
  selector: 'unext-multiple-button-dialog',
  templateUrl: './multiple-button-dialog.component.html',
  styleUrls: ['./multiple-button-dialog.component.scss']
})
export class MultipleButtonDialogComponent extends BrDialogComponent {


  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];

  isCloseIconDisabled = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MultipleButtonDialogComponent>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {
    super(data);
    try {
      this.isCloseIconDisabled = data?.isCloseIconDisabled;
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ConfirmDialogDeleteComponent + blankSpace + Operations.AddIcons)));
    }
   }

  onSubmit( returnValue ) {
    this.dialogRef.close(returnValue);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
