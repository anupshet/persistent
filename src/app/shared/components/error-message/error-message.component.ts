// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BrDialogComponent } from 'br-component-library';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';
import { ErrorsInterceptor } from '../../../contracts/enums/http-errors.enum';

@Component({
  selector: 'unext-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent extends BrDialogComponent {
  errorStrings = ErrorsInterceptor;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];
  errorCode: string = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public errorCodesData: string,
    public dialogRef: MatDialogRef<ErrorMessageComponent>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {

    super(errorCodesData);
    if (errorCodesData) {
      this.errorCode = errorCodesData;
    } else {
      this.errorCode = null;
    }
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ErrorMessageComponent + blankSpace + Operations.AddIcons)));
    }
  }

  onSubmit() {
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
