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

@Component({
  selector: 'unext-report-timeout-message',
  templateUrl: './report-timeout-message.component.html',
  styleUrls: ['./report-timeout-message.component.scss']
})
export class ReportTimeoutMessageComponent extends BrDialogComponent {
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.notificationsNone[24],
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReportTimeoutMessageComponent>,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {
    super(data);
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.ReportTimeoutMessageComponent + blankSpace + Operations.AddIcons)));
    }
   }

   onSubmit() {
    this.dialogRef.close(true);
  }

}
