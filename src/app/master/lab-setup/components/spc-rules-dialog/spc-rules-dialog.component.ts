import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DialogData } from '../spc-rules/spc-rules.component';
import { IconService } from '../../../../shared/icons/icons.service';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-spc-rules-dialog',
  templateUrl: './spc-rules-dialog.component.html',
  styleUrls: ['./spc-rules-dialog.component.scss']
})
export class SpcRulesDialogComponent implements OnInit {

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24],
  ];

  constructor(
    private dialogRef: MatDialogRef<SpcRulesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private iconService: IconService,
    private errorLoggerService: ErrorLoggerService
  ) {
    try {
      this.iconService.addIcons(this.iconsUsed);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SpcRulesDialogComponent + blankSpace + Operations.AddIcons)));
    }
  }


  ngOnInit() {
  }

  close() {
    try {
      this.dialogRef.close();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.SpcRulesDialogComponent + blankSpace + Operations.CloseDialog)));
    }
  }

}
