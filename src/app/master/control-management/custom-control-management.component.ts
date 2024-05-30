// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ErrorType } from '../../contracts/enums/error-type.enum';
import * as fromRoot from '../../state/app.state';
import * as fromNavigationSelector from '../../shared/navigation/state/selectors';
import { componentInfo, blankSpace, Operations } from '../../core/config/constants/error-logging.const';
import { ErrorLoggerService } from '../../shared/services/errorLogger/error-logger.service';
@Component({
  selector: 'unext-custom-control-management',
  templateUrl: './custom-control-management.component.html',
  styleUrls: ['./custom-control-management.component.scss']
})

export class CustomControlManagementComponent implements OnInit {

  private destroy$ = new Subject<boolean>();
  public hasNonBrLicense: boolean;
  hasNonBrLicense$ = this.store.pipe(select(fromNavigationSelector.getHasNonBrLicenseCurrentVal));

  constructor(
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
  ) {
      try {
        this.hasNonBrLicense$.pipe(takeUntil(this.destroy$)).subscribe((hasNonBrLicense: boolean) => {
          this.hasNonBrLicense = hasNonBrLicense;
        });
      } catch (err) {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.CustomControlManagementComponent + blankSpace + Operations.AddIcons)));
      }
  }

  ngOnInit(): void {
  }

}
