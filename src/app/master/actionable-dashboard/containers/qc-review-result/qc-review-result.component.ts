// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { NavigationService } from '../../../../shared/navigation/navigation.service';
@Component({
  selector: 'unext-qc-review-result',
  templateUrl: './qc-review-result.component.html',
  styleUrls: ['./qc-review-result.component.scss']
})
export class QcReviewResultComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  constructor(
    public navigationService: NavigationService
  ) { }

  ngOnInit(): void {
  }

  openDataReviewComponent() {
    this.navigationService.navigateToDataReview();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
