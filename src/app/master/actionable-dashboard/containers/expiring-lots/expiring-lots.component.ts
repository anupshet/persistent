// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { cloneDeep, isEqual } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { unsubscribe } from '../../../../core/helpers/rxjs-helper';
import { ExpiringLotsService } from '../../services/expiring-lots.service';
import * as fromRoot from '../../../../state/app.state';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { ExpiredLots } from '../../../../contracts/models/actionable-dashboard/expired-lots.model';
import { ActionableItemType } from '../../../../contracts/models/actionable-dashboard/actionableItem.model';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import * as duplicateLotsActions from '../../../../shared/state/actions';

@Component({
  selector: 'unext-expiring-lots',
  templateUrl: './expiring-lots.component.html',
})
export class ExpiringLotsComponent implements OnInit, OnDestroy {

  @Output() hasDataToDisplay = new EventEmitter();

  expiredItems: Array<ExpiredLots> = [];
  expiredItemsOriginalList: Array<ExpiredLots> = [];
  accountId: string;
  locationId: string;
  groupedByDept: boolean;

  // Subscriptions
  public expiringProductLotSubscription: Subscription;

  public getAccountState$ = this.store.pipe(select(sharedStateSelector.getCurrentAccount));
  public getLocationState$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));
  private destroy$ = new Subject<boolean>();
  public getDuplicateNodeIds$ = this.store.pipe(select(sharedStateSelector.getDuplicateLotsIds));
  public duplicateNodeIds: Array<string>;

  constructor(
    private expiringLotsService: ExpiringLotsService,
    private store: Store<fromRoot.State>,
    private errorLoggerService: ErrorLoggerService,
    private dateTimeHelper: DateTimeHelper,
  ) {
  }

  ngOnInit() {
    this.reloadExpiredItemsList();

    this.getDuplicateNodeIds$.pipe(filter(_ids => !!_ids), takeUntil(this.destroy$))
      .subscribe((ids) => {
        if (!isEqual(this.duplicateNodeIds, ids)) {
          this.duplicateNodeIds = ids;
          this.reloadExpiredItemsList();
        }
      });

  }


  getExpiringProductLotV2(locationId: string, groupedByDept: boolean) {
    this.expiredItemsOriginalList = [];
    this.expiredItems = [];
    this.expiringProductLotSubscription
      = this.expiringLotsService.getExpiredLotsV2(locationId, groupedByDept).pipe(takeUntil(this.destroy$)).subscribe((lotList: Array<ExpiredLots>) => {
        try {
          lotList.forEach((item) => {
            // add ActionableItemType to the returned response
            item.actionableType = ActionableItemType.Product;
            item.isExpired = this.dateTimeHelper.isExpired(item.expirationDate);
          });
          this.expiredItemsOriginalList = lotList;
          this.expiredItems = cloneDeep(this.expiredItemsOriginalList);
        } catch (error) {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, error.stack, null,
              componentInfo.ExpiringLotsComponent + blankSpace + Operations.GetExpiringProducts));
        }
      });
  }

  hasDisplayData() {
    this.hasDataToDisplay.emit(this.expiredItems.length > 0);
  }

  reloadExpiredItemsList() {
    this.getLocationState$.pipe(filter(location => !!location), takeUntil(this.destroy$))
    .subscribe((locationState) => {
      this.locationId = locationState.id.toString();
      this.groupedByDept = locationState.locationSettings.instrumentsGroupedByDept;
      this.getExpiringProductLotV2(this.locationId, this.groupedByDept);
    });

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(duplicateLotsActions.LabConfigDuplicateLotsActions.ClearState());
    unsubscribe(this.expiringProductLotSubscription);
  }
}
