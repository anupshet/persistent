import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-update-settings-dialog',
  templateUrl: './update-settings-dialog.component.html',
  styleUrls: ['./update-settings-dialog.component.scss']
})
export class UpdateSettingsDialogComponent implements OnInit {
  public message: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateSettingsDialogComponent>,
    private errorLoggerService: ErrorLoggerService
  ) { }

  ngOnInit(): void {
    try {
      this.message = this.data.message;
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.UpdateSettingsDialogComponent + blankSpace + Operations.OnInit)));
    }
  }
  onConfirmClick(): void {
    try {
      this.dialogRef.close(true);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.UpdateSettingsDialogComponent + blankSpace + Operations.CloseDialog)));
    }
  }
}
