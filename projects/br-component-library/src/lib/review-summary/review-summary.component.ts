// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReviewSummary } from '../contracts/models/data-management/review-summary.model';

@Component({
  selector: 'br-review-summary',
  templateUrl: './review-summary.component.html',
  styleUrls: ['./review-summary.component.scss']
})
export class BrReviewSummaryComponent implements OnInit {
  reviewData: ReviewSummary;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BrReviewSummaryComponent>
  ) { }

  ngOnInit() {
    this.reviewData = this.data.reviewData;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
