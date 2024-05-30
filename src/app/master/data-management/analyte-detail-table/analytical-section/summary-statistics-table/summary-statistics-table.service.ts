// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ApiService } from '../../../../../shared/api/api.service';
import * as fromRoot from '../../../../../state/app.state';
import * as fromAuth from '../../../../../shared/state/selectors';
import { SummaryStats } from '../../../../../contracts/models/data-management/summary-stats.model';
import { unApi } from '../../../../../core/config/constants/un-api-methods.const';
import { ConfigService } from '../../../../../core/config/config.service';
import { ApiConfig } from '../../../../../core/config/config.contract';
import { SpinnerService } from '../../../../../shared/services/spinner.service';

@Injectable()
export class SummaryStatisticsTableService extends ApiService implements OnDestroy {
  protected accountNumber: string;
  private destroy$ = new Subject<boolean>();

  constructor(
    http: HttpClient,
    config: ConfigService,
    store: ngrxStore.Store<fromRoot.State>,
    spinnerService: SpinnerService
  ) {
    super(http, config, store, spinnerService);
    this.apiUrl = (<ApiConfig>config.getConfig('api')).labDataUrl;
    store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), takeUntil(this.destroy$))
      .subscribe(authState => {
        this.accountNumber = authState.currentUser.accountNumber;
      });
  }

  getSummaryStatsByLabMonthStatsInfoAndDate(
    labTestId: string,
    labInstrumentId: string,
    testId: string,
    testSpecId: string | number,
    productMasterLotId: string,
    yearMonth: string,
    doNotshowBusy?: boolean
  ): Promise<SummaryStats> {


    // // TODO: remove this temporary code, once we start getting the UUID returned
    let todoLabInstrumentId: string;
    if (labInstrumentId.includes('-')) {
      todoLabInstrumentId = labInstrumentId;
    } else {
      todoLabInstrumentId = labInstrumentId.substring(0, 8) + '-' +
        labInstrumentId.substring(8, 12) + '-' +
        labInstrumentId.substring(12, 16) + '-' +
        labInstrumentId.substring(16, 20) + '-' +
        labInstrumentId.substring(20, 33);
      todoLabInstrumentId = todoLabInstrumentId.toLocaleLowerCase();
    }

    // TODO: replace todoLabInstrumentId with regular labInstrumentId when ready
    // AJT 06152022 bug fix UN7535 add spinner
    const labMonthStatsInfo = `${todoLabInstrumentId}_${testId}_${testSpecId}_${productMasterLotId}_${labTestId}`;
    const path = unApi.dataManagement.summaryStats
      .replace('{labMonthStatsInfo}', String(labMonthStatsInfo))
      .replace('{yearMonth}', yearMonth);
    return this.get<SummaryStats>(path, null, true).toPromise();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
