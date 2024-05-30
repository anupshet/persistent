// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnInit , Inject} from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { IconService } from '../../icons/icons.service';

@Component({
  selector: 'unext-data-review-warning-dialog',
  templateUrl: './data-review-warning-dialog.component.html',
  styleUrls: ['./data-review-warning-dialog.component.scss']
})
export class DataReviewWarningDialogComponent implements OnInit {
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DataReviewWarningDialogComponent>,
    private iconService: IconService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }
  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
