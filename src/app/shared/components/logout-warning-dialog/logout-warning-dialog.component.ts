// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BrDialogComponent } from 'br-component-library';

import { oneMinuteCountdown } from '../../../core/config/constants/general.const';

@Component({
  selector: 'unext-logout-warning-dialog',
  templateUrl: './logout-warning-dialog.component.html',
  styleUrls: ['./logout-warning-dialog.component.scss']
})
export class LogoutWarningDialogComponent extends BrDialogComponent {
  timeLeft = 5;
  oneMinuteleft;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LogoutWarningDialogComponent>,
  ) {
    super(data);
    setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.oneMinuteleft = this.timeLeft === 1 ? true : false;
      } else {
        this.timeLeft = 5;
      }
    }, oneMinuteCountdown);
  }

  onContinue() {
    this.dialogRef.close(false);
  }

  onSignout() {
    this.dialogRef.close(true);
  }
}
