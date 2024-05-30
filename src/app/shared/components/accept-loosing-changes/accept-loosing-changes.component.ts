// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';
import { ErrorLoggerService } from '../../services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-accept-loosing-changes',
  templateUrl: './accept-loosing-changes.component.html',
  styleUrls: ['./accept-loosing-changes.component.scss']
})
export class AcceptLoosingChangesComponent {

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AcceptLoosingChangesComponent>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.AcceptLoosingChangesComponent + blankSpace + Operations.AddIcons)));
    }
  }

  onAccept() {
    this.dialogRef.close(true);
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
