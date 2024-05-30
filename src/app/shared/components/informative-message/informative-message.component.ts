// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject } from '@angular/core';
import { BrDialogComponent } from 'br-component-library';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-informative-message',
  templateUrl: './informative-message.component.html',
  styleUrls: ['./informative-message.component.scss']
})
export class InformativeMessageComponent extends BrDialogComponent {
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InformativeMessageComponent>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {
    super(data);
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.InformativeMessageComponent + blankSpace + Operations.AddIcons)));
    }
  }

  onSubmit() {
    this.dialogRef.close(true);
  }
  closeDialog() {
    this.dialogRef.close(false);
  }
}
